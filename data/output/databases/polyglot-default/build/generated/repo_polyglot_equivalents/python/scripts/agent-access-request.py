#!/usr/bin/env python3
"""Auto-generated Python equivalent module proxy."""

from __future__ import annotations

import argparse
import importlib.util
import json
import pathlib
import sys

AIO_SOURCE_JS_FILE = "scripts/agent-access-request.js"
AIO_EQUIVALENT_KIND = "repo_module_proxy"
AIO_FUNCTION_TOKENS = [
  "appendRequestLog",
  "createRequestId",
  "ensureParentDir",
  "nowIso",
  "parseArgs",
  "printHelpAndExit",
  "readPolicy",
  "resolveLogFile",
  "run",
  "toUniqueSorted",
  "validateRequest"
]
AIO_SYMBOL_MAP = {
  "appendRequestLog": "append_request_log",
  "createRequestId": "create_request_id",
  "ensureParentDir": "ensure_parent_dir",
  "nowIso": "now_iso",
  "parseArgs": "parse_args",
  "printHelpAndExit": "print_help_and_exit",
  "readPolicy": "read_policy",
  "resolveLogFile": "resolve_log_file",
  "run": "run",
  "toUniqueSorted": "to_unique_sorted",
  "validateRequest": "validate_request"
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

def append_request_log(*args, **kwargs):
    return invoke_source_function("appendRequestLog", *args, **kwargs)

def create_request_id(*args, **kwargs):
    return invoke_source_function("createRequestId", *args, **kwargs)

def ensure_parent_dir(*args, **kwargs):
    return invoke_source_function("ensureParentDir", *args, **kwargs)

def now_iso(*args, **kwargs):
    return invoke_source_function("nowIso", *args, **kwargs)

def parse_args(*args, **kwargs):
    return invoke_source_function("parseArgs", *args, **kwargs)

def print_help_and_exit(*args, **kwargs):
    return invoke_source_function("printHelpAndExit", *args, **kwargs)

def read_policy(*args, **kwargs):
    return invoke_source_function("readPolicy", *args, **kwargs)

def resolve_log_file(*args, **kwargs):
    return invoke_source_function("resolveLogFile", *args, **kwargs)

def run(*args, **kwargs):
    return invoke_source_function("run", *args, **kwargs)

def to_unique_sorted(*args, **kwargs):
    return invoke_source_function("toUniqueSorted", *args, **kwargs)

def validate_request(*args, **kwargs):
    return invoke_source_function("validateRequest", *args, **kwargs)


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
