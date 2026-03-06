#!/usr/bin/env python3
"""Auto-generated Python equivalent module proxy."""

from __future__ import annotations

import argparse
import importlib.util
import json
import pathlib
import sys

AIO_SOURCE_JS_FILE = "scripts/standards-baseline-gate.js"
AIO_EQUIVALENT_KIND = "repo_module_proxy"
AIO_FUNCTION_TOKENS = [
  "analyze",
  "buildRecommendations",
  "checkUniqueLowerSnake",
  "classifyBaseName",
  "collectNamingMetrics",
  "issue",
  "listFilesRecursively",
  "main",
  "normalizePath",
  "parseArgs",
  "readJson",
  "validateFutureRoadmapCatalogs",
  "validateOptimizationPolicies",
  "validatePolyglotRuntimeActivation",
  "validateStoragePolicies",
  "validateSymbolRegistry",
  "validateTokenUsagePolicyCatalog",
  "validateUiUxCatalog",
  "writeReport"
]
AIO_SYMBOL_MAP = {
  "analyze": "analyze",
  "buildRecommendations": "build_recommendations",
  "checkUniqueLowerSnake": "check_unique_lower_snake",
  "classifyBaseName": "classify_base_name",
  "collectNamingMetrics": "collect_naming_metrics",
  "issue": "issue",
  "listFilesRecursively": "list_files_recursively",
  "main": "main",
  "normalizePath": "normalize_path",
  "parseArgs": "parse_args",
  "readJson": "read_json",
  "validateFutureRoadmapCatalogs": "validate_future_roadmap_catalogs",
  "validateOptimizationPolicies": "validate_optimization_policies",
  "validatePolyglotRuntimeActivation": "validate_polyglot_runtime_activation",
  "validateStoragePolicies": "validate_storage_policies",
  "validateSymbolRegistry": "validate_symbol_registry",
  "validateTokenUsagePolicyCatalog": "validate_token_usage_policy_catalog",
  "validateUiUxCatalog": "validate_ui_ux_catalog",
  "writeReport": "write_report"
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

def analyze(*args, **kwargs):
    return invoke_source_function("analyze", *args, **kwargs)

def build_recommendations(*args, **kwargs):
    return invoke_source_function("buildRecommendations", *args, **kwargs)

def check_unique_lower_snake(*args, **kwargs):
    return invoke_source_function("checkUniqueLowerSnake", *args, **kwargs)

def classify_base_name(*args, **kwargs):
    return invoke_source_function("classifyBaseName", *args, **kwargs)

def collect_naming_metrics(*args, **kwargs):
    return invoke_source_function("collectNamingMetrics", *args, **kwargs)

def issue(*args, **kwargs):
    return invoke_source_function("issue", *args, **kwargs)

def list_files_recursively(*args, **kwargs):
    return invoke_source_function("listFilesRecursively", *args, **kwargs)

def main(*args, **kwargs):
    return invoke_source_function("main", *args, **kwargs)

def normalize_path(*args, **kwargs):
    return invoke_source_function("normalizePath", *args, **kwargs)

def parse_args(*args, **kwargs):
    return invoke_source_function("parseArgs", *args, **kwargs)

def read_json(*args, **kwargs):
    return invoke_source_function("readJson", *args, **kwargs)

def validate_future_roadmap_catalogs(*args, **kwargs):
    return invoke_source_function("validateFutureRoadmapCatalogs", *args, **kwargs)

def validate_optimization_policies(*args, **kwargs):
    return invoke_source_function("validateOptimizationPolicies", *args, **kwargs)

def validate_polyglot_runtime_activation(*args, **kwargs):
    return invoke_source_function("validatePolyglotRuntimeActivation", *args, **kwargs)

def validate_storage_policies(*args, **kwargs):
    return invoke_source_function("validateStoragePolicies", *args, **kwargs)

def validate_symbol_registry(*args, **kwargs):
    return invoke_source_function("validateSymbolRegistry", *args, **kwargs)

def validate_token_usage_policy_catalog(*args, **kwargs):
    return invoke_source_function("validateTokenUsagePolicyCatalog", *args, **kwargs)

def validate_ui_ux_catalog(*args, **kwargs):
    return invoke_source_function("validateUiUxCatalog", *args, **kwargs)

def write_report(*args, **kwargs):
    return invoke_source_function("writeReport", *args, **kwargs)


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
