// Auto-generated C++ equivalent module proxy for brain/wrappers/renderer_selection_domain.js.
#include "../../_shared/repo_module_proxy.hpp"

#include <string>
#include <vector>

static constexpr const char* AIO_SOURCE_JS_FILE = "brain/wrappers/renderer_selection_domain.js";

namespace aio::repo_polyglot_equivalents::brain::wrappers::renderer_selection_domain {

inline const char* source_js_file() {
  return AIO_SOURCE_JS_FILE;
}

inline int run_source_entrypoint(const std::vector<std::string>& args = {}) {
  return aio::repo_module_proxy::run_entrypoint(source_js_file(), args);
}

inline int clearEntrySelections(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "clearEntrySelections", args_json);
}

inline int focusEntryWithoutUsage(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "focusEntryWithoutUsage", args_json);
}

inline int getEntryById(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "getEntryById", args_json);
}

inline int getGraphEntryIdSet(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "getGraphEntryIdSet", args_json);
}

inline int getSelectedEntries(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "getSelectedEntries", args_json);
}

inline int getVisibleTreeEntries(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "getVisibleTreeEntries", args_json);
}

inline int selectEntryRange(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "selectEntryRange", args_json);
}

inline int setSingleEntrySelection(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "setSingleEntrySelection", args_json);
}

inline int syncSelectionWithEntry(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "syncSelectionWithEntry", args_json);
}

inline int toggleEntrySelection(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "toggleEntrySelection", args_json);
}

}  // namespace aio::repo_polyglot_equivalents

int main(int argc, char** argv) {
  return aio::repo_module_proxy::dispatch_proxy_cli(AIO_SOURCE_JS_FILE, argc, argv);
}
