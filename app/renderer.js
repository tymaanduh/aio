// All constants are loaded from modules/constants.js via window.Dictionary_Constants (legacy: window.DictionaryConstants)
const CONSTANTS_SOURCE = window.Dictionary_Constants || window.DictionaryConstants || {};

const {
  DEFAULT_LABELS, DEFAULT_HELPER_TEXT, SAVED_NEXT_HELPER_TEXT, SELECTED_HELPER_TEXT,
  LABEL_FILTER_ALL, LABEL_FILTER_UNLABELED, UNLABELED_NAME, UNLABELED_KEY,
  CATEGORY_POS_KEY, CATEGORY_LABELS_KEY, CATEGORY_UNLABELED_KEY, CATEGORY_FILTERED_KEY, TOP_TREE_LABELS,
  PARTS_OF_SPEECH, MAX,
  AUTOSAVE_DELAY_MS, AUTO_LOOKUP_DELAY_MS, AUTO_ENTRY_COMMIT_DELAY_MS, TREE_SEARCH_DELAY_MS, STATS_WORKER_SYNC_DELAY_MS,
  MIN_LOOKUP_LENGTH, TREE_PAGE_SIZE, TREE_VIRTUALIZATION_THRESHOLD, TREE_VIRTUAL_ROW_HEIGHT, TREE_VIRTUAL_OVERSCAN,
  TREE_VIRTUAL_VIEWPORT_MAX_HEIGHT, HISTORY_MAX, TREE_POS_FILTER_ALL, TREE_ACTIVITY_FILTER_ALL,
  AUTH_MODE_CREATE, AUTH_MODE_LOGIN, VIEW_WORKBENCH, VIEW_SENTENCE_GRAPH, VIEW_STATISTICS, VIEW_UNIVERSE,
  EXPLORER_LAYOUT_NORMAL, EXPLORER_LAYOUT_COMPACT, EXPLORER_LAYOUT_MAXIMIZED,
  GRAPH_STAGE_WIDTH, GRAPH_STAGE_HEIGHT, GRAPH_NODE_WIDTH, GRAPH_NODE_HEIGHT, STATS_WORKER_MIN_ENTRIES, AUTO_COMPLETE_STEPS,
  UNIVERSE_BUILD_DELAY_MS, UNIVERSE_MAX_NODES, UNIVERSE_MAX_EDGES, UNIVERSE_MIN_WORD_LENGTH, UNIVERSE_MAX_WORD_LENGTH,
  UNIVERSE_CACHE_SAVE_DELAY_MS, UNIVERSE_BOOKMARK_LIMIT, UNIVERSE_VIEW_MODE_CANVAS, UNIVERSE_VIEW_MODE_WEBGL,
  UNIVERSE_COLOR_MODE_QUESTION, UNIVERSE_COLOR_MODE_POS, UNIVERSE_COLOR_MODE_MODE, UNIVERSE_ZOOM_MIN, UNIVERSE_ZOOM_MAX,
  UNIVERSE_WEBGL_CLEAR_COLOR, UNIVERSE_WEBGL_LINE_COLOR_PATH, UNIVERSE_WEBGL_LINE_COLOR_DIM, UNIVERSE_WEBGL_LINE_COLOR_LABEL,
  UNIVERSE_WEBGL_LINE_COLOR_DEFAULT, UNIVERSE_WEBGL_POINT_COLOR_PRIMARY, UNIVERSE_WEBGL_POINT_COLOR_SECONDARY,
  UNIVERSE_WEBGL_POINT_COLOR_HOVER, UNIVERSE_WEBGL_POINT_COLOR_PATH, UNIVERSE_WEBGL_POINT_COLOR_HIGHLIGHT,
  UNIVERSE_INTERACTION_ACTIVE_MS, UNIVERSE_INTERACTION_EDGE_TARGET, UNIVERSE_IDLE_EDGE_TARGET,
  UNIVERSE_PERF_EDGE_TARGET_SOFT, UNIVERSE_PERF_EDGE_TARGET_HARD, UNIVERSE_MIN_EDGE_TARGET,
  UNIVERSE_DPR_MAX, UNIVERSE_DPR_HEAVY, UNIVERSE_DPR_SOFT, UNIVERSE_DPR_LOW,
  UNIVERSE_PERF_SAMPLE_INTERVAL_MS, UNIVERSE_PERF_HUD_UPDATE_INTERVAL_MS, UNIVERSE_BENCHMARK_DEFAULT_DURATION_MS,
  UNIVERSE_BENCHMARK_MAX_DURATION_MS, UNIVERSE_BENCHMARK_SAMPLE_LIMIT, UNIVERSE_GPU_STATUS_CACHE_MS,
  UI_PREFERENCES_SAVE_DELAY_MS, UI_SETTINGS_FOCUSABLE_SELECTOR, PHRASE_PATTERNS, POS_FOLLOW_RULES
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
  ALIAS_INDEX: ["Dictionary_Alias_Index", "DictionaryAliasIndex"]
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
const {
  normalizeWordLower: normalizeWordLowerUtil,
  inflectVerbForSubject: inflectVerbForSubjectUtil
} = MODULE_GROUP_UTILS.TEXT.SUGGESTION;
const {
  getAuthSubmitHint: getAuthSubmitHintUtil,
  isTypingTarget: isTypingTargetUtil
} = MODULE_GROUP_UTILS.TEXT.AUTH;
const { createDebouncedTask } = MODULE_GROUP_UTILS.UI.AUTOSAVE;
const {
  UI_THEME_IDS,
  createDefaultUiPreferences,
  normalizeUiTheme,
  normalizeUiPreferences
} = MODULE_GROUP_UTILS.UI.PREFERENCES;
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
const {
  createRendererRuntimeSpec,
  createRendererVisualState
} = MODULE_GROUP_UTILS.RUNTIME.RENDERER_STATE;
const {
  ALIAS_WORD_INDEX = [],
  createAliasMap,
  getAliasWords
} = MODULE_GROUP_UTILS.ALIAS.INDEX;
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
  }
};
const REQUIRED_MODULE_FUNCTIONS = Object.values(MOD_FUNCTION_GROUPS).flatMap((group) => Object.values(group));

if (
  REQUIRED_MODULE_FUNCTIONS.some((value) => typeof value !== "function") ||
  typeof createRendererStateContext !== "function" ||
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

const PATTERN_UNIVERSE_EDGE_MODE = Object.freeze({
  CONTAINS: "contains",
  PREFIX: "prefix",
  SUFFIX: "suffix",
  STEM: "stem",
  SAME_LABEL: "sameLabel"
});
const PATTERN_UNIVERSE_PAN_RANGE = Object.freeze({
  MIN: -1.6,
  MAX: 1.6
});
const PATTERN_CMD_SECTION = Object.freeze({
  VIEW: "View",
  ENTRY: "Entry",
  APPEARANCE: "Appearance",
  UNIVERSE: "Universe",
  GRAPH: "Graph",
  SYSTEM: "System",
  EXPORT: "Export"
});
const PATTERN_UNIVERSE_EDGE_ACTIONS = Object.freeze([
  ["universeEdgeContainsAction", PATTERN_UNIVERSE_EDGE_MODE.CONTAINS],
  ["universeEdgePrefixAction", PATTERN_UNIVERSE_EDGE_MODE.PREFIX],
  ["universeEdgeSuffixAction", PATTERN_UNIVERSE_EDGE_MODE.SUFFIX],
  ["universeEdgeStemAction", PATTERN_UNIVERSE_EDGE_MODE.STEM],
  ["universeEdgeSameLabelAction", PATTERN_UNIVERSE_EDGE_MODE.SAME_LABEL]
]);
const GROUP_SETS_SOURCE = window.Dictionary_Renderer_Group_Sets || window.DictionaryRendererGroupSets || {};
const GROUP_SETS = GROUP_SETS_SOURCE.GROUP_SETS || {};
const REQUIRED_GROUP_SET_KEYS = Object.freeze([
  "group_set_core_runtime",
  "group_set_entry_selection",
  "group_set_snapshot_history",
  "group_set_diagnostics_runtime_log",
  "group_set_statistics",
  "group_set_universe_render",
  "group_set_universe_selection",
  "group_set_runtime_timers"
]);
const HAS_REQUIRED_GROUP_SETS = REQUIRED_GROUP_SET_KEYS.every((groupKey) => {
  return Boolean(GROUP_SETS[groupKey]);
});

function clampUniversePan(value) {
  return clampNumber(value, PATTERN_UNIVERSE_PAN_RANGE.MIN, PATTERN_UNIVERSE_PAN_RANGE.MAX);
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
  createDefaultUniverseConfig,
  getUniverseDatasetSignature,
  normalizeConfig,
  normalizeUniverseGraph,
  normalizeUniverseBookmark,
  normalizeUniverseCustomSearchSet,
  normalizeUniverseCustomSearchSets,
  inferUniverseQuestionBucketFromLabels
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

const RUNTIME_MODE_VALUES = Object.freeze({
  LEGACY: "legacy",
  DUAL: "dual",
  MODULAR: "modular"
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

function getRendererRuntimeMode() {
  const mode = window.Dictionary_Renderer_Group_Specs?.runtime_mode?.active;
  const defaultMode = HAS_REQUIRED_GROUP_SETS ? RUNTIME_MODE_VALUES.MODULAR : RUNTIME_MODE_VALUES.DUAL;
  return mode === RUNTIME_MODE_VALUES.LEGACY || mode === RUNTIME_MODE_VALUES.MODULAR || mode === RUNTIME_MODE_VALUES.DUAL
    ? mode
    : defaultMode;
}

function runExtractedFunction(moduleKey, functionKey, args = [], fallback = null) {
  const moduleApi = window[moduleKey] || null;
  const mode = getRendererRuntimeMode();
  const modularKey = `modular_${functionKey}`;
  const legacyKey = `legacy_${functionKey}`;

  const modularFn = moduleApi && typeof moduleApi[modularKey] === "function" ? moduleApi[modularKey] : null;
  const legacyFn = moduleApi && typeof moduleApi[legacyKey] === "function" ? moduleApi[legacyKey] : null;
  const directFn = moduleApi && typeof moduleApi[functionKey] === "function" ? moduleApi[functionKey] : null;

  const primaryFn = mode === RUNTIME_MODE_VALUES.LEGACY
    ? legacyFn || directFn || modularFn
    : modularFn || directFn || legacyFn;

  if (typeof primaryFn === "function") {
    const result = primaryFn(...args);
    if (
      mode === RUNTIME_MODE_VALUES.DUAL &&
      modularFn &&
      legacyFn &&
      modularFn !== legacyFn
    ) {
      try {
        legacyFn(...args);
      } catch (error) {
        if (typeof recordDiagnosticError === "function") {
          recordDiagnosticError("dual_run_shadow_failed", String(error?.message || error), functionKey);
        }
      }
    }
    return result;
  }

  if (typeof fallback === "function") {
    return fallback(...args);
  }

  throw new Error(`Missing extracted implementation: ${moduleKey}.${functionKey}`);
}

function runExtractedByModule(moduleKey, functionKey, args = [], fallback = null) {
  const callArgs = Array.isArray(args) ? args : [];
  return runExtractedFunction(moduleKey, functionKey, callArgs, fallback);
}


function cleanText(value, maxLength = 1000) {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim().slice(0, maxLength);
}

function unique(values) {
  const seen = new Set();
  const result = [];
  (Array.isArray(values) ? values : []).forEach((item) => {
    if (seen.has(item)) {
      return;
    }
    seen.add(item);
    result.push(item);
  });
  return result;
}

function nowIso() {
  return new Date().toISOString();
}

function normalizeLabel(label) {
  return cleanText(label, MAX.LABEL);
}

function parseLabels(csv) {
  return unique(
    String(csv || "")
      .split(",")
      .map(normalizeLabel)
      .filter(Boolean)
  );
}

function normalizeLabelArray(labels) {
  return unique((Array.isArray(labels) ? labels : []).map(normalizeLabel).filter(Boolean));
}

function keyForLabel(label) {
  return `label:${label}`;
}

function keyForCategory(categoryKey) {
  return `category:${categoryKey}`;
}

function isPartOfSpeechLabel(label) {
  return PARTS_OF_SPEECH.has(String(label || "").toLowerCase());
}

function normalizeEntryMode(value) {
  const mode = cleanText(value, 20).toLowerCase();
  if (mode === "slang" || mode === "code" || mode === "bytes") {
    return mode;
  }
  return "definition";
}

function normalizeEntryLanguage(value) {
  return cleanText(value, 80);
}

function listItem(text) {
  const item = document.createElement("li");
  item.textContent = text;
  return item;
}

function pushRuntimeLog(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.DIAGNOSTICS_DOMAIN, "pushRuntimeLog", args);
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

function inferLabelsFromDefinition(definition) {
  const text = cleanText(definition, MAX.DEFINITION).toLowerCase();
  if (!text) {
    return [];
  }

  const inferred = new Set();
  if (
    /\[(noun|verb|adjective|adverb|pronoun|preposition|conjunction|interjection|determiner|article|numeral)\]/.test(
      text
    )
  ) {
    const matches =
      text.match(
        /\[(noun|verb|adjective|adverb|pronoun|preposition|conjunction|interjection|determiner|article|numeral)\]/g
      ) || [];
    matches.forEach((tag) => inferred.add(tag.replace(/\[|\]/g, "")));
  }
  (/^to\s+[a-z]/.test(text) || /\bto\s+[a-z]+\b/.test(text)) && (inferred.add("verb"));
  (/^\ba\s|\ban\s|\bthe\s/.test(text)) && (inferred.add("noun"));
  (/\bly\b/.test(text) || /\bin an? .* manner\b/.test(text)) && (inferred.add("adverb"));

  return [...inferred].map(normalizeLabel).filter((label) => isPartOfSpeechLabel(label));
}

function inferQuestionLabelsFromDefinition(definition) {
  const text = cleanText(definition, MAX.DEFINITION).toLowerCase();
  if (!text) {
    return [];
  }

  const labels = new Set();
  if (
    /\b(person|individual|someone|somebody|human|character|author|developer|team|organization|company)\b/.test(text)
  ) {
    labels.add("Who");
  }
  (/\b(place|location|city|country|region|area|site|office|server|environment|domain)\b/.test(text)) && (labels.add("Where"));
  (/\b(time|date|year|month|day|hour|era|period|schedule|deadline|timestamp)\b/.test(text)) && (labels.add("When"));
  (/\b(reason|purpose|because|cause|motivation|motive|goal|intent)\b/.test(text)) && (labels.add("Why"));
  (/\b(method|process|procedure|way|step|technique|algorithm|implementation)\b/.test(text)) && (labels.add("How"));
  (labels.size === 0 || /\b(thing|object|concept|term|word|value|type|entity)\b/.test(text)) && (labels.add("What"));

  return [...labels].map(normalizeLabel).filter(Boolean);
}

function getGraphEntryIdSet(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.SELECTION_DOMAIN, "getGraphEntryIdSet", args);
}

function getVisibleTreeEntries(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.SELECTION_DOMAIN, "getVisibleTreeEntries", args);
}

function clearEntrySelections(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.SELECTION_DOMAIN, "clearEntrySelections", args);
}

function setSingleEntrySelection(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.SELECTION_DOMAIN, "setSingleEntrySelection", args);
}

function toggleEntrySelection(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.SELECTION_DOMAIN, "toggleEntrySelection", args);
}

function selectEntryRange(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.SELECTION_DOMAIN, "selectEntryRange", args);
}

function getSelectedEntries(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.SELECTION_DOMAIN, "getSelectedEntries", args);
}

function updateHistoryRestoreOptions(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.HISTORY_DOMAIN, "updateHistoryRestoreOptions", args);
}

function buildCheckpointDigest(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.HISTORY_DOMAIN, "buildCheckpointDigest", args);
}

function buildHistoryCheckpoint(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.HISTORY_DOMAIN, "buildHistoryCheckpoint", args);
}

function ensureCheckpoint(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.HISTORY_DOMAIN, "ensureCheckpoint", args);
}

function restoreCheckpointById(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.HISTORY_DOMAIN, "restoreCheckpointById", args);
}

function parseCsvLine(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.IO, "parseCsvLine", args);
}

function parseCsvEntries(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.IO, "parseCsvEntries", args);
}
function parseBulkImportEntries(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.IO, "parseBulkImportEntries", args);
}
function parseImportedEntries(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.IO, "parseImportedEntries", args);
}
function parseSmartPasteEntries(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.IO, "parseSmartPasteEntries", args);
}
async function importEntriesFromText(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.IO, "importEntriesFromText", args);
}
async function applyImportedEntries(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.IO, "applyImportedEntries", args);
}
function toCsvSafe(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.IO, "toCsvSafe", args);
}
function exportEntriesAsCsv(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.IO, "exportEntriesAsCsv", args);
}
function triggerDownload(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.IO, "triggerDownload", args);
}
function exportCurrentData(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.IO, "exportCurrentData", args);
}
function autoLayoutGraph() {
  if (G_APP.s.sentenceGraph.nodes.length === 0) {
    setSentenceStatus("Nothing to layout.");
    return;
  }

  const columns = Math.max(1, Math.floor(GRAPH_STAGE_WIDTH / 260));
  const nextNodes = G_APP.s.sentenceGraph.nodes.map((node, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    return {
      ...node,
      x: normGraphCoord(44 + column * 230, GRAPH_STAGE_WIDTH, GRAPH_NODE_WIDTH),
      y: normGraphCoord(44 + row * 92, GRAPH_STAGE_HEIGHT, GRAPH_NODE_HEIGHT)
    };
  });
  G_APP.st.setGraph({
    ...G_APP.s.sentenceGraph,
    nodes: nextNodes
  });
  setSentenceStatus("Graph auto-layout applied.");
  G_PAGE.sentence.reqRender();
  scheduleAutosave();
}

function toggleGraphLock() {
  G_APP.s.graphLockEnabled = !G_APP.s.graphLockEnabled;
  (G_DOM.toggleGraphLockAction) && (G_DOM.toggleGraphLockAction.textContent = G_APP.s.graphLockEnabled ? "Unlock Graph Drag" : "Lock Graph Drag");
  setSentenceStatus(G_APP.s.graphLockEnabled ? "Graph drag locked." : "Graph drag unlocked.");
  scheduleAutosave();
}

function buildSentenceFromSelectedEntries() {
  const selectedEntries = getSelectedEntries();
  if (selectedEntries.length === 0) {
    setSentenceStatus("Select entries in tree first.");
    return;
  }
  addSuggestedPhrase(
    selectedEntries.map((entry) => entry.word),
    selectedEntries.map((entry) => entry.id),
    { statusPrefix: "Built sentence from selection" }
  );
}

function applyBatchLabel(label) {
  const normalized = normalizeLabel(label);
  const selectedEntries = getSelectedEntries();
  if (!normalized || selectedEntries.length === 0) {
    return false;
  }
  ensureLabelExists(normalized);
  selectedEntries.forEach((entry) => {
    G_APP.st.updateEntryById(entry.id, (current) => ({
      ...current,
      labels: unique([...current.labels, normalized]),
      updatedAt: nowIso()
    }));
  });
  sortEntries();
  G_PAGE.tree.reqRender();
  scheduleAutosave();
  return true;
}

function applyBatchRelabel(label) {
  const normalized = normalizeLabel(label);
  const selectedEntries = getSelectedEntries();
  if (!normalized || selectedEntries.length === 0) {
    return false;
  }
  ensureLabelExists(normalized);
  selectedEntries.forEach((entry) => {
    G_APP.st.updateEntryById(entry.id, (current) => ({
      ...current,
      labels: [normalized],
      updatedAt: nowIso()
    }));
  });
  sortEntries();
  G_PAGE.tree.reqRender();
  scheduleAutosave();
  return true;
}

function deleteSelectedEntries() {
  const selectedIds = [...new Set(G_APP.s.selectedEntryIds)];
  if (selectedIds.length === 0) {
    return false;
  }
  selectedIds.forEach((entryId) => {
    archiveEntryById(entryId);
  });
  clearEntrySelections();
  setHelperText("Selected entries archived. Enable 'Show archived' to restore.");
  G_PAGE.tree.reqRender();
  return true;
}

function setStatus(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UI_SHELL, "setStatus", args);
}
function formatSaved(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UI_SHELL, "formatSaved", args);
}
function setHelperText(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UI_SHELL, "setHelperText", args);
}
function normalizeExplorerLayoutMode(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UI_SHELL, "normalizeExplorerLayoutMode", args);
}
function syncExplorerLayoutControls(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UI_SHELL, "syncExplorerLayoutControls", args);
}
function setExplorerLayoutMode(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UI_SHELL, "setExplorerLayoutMode", args);
}
function isElementVisibleForInteraction(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UI_SHELL, "isElementVisibleForInteraction", args);
}
function resolvePreferredEntryLabel(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UI_SHELL, "resolvePreferredEntryLabel", args);
}
function setTreeFolderSelection(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UI_SHELL, "setTreeFolderSelection", args);
}
function isAuthGateVisible(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UI_SHELL, "isAuthGateVisible", args);
}
function setAuthGateVisible(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UI_SHELL, "setAuthGateVisible", args);
}
function setAuthHint(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UI_SHELL, "setAuthHint", args);
}
function setAuthMode(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UI_SHELL, "setAuthMode", args);
}
function getAuthCredentials(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UI_SHELL, "getAuthCredentials", args);
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
function normGraphCoord(value, max, nodeSize) {
  return runExtractedFunction(
    PATTERN_EXTRACTED_MODULE.MATH_PROJECTION,
    "norm_graph_coord",
    [value, max, nodeSize],
    (input, maxInput, sizeInput) => clampNumber(Number(input), 8, maxInput - sizeInput - 8)
  );
}
function getNormalizedUiPreferences(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.INIT, "getNormalizedUiPreferences", args);
}
function isSystemReducedMotionEnabled(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.INIT, "isSystemReducedMotionEnabled", args);
}
function isMotionReduced(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.INIT, "isMotionReduced", args);
}
function applyUiTheme(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.INIT, "applyUiTheme", args);
}
function applyMotionPreference(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.INIT, "applyMotionPreference", args);
}
function syncUiSettingsControls(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.INIT, "syncUiSettingsControls", args);
}
function applyUiPreferences(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.INIT, "applyUiPreferences", args);
}
async function saveUiPreferencesNow(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.INIT, "saveUiPreferencesNow", args);
}
function clearUiSettingsSaveTimer(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.INIT, "clearUiSettingsSaveTimer", args);
}
function scheduleUiPreferencesSave(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.INIT, "scheduleUiPreferencesSave", args);
}
function updateUiThemePreference(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.INIT, "updateUiThemePreference", args);
}
function updateReduceMotionPreference(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.INIT, "updateReduceMotionPreference", args);
}
async function loadUiPreferencesFromDisk(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.INIT, "loadUiPreferencesFromDisk", args);
}
function isUiSettingsPopoverOpen(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.INIT, "isUiSettingsPopoverOpen", args);
}
function getUiSettingsFocusableElements(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.INIT, "getUiSettingsFocusableElements", args);
}
function openUiSettingsPopover(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.INIT, "openUiSettingsPopover", args);
}
function closeUiSettingsPopover(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.INIT, "closeUiSettingsPopover", args);
}
function toggleUiSettingsPopover(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.INIT, "toggleUiSettingsPopover", args);
}
function initializeUiMotion(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.INIT, "initializeUiMotion", args);
}
function setSentenceStatus(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.DIAGNOSTICS_DOMAIN, "setSentenceStatus", args);
}

function setEntryWarnings(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.DIAGNOSTICS_DOMAIN, "setEntryWarnings", args);
}

function recordDiagnosticError(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.DIAGNOSTICS_DOMAIN, "recordDiagnosticError", args);
}

function recordDiagnosticPerf(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.DIAGNOSTICS_DOMAIN, "recordDiagnosticPerf", args);
}

function renderDiagnosticsSummary(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.DIAGNOSTICS_DOMAIN, "renderDiagnosticsSummary", args);
}

function renderDiagnosticsPanel(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.DIAGNOSTICS_DOMAIN, "renderDiagnosticsPanel", args);
}

function getEntryUsageScore(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.STATISTICS_DOMAIN, "getEntryUsageScore", args);
}

function buildStatisticsModelSync(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.STATISTICS_DOMAIN, "buildStatisticsModelSync", args);
}

function getStatisticsModel(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.STATISTICS_DOMAIN, "getStatisticsModel", args);
}

function renderStatisticsView(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.STATISTICS_DOMAIN, "renderStatisticsView", args);
}

function isUniverseVisible(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_RENDER_DOMAIN, "isUniverseVisible", args);
}

function isSentenceGraphVisible(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_RENDER_DOMAIN, "isSentenceGraphVisible", args);
}

function getActiveCanvas(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_RENDER_DOMAIN, "getActiveCanvas", args);
}

function syncCanvasVisibility(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_RENDER_DOMAIN, "syncCanvasVisibility", args);
}

function setUniverseRenderMode(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_RENDER_DOMAIN, "setUniverseRenderMode", args);
}

function syncControls(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_RENDER_DOMAIN, "syncControls", args);
}

function updateUniverseBookmarkSelect(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_RENDER_DOMAIN, "updateUniverseBookmarkSelect", args);
}

function setPathStatus(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_RENDER_DOMAIN, "setPathStatus", args);
}

function createUniverseBenchmarkState(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_RENDER_DOMAIN, "createUniverseBenchmarkState", args);
}

function getUniverseBenchmarkProgress(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_RENDER_DOMAIN, "getUniverseBenchmarkProgress", args);
}

function calculatePercentile(samples, percentile) {
  return runExtractedFunction(
    PATTERN_EXTRACTED_MODULE.MATH_SCALAR,
    "calculate_percentile",
    [samples, percentile],
    (items, targetPercentile) => {
      const sorted = (Array.isArray(items) ? items : []).slice().sort((a, b) => a - b);
      if (sorted.length === 0) {
        return 0;
      }
      const rank = Math.floor(clampNumber(targetPercentile, 0, 1) * (sorted.length - 1));
      return sorted[Math.max(0, Math.min(sorted.length - 1, rank))] || 0;
    }
  );
}
function appendUniverseBenchmarkSample(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_RENDER_DOMAIN, "appendUniverseBenchmarkSample", args);
}

function formatUniverseGpuLabel(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_RENDER_DOMAIN, "formatUniverseGpuLabel", args);
}

function isGpuStatusDegraded(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_RENDER_DOMAIN, "isGpuStatusDegraded", args);
}

function applyUniverseSafeRenderModeFromGpuStatus(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_RENDER_DOMAIN, "applyUniverseSafeRenderModeFromGpuStatus", args);
}

function renderPerfHud(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_RENDER_DOMAIN, "renderPerfHud", args);
}

function updateUniverseFrameMetrics(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_RENDER_DOMAIN, "updateUniverseFrameMetrics", args);
}

function updateUniverseBenchmarkCamera(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_RENDER_DOMAIN, "updateUniverseBenchmarkCamera", args);
}

function completeUniverseBenchmark(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_RENDER_DOMAIN, "completeUniverseBenchmark", args);
}

function startUniverseBenchmark(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_RENDER_DOMAIN, "startUniverseBenchmark", args);
}

function stopUniverseBenchmark(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_RENDER_DOMAIN, "stopUniverseBenchmark", args);
}

async function loadUniverseGpuStatus(force = false) {
  if (!window.app_api?.getGpuStatus) {
    return null;
  }
  if (G_DOM.authGate instanceof HTMLElement && !G_DOM.authGate.classList.contains("hidden")) {
    return null;
  }
  const now = Date.now();
  if (!force && G_RT.uGpu && now - G_RT.uGpuAt < UNIVERSE_GPU_STATUS_CACHE_MS) {
    return G_RT.uGpu;
  }
  try {
    const status = await window.app_api.getGpuStatus();
    G_RT.uGpu = status && typeof status === "object" ? status : null;
    G_RT.uGpuAt = now;
    if (G_RT.uGpu) {
      if (!isGpuStatusDegraded(G_RT.uGpu)) {
        G_RT.uForceCanvas = false;
      }
      applyUniverseSafeRenderModeFromGpuStatus(G_RT.uGpu);
    }
    renderPerfHud(true);
    return G_RT.uGpu;
  } catch (error) {
    recordDiagnosticError("gpu_status_load_failed", String(error?.message || error), "gpu");
    return null;
  }
}

function showUniverseGpuStatus(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_RENDER_DOMAIN, "showUniverseGpuStatus", args);
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
  const selectedCount = getUniverseSelectedIndicesSorted().length;
  const activeSet = G_UNI.sel.sets.find((set) => set.id === G_UNI.sel.activeSetId);
  const base = `Universe: ${nodes} words, ${edges} links, ${components} clusters, ${isolated} isolated, largest cluster ${largest}. Selected: ${selectedCount}. Drag to pan, wheel to zoom.${cappedText}`;
  const withFilter = filter ? `${base} Highlight: "${filter}".` : base;
  G_DOM.universeSummary.textContent = activeSet ? `${withFilter} Active set: "${activeSet.name}".` : withFilter;
  renderPerfHud();
}

function getUniverseTargetDpr(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_RENDER_DOMAIN, "getUniverseTargetDpr", args);
}

function ensureUniverseCanvasSize(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_RENDER_DOMAIN, "ensureUniverseCanvasSize", args);
}

function getCanvasCtx(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_RENDER_DOMAIN, "getCanvasCtx", args);
}

function clearProjectionCache() {
  G_UNI_FX.clearProjectionCache();
}

function resetHighlightCache() {
  G_UNI.canvas.flags.highlight = new Uint8Array(0);
  G_UNI.canvas.cache.highlightCount = 0;
  G_UNI.canvas.cache.highlightKey = "";
}

function syncSelectionFlags() {
  G_UNI.canvas.flags.selected = buildIdxFlags(G_UNI.graph.nodes.length, G_UNI.sel.nodeIdxSet);
}

function syncPathFlags() {
  G_UNI.canvas.flags.path = buildIdxFlags(G_UNI.graph.nodes.length, G_UNI.path.nodeIdx);
}

function getGraphCacheToken(maxLength = 200) {
  return buildGraphToken(G_RT.uGraphKey, maxLength);
}

function getHighlightState(nodes, filterLower) {
  const next = computeHighlight({
    nodes,
    filterLower,
    graphCacheKey: G_RT.uGraphKey,
    previousFlags: G_UNI.canvas.flags.highlight,
    previousCount: G_UNI.canvas.cache.highlightCount,
    previousCacheKey: G_UNI.canvas.cache.highlightKey,
    maxWordLength: MAX.WORD
  });
  G_UNI.canvas.flags.highlight = next.flags;
  G_UNI.canvas.cache.highlightCount = next.count;
  G_UNI.canvas.cache.highlightKey = next.cacheKey;
  return {
    flags: G_UNI.canvas.flags.highlight,
    count: G_UNI.canvas.cache.highlightCount
  };
}

function resetAdjacencyCache() {
  G_UNI.canvas.cache.adjacencyKey = "";
  G_UNI.canvas.cache.adjacency = [];
}

function getAdjacency() {
  const next = computeAdjacency({
    nodes: G_UNI.graph.nodes,
    edges: G_UNI.graph.edges,
    graphCacheKey: G_RT.uGraphKey,
    previousAdjacency: G_UNI.canvas.cache.adjacency,
    previousCacheKey: G_UNI.canvas.cache.adjacencyKey
  });
  G_UNI.canvas.cache.adjacency = next.adjacency;
  G_UNI.canvas.cache.adjacencyKey = next.cacheKey;
  return G_UNI.canvas.cache.adjacency;
}

function markInteraction(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_RENDER_DOMAIN, "markInteraction", args);
}

function getEdgeStride(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_RENDER_DOMAIN, "getEdgeStride", args);
}

function buildProjectionInput(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_RENDER_DOMAIN, "buildProjectionInput", args);
}

function getProjection(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_RENDER_DOMAIN, "getProjection", args);
}

function findNodeAt(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_RENDER_DOMAIN, "findNodeAt", args);
}

function reqGraph(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_RENDER_DOMAIN, "reqGraph", args);
}

function drawUniverseNodeLabel(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_RENDER_DOMAIN, "drawUniverseNodeLabel", args);
}

function renderGraphWebgl(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_RENDER_DOMAIN, "renderGraphWebgl", args);
}

function getUniverseQuestionBucket(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_RENDER_DOMAIN, "getUniverseQuestionBucket", args);
}

function getUniverseNodeColor(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_RENDER_DOMAIN, "getUniverseNodeColor", args);
}

function buildUniverseEdgeKey(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_SELECTION_DOMAIN, "buildUniverseEdgeKey", args);
}
function getUniverseSelectedIndicesSorted(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_SELECTION_DOMAIN, "getUniverseSelectedIndicesSorted", args);
}

function getUniverseSelectedNodes(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_SELECTION_DOMAIN, "getUniverseSelectedNodes", args);
}

function setNodeSelectionSet(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_SELECTION_DOMAIN, "setNodeSelectionSet", args);
}

function clearUniverseNodeSelection(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_SELECTION_DOMAIN, "clearUniverseNodeSelection", args);
}

function getUniverseVisibleNodeIndices(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_SELECTION_DOMAIN, "getUniverseVisibleNodeIndices", args);
}

function selectAllUniverseVisibleNodes(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_SELECTION_DOMAIN, "selectAllUniverseVisibleNodes", args);
}

function toggleUniverseNodeSelection(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_SELECTION_DOMAIN, "toggleUniverseNodeSelection", args);
}

function getUniverseNodeDefinitionPreview(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_SELECTION_DOMAIN, "getUniverseNodeDefinitionPreview", args);
}

function getUniverseNodeOriginLabel(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_SELECTION_DOMAIN, "getUniverseNodeOriginLabel", args);
}

function getUniverseNodeLinkage(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_SELECTION_DOMAIN, "getUniverseNodeLinkage", args);
}

function resolveUniverseCustomSetNodeIndices(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_SELECTION_DOMAIN, "resolveUniverseCustomSetNodeIndices", args);
}

function appendNodesToUniverseCustomSet(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_SELECTION_DOMAIN, "appendNodesToUniverseCustomSet", args);
}

function createUniverseCustomSetFromSelection(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_SELECTION_DOMAIN, "createUniverseCustomSetFromSelection", args);
}

function removeUniverseCustomSearchSet(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_SELECTION_DOMAIN, "removeUniverseCustomSearchSet", args);
}

function applyCustomSet(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_SELECTION_DOMAIN, "applyCustomSet", args);
}

function getUniverseDragSelectionIndices(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_SELECTION_DOMAIN, "getUniverseDragSelectionIndices", args);
}

function parseUniverseDraggedSelectionPayload(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_SELECTION_DOMAIN, "parseUniverseDraggedSelectionPayload", args);
}

function findPathIndices(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_SELECTION_DOMAIN, "findPathIndices", args);
}

function centerUniverseOnNode(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_SELECTION_DOMAIN, "centerUniverseOnNode", args);
}

function focusNodeIndex(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_SELECTION_DOMAIN, "focusNodeIndex", args);
}

function resetUniverseCamera(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_SELECTION_DOMAIN, "resetUniverseCamera", args);
}

function fitUniverseCamera(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_SELECTION_DOMAIN, "fitUniverseCamera", args);
}
function saveUniverseBookmark(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_SELECTION_DOMAIN, "saveUniverseBookmark", args);
}

function loadUniverseBookmark(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_SELECTION_DOMAIN, "loadUniverseBookmark", args);
}

function exportUniverseGraphJson(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_SELECTION_DOMAIN, "exportUniverseGraphJson", args);
}

function exportUniversePng(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_SELECTION_DOMAIN, "exportUniversePng", args);
}

function jumpToUniverseFilter(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_SELECTION_DOMAIN, "jumpToUniverseFilter", args);
}

function applyUniversePathFinder(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_SELECTION_DOMAIN, "applyUniversePathFinder", args);
}

function applyUniverseOptionsFromInputs(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_SELECTION_DOMAIN, "applyUniverseOptionsFromInputs", args);
}

function toggleUniverseEdgeMode(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_SELECTION_DOMAIN, "toggleUniverseEdgeMode", args);
}

function renderClusterPanel(selectedIndex = G_UNI.view.selectedNodeIndex) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_DOMAIN, "renderClusterPanel", [selectedIndex]);
}
function renderUniverseGraph(force = false) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_DOMAIN, "renderUniverseGraph", [force]);
}
function syncSelectionWithEntry(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.SELECTION_DOMAIN, "syncSelectionWithEntry", args);
}

function focusEntryWithoutUsage(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.SELECTION_DOMAIN, "focusEntryWithoutUsage", args);
}

function setActiveView(nextView) {
  G_APP.s.activeView =
    nextView === CONSTANT_VIEW.SENTENCE_GRAPH || nextView === CONSTANT_VIEW.STATISTICS || nextView === CONSTANT_VIEW.UNIVERSE
      ? nextView
      : CONSTANT_VIEW.WORKBENCH;
  const showWorkbench = G_APP.s.activeView === CONSTANT_VIEW.WORKBENCH;
  const showSentenceGraph = G_APP.s.activeView === CONSTANT_VIEW.SENTENCE_GRAPH;
  const showStats = G_APP.s.activeView === CONSTANT_VIEW.STATISTICS;
  const showUniverse = G_APP.s.activeView === CONSTANT_VIEW.UNIVERSE;
  if (
    !(G_DOM.workbenchView instanceof HTMLElement) ||
    !(G_DOM.sentenceGraphView instanceof HTMLElement) ||
    !(G_DOM.statisticsView instanceof HTMLElement) ||
    !(G_DOM.universeView instanceof HTMLElement)
  ) {
    return;
  }
  G_DOM.workbenchView.classList.toggle("hidden", !showWorkbench);
  G_DOM.sentenceGraphView.classList.toggle("hidden", !showSentenceGraph);
  G_DOM.statisticsView.classList.toggle("hidden", !showStats);
  G_DOM.universeView.classList.toggle("hidden", !showUniverse);
  (G_DOM.treePane instanceof HTMLElement) && (G_DOM.treePane.classList.toggle("universe-mode", showUniverse));
  (G_DOM.universeInspectorPane instanceof HTMLElement) && (G_DOM.universeInspectorPane.classList.toggle("hidden", !showUniverse));
  (G_DOM.showWorkbenchViewAction instanceof HTMLElement) && (G_DOM.showWorkbenchViewAction.classList.toggle("active", showWorkbench));
  (G_DOM.showSentenceGraphViewAction instanceof HTMLElement) && (G_DOM.showSentenceGraphViewAction.classList.toggle("active", showSentenceGraph));
  (G_DOM.showStatisticsViewAction instanceof HTMLElement) && (G_DOM.showStatisticsViewAction.classList.toggle("active", showStats));
  (G_DOM.showUniverseViewAction instanceof HTMLElement) && (G_DOM.showUniverseViewAction.classList.toggle("active", showUniverse));
  if (showSentenceGraph) {
    G_PAGE.sentence.reqRender({ force: true });
    return;
  }
  if (showStats) {
    scheduleStatsWorkerCompute();
    renderStatisticsView();
    return;
  }
  if (showUniverse) {
    syncCanvasVisibility();
    scheduleGraphBuild();
    G_PAGE.universe.renderSummary();
    G_PAGE.universe.renderCluster();
    renderPerfHud(true);
    void loadUniverseGpuStatus(false);
    G_PAGE.universe.reqRender({ force: true });
  }
}

function clearDiagnosticsFlushTimer(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.DIAGNOSTICS_DOMAIN, "clearDiagnosticsFlushTimer", args);
}

function scheduleDiagnosticsFlush(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.DIAGNOSTICS_DOMAIN, "scheduleDiagnosticsFlush", args);
}

function buildUndoSnapshot(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.HISTORY_DOMAIN, "buildUndoSnapshot", args);
}

function digestUndoSnapshot(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.HISTORY_DOMAIN, "digestUndoSnapshot", args);
}

function captureUndoSnapshot(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.HISTORY_DOMAIN, "captureUndoSnapshot", args);
}

function applyUndoSnapshot(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.HISTORY_DOMAIN, "applyUndoSnapshot", args);
}

function runUndo(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.HISTORY_DOMAIN, "runUndo", args);
}

function runRedo(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.HISTORY_DOMAIN, "runRedo", args);
}

function scheduleIndexWarmup(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.RUNTIME_TIMERS_DOMAIN, "scheduleIndexWarmup", args);
}

function getStatsModelKey(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.STATISTICS_DOMAIN, "getStatsModelKey", args);
}

function invalidateStatisticsCache(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.STATISTICS_DOMAIN, "invalidateStatisticsCache", args);
}

function requestStatsWorkerComputeNow(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.STATISTICS_DOMAIN, "requestStatsWorkerComputeNow", args);
}

function scheduleStatsWorkerCompute(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.STATISTICS_DOMAIN, "scheduleStatsWorkerCompute", args);
}

function initializeStatsWorker(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.INIT, "initializeStatsWorker", args);
}
function getUniverseModelKey() {
  const edgeModes = G_UNI.cfg.edgeModes || {};
  return [
    String(G_RT.entriesVersion),
    String(G_UNI.cfg.minWordLength),
    String(G_UNI.cfg.maxWordLength),
    String(G_UNI.cfg.maxNodes),
    String(G_UNI.cfg.maxEdges),
    G_UNI.cfg.favoritesOnly ? "1" : "0",
    cleanText(G_UNI.cfg.labelFilter, MAX.LABEL).toLowerCase(),
    edgeModes.contains ? "1" : "0",
    edgeModes.prefix ? "1" : "0",
    edgeModes.suffix ? "1" : "0",
    edgeModes.stem ? "1" : "0",
    edgeModes.sameLabel ? "1" : "0"
  ].join("|");
}

function rebuildUniverseNodeIndexes() {
  G_UNI.idx.entry = new Map();
  G_UNI.idx.word = new Map();
  G_UNI.graph.nodes.forEach((node, index) => {
    const entryId = cleanText(node.entryId, MAX.WORD);
    (entryId && !G_UNI.idx.entry.has(entryId)) && (G_UNI.idx.entry.set(entryId, index));
    const wordLower = getNodeWord(node);
    (wordLower && !G_UNI.idx.word.has(wordLower)) && (G_UNI.idx.word.set(wordLower, index));
  });
  resetHighlightCache();
  syncSelectionFlags();
  syncPathFlags();
  resetAdjacencyCache();
}

function clearPathHighlights() {
  G_UNI.path.edgeKeys = new Set();
  G_UNI.path.nodeIdx = [];
  G_UNI.path.words = [];
  syncPathFlags();
  G_PAGE.universe.setPathStatus("Path finder ready.");
}

function buildUniverseCachePayload() {
  const configSnapshot = normalizeConfig(G_UNI.cfg);
  const customSetsSnapshot = normalizeUniverseCustomSearchSets(G_UNI.sel.sets);
  return {
    version: 1,
    datasetSignature: G_RT.uDataSig,
    modelKey: G_RT.uGraphKey,
    config: {
      minWordLength: configSnapshot.minWordLength,
      maxWordLength: configSnapshot.maxWordLength,
      maxNodes: configSnapshot.maxNodes,
      maxEdges: configSnapshot.maxEdges,
      favoritesOnly: configSnapshot.favoritesOnly,
      labelFilter: configSnapshot.labelFilter,
      colorMode: configSnapshot.colorMode,
      renderMode: configSnapshot.renderMode,
      edgeModes: { ...configSnapshot.edgeModes },
      customSets: customSetsSnapshot,
      activeCustomSetId: cleanText(G_UNI.sel.activeSetId, MAX.WORD)
    },
    bookmarks: configSnapshot.bookmarks,
    graph: G_UNI.graph,
    updatedAt: nowIso()
  };
}

function queueCacheSave() {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_DOMAIN, "queueCacheSave");
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

function buildUniverseGraphFallback() {
  const nodes = G_APP.s.entries
    .filter((entry) => {
      if (entry.archivedAt) {
        return false;
      }
      if (G_UNI.cfg.favoritesOnly && !entry.favorite) {
        return false;
      }
      if (G_UNI.cfg.labelFilter) {
        const labelsLower = normalizeLabelArray(entry.labels).map((label) => label.toLowerCase());
        if (!labelsLower.some((label) => label.includes(G_UNI.cfg.labelFilter))) {
          return false;
        }
      }
      return true;
    })
    .map((entry) => ({
      entryId: entry.id,
      word: entry.word,
      wordLower: normalizeWordLower(entry.word),
      labels: normalizeLabelArray(entry.labels),
      partOfSpeech: normalizeLabelArray(entry.labels)
        .map((label) => label.toLowerCase())
        .find((label) => PARTS_OF_SPEECH.has(label)),
      mode: normalizeEntryMode(entry.mode),
      score: Math.max(0, Number(entry.usageCount) || 0) + (entry.favorite ? 6 : 0)
    }))
    .filter((item) => item.wordLower.length >= G_UNI.cfg.minWordLength)
    .sort((left, right) => right.score - left.score || left.wordLower.localeCompare(right.wordLower))
    .slice(0, Math.min(500, G_UNI.cfg.maxNodes));

  const total = nodes.length;
  const positioned = nodes.map((node, index) => {
    const angle = (index / Math.max(1, total)) * Math.PI * 12;
    const radius = 0.12 + 0.82 * Math.sqrt((index + 1) / Math.max(1, total));
    return {
      id: node.entryId || `fallback-${index}`,
      entryId: node.entryId,
      word: node.word,
      labels: node.labels,
      partOfSpeech: node.partOfSpeech || "",
      mode: node.mode,
      degree: 0,
      componentSize: 1,
      componentId: `c${index + 1}`,
      x: 0.5 + Math.cos(angle) * radius * 0.48,
      y: 0.5 + Math.sin(angle) * radius * 0.48
    };
  });

  return {
    nodes: positioned,
    edges: [],
    meta: {
      nodeCount: positioned.length,
      edgeCount: 0,
      components: positioned.length,
      isolated: positioned.length,
      largestComponent: positioned.length > 0 ? 1 : 0,
      capped: false,
      edgeModeCounts: {
        contains: 0,
        prefix: 0,
        suffix: 0,
        stem: 0,
        sameLabel: 0
      }
    }
  };
}

function requestGraphBuildNow() {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_DOMAIN, "requestGraphBuildNow");
}
function scheduleGraphBuild(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.RUNTIME_TIMERS_DOMAIN, "scheduleGraphBuild", args);
}

function initializeUniverseWorker(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.INIT, "initializeUniverseWorker", args);
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
  invalidateStatisticsCache();
  invalidateUniverseGraph();
  scheduleIndexWarmup();
  scheduleStatsWorkerCompute();
  scheduleGraphBuild();
  captureUndoSnapshot("entries");
}

function markGraphDirty() {
  G_RT.gVer += 1;
  G_RT.gLayoutVer += 1;
  G_RT.gIdxDirty = true;
  G_RT.sentenceSugKey = "";
  G_RT.sentenceSugVal = [];
  invalidateStatisticsCache();
  scheduleIndexWarmup();
  scheduleStatsWorkerCompute();
  captureUndoSnapshot("graph");
}

G_APP.st.setHooks({
  onEntriesMutation: markEntriesDirty,
  onGraphMutation: markGraphDirty
});

function rebuildGraphIndex() {
  return buildGraphIndex(G_APP.s.sentenceGraph.nodes, G_APP.s.sentenceGraph.links);
}

function getEntriesIndex() {
  (G_RT.entriesIndexDirty || !G_RT.entriesIndexCache) && (G_RT.entriesIndexCache = buildEntriesIndex(G_APP.s.labels, G_APP.s.entries), G_RT.entriesIndexDirty = false);
  return G_RT.entriesIndexCache;
}

function getIdx() {
  (G_RT.gIdxDirty || !G_RT.gIdxCache) && (G_RT.gIdxCache = rebuildGraphIndex(), G_RT.gIdxDirty = false);
  return G_RT.gIdxCache;
}

function reqTree() {
  if (G_RT.treeFrame) {
    return;
  }
  G_RT.treeFrame = window.requestAnimationFrame(() => {
    G_RT.treeFrame = 0;
    renderTree();
  });
}

function reqSentence(options = {}) {
  const refreshPreview = options.refreshPreview !== false;
  const refreshSuggestions = options.refreshSuggestions !== false;
  const force = options.force === true;
  G_RT.gNeedPreview = G_RT.gNeedPreview || refreshPreview;
  G_RT.gNeedSuggest = G_RT.gNeedSuggest || refreshSuggestions;
  if (!force && !isSentenceGraphVisible()) {
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
    renderSentenceGraph({
      refreshPreview: nextPreview,
      refreshSuggestions: nextSuggestions
    });
  });
}

function getEntryById(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.SELECTION_DOMAIN, "getEntryById", args);
}

function getNode(nodeId) {
  const id = cleanText(nodeId, MAX.WORD);
  if (!id) {
    return null;
  }
  return G_PAGE.sentence.getIndex().nodeById.get(id) || null;
}

function getGraphNodeWordFromEntry(entryId, fallback = "") {
  const entry = getEntryById(entryId);
  if (!entry) {
    return cleanText(fallback, MAX.WORD);
  }
  return cleanText(entry.word, MAX.WORD);
}

function getEntryForGraphNode(node) {
  if (!node) {
    return null;
  }

  if (node.entryId) {
    const fromId = getEntryById(node.entryId);
    if (fromId) {
      return fromId;
    }
  }

  const nodeWord = cleanText(node.word, MAX.WORD).toLowerCase();
  if (!nodeWord) {
    return null;
  }
  return G_PAGE.dictionary.getEntriesIndex().byWordLower.get(nodeWord) || null;
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
      (node?.entryId) && (linkedEntryIds.add(node.entryId));
    });
    (incoming.get(nodeId) || []).forEach((sourceId) => {
      const node = G_PAGE.sentence.getNode(sourceId);
      (node?.entryId) && (linkedEntryIds.add(node.entryId));
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

function sanitizeDefinitionText(text) {
  return cleanText(String(text || "").replace(/\s+/g, " "), MAX.DEFINITION);
}

function applyLocalAssist(formData) {
  if (!G_APP.s.localAssistEnabled) {
    return {
      formData,
      warnings: []
    };
  }
  const next = {
    ...formData,
    definition:
      formData.mode === "code" || formData.mode === "bytes"
        ? cleanText(formData.definition, MAX.DEFINITION)
        : sanitizeDefinitionText(formData.definition),
    labels: normalizeLabelArray(formData.labels)
  };
  const inferredLabels = inferLabelsFromDefinition(next.definition);
  const inferredQuestionLabels = inferQuestionLabelsFromDefinition(next.definition);
  (inferredLabels.length > 0) && (next.labels = unique([...next.labels, ...inferredLabels]));
  (inferredQuestionLabels.length > 0) && (next.labels = unique([...next.labels, ...inferredQuestionLabels]));
  (next.mode === "slang" && !next.labels.some((label) => label.toLowerCase() === "slang")) && (next.labels = unique([...next.labels, "slang"]));
  (next.mode === "code") && (next.labels = unique([...next.labels, "code"]));
  (next.mode === "bytes") && (next.labels = unique([...next.labels, "bytes"]));

  const posLabels = detectPosConflicts(next.labels);
  const warnings = [];
  if (posLabels.length > 1) {
    warnings.push(`POS conflict: ${posLabels.join(", ")}`);
  }
  (next.mode === "bytes" && next.definition.length > 0 && !/^[0-9a-fA-F+/_=\\s-]+$/.test(next.definition)) && (warnings.push("Bytes mode expects hex/base64-like text."));

  return {
    formData: next,
    warnings
  };
}

function detectPosConflicts(labels) {
  const posLabels = normalizeLabelArray(labels)
    .map((label) => label.toLowerCase())
    .filter((label) => isPartOfSpeechLabel(label));
  return unique(posLabels);
}

function resolvePosConflictLabels(labels, definition) {
  const normalized = normalizeLabelArray(labels);
  const inferred = inferLabelsFromDefinition(definition);
  if (inferred.length > 0) {
    const keep = inferred[0];
    const nonPos = normalized.filter((label) => !isPartOfSpeechLabel(label.toLowerCase()));
    return unique([...nonPos, keep]);
  }
  const seen = [];
  normalized.forEach((label) => {
    if (!isPartOfSpeechLabel(label.toLowerCase())) {
      seen.push(label);
      return;
    }
    (!seen.some((item) => isPartOfSpeechLabel(item.toLowerCase()))) && (seen.push(label));
  });
  return unique(seen);
}

function refreshInlineWarningsFromForm() {
  const labels = parseLabels(G_DOM.labelsInput.value);
  const definition = cleanText(G_DOM.definitionInput.value, MAX.DEFINITION);
  const mode = normalizeEntryMode(
    G_DOM.entryModeSelect instanceof HTMLSelectElement ? G_DOM.entryModeSelect.value : "definition"
  );
  const language = normalizeEntryLanguage(
    G_DOM.entryLanguageInput instanceof HTMLInputElement ? G_DOM.entryLanguageInput.value : ""
  );
  const warnings = [];
  const posLabels = detectPosConflicts(labels);
  if (posLabels.length > 1) {
    warnings.push(`POS conflict: ${posLabels.join(", ")}`);
  }
  (!definition) && (warnings.push("Definition is required."));
  (!cleanText(G_DOM.wordInput.value, MAX.WORD)) && (warnings.push("Word is required."));
  (mode === "code" && !language) && (warnings.push("Code mode should include a language/context."));
  (mode === "bytes" && definition && !/^[0-9a-fA-F+/_=\\s-]+$/.test(definition)) && (warnings.push("Bytes mode expects hex/base64-like text."));
  setEntryWarnings(warnings.slice(0, 3));
}

function updateEntryModeVisualState() {
  const mode = normalizeEntryMode(
    G_DOM.entryModeSelect instanceof HTMLSelectElement ? G_DOM.entryModeSelect.value : "definition"
  );
  const isCodeLike = mode === "code" || mode === "bytes";
  if (G_DOM.definitionInput instanceof HTMLTextAreaElement) {
    G_DOM.definitionInput.classList.toggle("codeInput", isCodeLike);
    if (mode === "code") {
      G_DOM.definitionInput.placeholder = "Paste code snippet, pseudo-code, or API usage.";
    } else if (mode === "bytes") {
      G_DOM.definitionInput.placeholder = "Paste hex or base64 bytes payload.";
    } else if (mode === "slang") {
      G_DOM.definitionInput.placeholder = "Explain slang meaning, origin, and usage.";
    } else {
      G_DOM.definitionInput.placeholder = "";
    }
  }
}

function clearPendingLink() {
  G_APP.s.pendingLinkFromNodeId = null;
}

function makeGraphNode(word, entryId = "", x, y) {
  const normalizedWord = cleanText(word, MAX.WORD);
  if (!normalizedWord) {
    return null;
  }

  const nodeX = Number.isFinite(x)
    ? normGraphCoord(x, GRAPH_STAGE_WIDTH, GRAPH_NODE_WIDTH)
    : normGraphCoord(80 + G_APP.s.sentenceGraph.nodes.length * 38, GRAPH_STAGE_WIDTH, GRAPH_NODE_WIDTH);
  const nodeY = Number.isFinite(y)
    ? normGraphCoord(y, GRAPH_STAGE_HEIGHT, GRAPH_NODE_HEIGHT)
    : clampNumber(90 + (G_APP.s.sentenceGraph.nodes.length % 10) * 74, 8, GRAPH_STAGE_HEIGHT - GRAPH_NODE_HEIGHT - 8);

  return {
    id: window.crypto.randomUUID(),
    entryId: cleanText(entryId, MAX.WORD),
    word: normalizedWord,
    x: nodeX,
    y: nodeY
  };
}

function syncGraphNodeWordsFromEntries() {
  let changed = false;
  const nextNodes = G_APP.s.sentenceGraph.nodes.map((node) => {
    if (!node.entryId) {
      return node;
    }
    const liveWord = getGraphNodeWordFromEntry(node.entryId, node.word);
    if (!liveWord || liveWord === node.word) {
      return node;
    }
    changed = true;
    return {
      ...node,
      word: liveWord
    };
  });
  if (changed) {
    G_APP.st.updateState(
      () => {
        G_APP.s.sentenceGraph = {
          ...G_APP.s.sentenceGraph,
          nodes: nextNodes
        };
      },
      { graph: true }
    );
  }
}

function addNodeToSentenceGraph(rawWord = "", entryId = "", x, y, options = {}) {
  const { render = true, autosave = true, updateStatus = true, selectNode = true } = options;
  const fallbackWord = entryId ? getGraphNodeWordFromEntry(entryId) : "";
  const node = makeGraphNode(rawWord || fallbackWord, entryId, x, y);
  if (!node) {
    if (updateStatus) {
      setSentenceStatus("No word to add. Select a word or type one first.");
    }
    return null;
  }

  G_APP.st.addGraphNode(node);
  (selectNode) && (G_APP.s.selectedGraphNodeId = node.id);
  clearPendingLink();
  if (updateStatus) {
    setSentenceStatus(`Node added: ${node.word}`);
  }
  (render) && (G_PAGE.sentence.reqRender());
  (autosave) && (scheduleAutosave());
  return node;
}

function addNodeFromSelectedEntry() {
  const entry = getSelectedEntry();
  if (!entry) {
    return null;
  }
  return addNodeToSentenceGraph(entry.word, entry.id);
}

function jumpBetweenEntryAndGraph() {
  const selectedNode = G_PAGE.sentence.getNode(G_APP.s.selectedGraphNodeId);
  if (selectedNode?.entryId) {
    selectEntry(selectedNode.entryId);
    return true;
  }
  const selectedEntry = getSelectedEntry();
  if (!selectedEntry) {
    return false;
  }
  const matchNode = G_APP.s.sentenceGraph.nodes.find((node) => node.entryId === selectedEntry.id);
  if (!matchNode) {
    return false;
  }
  G_APP.s.selectedGraphNodeId = matchNode.id;
  G_PAGE.sentence.reqRender();
  G_DOM.sentenceViewport.focus?.();
  return true;
}

function removeSentenceNode(nodeId) {
  const nextGraph = {
    nodes: G_APP.s.sentenceGraph.nodes.filter((node) => node.id !== nodeId),
    links: G_APP.s.sentenceGraph.links.filter((link) => link.fromNodeId !== nodeId && link.toNodeId !== nodeId)
  };
  G_APP.st.setGraph(nextGraph);
  (G_APP.s.selectedGraphNodeId === nodeId) && (G_APP.s.selectedGraphNodeId = null);
  (G_APP.s.pendingLinkFromNodeId === nodeId) && (clearPendingLink());
  setSentenceStatus("Node deleted.");
  G_PAGE.sentence.reqRender();
  scheduleAutosave();
}

function linkExists(fromNodeId, toNodeId) {
  return G_PAGE.sentence.getIndex().linkKeySet.has(`${fromNodeId}->${toNodeId}`);
}

function addSentenceLink(fromNodeId, toNodeId, options = {}) {
  const { render = true, autosave = true, updateStatus = true } = options;
  if (!fromNodeId || !toNodeId || fromNodeId === toNodeId) {
    return;
  }
  if (!G_PAGE.sentence.getNode(fromNodeId) || !G_PAGE.sentence.getNode(toNodeId)) {
    return;
  }
  if (linkExists(fromNodeId, toNodeId)) {
    return;
  }

  G_APP.st.addGraphLink({
    id: window.crypto.randomUUID(),
    fromNodeId,
    toNodeId
  });
  (updateStatus) && (setSentenceStatus("Link created."));
  (render) && (G_PAGE.sentence.reqRender());
  (autosave) && (scheduleAutosave());
}

function getOutgoingNodeIds(nodeId) {
  return G_PAGE.sentence.getIndex().outgoingIdsByNodeId.get(nodeId) || [];
}

function getIncomingNodeIds(nodeId) {
  return G_PAGE.sentence.getIndex().incomingIdsByNodeId.get(nodeId) || [];
}

function buildSentencePreviewLines(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.SENTENCE, "buildSentencePreviewLines", args);
}
function analyzeGraphQuality(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.SENTENCE, "analyzeGraphQuality", args);
}
function renderSentencePreview() {
  const lines = buildSentencePreviewLines();
  const qa = analyzeGraphQuality();
  if (lines.length === 0) {
    G_DOM.sentencePreview.textContent = `Sentence preview: add and connect nodes to compose phrases. QA: islands ${qa.islands}, cycles ${qa.cycles}, orphaned ${qa.orphanedNodes}.`;
    return;
  }

  G_DOM.sentencePreview.textContent = `Sentence preview: ${lines.join(" | ")} | QA: islands ${qa.islands}, cycles ${qa.cycles}, orphaned ${qa.orphanedNodes}.`;
}

function collectLinkedTargetsForWord(wordLowerCase) {
  if (!wordLowerCase) {
    return [];
  }
  return G_PAGE.sentence.getIndex().linkedTargetsByWordLower.get(wordLowerCase) || [];
}

function normalizeWordLower(word) {
  return normalizeWordLowerUtil(word, MAX.WORD);
}

function inflectVerbForSubject(baseVerb, subjectWord, subjectPos) {
  return inflectVerbForSubjectUtil(baseVerb, subjectWord, subjectPos);
}

function buildEntriesByPartOfSpeechIndex() {
  return G_PAGE.dictionary.getEntriesIndex().posIndex;
}

function getEntriesForPartOfSpeech(posIndex, pos) {
  return Array.isArray(posIndex[pos]) ? posIndex[pos] : [];
}

function collectWordSuggestionsForContext(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.SENTENCE, "collectWordSuggestionsForContext", args);
}
function buildPhraseFromPattern(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.SENTENCE, "buildPhraseFromPattern", args);
}
function collectPhraseSuggestionsForContext(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.SENTENCE, "collectPhraseSuggestionsForContext", args);
}
function collectStarterWordSuggestions(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.SENTENCE, "collectStarterWordSuggestions", args);
}
function collectStarterPhraseSuggestions(posIndex, limit = 4) {
  const phrases = [];
  const seen = new Set();

  PHRASE_PATTERNS.forEach((pattern) => {
    const phrase = buildPhraseFromPattern(pattern, posIndex, null);
    if (!phrase) {
      return;
    }
    const key = phrase.words.map(normalizeWordLower).join(" ");
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    phrases.push({
      kind: "phrase",
      label: phrase.words.join(" "),
      reason: "starter phrase",
      words: phrase.words,
      entryIds: phrase.entryIds
    });
  });

  return phrases.slice(0, limit);
}

function buildAutoCompletePlan(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.SENTENCE, "buildAutoCompletePlan", args);
}
function getSentenceSuggestions(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.SENTENCE, "getSentenceSuggestions", args);
}
function renderSentenceSuggestions() {
  const suggestions = getSentenceSuggestions();
  G_RT.sentenceSuggestionActions = suggestions;
  G_DOM.sentenceSuggestions.innerHTML = "";

  if (suggestions.length === 0) {
    const empty = document.createElement("span");
    empty.className = "sentenceSuggestionEmpty";
    empty.textContent = "Suggestions will appear after you add words to your dictionary.";
    G_DOM.sentenceSuggestions.appendChild(empty);
    return;
  }

  suggestions.forEach((item, index) => {
    const chip = document.createElement("span");
    chip.className = "suggestionChip";
    chip.setAttribute("role", "button");
    chip.tabIndex = 0;
    chip.dataset.suggestionIndex = String(index);
    chip.dataset.kind = item.kind;
    chip.textContent = item.label;
    const reason = item.reason ? ` (${item.reason})` : "";
    chip.title = `${item.kind === "auto" ? "Auto-complete sentence" : "Add suggestion"}${reason}`;
    G_DOM.sentenceSuggestions.appendChild(chip);
  });
}

function addSuggestedNode(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.SENTENCE, "addSuggestedNode", args);
}
function addSuggestedPhrase(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.SENTENCE, "addSuggestedPhrase", args);
}
function autoCompleteFromSelectedNode(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.SENTENCE, "autoCompleteFromSelectedNode", args);
}
function renderSentenceGraph(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.SENTENCE, "renderSentenceGraph", args);
}
function renderMiniMap(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.SENTENCE, "renderMiniMap", args);
}
function ensureLabelExists(label) {
  if (!label) {
    return;
  }
  (G_APP.st.addLabel(label)) && (G_APP.s.labels.sort((a, b) => a.localeCompare(b)));
}

function ensureLabelsExist(labels) {
  labels.forEach(ensureLabelExists);
}

function buildSnapshot() {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.SNAPSHOT, "buildSnapshot");
}
function getSelectedEntry() {
  if (!G_APP.s.selectedEntryId) {
    return null;
  }
  return getEntryById(G_APP.s.selectedEntryId);
}

function sortEntries() {
  G_APP.s.entries.sort((a, b) => {
    if (Boolean(a.favorite) !== Boolean(b.favorite)) {
      return a.favorite ? -1 : 1;
    }
    return a.word.localeCompare(b.word, undefined, { sensitivity: "base" }) || a.word.localeCompare(b.word);
  });
}

function clearAutosaveTimer(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.RUNTIME_TIMERS_DOMAIN, "clearAutosaveTimer", args);
}

function clearLookupTimer(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.RUNTIME_TIMERS_DOMAIN, "clearLookupTimer", args);
}

function clearEntryCommitTimer(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.RUNTIME_TIMERS_DOMAIN, "clearEntryCommitTimer", args);
}

function clearTreeSearchTimer(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.RUNTIME_TIMERS_DOMAIN, "clearTreeSearchTimer", args);
}

function clearStatsWorkerTimer(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.RUNTIME_TIMERS_DOMAIN, "clearStatsWorkerTimer", args);
}

function clearUniverseBuildTimer(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.RUNTIME_TIMERS_DOMAIN, "clearUniverseBuildTimer", args);
}

function clearUniverseCacheSaveTimer(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.RUNTIME_TIMERS_DOMAIN, "clearUniverseCacheSaveTimer", args);
}

function disposeWebglRenderer() {
  G_UNI_FX.disposeWebgl();
}

function clearRenderSchedules() {
  (G_RT.treeFrame) && (window.cancelAnimationFrame(G_RT.treeFrame), G_RT.treeFrame = 0);
  (G_RT.graphFrame) && (window.cancelAnimationFrame(G_RT.graphFrame), G_RT.graphFrame = 0);
  (G_RT.uRenderFrame) && (window.cancelAnimationFrame(G_RT.uRenderFrame), G_RT.uRenderFrame = 0);
  G_RT.gNeedPreview = false;
  G_RT.gNeedSuggest = false;
}

function getGroupLimit(groupKey) {
  (!G_APP.s.groupLimits[groupKey]) && (G_APP.s.groupLimits[groupKey] = TREE_PAGE_SIZE);
  return G_APP.s.groupLimits[groupKey];
}

function isGroupExpanded(groupKey) {
  return G_APP.s.expandedGroups[groupKey] === true;
}

function setGroupExpanded(groupKey, expanded) {
  G_APP.s.expandedGroups[groupKey] = Boolean(expanded);
  (expanded) && (getGroupLimit(groupKey));
}

function toggleGroupExpanded(groupKey) {
  setGroupExpanded(groupKey, !isGroupExpanded(groupKey));
}

function increaseGroupLimit(groupKey) {
  G_APP.s.groupLimits[groupKey] = getGroupLimit(groupKey) + TREE_PAGE_SIZE;
}

function getEntriesForLabel(label) {
  return G_PAGE.dictionary.getEntriesIndex().byLabel.get(label) || [];
}

function getUnlabeledEntries() {
  return G_PAGE.dictionary.getEntriesIndex().unlabeled;
}

function getSearchQuery() {
  return cleanText(G_APP.s.treeSearch, MAX.WORD).toLowerCase();
}

function entryMatchesSearch(entry, query) {
  if (!query) {
    return true;
  }
  if (entry.word.toLowerCase().includes(query)) {
    return true;
  }
  if (entry.definition.toLowerCase().includes(query)) {
    return true;
  }
  return entry.labels.some((label) => label.toLowerCase().includes(query));
}

function computeSearchMatchIds(query) {
  const normalizedQuery = cleanText(query, MAX.WORD).toLowerCase();
  if (!normalizedQuery) {
    return null;
  }
  const cacheKey = `${G_RT.entriesVersion}|${normalizedQuery}`;
  if (G_RT.searchKey === cacheKey && G_RT.searchVal instanceof Set) {
    return G_RT.searchVal;
  }
  const ids = new Set();
  G_PAGE.dictionary.getEntriesIndex().byId.forEach((entry) => {
    (entryMatchesSearch(entry, normalizedQuery)) && (ids.add(entry.id));
  });
  G_RT.searchKey = cacheKey;
  G_RT.searchVal = ids;
  return ids;
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
    (getGroupLimit(groupKey) < requiredLimit) && (G_APP.s.groupLimits[groupKey] = requiredLimit);
  });
}

async function saveState() {
  const startedAt = performance.now();
  try {
    ensureCheckpoint("autosave");
    const response = await window.app_api.save(buildSnapshot());
    G_APP.s.lastSavedAt = response.lastSavedAt || nowIso();
    setStatus(formatSaved(G_APP.s.lastSavedAt));
    updateHistoryRestoreOptions();
    recordDiagnosticPerf("save_state_ms", performance.now() - startedAt);
  } catch (error) {
    setStatus("Save failed.", true);
    recordDiagnosticError("save_failed", String(error?.message || error), "saveState");
    console.error(error);
  }
}

function scheduleAutosave() {
  if (!G_RT.readyForAutosave) {
    return;
  }

  clearAutosaveTimer();
  setStatus("Saving...");
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
  const usageStatus = `Usage score: ${getEntryUsageScore(entry)}`;
  const duplicateText = nearDuplicates.length > 0 ? `Near matches: ${nearDuplicates.join(", ")}` : "Near matches: none";
  const relatedText = related.length > 0 ? `Related: ${related.join(", ")}` : "Related: none";
  G_DOM.entryInsights.textContent = `Backlinks: ${backlinks}. ${favoriteStatus}. ${archiveStatus}. ${modeStatus}. ${usageStatus}. ${duplicateText}. ${relatedText}.`;
}

function renderEditorForNewEntry() {
  clearEntryCommitTimer();
  G_APP.s.selectedEntryId = null;
  G_DOM.formTitle.textContent = "New Entry";
  G_DOM.entryForm.reset();
  (G_DOM.entryModeSelect instanceof HTMLSelectElement) && (G_DOM.entryModeSelect.value = "definition");
  (G_DOM.entryLanguageInput instanceof HTMLInputElement) && (G_DOM.entryLanguageInput.value = "");
  updateEntryModeVisualState();
  setHelperText(PATTERN_HELPER_TEXT.DEFAULT);
  setEntryWarnings([]);
  renderEntryInsights(null);
  syncSelectionWithEntry("");
}

function renderEditorForEntry(entry, options = {}) {
  const { syncSelection = true, syncUniverse = true } = options;
  clearEntryCommitTimer();
  G_APP.s.selectedEntryId = entry.id;
  (syncSelection) && (setSingleEntrySelection(entry.id));
  G_DOM.formTitle.textContent = `Edit: ${entry.word}`;
  G_DOM.wordInput.value = entry.word;
  (G_DOM.entryModeSelect instanceof HTMLSelectElement) && (G_DOM.entryModeSelect.value = normalizeEntryMode(entry.mode));
  (G_DOM.entryLanguageInput instanceof HTMLInputElement) && (G_DOM.entryLanguageInput.value = normalizeEntryLanguage(entry.language || ""));
  updateEntryModeVisualState();
  G_DOM.definitionInput.value = entry.definition;
  G_DOM.labelsInput.value = entry.labels.join(", ");
  const near = getNearDuplicateEntries(entry.word, entry.id)
    .map((item) => item.word)
    .slice(0, 4);
  setHelperText(
    near.length > 0
      ? `${PATTERN_HELPER_TEXT.SELECTED} Similar: ${near.join(", ")}`
      : PATTERN_HELPER_TEXT.SELECTED
  );
  setEntryWarnings([]);
  renderEntryInsights(entry);
  (syncUniverse) && (syncSelectionWithEntry(entry.id));
}

function resetEditor() {
  renderEditorForNewEntry();
  clearEntrySelections();
  G_PAGE.tree.reqRender();
}

function selectEntry(entryId) {
  const entry = getEntryById(entryId);
  if (!entry) {
    return;
  }
  incrementEntryUsage(entry.id, 1);
  renderEditorForEntry(entry);
  ensureEntryVisible(entry);
  G_PAGE.tree.reqRender();
  renderStatisticsView();
}

function removeLabel(label) {
  const normalizedLabel = normalizeLabel(label);
  G_APP.st.updateState(
    () => {
      G_APP.s.labels = G_APP.s.labels.filter((item) => item !== normalizedLabel);
      G_APP.s.entries = G_APP.s.entries.map((entry) => ({
        ...entry,
        labels: entry.labels.filter((entryLabel) => entryLabel !== normalizedLabel),
        updatedAt: nowIso()
      }));
    },
    { labels: true, entries: true }
  );

  if (
    normalizedLabel &&
    G_APP.s.selectedTreeLabel &&
    G_APP.s.selectedTreeLabel.toLowerCase() === normalizedLabel.toLowerCase()
  ) {
    G_APP.s.selectedTreeLabel = "";
    G_APP.s.selectedTreeGroupKey = "";
  }
  (G_APP.s.treeLabelFilter === normalizedLabel) && (G_APP.s.treeLabelFilter = LABEL_FILTER_ALL);

  const selectedEntry = getSelectedEntry();
  (selectedEntry) && (G_DOM.labelsInput.value = selectedEntry.labels.join(", "), ensureEntryVisible(selectedEntry));

  G_PAGE.tree.reqRender();
  G_PAGE.sentence.reqRender();
  scheduleAutosave();
}

function beginNewEntryInLabel(label) {
  const normalized = resolvePreferredEntryLabel(label);
  renderEditorForNewEntry();
  (normalized) && (G_DOM.labelsInput.value = normalized, G_APP.s.selectedTreeLabel = normalized, G_APP.s.selectedTreeGroupKey = keyForLabel(normalized));
  G_DOM.wordInput.focus();
  G_PAGE.tree.reqRender();
}

function detachGraphNodesFromEntry(entryId) {
  const id = cleanText(entryId, MAX.WORD);
  if (!id) {
    return;
  }
  let changed = false;
  const nextNodes = G_APP.s.sentenceGraph.nodes.map((node) => {
    if (node.entryId !== id) {
      return node;
    }
    changed = true;
    return {
      ...node,
      entryId: ""
    };
  });
  if (changed) {
    G_APP.st.updateState(
      () => {
        G_APP.s.sentenceGraph = {
          ...G_APP.s.sentenceGraph,
          nodes: nextNodes
        };
      },
      { graph: true }
    );
  }
}

function deleteEntryById(entryId) {
  if (!entryId) {
    return;
  }

  const wasSelected = G_APP.s.selectedEntryId === entryId;
  G_APP.st.removeEntryById(entryId);
  detachGraphNodesFromEntry(entryId);

  if (wasSelected) {
    resetEditor();
  } else {
    G_PAGE.tree.reqRender();
  }

  G_PAGE.sentence.reqRender();

  scheduleAutosave();
}

function deleteSelectedEntry() {
  archiveEntryById(G_APP.s.selectedEntryId);
}

function toggleFavoriteEntry(entryId) {
  const id = cleanText(entryId, MAX.WORD);
  if (!id) {
    return false;
  }
  let changed = false;
  G_APP.st.updateEntryById(id, (entry) => {
    changed = true;
    return {
      ...entry,
      favorite: !entry.favorite,
      updatedAt: nowIso()
    };
  });
  if (!changed) {
    return false;
  }
  sortEntries();
  G_PAGE.tree.reqRender();
  renderEntryInsights(getSelectedEntry());
  scheduleAutosave();
  return true;
}

function archiveEntryById(entryId) {
  const id = cleanText(entryId, MAX.WORD);
  if (!id) {
    return false;
  }
  let changed = false;
  G_APP.st.updateEntryById(id, (entry) => {
    if (entry.archivedAt) {
      return entry;
    }
    changed = true;
    return {
      ...entry,
      archivedAt: nowIso(),
      updatedAt: nowIso()
    };
  });
  if (!changed) {
    return false;
  }
  G_PAGE.tree.reqRender();
  renderEntryInsights(getSelectedEntry());
  scheduleAutosave();
  return true;
}

function restoreEntryById(entryId) {
  const id = cleanText(entryId, MAX.WORD);
  if (!id) {
    return false;
  }
  let changed = false;
  G_APP.st.updateEntryById(id, (entry) => {
    if (!entry.archivedAt) {
      return entry;
    }
    changed = true;
    return {
      ...entry,
      archivedAt: null,
      updatedAt: nowIso()
    };
  });
  if (!changed) {
    return false;
  }
  G_PAGE.tree.reqRender();
  renderEntryInsights(getSelectedEntry());
  scheduleAutosave();
  return true;
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
  const fallbackLabel = resolvePreferredEntryLabel();
  return {
    word: cleanText(G_DOM.wordInput.value, MAX.WORD),
    definition: cleanText(G_DOM.definitionInput.value, MAX.DEFINITION),
    labels: labelsFromForm.length > 0 ? labelsFromForm : fallbackLabel ? [fallbackLabel] : [],
    mode: normalizeEntryMode(
      G_DOM.entryModeSelect instanceof HTMLSelectElement ? G_DOM.entryModeSelect.value : "definition"
    ),
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
    setStatus("Word and definition are required.", true);
    return false;
  }

  const localAssist = applyLocalAssist(formData);
  formData = localAssist.formData;
  setEntryWarnings(localAssist.warnings);
  G_DOM.definitionInput.value = formData.definition;
  G_DOM.labelsInput.value = formData.labels.join(", ");

  const duplicate = getDuplicateEntry(formData.word, G_APP.s.selectedEntryId || "");
  if (duplicate) {
    setStatus(`Duplicate word "${formData.word}" already exists.`, true);
    setHelperText(`Duplicate detected: "${formData.word}". Use batch import merge modes or edit existing entry.`);
    setEntryWarnings([`Duplicate word: ${formData.word}`]);
    return false;
  }

  const inferredLabels =
    formData.mode === "definition" || formData.mode === "slang" ? inferLabelsFromDefinition(formData.definition) : [];
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
    setHelperText(PATTERN_HELPER_TEXT.SAVED_NEXT);
    G_DOM.wordInput.focus();
  } else if (selectedEntry && !(advanceToNext && !wasEditing)) {
    ensureEntryVisible(selectedEntry);
    renderEditorForEntry(selectedEntry);
  } else if (advanceToNext && !wasEditing) {
    (selectedEntry) && (ensureEntryVisible(selectedEntry));
    renderEditorForNewEntry();
    setHelperText(PATTERN_HELPER_TEXT.SAVED_NEXT);
    G_DOM.wordInput.focus();
  } else {
    renderEditorForNewEntry();
  }

  G_PAGE.tree.reqRender();
  G_PAGE.sentence.reqRender();
  renderStatisticsView();
  if (localAssist.warnings.length > 0) {
    setHelperText(`${PATTERN_HELPER_TEXT.SELECTED} ${localAssist.warnings.join(" | ")}`);
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
  clearEntryCommitTimer();

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
    setStatus("Enter a word first.", true);
    return;
  }

  if (cleanText(G_DOM.definitionInput.value, MAX.DEFINITION)) {
    return;
  }

  if (!window.app_api?.lookupDefinition) {
    setStatus("Lookup API unavailable.", true);
    return;
  }

  const requestId = ++G_RT.lookupRequestId;
  G_RT.lookupInFlightRequestId = requestId;
  setStatus(`Looking up "${word}"...`);

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
      setStatus(result?.error || "Definition not found.", true);
      return;
    }

    G_DOM.definitionInput.value = cleanText(result.definition || "", MAX.DEFINITION);
    G_DOM.labelsInput.value = mergeLookupLabels(result.labels).join(", ");

    const saved = saveEntryFromForm({ advanceToNext: !G_APP.s.selectedEntryId });
    if (!saved) {
      return;
    }

    clearAutosaveTimer();
    await saveState();
    if (G_APP.s.selectedEntryId) {
      setHelperText(`Definition fetched online for "${word}" and saved locally.`);
    } else {
      setHelperText(PATTERN_HELPER_TEXT.SAVED_NEXT);
    }
  } catch (error) {
    setStatus("Lookup failed. Try again.", true);
    console.error(error);
  } finally {
    (G_RT.lookupInFlightRequestId === requestId) && (G_RT.lookupInFlightRequestId = 0);
    scheduleAutoCommitDraft();
  }
}

function scheduleAutoLookup() {
  const word = cleanText(G_DOM.wordInput.value, MAX.WORD);
  const definition = cleanText(G_DOM.definitionInput.value, MAX.DEFINITION);
  const mode = normalizeEntryMode(
    G_DOM.entryModeSelect instanceof HTMLSelectElement ? G_DOM.entryModeSelect.value : "definition"
  );
  clearLookupTimer();
  G_RT.queuedLookupWord = "";

  if (mode === "code" || mode === "bytes" || word.length < MIN_LOOKUP_LENGTH || definition) {
    return;
  }
  G_RT.queuedLookupWord = word;
  G_RT.lookupTask.schedule();
}

function closeContextMenu() {
  G_RT.contextMenuActions = [];
  G_DOM.contextMenu.innerHTML = "";
  G_DOM.contextMenu.classList.add("hidden");
}

function openContextMenu(items, x, y) {
  if (!Array.isArray(items) || items.length === 0) {
    closeContextMenu();
    return;
  }

  G_RT.contextMenuActions = items;
  G_DOM.contextMenu.innerHTML = "";

  items.forEach((item, index) => {
    const menuItem = document.createElement("div");
    menuItem.className = "contextMenuItem";
    menuItem.setAttribute("role", "menuitem");
    menuItem.tabIndex = 0;
    menuItem.dataset.action = "context-action";
    menuItem.dataset.contextIndex = String(index);
    menuItem.textContent = item.label;
    (item.dangerous) && (menuItem.classList.add("contextDanger"));
    G_DOM.contextMenu.appendChild(menuItem);
  });

  G_DOM.contextMenu.classList.remove("hidden");
  G_DOM.contextMenu.style.left = `${x}px`;
  G_DOM.contextMenu.style.top = `${y}px`;

  const bounds = G_DOM.contextMenu.getBoundingClientRect();
  const adjustedLeft = Math.max(8, Math.min(x, window.innerWidth - bounds.width - 8));
  const adjustedTop = Math.max(8, Math.min(y, window.innerHeight - bounds.height - 8));
  G_DOM.contextMenu.style.left = `${adjustedLeft}px`;
  G_DOM.contextMenu.style.top = `${adjustedTop}px`;
}

function openEntryContextMenu(entryId, x, y) {
  const entry = getEntryById(entryId);
  if (!entry) {
    return;
  }

  const selectedEntries = getSelectedEntries();
  if (selectedEntries.length > 1 && G_APP.s.selectedEntryIds.includes(entryId)) {
    const hasArchived = selectedEntries.some((item) => item.archivedAt);
    openContextMenu(
      [
        {
          label: `Build Sentence (${selectedEntries.length})`,
          onSelect: () => buildSentenceFromSelectedEntries()
        },
        ...(hasArchived
          ? [
              {
                label: "Restore Selected Words",
                onSelect: () => {
                  selectedEntries.forEach((item) => restoreEntryById(item.id));
                  G_PAGE.tree.reqRender();
                }
              }
            ]
          : []),
        {
          label: "Archive Selected Words",
          dangerous: true,
          onSelect: () => deleteSelectedEntries()
        }
      ],
      x,
      y
    );
    return;
  }

  openContextMenu(
    [
      {
        label: "Add to Sentence Graph",
        onSelect: () => addNodeToSentenceGraph(entry.word, entry.id)
      },
      {
        label: `Edit "${entry.word}"`,
        onSelect: () => selectEntry(entry.id)
      },
      {
        label: entry.favorite ? "Unfavorite" : "Favorite",
        onSelect: () => toggleFavoriteEntry(entry.id)
      },
      {
        label: entry.archivedAt ? "Restore Word" : "Archive Word",
        onSelect: () => (entry.archivedAt ? restoreEntryById(entry.id) : archiveEntryById(entry.id))
      },
      {
        label: "Delete Word Permanently",
        dangerous: true,
        onSelect: () => deleteEntryById(entry.id)
      }
    ],
    x,
    y
  );
}

function openLabelContextMenu(label, x, y) {
  const normalized = normalizeLabel(label);
  if (!normalized) {
    return;
  }

  openContextMenu(
    [
      {
        label: `New Word in "${normalized}"`,
        onSelect: () => beginNewEntryInLabel(normalized)
      },
      {
        label: `Delete Folder "${normalized}"`,
        dangerous: true,
        onSelect: () => removeLabel(normalized)
      }
    ],
    x,
    y
  );
}

function buildCountsIndex() {
  const entriesIndex = G_PAGE.dictionary.getEntriesIndex();
  const useAll = G_APP.s.treeShowArchived;
  const sourceCounts = useAll ? entriesIndex.labelCounts : entriesIndex.labelCountsActive;
  const labelCounts = {};
  Object.keys(sourceCounts).forEach((label) => {
    labelCounts[label] = sourceCounts[label] || 0;
  });
  return {
    labelCounts,
    unlabeledCount: useAll ? entriesIndex.unlabeled.length : entriesIndex.unlabeledActive.length
  };
}

function updateLabelFilterOptions() {
  const { labelCounts, unlabeledCount } = buildCountsIndex();
  const sortedLabels = G_PAGE.dictionary.getEntriesIndex().sortedLabels;

  const isValidFilter =
    G_APP.s.treeLabelFilter === LABEL_FILTER_ALL ||
    G_APP.s.treeLabelFilter === LABEL_FILTER_UNLABELED ||
    sortedLabels.includes(G_APP.s.treeLabelFilter);

  (!isValidFilter) && (G_APP.s.treeLabelFilter = LABEL_FILTER_ALL);

  if (
    G_APP.s.selectedTreeLabel &&
    !sortedLabels.some((label) => label.toLowerCase() === G_APP.s.selectedTreeLabel.toLowerCase())
  ) {
    G_APP.s.selectedTreeLabel = "";
    (G_APP.s.selectedTreeGroupKey.startsWith("label:")) && (G_APP.s.selectedTreeGroupKey = "");
  }

  const cacheKey = `${G_RT.entriesVersion}|${G_APP.s.treeLabelFilter}|${G_APP.s.treeShowArchived ? 1 : 0}`;
  if (G_RT.labelOptsKey === cacheKey) {
    if (G_DOM.treeLabelFilter.value !== G_APP.s.treeLabelFilter) {
      G_DOM.treeLabelFilter.value = G_APP.s.treeLabelFilter;
    }
    return;
  }

  G_DOM.treeLabelFilter.innerHTML = "";

  const allOption = document.createElement("option");
  allOption.value = LABEL_FILTER_ALL;
  allOption.textContent = `All Labels (${G_APP.s.entries.length})`;
  G_DOM.treeLabelFilter.appendChild(allOption);

  sortedLabels.forEach((label) => {
    const option = document.createElement("option");
    option.value = label;
    option.textContent = `${label} (${labelCounts[label] || 0})`;
    G_DOM.treeLabelFilter.appendChild(option);
  });

  const unlabeledOption = document.createElement("option");
  unlabeledOption.value = LABEL_FILTER_UNLABELED;
  unlabeledOption.textContent = `${UNLABELED_NAME} (${unlabeledCount})`;
  G_DOM.treeLabelFilter.appendChild(unlabeledOption);

  G_DOM.treeLabelFilter.value = G_APP.s.treeLabelFilter;
  G_RT.labelOptsKey = cacheKey;
}

function updatePartOfSpeechFilterOptions() {
  if (!(G_DOM.treePartOfSpeechFilter instanceof HTMLSelectElement)) {
    return;
  }

  const current = cleanText(G_APP.s.treePartOfSpeechFilter, 40) || TREE_POS_FILTER_ALL;
  const posLabels = [...PARTS_OF_SPEECH].sort((a, b) => a.localeCompare(b));
  G_DOM.treePartOfSpeechFilter.innerHTML = "";

  const allOption = document.createElement("option");
  allOption.value = TREE_POS_FILTER_ALL;
  allOption.textContent = "All Parts of Speech";
  G_DOM.treePartOfSpeechFilter.appendChild(allOption);

  posLabels.forEach((pos) => {
    const option = document.createElement("option");
    option.value = pos;
    option.textContent = pos;
    G_DOM.treePartOfSpeechFilter.appendChild(option);
  });

  const valid = current === TREE_POS_FILTER_ALL || posLabels.includes(current);
  G_APP.s.treePartOfSpeechFilter = valid ? current : TREE_POS_FILTER_ALL;
  G_DOM.treePartOfSpeechFilter.value = G_APP.s.treePartOfSpeechFilter;
}

function updateActivityFilterOptions() {
  if (!(G_DOM.treeActivityFilter instanceof HTMLSelectElement)) {
    return;
  }
  const allowed = new Set([TREE_ACTIVITY_FILTER_ALL, "favorites", "recent", "linked"]);
  const current = cleanText(G_APP.s.treeActivityFilter, 40) || TREE_ACTIVITY_FILTER_ALL;
  G_APP.s.treeActivityFilter = allowed.has(current) ? current : TREE_ACTIVITY_FILTER_ALL;
  G_DOM.treeActivityFilter.value = G_APP.s.treeActivityFilter;
}

function setQuickCaptureStatus(message, isError = false) {
  if (!(G_DOM.quickCaptureStatus instanceof HTMLElement)) {
    return;
  }
  G_DOM.quickCaptureStatus.textContent = message;
  G_DOM.quickCaptureStatus.classList.toggle("error", isError);
}

function getTopTreeLabels(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.TREE, "getTopTreeLabels", args);
}
function getTopLabelCount(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.TREE, "getTopLabelCount", args);
}
function selectTopLabel(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.TREE, "selectTopLabel", args);
}
function selectTopLabelByIndex(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.TREE, "selectTopLabelByIndex", args);
}
function renderTopLabelBar(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.TREE, "renderTopLabelBar", args);
}
function parseQuickBatchWords(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.TREE, "parseQuickBatchWords", args);
}
function parseSentenceInputWords(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.TREE, "parseSentenceInputWords", args);
}
async function captureSingleWord(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.TREE, "captureSingleWord", args);
}
async function captureWordFromQuickInput(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.TREE, "captureWordFromQuickInput", args);
}
async function captureBatchWordsFromQuickInput(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.TREE, "captureBatchWordsFromQuickInput", args);
}
function entryPassesAdvancedFilters(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.TREE, "entryPassesAdvancedFilters", args);
}
function buildEntryFilterContext(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.TREE, "buildEntryFilterContext", args);
}
function buildGroupDescriptor(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.TREE, "buildGroupDescriptor", args);
}
function buildTreeModel(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.TREE, "buildTreeModel", args);
}
function createFileRow(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.TREE, "createFileRow", args);
}
function renderVirtualizedGroupRows(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.TREE, "renderVirtualizedGroupRows", args);
}
function createVirtualizedFileList(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.TREE, "createVirtualizedFileList", args);
}
function createTreeGroup(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.TREE, "createTreeGroup", args);
}
function createCategoryGroup(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.TREE, "createCategoryGroup", args);
}
function renderTreeSummary(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.TREE, "renderTreeSummary", args);
}
function getFilteredArchivedEntries(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.TREE, "getFilteredArchivedEntries", args);
}
function restoreFilteredArchivedEntries(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.TREE, "restoreFilteredArchivedEntries", args);
}
function purgeFilteredArchivedEntries(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.TREE, "purgeFilteredArchivedEntries", args);
}
function renderArchivePanel(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.TREE, "renderArchivePanel", args);
}
function renderTree(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.TREE, "renderTree", args);
}
function getAllGroupKeys(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.TREE, "getAllGroupKeys", args);
}
function expandAllGroups(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.TREE, "expandAllGroups", args);
}
function collapseAllGroups(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.TREE, "collapseAllGroups", args);
}
function normalizeLoadedEntry(entry) {
  const source = entry && typeof entry === "object" ? entry : {};
  const word = cleanText(source.word, MAX.WORD);
  const definition = cleanText(source.definition, MAX.DEFINITION);
  if (!word && !definition) {
    return null;
  }

  const labels = normalizeLabelArray(source.labels);

  return {
    id: cleanText(source.id, MAX.WORD) || window.crypto.randomUUID(),
    word,
    definition,
    labels,
    favorite: Boolean(source.favorite),
    archivedAt: cleanText(source.archivedAt, MAX.DATE) || null,
    mode: normalizeEntryMode(source.mode),
    language: normalizeEntryLanguage(source.language || ""),
    usageCount: Math.max(0, Math.floor(Number(source.usageCount) || 0)),
    createdAt: cleanText(source.createdAt, MAX.DATE) || nowIso(),
    updatedAt: cleanText(source.updatedAt, MAX.DATE) || nowIso()
  };
}

function normalizeLoadedSentenceGraph(graphSource) {
  const source = graphSource && typeof graphSource === "object" ? graphSource : {};
  const nodes = [];
  const nodeIdSet = new Set();

  if (Array.isArray(source.nodes)) {
    source.nodes.forEach((node) => {
      const item = node && typeof node === "object" ? node : {};
      const word = cleanText(item.word, MAX.WORD);
      if (!word) {
        return;
      }

      const id = cleanText(item.id, MAX.WORD) || window.crypto.randomUUID();
      if (nodeIdSet.has(id)) {
        return;
      }
      nodeIdSet.add(id);

      nodes.push({
        id,
        entryId: cleanText(item.entryId, MAX.WORD),
        word,
        locked: Boolean(item.locked),
        x: clampNumber(Number(item.x), 8, GRAPH_STAGE_WIDTH - GRAPH_NODE_WIDTH - 8),
        y: clampNumber(Number(item.y), 8, GRAPH_STAGE_HEIGHT - GRAPH_NODE_HEIGHT - 8)
      });
    });
  }

  const links = [];
  const linkSet = new Set();
  if (Array.isArray(source.links)) {
    source.links.forEach((link) => {
      const item = link && typeof link === "object" ? link : {};
      const fromNodeId = cleanText(item.fromNodeId, MAX.WORD);
      const toNodeId = cleanText(item.toNodeId, MAX.WORD);
      if (!fromNodeId || !toNodeId || fromNodeId === toNodeId) {
        return;
      }
      if (!nodeIdSet.has(fromNodeId) || !nodeIdSet.has(toNodeId)) {
        return;
      }
      const key = `${fromNodeId}->${toNodeId}`;
      if (linkSet.has(key)) {
        return;
      }
      linkSet.add(key);
      links.push({
        id: cleanText(item.id, MAX.WORD) || window.crypto.randomUUID(),
        fromNodeId,
        toNodeId
      });
    });
  }

  return { nodes, links };
}

function hydrateState(loaded) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.SNAPSHOT, "hydrateState", [loaded]);
}

async function loadDictionaryData() {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.SNAPSHOT, "loadDictionaryData");
}

async function submitAuth() {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.SNAPSHOT, "submitAuth");
}

async function initializeAuthGate() {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.SNAPSHOT, "initializeAuthGate");
}

function getAuthSubmitHint() {
  return getAuthSubmitHintUtil(G_RT.authMode);
}

function resetAuthHintIfNeeded() {
  (G_DOM.authHint.classList.contains("error")) && (setAuthHint(getAuthSubmitHint()));
}

function bindAutoCommitField(field, options = {}) {
  const { onInput = null, onBlur = null } = options;
  if (!(field instanceof HTMLElement)) {
    return;
  }

  field.addEventListener("input", () => {
    (typeof onInput === "function") && (onInput());
    scheduleAutoCommitDraft();
  });

  field.addEventListener("paste", () => {
    window.setTimeout(() => {
      (typeof onInput === "function") && (onInput());
      scheduleAutoCommitDraft();
    }, 0);
  });

  field.addEventListener("blur", () => {
    (typeof onBlur === "function") && (onBlur());
    scheduleAutoCommitDraft();
  });
}

function bindActionElement(element, onAction) {
  if (!(element instanceof HTMLElement) || typeof onAction !== "function") {
    return;
  }

  element.addEventListener("click", (event) => {
    event.preventDefault();
    onAction();
  });

  element.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }
    event.preventDefault();
    onAction();
  });
}

function bindUniverseInteractions() {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.UNIVERSE_EVENTS, "bindUniverseInteractions");
}
function isCommandPaletteVisible(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.COMMAND, "isCommandPaletteVisible", args);
}
function closeCmdPalette(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.COMMAND, "closeCmdPalette", args);
}
function executeCommandPaletteItem(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.COMMAND, "executeCommandPaletteItem", args);
}
function renderCmdList(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.COMMAND, "renderCmdList", args);
}
function createCommandLabel(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.COMMAND, "createCommandLabel", args);
}
function createCommandRunner(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.COMMAND, "createCommandRunner", args);
}
function createCommandItem(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.COMMAND, "createCommandItem", args);
}
function buildCommandPaletteActions(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.COMMAND, "buildCommandPaletteActions", args);
}
function openCommandPalette(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.COMMAND, "openCommandPalette", args);
}
function filterCommandPalette(...args) {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.COMMAND, "filterCommandPalette", args);
}
function isTypingTargetElement(activeElement) {
  return isTypingTargetUtil(activeElement, [
    G_DOM.quickWordInput,
    G_DOM.quickBatchInput,
    G_DOM.wordInput,
    G_DOM.entryModeSelect,
    G_DOM.entryLanguageInput,
    G_DOM.definitionInput,
    G_DOM.labelsInput,
    G_DOM.newLabelInput,
    G_DOM.batchLabelInput,
    G_DOM.batchRelabelInput,
    G_DOM.bulkImportInput,
    G_DOM.treeSearchInput,
    G_DOM.archiveSearchInput,
    G_DOM.universeFilterInput,
    G_DOM.universeMinWordLengthInput,
    G_DOM.universeMaxNodesInput,
    G_DOM.universeMaxEdgesInput,
    G_DOM.universeLabelFilterInput,
    G_DOM.universeCreateSetInput,
    G_DOM.universePathFromInput,
    G_DOM.universePathToInput,
    G_DOM.universeColorModeSelect,
    G_DOM.universeRenderModeSelect,
    G_DOM.universeBookmarkSelect,
    G_DOM.sentenceWordInput,
    G_DOM.commandPaletteInput,
    G_DOM.uiSettingsTrigger,
    G_DOM.uiThemeEnterpriseInput,
    G_DOM.uiThemeFuturisticInput,
    G_DOM.uiThemeMonochromeInput,
    G_DOM.uiReduceMotionInput,
    G_DOM.authUsernameInput,
    G_DOM.authPasswordInput
  ]);
}

function bindEvents() {
  return runExtractedByModule(PATTERN_EXTRACTED_MODULE.EVENTS_DOMAIN, "bindEvents");
}

async function initialize() {
  applyUiPreferences(createDefaultUiPreferences());
  (window.app_api?.loadUiPreferences) && (await loadUiPreferencesFromDisk());
  initializeUiMotion();
  initializeStatsWorker();
  initializeUniverseWorker();
  bindEvents();
  renderDiagnosticsSummary();

  if (!window.app_api) {
    setStatus("App bridge unavailable.", true);
    setAuthHint("App bridge unavailable.", true);
    setAuthGateVisible(true);
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

  pushRuntimeLog("info", "renderer", "Renderer initialized.", "initialize");

  await initializeAuthGate();
}

initialize();
