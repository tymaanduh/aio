// Auto-generated C++ equivalent module proxy for brain/wrappers/renderer_statistics_domain.js.
#include "../../_shared/repo_module_proxy.hpp"

#include <string>
#include <vector>

static constexpr const char* AIO_SOURCE_JS_FILE = "brain/wrappers/renderer_statistics_domain.js";

namespace aio::repo_polyglot_equivalents::brain::wrappers::renderer_statistics_domain {

inline const char* source_js_file() {
  return AIO_SOURCE_JS_FILE;
}

inline int run_source_entrypoint(const std::vector<std::string>& args = {}) {
  return aio::repo_module_proxy::run_entrypoint(source_js_file(), args);
}

inline int buildStatisticsModelSync(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "buildStatisticsModelSync", args_json);
}

inline int getEntryUsageScore(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "getEntryUsageScore", args_json);
}

inline int getStatisticsModel(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "getStatisticsModel", args_json);
}

inline int getStatsModelKey(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "getStatsModelKey", args_json);
}

inline int invalidateStatisticsCache(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "invalidateStatisticsCache", args_json);
}

inline int renderStatisticsView(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "renderStatisticsView", args_json);
}

inline int requestStatsWorkerComputeNow(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "requestStatsWorkerComputeNow", args_json);
}

inline int scheduleStatsWorkerCompute(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "scheduleStatsWorkerCompute", args_json);
}

}  // namespace aio::repo_polyglot_equivalents

int main(int argc, char** argv) {
  return aio::repo_module_proxy::dispatch_proxy_cli(AIO_SOURCE_JS_FILE, argc, argv);
}
