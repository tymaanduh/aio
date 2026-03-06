// Auto-generated C++ equivalent module proxy for brain/wrappers/renderer_sentence_domain.js.
#include "../../_shared/repo_module_proxy.hpp"

#include <string>
#include <vector>

static constexpr const char* AIO_SOURCE_JS_FILE = "brain/wrappers/renderer_sentence_domain.js";

namespace aio::repo_polyglot_equivalents::brain::wrappers::renderer_sentence_domain {

inline const char* source_js_file() {
  return AIO_SOURCE_JS_FILE;
}

inline int run_source_entrypoint(const std::vector<std::string>& args = {}) {
  return aio::repo_module_proxy::run_entrypoint(source_js_file(), args);
}

inline int addSuggestedNode(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "addSuggestedNode", args_json);
}

inline int addSuggestedPhrase(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "addSuggestedPhrase", args_json);
}

inline int analyzeGraphQuality(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "analyzeGraphQuality", args_json);
}

inline int autoCompleteFromSelectedNode(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "autoCompleteFromSelectedNode", args_json);
}

inline int buildAutoCompletePlan(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "buildAutoCompletePlan", args_json);
}

inline int buildPhraseFromPattern(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "buildPhraseFromPattern", args_json);
}

inline int buildSentencePreviewLines(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "buildSentencePreviewLines", args_json);
}

inline int collectPhraseSuggestionsForContext(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "collectPhraseSuggestionsForContext", args_json);
}

inline int collectStarterWordSuggestions(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "collectStarterWordSuggestions", args_json);
}

inline int collectWordSuggestionsForContext(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "collectWordSuggestionsForContext", args_json);
}

inline int getSentenceSuggestions(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "getSentenceSuggestions", args_json);
}

inline int push(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "push", args_json);
}

inline int pushPhrase(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "pushPhrase", args_json);
}

inline int pushSuggestion(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "pushSuggestion", args_json);
}

inline int renderMiniMap(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "renderMiniMap", args_json);
}

inline int renderSentenceGraph(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "renderSentenceGraph", args_json);
}

inline int traverse(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "traverse", args_json);
}

inline int visit(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "visit", args_json);
}

inline int walk(const std::string& args_json = "[]") {
  return aio::repo_module_proxy::run_invoke_function(source_js_file(), "walk", args_json);
}

}  // namespace aio::repo_polyglot_equivalents

int main(int argc, char** argv) {
  return aio::repo_module_proxy::dispatch_proxy_cli(AIO_SOURCE_JS_FILE, argc, argv);
}
