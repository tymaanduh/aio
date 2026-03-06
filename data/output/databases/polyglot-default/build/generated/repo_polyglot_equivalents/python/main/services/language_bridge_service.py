#!/usr/bin/env python3
"""Auto-generated Python equivalent module proxy."""

from __future__ import annotations

import argparse
import importlib.util
import json
import pathlib
import sys

AIO_SOURCE_JS_FILE = "main/services/language_bridge_service.js"
AIO_EQUIVALENT_KIND = "repo_module_proxy"
AIO_FUNCTION_TOKENS = [
  "add_array_values",
  "build_descriptor_refs_from_text",
  "build_state_stats",
  "build_triad_id",
  "build_triads",
  "capture_sources",
  "clean_text",
  "clip_snippet",
  "compile_machine_descriptors",
  "create_machine_descriptor_record",
  "ensure_entry_link",
  "extract_code_tokens",
  "extract_english_phrases",
  "extract_english_terms",
  "extract_machine_terms",
  "extract_pseudocode_phrases",
  "get_seed_synonyms",
  "hash_text",
  "index_dictionary_entries",
  "inject_language_bridge_repository",
  "is_code_identifier",
  "link_entry_artifacts",
  "link_entry_refs",
  "load_bridge_state",
  "load_state_internal",
  "lookup_machine_rule",
  "MACHINE_DESCRIPTOR_TERM_RULE_MAP",
  "make_source_id",
  "normalize_key",
  "normalize_machine_term",
  "normalize_spaces",
  "now_iso",
  "process_text_into_artifacts",
  "rank_and_limit_results",
  "save_state_internal",
  "search_glossary",
  "search_keyword",
  "search_machine_descriptor",
  "search_triad",
  "set_dictionary_source",
  "split_sentences",
  "to_array",
  "to_search_limit",
  "unique_strings",
  "upsert_glossary",
  "upsert_keyword",
  "upsert_machine_descriptor",
  "upsert_triad"
]
AIO_SYMBOL_MAP = {
  "add_array_values": "add_array_values",
  "build_descriptor_refs_from_text": "build_descriptor_refs_from_text",
  "build_state_stats": "build_state_stats",
  "build_triad_id": "build_triad_id",
  "build_triads": "build_triads",
  "capture_sources": "capture_sources",
  "clean_text": "clean_text",
  "clip_snippet": "clip_snippet",
  "compile_machine_descriptors": "compile_machine_descriptors",
  "create_machine_descriptor_record": "create_machine_descriptor_record",
  "ensure_entry_link": "ensure_entry_link",
  "extract_code_tokens": "extract_code_tokens",
  "extract_english_phrases": "extract_english_phrases",
  "extract_english_terms": "extract_english_terms",
  "extract_machine_terms": "extract_machine_terms",
  "extract_pseudocode_phrases": "extract_pseudocode_phrases",
  "get_seed_synonyms": "get_seed_synonyms",
  "hash_text": "hash_text",
  "index_dictionary_entries": "index_dictionary_entries",
  "inject_language_bridge_repository": "inject_language_bridge_repository",
  "is_code_identifier": "is_code_identifier",
  "link_entry_artifacts": "link_entry_artifacts",
  "link_entry_refs": "link_entry_refs",
  "load_bridge_state": "load_bridge_state",
  "load_state_internal": "load_state_internal",
  "lookup_machine_rule": "lookup_machine_rule",
  "MACHINE_DESCRIPTOR_TERM_RULE_MAP": "machine_descriptor_term_rule_map",
  "make_source_id": "make_source_id",
  "normalize_key": "normalize_key",
  "normalize_machine_term": "normalize_machine_term",
  "normalize_spaces": "normalize_spaces",
  "now_iso": "now_iso",
  "process_text_into_artifacts": "process_text_into_artifacts",
  "rank_and_limit_results": "rank_and_limit_results",
  "save_state_internal": "save_state_internal",
  "search_glossary": "search_glossary",
  "search_keyword": "search_keyword",
  "search_machine_descriptor": "search_machine_descriptor",
  "search_triad": "search_triad",
  "set_dictionary_source": "set_dictionary_source",
  "split_sentences": "split_sentences",
  "to_array": "to_array",
  "to_search_limit": "to_search_limit",
  "unique_strings": "unique_strings",
  "upsert_glossary": "upsert_glossary",
  "upsert_keyword": "upsert_keyword",
  "upsert_machine_descriptor": "upsert_machine_descriptor",
  "upsert_triad": "upsert_triad"
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

def add_array_values(*args, **kwargs):
    return invoke_source_function("add_array_values", *args, **kwargs)

def build_descriptor_refs_from_text(*args, **kwargs):
    return invoke_source_function("build_descriptor_refs_from_text", *args, **kwargs)

def build_state_stats(*args, **kwargs):
    return invoke_source_function("build_state_stats", *args, **kwargs)

def build_triad_id(*args, **kwargs):
    return invoke_source_function("build_triad_id", *args, **kwargs)

def build_triads(*args, **kwargs):
    return invoke_source_function("build_triads", *args, **kwargs)

def capture_sources(*args, **kwargs):
    return invoke_source_function("capture_sources", *args, **kwargs)

def clean_text(*args, **kwargs):
    return invoke_source_function("clean_text", *args, **kwargs)

def clip_snippet(*args, **kwargs):
    return invoke_source_function("clip_snippet", *args, **kwargs)

def compile_machine_descriptors(*args, **kwargs):
    return invoke_source_function("compile_machine_descriptors", *args, **kwargs)

def create_machine_descriptor_record(*args, **kwargs):
    return invoke_source_function("create_machine_descriptor_record", *args, **kwargs)

def ensure_entry_link(*args, **kwargs):
    return invoke_source_function("ensure_entry_link", *args, **kwargs)

def extract_code_tokens(*args, **kwargs):
    return invoke_source_function("extract_code_tokens", *args, **kwargs)

def extract_english_phrases(*args, **kwargs):
    return invoke_source_function("extract_english_phrases", *args, **kwargs)

def extract_english_terms(*args, **kwargs):
    return invoke_source_function("extract_english_terms", *args, **kwargs)

def extract_machine_terms(*args, **kwargs):
    return invoke_source_function("extract_machine_terms", *args, **kwargs)

def extract_pseudocode_phrases(*args, **kwargs):
    return invoke_source_function("extract_pseudocode_phrases", *args, **kwargs)

def get_seed_synonyms(*args, **kwargs):
    return invoke_source_function("get_seed_synonyms", *args, **kwargs)

def hash_text(*args, **kwargs):
    return invoke_source_function("hash_text", *args, **kwargs)

def index_dictionary_entries(*args, **kwargs):
    return invoke_source_function("index_dictionary_entries", *args, **kwargs)

def inject_language_bridge_repository(*args, **kwargs):
    return invoke_source_function("inject_language_bridge_repository", *args, **kwargs)

def is_code_identifier(*args, **kwargs):
    return invoke_source_function("is_code_identifier", *args, **kwargs)

def link_entry_artifacts(*args, **kwargs):
    return invoke_source_function("link_entry_artifacts", *args, **kwargs)

def link_entry_refs(*args, **kwargs):
    return invoke_source_function("link_entry_refs", *args, **kwargs)

def load_bridge_state(*args, **kwargs):
    return invoke_source_function("load_bridge_state", *args, **kwargs)

def load_state_internal(*args, **kwargs):
    return invoke_source_function("load_state_internal", *args, **kwargs)

def lookup_machine_rule(*args, **kwargs):
    return invoke_source_function("lookup_machine_rule", *args, **kwargs)

def machine_descriptor_term_rule_map(*args, **kwargs):
    return invoke_source_function("MACHINE_DESCRIPTOR_TERM_RULE_MAP", *args, **kwargs)

def make_source_id(*args, **kwargs):
    return invoke_source_function("make_source_id", *args, **kwargs)

def normalize_key(*args, **kwargs):
    return invoke_source_function("normalize_key", *args, **kwargs)

def normalize_machine_term(*args, **kwargs):
    return invoke_source_function("normalize_machine_term", *args, **kwargs)

def normalize_spaces(*args, **kwargs):
    return invoke_source_function("normalize_spaces", *args, **kwargs)

def now_iso(*args, **kwargs):
    return invoke_source_function("now_iso", *args, **kwargs)

def process_text_into_artifacts(*args, **kwargs):
    return invoke_source_function("process_text_into_artifacts", *args, **kwargs)

def rank_and_limit_results(*args, **kwargs):
    return invoke_source_function("rank_and_limit_results", *args, **kwargs)

def save_state_internal(*args, **kwargs):
    return invoke_source_function("save_state_internal", *args, **kwargs)

def search_glossary(*args, **kwargs):
    return invoke_source_function("search_glossary", *args, **kwargs)

def search_keyword(*args, **kwargs):
    return invoke_source_function("search_keyword", *args, **kwargs)

def search_machine_descriptor(*args, **kwargs):
    return invoke_source_function("search_machine_descriptor", *args, **kwargs)

def search_triad(*args, **kwargs):
    return invoke_source_function("search_triad", *args, **kwargs)

def set_dictionary_source(*args, **kwargs):
    return invoke_source_function("set_dictionary_source", *args, **kwargs)

def split_sentences(*args, **kwargs):
    return invoke_source_function("split_sentences", *args, **kwargs)

def to_array(*args, **kwargs):
    return invoke_source_function("to_array", *args, **kwargs)

def to_search_limit(*args, **kwargs):
    return invoke_source_function("to_search_limit", *args, **kwargs)

def unique_strings(*args, **kwargs):
    return invoke_source_function("unique_strings", *args, **kwargs)

def upsert_glossary(*args, **kwargs):
    return invoke_source_function("upsert_glossary", *args, **kwargs)

def upsert_keyword(*args, **kwargs):
    return invoke_source_function("upsert_keyword", *args, **kwargs)

def upsert_machine_descriptor(*args, **kwargs):
    return invoke_source_function("upsert_machine_descriptor", *args, **kwargs)

def upsert_triad(*args, **kwargs):
    return invoke_source_function("upsert_triad", *args, **kwargs)


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
