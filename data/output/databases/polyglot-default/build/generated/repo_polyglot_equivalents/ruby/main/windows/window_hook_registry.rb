# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "main/windows/window_hook_registry.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "get_window_hook_pair"
]
      SYMBOL_MAP = {
  "get_window_hook_pair": "get_window_hook_pair"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.get_window_hook_pair(*args)
        raise NotImplementedError, "Equivalent stub for 'get_window_hook_pair' from main/windows/window_hook_registry.js"
      end
    end
  end
end
