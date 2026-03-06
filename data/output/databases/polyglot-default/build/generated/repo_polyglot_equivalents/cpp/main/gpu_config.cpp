// Auto-generated C++ equivalent module proxy for main/gpu_config.js.
#include "../_shared/repo_module_proxy.hpp"

#include <string>
#include <vector>

static constexpr const char* AIO_SOURCE_JS_FILE = "main/gpu_config.js";

namespace aio::repo_polyglot_equivalents::main::gpu_config {

inline const char* source_js_file() {
  return AIO_SOURCE_JS_FILE;
}

inline int run_source_entrypoint(const std::vector<std::string>& args = {}) {
  return aio::repo_module_proxy::run_entrypoint(source_js_file(), args);
}

inline int append_gpu_switch(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "append_gpu_switch", args_json);
}

inline int apply_gpu_disabled_state(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "apply_gpu_disabled_state", args_json);
}

inline int configure_gpu_performance_switches(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "configure_gpu_performance_switches", args_json);
}

inline int configure_non_windows_gpu_switches(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "configure_non_windows_gpu_switches", args_json);
}

inline int configure_windows_gpu_switches(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "configure_windows_gpu_switches", args_json);
}

inline int configureGpuMode(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "configureGpuMode", args_json);
}

inline int disable_hardware_acceleration(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "disable_hardware_acceleration", args_json);
}

inline int getGpuDiagnostics(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "getGpuDiagnostics", args_json);
}

inline int getGpuState(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "getGpuState", args_json);
}

inline int incrementGpuCrashCount(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "incrementGpuCrashCount", args_json);
}

inline int normalize_gpu_token(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "normalize_gpu_token", args_json);
}

inline int normalizeOptionalToken(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "normalizeOptionalToken", args_json);
}

}  // namespace aio::repo_polyglot_equivalents

int main(int argc, char** argv) {
  return aio::repo_module_proxy::dispatch_proxy_cli(AIO_SOURCE_JS_FILE, argc, argv);
}
