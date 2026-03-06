#pragma once

#include <cstdlib>
#include <filesystem>
#include <iostream>
#include <string>
#include <vector>

#ifdef _WIN32
#include <process.h>
#else
#include <sys/wait.h>
#endif

namespace aio::native_script_runtime {

inline std::filesystem::path find_repo_root(std::filesystem::path start) {
  std::filesystem::path current = std::filesystem::absolute(start);
  while (!current.empty()) {
    const auto packageFile = current / "package.json";
    const auto scriptsDir = current / "scripts";
    if (std::filesystem::exists(packageFile) && std::filesystem::exists(scriptsDir)) {
      return current;
    }
    if (current == current.root_path()) {
      break;
    }
    current = current.parent_path();
  }
  return {};
}

inline std::string quote_arg(const std::string& value) {
  std::string out;
  out.reserve(value.size() + 2);
  out.push_back('"');
  for (char ch : value) {
    if (ch == '\\' || ch == '"') {
      out.push_back('\\');
    }
    out.push_back(ch);
  }
  out.push_back('"');
  return out;
}

inline std::string resolve_python_exec() {
#ifdef _WIN32
  char* pythonExecEnv = nullptr;
  std::size_t envLength = 0;
  if (_dupenv_s(&pythonExecEnv, &envLength, "AIO_PYTHON_EXEC") == 0 && pythonExecEnv != nullptr) {
    std::string value = pythonExecEnv;
    std::free(pythonExecEnv);
    if (!value.empty()) {
      return value;
    }
  }
  if (pythonExecEnv != nullptr) {
    std::free(pythonExecEnv);
  }
#else
  const char* pythonExecEnv = std::getenv("AIO_PYTHON_EXEC");
  if (pythonExecEnv != nullptr && pythonExecEnv[0] != '\0') {
    return pythonExecEnv;
  }
#endif
  return "python";
}

inline int normalize_exit_status(int status) {
#ifdef _WIN32
  return status;
#else
  if (WIFEXITED(status)) {
    return WEXITSTATUS(status);
  }
  if (WIFSIGNALED(status)) {
    return 128 + WTERMSIG(status);
  }
  return status;
#endif
}

inline std::string normalize_slashes(std::string value) {
  for (char& ch : value) {
    if (ch == '\\') {
      ch = '/';
    }
  }
  return value;
}

inline std::string to_snake_case_base_name(const std::string& file_name) {
  std::string base = file_name;
  const std::string suffix = ".js";
  if (base.size() >= suffix.size() && base.substr(base.size() - suffix.size()) == suffix) {
    base = base.substr(0, base.size() - suffix.size());
  }
  for (char& ch : base) {
    if (ch == '-') {
      ch = '_';
    }
  }
  return base;
}

inline std::filesystem::path script_relative_to_python_relative(const std::string& script_relative_path, const std::string& extension = "py") {
  std::filesystem::path source = std::filesystem::path(normalize_slashes(script_relative_path));
  std::filesystem::path relative;
  auto iter = source.begin();
  if (iter != source.end() && iter->string() == "scripts") {
    ++iter;
  }
  for (; iter != source.end(); ++iter) {
    relative /= *iter;
  }
  if (relative.empty()) {
    return {};
  }
  const std::string file_name = relative.filename().string();
  relative.replace_filename(to_snake_case_base_name(file_name) + "." + extension);
  return relative;
}

inline std::filesystem::path resolve_python_equivalent_path(const std::filesystem::path& root, const std::string& script_relative_path) {
  const std::filesystem::path relative = script_relative_to_python_relative(script_relative_path, "py");
  return relative.empty() ? std::filesystem::path() : root / "scripts" / "polyglot" / "equivalents" / "python" / relative;
}

inline std::filesystem::path resolve_python_native_impl_path(const std::filesystem::path& root, const std::string& script_relative_path) {
  const std::filesystem::path relative = script_relative_to_python_relative(script_relative_path, "py");
  return relative.empty() ? std::filesystem::path() : root / "scripts" / "polyglot" / "equivalents" / "python" / "_native" / relative;
}

#ifdef _WIN32
inline int spawn_windows_python_script(
    const std::string& python_exec,
    const std::filesystem::path& python_script,
    int argc,
    char** argv) {
  std::vector<std::string> arguments;
  arguments.reserve(static_cast<std::size_t>(argc > 1 ? argc + 1 : 2));
  arguments.push_back(python_exec);
  arguments.push_back(python_script.string());
  for (int index = 1; index < argc; index += 1) {
    if (argv != nullptr && argv[index] != nullptr) {
      arguments.push_back(argv[index]);
    }
  }

  std::vector<const char*> rawArguments;
  rawArguments.reserve(arguments.size() + 1);
  for (const auto& argument : arguments) {
    rawArguments.push_back(argument.c_str());
  }
  rawArguments.push_back(nullptr);

  const intptr_t status = _spawnvp(_P_WAIT, python_exec.c_str(), rawArguments.data());
  if (status == -1) {
    return 1;
  }
  return static_cast<int>(status);
}
#endif

inline int run_python_script(
    const std::string& python_exec,
    const std::filesystem::path& python_script,
    int argc,
    char** argv) {
#ifdef _WIN32
  return spawn_windows_python_script(python_exec, python_script, argc, argv);
#else
  std::string command = quote_arg(python_exec) + " " + quote_arg(python_script.string());
  for (int index = 1; index < argc; index += 1) {
    command.append(" ");
    command.append(quote_arg(argv[index]));
  }

  const int status = std::system(command.c_str());
  if (status < 0) {
    return 1;
  }
  return normalize_exit_status(status);
#endif
}

inline std::filesystem::path resolve_python_script_target(const std::filesystem::path& root, const std::string& script_relative_path) {
  const std::filesystem::path nativeImpl = resolve_python_native_impl_path(root, script_relative_path);
  if (!nativeImpl.empty() && std::filesystem::exists(nativeImpl)) {
    return nativeImpl;
  }
  const std::filesystem::path pythonEquivalent = resolve_python_equivalent_path(root, script_relative_path);
  if (!pythonEquivalent.empty() && std::filesystem::exists(pythonEquivalent)) {
    return pythonEquivalent;
  }
  return {};
}

inline int run_native_script(const std::string& script_relative_path, int argc, char** argv) {
  const std::filesystem::path executablePath =
      (argc > 0 && argv != nullptr) ? std::filesystem::path(argv[0]) : std::filesystem::path(".");
  const std::filesystem::path root = find_repo_root(executablePath.parent_path());
  if (root.empty()) {
    std::cerr << "failed to locate repository root for generated C++ equivalent\n";
    return 1;
  }

  const std::filesystem::path pythonScriptTarget = resolve_python_script_target(root, script_relative_path);
  if (pythonScriptTarget.empty()) {
    std::cerr << "missing Python script target for generated C++ equivalent: " << script_relative_path << "\n";
    return 1;
  }

  const std::string pythonExec = resolve_python_exec();
  return run_python_script(pythonExec, pythonScriptTarget, argc, argv);
}

}  // namespace aio::native_script_runtime
