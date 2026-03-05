# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "main/data_io.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "ensure_data_pre_loaded"
]
      SYMBOL_MAP = {
  "ensure_data_pre_loaded": "ensure_data_pre_loaded"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.ensure_data_pre_loaded(*args)
        raise NotImplementedError, "Equivalent stub for 'ensure_data_pre_loaded' from main/data_io.js"
      end
    end
  end
end
