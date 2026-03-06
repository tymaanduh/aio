#!/usr/bin/env python3
"""Auto-generated Python equivalent module proxy."""

from __future__ import annotations

import argparse
import importlib.util
import json
import pathlib
import sys

AIO_SOURCE_JS_FILE = "brain/modules/renderer_text_utils.js"
AIO_EQUIVALENT_KIND = "repo_module_proxy"
AIO_FUNCTION_TOKENS = [
  "cleanText",
  "collectRuleLabels",
  "createRendererTextUtils",
  "detectPosConflicts",
  "getBytesWarningText",
  "hasPatternMatch",
  "inferLabelsFromDefinition",
  "inferQuestionLabelsFromDefinition",
  "isBytesMode",
  "isBytesPayloadLike",
  "isCodeLikeMode",
  "isPartOfSpeechLabel",
  "keyForCategory",
  "keyForLabel",
  "normalizeEntryLanguage",
  "normalizeEntryMode",
  "normalizeLabel",
  "normalizeLabelArray",
  "normalizeWordLower",
  "nowIso",
  "parseLabels",
  "resolveEntryModeLabelHint",
  "resolveEntryModePlaceholder",
  "sanitizeDefinitionText",
  "shouldInferModeLabels",
  "unique"
]
AIO_SYMBOL_MAP = {
  "cleanText": "clean_text",
  "collectRuleLabels": "collect_rule_labels",
  "createRendererTextUtils": "create_renderer_text_utils",
  "detectPosConflicts": "detect_pos_conflicts",
  "getBytesWarningText": "get_bytes_warning_text",
  "hasPatternMatch": "has_pattern_match",
  "inferLabelsFromDefinition": "infer_labels_from_definition",
  "inferQuestionLabelsFromDefinition": "infer_question_labels_from_definition",
  "isBytesMode": "is_bytes_mode",
  "isBytesPayloadLike": "is_bytes_payload_like",
  "isCodeLikeMode": "is_code_like_mode",
  "isPartOfSpeechLabel": "is_part_of_speech_label",
  "keyForCategory": "key_for_category",
  "keyForLabel": "key_for_label",
  "normalizeEntryLanguage": "normalize_entry_language",
  "normalizeEntryMode": "normalize_entry_mode",
  "normalizeLabel": "normalize_label",
  "normalizeLabelArray": "normalize_label_array",
  "normalizeWordLower": "normalize_word_lower",
  "nowIso": "now_iso",
  "parseLabels": "parse_labels",
  "resolveEntryModeLabelHint": "resolve_entry_mode_label_hint",
  "resolveEntryModePlaceholder": "resolve_entry_mode_placeholder",
  "sanitizeDefinitionText": "sanitize_definition_text",
  "shouldInferModeLabels": "should_infer_mode_labels",
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

def clean_text(*args, **kwargs):
    return invoke_source_function("cleanText", *args, **kwargs)

def collect_rule_labels(*args, **kwargs):
    return invoke_source_function("collectRuleLabels", *args, **kwargs)

def create_renderer_text_utils(*args, **kwargs):
    return invoke_source_function("createRendererTextUtils", *args, **kwargs)

def detect_pos_conflicts(*args, **kwargs):
    return invoke_source_function("detectPosConflicts", *args, **kwargs)

def get_bytes_warning_text(*args, **kwargs):
    return invoke_source_function("getBytesWarningText", *args, **kwargs)

def has_pattern_match(*args, **kwargs):
    return invoke_source_function("hasPatternMatch", *args, **kwargs)

def infer_labels_from_definition(*args, **kwargs):
    return invoke_source_function("inferLabelsFromDefinition", *args, **kwargs)

def infer_question_labels_from_definition(*args, **kwargs):
    return invoke_source_function("inferQuestionLabelsFromDefinition", *args, **kwargs)

def is_bytes_mode(*args, **kwargs):
    return invoke_source_function("isBytesMode", *args, **kwargs)

def is_bytes_payload_like(*args, **kwargs):
    return invoke_source_function("isBytesPayloadLike", *args, **kwargs)

def is_code_like_mode(*args, **kwargs):
    return invoke_source_function("isCodeLikeMode", *args, **kwargs)

def is_part_of_speech_label(*args, **kwargs):
    return invoke_source_function("isPartOfSpeechLabel", *args, **kwargs)

def key_for_category(*args, **kwargs):
    return invoke_source_function("keyForCategory", *args, **kwargs)

def key_for_label(*args, **kwargs):
    return invoke_source_function("keyForLabel", *args, **kwargs)

def normalize_entry_language(*args, **kwargs):
    return invoke_source_function("normalizeEntryLanguage", *args, **kwargs)

def normalize_entry_mode(*args, **kwargs):
    return invoke_source_function("normalizeEntryMode", *args, **kwargs)

def normalize_label(*args, **kwargs):
    return invoke_source_function("normalizeLabel", *args, **kwargs)

def normalize_label_array(*args, **kwargs):
    return invoke_source_function("normalizeLabelArray", *args, **kwargs)

def normalize_word_lower(*args, **kwargs):
    return invoke_source_function("normalizeWordLower", *args, **kwargs)

def now_iso(*args, **kwargs):
    return invoke_source_function("nowIso", *args, **kwargs)

def parse_labels(*args, **kwargs):
    return invoke_source_function("parseLabels", *args, **kwargs)

def resolve_entry_mode_label_hint(*args, **kwargs):
    return invoke_source_function("resolveEntryModeLabelHint", *args, **kwargs)

def resolve_entry_mode_placeholder(*args, **kwargs):
    return invoke_source_function("resolveEntryModePlaceholder", *args, **kwargs)

def sanitize_definition_text(*args, **kwargs):
    return invoke_source_function("sanitizeDefinitionText", *args, **kwargs)

def should_infer_mode_labels(*args, **kwargs):
    return invoke_source_function("shouldInferModeLabels", *args, **kwargs)

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
