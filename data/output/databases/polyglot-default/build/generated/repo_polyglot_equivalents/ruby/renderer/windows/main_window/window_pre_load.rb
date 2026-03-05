# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "renderer/windows/main_window/window_pre_load.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "run_window_pre_load"
]
      SYMBOL_MAP = {
  "run_window_pre_load": "run_window_pre_load"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.run_window_pre_load(*args)
        raise NotImplementedError, "Equivalent stub for 'run_window_pre_load' from renderer/windows/main_window/window_pre_load.js"
      end
    end
  end
end
