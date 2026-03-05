# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "tests/generate_file_catalog_docs.test.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "makeTempRoot"
]
      SYMBOL_MAP = {
  "makeTempRoot": "make_temp_root"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.make_temp_root(*args)
        raise NotImplementedError, "Equivalent stub for 'makeTempRoot' from tests/generate_file_catalog_docs.test.js"
      end
    end
  end
end
