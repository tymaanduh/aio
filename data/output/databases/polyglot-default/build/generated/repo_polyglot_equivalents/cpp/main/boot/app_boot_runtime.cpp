// Auto-generated C++ equivalent module proxy for main/boot/app_boot_runtime.js.
#include "../../_shared/repo_module_proxy.hpp"

#include <string>
#include <vector>

static constexpr const char* AIO_SOURCE_JS_FILE = "main/boot/app_boot_runtime.js";

namespace aio::repo_polyglot_equivalents::main::boot::app_boot_runtime {

inline const char* source_js_file() {
  return AIO_SOURCE_JS_FILE;
}

inline int run_source_entrypoint(const std::vector<std::string>& args = {}) {
  return aio::repo_module_proxy::run_entrypoint(source_js_file(), args);
}

inline int bind_app_lifecycle_hooks(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "bind_app_lifecycle_hooks", args_json);
}

inline int bind_runtime_error_hooks(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "bind_runtime_error_hooks", args_json);
}

inline int create_and_show_main_window(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "create_and_show_main_window", args_json);
}

inline int create_app_boot_runtime(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "create_app_boot_runtime", args_json);
}

inline int log_app_ready_diagnostics(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "log_app_ready_diagnostics", args_json);
}

inline int log_runtime(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "log_runtime", args_json);
}

inline int maybe_recover_from_gpu_crash(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "maybe_recover_from_gpu_crash", args_json);
}

inline int open_log_console_if_requested(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "open_log_console_if_requested", args_json);
}

inline int run_window_lifecycle_wrapper(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "run_window_lifecycle_wrapper", args_json);
}

}  // namespace aio::repo_polyglot_equivalents

int main(int argc, char** argv) {
  return aio::repo_module_proxy::dispatch_proxy_cli(AIO_SOURCE_JS_FILE, argc, argv);
}
