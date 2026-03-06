#!/usr/bin/env python3
"""Auto-generated Python equivalent module proxy."""

from __future__ import annotations

import argparse
import importlib.util
import json
import pathlib
import sys

AIO_SOURCE_JS_FILE = "brain/wrappers/renderer_universe_render_domain.js"
AIO_EQUIVALENT_KIND = "repo_module_proxy"
AIO_FUNCTION_TOKENS = [
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
AIO_SYMBOL_MAP = {
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


def _load_proxy_runner():
    shared_runner_path = (pathlib.Path(__file__).resolve().parent / "../../_shared/repo_module_proxy.py").resolve()
    spec = importlib.util.spec_from_file_location("aio_repo_module_proxy", shared_runner_path)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"failed to load shared runner: {shared_runner_path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


_PROXY = _load_proxy_runner()


def module_equivalent_metadata():
    return {
        "source_js_file": AIO_SOURCE_JS_FILE,
        "equivalent_kind": AIO_EQUIVALENT_KIND,
        "function_tokens": list(AIO_FUNCTION_TOKENS),
        "symbol_map": dict(AIO_SYMBOL_MAP),
    }


def invoke_source_function(function_name, *args, **kwargs):
    return _PROXY.invoke_js_function(AIO_SOURCE_JS_FILE, function_name, list(args), dict(kwargs))


def run_source_entrypoint(args=None):
    return _PROXY.run_js_entrypoint(AIO_SOURCE_JS_FILE, list(args or []))

def append_universe_benchmark_sample(*args, **kwargs):
    return invoke_source_function("appendUniverseBenchmarkSample", *args, **kwargs)

def apply_universe_safe_render_mode_from_gpu_status(*args, **kwargs):
    return invoke_source_function("applyUniverseSafeRenderModeFromGpuStatus", *args, **kwargs)

def build_projection_input(*args, **kwargs):
    return invoke_source_function("buildProjectionInput", *args, **kwargs)

def complete_universe_benchmark(*args, **kwargs):
    return invoke_source_function("completeUniverseBenchmark", *args, **kwargs)

def create_universe_benchmark_state(*args, **kwargs):
    return invoke_source_function("createUniverseBenchmarkState", *args, **kwargs)

def draw_universe_node_label(*args, **kwargs):
    return invoke_source_function("drawUniverseNodeLabel", *args, **kwargs)

def ensure_universe_canvas_size(*args, **kwargs):
    return invoke_source_function("ensureUniverseCanvasSize", *args, **kwargs)

def find_node_at(*args, **kwargs):
    return invoke_source_function("findNodeAt", *args, **kwargs)

def format_universe_gpu_label(*args, **kwargs):
    return invoke_source_function("formatUniverseGpuLabel", *args, **kwargs)

def get_active_canvas(*args, **kwargs):
    return invoke_source_function("getActiveCanvas", *args, **kwargs)

def get_canvas_ctx(*args, **kwargs):
    return invoke_source_function("getCanvasCtx", *args, **kwargs)

def get_edge_stride(*args, **kwargs):
    return invoke_source_function("getEdgeStride", *args, **kwargs)

def get_projection(*args, **kwargs):
    return invoke_source_function("getProjection", *args, **kwargs)

def get_universe_benchmark_progress(*args, **kwargs):
    return invoke_source_function("getUniverseBenchmarkProgress", *args, **kwargs)

def get_universe_node_color(*args, **kwargs):
    return invoke_source_function("getUniverseNodeColor", *args, **kwargs)

def get_universe_question_bucket(*args, **kwargs):
    return invoke_source_function("getUniverseQuestionBucket", *args, **kwargs)

def get_universe_target_dpr(*args, **kwargs):
    return invoke_source_function("getUniverseTargetDpr", *args, **kwargs)

def is_gpu_status_degraded(*args, **kwargs):
    return invoke_source_function("isGpuStatusDegraded", *args, **kwargs)

def is_sentence_graph_visible(*args, **kwargs):
    return invoke_source_function("isSentenceGraphVisible", *args, **kwargs)

def is_universe_visible(*args, **kwargs):
    return invoke_source_function("isUniverseVisible", *args, **kwargs)

def mark_interaction(*args, **kwargs):
    return invoke_source_function("markInteraction", *args, **kwargs)

def render_graph_webgl(*args, **kwargs):
    return invoke_source_function("renderGraphWebgl", *args, **kwargs)

def render_perf_hud(*args, **kwargs):
    return invoke_source_function("renderPerfHud", *args, **kwargs)

def req_graph(*args, **kwargs):
    return invoke_source_function("reqGraph", *args, **kwargs)

def set_path_status(*args, **kwargs):
    return invoke_source_function("setPathStatus", *args, **kwargs)

def set_universe_render_mode(*args, **kwargs):
    return invoke_source_function("setUniverseRenderMode", *args, **kwargs)

def show_universe_gpu_status(*args, **kwargs):
    return invoke_source_function("showUniverseGpuStatus", *args, **kwargs)

def start_universe_benchmark(*args, **kwargs):
    return invoke_source_function("startUniverseBenchmark", *args, **kwargs)

def stop_universe_benchmark(*args, **kwargs):
    return invoke_source_function("stopUniverseBenchmark", *args, **kwargs)

def sync_canvas_visibility(*args, **kwargs):
    return invoke_source_function("syncCanvasVisibility", *args, **kwargs)

def sync_controls(*args, **kwargs):
    return invoke_source_function("syncControls", *args, **kwargs)

def update_universe_benchmark_camera(*args, **kwargs):
    return invoke_source_function("updateUniverseBenchmarkCamera", *args, **kwargs)

def update_universe_bookmark_select(*args, **kwargs):
    return invoke_source_function("updateUniverseBookmarkSelect", *args, **kwargs)

def update_universe_frame_metrics(*args, **kwargs):
    return invoke_source_function("updateUniverseFrameMetrics", *args, **kwargs)


def _main(argv):
    parser = argparse.ArgumentParser(add_help=False)
    parser.add_argument("--function", dest="function_name", default="")
    parser.add_argument("--args-json", dest="args_json", default="[]")
    parsed, _ = parser.parse_known_args(argv)
    if parsed.function_name:
        args = json.loads(parsed.args_json)
        result = invoke_source_function(parsed.function_name, *list(args))
        sys.stdout.write(json.dumps({"ok": True, "result": result}) + "\n")
        return 0
    report = run_source_entrypoint(argv)
    return int(report.get("exit_code", 0))


if __name__ == "__main__":
    raise SystemExit(_main(sys.argv[1:]))
