// Auto-generated C++ equivalent module proxy for renderer/boot/app_bootstrap.js.
#include "../../_shared/repo_module_proxy.hpp"

#include <string>
#include <vector>

static constexpr const char* AIO_SOURCE_JS_FILE = "renderer/boot/app_bootstrap.js";

namespace aio::repo_polyglot_equivalents::renderer::boot::app_bootstrap {

inline const char* source_js_file() {
  return AIO_SOURCE_JS_FILE;
}

inline int run_source_entrypoint(const std::vector<std::string>& args = {}) {
  return aio::repo_module_proxy::run_entrypoint(source_js_file(), args);
}

inline int append_hook_trace(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "append_hook_trace", args_json);
}

inline int publish_renderer_ctx(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "publish_renderer_ctx", args_json);
}

inline int run_post_load_bindings(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "run_post_load_bindings", args_json);
}

inline int run_pre_load_bindings(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "run_pre_load_bindings", args_json);
}

inline int run_renderer_app_bootstrap(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "run_renderer_app_bootstrap", args_json);
}

inline int sync_renderer_hook_ctx(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "sync_renderer_hook_ctx", args_json);
}

inline int to_shell_scope(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "to_shell_scope", args_json);
}

}  // namespace aio::repo_polyglot_equivalents

int main(int argc, char** argv) {
  return aio::repo_module_proxy::dispatch_proxy_cli(AIO_SOURCE_JS_FILE, argc, argv);
}
