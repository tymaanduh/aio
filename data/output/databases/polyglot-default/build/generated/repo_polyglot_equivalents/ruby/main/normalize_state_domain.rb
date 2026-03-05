# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "main/normalize_state_domain.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "compactState",
  "mergeEntriesByWordIdentity",
  "normalizeHistoryCheckpoint",
  "normalizeSentenceGraph",
  "normalizeState",
  "normalizeStateEntry",
  "remapSentenceGraphEntryIds",
  "resolveEntryIdAlias"
]
      SYMBOL_MAP = {
  "compactState": "compact_state",
  "mergeEntriesByWordIdentity": "merge_entries_by_word_identity",
  "normalizeHistoryCheckpoint": "normalize_history_checkpoint",
  "normalizeSentenceGraph": "normalize_sentence_graph",
  "normalizeState": "normalize_state",
  "normalizeStateEntry": "normalize_state_entry",
  "remapSentenceGraphEntryIds": "remap_sentence_graph_entry_ids",
  "resolveEntryIdAlias": "resolve_entry_id_alias"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.compact_state(*args)
        raise NotImplementedError, "Equivalent stub for 'compactState' from main/normalize_state_domain.js"
      end

      def self.merge_entries_by_word_identity(*args)
        raise NotImplementedError, "Equivalent stub for 'mergeEntriesByWordIdentity' from main/normalize_state_domain.js"
      end

      def self.normalize_history_checkpoint(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizeHistoryCheckpoint' from main/normalize_state_domain.js"
      end

      def self.normalize_sentence_graph(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizeSentenceGraph' from main/normalize_state_domain.js"
      end

      def self.normalize_state(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizeState' from main/normalize_state_domain.js"
      end

      def self.normalize_state_entry(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizeStateEntry' from main/normalize_state_domain.js"
      end

      def self.remap_sentence_graph_entry_ids(*args)
        raise NotImplementedError, "Equivalent stub for 'remapSentenceGraphEntryIds' from main/normalize_state_domain.js"
      end

      def self.resolve_entry_id_alias(*args)
        raise NotImplementedError, "Equivalent stub for 'resolveEntryIdAlias' from main/normalize_state_domain.js"
      end
    end
  end
end
