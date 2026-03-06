#!/usr/bin/env python3
"""Auto-generated Python equivalent module proxy."""

from __future__ import annotations

import argparse
import importlib.util
import json
import pathlib
import sys

AIO_SOURCE_JS_FILE = "scripts/generate-uiux-blueprint.js"
AIO_EQUIVALENT_KIND = "repo_module_proxy"
AIO_FUNCTION_TOKENS = [
  "analyze",
  "buildBlueprintMarkdown",
  "buildRecommendations",
  "ensureDirForFile",
  "issue",
  "main",
  "normalizePath",
  "normalizeText",
  "parseArgs",
  "readJson",
  "validateColorRoles",
  "validateComponentTaxonomy",
  "validateLayoutErgonomics",
  "validateMeasurementPlan",
  "validateUserPreferences",
  "writeOutputs"
]
AIO_SYMBOL_MAP = {
  "analyze": "analyze",
  "buildBlueprintMarkdown": "build_blueprint_markdown",
  "buildRecommendations": "build_recommendations",
  "ensureDirForFile": "ensure_dir_for_file",
  "issue": "issue",
  "main": "main",
  "normalizePath": "normalize_path",
  "normalizeText": "normalize_text",
  "parseArgs": "parse_args",
  "readJson": "read_json",
  "validateColorRoles": "validate_color_roles",
  "validateComponentTaxonomy": "validate_component_taxonomy",
  "validateLayoutErgonomics": "validate_layout_ergonomics",
  "validateMeasurementPlan": "validate_measurement_plan",
  "validateUserPreferences": "validate_user_preferences",
  "writeOutputs": "write_outputs"
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

def build_blueprint_markdown(*args, **kwargs):
    return invoke_source_function("buildBlueprintMarkdown", *args, **kwargs)

def build_recommendations(*args, **kwargs):
    return invoke_source_function("buildRecommendations", *args, **kwargs)

def ensure_dir_for_file(*args, **kwargs):
    return invoke_source_function("ensureDirForFile", *args, **kwargs)

def issue(*args, **kwargs):
    return invoke_source_function("issue", *args, **kwargs)

def main(*args, **kwargs):
    return invoke_source_function("main", *args, **kwargs)

def normalize_path(*args, **kwargs):
    return invoke_source_function("normalizePath", *args, **kwargs)

def normalize_text(*args, **kwargs):
    return invoke_source_function("normalizeText", *args, **kwargs)

def parse_args(*args, **kwargs):
    return invoke_source_function("parseArgs", *args, **kwargs)

def read_json(*args, **kwargs):
    return invoke_source_function("readJson", *args, **kwargs)

def validate_color_roles(*args, **kwargs):
    return invoke_source_function("validateColorRoles", *args, **kwargs)

def validate_component_taxonomy(*args, **kwargs):
    return invoke_source_function("validateComponentTaxonomy", *args, **kwargs)

def validate_layout_ergonomics(*args, **kwargs):
    return invoke_source_function("validateLayoutErgonomics", *args, **kwargs)

def validate_measurement_plan(*args, **kwargs):
    return invoke_source_function("validateMeasurementPlan", *args, **kwargs)

def validate_user_preferences(*args, **kwargs):
    return invoke_source_function("validateUserPreferences", *args, **kwargs)

def write_outputs(*args, **kwargs):
    return invoke_source_function("writeOutputs", *args, **kwargs)


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
