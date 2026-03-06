# frozen_string_literal: true

require_relative "../../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "brain/wrappers/renderer_sentence_domain.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
  "addSuggestedNode",
  "addSuggestedPhrase",
  "analyzeGraphQuality",
  "autoCompleteFromSelectedNode",
  "buildAutoCompletePlan",
  "buildPhraseFromPattern",
  "buildSentencePreviewLines",
  "collectPhraseSuggestionsForContext",
  "collectStarterWordSuggestions",
  "collectWordSuggestionsForContext",
  "getSentenceSuggestions",
  "push",
  "pushPhrase",
  "pushSuggestion",
  "renderMiniMap",
  "renderSentenceGraph",
  "traverse",
  "visit",
  "walk"
]
      SYMBOL_MAP = {
  "addSuggestedNode": "add_suggested_node",
  "addSuggestedPhrase": "add_suggested_phrase",
  "analyzeGraphQuality": "analyze_graph_quality",
  "autoCompleteFromSelectedNode": "auto_complete_from_selected_node",
  "buildAutoCompletePlan": "build_auto_complete_plan",
  "buildPhraseFromPattern": "build_phrase_from_pattern",
  "buildSentencePreviewLines": "build_sentence_preview_lines",
  "collectPhraseSuggestionsForContext": "collect_phrase_suggestions_for_context",
  "collectStarterWordSuggestions": "collect_starter_word_suggestions",
  "collectWordSuggestionsForContext": "collect_word_suggestions_for_context",
  "getSentenceSuggestions": "get_sentence_suggestions",
  "push": "push",
  "pushPhrase": "push_phrase",
  "pushSuggestion": "push_suggestion",
  "renderMiniMap": "render_mini_map",
  "renderSentenceGraph": "render_sentence_graph",
  "traverse": "traverse",
  "visit": "visit",
  "walk": "walk"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.invoke_source_function(function_name, *args, **kwargs)
        Aio::RepoPolyglotEquivalents::Shared::RepoModuleProxy.invoke_js_function(
          SOURCE_JS_FILE,
          function_name,
          args,
          kwargs
        )
      end

      def self.run_source_entrypoint(args = [])
        Aio::RepoPolyglotEquivalents::Shared::RepoModuleProxy.run_js_entrypoint(SOURCE_JS_FILE, args)
      end

      def self.add_suggested_node(*args, **kwargs)
        invoke_source_function("addSuggestedNode", *args, **kwargs)
      end

      def self.add_suggested_phrase(*args, **kwargs)
        invoke_source_function("addSuggestedPhrase", *args, **kwargs)
      end

      def self.analyze_graph_quality(*args, **kwargs)
        invoke_source_function("analyzeGraphQuality", *args, **kwargs)
      end

      def self.auto_complete_from_selected_node(*args, **kwargs)
        invoke_source_function("autoCompleteFromSelectedNode", *args, **kwargs)
      end

      def self.build_auto_complete_plan(*args, **kwargs)
        invoke_source_function("buildAutoCompletePlan", *args, **kwargs)
      end

      def self.build_phrase_from_pattern(*args, **kwargs)
        invoke_source_function("buildPhraseFromPattern", *args, **kwargs)
      end

      def self.build_sentence_preview_lines(*args, **kwargs)
        invoke_source_function("buildSentencePreviewLines", *args, **kwargs)
      end

      def self.collect_phrase_suggestions_for_context(*args, **kwargs)
        invoke_source_function("collectPhraseSuggestionsForContext", *args, **kwargs)
      end

      def self.collect_starter_word_suggestions(*args, **kwargs)
        invoke_source_function("collectStarterWordSuggestions", *args, **kwargs)
      end

      def self.collect_word_suggestions_for_context(*args, **kwargs)
        invoke_source_function("collectWordSuggestionsForContext", *args, **kwargs)
      end

      def self.get_sentence_suggestions(*args, **kwargs)
        invoke_source_function("getSentenceSuggestions", *args, **kwargs)
      end

      def self.push(*args, **kwargs)
        invoke_source_function("push", *args, **kwargs)
      end

      def self.push_phrase(*args, **kwargs)
        invoke_source_function("pushPhrase", *args, **kwargs)
      end

      def self.push_suggestion(*args, **kwargs)
        invoke_source_function("pushSuggestion", *args, **kwargs)
      end

      def self.render_mini_map(*args, **kwargs)
        invoke_source_function("renderMiniMap", *args, **kwargs)
      end

      def self.render_sentence_graph(*args, **kwargs)
        invoke_source_function("renderSentenceGraph", *args, **kwargs)
      end

      def self.traverse(*args, **kwargs)
        invoke_source_function("traverse", *args, **kwargs)
      end

      def self.visit(*args, **kwargs)
        invoke_source_function("visit", *args, **kwargs)
      end

      def self.walk(*args, **kwargs)
        invoke_source_function("walk", *args, **kwargs)
      end
    end
  end
end

if __FILE__ == $PROGRAM_NAME
  args = ARGV.dup
  function_flag_index = args.index("--function")
  if function_flag_index
    function_name = args[function_flag_index + 1] || ""
    args_json_index = args.index("--args-json")
    args_json = args_json_index ? (args[args_json_index + 1] || "[]") : "[]"
    result = Aio::RepoPolyglotEquivalents::ModuleProxy.invoke_source_function(
      function_name,
      *Array(JSON.parse(args_json))
    )
    puts(JSON.generate({ ok: true, result: result }))
    exit(0)
  end

  report = Aio::RepoPolyglotEquivalents::ModuleProxy.run_source_entrypoint(ARGV)
  exit(Integer(report.fetch("exit_code", 0)))
end
