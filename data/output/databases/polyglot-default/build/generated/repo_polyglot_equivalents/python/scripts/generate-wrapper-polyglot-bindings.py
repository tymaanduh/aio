#!/usr/bin/env python3
"""Auto-generated Python equivalent module proxy."""

from __future__ import annotations

import argparse
import importlib.util
import json
import pathlib
import sys

AIO_SOURCE_JS_FILE = "scripts/generate-wrapper-polyglot-bindings.js"
AIO_EQUIVALENT_KIND = "repo_module_proxy"
AIO_FUNCTION_TOKENS = [
  "buildArtifacts",
  "buildConstMap",
  "buildFunctionEntry",
  "buildWrapperSymbolRegistry",
  "checkArtifacts",
  "checkWrapperBindingArtifacts",
  "computeWrapperValue",
  "generateWrapperBindingArtifacts",
  "main",
  "normalizeBehavior",
  "normalizeBoolean",
  "normalizeText",
  "parseArgs",
  "parseNumericArg",
  "readJson",
  "renderCppHeader",
  "renderCppSource",
  "renderJs",
  "renderPython",
  "renderRuby",
  "renderTs",
  "runWrapperFunction",
  "sortedUnique",
  "stableJson",
  "toCamel",
  "toConstKey",
  "toCppStringLiteral",
  "toSnake",
  "writeArtifacts"
]
AIO_SYMBOL_MAP = {
  "buildArtifacts": "build_artifacts",
  "buildConstMap": "build_const_map",
  "buildFunctionEntry": "build_function_entry",
  "buildWrapperSymbolRegistry": "build_wrapper_symbol_registry",
  "checkArtifacts": "check_artifacts",
  "checkWrapperBindingArtifacts": "check_wrapper_binding_artifacts",
  "computeWrapperValue": "compute_wrapper_value",
  "generateWrapperBindingArtifacts": "generate_wrapper_binding_artifacts",
  "main": "main",
  "normalizeBehavior": "normalize_behavior",
  "normalizeBoolean": "normalize_boolean",
  "normalizeText": "normalize_text",
  "parseArgs": "parse_args",
  "parseNumericArg": "parse_numeric_arg",
  "readJson": "read_json",
  "renderCppHeader": "render_cpp_header",
  "renderCppSource": "render_cpp_source",
  "renderJs": "render_js",
  "renderPython": "render_python",
  "renderRuby": "render_ruby",
  "renderTs": "render_ts",
  "runWrapperFunction": "run_wrapper_function",
  "sortedUnique": "sorted_unique",
  "stableJson": "stable_json",
  "toCamel": "to_camel",
  "toConstKey": "to_const_key",
  "toCppStringLiteral": "to_cpp_string_literal",
  "toSnake": "to_snake",
  "writeArtifacts": "write_artifacts"
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

def build_artifacts(*args, **kwargs):
    return invoke_source_function("buildArtifacts", *args, **kwargs)

def build_const_map(*args, **kwargs):
    return invoke_source_function("buildConstMap", *args, **kwargs)

def build_function_entry(*args, **kwargs):
    return invoke_source_function("buildFunctionEntry", *args, **kwargs)

def build_wrapper_symbol_registry(*args, **kwargs):
    return invoke_source_function("buildWrapperSymbolRegistry", *args, **kwargs)

def check_artifacts(*args, **kwargs):
    return invoke_source_function("checkArtifacts", *args, **kwargs)

def check_wrapper_binding_artifacts(*args, **kwargs):
    return invoke_source_function("checkWrapperBindingArtifacts", *args, **kwargs)

def compute_wrapper_value(*args, **kwargs):
    return invoke_source_function("computeWrapperValue", *args, **kwargs)

def generate_wrapper_binding_artifacts(*args, **kwargs):
    return invoke_source_function("generateWrapperBindingArtifacts", *args, **kwargs)

def main(*args, **kwargs):
    return invoke_source_function("main", *args, **kwargs)

def normalize_behavior(*args, **kwargs):
    return invoke_source_function("normalizeBehavior", *args, **kwargs)

def normalize_boolean(*args, **kwargs):
    return invoke_source_function("normalizeBoolean", *args, **kwargs)

def normalize_text(*args, **kwargs):
    return invoke_source_function("normalizeText", *args, **kwargs)

def parse_args(*args, **kwargs):
    return invoke_source_function("parseArgs", *args, **kwargs)

def parse_numeric_arg(*args, **kwargs):
    return invoke_source_function("parseNumericArg", *args, **kwargs)

def read_json(*args, **kwargs):
    return invoke_source_function("readJson", *args, **kwargs)

def render_cpp_header(*args, **kwargs):
    return invoke_source_function("renderCppHeader", *args, **kwargs)

def render_cpp_source(*args, **kwargs):
    return invoke_source_function("renderCppSource", *args, **kwargs)

def render_js(*args, **kwargs):
    return invoke_source_function("renderJs", *args, **kwargs)

def render_python(*args, **kwargs):
    return invoke_source_function("renderPython", *args, **kwargs)

def render_ruby(*args, **kwargs):
    return invoke_source_function("renderRuby", *args, **kwargs)

def render_ts(*args, **kwargs):
    return invoke_source_function("renderTs", *args, **kwargs)

def run_wrapper_function(*args, **kwargs):
    return invoke_source_function("runWrapperFunction", *args, **kwargs)

def sorted_unique(*args, **kwargs):
    return invoke_source_function("sortedUnique", *args, **kwargs)

def stable_json(*args, **kwargs):
    return invoke_source_function("stableJson", *args, **kwargs)

def to_camel(*args, **kwargs):
    return invoke_source_function("toCamel", *args, **kwargs)

def to_const_key(*args, **kwargs):
    return invoke_source_function("toConstKey", *args, **kwargs)

def to_cpp_string_literal(*args, **kwargs):
    return invoke_source_function("toCppStringLiteral", *args, **kwargs)

def to_snake(*args, **kwargs):
    return invoke_source_function("toSnake", *args, **kwargs)

def write_artifacts(*args, **kwargs):
    return invoke_source_function("writeArtifacts", *args, **kwargs)


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
