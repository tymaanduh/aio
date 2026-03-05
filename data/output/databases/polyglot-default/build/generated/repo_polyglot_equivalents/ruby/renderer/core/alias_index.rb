# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "renderer/core/alias_index.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "create_alias_map",
  "get_alias_words",
  "normalize_alias"
]
      SYMBOL_MAP = {
  "create_alias_map": "create_alias_map",
  "get_alias_words": "get_alias_words",
  "normalize_alias": "normalize_alias"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.create_alias_map(*args)
        raise NotImplementedError, "Equivalent stub for 'create_alias_map' from renderer/core/alias_index.js"
      end

      def self.get_alias_words(*args)
        raise NotImplementedError, "Equivalent stub for 'get_alias_words' from renderer/core/alias_index.js"
      end

      def self.normalize_alias(*args)
        raise NotImplementedError, "Equivalent stub for 'normalize_alias' from renderer/core/alias_index.js"
      end
    end
  end
end
