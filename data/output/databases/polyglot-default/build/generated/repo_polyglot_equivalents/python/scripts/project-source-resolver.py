#!/usr/bin/env python3
"""Auto-generated Python equivalent module proxy."""

from __future__ import annotations

import argparse
import importlib.util
import json
import pathlib
import sys

AIO_SOURCE_JS_FILE = "scripts/project-source-resolver.js"
AIO_EQUIVALENT_KIND = "repo_module_proxy"
AIO_FUNCTION_TOKENS = [
  "fileExists",
  "findProjectRoot",
  "isAgentAccessControlFile",
  "isFile",
  "listMatchingFiles",
  "normalizePath",
  "resolveAgentAccessControl",
  "resolveMaybeRelocatedPath",
  "resolveRequestLogFile",
  "resolveUpdateLogPaths",
  "shouldIgnoreDirectory"
]
AIO_SYMBOL_MAP = {
  "fileExists": "file_exists",
  "findProjectRoot": "find_project_root",
  "isAgentAccessControlFile": "is_agent_access_control_file",
  "isFile": "is_file",
  "listMatchingFiles": "list_matching_files",
  "normalizePath": "normalize_path",
  "resolveAgentAccessControl": "resolve_agent_access_control",
  "resolveMaybeRelocatedPath": "resolve_maybe_relocated_path",
  "resolveRequestLogFile": "resolve_request_log_file",
  "resolveUpdateLogPaths": "resolve_update_log_paths",
  "shouldIgnoreDirectory": "should_ignore_directory"
}


def _load_proxy_runner():
    shared_runner_path = (pathlib.Path(__file__).resolve().parent / "../_shared/repo_module_proxy.py").resolve()
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

def file_exists(*args, **kwargs):
    return invoke_source_function("fileExists", *args, **kwargs)

def find_project_root(*args, **kwargs):
    return invoke_source_function("findProjectRoot", *args, **kwargs)

def is_agent_access_control_file(*args, **kwargs):
    return invoke_source_function("isAgentAccessControlFile", *args, **kwargs)

def is_file(*args, **kwargs):
    return invoke_source_function("isFile", *args, **kwargs)

def list_matching_files(*args, **kwargs):
    return invoke_source_function("listMatchingFiles", *args, **kwargs)

def normalize_path(*args, **kwargs):
    return invoke_source_function("normalizePath", *args, **kwargs)

def resolve_agent_access_control(*args, **kwargs):
    return invoke_source_function("resolveAgentAccessControl", *args, **kwargs)

def resolve_maybe_relocated_path(*args, **kwargs):
    return invoke_source_function("resolveMaybeRelocatedPath", *args, **kwargs)

def resolve_request_log_file(*args, **kwargs):
    return invoke_source_function("resolveRequestLogFile", *args, **kwargs)

def resolve_update_log_paths(*args, **kwargs):
    return invoke_source_function("resolveUpdateLogPaths", *args, **kwargs)

def should_ignore_directory(*args, **kwargs):
    return invoke_source_function("shouldIgnoreDirectory", *args, **kwargs)


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
