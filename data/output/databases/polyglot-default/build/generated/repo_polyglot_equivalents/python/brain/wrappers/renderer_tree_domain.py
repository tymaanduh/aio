#!/usr/bin/env python3
"""Auto-generated Python equivalent module proxy."""

from __future__ import annotations

import argparse
import importlib.util
import json
import pathlib
import sys

AIO_SOURCE_JS_FILE = "brain/wrappers/renderer_tree_domain.js"
AIO_EQUIVALENT_KIND = "repo_module_proxy"
AIO_FUNCTION_TOKENS = [
  "buildActivityGroup",
  "buildEntryFilterContext",
  "buildGroupDescriptor",
  "buildLabelGroup",
  "buildTreeModel",
  "captureBatchWordsFromQuickInput",
  "captureSingleWord",
  "captureWordFromQuickInput",
  "collapseAllGroups",
  "createCategoryGroup",
  "createFileRow",
  "createTreeGroup",
  "createVirtualizedFileList",
  "entryPassesAdvancedFilters",
  "expandAllGroups",
  "getAllGroupKeys",
  "getFilteredArchivedEntries",
  "getTopLabelCount",
  "getTopTreeLabels",
  "onAllSelect",
  "onLabelSelect",
  "parseQuickBatchWords",
  "parseSentenceInputWords",
  "purgeFilteredArchivedEntries",
  "renderArchivePanel",
  "renderTopLabelBar",
  "renderTree",
  "renderTreeSummary",
  "renderVirtualizedGroupRows",
  "restoreFilteredArchivedEntries",
  "selectTopLabel",
  "selectTopLabelByIndex"
]
AIO_SYMBOL_MAP = {
  "buildActivityGroup": "build_activity_group",
  "buildEntryFilterContext": "build_entry_filter_context",
  "buildGroupDescriptor": "build_group_descriptor",
  "buildLabelGroup": "build_label_group",
  "buildTreeModel": "build_tree_model",
  "captureBatchWordsFromQuickInput": "capture_batch_words_from_quick_input",
  "captureSingleWord": "capture_single_word",
  "captureWordFromQuickInput": "capture_word_from_quick_input",
  "collapseAllGroups": "collapse_all_groups",
  "createCategoryGroup": "create_category_group",
  "createFileRow": "create_file_row",
  "createTreeGroup": "create_tree_group",
  "createVirtualizedFileList": "create_virtualized_file_list",
  "entryPassesAdvancedFilters": "entry_passes_advanced_filters",
  "expandAllGroups": "expand_all_groups",
  "getAllGroupKeys": "get_all_group_keys",
  "getFilteredArchivedEntries": "get_filtered_archived_entries",
  "getTopLabelCount": "get_top_label_count",
  "getTopTreeLabels": "get_top_tree_labels",
  "onAllSelect": "on_all_select",
  "onLabelSelect": "on_label_select",
  "parseQuickBatchWords": "parse_quick_batch_words",
  "parseSentenceInputWords": "parse_sentence_input_words",
  "purgeFilteredArchivedEntries": "purge_filtered_archived_entries",
  "renderArchivePanel": "render_archive_panel",
  "renderTopLabelBar": "render_top_label_bar",
  "renderTree": "render_tree",
  "renderTreeSummary": "render_tree_summary",
  "renderVirtualizedGroupRows": "render_virtualized_group_rows",
  "restoreFilteredArchivedEntries": "restore_filtered_archived_entries",
  "selectTopLabel": "select_top_label",
  "selectTopLabelByIndex": "select_top_label_by_index"
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

def build_activity_group(*args, **kwargs):
    return invoke_source_function("buildActivityGroup", *args, **kwargs)

def build_entry_filter_context(*args, **kwargs):
    return invoke_source_function("buildEntryFilterContext", *args, **kwargs)

def build_group_descriptor(*args, **kwargs):
    return invoke_source_function("buildGroupDescriptor", *args, **kwargs)

def build_label_group(*args, **kwargs):
    return invoke_source_function("buildLabelGroup", *args, **kwargs)

def build_tree_model(*args, **kwargs):
    return invoke_source_function("buildTreeModel", *args, **kwargs)

def capture_batch_words_from_quick_input(*args, **kwargs):
    return invoke_source_function("captureBatchWordsFromQuickInput", *args, **kwargs)

def capture_single_word(*args, **kwargs):
    return invoke_source_function("captureSingleWord", *args, **kwargs)

def capture_word_from_quick_input(*args, **kwargs):
    return invoke_source_function("captureWordFromQuickInput", *args, **kwargs)

def collapse_all_groups(*args, **kwargs):
    return invoke_source_function("collapseAllGroups", *args, **kwargs)

def create_category_group(*args, **kwargs):
    return invoke_source_function("createCategoryGroup", *args, **kwargs)

def create_file_row(*args, **kwargs):
    return invoke_source_function("createFileRow", *args, **kwargs)

def create_tree_group(*args, **kwargs):
    return invoke_source_function("createTreeGroup", *args, **kwargs)

def create_virtualized_file_list(*args, **kwargs):
    return invoke_source_function("createVirtualizedFileList", *args, **kwargs)

def entry_passes_advanced_filters(*args, **kwargs):
    return invoke_source_function("entryPassesAdvancedFilters", *args, **kwargs)

def expand_all_groups(*args, **kwargs):
    return invoke_source_function("expandAllGroups", *args, **kwargs)

def get_all_group_keys(*args, **kwargs):
    return invoke_source_function("getAllGroupKeys", *args, **kwargs)

def get_filtered_archived_entries(*args, **kwargs):
    return invoke_source_function("getFilteredArchivedEntries", *args, **kwargs)

def get_top_label_count(*args, **kwargs):
    return invoke_source_function("getTopLabelCount", *args, **kwargs)

def get_top_tree_labels(*args, **kwargs):
    return invoke_source_function("getTopTreeLabels", *args, **kwargs)

def on_all_select(*args, **kwargs):
    return invoke_source_function("onAllSelect", *args, **kwargs)

def on_label_select(*args, **kwargs):
    return invoke_source_function("onLabelSelect", *args, **kwargs)

def parse_quick_batch_words(*args, **kwargs):
    return invoke_source_function("parseQuickBatchWords", *args, **kwargs)

def parse_sentence_input_words(*args, **kwargs):
    return invoke_source_function("parseSentenceInputWords", *args, **kwargs)

def purge_filtered_archived_entries(*args, **kwargs):
    return invoke_source_function("purgeFilteredArchivedEntries", *args, **kwargs)

def render_archive_panel(*args, **kwargs):
    return invoke_source_function("renderArchivePanel", *args, **kwargs)

def render_top_label_bar(*args, **kwargs):
    return invoke_source_function("renderTopLabelBar", *args, **kwargs)

def render_tree(*args, **kwargs):
    return invoke_source_function("renderTree", *args, **kwargs)

def render_tree_summary(*args, **kwargs):
    return invoke_source_function("renderTreeSummary", *args, **kwargs)

def render_virtualized_group_rows(*args, **kwargs):
    return invoke_source_function("renderVirtualizedGroupRows", *args, **kwargs)

def restore_filtered_archived_entries(*args, **kwargs):
    return invoke_source_function("restoreFilteredArchivedEntries", *args, **kwargs)

def select_top_label(*args, **kwargs):
    return invoke_source_function("selectTopLabel", *args, **kwargs)

def select_top_label_by_index(*args, **kwargs):
    return invoke_source_function("selectTopLabelByIndex", *args, **kwargs)


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
