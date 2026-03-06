#!/usr/bin/env python3
"""Auto-generated Python equivalent module proxy."""

from __future__ import annotations

import argparse
import importlib.util
import json
import pathlib
import sys

AIO_SOURCE_JS_FILE = "preload.js"
AIO_EQUIVALENT_KIND = "repo_module_proxy"
AIO_FUNCTION_TOKENS = [
  "apply_flat_alias_methods",
  "build_namespace_api",
  "create_forward_method",
  "create_invoke_method",
  "create_runtime_log_listener",
  "is_plain_object",
  "listener",
  "resolve_arg_normalizers",
  "resolve_channel_by_key",
  "resolve_method_by_path",
  "resolve_namespace_channels"
]
AIO_SYMBOL_MAP = {
  "apply_flat_alias_methods": "apply_flat_alias_methods",
  "build_namespace_api": "build_namespace_api",
  "create_forward_method": "create_forward_method",
  "create_invoke_method": "create_invoke_method",
  "create_runtime_log_listener": "create_runtime_log_listener",
  "is_plain_object": "is_plain_object",
  "listener": "listener",
  "resolve_arg_normalizers": "resolve_arg_normalizers",
  "resolve_channel_by_key": "resolve_channel_by_key",
  "resolve_method_by_path": "resolve_method_by_path",
  "resolve_namespace_channels": "resolve_namespace_channels"
}


def _load_proxy_runner():
    shared_runner_path = (pathlib.Path(__file__).resolve().parent / "_shared/repo_module_proxy.py").resolve()
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

def apply_flat_alias_methods(*args, **kwargs):
    return invoke_source_function("apply_flat_alias_methods", *args, **kwargs)

def build_namespace_api(*args, **kwargs):
    return invoke_source_function("build_namespace_api", *args, **kwargs)

def create_forward_method(*args, **kwargs):
    return invoke_source_function("create_forward_method", *args, **kwargs)

def create_invoke_method(*args, **kwargs):
    return invoke_source_function("create_invoke_method", *args, **kwargs)

def create_runtime_log_listener(*args, **kwargs):
    return invoke_source_function("create_runtime_log_listener", *args, **kwargs)

def is_plain_object(*args, **kwargs):
    return invoke_source_function("is_plain_object", *args, **kwargs)

def listener(*args, **kwargs):
    return invoke_source_function("listener", *args, **kwargs)

def resolve_arg_normalizers(*args, **kwargs):
    return invoke_source_function("resolve_arg_normalizers", *args, **kwargs)

def resolve_channel_by_key(*args, **kwargs):
    return invoke_source_function("resolve_channel_by_key", *args, **kwargs)

def resolve_method_by_path(*args, **kwargs):
    return invoke_source_function("resolve_method_by_path", *args, **kwargs)

def resolve_namespace_channels(*args, **kwargs):
    return invoke_source_function("resolve_namespace_channels", *args, **kwargs)


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
