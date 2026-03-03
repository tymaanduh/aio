// All constants are loaded from modules/constants.js via window.Dictionary_Constants (legacy: window.DictionaryConstants)
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
} = window.Dictionary_Constants || window.DictionaryConstants;

const {
  Dictionary_Store = window.Dictionary_Store || window.DictionaryStore || {},
  Dictionary_Tree_Utils = window.Dictionary_Tree_Utils || window.DictionaryTreeUtils || {},
  Dictionary_Graph_Utils = window.Dictionary_Graph_Utils || window.DictionaryGraphUtils || {},
  Dictionary_Indexing_Utils = window.Dictionary_Indexing_Utils || window.DictionaryIndexingUtils || {},
  Dictionary_Duplicates_Utils = window.Dictionary_Duplicates_Utils || window.DictionaryDuplicatesUtils || {},
  Dictionary_Import_Utils = window.Dictionary_Import_Utils || window.DictionaryImportUtils || {},
  Dictionary_Diagnostics_Utils = window.Dictionary_Diagnostics_Utils || window.DictionaryDiagnosticsUtils || {},
  Dictionary_Command_Palette_Utils = window.Dictionary_Command_Palette_Utils || window.DictionaryCommandPaletteUtils || {},
  Dictionary_Suggestion_Utils = window.Dictionary_Suggestion_Utils || window.DictionarySuggestionUtils || {},
  Dictionary_Auth_Utils = window.Dictionary_Auth_Utils || window.DictionaryAuthUtils || {},
  Dictionary_Autosave_Utils = window.Dictionary_Autosave_Utils || window.DictionaryAutosaveUtils || {},
  Dictionary_Ui_Preferences_Utils = window.Dictionary_Ui_Preferences_Utils || window.DictionaryUiPreferencesUtils || {},
  Dictionary_Universe_Graph_Utils = window.Dictionary_Universe_Graph_Utils || window.DictionaryUniverseGraphUtils || {},
  Dictionary_Universe_Render_Utils = window.Dictionary_Universe_Render_Utils || window.DictionaryUniverseRenderUtils || {},
  Dictionary_Universe_Graphics_Engine = window.Dictionary_Universe_Graphics_Engine || window.DictionaryUniverseGraphicsEngine || {},
  Dictionary_Universe_State_Utils = window.Dictionary_Universe_State_Utils || window.DictionaryUniverseStateUtils || {},
  Dictionary_Entry_Index_Utils = window.Dictionary_Entry_Index_Utils || window.DictionaryEntryIndexUtils || {},
  Dictionary_Dom_Utils = window.Dictionary_Dom_Utils || window.DictionaryDomUtils || {},
  Dictionary_Runtime_Slots_Utils = window.Dictionary_Runtime_Slots_Utils || window.DictionaryRuntimeSlotsUtils || {},
  Dictionary_Page_Namespace_Utils = window.Dictionary_Page_Namespace_Utils || window.DictionaryPageNamespaceUtils || {},
  Dictionary_Renderer_State_Data = window.Dictionary_Renderer_State_Data || window.DictionaryRendererStateData || {},
  Dictionary_Alias_Index = window.Dictionary_Alias_Index || window.DictionaryAliasIndex || {}
} = window;

const MOD_ALIAS = {
  core: {
    Dictionary_Store,
    Dictionary_Tree_Utils,
    Dictionary_Graph_Utils,
    Dictionary_Indexing_Utils,
    Dictionary_Duplicates_Utils,
    Dictionary_Import_Utils,
    Dictionary_Diagnostics_Utils,
    Dictionary_Command_Palette_Utils
  },
  text: {
    Dictionary_Suggestion_Utils,
    Dictionary_Auth_Utils
  },
  ui: {
    Dictionary_Autosave_Utils,
    Dictionary_Ui_Preferences_Utils,
    Dictionary_Dom_Utils,
    Dictionary_Page_Namespace_Utils
  },
  uni: {
    Dictionary_Universe_Graph_Utils,
    Dictionary_Universe_Render_Utils,
    Dictionary_Universe_Graphics_Engine,
    Dictionary_Universe_State_Utils,
    Dictionary_Entry_Index_Utils
  },
  runtime: {
    Dictionary_Runtime_Slots_Utils,
    Dictionary_Renderer_State_Data
  },
  alias: {
    Dictionary_Alias_Index
  }
};

const { createStateStore } = MOD_ALIAS.core.Dictionary_Store;
const { shouldVirtualizeGroup, calculateVirtualWindow } = MOD_ALIAS.core.Dictionary_Tree_Utils;
const { buildGraphIndex } = MOD_ALIAS.core.Dictionary_Graph_Utils;
const { buildWordPrefixIndex } = MOD_ALIAS.core.Dictionary_Indexing_Utils;
const { buildNearDuplicateCluster } = MOD_ALIAS.core.Dictionary_Duplicates_Utils;
const { applyInChunks } = MOD_ALIAS.core.Dictionary_Import_Utils;
const { createDefaultDiagnostics, normalizeDiagnostics, mergeDiagnostics } = MOD_ALIAS.core.Dictionary_Diagnostics_Utils;
const { rankCommands } = MOD_ALIAS.core.Dictionary_Command_Palette_Utils;
const {
  normalizeWordLower: normalizeWordLowerUtil,
  inflectVerbForSubject: inflectVerbForSubjectUtil
} = MOD_ALIAS.text.Dictionary_Suggestion_Utils;
const {
  getAuthSubmitHint: getAuthSubmitHintUtil,
  isTypingTarget: isTypingTargetUtil
} = MOD_ALIAS.text.Dictionary_Auth_Utils;
const { createDebouncedTask } = MOD_ALIAS.ui.Dictionary_Autosave_Utils;
const {
  UI_THEME_IDS,
  createDefaultUiPreferences,
  normalizeUiTheme,
  normalizeUiPreferences
} = MOD_ALIAS.ui.Dictionary_Ui_Preferences_Utils;
const { createElementMap, RENDERER_ELEMENT_IDS } = MOD_ALIAS.ui.Dictionary_Dom_Utils;
const { bindPageNamespace } = MOD_ALIAS.ui.Dictionary_Page_Namespace_Utils;
const {
  getNodeWordLower: getNodeWord,
  buildGraphCacheToken: buildGraphToken,
  buildIndexFlags: buildIdxFlags,
  computeHighlightState: computeHighlight,
  computeAdjacencyState: computeAdjacency,
  findPathIndices: findPath
} = MOD_ALIAS.uni.Dictionary_Universe_Graph_Utils;
const {
  colorRgb,
  colorRgbBytes,
  ensureFloat32Capacity: ensureF32,
  ensureWebglBufferCapacity: ensureGlBuf,
  pushRgbaPair: pushPair,
  pushRgba,
  pushRgbaFromArray: pushFrom
} = MOD_ALIAS.uni.Dictionary_Universe_Render_Utils;
const { createUniverseGraphicsEngine } = MOD_ALIAS.uni.Dictionary_Universe_Graphics_Engine;
const { createUniverseStateTools } = MOD_ALIAS.uni.Dictionary_Universe_State_Utils;
const { createEntryIndexTools } = MOD_ALIAS.uni.Dictionary_Entry_Index_Utils;
const { createRuntimeSlots } = MOD_ALIAS.runtime.Dictionary_Runtime_Slots_Utils;
const {
  createRendererRuntimeSpec,
  createRendererVisualState
} = MOD_ALIAS.runtime.Dictionary_Renderer_State_Data;
const {
  ALIAS_WORD_INDEX = [],
  createAliasMap,
  getAliasWords
} = MOD_ALIAS.alias.Dictionary_Alias_Index;

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
const PATTERN_UNIVERSE_EDGE_ACTIONS = Object.freeze([
  ["universeEdgeContainsAction", PATTERN_UNIVERSE_EDGE_MODE.CONTAINS],
  ["universeEdgePrefixAction", PATTERN_UNIVERSE_EDGE_MODE.PREFIX],
  ["universeEdgeSuffixAction", PATTERN_UNIVERSE_EDGE_MODE.SUFFIX],
  ["universeEdgeStemAction", PATTERN_UNIVERSE_EDGE_MODE.STEM],
  ["universeEdgeSameLabelAction", PATTERN_UNIVERSE_EDGE_MODE.SAME_LABEL]
]);

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
  activeView: VIEW_WORKBENCH,
  lastSavedAt: null,
  treeSearch: "",
  treeLabelFilter: LABEL_FILTER_ALL,
  treePartOfSpeechFilter: TREE_POS_FILTER_ALL,
  treeActivityFilter: TREE_ACTIVITY_FILTER_ALL,
  treeHasGraphOnly: false,
  treeShowArchived: false,
  archiveSearch: "",
  localAssistEnabled: true,
  selectedTreeGroupKey: "",
  selectedTreeLabel: "",
  explorerLayoutMode: EXPLORER_LAYOUT_NORMAL,
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
    autosave: AUTOSAVE_DELAY_MS,
    lookup: AUTO_LOOKUP_DELAY_MS,
    entryCommit: AUTO_ENTRY_COMMIT_DELAY_MS,
    treeSearch: TREE_SEARCH_DELAY_MS,
    statsSync: STATS_WORKER_SYNC_DELAY_MS,
    uBuild: UNIVERSE_BUILD_DELAY_MS
  },
  universe: {
    state: {
      minWordLength: UNIVERSE_MIN_WORD_LENGTH,
      maxWordLength: UNIVERSE_MAX_WORD_LENGTH,
      maxNodes: UNIVERSE_MAX_NODES,
      maxEdges: UNIVERSE_MAX_EDGES,
      zoomMin: UNIVERSE_ZOOM_MIN,
      zoomMax: UNIVERSE_ZOOM_MAX,
      colorModeQuestion: UNIVERSE_COLOR_MODE_QUESTION,
      colorModePos: UNIVERSE_COLOR_MODE_POS,
      colorModeMode: UNIVERSE_COLOR_MODE_MODE,
      viewModeCanvas: UNIVERSE_VIEW_MODE_CANVAS,
      viewModeWebgl: UNIVERSE_VIEW_MODE_WEBGL,
      bookmarkLimit: UNIVERSE_BOOKMARK_LIMIT,
      maxWord: MAX.WORD,
      maxLabel: MAX.LABEL,
      maxDate: MAX.DATE
    },
    gfx: {
      interactionActiveMs: UNIVERSE_INTERACTION_ACTIVE_MS,
      interactionEdgeTarget: UNIVERSE_INTERACTION_EDGE_TARGET,
      idleEdgeTarget: UNIVERSE_IDLE_EDGE_TARGET,
      perfEdgeTargetSoft: UNIVERSE_PERF_EDGE_TARGET_SOFT,
      perfEdgeTargetHard: UNIVERSE_PERF_EDGE_TARGET_HARD,
      minEdgeTarget: UNIVERSE_MIN_EDGE_TARGET,
      zoomMin: UNIVERSE_ZOOM_MIN,
      zoomMax: UNIVERSE_ZOOM_MAX,
      clearColor: UNIVERSE_WEBGL_CLEAR_COLOR,
      lineColorPath: UNIVERSE_WEBGL_LINE_COLOR_PATH,
      lineColorDim: UNIVERSE_WEBGL_LINE_COLOR_DIM,
      lineColorLabel: UNIVERSE_WEBGL_LINE_COLOR_LABEL,
      lineColorDefault: UNIVERSE_WEBGL_LINE_COLOR_DEFAULT,
      pointColorPrimary: UNIVERSE_WEBGL_POINT_COLOR_PRIMARY,
      pointColorSecondary: UNIVERSE_WEBGL_POINT_COLOR_SECONDARY,
      pointColorHover: UNIVERSE_WEBGL_POINT_COLOR_HOVER,
      pointColorPath: UNIVERSE_WEBGL_POINT_COLOR_PATH,
      pointColorHighlight: UNIVERSE_WEBGL_POINT_COLOR_HIGHLIGHT
    }
  },
  entryIndex: {
    maxWord: MAX.WORD,
    maxLabel: MAX.LABEL
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
  isPartOfSpeechLabel,
  ...G_APP.c.entryIndex
});

const RUNTIME_SLOT_STATE = createRuntimeSlots(
  createRendererRuntimeSpec({
    authModeCreate: AUTH_MODE_CREATE,
    createUniverseBenchmarkState
  })
);
const G_RT = RUNTIME_SLOT_STATE;
const RENDER_VISUAL_STATE = createRendererVisualState();
const UNIVERSE_STATE = {
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
const G_UNI = UNIVERSE_STATE;
const UNIVERSE_GFX_ENGINE = createUniverseGraphicsEngine({
  ...G_APP.c.universe.gfx,
  cleanText,
  clampNumber,
  recordDiagnosticError,
  ensureFloat32Capacity: ensureF32,
  ensureWebglBufferCapacity: ensureGlBuf,
  pushRgbaPair: pushPair,
  pushRgba: pushRgba,
  pushRgbaFromArray: pushFrom,
  getColorRgb: colorRgb
});
const G_UNI_FX = UNIVERSE_GFX_ENGINE;
const PAGE_NAMESPACE = bindPageNamespace(window, {
  dictionary: { getEntriesIndex },
  tree: { reqRender: reqTree },
  sentence: { reqRender: reqSentence, getIndex: getIdx, getNode },
  universe: {
    reqRender: reqGraph,
    syncControls,
    setPathStatus,
    renderSummary,
    renderCluster: renderClusterPanel
  }
});
const G_PAGE = PAGE_NAMESPACE;
[
  ["autosaveTask", G_APP.c.taskDelay.autosave, saveState],
  ["entryCommitTask", G_APP.c.taskDelay.entryCommit, autoSaveDraftAndAdvance],
  ["treeSearchTask", G_APP.c.taskDelay.treeSearch, () => G_PAGE.tree.reqRender()],
  ["statsWorkerTask", G_APP.c.taskDelay.statsSync, requestStatsWorkerComputeNow],
  ["uBuildTask", G_APP.c.taskDelay.uBuild, requestGraphBuildNow]
].forEach(([slot, delayMs, fn]) => {
  G_RT[slot] = createDebouncedTask(delayMs, fn);
});
G_RT.lookupTask = createDebouncedTask(G_APP.c.taskDelay.lookup, () => {
  const word = G_RT.queuedLookupWord;
  G_RT.queuedLookupWord = "";
  lookupAndSaveEntry(word);
});

const DOM_ELEMENT_MAP = createElementMap(RENDERER_ELEMENT_IDS);
const G_DOM = DOM_ELEMENT_MAP;

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

function pushRuntimeLog(level, source, message, context = "") {
  if (!G_RT.runtimeLogEnabled || !window.dictionaryAPI?.appendRuntimeLog) {
    return;
  }
  window.dictionaryAPI
    .appendRuntimeLog({
      at: nowIso(),
      level,
      source,
      message: cleanText(message, 1200),
      context: cleanText(context, 1000)
    })
    .catch(() => {});
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

function getGraphEntryIdSet() {
  const linkedEntryIds = G_PAGE.sentence.getIndex().linkedEntryIds;
  if (linkedEntryIds instanceof Set) {
    return linkedEntryIds;
  }
  return new Set();
}

function getVisibleTreeEntries() {
  const { categories } = buildTreeModel();
  const visible = [];
  const seen = new Set();
  categories.forEach((category) => {
    category.groups.forEach((group) => {
      group.entries.forEach((entry) => {
        if (seen.has(entry.id)) {
          return;
        }
        seen.add(entry.id);
        visible.push(entry);
      });
    });
  });
  return visible;
}

function clearEntrySelections() {
  G_APP.s.selectedEntryIds = [];
  G_APP.s.lastSelectedEntryId = null;
}

function setSingleEntrySelection(entryId) {
  G_APP.s.selectedEntryIds = entryId ? [entryId] : [];
  G_APP.s.lastSelectedEntryId = entryId || null;
}

function toggleEntrySelection(entryId) {
  if (!entryId) {
    return;
  }
  const selected = new Set(G_APP.s.selectedEntryIds);
  if (selected.has(entryId)) {
    selected.delete(entryId);
  } else {
    selected.add(entryId);
  }
  G_APP.s.selectedEntryIds = [...selected];
  G_APP.s.lastSelectedEntryId = entryId;
}

function selectEntryRange(targetEntryId) {
  const visible = getVisibleTreeEntries();
  if (visible.length === 0 || !targetEntryId) {
    return;
  }

  const anchorId = G_APP.s.lastSelectedEntryId || G_APP.s.selectedEntryId || targetEntryId;
  const fromIndex = visible.findIndex((entry) => entry.id === anchorId);
  const toIndex = visible.findIndex((entry) => entry.id === targetEntryId);
  if (fromIndex < 0 || toIndex < 0) {
    setSingleEntrySelection(targetEntryId);
    return;
  }

  const [start, end] = fromIndex < toIndex ? [fromIndex, toIndex] : [toIndex, fromIndex];
  G_APP.s.selectedEntryIds = visible.slice(start, end + 1).map((entry) => entry.id);
  G_APP.s.lastSelectedEntryId = targetEntryId;
}

function getSelectedEntries() {
  if (!Array.isArray(G_APP.s.selectedEntryIds) || G_APP.s.selectedEntryIds.length === 0) {
    return [];
  }
  const selectedSet = new Set(G_APP.s.selectedEntryIds);
  return G_APP.s.entries.filter((entry) => selectedSet.has(entry.id));
}

function updateHistoryRestoreOptions() {
  if (!(G_DOM.historyRestoreSelect instanceof HTMLSelectElement)) {
    return;
  }

  G_DOM.historyRestoreSelect.innerHTML = "";
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = `Restore checkpoint (${G_APP.s.history.length})`;
  G_DOM.historyRestoreSelect.appendChild(placeholder);

  G_APP.s.history.forEach((checkpoint) => {
    const option = document.createElement("option");
    option.value = checkpoint.id;
    option.textContent = `${new Date(checkpoint.createdAt).toLocaleString()} - ${checkpoint.reason || "snapshot"}`;
    G_DOM.historyRestoreSelect.appendChild(option);
  });
}

function buildCheckpointDigest(payload) {
  return JSON.stringify({
    labels: payload.labels,
    entries: payload.entries.map((entry) => ({
      word: entry.word,
      definition: entry.definition,
      labels: entry.labels,
      favorite: Boolean(entry.favorite),
      archivedAt: entry.archivedAt || null,
      mode: normalizeEntryMode(entry.mode),
      language: normalizeEntryLanguage(entry.language || ""),
      usageCount: Math.max(0, Math.floor(Number(entry.usageCount) || 0))
    })),
    sentenceGraph: payload.sentenceGraph
  });
}

function buildHistoryCheckpoint(reason = "checkpoint") {
  return {
    id: window.crypto.randomUUID(),
    reason: cleanText(reason, 80) || "checkpoint",
    createdAt: nowIso(),
    labels: [...G_APP.s.labels],
    entries: G_APP.s.entries.map((entry) => ({
      id: entry.id,
      word: entry.word,
      definition: entry.definition,
      labels: [...entry.labels],
      favorite: Boolean(entry.favorite),
      archivedAt: entry.archivedAt || null,
      mode: normalizeEntryMode(entry.mode),
      language: normalizeEntryLanguage(entry.language || ""),
      usageCount: Math.max(0, Math.floor(Number(entry.usageCount) || 0)),
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt
    })),
    sentenceGraph: {
      nodes: G_APP.s.sentenceGraph.nodes.map((node) => ({ ...node })),
      links: G_APP.s.sentenceGraph.links.map((link) => ({ ...link }))
    }
  };
}

function ensureCheckpoint(reason = "autosave") {
  const checkpoint = buildHistoryCheckpoint(reason);
  const digest = buildCheckpointDigest(checkpoint);
  if (digest === G_RT.lastHistoryDigest) {
    return;
  }
  G_RT.lastHistoryDigest = digest;
  G_APP.s.history = [checkpoint, ...G_APP.s.history].slice(0, HISTORY_MAX);
  updateHistoryRestoreOptions();
}

function restoreCheckpointById(checkpointId) {
  const id = cleanText(checkpointId, MAX.WORD);
  if (!id) {
    return false;
  }
  const checkpoint = G_APP.s.history.find((item) => item.id === id);
  if (!checkpoint) {
    return false;
  }

  G_APP.st.setLabels(normalizeLabelArray(checkpoint.labels));
  G_APP.st.setEntries(
    (Array.isArray(checkpoint.entries) ? checkpoint.entries : []).map(normalizeLoadedEntry).filter(Boolean)
  );
  sortEntries();
  G_APP.st.setGraph(normalizeLoadedSentenceGraph(checkpoint.sentenceGraph));
  G_APP.s.selectedEntryId = null;
  G_APP.s.selectedGraphNodeId = null;
  clearEntrySelections();
  clearPendingLink();
  G_PAGE.tree.reqRender();
  G_PAGE.sentence.reqRender();
  setSentenceStatus(`Restored checkpoint: ${checkpoint.reason}`);
  scheduleAutosave();
  return true;
}

function parseCsvLine(line) {
  const values = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"' && line[i + 1] === '"') {
      current += '"';
      i += 1;
      continue;
    }
    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
      continue;
    }
    current += char;
  }
  values.push(current);
  return values.map((value) => value.trim());
}

function parseCsvEntries(text) {
  const lines = String(text || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length === 0) {
    return [];
  }

  const header = parseCsvLine(lines[0]).map((value) => value.toLowerCase());
  const wordIndex = header.indexOf("word");
  const definitionIndex = header.indexOf("definition");
  const labelsIndex = header.indexOf("labels");
  const modeIndex = header.indexOf("mode");
  const languageIndex = header.indexOf("language");
  const usageCountIndex = header.indexOf("usagecount");
  const startIndex = wordIndex >= 0 ? 1 : 0;

  const entries = [];
  for (let i = startIndex; i < lines.length; i += 1) {
    const columns = parseCsvLine(lines[i]);
    const word = cleanText(columns[wordIndex >= 0 ? wordIndex : 0], MAX.WORD);
    const definition = cleanText(columns[definitionIndex >= 0 ? definitionIndex : 1], MAX.DEFINITION);
    const labels = parseLabels((columns[labelsIndex >= 0 ? labelsIndex : 2] || "").replace(/\|/g, ","));
    const mode = normalizeEntryMode(columns[modeIndex >= 0 ? modeIndex : -1] || "");
    const language = normalizeEntryLanguage(columns[languageIndex >= 0 ? languageIndex : -1] || "");
    const usageCount = Math.max(0, Math.floor(Number(columns[usageCountIndex >= 0 ? usageCountIndex : -1]) || 0));
    if (!word || !definition) {
      continue;
    }
    entries.push({
      id: window.crypto.randomUUID(),
      word,
      definition,
      labels,
      mode,
      language,
      usageCount,
      favorite: false,
      archivedAt: null,
      createdAt: nowIso(),
      updatedAt: nowIso()
    });
  }
  return entries;
}

function parseBulkImportEntries(text) {
  return String(text || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const splitter = line.includes(" - ")
        ? " - "
        : line.includes("\t")
          ? "\t"
          : line.includes(":")
            ? ":"
            : line.includes(",")
              ? ","
              : "";
      if (!splitter) {
        return null;
      }
      const [rawWord, ...rest] = line.split(splitter);
      const word = cleanText(rawWord, MAX.WORD);
      const definition = cleanText(rest.join(splitter), MAX.DEFINITION);
      if (!word || !definition) {
        return null;
      }
      return {
        id: window.crypto.randomUUID(),
        word,
        definition,
        labels: inferLabelsFromDefinition(definition),
        mode: "definition",
        language: "",
        usageCount: 0,
        favorite: false,
        archivedAt: null,
        createdAt: nowIso(),
        updatedAt: nowIso()
      };
    })
    .filter(Boolean);
}

function parseImportedEntries(text) {
  const raw = String(text || "").trim();
  if (!raw) {
    return [];
  }

  if (raw[0] === "{" || raw[0] === "[") {
    try {
      const parsed = JSON.parse(raw);
      const sourceEntries = Array.isArray(parsed) ? parsed : Array.isArray(parsed.entries) ? parsed.entries : [];
      return sourceEntries.map((entry) => normalizeLoadedEntry(entry)).filter(Boolean);
    } catch {
      return [];
    }
  }

  if (raw.includes(",") && /\bword\b/i.test(raw.split(/\r?\n/)[0])) {
    return parseCsvEntries(raw);
  }

  const bulkEntries = parseBulkImportEntries(raw);
  if (bulkEntries.length > 0) {
    return bulkEntries;
  }
  return parseSmartPasteEntries(raw);
}

function parseSmartPasteEntries(text) {
  const cleaned = String(text || "")
    .replace(/\r/g, "\n")
    .replace(/\n{2,}/g, "\n")
    .trim();
  if (!cleaned) {
    return [];
  }

  const chunks = cleaned
    .split(/\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const entries = [];
  chunks.forEach((line) => {
    const normalized = line.replace(/^\d+[).\s-]+/, "");
    const match = normalized.match(/^([A-Za-z][A-Za-z'\- ]{1,40})\s+[—\-:]\s+(.{6,})$/);
    if (!match) {
      return;
    }
    const word = cleanText(match[1], MAX.WORD);
    const definition = cleanText(match[2], MAX.DEFINITION);
    if (!word || !definition) {
      return;
    }
    entries.push({
      id: window.crypto.randomUUID(),
      word,
      definition,
      labels: inferLabelsFromDefinition(definition),
      mode: "definition",
      language: "",
      usageCount: 0,
      favorite: false,
      archivedAt: null,
      createdAt: nowIso(),
      updatedAt: nowIso()
    });
  });
  return entries;
}

async function importEntriesFromText(rawText, mergeMode = "skip", options = {}) {
  const { clearInputAfter = false } = options;
  const imported = parseImportedEntries(rawText);
  if (imported.length === 0) {
    setStatus("No valid entries found for import.", true);
    return false;
  }

  const result = await applyImportedEntries(imported, mergeMode);
  const summary = `Import complete: +${result.added} added, ${result.updated} updated, ${result.skipped} skipped.`;
  setStatus(summary);
  setHelperText(summary);
  (clearInputAfter) && (G_DOM.bulkImportInput.value = "");
  return true;
}

async function applyImportedEntries(importedEntries, mergeMode = "skip") {
  const entries = Array.isArray(importedEntries) ? importedEntries : [];
  if (entries.length === 0) {
    return { added: 0, updated: 0, skipped: 0 };
  }

  const mode = cleanText(mergeMode, 20).toLowerCase();
  let added = 0;
  let updated = 0;
  let skipped = 0;

  await applyInChunks(entries, 250, async (batch) => {
    batch.forEach((incoming) => {
      const duplicate = getDuplicateEntry(incoming.word);
      if (!duplicate) {
        ensureLabelsExist(incoming.labels);
        G_APP.st.addEntry({
          ...incoming,
          id: cleanText(incoming.id, MAX.WORD) || window.crypto.randomUUID(),
          favorite: Boolean(incoming.favorite),
          archivedAt: incoming.archivedAt || null,
          mode: normalizeEntryMode(incoming.mode),
          language: normalizeEntryLanguage(incoming.language || ""),
          usageCount: Math.max(0, Math.floor(Number(incoming.usageCount) || 0)),
          createdAt: incoming.createdAt || nowIso(),
          updatedAt: nowIso()
        });
        added += 1;
        return;
      }

      if (mode === "replace") {
        ensureLabelsExist(incoming.labels);
        G_APP.st.updateEntryById(duplicate.id, () => ({
          ...duplicate,
          definition: incoming.definition,
          labels: normalizeLabelArray(incoming.labels),
          mode: normalizeEntryMode(incoming.mode || duplicate.mode),
          language: normalizeEntryLanguage(incoming.language || duplicate.language || ""),
          usageCount: Math.max(0, Math.floor(Number(incoming.usageCount) || Number(duplicate.usageCount) || 0)),
          updatedAt: nowIso()
        }));
        updated += 1;
        return;
      }

      if (mode === "add") {
        const existingWord = cleanText(duplicate.word, MAX.WORD);
        const incomingWord = cleanText(incoming.word, MAX.WORD);
        if (normalizeWordLower(existingWord) === normalizeWordLower(incomingWord) && existingWord !== incomingWord) {
          skipped += 1;
          return;
        }
        ensureLabelsExist(incoming.labels);
        G_APP.st.addEntry({
          ...incoming,
          id: window.crypto.randomUUID(),
          favorite: Boolean(incoming.favorite),
          archivedAt: incoming.archivedAt || null,
          mode: normalizeEntryMode(incoming.mode),
          language: normalizeEntryLanguage(incoming.language || ""),
          usageCount: Math.max(0, Math.floor(Number(incoming.usageCount) || 0)),
          createdAt: nowIso(),
          updatedAt: nowIso()
        });
        added += 1;
        return;
      }

      skipped += 1;
    });
  });

  sortEntries();
  G_PAGE.tree.reqRender();
  G_PAGE.sentence.reqRender();
  scheduleAutosave();
  return { added, updated, skipped };
}

function toCsvSafe(value) {
  const text = String(value || "");
  if (text.includes(",") || text.includes('"') || text.includes("\n")) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function exportEntriesAsCsv() {
  const header = "word,definition,labels,mode,language,usageCount";
  const rows = G_APP.s.entries.map((entry) =>
    [
      toCsvSafe(entry.word),
      toCsvSafe(entry.definition),
      toCsvSafe(entry.labels.join("|")),
      toCsvSafe(normalizeEntryMode(entry.mode)),
      toCsvSafe(normalizeEntryLanguage(entry.language || "")),
      toCsvSafe(String(Math.max(0, Math.floor(Number(entry.usageCount) || 0))))
    ].join(",")
  );
  return [header, ...rows].join("\n");
}

function triggerDownload(content, fileName, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

function exportCurrentData(format) {
  const normalized = cleanText(format, 20).toLowerCase();
  if (normalized === "csv") {
    triggerDownload(exportEntriesAsCsv(), `dictionary-${new Date().toISOString().slice(0, 10)}.csv`, "text/csv");
    return;
  }
  triggerDownload(
    JSON.stringify(buildSnapshot(), null, 2),
    `dictionary-${new Date().toISOString().slice(0, 10)}.json`,
    "application/json"
  );
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

function setStatus(message, isError = false) {
  G_DOM.saveStatus.textContent = message;
  G_DOM.saveStatus.classList.toggle("error", isError);
  const nextKey = `${isError ? "error" : "info"}:${message}`;
  (nextKey !== G_RT.lastStatusLog) && (G_RT.lastStatusLog = nextKey, pushRuntimeLog(isError ? "error" : "info", "status", message, "saveStatus"));
  (isError) && (recordDiagnosticError("status_error", message, "setStatus"));
}

function formatSaved(timestamp) {
  if (!timestamp) {
    return "Ready";
  }
  return `Saved ${new Date(timestamp).toLocaleString()}`;
}

function setHelperText(message) {
  G_DOM.helperText.textContent = message;
}

function normalizeExplorerLayoutMode(mode) {
  if (mode === EXPLORER_LAYOUT_COMPACT || mode === EXPLORER_LAYOUT_MAXIMIZED) {
    return mode;
  }
  return EXPLORER_LAYOUT_NORMAL;
}

function syncExplorerLayoutControls() {
  const compactActive = G_APP.s.explorerLayoutMode === EXPLORER_LAYOUT_COMPACT;
  const focusActive = G_APP.s.explorerLayoutMode === EXPLORER_LAYOUT_MAXIMIZED;
  (G_DOM.explorerCompactAction instanceof HTMLElement) && (G_DOM.explorerCompactAction.classList.toggle("active", compactActive), G_DOM.explorerCompactAction.setAttribute("aria-pressed", compactActive ? "true" : "false"));
  (G_DOM.explorerFocusAction instanceof HTMLElement) && (G_DOM.explorerFocusAction.classList.toggle("active", focusActive), G_DOM.explorerFocusAction.setAttribute("aria-pressed", focusActive ? "true" : "false"));
}

function setExplorerLayoutMode(mode, options = {}) {
  const { announce = true } = options;
  const normalized = normalizeExplorerLayoutMode(mode);
  G_APP.s.explorerLayoutMode = normalized;
  (G_DOM.appRoot instanceof HTMLElement) && (G_DOM.appRoot.classList.toggle("explorer-compact", normalized === EXPLORER_LAYOUT_COMPACT), G_DOM.appRoot.classList.toggle("explorer-maximized", normalized === EXPLORER_LAYOUT_MAXIMIZED));
  syncExplorerLayoutControls();
  if (!announce) {
    return;
  }
  if (normalized === EXPLORER_LAYOUT_MAXIMIZED) {
    setStatus("Explorer focused to full width.");
    return;
  }
  if (normalized === EXPLORER_LAYOUT_COMPACT) {
    setStatus("Explorer switched to compact mode.");
    return;
  }
  setStatus("Explorer restored to standard layout.");
}

function isElementVisibleForInteraction(element) {
  if (!(element instanceof HTMLElement)) {
    return false;
  }
  if (element.classList.contains("hidden")) {
    return false;
  }
  const style = window.getComputedStyle(element);
  return style.display !== "none" && style.visibility !== "hidden";
}

function resolvePreferredEntryLabel(providedLabel = "") {
  const explicit = normalizeLabel(providedLabel);
  if (explicit) {
    return explicit;
  }
  const selectedFolder = normalizeLabel(G_APP.s.selectedTreeLabel);
  if (selectedFolder) {
    return selectedFolder;
  }
  if (G_APP.s.treeLabelFilter !== LABEL_FILTER_ALL && G_APP.s.treeLabelFilter !== LABEL_FILTER_UNLABELED) {
    return normalizeLabel(G_APP.s.treeLabelFilter);
  }
  return "";
}

function setTreeFolderSelection(groupKey, label = "", options = {}) {
  const { announce = true } = options;
  G_APP.s.selectedTreeGroupKey = cleanText(groupKey, 160);
  G_APP.s.selectedTreeLabel = normalizeLabel(label);
  (!G_APP.s.selectedEntryId && G_APP.s.selectedTreeLabel && G_DOM.labelsInput instanceof HTMLInputElement) && (G_DOM.labelsInput.value = G_APP.s.selectedTreeLabel);
  if (!announce) {
    return;
  }
  if (G_APP.s.selectedTreeLabel) {
    setStatus(`Folder selected: ${G_APP.s.selectedTreeLabel}`);
    return;
  }
  setStatus("Folder selected.");
}

function isAuthGateVisible() {
  return !G_DOM.authGate.classList.contains("hidden");
}

function setAuthGateVisible(visible) {
  G_DOM.authGate.classList.toggle("hidden", !visible);
  G_DOM.appRoot.classList.toggle("hidden", visible);
  document.body.classList.toggle("auth-active", visible);
  document.body.classList.toggle("app-active", !visible);
}

function setAuthHint(message, isError = false) {
  G_DOM.authHint.textContent = message;
  G_DOM.authHint.classList.toggle("error", isError);
  pushRuntimeLog(isError ? "warn" : "info", "auth", message, "authHint");
}

function setAuthMode(mode) {
  G_RT.authMode = mode === AUTH_MODE_LOGIN ? AUTH_MODE_LOGIN : AUTH_MODE_CREATE;
  if (G_RT.authMode === AUTH_MODE_CREATE) {
    G_DOM.authTitle.textContent = "Create Account";
    G_DOM.authSubtitle.textContent = "Create your first local account to unlock your dictionary.";
    setAuthHint(getAuthSubmitHint());
    return;
  }

  G_DOM.authTitle.textContent = "Login";
  G_DOM.authSubtitle.textContent = G_RT.authStatus.quickLoginEnabled
    ? "Enter your username and password to open your dictionary. Quick login enabled for this build: admin/admin, demo/demo, root/root, user/user, guest/guest."
    : "Enter your username and password to open your dictionary.";
  setAuthHint(getAuthSubmitHint());
}

function getAuthCredentials() {
  return {
    username: cleanText(G_DOM.authUsernameInput.value, 40),
    password: String(G_DOM.authPasswordInput.value || "").slice(0, 120)
  };
}

function clampNumber(value, min, max) {
  if (!Number.isFinite(value)) {
    return min;
  }
  return Math.max(min, Math.min(max, value));
}

function normGraphCoord(value, max, nodeSize) {
  return clampNumber(Number(value), 8, max - nodeSize - 8);
}

function getNormalizedUiPreferences(input) {
  try {
    return normalizeUiPreferences(input);
  } catch {
    return createDefaultUiPreferences();
  }
}

function isSystemReducedMotionEnabled() {
  return Boolean(G_RT.reduceMotionMediaQuery && G_RT.reduceMotionMediaQuery.matches);
}

function isMotionReduced() {
  return Boolean(G_UNI.ui.prefs?.reduceMotion) || isSystemReducedMotionEnabled();
}

function applyUiTheme(theme) {
  const normalizedTheme = normalizeUiTheme(theme);
  document.documentElement.setAttribute("data-theme", normalizedTheme);
  (document.body) && (document.body.setAttribute("data-theme", normalizedTheme));
  document.documentElement.style.colorScheme = normalizedTheme === "futuristic" ? "dark" : "light";
  return normalizedTheme;
}

function applyMotionPreference(reduceMotion) {
  G_UNI.ui.prefs = getNormalizedUiPreferences({
    ...G_UNI.ui.prefs,
    reduceMotion: Boolean(reduceMotion)
  });

  const reduced = isMotionReduced();
  document.body.classList.toggle("motion-reduced", reduced);
  document.body.classList.toggle("motion-ready", !reduced);
  if (reduced) {
    document.documentElement.style.setProperty("--mx", "0.5");
    document.documentElement.style.setProperty("--my", "0.5");
    document.querySelectorAll(".authCard").forEach((target) => {
      (target instanceof HTMLElement) && (target.style.removeProperty("transform"));
    });
  }
  return reduced;
}

function syncUiSettingsControls() {
  const theme = normalizeUiTheme(G_UNI.ui.prefs?.theme);
  (G_DOM.uiThemeEnterpriseInput instanceof HTMLInputElement) && (G_DOM.uiThemeEnterpriseInput.checked = theme === "enterprise");
  (G_DOM.uiThemeFuturisticInput instanceof HTMLInputElement) && (G_DOM.uiThemeFuturisticInput.checked = theme === "futuristic");
  (G_DOM.uiThemeMonochromeInput instanceof HTMLInputElement) && (G_DOM.uiThemeMonochromeInput.checked = theme === "monochrome");
  (G_DOM.uiReduceMotionInput instanceof HTMLInputElement) && (G_DOM.uiReduceMotionInput.checked = Boolean(G_UNI.ui.prefs?.reduceMotion));
}

function applyUiPreferences(input) {
  G_UNI.ui.prefs = getNormalizedUiPreferences(input);
  G_UNI.ui.prefs.theme = applyUiTheme(G_UNI.ui.prefs.theme);
  applyMotionPreference(G_UNI.ui.prefs.reduceMotion);
  G_APP.s.uiPreferences = G_UNI.ui.prefs;
  syncUiSettingsControls();
}

async function saveUiPreferencesNow() {
  if (!window.dictionaryAPI?.saveUiPreferences) {
    return G_UNI.ui.prefs;
  }
  const payload = getNormalizedUiPreferences(G_UNI.ui.prefs);
  const saved = await window.dictionaryAPI.saveUiPreferences(payload);
  const normalizedSaved = getNormalizedUiPreferences(saved);
  applyUiPreferences(normalizedSaved);
  return normalizedSaved;
}

function clearUiSettingsSaveTimer(flush = false) {
  (G_RT.uiSettingsSaveTimer) && (window.clearTimeout(G_RT.uiSettingsSaveTimer), G_RT.uiSettingsSaveTimer = 0);
  if (flush) {
    saveUiPreferencesNow().catch((error) => {
      recordDiagnosticError("ui_preferences_save", String(error?.message || error), "saveUiPreferencesNow");
    });
  }
}

function scheduleUiPreferencesSave() {
  clearUiSettingsSaveTimer(false);
  G_RT.uiSettingsSaveTimer = window.setTimeout(() => {
    G_RT.uiSettingsSaveTimer = 0;
    saveUiPreferencesNow().catch((error) => {
      recordDiagnosticError("ui_preferences_save", String(error?.message || error), "saveUiPreferencesNow");
    });
  }, UI_PREFERENCES_SAVE_DELAY_MS);
}

function updateUiThemePreference(theme, options = {}) {
  const normalizedTheme = normalizeUiTheme(theme);
  const persist = options.persist !== false;
  applyUiPreferences({
    ...G_UNI.ui.prefs,
    theme: normalizedTheme
  });
  (persist) && (scheduleUiPreferencesSave());
}

function updateReduceMotionPreference(reduceMotion, options = {}) {
  const persist = options.persist !== false;
  applyUiPreferences({
    ...G_UNI.ui.prefs,
    reduceMotion: Boolean(reduceMotion)
  });
  (persist) && (scheduleUiPreferencesSave());
}

async function loadUiPreferencesFromDisk() {
  if (!window.dictionaryAPI?.loadUiPreferences) {
    applyUiPreferences(createDefaultUiPreferences());
    return G_UNI.ui.prefs;
  }
  try {
    const loaded = await window.dictionaryAPI.loadUiPreferences();
    applyUiPreferences(loaded);
  } catch (error) {
    applyUiPreferences(createDefaultUiPreferences());
    recordDiagnosticError("ui_preferences_load", String(error?.message || error), "loadUiPreferencesFromDisk");
  }
  return G_UNI.ui.prefs;
}

function isUiSettingsPopoverOpen() {
  return G_DOM.uiSettingsPopover instanceof HTMLElement && !G_DOM.uiSettingsPopover.classList.contains("hidden");
}

function getUiSettingsFocusableElements() {
  if (!(G_DOM.uiSettingsPopover instanceof HTMLElement)) {
    return [];
  }
  return [...G_DOM.uiSettingsPopover.querySelectorAll(UI_SETTINGS_FOCUSABLE_SELECTOR)].filter((item) => {
    if (!(item instanceof HTMLElement)) {
      return false;
    }
    return !item.hasAttribute("disabled");
  });
}

function openUiSettingsPopover() {
  if (!(G_DOM.uiSettingsPopover instanceof HTMLElement) || !(G_DOM.uiSettingsTrigger instanceof HTMLElement)) {
    return;
  }
  G_RT.uiSettingsRestoreFocusElement =
    document.activeElement instanceof HTMLElement ? document.activeElement : G_DOM.uiSettingsTrigger;
  G_DOM.uiSettingsPopover.classList.remove("hidden");
  G_DOM.uiSettingsTrigger.setAttribute("aria-expanded", "true");
  syncUiSettingsControls();
  const focusables = getUiSettingsFocusableElements();
  const nextFocus = focusables[0];
  if (nextFocus instanceof HTMLElement) {
    nextFocus.focus();
  } else {
    G_DOM.uiSettingsPopover.focus();
  }
}

function closeUiSettingsPopover({ restoreFocus = true } = {}) {
  if (!(G_DOM.uiSettingsPopover instanceof HTMLElement) || !(G_DOM.uiSettingsTrigger instanceof HTMLElement)) {
    return;
  }
  G_DOM.uiSettingsPopover.classList.add("hidden");
  G_DOM.uiSettingsTrigger.setAttribute("aria-expanded", "false");
  if (restoreFocus) {
    const fallback = G_DOM.uiSettingsTrigger;
    const target = G_RT.uiSettingsRestoreFocusElement instanceof HTMLElement ? G_RT.uiSettingsRestoreFocusElement : fallback;
    target.focus();
  }
}

function toggleUiSettingsPopover() {
  if (isUiSettingsPopoverOpen()) {
    closeUiSettingsPopover();
    return;
  }
  openUiSettingsPopover();
}

function initializeUiMotion() {
  if (G_RT.uiMotionInitialized) {
    applyMotionPreference(G_UNI.ui.prefs?.reduceMotion);
    return;
  }
  G_RT.uiMotionInitialized = true;

  if (window.matchMedia) {
    G_RT.reduceMotionMediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    G_RT.reduceMotionMediaQueryListener = () => {
      applyMotionPreference(G_UNI.ui.prefs?.reduceMotion);
    };
    if (typeof G_RT.reduceMotionMediaQuery.addEventListener === "function") {
      G_RT.reduceMotionMediaQuery.addEventListener("change", G_RT.reduceMotionMediaQueryListener);
    } else {
      (typeof G_RT.reduceMotionMediaQuery.addListener === "function") &&
        (G_RT.reduceMotionMediaQuery.addListener(G_RT.reduceMotionMediaQueryListener));
    }
  }

  applyMotionPreference(G_UNI.ui.prefs?.reduceMotion);

  const motionTargets = [...document.querySelectorAll(".authCard")];
  motionTargets.forEach((target) => {
    if (!(target instanceof HTMLElement)) {
      return;
    }
    const onMove = (event) => {
      if (!(event instanceof PointerEvent) || event.pointerType === "touch") {
        return;
      }
      if (document.body.classList.contains("motion-reduced")) {
        target.style.removeProperty("transform");
        return;
      }
      const rect = target.getBoundingClientRect();
      if (!rect.width || !rect.height) {
        return;
      }
      const dx = (event.clientX - rect.left) / rect.width - 0.5;
      const dy = (event.clientY - rect.top) / rect.height - 0.5;
      const rotateX = clampNumber(-dy * 2.4, -2.4, 2.4);
      const rotateY = clampNumber(dx * 2.8, -2.8, 2.8);
      target.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const onLeave = () => {
      target.style.removeProperty("transform");
    };

    target.addEventListener("pointermove", onMove, { passive: true });
    target.addEventListener("pointerleave", onLeave);
  });

  let pointerFrame = 0;
  let nextX = 0.5;
  let nextY = 0.5;
  const onPointer = (event) => {
    if (document.body.classList.contains("motion-reduced") || document.body.classList.contains("app-active")) {
      return;
    }
    nextX = clampNumber(event.clientX / Math.max(1, window.innerWidth), 0, 1);
    nextY = clampNumber(event.clientY / Math.max(1, window.innerHeight), 0, 1);
    if (pointerFrame) {
      return;
    }
    pointerFrame = window.requestAnimationFrame(() => {
      pointerFrame = 0;
      const root = document.documentElement;
      root.style.setProperty("--mx", String(nextX));
      root.style.setProperty("--my", String(nextY));
    });
  };
  window.addEventListener("pointermove", onPointer, { passive: true });
}

function setSentenceStatus(message) {
  G_DOM.sentenceStatus.textContent = message;
  (message !== G_RT.lastSentenceStatusLog) && (G_RT.lastSentenceStatusLog = message, pushRuntimeLog("info", "graph", message, "sentenceStatus"));
}

function setEntryWarnings(messages = []) {
  if (!(G_DOM.entryWarnings instanceof HTMLElement)) {
    return;
  }
  const warnings = Array.isArray(messages) ? messages.filter(Boolean) : [];
  if (warnings.length === 0) {
    G_DOM.entryWarnings.textContent = "No warnings.";
    G_DOM.entryWarnings.classList.remove("error");
    return;
  }
  G_DOM.entryWarnings.textContent = warnings.join(" | ");
  G_DOM.entryWarnings.classList.add("error");
}

function recordDiagnosticError(code, message, context = "") {
  G_APP.s.diagnostics = mergeDiagnostics(G_APP.s.diagnostics, {
    errors: [
      {
        at: nowIso(),
        code: cleanText(code, 80) || "renderer_error",
        message: cleanText(message, 500),
        context: cleanText(context, 400)
      }
    ],
    perf: []
  });
  renderDiagnosticsSummary();
  pushRuntimeLog("error", "renderer", `${code}: ${message}`, context);
  scheduleDiagnosticsFlush();
}

function recordDiagnosticPerf(key, ms) {
  G_APP.s.diagnostics = mergeDiagnostics(G_APP.s.diagnostics, {
    errors: [],
    perf: [
      {
        at: nowIso(),
        key: cleanText(key, 80) || "perf",
        ms: Number.isFinite(ms) ? Math.max(0, ms) : 0
      }
    ]
  });
  renderDiagnosticsSummary();
  (G_APP.s.diagnostics.perf || []).length >= 50 && (scheduleDiagnosticsFlush(300));
}

function renderDiagnosticsSummary() {
  if (!(G_DOM.diagnosticsSummary instanceof HTMLElement)) {
    return;
  }
  const errors = Array.isArray(G_APP.s.diagnostics.errors) ? G_APP.s.diagnostics.errors.length : 0;
  const perf = Array.isArray(G_APP.s.diagnostics.perf) ? G_APP.s.diagnostics.perf.length : 0;
  G_DOM.diagnosticsSummary.textContent = `Diagnostics: ${errors} error(s), ${perf} perf sample(s). Local only.`;
  renderDiagnosticsPanel();
}

function renderDiagnosticsPanel() {
  if (
    !(G_DOM.diagnosticsErrorsList instanceof HTMLElement) ||
    !(G_DOM.diagnosticsPerfList instanceof HTMLElement)
  ) {
    return;
  }
  const latestErrors = (Array.isArray(G_APP.s.diagnostics.errors) ? G_APP.s.diagnostics.errors : []).slice(-8).reverse();
  const latestPerf = (Array.isArray(G_APP.s.diagnostics.perf) ? G_APP.s.diagnostics.perf : []).slice(-8).reverse();
  G_DOM.diagnosticsErrorsList.innerHTML = "";
  G_DOM.diagnosticsPerfList.innerHTML = "";

  if (latestErrors.length === 0) {
    const emptyError = document.createElement("li");
    emptyError.textContent = "No errors recorded.";
    G_DOM.diagnosticsErrorsList.appendChild(emptyError);
  } else {
    latestErrors.forEach((item) => {
      const row = document.createElement("li");
      row.textContent = `${item.code}: ${item.message}`;
      G_DOM.diagnosticsErrorsList.appendChild(row);
    });
  }

  if (latestPerf.length === 0) {
    const emptyPerf = document.createElement("li");
    emptyPerf.textContent = "No timing samples yet.";
    G_DOM.diagnosticsPerfList.appendChild(emptyPerf);
  } else {
    latestPerf.forEach((item) => {
      const row = document.createElement("li");
      row.textContent = `${item.key}: ${Number(item.ms).toFixed(2)}ms`;
      G_DOM.diagnosticsPerfList.appendChild(row);
    });
  }
}

function getEntryUsageScore(entry) {
  const usageCount = Number.isFinite(Number(entry?.usageCount)) ? Number(entry.usageCount) : 0;
  const backlinks = getEntryBacklinkCount(entry?.id || "");
  return usageCount + backlinks * 2;
}

function buildStatisticsModelSync() {
  const entries = G_APP.s.entries;
  const activeEntries = entries.filter((entry) => !entry.archivedAt);
  const archivedEntries = entries.filter((entry) => Boolean(entry.archivedAt));
  const favoriteEntries = entries.filter((entry) => Boolean(entry.favorite));
  const linkedEntryIds = getGraphEntryIdSet();
  const linkedCount = entries.filter((entry) => linkedEntryIds.has(entry.id)).length;

  const modeCounts = {
    definition: 0,
    slang: 0,
    code: 0,
    bytes: 0
  };
  entries.forEach((entry) => {
    const mode = normalizeEntryMode(entry.mode);
    modeCounts[mode] += 1;
  });

  const byUsage = [...activeEntries].sort((left, right) => {
    return getEntryUsageScore(right) - getEntryUsageScore(left) || left.word.localeCompare(right.word);
  });

  const leastUsage = [...activeEntries].sort((left, right) => {
    return getEntryUsageScore(left) - getEntryUsageScore(right) || left.word.localeCompare(right.word);
  });

  const recent = [...entries].sort((left, right) =>
    String(right.updatedAt || "").localeCompare(String(left.updatedAt || ""))
  );

  const labelCounts = {};
  entries.forEach((entry) => {
    const labels = entry.labels.length > 0 ? entry.labels : [UNLABELED_NAME];
    labels.forEach((label) => {
      labelCounts[label] = (labelCounts[label] || 0) + 1;
    });
  });

  const sortedLabels = Object.keys(labelCounts).sort(
    (a, b) => (labelCounts[b] || 0) - (labelCounts[a] || 0) || a.localeCompare(b)
  );

  return {
    overview: {
      totalEntries: entries.length,
      activeEntries: activeEntries.length,
      archivedEntries: archivedEntries.length,
      favorites: favoriteEntries.length,
      linked: linkedCount,
      graphNodes: G_APP.s.sentenceGraph.nodes.length,
      graphLinks: G_APP.s.sentenceGraph.links.length
    },
    mostUsed: byUsage.slice(0, 12).map((entry) => ({ word: entry.word, score: getEntryUsageScore(entry) })),
    leastUsed: leastUsage.slice(0, 12).map((entry) => ({ word: entry.word, score: getEntryUsageScore(entry) })),
    recent: recent.slice(0, 12).map((entry) => ({ word: entry.word, updatedAt: entry.updatedAt })),
    labels: sortedLabels.slice(0, 12).map((label) => ({ label, count: labelCounts[label] || 0 })),
    modes: Object.keys(modeCounts).map((mode) => ({ mode, count: modeCounts[mode] }))
  };
}

function getStatisticsModel() {
  const modelKey = getStatsModelKey();
  if (G_RT.statsWorkerModel && G_RT.statsWorkerModelKey === modelKey) {
    return G_RT.statsWorkerModel;
  }
  if (G_RT.statsCacheModel && G_RT.statsCacheKey === modelKey) {
    return G_RT.statsCacheModel;
  }
  G_RT.statsCacheModel = buildStatisticsModelSync();
  G_RT.statsCacheKey = modelKey;
  return G_RT.statsCacheModel;
}

function renderStatisticsView() {
  if (
    !(G_DOM.statsOverviewList instanceof HTMLElement) ||
    !(G_DOM.statsMostUsedList instanceof HTMLElement) ||
    !(G_DOM.statsLeastUsedList instanceof HTMLElement) ||
    !(G_DOM.statsRecentList instanceof HTMLElement) ||
    !(G_DOM.statsLabelsList instanceof HTMLElement) ||
    !(G_DOM.statsModeList instanceof HTMLElement)
  ) {
    return;
  }

  const model = getStatisticsModel();

  G_DOM.statsOverviewList.innerHTML = "";
  G_DOM.statsOverviewList.appendChild(listItem(`Total entries: ${model.overview.totalEntries || 0}`));
  G_DOM.statsOverviewList.appendChild(listItem(`Active entries: ${model.overview.activeEntries || 0}`));
  G_DOM.statsOverviewList.appendChild(listItem(`Archived entries: ${model.overview.archivedEntries || 0}`));
  G_DOM.statsOverviewList.appendChild(listItem(`Favorites: ${model.overview.favorites || 0}`));
  G_DOM.statsOverviewList.appendChild(listItem(`Linked in graph: ${model.overview.linked || 0}`));
  G_DOM.statsOverviewList.appendChild(
    listItem(`Graph nodes/links: ${model.overview.graphNodes || 0}/${model.overview.graphLinks || 0}`)
  );

  G_DOM.statsMostUsedList.innerHTML = "";
  model.mostUsed.forEach((item) => {
    G_DOM.statsMostUsedList.appendChild(listItem(`${item.word} (${item.score})`));
  });
  (model.mostUsed.length === 0) && (G_DOM.statsMostUsedList.appendChild(listItem("No entries yet.")));

  G_DOM.statsLeastUsedList.innerHTML = "";
  model.leastUsed.forEach((item) => {
    G_DOM.statsLeastUsedList.appendChild(listItem(`${item.word} (${item.score})`));
  });
  (model.leastUsed.length === 0) && (G_DOM.statsLeastUsedList.appendChild(listItem("No entries yet.")));

  G_DOM.statsRecentList.innerHTML = "";
  model.recent.forEach((item) => {
    G_DOM.statsRecentList.appendChild(listItem(`${item.word} (${new Date(item.updatedAt).toLocaleString()})`));
  });
  (model.recent.length === 0) && (G_DOM.statsRecentList.appendChild(listItem("No entries yet.")));

  G_DOM.statsLabelsList.innerHTML = "";
  model.labels.forEach((item) => {
    G_DOM.statsLabelsList.appendChild(listItem(`${item.label}: ${item.count}`));
  });
  (model.labels.length === 0) && (G_DOM.statsLabelsList.appendChild(listItem("No labels yet.")));

  G_DOM.statsModeList.innerHTML = "";
  model.modes.forEach((item) => {
    G_DOM.statsModeList.appendChild(listItem(`${item.mode}: ${item.count}`));
  });
}

function isUniverseVisible() {
  return G_DOM.universeView instanceof HTMLElement && !G_DOM.universeView.classList.contains("hidden");
}

function isSentenceGraphVisible() {
  return G_DOM.sentenceGraphView instanceof HTMLElement && !G_DOM.sentenceGraphView.classList.contains("hidden");
}

function getActiveCanvas() {
  if (
    G_UNI.cfg.renderMode === UNIVERSE_VIEW_MODE_WEBGL &&
    G_DOM.universeCanvasGl instanceof HTMLCanvasElement
  ) {
    return G_DOM.universeCanvasGl;
  }
  return G_DOM.universeCanvas instanceof HTMLCanvasElement ? G_DOM.universeCanvas : null;
}

function syncCanvasVisibility() {
  const showGl = G_UNI.cfg.renderMode === UNIVERSE_VIEW_MODE_WEBGL;
  (G_DOM.universeCanvas instanceof HTMLCanvasElement) && (G_DOM.universeCanvas.classList.toggle("hidden", showGl));
  (G_DOM.universeCanvasGl instanceof HTMLCanvasElement) && (G_DOM.universeCanvasGl.classList.toggle("hidden", !showGl));
  (showGl) && (G_UNI_FX.resetCanvasContext());
}

function setUniverseRenderMode(mode, options = {}) {
  const { allowUnsafe = false, announce = false } = options;
  const targetMode = mode === UNIVERSE_VIEW_MODE_CANVAS ? UNIVERSE_VIEW_MODE_CANVAS : UNIVERSE_VIEW_MODE_WEBGL;
  if (targetMode === UNIVERSE_VIEW_MODE_WEBGL && G_RT.uForceCanvas && !allowUnsafe) {
    if (announce) {
      setStatus("WebGL is disabled due to recent GPU instability. Use 'Try WebGL Renderer' to override.", true);
    }
    G_PAGE.universe.syncControls();
    return false;
  }
  G_UNI.cfg = normalizeConfig({
    ...G_UNI.cfg,
    renderMode: targetMode,
    bookmarks: G_UNI.cfg.bookmarks
  });
  (targetMode === UNIVERSE_VIEW_MODE_WEBGL && allowUnsafe) && (G_RT.uForceCanvas = false);
  G_PAGE.universe.syncControls();
  syncCanvasVisibility();
  ensureUniverseCanvasSize();
  queueCacheSave();
  G_PAGE.universe.reqRender({ force: true });
  announce && (setStatus(
      targetMode === UNIVERSE_VIEW_MODE_WEBGL ? "Universe renderer set to WebGL." : "Universe renderer set to Canvas."
    ));
  return true;
}

function syncControls() {
  (G_DOM.universeFilterInput instanceof HTMLInputElement) && (G_DOM.universeFilterInput.value = G_UNI.view.filter || "");
  (G_DOM.universeMinWordLengthInput instanceof HTMLInputElement) && (G_DOM.universeMinWordLengthInput.value = String(G_UNI.cfg.minWordLength));
  (G_DOM.universeMaxNodesInput instanceof HTMLInputElement) && (G_DOM.universeMaxNodesInput.value = String(G_UNI.cfg.maxNodes));
  (G_DOM.universeMaxEdgesInput instanceof HTMLInputElement) && (G_DOM.universeMaxEdgesInput.value = String(G_UNI.cfg.maxEdges));
  (G_DOM.universeFavoritesOnlyInput instanceof HTMLInputElement) && (G_DOM.universeFavoritesOnlyInput.checked = Boolean(G_UNI.cfg.favoritesOnly));
  (G_DOM.universeLabelFilterInput instanceof HTMLInputElement) && (G_DOM.universeLabelFilterInput.value = G_UNI.cfg.labelFilter || "");
  (G_DOM.universeColorModeSelect instanceof HTMLSelectElement) && (G_DOM.universeColorModeSelect.value = G_UNI.cfg.colorMode);
  (G_DOM.universeRenderModeSelect instanceof HTMLSelectElement) && (G_DOM.universeRenderModeSelect.value = G_UNI.cfg.renderMode);
  PATTERN_UNIVERSE_EDGE_ACTIONS.forEach(([elementKey, modeKey]) => {
    const element = G_DOM[elementKey];
    (element instanceof HTMLElement) && (element.classList.toggle("active", Boolean(G_UNI.cfg.edgeModes?.[modeKey])));
  });
}

function updateUniverseBookmarkSelect() {
  if (!(G_DOM.universeBookmarkSelect instanceof HTMLSelectElement)) {
    return;
  }
  G_DOM.universeBookmarkSelect.innerHTML = "";
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = G_UNI.cfg.bookmarks.length > 0 ? "Saved views" : "No saved views";
  G_DOM.universeBookmarkSelect.appendChild(placeholder);
  G_UNI.cfg.bookmarks.forEach((bookmark) => {
    const option = document.createElement("option");
    option.value = bookmark.id;
    option.textContent = bookmark.name;
    G_DOM.universeBookmarkSelect.appendChild(option);
  });
}

function setPathStatus(text, isError = false) {
  if (!(G_DOM.universePathStatus instanceof HTMLElement)) {
    return;
  }
  G_DOM.universePathStatus.textContent = cleanText(text, 280) || "Path finder ready.";
  G_DOM.universePathStatus.classList.toggle("danger", Boolean(isError));
}

function createUniverseBenchmarkState(lastResult = null) {
  return {
    running: false,
    startedAt: 0,
    durationMs: UNIVERSE_BENCHMARK_DEFAULT_DURATION_MS,
    seed: 0,
    baseCamera: null,
    frameIntervalsMs: [],
    renderTimesMs: [],
    lastResult
  };
}

function getUniverseBenchmarkProgress(nowMs = performance.now()) {
  if (!G_RT.uBench.running) {
    return 0;
  }
  return clampNumber((nowMs - G_RT.uBench.startedAt) / Math.max(1, G_RT.uBench.durationMs), 0, 1);
}

function calculatePercentile(samples, percentile) {
  if (!Array.isArray(samples) || samples.length === 0) {
    return 0;
  }
  const sorted = samples
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value) && value >= 0)
    .sort((left, right) => left - right);
  if (sorted.length === 0) {
    return 0;
  }
  const rank = Math.floor(clampNumber(percentile, 0, 1) * (sorted.length - 1));
  return sorted[rank] || 0;
}

function appendUniverseBenchmarkSample(samples, value) {
  if (!Array.isArray(samples)) {
    return;
  }
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric < 0) {
    return;
  }
  samples.push(numeric);
  (samples.length > UNIVERSE_BENCHMARK_SAMPLE_LIMIT) && (samples.splice(0, samples.length - UNIVERSE_BENCHMARK_SAMPLE_LIMIT));
}

function formatUniverseGpuLabel() {
  if (!G_RT.uGpu || G_RT.uGpu.ok === false) {
    return "GPU ?";
  }
  const mode = cleanText(G_RT.uGpu.effectiveGpuMode, 20) || "auto";
  const angle = cleanText(G_RT.uGpu.effectiveAngleBackend, 24);
  const gl = cleanText(G_RT.uGpu.effectiveGlImplementation, 24);
  if (mode === "off") {
    return "GPU off";
  }
  if (angle && angle !== "n/a" && angle !== "disabled") {
    return `ANGLE ${angle}`;
  }
  if (gl && gl !== "default" && gl !== "disabled") {
    return `GL ${gl}`;
  }
  return `GPU ${mode}`;
}

function isGpuStatusDegraded(status) {
  const source = status && typeof status === "object" ? status : {};
  const mode = cleanText(source.effectiveGpuMode, 20);
  if (mode === "off") {
    return true;
  }
  const feature = source.featureStatus && typeof source.featureStatus === "object" ? source.featureStatus : {};
  const compositing = cleanText(String(feature.gpu_compositing || ""), 80).toLowerCase();
  const webgl = cleanText(String(feature.webgl || feature.webgl2 || ""), 80).toLowerCase();
  if (compositing.includes("disabled") || compositing.includes("unavailable")) {
    return true;
  }
  // Rasterization may be intentionally disabled while WebGL compositing remains healthy.
  if (webgl && (webgl.includes("disabled") || webgl.includes("unavailable"))) {
    return true;
  }
  return false;
}

function applyUniverseSafeRenderModeFromGpuStatus(status) {
  if (!isGpuStatusDegraded(status)) {
    return false;
  }
  if (G_UNI.cfg.renderMode === UNIVERSE_VIEW_MODE_CANVAS) {
    G_RT.uForceCanvas = true;
    return false;
  }
  G_UNI.cfg = normalizeConfig({
    ...G_UNI.cfg,
    renderMode: UNIVERSE_VIEW_MODE_CANVAS,
    bookmarks: G_UNI.cfg.bookmarks
  });
  G_RT.uForceCanvas = true;
  syncCanvasVisibility();
  G_PAGE.universe.syncControls();
  clearProjectionCache();
  setStatus("GPU degraded. Universe switched to Canvas mode for stability.");
  queueCacheSave();
  G_PAGE.universe.reqRender({ force: true });
  return true;
}

function renderPerfHud(force = false) {
  if (!(G_DOM.universePerfHud instanceof HTMLElement)) {
    return;
  }
  const now = performance.now();
  if (!force && now - G_RT.uHudAt < UNIVERSE_PERF_HUD_UPDATE_INTERVAL_MS) {
    return;
  }
  G_RT.uHudAt = now;

  const fps = G_RT.uFrameMs > 0 ? 1000 / G_RT.uFrameMs : 0;
  const fpsText = Number.isFinite(fps) && fps > 0 ? fps.toFixed(1) : "--";
  const renderText = G_RT.uPerfMs > 0 ? G_RT.uPerfMs.toFixed(2) : "--";
  let benchmarkText = "";
  if (G_RT.uBench.running) {
    benchmarkText = ` | Bench ${Math.round(getUniverseBenchmarkProgress(now) * 100)}%`;
  } else if (G_RT.uBench.lastResult) {
    benchmarkText = ` | Last ${Number(G_RT.uBench.lastResult.avgFps || 0).toFixed(1)} FPS`;
  }

  G_DOM.universePerfHud.textContent = `FPS: ${fpsText} | Render: ${renderText} ms | ${formatUniverseGpuLabel()}${benchmarkText}`;

  (G_DOM.universeBenchmarkAction instanceof HTMLElement) && (G_DOM.universeBenchmarkAction.classList.toggle("hidden", G_RT.uBench.running));
  (G_DOM.universeBenchmarkStopAction instanceof HTMLElement) && (G_DOM.universeBenchmarkStopAction.classList.toggle("hidden", !G_RT.uBench.running));
}

function updateUniverseFrameMetrics(frameStartedAt, frameMs) {
  if (G_RT.uFrameAt > 0) {
    const frameInterval = frameStartedAt - G_RT.uFrameAt;
    if (frameInterval > 0 && frameInterval < 5000) {
      G_RT.uFrameMs =
        G_RT.uFrameMs === 0 ? frameInterval : G_RT.uFrameMs * 0.86 + frameInterval * 0.14;
      if (G_RT.uBench.running) {
        appendUniverseBenchmarkSample(G_RT.uBench.frameIntervalsMs, frameInterval);
      }
    }
  }
  G_RT.uFrameAt = frameStartedAt;

  G_RT.uPerfMs = G_RT.uPerfMs === 0 ? frameMs : G_RT.uPerfMs * 0.86 + frameMs * 0.14;
  (frameStartedAt - G_RT.uPerfAt >= UNIVERSE_PERF_SAMPLE_INTERVAL_MS) && (G_RT.uPerfAt = frameStartedAt, recordDiagnosticPerf("render_universe_ms", G_RT.uPerfMs));

  if (G_RT.uBench.running) {
    appendUniverseBenchmarkSample(G_RT.uBench.renderTimesMs, frameMs);
    if (getUniverseBenchmarkProgress(frameStartedAt) >= 1) {
      completeUniverseBenchmark("completed");
      return;
    }
    G_PAGE.universe.reqRender({ force: true });
  }

  renderPerfHud();
}

function updateUniverseBenchmarkCamera(progress) {
  if (!G_RT.uBench.running) {
    return;
  }
  const clamped = clampNumber(progress, 0, 1);
  const phase = G_RT.uBench.seed + clamped * Math.PI * 8;
  const zoom = 1.02 + Math.sin(clamped * Math.PI * 6) * 0.32;
  G_UNI.view.zoom = clampNumber(zoom, UNIVERSE_ZOOM_MIN, UNIVERSE_ZOOM_MAX);
  G_UNI.view.panX = clampNumber(Math.cos(phase) * 0.26, -1.6, 1.6);
  G_UNI.view.panY = clampNumber(Math.sin(phase * 0.8) * 0.22, -1.6, 1.6);
  markInteraction(UNIVERSE_INTERACTION_ACTIVE_MS + 140);
  clearProjectionCache();
}

function completeUniverseBenchmark(reason = "completed") {
  if (!G_RT.uBench.running) {
    return G_RT.uBench.lastResult || null;
  }
  const elapsedMs = Math.max(1, performance.now() - G_RT.uBench.startedAt);
  const frameIntervals = G_RT.uBench.frameIntervalsMs.slice();
  const renderTimes = G_RT.uBench.renderTimesMs.slice();
  const totalFrames = renderTimes.length;
  const avgFrameMs =
    frameIntervals.length > 0 ? frameIntervals.reduce((sum, sample) => sum + sample, 0) / frameIntervals.length : 0;
  const avgFps = avgFrameMs > 0 ? 1000 / avgFrameMs : 0;
  const slowFrames = frameIntervals.filter((sample) => sample > 25).length;
  const result = {
    reason: cleanText(reason, 40) || "completed",
    at: nowIso(),
    elapsedMs,
    totalFrames,
    avgFps,
    minFps: frameIntervals.length > 0 ? 1000 / Math.max(...frameIntervals) : 0,
    p95FrameMs: calculatePercentile(frameIntervals, 0.95),
    avgRenderMs: renderTimes.length > 0 ? renderTimes.reduce((sum, sample) => sum + sample, 0) / renderTimes.length : 0,
    p95RenderMs: calculatePercentile(renderTimes, 0.95),
    slowFrames
  };
  const baseCamera = G_RT.uBench.baseCamera;
  G_RT.uBench = createUniverseBenchmarkState(result);
  (baseCamera) && (G_UNI.view.zoom = clampNumber(baseCamera.zoom, UNIVERSE_ZOOM_MIN, UNIVERSE_ZOOM_MAX), G_UNI.view.panX = clampNumber(baseCamera.panX, -1.6, 1.6), G_UNI.view.panY = clampNumber(baseCamera.panY, -1.6, 1.6), clearProjectionCache());
  renderPerfHud(true);

  const summary = `3D benchmark ${result.reason}: avg ${result.avgFps.toFixed(1)} FPS, p95 frame ${result.p95FrameMs.toFixed(2)}ms, slow frames ${result.slowFrames}.`;
  const isErrorReason = result.reason !== "completed" && result.reason !== "stopped";
  setStatus(summary, isErrorReason);
  pushRuntimeLog(
    isErrorReason ? "warn" : "info",
    "benchmark",
    summary,
    cleanText(
      JSON.stringify({
        elapsedMs: result.elapsedMs,
        totalFrames: result.totalFrames,
        avgFps: Number(result.avgFps.toFixed(2)),
        minFps: Number(result.minFps.toFixed(2)),
        avgRenderMs: Number(result.avgRenderMs.toFixed(2)),
        p95RenderMs: Number(result.p95RenderMs.toFixed(2))
      }),
      960
    )
  );
  recordDiagnosticPerf("benchmark_universe_avg_render_ms", result.avgRenderMs);
  recordDiagnosticPerf("benchmark_universe_p95_render_ms", result.p95RenderMs);
  recordDiagnosticPerf("benchmark_universe_p95_frame_ms", result.p95FrameMs);
  G_PAGE.universe.reqRender({ force: true });
  return result;
}

function startUniverseBenchmark(durationMs = UNIVERSE_BENCHMARK_DEFAULT_DURATION_MS) {
  if (G_RT.uBench.running) {
    setStatus("3D benchmark is already running.");
    return false;
  }
  const nodeCount = Array.isArray(G_UNI.graph.nodes) ? G_UNI.graph.nodes.length : 0;
  if (nodeCount < 2) {
    setStatus("Add more words before running the 3D benchmark.", true);
    return false;
  }
  const duration = clampNumber(
    Math.floor(Number(durationMs) || UNIVERSE_BENCHMARK_DEFAULT_DURATION_MS),
    2000,
    UNIVERSE_BENCHMARK_MAX_DURATION_MS
  );
  (G_APP.s.activeView !== VIEW_UNIVERSE) && (setActiveView(VIEW_UNIVERSE));
  G_RT.uBench = {
    running: true,
    startedAt: performance.now(),
    durationMs: duration,
    seed: Math.random() * Math.PI * 2,
    baseCamera: {
      zoom: G_UNI.view.zoom,
      panX: G_UNI.view.panX,
      panY: G_UNI.view.panY
    },
    frameIntervalsMs: [],
    renderTimesMs: [],
    lastResult: G_RT.uBench.lastResult
  };
  G_RT.uFrameAt = 0;
  G_RT.uFrameMs = 0;
  renderPerfHud(true);
  setStatus(`Running 3D benchmark for ${(duration / 1000).toFixed(0)}s...`);
  pushRuntimeLog("info", "benchmark", "3D benchmark started.", `durationMs=${duration};nodes=${nodeCount}`);
  void loadUniverseGpuStatus(false);
  G_PAGE.universe.reqRender({ force: true });
  return true;
}

function stopUniverseBenchmark(reason = "stopped") {
  if (!G_RT.uBench.running) {
    return null;
  }
  return completeUniverseBenchmark(reason);
}

async function loadUniverseGpuStatus(force = false) {
  if (!window.dictionaryAPI?.getGpuStatus) {
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
    const status = await window.dictionaryAPI.getGpuStatus();
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

async function showUniverseGpuStatus(force = true) {
  const status = await loadUniverseGpuStatus(force);
  if (!status) {
    setStatus("GPU status unavailable.", true);
    return;
  }
  const featureStatus = status.featureStatus && typeof status.featureStatus === "object" ? status.featureStatus : {};
  const summary = `${formatUniverseGpuLabel()} | compositing: ${featureStatus.gpu_compositing || "unknown"} | raster: ${featureStatus.gpu_rasterization || "unknown"}`;
  setStatus(summary);
  pushRuntimeLog(
    "info",
    "gpu",
    "GPU status requested.",
    cleanText(
      JSON.stringify({
        mode: status.effectiveGpuMode || "auto",
        angle: status.effectiveAngleBackend || "",
        gl: status.effectiveGlImplementation || "",
        switches: Array.isArray(status.switches) ? status.switches.slice(0, 20) : [],
        compositing: featureStatus.gpu_compositing || "unknown",
        rasterization: featureStatus.gpu_rasterization || "unknown"
      }),
      960
    )
  );
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

function getUniverseTargetDpr() {
  const nativeDpr = Math.max(1, Math.min(UNIVERSE_DPR_MAX, window.devicePixelRatio || 1));
  const nodeCount = Array.isArray(G_UNI.graph.nodes) ? G_UNI.graph.nodes.length : 0;
  const edgeCount = Array.isArray(G_UNI.graph.edges) ? G_UNI.graph.edges.length : 0;

  let cap = nativeDpr;
  (nodeCount > 1400 || edgeCount > 14000) && (cap = Math.min(cap, UNIVERSE_DPR_HEAVY));
  if (G_RT.uBench.running || G_RT.uPerfMs > 11 || nodeCount > 2200 || edgeCount > 22000) {
    cap = Math.min(cap, UNIVERSE_DPR_LOW);
  } else {
    (G_RT.uPerfMs > 8) && (cap = Math.min(cap, UNIVERSE_DPR_SOFT));
  }
  return Math.max(1, cap);
}

function ensureUniverseCanvasSize() {
  const canvas = getActiveCanvas();
  if (!(canvas instanceof HTMLCanvasElement)) {
    return false;
  }
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(1, Math.floor(rect.width));
  const height = Math.max(1, Math.floor(rect.height));
  const dpr = getUniverseTargetDpr();
  const nextPixelWidth = Math.floor(width * dpr);
  const nextPixelHeight = Math.floor(height * dpr);
  const changed =
    G_UNI.canvas.size.width !== width ||
    G_UNI.canvas.size.height !== height ||
    G_UNI.canvas.size.dpr !== dpr ||
    canvas.width !== nextPixelWidth ||
    canvas.height !== nextPixelHeight;
  if (!changed) {
    return false;
  }
  G_UNI.canvas.size = {
    width,
    height,
    dpr
  };
  canvas.width = nextPixelWidth;
  canvas.height = nextPixelHeight;
  return true;
}

function getCanvasCtx(canvas) {
  return G_UNI_FX.getCanvasContext(canvas);
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

function markInteraction(durationMs = UNIVERSE_INTERACTION_ACTIVE_MS) {
  G_UNI_FX.markInteraction(durationMs);
}

function getEdgeStride(edgeCount) {
  return G_UNI_FX.getEdgeStride(edgeCount, {
    benchmarkRunning: G_RT.uBench.running,
    perfSmoothedMs: G_RT.uPerfMs
  });
}

function buildProjectionInput(nodes, width, height) {
  return {
    nodes,
    width,
    height,
    zoom: clampNumber(G_UNI.view.zoom, UNIVERSE_ZOOM_MIN, UNIVERSE_ZOOM_MAX),
    panX: clampNumber(G_UNI.view.panX, -1.6, 1.6),
    panY: clampNumber(G_UNI.view.panY, -1.6, 1.6),
    cacheToken: getGraphCacheToken(160)
  };
}

function getProjection(nodes, width, height) {
  return G_UNI_FX.getProjectionData(buildProjectionInput(nodes, width, height));
}

function findNodeAt(canvasX, canvasY) {
  return G_UNI_FX.findNodeIndexAt({
    canvasX,
    canvasY,
    ...buildProjectionInput(G_UNI.graph.nodes, G_UNI.canvas.size.width, G_UNI.canvas.size.height)
  });
}

function reqGraph(options = {}) {
  const { force = false } = options;
  if (!force && !isUniverseVisible()) {
    return;
  }
  if (G_RT.uRenderFrame) {
    return;
  }
  G_RT.uRenderFrame = window.requestAnimationFrame(() => {
    G_RT.uRenderFrame = 0;
    renderUniverseGraph();
  });
}

function drawUniverseNodeLabel(context, text, x, y) {
  const label = cleanText(text, 120);
  if (!label) {
    return;
  }
  context.save();
  context.font = "600 12px 'Space Grotesk', sans-serif";
  const textWidth = context.measureText(label).width;
  const width = textWidth + 14;
  const height = 22;
  const left = x - width / 2;
  const top = y - 30;
  context.fillStyle = "rgba(7, 14, 26, 0.86)";
  context.strokeStyle = "rgba(125, 178, 252, 0.45)";
  context.lineWidth = 1;
  context.beginPath();
  if (typeof context.roundRect === "function") {
    context.roundRect(left, top, width, height, 8);
  } else {
    context.rect(left, top, width, height);
  }
  context.fill();
  context.stroke();
  context.fillStyle = "#d9ebff";
  context.fillText(label, left + 7, top + 15);
  context.restore();
}

function renderGraphWebgl(
  canvas,
  width,
  height,
  dpr,
  nodes,
  edges,
  filterActive,
  highlightFlags,
  selectedIndex,
  selectedFlags,
  hoverIndex,
  pathNodeFlags,
  pathEdgeSet,
  projection
) {
  return G_UNI_FX.renderWebgl({
    canvas,
    width,
    height,
    dpr,
    nodes,
    edges,
    filterActive,
    highlightFlags,
    selectedIndex,
    selectedFlags,
    hoverIndex,
    pathNodeFlags,
    pathEdgeSet,
    projection,
    benchmarkRunning: G_RT.uBench.running,
    perfSmoothedMs: G_RT.uPerfMs,
    pulseNodeIndex: G_UNI.view.pulseNodeIndex,
    pulseUntil: G_UNI.view.pulseUntil,
    getNodeColor: getUniverseNodeColor,
    getEdgeKey: buildUniverseEdgeKey,
    now: Date.now()
  });
}

function getUniverseQuestionBucket(node) {
  const cached = cleanText(node?.questionBucket, 20).toLowerCase();
  if (
    cached === "who" ||
    cached === "what" ||
    cached === "where" ||
    cached === "when" ||
    cached === "why" ||
    cached === "how"
  ) {
    return cached;
  }
  const bucket = inferUniverseQuestionBucketFromLabels(node?.labels);
  (node && typeof node === "object") && (node.questionBucket = bucket);
  return bucket;
}

function getUniverseNodeColor(node) {
  const colorMode = G_UNI.cfg.colorMode;
  if (colorMode === UNIVERSE_COLOR_MODE_POS) {
    const pos = cleanText(node?.partOfSpeech, 30).toLowerCase();
    if (pos === "noun") {
      return "#77d4ff";
    }
    if (pos === "verb") {
      return "#ff9f6a";
    }
    if (pos === "adjective") {
      return "#c39bff";
    }
    if (pos === "adverb") {
      return "#ffd36b";
    }
    if (pos === "pronoun") {
      return "#7fffb8";
    }
    return "#98b8e6";
  }

  if (colorMode === UNIVERSE_COLOR_MODE_MODE) {
    const mode = normalizeEntryMode(node?.mode);
    if (mode === "slang") {
      return "#66e2af";
    }
    if (mode === "code") {
      return "#64beff";
    }
    if (mode === "bytes") {
      return "#ff8bc2";
    }
    return "#e0c06f";
  }

  const bucket = getUniverseQuestionBucket(node);
  if (bucket === "who") {
    return "#86d4ff";
  }
  if (bucket === "where") {
    return "#77efc8";
  }
  if (bucket === "when") {
    return "#ffd97d";
  }
  if (bucket === "why") {
    return "#d7a3ff";
  }
  if (bucket === "how") {
    return "#ffa989";
  }
  return "#87a8d7";
}

function buildUniverseEdgeKey(a, b, nodeCountInput = G_UNI.graph.nodes.length) {
  const left = Math.min(a, b);
  const right = Math.max(a, b);
  const nodeCount = Math.max(1, Math.floor(Number(nodeCountInput)) || 0);
  return left * nodeCount + right;
}

function getUniverseSelectedIndicesSorted() {
  return [...G_UNI.sel.nodeIdxSet]
    .filter((index) => Number.isInteger(index) && index >= 0 && index < G_UNI.graph.nodes.length)
    .sort((left, right) => left - right);
}

function getUniverseSelectedNodes() {
  const indices = getUniverseSelectedIndicesSorted();
  return indices.map((index) => ({
    index,
    node: G_UNI.graph.nodes[index]
  }));
}

function setNodeSelectionSet(indices, primaryIndex = -1) {
  const next = new Set(
    (Array.isArray(indices) ? indices : [])
      .map((value) => Math.floor(Number(value)))
      .filter((value) => Number.isInteger(value) && value >= 0 && value < G_UNI.graph.nodes.length)
  );
  G_UNI.sel.nodeIdxSet = next;
  syncSelectionFlags();
  if (Number.isInteger(primaryIndex) && next.has(primaryIndex)) {
    G_UNI.view.selectedNodeIndex = primaryIndex;
    G_UNI.view.hoverNodeIndex = primaryIndex;
    return;
  }
  const first = getUniverseSelectedIndicesSorted()[0];
  if (Number.isInteger(first)) {
    G_UNI.view.selectedNodeIndex = first;
    G_UNI.view.hoverNodeIndex = first;
    return;
  }
  G_UNI.view.selectedNodeIndex = -1;
  G_UNI.view.hoverNodeIndex = -1;
}

function clearUniverseNodeSelection(options = {}) {
  const { announce = false } = options;
  setNodeSelectionSet([], -1);
  G_UNI.sel.activeSetId = "";
  G_PAGE.universe.renderCluster();
  G_PAGE.universe.reqRender();
  (announce) && (setStatus("Universe selection cleared."));
}

function getUniverseVisibleNodeIndices() {
  const filter = cleanText(G_UNI.view.filter, MAX.WORD).toLowerCase();
  if (!filter) {
    return G_UNI.graph.nodes.map((_node, index) => index);
  }
  const result = [];
  G_UNI.graph.nodes.forEach((node, index) => {
    (getNodeWord(node).includes(filter)) && (result.push(index));
  });
  return result;
}

function selectAllUniverseVisibleNodes(options = {}) {
  const { announce = true } = options;
  const visibleIndices = getUniverseVisibleNodeIndices();
  if (visibleIndices.length === 0) {
    if (announce) {
      setStatus("No visible universe nodes to select.", true);
    }
    return false;
  }
  const primaryIndex =
    Number.isInteger(G_UNI.view.selectedNodeIndex) &&
    visibleIndices.includes(G_UNI.view.selectedNodeIndex)
      ? G_UNI.view.selectedNodeIndex
      : visibleIndices[0];
  setNodeSelectionSet(visibleIndices, primaryIndex);
  G_UNI.sel.activeSetId = "";
  G_PAGE.universe.renderCluster();
  G_PAGE.universe.reqRender();
  if (announce) {
    setStatus(`Selected ${visibleIndices.length} universe node(s).`);
  }
  return true;
}

function toggleUniverseNodeSelection(nodeIndex, options = {}) {
  const { focusEntry = true, center = false, announce = "" } = options;
  const normalizedIndex = Math.floor(Number(nodeIndex));
  if (!Number.isInteger(normalizedIndex) || normalizedIndex < 0 || normalizedIndex >= G_UNI.graph.nodes.length) {
    return false;
  }
  const next = new Set(G_UNI.sel.nodeIdxSet);
  if (next.has(normalizedIndex)) {
    if (next.size > 1) {
      next.delete(normalizedIndex);
    }
  } else {
    next.add(normalizedIndex);
  }
  const primaryIndex = next.has(normalizedIndex) ? normalizedIndex : ([...next][next.size - 1] ?? -1);
  setNodeSelectionSet([...next], primaryIndex);
  G_UNI.sel.activeSetId = "";
  const node = G_UNI.graph.nodes[G_UNI.view.selectedNodeIndex];
  (center && node) && (centerUniverseOnNode(node), queueCacheSave());
  (focusEntry && node?.entryId) && (focusEntryWithoutUsage(node.entryId));
  G_PAGE.universe.renderCluster();
  G_PAGE.universe.reqRender();
  (announce) && (setStatus(announce));
  return true;
}

function getUniverseNodeDefinitionPreview(node) {
  const entry = getEntryForGraphNode(node);
  const text = cleanText(entry?.definition || "", 360);
  if (!text) {
    return "No definition linked to this node.";
  }
  return text.length > 220 ? `${text.slice(0, 220)}...` : text;
}

function getUniverseNodeOriginLabel(node) {
  const entry = getEntryForGraphNode(node);
  const language = normalizeEntryLanguage(entry?.language || "");
  if (language) {
    return language;
  }
  const mode = normalizeEntryMode(node?.mode);
  if (mode && mode !== "definition") {
    return `mode:${mode}`;
  }
  return "local dictionary";
}

function getUniverseNodeLinkage(nodeIndex) {
  const summary = {
    neighbors: [],
    modeCounts: {
      contains: 0,
      prefix: 0,
      suffix: 0,
      stem: 0,
      sameLabel: 0
    }
  };
  if (!Number.isInteger(nodeIndex) || nodeIndex < 0 || nodeIndex >= G_UNI.graph.nodes.length) {
    return summary;
  }
  const neighborIndexSet = new Set();
  G_UNI.graph.edges.forEach((edge) => {
    const left = Number(edge?.a);
    const right = Number(edge?.b);
    if (!Number.isInteger(left) || !Number.isInteger(right)) {
      return;
    }
    if (left !== nodeIndex && right !== nodeIndex) {
      return;
    }
    const neighborIndex = left === nodeIndex ? right : left;
    if (!Number.isInteger(neighborIndex) || neighborIndex < 0 || neighborIndex >= G_UNI.graph.nodes.length) {
      return;
    }
    neighborIndexSet.add(neighborIndex);
    (Array.isArray(edge.modes) ? edge.modes : []).forEach((mode) => {
      const key = cleanText(mode, 20);
      (summary.modeCounts[key] !== undefined) && (summary.modeCounts[key] += 1);
    });
  });
  summary.neighbors = [...neighborIndexSet]
    .map((index) => ({
      index,
      node: G_UNI.graph.nodes[index]
    }))
    .filter((item) => item.node)
    .sort((left, right) => {
      return (
        (Number(right.node.degree) || 0) - (Number(left.node.degree) || 0) ||
        String(left.node.word).localeCompare(String(right.node.word))
      );
    });
  return summary;
}

function resolveUniverseCustomSetNodeIndices(customSet) {
  if (!customSet || typeof customSet !== "object") {
    return [];
  }
  const indices = new Set();
  (Array.isArray(customSet.entryIds) ? customSet.entryIds : []).forEach((entryId) => {
    const index = G_UNI.idx.entry.get(cleanText(entryId, MAX.WORD));
    (Number.isInteger(index)) && (indices.add(index));
  });
  (Array.isArray(customSet.words) ? customSet.words : []).forEach((word) => {
    const index = G_UNI.idx.word.get(normalizeWordLower(word));
    (Number.isInteger(index)) && (indices.add(index));
  });
  return [...indices].sort((left, right) => left - right);
}

function appendNodesToUniverseCustomSet(setId, nodeIndices) {
  const normalizedSetId = cleanText(setId, MAX.WORD);
  if (!normalizedSetId) {
    return false;
  }
  const normalizedIndices = (Array.isArray(nodeIndices) ? nodeIndices : [])
    .map((value) => Math.floor(Number(value)))
    .filter((value) => Number.isInteger(value) && value >= 0 && value < G_UNI.graph.nodes.length);
  if (normalizedIndices.length === 0) {
    return false;
  }
  let changed = false;
  G_UNI.sel.sets = G_UNI.sel.sets.map((set) => {
    if (set.id !== normalizedSetId) {
      return set;
    }
    const entryIds = new Set(Array.isArray(set.entryIds) ? set.entryIds : []);
    const words = new Set(Array.isArray(set.words) ? set.words.map((item) => normalizeWordLower(item)) : []);
    normalizedIndices.forEach((index) => {
      const node = G_UNI.graph.nodes[index];
      if (!node) {
        return;
      }
      const entryId = cleanText(node.entryId, MAX.WORD);
      const wordLower = getNodeWord(node);
      (entryId && !entryIds.has(entryId)) && (entryIds.add(entryId), changed = true);
      (wordLower && !words.has(wordLower)) && (words.add(wordLower), changed = true);
    });
    return {
      ...set,
      entryIds: [...entryIds].slice(0, 5000),
      words: [...words].slice(0, 5000)
    };
  });
  (changed) && (queueCacheSave(), G_PAGE.universe.renderCluster());
  return changed;
}

function createUniverseCustomSetFromSelection(nameInput = "") {
  const selected = getUniverseSelectedNodes();
  if (selected.length === 0) {
    setStatus("Select universe nodes first.", true);
    return false;
  }
  const name = cleanText(nameInput, 80) || `Set ${G_UNI.sel.sets.length + 1}`;
  const nextSet = normalizeUniverseCustomSearchSet({
    id: window.crypto.randomUUID(),
    name,
    entryIds: selected.map((item) => cleanText(item.node?.entryId || "", MAX.WORD)).filter(Boolean),
    words: selected.map((item) => normalizeWordLower(item.node?.word || "")).filter(Boolean),
    createdAt: nowIso()
  });
  G_UNI.sel.sets = [nextSet, ...G_UNI.sel.sets].slice(0, 120);
  G_UNI.sel.activeSetId = nextSet.id;
  queueCacheSave();
  G_PAGE.universe.renderCluster();
  setStatus(`Custom set created: ${nextSet.name}`);
  return true;
}

function removeUniverseCustomSearchSet(setId) {
  const normalizedSetId = cleanText(setId, MAX.WORD);
  if (!normalizedSetId) {
    return false;
  }
  const before = G_UNI.sel.sets.length;
  G_UNI.sel.sets = G_UNI.sel.sets.filter((set) => set.id !== normalizedSetId);
  if (G_UNI.sel.sets.length === before) {
    return false;
  }
  (G_UNI.sel.activeSetId === normalizedSetId) && (G_UNI.sel.activeSetId = "");
  queueCacheSave();
  G_PAGE.universe.renderCluster();
  return true;
}

function applyCustomSet(setId, options = {}) {
  const { announce = true, center = true } = options;
  const normalizedSetId = cleanText(setId, MAX.WORD);
  if (!normalizedSetId) {
    return false;
  }
  const customSet = G_UNI.sel.sets.find((set) => set.id === normalizedSetId);
  if (!customSet) {
    return false;
  }
  const indices = resolveUniverseCustomSetNodeIndices(customSet);
  if (indices.length === 0) {
    if (announce) {
      setStatus(`No graph nodes currently match set "${customSet.name}".`, true);
    }
    return false;
  }
  G_UNI.sel.activeSetId = customSet.id;
  setNodeSelectionSet(indices, indices[0]);
  const primaryNode = G_UNI.graph.nodes[indices[0]];
  (center && primaryNode) && (centerUniverseOnNode(primaryNode));
  queueCacheSave();
  G_PAGE.universe.renderCluster();
  G_PAGE.universe.reqRender();
  if (announce) {
    setStatus(`Applied set "${customSet.name}" (${indices.length} node(s)).`);
  }
  return true;
}

function getUniverseDragSelectionIndices(fallbackIndex = -1) {
  const selected = getUniverseSelectedIndicesSorted();
  if (selected.length > 0) {
    return selected;
  }
  const normalizedFallback = Math.floor(Number(fallbackIndex));
  if (
    Number.isInteger(normalizedFallback) &&
    normalizedFallback >= 0 &&
    normalizedFallback < G_UNI.graph.nodes.length
  ) {
    return [normalizedFallback];
  }
  return [];
}

function parseUniverseDraggedSelectionPayload(event) {
  const transfer = event?.dataTransfer;
  if (!transfer) {
    return [];
  }
  const serialized =
    transfer.getData("application/x-dictionary-universe-selection") || transfer.getData("text/plain") || "";
  if (!serialized) {
    return [];
  }
  try {
    const payload = JSON.parse(serialized);
    const indices = Array.isArray(payload?.indices) ? payload.indices : [];
    return indices
      .map((value) => Math.floor(Number(value)))
      .filter((value) => Number.isInteger(value) && value >= 0 && value < G_UNI.graph.nodes.length);
  } catch {
    return [];
  }
}

function findPathIndices(fromIndex, toIndex) {
  return findPath(fromIndex, toIndex, G_UNI.graph.nodes.length, getAdjacency());
}

function centerUniverseOnNode(node) {
  if (!node) {
    return;
  }
  G_UNI.view.panX = clampNumber(0.5 - (Number(node.x) || 0.5), -1.6, 1.6);
  G_UNI.view.panY = clampNumber(0.5 - (Number(node.y) || 0.5), -1.6, 1.6);
  clearProjectionCache();
}

function focusNodeIndex(nodeIndex, options = {}) {
  const { center = true, announce = "", focusEntry = true, pulse = false } = options;
  if (!Number.isInteger(nodeIndex) || nodeIndex < 0 || nodeIndex >= G_UNI.graph.nodes.length) {
    return false;
  }
  setNodeSelectionSet([nodeIndex], nodeIndex);
  G_UNI.sel.activeSetId = "";
  const node = G_UNI.graph.nodes[nodeIndex];
  (center) && (centerUniverseOnNode(node), queueCacheSave());
  (focusEntry && node?.entryId) && (focusEntryWithoutUsage(node.entryId));
  (pulse) && (G_UNI.view.pulseNodeIndex = nodeIndex, G_UNI.view.pulseUntil = Date.now() + 1200);
  G_PAGE.universe.renderCluster();
  G_PAGE.universe.reqRender();
  (announce) && (setStatus(announce));
  return true;
}

function resetUniverseCamera() {
  G_UNI.view.zoom = 1;
  G_UNI.view.panX = 0;
  G_UNI.view.panY = 0;
  markInteraction(160);
  clearProjectionCache();
  queueCacheSave();
  G_PAGE.universe.reqRender();
}

function fitUniverseCamera() {
  const nodes = G_UNI.graph.nodes;
  if (!Array.isArray(nodes) || nodes.length === 0) {
    return;
  }
  let minX = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;
  nodes.forEach((node) => {
    const x = Number(node.x) || 0.5;
    const y = Number(node.y) || 0.5;
    (x < minX) && (minX = x);
    (x > maxX) && (maxX = x);
    (y < minY) && (minY = y);
    (y > maxY) && (maxY = y);
  });
  const spanX = Math.max(0.02, maxX - minX);
  const spanY = Math.max(0.02, maxY - minY);
  const zoom = clampNumber(Math.min(0.88 / spanX, 0.88 / spanY), UNIVERSE_ZOOM_MIN, UNIVERSE_ZOOM_MAX);
  G_UNI.view.zoom = zoom;
  G_UNI.view.panX = clampNumber(0.5 - (minX + maxX) / 2, -1.6, 1.6);
  G_UNI.view.panY = clampNumber(0.5 - (minY + maxY) / 2, -1.6, 1.6);
  markInteraction(160);
  clearProjectionCache();
  queueCacheSave();
  G_PAGE.universe.reqRender();
}

function saveUniverseBookmark() {
  const existingCount = G_UNI.cfg.bookmarks.length;
  const next = normalizeUniverseBookmark({
    name: `View ${existingCount + 1}`,
    panX: G_UNI.view.panX,
    panY: G_UNI.view.panY,
    zoom: G_UNI.view.zoom,
    createdAt: nowIso()
  });
  G_UNI.cfg.bookmarks = [next, ...G_UNI.cfg.bookmarks].slice(0, UNIVERSE_BOOKMARK_LIMIT);
  updateUniverseBookmarkSelect();
  (G_DOM.universeBookmarkSelect instanceof HTMLSelectElement) && (G_DOM.universeBookmarkSelect.value = next.id);
  queueCacheSave();
  setStatus(`Saved camera view "${next.name}".`);
}

function loadUniverseBookmark(bookmarkId) {
  const normalizedId = cleanText(bookmarkId, MAX.WORD);
  if (!normalizedId) {
    return false;
  }
  const bookmark = G_UNI.cfg.bookmarks.find((item) => item.id === normalizedId);
  if (!bookmark) {
    return false;
  }
  G_UNI.view.panX = clampNumber(bookmark.panX, -1.6, 1.6);
  G_UNI.view.panY = clampNumber(bookmark.panY, -1.6, 1.6);
  G_UNI.view.zoom = clampNumber(bookmark.zoom, UNIVERSE_ZOOM_MIN, UNIVERSE_ZOOM_MAX);
  markInteraction(160);
  clearProjectionCache();
  queueCacheSave();
  G_PAGE.universe.reqRender();
  setStatus(`Loaded view "${bookmark.name}".`);
  return true;
}

function exportUniverseGraphJson() {
  const payload = {
    exportedAt: nowIso(),
    datasetSignature: G_RT.uDataSig,
    modelKey: G_RT.uGraphKey,
    config: {
      ...normalizeConfig(G_UNI.cfg),
      bookmarks: undefined
    },
    bookmarks: G_UNI.cfg.bookmarks,
    graph: G_UNI.graph
  };
  if (window.dictionaryAPI?.exportUniverse) {
    window.dictionaryAPI
      .exportUniverse({
        format: "json",
        data: payload
      })
      .then((result) => {
        if (result?.ok) {
          setStatus(`Universe JSON exported: ${result.filePath}`);
          return;
        }
        setStatus("Universe JSON export failed.", true);
      })
      .catch((error) => {
        recordDiagnosticError("universe_export_json_failed", String(error?.message || error), "universeExport");
        setStatus("Universe JSON export failed.", true);
      });
    return;
  }
  triggerDownload(
    JSON.stringify(payload, null, 2),
    `universe-${new Date().toISOString().slice(0, 10)}.json`,
    "application/json"
  );
  setStatus("Universe JSON exported.");
}

function exportUniversePng() {
  const canvas = getActiveCanvas();
  if (!(canvas instanceof HTMLCanvasElement)) {
    setStatus("Universe canvas unavailable.", true);
    return;
  }
  const dataUrl = canvas.toDataURL("image/png");
  if (window.dictionaryAPI?.exportUniverse) {
    window.dictionaryAPI
      .exportUniverse({
        format: "png",
        dataUrl
      })
      .then((result) => {
        if (result?.ok) {
          setStatus(`Universe PNG exported: ${result.filePath}`);
          return;
        }
        setStatus("Universe PNG export failed.", true);
      })
      .catch((error) => {
        recordDiagnosticError("universe_export_png_failed", String(error?.message || error), "universeExport");
        setStatus("Universe PNG export failed.", true);
      });
    return;
  }
  const anchor = document.createElement("a");
  anchor.href = dataUrl;
  anchor.download = `universe-${new Date().toISOString().slice(0, 10)}.png`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setStatus("Universe PNG exported.");
}

function jumpToUniverseFilter() {
  const filter = cleanText(G_UNI.view.filter, MAX.WORD).toLowerCase();
  if (!filter) {
    setStatus("Type a word fragment first.", true);
    return;
  }
  const index = G_UNI.graph.nodes.findIndex((node) => getNodeWord(node).includes(filter));
  if (index < 0) {
    setStatus(`No word found for "${filter}".`, true);
    return;
  }
  focusNodeIndex(index, {
    center: true,
    announce: `Jumped to "${G_UNI.graph.nodes[index].word}".`,
    pulse: true
  });
}

function applyUniversePathFinder() {
  const fromWord = cleanText(
    G_DOM.universePathFromInput instanceof HTMLInputElement ? G_DOM.universePathFromInput.value : "",
    MAX.WORD
  );
  const toWord = cleanText(
    G_DOM.universePathToInput instanceof HTMLInputElement ? G_DOM.universePathToInput.value : "",
    MAX.WORD
  );
  const fromLower = normalizeWordLower(fromWord);
  const toLower = normalizeWordLower(toWord);
  if (!fromLower || !toLower) {
    G_PAGE.universe.setPathStatus("Path requires both From and To words.", true);
    return;
  }
  const fromIndex = G_UNI.idx.word.get(fromLower);
  const toIndex = G_UNI.idx.word.get(toLower);
  if (!Number.isInteger(fromIndex) || !Number.isInteger(toIndex)) {
    clearPathHighlights();
    G_PAGE.universe.setPathStatus("Path words are not present in the current universe graph.", true);
    G_PAGE.universe.reqRender();
    return;
  }
  const pathIndices = findPathIndices(fromIndex, toIndex);
  if (pathIndices.length === 0) {
    clearPathHighlights();
    G_PAGE.universe.setPathStatus(`No link path found between "${fromWord}" and "${toWord}".`, true);
    G_PAGE.universe.reqRender();
    return;
  }
  G_UNI.path.nodeIdx = pathIndices;
  G_UNI.path.edgeKeys = new Set();
  const nodeCount = Math.max(1, G_UNI.graph.nodes.length);
  for (let index = 1; index < pathIndices.length; index += 1) {
    G_UNI.path.edgeKeys.add(buildUniverseEdgeKey(pathIndices[index - 1], pathIndices[index], nodeCount));
  }
  G_UNI.path.words = pathIndices.map((index) => G_UNI.graph.nodes[index]?.word || "");
  syncPathFlags();
  G_PAGE.universe.setPathStatus(`${pathIndices.length} step(s): ${G_UNI.path.words.join(" -> ")}`);
  focusNodeIndex(fromIndex, {
    center: true,
    announce: `Path highlighted from "${fromWord}" to "${toWord}".`,
    focusEntry: false,
    pulse: true
  });
}

function applyUniverseOptionsFromInputs() {
  const minWordLength =
    G_DOM.universeMinWordLengthInput instanceof HTMLInputElement
      ? Math.floor(Number(G_DOM.universeMinWordLengthInput.value) || G_UNI.cfg.minWordLength)
      : G_UNI.cfg.minWordLength;
  const maxNodes =
    G_DOM.universeMaxNodesInput instanceof HTMLInputElement
      ? Math.floor(Number(G_DOM.universeMaxNodesInput.value) || G_UNI.cfg.maxNodes)
      : G_UNI.cfg.maxNodes;
  const maxEdges =
    G_DOM.universeMaxEdgesInput instanceof HTMLInputElement
      ? Math.floor(Number(G_DOM.universeMaxEdgesInput.value) || G_UNI.cfg.maxEdges)
      : G_UNI.cfg.maxEdges;
  const favoritesOnly =
    G_DOM.universeFavoritesOnlyInput instanceof HTMLInputElement
      ? Boolean(G_DOM.universeFavoritesOnlyInput.checked)
      : G_UNI.cfg.favoritesOnly;
  const labelFilter =
    G_DOM.universeLabelFilterInput instanceof HTMLInputElement
      ? cleanText(G_DOM.universeLabelFilterInput.value, MAX.LABEL).toLowerCase()
      : G_UNI.cfg.labelFilter;

  const nextConfig = normalizeConfig({
    ...G_UNI.cfg,
    minWordLength,
    maxNodes,
    maxEdges,
    favoritesOnly,
    labelFilter
  });
  const previousFingerprint = JSON.stringify({
    minWordLength: G_UNI.cfg.minWordLength,
    maxNodes: G_UNI.cfg.maxNodes,
    maxEdges: G_UNI.cfg.maxEdges,
    favoritesOnly: G_UNI.cfg.favoritesOnly,
    labelFilter: G_UNI.cfg.labelFilter
  });
  const nextFingerprint = JSON.stringify({
    minWordLength: nextConfig.minWordLength,
    maxNodes: nextConfig.maxNodes,
    maxEdges: nextConfig.maxEdges,
    favoritesOnly: nextConfig.favoritesOnly,
    labelFilter: nextConfig.labelFilter
  });
  G_UNI.cfg = {
    ...nextConfig,
    bookmarks: G_UNI.cfg.bookmarks
  };
  G_PAGE.universe.syncControls();
  (previousFingerprint !== nextFingerprint) && (invalidateUniverseGraph(), scheduleGraphBuild(), queueCacheSave(), setStatus("Universe filters applied."));
  G_PAGE.universe.renderSummary();
  G_PAGE.universe.reqRender();
}

function toggleUniverseEdgeMode(modeKey) {
  const edgeModes = {
    ...G_UNI.cfg.edgeModes,
    [modeKey]: !G_UNI.cfg.edgeModes?.[modeKey]
  };
  (!edgeModes.contains && !edgeModes.prefix && !edgeModes.suffix && !edgeModes.stem && !edgeModes.sameLabel) && (edgeModes.contains = true);
  G_UNI.cfg = normalizeConfig({
    ...G_UNI.cfg,
    edgeModes,
    bookmarks: G_UNI.cfg.bookmarks
  });
  G_PAGE.universe.syncControls();
  invalidateUniverseGraph();
  scheduleGraphBuild();
  queueCacheSave();
  G_PAGE.universe.renderSummary();
  G_PAGE.universe.reqRender();
}

function renderClusterPanel() {
  const selectedNodes = getUniverseSelectedNodes();
  const selectedCount = selectedNodes.length;
  const visibleIndices = getUniverseVisibleNodeIndices();
  const selectedIndex = G_UNI.view.selectedNodeIndex;
  const selected = Number.isInteger(selectedIndex) && selectedIndex >= 0 ? G_UNI.graph.nodes[selectedIndex] : null;

  if (
    G_DOM.universeInspectorSummary instanceof HTMLElement &&
    G_DOM.universeSelectionSummary instanceof HTMLElement &&
    G_DOM.universeSelectionList instanceof HTMLElement &&
    G_DOM.universeNodeInspectorTitle instanceof HTMLElement &&
    G_DOM.universeNodeInspectorMeta instanceof HTMLElement &&
    G_DOM.universeNodeInspectorDefinition instanceof HTMLElement &&
    G_DOM.universeNodeInspectorFacts instanceof HTMLElement &&
    G_DOM.universeCustomSetsSummary instanceof HTMLElement &&
    G_DOM.universeCustomSetsList instanceof HTMLElement
  ) {
    G_DOM.universeInspectorSummary.textContent = `Nodes: ${G_UNI.graph.nodes.length}. Visible: ${visibleIndices.length}. Selected: ${selectedCount}.`;
    G_DOM.universeSelectionSummary.textContent = `${selectedCount} selected definition(s).`;
    G_DOM.universeSelectionList.innerHTML = "";

    if (selectedNodes.length === 0) {
      const emptySelection = document.createElement("li");
      emptySelection.className = "universeSelectionItem";
      emptySelection.textContent =
        "No nodes selected. Click a node, Shift/Ctrl-click for multi-select, or use Select All Visible.";
      G_DOM.universeSelectionList.appendChild(emptySelection);
    } else {
      selectedNodes.slice(0, 240).forEach(({ index, node }) => {
        const row = document.createElement("li");
        row.className = `universeSelectionItem${index === selectedIndex ? " primary" : " secondary"}`;
        row.dataset.nodeIndex = String(index);
        row.draggable = true;
        const title = document.createElement("strong");
        title.textContent = node?.word || "word";
        const mini = document.createElement("span");
        mini.className = "mini";
        mini.textContent = getUniverseNodeDefinitionPreview(node);
        row.appendChild(title);
        row.appendChild(mini);
        row.addEventListener("click", (event) => {
          if (event.shiftKey || event.ctrlKey || event.metaKey) {
            toggleUniverseNodeSelection(index, { focusEntry: true, center: false });
            return;
          }
          focusNodeIndex(index, { center: false, focusEntry: true });
        });
        row.addEventListener("dragstart", (event) => {
          const indices = getUniverseDragSelectionIndices(index);
          if (!event.dataTransfer) {
            return;
          }
          event.dataTransfer.effectAllowed = "copyMove";
          const payload = JSON.stringify({
            type: "universe-node-selection",
            indices
          });
          event.dataTransfer.setData("application/x-dictionary-universe-selection", payload);
          event.dataTransfer.setData("text/plain", payload);
        });
        G_DOM.universeSelectionList.appendChild(row);
      });
      if (selectedNodes.length > 240) {
        const tail = document.createElement("li");
        tail.className = "universeSelectionItem";
        tail.textContent = `... ${selectedNodes.length - 240} more selected`;
        G_DOM.universeSelectionList.appendChild(tail);
      }
    }

    G_DOM.universeCustomSetsList.innerHTML = "";
    G_DOM.universeCustomSetsSummary.textContent =
      G_UNI.sel.sets.length > 0
        ? `${G_UNI.sel.sets.length} custom set(s). Drag selected definitions onto a set to append.`
        : "No sets yet. Select nodes and create one.";
    if (G_UNI.sel.sets.length === 0) {
      const emptySet = document.createElement("li");
      emptySet.className = "universeCustomSetItem";
      emptySet.textContent = "Create a set from selected nodes.";
      G_DOM.universeCustomSetsList.appendChild(emptySet);
    } else {
      G_UNI.sel.sets.forEach((set) => {
        const row = document.createElement("li");
        row.className = `universeCustomSetItem${G_UNI.sel.activeSetId === set.id ? " active" : ""}`;
        row.dataset.setId = set.id;
        const name = document.createElement("div");
        name.className = "name";
        name.setAttribute("role", "button");
        name.tabIndex = 0;
        name.textContent = set.name;
        const indices = resolveUniverseCustomSetNodeIndices(set);
        const meta = document.createElement("span");
        meta.className = "meta";
        meta.textContent = `${indices.length} node(s) mapped`;
        name.appendChild(meta);
        name.addEventListener("click", () => {
          applyCustomSet(set.id);
        });
        name.addEventListener("keydown", (event) => {
          (event.key === "Enter" || event.key === " ") && (event.preventDefault(), applyCustomSet(set.id));
        });
        const remove = document.createElement("span");
        remove.className = "universeCustomSetDelete";
        remove.setAttribute("role", "button");
        remove.tabIndex = 0;
        remove.textContent = "×";
        remove.title = `Delete set "${set.name}"`;
        const onRemove = () => {
          removeUniverseCustomSearchSet(set.id);
        };
        remove.addEventListener("click", (event) => {
          event.stopPropagation();
          onRemove();
        });
        remove.addEventListener("keydown", (event) => {
          (event.key === "Enter" || event.key === " ") && (event.preventDefault(), event.stopPropagation(), onRemove());
        });
        row.addEventListener("dragover", (event) => {
          event.preventDefault();
          row.classList.add("dropTarget");
        });
        row.addEventListener("dragleave", () => {
          row.classList.remove("dropTarget");
        });
        row.addEventListener("drop", (event) => {
          event.preventDefault();
          row.classList.remove("dropTarget");
          const dragged = parseUniverseDraggedSelectionPayload(event);
          if (dragged.length === 0) {
            return;
          }
          const changed = appendNodesToUniverseCustomSet(set.id, dragged);
          if (changed) {
            setStatus(`Added ${dragged.length} node(s) to "${set.name}".`);
          }
        });
        row.appendChild(name);
        row.appendChild(remove);
        G_DOM.universeCustomSetsList.appendChild(row);
      });
    }

    if (!selected) {
      G_DOM.universeNodeInspectorTitle.textContent = "Node Details";
      G_DOM.universeNodeInspectorMeta.textContent = "Select a node in Universe to inspect.";
      G_DOM.universeNodeInspectorDefinition.textContent = "Definition preview appears here.";
      G_DOM.universeNodeInspectorFacts.innerHTML = "";
    } else {
      const linkage = getUniverseNodeLinkage(selectedIndex);
      const entry = getEntryForGraphNode(selected);
      const posType = cleanText(selected.partOfSpeech, 40) || "unknown";
      const mode = normalizeEntryMode(selected.mode);
      const origin = getUniverseNodeOriginLabel(selected);
      const labels = normalizeLabelArray(selected.labels).join(", ") || "none";
      const linkedWords = linkage.neighbors
        .slice(0, 8)
        .map((item) => cleanText(item.node?.word || "", MAX.WORD))
        .filter(Boolean)
        .join(", ");
      const modeCounts = linkage.modeCounts;
      const typeBreakdown = Object.keys(modeCounts)
        .filter((key) => modeCounts[key] > 0)
        .map((key) => `${key}:${modeCounts[key]}`)
        .join(", ");

      G_DOM.universeNodeInspectorTitle.textContent = selected.word || "Node";
      G_DOM.universeNodeInspectorMeta.textContent = `Type: ${posType} | Mode: ${mode} | Origin: ${origin}`;
      G_DOM.universeNodeInspectorDefinition.textContent = getUniverseNodeDefinitionPreview(selected);
      G_DOM.universeNodeInspectorFacts.innerHTML = "";
      const facts = [
        `Linkage: ${linkage.neighbors.length} linked node(s), degree ${Math.max(0, Number(selected.degree) || 0)}.`,
        `Edge types: ${typeBreakdown || "none"}.`,
        `Cluster: ${cleanText(selected.componentId, 40) || "n/a"} (${Math.max(1, Number(selected.componentSize) || 1)} node(s)).`,
        `Labels: ${labels}.`,
        `Linked words: ${linkedWords || "none"}.`,
        `Entry source: ${entry?.id ? entry.id : "detached node"}`
      ];
      facts.forEach((fact) => {
        const li = document.createElement("li");
        li.className = "universeNodeInspectorFact";
        li.textContent = fact;
        G_DOM.universeNodeInspectorFacts.appendChild(li);
      });
    }
  }

  if (
    !(G_DOM.universeClusterList instanceof HTMLElement) ||
    !(G_DOM.universeClusterSummary instanceof HTMLElement)
  ) {
    return;
  }
  G_DOM.universeClusterList.innerHTML = "";
  if (!selected) {
    G_DOM.universeClusterSummary.textContent = "Select a node to inspect its cluster.";
    const empty = document.createElement("li");
    empty.className = "archiveItem";
    empty.textContent = "No cluster selected.";
    G_DOM.universeClusterList.appendChild(empty);
    return;
  }
  const clusterId = cleanText(selected.componentId, 40);
  let clusterNodes = [];
  if (clusterId) {
    clusterNodes = G_UNI.graph.nodes.filter((node) => cleanText(node.componentId, 40) === clusterId);
  } else {
    clusterNodes = G_UNI.graph.nodes.filter((node) => node.componentSize === selected.componentSize);
  }
  clusterNodes.sort((left, right) => {
    return (
      (Number(right.degree) || 0) - (Number(left.degree) || 0) || String(left.word).localeCompare(String(right.word))
    );
  });
  const maxList = clusterNodes.slice(0, 120);
  G_DOM.universeClusterSummary.textContent = `"${selected.word}" cluster: ${clusterNodes.length} word(s).`;
  maxList.forEach((node) => {
    const row = document.createElement("li");
    row.className = "archiveItem";
    row.dataset.entryId = node.entryId || "";
    row.textContent = `${node.word} (${Math.max(0, Number(node.degree) || 0)} links)`;
    row.addEventListener("click", () => {
      const index = G_UNI.idx.word.get(getNodeWord(node));
      if (Number.isInteger(index)) {
        focusNodeIndex(index, { center: true, focusEntry: true });
      }
    });
    G_DOM.universeClusterList.appendChild(row);
  });
  if (clusterNodes.length > maxList.length) {
    const tail = document.createElement("li");
    tail.className = "archiveItem";
    tail.textContent = `... ${clusterNodes.length - maxList.length} more`;
    G_DOM.universeClusterList.appendChild(tail);
  }
}

function renderUniverseGraph() {
  const startedAt = performance.now();
  const canvas = getActiveCanvas();
  if (!(canvas instanceof HTMLCanvasElement)) {
    return;
  }
  const resized = ensureUniverseCanvasSize();
  if (!isUniverseVisible() && !resized) {
    return;
  }
  const width = G_UNI.canvas.size.width;
  const height = G_UNI.canvas.size.height;
  const dpr = G_UNI.canvas.size.dpr;
  const nodes = Array.isArray(G_UNI.graph.nodes) ? G_UNI.graph.nodes : [];
  const edges = Array.isArray(G_UNI.graph.edges) ? G_UNI.graph.edges : [];
  const filter = cleanText(G_UNI.view.filter, MAX.WORD).toLowerCase();
  const highlightState = getHighlightState(nodes, filter);
  const highlightFlags = highlightState.flags;

  const selectedIndex = G_UNI.view.selectedNodeIndex;
  const selectedFlags = G_UNI.canvas.flags.selected;
  const hoverIndex = G_UNI.view.hoverNodeIndex;
  const pathNodeFlags = G_UNI.canvas.flags.path;
  const pathEdgeSet = G_UNI.path.edgeKeys;
  const filterActive = filter.length > 0;
  (G_RT.uBench.running) && (updateUniverseBenchmarkCamera(getUniverseBenchmarkProgress(startedAt)));
  const projection = getProjection(nodes, width, height);

  if (G_UNI.cfg.renderMode === UNIVERSE_VIEW_MODE_WEBGL) {
    const rendered = renderGraphWebgl(
      canvas,
      width,
      height,
      dpr,
      nodes,
      edges,
      filterActive,
      highlightFlags,
      selectedIndex,
      selectedFlags,
      hoverIndex,
      pathNodeFlags,
      pathEdgeSet,
      projection
    );
    if (rendered) {
      if (G_UNI.view.pulseNodeIndex >= 0 && G_UNI.view.pulseUntil > Date.now()) {
        G_PAGE.universe.reqRender();
      }
      updateUniverseFrameMetrics(startedAt, performance.now() - startedAt);
      return;
    }
    G_UNI.cfg = normalizeConfig({
      ...G_UNI.cfg,
      renderMode: UNIVERSE_VIEW_MODE_CANVAS,
      bookmarks: G_UNI.cfg.bookmarks
    });
    G_RT.uForceCanvas = true;
    syncCanvasVisibility();
    G_PAGE.universe.syncControls();
    setStatus("WebGL unavailable, switched to canvas renderer.", true);
    G_PAGE.universe.reqRender();
    return;
  }

  const context = getCanvasCtx(canvas);
  if (!context) {
    return;
  }
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.clearRect(0, 0, width, height);

  if (nodes.length === 0) {
    context.fillStyle = "rgba(177, 198, 228, 0.92)";
    context.font = "600 14px 'Space Grotesk', sans-serif";
    context.fillText("No universe data yet. Add more words to build links.", 20, 30);
    if (G_RT.uBench.running) {
      completeUniverseBenchmark("no-data");
    }
    renderPerfHud();
    return;
  }

  const projectionX = projection.x;
  const projectionY = projection.y;
  const projectionRadius = projection.radius;
  const nodeCount = Math.max(1, nodes.length);

  const edgeStride = getEdgeStride(edges.length);
  const hasPathHighlights = pathEdgeSet.size > 0;
  context.save();
  for (let edgeIndex = 0; edgeIndex < edges.length; edgeIndex += 1) {
    const edge = edges[edgeIndex];
    const a = Math.floor(Number(edge?.a));
    const b = Math.floor(Number(edge?.b));
    const left = nodes[a];
    const right = nodes[b];
    if (!left || !right) {
      continue;
    }
    const isPathEdge = hasPathHighlights && pathEdgeSet.has(buildUniverseEdgeKey(a, b, nodeCount));
    if (!isPathEdge && edgeStride > 1 && edgeIndex % edgeStride !== 0) {
      continue;
    }
    context.beginPath();
    if (isPathEdge) {
      context.strokeStyle = "rgba(154, 228, 255, 0.92)";
      context.lineWidth = 1.8;
    } else if (filterActive && highlightFlags[a] !== 1 && highlightFlags[b] !== 1) {
      context.strokeStyle = "rgba(106, 135, 179, 0.06)";
      context.lineWidth = 1;
    } else if (edge?.hasSameLabel === true) {
      context.strokeStyle = "rgba(170, 151, 255, 0.18)";
      context.lineWidth = 1;
    } else {
      context.strokeStyle = "rgba(129, 168, 226, 0.14)";
      context.lineWidth = 1;
    }
    context.moveTo(projectionX[a], projectionY[a]);
    context.lineTo(projectionX[b], projectionY[b]);
    context.stroke();
  }
  context.restore();

  const now = Date.now();
  for (let nodeIndex = 0; nodeIndex < nodes.length; nodeIndex += 1) {
    const node = nodes[nodeIndex];
    const projectedX = projectionX[nodeIndex];
    const projectedY = projectionY[nodeIndex];
    const radius = projectionRadius[nodeIndex];
    const isHighlighted = highlightFlags[nodeIndex] === 1;
    const isHovered = nodeIndex === hoverIndex;
    const isPrimarySelected = nodeIndex === selectedIndex;
    const isSecondarySelected = selectedFlags[nodeIndex] === 1 && !isPrimarySelected;
    const isPathNode = pathNodeFlags[nodeIndex] === 1;
    const isPulsing = nodeIndex === G_UNI.view.pulseNodeIndex && G_UNI.view.pulseUntil > now;
    const baseColor = getUniverseNodeColor(node);

    let alphaBase = 0.36 + Math.min(0.44, (Number(node.degree) || 0) / 18);
    (filterActive && !isHighlighted && !isPrimarySelected && !isSecondarySelected && !isHovered && !isPathNode) && (alphaBase *= 0.18);
    context.beginPath();
    context.arc(
      projectedX,
      projectedY,
      isHovered || isPrimarySelected || isSecondarySelected || isPathNode ? radius + 0.9 : radius,
      0,
      Math.PI * 2
    );
    if (isPrimarySelected) {
      context.fillStyle = "rgba(237, 248, 255, 0.98)";
    } else if (isSecondarySelected) {
      context.fillStyle = "rgba(159, 210, 255, 0.95)";
    } else if (isHovered) {
      context.fillStyle = "rgba(188, 226, 255, 0.95)";
    } else if (isPathNode) {
      context.fillStyle = "rgba(167, 233, 255, 0.94)";
    } else if (isHighlighted) {
      context.fillStyle = "rgba(126, 197, 255, 0.92)";
    } else {
      const colorAlpha = alphaBase.toFixed(3);
      const [red, green, blue] = colorRgbBytes(baseColor);
      context.fillStyle = `rgba(${red}, ${green}, ${blue}, ${colorAlpha})`;
    }
    context.fill();
    if (isPulsing) {
      const age = Math.max(0, G_UNI.view.pulseUntil - now);
      const ringAlpha = clampNumber(age / 1200, 0, 1);
      context.beginPath();
      context.arc(projectedX, projectedY, radius + 6, 0, Math.PI * 2);
      context.strokeStyle = `rgba(159, 232, 255, ${ringAlpha.toFixed(3)})`;
      context.lineWidth = 1.3;
      context.stroke();
    }
  }

  const selectedNode = selectedIndex >= 0 ? nodes[selectedIndex] : null;
  const hoverNode = hoverIndex >= 0 ? nodes[hoverIndex] : null;
  (selectedNode) && (drawUniverseNodeLabel(context, selectedNode.word, projectionX[selectedIndex], projectionY[selectedIndex]));
  (hoverNode && hoverIndex !== selectedIndex) && (drawUniverseNodeLabel(context, hoverNode.word, projectionX[hoverIndex], projectionY[hoverIndex]));
  (G_UNI.view.pulseNodeIndex >= 0 && G_UNI.view.pulseUntil > now) && (G_PAGE.universe.reqRender());
  updateUniverseFrameMetrics(startedAt, performance.now() - startedAt);
}

function syncSelectionWithEntry(entryId) {
  const normalizedId = cleanText(entryId, MAX.WORD);
  G_UNI.sel.activeSetId = "";
  if (!normalizedId) {
    setNodeSelectionSet([], -1);
    G_PAGE.universe.renderCluster();
    if (G_APP.s.activeView === VIEW_UNIVERSE) {
      G_PAGE.universe.reqRender();
    }
    return;
  }
  const nextIndex = G_UNI.idx.entry.get(normalizedId);
  if (Number.isInteger(nextIndex)) {
    setNodeSelectionSet([nextIndex], nextIndex);
  } else {
    setNodeSelectionSet([], -1);
  }
  G_PAGE.universe.renderCluster();
  (G_APP.s.activeView === VIEW_UNIVERSE) && (G_PAGE.universe.reqRender());
}

function focusEntryWithoutUsage(entryId) {
  const entry = getEntryById(entryId);
  if (!entry) {
    return;
  }
  renderEditorForEntry(entry, {
    syncUniverse: false
  });
  ensureEntryVisible(entry);
  G_PAGE.tree.reqRender();
  renderStatisticsView();
}

function setActiveView(nextView) {
  G_APP.s.activeView =
    nextView === VIEW_SENTENCE_GRAPH || nextView === VIEW_STATISTICS || nextView === VIEW_UNIVERSE
      ? nextView
      : VIEW_WORKBENCH;
  const showWorkbench = G_APP.s.activeView === VIEW_WORKBENCH;
  const showSentenceGraph = G_APP.s.activeView === VIEW_SENTENCE_GRAPH;
  const showStats = G_APP.s.activeView === VIEW_STATISTICS;
  const showUniverse = G_APP.s.activeView === VIEW_UNIVERSE;
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

function clearDiagnosticsFlushTimer() {
  (G_RT.diagnosticsFlushTimer) && (window.clearTimeout(G_RT.diagnosticsFlushTimer), G_RT.diagnosticsFlushTimer = 0);
}

function scheduleDiagnosticsFlush(delayMs = 1200) {
  clearDiagnosticsFlushTimer();
  G_RT.diagnosticsFlushTimer = window.setTimeout(async () => {
    G_RT.diagnosticsFlushTimer = 0;
    if (!window.dictionaryAPI?.appendDiagnostics) {
      return;
    }
    const payload = normalizeDiagnostics(G_APP.s.diagnostics);
    if (payload.errors.length === 0 && payload.perf.length === 0) {
      return;
    }
    try {
      await window.dictionaryAPI.appendDiagnostics(payload);
      G_APP.s.diagnostics = createDefaultDiagnostics();
      renderDiagnosticsSummary();
    } catch {
      // Keep local queue for later flush.
    }
  }, delayMs);
}

function buildUndoSnapshot(reason = "change") {
  return {
    id: window.crypto.randomUUID(),
    reason: cleanText(reason, 80) || "change",
    createdAt: nowIso(),
    labels: [...G_APP.s.labels],
    entries: G_APP.s.entries.map((entry) => ({
      ...entry,
      labels: [...entry.labels]
    })),
    sentenceGraph: {
      nodes: G_APP.s.sentenceGraph.nodes.map((node) => ({ ...node })),
      links: G_APP.s.sentenceGraph.links.map((link) => ({ ...link }))
    },
    graphLockEnabled: G_APP.s.graphLockEnabled
  };
}

function digestUndoSnapshot(snapshot) {
  return JSON.stringify({
    labels: snapshot.labels,
    entries: snapshot.entries.map((entry) => ({
      word: entry.word,
      definition: entry.definition,
      labels: entry.labels,
      archivedAt: entry.archivedAt || null,
      favorite: Boolean(entry.favorite),
      mode: normalizeEntryMode(entry.mode),
      language: normalizeEntryLanguage(entry.language || ""),
      usageCount: Math.max(0, Math.floor(Number(entry.usageCount) || 0))
    })),
    sentenceGraph: snapshot.sentenceGraph,
    graphLockEnabled: snapshot.graphLockEnabled
  });
}

function captureUndoSnapshot(reason = "change") {
  if (G_RT.undoReplayActive) {
    return;
  }
  const snapshot = buildUndoSnapshot(reason);
  const digest = digestUndoSnapshot(snapshot);
  if (digest === G_RT.lastUndoDigest) {
    return;
  }
  G_RT.undoStack = [...G_RT.undoStack, snapshot].slice(-120);
  G_RT.redoStack = [];
  G_RT.lastUndoDigest = digest;
}

function applyUndoSnapshot(snapshot, options = {}) {
  const { announce = "" } = options;
  if (!snapshot) {
    return false;
  }
  G_RT.undoReplayActive = true;
  G_APP.st.setLabels(normalizeLabelArray(snapshot.labels));
  G_APP.st.setEntries((Array.isArray(snapshot.entries) ? snapshot.entries : []).map(normalizeLoadedEntry).filter(Boolean));
  sortEntries();
  G_APP.st.setGraph(normalizeLoadedSentenceGraph(snapshot.sentenceGraph));
  G_APP.s.graphLockEnabled = Boolean(snapshot.graphLockEnabled);
  G_APP.s.selectedEntryId = null;
  G_APP.s.selectedGraphNodeId = null;
  clearEntrySelections();
  clearPendingLink();
  G_PAGE.tree.reqRender();
  G_PAGE.sentence.reqRender();
  (announce) && (setStatus(announce));
  G_RT.undoReplayActive = false;
  return true;
}

function runUndo() {
  if (G_RT.undoStack.length < 2) {
    return false;
  }
  const current = G_RT.undoStack.pop();
  const previous = G_RT.undoStack[G_RT.undoStack.length - 1];
  if (!previous) {
    if (current) {
      G_RT.undoStack.push(current);
    }
    return false;
  }
  (current) && (G_RT.redoStack = [...G_RT.redoStack, current].slice(-120));
  applyUndoSnapshot(previous, { announce: "Undo applied." });
  return true;
}

function runRedo() {
  const next = G_RT.redoStack.pop();
  if (!next) {
    return false;
  }
  G_RT.undoStack = [...G_RT.undoStack, next].slice(-120);
  applyUndoSnapshot(next, { announce: "Redo applied." });
  return true;
}

function scheduleIndexWarmup() {
  (G_RT.indexWarmupTimer) && (window.clearTimeout(G_RT.indexWarmupTimer));
  G_RT.indexWarmupTimer = window.setTimeout(() => {
    G_RT.indexWarmupTimer = 0;
    G_PAGE.dictionary.getEntriesIndex();
    G_PAGE.sentence.getIndex();
  }, 40);
}

function getStatsModelKey() {
  return `${G_RT.entriesVersion}|${G_RT.gVer}`;
}

function invalidateStatisticsCache() {
  G_RT.statsCacheKey = "";
  G_RT.statsCacheModel = null;
  G_RT.statsWorkerModelKey = "";
  G_RT.statsWorkerModel = null;
}

function requestStatsWorkerComputeNow() {
  if (!G_RT.statsWorkerReady || !G_RT.statsWorker || G_APP.s.entries.length < STATS_WORKER_MIN_ENTRIES) {
    return;
  }
  const versionKey = getStatsModelKey();
  G_RT.latestStatsWorkerRequestId += 1;
  const requestId = G_RT.latestStatsWorkerRequestId;
  G_RT.statsWorkerRequestId = requestId;
  try {
    G_RT.statsWorker.postMessage({
      type: "computeStats",
      requestId,
      versionKey,
      entries: G_APP.s.entries.map((entry) => ({
        id: entry.id,
        word: entry.word,
        labels: entry.labels,
        favorite: Boolean(entry.favorite),
        archivedAt: entry.archivedAt || null,
        mode: entry.mode,
        updatedAt: entry.updatedAt,
        usageCount: Number(entry.usageCount) || 0
      })),
      nodes: G_APP.s.sentenceGraph.nodes.map((node) => ({
        entryId: node.entryId || ""
      })),
      graphLinks: G_APP.s.sentenceGraph.links.length
    });
  } catch {
    G_RT.statsWorkerReady = false;
  }
}

function scheduleStatsWorkerCompute() {
  if (!G_RT.statsWorkerTask) {
    return;
  }
  G_RT.statsWorkerTask.schedule();
}

function initializeStatsWorker() {
  if (typeof Worker !== "function") {
    return;
  }
  try {
    G_RT.statsWorker = new Worker("modules/stats-worker.js");
  } catch {
    G_RT.statsWorker = null;
    G_RT.statsWorkerReady = false;
    return;
  }
  G_RT.statsWorkerReady = true;
  G_RT.statsWorker.onmessage = (event) => {
    const payload = event?.data && typeof event.data === "object" ? event.data : {};
    if (payload.type === "statsError") {
      recordDiagnosticError(
        "stats_worker_error",
        cleanText(payload.message || "Unknown stats worker error.", 300),
        "G_RT.statsWorker"
      );
      return;
    }
    if (payload.type !== "statsResult") {
      return;
    }
    const requestId = Number(payload.requestId) || 0;
    if (requestId < G_RT.statsWorkerRequestId) {
      return;
    }
    G_RT.statsWorkerRequestId = requestId;
    G_RT.statsWorkerModelKey = cleanText(payload.versionKey, 80);
    G_RT.statsWorkerModel = payload.model && typeof payload.model === "object" ? payload.model : null;
    (G_APP.s.activeView === VIEW_STATISTICS) && (renderStatisticsView());
  };
  G_RT.statsWorker.onerror = (error) => {
    G_RT.statsWorkerReady = false;
    recordDiagnosticError("stats_worker_failed", cleanText(String(error?.message || error), 300), "G_RT.statsWorker");
  };
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
  if (!window.dictionaryAPI?.saveUniverseCache) {
    return;
  }
  (G_RT.uCacheSaveTimer) && (window.clearTimeout(G_RT.uCacheSaveTimer));
  G_RT.uCacheSaveTimer = window.setTimeout(async () => {
    G_RT.uCacheSaveTimer = 0;
    try {
      await window.dictionaryAPI.saveUniverseCache(buildUniverseCachePayload());
    } catch (error) {
      recordDiagnosticError("universe_cache_save_failed", String(error?.message || error), "universeCache");
    }
  }, UNIVERSE_CACHE_SAVE_DELAY_MS);
}

async function loadUniverseCache() {
  if (!window.dictionaryAPI?.loadUniverseCache) {
    return;
  }
  try {
    const payload = await window.dictionaryAPI.loadUniverseCache();
    const source = payload && typeof payload === "object" ? payload : {};
    const configSource = source.config && typeof source.config === "object" ? source.config : {};
    const bookmarksSource = Array.isArray(source.bookmarks) ? source.bookmarks : [];
    G_UNI.sel.sets = normalizeUniverseCustomSearchSets(configSource.G_UNI.sel.sets);
    G_UNI.sel.activeSetId = cleanText(configSource.activeCustomSetId, MAX.WORD);
    const mergedConfig = normalizeConfig({
      ...configSource,
      renderMode: UNIVERSE_VIEW_MODE_WEBGL,
      bookmarks: bookmarksSource
    });
    G_UNI.cfg = mergedConfig;
    G_PAGE.universe.syncControls();
    updateUniverseBookmarkSelect();
    syncCanvasVisibility();

    const cachedGraph = source.graph && typeof source.graph === "object" ? normalizeUniverseGraph(source.graph) : null;
    const cacheModelKey = cleanText(source.modelKey, 200);
    const cacheDatasetSignature = cleanText(source.datasetSignature, 120000);
    const currentModelKey = getUniverseModelKey();
    const currentDatasetSignature = getUniverseDatasetSignature(G_APP.s.entries);
    if (
      cachedGraph &&
      cachedGraph.nodes.length > 0 &&
      cacheModelKey === currentModelKey &&
      cacheDatasetSignature === currentDatasetSignature
    ) {
      G_UNI.graph = cachedGraph;
      G_RT.uGraphKey = currentModelKey;
      G_RT.uDataSig = currentDatasetSignature;
      clearProjectionCache();
      rebuildUniverseNodeIndexes();
      clearPathHighlights();
      syncSelectionWithEntry(G_APP.s.selectedEntryId || "");
      if (G_UNI.sel.activeSetId) {
        applyCustomSet(G_UNI.sel.activeSetId, {
          announce: false,
          center: false
        });
      }
      G_PAGE.universe.renderSummary();
      G_PAGE.universe.reqRender();
    }
    G_PAGE.universe.renderCluster();
  } catch (error) {
    recordDiagnosticError("universe_cache_load_failed", String(error?.message || error), "universeCache");
  }
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
  const versionKey = getUniverseModelKey();
  const datasetSignature = getUniverseDatasetSignature(G_APP.s.entries);
  if (G_RT.uGraphKey === versionKey && G_RT.uDataSig === datasetSignature) {
    return;
  }

  if (!G_RT.uWorkerReady || !G_RT.uWorker) {
    G_UNI.graph = normalizeUniverseGraph(buildUniverseGraphFallback());
    G_RT.uGraphKey = versionKey;
    G_RT.uDataSig = datasetSignature;
    clearProjectionCache();
    rebuildUniverseNodeIndexes();
    clearPathHighlights();
    if (
      !G_UNI.sel.activeSetId ||
      !applyCustomSet(G_UNI.sel.activeSetId, {
        announce: false,
        center: false
      })
    ) {
      syncSelectionWithEntry(G_APP.s.selectedEntryId || "");
    }
    queueCacheSave();
    (G_APP.s.activeView === VIEW_UNIVERSE) && (G_PAGE.universe.renderSummary(), G_PAGE.universe.reqRender());
    return;
  }

  G_RT.uWorkerReqLatest += 1;
  const requestId = G_RT.uWorkerReqLatest;
  G_RT.uWorkerReqId = requestId;
  (G_APP.s.activeView === VIEW_UNIVERSE && G_DOM.universeSummary instanceof HTMLElement) && (G_DOM.universeSummary.textContent = "Building word universe...");
  try {
    G_RT.uWorker.postMessage({
      type: "buildUniverseGraph",
      requestId,
      versionKey,
      entries: G_APP.s.entries.map((entry) => ({
        id: entry.id,
        word: entry.word,
        labels: entry.labels,
        mode: normalizeEntryMode(entry.mode),
        usageCount: Number(entry.usageCount) || 0,
        favorite: Boolean(entry.favorite),
        archivedAt: entry.archivedAt || null
      })),
      options: {
        minWordLength: G_UNI.cfg.minWordLength,
        maxWordLength: G_UNI.cfg.maxWordLength,
        maxNodes: G_UNI.cfg.maxNodes,
        maxEdges: G_UNI.cfg.maxEdges,
        favoritesOnly: G_UNI.cfg.favoritesOnly,
        labelFilter: G_UNI.cfg.labelFilter,
        edgeModes: {
          contains: G_UNI.cfg.edgeModes.contains,
          prefix: G_UNI.cfg.edgeModes.prefix,
          suffix: G_UNI.cfg.edgeModes.suffix,
          stem: G_UNI.cfg.edgeModes.stem,
          sameLabel: G_UNI.cfg.edgeModes.sameLabel
        },
        seed: 1337
      }
    });
    G_RT.uDataSig = datasetSignature;
  } catch (error) {
    G_RT.uWorkerReady = false;
    recordDiagnosticError(
      "universe_worker_post_failed",
      cleanText(String(error?.message || error), 320),
      "G_RT.uWorker"
    );
  }
}

function scheduleGraphBuild() {
  if (!G_RT.uBuildTask) {
    return;
  }
  G_RT.uBuildTask.schedule();
}

function initializeUniverseWorker() {
  if (typeof Worker !== "function") {
    return;
  }
  try {
    G_RT.uWorker = new Worker("modules/word-universe-worker.js");
  } catch {
    G_RT.uWorker = null;
    G_RT.uWorkerReady = false;
    return;
  }
  G_RT.uWorkerReady = true;
  G_RT.uWorker.onmessage = (event) => {
    const payload = event?.data && typeof event.data === "object" ? event.data : {};
    if (payload.type === "universeGraphError") {
      recordDiagnosticError(
        "universe_worker_error",
        cleanText(payload.message || "Universe graph worker error.", 320),
        "G_RT.uWorker"
      );
      return;
    }
    if (payload.type !== "universeGraphResult") {
      return;
    }
    const requestId = Number(payload.requestId) || 0;
    if (requestId < G_RT.uWorkerReqId) {
      return;
    }
    G_RT.uWorkerReqId = requestId;
    G_RT.uGraphKey = cleanText(payload.versionKey, 200);
    const rawGraph = payload.graph && typeof payload.graph === "object" ? payload.graph : null;
    if (!rawGraph) {
      return;
    }
    G_UNI.graph = normalizeUniverseGraph(rawGraph);
    clearProjectionCache();
    rebuildUniverseNodeIndexes();
    clearPathHighlights();
    G_UNI.view.hoverNodeIndex = -1;
    if (
      !G_UNI.sel.activeSetId ||
      !applyCustomSet(G_UNI.sel.activeSetId, {
        announce: false,
        center: false
      })
    ) {
      syncSelectionWithEntry(G_APP.s.selectedEntryId || "");
    }
    queueCacheSave();
    (G_APP.s.activeView === VIEW_UNIVERSE) && (G_PAGE.universe.renderSummary(), G_PAGE.universe.reqRender());
  };
  G_RT.uWorker.onerror = (error) => {
    G_RT.uWorkerReady = false;
    recordDiagnosticError("universe_worker_failed", cleanText(String(error?.message || error), 320), "G_RT.uWorker");
  };
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

function getEntryById(entryId) {
  const id = cleanText(entryId, MAX.WORD);
  if (!id) {
    return null;
  }
  return G_PAGE.dictionary.getEntriesIndex().byId.get(id) || null;
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

function buildSentencePreviewLines(limit = 12) {
  const nodesById = G_PAGE.sentence.getIndex().nodeById;
  if (nodesById.size === 0) {
    return [];
  }

  const startNodes = G_APP.s.sentenceGraph.nodes
    .filter((node) => getIncomingNodeIds(node.id).length === 0)
    .sort((a, b) => a.y - b.y || a.x - b.x);

  const seeds =
    startNodes.length > 0 ? startNodes : [...G_APP.s.sentenceGraph.nodes].sort((a, b) => a.y - b.y || a.x - b.x);
  const lines = [];

  const walk = (nodeId, words, visited) => {
    if (lines.length >= limit) {
      return;
    }

    const node = nodesById.get(nodeId);
    if (!node) {
      return;
    }

    const nextWords = [...words, node.word];
    const nextVisited = new Set(visited);
    nextVisited.add(nodeId);

    const outgoing = getOutgoingNodeIds(nodeId)
      .filter((candidate) => !nextVisited.has(candidate))
      .map((candidate) => nodesById.get(candidate))
      .filter(Boolean)
      .sort((a, b) => a.x - b.x || a.y - b.y)
      .map((candidate) => candidate.id);

    if (outgoing.length === 0) {
      lines.push(nextWords.join(" "));
      return;
    }

    outgoing.forEach((nextNodeId) => {
      walk(nextNodeId, nextWords, nextVisited);
    });
  };

  seeds.forEach((seed) => {
    if (lines.length >= limit) {
      return;
    }
    walk(seed.id, [], new Set());
  });

  return unique(lines).slice(0, limit);
}

function analyzeGraphQuality() {
  const nodes = G_APP.s.sentenceGraph.nodes;
  const links = G_APP.s.sentenceGraph.links;
  if (nodes.length === 0) {
    return {
      islands: 0,
      cycles: 0,
      orphanedNodes: 0
    };
  }
  const nodeIds = new Set(nodes.map((node) => node.id));
  const outgoing = new Map();
  const incomingCount = new Map();
  nodes.forEach((node) => {
    outgoing.set(node.id, []);
    incomingCount.set(node.id, 0);
  });
  links.forEach((link) => {
    if (!nodeIds.has(link.fromNodeId) || !nodeIds.has(link.toNodeId)) {
      return;
    }
    outgoing.get(link.fromNodeId).push(link.toNodeId);
    incomingCount.set(link.toNodeId, (incomingCount.get(link.toNodeId) || 0) + 1);
  });

  const undirected = new Map();
  nodes.forEach((node) => undirected.set(node.id, new Set()));
  links.forEach((link) => {
    if (!nodeIds.has(link.fromNodeId) || !nodeIds.has(link.toNodeId)) {
      return;
    }
    undirected.get(link.fromNodeId).add(link.toNodeId);
    undirected.get(link.toNodeId).add(link.fromNodeId);
  });
  const visited = new Set();
  let components = 0;
  nodes.forEach((node) => {
    if (visited.has(node.id)) {
      return;
    }
    components += 1;
    const stack = [node.id];
    while (stack.length > 0) {
      const current = stack.pop();
      if (visited.has(current)) {
        continue;
      }
      visited.add(current);
      undirected.get(current).forEach((next) => {
        (!visited.has(next)) && (stack.push(next));
      });
    }
  });

  let cycleCount = 0;
  const perm = new Set();
  const temp = new Set();
  const visit = (nodeId) => {
    if (perm.has(nodeId)) {
      return;
    }
    if (temp.has(nodeId)) {
      cycleCount += 1;
      return;
    }
    temp.add(nodeId);
    (outgoing.get(nodeId) || []).forEach((nextId) => visit(nextId));
    temp.delete(nodeId);
    perm.add(nodeId);
  };
  nodes.forEach((node) => visit(node.id));

  const orphanedNodes = nodes.filter((node) => !node.entryId).length;
  return {
    islands: Math.max(0, components - 1),
    cycles: cycleCount,
    orphanedNodes
  };
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

function collectWordSuggestionsForContext(contextNode, posIndex, limit = 12) {
  const suggestions = [];
  const seen = new Set();

  const pushSuggestion = (word, entryId = "", reason = "") => {
    const normalizedWord = cleanText(word, MAX.WORD);
    if (!normalizedWord) {
      return;
    }
    const key = normalizeWordLower(normalizedWord);
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    suggestions.push({
      kind: "word",
      label: normalizedWord,
      reason,
      words: [normalizedWord],
      entryIds: [cleanText(entryId, MAX.WORD)]
    });
  };

  if (!contextNode) {
    return suggestions;
  }

  if (contextNode.id) {
    getOutgoingNodeIds(contextNode.id)
      .map((nodeId) => G_PAGE.sentence.getNode(nodeId))
      .filter(Boolean)
      .forEach((node) => {
        pushSuggestion(node.word, node.entryId, "next");
      });
  }

  collectLinkedTargetsForWord(normalizeWordLower(contextNode.word)).forEach((item) => {
    pushSuggestion(item.word, item.entryId, item.reason);
  });

  const contextEntry = getEntryForGraphNode(contextNode);
  const contextPos = getPrimaryPartOfSpeech(contextEntry);
  const preferredPos = POS_FOLLOW_RULES[contextPos] || ["noun", "verb", "adjective", "adverb", "pronoun"];

  preferredPos.forEach((pos) => {
    getEntriesForPartOfSpeech(posIndex, pos)
      .slice(0, 8)
      .forEach((entry) => {
        let word = entry.word;
        (pos === "verb" && (contextPos === "noun" || contextPos === "pronoun")) && (word = inflectVerbForSubject(entry.word, contextNode.word, contextPos));
        if (normalizeWordLower(word) === normalizeWordLower(contextNode.word)) {
          return;
        }
        pushSuggestion(word, entry.id, pos);
      });
  });

  if (suggestions.length < limit) {
    G_APP.s.entries.slice(0, 40).forEach((entry) => {
      if (normalizeWordLower(entry.word) === normalizeWordLower(contextNode.word)) {
        return;
      }
      pushSuggestion(entry.word, entry.id, "word");
    });
  }

  return suggestions.slice(0, limit);
}

function buildPhraseFromPattern(pattern, posIndex, contextNode = null) {
  if (!Array.isArray(pattern) || pattern.length === 0) {
    return null;
  }

  const words = [];
  const entryIds = [];
  const used = new Set();
  const contextEntry = contextNode ? getEntryForGraphNode(contextNode) : null;
  const contextPos = getPrimaryPartOfSpeech(contextEntry);

  for (let index = 0; index < pattern.length; index += 1) {
    const pos = cleanText(pattern[index], 30).toLowerCase();
    if (!pos) {
      return null;
    }

    const entry = getEntriesForPartOfSpeech(posIndex, pos).find(
      (candidate) => !used.has(normalizeWordLower(candidate.word))
    );
    if (!entry) {
      return null;
    }

    let word = entry.word;
    (index === 0 && pos === "verb" && contextNode && (contextPos === "noun" || contextPos === "pronoun")) && (word = inflectVerbForSubject(entry.word, contextNode.word, contextPos));

    words.push(word);
    entryIds.push(entry.id);
    used.add(normalizeWordLower(word));
  }

  return {
    words,
    entryIds
  };
}

function collectPhraseSuggestionsForContext(contextNode, posIndex, limit = 6) {
  const phrases = [];
  const seen = new Set();

  const pushPhrase = (words, entryIds, reason) => {
    const normalizedWords = (Array.isArray(words) ? words : [])
      .map((word) => cleanText(word, MAX.WORD))
      .filter(Boolean);
    if (normalizedWords.length < 2) {
      return;
    }
    const key = normalizedWords.map(normalizeWordLower).join(" ");
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    phrases.push({
      kind: "phrase",
      label: normalizedWords.join(" "),
      reason,
      words: normalizedWords,
      entryIds: Array.isArray(entryIds) ? entryIds.map((entryId) => cleanText(entryId, MAX.WORD)) : []
    });
  };

  if (contextNode?.id) {
    const byId = G_PAGE.sentence.getIndex().nodeById;
    const traverse = (nodeId, depth, words, entryIds, visited) => {
      if (depth <= 0) {
        return;
      }

      const outgoing = getOutgoingNodeIds(nodeId)
        .map((targetId) => byId.get(targetId))
        .filter(Boolean)
        .sort((left, right) => left.x - right.x || left.y - right.y);

      outgoing.forEach((nextNode) => {
        if (visited.has(nextNode.id)) {
          return;
        }
        const nextWords = [...words, nextNode.word];
        const nextEntryIds = [...entryIds, nextNode.entryId || ""];
        (nextWords.length >= 2) && (pushPhrase(nextWords, nextEntryIds, "graph phrase"));
        traverse(nextNode.id, depth - 1, nextWords, nextEntryIds, new Set([...visited, nextNode.id]));
      });
    };

    traverse(contextNode.id, 4, [], [], new Set([contextNode.id]));
  }

  if (contextNode) {
    const contextEntry = getEntryForGraphNode(contextNode);
    const contextPos = getPrimaryPartOfSpeech(contextEntry);
    const firstOptions = (POS_FOLLOW_RULES[contextPos] || []).slice(0, 3);

    firstOptions.forEach((firstPos) => {
      const secondPos = (POS_FOLLOW_RULES[firstPos] || ["noun"])[0];
      const thirdPos = (POS_FOLLOW_RULES[secondPos] || [])[0];
      const pattern = thirdPos ? [firstPos, secondPos, thirdPos] : [firstPos, secondPos];
      const phrase = buildPhraseFromPattern(pattern, posIndex, contextNode);
      if (phrase) {
        pushPhrase(phrase.words, phrase.entryIds, "phrase");
      }
    });
  }

  if (phrases.length < limit) {
    PHRASE_PATTERNS.forEach((pattern) => {
      const phrase = buildPhraseFromPattern(pattern, posIndex, contextNode);
      if (phrase) {
        pushPhrase(phrase.words, phrase.entryIds, "template");
      }
    });
  }

  return phrases.slice(0, limit);
}

function collectStarterWordSuggestions(posIndex, limit = 10) {
  const starters = [];
  const seen = new Set();

  const push = (entry, reason) => {
    if (!entry) {
      return;
    }
    const key = normalizeWordLower(entry.word);
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    starters.push({
      kind: "word",
      label: entry.word,
      reason,
      words: [entry.word],
      entryIds: [entry.id]
    });
  };

  ["article", "pronoun", "noun", "verb", "adjective"].forEach((pos) => {
    getEntriesForPartOfSpeech(posIndex, pos)
      .slice(0, 4)
      .forEach((entry) => {
        push(entry, pos);
      });
  });

  if (starters.length < limit) {
    G_APP.s.entries.slice(0, 30).forEach((entry) => {
      push(entry, "word");
    });
  }

  return starters.slice(0, limit);
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

function buildAutoCompletePlan(startNode, posIndex, maxSteps = AUTO_COMPLETE_STEPS) {
  if (!startNode) {
    return [];
  }

  const plan = [];
  const seen = new Set([normalizeWordLower(startNode.word)]);
  let context = startNode;

  for (let step = 0; step < maxSteps; step += 1) {
    const candidates = collectWordSuggestionsForContext(context, posIndex, 10).filter((item) => {
      const word = item.words[0] || "";
      return !seen.has(normalizeWordLower(word));
    });

    const next = candidates[0];
    if (!next) {
      break;
    }

    const nextWord = next.words[0];
    const nextEntryId = next.entryIds[0] || "";
    plan.push({
      word: nextWord,
      entryId: nextEntryId
    });
    seen.add(normalizeWordLower(nextWord));
    context = {
      id: "",
      word: nextWord,
      entryId: nextEntryId
    };

    const nextEntry = nextEntryId ? getEntryById(nextEntryId) : null;
    const nextPos = getPrimaryPartOfSpeech(nextEntry);
    if (plan.length >= 3 && (nextPos === "noun" || nextPos === "interjection")) {
      break;
    }
  }

  return plan;
}

function getSentenceSuggestions(limit = 18) {
  if (G_APP.s.entries.length === 0) {
    return [];
  }

  const cacheKey = `${G_RT.entriesVersion}|${G_RT.gVer}|${G_APP.s.selectedGraphNodeId || ""}|${limit}`;
  if (G_RT.sentenceSugKey === cacheKey) {
    return G_RT.sentenceSugVal;
  }

  const posIndex = buildEntriesByPartOfSpeechIndex();
  const selectedNode = G_PAGE.sentence.getNode(G_APP.s.selectedGraphNodeId);
  const suggestions = [];

  const pushSuggestion = (item) => {
    if (!item || !Array.isArray(item.words) || item.words.length === 0) {
      return;
    }
    suggestions.push(item);
  };

  if (selectedNode) {
    const autoPlan = buildAutoCompletePlan(selectedNode, posIndex);
    if (autoPlan.length > 0) {
      pushSuggestion({
        kind: "auto",
        label: `Auto-complete +${autoPlan.length}`,
        reason: "sentence flow",
        words: autoPlan.map((item) => item.word),
        entryIds: autoPlan.map((item) => item.entryId)
      });
    }

    collectWordSuggestionsForContext(selectedNode, posIndex, 12).forEach(pushSuggestion);
    collectPhraseSuggestionsForContext(selectedNode, posIndex, 8).forEach(pushSuggestion);
  } else {
    collectStarterWordSuggestions(posIndex, 12).forEach(pushSuggestion);
    collectStarterPhraseSuggestions(posIndex, 4).forEach(pushSuggestion);
  }

  const nextSuggestions = suggestions.slice(0, limit);
  G_RT.sentenceSugKey = cacheKey;
  G_RT.sentenceSugVal = nextSuggestions;
  return nextSuggestions;
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

function addSuggestedNode(word, entryId = "") {
  const fromNodeId = G_APP.s.selectedGraphNodeId;
  const fromNode = G_PAGE.sentence.getNode(fromNodeId);

  const offsetX = fromNode ? fromNode.x + 240 : undefined;
  const offsetY = fromNode ? fromNode.y : undefined;
  const created = addNodeToSentenceGraph(word, entryId, offsetX, offsetY, {
    render: false,
    autosave: false,
    updateStatus: false
  });
  if (!created) {
    return;
  }

  if (fromNodeId) {
    addSentenceLink(fromNodeId, created.id, {
      render: false,
      autosave: false,
      updateStatus: false
    });
  }

  G_APP.s.selectedGraphNodeId = created.id;
  clearPendingLink();
  setSentenceStatus(`Added: ${created.word}`);
  scheduleAutosave();
  G_PAGE.sentence.reqRender();
}

function addSuggestedPhrase(words, entryIds = [], options = {}) {
  const { statusPrefix = "Added phrase" } = options;
  const normalizedWords = (Array.isArray(words) ? words : []).map((word) => cleanText(word, MAX.WORD)).filter(Boolean);
  if (normalizedWords.length === 0) {
    return;
  }

  let fromNodeId = G_APP.s.selectedGraphNodeId;
  let anchor = G_PAGE.sentence.getNode(fromNodeId);
  let lastNode = null;

  normalizedWords.forEach((word, index) => {
    const created = addNodeToSentenceGraph(
      word,
      Array.isArray(entryIds) ? cleanText(entryIds[index], MAX.WORD) : "",
      anchor ? anchor.x + 240 : undefined,
      anchor ? anchor.y + ((index % 2) * 58 - 20) : undefined,
      {
        render: false,
        autosave: false,
        updateStatus: false
      }
    );
    if (!created) {
      return;
    }

    if (fromNodeId) {
      addSentenceLink(fromNodeId, created.id, {
        render: false,
        autosave: false,
        updateStatus: false
      });
    }

    fromNodeId = created.id;
    anchor = created;
    lastNode = created;
  });

  if (!lastNode) {
    return;
  }

  G_APP.s.selectedGraphNodeId = lastNode.id;
  clearPendingLink();
  setSentenceStatus(`${statusPrefix}: ${normalizedWords.join(" ")}`);
  scheduleAutosave();
  G_PAGE.sentence.reqRender();
}

function autoCompleteFromSelectedNode(precomputedWords = [], precomputedEntryIds = []) {
  const selectedNode = G_PAGE.sentence.getNode(G_APP.s.selectedGraphNodeId);
  if (!selectedNode) {
    setSentenceStatus("Select a node first to auto-complete.");
    return;
  }

  const words = Array.isArray(precomputedWords) ? precomputedWords.filter(Boolean) : [];
  if (words.length > 0) {
    addSuggestedPhrase(words, precomputedEntryIds, {
      statusPrefix: "Auto-complete"
    });
    return;
  }

  const posIndex = buildEntriesByPartOfSpeechIndex();
  const plan = buildAutoCompletePlan(selectedNode, posIndex);
  if (plan.length === 0) {
    setSentenceStatus("No auto-complete path available yet.");
    return;
  }

  addSuggestedPhrase(
    plan.map((item) => item.word),
    plan.map((item) => item.entryId),
    {
      statusPrefix: "Auto-complete"
    }
  );
}

function renderSentenceGraph(options = {}) {
  const startedAt = performance.now();
  const { refreshPreview = true, refreshSuggestions = true } = options;
  if (
    !G_DOM.sentenceNodes ||
    !G_DOM.sentenceEdges ||
    !G_DOM.sentenceSuggestions ||
    !G_DOM.sentencePreview
  ) {
    return;
  }

  syncGraphNodeWordsFromEntries();

  G_DOM.sentenceNodes.innerHTML = "";
  G_DOM.sentenceEdges.innerHTML = "";
  const stageWidthText = `${GRAPH_STAGE_WIDTH}px`;
  const stageHeightText = `${GRAPH_STAGE_HEIGHT}px`;
  (G_DOM.sentenceStage.style.width !== stageWidthText) && (G_DOM.sentenceStage.style.width = stageWidthText);
  (G_DOM.sentenceStage.style.height !== stageHeightText) && (G_DOM.sentenceStage.style.height = stageHeightText);
  const graphViewBox = `0 0 ${GRAPH_STAGE_WIDTH} ${GRAPH_STAGE_HEIGHT}`;
  (G_DOM.sentenceEdges.getAttribute("viewBox") !== graphViewBox) && (G_DOM.sentenceEdges.setAttribute("viewBox", graphViewBox));

  const nodeById = G_PAGE.sentence.getIndex().nodeById;
  const nodesFragment = document.createDocumentFragment();
  G_APP.s.sentenceGraph.nodes.forEach((node) => {
    const nodeEl = document.createElement("div");
    nodeEl.className = "sentenceNode";
    (node.id === G_APP.s.selectedGraphNodeId) && (nodeEl.classList.add("selected"));
    (node.id === G_APP.s.pendingLinkFromNodeId) && (nodeEl.classList.add("pending"));
    (G_APP.s.graphLockEnabled || node.locked) && (nodeEl.classList.add("locked"));
    nodeEl.dataset.nodeId = node.id;
    nodeEl.style.left = `${node.x}px`;
    nodeEl.style.top = `${node.y}px`;

    const inputPort = document.createElement("span");
    inputPort.className = "sentencePort";
    inputPort.dataset.port = "in";
    inputPort.dataset.nodeId = node.id;

    const word = document.createElement("span");
    word.className = "sentenceNodeWord";
    word.dataset.nodeId = node.id;
    word.textContent = node.word;

    const outputPort = document.createElement("span");
    outputPort.className = "sentencePort";
    outputPort.dataset.port = "out";
    outputPort.dataset.nodeId = node.id;
    (G_APP.s.pendingLinkFromNodeId === node.id) && (outputPort.classList.add("active"));

    nodeEl.appendChild(inputPort);
    nodeEl.appendChild(word);
    nodeEl.appendChild(outputPort);
    nodesFragment.appendChild(nodeEl);
  });
  G_DOM.sentenceNodes.appendChild(nodesFragment);

  const edgesFragment = document.createDocumentFragment();
  G_APP.s.sentenceGraph.links.forEach((link) => {
    const from = nodeById.get(link.fromNodeId);
    const to = nodeById.get(link.toNodeId);
    if (!from || !to) {
      return;
    }

    const startX = from.x + GRAPH_NODE_WIDTH - 6;
    const startY = from.y + GRAPH_NODE_HEIGHT / 2;
    const endX = to.x + 6;
    const endY = to.y + GRAPH_NODE_HEIGHT / 2;
    const bend = Math.max(44, Math.abs(endX - startX) * 0.35);

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.classList.add("sentenceEdge");
    path.setAttribute(
      "d",
      `M ${startX} ${startY} C ${startX + bend} ${startY}, ${endX - bend} ${endY}, ${endX} ${endY}`
    );
    edgesFragment.appendChild(path);
  });
  G_DOM.sentenceEdges.appendChild(edgesFragment);

  (refreshPreview) && (renderSentencePreview());
  (refreshSuggestions) && (renderSentenceSuggestions());
  renderMiniMap();
  (G_APP.s.activeView === VIEW_STATISTICS) && (renderStatisticsView());
  recordDiagnosticPerf("render_graph_ms", performance.now() - startedAt);
}

function renderMiniMap() {
  if (
    !(G_DOM.graphMiniMapSvg instanceof SVGElement) ||
    !(G_DOM.graphMiniMapViewport instanceof HTMLElement) ||
    !(G_DOM.sentenceViewport instanceof HTMLElement)
  ) {
    return;
  }

  const miniSvg = G_DOM.graphMiniMapSvg;
  const miniMapKey = `${G_RT.gVer}|${G_RT.gLayoutVer}|${G_APP.s.selectedGraphNodeId || ""}`;
  if (G_RT.gMiniKey !== miniMapKey) {
    G_RT.gMiniKey = miniMapKey;
    miniSvg.innerHTML = "";
    const miniFragment = document.createDocumentFragment();

    G_APP.s.sentenceGraph.links.forEach((link) => {
      const from = G_PAGE.sentence.getNode(link.fromNodeId);
      const to = G_PAGE.sentence.getNode(link.toNodeId);
      if (!from || !to) {
        return;
      }
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", String(from.x + GRAPH_NODE_WIDTH / 2));
      line.setAttribute("y1", String(from.y + GRAPH_NODE_HEIGHT / 2));
      line.setAttribute("x2", String(to.x + GRAPH_NODE_WIDTH / 2));
      line.setAttribute("y2", String(to.y + GRAPH_NODE_HEIGHT / 2));
      line.setAttribute("stroke", "rgba(170, 160, 245, 0.7)");
      line.setAttribute("stroke-width", "8");
      miniFragment.appendChild(line);
    });

    const densityCells = new Map();
    G_APP.s.sentenceGraph.nodes.forEach((node) => {
      const cellX = Math.floor(node.x / 220);
      const cellY = Math.floor(node.y / 120);
      const key = `${cellX}:${cellY}`;
      densityCells.set(key, (densityCells.get(key) || 0) + 1);
    });
    densityCells.forEach((count, key) => {
      if (count < 3) {
        return;
      }
      const [cellX, cellY] = key.split(":").map(Number);
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", String(cellX * 220 + 110));
      circle.setAttribute("cy", String(cellY * 120 + 60));
      circle.setAttribute("r", String(Math.min(56, 16 + count * 4)));
      circle.setAttribute("fill", "rgba(85,230,190,0.18)");
      miniFragment.appendChild(circle);
    });

    G_APP.s.sentenceGraph.nodes.forEach((node) => {
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", String(node.x));
      rect.setAttribute("y", String(node.y));
      rect.setAttribute("width", String(GRAPH_NODE_WIDTH));
      rect.setAttribute("height", String(GRAPH_NODE_HEIGHT));
      rect.setAttribute("rx", "20");
      rect.setAttribute(
        "fill",
        node.id === G_APP.s.selectedGraphNodeId ? "rgba(99,169,255,0.95)" : "rgba(95,120,165,0.85)"
      );
      miniFragment.appendChild(rect);
    });
    miniSvg.appendChild(miniFragment);
  }

  const viewport = G_DOM.sentenceViewport;
  const leftRatio = viewport.scrollLeft / GRAPH_STAGE_WIDTH;
  const topRatio = viewport.scrollTop / GRAPH_STAGE_HEIGHT;
  const widthRatio = viewport.clientWidth / GRAPH_STAGE_WIDTH;
  const heightRatio = viewport.clientHeight / GRAPH_STAGE_HEIGHT;
  G_DOM.graphMiniMapViewport.style.left = `${leftRatio * 100}%`;
  G_DOM.graphMiniMapViewport.style.top = `${topRatio * 100}%`;
  G_DOM.graphMiniMapViewport.style.width = `${Math.min(100, widthRatio * 100)}%`;
  G_DOM.graphMiniMapViewport.style.height = `${Math.min(100, heightRatio * 100)}%`;
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
  return {
    version: 4,
    labels: [...G_APP.s.labels],
    entries: G_APP.s.entries.map((entry) => ({
      id: entry.id,
      word: entry.word,
      definition: entry.definition,
      labels: [...entry.labels],
      favorite: Boolean(entry.favorite),
      archivedAt: entry.archivedAt || null,
      mode: normalizeEntryMode(entry.mode),
      language: normalizeEntryLanguage(entry.language || ""),
      usageCount: Math.max(0, Math.floor(Number(entry.usageCount) || 0)),
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt
    })),
    sentenceGraph: {
      nodes: G_APP.s.sentenceGraph.nodes.map((node) => ({
        id: node.id,
        entryId: node.entryId,
        word: node.word,
        locked: Boolean(node.locked),
        x: node.x,
        y: node.y
      })),
      links: G_APP.s.sentenceGraph.links.map((link) => ({
        id: link.id,
        fromNodeId: link.fromNodeId,
        toNodeId: link.toNodeId
      }))
    },
    history: G_APP.s.history.map((checkpoint) => ({
      id: checkpoint.id,
      reason: checkpoint.reason,
      createdAt: checkpoint.createdAt,
      labels: checkpoint.labels,
      entries: checkpoint.entries,
      sentenceGraph: checkpoint.sentenceGraph
    })),
    graphLockEnabled: G_APP.s.graphLockEnabled,
    localAssistEnabled: G_APP.s.localAssistEnabled,
    diagnostics: normalizeDiagnostics(G_APP.s.diagnostics),
    lastSavedAt: G_APP.s.lastSavedAt
  };
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

function clearAutosaveTimer() {
  (G_RT.autosaveTask) && (G_RT.autosaveTask.clear());
}

function clearLookupTimer() {
  (G_RT.lookupTask) && (G_RT.lookupTask.clear());
}

function clearEntryCommitTimer() {
  (G_RT.entryCommitTask) && (G_RT.entryCommitTask.clear());
}

function clearTreeSearchTimer() {
  (G_RT.treeSearchTask) && (G_RT.treeSearchTask.clear());
}

function clearStatsWorkerTimer() {
  (G_RT.statsWorkerTask) && (G_RT.statsWorkerTask.clear());
}

function clearUniverseBuildTimer() {
  (G_RT.uBuildTask) && (G_RT.uBuildTask.clear());
}

function clearUniverseCacheSaveTimer(flush = false) {
  (G_RT.uCacheSaveTimer) && (window.clearTimeout(G_RT.uCacheSaveTimer), G_RT.uCacheSaveTimer = 0);
  if (flush && window.dictionaryAPI?.saveUniverseCache) {
    window.dictionaryAPI.saveUniverseCache(buildUniverseCachePayload()).catch(() => {});
  }
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
    const response = await window.dictionaryAPI.save(buildSnapshot());
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
  setHelperText(DEFAULT_HELPER_TEXT);
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
  setHelperText(near.length > 0 ? `${SELECTED_HELPER_TEXT} Similar: ${near.join(", ")}` : SELECTED_HELPER_TEXT);
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
    setHelperText(SAVED_NEXT_HELPER_TEXT);
    G_DOM.wordInput.focus();
  } else if (selectedEntry && !(advanceToNext && !wasEditing)) {
    ensureEntryVisible(selectedEntry);
    renderEditorForEntry(selectedEntry);
  } else if (advanceToNext && !wasEditing) {
    (selectedEntry) && (ensureEntryVisible(selectedEntry));
    renderEditorForNewEntry();
    setHelperText(SAVED_NEXT_HELPER_TEXT);
    G_DOM.wordInput.focus();
  } else {
    renderEditorForNewEntry();
  }

  G_PAGE.tree.reqRender();
  G_PAGE.sentence.reqRender();
  renderStatisticsView();
  if (localAssist.warnings.length > 0) {
    setHelperText(`${SELECTED_HELPER_TEXT} ${localAssist.warnings.join(" | ")}`);
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

function scheduleAutoCommitDraft(delayMs = AUTO_ENTRY_COMMIT_DELAY_MS) {
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

  if (!window.dictionaryAPI?.lookupDefinition) {
    setStatus("Lookup API unavailable.", true);
    return;
  }

  const requestId = ++G_RT.lookupRequestId;
  G_RT.lookupInFlightRequestId = requestId;
  setStatus(`Looking up "${word}"...`);

  try {
    const result = await window.dictionaryAPI.lookupDefinition(word);

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
      setHelperText(SAVED_NEXT_HELPER_TEXT);
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

function getTopTreeLabels() {
  const seen = new Set();
  const labels = [];
  TOP_TREE_LABELS.forEach((label) => {
    const normalized = normalizeLabel(label);
    if (!normalized || seen.has(normalized.toLowerCase())) {
      return;
    }
    seen.add(normalized.toLowerCase());
    labels.push(normalized);
  });
  G_APP.s.labels.forEach((label) => {
    const normalized = normalizeLabel(label);
    if (!normalized || seen.has(normalized.toLowerCase())) {
      return;
    }
    seen.add(normalized.toLowerCase());
    labels.push(normalized);
  });
  return labels.slice(0, 12);
}

function getTopLabelCount(label) {
  const normalized = normalizeLabel(label).toLowerCase();
  if (!normalized) {
    return 0;
  }
  const entriesIndex = G_PAGE.dictionary.getEntriesIndex();
  if (entriesIndex.labelCountsActive[normalized] !== undefined) {
    return entriesIndex.labelCountsActive[normalized] || 0;
  }
  const canonical = entriesIndex.sortedLabels.find((item) => item.toLowerCase() === normalized);
  if (!canonical) {
    return 0;
  }
  return entriesIndex.labelCountsActive[canonical] || 0;
}

function selectTopLabel(label) {
  const normalized = normalizeLabel(label);
  if (!normalized) {
    return;
  }
  ensureLabelExists(normalized);
  G_APP.s.treeLabelFilter = normalized;
  G_APP.s.selectedTreeLabel = normalized;
  G_APP.s.selectedTreeGroupKey = keyForLabel(normalized);
  (!G_APP.s.selectedEntryId && G_DOM.labelsInput instanceof HTMLInputElement) && (G_DOM.labelsInput.value = normalized);
  setQuickCaptureStatus(`Label filter set: ${normalized}`);
  G_PAGE.tree.reqRender();
}

function selectTopLabelByIndex(index) {
  const labels = getTopTreeLabels();
  const value = labels[index];
  if (!value) {
    return;
  }
  selectTopLabel(value);
}

function renderTopLabelBar() {
  if (!(G_DOM.topLabelBar instanceof HTMLElement)) {
    return;
  }
  G_DOM.topLabelBar.innerHTML = "";
  const allChip = document.createElement("span");
  allChip.className = `toolAction topLabelChip${G_APP.s.treeLabelFilter === LABEL_FILTER_ALL ? " active" : ""}`;
  const allCount = G_PAGE.dictionary.getEntriesIndex().activeEntriesCount || 0;
  allChip.textContent = `All (${allCount})`;
  allChip.setAttribute("role", "button");
  allChip.tabIndex = 0;
  const onAllSelect = () => {
    G_APP.s.treeLabelFilter = LABEL_FILTER_ALL;
    G_APP.s.selectedTreeLabel = "";
    G_APP.s.selectedTreeGroupKey = "";
    G_PAGE.tree.reqRender();
  };
  allChip.addEventListener("click", onAllSelect);
  allChip.addEventListener("keydown", (event) => {
    (event.key === "Enter" || event.key === " ") && (event.preventDefault(), onAllSelect());
  });
  G_DOM.topLabelBar.appendChild(allChip);

  getTopTreeLabels().forEach((label, index) => {
    const chip = document.createElement("span");
    chip.className = `toolAction topLabelChip${G_APP.s.treeLabelFilter === label ? " active" : ""}`;
    chip.textContent = `${label} (${getTopLabelCount(label)})`;
    chip.setAttribute("role", "button");
    chip.title = `Alt+${index + 1}`;
    chip.tabIndex = 0;
    const onLabelSelect = () => {
      selectTopLabel(label);
    };
    chip.addEventListener("click", onLabelSelect);
    chip.addEventListener("keydown", (event) => {
      (event.key === "Enter" || event.key === " ") && (event.preventDefault(), onLabelSelect());
    });
    G_DOM.topLabelBar.appendChild(chip);
  });
}

function parseQuickBatchWords(rawText) {
  return unique(
    String(rawText || "")
      .split(/[\n,;]+/)
      .map((value) => cleanText(value, MAX.WORD))
      .filter(Boolean)
  );
}

function parseSentenceInputWords(rawText) {
  return String(rawText || "")
    .replace(/\r?\n+/g, " ")
    .split(/\s+/)
    .map((token) => token.replace(/^[^A-Za-z0-9_#@.+/'-]+|[^A-Za-z0-9_#@.+/'-]+$/g, ""))
    .map((token) => cleanText(token, MAX.WORD))
    .filter(Boolean)
    .slice(0, 180);
}

async function captureSingleWord(word, options = {}) {
  const { quiet = false } = options;
  const normalizedWord = cleanText(word, MAX.WORD);
  if (!normalizedWord) {
    return {
      saved: false,
      skipped: true
    };
  }

  const existing = getDuplicateEntry(normalizedWord);
  if (existing) {
    selectEntry(existing.id);
    if (!quiet) {
      setQuickCaptureStatus(`"${normalizedWord}" already exists. Selected existing entry.`);
    }
    return {
      saved: false,
      skipped: true
    };
  }

  const preferredLabel = resolvePreferredEntryLabel();

  beginNewEntryInLabel(preferredLabel);
  G_DOM.wordInput.value = normalizedWord;
  G_DOM.definitionInput.value = "";
  (preferredLabel) && (G_DOM.labelsInput.value = preferredLabel);
  setHelperText(`Fetching and saving definition for "${normalizedWord}"...`);
  await lookupAndSaveEntry(normalizedWord);
  const saved = Boolean(getDuplicateEntry(normalizedWord));
  if (!quiet) {
    setQuickCaptureStatus(saved ? `Saved "${normalizedWord}".` : `Could not save "${normalizedWord}".`, !saved);
  }
  return {
    saved,
    skipped: false
  };
}

async function captureWordFromQuickInput() {
  if (G_RT.quickBatchRunning || !(G_DOM.quickWordInput instanceof HTMLInputElement)) {
    return;
  }
  const word = cleanText(G_DOM.quickWordInput.value, MAX.WORD);
  if (!word) {
    return;
  }
  G_DOM.quickWordInput.value = "";
  await captureSingleWord(word);
  G_DOM.quickWordInput.focus();
}

async function captureBatchWordsFromQuickInput() {
  if (G_RT.quickBatchRunning || !(G_DOM.quickBatchInput instanceof HTMLTextAreaElement)) {
    return;
  }
  const words = parseQuickBatchWords(G_DOM.quickBatchInput.value).slice(0, 400);
  if (words.length === 0) {
    setQuickCaptureStatus("No words found in batch input.", true);
    return;
  }

  G_RT.quickBatchRunning = true;
  G_DOM.quickBatchInput.disabled = true;
  let saved = 0;
  let skipped = 0;

  try {
    for (let index = 0; index < words.length; index += 1) {
      const word = words[index];
      setQuickCaptureStatus(`Capturing ${index + 1}/${words.length}: ${word}`);
      const result = await captureSingleWord(word, { quiet: true });
      if (result.saved) {
        saved += 1;
      } else {
        skipped += 1;
      }
      await new Promise((resolve) => window.setTimeout(resolve, 120));
    }
    setQuickCaptureStatus(`Batch complete: ${saved} saved, ${skipped} skipped.`);
  } catch (error) {
    setQuickCaptureStatus("Batch capture stopped due to an error.", true);
    recordDiagnosticError("quick_batch_failed", String(error?.message || error), "captureBatchWordsFromQuickInput");
  } finally {
    G_RT.quickBatchRunning = false;
    G_DOM.quickBatchInput.disabled = false;
    G_DOM.quickBatchInput.value = "";
    G_DOM.quickWordInput?.focus();
  }
}

function entryPassesAdvancedFilters(entry, graphEntryIds, nowMs = Date.now()) {
  const posFilter = cleanText(G_APP.s.treePartOfSpeechFilter, 40).toLowerCase();
  if (posFilter && posFilter !== TREE_POS_FILTER_ALL) {
    if (!entry.labels.some((label) => label.toLowerCase() === posFilter)) {
      return false;
    }
  }
  if (G_APP.s.treeHasGraphOnly && !graphEntryIds.has(entry.id)) {
    return false;
  }
  if (G_APP.s.treeActivityFilter === "favorites" && !entry.favorite) {
    return false;
  }
  if (G_APP.s.treeActivityFilter === "linked" && !graphEntryIds.has(entry.id)) {
    return false;
  }
  if (G_APP.s.treeActivityFilter === "recent") {
    const ageMs = nowMs - new Date(entry.updatedAt || 0).getTime();
    if (!Number.isFinite(ageMs) || ageMs > 1000 * 60 * 60 * 24 * 14) {
      return false;
    }
  }
  return true;
}

function buildEntryFilterContext(searchQuery, searchMatchIds) {
  const graphEntryIds = getGraphEntryIdSet();
  const nowMs = Date.now();
  const visibleEntryIds = new Set();
  G_APP.s.entries.forEach((entry) => {
    if (!G_APP.s.treeShowArchived && entry.archivedAt) {
      return;
    }
    if (!entryPassesAdvancedFilters(entry, graphEntryIds, nowMs)) {
      return;
    }
    if (searchQuery && searchMatchIds && !searchMatchIds.has(entry.id)) {
      return;
    }
    visibleEntryIds.add(entry.id);
  });
  return {
    graphEntryIds,
    visibleEntryIds
  };
}

function buildGroupDescriptor({ key, title, labelValue, canRemove, entries, searchQuery, filterContext }) {
  const visibleEntryIds = filterContext?.visibleEntryIds instanceof Set ? filterContext.visibleEntryIds : null;
  const filtered = entries.filter((entry) => {
    if (!visibleEntryIds) {
      return true;
    }
    return visibleEntryIds.has(entry.id);
  });
  if (searchQuery && filtered.length === 0) {
    return null;
  }
  return {
    key,
    title,
    labelValue,
    canRemove,
    entries: filtered
  };
}

function buildTreeModel() {
  const searchQuery = getSearchQuery();
  const cacheKey = `${G_RT.entriesVersion}|${G_RT.gVer}|${G_APP.s.treeLabelFilter}|${G_APP.s.treePartOfSpeechFilter}|${G_APP.s.treeActivityFilter}|${G_APP.s.treeHasGraphOnly ? 1 : 0}|${G_APP.s.treeShowArchived ? 1 : 0}|${searchQuery}`;
  if (G_RT.treeModelKey === cacheKey && G_RT.treeModelVal) {
    return G_RT.treeModelVal;
  }

  const sortedLabels = G_PAGE.dictionary.getEntriesIndex().sortedLabels;
  const categories = [];
  const searchMatchIds = computeSearchMatchIds(searchQuery);
  const filterContext = buildEntryFilterContext(searchQuery, searchMatchIds);
  const graphEntryIds = filterContext.graphEntryIds;

  const buildLabelGroup = (label) =>
    buildGroupDescriptor({
      key: keyForLabel(label),
      title: label,
      labelValue: label,
      canRemove: true,
      entries: getEntriesForLabel(label),
      searchQuery,
      filterContext
    });

  const unlabeledGroup = buildGroupDescriptor({
    key: UNLABELED_KEY,
    title: UNLABELED_NAME,
    labelValue: "",
    canRemove: false,
    entries: getUnlabeledEntries(),
    searchQuery,
    filterContext
  });

  if (G_APP.s.treeLabelFilter === LABEL_FILTER_UNLABELED) {
    if (unlabeledGroup) {
      categories.push({
        key: CATEGORY_UNLABELED_KEY,
        title: UNLABELED_NAME,
        groups: [unlabeledGroup]
      });
    }
    G_RT.treeModelKey = cacheKey;
    G_RT.treeModelVal = { categories, searchQuery };
    return G_RT.treeModelVal;
  }

  if (G_APP.s.treeLabelFilter !== LABEL_FILTER_ALL) {
    const selected = G_APP.s.treeLabelFilter;
    if (sortedLabels.includes(selected)) {
      const group = buildLabelGroup(selected);
      if (group) {
        categories.push({
          key: isPartOfSpeechLabel(selected) ? CATEGORY_POS_KEY : CATEGORY_FILTERED_KEY,
          title: isPartOfSpeechLabel(selected) ? "Parts of Speech" : "Labels",
          groups: [group]
        });
      }
    }
    G_RT.treeModelKey = cacheKey;
    G_RT.treeModelVal = { categories, searchQuery };
    return G_RT.treeModelVal;
  }

  const buildActivityGroup = (key, title, entries) =>
    buildGroupDescriptor({
      key,
      title,
      labelValue: "",
      canRemove: false,
      entries,
      searchQuery,
      filterContext
    });

  const favoriteGroup = buildActivityGroup(
    "activity:favorites",
    "Favorites",
    G_APP.s.entries.filter((entry) => entry.favorite)
  );
  const linkedGroup = buildActivityGroup(
    "activity:linked",
    "Linked in Graph",
    G_APP.s.entries.filter((entry) => graphEntryIds.has(entry.id))
  );
  const recentGroup = buildActivityGroup(
    "activity:recent",
    "Recently Updated",
    [...G_APP.s.entries]
      .sort((left, right) => String(right.updatedAt || "").localeCompare(String(left.updatedAt || "")))
      .slice(0, 200)
  );
  const activityGroups = [favoriteGroup, linkedGroup, recentGroup].filter(Boolean);
  if (activityGroups.length > 0) {
    categories.push({
      key: "activity",
      title: "Activity",
      groups: activityGroups
    });
  }

  const partOfSpeechGroups = [];
  const labelGroups = [];

  sortedLabels.forEach((label) => {
    const group = buildLabelGroup(label);
    if (!group) {
      return;
    }
    if (isPartOfSpeechLabel(label)) {
      partOfSpeechGroups.push(group);
    } else {
      labelGroups.push(group);
    }
  });

  if (partOfSpeechGroups.length > 0) {
    categories.push({
      key: CATEGORY_POS_KEY,
      title: "Parts of Speech",
      groups: partOfSpeechGroups
    });
  }

  if (labelGroups.length > 0) {
    categories.push({
      key: CATEGORY_LABELS_KEY,
      title: "Labels",
      groups: labelGroups
    });
  }

  if (unlabeledGroup) {
    categories.push({
      key: CATEGORY_UNLABELED_KEY,
      title: UNLABELED_NAME,
      groups: [unlabeledGroup]
    });
  }

  G_RT.treeModelKey = cacheKey;
  G_RT.treeModelVal = { categories, searchQuery };
  return G_RT.treeModelVal;
}

function createFileRow(entry) {
  const row = document.createElement("li");
  row.className = "fileItem";
  row.setAttribute("role", "button");
  row.tabIndex = 0;
  const selectedSet = new Set(G_APP.s.selectedEntryIds);
  (entry.id === G_APP.s.selectedEntryId) && (row.classList.add("selected"));
  (selectedSet.has(entry.id)) && (row.classList.add("multi"));
  row.dataset.action = "select-entry";
  row.dataset.entryId = entry.id;
  const favoritePrefix = entry.favorite ? "* " : "";
  const archivedSuffix = entry.archivedAt ? " [archived]" : "";
  const mode = normalizeEntryMode(entry.mode);
  const modePrefix = mode === "definition" ? "" : `[${mode}] `;
  row.textContent = `${favoritePrefix}${modePrefix}${entry.word}${archivedSuffix}`;
  return row;
}

function renderVirtualizedGroupRows(viewport, descriptor) {
  if (!(viewport instanceof HTMLElement)) {
    return;
  }
  const spacer = viewport.querySelector(".virtualListSpacer");
  const fileList = viewport.querySelector(".virtualFileList");
  if (!(spacer instanceof HTMLElement) || !(fileList instanceof HTMLElement)) {
    return;
  }

  const entryCount = descriptor.entries.length;
  const fallbackHeight = Math.min(
    TREE_VIRTUAL_VIEWPORT_MAX_HEIGHT,
    Math.max(TREE_VIRTUAL_ROW_HEIGHT, entryCount * TREE_VIRTUAL_ROW_HEIGHT)
  );
  const viewportHeight = viewport.clientHeight || fallbackHeight;
  const scrollTop = Number(G_APP.s.groupScrollTops[descriptor.key]) || viewport.scrollTop || 0;

  const windowState = calculateVirtualWindow({
    totalCount: entryCount,
    scrollTop,
    viewportHeight,
    rowHeight: TREE_VIRTUAL_ROW_HEIGHT,
    overscan: TREE_VIRTUAL_OVERSCAN
  });

  G_APP.s.groupScrollTops[descriptor.key] = windowState.scrollTop;
  (viewport.scrollTop !== windowState.scrollTop) && (viewport.scrollTop = windowState.scrollTop);
  spacer.style.height = `${windowState.totalHeight}px`;
  fileList.style.transform = `translateY(${windowState.offsetTop}px)`;
  fileList.innerHTML = "";

  const visibleEntries = descriptor.entries.slice(windowState.start, windowState.end);
  if (visibleEntries.length === 0) {
    const empty = document.createElement("li");
    empty.className = "emptyFolder";
    empty.textContent = "empty";
    fileList.appendChild(empty);
    return;
  }

  visibleEntries.forEach((entry) => {
    fileList.appendChild(createFileRow(entry));
  });
}

function createVirtualizedFileList(descriptor) {
  const viewport = document.createElement("div");
  viewport.className = "virtualListViewport";
  viewport.dataset.groupKey = descriptor.key;
  const viewportHeight = Math.min(
    TREE_VIRTUAL_VIEWPORT_MAX_HEIGHT,
    Math.max(TREE_VIRTUAL_ROW_HEIGHT * 4, descriptor.entries.length * TREE_VIRTUAL_ROW_HEIGHT)
  );
  viewport.style.maxHeight = `${viewportHeight}px`;
  viewport.style.height = `${viewportHeight}px`;

  const spacer = document.createElement("div");
  spacer.className = "virtualListSpacer";

  const fileList = document.createElement("ul");
  fileList.className = "fileList virtualFileList";

  viewport.appendChild(spacer);
  viewport.appendChild(fileList);

  const savedScrollTop = Number(G_APP.s.groupScrollTops[descriptor.key]) || 0;
  (savedScrollTop > 0) && (viewport.scrollTop = savedScrollTop);

  viewport.addEventListener("scroll", () => {
    G_APP.s.groupScrollTops[descriptor.key] = viewport.scrollTop;
    renderVirtualizedGroupRows(viewport, descriptor);
  });

  renderVirtualizedGroupRows(viewport, descriptor);
  return viewport;
}

function createTreeGroup(descriptor, forceExpanded) {
  const group = document.createElement("li");
  group.className = "treeGroup";
  group.dataset.groupKey = descriptor.key;
  (descriptor.canRemove && descriptor.labelValue) && (group.dataset.label = descriptor.labelValue);

  const folderRow = document.createElement("div");
  folderRow.className = "folderRow";
  folderRow.setAttribute("role", "button");
  folderRow.tabIndex = 0;
  folderRow.dataset.action = "select-folder";
  folderRow.dataset.groupKey = descriptor.key;
  folderRow.dataset.label = descriptor.labelValue || "";
  (G_APP.s.selectedTreeGroupKey === descriptor.key) && (folderRow.classList.add("selected"));

  const toggleControl = document.createElement("span");
  const expanded = forceExpanded || isGroupExpanded(descriptor.key);
  toggleControl.className = "treeControl toggleControl";
  toggleControl.setAttribute("role", "button");
  toggleControl.tabIndex = 0;
  toggleControl.dataset.action = "toggle-group";
  toggleControl.dataset.groupKey = descriptor.key;
  toggleControl.setAttribute("aria-expanded", expanded ? "true" : "false");
  toggleControl.textContent = expanded ? "▾" : "▸";

  const folderName = document.createElement("span");
  folderName.className = "folderName";
  folderName.textContent = `${descriptor.title}/ (${descriptor.entries.length})`;

  folderRow.appendChild(toggleControl);
  folderRow.appendChild(folderName);
  group.appendChild(folderRow);

  if (!expanded) {
    return group;
  }

  if (shouldVirtualizeGroup(descriptor.entries.length, TREE_VIRTUALIZATION_THRESHOLD)) {
    group.appendChild(createVirtualizedFileList(descriptor));
    return group;
  }

  const limit = getGroupLimit(descriptor.key);
  const visibleEntries = descriptor.entries.slice(0, limit);
  const fileList = document.createElement("ul");
  fileList.className = "fileList";

  if (visibleEntries.length === 0) {
    const empty = document.createElement("li");
    empty.className = "emptyFolder";
    empty.textContent = "empty";
    fileList.appendChild(empty);
  } else {
    visibleEntries.forEach((entry) => {
      fileList.appendChild(createFileRow(entry));
    });
  }

  group.appendChild(fileList);

  if (descriptor.entries.length > visibleEntries.length) {
    const showMoreControl = document.createElement("span");
    showMoreControl.className = "treeControl showMoreControl";
    showMoreControl.setAttribute("role", "button");
    showMoreControl.tabIndex = 0;
    showMoreControl.dataset.action = "show-more";
    showMoreControl.dataset.groupKey = descriptor.key;
    const remaining = descriptor.entries.length - visibleEntries.length;
    showMoreControl.textContent = `Show ${Math.min(remaining, TREE_PAGE_SIZE)} more`;
    group.appendChild(showMoreControl);
  }

  return group;
}

function createCategoryGroup(category, forceExpanded) {
  const categoryStateKey = keyForCategory(category.key);
  const categoryItem = document.createElement("li");
  categoryItem.className = "categoryGroup";
  categoryItem.dataset.groupKey = categoryStateKey;

  const categoryRow = document.createElement("div");
  categoryRow.className = "categoryRow";
  categoryRow.setAttribute("role", "button");
  categoryRow.tabIndex = 0;
  categoryRow.dataset.action = "select-folder";
  categoryRow.dataset.groupKey = categoryStateKey;
  categoryRow.dataset.label = "";
  (G_APP.s.selectedTreeGroupKey === categoryStateKey) && (categoryRow.classList.add("selected"));

  const toggleControl = document.createElement("span");
  const expanded = forceExpanded || isGroupExpanded(categoryStateKey);
  toggleControl.className = "treeControl toggleControl";
  toggleControl.setAttribute("role", "button");
  toggleControl.tabIndex = 0;
  toggleControl.dataset.action = "toggle-group";
  toggleControl.dataset.groupKey = categoryStateKey;
  toggleControl.setAttribute("aria-expanded", expanded ? "true" : "false");
  toggleControl.textContent = expanded ? "▾" : "▸";

  const categoryName = document.createElement("span");
  categoryName.className = "categoryName";
  categoryName.textContent = `${category.title}/ (${category.groups.length})`;

  categoryRow.appendChild(toggleControl);
  categoryRow.appendChild(categoryName);
  categoryItem.appendChild(categoryRow);

  if (!expanded) {
    return categoryItem;
  }

  const children = document.createElement("ul");
  children.className = "categoryChildren";
  category.groups.forEach((group) => {
    children.appendChild(createTreeGroup(group, forceExpanded));
  });
  categoryItem.appendChild(children);

  return categoryItem;
}

function renderTreeSummary(categories, searchQuery) {
  const visibleWordIds = new Set();
  let folderCount = 0;
  const contextLabel = normalizeLabel(G_APP.s.selectedTreeLabel);
  const contextSuffix = contextLabel ? ` Context: ${contextLabel}.` : "";

  categories.forEach((category) => {
    folderCount += category.groups.length;
    category.groups.forEach((group) => {
      group.entries.forEach((entry) => visibleWordIds.add(entry.id));
    });
  });

  if (categories.length === 0) {
    G_DOM.treeSummary.textContent = `No results.${contextSuffix}`.trim();
    return;
  }

  if (searchQuery) {
    G_DOM.treeSummary.textContent = `Found ${visibleWordIds.size} matching words in ${folderCount} folder(s).${contextSuffix}`;
    return;
  }

  if (G_APP.s.treeLabelFilter !== LABEL_FILTER_ALL) {
    G_DOM.treeSummary.textContent = `Showing ${visibleWordIds.size} words.${contextSuffix}`;
    return;
  }

  if (G_APP.s.treeActivityFilter !== TREE_ACTIVITY_FILTER_ALL) {
    G_DOM.treeSummary.textContent = `Showing ${visibleWordIds.size} words in activity filter "${G_APP.s.treeActivityFilter}".${contextSuffix}`;
    return;
  }

  G_DOM.treeSummary.textContent = `Brain: ${visibleWordIds.size} active words across ${folderCount} folders. Alt+1..6 = quick top-label filter.${contextSuffix}`;
}

function getFilteredArchivedEntries() {
  const query = cleanText(G_APP.s.archiveSearch, MAX.WORD).toLowerCase();
  return G_APP.s.entries
    .filter((entry) => entry.archivedAt)
    .filter((entry) => {
      if (!query) {
        return true;
      }
      return (
        entry.word.toLowerCase().includes(query) ||
        entry.definition.toLowerCase().includes(query) ||
        entry.labels.some((label) => label.toLowerCase().includes(query))
      );
    })
    .sort((left, right) => String(right.archivedAt || "").localeCompare(String(left.archivedAt || "")));
}

function restoreFilteredArchivedEntries() {
  const list = getFilteredArchivedEntries();
  if (list.length === 0) {
    setStatus("No archived words match filter.", true);
    return;
  }
  list.forEach((entry) => restoreEntryById(entry.id));
  setStatus(`Restored ${list.length} archived word(s).`);
}

function purgeFilteredArchivedEntries() {
  const list = getFilteredArchivedEntries();
  if (list.length === 0) {
    setStatus("No archived words match filter.", true);
    return;
  }
  const approved = window.confirm(`Permanently delete ${list.length} archived word(s)? This cannot be undone.`);
  if (!approved) {
    return;
  }
  list.forEach((entry) => deleteEntryById(entry.id));
  setStatus(`Permanently deleted ${list.length} archived word(s).`);
}

function renderArchivePanel() {
  if (!(G_DOM.archiveList instanceof HTMLElement) || !(G_DOM.archiveSummary instanceof HTMLElement)) {
    return;
  }
  const filtered = getFilteredArchivedEntries();
  const totalArchived = G_APP.s.entries.filter((entry) => entry.archivedAt).length;
  const searchText = cleanText(G_APP.s.archiveSearch, MAX.WORD);
  G_DOM.archiveSummary.textContent = searchText
    ? `Archive: ${filtered.length}/${totalArchived} word(s) match "${searchText}".`
    : `Archive: ${totalArchived} word(s).`;

  G_DOM.archiveList.innerHTML = "";
  if (filtered.length === 0) {
    const empty = document.createElement("li");
    empty.className = "archiveItem";
    empty.textContent = "No archived words.";
    G_DOM.archiveList.appendChild(empty);
    return;
  }

  filtered.slice(0, 160).forEach((entry) => {
    const row = document.createElement("li");
    row.className = "archiveItem";
    row.textContent = `${entry.word} (${entry.labels.join(", ") || "no-label"})`;
    row.dataset.entryId = entry.id;
    row.addEventListener("dblclick", () => {
      restoreEntryById(entry.id);
      setStatus(`Restored "${entry.word}".`);
    });
    G_DOM.archiveList.appendChild(row);
  });
}

function renderTree() {
  const startedAt = performance.now();
  updateLabelFilterOptions();
  updatePartOfSpeechFilterOptions();
  updateActivityFilterOptions();
  renderTopLabelBar();
  updateHistoryRestoreOptions();
  (G_DOM.treeHasGraphOnly instanceof HTMLInputElement) && (G_DOM.treeHasGraphOnly.checked = G_APP.s.treeHasGraphOnly);
  (G_DOM.treeShowArchived instanceof HTMLInputElement) && (G_DOM.treeShowArchived.checked = G_APP.s.treeShowArchived);
  (G_DOM.toggleGraphLockAction instanceof HTMLElement) && (G_DOM.toggleGraphLockAction.textContent = G_APP.s.graphLockEnabled ? "Unlock Graph Drag" : "Lock Graph Drag");

  const { categories, searchQuery } = buildTreeModel();
  const forceExpanded = searchQuery.length > 0;

  G_DOM.treeView.innerHTML = "";
  renderTreeSummary(categories, searchQuery);

  if (categories.length === 0) {
    const empty = document.createElement("li");
    empty.className = "treeEmpty";
    empty.textContent = "No words found.";
    G_DOM.treeView.appendChild(empty);
    renderArchivePanel();
    return;
  }

  categories.forEach((category) => {
    G_DOM.treeView.appendChild(createCategoryGroup(category, forceExpanded));
  });
  renderArchivePanel();
  if (G_APP.s.activeView === VIEW_STATISTICS) {
    renderStatisticsView();
  } else {
    (G_APP.s.activeView === VIEW_UNIVERSE) &&
      (G_PAGE.universe.renderSummary(), G_PAGE.universe.renderCluster(), G_PAGE.universe.reqRender());
  }
  recordDiagnosticPerf("render_tree_ms", performance.now() - startedAt);
}

function getAllGroupKeys() {
  const sortedLabels = G_PAGE.dictionary.getEntriesIndex().sortedLabels;
  return [
    keyForCategory(CATEGORY_POS_KEY),
    keyForCategory(CATEGORY_LABELS_KEY),
    keyForCategory(CATEGORY_UNLABELED_KEY),
    keyForCategory(CATEGORY_FILTERED_KEY),
    keyForCategory("activity"),
    "activity:favorites",
    "activity:linked",
    "activity:recent",
    ...sortedLabels.map(keyForLabel),
    UNLABELED_KEY
  ];
}

function expandAllGroups() {
  getAllGroupKeys().forEach((groupKey) => {
    setGroupExpanded(groupKey, true);
  });
  G_PAGE.tree.reqRender();
}

function collapseAllGroups() {
  G_APP.s.expandedGroups = {};
  G_APP.s.groupScrollTops = {};
  G_PAGE.tree.reqRender();
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
  const source = loaded && typeof loaded === "object" ? loaded : {};

  const hydratedLabels = Array.isArray(source.labels) ? normalizeLabelArray(source.labels) : [...DEFAULT_LABELS];
  const hydratedEntries = [];
  const labelSet = new Set(hydratedLabels.length > 0 ? hydratedLabels : DEFAULT_LABELS);

  if (Array.isArray(source.entries)) {
    source.entries.forEach((entry) => {
      const normalized = normalizeLoadedEntry(entry);
      if (!normalized) {
        return;
      }
      hydratedEntries.push(normalized);
      normalized.labels.forEach((label) => {
        labelSet.add(label);
      });
    });
  }

  G_APP.st.setLabels([...labelSet].sort((a, b) => a.localeCompare(b)));
  G_APP.st.setEntries(hydratedEntries);
  sortEntries();
  G_APP.st.setGraph(normalizeLoadedSentenceGraph(source.sentenceGraph));
  G_APP.s.selectedEntryId = null;
  clearEntrySelections();
  G_APP.s.selectedGraphNodeId = null;
  clearPendingLink();
  G_APP.s.activeView = VIEW_WORKBENCH;

  G_APP.s.treeSearch = "";
  G_APP.s.treeLabelFilter = LABEL_FILTER_ALL;
  G_APP.s.treePartOfSpeechFilter = TREE_POS_FILTER_ALL;
  G_APP.s.treeActivityFilter = TREE_ACTIVITY_FILTER_ALL;
  G_APP.s.treeHasGraphOnly = false;
  G_APP.s.treeShowArchived = false;
  G_APP.s.selectedTreeGroupKey = "";
  G_APP.s.selectedTreeLabel = "";
  G_APP.s.explorerLayoutMode = EXPLORER_LAYOUT_NORMAL;
  G_APP.s.archiveSearch = "";
  G_APP.s.localAssistEnabled = source.localAssistEnabled !== false;
  G_APP.s.expandedGroups = {
    [keyForCategory(CATEGORY_POS_KEY)]: true,
    [keyForCategory(CATEGORY_LABELS_KEY)]: true,
    [keyForCategory(CATEGORY_UNLABELED_KEY)]: true
  };
  G_APP.s.groupLimits = {};
  G_APP.s.groupScrollTops = {};
  G_APP.s.graphLockEnabled = Boolean(source.graphLockEnabled);
  G_UNI.cfg = createDefaultUniverseConfig();
  G_UNI.view.filter = "";
  G_UNI.view.zoom = 1;
  G_UNI.view.panX = 0;
  G_UNI.view.panY = 0;
  G_UNI.view.hoverNodeIndex = -1;
  G_UNI.view.selectedNodeIndex = -1;
  G_UNI.view.pulseNodeIndex = -1;
  G_UNI.view.pulseUntil = 0;
  G_RT.uPerfAt = 0;
  G_RT.uPerfMs = 0;
  G_RT.uFrameAt = 0;
  G_RT.uFrameMs = 0;
  G_RT.uHudAt = 0;
  G_UNI.sel.nodeIdxSet = new Set();
  G_UNI.canvas.flags.selected = new Uint8Array(0);
  G_UNI.sel.sets = [];
  G_UNI.sel.activeSetId = "";
  G_RT.uBench = createUniverseBenchmarkState(G_RT.uBench.lastResult);
  G_RT.uForceCanvas = false;
  resetHighlightCache();
  resetAdjacencyCache();
  clearPathHighlights();
  G_APP.s.diagnostics = normalizeDiagnostics(source.diagnostics);
  G_APP.s.history = Array.isArray(source.history)
    ? source.history
        .map((checkpoint) => {
          const item = checkpoint && typeof checkpoint === "object" ? checkpoint : {};
          return {
            id: cleanText(item.id, MAX.WORD) || window.crypto.randomUUID(),
            reason: cleanText(item.reason, 80) || "checkpoint",
            createdAt: cleanText(item.createdAt, MAX.DATE) || nowIso(),
            labels: normalizeLabelArray(item.labels),
            entries: (Array.isArray(item.entries) ? item.entries : []).map(normalizeLoadedEntry).filter(Boolean),
            sentenceGraph: normalizeLoadedSentenceGraph(item.sentenceGraph)
          };
        })
        .slice(0, HISTORY_MAX)
    : [];
  G_RT.lastHistoryDigest = "";
  G_APP.s.lastSavedAt = cleanText(source.lastSavedAt, MAX.DATE) || null;
  G_RT.undoStack = [];
  G_RT.redoStack = [];
  G_RT.lastUndoDigest = "";
  captureUndoSnapshot("initial");
  (G_DOM.localAssistEnabled instanceof HTMLInputElement) && (G_DOM.localAssistEnabled.checked = G_APP.s.localAssistEnabled);
  setExplorerLayoutMode(EXPLORER_LAYOUT_NORMAL, { announce: false });
  setEntryWarnings([]);
  renderDiagnosticsSummary();
  scheduleIndexWarmup();
  scheduleGraphBuild();
  updateHistoryRestoreOptions();
  setActiveView(VIEW_WORKBENCH);
  setQuickCaptureStatus("Quick capture ready.");
  (G_DOM.archiveSearchInput instanceof HTMLInputElement) && (G_DOM.archiveSearchInput.value = "");
  (G_DOM.universeFilterInput instanceof HTMLInputElement) && (G_DOM.universeFilterInput.value = "");
  (G_DOM.universePathFromInput instanceof HTMLInputElement) && (G_DOM.universePathFromInput.value = "");
  (G_DOM.universePathToInput instanceof HTMLInputElement) && (G_DOM.universePathToInput.value = "");
  G_PAGE.universe.syncControls();
  updateUniverseBookmarkSelect();
  syncCanvasVisibility();
  renderPerfHud(true);
  G_PAGE.universe.renderCluster();
}

async function loadDictionaryData() {
  try {
    const loaded = await window.dictionaryAPI.load();
    hydrateState(loaded);
    if (window.dictionaryAPI?.loadDiagnostics) {
      try {
        const diagnostics = await window.dictionaryAPI.loadDiagnostics();
        G_APP.s.diagnostics = normalizeDiagnostics(diagnostics);
      } catch (error) {
        recordDiagnosticError("diagnostics_load_failed", String(error?.message || error), "loadDictionaryData");
      }
    }
    await loadUniverseCache();
    (G_DOM.treeSearchInput instanceof HTMLInputElement) && (G_DOM.treeSearchInput.value = "");
    resetEditor();
    if (G_APP.s.sentenceGraph.nodes.length === 0) {
      setSentenceStatus("Add words, drag nodes, and connect right port to left port.");
    } else {
      setSentenceStatus(`Graph loaded: ${G_APP.s.sentenceGraph.nodes.length} node(s).`);
    }
    setActiveView(VIEW_WORKBENCH);
    renderStatisticsView();
    G_PAGE.universe.renderSummary();
    void loadUniverseGpuStatus(true);
    G_PAGE.universe.reqRender();
    renderDiagnosticsSummary();
    setStatus(formatSaved(G_APP.s.lastSavedAt));
    (G_DOM.wordInput instanceof HTMLInputElement) && (G_DOM.wordInput.focus(), G_DOM.wordInput.select());
    G_RT.readyForAutosave = true;
    return true;
  } catch (error) {
    G_RT.readyForAutosave = false;
    setStatus("Failed to load dictionary file.", true);
    setAuthHint("Could not open dictionary after login.", true);
    setAuthGateVisible(true);
    console.error(error);
    return false;
  }
}

async function submitAuth() {
  if (G_RT.authBusy) {
    return;
  }

  const { username, password } = getAuthCredentials();
  if (!username || !password) {
    setAuthHint("Username and password are required.", true);
    return;
  }

  G_RT.authBusy = true;
  pushRuntimeLog("info", "auth", `Auth submit requested for "${username}".`, G_RT.authMode);
  setAuthHint(G_RT.authMode === AUTH_MODE_CREATE ? "Creating account..." : "Signing in...");

  try {
    let result =
      G_RT.authMode === AUTH_MODE_CREATE
        ? await window.dictionaryAPI.createAccount(username, password)
        : await window.dictionaryAPI.login(username, password);

    if (!result?.ok && G_RT.authMode === AUTH_MODE_CREATE && /already exists/i.test(String(result?.error || ""))) {
      result = await window.dictionaryAPI.login(username, password);
    } else {
      (!result?.ok && G_RT.authMode === AUTH_MODE_LOGIN && /no account found/i.test(String(result?.error || ""))) &&
        (result = await window.dictionaryAPI.createAccount(username, password));
    }

    if (!result?.ok) {
      setAuthHint(result?.error || "Authentication failed.", true);
      pushRuntimeLog("warn", "auth", `Authentication failed for "${username}".`, String(result?.error || ""));
      return;
    }

    G_DOM.authPasswordInput.value = "";
    setAuthGateVisible(false);
    pushRuntimeLog("info", "auth", `Authenticated as "${result.username || username}".`, G_RT.authMode);
    await loadDictionaryData();
  } catch (error) {
    setAuthHint("Authentication failed.", true);
    pushRuntimeLog("error", "auth", "Authentication exception.", String(error?.message || error));
    console.error(error);
  } finally {
    G_RT.authBusy = false;
  }
}

async function initializeAuthGate() {
  try {
    const status = await window.dictionaryAPI.getAuthStatus();
    G_RT.authStatus = {
      quickLoginEnabled: Boolean(status?.quickLoginEnabled)
    };
    const shouldShowLogin = Boolean(status?.hasAccount) || G_RT.authStatus.quickLoginEnabled;
    setAuthMode(shouldShowLogin ? AUTH_MODE_LOGIN : AUTH_MODE_CREATE);
    setAuthGateVisible(true);
    G_DOM.authUsernameInput.value = "";
    G_DOM.authPasswordInput.value = "";
    G_DOM.authUsernameInput.focus();
  } catch (error) {
    G_RT.authStatus = {
      quickLoginEnabled: false
    };
    setAuthMode(AUTH_MODE_CREATE);
    setAuthHint("Could not read account G_APP.s.", true);
    setAuthGateVisible(true);
    console.error(error);
  }
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
  const canvases = [G_DOM.universeCanvas, G_DOM.universeCanvasGl].filter(
    (canvas) => canvas instanceof HTMLCanvasElement
  );
  if (canvases.length === 0) {
    return;
  }
  G_PAGE.universe.syncControls();
  updateUniverseBookmarkSelect();
  syncCanvasVisibility();
  renderPerfHud(true);

  if (typeof ResizeObserver === "function") {
    G_RT.uResizeObs = new ResizeObserver(() => {
      if (ensureUniverseCanvasSize() && G_APP.s.activeView === VIEW_UNIVERSE) {
        G_PAGE.universe.reqRender();
      }
    });
    canvases.forEach((canvas) => G_RT.uResizeObs.observe(canvas));
  }

  if (G_DOM.universeFilterInput instanceof HTMLInputElement) {
    G_DOM.universeFilterInput.addEventListener("input", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement)) {
        return;
      }
      G_UNI.view.filter = target.value;
      G_PAGE.universe.renderSummary();
      G_PAGE.universe.renderCluster();
      G_PAGE.universe.reqRender();
    });
    G_DOM.universeFilterInput.addEventListener("keydown", (event) => {
      (event.key === "Enter") && (event.preventDefault(), jumpToUniverseFilter());
    });
  }
  bindActionElement(G_DOM.universeJumpAction, () => jumpToUniverseFilter());
  bindActionElement(G_DOM.universeBenchmarkAction, () => startUniverseBenchmark());
  bindActionElement(G_DOM.universeBenchmarkStopAction, () => stopUniverseBenchmark("stopped"));
  bindActionElement(G_DOM.universeGpuStatusAction, () => {
    void showUniverseGpuStatus(true);
  });

  if (G_DOM.universeColorModeSelect instanceof HTMLSelectElement) {
    G_DOM.universeColorModeSelect.addEventListener("change", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLSelectElement)) {
        return;
      }
      G_UNI.cfg = normalizeConfig({
        ...G_UNI.cfg,
        colorMode: target.value,
        bookmarks: G_UNI.cfg.bookmarks
      });
      G_PAGE.universe.syncControls();
      queueCacheSave();
      G_PAGE.universe.reqRender();
    });
  }

  if (G_DOM.universeRenderModeSelect instanceof HTMLSelectElement) {
    G_DOM.universeRenderModeSelect.addEventListener("change", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLSelectElement)) {
        return;
      }
      setUniverseRenderMode(target.value, {
        allowUnsafe: false,
        announce: true
      });
    });
  }

  bindActionElement(G_DOM.universeApplyFiltersAction, () => applyUniverseOptionsFromInputs());
  [
    G_DOM.universeMinWordLengthInput,
    G_DOM.universeMaxNodesInput,
    G_DOM.universeMaxEdgesInput,
    G_DOM.universeLabelFilterInput
  ].forEach((input) => {
    if (!(input instanceof HTMLInputElement)) {
      return;
    }
    input.addEventListener("keydown", (event) => {
      (event.key === "Enter") && (event.preventDefault(), applyUniverseOptionsFromInputs());
    });
  });
  if (G_DOM.universeFavoritesOnlyInput instanceof HTMLInputElement) {
    G_DOM.universeFavoritesOnlyInput.addEventListener("change", () => {
      applyUniverseOptionsFromInputs();
    });
  }

  PATTERN_UNIVERSE_EDGE_ACTIONS.forEach(([elementKey, modeKey]) => {
    bindActionElement(G_DOM[elementKey], () => toggleUniverseEdgeMode(modeKey));
  });

  bindActionElement(G_DOM.universeFindPathAction, () => applyUniversePathFinder());
  if (G_DOM.universePathFromInput instanceof HTMLInputElement) {
    G_DOM.universePathFromInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        applyUniversePathFinder();
      }
    });
  }
  if (G_DOM.universePathToInput instanceof HTMLInputElement) {
    G_DOM.universePathToInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        applyUniversePathFinder();
      }
    });
  }

  bindActionElement(G_DOM.universeResetCameraAction, () => {
    resetUniverseCamera();
    setStatus("Universe camera reset.");
  });
  bindActionElement(G_DOM.universeFitCameraAction, () => {
    fitUniverseCamera();
    setStatus("Universe camera fitted.");
  });
  bindActionElement(G_DOM.universeSaveViewAction, () => saveUniverseBookmark());
  bindActionElement(G_DOM.universeLoadViewAction, () => {
    if (!(G_DOM.universeBookmarkSelect instanceof HTMLSelectElement)) {
      return;
    }
    (!loadUniverseBookmark(G_DOM.universeBookmarkSelect.value)) && (setStatus("Select a saved view first.", true));
  });
  bindActionElement(G_DOM.universeExportPngAction, () => exportUniversePng());
  bindActionElement(G_DOM.universeExportJsonAction, () => exportUniverseGraphJson());

  const toCanvasPoint = (event, canvas) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  };

  const stopDrag = (canvas) => {
    G_UNI.view.dragActive = false;
    (canvas instanceof HTMLCanvasElement) && (canvas.classList.remove("dragging"));
  };

  const scheduleHoverHitTest = () => {
    if (G_RT.uHoverFrame) {
      return;
    }
    G_RT.uHoverFrame = window.requestAnimationFrame(() => {
      G_RT.uHoverFrame = 0;
      const point = G_RT.uHoverPoint;
      if (!point || G_UNI.view.dragActive) {
        return;
      }
      const hoverIndex = findNodeAt(point.x, point.y);
      (hoverIndex !== G_UNI.view.hoverNodeIndex) && (G_UNI.view.hoverNodeIndex = hoverIndex, G_PAGE.universe.reqRender());
    });
  };

  const attachCanvasInteractions = (canvas) => {
    canvas.addEventListener("pointerdown", (event) => {
      if (canvas !== getActiveCanvas()) {
        return;
      }
      if (event.button !== 0) {
        return;
      }
      const point = toCanvasPoint(event, canvas);
      G_UNI.view.dragActive = true;
      G_UNI.view.dragMoved = false;
      G_UNI.view.dragStartX = point.x;
      G_UNI.view.dragStartY = point.y;
      G_UNI.view.dragPanX = G_UNI.view.panX;
      G_UNI.view.dragPanY = G_UNI.view.panY;
      markInteraction();
      canvas.classList.add("dragging");
      canvas.setPointerCapture(event.pointerId);
    });

    canvas.addEventListener("pointermove", (event) => {
      if (canvas !== getActiveCanvas()) {
        return;
      }
      const point = toCanvasPoint(event, canvas);
      if (G_UNI.view.dragActive) {
        const dx = point.x - G_UNI.view.dragStartX;
        const dy = point.y - G_UNI.view.dragStartY;
        if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
          G_UNI.view.dragMoved = true;
        }
        const zoom = clampNumber(G_UNI.view.zoom, UNIVERSE_ZOOM_MIN, UNIVERSE_ZOOM_MAX);
        G_UNI.view.panX = clampNumber(
          G_UNI.view.dragPanX + dx / (Math.max(1, G_UNI.canvas.size.width) * zoom),
          -1.6,
          1.6
        );
        G_UNI.view.panY = clampNumber(
          G_UNI.view.dragPanY + dy / (Math.max(1, G_UNI.canvas.size.height) * zoom),
          -1.6,
          1.6
        );
        markInteraction();
        clearProjectionCache();
        G_PAGE.universe.reqRender();
        return;
      }
      G_RT.uHoverPoint = point;
      scheduleHoverHitTest();
    });

    canvas.addEventListener("pointerup", (event) => {
      if (canvas !== getActiveCanvas()) {
        return;
      }
      if (!G_UNI.view.dragActive) {
        return;
      }
      (canvas.hasPointerCapture(event.pointerId)) && (canvas.releasePointerCapture(event.pointerId));
      const dragged = G_UNI.view.dragMoved;
      stopDrag(canvas);
      if (dragged) {
        queueCacheSave();
        return;
      }
      const point = toCanvasPoint(event, canvas);
      G_RT.uHoverPoint = point;
      const nodeIndex = findNodeAt(point.x, point.y);
      if (!Number.isInteger(nodeIndex) || nodeIndex < 0) {
        clearUniverseNodeSelection();
        return;
      }
      const withModifier = event.shiftKey || event.ctrlKey || event.metaKey;
      if (withModifier) {
        toggleUniverseNodeSelection(nodeIndex, {
          center: false,
          focusEntry: true,
          announce: `Updated selection: "${G_UNI.graph.nodes[nodeIndex]?.word || "word"}".`
        });
        return;
      }
      focusNodeIndex(nodeIndex, {
        center: false,
        announce: `Selected "${G_UNI.graph.nodes[nodeIndex]?.word || "word"}" from universe.`,
        focusEntry: true
      });
    });

    canvas.addEventListener("pointerleave", () => {
      if (canvas !== getActiveCanvas()) {
        return;
      }
      if (G_UNI.view.dragActive) {
        return;
      }
      (G_RT.uHoverFrame) && (window.cancelAnimationFrame(G_RT.uHoverFrame), G_RT.uHoverFrame = 0);
      G_RT.uHoverPoint = null;
      (G_UNI.view.hoverNodeIndex !== -1) && (G_UNI.view.hoverNodeIndex = -1, G_PAGE.universe.reqRender());
    });

    canvas.addEventListener("pointercancel", () => {
      if (canvas !== getActiveCanvas()) {
        return;
      }
      stopDrag(canvas);
      (G_RT.uHoverFrame) && (window.cancelAnimationFrame(G_RT.uHoverFrame), G_RT.uHoverFrame = 0);
      G_RT.uHoverPoint = null;
    });

    canvas.addEventListener(
      "wheel",
      (event) => {
        if (canvas !== getActiveCanvas()) {
          return;
        }
        event.preventDefault();
        const delta = event.deltaY < 0 ? 1.1 : 1 / 1.1;
        G_UNI.view.zoom = clampNumber(G_UNI.view.zoom * delta, UNIVERSE_ZOOM_MIN, UNIVERSE_ZOOM_MAX);
        markInteraction();
        clearProjectionCache();
        G_PAGE.universe.reqRender();
      },
      { passive: false }
    );
  };

  canvases.forEach((canvas) => attachCanvasInteractions(canvas));
}

function isCommandPaletteVisible() {
  return !(G_DOM.commandPalette instanceof HTMLElement)
    ? false
    : !G_DOM.commandPalette.classList.contains("hidden");
}

function closeCmdPalette() {
  if (!(G_DOM.commandPalette instanceof HTMLElement)) {
    return;
  }
  G_DOM.commandPalette.classList.add("hidden");
  G_RT.cmdItems = [];
  G_RT.cmdIdx = 0;
}

function executeCommandPaletteItem(item) {
  if (!item || typeof item.run !== "function") {
    return;
  }
  closeCmdPalette();
  Promise.resolve(item.run()).catch((error) => {
    setStatus("Command failed.", true);
    recordDiagnosticError("command_failed", String(error?.message || error), item.label || "palette");
  });
}

function renderCmdList() {
  if (!(G_DOM.commandPaletteList instanceof HTMLElement)) {
    return;
  }
  G_DOM.commandPaletteList.innerHTML = "";
  if (G_RT.cmdItems.length === 0) {
    const empty = document.createElement("li");
    empty.className = "commandPaletteItem";
    empty.textContent = "No matching commands.";
    G_DOM.commandPaletteList.appendChild(empty);
    return;
  }
  G_RT.cmdItems.forEach((item, index) => {
    const row = document.createElement("li");
    row.className = `commandPaletteItem${index === G_RT.cmdIdx ? " active" : ""}`;
    row.textContent = item.label;
    row.addEventListener("click", () => executeCommandPaletteItem(item));
    G_DOM.commandPaletteList.appendChild(row);
  });
}

function buildCommandPaletteActions() {
  return [
    { label: "[View] Focus Lexicon Explorer", run: () => G_DOM.treeView?.focus() },
    { label: "[Entry] New Entry", run: () => beginNewEntryInLabel("") },
    { label: "[Entry] Save Entry and Next", run: () => saveEntryFromForm({ forceNewAfterSave: true }) },
    { label: "[Entry] Archive Selected Entries", run: () => deleteSelectedEntries() },
    {
      label: "[Entry] Restore Selected Entries",
      run: () => {
        getSelectedEntries().forEach((entry) => restoreEntryById(entry.id));
        G_PAGE.tree.reqRender();
      }
    },
    { label: "[Entry] Restore Filtered Archived Entries", run: () => restoreFilteredArchivedEntries() },
    { label: "[Entry] Purge Filtered Archived Entries", run: () => purgeFilteredArchivedEntries() },
    {
      label: "[Entry] Toggle Favorite",
      run: () => G_APP.s.selectedEntryId && toggleFavoriteEntry(G_APP.s.selectedEntryId)
    },
    { label: "[View] Show Workbench", run: () => setActiveView(VIEW_WORKBENCH) },
    { label: "[View] Show Sentence Graph", run: () => setActiveView(VIEW_SENTENCE_GRAPH) },
    { label: "[View] Show Statistics", run: () => setActiveView(VIEW_STATISTICS) },
    { label: "[View] Show Universe", run: () => setActiveView(VIEW_UNIVERSE) },
    { label: "[View] Explorer Layout: Standard", run: () => setExplorerLayoutMode(EXPLORER_LAYOUT_NORMAL) },
    { label: "[View] Explorer Layout: Compact", run: () => setExplorerLayoutMode(EXPLORER_LAYOUT_COMPACT) },
    { label: "[View] Explorer Layout: Focus", run: () => setExplorerLayoutMode(EXPLORER_LAYOUT_MAXIMIZED) },
    { label: "[Appearance] Theme: Enterprise", run: () => updateUiThemePreference("enterprise") },
    { label: "[Appearance] Theme: Windows 11 Dark", run: () => updateUiThemePreference("futuristic") },
    { label: "[Appearance] Theme: Monochrome", run: () => updateUiThemePreference("monochrome") },
    { label: "[Appearance] Toggle Settings Popover", run: () => toggleUiSettingsPopover() },
    {
      label: "[Appearance] Toggle Reduce Motion",
      run: () => updateReduceMotionPreference(!G_UNI.ui.prefs?.reduceMotion)
    },
    { label: "[Universe] Jump to Filter Match", run: () => jumpToUniverseFilter() },
    { label: "[Universe] Select All Visible Nodes", run: () => selectAllUniverseVisibleNodes({ announce: true }) },
    { label: "[Universe] Clear Node Selection", run: () => clearUniverseNodeSelection({ announce: true }) },
    { label: "[Universe] Create Custom Set from Selection", run: () => createUniverseCustomSetFromSelection("") },
    {
      label: "[Universe] Use Canvas Renderer",
      run: () => setUniverseRenderMode(UNIVERSE_VIEW_MODE_CANVAS, { announce: true })
    },
    {
      label: "[Universe] Try WebGL Renderer",
      run: () => setUniverseRenderMode(UNIVERSE_VIEW_MODE_WEBGL, { allowUnsafe: true, announce: true })
    },
    { label: "[Universe] Start 3D Benchmark", run: () => startUniverseBenchmark() },
    { label: "[Universe] Stop 3D Benchmark", run: () => stopUniverseBenchmark("stopped") },
    { label: "[Graph] Toggle Graph Lock", run: () => toggleGraphLock() },
    { label: "[Graph] Auto Layout Graph", run: () => autoLayoutGraph() },
    { label: "[Graph] Build Sentence from Selection", run: () => buildSentenceFromSelectedEntries() },
    { label: "[Graph] Jump Between Selected Entry/Node", run: () => jumpBetweenEntryAndGraph() },
    {
      label: "[Graph] Open Selected Node Source Entry",
      run: () => {
        const node = G_PAGE.sentence.getNode(G_APP.s.selectedGraphNodeId);
        if (!node?.entryId) {
          setSentenceStatus("Selected node has no source entry.");
          return;
        }
        selectEntry(node.entryId);
      }
    },
    {
      label: "[Graph] Attach Selected Entry to Selected Node",
      run: () => {
        const node = G_PAGE.sentence.getNode(G_APP.s.selectedGraphNodeId);
        const entry = getSelectedEntry();
        if (!node || !entry) {
          setSentenceStatus("Select both a graph node and a tree entry.");
          return;
        }
        G_APP.st.setGraph({
          ...G_APP.s.sentenceGraph,
          nodes: G_APP.s.sentenceGraph.nodes.map((item) =>
            item.id === node.id
              ? {
                  ...item,
                  entryId: entry.id,
                  word: entry.word
                }
              : item
          )
        });
        G_PAGE.sentence.reqRender();
        scheduleAutosave();
      }
    },
    { label: "[System] Undo", run: () => runUndo() },
    { label: "[System] Redo", run: () => runRedo() },
    { label: "[System] Expand All Folders", run: () => expandAllGroups() },
    { label: "[System] Collapse All Folders", run: () => collapseAllGroups() },
    {
      label: "[System] Open Runtime Console",
      run: async () => {
        if (!window.dictionaryAPI?.openRuntimeLogConsole) {
          return;
        }
        const result = await window.dictionaryAPI.openRuntimeLogConsole();
        (!result?.ok) && (setStatus("Runtime console disabled.", true));
      }
    },
    {
      label: "[System] Show GPU Status",
      run: async () => {
        await showUniverseGpuStatus(true);
      }
    },
    {
      label: "[System] Toggle Runtime Logging",
      run: async () => {
        if (!window.dictionaryAPI?.setRuntimeLogEnabled) {
          return;
        }
        const next = await window.dictionaryAPI.setRuntimeLogEnabled(!G_RT.runtimeLogEnabled);
        G_RT.runtimeLogEnabled = next?.enabled !== false;
        setStatus(G_RT.runtimeLogEnabled ? "Runtime logging enabled." : "Runtime logging disabled.");
      }
    },
    {
      label: "[System] Compact Data",
      run: async () => {
        if (!window.dictionaryAPI?.compact) {
          return;
        }
        const compacted = await window.dictionaryAPI.compact(buildSnapshot());
        hydrateState(compacted);
        G_PAGE.tree.reqRender();
        G_PAGE.sentence.reqRender();
        scheduleAutosave();
        setStatus("Data compacted.");
      }
    },
    {
      label: "[System] Export Diagnostics",
      run: async () => {
        if (!window.dictionaryAPI?.exportDiagnostics) {
          return;
        }
        const result = await window.dictionaryAPI.exportDiagnostics();
        setStatus(result?.ok ? `Diagnostics exported: ${result.filePath}` : "Diagnostics export failed.");
      }
    },
    { label: "[Export] Export JSON", run: () => exportCurrentData("json") },
    { label: "[Export] Export CSV", run: () => exportCurrentData("csv") }
  ];
}

function openCommandPalette() {
  if (
    !(G_DOM.commandPalette instanceof HTMLElement) ||
    !(G_DOM.commandPaletteInput instanceof HTMLInputElement)
  ) {
    return;
  }
  G_DOM.commandPalette.classList.remove("hidden");
  G_DOM.commandPaletteInput.value = "";
  G_RT.cmdItems = buildCommandPaletteActions();
  G_RT.cmdIdx = 0;
  renderCmdList();
  G_DOM.commandPaletteInput.focus();
}

function filterCommandPalette(query) {
  const all = buildCommandPaletteActions();
  const ranked = rankCommands(query, all);
  G_RT.cmdItems = ranked.slice(0, 40);
  G_RT.cmdIdx = 0;
  renderCmdList();
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
  window.addEventListener("error", (event) => {
    const message = cleanText(event?.message || "Unhandled renderer error", 500);
    const context = cleanText(`${event?.filename || ""}:${event?.lineno || 0}:${event?.colno || 0}`, 400);
    recordDiagnosticError("window_error", message, context);
  });
  window.addEventListener("unhandledrejection", (event) => {
    const reason = event?.reason;
    const message = cleanText(reason?.message || String(reason || "Unhandled promise rejection"), 500);
    recordDiagnosticError("unhandled_rejection", message, "window");
  });

  bindUniverseInteractions();
  syncUiSettingsControls();
  syncExplorerLayoutControls();

  // ── Logout ──────────────────────────────────────────────────────────────
  if (G_DOM.logoutAction instanceof HTMLElement) {
    G_DOM.logoutAction.addEventListener("click", async () => {
      try {
        if (typeof window.dictionaryAPI?.logout === "function") {
          await window.dictionaryAPI.logout();
        }
        window.location.reload();
      } catch (err) {
        setStatus("Logout failed. Please restart the app.", true);
      }
    });
  }

  // ── New Entry button ─────────────────────────────────────────────────────
  bindActionElement(G_DOM.newEntryAction, () => {
    beginNewEntryInLabel(G_APP.s.selectedTreeLabel || "");
  });

  // ── Archive button in entry form ─────────────────────────────────────────
  bindActionElement(G_DOM.entryArchiveAction, () => {
    if (!G_APP.s.selectedEntryId) {
      setStatus("No entry selected to archive.", true);
      return;
    }
    archiveEntryById(G_APP.s.selectedEntryId);
  });

  bindActionElement(G_DOM.universeSelectAllVisibleAction, () => {
    selectAllUniverseVisibleNodes({
      announce: true
    });
  });

  bindActionElement(G_DOM.universeClearSelectionAction, () => {
    clearUniverseNodeSelection({
      announce: true
    });
  });

  bindActionElement(G_DOM.universeInspectorOpenEntryAction, () => {
    const selectedIndex = G_UNI.view.selectedNodeIndex;
    const selectedNode =
      Number.isInteger(selectedIndex) && selectedIndex >= 0 ? G_UNI.graph.nodes[selectedIndex] : null;
    if (!selectedNode) {
      setStatus("No universe node selected.", true);
      return;
    }
    const entry = getEntryForGraphNode(selectedNode);
    if (!entry) {
      setStatus("Selected node has no source entry.", true);
      return;
    }
    selectEntry(entry.id);
    setStatus(`Opened "${entry.word}" from universe inspector.`);
  });

  if (G_DOM.universeCreateSetForm instanceof HTMLFormElement) {
    G_DOM.universeCreateSetForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const value =
        G_DOM.universeCreateSetInput instanceof HTMLInputElement ? G_DOM.universeCreateSetInput.value : "";
      const created = createUniverseCustomSetFromSelection(value);
      if (created && G_DOM.universeCreateSetInput instanceof HTMLInputElement) {
        G_DOM.universeCreateSetInput.value = "";
      }
    });
  }

  (G_DOM.uiSettingsPopover instanceof HTMLElement) && (G_DOM.uiSettingsPopover.setAttribute("tabindex", "-1"));
  if (G_DOM.uiSettingsTrigger instanceof HTMLElement) {
    G_DOM.uiSettingsTrigger.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      toggleUiSettingsPopover();
    });
    G_DOM.uiSettingsTrigger.addEventListener("keydown", (event) => {
      (event.key === "ArrowDown") && (event.preventDefault(), openUiSettingsPopover());
    });
  }

  [G_DOM.uiThemeEnterpriseInput, G_DOM.uiThemeFuturisticInput, G_DOM.uiThemeMonochromeInput].forEach(
    (input) => {
      if (!(input instanceof HTMLInputElement)) {
        return;
      }
      input.addEventListener("change", (event) => {
        const target = event.target;
        if (!(target instanceof HTMLInputElement) || !target.checked) {
          return;
        }
        updateUiThemePreference(target.value);
      });
    }
  );

  if (G_DOM.uiReduceMotionInput instanceof HTMLInputElement) {
    G_DOM.uiReduceMotionInput.addEventListener("change", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement)) {
        return;
      }
      updateReduceMotionPreference(target.checked);
    });
  }

  if (G_DOM.uiSettingsPopover instanceof HTMLElement) {
    G_DOM.uiSettingsPopover.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeUiSettingsPopover();
        return;
      }
      if (event.key !== "Tab") {
        return;
      }
      const focusables = getUiSettingsFocusableElements();
      if (focusables.length === 0) {
        event.preventDefault();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else {
        (!event.shiftKey && active === last) && (event.preventDefault(), first.focus());
      }
    });
  }

  const submitBulkImport = async () => {
    const mergeMode =
      G_DOM.bulkImportMergeMode instanceof HTMLSelectElement ? G_DOM.bulkImportMergeMode.value : "skip";
    return importEntriesFromText(G_DOM.bulkImportInput.value, mergeMode, { clearInputAfter: true });
  };

  const applyTreeEntrySelection = (entryId, event) => {
    const entry = getEntryById(entryId);
    if (!entry) {
      return;
    }

    const isRange = Boolean(event?.shiftKey);
    const isToggle = Boolean(event?.ctrlKey || event?.metaKey);
    if (isRange) {
      renderEditorForEntry(entry, { syncSelection: false });
      selectEntryRange(entry.id);
      ensureEntryVisible(entry);
      G_PAGE.tree.reqRender();
      return;
    }

    if (isToggle) {
      toggleEntrySelection(entry.id);
      if (G_APP.s.selectedEntryIds.length === 0) {
        resetEditor();
        return;
      }
      const stillSelected = G_APP.s.selectedEntryIds.includes(entry.id);
      if (stillSelected) {
        renderEditorForEntry(entry, { syncSelection: false });
        ensureEntryVisible(entry);
      } else {
        const fallback = getEntryById(G_APP.s.selectedEntryIds[G_APP.s.selectedEntryIds.length - 1]);
        if (fallback) {
          renderEditorForEntry(fallback, { syncSelection: false });
          ensureEntryVisible(fallback);
        }
      }
      G_PAGE.tree.reqRender();
      return;
    }

    selectEntry(entry.id);
  };

  const handleContextAction = (target) => {
    const actionTarget = target.closest("[data-action='context-action']");
    if (!(actionTarget instanceof HTMLElement)) {
      return false;
    }

    const index = Number(actionTarget.dataset.contextIndex);
    const item = Number.isInteger(index) ? G_RT.contextMenuActions[index] : null;
    closeContextMenu();
    (item && typeof item.onSelect === "function") && (item.onSelect());
    return true;
  };

  const handleTreeAction = (target, event = null) => {
    const actionTarget = target.closest("[data-action]");
    if (!(actionTarget instanceof HTMLElement)) {
      return false;
    }

    const { action, entryId, groupKey, label } = actionTarget.dataset;
    if (!action) {
      return false;
    }

    if (action === "toggle-group" && groupKey) {
      toggleGroupExpanded(groupKey);
      G_PAGE.tree.reqRender();
      return true;
    }

    if (action === "show-more" && groupKey) {
      increaseGroupLimit(groupKey);
      G_PAGE.tree.reqRender();
      return true;
    }

    if (action === "select-folder" && groupKey) {
      setTreeFolderSelection(groupKey, label || "");
      G_PAGE.tree.reqRender();
      return true;
    }

    if (action === "select-entry" && entryId) {
      applyTreeEntrySelection(entryId, event);
      return true;
    }

    return false;
  };

  G_DOM.authForm.addEventListener("submit", (event) => {
    event.preventDefault();
    event.stopPropagation();
    submitAuth();
  });

  G_DOM.authUsernameInput.addEventListener("input", () => {
    resetAuthHintIfNeeded();
  });

  G_DOM.authUsernameInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") {
      return;
    }
    event.preventDefault();
    submitAuth();
  });

  G_DOM.authPasswordInput.addEventListener("input", () => {
    resetAuthHintIfNeeded();
  });

  G_DOM.authPasswordInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") {
      return;
    }
    event.preventDefault();
    submitAuth();
  });

  G_DOM.quickWordForm.addEventListener("submit", (event) => {
    event.preventDefault();
    captureWordFromQuickInput().catch((error) => {
      recordDiagnosticError("quick_capture_failed", String(error?.message || error), "quickWordForm");
    });
  });

  G_DOM.quickBatchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    captureBatchWordsFromQuickInput().catch((error) => {
      recordDiagnosticError("quick_batch_submit_failed", String(error?.message || error), "quickBatchForm");
    });
  });

  G_DOM.quickBatchInput.addEventListener("keydown", (event) => {
    if (!(event.metaKey || event.ctrlKey) || event.key !== "Enter") {
      return;
    }
    event.preventDefault();
    captureBatchWordsFromQuickInput().catch((error) => {
      recordDiagnosticError("quick_batch_hotkey_failed", String(error?.message || error), "quickBatchInput");
    });
  });

  G_DOM.treePartOfSpeechFilter.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLSelectElement)) {
      return;
    }
    G_APP.s.treePartOfSpeechFilter = cleanText(target.value, 40) || TREE_POS_FILTER_ALL;
    G_PAGE.tree.reqRender();
  });

  G_DOM.treeActivityFilter.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLSelectElement)) {
      return;
    }
    G_APP.s.treeActivityFilter = cleanText(target.value, 40) || TREE_ACTIVITY_FILTER_ALL;
    G_PAGE.tree.reqRender();
  });

  G_DOM.treeHasGraphOnly.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }
    G_APP.s.treeHasGraphOnly = target.checked;
    G_PAGE.tree.reqRender();
  });

  G_DOM.treeShowArchived.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }
    G_APP.s.treeShowArchived = target.checked;
    G_PAGE.tree.reqRender();
  });

  G_DOM.archiveSearchInput.addEventListener("input", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }
    G_APP.s.archiveSearch = target.value;
    G_PAGE.tree.reqRender();
  });

  G_DOM.localAssistEnabled.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }
    G_APP.s.localAssistEnabled = target.checked;
    scheduleAutosave();
  });

  G_DOM.commandPaletteInput.addEventListener("input", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }
    filterCommandPalette(target.value);
  });

  G_DOM.commandPaletteInput.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (G_RT.cmdItems.length === 0) {
        return;
      }
      G_RT.cmdIdx = (G_RT.cmdIdx + 1) % G_RT.cmdItems.length;
      renderCmdList();
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (G_RT.cmdItems.length === 0) {
        return;
      }
      G_RT.cmdIdx =
        (G_RT.cmdIdx - 1 + G_RT.cmdItems.length) % G_RT.cmdItems.length;
      renderCmdList();
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      executeCommandPaletteItem(G_RT.cmdItems[G_RT.cmdIdx]);
      return;
    }
    (event.key === "Escape") && (event.preventDefault(), closeCmdPalette());
  });

  G_DOM.commandPalette.addEventListener("click", (event) => {
    (event.target === G_DOM.commandPalette) && (closeCmdPalette());
  });

  G_DOM.batchLabelForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const success = applyBatchLabel(G_DOM.batchLabelInput.value);
    if (!success) {
      setStatus("Select one or more words first.", true);
      return;
    }
    G_DOM.batchLabelInput.value = "";
    setStatus("Batch label applied.");
  });

  G_DOM.batchRelabelForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const success = applyBatchRelabel(G_DOM.batchRelabelInput.value);
    if (!success) {
      setStatus("Select one or more words first.", true);
      return;
    }
    G_DOM.batchRelabelInput.value = "";
    setStatus("Batch relabel applied.");
  });

  G_DOM.bulkImportForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await submitBulkImport();
  });

  G_DOM.bulkImportInput.addEventListener("keydown", async (event) => {
    if (!(event.metaKey || event.ctrlKey) || event.key !== "Enter") {
      return;
    }
    event.preventDefault();
    await submitBulkImport();
  });

  G_DOM.importFileInput.addEventListener("change", async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement) || !target.files || target.files.length === 0) {
      return;
    }

    try {
      const file = target.files[0];
      const text = await file.text();
      const mergeMode =
        G_DOM.bulkImportMergeMode instanceof HTMLSelectElement ? G_DOM.bulkImportMergeMode.value : "skip";
      await importEntriesFromText(text, mergeMode);
    } catch (error) {
      setStatus("Could not import file.", true);
      console.error(error);
    } finally {
      target.value = "";
    }
  });

  bindActionElement(G_DOM.exportDataAction, () => {
    const format =
      G_DOM.exportFormatSelect instanceof HTMLSelectElement ? G_DOM.exportFormatSelect.value : "json";
    exportCurrentData(format);
    setStatus(`Exported ${format.toUpperCase()}.`);
  });

  bindActionElement(G_DOM.restoreHistoryAction, () => {
    const checkpointId =
      G_DOM.historyRestoreSelect instanceof HTMLSelectElement ? G_DOM.historyRestoreSelect.value : "";
    const restored = restoreCheckpointById(checkpointId);
    if (!restored) {
      setStatus("Choose a checkpoint first.", true);
      return;
    }
    setStatus("Checkpoint restored.");
  });

  bindActionElement(G_DOM.autoLayoutGraphAction, () => {
    autoLayoutGraph();
  });

  bindActionElement(G_DOM.explorerCompactAction, () => {
    const nextMode =
      G_APP.s.explorerLayoutMode === EXPLORER_LAYOUT_COMPACT ? EXPLORER_LAYOUT_NORMAL : EXPLORER_LAYOUT_COMPACT;
    setExplorerLayoutMode(nextMode);
  });

  bindActionElement(G_DOM.explorerFocusAction, () => {
    const nextMode =
      G_APP.s.explorerLayoutMode === EXPLORER_LAYOUT_MAXIMIZED ? EXPLORER_LAYOUT_NORMAL : EXPLORER_LAYOUT_MAXIMIZED;
    setExplorerLayoutMode(nextMode);
  });

  bindActionElement(G_DOM.showWorkbenchViewAction, () => {
    setActiveView(VIEW_WORKBENCH);
  });

  bindActionElement(G_DOM.showSentenceGraphViewAction, () => {
    setActiveView(VIEW_SENTENCE_GRAPH);
  });

  bindActionElement(G_DOM.showStatisticsViewAction, () => {
    setActiveView(VIEW_STATISTICS);
  });

  bindActionElement(G_DOM.showUniverseViewAction, () => {
    setActiveView(VIEW_UNIVERSE);
  });

  bindActionElement(G_DOM.toggleGraphLockAction, () => {
    toggleGraphLock();
  });

  bindActionElement(G_DOM.buildSentenceSelectionAction, () => {
    buildSentenceFromSelectedEntries();
  });

  bindActionElement(G_DOM.deleteSelectedAction, () => {
    const deleted = deleteSelectedEntries();
    if (!deleted) {
      setStatus("No selected words to archive.", true);
      return;
    }
    setStatus("Selected words archived.");
  });

  bindActionElement(G_DOM.restoreArchivedFilteredAction, () => {
    restoreFilteredArchivedEntries();
  });

  bindActionElement(G_DOM.purgeArchivedFilteredAction, () => {
    purgeFilteredArchivedEntries();
  });

  bindActionElement(G_DOM.openRuntimeConsoleAction, async () => {
    if (!window.dictionaryAPI?.openRuntimeLogConsole) {
      return;
    }
    const result = await window.dictionaryAPI.openRuntimeLogConsole();
    if (!result?.ok) {
      setStatus("Runtime console disabled.", true);
      return;
    }
    setStatus("Runtime console opened.");
  });

  bindActionElement(G_DOM.assistantNormalizeDefinition, () => {
    const mode = normalizeEntryMode(
      G_DOM.entryModeSelect instanceof HTMLSelectElement ? G_DOM.entryModeSelect.value : "definition"
    );
    G_DOM.definitionInput.value =
      mode === "code" || mode === "bytes"
        ? cleanText(G_DOM.definitionInput.value, MAX.DEFINITION)
        : sanitizeDefinitionText(G_DOM.definitionInput.value);
    setEntryWarnings([]);
    scheduleAutoCommitDraft();
    setStatus("Definition normalized.");
  });

  bindActionElement(G_DOM.assistantSuggestLabels, () => {
    const inferred = inferLabelsFromDefinition(G_DOM.definitionInput.value);
    const current = parseLabels(G_DOM.labelsInput.value);
    const next = unique([...current, ...inferred]);
    G_DOM.labelsInput.value = next.join(", ");
    setEntryWarnings([]);
    scheduleAutoCommitDraft();
    setStatus("Suggested labels applied.");
  });

  bindActionElement(G_DOM.assistantResolvePos, () => {
    const current = parseLabels(G_DOM.labelsInput.value);
    const resolved = resolvePosConflictLabels(current, G_DOM.definitionInput.value);
    G_DOM.labelsInput.value = resolved.join(", ");
    const conflicts = detectPosConflicts(resolved);
    setEntryWarnings(conflicts.length > 1 ? [`POS conflict: ${conflicts.join(", ")}`] : []);
    setStatus(conflicts.length > 1 ? "POS conflict remains." : "POS conflict resolved.");
    scheduleAutoCommitDraft();
  });

  G_DOM.sentenceWordForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const typed = cleanText(G_DOM.sentenceWordInput.value, MAX.DEFINITION);
    const words = parseSentenceInputWords(typed);
    if (words.length > 1) {
      const entryIds = words.map((word) => getDuplicateEntry(word)?.id || "");
      addSuggestedPhrase(words, entryIds, {
        statusPrefix: "Added passage"
      });
      G_DOM.sentenceWordInput.value = "";
      return;
    }
    if (words.length === 1) {
      addNodeToSentenceGraph(words[0], getDuplicateEntry(words[0])?.id || "");
      G_DOM.sentenceWordInput.value = "";
      return;
    }

    const fromEntry = addNodeFromSelectedEntry();
    (!fromEntry) && (setSentenceStatus("Type a sentence/paragraph or select one in the tree first."));
  });

  if (G_DOM.sentenceWordInput instanceof HTMLTextAreaElement) {
    G_DOM.sentenceWordInput.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" || event.shiftKey) {
        return;
      }
      event.preventDefault();
      G_DOM.sentenceWordForm.requestSubmit();
    });
  }

  G_DOM.treeView.addEventListener("dblclick", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    const fileItem = target.closest(".fileItem");
    if (!(fileItem instanceof HTMLElement)) {
      return;
    }
    const entryId = cleanText(fileItem.dataset.entryId, MAX.WORD);
    if (!entryId) {
      return;
    }
    const entry = getEntryById(entryId);
    if (!entry) {
      return;
    }
    addNodeToSentenceGraph(entry.word, entry.id);
  });

  G_DOM.sentenceViewport.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const port = target.closest(".sentencePort");
    if (port instanceof HTMLElement) {
      const nodeId = cleanText(port.dataset.nodeId, MAX.WORD);
      const portType = cleanText(port.dataset.port, 10);
      if (!nodeId) {
        return;
      }

      if (portType === "out") {
        G_APP.s.pendingLinkFromNodeId = nodeId;
        G_APP.s.selectedGraphNodeId = nodeId;
        setSentenceStatus("Link mode: click an input port to connect.");
        G_PAGE.sentence.reqRender();
        return;
      }

      if (portType === "in" && G_APP.s.pendingLinkFromNodeId) {
        const fromNodeId = G_APP.s.pendingLinkFromNodeId;
        clearPendingLink();
        G_APP.s.selectedGraphNodeId = nodeId;
        addSentenceLink(fromNodeId, nodeId, {
          render: false
        });
        G_PAGE.sentence.reqRender();
        return;
      }
      return;
    }

    const nodeEl = target.closest(".sentenceNode");
    if (nodeEl instanceof HTMLElement) {
      const nodeId = cleanText(nodeEl.dataset.nodeId, MAX.WORD);
      if (!nodeId) {
        return;
      }
      G_APP.s.selectedGraphNodeId = nodeId;
      G_PAGE.sentence.reqRender();
      return;
    }

    G_APP.s.selectedGraphNodeId = null;
    clearPendingLink();
    G_PAGE.sentence.reqRender();
  });

  G_DOM.sentenceViewport.addEventListener("scroll", () => {
    renderMiniMap();
  });

  G_DOM.graphMiniMap.addEventListener("click", (event) => {
    const rect = G_DOM.graphMiniMap.getBoundingClientRect();
    const relativeX = clampNumber(event.clientX - rect.left, 0, rect.width);
    const relativeY = clampNumber(event.clientY - rect.top, 0, rect.height);
    const ratioX = rect.width > 0 ? relativeX / rect.width : 0;
    const ratioY = rect.height > 0 ? relativeY / rect.height : 0;
    G_DOM.sentenceViewport.scrollLeft = clampNumber(
      ratioX * GRAPH_STAGE_WIDTH - G_DOM.sentenceViewport.clientWidth / 2,
      0,
      GRAPH_STAGE_WIDTH
    );
    G_DOM.sentenceViewport.scrollTop = clampNumber(
      ratioY * GRAPH_STAGE_HEIGHT - G_DOM.sentenceViewport.clientHeight / 2,
      0,
      GRAPH_STAGE_HEIGHT
    );
    renderMiniMap();
  });

  G_DOM.sentenceViewport.addEventListener("contextmenu", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const nodeEl = target.closest(".sentenceNode");
    if (!(nodeEl instanceof HTMLElement)) {
      return;
    }

    event.preventDefault();
    const nodeId = cleanText(nodeEl.dataset.nodeId, MAX.WORD);
    const node = G_PAGE.sentence.getNode(nodeId);
    if (!node) {
      return;
    }
    openContextMenu(
      [
        {
          label: `Start Link from "${node.word}"`,
          onSelect: () => {
            G_APP.s.pendingLinkFromNodeId = node.id;
            G_APP.s.selectedGraphNodeId = node.id;
            setSentenceStatus("Link mode: click an input port to connect.");
            G_PAGE.sentence.reqRender();
          }
        },
        {
          label: node.locked ? `Unlock "${node.word}"` : `Lock "${node.word}"`,
          onSelect: () => {
            G_APP.st.setGraph({
              ...G_APP.s.sentenceGraph,
              nodes: G_APP.s.sentenceGraph.nodes.map((item) =>
                item.id === node.id
                  ? {
                      ...item,
                      locked: !item.locked
                    }
                  : item
              )
            });
            G_PAGE.sentence.reqRender();
            scheduleAutosave();
          }
        },
        {
          label: "Open Source Entry",
          onSelect: () => {
            if (!node.entryId) {
              setSentenceStatus("Node has no linked source entry.");
              return;
            }
            selectEntry(node.entryId);
          }
        },
        {
          label: "Attach Selected Entry",
          onSelect: () => {
            const selectedEntry = getSelectedEntry();
            if (!selectedEntry) {
              setSentenceStatus("Select an entry in the tree first.");
              return;
            }
            G_APP.st.setGraph({
              ...G_APP.s.sentenceGraph,
              nodes: G_APP.s.sentenceGraph.nodes.map((item) =>
                item.id === node.id
                  ? {
                      ...item,
                      entryId: selectedEntry.id,
                      word: selectedEntry.word
                    }
                  : item
              )
            });
            setSentenceStatus(`Node linked to "${selectedEntry.word}".`);
            G_PAGE.sentence.reqRender();
            scheduleAutosave();
          }
        },
        {
          label: `Delete Node "${node.word}"`,
          dangerous: true,
          onSelect: () => removeSentenceNode(node.id)
        }
      ],
      event.clientX,
      event.clientY
    );
  });

  const handleSuggestionAction = (target) => {
    const chip = target.closest(".suggestionChip");
    if (!(chip instanceof HTMLElement)) {
      return false;
    }

    const suggestionIndex = Number(chip.dataset.suggestionIndex);
    const suggestion = Number.isInteger(suggestionIndex) ? G_RT.sentenceSuggestionActions[suggestionIndex] : null;
    if (!suggestion) {
      return false;
    }

    if (suggestion.kind === "auto") {
      autoCompleteFromSelectedNode(suggestion.words, suggestion.entryIds);
      return true;
    }

    if (suggestion.kind === "phrase") {
      addSuggestedPhrase(suggestion.words, suggestion.entryIds);
      return true;
    }

    const word = suggestion.words[0];
    const entryId = suggestion.entryIds[0] || "";
    if (!word) {
      return false;
    }

    addSuggestedNode(word, entryId);
    return true;
  };

  G_DOM.sentenceSuggestions.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    handleSuggestionAction(target);
  });

  G_DOM.sentenceSuggestions.addEventListener("keydown", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }
    (handleSuggestionAction(target)) && (event.preventDefault());
  });

  G_DOM.sentenceNodes.addEventListener("mousedown", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    if (target.closest(".sentencePort")) {
      return;
    }

    const nodeEl = target.closest(".sentenceNode");
    if (!(nodeEl instanceof HTMLElement)) {
      return;
    }

    const nodeId = cleanText(nodeEl.dataset.nodeId, MAX.WORD);
    const node = G_PAGE.sentence.getNode(nodeId);
    if (!node) {
      return;
    }
    if (G_APP.s.graphLockEnabled || node.locked) {
      setSentenceStatus("Node dragging is locked.");
      return;
    }

    G_RT.dragState = {
      nodeId: node.id,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startX: node.x,
      startY: node.y
    };
    G_APP.s.selectedGraphNodeId = node.id;
    G_PAGE.sentence.reqRender();
  });

  window.addEventListener("mousemove", (event) => {
    if (!G_RT.dragState) {
      return;
    }

    const node = G_PAGE.sentence.getNode(G_RT.dragState.nodeId);
    if (!node) {
      G_RT.dragState = null;
      return;
    }

    const deltaX = event.clientX - G_RT.dragState.startClientX;
    const deltaY = event.clientY - G_RT.dragState.startClientY;
    if (G_APP.s.graphLockEnabled || node.locked) {
      G_RT.dragState = null;
      setSentenceStatus("Node dragging is locked.");
      return;
    }
    const nextX = clampNumber(G_RT.dragState.startX + deltaX, 8, GRAPH_STAGE_WIDTH - GRAPH_NODE_WIDTH - 8);
    const nextY = clampNumber(G_RT.dragState.startY + deltaY, 8, GRAPH_STAGE_HEIGHT - GRAPH_NODE_HEIGHT - 8);
    (node.x !== nextX || node.y !== nextY) && (G_RT.gLayoutVer += 1);
    node.x = nextX;
    node.y = nextY;
    G_PAGE.sentence.reqRender({
      refreshPreview: false,
      refreshSuggestions: false
    });
  });

  window.addEventListener("mouseup", () => {
    if (!G_RT.dragState) {
      return;
    }
    G_RT.dragState = null;
    setSentenceStatus("Node moved.");
    scheduleAutosave();
  });

  G_DOM.contextMenu.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    handleContextAction(target);
  });

  G_DOM.contextMenu.addEventListener("keydown", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }
    (handleContextAction(target)) && (event.preventDefault());
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    (!G_DOM.contextMenu.classList.contains("hidden") && (!(target instanceof Node) || !G_DOM.contextMenu.contains(target)) && (closeContextMenu()));

    if (!isUiSettingsPopoverOpen()) {
      return;
    }
    const clickedSettings =
      target instanceof Node &&
      ((G_DOM.uiSettingsPopover instanceof HTMLElement && G_DOM.uiSettingsPopover.contains(target)) ||
        (G_DOM.uiSettingsTrigger instanceof HTMLElement && G_DOM.uiSettingsTrigger.contains(target)));
    if (!clickedSettings) {
      closeUiSettingsPopover({ restoreFocus: false });
    }
  });

  window.addEventListener("resize", () => {
    closeContextMenu();
    closeUiSettingsPopover({ restoreFocus: false });
    renderMiniMap();
  });

  window.addEventListener("scroll", () => {
    closeContextMenu();
    closeUiSettingsPopover({ restoreFocus: false });
  });

  window.addEventListener("keydown", (event) => {
    if (isAuthGateVisible()) {
      return;
    }
    if (isCommandPaletteVisible() && event.key === "Escape") {
      event.preventDefault();
      closeCmdPalette();
      return;
    }
    if (isUiSettingsPopoverOpen() && event.key === "Escape") {
      event.preventDefault();
      closeUiSettingsPopover();
      return;
    }
    if (event.defaultPrevented) {
      return;
    }

    if (event.key === "Escape") {
      closeContextMenu();
      if (G_APP.s.pendingLinkFromNodeId) {
        clearPendingLink();
        setSentenceStatus("Link mode canceled.");
        G_PAGE.sentence.reqRender();
      }
      if (
        document.activeElement instanceof HTMLElement &&
        (document.activeElement === G_DOM.wordInput ||
          document.activeElement === G_DOM.entryModeSelect ||
          document.activeElement === G_DOM.entryLanguageInput ||
          document.activeElement === G_DOM.definitionInput ||
          document.activeElement === G_DOM.labelsInput)
      ) {
        beginNewEntryInLabel("");
      }
    }

    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      const active = document.activeElement;
      if (active === G_DOM.newLabelInput) {
        event.preventDefault();
        G_DOM.newLabelForm.requestSubmit();
        return;
      }
      if (
        active === G_DOM.wordInput ||
        active === G_DOM.entryLanguageInput ||
        active === G_DOM.definitionInput ||
        active === G_DOM.labelsInput
      ) {
        event.preventDefault();
        saveEntryFromForm({ forceNewAfterSave: true });
        return;
      }
    }

    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      (document.activeElement === G_DOM.wordInput ||
        document.activeElement === G_DOM.entryLanguageInput ||
        document.activeElement === G_DOM.definitionInput ||
        document.activeElement === G_DOM.labelsInput)
    ) {
      event.preventDefault();
      saveEntryFromForm({ forceNewAfterSave: true });
      return;
    }

    ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "n") && (event.preventDefault(), beginNewEntryInLabel(""));

    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "p") {
      event.preventDefault();
      openCommandPalette();
      return;
    }

    if ((event.metaKey || event.ctrlKey) && event.key === ",") {
      event.preventDefault();
      toggleUiSettingsPopover();
      return;
    }

    if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key.toLowerCase() === "l") {
      event.preventDefault();
      if (window.dictionaryAPI?.openRuntimeLogConsole) {
        window.dictionaryAPI.openRuntimeLogConsole().catch(() => {});
      }
      return;
    }

    if ((event.metaKey || event.ctrlKey) && event.key === "1") {
      event.preventDefault();
      setActiveView(VIEW_WORKBENCH);
      return;
    }

    if ((event.metaKey || event.ctrlKey) && event.key === "2") {
      event.preventDefault();
      setActiveView(VIEW_SENTENCE_GRAPH);
      return;
    }

    if ((event.metaKey || event.ctrlKey) && event.key === "3") {
      event.preventDefault();
      setActiveView(VIEW_STATISTICS);
      return;
    }

    if ((event.metaKey || event.ctrlKey) && event.key === "4") {
      event.preventDefault();
      setActiveView(VIEW_UNIVERSE);
      return;
    }

    if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key.toLowerCase() === "g") {
      event.preventDefault();
      if (!jumpBetweenEntryAndGraph()) {
        setSentenceStatus("No linked entry/node pair found to jump.");
      }
      return;
    }

    if ((event.metaKey || event.ctrlKey) && !event.shiftKey && event.key.toLowerCase() === "z") {
      event.preventDefault();
      if (!runUndo()) {
        setStatus("Nothing to undo.");
      }
      return;
    }

    if (
      ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key.toLowerCase() === "z") ||
      ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "y")
    ) {
      event.preventDefault();
      (!runRedo()) && (setStatus("Nothing to redo."));
      return;
    }

    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      if (isElementVisibleForInteraction(G_DOM.treeSearchInput)) {
        G_DOM.treeSearchInput.focus();
        G_DOM.treeSearchInput.select();
        return;
      }
      (G_DOM.treeView instanceof HTMLElement) && (G_DOM.treeView.focus());
    }

    if (
      (event.metaKey || event.ctrlKey) &&
      event.key.toLowerCase() === "a" &&
      G_APP.s.activeView === VIEW_UNIVERSE &&
      !isTypingTargetElement(document.activeElement)
    ) {
      event.preventDefault();
      selectAllUniverseVisibleNodes({
        announce: true
      });
      return;
    }

    if (event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
      const number = Number(event.key);
      if (Number.isInteger(number) && number >= 1 && number <= 9) {
        event.preventDefault();
        if (number <= TOP_TREE_LABELS.length) {
          selectTopLabelByIndex(number - 1);
        }
        return;
      }
    }

    (event.altKey && event.key === "ArrowRight") && (event.preventDefault(), expandAllGroups());

    (event.altKey && event.key === "ArrowLeft") && (event.preventDefault(), collapseAllGroups());

    if ((event.key === "ArrowDown" || event.key === "ArrowUp") && !isTypingTargetElement(document.activeElement)) {
      const visible = getVisibleTreeEntries();
      if (visible.length > 0) {
        const currentId = G_APP.s.selectedEntryId || visible[0].id;
        const currentIndex = Math.max(
          0,
          visible.findIndex((entry) => entry.id === currentId)
        );
        const direction = event.key === "ArrowDown" ? 1 : -1;
        const nextIndex = clampNumber(currentIndex + direction, 0, visible.length - 1);
        const nextEntry = visible[nextIndex];
        if (nextEntry) {
          event.preventDefault();
          if (event.shiftKey) {
            renderEditorForEntry(nextEntry, { syncSelection: false });
            selectEntryRange(nextEntry.id);
            ensureEntryVisible(nextEntry);
            G_PAGE.tree.reqRender();
          } else {
            selectEntry(nextEntry.id);
          }
        }
      }
    }

    if (event.key === "Delete") {
      const active = document.activeElement;
      if (!isTypingTargetElement(active)) {
        if (G_APP.s.selectedGraphNodeId) {
          event.preventDefault();
          removeSentenceNode(G_APP.s.selectedGraphNodeId);
          return;
        }
        if (G_APP.s.selectedEntryIds.length > 1) {
          event.preventDefault();
          if (event.shiftKey) {
            [...new Set(G_APP.s.selectedEntryIds)].forEach((entryId) => deleteEntryById(entryId));
          } else {
            deleteSelectedEntries();
          }
          return;
        }
        if (G_APP.s.selectedEntryId) {
          event.preventDefault();
          if (event.shiftKey) {
            deleteEntryById(G_APP.s.selectedEntryId);
          } else {
            deleteSelectedEntry();
          }
        }
      }
    }
  });

  G_DOM.newLabelForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const label = normalizeLabel(G_DOM.newLabelInput.value);
    if (!label) {
      return;
    }
    ensureLabelExists(label);
    G_DOM.newLabelInput.value = "";
    G_PAGE.tree.reqRender();
    scheduleAutosave();
  });

  G_DOM.treeSearchInput.addEventListener("input", (event) => {
    const startedAt = performance.now();
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }
    G_APP.s.treeSearch = target.value;
    if (G_RT.treeSearchTask) {
      G_RT.treeSearchTask.schedule();
    } else {
      G_PAGE.tree.reqRender();
    }
    recordDiagnosticPerf("search_input_ms", performance.now() - startedAt);
  });

  G_DOM.treeLabelFilter.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLSelectElement)) {
      return;
    }
    G_APP.s.treeLabelFilter = target.value;
    G_PAGE.tree.reqRender();
  });

  G_DOM.treeView.addEventListener("click", (event) => {
    closeContextMenu();

    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    handleTreeAction(target, event);
  });

  G_DOM.treeView.addEventListener("keydown", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }
    (handleTreeAction(target, event)) && (event.preventDefault());
  });

  G_DOM.treeView.addEventListener("contextmenu", (event) => {
    event.preventDefault();

    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const entryItem = target.closest(".fileItem");
    if (entryItem instanceof HTMLElement) {
      const entryId = cleanText(entryItem.dataset.entryId, MAX.WORD);
      if (entryId) {
        if (!G_APP.s.selectedEntryIds.includes(entryId)) {
          selectEntry(entryId);
        }
        openEntryContextMenu(entryId, event.clientX, event.clientY);
      }
      return;
    }

    const labeledFolder = target.closest(".treeGroup[data-label]");
    if (labeledFolder instanceof HTMLElement) {
      const label = cleanText(labeledFolder.dataset.label, MAX.LABEL);
      if (label) {
        setTreeFolderSelection(cleanText(labeledFolder.dataset.groupKey, 160), label, { announce: false });
        G_PAGE.tree.reqRender();
        openLabelContextMenu(label, event.clientX, event.clientY);
      }
      return;
    }

    closeContextMenu();
  });

  G_DOM.entryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    saveEntryFromForm({ advanceToNext: !G_APP.s.selectedEntryId });
  });

  bindAutoCommitField(G_DOM.wordInput, {
    onInput: () => {
      refreshInlineWarningsFromForm();
      scheduleAutoLookup();
    },
    onBlur: () => {
      const word = cleanText(G_DOM.wordInput.value, MAX.WORD);
      const mode = normalizeEntryMode(
        G_DOM.entryModeSelect instanceof HTMLSelectElement ? G_DOM.entryModeSelect.value : "definition"
      );
      (mode !== "code" && mode !== "bytes" && word.length >= MIN_LOOKUP_LENGTH) && (clearLookupTimer(), lookupAndSaveEntry(word));
    }
  });
  bindAutoCommitField(G_DOM.entryModeSelect, {
    onInput: () => {
      updateEntryModeVisualState();
      refreshInlineWarningsFromForm();
      scheduleAutoLookup();
    }
  });
  bindAutoCommitField(G_DOM.entryLanguageInput, {
    onInput: () => {
      refreshInlineWarningsFromForm();
    }
  });
  bindAutoCommitField(G_DOM.definitionInput, {
    onInput: () => {
      refreshInlineWarningsFromForm();
    }
  });
  bindAutoCommitField(G_DOM.labelsInput, {
    onInput: () => {
      refreshInlineWarningsFromForm();
    }
  });

  window.addEventListener("beforeunload", () => {
    closeContextMenu();
    closeUiSettingsPopover({ restoreFocus: false });
    clearAutosaveTimer();
    clearUiSettingsSaveTimer(true);
    clearDiagnosticsFlushTimer();
    clearLookupTimer();
    clearEntryCommitTimer();
    clearTreeSearchTimer();
    clearStatsWorkerTimer();
    clearUniverseBuildTimer();
    clearUniverseCacheSaveTimer(true);
    clearRenderSchedules();
    (G_RT.uBench.running) && (G_RT.uBench = createUniverseBenchmarkState(G_RT.uBench.lastResult));
    (G_RT.uHoverFrame) && (window.cancelAnimationFrame(G_RT.uHoverFrame), G_RT.uHoverFrame = 0);
    G_RT.uHoverPoint = null;
    disposeWebglRenderer();
    if (G_RT.statsWorker) {
      try {
        G_RT.statsWorker.terminate();
      } catch {
        // Ignore termination errors.
      }
      G_RT.statsWorker = null;
      G_RT.statsWorkerReady = false;
    }
    if (G_RT.uWorker) {
      try {
        G_RT.uWorker.terminate();
      } catch {
        // Ignore termination errors.
      }
      G_RT.uWorker = null;
      G_RT.uWorkerReady = false;
    }
    (G_RT.uResizeObs) && (G_RT.uResizeObs.disconnect(), G_RT.uResizeObs = null);
    if (G_RT.reduceMotionMediaQuery && G_RT.reduceMotionMediaQueryListener) {
      if (typeof G_RT.reduceMotionMediaQuery.removeEventListener === "function") {
        G_RT.reduceMotionMediaQuery.removeEventListener("change", G_RT.reduceMotionMediaQueryListener);
      } else {
        (typeof G_RT.reduceMotionMediaQuery.removeListener === "function") &&
          (G_RT.reduceMotionMediaQuery.removeListener(G_RT.reduceMotionMediaQueryListener));
      }
    }
    G_RT.reduceMotionMediaQuery = null;
    G_RT.reduceMotionMediaQueryListener = null;

    if (G_RT.readyForAutosave) {
      window.dictionaryAPI.save(buildSnapshot()).catch(() => {});
    }
    if (window.dictionaryAPI?.appendDiagnostics) {
      const pendingDiagnostics = normalizeDiagnostics(G_APP.s.diagnostics);
      if (pendingDiagnostics.errors.length > 0 || pendingDiagnostics.perf.length > 0) {
        window.dictionaryAPI.appendDiagnostics(pendingDiagnostics).catch(() => {});
      }
    }
  });
}

async function initialize() {
  applyUiPreferences(createDefaultUiPreferences());
  (window.dictionaryAPI?.loadUiPreferences) && (await loadUiPreferencesFromDisk());
  initializeUiMotion();
  initializeStatsWorker();
  initializeUniverseWorker();
  bindEvents();
  renderDiagnosticsSummary();

  if (!window.dictionaryAPI) {
    setStatus("App bridge unavailable.", true);
    setAuthHint("App bridge unavailable.", true);
    setAuthGateVisible(true);
    return;
  }

  if (window.dictionaryAPI.getRuntimeLogStatus) {
    try {
      const logStatus = await window.dictionaryAPI.getRuntimeLogStatus();
      G_RT.runtimeLogEnabled = logStatus?.enabled !== false;
    } catch {
      G_RT.runtimeLogEnabled = false;
    }
  }

  pushRuntimeLog("info", "renderer", "Renderer initialized.", "initialize");

  await initializeAuthGate();
}

initialize();
