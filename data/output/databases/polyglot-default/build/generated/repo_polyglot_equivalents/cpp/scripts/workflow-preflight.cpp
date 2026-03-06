// Auto-generated C++ equivalent module proxy for scripts/workflow-preflight.js.
#include "../_shared/repo_module_proxy.hpp"

#include <string>
#include <vector>

static constexpr const char* AIO_SOURCE_JS_FILE = "scripts/workflow-preflight.js";

namespace aio::repo_polyglot_equivalents::scripts::workflow_preflight {

inline const char* source_js_file() {
  return AIO_SOURCE_JS_FILE;
}

inline int run_source_entrypoint(const std::vector<std::string>& args = {}) {
  return aio::repo_module_proxy::run_entrypoint(source_js_file(), args);
}

inline int buildReport(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "buildReport", args_json);
}

inline int checkHardGovernanceGate(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "checkHardGovernanceGate", args_json);
}

inline int checkRequiredFiles(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "checkRequiredFiles", args_json);
}

inline int checkRequiredJson(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "checkRequiredJson", args_json);
}

inline int checkRoutingKeywordConflicts(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "checkRoutingKeywordConflicts", args_json);
}

inline int checkScriptSwapCatalog(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "checkScriptSwapCatalog", args_json);
}

inline int checkShellShebangLineEndings(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "checkShellShebangLineEndings", args_json);
}

inline int checkWorkflowOrderGate(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "checkWorkflowOrderGate", args_json);
}

inline int checkWorkflowShards(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "checkWorkflowShards", args_json);
}

inline int collectUnmergedFiles(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "collectUnmergedFiles", args_json);
}

inline int ensureParentDir(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "ensureParentDir", args_json);
}

inline int listTextFiles(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "listTextFiles", args_json);
}

inline int main(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "main", args_json);
}

inline int parseArgs(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "parseArgs", args_json);
}

inline int runSwappableCheck(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "runSwappableCheck", args_json);
}

inline int scanConflictMarkers(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "scanConflictMarkers", args_json);
}

}  // namespace aio::repo_polyglot_equivalents

int main(int argc, char** argv) {
  return aio::repo_module_proxy::dispatch_proxy_cli(AIO_SOURCE_JS_FILE, argc, argv);
}
