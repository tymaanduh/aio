#pragma once

#include <cstdlib>
#include <ctime>
#include <filesystem>
#include <fstream>
#include <iostream>
#include <sstream>
#include <string>
#include <system_error>
#include <vector>

#ifndef _WIN32
#include <sys/wait.h>
#endif

namespace aio::repo_module_proxy {

inline std::filesystem::path find_repo_root(std::filesystem::path start) {
  std::filesystem::path current = std::filesystem::absolute(start);
  while (!current.empty()) {
    const auto package_file = current / "package.json";
    const auto scripts_dir = current / "scripts";
    if (std::filesystem::exists(package_file) && std::filesystem::exists(scripts_dir)) {
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

inline std::string json_escape(const std::string& value) {
  std::string out;
  out.reserve(value.size() + 8);
  for (char ch : value) {
    switch (ch) {
      case '\\': out.append("\\\\"); break;
      case '"': out.append("\\\""); break;
      case '\n': out.append("\\n"); break;
      case '\r': out.append("\\r"); break;
      case '\t': out.append("\\t"); break;
      default: out.push_back(ch); break;
    }
  }
  return out;
}

inline std::string json_string_array(const std::vector<std::string>& values) {
  std::ostringstream out;
  out << "[";
  for (size_t index = 0; index < values.size(); index += 1) {
    if (index > 0) {
      out << ",";
    }
    out << '"' << json_escape(values[index]) << '"';
  }
  out << "]";
  return out.str();
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

inline std::string build_invoke_payload(
    const std::string& source_js_file,
    const std::string& function_name,
    const std::string& args_json) {
  std::ostringstream out;
  out << "{"
      << "\"action\":\"invoke_function\","
      << "\"source_js_file\":\"" << json_escape(source_js_file) << "\","
      << "\"function_name\":\"" << json_escape(function_name) << "\","
      << "\"args\":" << (args_json.empty() ? "[]" : args_json) << ","
      << "\"kwargs\":{}"
      << "}";
  return out.str();
}

inline std::string build_entrypoint_payload(
    const std::string& source_js_file,
    const std::vector<std::string>& args) {
  std::ostringstream out;
  out << "{"
      << "\"action\":\"run_entrypoint\","
      << "\"source_js_file\":\"" << json_escape(source_js_file) << "\","
      << "\"args\":" << json_string_array(args)
      << "}";
  return out.str();
}

inline int run_bridge_payload(const std::string& payload_json) {
  const std::filesystem::path root = find_repo_root(std::filesystem::current_path());
  if (root.empty()) {
    std::cerr << "failed to locate repository root for repo module proxy\n";
    return 1;
  }

  const std::filesystem::path bridge_script = root / "scripts" / "repo-polyglot-module-bridge.js";
  if (!std::filesystem::exists(bridge_script)) {
    std::cerr << "missing bridge script: " << bridge_script.string() << "\n";
    return 1;
  }

  const auto stamp = static_cast<unsigned long long>(std::time(nullptr));
  const std::filesystem::path payload_file =
      std::filesystem::temp_directory_path() / ("aio_repo_polyglot_payload_" + std::to_string(stamp) + "_" + std::to_string(std::rand()) + ".json");

  {
    std::ofstream stream(payload_file, std::ios::binary | std::ios::trunc);
    if (!stream.good()) {
      std::cerr << "failed to write payload file for repo module proxy\n";
      return 1;
    }
    stream << payload_json;
  }

  const char* node_exec_env = std::getenv("AIO_NODE_EXEC");
  const std::string node_exec = (node_exec_env != nullptr && node_exec_env[0] != '\0') ? node_exec_env : "node";
  const std::string command = quote_arg(node_exec) + " " + quote_arg(bridge_script.string()) +
      " --payload-file " + quote_arg(payload_file.string());

  const int status = std::system(command.c_str());
  std::error_code error_code;
  std::filesystem::remove(payload_file, error_code);
  if (status < 0) {
    return 1;
  }
  return normalize_exit_status(status);
}

inline int run_invoke_function(
    const std::string& source_js_file,
    const std::string& function_name,
    const std::string& args_json = "[]") {
  return run_bridge_payload(build_invoke_payload(source_js_file, function_name, args_json));
}

inline int run_entrypoint(
    const std::string& source_js_file,
    const std::vector<std::string>& args = {}) {
  return run_bridge_payload(build_entrypoint_payload(source_js_file, args));
}

inline int dispatch_proxy_cli(const std::string& source_js_file, int argc, char** argv) {
  std::string function_name;
  std::string args_json = "[]";
  std::vector<std::string> passthrough_args;
  for (int index = 1; index < argc; index += 1) {
    const std::string token = argv[index] ? argv[index] : "";
    if (token == "--function") {
      if (index + 1 >= argc) {
        std::cerr << "--function requires a value\n";
        return 2;
      }
      function_name = argv[index + 1] ? argv[index + 1] : "";
      index += 1;
      continue;
    }
    if (token == "--args-json") {
      if (index + 1 >= argc) {
        std::cerr << "--args-json requires a value\n";
        return 2;
      }
      args_json = argv[index + 1] ? argv[index + 1] : "[]";
      index += 1;
      continue;
    }
    passthrough_args.push_back(token);
  }
  if (!function_name.empty()) {
    return run_invoke_function(source_js_file, function_name, args_json);
  }
  return run_entrypoint(source_js_file, passthrough_args);
}

}  // namespace aio::repo_module_proxy
