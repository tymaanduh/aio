# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "main/windows/window_hook_shared.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "create_window_hook_pair",
  "create_window_hook_result",
  "create_window_hook_spec",
  "run_hook"
]
      SYMBOL_MAP = {
  "create_window_hook_pair": "create_window_hook_pair",
  "create_window_hook_result": "create_window_hook_result",
  "create_window_hook_spec": "create_window_hook_spec",
  "run_hook": "run_hook"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.create_window_hook_pair(*args)
        raise NotImplementedError, "Equivalent stub for 'create_window_hook_pair' from main/windows/window_hook_shared.js"
      end

      def self.create_window_hook_result(*args)
        raise NotImplementedError, "Equivalent stub for 'create_window_hook_result' from main/windows/window_hook_shared.js"
      end

      def self.create_window_hook_spec(*args)
        raise NotImplementedError, "Equivalent stub for 'create_window_hook_spec' from main/windows/window_hook_shared.js"
      end

      def self.run_hook(*args)
        raise NotImplementedError, "Equivalent stub for 'run_hook' from main/windows/window_hook_shared.js"
      end
    end
  end
end
