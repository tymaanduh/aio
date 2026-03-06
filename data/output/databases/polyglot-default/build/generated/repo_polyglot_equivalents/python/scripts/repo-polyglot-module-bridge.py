#!/usr/bin/env python3
"""Auto-generated Python equivalent module proxy."""

from __future__ import annotations

import argparse
import importlib.util
import json
import pathlib
import sys

AIO_SOURCE_JS_FILE = "scripts/repo-polyglot-module-bridge.js"
AIO_EQUIVALENT_KIND = "repo_module_proxy"
AIO_FUNCTION_TOKENS = [
  "main",
  "normalizeArgsList",
  "normalizeJsPath",
  "normalizeKwargs",
  "parseArgs",
  "parsePayload",
  "readPayloadText",
  "resolveFunctionCandidate",
  "runEntrypoint",
  "runInvokeFunction",
  "runPayload",
  "sanitizeForJson",
  "truncateText"
]
AIO_SYMBOL_MAP = {
  "main": "main",
  "normalizeArgsList": "normalize_args_list",
  "normalizeJsPath": "normalize_js_path",
  "normalizeKwargs": "normalize_kwargs",
  "parseArgs": "parse_args",
  "parsePayload": "parse_payload",
  "readPayloadText": "read_payload_text",
  "resolveFunctionCandidate": "resolve_function_candidate",
  "runEntrypoint": "run_entrypoint",
  "runInvokeFunction": "run_invoke_function",
  "runPayload": "run_payload",
  "sanitizeForJson": "sanitize_for_json",
  "truncateText": "truncate_text"
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

def main(*args, **kwargs):
    return invoke_source_function("main", *args, **kwargs)

def normalize_args_list(*args, **kwargs):
    return invoke_source_function("normalizeArgsList", *args, **kwargs)

def normalize_js_path(*args, **kwargs):
    return invoke_source_function("normalizeJsPath", *args, **kwargs)

def normalize_kwargs(*args, **kwargs):
    return invoke_source_function("normalizeKwargs", *args, **kwargs)

def parse_args(*args, **kwargs):
    return invoke_source_function("parseArgs", *args, **kwargs)

def parse_payload(*args, **kwargs):
    return invoke_source_function("parsePayload", *args, **kwargs)

def read_payload_text(*args, **kwargs):
    return invoke_source_function("readPayloadText", *args, **kwargs)

def resolve_function_candidate(*args, **kwargs):
    return invoke_source_function("resolveFunctionCandidate", *args, **kwargs)

def run_entrypoint(*args, **kwargs):
    return invoke_source_function("runEntrypoint", *args, **kwargs)

def run_invoke_function(*args, **kwargs):
    return invoke_source_function("runInvokeFunction", *args, **kwargs)

def run_payload(*args, **kwargs):
    return invoke_source_function("runPayload", *args, **kwargs)

def sanitize_for_json(*args, **kwargs):
    return invoke_source_function("sanitizeForJson", *args, **kwargs)

def truncate_text(*args, **kwargs):
    return invoke_source_function("truncateText", *args, **kwargs)


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
