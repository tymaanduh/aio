#!/usr/bin/env python3
"""Auto-generated Python equivalent module proxy."""

from __future__ import annotations

import argparse
import importlib.util
import json
import pathlib
import sys

AIO_SOURCE_JS_FILE = "scripts/generate-repo-polyglot-equivalents.js"
AIO_EQUIVALENT_KIND = "repo_module_proxy"
AIO_FUNCTION_TOKENS = [
  "buildCatalog",
  "buildCppEquivalentContent",
  "buildCppSharedRunnerContent",
  "buildLanguageSymbolMap",
  "buildPythonEquivalentContent",
  "buildPythonSharedRunnerContent",
  "buildRubyEquivalentContent",
  "buildRubySharedRunnerContent",
  "buildTargetsAndEntries",
  "ensureDirForFile",
  "extractFunctionTokens",
  "listFilesRecursive",
  "listRepositoryJsFiles",
  "main",
  "normalizeCatalogForComparison",
  "normalizeRelativePath",
  "parseArgs",
  "removeStaleFiles",
  "runCheck",
  "runWrite",
  "shouldIgnoreGeneratedPath",
  "shouldSkip",
  "toCppIdentifier",
  "toNamespacePath",
  "toPosix",
  "toPythonIdentifier",
  "toRubyIdentifier",
  "toSnake",
  "uniqueSorted"
]
AIO_SYMBOL_MAP = {
  "buildCatalog": "build_catalog",
  "buildCppEquivalentContent": "build_cpp_equivalent_content",
  "buildCppSharedRunnerContent": "build_cpp_shared_runner_content",
  "buildLanguageSymbolMap": "build_language_symbol_map",
  "buildPythonEquivalentContent": "build_python_equivalent_content",
  "buildPythonSharedRunnerContent": "build_python_shared_runner_content",
  "buildRubyEquivalentContent": "build_ruby_equivalent_content",
  "buildRubySharedRunnerContent": "build_ruby_shared_runner_content",
  "buildTargetsAndEntries": "build_targets_and_entries",
  "ensureDirForFile": "ensure_dir_for_file",
  "extractFunctionTokens": "extract_function_tokens",
  "listFilesRecursive": "list_files_recursive",
  "listRepositoryJsFiles": "list_repository_js_files",
  "main": "main",
  "normalizeCatalogForComparison": "normalize_catalog_for_comparison",
  "normalizeRelativePath": "normalize_relative_path",
  "parseArgs": "parse_args",
  "removeStaleFiles": "remove_stale_files",
  "runCheck": "run_check",
  "runWrite": "run_write",
  "shouldIgnoreGeneratedPath": "should_ignore_generated_path",
  "shouldSkip": "should_skip",
  "toCppIdentifier": "to_cpp_identifier",
  "toNamespacePath": "to_namespace_path",
  "toPosix": "to_posix",
  "toPythonIdentifier": "to_python_identifier",
  "toRubyIdentifier": "to_ruby_identifier",
  "toSnake": "to_snake",
  "uniqueSorted": "unique_sorted"
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

def build_catalog(*args, **kwargs):
    return invoke_source_function("buildCatalog", *args, **kwargs)

def build_cpp_equivalent_content(*args, **kwargs):
    return invoke_source_function("buildCppEquivalentContent", *args, **kwargs)

def build_cpp_shared_runner_content(*args, **kwargs):
    return invoke_source_function("buildCppSharedRunnerContent", *args, **kwargs)

def build_language_symbol_map(*args, **kwargs):
    return invoke_source_function("buildLanguageSymbolMap", *args, **kwargs)

def build_python_equivalent_content(*args, **kwargs):
    return invoke_source_function("buildPythonEquivalentContent", *args, **kwargs)

def build_python_shared_runner_content(*args, **kwargs):
    return invoke_source_function("buildPythonSharedRunnerContent", *args, **kwargs)

def build_ruby_equivalent_content(*args, **kwargs):
    return invoke_source_function("buildRubyEquivalentContent", *args, **kwargs)

def build_ruby_shared_runner_content(*args, **kwargs):
    return invoke_source_function("buildRubySharedRunnerContent", *args, **kwargs)

def build_targets_and_entries(*args, **kwargs):
    return invoke_source_function("buildTargetsAndEntries", *args, **kwargs)

def ensure_dir_for_file(*args, **kwargs):
    return invoke_source_function("ensureDirForFile", *args, **kwargs)

def extract_function_tokens(*args, **kwargs):
    return invoke_source_function("extractFunctionTokens", *args, **kwargs)

def list_files_recursive(*args, **kwargs):
    return invoke_source_function("listFilesRecursive", *args, **kwargs)

def list_repository_js_files(*args, **kwargs):
    return invoke_source_function("listRepositoryJsFiles", *args, **kwargs)

def main(*args, **kwargs):
    return invoke_source_function("main", *args, **kwargs)

def normalize_catalog_for_comparison(*args, **kwargs):
    return invoke_source_function("normalizeCatalogForComparison", *args, **kwargs)

def normalize_relative_path(*args, **kwargs):
    return invoke_source_function("normalizeRelativePath", *args, **kwargs)

def parse_args(*args, **kwargs):
    return invoke_source_function("parseArgs", *args, **kwargs)

def remove_stale_files(*args, **kwargs):
    return invoke_source_function("removeStaleFiles", *args, **kwargs)

def run_check(*args, **kwargs):
    return invoke_source_function("runCheck", *args, **kwargs)

def run_write(*args, **kwargs):
    return invoke_source_function("runWrite", *args, **kwargs)

def should_ignore_generated_path(*args, **kwargs):
    return invoke_source_function("shouldIgnoreGeneratedPath", *args, **kwargs)

def should_skip(*args, **kwargs):
    return invoke_source_function("shouldSkip", *args, **kwargs)

def to_cpp_identifier(*args, **kwargs):
    return invoke_source_function("toCppIdentifier", *args, **kwargs)

def to_namespace_path(*args, **kwargs):
    return invoke_source_function("toNamespacePath", *args, **kwargs)

def to_posix(*args, **kwargs):
    return invoke_source_function("toPosix", *args, **kwargs)

def to_python_identifier(*args, **kwargs):
    return invoke_source_function("toPythonIdentifier", *args, **kwargs)

def to_ruby_identifier(*args, **kwargs):
    return invoke_source_function("toRubyIdentifier", *args, **kwargs)

def to_snake(*args, **kwargs):
    return invoke_source_function("toSnake", *args, **kwargs)

def unique_sorted(*args, **kwargs):
    return invoke_source_function("uniqueSorted", *args, **kwargs)


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
