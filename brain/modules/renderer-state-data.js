(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }
  const __MODULE_API = factory();
  root.Dictionary_Renderer_State_Data = __MODULE_API;
  root.DictionaryRendererStateData = __MODULE_API;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function createRendererRuntimeSpec(options = {}) {
    const authModeCreate = options.authModeCreate;
    const createUniverseBenchmarkState =
      typeof options.createUniverseBenchmarkState === "function"
        ? options.createUniverseBenchmarkState
        : () => ({ running: false, lastResult: null });

    return {
      readyForAutosave: false,
      lookupRequestId: 0,
      lookupInFlightRequestId: 0,
      contextMenuActions: [],
      sentenceSuggestionActions: [],
      authMode: authModeCreate,
      authBusy: false,
      authStatus: { quickLoginEnabled: false },
      dragState: null,
      entriesVersion: 0,
      gVer: 0,
      entriesIndexDirty: true,
      gIdxDirty: true,
      gLayoutVer: 0,
      entriesIndexCache: null,
      gIdxCache: null,
      treeModelKey: "",
      treeModelVal: null,
      searchKey: "",
      searchVal: null,
      labelOptsKey: "",
      sentenceSugKey: "",
      sentenceSugVal: [],
      treeFrame: 0,
      graphFrame: 0,
      gNeedPreview: false,
      gNeedSuggest: false,
      gMiniKey: "",
      autosaveTask: null,
      lookupTask: null,
      entryCommitTask: null,
      treeSearchTask: null,
      statsWorkerTask: null,
      uBuildTask: null,
      queuedLookupWord: "",
      lastHistoryDigest: "",
      undoStack: [],
      redoStack: [],
      undoReplayActive: false,
      lastUndoDigest: "",
      cmdItems: [],
      cmdIdx: 0,
      indexWarmupTimer: 0,
      diagnosticsFlushTimer: 0,
      runtimeLogEnabled: true,
      lastStatusLog: "",
      lastSentenceStatusLog: "",
      quickBatchRunning: false,
      uiMotionInitialized: false,
      uiSettingsSaveTimer: 0,
      uiSettingsRestoreFocusElement: null,
      reduceMotionMediaQuery: null,
      reduceMotionMediaQueryListener: null,
      statsWorker: null,
      statsWorkerReady: false,
      statsWorkerRequestId: 0,
      latestStatsWorkerRequestId: 0,
      statsWorkerModel: null,
      statsWorkerModelKey: "",
      statsCacheKey: "",
      statsCacheModel: null,
      uWorker: null,
      uWorkerReady: false,
      uWorkerReqId: 0,
      uWorkerReqLatest: 0,
      uGraphKey: "",
      uDataSig: "",
      uCacheSaveTimer: 0,
      uRenderFrame: 0,
      uHoverFrame: 0,
      uHoverPoint: null,
      uPerfAt: 0,
      uPerfMs: 0,
      uFrameAt: 0,
      uFrameMs: 0,
      uHudAt: 0,
      uGpu: null,
      uGpuAt: 0,
      uBench: () => createUniverseBenchmarkState(),
      uForceCanvas: false,
      uResizeObs: null
    };
  }

  function createRendererVisualState() {
    return {
      canvasSize: {
        width: 0,
        height: 0,
        dpr: 1
      },
      view: {
        zoom: 1,
        panX: 0,
        panY: 0,
        hoverNodeIndex: -1,
        selectedNodeIndex: -1,
        filter: "",
        dragActive: false,
        dragStartX: 0,
        dragStartY: 0,
        dragPanX: 0,
        dragPanY: 0,
        dragMoved: false,
        pulseNodeIndex: -1,
        pulseUntil: 0
      },
      renderFlags: {
        selected: new Uint8Array(0),
        path: new Uint8Array(0),
        highlight: new Uint8Array(0)
      },
      renderCache: {
        highlightCount: 0,
        highlightKey: "",
        adjacencyKey: "",
        adjacency: []
      }
    };
  }

  return {
    createRendererRuntimeSpec,
    createRendererVisualState
  };
});
