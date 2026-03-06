// Auto-generated C++ equivalent module proxy for scripts/codex-efficiency-audit.js.
#include "../_shared/repo_module_proxy.hpp"

#include <string>
#include <vector>

static constexpr const char* AIO_SOURCE_JS_FILE = "scripts/codex-efficiency-audit.js";

namespace aio::repo_polyglot_equivalents::scripts::codex_efficiency_audit {

inline const char* source_js_file() {
  return AIO_SOURCE_JS_FILE;
}

inline int run_source_entrypoint(const std::vector<std::string>& args = {}) {
  return aio::repo_module_proxy::run_entrypoint(source_js_file(), args);
}

inline int analyze(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "analyze", args_json);
}

inline int analyzeAutomationDir(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "analyzeAutomationDir", args_json);
}

inline int collectFilesRecursively(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "collectFilesRecursively", args_json);
}

inline int compareAgainstPreviousReport(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "compareAgainstPreviousReport", args_json);
}

inline int countWords(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "countWords", args_json);
}

inline int estimateTokens(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "estimateTokens", args_json);
}

inline int main(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "main", args_json);
}

inline int normalizeText(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "normalizeText", args_json);
}

inline int parseArgs(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "parseArgs", args_json);
}

inline int parseOpenAiPrompt(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "parseOpenAiPrompt", args_json);
}

inline int readJsonIfExists(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "readJsonIfExists", args_json);
}

inline int readText(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "readText", args_json);
}

inline int resolveNumber(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "resolveNumber", args_json);
}

inline int resolveThresholds(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "resolveThresholds", args_json);
}

inline int toFiniteNumber(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "toFiniteNumber", args_json);
}

}  // namespace aio::repo_polyglot_equivalents

int main(int argc, char** argv) {
  return aio::repo_module_proxy::dispatch_proxy_cli(AIO_SOURCE_JS_FILE, argc, argv);
}
