# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "brain/modules/import_utils.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "applyInChunks"
]
      SYMBOL_MAP = {
  "applyInChunks": "apply_in_chunks"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.apply_in_chunks(*args)
        raise NotImplementedError, "Equivalent stub for 'applyInChunks' from brain/modules/import_utils.js"
      end
    end
  end
end
