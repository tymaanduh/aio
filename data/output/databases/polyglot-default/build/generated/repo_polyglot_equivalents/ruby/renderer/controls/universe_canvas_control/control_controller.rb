# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "renderer/controls/universe_canvas_control/control_controller.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "create_control_controller"
]
      SYMBOL_MAP = {
  "create_control_controller": "create_control_controller"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.create_control_controller(*args)
        raise NotImplementedError, "Equivalent stub for 'create_control_controller' from renderer/controls/universe_canvas_control/control_controller.js"
      end
    end
  end
end
