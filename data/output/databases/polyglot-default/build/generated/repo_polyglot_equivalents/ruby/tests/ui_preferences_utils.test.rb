# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "tests/ui_preferences_utils.test.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = []
      SYMBOL_MAP = {}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      # No function tokens discovered.
    end
  end
end
