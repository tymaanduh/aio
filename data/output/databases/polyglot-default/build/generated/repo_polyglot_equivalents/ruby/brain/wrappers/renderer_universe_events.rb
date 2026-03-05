# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "brain/wrappers/renderer_universe_events.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "attachCanvasInteractions",
  "bindUniverseInteractions",
  "scheduleHoverHitTest",
  "stopDrag",
  "toCanvasPoint"
]
      SYMBOL_MAP = {
  "attachCanvasInteractions": "attach_canvas_interactions",
  "bindUniverseInteractions": "bind_universe_interactions",
  "scheduleHoverHitTest": "schedule_hover_hit_test",
  "stopDrag": "stop_drag",
  "toCanvasPoint": "to_canvas_point"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.attach_canvas_interactions(*args)
        raise NotImplementedError, "Equivalent stub for 'attachCanvasInteractions' from brain/wrappers/renderer_universe_events.js"
      end

      def self.bind_universe_interactions(*args)
        raise NotImplementedError, "Equivalent stub for 'bindUniverseInteractions' from brain/wrappers/renderer_universe_events.js"
      end

      def self.schedule_hover_hit_test(*args)
        raise NotImplementedError, "Equivalent stub for 'scheduleHoverHitTest' from brain/wrappers/renderer_universe_events.js"
      end

      def self.stop_drag(*args)
        raise NotImplementedError, "Equivalent stub for 'stopDrag' from brain/wrappers/renderer_universe_events.js"
      end

      def self.to_canvas_point(*args)
        raise NotImplementedError, "Equivalent stub for 'toCanvasPoint' from brain/wrappers/renderer_universe_events.js"
      end
    end
  end
end
