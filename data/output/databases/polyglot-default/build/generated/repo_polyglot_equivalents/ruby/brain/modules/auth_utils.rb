# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "brain/modules/auth_utils.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "getAuthSubmitHint",
  "isTypingTarget"
]
      SYMBOL_MAP = {
  "getAuthSubmitHint": "get_auth_submit_hint",
  "isTypingTarget": "is_typing_target"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.get_auth_submit_hint(*args)
        raise NotImplementedError, "Equivalent stub for 'getAuthSubmitHint' from brain/modules/auth_utils.js"
      end

      def self.is_typing_target(*args)
        raise NotImplementedError, "Equivalent stub for 'isTypingTarget' from brain/modules/auth_utils.js"
      end
    end
  end
end
