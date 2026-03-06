#!/usr/bin/env python3
"""Auto-generated Python equivalent module proxy."""

from __future__ import annotations

import argparse
import importlib.util
import json
import pathlib
import sys

AIO_SOURCE_JS_FILE = "main/data/repository_manifest.js"
AIO_EQUIVALENT_KIND = "repo_module_proxy"
AIO_FUNCTION_TOKENS = [
  "build_file_meta",
  "create_manifest",
  "ensure_data_dirs",
  "file_exists",
  "get_data_paths",
  "is_plain_object",
  "load_manifest",
  "read_json_file",
  "save_manifest",
  "sync_manifest_file",
  "write_json_atomic"
]
AIO_SYMBOL_MAP = {
  "build_file_meta": "build_file_meta",
  "create_manifest": "create_manifest",
  "ensure_data_dirs": "ensure_data_dirs",
  "file_exists": "file_exists",
  "get_data_paths": "get_data_paths",
  "is_plain_object": "is_plain_object",
  "load_manifest": "load_manifest",
  "read_json_file": "read_json_file",
  "save_manifest": "save_manifest",
  "sync_manifest_file": "sync_manifest_file",
  "write_json_atomic": "write_json_atomic"
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

def build_file_meta(*args, **kwargs):
    return invoke_source_function("build_file_meta", *args, **kwargs)

def create_manifest(*args, **kwargs):
    return invoke_source_function("create_manifest", *args, **kwargs)

def ensure_data_dirs(*args, **kwargs):
    return invoke_source_function("ensure_data_dirs", *args, **kwargs)

def file_exists(*args, **kwargs):
    return invoke_source_function("file_exists", *args, **kwargs)

def get_data_paths(*args, **kwargs):
    return invoke_source_function("get_data_paths", *args, **kwargs)

def is_plain_object(*args, **kwargs):
    return invoke_source_function("is_plain_object", *args, **kwargs)

def load_manifest(*args, **kwargs):
    return invoke_source_function("load_manifest", *args, **kwargs)

def read_json_file(*args, **kwargs):
    return invoke_source_function("read_json_file", *args, **kwargs)

def save_manifest(*args, **kwargs):
    return invoke_source_function("save_manifest", *args, **kwargs)

def sync_manifest_file(*args, **kwargs):
    return invoke_source_function("sync_manifest_file", *args, **kwargs)

def write_json_atomic(*args, **kwargs):
    return invoke_source_function("write_json_atomic", *args, **kwargs)


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
