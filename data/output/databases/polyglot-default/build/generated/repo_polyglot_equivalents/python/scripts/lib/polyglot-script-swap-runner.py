#!/usr/bin/env python3
"""Auto-generated Python equivalent module proxy."""

from __future__ import annotations

import argparse
import importlib.util
import json
import pathlib
import sys

AIO_SOURCE_JS_FILE = "scripts/lib/polyglot-script-swap-runner.js"
AIO_EQUIVALENT_KIND = "repo_module_proxy"
AIO_FUNCTION_TOKENS = [
  "append",
  "commandExists",
  "detectPythonRuntime",
  "includeScore",
  "loadBenchmarkWinnerMap",
  "loadCatalog",
  "parseLanguageOrderCsv",
  "parseTruthy",
  "readJsonFile",
  "resolveAdapter",
  "resolveBenchmarkPreferredLanguage",
  "resolveExecutionCommand",
  "resolveLanguageOrder",
  "resolveLanguageSelection",
  "resolveStagePolicy",
  "resolveStageScriptPath",
  "runScriptWithSwaps",
  "toLanguageId",
  "toPathFromRoot",
  "toUniqueLanguageList",
  "toUniqueStringList"
]
AIO_SYMBOL_MAP = {
  "append": "append",
  "commandExists": "command_exists",
  "detectPythonRuntime": "detect_python_runtime",
  "includeScore": "include_score",
  "loadBenchmarkWinnerMap": "load_benchmark_winner_map",
  "loadCatalog": "load_catalog",
  "parseLanguageOrderCsv": "parse_language_order_csv",
  "parseTruthy": "parse_truthy",
  "readJsonFile": "read_json_file",
  "resolveAdapter": "resolve_adapter",
  "resolveBenchmarkPreferredLanguage": "resolve_benchmark_preferred_language",
  "resolveExecutionCommand": "resolve_execution_command",
  "resolveLanguageOrder": "resolve_language_order",
  "resolveLanguageSelection": "resolve_language_selection",
  "resolveStagePolicy": "resolve_stage_policy",
  "resolveStageScriptPath": "resolve_stage_script_path",
  "runScriptWithSwaps": "run_script_with_swaps",
  "toLanguageId": "to_language_id",
  "toPathFromRoot": "to_path_from_root",
  "toUniqueLanguageList": "to_unique_language_list",
  "toUniqueStringList": "to_unique_string_list"
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

def append(*args, **kwargs):
    return invoke_source_function("append", *args, **kwargs)

def command_exists(*args, **kwargs):
    return invoke_source_function("commandExists", *args, **kwargs)

def detect_python_runtime(*args, **kwargs):
    return invoke_source_function("detectPythonRuntime", *args, **kwargs)

def include_score(*args, **kwargs):
    return invoke_source_function("includeScore", *args, **kwargs)

def load_benchmark_winner_map(*args, **kwargs):
    return invoke_source_function("loadBenchmarkWinnerMap", *args, **kwargs)

def load_catalog(*args, **kwargs):
    return invoke_source_function("loadCatalog", *args, **kwargs)

def parse_language_order_csv(*args, **kwargs):
    return invoke_source_function("parseLanguageOrderCsv", *args, **kwargs)

def parse_truthy(*args, **kwargs):
    return invoke_source_function("parseTruthy", *args, **kwargs)

def read_json_file(*args, **kwargs):
    return invoke_source_function("readJsonFile", *args, **kwargs)

def resolve_adapter(*args, **kwargs):
    return invoke_source_function("resolveAdapter", *args, **kwargs)

def resolve_benchmark_preferred_language(*args, **kwargs):
    return invoke_source_function("resolveBenchmarkPreferredLanguage", *args, **kwargs)

def resolve_execution_command(*args, **kwargs):
    return invoke_source_function("resolveExecutionCommand", *args, **kwargs)

def resolve_language_order(*args, **kwargs):
    return invoke_source_function("resolveLanguageOrder", *args, **kwargs)

def resolve_language_selection(*args, **kwargs):
    return invoke_source_function("resolveLanguageSelection", *args, **kwargs)

def resolve_stage_policy(*args, **kwargs):
    return invoke_source_function("resolveStagePolicy", *args, **kwargs)

def resolve_stage_script_path(*args, **kwargs):
    return invoke_source_function("resolveStageScriptPath", *args, **kwargs)

def run_script_with_swaps(*args, **kwargs):
    return invoke_source_function("runScriptWithSwaps", *args, **kwargs)

def to_language_id(*args, **kwargs):
    return invoke_source_function("toLanguageId", *args, **kwargs)

def to_path_from_root(*args, **kwargs):
    return invoke_source_function("toPathFromRoot", *args, **kwargs)

def to_unique_language_list(*args, **kwargs):
    return invoke_source_function("toUniqueLanguageList", *args, **kwargs)

def to_unique_string_list(*args, **kwargs):
    return invoke_source_function("toUniqueStringList", *args, **kwargs)


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
