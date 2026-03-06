#!/usr/bin/env python3
"""Auto-generated Python equivalent module proxy."""

from __future__ import annotations

import argparse
import importlib.util
import json
import pathlib
import sys

AIO_SOURCE_JS_FILE = "main/normalize_language_bridge_domain.js"
AIO_EQUIVALENT_KIND = "repo_module_proxy"
AIO_FUNCTION_TOKENS = [
  "create_default_language_bridge_state",
  "normalize_entry_links",
  "normalize_glossary",
  "normalize_keyword_index",
  "normalize_language_bridge_state",
  "normalize_machine_descriptor_index",
  "normalize_source_entry",
  "normalize_string_list",
  "normalize_triad_map"
]
AIO_SYMBOL_MAP = {
  "create_default_language_bridge_state": "create_default_language_bridge_state",
  "normalize_entry_links": "normalize_entry_links",
  "normalize_glossary": "normalize_glossary",
  "normalize_keyword_index": "normalize_keyword_index",
  "normalize_language_bridge_state": "normalize_language_bridge_state",
  "normalize_machine_descriptor_index": "normalize_machine_descriptor_index",
  "normalize_source_entry": "normalize_source_entry",
  "normalize_string_list": "normalize_string_list",
  "normalize_triad_map": "normalize_triad_map"
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

def create_default_language_bridge_state(*args, **kwargs):
    return invoke_source_function("create_default_language_bridge_state", *args, **kwargs)

def normalize_entry_links(*args, **kwargs):
    return invoke_source_function("normalize_entry_links", *args, **kwargs)

def normalize_glossary(*args, **kwargs):
    return invoke_source_function("normalize_glossary", *args, **kwargs)

def normalize_keyword_index(*args, **kwargs):
    return invoke_source_function("normalize_keyword_index", *args, **kwargs)

def normalize_language_bridge_state(*args, **kwargs):
    return invoke_source_function("normalize_language_bridge_state", *args, **kwargs)

def normalize_machine_descriptor_index(*args, **kwargs):
    return invoke_source_function("normalize_machine_descriptor_index", *args, **kwargs)

def normalize_source_entry(*args, **kwargs):
    return invoke_source_function("normalize_source_entry", *args, **kwargs)

def normalize_string_list(*args, **kwargs):
    return invoke_source_function("normalize_string_list", *args, **kwargs)

def normalize_triad_map(*args, **kwargs):
    return invoke_source_function("normalize_triad_map", *args, **kwargs)


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
