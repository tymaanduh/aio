// Auto-generated C++ equivalent module proxy for renderer/core/text_dictionary.js.
#include "../../_shared/repo_module_proxy.hpp"

#include <string>
#include <vector>

static constexpr const char* AIO_SOURCE_JS_FILE = "renderer/core/text_dictionary.js";

namespace aio::repo_polyglot_equivalents::renderer::core::text_dictionary {

inline const char* source_js_file() {
  return AIO_SOURCE_JS_FILE;
}

inline int run_source_entrypoint(const std::vector<std::string>& args = {}) {
  return aio::repo_module_proxy::run_entrypoint(source_js_file(), args);
}

inline int clean_text(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "clean_text", args_json);
}

inline int normalize_key(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "normalize_key", args_json);
}

inline int normalize_token(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "normalize_token", args_json);
}

inline int text_desc(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "text_desc", args_json);
}

inline int text_hook_key(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "text_hook_key", args_json);
}

inline int text_join(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "text_join", args_json);
}

inline int text_list(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "text_list", args_json);
}

inline int text_path(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "text_path", args_json);
}

inline int text_path_list(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "text_path_list", args_json);
}

inline int text_tags(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "text_tags", args_json);
}

inline int text_token(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "text_token", args_json);
}

inline int to_hook_key_token(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "to_hook_key_token", args_json);
}

inline int unique_text_list(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "unique_text_list", args_json);
}

}  // namespace aio::repo_polyglot_equivalents

int main(int argc, char** argv) {
  return aio::repo_module_proxy::dispatch_proxy_cli(AIO_SOURCE_JS_FILE, argc, argv);
}
