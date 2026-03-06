// Auto-generated C++ equivalent module proxy for brain/modules/renderer_text_utils.js.
#include "../../_shared/repo_module_proxy.hpp"

#include <string>
#include <vector>

static constexpr const char* AIO_SOURCE_JS_FILE = "brain/modules/renderer_text_utils.js";

namespace aio::repo_polyglot_equivalents::brain::modules::renderer_text_utils {

inline const char* source_js_file() {
  return AIO_SOURCE_JS_FILE;
}

inline int run_source_entrypoint(const std::vector<std::string>& args = {}) {
  return aio::repo_module_proxy::run_entrypoint(source_js_file(), args);
}

inline int cleanText(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "cleanText", args_json);
}

inline int collectRuleLabels(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "collectRuleLabels", args_json);
}

inline int createRendererTextUtils(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "createRendererTextUtils", args_json);
}

inline int detectPosConflicts(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "detectPosConflicts", args_json);
}

inline int getBytesWarningText(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "getBytesWarningText", args_json);
}

inline int hasPatternMatch(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "hasPatternMatch", args_json);
}

inline int inferLabelsFromDefinition(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "inferLabelsFromDefinition", args_json);
}

inline int inferQuestionLabelsFromDefinition(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "inferQuestionLabelsFromDefinition", args_json);
}

inline int isBytesMode(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "isBytesMode", args_json);
}

inline int isBytesPayloadLike(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "isBytesPayloadLike", args_json);
}

inline int isCodeLikeMode(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "isCodeLikeMode", args_json);
}

inline int isPartOfSpeechLabel(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "isPartOfSpeechLabel", args_json);
}

inline int keyForCategory(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "keyForCategory", args_json);
}

inline int keyForLabel(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "keyForLabel", args_json);
}

inline int normalizeEntryLanguage(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "normalizeEntryLanguage", args_json);
}

inline int normalizeEntryMode(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "normalizeEntryMode", args_json);
}

inline int normalizeLabel(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "normalizeLabel", args_json);
}

inline int normalizeLabelArray(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "normalizeLabelArray", args_json);
}

inline int normalizeWordLower(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "normalizeWordLower", args_json);
}

inline int nowIso(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "nowIso", args_json);
}

inline int parseLabels(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "parseLabels", args_json);
}

inline int resolveEntryModeLabelHint(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "resolveEntryModeLabelHint", args_json);
}

inline int resolveEntryModePlaceholder(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "resolveEntryModePlaceholder", args_json);
}

inline int sanitizeDefinitionText(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "sanitizeDefinitionText", args_json);
}

inline int shouldInferModeLabels(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "shouldInferModeLabels", args_json);
}

inline int unique(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "unique", args_json);
}

}  // namespace aio::repo_polyglot_equivalents

int main(int argc, char** argv) {
  return aio::repo_module_proxy::dispatch_proxy_cli(AIO_SOURCE_JS_FILE, argc, argv);
}
