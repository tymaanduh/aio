#!/usr/bin/env python3
"""Auto-generated Python equivalent module proxy."""

from __future__ import annotations

import argparse
import importlib.util
import json
import pathlib
import sys

AIO_SOURCE_JS_FILE = "brain/modules/store.js"
AIO_EQUIVALENT_KIND = "repo_module_proxy"
AIO_FUNCTION_TOKENS = [
  "addEntry",
  "addGraphLink",
  "addGraphNode",
  "addLabel",
  "callHook",
  "createStateStore",
  "mutateEntries",
  "mutateGraph",
  "mutateLabels",
  "notifyMutated",
  "removeEntryById",
  "removeLabel",
  "setEntries",
  "setGraph",
  "setHooks",
  "setLabels",
  "updateEntryById",
  "updateState"
]
AIO_SYMBOL_MAP = {
  "addEntry": "add_entry",
  "addGraphLink": "add_graph_link",
  "addGraphNode": "add_graph_node",
  "addLabel": "add_label",
  "callHook": "call_hook",
  "createStateStore": "create_state_store",
  "mutateEntries": "mutate_entries",
  "mutateGraph": "mutate_graph",
  "mutateLabels": "mutate_labels",
  "notifyMutated": "notify_mutated",
  "removeEntryById": "remove_entry_by_id",
  "removeLabel": "remove_label",
  "setEntries": "set_entries",
  "setGraph": "set_graph",
  "setHooks": "set_hooks",
  "setLabels": "set_labels",
  "updateEntryById": "update_entry_by_id",
  "updateState": "update_state"
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

def add_entry(*args, **kwargs):
    return invoke_source_function("addEntry", *args, **kwargs)

def add_graph_link(*args, **kwargs):
    return invoke_source_function("addGraphLink", *args, **kwargs)

def add_graph_node(*args, **kwargs):
    return invoke_source_function("addGraphNode", *args, **kwargs)

def add_label(*args, **kwargs):
    return invoke_source_function("addLabel", *args, **kwargs)

def call_hook(*args, **kwargs):
    return invoke_source_function("callHook", *args, **kwargs)

def create_state_store(*args, **kwargs):
    return invoke_source_function("createStateStore", *args, **kwargs)

def mutate_entries(*args, **kwargs):
    return invoke_source_function("mutateEntries", *args, **kwargs)

def mutate_graph(*args, **kwargs):
    return invoke_source_function("mutateGraph", *args, **kwargs)

def mutate_labels(*args, **kwargs):
    return invoke_source_function("mutateLabels", *args, **kwargs)

def notify_mutated(*args, **kwargs):
    return invoke_source_function("notifyMutated", *args, **kwargs)

def remove_entry_by_id(*args, **kwargs):
    return invoke_source_function("removeEntryById", *args, **kwargs)

def remove_label(*args, **kwargs):
    return invoke_source_function("removeLabel", *args, **kwargs)

def set_entries(*args, **kwargs):
    return invoke_source_function("setEntries", *args, **kwargs)

def set_graph(*args, **kwargs):
    return invoke_source_function("setGraph", *args, **kwargs)

def set_hooks(*args, **kwargs):
    return invoke_source_function("setHooks", *args, **kwargs)

def set_labels(*args, **kwargs):
    return invoke_source_function("setLabels", *args, **kwargs)

def update_entry_by_id(*args, **kwargs):
    return invoke_source_function("updateEntryById", *args, **kwargs)

def update_state(*args, **kwargs):
    return invoke_source_function("updateState", *args, **kwargs)


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
