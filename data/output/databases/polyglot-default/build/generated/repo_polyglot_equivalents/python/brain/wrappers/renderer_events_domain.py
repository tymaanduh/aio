#!/usr/bin/env python3
"""Auto-generated Python equivalent module proxy."""

from __future__ import annotations

import argparse
import importlib.util
import json
import pathlib
import sys

AIO_SOURCE_JS_FILE = "brain/wrappers/renderer_events_domain.js"
AIO_EQUIVALENT_KIND = "repo_module_proxy"
AIO_FUNCTION_TOKENS = [
  "applyTreeEntrySelection",
  "bindEvents",
  "handleContextAction",
  "handleSuggestionAction",
  "handleTreeAction",
  "submitBulkImport"
]
AIO_SYMBOL_MAP = {
  "applyTreeEntrySelection": "apply_tree_entry_selection",
  "bindEvents": "bind_events",
  "handleContextAction": "handle_context_action",
  "handleSuggestionAction": "handle_suggestion_action",
  "handleTreeAction": "handle_tree_action",
  "submitBulkImport": "submit_bulk_import"
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

def apply_tree_entry_selection(*args, **kwargs):
    return invoke_source_function("applyTreeEntrySelection", *args, **kwargs)

def bind_events(*args, **kwargs):
    return invoke_source_function("bindEvents", *args, **kwargs)

def handle_context_action(*args, **kwargs):
    return invoke_source_function("handleContextAction", *args, **kwargs)

def handle_suggestion_action(*args, **kwargs):
    return invoke_source_function("handleSuggestionAction", *args, **kwargs)

def handle_tree_action(*args, **kwargs):
    return invoke_source_function("handleTreeAction", *args, **kwargs)

def submit_bulk_import(*args, **kwargs):
    return invoke_source_function("submitBulkImport", *args, **kwargs)


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
