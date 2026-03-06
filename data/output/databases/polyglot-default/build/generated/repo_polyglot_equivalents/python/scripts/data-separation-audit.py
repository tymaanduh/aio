#!/usr/bin/env python3
"""Auto-generated Python equivalent module proxy."""

from __future__ import annotations

import argparse
import importlib.util
import json
import pathlib
import sys

AIO_SOURCE_JS_FILE = "scripts/data-separation-audit.js"
AIO_EQUIVALENT_KIND = "repo_module_proxy"
AIO_FUNCTION_TOKENS = [
  "classifyConstant",
  "collectJsFiles",
  "detectCandidatesInFile",
  "ensureDir",
  "isIgnoredPath",
  "main",
  "normalizePath",
  "nowIso",
  "parseArgs",
  "printHelpAndExit",
  "summarizeByPath",
  "toRelativePath"
]
AIO_SYMBOL_MAP = {
  "classifyConstant": "classify_constant",
  "collectJsFiles": "collect_js_files",
  "detectCandidatesInFile": "detect_candidates_in_file",
  "ensureDir": "ensure_dir",
  "isIgnoredPath": "is_ignored_path",
  "main": "main",
  "normalizePath": "normalize_path",
  "nowIso": "now_iso",
  "parseArgs": "parse_args",
  "printHelpAndExit": "print_help_and_exit",
  "summarizeByPath": "summarize_by_path",
  "toRelativePath": "to_relative_path"
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

def classify_constant(*args, **kwargs):
    return invoke_source_function("classifyConstant", *args, **kwargs)

def collect_js_files(*args, **kwargs):
    return invoke_source_function("collectJsFiles", *args, **kwargs)

def detect_candidates_in_file(*args, **kwargs):
    return invoke_source_function("detectCandidatesInFile", *args, **kwargs)

def ensure_dir(*args, **kwargs):
    return invoke_source_function("ensureDir", *args, **kwargs)

def is_ignored_path(*args, **kwargs):
    return invoke_source_function("isIgnoredPath", *args, **kwargs)

def main(*args, **kwargs):
    return invoke_source_function("main", *args, **kwargs)

def normalize_path(*args, **kwargs):
    return invoke_source_function("normalizePath", *args, **kwargs)

def now_iso(*args, **kwargs):
    return invoke_source_function("nowIso", *args, **kwargs)

def parse_args(*args, **kwargs):
    return invoke_source_function("parseArgs", *args, **kwargs)

def print_help_and_exit(*args, **kwargs):
    return invoke_source_function("printHelpAndExit", *args, **kwargs)

def summarize_by_path(*args, **kwargs):
    return invoke_source_function("summarizeByPath", *args, **kwargs)

def to_relative_path(*args, **kwargs):
    return invoke_source_function("toRelativePath", *args, **kwargs)


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
