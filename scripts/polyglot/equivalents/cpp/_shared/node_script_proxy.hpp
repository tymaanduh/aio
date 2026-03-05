#pragma once

#include <cstdlib>
#include <filesystem>
#include <iostream>
#include <string>

#ifndef _WIN32
#include <sys/wait.h>
#endif

namespace aio::script_proxy {

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

inline int run_node_script(const std::string& script_relative_path, int argc, char** argv) {
  const std::filesystem::path executablePath =
      (argc > 0 && argv != nullptr) ? std::filesystem::path(argv[0]) : std::filesystem::path(".");
  const std::filesystem::path root = find_repo_root(executablePath.parent_path());
  if (root.empty()) {
    std::cerr << "failed to locate repository root for generated script equivalent\n";
    return 1;
  }

  const std::filesystem::path scriptPath = root / std::filesystem::path(script_relative_path);
  if (!std::filesystem::exists(scriptPath)) {
    std::cerr << "missing script target: " << scriptPath.string() << "\n";
    return 1;
  }

  const char* nodeExecEnv = std::getenv("AIO_NODE_EXEC");
  const std::string nodeExec = (nodeExecEnv != nullptr && nodeExecEnv[0] != '\0') ? nodeExecEnv : "node";
  std::string command = quote_arg(nodeExec) + " " + quote_arg(scriptPath.string());
  for (int index = 1; index < argc; index += 1) {
    command.append(" ");
    command.append(quote_arg(argv[index]));
  }

  const int status = std::system(command.c_str());
  if (status < 0) {
    return 1;
  }
  return normalize_exit_status(status);
}

}  // namespace aio::script_proxy
