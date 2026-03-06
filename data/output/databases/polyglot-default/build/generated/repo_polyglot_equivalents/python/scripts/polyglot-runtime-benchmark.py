#!/usr/bin/env python3
"""Auto-generated Python equivalent module proxy."""

from __future__ import annotations

import argparse
import importlib.util
import json
import pathlib
import sys

AIO_SOURCE_JS_FILE = "scripts/polyglot-runtime-benchmark.js"
AIO_EQUIVALENT_KIND = "repo_module_proxy"
AIO_FUNCTION_TOKENS = [
  "buildCppRunnerSource",
  "buildFunctionLanguagePlan",
  "buildRanking",
  "buildWinnerMapping",
  "commandExists",
  "cStringLiteral",
  "detectCppCompiler",
  "detectPythonRuntime",
  "loadBenchmarkInput",
  "main",
  "normalizeLanguage",
  "normalizePathForOutput",
  "normalizeValueForRuntime",
  "parseArgs",
  "parseJsonFromText",
  "printHelpAndExit",
  "readJson",
  "resolveFunctionIds",
  "resolveLanguages",
  "runCppBenchmark",
  "runJavascriptBenchmark",
  "runLanguageBenchmark",
  "runPolyglotBenchmark",
  "runPythonBenchmark",
  "toFiniteNumber"
]
AIO_SYMBOL_MAP = {
  "buildCppRunnerSource": "build_cpp_runner_source",
  "buildFunctionLanguagePlan": "build_function_language_plan",
  "buildRanking": "build_ranking",
  "buildWinnerMapping": "build_winner_mapping",
  "commandExists": "command_exists",
  "cStringLiteral": "c_string_literal",
  "detectCppCompiler": "detect_cpp_compiler",
  "detectPythonRuntime": "detect_python_runtime",
  "loadBenchmarkInput": "load_benchmark_input",
  "main": "main",
  "normalizeLanguage": "normalize_language",
  "normalizePathForOutput": "normalize_path_for_output",
  "normalizeValueForRuntime": "normalize_value_for_runtime",
  "parseArgs": "parse_args",
  "parseJsonFromText": "parse_json_from_text",
  "printHelpAndExit": "print_help_and_exit",
  "readJson": "read_json",
  "resolveFunctionIds": "resolve_function_ids",
  "resolveLanguages": "resolve_languages",
  "runCppBenchmark": "run_cpp_benchmark",
  "runJavascriptBenchmark": "run_javascript_benchmark",
  "runLanguageBenchmark": "run_language_benchmark",
  "runPolyglotBenchmark": "run_polyglot_benchmark",
  "runPythonBenchmark": "run_python_benchmark",
  "toFiniteNumber": "to_finite_number"
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

def build_cpp_runner_source(*args, **kwargs):
    return invoke_source_function("buildCppRunnerSource", *args, **kwargs)

def build_function_language_plan(*args, **kwargs):
    return invoke_source_function("buildFunctionLanguagePlan", *args, **kwargs)

def build_ranking(*args, **kwargs):
    return invoke_source_function("buildRanking", *args, **kwargs)

def build_winner_mapping(*args, **kwargs):
    return invoke_source_function("buildWinnerMapping", *args, **kwargs)

def command_exists(*args, **kwargs):
    return invoke_source_function("commandExists", *args, **kwargs)

def c_string_literal(*args, **kwargs):
    return invoke_source_function("cStringLiteral", *args, **kwargs)

def detect_cpp_compiler(*args, **kwargs):
    return invoke_source_function("detectCppCompiler", *args, **kwargs)

def detect_python_runtime(*args, **kwargs):
    return invoke_source_function("detectPythonRuntime", *args, **kwargs)

def load_benchmark_input(*args, **kwargs):
    return invoke_source_function("loadBenchmarkInput", *args, **kwargs)

def main(*args, **kwargs):
    return invoke_source_function("main", *args, **kwargs)

def normalize_language(*args, **kwargs):
    return invoke_source_function("normalizeLanguage", *args, **kwargs)

def normalize_path_for_output(*args, **kwargs):
    return invoke_source_function("normalizePathForOutput", *args, **kwargs)

def normalize_value_for_runtime(*args, **kwargs):
    return invoke_source_function("normalizeValueForRuntime", *args, **kwargs)

def parse_args(*args, **kwargs):
    return invoke_source_function("parseArgs", *args, **kwargs)

def parse_json_from_text(*args, **kwargs):
    return invoke_source_function("parseJsonFromText", *args, **kwargs)

def print_help_and_exit(*args, **kwargs):
    return invoke_source_function("printHelpAndExit", *args, **kwargs)

def read_json(*args, **kwargs):
    return invoke_source_function("readJson", *args, **kwargs)

def resolve_function_ids(*args, **kwargs):
    return invoke_source_function("resolveFunctionIds", *args, **kwargs)

def resolve_languages(*args, **kwargs):
    return invoke_source_function("resolveLanguages", *args, **kwargs)

def run_cpp_benchmark(*args, **kwargs):
    return invoke_source_function("runCppBenchmark", *args, **kwargs)

def run_javascript_benchmark(*args, **kwargs):
    return invoke_source_function("runJavascriptBenchmark", *args, **kwargs)

def run_language_benchmark(*args, **kwargs):
    return invoke_source_function("runLanguageBenchmark", *args, **kwargs)

def run_polyglot_benchmark(*args, **kwargs):
    return invoke_source_function("runPolyglotBenchmark", *args, **kwargs)

def run_python_benchmark(*args, **kwargs):
    return invoke_source_function("runPythonBenchmark", *args, **kwargs)

def to_finite_number(*args, **kwargs):
    return invoke_source_function("toFiniteNumber", *args, **kwargs)


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
