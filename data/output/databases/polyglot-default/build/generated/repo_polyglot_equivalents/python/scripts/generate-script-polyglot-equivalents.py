#!/usr/bin/env python3
"""Auto-generated Python equivalent module proxy."""

from __future__ import annotations

import argparse
import importlib.util
import json
import pathlib
import sys

AIO_SOURCE_JS_FILE = "scripts/generate-script-polyglot-equivalents.js"
AIO_EQUIVALENT_KIND = "repo_module_proxy"
AIO_FUNCTION_TOKENS = [
  "buildCatalog",
  "buildCppSharedRunnerContent",
  "buildCppWrapperContent",
  "buildEquivalentTargets",
  "buildPythonSharedRunnerContent",
  "buildPythonWrapperContent",
  "ensureDirForFile",
  "listGeneratedFiles",
  "listScriptSourceFiles",
  "main",
  "normalizeCatalogForComparison",
  "parseArgs",
  "readText",
  "removeStaleGeneratedFiles",
  "runCheck",
  "runWrite",
  "toPosix",
  "toSnakeCaseBaseName",
  "writeCatalog",
  "writeTargets"
]
AIO_SYMBOL_MAP = {
  "buildCatalog": "build_catalog",
  "buildCppSharedRunnerContent": "build_cpp_shared_runner_content",
  "buildCppWrapperContent": "build_cpp_wrapper_content",
  "buildEquivalentTargets": "build_equivalent_targets",
  "buildPythonSharedRunnerContent": "build_python_shared_runner_content",
  "buildPythonWrapperContent": "build_python_wrapper_content",
  "ensureDirForFile": "ensure_dir_for_file",
  "listGeneratedFiles": "list_generated_files",
  "listScriptSourceFiles": "list_script_source_files",
  "main": "main",
  "normalizeCatalogForComparison": "normalize_catalog_for_comparison",
  "parseArgs": "parse_args",
  "readText": "read_text",
  "removeStaleGeneratedFiles": "remove_stale_generated_files",
  "runCheck": "run_check",
  "runWrite": "run_write",
  "toPosix": "to_posix",
  "toSnakeCaseBaseName": "to_snake_case_base_name",
  "writeCatalog": "write_catalog",
  "writeTargets": "write_targets"
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

def build_cpp_shared_runner_content(*args, **kwargs):
    return invoke_source_function("buildCppSharedRunnerContent", *args, **kwargs)

def build_cpp_wrapper_content(*args, **kwargs):
    return invoke_source_function("buildCppWrapperContent", *args, **kwargs)

def build_equivalent_targets(*args, **kwargs):
    return invoke_source_function("buildEquivalentTargets", *args, **kwargs)

def build_python_shared_runner_content(*args, **kwargs):
    return invoke_source_function("buildPythonSharedRunnerContent", *args, **kwargs)

def build_python_wrapper_content(*args, **kwargs):
    return invoke_source_function("buildPythonWrapperContent", *args, **kwargs)

def ensure_dir_for_file(*args, **kwargs):
    return invoke_source_function("ensureDirForFile", *args, **kwargs)

def list_generated_files(*args, **kwargs):
    return invoke_source_function("listGeneratedFiles", *args, **kwargs)

def list_script_source_files(*args, **kwargs):
    return invoke_source_function("listScriptSourceFiles", *args, **kwargs)

def main(*args, **kwargs):
    return invoke_source_function("main", *args, **kwargs)

def normalize_catalog_for_comparison(*args, **kwargs):
    return invoke_source_function("normalizeCatalogForComparison", *args, **kwargs)

def parse_args(*args, **kwargs):
    return invoke_source_function("parseArgs", *args, **kwargs)

def read_text(*args, **kwargs):
    return invoke_source_function("readText", *args, **kwargs)

def remove_stale_generated_files(*args, **kwargs):
    return invoke_source_function("removeStaleGeneratedFiles", *args, **kwargs)

def run_check(*args, **kwargs):
    return invoke_source_function("runCheck", *args, **kwargs)

def run_write(*args, **kwargs):
    return invoke_source_function("runWrite", *args, **kwargs)

def to_posix(*args, **kwargs):
    return invoke_source_function("toPosix", *args, **kwargs)

def to_snake_case_base_name(*args, **kwargs):
    return invoke_source_function("toSnakeCaseBaseName", *args, **kwargs)

def write_catalog(*args, **kwargs):
    return invoke_source_function("writeCatalog", *args, **kwargs)

def write_targets(*args, **kwargs):
    return invoke_source_function("writeTargets", *args, **kwargs)


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
