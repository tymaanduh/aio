#!/usr/bin/env python3
"""Auto-generated Python equivalent module proxy."""

from __future__ import annotations

import argparse
import importlib.util
import json
import pathlib
import sys

AIO_SOURCE_JS_FILE = "brain/modules/universe_graphics_engine.js"
AIO_EQUIVALENT_KIND = "repo_module_proxy"
AIO_FUNCTION_TOKENS = [
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
AIO_SYMBOL_MAP = {
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

def clear_projection_cache(*args, **kwargs):
    return invoke_source_function("clearProjectionCache", *args, **kwargs)

def compile_shader(*args, **kwargs):
    return invoke_source_function("compileShader", *args, **kwargs)

def create_program(*args, **kwargs):
    return invoke_source_function("createProgram", *args, **kwargs)

def create_universe_graphics_engine(*args, **kwargs):
    return invoke_source_function("createUniverseGraphicsEngine", *args, **kwargs)

def default_clamp_number(*args, **kwargs):
    return invoke_source_function("defaultClampNumber", *args, **kwargs)

def default_clean_text(*args, **kwargs):
    return invoke_source_function("defaultCleanText", *args, **kwargs)

def dispose_webgl(*args, **kwargs):
    return invoke_source_function("disposeWebgl", *args, **kwargs)

def draw_webgl_lines(*args, **kwargs):
    return invoke_source_function("drawWebglLines", *args, **kwargs)

def draw_webgl_points(*args, **kwargs):
    return invoke_source_function("drawWebglPoints", *args, **kwargs)

def find_node_index_at(*args, **kwargs):
    return invoke_source_function("findNodeIndexAt", *args, **kwargs)

def get_canvas_context(*args, **kwargs):
    return invoke_source_function("getCanvasContext", *args, **kwargs)

def get_edge_stride(*args, **kwargs):
    return invoke_source_function("getEdgeStride", *args, **kwargs)

def get_edge_target(*args, **kwargs):
    return invoke_source_function("getEdgeTarget", *args, **kwargs)

def get_node_radius(*args, **kwargs):
    return invoke_source_function("getNodeRadius", *args, **kwargs)

def get_projection_data(*args, **kwargs):
    return invoke_source_function("getProjectionData", *args, **kwargs)

def initialize_webgl(*args, **kwargs):
    return invoke_source_function("initializeWebgl", *args, **kwargs)

def is_interaction_active(*args, **kwargs):
    return invoke_source_function("isInteractionActive", *args, **kwargs)

def mark_interaction(*args, **kwargs):
    return invoke_source_function("markInteraction", *args, **kwargs)

def render_webgl(*args, **kwargs):
    return invoke_source_function("renderWebgl", *args, **kwargs)

def reset_canvas_context(*args, **kwargs):
    return invoke_source_function("resetCanvasContext", *args, **kwargs)


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
