# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "brain/wrappers/renderer_events_domain.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "applyTreeEntrySelection",
  "bindEvents",
  "handleContextAction",
  "handleSuggestionAction",
  "handleTreeAction",
  "submitBulkImport"
]
      SYMBOL_MAP = {
  "applyTreeEntrySelection": "apply_tree_entry_selection",
  "bindEvents": "bind_events",
  "handleContextAction": "handle_context_action",
  "handleSuggestionAction": "handle_suggestion_action",
  "handleTreeAction": "handle_tree_action",
  "submitBulkImport": "submit_bulk_import"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.apply_tree_entry_selection(*args)
        raise NotImplementedError, "Equivalent stub for 'applyTreeEntrySelection' from brain/wrappers/renderer_events_domain.js"
      end

      def self.bind_events(*args)
        raise NotImplementedError, "Equivalent stub for 'bindEvents' from brain/wrappers/renderer_events_domain.js"
      end

      def self.handle_context_action(*args)
        raise NotImplementedError, "Equivalent stub for 'handleContextAction' from brain/wrappers/renderer_events_domain.js"
      end

      def self.handle_suggestion_action(*args)
        raise NotImplementedError, "Equivalent stub for 'handleSuggestionAction' from brain/wrappers/renderer_events_domain.js"
      end

      def self.handle_tree_action(*args)
        raise NotImplementedError, "Equivalent stub for 'handleTreeAction' from brain/wrappers/renderer_events_domain.js"
      end

      def self.submit_bulk_import(*args)
        raise NotImplementedError, "Equivalent stub for 'submitBulkImport' from brain/wrappers/renderer_events_domain.js"
      end
    end
  end
end
