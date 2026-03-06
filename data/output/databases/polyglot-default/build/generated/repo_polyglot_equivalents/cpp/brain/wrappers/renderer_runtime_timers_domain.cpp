// Auto-generated C++ equivalent module proxy for brain/wrappers/renderer_runtime_timers_domain.js.
#include "../../_shared/repo_module_proxy.hpp"

#include <string>
#include <vector>

static constexpr const char* AIO_SOURCE_JS_FILE = "brain/wrappers/renderer_runtime_timers_domain.js";

namespace aio::repo_polyglot_equivalents::brain::wrappers::renderer_runtime_timers_domain {

inline const char* source_js_file() {
  return AIO_SOURCE_JS_FILE;
}

inline int run_source_entrypoint(const std::vector<std::string>& args = {}) {
  return aio::repo_module_proxy::run_entrypoint(source_js_file(), args);
}

inline int clearAutosaveTimer(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "clearAutosaveTimer", args_json);
}

inline int clearEntryCommitTimer(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "clearEntryCommitTimer", args_json);
}

inline int clearLookupTimer(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "clearLookupTimer", args_json);
}

inline int clearStatsWorkerTimer(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "clearStatsWorkerTimer", args_json);
}

inline int clearTreeSearchTimer(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "clearTreeSearchTimer", args_json);
}

inline int clearUniverseBuildTimer(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "clearUniverseBuildTimer", args_json);
}

inline int clearUniverseCacheSaveTimer(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "clearUniverseCacheSaveTimer", args_json);
}

inline int scheduleGraphBuild(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "scheduleGraphBuild", args_json);
}

inline int scheduleIndexWarmup(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "scheduleIndexWarmup", args_json);
}

}  // namespace aio::repo_polyglot_equivalents

int main(int argc, char** argv) {
  return aio::repo_module_proxy::dispatch_proxy_cli(AIO_SOURCE_JS_FILE, argc, argv);
}
