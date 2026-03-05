# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "scripts/dx12-build-mingw.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "fail"
]
      SYMBOL_MAP = {
  "fail": "fail"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.fail(*args)
        raise NotImplementedError, "Equivalent stub for 'fail' from scripts/dx12-build-mingw.js"
      end
    end
  end
end
