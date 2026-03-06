// Auto-generated C++ equivalent module proxy for brain/modules/ui_preferences_utils.js.
#include "../../_shared/repo_module_proxy.hpp"

#include <string>
#include <vector>

static constexpr const char* AIO_SOURCE_JS_FILE = "brain/modules/ui_preferences_utils.js";

namespace aio::repo_polyglot_equivalents::brain::modules::ui_preferences_utils {

inline const char* source_js_file() {
  return AIO_SOURCE_JS_FILE;
}

inline int run_source_entrypoint(const std::vector<std::string>& args = {}) {
  return aio::repo_module_proxy::run_entrypoint(source_js_file(), args);
}

inline int cleanText(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "cleanText", args_json);
}

inline int createDefaultUiPreferences(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "createDefaultUiPreferences", args_json);
}

inline int normalizeUiPreferences(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "normalizeUiPreferences", args_json);
}

inline int normalizeUiTheme(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "normalizeUiTheme", args_json);
}

}  // namespace aio::repo_polyglot_equivalents

int main(int argc, char** argv) {
  return aio::repo_module_proxy::dispatch_proxy_cli(AIO_SOURCE_JS_FILE, argc, argv);
}
