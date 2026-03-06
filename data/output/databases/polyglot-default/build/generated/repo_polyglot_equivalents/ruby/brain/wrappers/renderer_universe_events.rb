# frozen_string_literal: true

require_relative "../../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "brain/wrappers/renderer_universe_events.js"
      EQUIVALENT_KIND = "repo_module_proxy"
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

      def self.invoke_source_function(function_name, *args, **kwargs)
        Aio::RepoPolyglotEquivalents::Shared::RepoModuleProxy.invoke_js_function(
          SOURCE_JS_FILE,
          function_name,
          args,
          kwargs
        )
      end

      def self.run_source_entrypoint(args = [])
        Aio::RepoPolyglotEquivalents::Shared::RepoModuleProxy.run_js_entrypoint(SOURCE_JS_FILE, args)
      end

      def self.attach_canvas_interactions(*args, **kwargs)
        invoke_source_function("attachCanvasInteractions", *args, **kwargs)
      end

      def self.bind_universe_interactions(*args, **kwargs)
        invoke_source_function("bindUniverseInteractions", *args, **kwargs)
      end

      def self.schedule_hover_hit_test(*args, **kwargs)
        invoke_source_function("scheduleHoverHitTest", *args, **kwargs)
      end

      def self.stop_drag(*args, **kwargs)
        invoke_source_function("stopDrag", *args, **kwargs)
      end

      def self.to_canvas_point(*args, **kwargs)
        invoke_source_function("toCanvasPoint", *args, **kwargs)
      end
    end
  end
end

if __FILE__ == $PROGRAM_NAME
  args = ARGV.dup
  function_flag_index = args.index("--function")
  if function_flag_index
    function_name = args[function_flag_index + 1] || ""
    args_json_index = args.index("--args-json")
    args_json = args_json_index ? (args[args_json_index + 1] || "[]") : "[]"
    result = Aio::RepoPolyglotEquivalents::ModuleProxy.invoke_source_function(
      function_name,
      *Array(JSON.parse(args_json))
    )
    puts(JSON.generate({ ok: true, result: result }))
    exit(0)
  end

  report = Aio::RepoPolyglotEquivalents::ModuleProxy.run_source_entrypoint(ARGV)
  exit(Integer(report.fetch("exit_code", 0)))
end
