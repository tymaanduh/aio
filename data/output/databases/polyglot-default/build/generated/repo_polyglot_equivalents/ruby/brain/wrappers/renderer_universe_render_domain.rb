# frozen_string_literal: true

require_relative "../../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "brain/wrappers/renderer_universe_render_domain.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
  "appendUniverseBenchmarkSample",
  "applyUniverseSafeRenderModeFromGpuStatus",
  "buildProjectionInput",
  "completeUniverseBenchmark",
  "createUniverseBenchmarkState",
  "drawUniverseNodeLabel",
  "ensureUniverseCanvasSize",
  "findNodeAt",
  "formatUniverseGpuLabel",
  "getActiveCanvas",
  "getCanvasCtx",
  "getEdgeStride",
  "getProjection",
  "getUniverseBenchmarkProgress",
  "getUniverseNodeColor",
  "getUniverseQuestionBucket",
  "getUniverseTargetDpr",
  "isGpuStatusDegraded",
  "isSentenceGraphVisible",
  "isUniverseVisible",
  "markInteraction",
  "renderGraphWebgl",
  "renderPerfHud",
  "reqGraph",
  "setPathStatus",
  "setUniverseRenderMode",
  "showUniverseGpuStatus",
  "startUniverseBenchmark",
  "stopUniverseBenchmark",
  "syncCanvasVisibility",
  "syncControls",
  "updateUniverseBenchmarkCamera",
  "updateUniverseBookmarkSelect",
  "updateUniverseFrameMetrics"
]
      SYMBOL_MAP = {
  "appendUniverseBenchmarkSample": "append_universe_benchmark_sample",
  "applyUniverseSafeRenderModeFromGpuStatus": "apply_universe_safe_render_mode_from_gpu_status",
  "buildProjectionInput": "build_projection_input",
  "completeUniverseBenchmark": "complete_universe_benchmark",
  "createUniverseBenchmarkState": "create_universe_benchmark_state",
  "drawUniverseNodeLabel": "draw_universe_node_label",
  "ensureUniverseCanvasSize": "ensure_universe_canvas_size",
  "findNodeAt": "find_node_at",
  "formatUniverseGpuLabel": "format_universe_gpu_label",
  "getActiveCanvas": "get_active_canvas",
  "getCanvasCtx": "get_canvas_ctx",
  "getEdgeStride": "get_edge_stride",
  "getProjection": "get_projection",
  "getUniverseBenchmarkProgress": "get_universe_benchmark_progress",
  "getUniverseNodeColor": "get_universe_node_color",
  "getUniverseQuestionBucket": "get_universe_question_bucket",
  "getUniverseTargetDpr": "get_universe_target_dpr",
  "isGpuStatusDegraded": "is_gpu_status_degraded",
  "isSentenceGraphVisible": "is_sentence_graph_visible",
  "isUniverseVisible": "is_universe_visible",
  "markInteraction": "mark_interaction",
  "renderGraphWebgl": "render_graph_webgl",
  "renderPerfHud": "render_perf_hud",
  "reqGraph": "req_graph",
  "setPathStatus": "set_path_status",
  "setUniverseRenderMode": "set_universe_render_mode",
  "showUniverseGpuStatus": "show_universe_gpu_status",
  "startUniverseBenchmark": "start_universe_benchmark",
  "stopUniverseBenchmark": "stop_universe_benchmark",
  "syncCanvasVisibility": "sync_canvas_visibility",
  "syncControls": "sync_controls",
  "updateUniverseBenchmarkCamera": "update_universe_benchmark_camera",
  "updateUniverseBookmarkSelect": "update_universe_bookmark_select",
  "updateUniverseFrameMetrics": "update_universe_frame_metrics"
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

      def self.append_universe_benchmark_sample(*args, **kwargs)
        invoke_source_function("appendUniverseBenchmarkSample", *args, **kwargs)
      end

      def self.apply_universe_safe_render_mode_from_gpu_status(*args, **kwargs)
        invoke_source_function("applyUniverseSafeRenderModeFromGpuStatus", *args, **kwargs)
      end

      def self.build_projection_input(*args, **kwargs)
        invoke_source_function("buildProjectionInput", *args, **kwargs)
      end

      def self.complete_universe_benchmark(*args, **kwargs)
        invoke_source_function("completeUniverseBenchmark", *args, **kwargs)
      end

      def self.create_universe_benchmark_state(*args, **kwargs)
        invoke_source_function("createUniverseBenchmarkState", *args, **kwargs)
      end

      def self.draw_universe_node_label(*args, **kwargs)
        invoke_source_function("drawUniverseNodeLabel", *args, **kwargs)
      end

      def self.ensure_universe_canvas_size(*args, **kwargs)
        invoke_source_function("ensureUniverseCanvasSize", *args, **kwargs)
      end

      def self.find_node_at(*args, **kwargs)
        invoke_source_function("findNodeAt", *args, **kwargs)
      end

      def self.format_universe_gpu_label(*args, **kwargs)
        invoke_source_function("formatUniverseGpuLabel", *args, **kwargs)
      end

      def self.get_active_canvas(*args, **kwargs)
        invoke_source_function("getActiveCanvas", *args, **kwargs)
      end

      def self.get_canvas_ctx(*args, **kwargs)
        invoke_source_function("getCanvasCtx", *args, **kwargs)
      end

      def self.get_edge_stride(*args, **kwargs)
        invoke_source_function("getEdgeStride", *args, **kwargs)
      end

      def self.get_projection(*args, **kwargs)
        invoke_source_function("getProjection", *args, **kwargs)
      end

      def self.get_universe_benchmark_progress(*args, **kwargs)
        invoke_source_function("getUniverseBenchmarkProgress", *args, **kwargs)
      end

      def self.get_universe_node_color(*args, **kwargs)
        invoke_source_function("getUniverseNodeColor", *args, **kwargs)
      end

      def self.get_universe_question_bucket(*args, **kwargs)
        invoke_source_function("getUniverseQuestionBucket", *args, **kwargs)
      end

      def self.get_universe_target_dpr(*args, **kwargs)
        invoke_source_function("getUniverseTargetDpr", *args, **kwargs)
      end

      def self.is_gpu_status_degraded(*args, **kwargs)
        invoke_source_function("isGpuStatusDegraded", *args, **kwargs)
      end

      def self.is_sentence_graph_visible(*args, **kwargs)
        invoke_source_function("isSentenceGraphVisible", *args, **kwargs)
      end

      def self.is_universe_visible(*args, **kwargs)
        invoke_source_function("isUniverseVisible", *args, **kwargs)
      end

      def self.mark_interaction(*args, **kwargs)
        invoke_source_function("markInteraction", *args, **kwargs)
      end

      def self.render_graph_webgl(*args, **kwargs)
        invoke_source_function("renderGraphWebgl", *args, **kwargs)
      end

      def self.render_perf_hud(*args, **kwargs)
        invoke_source_function("renderPerfHud", *args, **kwargs)
      end

      def self.req_graph(*args, **kwargs)
        invoke_source_function("reqGraph", *args, **kwargs)
      end

      def self.set_path_status(*args, **kwargs)
        invoke_source_function("setPathStatus", *args, **kwargs)
      end

      def self.set_universe_render_mode(*args, **kwargs)
        invoke_source_function("setUniverseRenderMode", *args, **kwargs)
      end

      def self.show_universe_gpu_status(*args, **kwargs)
        invoke_source_function("showUniverseGpuStatus", *args, **kwargs)
      end

      def self.start_universe_benchmark(*args, **kwargs)
        invoke_source_function("startUniverseBenchmark", *args, **kwargs)
      end

      def self.stop_universe_benchmark(*args, **kwargs)
        invoke_source_function("stopUniverseBenchmark", *args, **kwargs)
      end

      def self.sync_canvas_visibility(*args, **kwargs)
        invoke_source_function("syncCanvasVisibility", *args, **kwargs)
      end

      def self.sync_controls(*args, **kwargs)
        invoke_source_function("syncControls", *args, **kwargs)
      end

      def self.update_universe_benchmark_camera(*args, **kwargs)
        invoke_source_function("updateUniverseBenchmarkCamera", *args, **kwargs)
      end

      def self.update_universe_bookmark_select(*args, **kwargs)
        invoke_source_function("updateUniverseBookmarkSelect", *args, **kwargs)
      end

      def self.update_universe_frame_metrics(*args, **kwargs)
        invoke_source_function("updateUniverseFrameMetrics", *args, **kwargs)
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
