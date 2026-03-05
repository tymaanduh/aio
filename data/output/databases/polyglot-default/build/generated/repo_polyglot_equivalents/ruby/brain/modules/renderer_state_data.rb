# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "brain/modules/renderer_state_data.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "createRendererRuntimeSpec",
  "createRendererVisualState"
]
      SYMBOL_MAP = {
  "createRendererRuntimeSpec": "create_renderer_runtime_spec",
  "createRendererVisualState": "create_renderer_visual_state"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.create_renderer_runtime_spec(*args)
        raise NotImplementedError, "Equivalent stub for 'createRendererRuntimeSpec' from brain/modules/renderer_state_data.js"
      end

      def self.create_renderer_visual_state(*args)
        raise NotImplementedError, "Equivalent stub for 'createRendererVisualState' from brain/modules/renderer_state_data.js"
      end
    end
  end
end
