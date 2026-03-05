// All constants are loaded from brain/modules/constants.js via window.Dictionary_Constants (legacy: window.DictionaryConstants)
/* exported HISTORY_MAX, createDefaultUniverseConfig, setStatus, formatSaved, setAuthGateVisible, setAuthMode, getAuthCredentials, pushRuntimeLog, resetAuthHintIfNeeded, setSentenceStatus, renderDiagnosticsSummary, clearEntrySelections, updateHistoryRestoreOptions, captureUndoSnapshot, scheduleIndexWarmup, scheduleGraphBuild, updateUniverseBookmarkSelect, syncCanvasVisibility, renderPerfHud, renderStatisticsView, syncUiSettingsControls, syncExplorerLayoutControls, bindUniverseInteractions, bindActionElement, loadDictionaryData, clearPendingLink, setQuickCaptureStatus, setActiveView, normalizeLoadedEntry, normalizeLoadedSentenceGraph, resetEditor, loadUniverseCache, loadUniverseGpuStatus */
const CONSTANTS_SOURCE = window.Dictionary_Constants || window.DictionaryConstants || {};

const {
  DEFAULT_LABELS,
  DEFAULT_HELPER_TEXT,
  SAVED_NEXT_HELPER_TEXT,
  SELECTED_HELPER_TEXT,
  LABEL_FILTER_ALL,
  LABEL_FILTER_UNLABELED,
  UNLABELED_NAME,
  UNLABELED_KEY,
  CATEGORY_POS_KEY,
  CATEGORY_LABELS_KEY,
  CATEGORY_UNLABELED_KEY,
  CATEGORY_FILTERED_KEY,
  TOP_TREE_LABELS,
  PARTS_OF_SPEECH,
  MAX,
  HISTORY_MAX,
  AUTOSAVE_DELAY_MS,
  AUTO_LOOKUP_DELAY_MS,
  AUTO_ENTRY_COMMIT_DELAY_MS,
  TREE_SEARCH_DELAY_MS,
  STATS_WORKER_SYNC_DELAY_MS,
  TREE_PAGE_SIZE,
  TREE_VIRTUALIZATION_THRESHOLD,
  TREE_VIRTUAL_ROW_HEIGHT,
  TREE_POS_FILTER_ALL,
  TREE_ACTIVITY_FILTER_ALL,
  AUTH_MODE_CREATE,
  AUTH_MODE_LOGIN,
  VIEW_WORKBENCH,
  VIEW_SENTENCE_GRAPH,
  VIEW_STATISTICS,
  VIEW_UNIVERSE,
  EXPLORER_LAYOUT_NORMAL,
  EXPLORER_LAYOUT_COMPACT,
  EXPLORER_LAYOUT_MAXIMIZED,
  UNIVERSE_BUILD_DELAY_MS,
  UNIVERSE_MAX_NODES,
  UNIVERSE_MAX_EDGES,
  UNIVERSE_MIN_WORD_LENGTH,
  UNIVERSE_MAX_WORD_LENGTH,
  UNIVERSE_CACHE_SAVE_DELAY_MS,
  UNIVERSE_BOOKMARK_LIMIT,
  UNIVERSE_VIEW_MODE_CANVAS,
  UNIVERSE_VIEW_MODE_WEBGL,
  UNIVERSE_COLOR_MODE_QUESTION,
  UNIVERSE_COLOR_MODE_POS,
  UNIVERSE_COLOR_MODE_MODE,
  UNIVERSE_ZOOM_MIN,
  UNIVERSE_ZOOM_MAX,
  UNIVERSE_WEBGL_CLEAR_COLOR,
  UNIVERSE_WEBGL_LINE_COLOR_PATH,
  UNIVERSE_WEBGL_LINE_COLOR_DIM,
  UNIVERSE_WEBGL_LINE_COLOR_LABEL,
  UNIVERSE_WEBGL_LINE_COLOR_DEFAULT,
  UNIVERSE_WEBGL_POINT_COLOR_PRIMARY,
  UNIVERSE_WEBGL_POINT_COLOR_SECONDARY,
  UNIVERSE_WEBGL_POINT_COLOR_HOVER,
  UNIVERSE_WEBGL_POINT_COLOR_PATH,
  UNIVERSE_WEBGL_POINT_COLOR_HIGHLIGHT,
  UNIVERSE_INTERACTION_ACTIVE_MS,
  UNIVERSE_INTERACTION_EDGE_TARGET,
  UNIVERSE_IDLE_EDGE_TARGET,
  UNIVERSE_PERF_EDGE_TARGET_SOFT,
  UNIVERSE_PERF_EDGE_TARGET_HARD,
  UNIVERSE_MIN_EDGE_TARGET,
  UI_PREFERENCES_SAVE_DELAY_MS,
  PHRASE_PATTERNS,
  POS_FOLLOW_RULES
} = CONSTANTS_SOURCE;

const CONSTANT_GROUPS = Object.freeze({
  TEXT: Object.freeze({
    DEFAULT_LABELS,
    LABEL_FILTER_ALL,
    LABEL_FILTER_UNLABELED,
    UNLABELED_NAME,
    UNLABELED_KEY,
    HELPER: Object.freeze({
      DEFAULT: DEFAULT_HELPER_TEXT,
      SAVED_NEXT: SAVED_NEXT_HELPER_TEXT,
      SELECTED: SELECTED_HELPER_TEXT
    }),
    PARTS_OF_SPEECH,
    PHRASE_PATTERNS,
    POS_FOLLOW_RULES
  }),
  TREE: Object.freeze({
    CATEGORY_POS_KEY,
    CATEGORY_LABELS_KEY,
    CATEGORY_UNLABELED_KEY,
    CATEGORY_FILTERED_KEY,
    TOP_TREE_LABELS,
    POS_FILTER_ALL: TREE_POS_FILTER_ALL,
    ACTIVITY_FILTER_ALL: TREE_ACTIVITY_FILTER_ALL
  }),
  VIEW: Object.freeze({
    WORKBENCH: VIEW_WORKBENCH,
    SENTENCE_GRAPH: VIEW_SENTENCE_GRAPH,
    STATISTICS: VIEW_STATISTICS,
    UNIVERSE: VIEW_UNIVERSE,
    EXPLORER_LAYOUT: Object.freeze({
      NORMAL: EXPLORER_LAYOUT_NORMAL,
      COMPACT: EXPLORER_LAYOUT_COMPACT,
      MAXIMIZED: EXPLORER_LAYOUT_MAXIMIZED
    })
  }),
  DELAY_MS: Object.freeze({
    AUTOSAVE: AUTOSAVE_DELAY_MS,
    AUTO_LOOKUP: AUTO_LOOKUP_DELAY_MS,
    AUTO_ENTRY_COMMIT: AUTO_ENTRY_COMMIT_DELAY_MS,
    TREE_SEARCH: TREE_SEARCH_DELAY_MS,
    STATS_WORKER_SYNC: STATS_WORKER_SYNC_DELAY_MS,
    UNIVERSE_BUILD: UNIVERSE_BUILD_DELAY_MS,
    UNIVERSE_CACHE_SAVE: UNIVERSE_CACHE_SAVE_DELAY_MS,
    UI_PREFERENCES_SAVE: UI_PREFERENCES_SAVE_DELAY_MS
  }),
  UNIVERSE: Object.freeze({
    MAX_NODES: UNIVERSE_MAX_NODES,
    MAX_EDGES: UNIVERSE_MAX_EDGES,
    MIN_WORD_LENGTH: UNIVERSE_MIN_WORD_LENGTH,
    MAX_WORD_LENGTH: UNIVERSE_MAX_WORD_LENGTH,
    BOOKMARK_LIMIT: UNIVERSE_BOOKMARK_LIMIT,
    VIEW_MODE_CANVAS: UNIVERSE_VIEW_MODE_CANVAS,
    VIEW_MODE_WEBGL: UNIVERSE_VIEW_MODE_WEBGL,
    COLOR_MODE_QUESTION: UNIVERSE_COLOR_MODE_QUESTION,
    COLOR_MODE_POS: UNIVERSE_COLOR_MODE_POS,
    COLOR_MODE_MODE: UNIVERSE_COLOR_MODE_MODE,
    ZOOM_MIN: UNIVERSE_ZOOM_MIN,
    ZOOM_MAX: UNIVERSE_ZOOM_MAX,
    WEBGL_CLEAR_COLOR: UNIVERSE_WEBGL_CLEAR_COLOR,
    WEBGL_LINE_COLOR_PATH: UNIVERSE_WEBGL_LINE_COLOR_PATH,
    WEBGL_LINE_COLOR_DIM: UNIVERSE_WEBGL_LINE_COLOR_DIM,
    WEBGL_LINE_COLOR_LABEL: UNIVERSE_WEBGL_LINE_COLOR_LABEL,
    WEBGL_LINE_COLOR_DEFAULT: UNIVERSE_WEBGL_LINE_COLOR_DEFAULT,
    WEBGL_POINT_COLOR_PRIMARY: UNIVERSE_WEBGL_POINT_COLOR_PRIMARY,
    WEBGL_POINT_COLOR_SECONDARY: UNIVERSE_WEBGL_POINT_COLOR_SECONDARY,
    WEBGL_POINT_COLOR_HOVER: UNIVERSE_WEBGL_POINT_COLOR_HOVER,
    WEBGL_POINT_COLOR_PATH: UNIVERSE_WEBGL_POINT_COLOR_PATH,
    WEBGL_POINT_COLOR_HIGHLIGHT: UNIVERSE_WEBGL_POINT_COLOR_HIGHLIGHT,
    INTERACTION_ACTIVE_MS: UNIVERSE_INTERACTION_ACTIVE_MS,
    INTERACTION_EDGE_TARGET: UNIVERSE_INTERACTION_EDGE_TARGET,
    IDLE_EDGE_TARGET: UNIVERSE_IDLE_EDGE_TARGET,
    PERF_EDGE_TARGET_SOFT: UNIVERSE_PERF_EDGE_TARGET_SOFT,
    PERF_EDGE_TARGET_HARD: UNIVERSE_PERF_EDGE_TARGET_HARD,
    MIN_EDGE_TARGET: UNIVERSE_MIN_EDGE_TARGET
  }),
  AUTH: Object.freeze({
    MODE_CREATE: AUTH_MODE_CREATE,
    MODE_LOGIN: AUTH_MODE_LOGIN
  })
});
const PATTERN_HELPER_TEXT = CONSTANT_GROUPS.TEXT.HELPER;
const CONSTANT_VIEW = CONSTANT_GROUPS.VIEW;
const CONSTANT_DELAY_MS = CONSTANT_GROUPS.DELAY_MS;
const CONSTANT_UNIVERSE = CONSTANT_GROUPS.UNIVERSE;
const CONSTANT_TREE = CONSTANT_GROUPS.TREE;
const CONSTANT_TEXT = CONSTANT_GROUPS.TEXT;
const CONSTANT_AUTH = CONSTANT_GROUPS.AUTH;

const PATTERN_GLOBAL_MODULE_KEYS = Object.freeze({
  STORE: ["Dictionary_Store", "DictionaryStore"],
  TREE: ["Dictionary_Tree_Utils", "DictionaryTreeUtils"],
  GRAPH: ["Dictionary_Graph_Utils", "DictionaryGraphUtils"],
  INDEXING: ["Dictionary_Indexing_Utils", "DictionaryIndexingUtils"],
  DUPLICATES: ["Dictionary_Duplicates_Utils", "DictionaryDuplicatesUtils"],
  IMPORT: ["Dictionary_Import_Utils", "DictionaryImportUtils"],
  DIAGNOSTICS: ["Dictionary_Diagnostics_Utils", "DictionaryDiagnosticsUtils"],
  COMMAND_PALETTE: ["Dictionary_Command_Palette_Utils", "DictionaryCommandPaletteUtils"],
  RENDERER_TEXT_UTILS: ["Dictionary_Renderer_Text_Utils", "DictionaryRendererTextUtils"],
  SUGGESTION: ["Dictionary_Suggestion_Utils", "DictionarySuggestionUtils"],
  AUTH: ["Dictionary_Auth_Utils", "DictionaryAuthUtils"],
  AUTOSAVE: ["Dictionary_Autosave_Utils", "DictionaryAutosaveUtils"],
  UI_PREFERENCES: ["Dictionary_Ui_Preferences_Utils", "DictionaryUiPreferencesUtils"],
  UNIVERSE_GRAPH: ["Dictionary_Universe_Graph_Utils", "DictionaryUniverseGraphUtils"],
  UNIVERSE_RENDER: ["Dictionary_Universe_Render_Utils", "DictionaryUniverseRenderUtils"],
  UNIVERSE_GRAPHICS_ENGINE: ["Dictionary_Universe_Graphics_Engine", "DictionaryUniverseGraphicsEngine"],
  UNIVERSE_STATE: ["Dictionary_Universe_State_Utils", "DictionaryUniverseStateUtils"],
  ENTRY_INDEX: ["Dictionary_Entry_Index_Utils", "DictionaryEntryIndexUtils"],
  DOM: ["Dictionary_Dom_Utils", "DictionaryDomUtils"],
  RUNTIME_SLOTS: ["Dictionary_Runtime_Slots_Utils", "DictionaryRuntimeSlotsUtils"],
  PAGE_NAMESPACE: ["Dictionary_Page_Namespace_Utils", "DictionaryPageNamespaceUtils"],
  RENDERER_STATE: ["Dictionary_Renderer_State_Data", "DictionaryRendererStateData"],
  ALIAS_INDEX: ["Dictionary_Alias_Index", "DictionaryAliasIndex"],
  RENDERER_DISPATCH: ["Dictionary_Renderer_Dispatch_Domain", "DictionaryRendererDispatchDomain"]
});

function resolveModuleUtils(moduleKeys = []) {
  const keyList = Array.isArray(moduleKeys) ? moduleKeys : [];
  for (let index = 0; index < keyList.length; index += 1) {
    const moduleRef = window[keyList[index]];
    if (moduleRef) {
      return moduleRef;
    }
  }
  return {};
}

const MODULE_GROUP_UTILS = {
  CORE: {
    STORE: resolveModuleUtils(PATTERN_GLOBAL_MODULE_KEYS.STORE),
    TREE: resolveModuleUtils(PATTERN_GLOBAL_MODULE_KEYS.TREE),
    GRAPH: resolveModuleUtils(PATTERN_GLOBAL_MODULE_KEYS.GRAPH),
    INDEXING: resolveModuleUtils(PATTERN_GLOBAL_MODULE_KEYS.INDEXING),
    DUPLICATES: resolveModuleUtils(PATTERN_GLOBAL_MODULE_KEYS.DUPLICATES),
    IMPORT: resolveModuleUtils(PATTERN_GLOBAL_MODULE_KEYS.IMPORT),
    DIAGNOSTICS: resolveModuleUtils(PATTERN_GLOBAL_MODULE_KEYS.DIAGNOSTICS),
    COMMAND_PALETTE: resolveModuleUtils(PATTERN_GLOBAL_MODULE_KEYS.COMMAND_PALETTE)
  },
  TEXT: {
    RENDERER_TEXT: resolveModuleUtils(PATTERN_GLOBAL_MODULE_KEYS.RENDERER_TEXT_UTILS),
    SUGGESTION: resolveModuleUtils(PATTERN_GLOBAL_MODULE_KEYS.SUGGESTION),
    AUTH: resolveModuleUtils(PATTERN_GLOBAL_MODULE_KEYS.AUTH)
  },
  UI: {
    AUTOSAVE: resolveModuleUtils(PATTERN_GLOBAL_MODULE_KEYS.AUTOSAVE),
    PREFERENCES: resolveModuleUtils(PATTERN_GLOBAL_MODULE_KEYS.UI_PREFERENCES),
    DOM: resolveModuleUtils(PATTERN_GLOBAL_MODULE_KEYS.DOM),
    PAGE_NAMESPACE: resolveModuleUtils(PATTERN_GLOBAL_MODULE_KEYS.PAGE_NAMESPACE)
  },
  UNIVERSE: {
    GRAPH: resolveModuleUtils(PATTERN_GLOBAL_MODULE_KEYS.UNIVERSE_GRAPH),
    RENDER: resolveModuleUtils(PATTERN_GLOBAL_MODULE_KEYS.UNIVERSE_RENDER),
    GRAPHICS_ENGINE: resolveModuleUtils(PATTERN_GLOBAL_MODULE_KEYS.UNIVERSE_GRAPHICS_ENGINE),
    STATE: resolveModuleUtils(PATTERN_GLOBAL_MODULE_KEYS.UNIVERSE_STATE),
    ENTRY_INDEX: resolveModuleUtils(PATTERN_GLOBAL_MODULE_KEYS.ENTRY_INDEX)
  },
  RUNTIME: {
    SLOTS: resolveModuleUtils(PATTERN_GLOBAL_MODULE_KEYS.RUNTIME_SLOTS),
    RENDERER_STATE: resolveModuleUtils(PATTERN_GLOBAL_MODULE_KEYS.RENDERER_STATE)
  },
  ALIAS: {
    INDEX: resolveModuleUtils(PATTERN_GLOBAL_MODULE_KEYS.ALIAS_INDEX)
  },
  DISPATCH: {
    DOMAIN: resolveModuleUtils(PATTERN_GLOBAL_MODULE_KEYS.RENDERER_DISPATCH)
  }
};

const { createStateStore } = MODULE_GROUP_UTILS.CORE.STORE;
const { shouldVirtualizeGroup, calculateVirtualWindow } = MODULE_GROUP_UTILS.CORE.TREE;
const { buildGraphIndex } = MODULE_GROUP_UTILS.CORE.GRAPH;
const { buildWordPrefixIndex } = MODULE_GROUP_UTILS.CORE.INDEXING;
const { buildNearDuplicateCluster } = MODULE_GROUP_UTILS.CORE.DUPLICATES;
const { applyInChunks } = MODULE_GROUP_UTILS.CORE.IMPORT;
const { createDefaultDiagnostics, normalizeDiagnostics, mergeDiagnostics } = MODULE_GROUP_UTILS.CORE.DIAGNOSTICS;
const { rankCommands } = MODULE_GROUP_UTILS.CORE.COMMAND_PALETTE;
const { createRendererTextUtils } = MODULE_GROUP_UTILS.TEXT.RENDERER_TEXT;
const { normalizeWordLower: normalizeWordLowerUtil, inflectVerbForSubject: inflectVerbForSubjectUtil } =
  MODULE_GROUP_UTILS.TEXT.SUGGESTION;
const { getAuthSubmitHint: getAuthSubmitHintUtil } = MODULE_GROUP_UTILS.TEXT.AUTH;
const { createDebouncedTask } = MODULE_GROUP_UTILS.UI.AUTOSAVE;
const { UI_THEME_IDS, createDefaultUiPreferences, normalizeUiTheme, normalizeUiPreferences } =
  MODULE_GROUP_UTILS.UI.PREFERENCES;
const { createElementMap, RENDERER_ELEMENT_IDS } = MODULE_GROUP_UTILS.UI.DOM;
const { bindPageNamespace } = MODULE_GROUP_UTILS.UI.PAGE_NAMESPACE;
const {
  getNodeWordLower: getNodeWord,
  buildGraphCacheToken: buildGraphToken,
  buildIndexFlags: buildIdxFlags,
  computeHighlightState: computeHighlight,
  computeAdjacencyState: computeAdjacency,
  findPathIndices: findPath
} = MODULE_GROUP_UTILS.UNIVERSE.GRAPH;
const {
  colorRgb,
  colorRgbBytes,
  ensureFloat32Capacity: ensureF32,
  ensureWebglBufferCapacity: ensureGlBuf,
  pushRgbaPair: pushPair,
  pushRgba,
  pushRgbaFromArray: pushFrom
} = MODULE_GROUP_UTILS.UNIVERSE.RENDER;
const { createUniverseGraphicsEngine } = MODULE_GROUP_UTILS.UNIVERSE.GRAPHICS_ENGINE;
const { createUniverseStateTools } = MODULE_GROUP_UTILS.UNIVERSE.STATE;
const { createEntryIndexTools } = MODULE_GROUP_UTILS.UNIVERSE.ENTRY_INDEX;
const { createRuntimeSlots } = MODULE_GROUP_UTILS.RUNTIME.SLOTS;
const { createRendererRuntimeSpec, createRendererVisualState } = MODULE_GROUP_UTILS.RUNTIME.RENDERER_STATE;
const { ALIAS_WORD_INDEX = [], createAliasMap, getAliasWords } = MODULE_GROUP_UTILS.ALIAS.INDEX;
const { createRendererDispatch } = MODULE_GROUP_UTILS.DISPATCH.DOMAIN;
const { createRendererStateContext } =
  window.Dictionary_Renderer_State_Context_Domain || window.DictionaryRendererStateContextDomain || {};

const MOD_FUNCTION_GROUPS = {
  core: {
    createStateStore,
    shouldVirtualizeGroup,
    calculateVirtualWindow,
    buildGraphIndex,
    buildWordPrefixIndex,
    buildNearDuplicateCluster,
    applyInChunks,
    createDefaultDiagnostics,
    normalizeDiagnostics,
    mergeDiagnostics,
    rankCommands
  },
  text: {
    createRendererTextUtils,
    normalizeWordLowerUtil,
    inflectVerbForSubjectUtil,
    getAuthSubmitHintUtil
  },
  ui: {
    createDebouncedTask,
    createDefaultUiPreferences,
    normalizeUiTheme,
    normalizeUiPreferences,
    createElementMap,
    bindPageNamespace
  },
  uni: {
    getNodeWord,
    buildGraphToken,
    buildIdxFlags,
    computeHighlight,
    computeAdjacency,
    findPath,
    colorRgb,
    colorRgbBytes,
    ensureF32,
    ensureGlBuf,
    pushPair,
    pushRgba,
    pushFrom,
    createUniverseGraphicsEngine,
    createUniverseStateTools,
    createEntryIndexTools
  },
  runtime: {
    createRuntimeSlots,
    createRendererRuntimeSpec,
    createRendererVisualState
  },
  alias: {
    createAliasMap,
    getAliasWords
  },
  dispatch: {
    createRendererDispatch
  }
};
const REQUIRED_MODULE_FUNCTIONS = Object.values(MOD_FUNCTION_GROUPS).flatMap((group) => Object.values(group));

if (
  REQUIRED_MODULE_FUNCTIONS.some((value) => typeof value !== "function") ||
  typeof createRendererStateContext !== "function" ||
  typeof createRendererDispatch !== "function" ||
  !Array.isArray(UI_THEME_IDS) ||
  !Array.isArray(RENDERER_ELEMENT_IDS) ||
  !Array.isArray(ALIAS_WORD_INDEX)
) {
  throw new Error("Renderer modules failed to load.");
}

const PATTERN_ALIAS_KEY = Object.freeze({
  APP: "app",
  PAGE: "pg",
  RUNTIME: "rt",
  DOCUMENT: "dom",
  CONFIG: "cfg",
  UNIVERSE: "uni"
});
const ALIAS_INDEX_MAP = createAliasMap(ALIAS_WORD_INDEX);
const RESOLVE_ALIAS_WORD = (aliasKey, fallback) => {
  const words = getAliasWords(aliasKey, ALIAS_INDEX_MAP);
  return Array.isArray(words) && typeof words[0] === "string" && words[0] ? words[0] : fallback;
};
const ALIAS_LABEL_MAP = Object.freeze({
  app: RESOLVE_ALIAS_WORD(PATTERN_ALIAS_KEY.APP, "application"),
  page: RESOLVE_ALIAS_WORD(PATTERN_ALIAS_KEY.PAGE, "page"),
  runtime: RESOLVE_ALIAS_WORD(PATTERN_ALIAS_KEY.RUNTIME, "runtime"),
  document: RESOLVE_ALIAS_WORD(PATTERN_ALIAS_KEY.DOCUMENT, "document"),
  config: RESOLVE_ALIAS_WORD(PATTERN_ALIAS_KEY.CONFIG, "configuration"),
  universe: RESOLVE_ALIAS_WORD(PATTERN_ALIAS_KEY.UNIVERSE, "universe")
});
window.Dictionary_Renderer_Alias_Label = ALIAS_LABEL_MAP;
window.DictionaryRendererAliasLabel = ALIAS_LABEL_MAP;
const RENDERER_TEXT_RULES_SOURCE = window.Dictionary_Renderer_Text_Rules || window.DictionaryRendererTextRules || {};
const RENDERER_TEXT_RULES = RENDERER_TEXT_RULES_SOURCE.RENDERER_TEXT_RULES || {};

function recordDiagnosticError(key, message, source = "renderer") {
  const diagnosticsApi =
    window.Dictionary_Renderer_Diagnostics_Domain || window.DictionaryRendererDiagnosticsDomain || null;
  if (diagnosticsApi && typeof diagnosticsApi.recordDiagnosticError === "function") {
    diagnosticsApi.recordDiagnosticError(key, message, source);
  }
}

const {
  G_APP,
  G_RT,
  G_UNI,
  G_UNI_FX,
  G_PAGE,
  G_DOM,
  buildEntriesIndex,
  createEmptyUniverseGraph,
  createDefaultUniverseConfig
} = createRendererStateContext({
  constants: {
    VIEW_WORKBENCH: CONSTANT_VIEW.WORKBENCH,
    LABEL_FILTER_ALL: CONSTANT_TEXT.LABEL_FILTER_ALL,
    TREE_POS_FILTER_ALL: CONSTANT_TREE.POS_FILTER_ALL,
    TREE_ACTIVITY_FILTER_ALL: CONSTANT_TREE.ACTIVITY_FILTER_ALL,
    EXPLORER_LAYOUT_NORMAL: CONSTANT_VIEW.EXPLORER_LAYOUT.NORMAL,
    AUTOSAVE_DELAY_MS: CONSTANT_DELAY_MS.AUTOSAVE,
    AUTO_LOOKUP_DELAY_MS: CONSTANT_DELAY_MS.AUTO_LOOKUP,
    AUTO_ENTRY_COMMIT_DELAY_MS: CONSTANT_DELAY_MS.AUTO_ENTRY_COMMIT,
    TREE_SEARCH_DELAY_MS: CONSTANT_DELAY_MS.TREE_SEARCH,
    STATS_WORKER_SYNC_DELAY_MS: CONSTANT_DELAY_MS.STATS_WORKER_SYNC,
    UNIVERSE_BUILD_DELAY_MS: CONSTANT_DELAY_MS.UNIVERSE_BUILD,
    UNIVERSE_MIN_WORD_LENGTH: CONSTANT_UNIVERSE.MIN_WORD_LENGTH,
    UNIVERSE_MAX_WORD_LENGTH: CONSTANT_UNIVERSE.MAX_WORD_LENGTH,
    UNIVERSE_MAX_NODES: CONSTANT_UNIVERSE.MAX_NODES,
    UNIVERSE_MAX_EDGES: CONSTANT_UNIVERSE.MAX_EDGES,
    UNIVERSE_ZOOM_MIN: CONSTANT_UNIVERSE.ZOOM_MIN,
    UNIVERSE_ZOOM_MAX: CONSTANT_UNIVERSE.ZOOM_MAX,
    UNIVERSE_COLOR_MODE_QUESTION: CONSTANT_UNIVERSE.COLOR_MODE_QUESTION,
    UNIVERSE_COLOR_MODE_POS: CONSTANT_UNIVERSE.COLOR_MODE_POS,
    UNIVERSE_COLOR_MODE_MODE: CONSTANT_UNIVERSE.COLOR_MODE_MODE,
    UNIVERSE_VIEW_MODE_CANVAS: CONSTANT_UNIVERSE.VIEW_MODE_CANVAS,
    UNIVERSE_VIEW_MODE_WEBGL: CONSTANT_UNIVERSE.VIEW_MODE_WEBGL,
    UNIVERSE_BOOKMARK_LIMIT: CONSTANT_UNIVERSE.BOOKMARK_LIMIT,
    UNIVERSE_INTERACTION_ACTIVE_MS: CONSTANT_UNIVERSE.INTERACTION_ACTIVE_MS,
    UNIVERSE_INTERACTION_EDGE_TARGET: CONSTANT_UNIVERSE.INTERACTION_EDGE_TARGET,
    UNIVERSE_IDLE_EDGE_TARGET: CONSTANT_UNIVERSE.IDLE_EDGE_TARGET,
    UNIVERSE_PERF_EDGE_TARGET_SOFT: CONSTANT_UNIVERSE.PERF_EDGE_TARGET_SOFT,
    UNIVERSE_PERF_EDGE_TARGET_HARD: CONSTANT_UNIVERSE.PERF_EDGE_TARGET_HARD,
    UNIVERSE_MIN_EDGE_TARGET: CONSTANT_UNIVERSE.MIN_EDGE_TARGET,
    UNIVERSE_WEBGL_CLEAR_COLOR: CONSTANT_UNIVERSE.WEBGL_CLEAR_COLOR,
    UNIVERSE_WEBGL_LINE_COLOR_PATH: CONSTANT_UNIVERSE.WEBGL_LINE_COLOR_PATH,
    UNIVERSE_WEBGL_LINE_COLOR_DIM: CONSTANT_UNIVERSE.WEBGL_LINE_COLOR_DIM,
    UNIVERSE_WEBGL_LINE_COLOR_LABEL: CONSTANT_UNIVERSE.WEBGL_LINE_COLOR_LABEL,
    UNIVERSE_WEBGL_LINE_COLOR_DEFAULT: CONSTANT_UNIVERSE.WEBGL_LINE_COLOR_DEFAULT,
    UNIVERSE_WEBGL_POINT_COLOR_PRIMARY: CONSTANT_UNIVERSE.WEBGL_POINT_COLOR_PRIMARY,
    UNIVERSE_WEBGL_POINT_COLOR_SECONDARY: CONSTANT_UNIVERSE.WEBGL_POINT_COLOR_SECONDARY,
    UNIVERSE_WEBGL_POINT_COLOR_HOVER: CONSTANT_UNIVERSE.WEBGL_POINT_COLOR_HOVER,
    UNIVERSE_WEBGL_POINT_COLOR_PATH: CONSTANT_UNIVERSE.WEBGL_POINT_COLOR_PATH,
    UNIVERSE_WEBGL_POINT_COLOR_HIGHLIGHT: CONSTANT_UNIVERSE.WEBGL_POINT_COLOR_HIGHLIGHT,
    AUTH_MODE_CREATE: CONSTANT_AUTH.MODE_CREATE,
    MAX
  },
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
  helpers: {
    isPartOfSpeechLabel,
    cleanText,
    clampNumber,
    recordDiagnosticError,
    ensureF32,
    ensureGlBuf,
    pushPair,
    pushRgba,
    pushFrom,
    colorRgb
  },
  callbacks: {
    createUniverseBenchmarkState,
    getEntriesIndex,
    reqTree,
    reqSentence,
    getIdx,
    getNode,
    reqGraph,
    syncControls,
    setPathStatus,
    renderSummary,
    renderClusterPanel,
    saveState,
    autoSaveDraftAndAdvance,
    requestStatsWorkerComputeNow,
    requestGraphBuildNow,
    lookupAndSaveEntry
  },
  windowObj: window
});

const PATTERN_EXTRACTED_MODULE = Object.freeze({
  CORE_RUNTIME: "Dictionary_Renderer_Core_Runtime_Domain",
  IO: "Dictionary_Renderer_Io_Domain",
  UI_SHELL: "Dictionary_Renderer_Ui_Shell_Domain",
  INIT: "Dictionary_Renderer_Init_Domain",
  SENTENCE: "Dictionary_Renderer_Sentence_Domain",
  TREE: "Dictionary_Renderer_Tree_Domain",
  COMMAND: "Dictionary_Renderer_Command_Domain",
  SNAPSHOT: "Dictionary_Renderer_Snapshot_Domain",
  SELECTION_DOMAIN: "Dictionary_Renderer_Selection_Domain",
  HISTORY_DOMAIN: "Dictionary_Renderer_History_Domain",
  DIAGNOSTICS_DOMAIN: "Dictionary_Renderer_Diagnostics_Domain",
  STATISTICS_DOMAIN: "Dictionary_Renderer_Statistics_Domain",
  UNIVERSE_DOMAIN: "Dictionary_Renderer_Universe_Domain",
  UNIVERSE_RENDER_DOMAIN: "Dictionary_Renderer_Universe_Render_Domain",
  UNIVERSE_SELECTION_DOMAIN: "Dictionary_Renderer_Universe_Selection_Domain",
  UNIVERSE_EVENTS: "Dictionary_Renderer_Universe_Events",
  EVENTS_DOMAIN: "Dictionary_Renderer_Events_Domain",
  RUNTIME_TIMERS_DOMAIN: "Dictionary_Renderer_Runtime_Timers_Domain",
  MATH_SCALAR: "Dictionary_Math_Scalar_Utils",
  MATH_PROJECTION: "Dictionary_Math_Projection_Utils",
  MATH_GRAPH: "Dictionary_Math_Graph_Utils",
  MATH_CAMERA: "Dictionary_Math_Camera_Utils"
});

function runExtractedFunction(moduleKey, functionKey, args = [], fallback = null) {
  const moduleApi = window[moduleKey] || null;
  const directFn = moduleApi && typeof moduleApi[functionKey] === "function" ? moduleApi[functionKey] : null;
  if (typeof directFn === "function") {
    return directFn(...args);
  }

  if (typeof fallback === "function") {
    return fallback(...args);
  }

  throw new Error(`Missing extracted implementation: ${moduleKey}.${functionKey}`);
}

const DISPATCH_SPECS_SOURCE = window.Dictionary_Renderer_Dispatch_Specs || window.DictionaryRendererDispatchSpecs || {};
const DISPATCH_SPEC_MAP = DISPATCH_SPECS_SOURCE.DISPATCH_SPEC_MAP || {};
const FUNCTION_DISPATCH_SPEC = DISPATCH_SPECS_SOURCE.FUNCTION_DISPATCH_SPEC || {};
const DISPATCH = createRendererDispatch({
  moduleKeyMap: PATTERN_EXTRACTED_MODULE,
  dispatchSpecMap: DISPATCH_SPEC_MAP,
  functionDispatchSpec: FUNCTION_DISPATCH_SPEC,
  callByModule: (moduleAlias, functionName, args) => {
    const callArgs = Array.isArray(args) ? args : [];
    return runExtractedFunction(PATTERN_EXTRACTED_MODULE[moduleAlias], functionName, callArgs);
  },
  callByFunction: (moduleAlias, functionName, args) => {
    return runExtractedFunction(PATTERN_EXTRACTED_MODULE[moduleAlias], functionName, args);
  }
});

const RENDERER_TEXT_UTILS = createRendererTextUtils({
  max: MAX,
  partsOfSpeech: PARTS_OF_SPEECH,
  normalizeWordLowerImpl: normalizeWordLowerUtil,
  rules: RENDERER_TEXT_RULES
});
const {
  cleanText,
  unique,
  nowIso,
  parseLabels,
  normalizeLabelArray,
  keyForLabel,
  keyForCategory,
  isPartOfSpeechLabel,
  normalizeEntryMode,
  normalizeEntryLanguage,
  inferLabelsFromDefinition,
  inferQuestionLabelsFromDefinition,
  sanitizeDefinitionText,
  normalizeWordLower,
  isCodeLikeMode,
  isBytesMode,
  shouldInferModeLabels,
  resolveEntryModeLabelHint,
  resolveEntryModePlaceholder,
  isBytesPayloadLike,
  getBytesWarningText,
  detectPosConflicts
} = RENDERER_TEXT_UTILS;

function setStatus(...args) {
  return DISPATCH.UI_SHELL.setStatus(...args);
}

function formatSaved(...args) {
  return DISPATCH.UI_SHELL.formatSaved(...args);
}

function setHelperText(...args) {
  return DISPATCH.UI_SHELL.setHelperText(...args);
}

function setAuthHint(...args) {
  return DISPATCH.UI_SHELL.setAuthHint(...args);
}

function setAuthGateVisible(...args) {
  return DISPATCH.UI_SHELL.setAuthGateVisible(...args);
}

function setAuthMode(...args) {
  return DISPATCH.UI_SHELL.setAuthMode(...args);
}

function getAuthCredentials(...args) {
  return DISPATCH.UI_SHELL.getAuthCredentials(...args);
}

function pushRuntimeLog(...args) {
  return DISPATCH.DIAGNOSTICS_DOMAIN.pushRuntimeLog(...args);
}

function getAuthSubmitHint(mode = G_RT.authMode) {
  return getAuthSubmitHintUtil(mode);
}

function resetAuthHintIfNeeded() {
  if (G_RT.authBusy) {
    return;
  }
  setAuthHint(getAuthSubmitHint());
}

function setEntryWarnings(...args) {
  return DISPATCH.DIAGNOSTICS_DOMAIN.setEntryWarnings(...args);
}

function setSentenceStatus(...args) {
  return DISPATCH.DIAGNOSTICS_DOMAIN.setSentenceStatus(...args);
}

function renderDiagnosticsSummary(...args) {
  return DISPATCH.DIAGNOSTICS_DOMAIN.renderDiagnosticsSummary(...args);
}

function clearEntrySelections(...args) {
  return DISPATCH.SELECTION_DOMAIN.clearEntrySelections(...args);
}

function updateHistoryRestoreOptions(...args) {
  return DISPATCH.HISTORY_DOMAIN.updateHistoryRestoreOptions(...args);
}

function captureUndoSnapshot(...args) {
  return DISPATCH.HISTORY_DOMAIN.captureUndoSnapshot(...args);
}

function scheduleIndexWarmup(...args) {
  return DISPATCH.RUNTIME_TIMERS_DOMAIN.scheduleIndexWarmup(...args);
}

function scheduleGraphBuild(...args) {
  return DISPATCH.RUNTIME_TIMERS_DOMAIN.scheduleGraphBuild(...args);
}

function updateUniverseBookmarkSelect(...args) {
  return DISPATCH.UNIVERSE_RENDER_DOMAIN.updateUniverseBookmarkSelect(...args);
}

function syncCanvasVisibility(...args) {
  return DISPATCH.UNIVERSE_RENDER_DOMAIN.syncCanvasVisibility(...args);
}

function renderPerfHud(...args) {
  return DISPATCH.UNIVERSE_RENDER_DOMAIN.renderPerfHud(...args);
}

function renderStatisticsView(...args) {
  return DISPATCH.STATISTICS_DOMAIN.renderStatisticsView(...args);
}

function syncUiSettingsControls(...args) {
  return DISPATCH.INIT.syncUiSettingsControls(...args);
}

function syncExplorerLayoutControls(...args) {
  return DISPATCH.UI_SHELL.syncExplorerLayoutControls(...args);
}

function bindUniverseInteractions(...args) {
  return DISPATCH.UNIVERSE_EVENTS.bindUniverseInteractions(...args);
}

function bindActionElement(target, run) {
  if (!(target instanceof HTMLElement) || typeof run !== "function") {
    return;
  }
  target.addEventListener("click", (event) => {
    event.preventDefault();
    run(event);
  });
  target.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }
    event.preventDefault();
    run(event);
  });
}

async function loadDictionaryData(...args) {
  return DISPATCH.SNAPSHOT.loadDictionaryData(...args);
}

async function submitAuth(...args) {
  return DISPATCH.SNAPSHOT.submitAuth(...args);
}

function clearPendingLink() {
  G_APP.s.pendingLinkFromNodeId = null;
}

function setQuickCaptureStatus(message, isError = false) {
  if (!(G_DOM.quickCaptureStatus instanceof HTMLElement)) {
    return;
  }
  G_DOM.quickCaptureStatus.textContent = String(message || "");
  G_DOM.quickCaptureStatus.classList.toggle("error", Boolean(isError));
}

function setActiveView(view_key) {
  const next_view =
    view_key === VIEW_SENTENCE_GRAPH || view_key === VIEW_STATISTICS || view_key === VIEW_UNIVERSE
      ? view_key
      : VIEW_WORKBENCH;
  G_APP.s.activeView = next_view;
  const visibility_map = [
    [VIEW_WORKBENCH, G_DOM.workbenchView],
    [VIEW_SENTENCE_GRAPH, G_DOM.sentenceGraphView],
    [VIEW_STATISTICS, G_DOM.statisticsView],
    [VIEW_UNIVERSE, G_DOM.universeView]
  ];
  visibility_map.forEach(([key, node]) => {
    if (node instanceof HTMLElement) {
      node.classList.toggle("hidden", key !== next_view);
    }
  });
}

function normalizeLoadedEntry(entry) {
  const source = entry && typeof entry === "object" ? entry : null;
  if (!source) {
    return null;
  }
  const word = cleanText(source.word, MAX.WORD);
  const definition = cleanText(source.definition, MAX.DEFINITION);
  if (!word || !definition) {
    return null;
  }
  return {
    id: cleanText(source.id, MAX.WORD) || window.crypto.randomUUID(),
    word,
    definition,
    labels: normalizeLabelArray(source.labels),
    favorite: Boolean(source.favorite),
    archivedAt: source.archivedAt || null,
    mode: normalizeEntryMode(source.mode),
    language: normalizeEntryLanguage(source.language || ""),
    usageCount: Math.max(0, Math.floor(Number(source.usageCount) || 0)),
    createdAt: cleanText(source.createdAt, MAX.DATE) || nowIso(),
    updatedAt: cleanText(source.updatedAt, MAX.DATE) || nowIso()
  };
}

function normalizeLoadedSentenceGraph(graph) {
  const source = graph && typeof graph === "object" ? graph : {};
  const nodes = Array.isArray(source.nodes)
    ? source.nodes
        .map((node, index) => {
          const item = node && typeof node === "object" ? node : {};
          const id = cleanText(item.id, MAX.WORD) || `node-${index + 1}`;
          const word = cleanText(item.word, MAX.WORD);
          return {
            id,
            entryId: cleanText(item.entryId, MAX.WORD),
            word,
            x: clampNumber(Number(item.x), 8, 2012),
            y: clampNumber(Number(item.y), 8, 1136),
            locked: Boolean(item.locked)
          };
        })
        .filter((node) => node.word)
    : [];
  const node_id_set = new Set(nodes.map((node) => node.id));
  const links = Array.isArray(source.links)
    ? source.links
        .map((link, index) => {
          const item = link && typeof link === "object" ? link : {};
          const fromNodeId = cleanText(item.fromNodeId, MAX.WORD);
          const toNodeId = cleanText(item.toNodeId, MAX.WORD);
          if (!node_id_set.has(fromNodeId) || !node_id_set.has(toNodeId) || fromNodeId === toNodeId) {
            return null;
          }
          return {
            id: cleanText(item.id, MAX.WORD) || `link-${index + 1}`,
            fromNodeId,
            toNodeId
          };
        })
        .filter(Boolean)
    : [];
  return { nodes, links };
}

function resetEditor() {
  G_APP.s.selectedEntryId = null;
  if (G_DOM.wordInput instanceof HTMLInputElement) {
    G_DOM.wordInput.value = "";
  }
  if (G_DOM.definitionInput instanceof HTMLTextAreaElement) {
    G_DOM.definitionInput.value = "";
  }
  if (G_DOM.labelsInput instanceof HTMLInputElement) {
    G_DOM.labelsInput.value = "";
  }
  if (G_DOM.entryLanguageInput instanceof HTMLInputElement) {
    G_DOM.entryLanguageInput.value = "";
  }
  if (G_DOM.entryModeSelect instanceof HTMLSelectElement) {
    G_DOM.entryModeSelect.value = "definition";
  }
  setHelperText(PATTERN_HELPER_TEXT.DEFAULT);
  setEntryWarnings([]);
}

async function loadUniverseCache() {
  if (typeof window.app_api?.loadUniverseCache !== "function") {
    return false;
  }
  try {
    const payload = await window.app_api.loadUniverseCache();
    if (payload && typeof payload === "object" && payload.graph && typeof payload.graph === "object") {
      G_UNI.graph = payload.graph;
      if (payload.config && typeof payload.config === "object") {
        G_UNI.cfg = {
          ...G_UNI.cfg,
          ...payload.config
        };
      }
      return true;
    }
  } catch (error) {
    recordDiagnosticError("universe_cache_load_failed", String(error?.message || error), "loadUniverseCache");
  }
  return false;
}

async function loadUniverseGpuStatus(force = false) {
  if (typeof window.app_api?.getGpuStatus !== "function") {
    return null;
  }
  try {
    const gpu_status = await window.app_api.getGpuStatus();
    if (typeof DISPATCH.UNIVERSE_RENDER_DOMAIN.showUniverseGpuStatus === "function") {
      DISPATCH.UNIVERSE_RENDER_DOMAIN.showUniverseGpuStatus(gpu_status, force);
    }
    return gpu_status;
  } catch (error) {
    recordDiagnosticError("gpu_status_load_failed", String(error?.message || error), "loadUniverseGpuStatus");
    return null;
  }
}

function getDuplicateEntry(word, excludeId = "") {
  const normalizedWord = normalizeWordLower(word);
  if (!normalizedWord) {
    return null;
  }
  const indexed = G_PAGE.dictionary.getEntriesIndex().byWordLower.get(normalizedWord) || null;
  if (!indexed) {
    return null;
  }
  if (excludeId && indexed.id === excludeId) {
    return null;
  }
  return indexed;
}

function clampNumber(value, min, max) {
  return runExtractedFunction(
    PATTERN_EXTRACTED_MODULE.MATH_SCALAR,
    "clamp_number",
    [value, min, max],
    (input, minValue, maxValue) => {
      const num = Number(input);
      if (!Number.isFinite(num)) {
        return minValue;
      }
      return Math.min(maxValue, Math.max(minValue, num));
    }
  );
}

function syncControls(...args) {
  return DISPATCH.UNIVERSE_RENDER_DOMAIN.syncControls(...args);
}

function setPathStatus(...args) {
  return DISPATCH.UNIVERSE_RENDER_DOMAIN.setPathStatus(...args);
}

function createUniverseBenchmarkState(...args) {
  return DISPATCH.UNIVERSE_RENDER_DOMAIN.createUniverseBenchmarkState(...args);
}

function renderSummary() {
  if (!(G_DOM.universeSummary instanceof HTMLElement)) {
    return;
  }
  const meta = G_UNI.graph.meta || {};
  const nodes = Number(meta.nodeCount) || G_UNI.graph.nodes.length || 0;
  const edges = Number(meta.edgeCount) || G_UNI.graph.edges.length || 0;
  const components = Number(meta.components) || 0;
  const isolated = Number(meta.isolated) || 0;
  const largest = Number(meta.largestComponent) || 0;
  const cappedText = meta.capped ? " Edge cap reached." : "";
  const filter = cleanText(G_UNI.view.filter, MAX.WORD);
  const selectedCount = DISPATCH.UNIVERSE_SELECTION_DOMAIN.getUniverseSelectedIndicesSorted().length;
  const activeSet = G_UNI.sel.sets.find((set) => set.id === G_UNI.sel.activeSetId);
  const base = `Universe: ${nodes} words, ${edges} links, ${components} clusters, ${isolated} isolated, largest cluster ${largest}. Selected: ${selectedCount}. Drag to pan, wheel to zoom.${cappedText}`;
  const withFilter = filter ? `${base} Highlight: "${filter}".` : base;
  G_DOM.universeSummary.textContent = activeSet ? `${withFilter} Active set: "${activeSet.name}".` : withFilter;
  DISPATCH.UNIVERSE_RENDER_DOMAIN.renderPerfHud();
}

function clearProjectionCache() {
  G_UNI_FX.clearProjectionCache();
}

function resetHighlightCache() {
  G_UNI.canvas.flags.highlight = new Uint8Array(0);
  G_UNI.canvas.cache.highlightCount = 0;
  G_UNI.canvas.cache.highlightKey = "";
}

function syncPathFlags() {
  G_UNI.canvas.flags.path = buildIdxFlags(G_UNI.graph.nodes.length, G_UNI.path.nodeIdx);
}

function resetAdjacencyCache() {
  G_UNI.canvas.cache.adjacencyKey = "";
  G_UNI.canvas.cache.adjacency = [];
}

function reqGraph(...args) {
  return DISPATCH.UNIVERSE_RENDER_DOMAIN.reqGraph(...args);
}

function renderClusterPanel(selectedIndex = G_UNI.view.selectedNodeIndex) {
  return DISPATCH.UNIVERSE_DOMAIN.renderClusterPanel(selectedIndex);
}

function requestStatsWorkerComputeNow(...args) {
  return DISPATCH.STATISTICS_DOMAIN.requestStatsWorkerComputeNow(...args);
}

function clearPathHighlights() {
  G_UNI.path.edgeKeys = new Set();
  G_UNI.path.nodeIdx = [];
  G_UNI.path.words = [];
  syncPathFlags();
  G_PAGE.universe.setPathStatus("Path finder ready.");
}

function invalidateUniverseGraph() {
  G_RT.uGraphKey = "";
  G_RT.uDataSig = "";
  G_UNI.graph = createEmptyUniverseGraph();
  clearProjectionCache();
  resetHighlightCache();
  resetAdjacencyCache();
  G_UNI.idx.entry = new Map();
  G_UNI.idx.word = new Map();
  G_UNI.sel.nodeIdxSet = new Set();
  G_UNI.canvas.flags.selected = new Uint8Array(0);
  G_UNI.sel.activeSetId = "";
  clearPathHighlights();
  G_UNI.view.hoverNodeIndex = -1;
  G_UNI.view.selectedNodeIndex = -1;
  G_PAGE.universe.renderCluster();
}

function requestGraphBuildNow() {
  return DISPATCH.UNIVERSE_DOMAIN.requestGraphBuildNow();
}

function markEntriesDirty() {
  G_RT.entriesVersion += 1;
  G_RT.entriesIndexDirty = true;
  G_RT.treeModelKey = "";
  G_RT.treeModelVal = null;
  G_RT.searchKey = "";
  G_RT.searchVal = null;
  G_RT.labelOptsKey = "";
  G_RT.sentenceSugKey = "";
  G_RT.sentenceSugVal = [];
  DISPATCH.STATISTICS_DOMAIN.invalidateStatisticsCache();
  invalidateUniverseGraph();
  DISPATCH.RUNTIME_TIMERS_DOMAIN.scheduleIndexWarmup();
  DISPATCH.STATISTICS_DOMAIN.scheduleStatsWorkerCompute();
  DISPATCH.RUNTIME_TIMERS_DOMAIN.scheduleGraphBuild();
  DISPATCH.HISTORY_DOMAIN.captureUndoSnapshot("entries");
}

function markGraphDirty() {
  G_RT.gVer += 1;
  G_RT.gLayoutVer += 1;
  G_RT.gIdxDirty = true;
  G_RT.sentenceSugKey = "";
  G_RT.sentenceSugVal = [];
  DISPATCH.STATISTICS_DOMAIN.invalidateStatisticsCache();
  DISPATCH.RUNTIME_TIMERS_DOMAIN.scheduleIndexWarmup();
  DISPATCH.STATISTICS_DOMAIN.scheduleStatsWorkerCompute();
  DISPATCH.HISTORY_DOMAIN.captureUndoSnapshot("graph");
}

G_APP.st.setHooks({
  onEntriesMutation: markEntriesDirty,
  onGraphMutation: markGraphDirty
});

function rebuildGraphIndex() {
  return buildGraphIndex(G_APP.s.sentenceGraph.nodes, G_APP.s.sentenceGraph.links);
}

function getEntriesIndex() {
  (G_RT.entriesIndexDirty || !G_RT.entriesIndexCache) &&
    ((G_RT.entriesIndexCache = buildEntriesIndex(G_APP.s.labels, G_APP.s.entries)), (G_RT.entriesIndexDirty = false));
  return G_RT.entriesIndexCache;
}

function getIdx() {
  (G_RT.gIdxDirty || !G_RT.gIdxCache) && ((G_RT.gIdxCache = rebuildGraphIndex()), (G_RT.gIdxDirty = false));
  return G_RT.gIdxCache;
}

function reqTree() {
  if (G_RT.treeFrame) {
    return;
  }
  G_RT.treeFrame = window.requestAnimationFrame(() => {
    G_RT.treeFrame = 0;
    DISPATCH.TREE.renderTree();
  });
}

function reqSentence(options = {}) {
  const refreshPreview = options.refreshPreview !== false;
  const refreshSuggestions = options.refreshSuggestions !== false;
  const force = options.force === true;
  G_RT.gNeedPreview = G_RT.gNeedPreview || refreshPreview;
  G_RT.gNeedSuggest = G_RT.gNeedSuggest || refreshSuggestions;
  if (!force && !DISPATCH.UNIVERSE_RENDER_DOMAIN.isSentenceGraphVisible()) {
    return;
  }

  if (G_RT.graphFrame) {
    return;
  }

  G_RT.graphFrame = window.requestAnimationFrame(() => {
    G_RT.graphFrame = 0;
    const nextPreview = G_RT.gNeedPreview;
    const nextSuggestions = G_RT.gNeedSuggest;
    G_RT.gNeedPreview = false;
    G_RT.gNeedSuggest = false;
    DISPATCH.SENTENCE.renderSentenceGraph({
      refreshPreview: nextPreview,
      refreshSuggestions: nextSuggestions
    });
  });
}

function getNode(nodeId) {
  const id = cleanText(nodeId, MAX.WORD);
  if (!id) {
    return null;
  }
  return G_PAGE.sentence.getIndex().nodeById.get(id) || null;
}

function getPrimaryPartOfSpeech(entry) {
  if (!entry || !Array.isArray(entry.labels)) {
    return "";
  }
  const posLabel = entry.labels.find((label) => isPartOfSpeechLabel(label));
  return posLabel ? posLabel.toLowerCase() : "";
}

function getEntryBacklinkCount(entryId) {
  const id = cleanText(entryId, MAX.WORD);
  if (!id) {
    return 0;
  }
  return Number(G_PAGE.sentence.getIndex().backlinkCountByEntryId?.get(id) || 0);
}

function getNearDuplicateEntries(word, excludeId = "") {
  return buildNearDuplicateCluster(
    G_APP.s.entries.filter((entry) => !entry.archivedAt),
    word,
    { excludeId, limit: 8 }
  );
}

function getRelatedEntries(entry, limit = 6) {
  if (!entry) {
    return [];
  }
  const entryLabels = new Set(entry.labels.map((label) => label.toLowerCase()));
  const entryPos = getPrimaryPartOfSpeech(entry);
  const linkedEntryIds = new Set();
  const nodeIds = G_APP.s.sentenceGraph.nodes.filter((node) => node.entryId === entry.id).map((node) => node.id);
  const outgoing = G_PAGE.sentence.getIndex().outgoingIdsByNodeId;
  const incoming = G_PAGE.sentence.getIndex().incomingIdsByNodeId;
  nodeIds.forEach((nodeId) => {
    (outgoing.get(nodeId) || []).forEach((targetId) => {
      const node = G_PAGE.sentence.getNode(targetId);
      node?.entryId && linkedEntryIds.add(node.entryId);
    });
    (incoming.get(nodeId) || []).forEach((sourceId) => {
      const node = G_PAGE.sentence.getNode(sourceId);
      node?.entryId && linkedEntryIds.add(node.entryId);
    });
  });

  const scored = G_APP.s.entries
    .filter((candidate) => candidate.id !== entry.id && !candidate.archivedAt)
    .map((candidate) => {
      const labelOverlap = candidate.labels.filter((label) => entryLabels.has(label.toLowerCase())).length;
      const posMatch = entryPos && getPrimaryPartOfSpeech(candidate) === entryPos ? 1 : 0;
      const graphLinked = linkedEntryIds.has(candidate.id) ? 1 : 0;
      const score = labelOverlap * 3 + posMatch * 2 + graphLinked * 4;
      return {
        entry: candidate,
        score
      };
    })
    .filter((item) => item.score > 0)
    .sort((left, right) => right.score - left.score || left.entry.word.localeCompare(right.entry.word))
    .slice(0, limit)
    .map((item) => item.entry);

  return scored;
}

function applyLocalAssist(formData) {
  if (!G_APP.s.localAssistEnabled) {
    return {
      formData,
      warnings: []
    };
  }
  const normalizedMode = normalizeEntryMode(formData.mode);
  const next = {
    ...formData,
    mode: normalizedMode,
    definition: isCodeLikeMode(normalizedMode)
      ? cleanText(formData.definition, MAX.DEFINITION)
      : sanitizeDefinitionText(formData.definition),
    labels: normalizeLabelArray(formData.labels)
  };
  const inferredLabels = inferLabelsFromDefinition(next.definition);
  const inferredQuestionLabels = inferQuestionLabelsFromDefinition(next.definition);
  inferredLabels.length > 0 && (next.labels = unique([...next.labels, ...inferredLabels]));
  inferredQuestionLabels.length > 0 && (next.labels = unique([...next.labels, ...inferredQuestionLabels]));
  const modeLabelHint = resolveEntryModeLabelHint(next.mode);
  if (modeLabelHint && !next.labels.some((label) => label.toLowerCase() === modeLabelHint)) {
    next.labels = unique([...next.labels, modeLabelHint]);
  }

  const posLabels = detectPosConflicts(next.labels);
  const warnings = [];
  if (posLabels.length > 1) {
    warnings.push(`POS conflict: ${posLabels.join(", ")}`);
  }
  isBytesMode(next.mode) &&
    next.definition.length > 0 &&
    !isBytesPayloadLike(next.definition) &&
    warnings.push(getBytesWarningText());

  return {
    formData: next,
    warnings
  };
}

function updateEntryModeVisualState() {
  const mode = normalizeEntryMode(
    G_DOM.entryModeSelect instanceof HTMLSelectElement ? G_DOM.entryModeSelect.value : ""
  );
  const isCodeLike = isCodeLikeMode(mode);
  if (G_DOM.definitionInput instanceof HTMLTextAreaElement) {
    G_DOM.definitionInput.classList.toggle("codeInput", isCodeLike);
    G_DOM.definitionInput.placeholder = resolveEntryModePlaceholder(mode);
  }
}

function ensureLabelExists(label) {
  if (!label) {
    return;
  }
  G_APP.st.addLabel(label) && G_APP.s.labels.sort((a, b) => a.localeCompare(b));
}

function ensureLabelsExist(labels) {
  labels.forEach(ensureLabelExists);
}

function buildSnapshot() {
  return DISPATCH.SNAPSHOT.buildSnapshot();
}
function getSelectedEntry() {
  if (!G_APP.s.selectedEntryId) {
    return null;
  }
  return DISPATCH.SELECTION_DOMAIN.getEntryById(G_APP.s.selectedEntryId);
}

function sortEntries() {
  G_APP.s.entries.sort((a, b) => {
    if (Boolean(a.favorite) !== Boolean(b.favorite)) {
      return a.favorite ? -1 : 1;
    }
    return a.word.localeCompare(b.word, undefined, { sensitivity: "base" }) || a.word.localeCompare(b.word);
  });
}

function getGroupLimit(groupKey) {
  !G_APP.s.groupLimits[groupKey] && (G_APP.s.groupLimits[groupKey] = TREE_PAGE_SIZE);
  return G_APP.s.groupLimits[groupKey];
}

function setGroupExpanded(groupKey, expanded) {
  G_APP.s.expandedGroups[groupKey] = Boolean(expanded);
  expanded && getGroupLimit(groupKey);
}

function getEntriesForLabel(label) {
  return G_PAGE.dictionary.getEntriesIndex().byLabel.get(label) || [];
}

function getUnlabeledEntries() {
  return G_PAGE.dictionary.getEntriesIndex().unlabeled;
}

function getCategoryKeyForLabel(label) {
  if (label === UNLABELED_NAME) {
    return CATEGORY_UNLABELED_KEY;
  }
  if (isPartOfSpeechLabel(label)) {
    return CATEGORY_POS_KEY;
  }
  return CATEGORY_LABELS_KEY;
}

function ensureEntryVisible(entry) {
  const labels = entry.labels.length > 0 ? entry.labels : [UNLABELED_NAME];

  labels.forEach((label) => {
    const groupKey = label === UNLABELED_NAME ? UNLABELED_KEY : keyForLabel(label);
    const categoryKey = keyForCategory(getCategoryKeyForLabel(label));
    setGroupExpanded(categoryKey, true);
    setGroupExpanded(groupKey, true);

    const groupEntries = label === UNLABELED_NAME ? getUnlabeledEntries() : getEntriesForLabel(label);
    const index = groupEntries.findIndex((item) => item.id === entry.id);
    if (index < 0) {
      return;
    }

    if (shouldVirtualizeGroup(groupEntries.length, TREE_VIRTUALIZATION_THRESHOLD)) {
      G_APP.s.groupScrollTops[groupKey] = Math.max(0, (index - 2) * TREE_VIRTUAL_ROW_HEIGHT);
      return;
    }

    const requiredLimit = Math.ceil((index + 1) / TREE_PAGE_SIZE) * TREE_PAGE_SIZE;
    getGroupLimit(groupKey) < requiredLimit && (G_APP.s.groupLimits[groupKey] = requiredLimit);
  });
}

async function saveState() {
  const startedAt = performance.now();
  try {
    DISPATCH.HISTORY_DOMAIN.ensureCheckpoint("autosave");
    const response = await window.app_api.save(buildSnapshot());
    G_APP.s.lastSavedAt = response.lastSavedAt || nowIso();
    DISPATCH.UI_SHELL.setStatus(DISPATCH.UI_SHELL.formatSaved(G_APP.s.lastSavedAt));
    DISPATCH.HISTORY_DOMAIN.updateHistoryRestoreOptions();
    DISPATCH.DIAGNOSTICS_DOMAIN.recordDiagnosticPerf("save_state_ms", performance.now() - startedAt);
  } catch (error) {
    DISPATCH.UI_SHELL.setStatus("Save failed.", true);
    DISPATCH.DIAGNOSTICS_DOMAIN.recordDiagnosticError("save_failed", String(error?.message || error), "saveState");
    console.error(error);
  }
}

function scheduleAutosave() {
  if (!G_RT.readyForAutosave) {
    return;
  }

  DISPATCH.RUNTIME_TIMERS_DOMAIN.clearAutosaveTimer();
  DISPATCH.UI_SHELL.setStatus("Saving...");
  G_RT.autosaveTask.schedule();
}

function renderEntryInsights(entry = null) {
  if (!(G_DOM.entryInsights instanceof HTMLElement)) {
    return;
  }
  if (!entry) {
    G_DOM.entryInsights.textContent = "Insights appear when you select an entry.";
    return;
  }
  const backlinks = getEntryBacklinkCount(entry.id);
  const nearDuplicates = getNearDuplicateEntries(entry.word, entry.id).map((item) => item.word);
  const related = getRelatedEntries(entry, 5).map((item) => item.word);
  const archiveStatus = entry.archivedAt ? `Archived: ${new Date(entry.archivedAt).toLocaleString()}` : "Active";
  const favoriteStatus = entry.favorite ? "Favorite" : "Not favorite";
  const modeStatus = `Mode: ${normalizeEntryMode(entry.mode)}${entry.language ? ` (${entry.language})` : ""}`;
  const usageStatus = `Usage score: ${DISPATCH.STATISTICS_DOMAIN.getEntryUsageScore(entry)}`;
  const duplicateText = nearDuplicates.length > 0 ? `Near matches: ${nearDuplicates.join(", ")}` : "Near matches: none";
  const relatedText = related.length > 0 ? `Related: ${related.join(", ")}` : "Related: none";
  G_DOM.entryInsights.textContent = `Backlinks: ${backlinks}. ${favoriteStatus}. ${archiveStatus}. ${modeStatus}. ${usageStatus}. ${duplicateText}. ${relatedText}.`;
}

function renderEditorForNewEntry() {
  DISPATCH.RUNTIME_TIMERS_DOMAIN.clearEntryCommitTimer();
  G_APP.s.selectedEntryId = null;
  G_DOM.formTitle.textContent = "New Entry";
  G_DOM.entryForm.reset();
  G_DOM.entryModeSelect instanceof HTMLSelectElement && (G_DOM.entryModeSelect.value = normalizeEntryMode(""));
  G_DOM.entryLanguageInput instanceof HTMLInputElement && (G_DOM.entryLanguageInput.value = "");
  updateEntryModeVisualState();
  DISPATCH.UI_SHELL.setHelperText(PATTERN_HELPER_TEXT.DEFAULT);
  DISPATCH.DIAGNOSTICS_DOMAIN.setEntryWarnings([]);
  renderEntryInsights(null);
  DISPATCH.SELECTION_DOMAIN.syncSelectionWithEntry("");
}

function renderEditorForEntry(entry, options = {}) {
  const { syncSelection = true, syncUniverse = true } = options;
  DISPATCH.RUNTIME_TIMERS_DOMAIN.clearEntryCommitTimer();
  G_APP.s.selectedEntryId = entry.id;
  syncSelection && DISPATCH.SELECTION_DOMAIN.setSingleEntrySelection(entry.id);
  G_DOM.formTitle.textContent = `Edit: ${entry.word}`;
  G_DOM.wordInput.value = entry.word;
  G_DOM.entryModeSelect instanceof HTMLSelectElement && (G_DOM.entryModeSelect.value = normalizeEntryMode(entry.mode));
  G_DOM.entryLanguageInput instanceof HTMLInputElement &&
    (G_DOM.entryLanguageInput.value = normalizeEntryLanguage(entry.language || ""));
  updateEntryModeVisualState();
  G_DOM.definitionInput.value = entry.definition;
  G_DOM.labelsInput.value = entry.labels.join(", ");
  const near = getNearDuplicateEntries(entry.word, entry.id)
    .map((item) => item.word)
    .slice(0, 4);
  DISPATCH.UI_SHELL.setHelperText(
    near.length > 0 ? `${PATTERN_HELPER_TEXT.SELECTED} Similar: ${near.join(", ")}` : PATTERN_HELPER_TEXT.SELECTED
  );
  DISPATCH.DIAGNOSTICS_DOMAIN.setEntryWarnings([]);
  renderEntryInsights(entry);
  syncUniverse && DISPATCH.SELECTION_DOMAIN.syncSelectionWithEntry(entry.id);
}

function incrementEntryUsage(entryId, amount = 1) {
  const id = cleanText(entryId, MAX.WORD);
  if (!id) {
    return;
  }
  const delta = Math.max(0, Math.floor(Number(amount) || 0));
  if (delta <= 0) {
    return;
  }
  G_APP.st.updateEntryById(id, (entry) => ({
    ...entry,
    usageCount: Math.max(0, Math.floor(Number(entry.usageCount) || 0) + delta)
  }));
}

function collectEntryFromForm() {
  const labelsFromForm = parseLabels(G_DOM.labelsInput.value);
  const fallbackLabel = DISPATCH.UI_SHELL.resolvePreferredEntryLabel();
  return {
    word: cleanText(G_DOM.wordInput.value, MAX.WORD),
    definition: cleanText(G_DOM.definitionInput.value, MAX.DEFINITION),
    labels: labelsFromForm.length > 0 ? labelsFromForm : fallbackLabel ? [fallbackLabel] : [],
    mode: normalizeEntryMode(G_DOM.entryModeSelect instanceof HTMLSelectElement ? G_DOM.entryModeSelect.value : ""),
    language: normalizeEntryLanguage(
      G_DOM.entryLanguageInput instanceof HTMLInputElement ? G_DOM.entryLanguageInput.value : ""
    )
  };
}

function createEntryFromFormData(formData) {
  return {
    id: window.crypto.randomUUID(),
    word: formData.word,
    definition: formData.definition,
    labels: formData.labels,
    mode: formData.mode,
    language: formData.language,
    usageCount: 0,
    favorite: false,
    archivedAt: null,
    createdAt: nowIso(),
    updatedAt: nowIso()
  };
}

function updateEntryFromFormData(entry, formData) {
  return {
    ...entry,
    word: formData.word,
    definition: formData.definition,
    labels: formData.labels,
    mode: formData.mode,
    language: formData.language,
    usageCount: Math.max(0, Math.floor(Number(entry.usageCount) || 0)),
    archivedAt: entry.archivedAt || null,
    favorite: Boolean(entry.favorite),
    updatedAt: nowIso()
  };
}

function saveEntryFromForm(options = {}) {
  const { advanceToNext = false, forceNewAfterSave = false } = options;
  const wasEditing = Boolean(G_APP.s.selectedEntryId);
  let formData = collectEntryFromForm();
  if (!formData.word || !formData.definition) {
    DISPATCH.UI_SHELL.setStatus("Word and definition are required.", true);
    return false;
  }

  const localAssist = applyLocalAssist(formData);
  formData = localAssist.formData;
  DISPATCH.DIAGNOSTICS_DOMAIN.setEntryWarnings(localAssist.warnings);
  G_DOM.definitionInput.value = formData.definition;
  G_DOM.labelsInput.value = formData.labels.join(", ");

  const duplicate = getDuplicateEntry(formData.word, G_APP.s.selectedEntryId || "");
  if (duplicate) {
    DISPATCH.UI_SHELL.setStatus(`Duplicate word "${formData.word}" already exists.`, true);
    DISPATCH.UI_SHELL.setHelperText(
      `Duplicate detected: "${formData.word}". Use batch import merge modes or edit existing entry.`
    );
    DISPATCH.DIAGNOSTICS_DOMAIN.setEntryWarnings([`Duplicate word: ${formData.word}`]);
    return false;
  }

  const inferredLabels = shouldInferModeLabels(formData.mode) ? inferLabelsFromDefinition(formData.definition) : [];
  const inferredQuestionLabels = inferQuestionLabelsFromDefinition(formData.definition);
  if (inferredLabels.length > 0 || inferredQuestionLabels.length > 0) {
    formData.labels = unique([...formData.labels, ...inferredLabels, ...inferredQuestionLabels]);
    G_DOM.labelsInput.value = formData.labels.join(", ");
  }

  ensureLabelsExist(formData.labels);

  if (!G_APP.s.selectedEntryId) {
    const entry = createEntryFromFormData(formData);
    G_APP.st.addEntry(entry);
    incrementEntryUsage(entry.id, 1);
    G_APP.s.selectedEntryId = entry.id;
  } else {
    G_APP.st.updateEntryById(G_APP.s.selectedEntryId, (entry) => updateEntryFromFormData(entry, formData));
    incrementEntryUsage(G_APP.s.selectedEntryId, 1);
  }

  sortEntries();

  const selectedEntry = getSelectedEntry();
  if (forceNewAfterSave) {
    if (selectedEntry) {
      ensureEntryVisible(selectedEntry);
    }
    renderEditorForNewEntry();
    DISPATCH.UI_SHELL.setHelperText(PATTERN_HELPER_TEXT.SAVED_NEXT);
    G_DOM.wordInput.focus();
  } else if (selectedEntry && !(advanceToNext && !wasEditing)) {
    ensureEntryVisible(selectedEntry);
    renderEditorForEntry(selectedEntry);
  } else if (advanceToNext && !wasEditing) {
    selectedEntry && ensureEntryVisible(selectedEntry);
    renderEditorForNewEntry();
    DISPATCH.UI_SHELL.setHelperText(PATTERN_HELPER_TEXT.SAVED_NEXT);
    G_DOM.wordInput.focus();
  } else {
    renderEditorForNewEntry();
  }

  G_PAGE.tree.reqRender();
  G_PAGE.sentence.reqRender();
  DISPATCH.STATISTICS_DOMAIN.renderStatisticsView();
  if (localAssist.warnings.length > 0) {
    DISPATCH.UI_SHELL.setHelperText(`${PATTERN_HELPER_TEXT.SELECTED} ${localAssist.warnings.join(" | ")}`);
  }
  scheduleAutosave();
  return true;
}

function hasReadyDraftForAutoCommit() {
  if (G_RT.lookupInFlightRequestId !== 0) {
    return false;
  }

  const draft = collectEntryFromForm();
  return Boolean(draft.word && draft.definition);
}

function autoSaveDraftAndAdvance() {
  if (!hasReadyDraftForAutoCommit()) {
    return;
  }

  saveEntryFromForm({ advanceToNext: !G_APP.s.selectedEntryId });
}

function scheduleAutoCommitDraft(delayMs = CONSTANT_DELAY_MS.AUTO_ENTRY_COMMIT) {
  DISPATCH.RUNTIME_TIMERS_DOMAIN.clearEntryCommitTimer();

  if (!hasReadyDraftForAutoCommit()) {
    return;
  }

  G_RT.entryCommitTask.schedule(delayMs);
}

function mergeLookupLabels(lookupLabels) {
  const fromForm = parseLabels(G_DOM.labelsInput.value);
  const fromLookup = normalizeLabelArray(lookupLabels);
  const inferred = inferLabelsFromDefinition(G_DOM.definitionInput.value);
  const questionLabels = inferQuestionLabelsFromDefinition(G_DOM.definitionInput.value);
  return unique([...fromForm, ...fromLookup, ...inferred, ...questionLabels]);
}

async function lookupAndSaveEntry(wordOverride = "") {
  const word = cleanText(wordOverride || G_DOM.wordInput.value, MAX.WORD);
  if (!word) {
    DISPATCH.UI_SHELL.setStatus("Enter a word first.", true);
    return;
  }

  if (cleanText(G_DOM.definitionInput.value, MAX.DEFINITION)) {
    return;
  }

  if (!window.app_api?.lookupDefinition) {
    DISPATCH.UI_SHELL.setStatus("Lookup API unavailable.", true);
    return;
  }

  const requestId = ++G_RT.lookupRequestId;
  G_RT.lookupInFlightRequestId = requestId;
  DISPATCH.UI_SHELL.setStatus(`Looking up "${word}"...`);

  try {
    const result = await window.app_api.lookupDefinition(word);

    if (requestId !== G_RT.lookupRequestId) {
      return;
    }
    if (word !== cleanText(G_DOM.wordInput.value, MAX.WORD)) {
      return;
    }
    if (cleanText(G_DOM.definitionInput.value, MAX.DEFINITION)) {
      return;
    }
    if (!result?.ok) {
      DISPATCH.UI_SHELL.setStatus(result?.error || "Definition not found.", true);
      return;
    }

    G_DOM.definitionInput.value = cleanText(result.definition || "", MAX.DEFINITION);
    G_DOM.labelsInput.value = mergeLookupLabels(result.labels).join(", ");

    const saved = saveEntryFromForm({ advanceToNext: !G_APP.s.selectedEntryId });
    if (!saved) {
      return;
    }

    DISPATCH.RUNTIME_TIMERS_DOMAIN.clearAutosaveTimer();
    await saveState();
    if (G_APP.s.selectedEntryId) {
      DISPATCH.UI_SHELL.setHelperText(`Definition fetched online for "${word}" and saved locally.`);
    } else {
      DISPATCH.UI_SHELL.setHelperText(PATTERN_HELPER_TEXT.SAVED_NEXT);
    }
  } catch (error) {
    DISPATCH.UI_SHELL.setStatus("Lookup failed. Try again.", true);
    console.error(error);
  } finally {
    G_RT.lookupInFlightRequestId === requestId && (G_RT.lookupInFlightRequestId = 0);
    scheduleAutoCommitDraft();
  }
}

async function initializeAuthGate() {
  return DISPATCH.SNAPSHOT.initializeAuthGate();
}

function surfaceAuthBindError(error, source = "auth_bind") {
  const message = cleanText(String(error?.message || error || "Unknown auth error"), 240);
  DISPATCH.UI_SHELL.setAuthHint(`Auth error: ${message}`, true);
  DISPATCH.DIAGNOSTICS_DOMAIN.recordDiagnosticError(source, message, "renderer");
  console.error(error);
}

function bindAuthFallbackHandlers() {
  if (!(G_DOM.authForm instanceof HTMLFormElement)) {
    return;
  }
  if (G_DOM.authForm.dataset.boundFallbackAuth === "1") {
    return;
  }

  const run_submit = (event) => {
    event?.preventDefault?.();
    event?.stopPropagation?.();
    Promise.resolve(submitAuth()).catch((error) => {
      surfaceAuthBindError(error, "auth_submit_failed");
    });
  };

  G_DOM.authForm.dataset.boundFallbackAuth = "1";
  G_DOM.authForm.addEventListener("submit", run_submit);

  if (G_DOM.authUsernameInput instanceof HTMLInputElement) {
    G_DOM.authUsernameInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        run_submit(event);
      }
    });
  }
  if (G_DOM.authPasswordInput instanceof HTMLInputElement) {
    G_DOM.authPasswordInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        run_submit(event);
      }
    });
  }
}

function bindEvents() {
  try {
    return DISPATCH.EVENTS_DOMAIN.bindEvents();
  } catch (error) {
    surfaceAuthBindError(error, "bind_events_failed");
    return false;
  }
}

const LEGACY_RENDERER_BINDINGS = Object.freeze({
  HISTORY_MAX,
  createDefaultUniverseConfig,
  setStatus,
  formatSaved,
  setAuthGateVisible,
  setAuthMode,
  getAuthCredentials,
  pushRuntimeLog,
  resetAuthHintIfNeeded,
  setSentenceStatus,
  renderDiagnosticsSummary,
  clearEntrySelections,
  updateHistoryRestoreOptions,
  captureUndoSnapshot,
  scheduleIndexWarmup,
  scheduleGraphBuild,
  updateUniverseBookmarkSelect,
  syncCanvasVisibility,
  renderPerfHud,
  renderStatisticsView,
  syncUiSettingsControls,
  syncExplorerLayoutControls,
  bindUniverseInteractions,
  bindActionElement,
  loadDictionaryData,
  clearPendingLink,
  setQuickCaptureStatus,
  setActiveView,
  normalizeLoadedEntry,
  normalizeLoadedSentenceGraph,
  resetEditor,
  loadUniverseCache,
  loadUniverseGpuStatus
});

window.Dictionary_Renderer_Legacy_Bindings = LEGACY_RENDERER_BINDINGS;
window.DictionaryRendererLegacyBindings = LEGACY_RENDERER_BINDINGS;

async function initialize() {
  DISPATCH.UI_SHELL.setAuthGateVisible(true);
  bindAuthFallbackHandlers();
  DISPATCH.INIT.applyUiPreferences(createDefaultUiPreferences());
  window.app_api?.loadUiPreferences && (await DISPATCH.INIT.loadUiPreferencesFromDisk());
  DISPATCH.INIT.initializeUiMotion();
  DISPATCH.INIT.initializeStatsWorker();
  DISPATCH.INIT.initializeUniverseWorker();
  bindEvents();
  DISPATCH.DIAGNOSTICS_DOMAIN.renderDiagnosticsSummary();

  if (!window.app_api) {
    DISPATCH.UI_SHELL.setStatus("App bridge unavailable.", true);
    DISPATCH.UI_SHELL.setAuthHint("App bridge unavailable.", true);
    DISPATCH.UI_SHELL.setAuthGateVisible(true);
    return;
  }

  if (window.app_api.getRuntimeLogStatus) {
    try {
      const logStatus = await window.app_api.getRuntimeLogStatus();
      G_RT.runtimeLogEnabled = logStatus?.enabled !== false;
    } catch {
      G_RT.runtimeLogEnabled = false;
    }
  }

  DISPATCH.DIAGNOSTICS_DOMAIN.pushRuntimeLog("info", "renderer", "Renderer initialized.", "initialize");

  await initializeAuthGate();
}

initialize().catch((error) => {
  try {
    DISPATCH.UI_SHELL.setStatus("Initialization failed.", true);
    DISPATCH.UI_SHELL.setAuthHint("Initialization failed. Check runtime logs.", true);
    DISPATCH.UI_SHELL.setAuthGateVisible(true);
  } catch (_ignore) {
    // no-op: surface the original error in console below
  }
  console.error(error);
});
