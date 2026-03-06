#!/usr/bin/env python3
"""Auto-generated Python equivalent module proxy."""

from __future__ import annotations

import argparse
import importlib.util
import json
import pathlib
import sys

AIO_SOURCE_JS_FILE = "main/normalize_core.js"
AIO_EQUIVALENT_KIND = "repo_module_proxy"
AIO_FUNCTION_TOKENS = [
  "build_edge_mode_counts",
  "clamp_number",
  "cleanText",
  "normalize_unique_labels",
  "normalizeEntryMode",
  "normalizeEntryUsageCount",
  "normalizeGraphCoordinate",
  "normalizeLabel",
  "normalizePassword",
  "normalizeUsername",
  "normalizeWordIdentityKey",
  "now_iso",
  "round_positive_milliseconds",
  "to_non_negative_int",
  "to_source_object",
  "toTimestampMs"
]
AIO_SYMBOL_MAP = {
  "build_edge_mode_counts": "build_edge_mode_counts",
  "clamp_number": "clamp_number",
  "cleanText": "clean_text",
  "normalize_unique_labels": "normalize_unique_labels",
  "normalizeEntryMode": "normalize_entry_mode",
  "normalizeEntryUsageCount": "normalize_entry_usage_count",
  "normalizeGraphCoordinate": "normalize_graph_coordinate",
  "normalizeLabel": "normalize_label",
  "normalizePassword": "normalize_password",
  "normalizeUsername": "normalize_username",
  "normalizeWordIdentityKey": "normalize_word_identity_key",
  "now_iso": "now_iso",
  "round_positive_milliseconds": "round_positive_milliseconds",
  "to_non_negative_int": "to_non_negative_int",
  "to_source_object": "to_source_object",
  "toTimestampMs": "to_timestamp_ms"
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

def build_edge_mode_counts(*args, **kwargs):
    return invoke_source_function("build_edge_mode_counts", *args, **kwargs)

def clamp_number(*args, **kwargs):
    return invoke_source_function("clamp_number", *args, **kwargs)

def clean_text(*args, **kwargs):
    return invoke_source_function("cleanText", *args, **kwargs)

def normalize_unique_labels(*args, **kwargs):
    return invoke_source_function("normalize_unique_labels", *args, **kwargs)

def normalize_entry_mode(*args, **kwargs):
    return invoke_source_function("normalizeEntryMode", *args, **kwargs)

def normalize_entry_usage_count(*args, **kwargs):
    return invoke_source_function("normalizeEntryUsageCount", *args, **kwargs)

def normalize_graph_coordinate(*args, **kwargs):
    return invoke_source_function("normalizeGraphCoordinate", *args, **kwargs)

def normalize_label(*args, **kwargs):
    return invoke_source_function("normalizeLabel", *args, **kwargs)

def normalize_password(*args, **kwargs):
    return invoke_source_function("normalizePassword", *args, **kwargs)

def normalize_username(*args, **kwargs):
    return invoke_source_function("normalizeUsername", *args, **kwargs)

def normalize_word_identity_key(*args, **kwargs):
    return invoke_source_function("normalizeWordIdentityKey", *args, **kwargs)

def now_iso(*args, **kwargs):
    return invoke_source_function("now_iso", *args, **kwargs)

def round_positive_milliseconds(*args, **kwargs):
    return invoke_source_function("round_positive_milliseconds", *args, **kwargs)

def to_non_negative_int(*args, **kwargs):
    return invoke_source_function("to_non_negative_int", *args, **kwargs)

def to_source_object(*args, **kwargs):
    return invoke_source_function("to_source_object", *args, **kwargs)

def to_timestamp_ms(*args, **kwargs):
    return invoke_source_function("toTimestampMs", *args, **kwargs)


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
