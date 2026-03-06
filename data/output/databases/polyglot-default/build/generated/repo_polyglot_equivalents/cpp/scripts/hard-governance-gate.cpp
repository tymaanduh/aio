// Auto-generated C++ equivalent module proxy for scripts/hard-governance-gate.js.
#include "../_shared/repo_module_proxy.hpp"

#include <string>
#include <vector>

static constexpr const char* AIO_SOURCE_JS_FILE = "scripts/hard-governance-gate.js";

namespace aio::repo_polyglot_equivalents::scripts::hard_governance_gate {

inline const char* source_js_file() {
  return AIO_SOURCE_JS_FILE;
}

inline int run_source_entrypoint(const std::vector<std::string>& args = {}) {
  return aio::repo_module_proxy::run_entrypoint(source_js_file(), args);
}

inline int analyze(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "analyze", args_json);
}

inline int analyzeAgents(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "analyzeAgents", args_json);
}

inline int analyzeAutomations(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "analyzeAutomations", args_json);
}

inline int analyzeRouting(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "analyzeRouting", args_json);
}

inline int buildFutureBlueprintMarkdown(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "buildFutureBlueprintMarkdown", args_json);
}

inline int buildRoadmapMarkdown(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "buildRoadmapMarkdown", args_json);
}

inline int buildSuggestions(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "buildSuggestions", args_json);
}

inline int checkRequiredStandardsCatalogs(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "checkRequiredStandardsCatalogs", args_json);
}

inline int checkRequiredWorkflowScripts(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "checkRequiredWorkflowScripts", args_json);
}

inline int estimateTokens(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "estimateTokens", args_json);
}

inline int issue(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "issue", args_json);
}

inline int main(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "main", args_json);
}

inline int normalizePathForOutput(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "normalizePathForOutput", args_json);
}

inline int normalizeText(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "normalizeText", args_json);
}

inline int parseArgs(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "parseArgs", args_json);
}

inline int parseRRule(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "parseRRule", args_json);
}

inline int readAutomations(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "readAutomations", args_json);
}

inline int readJson(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "readJson", args_json);
}

inline int readYaml(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "readYaml", args_json);
}

inline int runIsoStandardsComplianceSubcheck(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "runIsoStandardsComplianceSubcheck", args_json);
}

inline int runStandardsBaselineSubcheck(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "runStandardsBaselineSubcheck", args_json);
}

inline int runUiuxBlueprintSubcheck(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "runUiuxBlueprintSubcheck", args_json);
}

inline int runWorkflowPipelineOrderSubcheck(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "runWorkflowPipelineOrderSubcheck", args_json);
}

inline int writeOutputs(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "writeOutputs", args_json);
}

}  // namespace aio::repo_polyglot_equivalents

int main(int argc, char** argv) {
  return aio::repo_module_proxy::dispatch_proxy_cli(AIO_SOURCE_JS_FILE, argc, argv);
}
