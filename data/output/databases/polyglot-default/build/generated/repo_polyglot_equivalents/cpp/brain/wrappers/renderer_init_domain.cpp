// Auto-generated C++ equivalent module proxy for brain/wrappers/renderer_init_domain.js.
#include "../../_shared/repo_module_proxy.hpp"

#include <string>
#include <vector>

static constexpr const char* AIO_SOURCE_JS_FILE = "brain/wrappers/renderer_init_domain.js";

namespace aio::repo_polyglot_equivalents::brain::wrappers::renderer_init_domain {

inline const char* source_js_file() {
  return AIO_SOURCE_JS_FILE;
}

inline int run_source_entrypoint(const std::vector<std::string>& args = {}) {
  return aio::repo_module_proxy::run_entrypoint(source_js_file(), args);
}

inline int applyMotionPreference(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "applyMotionPreference", args_json);
}

inline int applyUiPreferences(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "applyUiPreferences", args_json);
}

inline int applyUiTheme(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "applyUiTheme", args_json);
}

inline int clearUiSettingsSaveTimer(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "clearUiSettingsSaveTimer", args_json);
}

inline int closeUiSettingsPopover(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "closeUiSettingsPopover", args_json);
}

inline int getNormalizedUiPreferences(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "getNormalizedUiPreferences", args_json);
}

inline int getUiSettingsFocusableElements(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "getUiSettingsFocusableElements", args_json);
}

inline int initializeStatsWorker(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "initializeStatsWorker", args_json);
}

inline int initializeUiMotion(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "initializeUiMotion", args_json);
}

inline int initializeUniverseWorker(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "initializeUniverseWorker", args_json);
}

inline int isMotionReduced(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "isMotionReduced", args_json);
}

inline int isSystemReducedMotionEnabled(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "isSystemReducedMotionEnabled", args_json);
}

inline int isUiSettingsPopoverOpen(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "isUiSettingsPopoverOpen", args_json);
}

inline int loadUiPreferencesFromDisk(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "loadUiPreferencesFromDisk", args_json);
}

inline int onLeave(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "onLeave", args_json);
}

inline int onMove(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "onMove", args_json);
}

inline int onPointer(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "onPointer", args_json);
}

inline int openUiSettingsPopover(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "openUiSettingsPopover", args_json);
}

inline int saveUiPreferencesNow(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "saveUiPreferencesNow", args_json);
}

inline int scheduleUiPreferencesSave(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "scheduleUiPreferencesSave", args_json);
}

inline int syncUiSettingsControls(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "syncUiSettingsControls", args_json);
}

inline int toggleUiSettingsPopover(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "toggleUiSettingsPopover", args_json);
}

inline int updateReduceMotionPreference(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "updateReduceMotionPreference", args_json);
}

inline int updateUiThemePreference(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "updateUiThemePreference", args_json);
}

}  // namespace aio::repo_polyglot_equivalents

int main(int argc, char** argv) {
  return aio::repo_module_proxy::dispatch_proxy_cli(AIO_SOURCE_JS_FILE, argc, argv);
}
