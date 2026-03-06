#!/usr/bin/env python3
"""Auto-generated Python equivalent module proxy."""

from __future__ import annotations

import argparse
import importlib.util
import json
import pathlib
import sys

AIO_SOURCE_JS_FILE = "brain/wrappers/renderer_ui_shell_domain.js"
AIO_EQUIVALENT_KIND = "repo_module_proxy"
AIO_FUNCTION_TOKENS = [
  "formatSaved",
  "getAuthCredentials",
  "isAuthGateVisible",
  "isElementVisibleForInteraction",
  "normalizeExplorerLayoutMode",
  "resolvePreferredEntryLabel",
  "setAuthGateVisible",
  "setAuthHint",
  "setAuthMode",
  "setExplorerLayoutMode",
  "setHelperText",
  "setStatus",
  "setTreeFolderSelection",
  "syncExplorerLayoutControls"
]
AIO_SYMBOL_MAP = {
  "formatSaved": "format_saved",
  "getAuthCredentials": "get_auth_credentials",
  "isAuthGateVisible": "is_auth_gate_visible",
  "isElementVisibleForInteraction": "is_element_visible_for_interaction",
  "normalizeExplorerLayoutMode": "normalize_explorer_layout_mode",
  "resolvePreferredEntryLabel": "resolve_preferred_entry_label",
  "setAuthGateVisible": "set_auth_gate_visible",
  "setAuthHint": "set_auth_hint",
  "setAuthMode": "set_auth_mode",
  "setExplorerLayoutMode": "set_explorer_layout_mode",
  "setHelperText": "set_helper_text",
  "setStatus": "set_status",
  "setTreeFolderSelection": "set_tree_folder_selection",
  "syncExplorerLayoutControls": "sync_explorer_layout_controls"
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

def format_saved(*args, **kwargs):
    return invoke_source_function("formatSaved", *args, **kwargs)

def get_auth_credentials(*args, **kwargs):
    return invoke_source_function("getAuthCredentials", *args, **kwargs)

def is_auth_gate_visible(*args, **kwargs):
    return invoke_source_function("isAuthGateVisible", *args, **kwargs)

def is_element_visible_for_interaction(*args, **kwargs):
    return invoke_source_function("isElementVisibleForInteraction", *args, **kwargs)

def normalize_explorer_layout_mode(*args, **kwargs):
    return invoke_source_function("normalizeExplorerLayoutMode", *args, **kwargs)

def resolve_preferred_entry_label(*args, **kwargs):
    return invoke_source_function("resolvePreferredEntryLabel", *args, **kwargs)

def set_auth_gate_visible(*args, **kwargs):
    return invoke_source_function("setAuthGateVisible", *args, **kwargs)

def set_auth_hint(*args, **kwargs):
    return invoke_source_function("setAuthHint", *args, **kwargs)

def set_auth_mode(*args, **kwargs):
    return invoke_source_function("setAuthMode", *args, **kwargs)

def set_explorer_layout_mode(*args, **kwargs):
    return invoke_source_function("setExplorerLayoutMode", *args, **kwargs)

def set_helper_text(*args, **kwargs):
    return invoke_source_function("setHelperText", *args, **kwargs)

def set_status(*args, **kwargs):
    return invoke_source_function("setStatus", *args, **kwargs)

def set_tree_folder_selection(*args, **kwargs):
    return invoke_source_function("setTreeFolderSelection", *args, **kwargs)

def sync_explorer_layout_controls(*args, **kwargs):
    return invoke_source_function("syncExplorerLayoutControls", *args, **kwargs)


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
