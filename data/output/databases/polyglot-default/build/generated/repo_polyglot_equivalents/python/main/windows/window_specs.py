#!/usr/bin/env python3
"""Auto-generated Python equivalent module proxy."""

from __future__ import annotations

import argparse
import importlib.util
import json
import pathlib
import sys

AIO_SOURCE_JS_FILE = "main/windows/window_specs.js"
AIO_EQUIVALENT_KIND = "repo_module_proxy"
AIO_FUNCTION_TOKENS = [
  "clone_plain_object",
  "deep_freeze",
  "get_window_definition",
  "get_window_runtime_rules",
  "get_window_spec",
  "is_plain_object",
  "normalize_runtime_rules",
  "normalize_window_definition",
  "pick_window_runtime_rules",
  "pick_window_spec",
  "read_text"
]
AIO_SYMBOL_MAP = {
  "clone_plain_object": "clone_plain_object",
  "deep_freeze": "deep_freeze",
  "get_window_definition": "get_window_definition",
  "get_window_runtime_rules": "get_window_runtime_rules",
  "get_window_spec": "get_window_spec",
  "is_plain_object": "is_plain_object",
  "normalize_runtime_rules": "normalize_runtime_rules",
  "normalize_window_definition": "normalize_window_definition",
  "pick_window_runtime_rules": "pick_window_runtime_rules",
  "pick_window_spec": "pick_window_spec",
  "read_text": "read_text"
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

def clone_plain_object(*args, **kwargs):
    return invoke_source_function("clone_plain_object", *args, **kwargs)

def deep_freeze(*args, **kwargs):
    return invoke_source_function("deep_freeze", *args, **kwargs)

def get_window_definition(*args, **kwargs):
    return invoke_source_function("get_window_definition", *args, **kwargs)

def get_window_runtime_rules(*args, **kwargs):
    return invoke_source_function("get_window_runtime_rules", *args, **kwargs)

def get_window_spec(*args, **kwargs):
    return invoke_source_function("get_window_spec", *args, **kwargs)

def is_plain_object(*args, **kwargs):
    return invoke_source_function("is_plain_object", *args, **kwargs)

def normalize_runtime_rules(*args, **kwargs):
    return invoke_source_function("normalize_runtime_rules", *args, **kwargs)

def normalize_window_definition(*args, **kwargs):
    return invoke_source_function("normalize_window_definition", *args, **kwargs)

def pick_window_runtime_rules(*args, **kwargs):
    return invoke_source_function("pick_window_runtime_rules", *args, **kwargs)

def pick_window_spec(*args, **kwargs):
    return invoke_source_function("pick_window_spec", *args, **kwargs)

def read_text(*args, **kwargs):
    return invoke_source_function("read_text", *args, **kwargs)


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
