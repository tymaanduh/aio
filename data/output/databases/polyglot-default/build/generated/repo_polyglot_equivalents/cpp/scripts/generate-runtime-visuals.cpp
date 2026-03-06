// Auto-generated C++ equivalent module proxy for scripts/generate-runtime-visuals.js.
#include "../_shared/repo_module_proxy.hpp"

#include <string>
#include <vector>

static constexpr const char* AIO_SOURCE_JS_FILE = "scripts/generate-runtime-visuals.js";

namespace aio::repo_polyglot_equivalents::scripts::generate_runtime_visuals {

inline const char* source_js_file() {
  return AIO_SOURCE_JS_FILE;
}

inline int run_source_entrypoint(const std::vector<std::string>& args = {}) {
  return aio::repo_module_proxy::run_entrypoint(source_js_file(), args);
}

inline int barWidthFor(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "barWidthFor", args_json);
}

inline int buildDashboardMarkdown(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "buildDashboardMarkdown", args_json);
}

inline int buildFeatureUpdateFootprintSvg(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "buildFeatureUpdateFootprintSvg", args_json);
}

inline int buildHorizontalBarChartSvg(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "buildHorizontalBarChartSvg", args_json);
}

inline int buildLanguageCoverageSvg(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "buildLanguageCoverageSvg", args_json);
}

inline int buildStageTimelineSvg(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "buildStageTimelineSvg", args_json);
}

inline int buildTokenOptimizationProgressSvg(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "buildTokenOptimizationProgressSvg", args_json);
}

inline int buildTokenOptimizationSnapshot(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "buildTokenOptimizationSnapshot", args_json);
}

inline int buildTrendHistory(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "buildTrendHistory", args_json);
}

inline int buildWeeklyProgressTrendSvg(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "buildWeeklyProgressTrendSvg", args_json);
}

inline int buildWeeklyTrendRows(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "buildWeeklyTrendRows", args_json);
}

inline int classifyChangedFile(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "classifyChangedFile", args_json);
}

inline int colorForLanguage(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "colorForLanguage", args_json);
}

inline int computeFeatureUpdateCounts(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "computeFeatureUpdateCounts", args_json);
}

inline int computeRanking(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "computeRanking", args_json);
}

inline int computeStageDurations(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "computeStageDurations", args_json);
}

inline int dateKeyFromIso(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "dateKeyFromIso", args_json);
}

inline int escapeXml(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "escapeXml", args_json);
}

inline int formatMs(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "formatMs", args_json);
}

inline int generate(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "generate", args_json);
}

inline int main(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "main", args_json);
}

inline int normalizePath(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "normalizePath", args_json);
}

inline int number(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "number", args_json);
}

inline int parseArgs(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "parseArgs", args_json);
}

inline int readJsonIfExists(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "readJsonIfExists", args_json);
}

inline int toHistoryEntry(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "toHistoryEntry", args_json);
}

inline int xFor(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "xFor", args_json);
}

inline int yCumulative(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "yCumulative", args_json);
}

inline int yDuration(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "yDuration", args_json);
}

inline int yFeatures(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "yFeatures", args_json);
}

inline int yTokens(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "yTokens", args_json);
}

}  // namespace aio::repo_polyglot_equivalents

int main(int argc, char** argv) {
  return aio::repo_module_proxy::dispatch_proxy_cli(AIO_SOURCE_JS_FILE, argc, argv);
}
