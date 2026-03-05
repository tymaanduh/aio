# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "brain/wrappers/renderer_selection_domain.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "clearEntrySelections",
  "focusEntryWithoutUsage",
  "getEntryById",
  "getGraphEntryIdSet",
  "getSelectedEntries",
  "getVisibleTreeEntries",
  "selectEntryRange",
  "setSingleEntrySelection",
  "syncSelectionWithEntry",
  "toggleEntrySelection"
]
      SYMBOL_MAP = {
  "clearEntrySelections": "clear_entry_selections",
  "focusEntryWithoutUsage": "focus_entry_without_usage",
  "getEntryById": "get_entry_by_id",
  "getGraphEntryIdSet": "get_graph_entry_id_set",
  "getSelectedEntries": "get_selected_entries",
  "getVisibleTreeEntries": "get_visible_tree_entries",
  "selectEntryRange": "select_entry_range",
  "setSingleEntrySelection": "set_single_entry_selection",
  "syncSelectionWithEntry": "sync_selection_with_entry",
  "toggleEntrySelection": "toggle_entry_selection"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.clear_entry_selections(*args)
        raise NotImplementedError, "Equivalent stub for 'clearEntrySelections' from brain/wrappers/renderer_selection_domain.js"
      end

      def self.focus_entry_without_usage(*args)
        raise NotImplementedError, "Equivalent stub for 'focusEntryWithoutUsage' from brain/wrappers/renderer_selection_domain.js"
      end

      def self.get_entry_by_id(*args)
        raise NotImplementedError, "Equivalent stub for 'getEntryById' from brain/wrappers/renderer_selection_domain.js"
      end

      def self.get_graph_entry_id_set(*args)
        raise NotImplementedError, "Equivalent stub for 'getGraphEntryIdSet' from brain/wrappers/renderer_selection_domain.js"
      end

      def self.get_selected_entries(*args)
        raise NotImplementedError, "Equivalent stub for 'getSelectedEntries' from brain/wrappers/renderer_selection_domain.js"
      end

      def self.get_visible_tree_entries(*args)
        raise NotImplementedError, "Equivalent stub for 'getVisibleTreeEntries' from brain/wrappers/renderer_selection_domain.js"
      end

      def self.select_entry_range(*args)
        raise NotImplementedError, "Equivalent stub for 'selectEntryRange' from brain/wrappers/renderer_selection_domain.js"
      end

      def self.set_single_entry_selection(*args)
        raise NotImplementedError, "Equivalent stub for 'setSingleEntrySelection' from brain/wrappers/renderer_selection_domain.js"
      end

      def self.sync_selection_with_entry(*args)
        raise NotImplementedError, "Equivalent stub for 'syncSelectionWithEntry' from brain/wrappers/renderer_selection_domain.js"
      end

      def self.toggle_entry_selection(*args)
        raise NotImplementedError, "Equivalent stub for 'toggleEntrySelection' from brain/wrappers/renderer_selection_domain.js"
      end
    end
  end
end
