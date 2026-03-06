// Auto-generated C++ equivalent module proxy for scripts/generate-script-polyglot-equivalents.js.
#include "../_shared/repo_module_proxy.hpp"

#include <string>
#include <vector>

static constexpr const char* AIO_SOURCE_JS_FILE = "scripts/generate-script-polyglot-equivalents.js";

namespace aio::repo_polyglot_equivalents::scripts::generate_script_polyglot_equivalents {

inline const char* source_js_file() {
  return AIO_SOURCE_JS_FILE;
}

inline int run_source_entrypoint(const std::vector<std::string>& args = {}) {
  return aio::repo_module_proxy::run_entrypoint(source_js_file(), args);
}

inline int buildCatalog(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "buildCatalog", args_json);
}

inline int buildCppSharedRunnerContent(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "buildCppSharedRunnerContent", args_json);
}

inline int buildCppWrapperContent(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "buildCppWrapperContent", args_json);
}

inline int buildEquivalentTargets(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "buildEquivalentTargets", args_json);
}

inline int buildPythonSharedRunnerContent(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "buildPythonSharedRunnerContent", args_json);
}

inline int buildPythonWrapperContent(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "buildPythonWrapperContent", args_json);
}

inline int ensureDirForFile(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "ensureDirForFile", args_json);
}

inline int listGeneratedFiles(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "listGeneratedFiles", args_json);
}

inline int listScriptSourceFiles(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "listScriptSourceFiles", args_json);
}

inline int main(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "main", args_json);
}

inline int normalizeCatalogForComparison(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "normalizeCatalogForComparison", args_json);
}

inline int parseArgs(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "parseArgs", args_json);
}

inline int readText(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "readText", args_json);
}

inline int removeStaleGeneratedFiles(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "removeStaleGeneratedFiles", args_json);
}

inline int runCheck(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "runCheck", args_json);
}

inline int runWrite(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "runWrite", args_json);
}

inline int toPosix(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "toPosix", args_json);
}

inline int toSnakeCaseBaseName(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "toSnakeCaseBaseName", args_json);
}

inline int writeCatalog(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "writeCatalog", args_json);
}

inline int writeTargets(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "writeTargets", args_json);
}

}  // namespace aio::repo_polyglot_equivalents

int main(int argc, char** argv) {
  return aio::repo_module_proxy::dispatch_proxy_cli(AIO_SOURCE_JS_FILE, argc, argv);
}
