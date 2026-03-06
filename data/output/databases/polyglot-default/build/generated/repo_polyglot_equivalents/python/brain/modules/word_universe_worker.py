#!/usr/bin/env python3
"""Auto-generated Python equivalent module proxy."""

from __future__ import annotations

import argparse
import importlib.util
import json
import pathlib
import sys

AIO_SOURCE_JS_FILE = "brain/modules/word_universe_worker.js"
AIO_EQUIVALENT_KIND = "repo_module_proxy"
AIO_FUNCTION_TOKENS = [
  "addEdge",
  "buildComponentSizes",
  "buildContainmentEdges",
  "buildEdges",
  "buildPrefixEdges",
  "buildSameLabelEdges",
  "buildStemEdges",
  "buildSuffixEdges",
  "buildUniverseGraph",
  "cleanText",
  "createEdgeContext",
  "createRng",
  "find",
  "hashString",
  "layoutNodes",
  "normalizeEdgeModes",
  "normalizeLabelList",
  "normalizeStem",
  "normalizeWord",
  "resolvePartOfSpeech",
  "selectNodes",
  "toBooleanScore",
  "toFiniteNumber",
  "union"
]
AIO_SYMBOL_MAP = {
  "addEdge": "add_edge",
  "buildComponentSizes": "build_component_sizes",
  "buildContainmentEdges": "build_containment_edges",
  "buildEdges": "build_edges",
  "buildPrefixEdges": "build_prefix_edges",
  "buildSameLabelEdges": "build_same_label_edges",
  "buildStemEdges": "build_stem_edges",
  "buildSuffixEdges": "build_suffix_edges",
  "buildUniverseGraph": "build_universe_graph",
  "cleanText": "clean_text",
  "createEdgeContext": "create_edge_context",
  "createRng": "create_rng",
  "find": "find",
  "hashString": "hash_string",
  "layoutNodes": "layout_nodes",
  "normalizeEdgeModes": "normalize_edge_modes",
  "normalizeLabelList": "normalize_label_list",
  "normalizeStem": "normalize_stem",
  "normalizeWord": "normalize_word",
  "resolvePartOfSpeech": "resolve_part_of_speech",
  "selectNodes": "select_nodes",
  "toBooleanScore": "to_boolean_score",
  "toFiniteNumber": "to_finite_number",
  "union": "union"
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

def add_edge(*args, **kwargs):
    return invoke_source_function("addEdge", *args, **kwargs)

def build_component_sizes(*args, **kwargs):
    return invoke_source_function("buildComponentSizes", *args, **kwargs)

def build_containment_edges(*args, **kwargs):
    return invoke_source_function("buildContainmentEdges", *args, **kwargs)

def build_edges(*args, **kwargs):
    return invoke_source_function("buildEdges", *args, **kwargs)

def build_prefix_edges(*args, **kwargs):
    return invoke_source_function("buildPrefixEdges", *args, **kwargs)

def build_same_label_edges(*args, **kwargs):
    return invoke_source_function("buildSameLabelEdges", *args, **kwargs)

def build_stem_edges(*args, **kwargs):
    return invoke_source_function("buildStemEdges", *args, **kwargs)

def build_suffix_edges(*args, **kwargs):
    return invoke_source_function("buildSuffixEdges", *args, **kwargs)

def build_universe_graph(*args, **kwargs):
    return invoke_source_function("buildUniverseGraph", *args, **kwargs)

def clean_text(*args, **kwargs):
    return invoke_source_function("cleanText", *args, **kwargs)

def create_edge_context(*args, **kwargs):
    return invoke_source_function("createEdgeContext", *args, **kwargs)

def create_rng(*args, **kwargs):
    return invoke_source_function("createRng", *args, **kwargs)

def find(*args, **kwargs):
    return invoke_source_function("find", *args, **kwargs)

def hash_string(*args, **kwargs):
    return invoke_source_function("hashString", *args, **kwargs)

def layout_nodes(*args, **kwargs):
    return invoke_source_function("layoutNodes", *args, **kwargs)

def normalize_edge_modes(*args, **kwargs):
    return invoke_source_function("normalizeEdgeModes", *args, **kwargs)

def normalize_label_list(*args, **kwargs):
    return invoke_source_function("normalizeLabelList", *args, **kwargs)

def normalize_stem(*args, **kwargs):
    return invoke_source_function("normalizeStem", *args, **kwargs)

def normalize_word(*args, **kwargs):
    return invoke_source_function("normalizeWord", *args, **kwargs)

def resolve_part_of_speech(*args, **kwargs):
    return invoke_source_function("resolvePartOfSpeech", *args, **kwargs)

def select_nodes(*args, **kwargs):
    return invoke_source_function("selectNodes", *args, **kwargs)

def to_boolean_score(*args, **kwargs):
    return invoke_source_function("toBooleanScore", *args, **kwargs)

def to_finite_number(*args, **kwargs):
    return invoke_source_function("toFiniteNumber", *args, **kwargs)

def union(*args, **kwargs):
    return invoke_source_function("union", *args, **kwargs)


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
