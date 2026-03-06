// Auto-generated C++ equivalent module proxy for main/normalize_language_bridge_domain.js.
#include "../_shared/repo_module_proxy.hpp"

#include <string>
#include <vector>

static constexpr const char* AIO_SOURCE_JS_FILE = "main/normalize_language_bridge_domain.js";

namespace aio::repo_polyglot_equivalents::main::normalize_language_bridge_domain {

inline const char* source_js_file() {
  return AIO_SOURCE_JS_FILE;
}

inline int run_source_entrypoint(const std::vector<std::string>& args = {}) {
  return aio::repo_module_proxy::run_entrypoint(source_js_file(), args);
}

inline int create_default_language_bridge_state(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "create_default_language_bridge_state", args_json);
}

inline int normalize_entry_links(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "normalize_entry_links", args_json);
}

inline int normalize_glossary(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "normalize_glossary", args_json);
}

inline int normalize_keyword_index(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "normalize_keyword_index", args_json);
}

inline int normalize_language_bridge_state(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "normalize_language_bridge_state", args_json);
}

inline int normalize_machine_descriptor_index(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "normalize_machine_descriptor_index", args_json);
}

inline int normalize_source_entry(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "normalize_source_entry", args_json);
}

inline int normalize_string_list(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "normalize_string_list", args_json);
}

inline int normalize_triad_map(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "normalize_triad_map", args_json);
}

}  // namespace aio::repo_polyglot_equivalents

int main(int argc, char** argv) {
  return aio::repo_module_proxy::dispatch_proxy_cli(AIO_SOURCE_JS_FILE, argc, argv);
}
