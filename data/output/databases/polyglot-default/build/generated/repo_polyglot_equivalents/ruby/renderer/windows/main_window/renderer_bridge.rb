# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "renderer/windows/main_window/renderer_bridge.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "load_script_once"
]
      SYMBOL_MAP = {
  "load_script_once": "load_script_once"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.load_script_once(*args)
        raise NotImplementedError, "Equivalent stub for 'load_script_once' from renderer/windows/main_window/renderer_bridge.js"
      end
    end
  end
end
