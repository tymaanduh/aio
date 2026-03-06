// Auto-generated C++ equivalent module proxy for main/services/runtime_log_service.js.
#include "../../_shared/repo_module_proxy.hpp"

#include <string>
#include <vector>

static constexpr const char* AIO_SOURCE_JS_FILE = "main/services/runtime_log_service.js";

namespace aio::repo_polyglot_equivalents::main::services::runtime_log_service {

inline const char* source_js_file() {
  return AIO_SOURCE_JS_FILE;
}

inline int run_source_entrypoint(const std::vector<std::string>& args = {}) {
  return aio::repo_module_proxy::run_entrypoint(source_js_file(), args);
}

inline int append_runtime_log(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "append_runtime_log", args_json);
}

inline int broadcast_runtime_log(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "broadcast_runtime_log", args_json);
}

inline int create_log_console_window(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "create_log_console_window", args_json);
}

inline int create_runtime_log_result(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "create_runtime_log_result", args_json);
}

inline int get_runtime_log_buffer(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "get_runtime_log_buffer", args_json);
}

inline int get_runtime_log_status(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "get_runtime_log_status", args_json);
}

inline int is_runtime_logs_enabled(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "is_runtime_logs_enabled", args_json);
}

inline int now_iso(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "now_iso", args_json);
}

inline int sanitize_runtime_log_entry(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "sanitize_runtime_log_entry", args_json);
}

inline int set_runtime_logs_enabled(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "set_runtime_logs_enabled", args_json);
}

}  // namespace aio::repo_polyglot_equivalents

int main(int argc, char** argv) {
  return aio::repo_module_proxy::dispatch_proxy_cli(AIO_SOURCE_JS_FILE, argc, argv);
}
