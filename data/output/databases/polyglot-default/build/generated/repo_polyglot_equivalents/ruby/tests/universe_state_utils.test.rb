# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "tests/universe_state_utils.test.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "createTools"
]
      SYMBOL_MAP = {
  "createTools": "create_tools"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.create_tools(*args)
        raise NotImplementedError, "Equivalent stub for 'createTools' from tests/universe_state_utils.test.js"
      end
    end
  end
end
