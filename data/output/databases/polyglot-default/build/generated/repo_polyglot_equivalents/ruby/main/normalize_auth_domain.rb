# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "main/normalize_auth_domain.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "normalizeAuthState"
]
      SYMBOL_MAP = {
  "normalizeAuthState": "normalize_auth_state"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.normalize_auth_state(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizeAuthState' from main/normalize_auth_domain.js"
      end
    end
  end
end
