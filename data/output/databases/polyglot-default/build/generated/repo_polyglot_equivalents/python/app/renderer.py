#!/usr/bin/env python3
"""Auto-generated Python equivalent module proxy."""

from __future__ import annotations

import argparse
import importlib.util
import json
import pathlib
import sys

AIO_SOURCE_JS_FILE = "app/renderer.js"
AIO_EQUIVALENT_KIND = "repo_module_proxy"
AIO_FUNCTION_TOKENS = [
  "applyLocalAssist",
  "autoSaveDraftAndAdvance",
  "bindActionElement",
  "bindAuthFallbackHandlers",
  "bindEvents",
  "bindUniverseInteractions",
  "buildSnapshot",
  "captureUndoSnapshot",
  "clampNumber",
  "clearEntrySelections",
  "clearPathHighlights",
  "clearPendingLink",
  "clearProjectionCache",
  "collectEntryFromForm",
  "createEntryFromFormData",
  "createUniverseBenchmarkState",
  "ensureEntryVisible",
  "ensureLabelExists",
  "ensureLabelsExist",
  "formatSaved",
  "getAuthCredentials",
  "getAuthSubmitHint",
  "getCategoryKeyForLabel",
  "getDuplicateEntry",
  "getEntriesForLabel",
  "getEntriesIndex",
  "getEntryBacklinkCount",
  "getGroupLimit",
  "getIdx",
  "getNearDuplicateEntries",
  "getNode",
  "getPrimaryPartOfSpeech",
  "getRelatedEntries",
  "getSelectedEntry",
  "getUnlabeledEntries",
  "hasReadyDraftForAutoCommit",
  "incrementEntryUsage",
  "initialize",
  "initializeAuthGate",
  "invalidateUniverseGraph",
  "loadDictionaryData",
  "loadUniverseCache",
  "loadUniverseGpuStatus",
  "lookupAndSaveEntry",
  "markEntriesDirty",
  "markGraphDirty",
  "mergeLookupLabels",
  "normalizeLoadedEntry",
  "normalizeLoadedSentenceGraph",
  "pushRuntimeLog",
  "rebuildGraphIndex",
  "recordDiagnosticError",
  "renderClusterPanel",
  "renderDiagnosticsSummary",
  "renderEditorForEntry",
  "renderEditorForNewEntry",
  "renderEntryInsights",
  "renderPerfHud",
  "renderStatisticsView",
  "renderSummary",
  "reqGraph",
  "reqSentence",
  "reqTree",
  "requestGraphBuildNow",
  "requestStatsWorkerComputeNow",
  "resetAdjacencyCache",
  "resetAuthHintIfNeeded",
  "resetEditor",
  "resetHighlightCache",
  "RESOLVE_ALIAS_WORD",
  "resolveModuleUtils",
  "run_submit",
  "runExtractedFunction",
  "saveEntryFromForm",
  "saveState",
  "scheduleAutoCommitDraft",
  "scheduleAutosave",
  "scheduleGraphBuild",
  "scheduleIndexWarmup",
  "setActiveView",
  "setAuthGateVisible",
  "setAuthHint",
  "setAuthMode",
  "setEntryWarnings",
  "setGroupExpanded",
  "setHelperText",
  "setPathStatus",
  "setQuickCaptureStatus",
  "setSentenceStatus",
  "setStatus",
  "sortEntries",
  "submitAuth",
  "surfaceAuthBindError",
  "syncCanvasVisibility",
  "syncControls",
  "syncExplorerLayoutControls",
  "syncPathFlags",
  "syncUiSettingsControls",
  "updateEntryFromFormData",
  "updateEntryModeVisualState",
  "updateHistoryRestoreOptions",
  "updateUniverseBookmarkSelect"
]
AIO_SYMBOL_MAP = {
  "applyLocalAssist": "apply_local_assist",
  "autoSaveDraftAndAdvance": "auto_save_draft_and_advance",
  "bindActionElement": "bind_action_element",
  "bindAuthFallbackHandlers": "bind_auth_fallback_handlers",
  "bindEvents": "bind_events",
  "bindUniverseInteractions": "bind_universe_interactions",
  "buildSnapshot": "build_snapshot",
  "captureUndoSnapshot": "capture_undo_snapshot",
  "clampNumber": "clamp_number",
  "clearEntrySelections": "clear_entry_selections",
  "clearPathHighlights": "clear_path_highlights",
  "clearPendingLink": "clear_pending_link",
  "clearProjectionCache": "clear_projection_cache",
  "collectEntryFromForm": "collect_entry_from_form",
  "createEntryFromFormData": "create_entry_from_form_data",
  "createUniverseBenchmarkState": "create_universe_benchmark_state",
  "ensureEntryVisible": "ensure_entry_visible",
  "ensureLabelExists": "ensure_label_exists",
  "ensureLabelsExist": "ensure_labels_exist",
  "formatSaved": "format_saved",
  "getAuthCredentials": "get_auth_credentials",
  "getAuthSubmitHint": "get_auth_submit_hint",
  "getCategoryKeyForLabel": "get_category_key_for_label",
  "getDuplicateEntry": "get_duplicate_entry",
  "getEntriesForLabel": "get_entries_for_label",
  "getEntriesIndex": "get_entries_index",
  "getEntryBacklinkCount": "get_entry_backlink_count",
  "getGroupLimit": "get_group_limit",
  "getIdx": "get_idx",
  "getNearDuplicateEntries": "get_near_duplicate_entries",
  "getNode": "get_node",
  "getPrimaryPartOfSpeech": "get_primary_part_of_speech",
  "getRelatedEntries": "get_related_entries",
  "getSelectedEntry": "get_selected_entry",
  "getUnlabeledEntries": "get_unlabeled_entries",
  "hasReadyDraftForAutoCommit": "has_ready_draft_for_auto_commit",
  "incrementEntryUsage": "increment_entry_usage",
  "initialize": "initialize",
  "initializeAuthGate": "initialize_auth_gate",
  "invalidateUniverseGraph": "invalidate_universe_graph",
  "loadDictionaryData": "load_dictionary_data",
  "loadUniverseCache": "load_universe_cache",
  "loadUniverseGpuStatus": "load_universe_gpu_status",
  "lookupAndSaveEntry": "lookup_and_save_entry",
  "markEntriesDirty": "mark_entries_dirty",
  "markGraphDirty": "mark_graph_dirty",
  "mergeLookupLabels": "merge_lookup_labels",
  "normalizeLoadedEntry": "normalize_loaded_entry",
  "normalizeLoadedSentenceGraph": "normalize_loaded_sentence_graph",
  "pushRuntimeLog": "push_runtime_log",
  "rebuildGraphIndex": "rebuild_graph_index",
  "recordDiagnosticError": "record_diagnostic_error",
  "renderClusterPanel": "render_cluster_panel",
  "renderDiagnosticsSummary": "render_diagnostics_summary",
  "renderEditorForEntry": "render_editor_for_entry",
  "renderEditorForNewEntry": "render_editor_for_new_entry",
  "renderEntryInsights": "render_entry_insights",
  "renderPerfHud": "render_perf_hud",
  "renderStatisticsView": "render_statistics_view",
  "renderSummary": "render_summary",
  "reqGraph": "req_graph",
  "reqSentence": "req_sentence",
  "reqTree": "req_tree",
  "requestGraphBuildNow": "request_graph_build_now",
  "requestStatsWorkerComputeNow": "request_stats_worker_compute_now",
  "resetAdjacencyCache": "reset_adjacency_cache",
  "resetAuthHintIfNeeded": "reset_auth_hint_if_needed",
  "resetEditor": "reset_editor",
  "resetHighlightCache": "reset_highlight_cache",
  "RESOLVE_ALIAS_WORD": "resolve_alias_word",
  "resolveModuleUtils": "resolve_module_utils",
  "run_submit": "run_submit",
  "runExtractedFunction": "run_extracted_function",
  "saveEntryFromForm": "save_entry_from_form",
  "saveState": "save_state",
  "scheduleAutoCommitDraft": "schedule_auto_commit_draft",
  "scheduleAutosave": "schedule_autosave",
  "scheduleGraphBuild": "schedule_graph_build",
  "scheduleIndexWarmup": "schedule_index_warmup",
  "setActiveView": "set_active_view",
  "setAuthGateVisible": "set_auth_gate_visible",
  "setAuthHint": "set_auth_hint",
  "setAuthMode": "set_auth_mode",
  "setEntryWarnings": "set_entry_warnings",
  "setGroupExpanded": "set_group_expanded",
  "setHelperText": "set_helper_text",
  "setPathStatus": "set_path_status",
  "setQuickCaptureStatus": "set_quick_capture_status",
  "setSentenceStatus": "set_sentence_status",
  "setStatus": "set_status",
  "sortEntries": "sort_entries",
  "submitAuth": "submit_auth",
  "surfaceAuthBindError": "surface_auth_bind_error",
  "syncCanvasVisibility": "sync_canvas_visibility",
  "syncControls": "sync_controls",
  "syncExplorerLayoutControls": "sync_explorer_layout_controls",
  "syncPathFlags": "sync_path_flags",
  "syncUiSettingsControls": "sync_ui_settings_controls",
  "updateEntryFromFormData": "update_entry_from_form_data",
  "updateEntryModeVisualState": "update_entry_mode_visual_state",
  "updateHistoryRestoreOptions": "update_history_restore_options",
  "updateUniverseBookmarkSelect": "update_universe_bookmark_select"
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

def apply_local_assist(*args, **kwargs):
    return invoke_source_function("applyLocalAssist", *args, **kwargs)

def auto_save_draft_and_advance(*args, **kwargs):
    return invoke_source_function("autoSaveDraftAndAdvance", *args, **kwargs)

def bind_action_element(*args, **kwargs):
    return invoke_source_function("bindActionElement", *args, **kwargs)

def bind_auth_fallback_handlers(*args, **kwargs):
    return invoke_source_function("bindAuthFallbackHandlers", *args, **kwargs)

def bind_events(*args, **kwargs):
    return invoke_source_function("bindEvents", *args, **kwargs)

def bind_universe_interactions(*args, **kwargs):
    return invoke_source_function("bindUniverseInteractions", *args, **kwargs)

def build_snapshot(*args, **kwargs):
    return invoke_source_function("buildSnapshot", *args, **kwargs)

def capture_undo_snapshot(*args, **kwargs):
    return invoke_source_function("captureUndoSnapshot", *args, **kwargs)

def clamp_number(*args, **kwargs):
    return invoke_source_function("clampNumber", *args, **kwargs)

def clear_entry_selections(*args, **kwargs):
    return invoke_source_function("clearEntrySelections", *args, **kwargs)

def clear_path_highlights(*args, **kwargs):
    return invoke_source_function("clearPathHighlights", *args, **kwargs)

def clear_pending_link(*args, **kwargs):
    return invoke_source_function("clearPendingLink", *args, **kwargs)

def clear_projection_cache(*args, **kwargs):
    return invoke_source_function("clearProjectionCache", *args, **kwargs)

def collect_entry_from_form(*args, **kwargs):
    return invoke_source_function("collectEntryFromForm", *args, **kwargs)

def create_entry_from_form_data(*args, **kwargs):
    return invoke_source_function("createEntryFromFormData", *args, **kwargs)

def create_universe_benchmark_state(*args, **kwargs):
    return invoke_source_function("createUniverseBenchmarkState", *args, **kwargs)

def ensure_entry_visible(*args, **kwargs):
    return invoke_source_function("ensureEntryVisible", *args, **kwargs)

def ensure_label_exists(*args, **kwargs):
    return invoke_source_function("ensureLabelExists", *args, **kwargs)

def ensure_labels_exist(*args, **kwargs):
    return invoke_source_function("ensureLabelsExist", *args, **kwargs)

def format_saved(*args, **kwargs):
    return invoke_source_function("formatSaved", *args, **kwargs)

def get_auth_credentials(*args, **kwargs):
    return invoke_source_function("getAuthCredentials", *args, **kwargs)

def get_auth_submit_hint(*args, **kwargs):
    return invoke_source_function("getAuthSubmitHint", *args, **kwargs)

def get_category_key_for_label(*args, **kwargs):
    return invoke_source_function("getCategoryKeyForLabel", *args, **kwargs)

def get_duplicate_entry(*args, **kwargs):
    return invoke_source_function("getDuplicateEntry", *args, **kwargs)

def get_entries_for_label(*args, **kwargs):
    return invoke_source_function("getEntriesForLabel", *args, **kwargs)

def get_entries_index(*args, **kwargs):
    return invoke_source_function("getEntriesIndex", *args, **kwargs)

def get_entry_backlink_count(*args, **kwargs):
    return invoke_source_function("getEntryBacklinkCount", *args, **kwargs)

def get_group_limit(*args, **kwargs):
    return invoke_source_function("getGroupLimit", *args, **kwargs)

def get_idx(*args, **kwargs):
    return invoke_source_function("getIdx", *args, **kwargs)

def get_near_duplicate_entries(*args, **kwargs):
    return invoke_source_function("getNearDuplicateEntries", *args, **kwargs)

def get_node(*args, **kwargs):
    return invoke_source_function("getNode", *args, **kwargs)

def get_primary_part_of_speech(*args, **kwargs):
    return invoke_source_function("getPrimaryPartOfSpeech", *args, **kwargs)

def get_related_entries(*args, **kwargs):
    return invoke_source_function("getRelatedEntries", *args, **kwargs)

def get_selected_entry(*args, **kwargs):
    return invoke_source_function("getSelectedEntry", *args, **kwargs)

def get_unlabeled_entries(*args, **kwargs):
    return invoke_source_function("getUnlabeledEntries", *args, **kwargs)

def has_ready_draft_for_auto_commit(*args, **kwargs):
    return invoke_source_function("hasReadyDraftForAutoCommit", *args, **kwargs)

def increment_entry_usage(*args, **kwargs):
    return invoke_source_function("incrementEntryUsage", *args, **kwargs)

def initialize(*args, **kwargs):
    return invoke_source_function("initialize", *args, **kwargs)

def initialize_auth_gate(*args, **kwargs):
    return invoke_source_function("initializeAuthGate", *args, **kwargs)

def invalidate_universe_graph(*args, **kwargs):
    return invoke_source_function("invalidateUniverseGraph", *args, **kwargs)

def load_dictionary_data(*args, **kwargs):
    return invoke_source_function("loadDictionaryData", *args, **kwargs)

def load_universe_cache(*args, **kwargs):
    return invoke_source_function("loadUniverseCache", *args, **kwargs)

def load_universe_gpu_status(*args, **kwargs):
    return invoke_source_function("loadUniverseGpuStatus", *args, **kwargs)

def lookup_and_save_entry(*args, **kwargs):
    return invoke_source_function("lookupAndSaveEntry", *args, **kwargs)

def mark_entries_dirty(*args, **kwargs):
    return invoke_source_function("markEntriesDirty", *args, **kwargs)

def mark_graph_dirty(*args, **kwargs):
    return invoke_source_function("markGraphDirty", *args, **kwargs)

def merge_lookup_labels(*args, **kwargs):
    return invoke_source_function("mergeLookupLabels", *args, **kwargs)

def normalize_loaded_entry(*args, **kwargs):
    return invoke_source_function("normalizeLoadedEntry", *args, **kwargs)

def normalize_loaded_sentence_graph(*args, **kwargs):
    return invoke_source_function("normalizeLoadedSentenceGraph", *args, **kwargs)

def push_runtime_log(*args, **kwargs):
    return invoke_source_function("pushRuntimeLog", *args, **kwargs)

def rebuild_graph_index(*args, **kwargs):
    return invoke_source_function("rebuildGraphIndex", *args, **kwargs)

def record_diagnostic_error(*args, **kwargs):
    return invoke_source_function("recordDiagnosticError", *args, **kwargs)

def render_cluster_panel(*args, **kwargs):
    return invoke_source_function("renderClusterPanel", *args, **kwargs)

def render_diagnostics_summary(*args, **kwargs):
    return invoke_source_function("renderDiagnosticsSummary", *args, **kwargs)

def render_editor_for_entry(*args, **kwargs):
    return invoke_source_function("renderEditorForEntry", *args, **kwargs)

def render_editor_for_new_entry(*args, **kwargs):
    return invoke_source_function("renderEditorForNewEntry", *args, **kwargs)

def render_entry_insights(*args, **kwargs):
    return invoke_source_function("renderEntryInsights", *args, **kwargs)

def render_perf_hud(*args, **kwargs):
    return invoke_source_function("renderPerfHud", *args, **kwargs)

def render_statistics_view(*args, **kwargs):
    return invoke_source_function("renderStatisticsView", *args, **kwargs)

def render_summary(*args, **kwargs):
    return invoke_source_function("renderSummary", *args, **kwargs)

def req_graph(*args, **kwargs):
    return invoke_source_function("reqGraph", *args, **kwargs)

def req_sentence(*args, **kwargs):
    return invoke_source_function("reqSentence", *args, **kwargs)

def req_tree(*args, **kwargs):
    return invoke_source_function("reqTree", *args, **kwargs)

def request_graph_build_now(*args, **kwargs):
    return invoke_source_function("requestGraphBuildNow", *args, **kwargs)

def request_stats_worker_compute_now(*args, **kwargs):
    return invoke_source_function("requestStatsWorkerComputeNow", *args, **kwargs)

def reset_adjacency_cache(*args, **kwargs):
    return invoke_source_function("resetAdjacencyCache", *args, **kwargs)

def reset_auth_hint_if_needed(*args, **kwargs):
    return invoke_source_function("resetAuthHintIfNeeded", *args, **kwargs)

def reset_editor(*args, **kwargs):
    return invoke_source_function("resetEditor", *args, **kwargs)

def reset_highlight_cache(*args, **kwargs):
    return invoke_source_function("resetHighlightCache", *args, **kwargs)

def resolve_alias_word(*args, **kwargs):
    return invoke_source_function("RESOLVE_ALIAS_WORD", *args, **kwargs)

def resolve_module_utils(*args, **kwargs):
    return invoke_source_function("resolveModuleUtils", *args, **kwargs)

def run_submit(*args, **kwargs):
    return invoke_source_function("run_submit", *args, **kwargs)

def run_extracted_function(*args, **kwargs):
    return invoke_source_function("runExtractedFunction", *args, **kwargs)

def save_entry_from_form(*args, **kwargs):
    return invoke_source_function("saveEntryFromForm", *args, **kwargs)

def save_state(*args, **kwargs):
    return invoke_source_function("saveState", *args, **kwargs)

def schedule_auto_commit_draft(*args, **kwargs):
    return invoke_source_function("scheduleAutoCommitDraft", *args, **kwargs)

def schedule_autosave(*args, **kwargs):
    return invoke_source_function("scheduleAutosave", *args, **kwargs)

def schedule_graph_build(*args, **kwargs):
    return invoke_source_function("scheduleGraphBuild", *args, **kwargs)

def schedule_index_warmup(*args, **kwargs):
    return invoke_source_function("scheduleIndexWarmup", *args, **kwargs)

def set_active_view(*args, **kwargs):
    return invoke_source_function("setActiveView", *args, **kwargs)

def set_auth_gate_visible(*args, **kwargs):
    return invoke_source_function("setAuthGateVisible", *args, **kwargs)

def set_auth_hint(*args, **kwargs):
    return invoke_source_function("setAuthHint", *args, **kwargs)

def set_auth_mode(*args, **kwargs):
    return invoke_source_function("setAuthMode", *args, **kwargs)

def set_entry_warnings(*args, **kwargs):
    return invoke_source_function("setEntryWarnings", *args, **kwargs)

def set_group_expanded(*args, **kwargs):
    return invoke_source_function("setGroupExpanded", *args, **kwargs)

def set_helper_text(*args, **kwargs):
    return invoke_source_function("setHelperText", *args, **kwargs)

def set_path_status(*args, **kwargs):
    return invoke_source_function("setPathStatus", *args, **kwargs)

def set_quick_capture_status(*args, **kwargs):
    return invoke_source_function("setQuickCaptureStatus", *args, **kwargs)

def set_sentence_status(*args, **kwargs):
    return invoke_source_function("setSentenceStatus", *args, **kwargs)

def set_status(*args, **kwargs):
    return invoke_source_function("setStatus", *args, **kwargs)

def sort_entries(*args, **kwargs):
    return invoke_source_function("sortEntries", *args, **kwargs)

def submit_auth(*args, **kwargs):
    return invoke_source_function("submitAuth", *args, **kwargs)

def surface_auth_bind_error(*args, **kwargs):
    return invoke_source_function("surfaceAuthBindError", *args, **kwargs)

def sync_canvas_visibility(*args, **kwargs):
    return invoke_source_function("syncCanvasVisibility", *args, **kwargs)

def sync_controls(*args, **kwargs):
    return invoke_source_function("syncControls", *args, **kwargs)

def sync_explorer_layout_controls(*args, **kwargs):
    return invoke_source_function("syncExplorerLayoutControls", *args, **kwargs)

def sync_path_flags(*args, **kwargs):
    return invoke_source_function("syncPathFlags", *args, **kwargs)

def sync_ui_settings_controls(*args, **kwargs):
    return invoke_source_function("syncUiSettingsControls", *args, **kwargs)

def update_entry_from_form_data(*args, **kwargs):
    return invoke_source_function("updateEntryFromFormData", *args, **kwargs)

def update_entry_mode_visual_state(*args, **kwargs):
    return invoke_source_function("updateEntryModeVisualState", *args, **kwargs)

def update_history_restore_options(*args, **kwargs):
    return invoke_source_function("updateHistoryRestoreOptions", *args, **kwargs)

def update_universe_bookmark_select(*args, **kwargs):
    return invoke_source_function("updateUniverseBookmarkSelect", *args, **kwargs)


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
