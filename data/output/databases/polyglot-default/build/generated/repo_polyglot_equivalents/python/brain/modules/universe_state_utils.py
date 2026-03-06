#!/usr/bin/env python3
"""Auto-generated Python equivalent module proxy."""

from __future__ import annotations

import argparse
import importlib.util
import json
import pathlib
import sys

AIO_SOURCE_JS_FILE = "brain/modules/universe_state_utils.js"
AIO_EQUIVALENT_KIND = "repo_module_proxy"
AIO_FUNCTION_TOKENS = [
  "clampNumber",
  "cleanText",
  "createDefaultUniverseConfig",
  "createEmptyUniverseGraph",
  "createFallbackId",
  "createUniverseStateTools",
  "getUniverseDatasetSignature",
  "inferQuestionBucketFromLabels",
  "normalizeConfig",
  "normalizeEntryMode",
  "normalizeLabelArray",
  "normalizeUniverseBookmark",
  "normalizeUniverseCustomSearchSet",
  "normalizeUniverseCustomSearchSets",
  "normalizeUniverseGraph",
  "normalizeWordLower",
  "unique"
]
AIO_SYMBOL_MAP = {
  "clampNumber": "clamp_number",
  "cleanText": "clean_text",
  "createDefaultUniverseConfig": "create_default_universe_config",
  "createEmptyUniverseGraph": "create_empty_universe_graph",
  "createFallbackId": "create_fallback_id",
  "createUniverseStateTools": "create_universe_state_tools",
  "getUniverseDatasetSignature": "get_universe_dataset_signature",
  "inferQuestionBucketFromLabels": "infer_question_bucket_from_labels",
  "normalizeConfig": "normalize_config",
  "normalizeEntryMode": "normalize_entry_mode",
  "normalizeLabelArray": "normalize_label_array",
  "normalizeUniverseBookmark": "normalize_universe_bookmark",
  "normalizeUniverseCustomSearchSet": "normalize_universe_custom_search_set",
  "normalizeUniverseCustomSearchSets": "normalize_universe_custom_search_sets",
  "normalizeUniverseGraph": "normalize_universe_graph",
  "normalizeWordLower": "normalize_word_lower",
  "unique": "unique"
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

def clamp_number(*args, **kwargs):
    return invoke_source_function("clampNumber", *args, **kwargs)

def clean_text(*args, **kwargs):
    return invoke_source_function("cleanText", *args, **kwargs)

def create_default_universe_config(*args, **kwargs):
    return invoke_source_function("createDefaultUniverseConfig", *args, **kwargs)

def create_empty_universe_graph(*args, **kwargs):
    return invoke_source_function("createEmptyUniverseGraph", *args, **kwargs)

def create_fallback_id(*args, **kwargs):
    return invoke_source_function("createFallbackId", *args, **kwargs)

def create_universe_state_tools(*args, **kwargs):
    return invoke_source_function("createUniverseStateTools", *args, **kwargs)

def get_universe_dataset_signature(*args, **kwargs):
    return invoke_source_function("getUniverseDatasetSignature", *args, **kwargs)

def infer_question_bucket_from_labels(*args, **kwargs):
    return invoke_source_function("inferQuestionBucketFromLabels", *args, **kwargs)

def normalize_config(*args, **kwargs):
    return invoke_source_function("normalizeConfig", *args, **kwargs)

def normalize_entry_mode(*args, **kwargs):
    return invoke_source_function("normalizeEntryMode", *args, **kwargs)

def normalize_label_array(*args, **kwargs):
    return invoke_source_function("normalizeLabelArray", *args, **kwargs)

def normalize_universe_bookmark(*args, **kwargs):
    return invoke_source_function("normalizeUniverseBookmark", *args, **kwargs)

def normalize_universe_custom_search_set(*args, **kwargs):
    return invoke_source_function("normalizeUniverseCustomSearchSet", *args, **kwargs)

def normalize_universe_custom_search_sets(*args, **kwargs):
    return invoke_source_function("normalizeUniverseCustomSearchSets", *args, **kwargs)

def normalize_universe_graph(*args, **kwargs):
    return invoke_source_function("normalizeUniverseGraph", *args, **kwargs)

def normalize_word_lower(*args, **kwargs):
    return invoke_source_function("normalizeWordLower", *args, **kwargs)

def unique(*args, **kwargs):
    return invoke_source_function("unique", *args, **kwargs)


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
