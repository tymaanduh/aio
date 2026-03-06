#!/usr/bin/env python3
"""Auto-generated Python equivalent module proxy."""

from __future__ import annotations

import argparse
import importlib.util
import json
import pathlib
import sys

AIO_SOURCE_JS_FILE = "brain/wrappers/renderer_selection_domain.js"
AIO_EQUIVALENT_KIND = "repo_module_proxy"
AIO_FUNCTION_TOKENS = [
  "clearEntrySelections",
  "focusEntryWithoutUsage",
  "getEntryById",
  "getGraphEntryIdSet",
  "getSelectedEntries",
  "getVisibleTreeEntries",
  "selectEntryRange",
  "setSingleEntrySelection",
  "syncSelectionWithEntry",
  "toggleEntrySelection"
]
AIO_SYMBOL_MAP = {
  "clearEntrySelections": "clear_entry_selections",
  "focusEntryWithoutUsage": "focus_entry_without_usage",
  "getEntryById": "get_entry_by_id",
  "getGraphEntryIdSet": "get_graph_entry_id_set",
  "getSelectedEntries": "get_selected_entries",
  "getVisibleTreeEntries": "get_visible_tree_entries",
  "selectEntryRange": "select_entry_range",
  "setSingleEntrySelection": "set_single_entry_selection",
  "syncSelectionWithEntry": "sync_selection_with_entry",
  "toggleEntrySelection": "toggle_entry_selection"
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

def clear_entry_selections(*args, **kwargs):
    return invoke_source_function("clearEntrySelections", *args, **kwargs)

def focus_entry_without_usage(*args, **kwargs):
    return invoke_source_function("focusEntryWithoutUsage", *args, **kwargs)

def get_entry_by_id(*args, **kwargs):
    return invoke_source_function("getEntryById", *args, **kwargs)

def get_graph_entry_id_set(*args, **kwargs):
    return invoke_source_function("getGraphEntryIdSet", *args, **kwargs)

def get_selected_entries(*args, **kwargs):
    return invoke_source_function("getSelectedEntries", *args, **kwargs)

def get_visible_tree_entries(*args, **kwargs):
    return invoke_source_function("getVisibleTreeEntries", *args, **kwargs)

def select_entry_range(*args, **kwargs):
    return invoke_source_function("selectEntryRange", *args, **kwargs)

def set_single_entry_selection(*args, **kwargs):
    return invoke_source_function("setSingleEntrySelection", *args, **kwargs)

def sync_selection_with_entry(*args, **kwargs):
    return invoke_source_function("syncSelectionWithEntry", *args, **kwargs)

def toggle_entry_selection(*args, **kwargs):
    return invoke_source_function("toggleEntrySelection", *args, **kwargs)


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
