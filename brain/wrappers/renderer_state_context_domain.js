/* eslint-disable no-undef */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }
  const __MODULE_API = factory();
  root.Dictionary_Renderer_State_Context_Domain = __MODULE_API;
  root.DictionaryRendererStateContextDomain = __MODULE_API;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function createRendererStateContext(deps) {
    const {
      constants,
      createStateStore,
      createDefaultDiagnostics,
      createDefaultUiPreferences,
      createUniverseStateTools,
      createEntryIndexTools,
      buildWordPrefixIndex,
      createRuntimeSlots,
      createRendererRuntimeSpec,
      createRendererVisualState,
      createUniverseGraphicsEngine,
      bindPageNamespace,
      createDebouncedTask,
      createElementMap,
      RENDERER_ELEMENT_IDS,
      helpers,
      callbacks,
      windowObj
    } = deps || {};

    const C = constants || {};
    const H = helpers || {};
    const CB = callbacks || {};
    const win = windowObj || window;
    const safeRecordDiagnosticError = (...args) => {
      try {
        return typeof H.recordDiagnosticError === "function" ? H.recordDiagnosticError(...args) : undefined;
      } catch {
        return undefined;
      }
    };

    const APP_STATE = {
      labels: [],
      entries: [],
      sentenceGraph: {
        nodes: [],
        links: []
      },
      selectedEntryId: null,
      selectedGraphNodeId: null,
      pendingLinkFromNodeId: null,
      activeView: C.VIEW_WORKBENCH,
      lastSavedAt: null,
      treeSearch: "",
      treeLabelFilter: C.LABEL_FILTER_ALL,
      treePartOfSpeechFilter: C.TREE_POS_FILTER_ALL,
      treeActivityFilter: C.TREE_ACTIVITY_FILTER_ALL,
      treeHasGraphOnly: false,
      treeShowArchived: false,
      archiveSearch: "",
      localAssistEnabled: true,
      selectedTreeGroupKey: "",
      selectedTreeLabel: "",
      explorerLayoutMode: C.EXPLORER_LAYOUT_NORMAL,
      selectedEntryIds: [],
      lastSelectedEntryId: null,
      expandedGroups: {},
      groupLimits: {},
      groupScrollTops: {},
      history: [],
      diagnostics: createDefaultDiagnostics(),
      graphLockEnabled: false,
      uiPreferences: createDefaultUiPreferences()
    };

    const APP_STORE = createStateStore(APP_STATE);
    const APP_CFG = {
      taskDelay: {
        autosave: C.AUTOSAVE_DELAY_MS,
        lookup: C.AUTO_LOOKUP_DELAY_MS,
        entryCommit: C.AUTO_ENTRY_COMMIT_DELAY_MS,
        treeSearch: C.TREE_SEARCH_DELAY_MS,
        statsSync: C.STATS_WORKER_SYNC_DELAY_MS,
        uBuild: C.UNIVERSE_BUILD_DELAY_MS
      },
      universe: {
        state: {
          minWordLength: C.UNIVERSE_MIN_WORD_LENGTH,
          maxWordLength: C.UNIVERSE_MAX_WORD_LENGTH,
          maxNodes: C.UNIVERSE_MAX_NODES,
          maxEdges: C.UNIVERSE_MAX_EDGES,
          zoomMin: C.UNIVERSE_ZOOM_MIN,
          zoomMax: C.UNIVERSE_ZOOM_MAX,
          colorModeQuestion: C.UNIVERSE_COLOR_MODE_QUESTION,
          colorModePos: C.UNIVERSE_COLOR_MODE_POS,
          colorModeMode: C.UNIVERSE_COLOR_MODE_MODE,
          viewModeCanvas: C.UNIVERSE_VIEW_MODE_CANVAS,
          viewModeWebgl: C.UNIVERSE_VIEW_MODE_WEBGL,
          bookmarkLimit: C.UNIVERSE_BOOKMARK_LIMIT,
          maxWord: C.MAX.WORD,
          maxLabel: C.MAX.LABEL,
          maxDate: C.MAX.DATE
        },
        gfx: {
          interactionActiveMs: C.UNIVERSE_INTERACTION_ACTIVE_MS,
          interactionEdgeTarget: C.UNIVERSE_INTERACTION_EDGE_TARGET,
          idleEdgeTarget: C.UNIVERSE_IDLE_EDGE_TARGET,
          perfEdgeTargetSoft: C.UNIVERSE_PERF_EDGE_TARGET_SOFT,
          perfEdgeTargetHard: C.UNIVERSE_PERF_EDGE_TARGET_HARD,
          minEdgeTarget: C.UNIVERSE_MIN_EDGE_TARGET,
          zoomMin: C.UNIVERSE_ZOOM_MIN,
          zoomMax: C.UNIVERSE_ZOOM_MAX,
          clearColor: C.UNIVERSE_WEBGL_CLEAR_COLOR,
          lineColorPath: C.UNIVERSE_WEBGL_LINE_COLOR_PATH,
          lineColorDim: C.UNIVERSE_WEBGL_LINE_COLOR_DIM,
          lineColorLabel: C.UNIVERSE_WEBGL_LINE_COLOR_LABEL,
          lineColorDefault: C.UNIVERSE_WEBGL_LINE_COLOR_DEFAULT,
          pointColorPrimary: C.UNIVERSE_WEBGL_POINT_COLOR_PRIMARY,
          pointColorSecondary: C.UNIVERSE_WEBGL_POINT_COLOR_SECONDARY,
          pointColorHover: C.UNIVERSE_WEBGL_POINT_COLOR_HOVER,
          pointColorPath: C.UNIVERSE_WEBGL_POINT_COLOR_PATH,
          pointColorHighlight: C.UNIVERSE_WEBGL_POINT_COLOR_HIGHLIGHT
        }
      },
      entryIndex: {
        maxWord: C.MAX.WORD,
        maxLabel: C.MAX.LABEL
      }
    };

    const G_APP = { s: APP_STATE, st: APP_STORE, c: APP_CFG };

    const UNI_STATE_TOOLS = createUniverseStateTools(G_APP.c.universe.state);
    const {
      createEmptyUniverseGraph,
      createDefaultUniverseConfig,
      normalizeUniverseBookmark,
      normalizeUniverseCustomSearchSet,
      normalizeUniverseCustomSearchSets,
      normalizeConfig,
      getUniverseDatasetSignature,
      inferQuestionBucketFromLabels: inferUniverseQuestionBucketFromLabels,
      normalizeUniverseGraph
    } = UNI_STATE_TOOLS;

    const { buildEntriesIndex } = createEntryIndexTools({
      buildWordPrefixIndex,
      isPartOfSpeechLabel: H.isPartOfSpeechLabel,
      ...G_APP.c.entryIndex
    });

    const G_RT = createRuntimeSlots(
      createRendererRuntimeSpec({
        authModeCreate: C.AUTH_MODE_CREATE,
        createUniverseBenchmarkState: CB.createUniverseBenchmarkState
      })
    );

    const RENDER_VISUAL_STATE = createRendererVisualState();
    const G_UNI = {
      graph: createEmptyUniverseGraph(),
      cfg: createDefaultUniverseConfig(),
      idx: {
        entry: new Map(),
        word: new Map()
      },
      path: {
        edgeKeys: new Set(),
        nodeIdx: [],
        words: []
      },
      sel: {
        nodeIdxSet: new Set(),
        sets: [],
        activeSetId: ""
      },
      canvas: {
        size: RENDER_VISUAL_STATE.canvasSize,
        flags: RENDER_VISUAL_STATE.renderFlags,
        cache: RENDER_VISUAL_STATE.renderCache
      },
      ui: {
        prefs: createDefaultUiPreferences()
      },
      view: RENDER_VISUAL_STATE.view
    };

    const G_UNI_FX = createUniverseGraphicsEngine({
      ...G_APP.c.universe.gfx,
      cleanText: H.cleanText,
      clampNumber: H.clampNumber,
      recordDiagnosticError: safeRecordDiagnosticError,
      ensureFloat32Capacity: H.ensureF32,
      ensureWebglBufferCapacity: H.ensureGlBuf,
      pushRgbaPair: H.pushPair,
      pushRgba: H.pushRgba,
      pushRgbaFromArray: H.pushFrom,
      getColorRgb: H.colorRgb
    });

    const G_PAGE = bindPageNamespace(win, {
      dictionary: { getEntriesIndex: CB.getEntriesIndex },
      tree: { reqRender: CB.reqTree },
      sentence: {
        reqRender: CB.reqSentence,
        getIndex: CB.getIdx,
        getNode: CB.getNode
      },
      universe: {
        reqRender: CB.reqGraph,
        syncControls: CB.syncControls,
        setPathStatus: CB.setPathStatus,
        renderSummary: CB.renderSummary,
        renderCluster: CB.renderClusterPanel
      }
    });

    [
      ["autosaveTask", G_APP.c.taskDelay.autosave, CB.saveState],
      ["entryCommitTask", G_APP.c.taskDelay.entryCommit, CB.autoSaveDraftAndAdvance],
      ["treeSearchTask", G_APP.c.taskDelay.treeSearch, () => G_PAGE.tree.reqRender()],
      ["statsWorkerTask", G_APP.c.taskDelay.statsSync, CB.requestStatsWorkerComputeNow],
      ["uBuildTask", G_APP.c.taskDelay.uBuild, CB.requestGraphBuildNow]
    ].forEach(([slot, delayMs, fn]) => {
      G_RT[slot] = createDebouncedTask(delayMs, fn);
    });

    G_RT.lookupTask = createDebouncedTask(G_APP.c.taskDelay.lookup, () => {
      const word = G_RT.queuedLookupWord;
      G_RT.queuedLookupWord = "";
      CB.lookupAndSaveEntry(word);
    });

    const G_DOM = createElementMap(RENDERER_ELEMENT_IDS);

    return {
      G_APP,
      G_RT,
      G_UNI,
      G_UNI_FX,
      G_PAGE,
      G_DOM,
      UNI_STATE_TOOLS,
      buildEntriesIndex,
      createEmptyUniverseGraph,
      createDefaultUniverseConfig,
      createUniverseBenchmarkState: CB.createUniverseBenchmarkState,
      getUniverseDatasetSignature,
      normalizeConfig,
      normalizeUniverseGraph,
      normalizeUniverseBookmark,
      normalizeUniverseCustomSearchSet,
      normalizeUniverseCustomSearchSets,
      inferUniverseQuestionBucketFromLabels
    };
  }

  return {
    createRendererStateContext
  };
});
