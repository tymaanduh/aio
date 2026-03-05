# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "main/services/auth_service.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "inject_auth_repository"
]
      SYMBOL_MAP = {
  "inject_auth_repository": "inject_auth_repository"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.inject_auth_repository(*args)
        raise NotImplementedError, "Equivalent stub for 'inject_auth_repository' from main/services/auth_service.js"
      end
    end
  end
end
