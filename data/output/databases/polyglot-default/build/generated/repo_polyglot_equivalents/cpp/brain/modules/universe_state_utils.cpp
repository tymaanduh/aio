// Auto-generated C++ equivalent module proxy for brain/modules/universe_state_utils.js.
#include "../../_shared/repo_module_proxy.hpp"

#include <string>
#include <vector>

static constexpr const char* AIO_SOURCE_JS_FILE = "brain/modules/universe_state_utils.js";

namespace aio::repo_polyglot_equivalents::brain::modules::universe_state_utils {

inline const char* source_js_file() {
  return AIO_SOURCE_JS_FILE;
}

inline int run_source_entrypoint(const std::vector<std::string>& args = {}) {
  return aio::repo_module_proxy::run_entrypoint(source_js_file(), args);
}

inline int clampNumber(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "clampNumber", args_json);
}

inline int cleanText(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "cleanText", args_json);
}

inline int createDefaultUniverseConfig(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "createDefaultUniverseConfig", args_json);
}

inline int createEmptyUniverseGraph(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "createEmptyUniverseGraph", args_json);
}

inline int createFallbackId(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "createFallbackId", args_json);
}

inline int createUniverseStateTools(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "createUniverseStateTools", args_json);
}

inline int getUniverseDatasetSignature(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "getUniverseDatasetSignature", args_json);
}

inline int inferQuestionBucketFromLabels(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "inferQuestionBucketFromLabels", args_json);
}

inline int normalizeConfig(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "normalizeConfig", args_json);
}

inline int normalizeEntryMode(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "normalizeEntryMode", args_json);
}

inline int normalizeLabelArray(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "normalizeLabelArray", args_json);
}

inline int normalizeUniverseBookmark(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "normalizeUniverseBookmark", args_json);
}

inline int normalizeUniverseCustomSearchSet(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "normalizeUniverseCustomSearchSet", args_json);
}

inline int normalizeUniverseCustomSearchSets(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "normalizeUniverseCustomSearchSets", args_json);
}

inline int normalizeUniverseGraph(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "normalizeUniverseGraph", args_json);
}

inline int normalizeWordLower(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "normalizeWordLower", args_json);
}

inline int unique(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "unique", args_json);
}

}  // namespace aio::repo_polyglot_equivalents

int main(int argc, char** argv) {
  return aio::repo_module_proxy::dispatch_proxy_cli(AIO_SOURCE_JS_FILE, argc, argv);
}
