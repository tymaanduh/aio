(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory(require("./group_specs.js"), require("./group_paths.js"));
    return;
  }
  const __MODULE_API = factory(
    root.Dictionary_Renderer_Group_Specs || root.DictionaryRendererGroupSpecs || {},
    root.Dictionary_Renderer_Group_Paths || root.DictionaryRendererGroupPaths || {}
  );
  root.Dictionary_Renderer_Group_Sets = __MODULE_API;
  root.DictionaryRendererGroupSets = __MODULE_API;
})(typeof globalThis !== "undefined" ? globalThis : this, function (specsApi, pathsApi) {
  const HOOK_KEYS = specsApi.HOOK_KEYS || specsApi.hook_keys || {};
  const DOMAIN_GROUPS = specsApi.DOMAIN_GROUPS || {};
  const GROUP_PATHS = pathsApi.GROUP_PATHS || {};

  function freezeArray(values) {
    return Object.freeze(Array.isArray(values) ? values.slice() : []);
  }

  const GROUP_SETS = Object.freeze({
    group_set_core_runtime: Object.freeze({
      group_path: GROUP_PATHS.RENDERER_CORE_RUNTIME || DOMAIN_GROUPS.CORE_RUNTIME || "renderer.core.runtime",
      labels: freezeArray(["renderer", "core", "runtime"]),
      data_keys: freezeArray(["RUNTIME_MODE_VALUES", "PATTERN_EXTRACTED_MODULE", "GROUP_SETS"]),
      function_keys: freezeArray([
        "cleanText",
        "unique",
        "nowIso",
        "getRendererRuntimeMode",
        "runExtractedFunction",
        "runExtractedByModule"
      ]),
      module_key: "CORE_RUNTIME",
      pre_load_key: HOOK_KEYS.PRE_LOAD || "pre_load",
      post_load_key: HOOK_KEYS.POST_LOAD || "post_load"
    }),
    group_set_entry_selection: Object.freeze({
      group_path: GROUP_PATHS.RENDERER_ENTRY_SELECTION || DOMAIN_GROUPS.ENTRY_SELECTION || "renderer.entry.selection",
      labels: freezeArray(["entry", "selection"]),
      data_keys: freezeArray(["selectedEntryIds", "lastSelectedEntryId", "selectedEntryId", "visibleTreeEntries"]),
      function_keys: freezeArray([
        "clearEntrySelections",
        "setSingleEntrySelection",
        "toggleEntrySelection",
        "selectEntryRange",
        "getSelectedEntries",
        "getGraphEntryIdSet",
        "getVisibleTreeEntries",
        "syncSelectionWithEntry",
        "focusEntryWithoutUsage",
        "getEntryById"
      ]),
      module_key: "SELECTION_DOMAIN",
      pre_load_key: HOOK_KEYS.PRE_LOAD || "pre_load",
      post_load_key: HOOK_KEYS.POST_LOAD || "post_load"
    }),
    group_set_snapshot_history: Object.freeze({
      group_path:
        GROUP_PATHS.RENDERER_SNAPSHOT_HISTORY || DOMAIN_GROUPS.SNAPSHOT_HISTORY || "renderer.snapshot.history",
      labels: freezeArray(["snapshot", "history"]),
      data_keys: freezeArray(["history", "undoStack", "redoStack", "lastHistoryDigest", "lastUndoDigest"]),
      function_keys: freezeArray([
        "updateHistoryRestoreOptions",
        "buildCheckpointDigest",
        "buildHistoryCheckpoint",
        "ensureCheckpoint",
        "restoreCheckpointById",
        "buildUndoSnapshot",
        "digestUndoSnapshot",
        "captureUndoSnapshot",
        "applyUndoSnapshot",
        "runUndo",
        "runRedo"
      ]),
      module_key: "HISTORY_DOMAIN",
      pre_load_key: HOOK_KEYS.PRE_LOAD || "pre_load",
      post_load_key: HOOK_KEYS.POST_LOAD || "post_load"
    }),
    group_set_diagnostics_runtime_log: Object.freeze({
      group_path:
        GROUP_PATHS.RENDERER_DIAGNOSTICS_RUNTIME_LOG ||
        DOMAIN_GROUPS.DIAGNOSTICS_RUNTIME_LOG ||
        "renderer.diagnostics.runtime.log",
      labels: freezeArray(["diagnostics", "runtime", "log"]),
      data_keys: freezeArray(["diagnostics", "runtimeLogEnabled", "diagnosticsFlushTimer"]),
      function_keys: freezeArray([
        "pushRuntimeLog",
        "recordDiagnosticError",
        "recordDiagnosticPerf",
        "renderDiagnosticsSummary",
        "renderDiagnosticsPanel",
        "setSentenceStatus",
        "setEntryWarnings",
        "clearDiagnosticsFlushTimer",
        "scheduleDiagnosticsFlush"
      ]),
      module_key: "DIAGNOSTICS_DOMAIN",
      pre_load_key: HOOK_KEYS.PRE_LOAD || "pre_load",
      post_load_key: HOOK_KEYS.POST_LOAD || "post_load"
    }),
    group_set_statistics: Object.freeze({
      group_path: GROUP_PATHS.RENDERER_STATISTICS || DOMAIN_GROUPS.STATISTICS || "renderer.statistics",
      labels: freezeArray(["statistics", "worker"]),
      data_keys: freezeArray(["statsWorkerReady", "statsWorker", "statsCacheModel", "statsWorkerModel"]),
      function_keys: freezeArray([
        "buildStatisticsModelSync",
        "getStatisticsModel",
        "renderStatisticsView",
        "getStatsModelKey",
        "invalidateStatisticsCache",
        "getEntryUsageScore",
        "requestStatsWorkerComputeNow",
        "scheduleStatsWorkerCompute"
      ]),
      module_key: "STATISTICS_DOMAIN",
      pre_load_key: HOOK_KEYS.PRE_LOAD || "pre_load",
      post_load_key: HOOK_KEYS.POST_LOAD || "post_load"
    }),
    group_set_universe_render: Object.freeze({
      group_path: GROUP_PATHS.RENDERER_UNIVERSE_RENDER || DOMAIN_GROUPS.UNIVERSE_RENDER || "renderer.universe.render",
      labels: freezeArray(["universe", "render"]),
      data_keys: freezeArray(["renderMode", "canvas", "webgl", "uPerfMs", "uFrameMs", "uForceCanvas", "uGpu"]),
      function_keys: freezeArray([
        "getActiveCanvas",
        "syncCanvasVisibility",
        "setUniverseRenderMode",
        "syncControls",
        "updateUniverseBookmarkSelect",
        "setPathStatus",
        "isUniverseVisible",
        "isSentenceGraphVisible",
        "createUniverseBenchmarkState",
        "getUniverseBenchmarkProgress",
        "appendUniverseBenchmarkSample",
        "formatUniverseGpuLabel",
        "isGpuStatusDegraded",
        "applyUniverseSafeRenderModeFromGpuStatus",
        "showUniverseGpuStatus",
        "startUniverseBenchmark",
        "stopUniverseBenchmark",
        "completeUniverseBenchmark",
        "renderPerfHud",
        "updateUniverseFrameMetrics",
        "updateUniverseBenchmarkCamera",
        "getUniverseTargetDpr",
        "ensureUniverseCanvasSize",
        "getCanvasCtx",
        "markInteraction",
        "getEdgeStride",
        "buildProjectionInput",
        "getProjection",
        "findNodeAt",
        "reqGraph",
        "drawUniverseNodeLabel",
        "renderGraphWebgl",
        "getUniverseQuestionBucket",
        "getUniverseNodeColor"
      ]),
      module_key: "UNIVERSE_RENDER_DOMAIN",
      pre_load_key: HOOK_KEYS.PRE_LOAD || "pre_load",
      post_load_key: HOOK_KEYS.POST_LOAD || "post_load"
    }),
    group_set_universe_selection: Object.freeze({
      group_path:
        GROUP_PATHS.RENDERER_UNIVERSE_SELECTION || DOMAIN_GROUPS.UNIVERSE_SELECTION || "renderer.universe.selection",
      labels: freezeArray(["universe", "selection"]),
      data_keys: freezeArray(["selectedNodeIndex", "nodeIdxSet", "activeSetId", "pathHighlighted"]),
      function_keys: freezeArray([
        "buildUniverseEdgeKey",
        "getUniverseSelectedIndicesSorted",
        "getUniverseSelectedNodes",
        "setNodeSelectionSet",
        "clearUniverseNodeSelection",
        "getUniverseVisibleNodeIndices",
        "selectAllUniverseVisibleNodes",
        "toggleUniverseNodeSelection",
        "getUniverseNodeDefinitionPreview",
        "getUniverseNodeOriginLabel",
        "getUniverseNodeLinkage",
        "resolveUniverseCustomSetNodeIndices",
        "appendNodesToUniverseCustomSet",
        "createUniverseCustomSetFromSelection",
        "removeUniverseCustomSearchSet",
        "applyCustomSet",
        "getUniverseDragSelectionIndices",
        "parseUniverseDraggedSelectionPayload",
        "findPathIndices",
        "centerUniverseOnNode",
        "focusNodeIndex",
        "resetUniverseCamera",
        "fitUniverseCamera",
        "saveUniverseBookmark",
        "loadUniverseBookmark",
        "exportUniverseGraphJson",
        "exportUniversePng",
        "jumpToUniverseFilter",
        "applyUniversePathFinder",
        "applyUniverseOptionsFromInputs",
        "toggleUniverseEdgeMode"
      ]),
      module_key: "UNIVERSE_SELECTION_DOMAIN",
      pre_load_key: HOOK_KEYS.PRE_LOAD || "pre_load",
      post_load_key: HOOK_KEYS.POST_LOAD || "post_load"
    }),
    group_set_runtime_timers: Object.freeze({
      group_path: GROUP_PATHS.RENDERER_RUNTIME_TIMERS || DOMAIN_GROUPS.RUNTIME_TIMERS || "renderer.runtime.timers",
      labels: freezeArray(["runtime", "timers"]),
      data_keys: freezeArray([
        "autosaveTimer",
        "lookupTimer",
        "entryCommitTimer",
        "treeSearchTimer",
        "statsWorkerTimer",
        "universeBuildTimer",
        "universeCacheSaveTimer"
      ]),
      function_keys: freezeArray([
        "clearAutosaveTimer",
        "clearLookupTimer",
        "clearEntryCommitTimer",
        "clearTreeSearchTimer",
        "clearStatsWorkerTimer",
        "clearUniverseBuildTimer",
        "clearUniverseCacheSaveTimer",
        "scheduleIndexWarmup",
        "scheduleGraphBuild"
      ]),
      module_key: "RUNTIME_TIMERS_DOMAIN",
      pre_load_key: HOOK_KEYS.PRE_LOAD || "pre_load",
      post_load_key: HOOK_KEYS.POST_LOAD || "post_load"
    })
  });

  return {
    GROUP_SETS
  };
});
