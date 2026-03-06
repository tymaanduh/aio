# frozen_string_literal: true

require_relative "../../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "brain/modules/universe_graphics_engine.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
  "clearProjectionCache",
  "compileShader",
  "createProgram",
  "createUniverseGraphicsEngine",
  "defaultClampNumber",
  "defaultCleanText",
  "disposeWebgl",
  "drawWebglLines",
  "drawWebglPoints",
  "findNodeIndexAt",
  "getCanvasContext",
  "getEdgeStride",
  "getEdgeTarget",
  "getNodeRadius",
  "getProjectionData",
  "initializeWebgl",
  "isInteractionActive",
  "markInteraction",
  "renderWebgl",
  "resetCanvasContext"
]
      SYMBOL_MAP = {
  "clearProjectionCache": "clear_projection_cache",
  "compileShader": "compile_shader",
  "createProgram": "create_program",
  "createUniverseGraphicsEngine": "create_universe_graphics_engine",
  "defaultClampNumber": "default_clamp_number",
  "defaultCleanText": "default_clean_text",
  "disposeWebgl": "dispose_webgl",
  "drawWebglLines": "draw_webgl_lines",
  "drawWebglPoints": "draw_webgl_points",
  "findNodeIndexAt": "find_node_index_at",
  "getCanvasContext": "get_canvas_context",
  "getEdgeStride": "get_edge_stride",
  "getEdgeTarget": "get_edge_target",
  "getNodeRadius": "get_node_radius",
  "getProjectionData": "get_projection_data",
  "initializeWebgl": "initialize_webgl",
  "isInteractionActive": "is_interaction_active",
  "markInteraction": "mark_interaction",
  "renderWebgl": "render_webgl",
  "resetCanvasContext": "reset_canvas_context"
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

      def self.clear_projection_cache(*args, **kwargs)
        invoke_source_function("clearProjectionCache", *args, **kwargs)
      end

      def self.compile_shader(*args, **kwargs)
        invoke_source_function("compileShader", *args, **kwargs)
      end

      def self.create_program(*args, **kwargs)
        invoke_source_function("createProgram", *args, **kwargs)
      end

      def self.create_universe_graphics_engine(*args, **kwargs)
        invoke_source_function("createUniverseGraphicsEngine", *args, **kwargs)
      end

      def self.default_clamp_number(*args, **kwargs)
        invoke_source_function("defaultClampNumber", *args, **kwargs)
      end

      def self.default_clean_text(*args, **kwargs)
        invoke_source_function("defaultCleanText", *args, **kwargs)
      end

      def self.dispose_webgl(*args, **kwargs)
        invoke_source_function("disposeWebgl", *args, **kwargs)
      end

      def self.draw_webgl_lines(*args, **kwargs)
        invoke_source_function("drawWebglLines", *args, **kwargs)
      end

      def self.draw_webgl_points(*args, **kwargs)
        invoke_source_function("drawWebglPoints", *args, **kwargs)
      end

      def self.find_node_index_at(*args, **kwargs)
        invoke_source_function("findNodeIndexAt", *args, **kwargs)
      end

      def self.get_canvas_context(*args, **kwargs)
        invoke_source_function("getCanvasContext", *args, **kwargs)
      end

      def self.get_edge_stride(*args, **kwargs)
        invoke_source_function("getEdgeStride", *args, **kwargs)
      end

      def self.get_edge_target(*args, **kwargs)
        invoke_source_function("getEdgeTarget", *args, **kwargs)
      end

      def self.get_node_radius(*args, **kwargs)
        invoke_source_function("getNodeRadius", *args, **kwargs)
      end

      def self.get_projection_data(*args, **kwargs)
        invoke_source_function("getProjectionData", *args, **kwargs)
      end

      def self.initialize_webgl(*args, **kwargs)
        invoke_source_function("initializeWebgl", *args, **kwargs)
      end

      def self.is_interaction_active(*args, **kwargs)
        invoke_source_function("isInteractionActive", *args, **kwargs)
      end

      def self.mark_interaction(*args, **kwargs)
        invoke_source_function("markInteraction", *args, **kwargs)
      end

      def self.render_webgl(*args, **kwargs)
        invoke_source_function("renderWebgl", *args, **kwargs)
      end

      def self.reset_canvas_context(*args, **kwargs)
        invoke_source_function("resetCanvasContext", *args, **kwargs)
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
