# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "brain/modules/alias_index.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "createAliasMap",
  "getAliasWords",
  "normalizeAlias"
]
      SYMBOL_MAP = {
  "createAliasMap": "create_alias_map",
  "getAliasWords": "get_alias_words",
  "normalizeAlias": "normalize_alias"
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
        raise NotImplementedError, "Equivalent stub for 'createAliasMap' from brain/modules/alias_index.js"
      end

      def self.get_alias_words(*args)
        raise NotImplementedError, "Equivalent stub for 'getAliasWords' from brain/modules/alias_index.js"
      end

      def self.normalize_alias(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizeAlias' from brain/modules/alias_index.js"
      end
    end
  end
end
