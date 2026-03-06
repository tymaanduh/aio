#!/usr/bin/env python3
"""Auto-generated Python equivalent module proxy."""

from __future__ import annotations

import argparse
import importlib.util
import json
import pathlib
import sys

AIO_SOURCE_JS_FILE = "brain/wrappers/renderer_sentence_domain.js"
AIO_EQUIVALENT_KIND = "repo_module_proxy"
AIO_FUNCTION_TOKENS = [
  "addSuggestedNode",
  "addSuggestedPhrase",
  "analyzeGraphQuality",
  "autoCompleteFromSelectedNode",
  "buildAutoCompletePlan",
  "buildPhraseFromPattern",
  "buildSentencePreviewLines",
  "collectPhraseSuggestionsForContext",
  "collectStarterWordSuggestions",
  "collectWordSuggestionsForContext",
  "getSentenceSuggestions",
  "push",
  "pushPhrase",
  "pushSuggestion",
  "renderMiniMap",
  "renderSentenceGraph",
  "traverse",
  "visit",
  "walk"
]
AIO_SYMBOL_MAP = {
  "addSuggestedNode": "add_suggested_node",
  "addSuggestedPhrase": "add_suggested_phrase",
  "analyzeGraphQuality": "analyze_graph_quality",
  "autoCompleteFromSelectedNode": "auto_complete_from_selected_node",
  "buildAutoCompletePlan": "build_auto_complete_plan",
  "buildPhraseFromPattern": "build_phrase_from_pattern",
  "buildSentencePreviewLines": "build_sentence_preview_lines",
  "collectPhraseSuggestionsForContext": "collect_phrase_suggestions_for_context",
  "collectStarterWordSuggestions": "collect_starter_word_suggestions",
  "collectWordSuggestionsForContext": "collect_word_suggestions_for_context",
  "getSentenceSuggestions": "get_sentence_suggestions",
  "push": "push",
  "pushPhrase": "push_phrase",
  "pushSuggestion": "push_suggestion",
  "renderMiniMap": "render_mini_map",
  "renderSentenceGraph": "render_sentence_graph",
  "traverse": "traverse",
  "visit": "visit",
  "walk": "walk"
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

def add_suggested_node(*args, **kwargs):
    return invoke_source_function("addSuggestedNode", *args, **kwargs)

def add_suggested_phrase(*args, **kwargs):
    return invoke_source_function("addSuggestedPhrase", *args, **kwargs)

def analyze_graph_quality(*args, **kwargs):
    return invoke_source_function("analyzeGraphQuality", *args, **kwargs)

def auto_complete_from_selected_node(*args, **kwargs):
    return invoke_source_function("autoCompleteFromSelectedNode", *args, **kwargs)

def build_auto_complete_plan(*args, **kwargs):
    return invoke_source_function("buildAutoCompletePlan", *args, **kwargs)

def build_phrase_from_pattern(*args, **kwargs):
    return invoke_source_function("buildPhraseFromPattern", *args, **kwargs)

def build_sentence_preview_lines(*args, **kwargs):
    return invoke_source_function("buildSentencePreviewLines", *args, **kwargs)

def collect_phrase_suggestions_for_context(*args, **kwargs):
    return invoke_source_function("collectPhraseSuggestionsForContext", *args, **kwargs)

def collect_starter_word_suggestions(*args, **kwargs):
    return invoke_source_function("collectStarterWordSuggestions", *args, **kwargs)

def collect_word_suggestions_for_context(*args, **kwargs):
    return invoke_source_function("collectWordSuggestionsForContext", *args, **kwargs)

def get_sentence_suggestions(*args, **kwargs):
    return invoke_source_function("getSentenceSuggestions", *args, **kwargs)

def push(*args, **kwargs):
    return invoke_source_function("push", *args, **kwargs)

def push_phrase(*args, **kwargs):
    return invoke_source_function("pushPhrase", *args, **kwargs)

def push_suggestion(*args, **kwargs):
    return invoke_source_function("pushSuggestion", *args, **kwargs)

def render_mini_map(*args, **kwargs):
    return invoke_source_function("renderMiniMap", *args, **kwargs)

def render_sentence_graph(*args, **kwargs):
    return invoke_source_function("renderSentenceGraph", *args, **kwargs)

def traverse(*args, **kwargs):
    return invoke_source_function("traverse", *args, **kwargs)

def visit(*args, **kwargs):
    return invoke_source_function("visit", *args, **kwargs)

def walk(*args, **kwargs):
    return invoke_source_function("walk", *args, **kwargs)


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
