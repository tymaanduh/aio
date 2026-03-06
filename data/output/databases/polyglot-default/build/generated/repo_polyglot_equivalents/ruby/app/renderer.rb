# frozen_string_literal: true

require_relative "../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "app/renderer.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
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
      SYMBOL_MAP = {
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

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.invoke_source_function(function_name, *args, **kwargs)
        Aio::RepoPolyglotEquivalents::Shared::RepoModuleProxy.invoke_js_function(
          SOURCE_JS_FILE,
          function_name,
          args,
          kwargs
        )
      end

      def self.run_source_entrypoint(args = [])
        Aio::RepoPolyglotEquivalents::Shared::RepoModuleProxy.run_js_entrypoint(SOURCE_JS_FILE, args)
      end

      def self.apply_local_assist(*args, **kwargs)
        invoke_source_function("applyLocalAssist", *args, **kwargs)
      end

      def self.auto_save_draft_and_advance(*args, **kwargs)
        invoke_source_function("autoSaveDraftAndAdvance", *args, **kwargs)
      end

      def self.bind_action_element(*args, **kwargs)
        invoke_source_function("bindActionElement", *args, **kwargs)
      end

      def self.bind_auth_fallback_handlers(*args, **kwargs)
        invoke_source_function("bindAuthFallbackHandlers", *args, **kwargs)
      end

      def self.bind_events(*args, **kwargs)
        invoke_source_function("bindEvents", *args, **kwargs)
      end

      def self.bind_universe_interactions(*args, **kwargs)
        invoke_source_function("bindUniverseInteractions", *args, **kwargs)
      end

      def self.build_snapshot(*args, **kwargs)
        invoke_source_function("buildSnapshot", *args, **kwargs)
      end

      def self.capture_undo_snapshot(*args, **kwargs)
        invoke_source_function("captureUndoSnapshot", *args, **kwargs)
      end

      def self.clamp_number(*args, **kwargs)
        invoke_source_function("clampNumber", *args, **kwargs)
      end

      def self.clear_entry_selections(*args, **kwargs)
        invoke_source_function("clearEntrySelections", *args, **kwargs)
      end

      def self.clear_path_highlights(*args, **kwargs)
        invoke_source_function("clearPathHighlights", *args, **kwargs)
      end

      def self.clear_pending_link(*args, **kwargs)
        invoke_source_function("clearPendingLink", *args, **kwargs)
      end

      def self.clear_projection_cache(*args, **kwargs)
        invoke_source_function("clearProjectionCache", *args, **kwargs)
      end

      def self.collect_entry_from_form(*args, **kwargs)
        invoke_source_function("collectEntryFromForm", *args, **kwargs)
      end

      def self.create_entry_from_form_data(*args, **kwargs)
        invoke_source_function("createEntryFromFormData", *args, **kwargs)
      end

      def self.create_universe_benchmark_state(*args, **kwargs)
        invoke_source_function("createUniverseBenchmarkState", *args, **kwargs)
      end

      def self.ensure_entry_visible(*args, **kwargs)
        invoke_source_function("ensureEntryVisible", *args, **kwargs)
      end

      def self.ensure_label_exists(*args, **kwargs)
        invoke_source_function("ensureLabelExists", *args, **kwargs)
      end

      def self.ensure_labels_exist(*args, **kwargs)
        invoke_source_function("ensureLabelsExist", *args, **kwargs)
      end

      def self.format_saved(*args, **kwargs)
        invoke_source_function("formatSaved", *args, **kwargs)
      end

      def self.get_auth_credentials(*args, **kwargs)
        invoke_source_function("getAuthCredentials", *args, **kwargs)
      end

      def self.get_auth_submit_hint(*args, **kwargs)
        invoke_source_function("getAuthSubmitHint", *args, **kwargs)
      end

      def self.get_category_key_for_label(*args, **kwargs)
        invoke_source_function("getCategoryKeyForLabel", *args, **kwargs)
      end

      def self.get_duplicate_entry(*args, **kwargs)
        invoke_source_function("getDuplicateEntry", *args, **kwargs)
      end

      def self.get_entries_for_label(*args, **kwargs)
        invoke_source_function("getEntriesForLabel", *args, **kwargs)
      end

      def self.get_entries_index(*args, **kwargs)
        invoke_source_function("getEntriesIndex", *args, **kwargs)
      end

      def self.get_entry_backlink_count(*args, **kwargs)
        invoke_source_function("getEntryBacklinkCount", *args, **kwargs)
      end

      def self.get_group_limit(*args, **kwargs)
        invoke_source_function("getGroupLimit", *args, **kwargs)
      end

      def self.get_idx(*args, **kwargs)
        invoke_source_function("getIdx", *args, **kwargs)
      end

      def self.get_near_duplicate_entries(*args, **kwargs)
        invoke_source_function("getNearDuplicateEntries", *args, **kwargs)
      end

      def self.get_node(*args, **kwargs)
        invoke_source_function("getNode", *args, **kwargs)
      end

      def self.get_primary_part_of_speech(*args, **kwargs)
        invoke_source_function("getPrimaryPartOfSpeech", *args, **kwargs)
      end

      def self.get_related_entries(*args, **kwargs)
        invoke_source_function("getRelatedEntries", *args, **kwargs)
      end

      def self.get_selected_entry(*args, **kwargs)
        invoke_source_function("getSelectedEntry", *args, **kwargs)
      end

      def self.get_unlabeled_entries(*args, **kwargs)
        invoke_source_function("getUnlabeledEntries", *args, **kwargs)
      end

      def self.has_ready_draft_for_auto_commit(*args, **kwargs)
        invoke_source_function("hasReadyDraftForAutoCommit", *args, **kwargs)
      end

      def self.increment_entry_usage(*args, **kwargs)
        invoke_source_function("incrementEntryUsage", *args, **kwargs)
      end

      def self.initialize(*args, **kwargs)
        invoke_source_function("initialize", *args, **kwargs)
      end

      def self.initialize_auth_gate(*args, **kwargs)
        invoke_source_function("initializeAuthGate", *args, **kwargs)
      end

      def self.invalidate_universe_graph(*args, **kwargs)
        invoke_source_function("invalidateUniverseGraph", *args, **kwargs)
      end

      def self.load_dictionary_data(*args, **kwargs)
        invoke_source_function("loadDictionaryData", *args, **kwargs)
      end

      def self.load_universe_cache(*args, **kwargs)
        invoke_source_function("loadUniverseCache", *args, **kwargs)
      end

      def self.load_universe_gpu_status(*args, **kwargs)
        invoke_source_function("loadUniverseGpuStatus", *args, **kwargs)
      end

      def self.lookup_and_save_entry(*args, **kwargs)
        invoke_source_function("lookupAndSaveEntry", *args, **kwargs)
      end

      def self.mark_entries_dirty(*args, **kwargs)
        invoke_source_function("markEntriesDirty", *args, **kwargs)
      end

      def self.mark_graph_dirty(*args, **kwargs)
        invoke_source_function("markGraphDirty", *args, **kwargs)
      end

      def self.merge_lookup_labels(*args, **kwargs)
        invoke_source_function("mergeLookupLabels", *args, **kwargs)
      end

      def self.normalize_loaded_entry(*args, **kwargs)
        invoke_source_function("normalizeLoadedEntry", *args, **kwargs)
      end

      def self.normalize_loaded_sentence_graph(*args, **kwargs)
        invoke_source_function("normalizeLoadedSentenceGraph", *args, **kwargs)
      end

      def self.push_runtime_log(*args, **kwargs)
        invoke_source_function("pushRuntimeLog", *args, **kwargs)
      end

      def self.rebuild_graph_index(*args, **kwargs)
        invoke_source_function("rebuildGraphIndex", *args, **kwargs)
      end

      def self.record_diagnostic_error(*args, **kwargs)
        invoke_source_function("recordDiagnosticError", *args, **kwargs)
      end

      def self.render_cluster_panel(*args, **kwargs)
        invoke_source_function("renderClusterPanel", *args, **kwargs)
      end

      def self.render_diagnostics_summary(*args, **kwargs)
        invoke_source_function("renderDiagnosticsSummary", *args, **kwargs)
      end

      def self.render_editor_for_entry(*args, **kwargs)
        invoke_source_function("renderEditorForEntry", *args, **kwargs)
      end

      def self.render_editor_for_new_entry(*args, **kwargs)
        invoke_source_function("renderEditorForNewEntry", *args, **kwargs)
      end

      def self.render_entry_insights(*args, **kwargs)
        invoke_source_function("renderEntryInsights", *args, **kwargs)
      end

      def self.render_perf_hud(*args, **kwargs)
        invoke_source_function("renderPerfHud", *args, **kwargs)
      end

      def self.render_statistics_view(*args, **kwargs)
        invoke_source_function("renderStatisticsView", *args, **kwargs)
      end

      def self.render_summary(*args, **kwargs)
        invoke_source_function("renderSummary", *args, **kwargs)
      end

      def self.req_graph(*args, **kwargs)
        invoke_source_function("reqGraph", *args, **kwargs)
      end

      def self.req_sentence(*args, **kwargs)
        invoke_source_function("reqSentence", *args, **kwargs)
      end

      def self.req_tree(*args, **kwargs)
        invoke_source_function("reqTree", *args, **kwargs)
      end

      def self.request_graph_build_now(*args, **kwargs)
        invoke_source_function("requestGraphBuildNow", *args, **kwargs)
      end

      def self.request_stats_worker_compute_now(*args, **kwargs)
        invoke_source_function("requestStatsWorkerComputeNow", *args, **kwargs)
      end

      def self.reset_adjacency_cache(*args, **kwargs)
        invoke_source_function("resetAdjacencyCache", *args, **kwargs)
      end

      def self.reset_auth_hint_if_needed(*args, **kwargs)
        invoke_source_function("resetAuthHintIfNeeded", *args, **kwargs)
      end

      def self.reset_editor(*args, **kwargs)
        invoke_source_function("resetEditor", *args, **kwargs)
      end

      def self.reset_highlight_cache(*args, **kwargs)
        invoke_source_function("resetHighlightCache", *args, **kwargs)
      end

      def self.resolve_alias_word(*args, **kwargs)
        invoke_source_function("RESOLVE_ALIAS_WORD", *args, **kwargs)
      end

      def self.resolve_module_utils(*args, **kwargs)
        invoke_source_function("resolveModuleUtils", *args, **kwargs)
      end

      def self.run_submit(*args, **kwargs)
        invoke_source_function("run_submit", *args, **kwargs)
      end

      def self.run_extracted_function(*args, **kwargs)
        invoke_source_function("runExtractedFunction", *args, **kwargs)
      end

      def self.save_entry_from_form(*args, **kwargs)
        invoke_source_function("saveEntryFromForm", *args, **kwargs)
      end

      def self.save_state(*args, **kwargs)
        invoke_source_function("saveState", *args, **kwargs)
      end

      def self.schedule_auto_commit_draft(*args, **kwargs)
        invoke_source_function("scheduleAutoCommitDraft", *args, **kwargs)
      end

      def self.schedule_autosave(*args, **kwargs)
        invoke_source_function("scheduleAutosave", *args, **kwargs)
      end

      def self.schedule_graph_build(*args, **kwargs)
        invoke_source_function("scheduleGraphBuild", *args, **kwargs)
      end

      def self.schedule_index_warmup(*args, **kwargs)
        invoke_source_function("scheduleIndexWarmup", *args, **kwargs)
      end

      def self.set_active_view(*args, **kwargs)
        invoke_source_function("setActiveView", *args, **kwargs)
      end

      def self.set_auth_gate_visible(*args, **kwargs)
        invoke_source_function("setAuthGateVisible", *args, **kwargs)
      end

      def self.set_auth_hint(*args, **kwargs)
        invoke_source_function("setAuthHint", *args, **kwargs)
      end

      def self.set_auth_mode(*args, **kwargs)
        invoke_source_function("setAuthMode", *args, **kwargs)
      end

      def self.set_entry_warnings(*args, **kwargs)
        invoke_source_function("setEntryWarnings", *args, **kwargs)
      end

      def self.set_group_expanded(*args, **kwargs)
        invoke_source_function("setGroupExpanded", *args, **kwargs)
      end

      def self.set_helper_text(*args, **kwargs)
        invoke_source_function("setHelperText", *args, **kwargs)
      end

      def self.set_path_status(*args, **kwargs)
        invoke_source_function("setPathStatus", *args, **kwargs)
      end

      def self.set_quick_capture_status(*args, **kwargs)
        invoke_source_function("setQuickCaptureStatus", *args, **kwargs)
      end

      def self.set_sentence_status(*args, **kwargs)
        invoke_source_function("setSentenceStatus", *args, **kwargs)
      end

      def self.set_status(*args, **kwargs)
        invoke_source_function("setStatus", *args, **kwargs)
      end

      def self.sort_entries(*args, **kwargs)
        invoke_source_function("sortEntries", *args, **kwargs)
      end

      def self.submit_auth(*args, **kwargs)
        invoke_source_function("submitAuth", *args, **kwargs)
      end

      def self.surface_auth_bind_error(*args, **kwargs)
        invoke_source_function("surfaceAuthBindError", *args, **kwargs)
      end

      def self.sync_canvas_visibility(*args, **kwargs)
        invoke_source_function("syncCanvasVisibility", *args, **kwargs)
      end

      def self.sync_controls(*args, **kwargs)
        invoke_source_function("syncControls", *args, **kwargs)
      end

      def self.sync_explorer_layout_controls(*args, **kwargs)
        invoke_source_function("syncExplorerLayoutControls", *args, **kwargs)
      end

      def self.sync_path_flags(*args, **kwargs)
        invoke_source_function("syncPathFlags", *args, **kwargs)
      end

      def self.sync_ui_settings_controls(*args, **kwargs)
        invoke_source_function("syncUiSettingsControls", *args, **kwargs)
      end

      def self.update_entry_from_form_data(*args, **kwargs)
        invoke_source_function("updateEntryFromFormData", *args, **kwargs)
      end

      def self.update_entry_mode_visual_state(*args, **kwargs)
        invoke_source_function("updateEntryModeVisualState", *args, **kwargs)
      end

      def self.update_history_restore_options(*args, **kwargs)
        invoke_source_function("updateHistoryRestoreOptions", *args, **kwargs)
      end

      def self.update_universe_bookmark_select(*args, **kwargs)
        invoke_source_function("updateUniverseBookmarkSelect", *args, **kwargs)
      end
    end
  end
end

if __FILE__ == $PROGRAM_NAME
  args = ARGV.dup
  function_flag_index = args.index("--function")
  if function_flag_index
    function_name = args[function_flag_index + 1] || ""
    args_json_index = args.index("--args-json")
    args_json = args_json_index ? (args[args_json_index + 1] || "[]") : "[]"
    result = Aio::RepoPolyglotEquivalents::ModuleProxy.invoke_source_function(
      function_name,
      *Array(JSON.parse(args_json))
    )
    puts(JSON.generate({ ok: true, result: result }))
    exit(0)
  end

  report = Aio::RepoPolyglotEquivalents::ModuleProxy.run_source_entrypoint(ARGV)
  exit(Integer(report.fetch("exit_code", 0)))
end
