#!/usr/bin/env python3
"""Auto-generated Python equivalent module proxy."""

from __future__ import annotations

import argparse
import importlib.util
import json
import pathlib
import sys

AIO_SOURCE_JS_FILE = "brain/wrappers/renderer_universe_selection_domain.js"
AIO_EQUIVALENT_KIND = "repo_module_proxy"
AIO_FUNCTION_TOKENS = [
  "appendNodesToUniverseCustomSet",
  "applyCustomSet",
  "applyUniverseOptionsFromInputs",
  "applyUniversePathFinder",
  "buildUniverseEdgeKey",
  "centerUniverseOnNode",
  "clearUniverseNodeSelection",
  "createUniverseCustomSetFromSelection",
  "exportUniverseGraphJson",
  "exportUniversePng",
  "findPathIndices",
  "fitUniverseCamera",
  "focusNodeIndex",
  "getUniverseDragSelectionIndices",
  "getUniverseNodeDefinitionPreview",
  "getUniverseNodeLinkage",
  "getUniverseNodeOriginLabel",
  "getUniverseSelectedIndicesSorted",
  "getUniverseSelectedNodes",
  "getUniverseVisibleNodeIndices",
  "jumpToUniverseFilter",
  "loadUniverseBookmark",
  "parseUniverseDraggedSelectionPayload",
  "removeUniverseCustomSearchSet",
  "resetUniverseCamera",
  "resolveUniverseCustomSetNodeIndices",
  "saveUniverseBookmark",
  "selectAllUniverseVisibleNodes",
  "setNodeSelectionSet",
  "toggleUniverseEdgeMode",
  "toggleUniverseNodeSelection"
]
AIO_SYMBOL_MAP = {
  "appendNodesToUniverseCustomSet": "append_nodes_to_universe_custom_set",
  "applyCustomSet": "apply_custom_set",
  "applyUniverseOptionsFromInputs": "apply_universe_options_from_inputs",
  "applyUniversePathFinder": "apply_universe_path_finder",
  "buildUniverseEdgeKey": "build_universe_edge_key",
  "centerUniverseOnNode": "center_universe_on_node",
  "clearUniverseNodeSelection": "clear_universe_node_selection",
  "createUniverseCustomSetFromSelection": "create_universe_custom_set_from_selection",
  "exportUniverseGraphJson": "export_universe_graph_json",
  "exportUniversePng": "export_universe_png",
  "findPathIndices": "find_path_indices",
  "fitUniverseCamera": "fit_universe_camera",
  "focusNodeIndex": "focus_node_index",
  "getUniverseDragSelectionIndices": "get_universe_drag_selection_indices",
  "getUniverseNodeDefinitionPreview": "get_universe_node_definition_preview",
  "getUniverseNodeLinkage": "get_universe_node_linkage",
  "getUniverseNodeOriginLabel": "get_universe_node_origin_label",
  "getUniverseSelectedIndicesSorted": "get_universe_selected_indices_sorted",
  "getUniverseSelectedNodes": "get_universe_selected_nodes",
  "getUniverseVisibleNodeIndices": "get_universe_visible_node_indices",
  "jumpToUniverseFilter": "jump_to_universe_filter",
  "loadUniverseBookmark": "load_universe_bookmark",
  "parseUniverseDraggedSelectionPayload": "parse_universe_dragged_selection_payload",
  "removeUniverseCustomSearchSet": "remove_universe_custom_search_set",
  "resetUniverseCamera": "reset_universe_camera",
  "resolveUniverseCustomSetNodeIndices": "resolve_universe_custom_set_node_indices",
  "saveUniverseBookmark": "save_universe_bookmark",
  "selectAllUniverseVisibleNodes": "select_all_universe_visible_nodes",
  "setNodeSelectionSet": "set_node_selection_set",
  "toggleUniverseEdgeMode": "toggle_universe_edge_mode",
  "toggleUniverseNodeSelection": "toggle_universe_node_selection"
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

def append_nodes_to_universe_custom_set(*args, **kwargs):
    return invoke_source_function("appendNodesToUniverseCustomSet", *args, **kwargs)

def apply_custom_set(*args, **kwargs):
    return invoke_source_function("applyCustomSet", *args, **kwargs)

def apply_universe_options_from_inputs(*args, **kwargs):
    return invoke_source_function("applyUniverseOptionsFromInputs", *args, **kwargs)

def apply_universe_path_finder(*args, **kwargs):
    return invoke_source_function("applyUniversePathFinder", *args, **kwargs)

def build_universe_edge_key(*args, **kwargs):
    return invoke_source_function("buildUniverseEdgeKey", *args, **kwargs)

def center_universe_on_node(*args, **kwargs):
    return invoke_source_function("centerUniverseOnNode", *args, **kwargs)

def clear_universe_node_selection(*args, **kwargs):
    return invoke_source_function("clearUniverseNodeSelection", *args, **kwargs)

def create_universe_custom_set_from_selection(*args, **kwargs):
    return invoke_source_function("createUniverseCustomSetFromSelection", *args, **kwargs)

def export_universe_graph_json(*args, **kwargs):
    return invoke_source_function("exportUniverseGraphJson", *args, **kwargs)

def export_universe_png(*args, **kwargs):
    return invoke_source_function("exportUniversePng", *args, **kwargs)

def find_path_indices(*args, **kwargs):
    return invoke_source_function("findPathIndices", *args, **kwargs)

def fit_universe_camera(*args, **kwargs):
    return invoke_source_function("fitUniverseCamera", *args, **kwargs)

def focus_node_index(*args, **kwargs):
    return invoke_source_function("focusNodeIndex", *args, **kwargs)

def get_universe_drag_selection_indices(*args, **kwargs):
    return invoke_source_function("getUniverseDragSelectionIndices", *args, **kwargs)

def get_universe_node_definition_preview(*args, **kwargs):
    return invoke_source_function("getUniverseNodeDefinitionPreview", *args, **kwargs)

def get_universe_node_linkage(*args, **kwargs):
    return invoke_source_function("getUniverseNodeLinkage", *args, **kwargs)

def get_universe_node_origin_label(*args, **kwargs):
    return invoke_source_function("getUniverseNodeOriginLabel", *args, **kwargs)

def get_universe_selected_indices_sorted(*args, **kwargs):
    return invoke_source_function("getUniverseSelectedIndicesSorted", *args, **kwargs)

def get_universe_selected_nodes(*args, **kwargs):
    return invoke_source_function("getUniverseSelectedNodes", *args, **kwargs)

def get_universe_visible_node_indices(*args, **kwargs):
    return invoke_source_function("getUniverseVisibleNodeIndices", *args, **kwargs)

def jump_to_universe_filter(*args, **kwargs):
    return invoke_source_function("jumpToUniverseFilter", *args, **kwargs)

def load_universe_bookmark(*args, **kwargs):
    return invoke_source_function("loadUniverseBookmark", *args, **kwargs)

def parse_universe_dragged_selection_payload(*args, **kwargs):
    return invoke_source_function("parseUniverseDraggedSelectionPayload", *args, **kwargs)

def remove_universe_custom_search_set(*args, **kwargs):
    return invoke_source_function("removeUniverseCustomSearchSet", *args, **kwargs)

def reset_universe_camera(*args, **kwargs):
    return invoke_source_function("resetUniverseCamera", *args, **kwargs)

def resolve_universe_custom_set_node_indices(*args, **kwargs):
    return invoke_source_function("resolveUniverseCustomSetNodeIndices", *args, **kwargs)

def save_universe_bookmark(*args, **kwargs):
    return invoke_source_function("saveUniverseBookmark", *args, **kwargs)

def select_all_universe_visible_nodes(*args, **kwargs):
    return invoke_source_function("selectAllUniverseVisibleNodes", *args, **kwargs)

def set_node_selection_set(*args, **kwargs):
    return invoke_source_function("setNodeSelectionSet", *args, **kwargs)

def toggle_universe_edge_mode(*args, **kwargs):
    return invoke_source_function("toggleUniverseEdgeMode", *args, **kwargs)

def toggle_universe_node_selection(*args, **kwargs):
    return invoke_source_function("toggleUniverseNodeSelection", *args, **kwargs)


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
