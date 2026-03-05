# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "main/normalize_language_bridge_domain.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "create_default_language_bridge_state",
  "normalize_entry_links",
  "normalize_glossary",
  "normalize_keyword_index",
  "normalize_language_bridge_state",
  "normalize_machine_descriptor_index",
  "normalize_source_entry",
  "normalize_string_list",
  "normalize_triad_map"
]
      SYMBOL_MAP = {
  "create_default_language_bridge_state": "create_default_language_bridge_state",
  "normalize_entry_links": "normalize_entry_links",
  "normalize_glossary": "normalize_glossary",
  "normalize_keyword_index": "normalize_keyword_index",
  "normalize_language_bridge_state": "normalize_language_bridge_state",
  "normalize_machine_descriptor_index": "normalize_machine_descriptor_index",
  "normalize_source_entry": "normalize_source_entry",
  "normalize_string_list": "normalize_string_list",
  "normalize_triad_map": "normalize_triad_map"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.create_default_language_bridge_state(*args)
        raise NotImplementedError, "Equivalent stub for 'create_default_language_bridge_state' from main/normalize_language_bridge_domain.js"
      end

      def self.normalize_entry_links(*args)
        raise NotImplementedError, "Equivalent stub for 'normalize_entry_links' from main/normalize_language_bridge_domain.js"
      end

      def self.normalize_glossary(*args)
        raise NotImplementedError, "Equivalent stub for 'normalize_glossary' from main/normalize_language_bridge_domain.js"
      end

      def self.normalize_keyword_index(*args)
        raise NotImplementedError, "Equivalent stub for 'normalize_keyword_index' from main/normalize_language_bridge_domain.js"
      end

      def self.normalize_language_bridge_state(*args)
        raise NotImplementedError, "Equivalent stub for 'normalize_language_bridge_state' from main/normalize_language_bridge_domain.js"
      end

      def self.normalize_machine_descriptor_index(*args)
        raise NotImplementedError, "Equivalent stub for 'normalize_machine_descriptor_index' from main/normalize_language_bridge_domain.js"
      end

      def self.normalize_source_entry(*args)
        raise NotImplementedError, "Equivalent stub for 'normalize_source_entry' from main/normalize_language_bridge_domain.js"
      end

      def self.normalize_string_list(*args)
        raise NotImplementedError, "Equivalent stub for 'normalize_string_list' from main/normalize_language_bridge_domain.js"
      end

      def self.normalize_triad_map(*args)
        raise NotImplementedError, "Equivalent stub for 'normalize_triad_map' from main/normalize_language_bridge_domain.js"
      end
    end
  end
end
