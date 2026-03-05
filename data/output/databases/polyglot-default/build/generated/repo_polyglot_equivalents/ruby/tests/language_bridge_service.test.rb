# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "tests/language_bridge_service.test.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "create_memory_bridge_repository"
]
      SYMBOL_MAP = {
  "create_memory_bridge_repository": "create_memory_bridge_repository"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.create_memory_bridge_repository(*args)
        raise NotImplementedError, "Equivalent stub for 'create_memory_bridge_repository' from tests/language_bridge_service.test.js"
      end
    end
  end
end
