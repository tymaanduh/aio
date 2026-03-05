# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "tests/auth_quick_login.test.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "loadAuthModule"
]
      SYMBOL_MAP = {
  "loadAuthModule": "load_auth_module"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.load_auth_module(*args)
        raise NotImplementedError, "Equivalent stub for 'loadAuthModule' from tests/auth_quick_login.test.js"
      end
    end
  end
end
