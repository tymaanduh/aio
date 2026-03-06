#!/usr/bin/env python3
"""Auto-generated Python equivalent module proxy."""

from __future__ import annotations

import argparse
import importlib.util
import json
import pathlib
import sys

AIO_SOURCE_JS_FILE = "main/services/runtime_log_service.js"
AIO_EQUIVALENT_KIND = "repo_module_proxy"
AIO_FUNCTION_TOKENS = [
  "append_runtime_log",
  "broadcast_runtime_log",
  "create_log_console_window",
  "create_runtime_log_result",
  "get_runtime_log_buffer",
  "get_runtime_log_status",
  "is_runtime_logs_enabled",
  "now_iso",
  "sanitize_runtime_log_entry",
  "set_runtime_logs_enabled"
]
AIO_SYMBOL_MAP = {
  "append_runtime_log": "append_runtime_log",
  "broadcast_runtime_log": "broadcast_runtime_log",
  "create_log_console_window": "create_log_console_window",
  "create_runtime_log_result": "create_runtime_log_result",
  "get_runtime_log_buffer": "get_runtime_log_buffer",
  "get_runtime_log_status": "get_runtime_log_status",
  "is_runtime_logs_enabled": "is_runtime_logs_enabled",
  "now_iso": "now_iso",
  "sanitize_runtime_log_entry": "sanitize_runtime_log_entry",
  "set_runtime_logs_enabled": "set_runtime_logs_enabled"
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

def append_runtime_log(*args, **kwargs):
    return invoke_source_function("append_runtime_log", *args, **kwargs)

def broadcast_runtime_log(*args, **kwargs):
    return invoke_source_function("broadcast_runtime_log", *args, **kwargs)

def create_log_console_window(*args, **kwargs):
    return invoke_source_function("create_log_console_window", *args, **kwargs)

def create_runtime_log_result(*args, **kwargs):
    return invoke_source_function("create_runtime_log_result", *args, **kwargs)

def get_runtime_log_buffer(*args, **kwargs):
    return invoke_source_function("get_runtime_log_buffer", *args, **kwargs)

def get_runtime_log_status(*args, **kwargs):
    return invoke_source_function("get_runtime_log_status", *args, **kwargs)

def is_runtime_logs_enabled(*args, **kwargs):
    return invoke_source_function("is_runtime_logs_enabled", *args, **kwargs)

def now_iso(*args, **kwargs):
    return invoke_source_function("now_iso", *args, **kwargs)

def sanitize_runtime_log_entry(*args, **kwargs):
    return invoke_source_function("sanitize_runtime_log_entry", *args, **kwargs)

def set_runtime_logs_enabled(*args, **kwargs):
    return invoke_source_function("set_runtime_logs_enabled", *args, **kwargs)


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
