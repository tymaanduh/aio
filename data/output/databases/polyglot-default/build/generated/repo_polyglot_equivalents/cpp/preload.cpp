// Auto-generated C++ equivalent module proxy for preload.js.
#include "_shared/repo_module_proxy.hpp"

#include <string>
#include <vector>

static constexpr const char* AIO_SOURCE_JS_FILE = "preload.js";

namespace aio::repo_polyglot_equivalents::preload {

inline const char* source_js_file() {
  return AIO_SOURCE_JS_FILE;
}

inline int run_source_entrypoint(const std::vector<std::string>& args = {}) {
  return aio::repo_module_proxy::run_entrypoint(source_js_file(), args);
}

inline int apply_flat_alias_methods(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "apply_flat_alias_methods", args_json);
}

inline int build_namespace_api(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "build_namespace_api", args_json);
}

inline int create_forward_method(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "create_forward_method", args_json);
}

inline int create_invoke_method(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "create_invoke_method", args_json);
}

inline int create_runtime_log_listener(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "create_runtime_log_listener", args_json);
}

inline int is_plain_object(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "is_plain_object", args_json);
}

inline int listener(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "listener", args_json);
}

inline int resolve_arg_normalizers(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "resolve_arg_normalizers", args_json);
}

inline int resolve_channel_by_key(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "resolve_channel_by_key", args_json);
}

inline int resolve_method_by_path(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "resolve_method_by_path", args_json);
}

inline int resolve_namespace_channels(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "resolve_namespace_channels", args_json);
}

}  // namespace aio::repo_polyglot_equivalents

int main(int argc, char** argv) {
  return aio::repo_module_proxy::dispatch_proxy_cli(AIO_SOURCE_JS_FILE, argc, argv);
}
