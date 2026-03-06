#!/usr/bin/env python3
"""Auto-generated Python equivalent module proxy."""

from __future__ import annotations

import argparse
import importlib.util
import json
import pathlib
import sys

AIO_SOURCE_JS_FILE = "scripts/validate-wrapper-contracts.js"
AIO_EQUIVALENT_KIND = "repo_module_proxy"
AIO_FUNCTION_TOKENS = [
  "compareInputLists",
  "escapeRegExp",
  "issue",
  "listJsFiles",
  "main",
  "normalizeInputList",
  "normalizeText",
  "parseArgs",
  "readJson",
  "requireArg",
  "symbolPatternForLanguage",
  "validate"
]
AIO_SYMBOL_MAP = {
  "compareInputLists": "compare_input_lists",
  "escapeRegExp": "escape_reg_exp",
  "issue": "issue",
  "listJsFiles": "list_js_files",
  "main": "main",
  "normalizeInputList": "normalize_input_list",
  "normalizeText": "normalize_text",
  "parseArgs": "parse_args",
  "readJson": "read_json",
  "requireArg": "require_arg",
  "symbolPatternForLanguage": "symbol_pattern_for_language",
  "validate": "validate"
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

def compare_input_lists(*args, **kwargs):
    return invoke_source_function("compareInputLists", *args, **kwargs)

def escape_reg_exp(*args, **kwargs):
    return invoke_source_function("escapeRegExp", *args, **kwargs)

def issue(*args, **kwargs):
    return invoke_source_function("issue", *args, **kwargs)

def list_js_files(*args, **kwargs):
    return invoke_source_function("listJsFiles", *args, **kwargs)

def main(*args, **kwargs):
    return invoke_source_function("main", *args, **kwargs)

def normalize_input_list(*args, **kwargs):
    return invoke_source_function("normalizeInputList", *args, **kwargs)

def normalize_text(*args, **kwargs):
    return invoke_source_function("normalizeText", *args, **kwargs)

def parse_args(*args, **kwargs):
    return invoke_source_function("parseArgs", *args, **kwargs)

def read_json(*args, **kwargs):
    return invoke_source_function("readJson", *args, **kwargs)

def require_arg(*args, **kwargs):
    return invoke_source_function("requireArg", *args, **kwargs)

def symbol_pattern_for_language(*args, **kwargs):
    return invoke_source_function("symbolPatternForLanguage", *args, **kwargs)

def validate(*args, **kwargs):
    return invoke_source_function("validate", *args, **kwargs)


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
