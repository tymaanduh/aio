// Auto-generated C++ equivalent module proxy for brain/wrappers/renderer_ui_shell_domain.js.
#include "../../_shared/repo_module_proxy.hpp"

#include <string>
#include <vector>

static constexpr const char* AIO_SOURCE_JS_FILE = "brain/wrappers/renderer_ui_shell_domain.js";

namespace aio::repo_polyglot_equivalents::brain::wrappers::renderer_ui_shell_domain {

inline const char* source_js_file() {
  return AIO_SOURCE_JS_FILE;
}

inline int run_source_entrypoint(const std::vector<std::string>& args = {}) {
  return aio::repo_module_proxy::run_entrypoint(source_js_file(), args);
}

inline int formatSaved(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "formatSaved", args_json);
}

inline int getAuthCredentials(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "getAuthCredentials", args_json);
}

inline int isAuthGateVisible(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "isAuthGateVisible", args_json);
}

inline int isElementVisibleForInteraction(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "isElementVisibleForInteraction", args_json);
}

inline int normalizeExplorerLayoutMode(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "normalizeExplorerLayoutMode", args_json);
}

inline int resolvePreferredEntryLabel(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "resolvePreferredEntryLabel", args_json);
}

inline int setAuthGateVisible(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "setAuthGateVisible", args_json);
}

inline int setAuthHint(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "setAuthHint", args_json);
}

inline int setAuthMode(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "setAuthMode", args_json);
}

inline int setExplorerLayoutMode(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "setExplorerLayoutMode", args_json);
}

inline int setHelperText(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "setHelperText", args_json);
}

inline int setStatus(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "setStatus", args_json);
}

inline int setTreeFolderSelection(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "setTreeFolderSelection", args_json);
}

inline int syncExplorerLayoutControls(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "syncExplorerLayoutControls", args_json);
}

}  // namespace aio::repo_polyglot_equivalents

int main(int argc, char** argv) {
  return aio::repo_module_proxy::dispatch_proxy_cli(AIO_SOURCE_JS_FILE, argc, argv);
}
