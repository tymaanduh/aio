# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "brain/modules/migration_utils.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "migrateStateToV4",
  "normalizeLabel",
  "normalizeLabelList",
  "normalizeLegacyEntry",
  "trimText"
]
      SYMBOL_MAP = {
  "migrateStateToV4": "migrate_state_to_v4",
  "normalizeLabel": "normalize_label",
  "normalizeLabelList": "normalize_label_list",
  "normalizeLegacyEntry": "normalize_legacy_entry",
  "trimText": "trim_text"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.migrate_state_to_v4(*args)
        raise NotImplementedError, "Equivalent stub for 'migrateStateToV4' from brain/modules/migration_utils.js"
      end

      def self.normalize_label(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizeLabel' from brain/modules/migration_utils.js"
      end

      def self.normalize_label_list(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizeLabelList' from brain/modules/migration_utils.js"
      end

      def self.normalize_legacy_entry(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizeLegacyEntry' from brain/modules/migration_utils.js"
      end

      def self.trim_text(*args)
        raise NotImplementedError, "Equivalent stub for 'trimText' from brain/modules/migration_utils.js"
      end
    end
  end
end
