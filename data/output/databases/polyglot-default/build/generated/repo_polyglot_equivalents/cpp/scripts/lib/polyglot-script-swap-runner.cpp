// Auto-generated C++ equivalent module proxy for scripts/lib/polyglot-script-swap-runner.js.
#include "../../_shared/repo_module_proxy.hpp"

#include <string>
#include <vector>

static constexpr const char* AIO_SOURCE_JS_FILE = "scripts/lib/polyglot-script-swap-runner.js";

namespace aio::repo_polyglot_equivalents::scripts::lib::polyglot_script_swap_runner {

inline const char* source_js_file() {
  return AIO_SOURCE_JS_FILE;
}

inline int run_source_entrypoint(const std::vector<std::string>& args = {}) {
  return aio::repo_module_proxy::run_entrypoint(source_js_file(), args);
}

inline int append(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "append", args_json);
}

inline int commandExists(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "commandExists", args_json);
}

inline int detectPythonRuntime(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "detectPythonRuntime", args_json);
}

inline int includeScore(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "includeScore", args_json);
}

inline int loadBenchmarkWinnerMap(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "loadBenchmarkWinnerMap", args_json);
}

inline int loadCatalog(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "loadCatalog", args_json);
}

inline int parseLanguageOrderCsv(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "parseLanguageOrderCsv", args_json);
}

inline int parseTruthy(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "parseTruthy", args_json);
}

inline int readJsonFile(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "readJsonFile", args_json);
}

inline int resolveAdapter(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "resolveAdapter", args_json);
}

inline int resolveBenchmarkPreferredLanguage(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "resolveBenchmarkPreferredLanguage", args_json);
}

inline int resolveExecutionCommand(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "resolveExecutionCommand", args_json);
}

inline int resolveLanguageOrder(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "resolveLanguageOrder", args_json);
}

inline int resolveLanguageSelection(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "resolveLanguageSelection", args_json);
}

inline int resolveStagePolicy(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "resolveStagePolicy", args_json);
}

inline int resolveStageScriptPath(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "resolveStageScriptPath", args_json);
}

inline int runScriptWithSwaps(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "runScriptWithSwaps", args_json);
}

inline int toLanguageId(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "toLanguageId", args_json);
}

inline int toPathFromRoot(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "toPathFromRoot", args_json);
}

inline int toUniqueLanguageList(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "toUniqueLanguageList", args_json);
}

inline int toUniqueStringList(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "toUniqueStringList", args_json);
}

}  // namespace aio::repo_polyglot_equivalents

int main(int argc, char** argv) {
  return aio::repo_module_proxy::dispatch_proxy_cli(AIO_SOURCE_JS_FILE, argc, argv);
}
