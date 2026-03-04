(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }
  const __MODULE_API = factory();
  root.Dictionary_Renderer_Dispatch_Specs = __MODULE_API;
  root.DictionaryRendererDispatchSpecs = __MODULE_API;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function freeze_list(values) {
    return Object.freeze(Array.isArray(values) ? values.slice() : []);
  }

  const DISPATCH_SPEC_MAP = Object.freeze({
    COMMAND: freeze_list([
      "buildCommandPaletteActions",
      "closeCmdPalette",
      "createCommandItem",
      "createCommandLabel",
      "createCommandRunner",
      "executeCommandPaletteItem",
      "filterCommandPalette",
      "isCommandPaletteVisible",
      "openCommandPalette",
      "renderCmdList"
    ]),
    DIAGNOSTICS_DOMAIN: freeze_list([
      "clearDiagnosticsFlushTimer",
      "pushRuntimeLog",
      "recordDiagnosticError",
      "recordDiagnosticPerf",
      "renderDiagnosticsPanel",
      "renderDiagnosticsSummary",
      "scheduleDiagnosticsFlush",
      "setEntryWarnings",
      "setSentenceStatus"
    ]),
    EVENTS_DOMAIN: freeze_list(["bindEvents"]),
    HISTORY_DOMAIN: freeze_list([
      "applyUndoSnapshot",
      "buildCheckpointDigest",
      "buildHistoryCheckpoint",
      "buildUndoSnapshot",
      "captureUndoSnapshot",
      "digestUndoSnapshot",
      "ensureCheckpoint",
      "restoreCheckpointById",
      "runRedo",
      "runUndo",
      "updateHistoryRestoreOptions"
    ]),
    INIT: freeze_list([
      "applyMotionPreference",
      "applyUiPreferences",
      "applyUiTheme",
      "clearUiSettingsSaveTimer",
      "closeUiSettingsPopover",
      "getNormalizedUiPreferences",
      "getUiSettingsFocusableElements",
      "initializeStatsWorker",
      "initializeUiMotion",
      "initializeUniverseWorker",
      "isMotionReduced",
      "isSystemReducedMotionEnabled",
      "isUiSettingsPopoverOpen",
      "loadUiPreferencesFromDisk",
      "openUiSettingsPopover",
      "saveUiPreferencesNow",
      "scheduleUiPreferencesSave",
      "syncUiSettingsControls",
      "toggleUiSettingsPopover",
      "updateReduceMotionPreference",
      "updateUiThemePreference"
    ]),
    IO: freeze_list([
      "applyImportedEntries",
      "exportCurrentData",
      "exportEntriesAsCsv",
      "importEntriesFromText",
      "parseBulkImportEntries",
      "parseCsvEntries",
      "parseCsvLine",
      "parseImportedEntries",
      "parseSmartPasteEntries",
      "toCsvSafe",
      "triggerDownload"
    ]),
    RUNTIME_TIMERS_DOMAIN: freeze_list([
      "clearAutosaveTimer",
      "clearEntryCommitTimer",
      "clearLookupTimer",
      "clearStatsWorkerTimer",
      "clearTreeSearchTimer",
      "clearUniverseBuildTimer",
      "clearUniverseCacheSaveTimer",
      "scheduleGraphBuild",
      "scheduleIndexWarmup"
    ]),
    SELECTION_DOMAIN: freeze_list([
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
    ]),
    SENTENCE: freeze_list([
      "addSuggestedNode",
      "addSuggestedPhrase",
      "analyzeGraphQuality",
      "autoCompleteFromSelectedNode",
      "buildAutoCompletePlan",
      "buildPhraseFromPattern",
      "buildSentencePreviewLines",
      "collectPhraseSuggestionsForContext",
      "collectStarterWordSuggestions",
      "collectWordSuggestionsForContext",
      "getSentenceSuggestions",
      "renderMiniMap",
      "renderSentenceGraph"
    ]),
    SNAPSHOT: freeze_list(["buildSnapshot", "hydrateState", "initializeAuthGate", "loadDictionaryData", "submitAuth"]),
    STATISTICS_DOMAIN: freeze_list([
      "buildStatisticsModelSync",
      "getEntryUsageScore",
      "getStatisticsModel",
      "getStatsModelKey",
      "invalidateStatisticsCache",
      "renderStatisticsView",
      "requestStatsWorkerComputeNow",
      "scheduleStatsWorkerCompute"
    ]),
    TREE: freeze_list([
      "buildEntryFilterContext",
      "buildGroupDescriptor",
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
    ]),
    UI_SHELL: freeze_list([
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
    ]),
    UNIVERSE_DOMAIN: freeze_list(["queueCacheSave", "renderClusterPanel", "renderUniverseGraph", "requestGraphBuildNow"]),
    UNIVERSE_EVENTS: freeze_list(["bindUniverseInteractions"]),
    UNIVERSE_RENDER_DOMAIN: freeze_list([
      "appendUniverseBenchmarkSample",
      "applyUniverseSafeRenderModeFromGpuStatus",
      "buildProjectionInput",
      "completeUniverseBenchmark",
      "createUniverseBenchmarkState",
      "drawUniverseNodeLabel",
      "ensureUniverseCanvasSize",
      "findNodeAt",
      "formatUniverseGpuLabel",
      "getActiveCanvas",
      "getCanvasCtx",
      "getEdgeStride",
      "getProjection",
      "getUniverseBenchmarkProgress",
      "getUniverseNodeColor",
      "getUniverseQuestionBucket",
      "getUniverseTargetDpr",
      "isGpuStatusDegraded",
      "isSentenceGraphVisible",
      "isUniverseVisible",
      "markInteraction",
      "renderGraphWebgl",
      "renderPerfHud",
      "reqGraph",
      "setPathStatus",
      "setUniverseRenderMode",
      "showUniverseGpuStatus",
      "startUniverseBenchmark",
      "stopUniverseBenchmark",
      "syncCanvasVisibility",
      "syncControls",
      "updateUniverseBenchmarkCamera",
      "updateUniverseBookmarkSelect",
      "updateUniverseFrameMetrics"
    ]),
    UNIVERSE_SELECTION_DOMAIN: freeze_list([
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
    ])
  });

  const FUNCTION_DISPATCH_KIND = Object.freeze({
    BY_MODULE: "by_module",
    BY_FUNCTION: "by_function"
  });

  const FUNCTION_DISPATCH_SPEC = Object.freeze({
    MATH_SCALAR: Object.freeze({
      kind: FUNCTION_DISPATCH_KIND.BY_FUNCTION,
      map: Object.freeze({
        clampNumber: "clamp_number",
        calculatePercentile: "calculate_percentile"
      })
    }),
    MATH_PROJECTION: Object.freeze({
      kind: FUNCTION_DISPATCH_KIND.BY_FUNCTION,
      map: Object.freeze({
        normGraphCoord: "norm_graph_coord"
      })
    })
  });

  return {
    DISPATCH_SPEC_MAP,
    FUNCTION_DISPATCH_KIND,
    FUNCTION_DISPATCH_SPEC
  };
});
