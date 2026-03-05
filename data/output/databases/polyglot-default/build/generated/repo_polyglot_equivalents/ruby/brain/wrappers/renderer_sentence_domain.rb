# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "brain/wrappers/renderer_sentence_domain.js"
      EQUIVALENT_KIND = "repo_module_stub"
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

      def self.add_suggested_node(*args)
        raise NotImplementedError, "Equivalent stub for 'addSuggestedNode' from brain/wrappers/renderer_sentence_domain.js"
      end

      def self.add_suggested_phrase(*args)
        raise NotImplementedError, "Equivalent stub for 'addSuggestedPhrase' from brain/wrappers/renderer_sentence_domain.js"
      end

      def self.analyze_graph_quality(*args)
        raise NotImplementedError, "Equivalent stub for 'analyzeGraphQuality' from brain/wrappers/renderer_sentence_domain.js"
      end

      def self.auto_complete_from_selected_node(*args)
        raise NotImplementedError, "Equivalent stub for 'autoCompleteFromSelectedNode' from brain/wrappers/renderer_sentence_domain.js"
      end

      def self.build_auto_complete_plan(*args)
        raise NotImplementedError, "Equivalent stub for 'buildAutoCompletePlan' from brain/wrappers/renderer_sentence_domain.js"
      end

      def self.build_phrase_from_pattern(*args)
        raise NotImplementedError, "Equivalent stub for 'buildPhraseFromPattern' from brain/wrappers/renderer_sentence_domain.js"
      end

      def self.build_sentence_preview_lines(*args)
        raise NotImplementedError, "Equivalent stub for 'buildSentencePreviewLines' from brain/wrappers/renderer_sentence_domain.js"
      end

      def self.collect_phrase_suggestions_for_context(*args)
        raise NotImplementedError, "Equivalent stub for 'collectPhraseSuggestionsForContext' from brain/wrappers/renderer_sentence_domain.js"
      end

      def self.collect_starter_word_suggestions(*args)
        raise NotImplementedError, "Equivalent stub for 'collectStarterWordSuggestions' from brain/wrappers/renderer_sentence_domain.js"
      end

      def self.collect_word_suggestions_for_context(*args)
        raise NotImplementedError, "Equivalent stub for 'collectWordSuggestionsForContext' from brain/wrappers/renderer_sentence_domain.js"
      end

      def self.get_sentence_suggestions(*args)
        raise NotImplementedError, "Equivalent stub for 'getSentenceSuggestions' from brain/wrappers/renderer_sentence_domain.js"
      end

      def self.push(*args)
        raise NotImplementedError, "Equivalent stub for 'push' from brain/wrappers/renderer_sentence_domain.js"
      end

      def self.push_phrase(*args)
        raise NotImplementedError, "Equivalent stub for 'pushPhrase' from brain/wrappers/renderer_sentence_domain.js"
      end

      def self.push_suggestion(*args)
        raise NotImplementedError, "Equivalent stub for 'pushSuggestion' from brain/wrappers/renderer_sentence_domain.js"
      end

      def self.render_mini_map(*args)
        raise NotImplementedError, "Equivalent stub for 'renderMiniMap' from brain/wrappers/renderer_sentence_domain.js"
      end

      def self.render_sentence_graph(*args)
        raise NotImplementedError, "Equivalent stub for 'renderSentenceGraph' from brain/wrappers/renderer_sentence_domain.js"
      end

      def self.traverse(*args)
        raise NotImplementedError, "Equivalent stub for 'traverse' from brain/wrappers/renderer_sentence_domain.js"
      end

      def self.visit(*args)
        raise NotImplementedError, "Equivalent stub for 'visit' from brain/wrappers/renderer_sentence_domain.js"
      end

      def self.walk(*args)
        raise NotImplementedError, "Equivalent stub for 'walk' from brain/wrappers/renderer_sentence_domain.js"
      end
    end
  end
end
