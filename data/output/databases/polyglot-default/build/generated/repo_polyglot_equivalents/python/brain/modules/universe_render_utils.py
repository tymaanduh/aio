#!/usr/bin/env python3
"""Auto-generated Python equivalent module proxy."""

from __future__ import annotations

import argparse
import importlib.util
import json
import pathlib
import sys

AIO_SOURCE_JS_FILE = "brain/modules/universe_render_utils.js"
AIO_EQUIVALENT_KIND = "repo_module_proxy"
AIO_FUNCTION_TOKENS = [
  "ensureFloat32Capacity",
  "ensureWebglBufferCapacity",
  "getUniverseColorRgb",
  "getUniverseColorRgbBytes",
  "normalizeHexColorKey",
  "pushRgba",
  "pushRgbaFromArray",
  "pushRgbaPair"
]
AIO_SYMBOL_MAP = {
  "ensureFloat32Capacity": "ensure_float32_capacity",
  "ensureWebglBufferCapacity": "ensure_webgl_buffer_capacity",
  "getUniverseColorRgb": "get_universe_color_rgb",
  "getUniverseColorRgbBytes": "get_universe_color_rgb_bytes",
  "normalizeHexColorKey": "normalize_hex_color_key",
  "pushRgba": "push_rgba",
  "pushRgbaFromArray": "push_rgba_from_array",
  "pushRgbaPair": "push_rgba_pair"
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

def ensure_float32_capacity(*args, **kwargs):
    return invoke_source_function("ensureFloat32Capacity", *args, **kwargs)

def ensure_webgl_buffer_capacity(*args, **kwargs):
    return invoke_source_function("ensureWebglBufferCapacity", *args, **kwargs)

def get_universe_color_rgb(*args, **kwargs):
    return invoke_source_function("getUniverseColorRgb", *args, **kwargs)

def get_universe_color_rgb_bytes(*args, **kwargs):
    return invoke_source_function("getUniverseColorRgbBytes", *args, **kwargs)

def normalize_hex_color_key(*args, **kwargs):
    return invoke_source_function("normalizeHexColorKey", *args, **kwargs)

def push_rgba(*args, **kwargs):
    return invoke_source_function("pushRgba", *args, **kwargs)

def push_rgba_from_array(*args, **kwargs):
    return invoke_source_function("pushRgbaFromArray", *args, **kwargs)

def push_rgba_pair(*args, **kwargs):
    return invoke_source_function("pushRgbaPair", *args, **kwargs)


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
