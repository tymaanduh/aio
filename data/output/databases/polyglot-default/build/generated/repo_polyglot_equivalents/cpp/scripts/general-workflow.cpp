// Auto-generated C++ equivalent module proxy for scripts/general-workflow.js.
#include "../_shared/repo_module_proxy.hpp"

#include <string>
#include <vector>

static constexpr const char* AIO_SOURCE_JS_FILE = "scripts/general-workflow.js";

namespace aio::repo_polyglot_equivalents::scripts::general_workflow {

inline const char* source_js_file() {
  return AIO_SOURCE_JS_FILE;
}

inline int run_source_entrypoint(const std::vector<std::string>& args = {}) {
  return aio::repo_module_proxy::run_entrypoint(source_js_file(), args);
}

inline int buildOutputFormatSummary(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "buildOutputFormatSummary", args_json);
}

inline int buildOutputFormatTargets(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "buildOutputFormatTargets", args_json);
}

inline int buildPipelineArgs(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "buildPipelineArgs", args_json);
}

inline int buildScriptRuntimeReport(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "buildScriptRuntimeReport", args_json);
}

inline int buildWorkflowSummary(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "buildWorkflowSummary", args_json);
}

inline int exitOnFailedStage(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "exitOnFailedStage", args_json);
}

inline int main(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "main", args_json);
}

inline int parseArgs(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "parseArgs", args_json);
}

inline int parseCommandSummary(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "parseCommandSummary", args_json);
}

inline int parseJsonFromCommandOutput(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "parseJsonFromCommandOutput", args_json);
}

inline int printHelpAndExit(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "printHelpAndExit", args_json);
}

inline int resolveMode(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "resolveMode", args_json);
}

inline int resolveNpxCommand(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "resolveNpxCommand", args_json);
}

inline int resolvePrettierCommand(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "resolvePrettierCommand", args_json);
}

inline int runAgentRegistryValidationStage(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "runAgentRegistryValidationStage", args_json);
}

inline int runCommand(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "runCommand", args_json);
}

inline int runEfficiencyStage(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "runEfficiencyStage", args_json);
}

inline int runHardGovernanceStage(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "runHardGovernanceStage", args_json);
}

inline int runOutputFormatStage(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "runOutputFormatStage", args_json);
}

inline int runPipelineStage(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "runPipelineStage", args_json);
}

inline int runPreflightStage(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "runPreflightStage", args_json);
}

inline int runPruneStage(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "runPruneStage", args_json);
}

inline int runRuntimeOptimizationBacklogStage(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "runRuntimeOptimizationBacklogStage", args_json);
}

inline int runSeparationAuditStage(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "runSeparationAuditStage", args_json);
}

inline int runSwappableScriptStage(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "runSwappableScriptStage", args_json);
}

inline int runUiuxBlueprintStage(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "runUiuxBlueprintStage", args_json);
}

inline int runWrapperContractStage(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "runWrapperContractStage", args_json);
}

inline int skippedStage(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "skippedStage", args_json);
}

inline int toRuntimeStageEntry(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "toRuntimeStageEntry", args_json);
}

inline int writeJsonSummary(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "writeJsonSummary", args_json);
}

inline int writeScriptRuntimeReport(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "writeScriptRuntimeReport", args_json);
}

}  // namespace aio::repo_polyglot_equivalents

int main(int argc, char** argv) {
  return aio::repo_module_proxy::dispatch_proxy_cli(AIO_SOURCE_JS_FILE, argc, argv);
}
