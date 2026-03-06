// Auto-generated C++ equivalent module proxy for brain/wrappers/unified_io_wrapper.js.
#include "../../_shared/repo_module_proxy.hpp"

#include <string>
#include <vector>

static constexpr const char* AIO_SOURCE_JS_FILE = "brain/wrappers/unified_io_wrapper.js";

namespace aio::repo_polyglot_equivalents::brain::wrappers::unified_io_wrapper {

inline const char* source_js_file() {
  return AIO_SOURCE_JS_FILE;
}

inline int run_source_entrypoint(const std::vector<std::string>& args = {}) {
  return aio::repo_module_proxy::run_entrypoint(source_js_file(), args);
}

inline int attachRuntimeAliases(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "attachRuntimeAliases", args_json);
}

inline int build_pipeline_from_function_specs(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "build_pipeline_from_function_specs", args_json);
}

inline int build_pipeline_from_operation_ids(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "build_pipeline_from_operation_ids", args_json);
}

inline int buildAliasLookup(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "buildAliasLookup", args_json);
}

inline int buildFunctionSignatureIndexFromOperations(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "buildFunctionSignatureIndexFromOperations", args_json);
}

inline int buildTwoPassFailure(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "buildTwoPassFailure", args_json);
}

inline int buildTwoPassSuccess(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "buildTwoPassSuccess", args_json);
}

inline int collectCallArgsForStage(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "collectCallArgsForStage", args_json);
}

inline int create_default_function_registry(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "create_default_function_registry", args_json);
}

inline int create_runtime_io_reader(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "create_runtime_io_reader", args_json);
}

inline int create_runtime_io_stream(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "create_runtime_io_stream", args_json);
}

inline int create_runtime_io_writer(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "create_runtime_io_writer", args_json);
}

inline int create_unified_wrapper(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "create_unified_wrapper", args_json);
}

inline int create_unified_wrapper_catalog(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "create_unified_wrapper_catalog", args_json);
}

inline int createStageResult(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "createStageResult", args_json);
}

inline int ensureRuntimeGroup(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "ensureRuntimeGroup", args_json);
}

inline int ensureRuntimeMeta(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "ensureRuntimeMeta", args_json);
}

inline int execute_pipeline(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "execute_pipeline", args_json);
}

inline int identify_arguments(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "identify_arguments", args_json);
}

inline int initializeRuntimeBanks(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "initializeRuntimeBanks", args_json);
}

inline int isPlainObject(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "isPlainObject", args_json);
}

inline int loadDefaultSpec(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "loadDefaultSpec", args_json);
}

inline int loadNodeSpec(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "loadNodeSpec", args_json);
}

inline int loadRuntimeSpec(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "loadRuntimeSpec", args_json);
}

inline int normalize_runtime_io_stream(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "normalize_runtime_io_stream", args_json);
}

inline int normalize_stage_from_function_spec(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "normalize_stage_from_function_spec", args_json);
}

inline int normalizeAliasIndex(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "normalizeAliasIndex", args_json);
}

inline int normalizeFunctionSignatureIndex(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "normalizeFunctionSignatureIndex", args_json);
}

inline int normalizeGroupIndex(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "normalizeGroupIndex", args_json);
}

inline int normalizeInputArgs(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "normalizeInputArgs", args_json);
}

inline int normalizeLabelIndex(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "normalizeLabelIndex", args_json);
}

inline int normalizeOperationIndex(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "normalizeOperationIndex", args_json);
}

inline int normalizeOperationList(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "normalizeOperationList", args_json);
}

inline int normalizePipelineIndex(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "normalizePipelineIndex", args_json);
}

inline int normalizeRuntimeDefaults(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "normalizeRuntimeDefaults", args_json);
}

inline int normalizeText(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "normalizeText", args_json);
}

inline int normalizeWrapperIndex(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "normalizeWrapperIndex", args_json);
}

inline int nowIso(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "nowIso", args_json);
}

inline int read_symbol_value(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "read_symbol_value", args_json);
}

inline int recordPassExecute(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "recordPassExecute", args_json);
}

inline int recordPassIdentify(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "recordPassIdentify", args_json);
}

inline int resolve_operation_by_function_id(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "resolve_operation_by_function_id", args_json);
}

inline int resolveCanonicalSymbol(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "resolveCanonicalSymbol", args_json);
}

inline int resolveRuntimeGroupIds(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "resolveRuntimeGroupIds", args_json);
}

inline int resolveStageOperation(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "resolveStageOperation", args_json);
}

inline int run_auto_pipeline(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "run_auto_pipeline", args_json);
}

inline int run_pipeline_by_id(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "run_pipeline_by_id", args_json);
}

inline int run_two_pass(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "run_two_pass", args_json);
}

inline int run_two_pass_with_stream(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "run_two_pass_with_stream", args_json);
}

inline int toArray(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "toArray", args_json);
}

inline int toFiniteNumber(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "toFiniteNumber", args_json);
}

inline int toUniqueTextList(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "toUniqueTextList", args_json);
}

inline int write_symbol_value(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "write_symbol_value", args_json);
}

}  // namespace aio::repo_polyglot_equivalents

int main(int argc, char** argv) {
  return aio::repo_module_proxy::dispatch_proxy_cli(AIO_SOURCE_JS_FILE, argc, argv);
}
