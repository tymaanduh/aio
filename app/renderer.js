// All constants are loaded from modules/constants.js via window.DictionaryConstants
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
  AUTOSAVE_DELAY_MS,
  AUTO_LOOKUP_DELAY_MS,
  AUTO_ENTRY_COMMIT_DELAY_MS,
  TREE_SEARCH_DELAY_MS,
  STATS_WORKER_SYNC_DELAY_MS,
  MIN_LOOKUP_LENGTH,
  TREE_PAGE_SIZE,
  TREE_VIRTUALIZATION_THRESHOLD,
  TREE_VIRTUAL_ROW_HEIGHT,
  TREE_VIRTUAL_OVERSCAN,
  TREE_VIRTUAL_VIEWPORT_MAX_HEIGHT,
  HISTORY_MAX,
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
  GRAPH_STAGE_WIDTH,
  GRAPH_STAGE_HEIGHT,
  GRAPH_NODE_WIDTH,
  GRAPH_NODE_HEIGHT,
  STATS_WORKER_MIN_ENTRIES,
  AUTO_COMPLETE_STEPS,
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
  UNIVERSE_DPR_MAX,
  UNIVERSE_DPR_HEAVY,
  UNIVERSE_DPR_SOFT,
  UNIVERSE_DPR_LOW,
  UNIVERSE_PERF_SAMPLE_INTERVAL_MS,
  UNIVERSE_PERF_HUD_UPDATE_INTERVAL_MS,
  UNIVERSE_BENCHMARK_DEFAULT_DURATION_MS,
  UNIVERSE_BENCHMARK_MAX_DURATION_MS,
  UNIVERSE_BENCHMARK_SAMPLE_LIMIT,
  UNIVERSE_GPU_STATUS_CACHE_MS,
  UI_PREFERENCES_SAVE_DELAY_MS,
  UI_SETTINGS_FOCUSABLE_SELECTOR,
  PHRASE_PATTERNS,
  POS_FOLLOW_RULES
} = window.DictionaryConstants;

const StoreModule = window.DictionaryStore || {};
const TreeUtilsModule = window.DictionaryTreeUtils || {};
const GraphUtilsModule = window.DictionaryGraphUtils || {};
const IndexingUtilsModule = window.DictionaryIndexingUtils || {};
const DuplicatesUtilsModule = window.DictionaryDuplicatesUtils || {};
const ImportUtilsModule = window.DictionaryImportUtils || {};
const DiagnosticsUtilsModule = window.DictionaryDiagnosticsUtils || {};
const CommandPaletteUtilsModule = window.DictionaryCommandPaletteUtils || {};
const SuggestionUtilsModule = window.DictionarySuggestionUtils || {};
const AuthUtilsModule = window.DictionaryAuthUtils || {};
const AutosaveUtilsModule = window.DictionaryAutosaveUtils || {};
const UiPreferencesUtilsModule = window.DictionaryUiPreferencesUtils || {};

const { createStateStore } = StoreModule;
const { shouldVirtualizeGroup, calculateVirtualWindow } = TreeUtilsModule;
const { buildGraphIndex } = GraphUtilsModule;
const { buildWordPrefixIndex } = IndexingUtilsModule;
const { buildNearDuplicateCluster } = DuplicatesUtilsModule;
const { applyInChunks } = ImportUtilsModule;
const { createDefaultDiagnostics, normalizeDiagnostics, mergeDiagnostics } = DiagnosticsUtilsModule;
const { rankCommands } = CommandPaletteUtilsModule;
const { normalizeWordLower: normalizeWordLowerUtil, inflectVerbForSubject: inflectVerbForSubjectUtil } =
  SuggestionUtilsModule;
const { getAuthSubmitHint: getAuthSubmitHintUtil, isTypingTarget: isTypingTargetUtil } = AuthUtilsModule;
const { createDebouncedTask } = AutosaveUtilsModule;
const { UI_THEME_IDS, createDefaultUiPreferences, normalizeUiTheme, normalizeUiPreferences } = UiPreferencesUtilsModule;

if (
  typeof createStateStore !== "function" ||
  typeof shouldVirtualizeGroup !== "function" ||
  typeof calculateVirtualWindow !== "function" ||
  typeof buildGraphIndex !== "function" ||
  typeof buildWordPrefixIndex !== "function" ||
  typeof buildNearDuplicateCluster !== "function" ||
  typeof applyInChunks !== "function" ||
  typeof createDefaultDiagnostics !== "function" ||
  typeof normalizeDiagnostics !== "function" ||
  typeof mergeDiagnostics !== "function" ||
  typeof rankCommands !== "function" ||
  typeof normalizeWordLowerUtil !== "function" ||
  typeof inflectVerbForSubject !== "function" ||
  typeof getAuthSubmitHintUtil !== "function" ||
  typeof createDebouncedTask !== "function" ||
  !Array.isArray(UI_THEME_IDS) ||
  typeof createDefaultUiPreferences !== "function" ||
  typeof normalizeUiTheme !== "function" ||
  typeof normalizeUiPreferences !== "function"
) {
  throw new Error("Renderer modules failed to load.");
}

const state = {
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

const store = createStateStore(state);

function createEmptyUniverseGraph() {
  return {
    nodes: [],
    edges: [],
    meta: {
      nodeCount: 0,
      edgeCount: 0,
      components: 0,
      isolated: 0,
      largestComponent: 0,
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

function createDefaultUniverseConfig() {
  return {
    minWordLength: UNIVERSE_MIN_WORD_LENGTH,
    maxWordLength: UNIVERSE_MAX_WORD_LENGTH,
    maxNodes: UNIVERSE_MAX_NODES,
    maxEdges: UNIVERSE_MAX_EDGES,
    favoritesOnly: false,
    labelFilter: "",
    colorMode: UNIVERSE_COLOR_MODE_QUESTION,
    renderMode: UNIVERSE_VIEW_MODE_WEBGL,
    edgeModes: {
      contains: true,
      prefix: false,
      suffix: false,
      stem: false,
      sameLabel: false
    },
    bookmarks: []
  };
}

let readyForAutosave = false;
let lookupRequestId = 0;
let lookupInFlightRequestId = 0;
let contextMenuActions = [];
let sentenceSuggestionActions = [];
let authMode = AUTH_MODE_CREATE;
let authBusy = false;
let authStatus = {
  quickLoginEnabled: false
};
let graphDragState = null;
let entriesVersion = 0;
let graphVersion = 0;
let entriesIndexDirty = true;
let graphIndexDirty = true;
let graphLayoutVersion = 0;
let entriesIndexCache = null;
let graphIndexCache = null;
let treeModelCacheKey = "";
let treeModelCacheValue = null;
let searchMatchCacheKey = "";
let searchMatchCacheValue = null;
let labelFilterOptionsCacheKey = "";
let sentenceSuggestionsCacheKey = "";
let sentenceSuggestionsCacheValue = [];
let treeRenderFrameId = 0;
let graphRenderFrameId = 0;
let graphRenderNeedsPreview = false;
let graphRenderNeedsSuggestions = false;
let graphMiniMapCacheKey = "";
let autosaveTask = null;
let lookupTask = null;
let entryCommitTask = null;
let treeSearchTask = null;
let statsWorkerTask = null;
let universeBuildTask = null;
let queuedLookupWord = "";
let lastHistoryDigest = "";
let undoStack = [];
let redoStack = [];
let undoReplayActive = false;
let lastUndoDigest = "";
let commandPaletteItems = [];
let commandPaletteActiveIndex = 0;
let indexWarmupTimer = 0;
let diagnosticsFlushTimer = 0;
let runtimeLogEnabled = true;
let lastStatusLog = "";
let lastSentenceStatusLog = "";
let quickBatchRunning = false;
let uiMotionInitialized = false;
let uiSettingsSaveTimer = 0;
let uiSettingsRestoreFocusElement = null;
let reduceMotionMediaQuery = null;
let reduceMotionMediaQueryListener = null;
let statsWorker = null;
let statsWorkerReady = false;
let statsWorkerRequestId = 0;
let latestStatsWorkerRequestId = 0;
let statsWorkerModel = null;
let statsWorkerModelKey = "";
let statsCacheKey = "";
let statsCacheModel = null;
let universeWorker = null;
let universeWorkerReady = false;
let universeWorkerRequestId = 0;
let latestUniverseWorkerRequestId = 0;
let universeGraphCacheKey = "";
let universeDatasetSignature = "";
let universeCacheLoaded = false; // eslint-disable-line no-unused-vars
let universeCacheSaveTimer = 0;
let universeConfig = createDefaultUniverseConfig();
let universeGraph = createEmptyUniverseGraph();
let universeNodeIndexByEntryId = new Map();
let universeNodeIndexByWord = new Map();
let universePathEdgeKeys = new Set();
let universePathNodeIndices = [];
let universePathWords = [];
let universeSelectedNodeIndices = new Set();
let universeCustomSearchSets = [];
let universeActiveCustomSetId = "";
let universeRenderFrameId = 0;
let universeInteractionActiveUntil = 0;
let universeProjectionCache = null;
let universeHoverFrameId = 0;
let universeHoverPoint = null;
let universePerfSampleAt = 0;
let universePerfSmoothedMs = 0;
let universeFrameSampleAt = 0;
let universeFrameSmoothedMs = 0;
let universePerfHudUpdatedAt = 0;
let universeGpuStatus = null;
let universeGpuStatusLoadedAt = 0;
let universeBenchmarkState = createUniverseBenchmarkState();
let universeGpuForcedCanvas = false;
let universeCanvasSize = {
  width: 0,
  height: 0,
  dpr: 1
};
const universeViewState = {
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
};
let universeResizeObserver = null;
let universeWebglState = null;
const universeHexColorCache = new Map();
let universeCanvasContext = null;
let universeCanvasContextCanvas = null;
let universeSelectionFlags = new Uint8Array(0);
let universePathNodeFlags = new Uint8Array(0);
let universeHighlightFlags = new Uint8Array(0);
let universeHighlightCount = 0;
let universeHighlightCacheKey = "";
let universeAdjacencyCacheKey = "";
let universeAdjacency = [];
let uiPreferences = createDefaultUiPreferences();

autosaveTask = createDebouncedTask(AUTOSAVE_DELAY_MS, () => {
  saveState();
});

lookupTask = createDebouncedTask(AUTO_LOOKUP_DELAY_MS, () => {
  const word = queuedLookupWord;
  queuedLookupWord = "";
  lookupAndSaveEntry(word);
});

entryCommitTask = createDebouncedTask(AUTO_ENTRY_COMMIT_DELAY_MS, () => {
  autoSaveDraftAndAdvance();
});

treeSearchTask = createDebouncedTask(TREE_SEARCH_DELAY_MS, () => {
  requestTreeRender();
});

statsWorkerTask = createDebouncedTask(STATS_WORKER_SYNC_DELAY_MS, () => {
  requestStatsWorkerComputeNow();
});

universeBuildTask = createDebouncedTask(UNIVERSE_BUILD_DELAY_MS, () => {
  requestUniverseGraphBuildNow();
});

const elements = {
  appRoot: document.getElementById("appRoot"),
  treePane: document.getElementById("treePane"),
  uiSettingsTrigger: document.getElementById("uiSettingsTrigger"),
  uiSettingsPopover: document.getElementById("uiSettingsPopover"),
  uiThemeEnterpriseInput: document.getElementById("uiThemeEnterpriseInput"),
  uiThemeFuturisticInput: document.getElementById("uiThemeFuturisticInput"),
  uiThemeMonochromeInput: document.getElementById("uiThemeMonochromeInput"),
  uiReduceMotionInput: document.getElementById("uiReduceMotionInput"),
  authGate: document.getElementById("authGate"),
  authTitle: document.getElementById("authTitle"),
  authSubtitle: document.getElementById("authSubtitle"),
  authForm: document.getElementById("authForm"),
  authUsernameInput: document.getElementById("authUsernameInput"),
  authPasswordInput: document.getElementById("authPasswordInput"),
  authHint: document.getElementById("authHint"),
  sentenceWordForm: document.getElementById("sentenceWordForm"),
  sentenceWordInput: document.getElementById("sentenceWordInput"),
  sentenceViewport: document.getElementById("sentenceViewport"),
  sentenceStage: document.getElementById("sentenceStage"),
  sentenceEdges: document.getElementById("sentenceEdges"),
  sentenceNodes: document.getElementById("sentenceNodes"),
  graphMiniMap: document.getElementById("graphMiniMap"),
  graphMiniMapSvg: document.getElementById("graphMiniMapSvg"),
  graphMiniMapViewport: document.getElementById("graphMiniMapViewport"),
  sentenceSuggestions: document.getElementById("sentenceSuggestions"),
  sentenceStatus: document.getElementById("sentenceStatus"),
  sentencePreview: document.getElementById("sentencePreview"),
  saveStatus: document.getElementById("saveStatus"),
  explorerCompactAction: document.getElementById("explorerCompactAction"),
  explorerFocusAction: document.getElementById("explorerFocusAction"),
  quickWordForm: document.getElementById("quickWordForm"),
  quickWordInput: document.getElementById("quickWordInput"),
  quickBatchForm: document.getElementById("quickBatchForm"),
  quickBatchInput: document.getElementById("quickBatchInput"),
  quickCaptureStatus: document.getElementById("quickCaptureStatus"),
  topLabelBar: document.getElementById("topLabelBar"),
  universeInspectorPane: document.getElementById("universeInspectorPane"),
  universeInspectorSummary: document.getElementById("universeInspectorSummary"),
  universeSelectAllVisibleAction: document.getElementById("universeSelectAllVisibleAction"),
  universeClearSelectionAction: document.getElementById("universeClearSelectionAction"),
  universeSelectionSummary: document.getElementById("universeSelectionSummary"),
  universeSelectionList: document.getElementById("universeSelectionList"),
  universeCreateSetForm: document.getElementById("universeCreateSetForm"),
  universeCreateSetInput: document.getElementById("universeCreateSetInput"),
  universeCustomSetsSummary: document.getElementById("universeCustomSetsSummary"),
  universeCustomSetsList: document.getElementById("universeCustomSetsList"),
  universeNodeInspectorTitle: document.getElementById("universeNodeInspectorTitle"),
  universeNodeInspectorMeta: document.getElementById("universeNodeInspectorMeta"),
  universeNodeInspectorDefinition: document.getElementById("universeNodeInspectorDefinition"),
  universeNodeInspectorFacts: document.getElementById("universeNodeInspectorFacts"),
  universeInspectorOpenEntryAction: document.getElementById("universeInspectorOpenEntryAction"),
  openRuntimeConsoleAction: document.getElementById("openRuntimeConsoleAction"),
  newLabelForm: document.getElementById("newLabelForm"),
  newLabelInput: document.getElementById("newLabelInput"),
  treeSearchInput: document.getElementById("treeSearchInput"),
  treeLabelFilter: document.getElementById("treeLabelFilter"),
  treePartOfSpeechFilter: document.getElementById("treePartOfSpeechFilter"),
  treeActivityFilter: document.getElementById("treeActivityFilter"),
  treeHasGraphOnly: document.getElementById("treeHasGraphOnly"),
  treeShowArchived: document.getElementById("treeShowArchived"),
  archiveSearchInput: document.getElementById("archiveSearchInput"),
  restoreArchivedFilteredAction: document.getElementById("restoreArchivedFilteredAction"),
  purgeArchivedFilteredAction: document.getElementById("purgeArchivedFilteredAction"),
  archiveSummary: document.getElementById("archiveSummary"),
  archiveList: document.getElementById("archiveList"),
  batchLabelForm: document.getElementById("batchLabelForm"),
  batchLabelInput: document.getElementById("batchLabelInput"),
  batchRelabelForm: document.getElementById("batchRelabelForm"),
  batchRelabelInput: document.getElementById("batchRelabelInput"),
  bulkImportForm: document.getElementById("bulkImportForm"),
  bulkImportInput: document.getElementById("bulkImportInput"),
  bulkImportMergeMode: document.getElementById("bulkImportMergeMode"),
  importFileInput: document.getElementById("importFileInput"),
  exportFormatSelect: document.getElementById("exportFormatSelect"),
  exportDataAction: document.getElementById("exportDataAction"),
  historyRestoreSelect: document.getElementById("historyRestoreSelect"),
  restoreHistoryAction: document.getElementById("restoreHistoryAction"),
  autoLayoutGraphAction: document.getElementById("autoLayoutGraphAction"),
  toggleGraphLockAction: document.getElementById("toggleGraphLockAction"),
  buildSentenceSelectionAction: document.getElementById("buildSentenceSelectionAction"),
  deleteSelectedAction: document.getElementById("deleteSelectedAction"),
  treeSummary: document.getElementById("treeSummary"),
  treeView: document.getElementById("treeView"),
  contextMenu: document.getElementById("contextMenu"),
  formTitle: document.getElementById("formTitle"),
  showWorkbenchViewAction: document.getElementById("showWorkbenchViewAction"),
  showSentenceGraphViewAction: document.getElementById("showSentenceGraphViewAction"),
  showStatisticsViewAction: document.getElementById("showStatisticsViewAction"),
  showUniverseViewAction: document.getElementById("showUniverseViewAction"),
  workbenchView: document.getElementById("workbenchView"),
  sentenceGraphView: document.getElementById("sentenceGraphView"),
  statisticsView: document.getElementById("statisticsView"),
  universeView: document.getElementById("universeView"),
  universeSummary: document.getElementById("universeSummary"),
  universeFilterInput: document.getElementById("universeFilterInput"),
  universePerfHud: document.getElementById("universePerfHud"),
  universeBenchmarkAction: document.getElementById("universeBenchmarkAction"),
  universeBenchmarkStopAction: document.getElementById("universeBenchmarkStopAction"),
  universeGpuStatusAction: document.getElementById("universeGpuStatusAction"),
  universeJumpAction: document.getElementById("universeJumpAction"),
  universeColorModeSelect: document.getElementById("universeColorModeSelect"),
  universeRenderModeSelect: document.getElementById("universeRenderModeSelect"),
  universeMinWordLengthInput: document.getElementById("universeMinWordLengthInput"),
  universeMaxNodesInput: document.getElementById("universeMaxNodesInput"),
  universeMaxEdgesInput: document.getElementById("universeMaxEdgesInput"),
  universeFavoritesOnlyInput: document.getElementById("universeFavoritesOnlyInput"),
  universeLabelFilterInput: document.getElementById("universeLabelFilterInput"),
  universeApplyFiltersAction: document.getElementById("universeApplyFiltersAction"),
  universeEdgeContainsAction: document.getElementById("universeEdgeContainsAction"),
  universeEdgePrefixAction: document.getElementById("universeEdgePrefixAction"),
  universeEdgeSuffixAction: document.getElementById("universeEdgeSuffixAction"),
  universeEdgeStemAction: document.getElementById("universeEdgeStemAction"),
  universeEdgeSameLabelAction: document.getElementById("universeEdgeSameLabelAction"),
  universePathFromInput: document.getElementById("universePathFromInput"),
  universePathToInput: document.getElementById("universePathToInput"),
  universeFindPathAction: document.getElementById("universeFindPathAction"),
  universePathStatus: document.getElementById("universePathStatus"),
  universeResetCameraAction: document.getElementById("universeResetCameraAction"),
  universeFitCameraAction: document.getElementById("universeFitCameraAction"),
  universeSaveViewAction: document.getElementById("universeSaveViewAction"),
  universeBookmarkSelect: document.getElementById("universeBookmarkSelect"),
  universeLoadViewAction: document.getElementById("universeLoadViewAction"),
  universeExportPngAction: document.getElementById("universeExportPngAction"),
  universeExportJsonAction: document.getElementById("universeExportJsonAction"),
  universeClusterSummary: document.getElementById("universeClusterSummary"),
  universeClusterList: document.getElementById("universeClusterList"),
  universeCanvas: document.getElementById("universeCanvas"),
  universeCanvasGl: document.getElementById("universeCanvasGl"),
  entryForm: document.getElementById("entryForm"),
  wordInput: document.getElementById("wordInput"),
  entryModeSelect: document.getElementById("entryModeSelect"),
  entryLanguageInput: document.getElementById("entryLanguageInput"),
  definitionInput: document.getElementById("definitionInput"),
  labelsInput: document.getElementById("labelsInput"),
  assistantNormalizeDefinition: document.getElementById("assistantNormalizeDefinition"),
  assistantSuggestLabels: document.getElementById("assistantSuggestLabels"),
  assistantResolvePos: document.getElementById("assistantResolvePos"),
  entryWarnings: document.getElementById("entryWarnings"),
  helperText: document.getElementById("helperText"),
  localAssistEnabled: document.getElementById("localAssistEnabled"),
  entryInsights: document.getElementById("entryInsights"),
  commandPalette: document.getElementById("commandPalette"),
  commandPaletteInput: document.getElementById("commandPaletteInput"),
  commandPaletteList: document.getElementById("commandPaletteList"),
  diagnosticsSummary: document.getElementById("diagnosticsSummary"),
  diagnosticsErrorsList: document.getElementById("diagnosticsErrorsList"),
  diagnosticsPerfList: document.getElementById("diagnosticsPerfList"),
  statsOverviewList: document.getElementById("statsOverviewList"),
  statsMostUsedList: document.getElementById("statsMostUsedList"),
  statsLeastUsedList: document.getElementById("statsLeastUsedList"),
  statsRecentList: document.getElementById("statsRecentList"),
  statsLabelsList: document.getElementById("statsLabelsList"),
  statsModeList: document.getElementById("statsModeList")
};

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

function normalizeUniverseBookmark(value, index = 0) {
  const source = value && typeof value === "object" ? value : {};
  const panX = Number(source.panX);
  const panY = Number(source.panY);
  const zoom = Number(source.zoom);
  return {
    id: cleanText(source.id, 120) || window.crypto.randomUUID(),
    name: cleanText(source.name, 60) || `View ${index + 1}`,
    panX: Number.isFinite(panX) ? clampNumber(panX, -1.6, 1.6) : 0,
    panY: Number.isFinite(panY) ? clampNumber(panY, -1.6, 1.6) : 0,
    zoom: Number.isFinite(zoom) ? clampNumber(zoom, UNIVERSE_ZOOM_MIN, UNIVERSE_ZOOM_MAX) : 1,
    createdAt: cleanText(source.createdAt, MAX.DATE) || nowIso()
  };
}

function normalizeUniverseCustomSearchSet(value, index = 0) {
  const source = value && typeof value === "object" ? value : {};
  const entryIds = unique(
    (Array.isArray(source.entryIds) ? source.entryIds : [])
      .map((entryId) => cleanText(entryId, MAX.WORD))
      .filter(Boolean)
  ).slice(0, 5000);
  const words = unique(
    (Array.isArray(source.words) ? source.words : [])
      .map((word) => normalizeWordLower(cleanText(word, MAX.WORD)))
      .filter(Boolean)
  ).slice(0, 5000);
  return {
    id: cleanText(source.id, MAX.WORD) || window.crypto.randomUUID(),
    name: cleanText(source.name, 80) || `Set ${index + 1}`,
    entryIds,
    words,
    createdAt: cleanText(source.createdAt, MAX.DATE) || nowIso()
  };
}

function normalizeUniverseCustomSearchSets(rawSets) {
  return (Array.isArray(rawSets) ? rawSets : [])
    .map((item, index) => normalizeUniverseCustomSearchSet(item, index))
    .slice(0, 120);
}

function normalizeUniverseConfig(rawConfig) {
  const defaults = createDefaultUniverseConfig();
  const source = rawConfig && typeof rawConfig === "object" ? rawConfig : {};
  const minWordLength = clampNumber(Math.floor(Number(source.minWordLength) || defaults.minWordLength), 2, 12);
  const maxNodes = clampNumber(Math.floor(Number(source.maxNodes) || defaults.maxNodes), 50, 5000);
  const maxEdges = clampNumber(Math.floor(Number(source.maxEdges) || defaults.maxEdges), 100, 50000);
  const maxWordLength = clampNumber(Math.floor(Number(source.maxWordLength) || defaults.maxWordLength), 8, 48);
  const colorMode = cleanText(source.colorMode, 20);
  const renderMode = cleanText(source.renderMode, 20);
  const edgeModesSource = source.edgeModes && typeof source.edgeModes === "object" ? source.edgeModes : {};
  const edgeModes = {
    contains: edgeModesSource.contains !== false,
    prefix: edgeModesSource.prefix === true,
    suffix: edgeModesSource.suffix === true,
    stem: edgeModesSource.stem === true,
    sameLabel: edgeModesSource.sameLabel === true
  };
  if (!edgeModes.contains && !edgeModes.prefix && !edgeModes.suffix && !edgeModes.stem && !edgeModes.sameLabel) {
    edgeModes.contains = true;
  }
  return {
    minWordLength,
    maxWordLength,
    maxNodes,
    maxEdges,
    favoritesOnly: Boolean(source.favoritesOnly),
    labelFilter: cleanText(source.labelFilter, MAX.LABEL).toLowerCase(),
    colorMode:
      colorMode === UNIVERSE_COLOR_MODE_POS || colorMode === UNIVERSE_COLOR_MODE_MODE
        ? colorMode
        : UNIVERSE_COLOR_MODE_QUESTION,
    renderMode: renderMode === UNIVERSE_VIEW_MODE_CANVAS ? UNIVERSE_VIEW_MODE_CANVAS : UNIVERSE_VIEW_MODE_WEBGL,
    edgeModes,
    bookmarks: (Array.isArray(source.bookmarks) ? source.bookmarks : [])
      .map((bookmark, index) => normalizeUniverseBookmark(bookmark, index))
      .slice(0, UNIVERSE_BOOKMARK_LIMIT)
  };
}

function getUniverseDatasetSignature(entries) {
  const active = (Array.isArray(entries) ? entries : [])
    .filter((entry) => entry && typeof entry === "object" && !entry.archivedAt)
    .map((entry) => {
      const labels = normalizeLabelArray(entry.labels).sort((a, b) => a.localeCompare(b));
      return [
        cleanText(entry.id, MAX.WORD),
        normalizeWordLower(entry.word),
        normalizeEntryMode(entry.mode),
        String(Math.max(0, Math.floor(Number(entry.usageCount) || 0))),
        entry.favorite ? "1" : "0",
        labels.join("|")
      ].join(":");
    })
    .sort((left, right) => left.localeCompare(right));
  let hashA = 2166136261;
  let hashB = 2166136261;
  for (let itemIndex = 0; itemIndex < active.length; itemIndex += 1) {
    const token = active[itemIndex];
    for (let charIndex = 0; charIndex < token.length; charIndex += 1) {
      const code = token.charCodeAt(charIndex);
      hashA ^= code;
      hashA = Math.imul(hashA, 16777619);
      hashB ^= code + ((charIndex + 1) * 31 + itemIndex);
      hashB = Math.imul(hashB, 16777619);
    }
    hashA ^= 59;
    hashA = Math.imul(hashA, 16777619);
    hashB ^= 43;
    hashB = Math.imul(hashB, 16777619);
  }
  return `${active.length}:${(hashA >>> 0).toString(16)}:${(hashB >>> 0).toString(16)}`;
}

function listItem(text) {
  const item = document.createElement("li");
  item.textContent = text;
  return item;
}

function pushRuntimeLog(level, source, message, context = "") {
  if (!runtimeLogEnabled || !window.dictionaryAPI?.appendRuntimeLog) {
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
  const indexed = getEntriesIndex().byWordLower.get(normalizedWord) || null;
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
  if (/^to\s+[a-z]/.test(text) || /\bto\s+[a-z]+\b/.test(text)) {
    inferred.add("verb");
  }
  if (/^\ba\s|\ban\s|\bthe\s/.test(text)) {
    inferred.add("noun");
  }
  if (/\bly\b/.test(text) || /\bin an? .* manner\b/.test(text)) {
    inferred.add("adverb");
  }

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
  if (/\b(place|location|city|country|region|area|site|office|server|environment|domain)\b/.test(text)) {
    labels.add("Where");
  }
  if (/\b(time|date|year|month|day|hour|era|period|schedule|deadline|timestamp)\b/.test(text)) {
    labels.add("When");
  }
  if (/\b(reason|purpose|because|cause|motivation|motive|goal|intent)\b/.test(text)) {
    labels.add("Why");
  }
  if (/\b(method|process|procedure|way|step|technique|algorithm|implementation)\b/.test(text)) {
    labels.add("How");
  }
  if (labels.size === 0 || /\b(thing|object|concept|term|word|value|type|entity)\b/.test(text)) {
    labels.add("What");
  }

  return [...labels].map(normalizeLabel).filter(Boolean);
}

function getGraphEntryIdSet() {
  const linkedEntryIds = getGraphIndex().linkedEntryIds;
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
  state.selectedEntryIds = [];
  state.lastSelectedEntryId = null;
}

function setSingleEntrySelection(entryId) {
  state.selectedEntryIds = entryId ? [entryId] : [];
  state.lastSelectedEntryId = entryId || null;
}

function toggleEntrySelection(entryId) {
  if (!entryId) {
    return;
  }
  const selected = new Set(state.selectedEntryIds);
  if (selected.has(entryId)) {
    selected.delete(entryId);
  } else {
    selected.add(entryId);
  }
  state.selectedEntryIds = [...selected];
  state.lastSelectedEntryId = entryId;
}

function selectEntryRange(targetEntryId) {
  const visible = getVisibleTreeEntries();
  if (visible.length === 0 || !targetEntryId) {
    return;
  }

  const anchorId = state.lastSelectedEntryId || state.selectedEntryId || targetEntryId;
  const fromIndex = visible.findIndex((entry) => entry.id === anchorId);
  const toIndex = visible.findIndex((entry) => entry.id === targetEntryId);
  if (fromIndex < 0 || toIndex < 0) {
    setSingleEntrySelection(targetEntryId);
    return;
  }

  const [start, end] = fromIndex < toIndex ? [fromIndex, toIndex] : [toIndex, fromIndex];
  state.selectedEntryIds = visible.slice(start, end + 1).map((entry) => entry.id);
  state.lastSelectedEntryId = targetEntryId;
}

function getSelectedEntries() {
  if (!Array.isArray(state.selectedEntryIds) || state.selectedEntryIds.length === 0) {
    return [];
  }
  const selectedSet = new Set(state.selectedEntryIds);
  return state.entries.filter((entry) => selectedSet.has(entry.id));
}

function updateHistoryRestoreOptions() {
  if (!(elements.historyRestoreSelect instanceof HTMLSelectElement)) {
    return;
  }

  elements.historyRestoreSelect.innerHTML = "";
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = `Restore checkpoint (${state.history.length})`;
  elements.historyRestoreSelect.appendChild(placeholder);

  state.history.forEach((checkpoint) => {
    const option = document.createElement("option");
    option.value = checkpoint.id;
    option.textContent = `${new Date(checkpoint.createdAt).toLocaleString()} - ${checkpoint.reason || "snapshot"}`;
    elements.historyRestoreSelect.appendChild(option);
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
    labels: [...state.labels],
    entries: state.entries.map((entry) => ({
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
      nodes: state.sentenceGraph.nodes.map((node) => ({ ...node })),
      links: state.sentenceGraph.links.map((link) => ({ ...link }))
    }
  };
}

function ensureCheckpoint(reason = "autosave") {
  const checkpoint = buildHistoryCheckpoint(reason);
  const digest = buildCheckpointDigest(checkpoint);
  if (digest === lastHistoryDigest) {
    return;
  }
  lastHistoryDigest = digest;
  state.history = [checkpoint, ...state.history].slice(0, HISTORY_MAX);
  updateHistoryRestoreOptions();
}

function restoreCheckpointById(checkpointId) {
  const id = cleanText(checkpointId, MAX.WORD);
  if (!id) {
    return false;
  }
  const checkpoint = state.history.find((item) => item.id === id);
  if (!checkpoint) {
    return false;
  }

  store.setLabels(normalizeLabelArray(checkpoint.labels));
  store.setEntries(
    (Array.isArray(checkpoint.entries) ? checkpoint.entries : []).map(normalizeLoadedEntry).filter(Boolean)
  );
  sortEntries();
  store.setGraph(normalizeLoadedSentenceGraph(checkpoint.sentenceGraph));
  state.selectedEntryId = null;
  state.selectedGraphNodeId = null;
  clearEntrySelections();
  clearPendingGraphLink();
  requestTreeRender();
  requestSentenceGraphRender();
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
  if (clearInputAfter) {
    elements.bulkImportInput.value = "";
  }
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
        store.addEntry({
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
        store.updateEntryById(duplicate.id, () => ({
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
        store.addEntry({
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
  requestTreeRender();
  requestSentenceGraphRender();
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
  const rows = state.entries.map((entry) =>
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
  if (state.sentenceGraph.nodes.length === 0) {
    setSentenceStatus("Nothing to layout.");
    return;
  }

  const columns = Math.max(1, Math.floor(GRAPH_STAGE_WIDTH / 260));
  const nextNodes = state.sentenceGraph.nodes.map((node, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    return {
      ...node,
      x: normalizeGraphCoordinate(44 + column * 230, GRAPH_STAGE_WIDTH, GRAPH_NODE_WIDTH),
      y: normalizeGraphCoordinate(44 + row * 92, GRAPH_STAGE_HEIGHT, GRAPH_NODE_HEIGHT)
    };
  });
  store.setGraph({
    ...state.sentenceGraph,
    nodes: nextNodes
  });
  setSentenceStatus("Graph auto-layout applied.");
  requestSentenceGraphRender();
  scheduleAutosave();
}

function toggleGraphLock() {
  state.graphLockEnabled = !state.graphLockEnabled;
  if (elements.toggleGraphLockAction) {
    elements.toggleGraphLockAction.textContent = state.graphLockEnabled ? "Unlock Graph Drag" : "Lock Graph Drag";
  }
  setSentenceStatus(state.graphLockEnabled ? "Graph drag locked." : "Graph drag unlocked.");
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
    store.updateEntryById(entry.id, (current) => ({
      ...current,
      labels: unique([...current.labels, normalized]),
      updatedAt: nowIso()
    }));
  });
  sortEntries();
  requestTreeRender();
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
    store.updateEntryById(entry.id, (current) => ({
      ...current,
      labels: [normalized],
      updatedAt: nowIso()
    }));
  });
  sortEntries();
  requestTreeRender();
  scheduleAutosave();
  return true;
}

function deleteSelectedEntries() {
  const selectedIds = [...new Set(state.selectedEntryIds)];
  if (selectedIds.length === 0) {
    return false;
  }
  selectedIds.forEach((entryId) => {
    archiveEntryById(entryId);
  });
  clearEntrySelections();
  setHelperText("Selected entries archived. Enable 'Show archived' to restore.");
  requestTreeRender();
  return true;
}

function setStatus(message, isError = false) {
  elements.saveStatus.textContent = message;
  elements.saveStatus.classList.toggle("error", isError);
  const nextKey = `${isError ? "error" : "info"}:${message}`;
  if (nextKey !== lastStatusLog) {
    lastStatusLog = nextKey;
    pushRuntimeLog(isError ? "error" : "info", "status", message, "saveStatus");
  }
  if (isError) {
    recordDiagnosticError("status_error", message, "setStatus");
  }
}

function formatSaved(timestamp) {
  if (!timestamp) {
    return "Ready";
  }
  return `Saved ${new Date(timestamp).toLocaleString()}`;
}

function setHelperText(message) {
  elements.helperText.textContent = message;
}

function normalizeExplorerLayoutMode(mode) {
  if (mode === EXPLORER_LAYOUT_COMPACT || mode === EXPLORER_LAYOUT_MAXIMIZED) {
    return mode;
  }
  return EXPLORER_LAYOUT_NORMAL;
}

function syncExplorerLayoutControls() {
  const compactActive = state.explorerLayoutMode === EXPLORER_LAYOUT_COMPACT;
  const focusActive = state.explorerLayoutMode === EXPLORER_LAYOUT_MAXIMIZED;
  if (elements.explorerCompactAction instanceof HTMLElement) {
    elements.explorerCompactAction.classList.toggle("active", compactActive);
    elements.explorerCompactAction.setAttribute("aria-pressed", compactActive ? "true" : "false");
  }
  if (elements.explorerFocusAction instanceof HTMLElement) {
    elements.explorerFocusAction.classList.toggle("active", focusActive);
    elements.explorerFocusAction.setAttribute("aria-pressed", focusActive ? "true" : "false");
  }
}

function setExplorerLayoutMode(mode, options = {}) {
  const { announce = true } = options;
  const normalized = normalizeExplorerLayoutMode(mode);
  state.explorerLayoutMode = normalized;
  if (elements.appRoot instanceof HTMLElement) {
    elements.appRoot.classList.toggle("explorer-compact", normalized === EXPLORER_LAYOUT_COMPACT);
    elements.appRoot.classList.toggle("explorer-maximized", normalized === EXPLORER_LAYOUT_MAXIMIZED);
  }
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
  const selectedFolder = normalizeLabel(state.selectedTreeLabel);
  if (selectedFolder) {
    return selectedFolder;
  }
  if (state.treeLabelFilter !== LABEL_FILTER_ALL && state.treeLabelFilter !== LABEL_FILTER_UNLABELED) {
    return normalizeLabel(state.treeLabelFilter);
  }
  return "";
}

function setTreeFolderSelection(groupKey, label = "", options = {}) {
  const { announce = true } = options;
  state.selectedTreeGroupKey = cleanText(groupKey, 160);
  state.selectedTreeLabel = normalizeLabel(label);
  if (!state.selectedEntryId && state.selectedTreeLabel && elements.labelsInput instanceof HTMLInputElement) {
    elements.labelsInput.value = state.selectedTreeLabel;
  }
  if (!announce) {
    return;
  }
  if (state.selectedTreeLabel) {
    setStatus(`Folder selected: ${state.selectedTreeLabel}`);
    return;
  }
  setStatus("Folder selected.");
}

function isAuthGateVisible() {
  return !elements.authGate.classList.contains("hidden");
}

function setAuthGateVisible(visible) {
  elements.authGate.classList.toggle("hidden", !visible);
  elements.appRoot.classList.toggle("hidden", visible);
  document.body.classList.toggle("auth-active", visible);
  document.body.classList.toggle("app-active", !visible);
}

function setAuthHint(message, isError = false) {
  elements.authHint.textContent = message;
  elements.authHint.classList.toggle("error", isError);
  pushRuntimeLog(isError ? "warn" : "info", "auth", message, "authHint");
}

function setAuthMode(mode) {
  authMode = mode === AUTH_MODE_LOGIN ? AUTH_MODE_LOGIN : AUTH_MODE_CREATE;
  if (authMode === AUTH_MODE_CREATE) {
    elements.authTitle.textContent = "Create Account";
    elements.authSubtitle.textContent = "Create your first local account to unlock your dictionary.";
    setAuthHint(getAuthSubmitHint());
    return;
  }

  elements.authTitle.textContent = "Login";
  elements.authSubtitle.textContent = authStatus.quickLoginEnabled
    ? "Enter your username and password to open your dictionary. Quick login enabled for this build: admin/admin, demo/demo, root/root, user/user, guest/guest."
    : "Enter your username and password to open your dictionary.";
  setAuthHint(getAuthSubmitHint());
}

function getAuthCredentials() {
  return {
    username: cleanText(elements.authUsernameInput.value, 40),
    password: String(elements.authPasswordInput.value || "").slice(0, 120)
  };
}

function clampNumber(value, min, max) {
  if (!Number.isFinite(value)) {
    return min;
  }
  return Math.max(min, Math.min(max, value));
}

function normalizeGraphCoordinate(value, max, nodeSize) {
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
  return Boolean(reduceMotionMediaQuery && reduceMotionMediaQuery.matches);
}

function isMotionReduced() {
  return Boolean(uiPreferences?.reduceMotion) || isSystemReducedMotionEnabled();
}

function applyUiTheme(theme) {
  const normalizedTheme = normalizeUiTheme(theme);
  document.documentElement.setAttribute("data-theme", normalizedTheme);
  if (document.body) {
    document.body.setAttribute("data-theme", normalizedTheme);
  }
  document.documentElement.style.colorScheme = normalizedTheme === "futuristic" ? "dark" : "light";
  return normalizedTheme;
}

function applyMotionPreference(reduceMotion) {
  uiPreferences = getNormalizedUiPreferences({
    ...uiPreferences,
    reduceMotion: Boolean(reduceMotion)
  });

  const reduced = isMotionReduced();
  document.body.classList.toggle("motion-reduced", reduced);
  document.body.classList.toggle("motion-ready", !reduced);
  if (reduced) {
    document.documentElement.style.setProperty("--mx", "0.5");
    document.documentElement.style.setProperty("--my", "0.5");
    document.querySelectorAll(".authCard").forEach((target) => {
      if (target instanceof HTMLElement) {
        target.style.removeProperty("transform");
      }
    });
  }
  return reduced;
}

function syncUiSettingsControls() {
  const theme = normalizeUiTheme(uiPreferences?.theme);
  if (elements.uiThemeEnterpriseInput instanceof HTMLInputElement) {
    elements.uiThemeEnterpriseInput.checked = theme === "enterprise";
  }
  if (elements.uiThemeFuturisticInput instanceof HTMLInputElement) {
    elements.uiThemeFuturisticInput.checked = theme === "futuristic";
  }
  if (elements.uiThemeMonochromeInput instanceof HTMLInputElement) {
    elements.uiThemeMonochromeInput.checked = theme === "monochrome";
  }
  if (elements.uiReduceMotionInput instanceof HTMLInputElement) {
    elements.uiReduceMotionInput.checked = Boolean(uiPreferences?.reduceMotion);
  }
}

function applyUiPreferences(input) {
  uiPreferences = getNormalizedUiPreferences(input);
  uiPreferences.theme = applyUiTheme(uiPreferences.theme);
  applyMotionPreference(uiPreferences.reduceMotion);
  state.uiPreferences = uiPreferences;
  syncUiSettingsControls();
}

async function saveUiPreferencesNow() {
  if (!window.dictionaryAPI?.saveUiPreferences) {
    return uiPreferences;
  }
  const payload = getNormalizedUiPreferences(uiPreferences);
  const saved = await window.dictionaryAPI.saveUiPreferences(payload);
  const normalizedSaved = getNormalizedUiPreferences(saved);
  applyUiPreferences(normalizedSaved);
  return normalizedSaved;
}

function clearUiSettingsSaveTimer(flush = false) {
  if (uiSettingsSaveTimer) {
    window.clearTimeout(uiSettingsSaveTimer);
    uiSettingsSaveTimer = 0;
  }
  if (flush) {
    saveUiPreferencesNow().catch((error) => {
      recordDiagnosticError("ui_preferences_save", String(error?.message || error), "saveUiPreferencesNow");
    });
  }
}

function scheduleUiPreferencesSave() {
  clearUiSettingsSaveTimer(false);
  uiSettingsSaveTimer = window.setTimeout(() => {
    uiSettingsSaveTimer = 0;
    saveUiPreferencesNow().catch((error) => {
      recordDiagnosticError("ui_preferences_save", String(error?.message || error), "saveUiPreferencesNow");
    });
  }, UI_PREFERENCES_SAVE_DELAY_MS);
}

function updateUiThemePreference(theme, options = {}) {
  const normalizedTheme = normalizeUiTheme(theme);
  const persist = options.persist !== false;
  applyUiPreferences({
    ...uiPreferences,
    theme: normalizedTheme
  });
  if (persist) {
    scheduleUiPreferencesSave();
  }
}

function updateReduceMotionPreference(reduceMotion, options = {}) {
  const persist = options.persist !== false;
  applyUiPreferences({
    ...uiPreferences,
    reduceMotion: Boolean(reduceMotion)
  });
  if (persist) {
    scheduleUiPreferencesSave();
  }
}

async function loadUiPreferencesFromDisk() {
  if (!window.dictionaryAPI?.loadUiPreferences) {
    applyUiPreferences(createDefaultUiPreferences());
    return uiPreferences;
  }
  try {
    const loaded = await window.dictionaryAPI.loadUiPreferences();
    applyUiPreferences(loaded);
  } catch (error) {
    applyUiPreferences(createDefaultUiPreferences());
    recordDiagnosticError("ui_preferences_load", String(error?.message || error), "loadUiPreferencesFromDisk");
  }
  return uiPreferences;
}

function isUiSettingsPopoverOpen() {
  return elements.uiSettingsPopover instanceof HTMLElement && !elements.uiSettingsPopover.classList.contains("hidden");
}

function getUiSettingsFocusableElements() {
  if (!(elements.uiSettingsPopover instanceof HTMLElement)) {
    return [];
  }
  return [...elements.uiSettingsPopover.querySelectorAll(UI_SETTINGS_FOCUSABLE_SELECTOR)].filter((item) => {
    if (!(item instanceof HTMLElement)) {
      return false;
    }
    return !item.hasAttribute("disabled");
  });
}

function openUiSettingsPopover() {
  if (!(elements.uiSettingsPopover instanceof HTMLElement) || !(elements.uiSettingsTrigger instanceof HTMLElement)) {
    return;
  }
  uiSettingsRestoreFocusElement =
    document.activeElement instanceof HTMLElement ? document.activeElement : elements.uiSettingsTrigger;
  elements.uiSettingsPopover.classList.remove("hidden");
  elements.uiSettingsTrigger.setAttribute("aria-expanded", "true");
  syncUiSettingsControls();
  const focusables = getUiSettingsFocusableElements();
  const nextFocus = focusables[0];
  if (nextFocus instanceof HTMLElement) {
    nextFocus.focus();
  } else {
    elements.uiSettingsPopover.focus();
  }
}

function closeUiSettingsPopover({ restoreFocus = true } = {}) {
  if (!(elements.uiSettingsPopover instanceof HTMLElement) || !(elements.uiSettingsTrigger instanceof HTMLElement)) {
    return;
  }
  elements.uiSettingsPopover.classList.add("hidden");
  elements.uiSettingsTrigger.setAttribute("aria-expanded", "false");
  if (restoreFocus) {
    const fallback = elements.uiSettingsTrigger;
    const target = uiSettingsRestoreFocusElement instanceof HTMLElement ? uiSettingsRestoreFocusElement : fallback;
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
  if (uiMotionInitialized) {
    applyMotionPreference(uiPreferences?.reduceMotion);
    return;
  }
  uiMotionInitialized = true;

  if (window.matchMedia) {
    reduceMotionMediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduceMotionMediaQueryListener = () => {
      applyMotionPreference(uiPreferences?.reduceMotion);
    };
    if (typeof reduceMotionMediaQuery.addEventListener === "function") {
      reduceMotionMediaQuery.addEventListener("change", reduceMotionMediaQueryListener);
    } else if (typeof reduceMotionMediaQuery.addListener === "function") {
      reduceMotionMediaQuery.addListener(reduceMotionMediaQueryListener);
    }
  }

  applyMotionPreference(uiPreferences?.reduceMotion);

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
  elements.sentenceStatus.textContent = message;
  if (message !== lastSentenceStatusLog) {
    lastSentenceStatusLog = message;
    pushRuntimeLog("info", "graph", message, "sentenceStatus");
  }
}

function setEntryWarnings(messages = []) {
  if (!(elements.entryWarnings instanceof HTMLElement)) {
    return;
  }
  const warnings = Array.isArray(messages) ? messages.filter(Boolean) : [];
  if (warnings.length === 0) {
    elements.entryWarnings.textContent = "No warnings.";
    elements.entryWarnings.classList.remove("error");
    return;
  }
  elements.entryWarnings.textContent = warnings.join(" | ");
  elements.entryWarnings.classList.add("error");
}

function recordDiagnosticError(code, message, context = "") {
  state.diagnostics = mergeDiagnostics(state.diagnostics, {
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
  state.diagnostics = mergeDiagnostics(state.diagnostics, {
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
  if ((state.diagnostics.perf || []).length >= 50) {
    scheduleDiagnosticsFlush(300);
  }
}

function renderDiagnosticsSummary() {
  if (!(elements.diagnosticsSummary instanceof HTMLElement)) {
    return;
  }
  const errors = Array.isArray(state.diagnostics.errors) ? state.diagnostics.errors.length : 0;
  const perf = Array.isArray(state.diagnostics.perf) ? state.diagnostics.perf.length : 0;
  elements.diagnosticsSummary.textContent = `Diagnostics: ${errors} error(s), ${perf} perf sample(s). Local only.`;
  renderDiagnosticsPanel();
}

function renderDiagnosticsPanel() {
  if (
    !(elements.diagnosticsErrorsList instanceof HTMLElement) ||
    !(elements.diagnosticsPerfList instanceof HTMLElement)
  ) {
    return;
  }
  const latestErrors = (Array.isArray(state.diagnostics.errors) ? state.diagnostics.errors : []).slice(-8).reverse();
  const latestPerf = (Array.isArray(state.diagnostics.perf) ? state.diagnostics.perf : []).slice(-8).reverse();
  elements.diagnosticsErrorsList.innerHTML = "";
  elements.diagnosticsPerfList.innerHTML = "";

  if (latestErrors.length === 0) {
    const emptyError = document.createElement("li");
    emptyError.textContent = "No errors recorded.";
    elements.diagnosticsErrorsList.appendChild(emptyError);
  } else {
    latestErrors.forEach((item) => {
      const row = document.createElement("li");
      row.textContent = `${item.code}: ${item.message}`;
      elements.diagnosticsErrorsList.appendChild(row);
    });
  }

  if (latestPerf.length === 0) {
    const emptyPerf = document.createElement("li");
    emptyPerf.textContent = "No timing samples yet.";
    elements.diagnosticsPerfList.appendChild(emptyPerf);
  } else {
    latestPerf.forEach((item) => {
      const row = document.createElement("li");
      row.textContent = `${item.key}: ${Number(item.ms).toFixed(2)}ms`;
      elements.diagnosticsPerfList.appendChild(row);
    });
  }
}

function getEntryUsageScore(entry) {
  const usageCount = Number.isFinite(Number(entry?.usageCount)) ? Number(entry.usageCount) : 0;
  const backlinks = getEntryBacklinkCount(entry?.id || "");
  return usageCount + backlinks * 2;
}

function buildStatisticsModelSync() {
  const entries = state.entries;
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
      graphNodes: state.sentenceGraph.nodes.length,
      graphLinks: state.sentenceGraph.links.length
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
  if (statsWorkerModel && statsWorkerModelKey === modelKey) {
    return statsWorkerModel;
  }
  if (statsCacheModel && statsCacheKey === modelKey) {
    return statsCacheModel;
  }
  statsCacheModel = buildStatisticsModelSync();
  statsCacheKey = modelKey;
  return statsCacheModel;
}

function renderStatisticsView() {
  if (
    !(elements.statsOverviewList instanceof HTMLElement) ||
    !(elements.statsMostUsedList instanceof HTMLElement) ||
    !(elements.statsLeastUsedList instanceof HTMLElement) ||
    !(elements.statsRecentList instanceof HTMLElement) ||
    !(elements.statsLabelsList instanceof HTMLElement) ||
    !(elements.statsModeList instanceof HTMLElement)
  ) {
    return;
  }

  const model = getStatisticsModel();

  elements.statsOverviewList.innerHTML = "";
  elements.statsOverviewList.appendChild(listItem(`Total entries: ${model.overview.totalEntries || 0}`));
  elements.statsOverviewList.appendChild(listItem(`Active entries: ${model.overview.activeEntries || 0}`));
  elements.statsOverviewList.appendChild(listItem(`Archived entries: ${model.overview.archivedEntries || 0}`));
  elements.statsOverviewList.appendChild(listItem(`Favorites: ${model.overview.favorites || 0}`));
  elements.statsOverviewList.appendChild(listItem(`Linked in graph: ${model.overview.linked || 0}`));
  elements.statsOverviewList.appendChild(
    listItem(`Graph nodes/links: ${model.overview.graphNodes || 0}/${model.overview.graphLinks || 0}`)
  );

  elements.statsMostUsedList.innerHTML = "";
  model.mostUsed.forEach((item) => {
    elements.statsMostUsedList.appendChild(listItem(`${item.word} (${item.score})`));
  });
  if (model.mostUsed.length === 0) {
    elements.statsMostUsedList.appendChild(listItem("No entries yet."));
  }

  elements.statsLeastUsedList.innerHTML = "";
  model.leastUsed.forEach((item) => {
    elements.statsLeastUsedList.appendChild(listItem(`${item.word} (${item.score})`));
  });
  if (model.leastUsed.length === 0) {
    elements.statsLeastUsedList.appendChild(listItem("No entries yet."));
  }

  elements.statsRecentList.innerHTML = "";
  model.recent.forEach((item) => {
    elements.statsRecentList.appendChild(listItem(`${item.word} (${new Date(item.updatedAt).toLocaleString()})`));
  });
  if (model.recent.length === 0) {
    elements.statsRecentList.appendChild(listItem("No entries yet."));
  }

  elements.statsLabelsList.innerHTML = "";
  model.labels.forEach((item) => {
    elements.statsLabelsList.appendChild(listItem(`${item.label}: ${item.count}`));
  });
  if (model.labels.length === 0) {
    elements.statsLabelsList.appendChild(listItem("No labels yet."));
  }

  elements.statsModeList.innerHTML = "";
  model.modes.forEach((item) => {
    elements.statsModeList.appendChild(listItem(`${item.mode}: ${item.count}`));
  });
}

function isUniverseVisible() {
  return elements.universeView instanceof HTMLElement && !elements.universeView.classList.contains("hidden");
}

function isSentenceGraphVisible() {
  return elements.sentenceGraphView instanceof HTMLElement && !elements.sentenceGraphView.classList.contains("hidden");
}

function getActiveUniverseCanvas() {
  if (
    universeConfig.renderMode === UNIVERSE_VIEW_MODE_WEBGL &&
    elements.universeCanvasGl instanceof HTMLCanvasElement
  ) {
    return elements.universeCanvasGl;
  }
  return elements.universeCanvas instanceof HTMLCanvasElement ? elements.universeCanvas : null;
}

function updateUniverseCanvasVisibility() {
  const showGl = universeConfig.renderMode === UNIVERSE_VIEW_MODE_WEBGL;
  if (elements.universeCanvas instanceof HTMLCanvasElement) {
    elements.universeCanvas.classList.toggle("hidden", showGl);
  }
  if (elements.universeCanvasGl instanceof HTMLCanvasElement) {
    elements.universeCanvasGl.classList.toggle("hidden", !showGl);
  }
  if (showGl) {
    universeCanvasContext = null;
    universeCanvasContextCanvas = null;
  }
}

function setUniverseRenderMode(mode, options = {}) {
  const { allowUnsafe = false, announce = false } = options;
  const targetMode = mode === UNIVERSE_VIEW_MODE_CANVAS ? UNIVERSE_VIEW_MODE_CANVAS : UNIVERSE_VIEW_MODE_WEBGL;
  if (targetMode === UNIVERSE_VIEW_MODE_WEBGL && universeGpuForcedCanvas && !allowUnsafe) {
    if (announce) {
      setStatus("WebGL is disabled due to recent GPU instability. Use 'Try WebGL Renderer' to override.", true);
    }
    syncUniverseControls();
    return false;
  }
  universeConfig = normalizeUniverseConfig({
    ...universeConfig,
    renderMode: targetMode,
    bookmarks: universeConfig.bookmarks
  });
  if (targetMode === UNIVERSE_VIEW_MODE_WEBGL && allowUnsafe) {
    universeGpuForcedCanvas = false;
  }
  syncUniverseControls();
  updateUniverseCanvasVisibility();
  ensureUniverseCanvasSize();
  queueUniverseCacheSave();
  requestUniverseRender({ force: true });
  if (announce) {
    setStatus(
      targetMode === UNIVERSE_VIEW_MODE_WEBGL ? "Universe renderer set to WebGL." : "Universe renderer set to Canvas."
    );
  }
  return true;
}

function syncUniverseControls() {
  if (elements.universeFilterInput instanceof HTMLInputElement) {
    elements.universeFilterInput.value = universeViewState.filter || "";
  }
  if (elements.universeMinWordLengthInput instanceof HTMLInputElement) {
    elements.universeMinWordLengthInput.value = String(universeConfig.minWordLength);
  }
  if (elements.universeMaxNodesInput instanceof HTMLInputElement) {
    elements.universeMaxNodesInput.value = String(universeConfig.maxNodes);
  }
  if (elements.universeMaxEdgesInput instanceof HTMLInputElement) {
    elements.universeMaxEdgesInput.value = String(universeConfig.maxEdges);
  }
  if (elements.universeFavoritesOnlyInput instanceof HTMLInputElement) {
    elements.universeFavoritesOnlyInput.checked = Boolean(universeConfig.favoritesOnly);
  }
  if (elements.universeLabelFilterInput instanceof HTMLInputElement) {
    elements.universeLabelFilterInput.value = universeConfig.labelFilter || "";
  }
  if (elements.universeColorModeSelect instanceof HTMLSelectElement) {
    elements.universeColorModeSelect.value = universeConfig.colorMode;
  }
  if (elements.universeRenderModeSelect instanceof HTMLSelectElement) {
    elements.universeRenderModeSelect.value = universeConfig.renderMode;
  }
  const edgeActionMap = [
    [elements.universeEdgeContainsAction, "contains"],
    [elements.universeEdgePrefixAction, "prefix"],
    [elements.universeEdgeSuffixAction, "suffix"],
    [elements.universeEdgeStemAction, "stem"],
    [elements.universeEdgeSameLabelAction, "sameLabel"]
  ];
  edgeActionMap.forEach(([element, key]) => {
    if (element instanceof HTMLElement) {
      element.classList.toggle("active", Boolean(universeConfig.edgeModes?.[key]));
    }
  });
}

function updateUniverseBookmarkSelect() {
  if (!(elements.universeBookmarkSelect instanceof HTMLSelectElement)) {
    return;
  }
  elements.universeBookmarkSelect.innerHTML = "";
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = universeConfig.bookmarks.length > 0 ? "Saved views" : "No saved views";
  elements.universeBookmarkSelect.appendChild(placeholder);
  universeConfig.bookmarks.forEach((bookmark) => {
    const option = document.createElement("option");
    option.value = bookmark.id;
    option.textContent = bookmark.name;
    elements.universeBookmarkSelect.appendChild(option);
  });
}

function setUniversePathStatus(text, isError = false) {
  if (!(elements.universePathStatus instanceof HTMLElement)) {
    return;
  }
  elements.universePathStatus.textContent = cleanText(text, 280) || "Path finder ready.";
  elements.universePathStatus.classList.toggle("danger", Boolean(isError));
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
  if (!universeBenchmarkState.running) {
    return 0;
  }
  return clampNumber((nowMs - universeBenchmarkState.startedAt) / Math.max(1, universeBenchmarkState.durationMs), 0, 1);
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
  if (samples.length > UNIVERSE_BENCHMARK_SAMPLE_LIMIT) {
    samples.splice(0, samples.length - UNIVERSE_BENCHMARK_SAMPLE_LIMIT);
  }
}

function formatUniverseGpuLabel() {
  if (!universeGpuStatus || universeGpuStatus.ok === false) {
    return "GPU ?";
  }
  const mode = cleanText(universeGpuStatus.effectiveGpuMode, 20) || "auto";
  const angle = cleanText(universeGpuStatus.effectiveAngleBackend, 24);
  const gl = cleanText(universeGpuStatus.effectiveGlImplementation, 24);
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
  if (universeConfig.renderMode === UNIVERSE_VIEW_MODE_CANVAS) {
    universeGpuForcedCanvas = true;
    return false;
  }
  universeConfig = normalizeUniverseConfig({
    ...universeConfig,
    renderMode: UNIVERSE_VIEW_MODE_CANVAS,
    bookmarks: universeConfig.bookmarks
  });
  universeGpuForcedCanvas = true;
  updateUniverseCanvasVisibility();
  syncUniverseControls();
  clearUniverseProjectionCache();
  setStatus("GPU degraded. Universe switched to Canvas mode for stability.");
  queueUniverseCacheSave();
  requestUniverseRender({ force: true });
  return true;
}

function renderUniversePerfHud(force = false) {
  if (!(elements.universePerfHud instanceof HTMLElement)) {
    return;
  }
  const now = performance.now();
  if (!force && now - universePerfHudUpdatedAt < UNIVERSE_PERF_HUD_UPDATE_INTERVAL_MS) {
    return;
  }
  universePerfHudUpdatedAt = now;

  const fps = universeFrameSmoothedMs > 0 ? 1000 / universeFrameSmoothedMs : 0;
  const fpsText = Number.isFinite(fps) && fps > 0 ? fps.toFixed(1) : "--";
  const renderText = universePerfSmoothedMs > 0 ? universePerfSmoothedMs.toFixed(2) : "--";
  let benchmarkText = "";
  if (universeBenchmarkState.running) {
    benchmarkText = ` | Bench ${Math.round(getUniverseBenchmarkProgress(now) * 100)}%`;
  } else if (universeBenchmarkState.lastResult) {
    benchmarkText = ` | Last ${Number(universeBenchmarkState.lastResult.avgFps || 0).toFixed(1)} FPS`;
  }

  elements.universePerfHud.textContent = `FPS: ${fpsText} | Render: ${renderText} ms | ${formatUniverseGpuLabel()}${benchmarkText}`;

  if (elements.universeBenchmarkAction instanceof HTMLElement) {
    elements.universeBenchmarkAction.classList.toggle("hidden", universeBenchmarkState.running);
  }
  if (elements.universeBenchmarkStopAction instanceof HTMLElement) {
    elements.universeBenchmarkStopAction.classList.toggle("hidden", !universeBenchmarkState.running);
  }
}

function updateUniverseFrameMetrics(frameStartedAt, frameMs) {
  if (universeFrameSampleAt > 0) {
    const frameInterval = frameStartedAt - universeFrameSampleAt;
    if (frameInterval > 0 && frameInterval < 5000) {
      universeFrameSmoothedMs =
        universeFrameSmoothedMs === 0 ? frameInterval : universeFrameSmoothedMs * 0.86 + frameInterval * 0.14;
      if (universeBenchmarkState.running) {
        appendUniverseBenchmarkSample(universeBenchmarkState.frameIntervalsMs, frameInterval);
      }
    }
  }
  universeFrameSampleAt = frameStartedAt;

  universePerfSmoothedMs = universePerfSmoothedMs === 0 ? frameMs : universePerfSmoothedMs * 0.86 + frameMs * 0.14;
  if (frameStartedAt - universePerfSampleAt >= UNIVERSE_PERF_SAMPLE_INTERVAL_MS) {
    universePerfSampleAt = frameStartedAt;
    recordDiagnosticPerf("render_universe_ms", universePerfSmoothedMs);
  }

  if (universeBenchmarkState.running) {
    appendUniverseBenchmarkSample(universeBenchmarkState.renderTimesMs, frameMs);
    if (getUniverseBenchmarkProgress(frameStartedAt) >= 1) {
      completeUniverseBenchmark("completed");
      return;
    }
    requestUniverseRender({ force: true });
  }

  renderUniversePerfHud();
}

function updateUniverseBenchmarkCamera(progress) {
  if (!universeBenchmarkState.running) {
    return;
  }
  const clamped = clampNumber(progress, 0, 1);
  const phase = universeBenchmarkState.seed + clamped * Math.PI * 8;
  const zoom = 1.02 + Math.sin(clamped * Math.PI * 6) * 0.32;
  universeViewState.zoom = clampNumber(zoom, UNIVERSE_ZOOM_MIN, UNIVERSE_ZOOM_MAX);
  universeViewState.panX = clampNumber(Math.cos(phase) * 0.26, -1.6, 1.6);
  universeViewState.panY = clampNumber(Math.sin(phase * 0.8) * 0.22, -1.6, 1.6);
  markUniverseInteraction(UNIVERSE_INTERACTION_ACTIVE_MS + 140);
  clearUniverseProjectionCache();
}

function completeUniverseBenchmark(reason = "completed") {
  if (!universeBenchmarkState.running) {
    return universeBenchmarkState.lastResult || null;
  }
  const elapsedMs = Math.max(1, performance.now() - universeBenchmarkState.startedAt);
  const frameIntervals = universeBenchmarkState.frameIntervalsMs.slice();
  const renderTimes = universeBenchmarkState.renderTimesMs.slice();
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
  const baseCamera = universeBenchmarkState.baseCamera;
  universeBenchmarkState = createUniverseBenchmarkState(result);
  if (baseCamera) {
    universeViewState.zoom = clampNumber(baseCamera.zoom, UNIVERSE_ZOOM_MIN, UNIVERSE_ZOOM_MAX);
    universeViewState.panX = clampNumber(baseCamera.panX, -1.6, 1.6);
    universeViewState.panY = clampNumber(baseCamera.panY, -1.6, 1.6);
    clearUniverseProjectionCache();
  }
  renderUniversePerfHud(true);

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
  requestUniverseRender({ force: true });
  return result;
}

function startUniverseBenchmark(durationMs = UNIVERSE_BENCHMARK_DEFAULT_DURATION_MS) {
  if (universeBenchmarkState.running) {
    setStatus("3D benchmark is already running.");
    return false;
  }
  const nodeCount = Array.isArray(universeGraph.nodes) ? universeGraph.nodes.length : 0;
  if (nodeCount < 2) {
    setStatus("Add more words before running the 3D benchmark.", true);
    return false;
  }
  const duration = clampNumber(
    Math.floor(Number(durationMs) || UNIVERSE_BENCHMARK_DEFAULT_DURATION_MS),
    2000,
    UNIVERSE_BENCHMARK_MAX_DURATION_MS
  );
  if (state.activeView !== VIEW_UNIVERSE) {
    setActiveView(VIEW_UNIVERSE);
  }
  universeBenchmarkState = {
    running: true,
    startedAt: performance.now(),
    durationMs: duration,
    seed: Math.random() * Math.PI * 2,
    baseCamera: {
      zoom: universeViewState.zoom,
      panX: universeViewState.panX,
      panY: universeViewState.panY
    },
    frameIntervalsMs: [],
    renderTimesMs: [],
    lastResult: universeBenchmarkState.lastResult
  };
  universeFrameSampleAt = 0;
  universeFrameSmoothedMs = 0;
  renderUniversePerfHud(true);
  setStatus(`Running 3D benchmark for ${(duration / 1000).toFixed(0)}s...`);
  pushRuntimeLog("info", "benchmark", "3D benchmark started.", `durationMs=${duration};nodes=${nodeCount}`);
  void loadUniverseGpuStatus(false);
  requestUniverseRender({ force: true });
  return true;
}

function stopUniverseBenchmark(reason = "stopped") {
  if (!universeBenchmarkState.running) {
    return null;
  }
  return completeUniverseBenchmark(reason);
}

async function loadUniverseGpuStatus(force = false) {
  if (!window.dictionaryAPI?.getGpuStatus) {
    return null;
  }
  if (elements.authGate instanceof HTMLElement && !elements.authGate.classList.contains("hidden")) {
    return null;
  }
  const now = Date.now();
  if (!force && universeGpuStatus && now - universeGpuStatusLoadedAt < UNIVERSE_GPU_STATUS_CACHE_MS) {
    return universeGpuStatus;
  }
  try {
    const status = await window.dictionaryAPI.getGpuStatus();
    universeGpuStatus = status && typeof status === "object" ? status : null;
    universeGpuStatusLoadedAt = now;
    if (universeGpuStatus) {
      if (!isGpuStatusDegraded(universeGpuStatus)) {
        universeGpuForcedCanvas = false;
      }
      applyUniverseSafeRenderModeFromGpuStatus(universeGpuStatus);
    }
    renderUniversePerfHud(true);
    return universeGpuStatus;
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

function renderUniverseSummary() {
  if (!(elements.universeSummary instanceof HTMLElement)) {
    return;
  }
  const meta = universeGraph.meta || {};
  const nodes = Number(meta.nodeCount) || universeGraph.nodes.length || 0;
  const edges = Number(meta.edgeCount) || universeGraph.edges.length || 0;
  const components = Number(meta.components) || 0;
  const isolated = Number(meta.isolated) || 0;
  const largest = Number(meta.largestComponent) || 0;
  const cappedText = meta.capped ? " Edge cap reached." : "";
  const filter = cleanText(universeViewState.filter, MAX.WORD);
  const selectedCount = getUniverseSelectedIndicesSorted().length;
  const activeSet = universeCustomSearchSets.find((set) => set.id === universeActiveCustomSetId);
  const base = `Universe: ${nodes} words, ${edges} links, ${components} clusters, ${isolated} isolated, largest cluster ${largest}. Selected: ${selectedCount}. Drag to pan, wheel to zoom.${cappedText}`;
  const withFilter = filter ? `${base} Highlight: "${filter}".` : base;
  elements.universeSummary.textContent = activeSet ? `${withFilter} Active set: "${activeSet.name}".` : withFilter;
  renderUniversePerfHud();
}

function getUniverseTargetDpr() {
  const nativeDpr = Math.max(1, Math.min(UNIVERSE_DPR_MAX, window.devicePixelRatio || 1));
  const nodeCount = Array.isArray(universeGraph.nodes) ? universeGraph.nodes.length : 0;
  const edgeCount = Array.isArray(universeGraph.edges) ? universeGraph.edges.length : 0;

  let cap = nativeDpr;
  if (nodeCount > 1400 || edgeCount > 14000) {
    cap = Math.min(cap, UNIVERSE_DPR_HEAVY);
  }
  if (universeBenchmarkState.running || universePerfSmoothedMs > 11 || nodeCount > 2200 || edgeCount > 22000) {
    cap = Math.min(cap, UNIVERSE_DPR_LOW);
  } else if (universePerfSmoothedMs > 8) {
    cap = Math.min(cap, UNIVERSE_DPR_SOFT);
  }
  return Math.max(1, cap);
}

function ensureUniverseCanvasSize() {
  const canvas = getActiveUniverseCanvas();
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
    universeCanvasSize.width !== width ||
    universeCanvasSize.height !== height ||
    universeCanvasSize.dpr !== dpr ||
    canvas.width !== nextPixelWidth ||
    canvas.height !== nextPixelHeight;
  if (!changed) {
    return false;
  }
  universeCanvasSize = {
    width,
    height,
    dpr
  };
  canvas.width = nextPixelWidth;
  canvas.height = nextPixelHeight;
  return true;
}

function getUniverseCanvasContext(canvas) {
  if (!(canvas instanceof HTMLCanvasElement)) {
    return null;
  }
  if (universeCanvasContextCanvas === canvas && universeCanvasContext) {
    return universeCanvasContext;
  }
  const context = canvas.getContext("2d");
  if (!context) {
    universeCanvasContext = null;
    universeCanvasContextCanvas = null;
    return null;
  }
  universeCanvasContext = context;
  universeCanvasContextCanvas = canvas;
  return context;
}

function clearUniverseProjectionCache() {
  universeProjectionCache = null;
}

function invalidateUniverseHighlightCache() {
  universeHighlightFlags = new Uint8Array(0);
  universeHighlightCount = 0;
  universeHighlightCacheKey = "";
}

function syncUniverseSelectionFlags() {
  const nodeCount = universeGraph.nodes.length;
  universeSelectionFlags = new Uint8Array(nodeCount);
  universeSelectedNodeIndices.forEach((index) => {
    if (index >= 0 && index < nodeCount) {
      universeSelectionFlags[index] = 1;
    }
  });
}

function syncUniversePathNodeFlags() {
  const nodeCount = universeGraph.nodes.length;
  universePathNodeFlags = new Uint8Array(nodeCount);
  for (let index = 0; index < universePathNodeIndices.length; index += 1) {
    const nodeIndex = Math.floor(Number(universePathNodeIndices[index]));
    if (nodeIndex >= 0 && nodeIndex < nodeCount) {
      universePathNodeFlags[nodeIndex] = 1;
    }
  }
}

function getUniverseNodeWordLower(node) {
  const existing = cleanText(node?.wordLower, MAX.WORD).toLowerCase();
  if (existing) {
    return existing;
  }
  const computed = normalizeWordLower(node?.word || "");
  if (node && typeof node === "object") {
    node.wordLower = computed;
  }
  return computed;
}

function getUniverseHighlightState(nodes, filterLower) {
  const filter = cleanText(filterLower, MAX.WORD).toLowerCase();
  if (!filter) {
    if (universeHighlightCacheKey || universeHighlightFlags.length !== nodes.length) {
      universeHighlightFlags = new Uint8Array(nodes.length);
      universeHighlightCount = 0;
      universeHighlightCacheKey = "";
    }
    return {
      flags: universeHighlightFlags,
      count: 0
    };
  }
  const key = `${cleanText(universeGraphCacheKey, 200)}|${nodes.length}|${filter}`;
  if (universeHighlightCacheKey === key && universeHighlightFlags.length === nodes.length) {
    return {
      flags: universeHighlightFlags,
      count: universeHighlightCount
    };
  }
  const flags = new Uint8Array(nodes.length);
  let count = 0;
  for (let index = 0; index < nodes.length; index += 1) {
    if (getUniverseNodeWordLower(nodes[index]).includes(filter)) {
      flags[index] = 1;
      count += 1;
    }
  }
  universeHighlightFlags = flags;
  universeHighlightCount = count;
  universeHighlightCacheKey = key;
  return {
    flags: universeHighlightFlags,
    count
  };
}

function invalidateUniverseAdjacencyCache() {
  universeAdjacencyCacheKey = "";
  universeAdjacency = [];
}

function getUniverseAdjacency() {
  const nodes = universeGraph.nodes;
  const edges = universeGraph.edges;
  const key = `${cleanText(universeGraphCacheKey, 200)}|${nodes.length}|${edges.length}`;
  if (universeAdjacencyCacheKey === key && universeAdjacency.length === nodes.length) {
    return universeAdjacency;
  }
  const adjacency = Array.from({ length: nodes.length }, () => []);
  for (let index = 0; index < edges.length; index += 1) {
    const edge = edges[index];
    const a = Number(edge?.a);
    const b = Number(edge?.b);
    if (
      !Number.isInteger(a) ||
      !Number.isInteger(b) ||
      a < 0 ||
      b < 0 ||
      a >= nodes.length ||
      b >= nodes.length ||
      a === b
    ) {
      continue;
    }
    adjacency[a].push(b);
    adjacency[b].push(a);
  }
  universeAdjacency = adjacency;
  universeAdjacencyCacheKey = key;
  return universeAdjacency;
}

function markUniverseInteraction(durationMs = UNIVERSE_INTERACTION_ACTIVE_MS) {
  const until = Date.now() + Math.max(40, Math.floor(Number(durationMs) || 0));
  if (until > universeInteractionActiveUntil) {
    universeInteractionActiveUntil = until;
  }
}

function isUniverseInteractionActive() {
  return Date.now() < universeInteractionActiveUntil;
}

function getUniverseEdgeTarget() {
  let target = isUniverseInteractionActive() ? UNIVERSE_INTERACTION_EDGE_TARGET : UNIVERSE_IDLE_EDGE_TARGET;
  if (universeBenchmarkState.running) {
    target = Math.min(target, UNIVERSE_INTERACTION_EDGE_TARGET);
  }
  if (universePerfSmoothedMs > 13) {
    target = Math.min(target, UNIVERSE_PERF_EDGE_TARGET_HARD);
  } else if (universePerfSmoothedMs > 9) {
    target = Math.min(target, UNIVERSE_PERF_EDGE_TARGET_SOFT);
  }
  return Math.max(UNIVERSE_MIN_EDGE_TARGET, target);
}

function getUniverseEdgeStride(edgeCount) {
  const target = getUniverseEdgeTarget();
  if (edgeCount <= target) {
    return 1;
  }
  return Math.max(1, Math.ceil(edgeCount / target));
}

function getUniverseNodeRadius(node) {
  const degree = Math.max(0, Number(node?.degree) || 0);
  const componentSize = Math.max(1, Number(node?.componentSize) || 1);
  const base = 1.7 + Math.sqrt(degree) * 0.48;
  return Math.min(8.2, base + Math.log2(componentSize + 1) * 0.22);
}

function getUniverseProjectionSignature(nodes, width, height) {
  const zoom = clampNumber(universeViewState.zoom, UNIVERSE_ZOOM_MIN, UNIVERSE_ZOOM_MAX);
  const panX = clampNumber(universeViewState.panX, -1.6, 1.6);
  const panY = clampNumber(universeViewState.panY, -1.6, 1.6);
  const key = cleanText(universeGraphCacheKey, 160);
  return `${nodes.length}|${width}|${height}|${zoom}|${panX}|${panY}|${key}`;
}

function getUniverseProjectionData(nodes, width, height) {
  if (!Array.isArray(nodes) || nodes.length === 0) {
    return {
      x: new Float32Array(0),
      y: new Float32Array(0),
      radius: new Float32Array(0),
      signature: ""
    };
  }
  const signature = getUniverseProjectionSignature(nodes, width, height);
  if (universeProjectionCache && universeProjectionCache.signature === signature) {
    return universeProjectionCache;
  }
  const zoom = clampNumber(universeViewState.zoom, UNIVERSE_ZOOM_MIN, UNIVERSE_ZOOM_MAX);
  const panX = clampNumber(universeViewState.panX, -1.6, 1.6);
  const panY = clampNumber(universeViewState.panY, -1.6, 1.6);
  const xScale = width * zoom;
  const yScale = height * zoom;
  const centerX = width / 2;
  const centerY = height / 2;
  const x = new Float32Array(nodes.length);
  const y = new Float32Array(nodes.length);
  const radius = new Float32Array(nodes.length);
  for (let index = 0; index < nodes.length; index += 1) {
    const node = nodes[index];
    x[index] = centerX + ((Number(node?.x) || 0.5) - 0.5 + panX) * xScale;
    y[index] = centerY + ((Number(node?.y) || 0.5) - 0.5 + panY) * yScale;
    radius[index] = getUniverseNodeRadius(node);
  }
  universeProjectionCache = {
    signature,
    x,
    y,
    radius
  };
  return universeProjectionCache;
}

function findUniverseNodeIndexAt(canvasX, canvasY) {
  const nodes = universeGraph.nodes;
  if (!Array.isArray(nodes) || nodes.length === 0) {
    return -1;
  }
  const width = universeCanvasSize.width;
  const height = universeCanvasSize.height;
  const projection = getUniverseProjectionData(nodes, width, height);
  let bestIndex = -1;
  let bestDistance = Number.POSITIVE_INFINITY;
  for (let index = 0; index < nodes.length; index += 1) {
    const radius = projection.radius[index] + 4;
    const dx = projection.x[index] - canvasX;
    const dy = projection.y[index] - canvasY;
    const distanceSquared = dx * dx + dy * dy;
    const radiusSquared = radius * radius;
    if (distanceSquared <= radiusSquared && distanceSquared < bestDistance) {
      bestDistance = distanceSquared;
      bestIndex = index;
    }
  }
  return bestIndex;
}

function requestUniverseRender(options = {}) {
  const { force = false } = options;
  if (!force && !isUniverseVisible()) {
    return;
  }
  if (universeRenderFrameId) {
    return;
  }
  universeRenderFrameId = window.requestAnimationFrame(() => {
    universeRenderFrameId = 0;
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

function compileUniverseWebglShader(gl, type, source) {
  const shader = gl.createShader(type);
  if (!shader) {
    return null;
  }
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = cleanText(gl.getShaderInfoLog(shader) || "Shader compile failed.", 300);
    gl.deleteShader(shader);
    recordDiagnosticError("universe_webgl_shader_compile", info, "universeWebgl");
    return null;
  }
  return shader;
}

function createUniverseWebglProgram(gl, vertexSource, fragmentSource, code) {
  const vertexShader = compileUniverseWebglShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = compileUniverseWebglShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  if (!vertexShader || !fragmentShader) {
    return null;
  }
  const program = gl.createProgram();
  if (!program) {
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    return null;
  }
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = cleanText(gl.getProgramInfoLog(program) || "Program link failed.", 300);
    gl.deleteProgram(program);
    recordDiagnosticError(code, info, "universeWebgl");
    return null;
  }
  return program;
}

function initializeUniverseWebgl(canvas) {
  if (!(canvas instanceof HTMLCanvasElement)) {
    return null;
  }
  if (
    universeWebglState &&
    universeWebglState.canvas === canvas &&
    universeWebglState.gl &&
    !universeWebglState.gl.isContextLost()
  ) {
    return universeWebglState;
  }
  const gl = canvas.getContext("webgl", {
    antialias: false,
    alpha: true,
    preserveDrawingBuffer: false,
    powerPreference: "high-performance"
  });
  if (!gl) {
    return null;
  }

  const lineVertex = `
    attribute vec2 a_position;
    attribute vec4 a_color;
    uniform vec2 u_resolution;
    varying vec4 v_color;
    void main() {
      vec2 zeroToOne = a_position / u_resolution;
      vec2 clip = (zeroToOne * 2.0) - 1.0;
      gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
      v_color = a_color;
    }
  `;
  const pointVertex = `
    attribute vec2 a_position;
    attribute float a_size;
    attribute vec4 a_color;
    uniform vec2 u_resolution;
    varying vec4 v_color;
    void main() {
      vec2 zeroToOne = a_position / u_resolution;
      vec2 clip = (zeroToOne * 2.0) - 1.0;
      gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
      gl_PointSize = a_size;
      v_color = a_color;
    }
  `;
  const commonFragment = `
    precision mediump float;
    varying vec4 v_color;
    void main() {
      gl_FragColor = v_color;
    }
  `;
  const pointFragment = `
    precision mediump float;
    varying vec4 v_color;
    void main() {
      vec2 centered = gl_PointCoord - vec2(0.5, 0.5);
      float dist = dot(centered, centered);
      if (dist > 0.25) {
        discard;
      }
      gl_FragColor = v_color;
    }
  `;

  const lineProgram = createUniverseWebglProgram(gl, lineVertex, commonFragment, "universe_webgl_line_link");
  const pointProgram = createUniverseWebglProgram(gl, pointVertex, pointFragment, "universe_webgl_point_link");
  if (!lineProgram || !pointProgram) {
    if (lineProgram) {
      gl.deleteProgram(lineProgram);
    }
    if (pointProgram) {
      gl.deleteProgram(pointProgram);
    }
    return null;
  }

  universeWebglState = {
    canvas,
    gl,
    line: {
      program: lineProgram,
      attribPosition: gl.getAttribLocation(lineProgram, "a_position"),
      attribColor: gl.getAttribLocation(lineProgram, "a_color"),
      uniformResolution: gl.getUniformLocation(lineProgram, "u_resolution")
    },
    point: {
      program: pointProgram,
      attribPosition: gl.getAttribLocation(pointProgram, "a_position"),
      attribSize: gl.getAttribLocation(pointProgram, "a_size"),
      attribColor: gl.getAttribLocation(pointProgram, "a_color"),
      uniformResolution: gl.getUniformLocation(pointProgram, "u_resolution")
    },
    buffers: {
      linePosition: gl.createBuffer(),
      lineColor: gl.createBuffer(),
      pointPosition: gl.createBuffer(),
      pointSize: gl.createBuffer(),
      pointColor: gl.createBuffer()
    },
    bufferCapacities: {
      linePosition: 0,
      lineColor: 0,
      pointPosition: 0,
      pointSize: 0,
      pointColor: 0
    },
    scratch: {
      linePositions: new Float32Array(1024),
      lineColors: new Float32Array(2048),
      pathLinePositions: new Float32Array(512),
      pathLineColors: new Float32Array(1024),
      pointPositions: new Float32Array(1024),
      pointSizes: new Float32Array(512),
      pointColors: new Float32Array(2048)
    }
  };

  return universeWebglState;
}

function getUniverseColorRgb(colorHex) {
  const key = cleanText(colorHex, 20).toLowerCase();
  if (universeHexColorCache.has(key)) {
    return universeHexColorCache.get(key);
  }
  const red = Number.parseInt(key.slice(1, 3), 16);
  const green = Number.parseInt(key.slice(3, 5), 16);
  const blue = Number.parseInt(key.slice(5, 7), 16);
  const fallback = [118 / 255, 166 / 255, 236 / 255];
  const value =
    Number.isFinite(red) && Number.isFinite(green) && Number.isFinite(blue)
      ? [red / 255, green / 255, blue / 255]
      : fallback;
  universeHexColorCache.set(key, value);
  if (universeHexColorCache.size > 96) {
    const oldestKey = universeHexColorCache.keys().next().value;
    universeHexColorCache.delete(oldestKey);
  }
  return value;
}

function ensureUniverseFloat32Capacity(buffer, minLength) {
  if (buffer.length >= minLength) {
    return buffer;
  }
  let nextLength = Math.max(64, buffer.length || 64);
  while (nextLength < minLength) {
    nextLength *= 2;
  }
  return new Float32Array(nextLength);
}

function ensureUniverseWebglBufferCapacity(gl, glState, buffer, key, requiredFloats) {
  const requiredBytes = Math.max(0, Math.floor(requiredFloats) * 4);
  const currentBytes = glState.bufferCapacities?.[key] || 0;
  if (requiredBytes <= currentBytes) {
    return;
  }
  const nextBytes = Math.max(1024, currentBytes * 2, requiredBytes);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, nextBytes, gl.DYNAMIC_DRAW);
  glState.bufferCapacities[key] = nextBytes;
}

function pushUniverseRgbaPair(target, offset, rgba) {
  target[offset] = rgba[0];
  target[offset + 1] = rgba[1];
  target[offset + 2] = rgba[2];
  target[offset + 3] = rgba[3];
  target[offset + 4] = rgba[0];
  target[offset + 5] = rgba[1];
  target[offset + 6] = rgba[2];
  target[offset + 7] = rgba[3];
  return offset + 8;
}

function pushUniverseRgba(target, offset, red, green, blue, alpha) {
  target[offset] = red;
  target[offset + 1] = green;
  target[offset + 2] = blue;
  target[offset + 3] = alpha;
  return offset + 4;
}

function pushUniverseRgbaFromArray(target, offset, rgba) {
  target[offset] = rgba[0];
  target[offset + 1] = rgba[1];
  target[offset + 2] = rgba[2];
  target[offset + 3] = rgba[3];
  return offset + 4;
}

function drawUniverseWebglLines(glState, width, height, positions, positionCount, colors, colorCount) {
  if (positionCount < 4 || colorCount < 8) {
    return;
  }
  const { gl, line, buffers } = glState;
  gl.useProgram(line.program);
  gl.uniform2f(line.uniformResolution, width, height);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.linePosition);
  ensureUniverseWebglBufferCapacity(gl, glState, buffers.linePosition, "linePosition", positionCount);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, positions.subarray(0, positionCount));
  gl.enableVertexAttribArray(line.attribPosition);
  gl.vertexAttribPointer(line.attribPosition, 2, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.lineColor);
  ensureUniverseWebglBufferCapacity(gl, glState, buffers.lineColor, "lineColor", colorCount);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, colors.subarray(0, colorCount));
  gl.enableVertexAttribArray(line.attribColor);
  gl.vertexAttribPointer(line.attribColor, 4, gl.FLOAT, false, 0, 0);

  gl.drawArrays(gl.LINES, 0, positionCount / 2);
}

function drawUniverseWebglPoints(
  glState,
  width,
  height,
  positions,
  positionCount,
  sizes,
  sizeCount,
  colors,
  colorCount
) {
  if (positionCount < 2 || sizeCount < 1 || colorCount < 4) {
    return;
  }
  const { gl, point, buffers } = glState;
  gl.useProgram(point.program);
  gl.uniform2f(point.uniformResolution, width, height);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.pointPosition);
  ensureUniverseWebglBufferCapacity(gl, glState, buffers.pointPosition, "pointPosition", positionCount);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, positions.subarray(0, positionCount));
  gl.enableVertexAttribArray(point.attribPosition);
  gl.vertexAttribPointer(point.attribPosition, 2, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.pointSize);
  ensureUniverseWebglBufferCapacity(gl, glState, buffers.pointSize, "pointSize", sizeCount);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, sizes.subarray(0, sizeCount));
  gl.enableVertexAttribArray(point.attribSize);
  gl.vertexAttribPointer(point.attribSize, 1, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.pointColor);
  ensureUniverseWebglBufferCapacity(gl, glState, buffers.pointColor, "pointColor", colorCount);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, colors.subarray(0, colorCount));
  gl.enableVertexAttribArray(point.attribColor);
  gl.vertexAttribPointer(point.attribColor, 4, gl.FLOAT, false, 0, 0);

  gl.drawArrays(gl.POINTS, 0, positionCount / 2);
}

function renderUniverseGraphWebgl(
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
  const glState = initializeUniverseWebgl(canvas);
  if (!glState) {
    return false;
  }
  const { gl } = glState;
  const pixelWidth = Math.max(1, Math.floor(width * dpr));
  const pixelHeight = Math.max(1, Math.floor(height * dpr));
  if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
    canvas.width = pixelWidth;
    canvas.height = pixelHeight;
  }
  gl.viewport(0, 0, pixelWidth, pixelHeight);
  gl.disable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(
    UNIVERSE_WEBGL_CLEAR_COLOR[0],
    UNIVERSE_WEBGL_CLEAR_COLOR[1],
    UNIVERSE_WEBGL_CLEAR_COLOR[2],
    UNIVERSE_WEBGL_CLEAR_COLOR[3]
  );
  gl.clear(gl.COLOR_BUFFER_BIT);

  const scratch = glState.scratch;
  scratch.linePositions = ensureUniverseFloat32Capacity(scratch.linePositions, Math.max(4, edges.length * 4));
  scratch.lineColors = ensureUniverseFloat32Capacity(scratch.lineColors, Math.max(8, edges.length * 8));
  scratch.pathLinePositions = ensureUniverseFloat32Capacity(scratch.pathLinePositions, Math.max(4, edges.length * 4));
  scratch.pathLineColors = ensureUniverseFloat32Capacity(scratch.pathLineColors, Math.max(8, edges.length * 8));
  scratch.pointPositions = ensureUniverseFloat32Capacity(scratch.pointPositions, Math.max(2, nodes.length * 2));
  scratch.pointSizes = ensureUniverseFloat32Capacity(scratch.pointSizes, Math.max(1, nodes.length));
  scratch.pointColors = ensureUniverseFloat32Capacity(scratch.pointColors, Math.max(4, nodes.length * 4));

  const linePositions = scratch.linePositions;
  const lineColors = scratch.lineColors;
  const pathLinePositions = scratch.pathLinePositions;
  const pathLineColors = scratch.pathLineColors;
  const pointPositions = scratch.pointPositions;
  const pointSizes = scratch.pointSizes;
  const pointColors = scratch.pointColors;
  const projectionX = projection.x;
  const projectionY = projection.y;
  const projectionRadius = projection.radius;
  const nodeCount = Math.max(1, nodes.length);

  let linePositionCount = 0;
  let lineColorCount = 0;
  let pathLinePositionCount = 0;
  let pathLineColorCount = 0;
  const edgeStride = getUniverseEdgeStride(edges.length);
  for (let edgeIndex = 0; edgeIndex < edges.length; edgeIndex += 1) {
    const edge = edges[edgeIndex];
    const a = Math.floor(Number(edge?.a));
    const b = Math.floor(Number(edge?.b));
    const left = nodes[a];
    const right = nodes[b];
    if (!left || !right) {
      continue;
    }
    const edgeKey = buildUniverseEdgeKey(a, b, nodeCount);
    const isPathEdge = pathEdgeSet.has(edgeKey);
    if (!isPathEdge && edgeStride > 1 && edgeIndex % edgeStride !== 0) {
      continue;
    }
    if (isPathEdge) {
      pathLinePositions[pathLinePositionCount] = projectionX[a];
      pathLinePositions[pathLinePositionCount + 1] = projectionY[a];
      pathLinePositions[pathLinePositionCount + 2] = projectionX[b];
      pathLinePositions[pathLinePositionCount + 3] = projectionY[b];
      pathLinePositionCount += 4;
      pathLineColorCount = pushUniverseRgbaPair(pathLineColors, pathLineColorCount, UNIVERSE_WEBGL_LINE_COLOR_PATH);
      continue;
    }

    linePositions[linePositionCount] = projectionX[a];
    linePositions[linePositionCount + 1] = projectionY[a];
    linePositions[linePositionCount + 2] = projectionX[b];
    linePositions[linePositionCount + 3] = projectionY[b];
    linePositionCount += 4;

    if (filterActive && highlightFlags[a] !== 1 && highlightFlags[b] !== 1) {
      lineColorCount = pushUniverseRgbaPair(lineColors, lineColorCount, UNIVERSE_WEBGL_LINE_COLOR_DIM);
      continue;
    }
    const hasSameLabel =
      edge?.hasSameLabel === true || (Array.isArray(edge?.modes) && edge.modes.includes("sameLabel"));
    if (hasSameLabel) {
      lineColorCount = pushUniverseRgbaPair(lineColors, lineColorCount, UNIVERSE_WEBGL_LINE_COLOR_LABEL);
      continue;
    }
    lineColorCount = pushUniverseRgbaPair(lineColors, lineColorCount, UNIVERSE_WEBGL_LINE_COLOR_DEFAULT);
  }
  drawUniverseWebglLines(glState, width, height, linePositions, linePositionCount, lineColors, lineColorCount);
  drawUniverseWebglLines(
    glState,
    width,
    height,
    pathLinePositions,
    pathLinePositionCount,
    pathLineColors,
    pathLineColorCount
  );

  let pointPositionCount = 0;
  let pointSizeCount = 0;
  let pointColorCount = 0;
  const now = Date.now();
  for (let nodeIndex = 0; nodeIndex < nodes.length; nodeIndex += 1) {
    const node = nodes[nodeIndex];
    const radius = projectionRadius[nodeIndex];
    const isHighlighted = highlightFlags[nodeIndex] === 1;
    const isHovered = nodeIndex === hoverIndex;
    const isPrimarySelected = nodeIndex === selectedIndex;
    const isSecondarySelected = selectedFlags[nodeIndex] === 1 && !isPrimarySelected;
    const isPathNode = pathNodeFlags[nodeIndex] === 1;
    const isPulsing = nodeIndex === universeViewState.pulseNodeIndex && universeViewState.pulseUntil > now;
    const baseColor = getUniverseNodeColor(node);
    let alphaBase = 0.34 + Math.min(0.48, (Number(node.degree) || 0) / 18);
    if (filterActive && !isHighlighted && !isPrimarySelected && !isSecondarySelected && !isHovered && !isPathNode) {
      alphaBase *= 0.2;
    }

    pointPositions[pointPositionCount] = projectionX[nodeIndex];
    pointPositions[pointPositionCount + 1] = projectionY[nodeIndex];
    pointPositionCount += 2;

    pointSizes[pointSizeCount] =
      (isHovered || isPrimarySelected || isSecondarySelected || isPathNode ? radius + 1.4 : radius + 0.5) *
      dpr *
      (isPulsing ? 1.18 : 1);
    pointSizeCount += 1;

    if (isPrimarySelected) {
      pointColorCount = pushUniverseRgbaFromArray(pointColors, pointColorCount, UNIVERSE_WEBGL_POINT_COLOR_PRIMARY);
    } else if (isSecondarySelected) {
      pointColorCount = pushUniverseRgbaFromArray(pointColors, pointColorCount, UNIVERSE_WEBGL_POINT_COLOR_SECONDARY);
    } else if (isHovered) {
      pointColorCount = pushUniverseRgbaFromArray(pointColors, pointColorCount, UNIVERSE_WEBGL_POINT_COLOR_HOVER);
    } else if (isPathNode) {
      pointColorCount = pushUniverseRgbaFromArray(pointColors, pointColorCount, UNIVERSE_WEBGL_POINT_COLOR_PATH);
    } else if (isHighlighted) {
      pointColorCount = pushUniverseRgbaFromArray(pointColors, pointColorCount, UNIVERSE_WEBGL_POINT_COLOR_HIGHLIGHT);
    } else {
      const [red, green, blue] = getUniverseColorRgb(baseColor);
      pointColorCount = pushUniverseRgba(pointColors, pointColorCount, red, green, blue, clampNumber(alphaBase, 0, 1));
    }
  }
  drawUniverseWebglPoints(
    glState,
    width,
    height,
    pointPositions,
    pointPositionCount,
    pointSizes,
    pointSizeCount,
    pointColors,
    pointColorCount
  );
  return true;
}

function inferUniverseQuestionBucketFromLabels(labels) {
  const source = Array.isArray(labels) ? labels : [];
  for (let index = 0; index < source.length; index += 1) {
    const label = cleanText(source[index], MAX.LABEL).toLowerCase();
    if (!label) {
      continue;
    }
    if (label === "who") {
      return "who";
    }
    if (label === "where") {
      return "where";
    }
    if (label === "when") {
      return "when";
    }
    if (label === "why") {
      return "why";
    }
    if (label === "how") {
      return "how";
    }
  }
  return "what";
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
  if (node && typeof node === "object") {
    node.questionBucket = bucket;
  }
  return bucket;
}

function getUniverseNodeColor(node) {
  const colorMode = universeConfig.colorMode;
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

function buildUniverseEdgeKey(a, b, nodeCountInput = universeGraph.nodes.length) {
  const left = Math.min(a, b);
  const right = Math.max(a, b);
  const nodeCount = Math.max(1, Math.floor(Number(nodeCountInput)) || 0);
  return left * nodeCount + right;
}

function getUniverseSelectedIndicesSorted() {
  return [...universeSelectedNodeIndices]
    .filter((index) => Number.isInteger(index) && index >= 0 && index < universeGraph.nodes.length)
    .sort((left, right) => left - right);
}

function getUniverseSelectedNodes() {
  const indices = getUniverseSelectedIndicesSorted();
  return indices.map((index) => ({
    index,
    node: universeGraph.nodes[index]
  }));
}

function setUniverseNodeSelectionSet(indices, primaryIndex = -1) {
  const next = new Set(
    (Array.isArray(indices) ? indices : [])
      .map((value) => Math.floor(Number(value)))
      .filter((value) => Number.isInteger(value) && value >= 0 && value < universeGraph.nodes.length)
  );
  universeSelectedNodeIndices = next;
  syncUniverseSelectionFlags();
  if (Number.isInteger(primaryIndex) && next.has(primaryIndex)) {
    universeViewState.selectedNodeIndex = primaryIndex;
    universeViewState.hoverNodeIndex = primaryIndex;
    return;
  }
  const first = getUniverseSelectedIndicesSorted()[0];
  if (Number.isInteger(first)) {
    universeViewState.selectedNodeIndex = first;
    universeViewState.hoverNodeIndex = first;
    return;
  }
  universeViewState.selectedNodeIndex = -1;
  universeViewState.hoverNodeIndex = -1;
}

function clearUniverseNodeSelection(options = {}) {
  const { announce = false } = options;
  setUniverseNodeSelectionSet([], -1);
  universeActiveCustomSetId = "";
  renderUniverseClusterPanel();
  requestUniverseRender();
  if (announce) {
    setStatus("Universe selection cleared.");
  }
}

function getUniverseVisibleNodeIndices() {
  const filter = cleanText(universeViewState.filter, MAX.WORD).toLowerCase();
  if (!filter) {
    return universeGraph.nodes.map((_node, index) => index);
  }
  const result = [];
  universeGraph.nodes.forEach((node, index) => {
    if (getUniverseNodeWordLower(node).includes(filter)) {
      result.push(index);
    }
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
    Number.isInteger(universeViewState.selectedNodeIndex) &&
    visibleIndices.includes(universeViewState.selectedNodeIndex)
      ? universeViewState.selectedNodeIndex
      : visibleIndices[0];
  setUniverseNodeSelectionSet(visibleIndices, primaryIndex);
  universeActiveCustomSetId = "";
  renderUniverseClusterPanel();
  requestUniverseRender();
  if (announce) {
    setStatus(`Selected ${visibleIndices.length} universe node(s).`);
  }
  return true;
}

function toggleUniverseNodeSelection(nodeIndex, options = {}) {
  const { focusEntry = true, center = false, announce = "" } = options;
  const normalizedIndex = Math.floor(Number(nodeIndex));
  if (!Number.isInteger(normalizedIndex) || normalizedIndex < 0 || normalizedIndex >= universeGraph.nodes.length) {
    return false;
  }
  const next = new Set(universeSelectedNodeIndices);
  if (next.has(normalizedIndex)) {
    if (next.size > 1) {
      next.delete(normalizedIndex);
    }
  } else {
    next.add(normalizedIndex);
  }
  const primaryIndex = next.has(normalizedIndex) ? normalizedIndex : ([...next][next.size - 1] ?? -1);
  setUniverseNodeSelectionSet([...next], primaryIndex);
  universeActiveCustomSetId = "";
  const node = universeGraph.nodes[universeViewState.selectedNodeIndex];
  if (center && node) {
    centerUniverseOnNode(node);
    queueUniverseCacheSave();
  }
  if (focusEntry && node?.entryId) {
    focusEntryWithoutUsage(node.entryId);
  }
  renderUniverseClusterPanel();
  requestUniverseRender();
  if (announce) {
    setStatus(announce);
  }
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
  if (!Number.isInteger(nodeIndex) || nodeIndex < 0 || nodeIndex >= universeGraph.nodes.length) {
    return summary;
  }
  const neighborIndexSet = new Set();
  universeGraph.edges.forEach((edge) => {
    const left = Number(edge?.a);
    const right = Number(edge?.b);
    if (!Number.isInteger(left) || !Number.isInteger(right)) {
      return;
    }
    if (left !== nodeIndex && right !== nodeIndex) {
      return;
    }
    const neighborIndex = left === nodeIndex ? right : left;
    if (!Number.isInteger(neighborIndex) || neighborIndex < 0 || neighborIndex >= universeGraph.nodes.length) {
      return;
    }
    neighborIndexSet.add(neighborIndex);
    (Array.isArray(edge.modes) ? edge.modes : []).forEach((mode) => {
      const key = cleanText(mode, 20);
      if (summary.modeCounts[key] !== undefined) {
        summary.modeCounts[key] += 1;
      }
    });
  });
  summary.neighbors = [...neighborIndexSet]
    .map((index) => ({
      index,
      node: universeGraph.nodes[index]
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
    const index = universeNodeIndexByEntryId.get(cleanText(entryId, MAX.WORD));
    if (Number.isInteger(index)) {
      indices.add(index);
    }
  });
  (Array.isArray(customSet.words) ? customSet.words : []).forEach((word) => {
    const index = universeNodeIndexByWord.get(normalizeWordLower(word));
    if (Number.isInteger(index)) {
      indices.add(index);
    }
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
    .filter((value) => Number.isInteger(value) && value >= 0 && value < universeGraph.nodes.length);
  if (normalizedIndices.length === 0) {
    return false;
  }
  let changed = false;
  universeCustomSearchSets = universeCustomSearchSets.map((set) => {
    if (set.id !== normalizedSetId) {
      return set;
    }
    const entryIds = new Set(Array.isArray(set.entryIds) ? set.entryIds : []);
    const words = new Set(Array.isArray(set.words) ? set.words.map((item) => normalizeWordLower(item)) : []);
    normalizedIndices.forEach((index) => {
      const node = universeGraph.nodes[index];
      if (!node) {
        return;
      }
      const entryId = cleanText(node.entryId, MAX.WORD);
      const wordLower = getUniverseNodeWordLower(node);
      if (entryId && !entryIds.has(entryId)) {
        entryIds.add(entryId);
        changed = true;
      }
      if (wordLower && !words.has(wordLower)) {
        words.add(wordLower);
        changed = true;
      }
    });
    return {
      ...set,
      entryIds: [...entryIds].slice(0, 5000),
      words: [...words].slice(0, 5000)
    };
  });
  if (changed) {
    queueUniverseCacheSave();
    renderUniverseClusterPanel();
  }
  return changed;
}

function createUniverseCustomSetFromSelection(nameInput = "") {
  const selected = getUniverseSelectedNodes();
  if (selected.length === 0) {
    setStatus("Select universe nodes first.", true);
    return false;
  }
  const name = cleanText(nameInput, 80) || `Set ${universeCustomSearchSets.length + 1}`;
  const nextSet = normalizeUniverseCustomSearchSet({
    id: window.crypto.randomUUID(),
    name,
    entryIds: selected.map((item) => cleanText(item.node?.entryId || "", MAX.WORD)).filter(Boolean),
    words: selected.map((item) => normalizeWordLower(item.node?.word || "")).filter(Boolean),
    createdAt: nowIso()
  });
  universeCustomSearchSets = [nextSet, ...universeCustomSearchSets].slice(0, 120);
  universeActiveCustomSetId = nextSet.id;
  queueUniverseCacheSave();
  renderUniverseClusterPanel();
  setStatus(`Custom set created: ${nextSet.name}`);
  return true;
}

function removeUniverseCustomSearchSet(setId) {
  const normalizedSetId = cleanText(setId, MAX.WORD);
  if (!normalizedSetId) {
    return false;
  }
  const before = universeCustomSearchSets.length;
  universeCustomSearchSets = universeCustomSearchSets.filter((set) => set.id !== normalizedSetId);
  if (universeCustomSearchSets.length === before) {
    return false;
  }
  if (universeActiveCustomSetId === normalizedSetId) {
    universeActiveCustomSetId = "";
  }
  queueUniverseCacheSave();
  renderUniverseClusterPanel();
  return true;
}

function applyUniverseCustomSearchSet(setId, options = {}) {
  const { announce = true, center = true } = options;
  const normalizedSetId = cleanText(setId, MAX.WORD);
  if (!normalizedSetId) {
    return false;
  }
  const customSet = universeCustomSearchSets.find((set) => set.id === normalizedSetId);
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
  universeActiveCustomSetId = customSet.id;
  setUniverseNodeSelectionSet(indices, indices[0]);
  const primaryNode = universeGraph.nodes[indices[0]];
  if (center && primaryNode) {
    centerUniverseOnNode(primaryNode);
  }
  queueUniverseCacheSave();
  renderUniverseClusterPanel();
  requestUniverseRender();
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
    normalizedFallback < universeGraph.nodes.length
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
      .filter((value) => Number.isInteger(value) && value >= 0 && value < universeGraph.nodes.length);
  } catch {
    return [];
  }
}

function buildUniverseAdjacency() {
  return getUniverseAdjacency();
}

function findUniversePathIndices(fromIndex, toIndex) {
  const nodeCount = universeGraph.nodes.length;
  if (fromIndex < 0 || toIndex < 0 || fromIndex >= nodeCount || toIndex >= nodeCount) {
    return [];
  }
  if (fromIndex === toIndex) {
    return [fromIndex];
  }
  const adjacency = buildUniverseAdjacency();
  const queue = [fromIndex];
  let queueHead = 0;
  const visited = new Uint8Array(nodeCount);
  const previous = new Int32Array(nodeCount);
  previous.fill(-1);
  visited[fromIndex] = 1;

  while (queueHead < queue.length) {
    const current = queue[queueHead];
    queueHead += 1;
    const neighbors = adjacency[current] || [];
    for (let index = 0; index < neighbors.length; index += 1) {
      const neighborIndex = neighbors[index];
      if (visited[neighborIndex] === 1) {
        continue;
      }
      visited[neighborIndex] = 1;
      previous[neighborIndex] = current;
      if (neighborIndex === toIndex) {
        const path = [];
        let cursor = toIndex;
        while (cursor >= 0) {
          path.push(cursor);
          cursor = previous[cursor];
        }
        path.reverse();
        return path;
      }
      queue.push(neighborIndex);
    }
  }
  return [];
}

function centerUniverseOnNode(node) {
  if (!node) {
    return;
  }
  universeViewState.panX = clampNumber(0.5 - (Number(node.x) || 0.5), -1.6, 1.6);
  universeViewState.panY = clampNumber(0.5 - (Number(node.y) || 0.5), -1.6, 1.6);
  clearUniverseProjectionCache();
}

function focusUniverseNodeIndex(nodeIndex, options = {}) {
  const { center = true, announce = "", focusEntry = true, pulse = false } = options;
  if (!Number.isInteger(nodeIndex) || nodeIndex < 0 || nodeIndex >= universeGraph.nodes.length) {
    return false;
  }
  setUniverseNodeSelectionSet([nodeIndex], nodeIndex);
  universeActiveCustomSetId = "";
  const node = universeGraph.nodes[nodeIndex];
  if (center) {
    centerUniverseOnNode(node);
    queueUniverseCacheSave();
  }
  if (focusEntry && node?.entryId) {
    focusEntryWithoutUsage(node.entryId);
  }
  if (pulse) {
    universeViewState.pulseNodeIndex = nodeIndex;
    universeViewState.pulseUntil = Date.now() + 1200;
  }
  renderUniverseClusterPanel();
  requestUniverseRender();
  if (announce) {
    setStatus(announce);
  }
  return true;
}

function resetUniverseCamera() {
  universeViewState.zoom = 1;
  universeViewState.panX = 0;
  universeViewState.panY = 0;
  markUniverseInteraction(160);
  clearUniverseProjectionCache();
  queueUniverseCacheSave();
  requestUniverseRender();
}

function fitUniverseCamera() {
  const nodes = universeGraph.nodes;
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
    if (x < minX) {
      minX = x;
    }
    if (x > maxX) {
      maxX = x;
    }
    if (y < minY) {
      minY = y;
    }
    if (y > maxY) {
      maxY = y;
    }
  });
  const spanX = Math.max(0.02, maxX - minX);
  const spanY = Math.max(0.02, maxY - minY);
  const zoom = clampNumber(Math.min(0.88 / spanX, 0.88 / spanY), UNIVERSE_ZOOM_MIN, UNIVERSE_ZOOM_MAX);
  universeViewState.zoom = zoom;
  universeViewState.panX = clampNumber(0.5 - (minX + maxX) / 2, -1.6, 1.6);
  universeViewState.panY = clampNumber(0.5 - (minY + maxY) / 2, -1.6, 1.6);
  markUniverseInteraction(160);
  clearUniverseProjectionCache();
  queueUniverseCacheSave();
  requestUniverseRender();
}

function saveUniverseBookmark() {
  const existingCount = universeConfig.bookmarks.length;
  const next = normalizeUniverseBookmark({
    name: `View ${existingCount + 1}`,
    panX: universeViewState.panX,
    panY: universeViewState.panY,
    zoom: universeViewState.zoom,
    createdAt: nowIso()
  });
  universeConfig.bookmarks = [next, ...universeConfig.bookmarks].slice(0, UNIVERSE_BOOKMARK_LIMIT);
  updateUniverseBookmarkSelect();
  if (elements.universeBookmarkSelect instanceof HTMLSelectElement) {
    elements.universeBookmarkSelect.value = next.id;
  }
  queueUniverseCacheSave();
  setStatus(`Saved camera view "${next.name}".`);
}

function loadUniverseBookmark(bookmarkId) {
  const normalizedId = cleanText(bookmarkId, MAX.WORD);
  if (!normalizedId) {
    return false;
  }
  const bookmark = universeConfig.bookmarks.find((item) => item.id === normalizedId);
  if (!bookmark) {
    return false;
  }
  universeViewState.panX = clampNumber(bookmark.panX, -1.6, 1.6);
  universeViewState.panY = clampNumber(bookmark.panY, -1.6, 1.6);
  universeViewState.zoom = clampNumber(bookmark.zoom, UNIVERSE_ZOOM_MIN, UNIVERSE_ZOOM_MAX);
  markUniverseInteraction(160);
  clearUniverseProjectionCache();
  queueUniverseCacheSave();
  requestUniverseRender();
  setStatus(`Loaded view "${bookmark.name}".`);
  return true;
}

function exportUniverseGraphJson() {
  const payload = {
    exportedAt: nowIso(),
    datasetSignature: universeDatasetSignature,
    modelKey: universeGraphCacheKey,
    config: {
      ...normalizeUniverseConfig(universeConfig),
      bookmarks: undefined
    },
    bookmarks: universeConfig.bookmarks,
    graph: universeGraph
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
  const canvas = getActiveUniverseCanvas();
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
  const filter = cleanText(universeViewState.filter, MAX.WORD).toLowerCase();
  if (!filter) {
    setStatus("Type a word fragment first.", true);
    return;
  }
  const index = universeGraph.nodes.findIndex((node) => getUniverseNodeWordLower(node).includes(filter));
  if (index < 0) {
    setStatus(`No word found for "${filter}".`, true);
    return;
  }
  focusUniverseNodeIndex(index, {
    center: true,
    announce: `Jumped to "${universeGraph.nodes[index].word}".`,
    pulse: true
  });
}

function applyUniversePathFinder() {
  const fromWord = cleanText(
    elements.universePathFromInput instanceof HTMLInputElement ? elements.universePathFromInput.value : "",
    MAX.WORD
  );
  const toWord = cleanText(
    elements.universePathToInput instanceof HTMLInputElement ? elements.universePathToInput.value : "",
    MAX.WORD
  );
  const fromLower = normalizeWordLower(fromWord);
  const toLower = normalizeWordLower(toWord);
  if (!fromLower || !toLower) {
    setUniversePathStatus("Path requires both From and To words.", true);
    return;
  }
  const fromIndex = universeNodeIndexByWord.get(fromLower);
  const toIndex = universeNodeIndexByWord.get(toLower);
  if (!Number.isInteger(fromIndex) || !Number.isInteger(toIndex)) {
    clearUniversePathHighlights();
    setUniversePathStatus("Path words are not present in the current universe graph.", true);
    requestUniverseRender();
    return;
  }
  const pathIndices = findUniversePathIndices(fromIndex, toIndex);
  if (pathIndices.length === 0) {
    clearUniversePathHighlights();
    setUniversePathStatus(`No link path found between "${fromWord}" and "${toWord}".`, true);
    requestUniverseRender();
    return;
  }
  universePathNodeIndices = pathIndices;
  universePathEdgeKeys = new Set();
  const nodeCount = Math.max(1, universeGraph.nodes.length);
  for (let index = 1; index < pathIndices.length; index += 1) {
    universePathEdgeKeys.add(buildUniverseEdgeKey(pathIndices[index - 1], pathIndices[index], nodeCount));
  }
  universePathWords = pathIndices.map((index) => universeGraph.nodes[index]?.word || "");
  syncUniversePathNodeFlags();
  setUniversePathStatus(`${pathIndices.length} step(s): ${universePathWords.join(" -> ")}`);
  focusUniverseNodeIndex(fromIndex, {
    center: true,
    announce: `Path highlighted from "${fromWord}" to "${toWord}".`,
    focusEntry: false,
    pulse: true
  });
}

function applyUniverseOptionsFromInputs() {
  const minWordLength =
    elements.universeMinWordLengthInput instanceof HTMLInputElement
      ? Math.floor(Number(elements.universeMinWordLengthInput.value) || universeConfig.minWordLength)
      : universeConfig.minWordLength;
  const maxNodes =
    elements.universeMaxNodesInput instanceof HTMLInputElement
      ? Math.floor(Number(elements.universeMaxNodesInput.value) || universeConfig.maxNodes)
      : universeConfig.maxNodes;
  const maxEdges =
    elements.universeMaxEdgesInput instanceof HTMLInputElement
      ? Math.floor(Number(elements.universeMaxEdgesInput.value) || universeConfig.maxEdges)
      : universeConfig.maxEdges;
  const favoritesOnly =
    elements.universeFavoritesOnlyInput instanceof HTMLInputElement
      ? Boolean(elements.universeFavoritesOnlyInput.checked)
      : universeConfig.favoritesOnly;
  const labelFilter =
    elements.universeLabelFilterInput instanceof HTMLInputElement
      ? cleanText(elements.universeLabelFilterInput.value, MAX.LABEL).toLowerCase()
      : universeConfig.labelFilter;

  const nextConfig = normalizeUniverseConfig({
    ...universeConfig,
    minWordLength,
    maxNodes,
    maxEdges,
    favoritesOnly,
    labelFilter
  });
  const previousFingerprint = JSON.stringify({
    minWordLength: universeConfig.minWordLength,
    maxNodes: universeConfig.maxNodes,
    maxEdges: universeConfig.maxEdges,
    favoritesOnly: universeConfig.favoritesOnly,
    labelFilter: universeConfig.labelFilter
  });
  const nextFingerprint = JSON.stringify({
    minWordLength: nextConfig.minWordLength,
    maxNodes: nextConfig.maxNodes,
    maxEdges: nextConfig.maxEdges,
    favoritesOnly: nextConfig.favoritesOnly,
    labelFilter: nextConfig.labelFilter
  });
  universeConfig = {
    ...nextConfig,
    bookmarks: universeConfig.bookmarks
  };
  syncUniverseControls();
  if (previousFingerprint !== nextFingerprint) {
    invalidateUniverseGraph();
    scheduleUniverseGraphBuild();
    queueUniverseCacheSave();
    setStatus("Universe filters applied.");
  }
  renderUniverseSummary();
  requestUniverseRender();
}

function toggleUniverseEdgeMode(modeKey) {
  const edgeModes = {
    ...universeConfig.edgeModes,
    [modeKey]: !universeConfig.edgeModes?.[modeKey]
  };
  if (!edgeModes.contains && !edgeModes.prefix && !edgeModes.suffix && !edgeModes.stem && !edgeModes.sameLabel) {
    edgeModes.contains = true;
  }
  universeConfig = normalizeUniverseConfig({
    ...universeConfig,
    edgeModes,
    bookmarks: universeConfig.bookmarks
  });
  syncUniverseControls();
  invalidateUniverseGraph();
  scheduleUniverseGraphBuild();
  queueUniverseCacheSave();
  renderUniverseSummary();
  requestUniverseRender();
}

function renderUniverseClusterPanel() {
  const selectedNodes = getUniverseSelectedNodes();
  const selectedCount = selectedNodes.length;
  const visibleIndices = getUniverseVisibleNodeIndices();
  const selectedIndex = universeViewState.selectedNodeIndex;
  const selected = Number.isInteger(selectedIndex) && selectedIndex >= 0 ? universeGraph.nodes[selectedIndex] : null;

  if (
    elements.universeInspectorSummary instanceof HTMLElement &&
    elements.universeSelectionSummary instanceof HTMLElement &&
    elements.universeSelectionList instanceof HTMLElement &&
    elements.universeNodeInspectorTitle instanceof HTMLElement &&
    elements.universeNodeInspectorMeta instanceof HTMLElement &&
    elements.universeNodeInspectorDefinition instanceof HTMLElement &&
    elements.universeNodeInspectorFacts instanceof HTMLElement &&
    elements.universeCustomSetsSummary instanceof HTMLElement &&
    elements.universeCustomSetsList instanceof HTMLElement
  ) {
    elements.universeInspectorSummary.textContent = `Nodes: ${universeGraph.nodes.length}. Visible: ${visibleIndices.length}. Selected: ${selectedCount}.`;
    elements.universeSelectionSummary.textContent = `${selectedCount} selected definition(s).`;
    elements.universeSelectionList.innerHTML = "";

    if (selectedNodes.length === 0) {
      const emptySelection = document.createElement("li");
      emptySelection.className = "universeSelectionItem";
      emptySelection.textContent =
        "No nodes selected. Click a node, Shift/Ctrl-click for multi-select, or use Select All Visible.";
      elements.universeSelectionList.appendChild(emptySelection);
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
          focusUniverseNodeIndex(index, { center: false, focusEntry: true });
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
        elements.universeSelectionList.appendChild(row);
      });
      if (selectedNodes.length > 240) {
        const tail = document.createElement("li");
        tail.className = "universeSelectionItem";
        tail.textContent = `... ${selectedNodes.length - 240} more selected`;
        elements.universeSelectionList.appendChild(tail);
      }
    }

    elements.universeCustomSetsList.innerHTML = "";
    elements.universeCustomSetsSummary.textContent =
      universeCustomSearchSets.length > 0
        ? `${universeCustomSearchSets.length} custom set(s). Drag selected definitions onto a set to append.`
        : "No sets yet. Select nodes and create one.";
    if (universeCustomSearchSets.length === 0) {
      const emptySet = document.createElement("li");
      emptySet.className = "universeCustomSetItem";
      emptySet.textContent = "Create a set from selected nodes.";
      elements.universeCustomSetsList.appendChild(emptySet);
    } else {
      universeCustomSearchSets.forEach((set) => {
        const row = document.createElement("li");
        row.className = `universeCustomSetItem${universeActiveCustomSetId === set.id ? " active" : ""}`;
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
          applyUniverseCustomSearchSet(set.id);
        });
        name.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            applyUniverseCustomSearchSet(set.id);
          }
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
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            event.stopPropagation();
            onRemove();
          }
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
        elements.universeCustomSetsList.appendChild(row);
      });
    }

    if (!selected) {
      elements.universeNodeInspectorTitle.textContent = "Node Details";
      elements.universeNodeInspectorMeta.textContent = "Select a node in Universe to inspect.";
      elements.universeNodeInspectorDefinition.textContent = "Definition preview appears here.";
      elements.universeNodeInspectorFacts.innerHTML = "";
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

      elements.universeNodeInspectorTitle.textContent = selected.word || "Node";
      elements.universeNodeInspectorMeta.textContent = `Type: ${posType} | Mode: ${mode} | Origin: ${origin}`;
      elements.universeNodeInspectorDefinition.textContent = getUniverseNodeDefinitionPreview(selected);
      elements.universeNodeInspectorFacts.innerHTML = "";
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
        elements.universeNodeInspectorFacts.appendChild(li);
      });
    }
  }

  if (
    !(elements.universeClusterList instanceof HTMLElement) ||
    !(elements.universeClusterSummary instanceof HTMLElement)
  ) {
    return;
  }
  elements.universeClusterList.innerHTML = "";
  if (!selected) {
    elements.universeClusterSummary.textContent = "Select a node to inspect its cluster.";
    const empty = document.createElement("li");
    empty.className = "archiveItem";
    empty.textContent = "No cluster selected.";
    elements.universeClusterList.appendChild(empty);
    return;
  }
  const clusterId = cleanText(selected.componentId, 40);
  let clusterNodes = [];
  if (clusterId) {
    clusterNodes = universeGraph.nodes.filter((node) => cleanText(node.componentId, 40) === clusterId);
  } else {
    clusterNodes = universeGraph.nodes.filter((node) => node.componentSize === selected.componentSize);
  }
  clusterNodes.sort((left, right) => {
    return (
      (Number(right.degree) || 0) - (Number(left.degree) || 0) || String(left.word).localeCompare(String(right.word))
    );
  });
  const maxList = clusterNodes.slice(0, 120);
  elements.universeClusterSummary.textContent = `"${selected.word}" cluster: ${clusterNodes.length} word(s).`;
  maxList.forEach((node) => {
    const row = document.createElement("li");
    row.className = "archiveItem";
    row.dataset.entryId = node.entryId || "";
    row.textContent = `${node.word} (${Math.max(0, Number(node.degree) || 0)} links)`;
    row.addEventListener("click", () => {
      const index = universeNodeIndexByWord.get(getUniverseNodeWordLower(node));
      if (Number.isInteger(index)) {
        focusUniverseNodeIndex(index, { center: true, focusEntry: true });
      }
    });
    elements.universeClusterList.appendChild(row);
  });
  if (clusterNodes.length > maxList.length) {
    const tail = document.createElement("li");
    tail.className = "archiveItem";
    tail.textContent = `... ${clusterNodes.length - maxList.length} more`;
    elements.universeClusterList.appendChild(tail);
  }
}

function renderUniverseGraph() {
  const startedAt = performance.now();
  const canvas = getActiveUniverseCanvas();
  if (!(canvas instanceof HTMLCanvasElement)) {
    return;
  }
  const resized = ensureUniverseCanvasSize();
  if (!isUniverseVisible() && !resized) {
    return;
  }
  const width = universeCanvasSize.width;
  const height = universeCanvasSize.height;
  const dpr = universeCanvasSize.dpr;
  const nodes = Array.isArray(universeGraph.nodes) ? universeGraph.nodes : [];
  const edges = Array.isArray(universeGraph.edges) ? universeGraph.edges : [];
  const filter = cleanText(universeViewState.filter, MAX.WORD).toLowerCase();
  const highlightState = getUniverseHighlightState(nodes, filter);
  const highlightFlags = highlightState.flags;

  const selectedIndex = universeViewState.selectedNodeIndex;
  const selectedFlags = universeSelectionFlags;
  const hoverIndex = universeViewState.hoverNodeIndex;
  const pathNodeFlags = universePathNodeFlags;
  const pathEdgeSet = universePathEdgeKeys;
  const filterActive = filter.length > 0;
  if (universeBenchmarkState.running) {
    updateUniverseBenchmarkCamera(getUniverseBenchmarkProgress(startedAt));
  }
  const projection = getUniverseProjectionData(nodes, width, height);

  if (universeConfig.renderMode === UNIVERSE_VIEW_MODE_WEBGL) {
    const rendered = renderUniverseGraphWebgl(
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
      if (universeViewState.pulseNodeIndex >= 0 && universeViewState.pulseUntil > Date.now()) {
        requestUniverseRender();
      }
      updateUniverseFrameMetrics(startedAt, performance.now() - startedAt);
      return;
    }
    universeConfig = normalizeUniverseConfig({
      ...universeConfig,
      renderMode: UNIVERSE_VIEW_MODE_CANVAS,
      bookmarks: universeConfig.bookmarks
    });
    universeGpuForcedCanvas = true;
    updateUniverseCanvasVisibility();
    syncUniverseControls();
    setStatus("WebGL unavailable, switched to canvas renderer.", true);
    requestUniverseRender();
    return;
  }

  const context = getUniverseCanvasContext(canvas);
  if (!context) {
    return;
  }
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.clearRect(0, 0, width, height);

  if (nodes.length === 0) {
    context.fillStyle = "rgba(177, 198, 228, 0.92)";
    context.font = "600 14px 'Space Grotesk', sans-serif";
    context.fillText("No universe data yet. Add more words to build links.", 20, 30);
    if (universeBenchmarkState.running) {
      completeUniverseBenchmark("no-data");
    }
    renderUniversePerfHud();
    return;
  }

  const projectionX = projection.x;
  const projectionY = projection.y;
  const projectionRadius = projection.radius;
  const nodeCount = Math.max(1, nodes.length);

  const edgeStride = getUniverseEdgeStride(edges.length);
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
    const edgeKey = buildUniverseEdgeKey(a, b, nodeCount);
    const isPathEdge = pathEdgeSet.has(edgeKey);
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
    } else if (edge?.hasSameLabel === true || (Array.isArray(edge?.modes) && edge.modes.includes("sameLabel"))) {
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
    const isPulsing = nodeIndex === universeViewState.pulseNodeIndex && universeViewState.pulseUntil > now;
    const baseColor = getUniverseNodeColor(node);

    let alphaBase = 0.36 + Math.min(0.44, (Number(node.degree) || 0) / 18);
    if (filterActive && !isHighlighted && !isPrimarySelected && !isSecondarySelected && !isHovered && !isPathNode) {
      alphaBase *= 0.18;
    }
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
      const [red, green, blue] = getUniverseColorRgb(baseColor).map((value) => Math.round(value * 255));
      context.fillStyle = `rgba(${red}, ${green}, ${blue}, ${colorAlpha})`;
    }
    context.fill();
    if (isPulsing) {
      const age = Math.max(0, universeViewState.pulseUntil - now);
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
  if (selectedNode) {
    drawUniverseNodeLabel(context, selectedNode.word, projectionX[selectedIndex], projectionY[selectedIndex]);
  }
  if (hoverNode && hoverIndex !== selectedIndex) {
    drawUniverseNodeLabel(context, hoverNode.word, projectionX[hoverIndex], projectionY[hoverIndex]);
  }
  if (universeViewState.pulseNodeIndex >= 0 && universeViewState.pulseUntil > now) {
    requestUniverseRender();
  }
  updateUniverseFrameMetrics(startedAt, performance.now() - startedAt);
}

function syncUniverseSelectionWithEntry(entryId) {
  const normalizedId = cleanText(entryId, MAX.WORD);
  universeActiveCustomSetId = "";
  if (!normalizedId) {
    setUniverseNodeSelectionSet([], -1);
    renderUniverseClusterPanel();
    if (state.activeView === VIEW_UNIVERSE) {
      requestUniverseRender();
    }
    return;
  }
  const nextIndex = universeNodeIndexByEntryId.get(normalizedId);
  if (Number.isInteger(nextIndex)) {
    setUniverseNodeSelectionSet([nextIndex], nextIndex);
  } else {
    setUniverseNodeSelectionSet([], -1);
  }
  renderUniverseClusterPanel();
  if (state.activeView === VIEW_UNIVERSE) {
    requestUniverseRender();
  }
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
  requestTreeRender();
  renderStatisticsView();
}

function setActiveView(view) {
  state.activeView =
    view === VIEW_SENTENCE_GRAPH || view === VIEW_STATISTICS || view === VIEW_UNIVERSE ? view : VIEW_WORKBENCH;
  const showWorkbench = state.activeView === VIEW_WORKBENCH;
  const showSentenceGraph = state.activeView === VIEW_SENTENCE_GRAPH;
  const showStats = state.activeView === VIEW_STATISTICS;
  const showUniverse = state.activeView === VIEW_UNIVERSE;
  if (
    !(elements.workbenchView instanceof HTMLElement) ||
    !(elements.sentenceGraphView instanceof HTMLElement) ||
    !(elements.statisticsView instanceof HTMLElement) ||
    !(elements.universeView instanceof HTMLElement)
  ) {
    return;
  }
  elements.workbenchView.classList.toggle("hidden", !showWorkbench);
  elements.sentenceGraphView.classList.toggle("hidden", !showSentenceGraph);
  elements.statisticsView.classList.toggle("hidden", !showStats);
  elements.universeView.classList.toggle("hidden", !showUniverse);
  if (elements.treePane instanceof HTMLElement) {
    elements.treePane.classList.toggle("universe-mode", showUniverse);
  }
  if (elements.universeInspectorPane instanceof HTMLElement) {
    elements.universeInspectorPane.classList.toggle("hidden", !showUniverse);
  }
  if (elements.showWorkbenchViewAction instanceof HTMLElement) {
    elements.showWorkbenchViewAction.classList.toggle("active", showWorkbench);
  }
  if (elements.showSentenceGraphViewAction instanceof HTMLElement) {
    elements.showSentenceGraphViewAction.classList.toggle("active", showSentenceGraph);
  }
  if (elements.showStatisticsViewAction instanceof HTMLElement) {
    elements.showStatisticsViewAction.classList.toggle("active", showStats);
  }
  if (elements.showUniverseViewAction instanceof HTMLElement) {
    elements.showUniverseViewAction.classList.toggle("active", showUniverse);
  }
  if (showSentenceGraph) {
    requestSentenceGraphRender({ force: true });
    return;
  }
  if (showStats) {
    scheduleStatsWorkerCompute();
    renderStatisticsView();
    return;
  }
  if (showUniverse) {
    updateUniverseCanvasVisibility();
    scheduleUniverseGraphBuild();
    renderUniverseSummary();
    renderUniverseClusterPanel();
    renderUniversePerfHud(true);
    void loadUniverseGpuStatus(false);
    requestUniverseRender({ force: true });
  }
}

function clearDiagnosticsFlushTimer() {
  if (diagnosticsFlushTimer) {
    window.clearTimeout(diagnosticsFlushTimer);
    diagnosticsFlushTimer = 0;
  }
}

function scheduleDiagnosticsFlush(delayMs = 1200) {
  clearDiagnosticsFlushTimer();
  diagnosticsFlushTimer = window.setTimeout(async () => {
    diagnosticsFlushTimer = 0;
    if (!window.dictionaryAPI?.appendDiagnostics) {
      return;
    }
    const payload = normalizeDiagnostics(state.diagnostics);
    if (payload.errors.length === 0 && payload.perf.length === 0) {
      return;
    }
    try {
      await window.dictionaryAPI.appendDiagnostics(payload);
      state.diagnostics = createDefaultDiagnostics();
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
    labels: [...state.labels],
    entries: state.entries.map((entry) => ({
      ...entry,
      labels: [...entry.labels]
    })),
    sentenceGraph: {
      nodes: state.sentenceGraph.nodes.map((node) => ({ ...node })),
      links: state.sentenceGraph.links.map((link) => ({ ...link }))
    },
    graphLockEnabled: state.graphLockEnabled
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
  if (undoReplayActive) {
    return;
  }
  const snapshot = buildUndoSnapshot(reason);
  const digest = digestUndoSnapshot(snapshot);
  if (digest === lastUndoDigest) {
    return;
  }
  undoStack = [...undoStack, snapshot].slice(-120);
  redoStack = [];
  lastUndoDigest = digest;
}

function applyUndoSnapshot(snapshot, options = {}) {
  const { announce = "" } = options;
  if (!snapshot) {
    return false;
  }
  undoReplayActive = true;
  store.setLabels(normalizeLabelArray(snapshot.labels));
  store.setEntries((Array.isArray(snapshot.entries) ? snapshot.entries : []).map(normalizeLoadedEntry).filter(Boolean));
  sortEntries();
  store.setGraph(normalizeLoadedSentenceGraph(snapshot.sentenceGraph));
  state.graphLockEnabled = Boolean(snapshot.graphLockEnabled);
  state.selectedEntryId = null;
  state.selectedGraphNodeId = null;
  clearEntrySelections();
  clearPendingGraphLink();
  requestTreeRender();
  requestSentenceGraphRender();
  if (announce) {
    setStatus(announce);
  }
  undoReplayActive = false;
  return true;
}

function runUndo() {
  if (undoStack.length < 2) {
    return false;
  }
  const current = undoStack.pop();
  const previous = undoStack[undoStack.length - 1];
  if (!previous) {
    if (current) {
      undoStack.push(current);
    }
    return false;
  }
  if (current) {
    redoStack = [...redoStack, current].slice(-120);
  }
  applyUndoSnapshot(previous, { announce: "Undo applied." });
  return true;
}

function runRedo() {
  const next = redoStack.pop();
  if (!next) {
    return false;
  }
  undoStack = [...undoStack, next].slice(-120);
  applyUndoSnapshot(next, { announce: "Redo applied." });
  return true;
}

function scheduleIndexWarmup() {
  if (indexWarmupTimer) {
    window.clearTimeout(indexWarmupTimer);
  }
  indexWarmupTimer = window.setTimeout(() => {
    indexWarmupTimer = 0;
    getEntriesIndex();
    getGraphIndex();
  }, 40);
}

function getStatsModelKey() {
  return `${entriesVersion}|${graphVersion}`;
}

function invalidateStatisticsCache() {
  statsCacheKey = "";
  statsCacheModel = null;
  statsWorkerModelKey = "";
  statsWorkerModel = null;
}

function requestStatsWorkerComputeNow() {
  if (!statsWorkerReady || !statsWorker || state.entries.length < STATS_WORKER_MIN_ENTRIES) {
    return;
  }
  const versionKey = getStatsModelKey();
  latestStatsWorkerRequestId += 1;
  const requestId = latestStatsWorkerRequestId;
  statsWorkerRequestId = requestId;
  try {
    statsWorker.postMessage({
      type: "computeStats",
      requestId,
      versionKey,
      entries: state.entries.map((entry) => ({
        id: entry.id,
        word: entry.word,
        labels: entry.labels,
        favorite: Boolean(entry.favorite),
        archivedAt: entry.archivedAt || null,
        mode: entry.mode,
        updatedAt: entry.updatedAt,
        usageCount: Number(entry.usageCount) || 0
      })),
      nodes: state.sentenceGraph.nodes.map((node) => ({
        entryId: node.entryId || ""
      })),
      graphLinks: state.sentenceGraph.links.length
    });
  } catch {
    statsWorkerReady = false;
  }
}

function scheduleStatsWorkerCompute() {
  if (!statsWorkerTask) {
    return;
  }
  statsWorkerTask.schedule();
}

function initializeStatsWorker() {
  if (typeof Worker !== "function") {
    return;
  }
  try {
    statsWorker = new Worker("modules/stats-worker.js");
  } catch {
    statsWorker = null;
    statsWorkerReady = false;
    return;
  }
  statsWorkerReady = true;
  statsWorker.onmessage = (event) => {
    const payload = event?.data && typeof event.data === "object" ? event.data : {};
    if (payload.type === "statsError") {
      recordDiagnosticError(
        "stats_worker_error",
        cleanText(payload.message || "Unknown stats worker error.", 300),
        "statsWorker"
      );
      return;
    }
    if (payload.type !== "statsResult") {
      return;
    }
    const requestId = Number(payload.requestId) || 0;
    if (requestId < statsWorkerRequestId) {
      return;
    }
    statsWorkerRequestId = requestId;
    statsWorkerModelKey = cleanText(payload.versionKey, 80);
    statsWorkerModel = payload.model && typeof payload.model === "object" ? payload.model : null;
    if (state.activeView === VIEW_STATISTICS) {
      renderStatisticsView();
    }
  };
  statsWorker.onerror = (error) => {
    statsWorkerReady = false;
    recordDiagnosticError("stats_worker_failed", cleanText(String(error?.message || error), 300), "statsWorker");
  };
}

function getUniverseModelKey() {
  const edgeModes = universeConfig.edgeModes || {};
  return [
    String(entriesVersion),
    String(universeConfig.minWordLength),
    String(universeConfig.maxWordLength),
    String(universeConfig.maxNodes),
    String(universeConfig.maxEdges),
    universeConfig.favoritesOnly ? "1" : "0",
    cleanText(universeConfig.labelFilter, MAX.LABEL).toLowerCase(),
    edgeModes.contains ? "1" : "0",
    edgeModes.prefix ? "1" : "0",
    edgeModes.suffix ? "1" : "0",
    edgeModes.stem ? "1" : "0",
    edgeModes.sameLabel ? "1" : "0"
  ].join("|");
}

function rebuildUniverseNodeIndexes() {
  universeNodeIndexByEntryId = new Map();
  universeNodeIndexByWord = new Map();
  universeGraph.nodes.forEach((node, index) => {
    const entryId = cleanText(node.entryId, MAX.WORD);
    if (entryId && !universeNodeIndexByEntryId.has(entryId)) {
      universeNodeIndexByEntryId.set(entryId, index);
    }
    const wordLower = getUniverseNodeWordLower(node);
    if (wordLower && !universeNodeIndexByWord.has(wordLower)) {
      universeNodeIndexByWord.set(wordLower, index);
    }
  });
  invalidateUniverseHighlightCache();
  syncUniverseSelectionFlags();
  syncUniversePathNodeFlags();
  invalidateUniverseAdjacencyCache();
}

function clearUniversePathHighlights() {
  universePathEdgeKeys = new Set();
  universePathNodeIndices = [];
  universePathWords = [];
  syncUniversePathNodeFlags();
  setUniversePathStatus("Path finder ready.");
}

function normalizeUniverseGraph(graphRaw) {
  const source = graphRaw && typeof graphRaw === "object" ? graphRaw : {};
  const nodes = Array.isArray(source.nodes)
    ? source.nodes.map((nodeRaw, index) => {
        const node = nodeRaw && typeof nodeRaw === "object" ? nodeRaw : {};
        const word = cleanText(node.word, MAX.WORD);
        const labels = normalizeLabelArray(node.labels || []).slice(0, 20);
        const nodeX = Number(node.x);
        const nodeY = Number(node.y);
        return {
          id: cleanText(node.id, MAX.WORD) || `universe-node-${index}`,
          entryId: cleanText(node.entryId, MAX.WORD),
          word,
          wordLower: normalizeWordLower(word),
          labels,
          questionBucket: inferUniverseQuestionBucketFromLabels(labels),
          partOfSpeech: cleanText(node.partOfSpeech, MAX.LABEL).toLowerCase(),
          mode: normalizeEntryMode(node.mode),
          degree: Math.max(0, Math.floor(Number(node.degree) || 0)),
          componentSize: Math.max(1, Math.floor(Number(node.componentSize) || 1)),
          componentId: cleanText(node.componentId, 40),
          x: Number.isFinite(nodeX) ? clampNumber(nodeX, -4, 4) : 0.5,
          y: Number.isFinite(nodeY) ? clampNumber(nodeY, -4, 4) : 0.5
        };
      })
    : [];

  const edgeSet = new Set();
  const edges = [];
  const nodeCount = nodes.length;
  (Array.isArray(source.edges) ? source.edges : []).forEach((edgeRaw) => {
    const edge = edgeRaw && typeof edgeRaw === "object" ? edgeRaw : {};
    const a = Math.floor(Number(edge.a));
    const b = Math.floor(Number(edge.b));
    if (!Number.isInteger(a) || !Number.isInteger(b) || a < 0 || b < 0 || a >= nodeCount || b >= nodeCount || a === b) {
      return;
    }
    const left = Math.min(a, b);
    const right = Math.max(a, b);
    const key = left * Math.max(1, nodeCount) + right;
    if (edgeSet.has(key)) {
      return;
    }
    edgeSet.add(key);
    const modes = unique(
      (Array.isArray(edge.modes) ? edge.modes : []).map((mode) => cleanText(mode, 20)).filter(Boolean)
    );
    edges.push({
      a: left,
      b: right,
      modes,
      hasSameLabel: modes.includes("sameLabel")
    });
  });

  const metaSource = source.meta && typeof source.meta === "object" ? source.meta : {};
  const modeCountsSource =
    metaSource.edgeModeCounts && typeof metaSource.edgeModeCounts === "object" ? metaSource.edgeModeCounts : {};
  return {
    nodes,
    edges,
    meta: {
      nodeCount: Math.max(0, Math.floor(Number(metaSource.nodeCount) || nodes.length)),
      edgeCount: Math.max(0, Math.floor(Number(metaSource.edgeCount) || edges.length)),
      components: Math.max(0, Math.floor(Number(metaSource.components) || 0)),
      isolated: Math.max(0, Math.floor(Number(metaSource.isolated) || 0)),
      largestComponent: Math.max(0, Math.floor(Number(metaSource.largestComponent) || 0)),
      capped: Boolean(metaSource.capped),
      edgeModeCounts: {
        contains: Math.max(0, Math.floor(Number(modeCountsSource.contains) || 0)),
        prefix: Math.max(0, Math.floor(Number(modeCountsSource.prefix) || 0)),
        suffix: Math.max(0, Math.floor(Number(modeCountsSource.suffix) || 0)),
        stem: Math.max(0, Math.floor(Number(modeCountsSource.stem) || 0)),
        sameLabel: Math.max(0, Math.floor(Number(modeCountsSource.sameLabel) || 0))
      }
    }
  };
}

function buildUniverseCachePayload() {
  const configSnapshot = normalizeUniverseConfig(universeConfig);
  const customSetsSnapshot = normalizeUniverseCustomSearchSets(universeCustomSearchSets);
  return {
    version: 1,
    datasetSignature: universeDatasetSignature,
    modelKey: universeGraphCacheKey,
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
      activeCustomSetId: cleanText(universeActiveCustomSetId, MAX.WORD)
    },
    bookmarks: configSnapshot.bookmarks,
    graph: universeGraph,
    updatedAt: nowIso()
  };
}

function queueUniverseCacheSave() {
  if (!window.dictionaryAPI?.saveUniverseCache) {
    return;
  }
  if (universeCacheSaveTimer) {
    window.clearTimeout(universeCacheSaveTimer);
  }
  universeCacheSaveTimer = window.setTimeout(async () => {
    universeCacheSaveTimer = 0;
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
    universeCustomSearchSets = normalizeUniverseCustomSearchSets(configSource.customSets);
    universeActiveCustomSetId = cleanText(configSource.activeCustomSetId, MAX.WORD);
    const mergedConfig = normalizeUniverseConfig({
      ...configSource,
      renderMode: UNIVERSE_VIEW_MODE_WEBGL,
      bookmarks: bookmarksSource
    });
    universeConfig = mergedConfig;
    syncUniverseControls();
    updateUniverseBookmarkSelect();
    updateUniverseCanvasVisibility();

    const cachedGraph = source.graph && typeof source.graph === "object" ? normalizeUniverseGraph(source.graph) : null;
    const cacheModelKey = cleanText(source.modelKey, 200);
    const cacheDatasetSignature = cleanText(source.datasetSignature, 120000);
    const currentModelKey = getUniverseModelKey();
    const currentDatasetSignature = getUniverseDatasetSignature(state.entries);
    if (
      cachedGraph &&
      cachedGraph.nodes.length > 0 &&
      cacheModelKey === currentModelKey &&
      cacheDatasetSignature === currentDatasetSignature
    ) {
      universeGraph = cachedGraph;
      universeGraphCacheKey = currentModelKey;
      universeDatasetSignature = currentDatasetSignature;
      clearUniverseProjectionCache();
      rebuildUniverseNodeIndexes();
      clearUniversePathHighlights();
      syncUniverseSelectionWithEntry(state.selectedEntryId || "");
      if (universeActiveCustomSetId) {
        applyUniverseCustomSearchSet(universeActiveCustomSetId, {
          announce: false,
          center: false
        });
      }
      renderUniverseSummary();
      requestUniverseRender();
    }
    renderUniverseClusterPanel();
  } catch (error) {
    recordDiagnosticError("universe_cache_load_failed", String(error?.message || error), "universeCache");
  } finally {
    universeCacheLoaded = true;
  }
}

function invalidateUniverseGraph() {
  universeGraphCacheKey = "";
  universeDatasetSignature = "";
  universeGraph = createEmptyUniverseGraph();
  clearUniverseProjectionCache();
  invalidateUniverseHighlightCache();
  invalidateUniverseAdjacencyCache();
  universeNodeIndexByEntryId = new Map();
  universeNodeIndexByWord = new Map();
  universeSelectedNodeIndices = new Set();
  universeSelectionFlags = new Uint8Array(0);
  universeActiveCustomSetId = "";
  clearUniversePathHighlights();
  universeViewState.hoverNodeIndex = -1;
  universeViewState.selectedNodeIndex = -1;
  renderUniverseClusterPanel();
}

function buildUniverseGraphFallback() {
  const nodes = state.entries
    .filter((entry) => {
      if (entry.archivedAt) {
        return false;
      }
      if (universeConfig.favoritesOnly && !entry.favorite) {
        return false;
      }
      if (universeConfig.labelFilter) {
        const labelsLower = normalizeLabelArray(entry.labels).map((label) => label.toLowerCase());
        if (!labelsLower.some((label) => label.includes(universeConfig.labelFilter))) {
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
    .filter((item) => item.wordLower.length >= universeConfig.minWordLength)
    .sort((left, right) => right.score - left.score || left.wordLower.localeCompare(right.wordLower))
    .slice(0, Math.min(500, universeConfig.maxNodes));

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

function requestUniverseGraphBuildNow() {
  const versionKey = getUniverseModelKey();
  const datasetSignature = getUniverseDatasetSignature(state.entries);
  if (universeGraphCacheKey === versionKey && universeDatasetSignature === datasetSignature) {
    return;
  }

  if (!universeWorkerReady || !universeWorker) {
    universeGraph = normalizeUniverseGraph(buildUniverseGraphFallback());
    universeGraphCacheKey = versionKey;
    universeDatasetSignature = datasetSignature;
    clearUniverseProjectionCache();
    rebuildUniverseNodeIndexes();
    clearUniversePathHighlights();
    if (
      !universeActiveCustomSetId ||
      !applyUniverseCustomSearchSet(universeActiveCustomSetId, {
        announce: false,
        center: false
      })
    ) {
      syncUniverseSelectionWithEntry(state.selectedEntryId || "");
    }
    queueUniverseCacheSave();
    if (state.activeView === VIEW_UNIVERSE) {
      renderUniverseSummary();
      requestUniverseRender();
    }
    return;
  }

  latestUniverseWorkerRequestId += 1;
  const requestId = latestUniverseWorkerRequestId;
  universeWorkerRequestId = requestId;
  if (state.activeView === VIEW_UNIVERSE && elements.universeSummary instanceof HTMLElement) {
    elements.universeSummary.textContent = "Building word universe...";
  }
  try {
    universeWorker.postMessage({
      type: "buildUniverseGraph",
      requestId,
      versionKey,
      entries: state.entries.map((entry) => ({
        id: entry.id,
        word: entry.word,
        labels: entry.labels,
        mode: normalizeEntryMode(entry.mode),
        usageCount: Number(entry.usageCount) || 0,
        favorite: Boolean(entry.favorite),
        archivedAt: entry.archivedAt || null
      })),
      options: {
        minWordLength: universeConfig.minWordLength,
        maxWordLength: universeConfig.maxWordLength,
        maxNodes: universeConfig.maxNodes,
        maxEdges: universeConfig.maxEdges,
        favoritesOnly: universeConfig.favoritesOnly,
        labelFilter: universeConfig.labelFilter,
        edgeModes: {
          contains: universeConfig.edgeModes.contains,
          prefix: universeConfig.edgeModes.prefix,
          suffix: universeConfig.edgeModes.suffix,
          stem: universeConfig.edgeModes.stem,
          sameLabel: universeConfig.edgeModes.sameLabel
        },
        seed: 1337
      }
    });
    universeDatasetSignature = datasetSignature;
  } catch (error) {
    universeWorkerReady = false;
    recordDiagnosticError(
      "universe_worker_post_failed",
      cleanText(String(error?.message || error), 320),
      "universeWorker"
    );
  }
}

function scheduleUniverseGraphBuild() {
  if (!universeBuildTask) {
    return;
  }
  universeBuildTask.schedule();
}

function initializeUniverseWorker() {
  if (typeof Worker !== "function") {
    return;
  }
  try {
    universeWorker = new Worker("modules/word-universe-worker.js");
  } catch {
    universeWorker = null;
    universeWorkerReady = false;
    return;
  }
  universeWorkerReady = true;
  universeWorker.onmessage = (event) => {
    const payload = event?.data && typeof event.data === "object" ? event.data : {};
    if (payload.type === "universeGraphError") {
      recordDiagnosticError(
        "universe_worker_error",
        cleanText(payload.message || "Universe graph worker error.", 320),
        "universeWorker"
      );
      return;
    }
    if (payload.type !== "universeGraphResult") {
      return;
    }
    const requestId = Number(payload.requestId) || 0;
    if (requestId < universeWorkerRequestId) {
      return;
    }
    universeWorkerRequestId = requestId;
    universeGraphCacheKey = cleanText(payload.versionKey, 200);
    const graph = payload.graph && typeof payload.graph === "object" ? payload.graph : null;
    if (!graph) {
      return;
    }
    universeGraph = normalizeUniverseGraph(graph);
    clearUniverseProjectionCache();
    rebuildUniverseNodeIndexes();
    clearUniversePathHighlights();
    universeViewState.hoverNodeIndex = -1;
    if (
      !universeActiveCustomSetId ||
      !applyUniverseCustomSearchSet(universeActiveCustomSetId, {
        announce: false,
        center: false
      })
    ) {
      syncUniverseSelectionWithEntry(state.selectedEntryId || "");
    }
    queueUniverseCacheSave();
    if (state.activeView === VIEW_UNIVERSE) {
      renderUniverseSummary();
      requestUniverseRender();
    }
  };
  universeWorker.onerror = (error) => {
    universeWorkerReady = false;
    recordDiagnosticError("universe_worker_failed", cleanText(String(error?.message || error), 320), "universeWorker");
  };
}

function markEntriesDirty() {
  entriesVersion += 1;
  entriesIndexDirty = true;
  treeModelCacheKey = "";
  treeModelCacheValue = null;
  searchMatchCacheKey = "";
  searchMatchCacheValue = null;
  labelFilterOptionsCacheKey = "";
  sentenceSuggestionsCacheKey = "";
  sentenceSuggestionsCacheValue = [];
  invalidateStatisticsCache();
  invalidateUniverseGraph();
  scheduleIndexWarmup();
  scheduleStatsWorkerCompute();
  scheduleUniverseGraphBuild();
  captureUndoSnapshot("entries");
}

function markGraphDirty() {
  graphVersion += 1;
  graphLayoutVersion += 1;
  graphIndexDirty = true;
  sentenceSuggestionsCacheKey = "";
  sentenceSuggestionsCacheValue = [];
  invalidateStatisticsCache();
  scheduleIndexWarmup();
  scheduleStatsWorkerCompute();
  captureUndoSnapshot("graph");
}

store.setHooks({
  onEntriesMutation: markEntriesDirty,
  onGraphMutation: markGraphDirty
});

function rebuildEntriesIndex() {
  const byId = new Map();
  const byWordLower = new Map();
  const byLabel = new Map();
  const unlabeled = [];
  const unlabeledActive = [];
  const posIndex = {};
  const labelCounts = {};
  const labelCountsActive = {};
  let activeEntriesCount = 0;
  const sortedLabels = [...state.labels].sort((a, b) => a.localeCompare(b));
  const wordPrefixIndex = buildWordPrefixIndex(state.entries);

  sortedLabels.forEach((label) => {
    byLabel.set(label, []);
    labelCounts[label] = 0;
    labelCountsActive[label] = 0;
  });

  state.entries.forEach((entry) => {
    byId.set(entry.id, entry);
    const isActive = !entry.archivedAt;
    if (isActive) {
      activeEntriesCount += 1;
    }

    const wordLower = cleanText(entry.word, MAX.WORD).toLowerCase();
    if (wordLower && !byWordLower.has(wordLower)) {
      byWordLower.set(wordLower, entry);
    }

    if (entry.labels.length === 0) {
      unlabeled.push(entry);
      if (isActive) {
        unlabeledActive.push(entry);
      }
      return;
    }

    entry.labels.forEach((label) => {
      if (!byLabel.has(label)) {
        byLabel.set(label, []);
        labelCounts[label] = labelCounts[label] || 0;
        labelCountsActive[label] = labelCountsActive[label] || 0;
      }
      byLabel.get(label).push(entry);
      labelCounts[label] = (labelCounts[label] || 0) + 1;
      if (isActive) {
        labelCountsActive[label] = (labelCountsActive[label] || 0) + 1;
      }

      const normalized = cleanText(label, MAX.LABEL).toLowerCase();
      if (!isPartOfSpeechLabel(normalized)) {
        return;
      }
      if (!posIndex[normalized]) {
        posIndex[normalized] = [];
      }
      posIndex[normalized].push(entry);
    });
  });

  return {
    byId,
    byWordLower,
    wordPrefixIndex,
    byLabel,
    unlabeled,
    unlabeledActive,
    posIndex,
    labelCounts,
    labelCountsActive,
    activeEntriesCount,
    sortedLabels
  };
}

function rebuildGraphIndex() {
  return buildGraphIndex(state.sentenceGraph.nodes, state.sentenceGraph.links);
}

function getEntriesIndex() {
  if (entriesIndexDirty || !entriesIndexCache) {
    entriesIndexCache = rebuildEntriesIndex();
    entriesIndexDirty = false;
  }
  return entriesIndexCache;
}

function getGraphIndex() {
  if (graphIndexDirty || !graphIndexCache) {
    graphIndexCache = rebuildGraphIndex();
    graphIndexDirty = false;
  }
  return graphIndexCache;
}

function requestTreeRender() {
  if (treeRenderFrameId) {
    return;
  }
  treeRenderFrameId = window.requestAnimationFrame(() => {
    treeRenderFrameId = 0;
    renderTree();
  });
}

function requestSentenceGraphRender(options = {}) {
  const refreshPreview = options.refreshPreview !== false;
  const refreshSuggestions = options.refreshSuggestions !== false;
  const force = options.force === true;
  graphRenderNeedsPreview = graphRenderNeedsPreview || refreshPreview;
  graphRenderNeedsSuggestions = graphRenderNeedsSuggestions || refreshSuggestions;
  if (!force && !isSentenceGraphVisible()) {
    return;
  }

  if (graphRenderFrameId) {
    return;
  }

  graphRenderFrameId = window.requestAnimationFrame(() => {
    graphRenderFrameId = 0;
    const nextPreview = graphRenderNeedsPreview;
    const nextSuggestions = graphRenderNeedsSuggestions;
    graphRenderNeedsPreview = false;
    graphRenderNeedsSuggestions = false;
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
  return getEntriesIndex().byId.get(id) || null;
}

function getGraphNodeById(nodeId) {
  const id = cleanText(nodeId, MAX.WORD);
  if (!id) {
    return null;
  }
  return getGraphIndex().nodeById.get(id) || null;
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
  return getEntriesIndex().byWordLower.get(nodeWord) || null;
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
  return Number(getGraphIndex().backlinkCountByEntryId?.get(id) || 0);
}

function getNearDuplicateEntries(word, excludeId = "") {
  return buildNearDuplicateCluster(
    state.entries.filter((entry) => !entry.archivedAt),
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
  const nodeIds = state.sentenceGraph.nodes.filter((node) => node.entryId === entry.id).map((node) => node.id);
  const outgoing = getGraphIndex().outgoingIdsByNodeId;
  const incoming = getGraphIndex().incomingIdsByNodeId;
  nodeIds.forEach((nodeId) => {
    (outgoing.get(nodeId) || []).forEach((targetId) => {
      const node = getGraphNodeById(targetId);
      if (node?.entryId) {
        linkedEntryIds.add(node.entryId);
      }
    });
    (incoming.get(nodeId) || []).forEach((sourceId) => {
      const node = getGraphNodeById(sourceId);
      if (node?.entryId) {
        linkedEntryIds.add(node.entryId);
      }
    });
  });

  const scored = state.entries
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
  if (!state.localAssistEnabled) {
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
  if (inferredLabels.length > 0) {
    next.labels = unique([...next.labels, ...inferredLabels]);
  }
  if (inferredQuestionLabels.length > 0) {
    next.labels = unique([...next.labels, ...inferredQuestionLabels]);
  }
  if (next.mode === "slang" && !next.labels.some((label) => label.toLowerCase() === "slang")) {
    next.labels = unique([...next.labels, "slang"]);
  }
  if (next.mode === "code") {
    next.labels = unique([...next.labels, "code"]);
  }
  if (next.mode === "bytes") {
    next.labels = unique([...next.labels, "bytes"]);
  }

  const posLabels = detectPosConflicts(next.labels);
  const warnings = [];
  if (posLabels.length > 1) {
    warnings.push(`POS conflict: ${posLabels.join(", ")}`);
  }
  if (next.mode === "bytes" && next.definition.length > 0 && !/^[0-9a-fA-F+/_=\\s-]+$/.test(next.definition)) {
    warnings.push("Bytes mode expects hex/base64-like text.");
  }

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
    if (!seen.some((item) => isPartOfSpeechLabel(item.toLowerCase()))) {
      seen.push(label);
    }
  });
  return unique(seen);
}

function refreshInlineWarningsFromForm() {
  const labels = parseLabels(elements.labelsInput.value);
  const definition = cleanText(elements.definitionInput.value, MAX.DEFINITION);
  const mode = normalizeEntryMode(
    elements.entryModeSelect instanceof HTMLSelectElement ? elements.entryModeSelect.value : "definition"
  );
  const language = normalizeEntryLanguage(
    elements.entryLanguageInput instanceof HTMLInputElement ? elements.entryLanguageInput.value : ""
  );
  const warnings = [];
  const posLabels = detectPosConflicts(labels);
  if (posLabels.length > 1) {
    warnings.push(`POS conflict: ${posLabels.join(", ")}`);
  }
  if (!definition) {
    warnings.push("Definition is required.");
  }
  if (!cleanText(elements.wordInput.value, MAX.WORD)) {
    warnings.push("Word is required.");
  }
  if (mode === "code" && !language) {
    warnings.push("Code mode should include a language/context.");
  }
  if (mode === "bytes" && definition && !/^[0-9a-fA-F+/_=\\s-]+$/.test(definition)) {
    warnings.push("Bytes mode expects hex/base64-like text.");
  }
  setEntryWarnings(warnings.slice(0, 3));
}

function updateEntryModeVisualState() {
  const mode = normalizeEntryMode(
    elements.entryModeSelect instanceof HTMLSelectElement ? elements.entryModeSelect.value : "definition"
  );
  const isCodeLike = mode === "code" || mode === "bytes";
  if (elements.definitionInput instanceof HTMLTextAreaElement) {
    elements.definitionInput.classList.toggle("codeInput", isCodeLike);
    if (mode === "code") {
      elements.definitionInput.placeholder = "Paste code snippet, pseudo-code, or API usage.";
    } else if (mode === "bytes") {
      elements.definitionInput.placeholder = "Paste hex or base64 bytes payload.";
    } else if (mode === "slang") {
      elements.definitionInput.placeholder = "Explain slang meaning, origin, and usage.";
    } else {
      elements.definitionInput.placeholder = "";
    }
  }
}

function clearPendingGraphLink() {
  state.pendingLinkFromNodeId = null;
}

function makeGraphNode(word, entryId = "", x, y) {
  const normalizedWord = cleanText(word, MAX.WORD);
  if (!normalizedWord) {
    return null;
  }

  const nodeX = Number.isFinite(x)
    ? normalizeGraphCoordinate(x, GRAPH_STAGE_WIDTH, GRAPH_NODE_WIDTH)
    : normalizeGraphCoordinate(80 + state.sentenceGraph.nodes.length * 38, GRAPH_STAGE_WIDTH, GRAPH_NODE_WIDTH);
  const nodeY = Number.isFinite(y)
    ? normalizeGraphCoordinate(y, GRAPH_STAGE_HEIGHT, GRAPH_NODE_HEIGHT)
    : clampNumber(90 + (state.sentenceGraph.nodes.length % 10) * 74, 8, GRAPH_STAGE_HEIGHT - GRAPH_NODE_HEIGHT - 8);

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
  const nextNodes = state.sentenceGraph.nodes.map((node) => {
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
    store.updateState(
      () => {
        state.sentenceGraph = {
          ...state.sentenceGraph,
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

  store.addGraphNode(node);
  if (selectNode) {
    state.selectedGraphNodeId = node.id;
  }
  clearPendingGraphLink();
  if (updateStatus) {
    setSentenceStatus(`Node added: ${node.word}`);
  }
  if (render) {
    requestSentenceGraphRender();
  }
  if (autosave) {
    scheduleAutosave();
  }
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
  const selectedNode = getGraphNodeById(state.selectedGraphNodeId);
  if (selectedNode?.entryId) {
    selectEntry(selectedNode.entryId);
    return true;
  }
  const selectedEntry = getSelectedEntry();
  if (!selectedEntry) {
    return false;
  }
  const matchNode = state.sentenceGraph.nodes.find((node) => node.entryId === selectedEntry.id);
  if (!matchNode) {
    return false;
  }
  state.selectedGraphNodeId = matchNode.id;
  requestSentenceGraphRender();
  elements.sentenceViewport.focus?.();
  return true;
}

function removeSentenceNode(nodeId) {
  const nextGraph = {
    nodes: state.sentenceGraph.nodes.filter((node) => node.id !== nodeId),
    links: state.sentenceGraph.links.filter((link) => link.fromNodeId !== nodeId && link.toNodeId !== nodeId)
  };
  store.setGraph(nextGraph);
  if (state.selectedGraphNodeId === nodeId) {
    state.selectedGraphNodeId = null;
  }
  if (state.pendingLinkFromNodeId === nodeId) {
    clearPendingGraphLink();
  }
  setSentenceStatus("Node deleted.");
  requestSentenceGraphRender();
  scheduleAutosave();
}

function linkExists(fromNodeId, toNodeId) {
  return getGraphIndex().linkKeySet.has(`${fromNodeId}->${toNodeId}`);
}

function addSentenceLink(fromNodeId, toNodeId, options = {}) {
  const { render = true, autosave = true, updateStatus = true } = options;
  if (!fromNodeId || !toNodeId || fromNodeId === toNodeId) {
    return;
  }
  if (!getGraphNodeById(fromNodeId) || !getGraphNodeById(toNodeId)) {
    return;
  }
  if (linkExists(fromNodeId, toNodeId)) {
    return;
  }

  store.addGraphLink({
    id: window.crypto.randomUUID(),
    fromNodeId,
    toNodeId
  });
  if (updateStatus) {
    setSentenceStatus("Link created.");
  }
  if (render) {
    requestSentenceGraphRender();
  }
  if (autosave) {
    scheduleAutosave();
  }
}

function getOutgoingNodeIds(nodeId) {
  return getGraphIndex().outgoingIdsByNodeId.get(nodeId) || [];
}

function getIncomingNodeIds(nodeId) {
  return getGraphIndex().incomingIdsByNodeId.get(nodeId) || [];
}

function buildSentencePreviewLines(limit = 12) {
  const nodesById = getGraphIndex().nodeById;
  if (nodesById.size === 0) {
    return [];
  }

  const startNodes = state.sentenceGraph.nodes
    .filter((node) => getIncomingNodeIds(node.id).length === 0)
    .sort((a, b) => a.y - b.y || a.x - b.x);

  const seeds =
    startNodes.length > 0 ? startNodes : [...state.sentenceGraph.nodes].sort((a, b) => a.y - b.y || a.x - b.x);
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
  const nodes = state.sentenceGraph.nodes;
  const links = state.sentenceGraph.links;
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
        if (!visited.has(next)) {
          stack.push(next);
        }
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
    elements.sentencePreview.textContent = `Sentence preview: add and connect nodes to compose phrases. QA: islands ${qa.islands}, cycles ${qa.cycles}, orphaned ${qa.orphanedNodes}.`;
    return;
  }

  elements.sentencePreview.textContent = `Sentence preview: ${lines.join(" | ")} | QA: islands ${qa.islands}, cycles ${qa.cycles}, orphaned ${qa.orphanedNodes}.`;
}

function collectLinkedTargetsForWord(wordLowerCase) {
  if (!wordLowerCase) {
    return [];
  }
  return getGraphIndex().linkedTargetsByWordLower.get(wordLowerCase) || [];
}

function normalizeWordLower(word) {
  return normalizeWordLowerUtil(word, MAX.WORD);
}

function inflectVerbForSubject(baseVerb, subjectWord, subjectPos) {
  return inflectVerbForSubjectUtil(baseVerb, subjectWord, subjectPos);
}

function buildEntriesByPartOfSpeechIndex() {
  return getEntriesIndex().posIndex;
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
      .map((nodeId) => getGraphNodeById(nodeId))
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
        if (pos === "verb" && (contextPos === "noun" || contextPos === "pronoun")) {
          word = inflectVerbForSubject(entry.word, contextNode.word, contextPos);
        }
        if (normalizeWordLower(word) === normalizeWordLower(contextNode.word)) {
          return;
        }
        pushSuggestion(word, entry.id, pos);
      });
  });

  if (suggestions.length < limit) {
    state.entries.slice(0, 40).forEach((entry) => {
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
    if (index === 0 && pos === "verb" && contextNode && (contextPos === "noun" || contextPos === "pronoun")) {
      word = inflectVerbForSubject(entry.word, contextNode.word, contextPos);
    }

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
    const byId = getGraphIndex().nodeById;
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
        if (nextWords.length >= 2) {
          pushPhrase(nextWords, nextEntryIds, "graph phrase");
        }
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
    state.entries.slice(0, 30).forEach((entry) => {
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
  if (state.entries.length === 0) {
    return [];
  }

  const cacheKey = `${entriesVersion}|${graphVersion}|${state.selectedGraphNodeId || ""}|${limit}`;
  if (sentenceSuggestionsCacheKey === cacheKey) {
    return sentenceSuggestionsCacheValue;
  }

  const posIndex = buildEntriesByPartOfSpeechIndex();
  const selectedNode = getGraphNodeById(state.selectedGraphNodeId);
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
  sentenceSuggestionsCacheKey = cacheKey;
  sentenceSuggestionsCacheValue = nextSuggestions;
  return nextSuggestions;
}

function renderSentenceSuggestions() {
  const suggestions = getSentenceSuggestions();
  sentenceSuggestionActions = suggestions;
  elements.sentenceSuggestions.innerHTML = "";

  if (suggestions.length === 0) {
    const empty = document.createElement("span");
    empty.className = "sentenceSuggestionEmpty";
    empty.textContent = "Suggestions will appear after you add words to your dictionary.";
    elements.sentenceSuggestions.appendChild(empty);
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
    elements.sentenceSuggestions.appendChild(chip);
  });
}

function addSuggestedNode(word, entryId = "") {
  const fromNodeId = state.selectedGraphNodeId;
  const fromNode = getGraphNodeById(fromNodeId);

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

  state.selectedGraphNodeId = created.id;
  clearPendingGraphLink();
  setSentenceStatus(`Added: ${created.word}`);
  scheduleAutosave();
  requestSentenceGraphRender();
}

function addSuggestedPhrase(words, entryIds = [], options = {}) {
  const { statusPrefix = "Added phrase" } = options;
  const normalizedWords = (Array.isArray(words) ? words : []).map((word) => cleanText(word, MAX.WORD)).filter(Boolean);
  if (normalizedWords.length === 0) {
    return;
  }

  let fromNodeId = state.selectedGraphNodeId;
  let anchor = getGraphNodeById(fromNodeId);
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

  state.selectedGraphNodeId = lastNode.id;
  clearPendingGraphLink();
  setSentenceStatus(`${statusPrefix}: ${normalizedWords.join(" ")}`);
  scheduleAutosave();
  requestSentenceGraphRender();
}

function autoCompleteFromSelectedNode(precomputedWords = [], precomputedEntryIds = []) {
  const selectedNode = getGraphNodeById(state.selectedGraphNodeId);
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
    !elements.sentenceNodes ||
    !elements.sentenceEdges ||
    !elements.sentenceSuggestions ||
    !elements.sentencePreview
  ) {
    return;
  }

  syncGraphNodeWordsFromEntries();

  elements.sentenceNodes.innerHTML = "";
  elements.sentenceEdges.innerHTML = "";
  const stageWidthText = `${GRAPH_STAGE_WIDTH}px`;
  const stageHeightText = `${GRAPH_STAGE_HEIGHT}px`;
  if (elements.sentenceStage.style.width !== stageWidthText) {
    elements.sentenceStage.style.width = stageWidthText;
  }
  if (elements.sentenceStage.style.height !== stageHeightText) {
    elements.sentenceStage.style.height = stageHeightText;
  }
  const graphViewBox = `0 0 ${GRAPH_STAGE_WIDTH} ${GRAPH_STAGE_HEIGHT}`;
  if (elements.sentenceEdges.getAttribute("viewBox") !== graphViewBox) {
    elements.sentenceEdges.setAttribute("viewBox", graphViewBox);
  }

  const nodeById = getGraphIndex().nodeById;
  const nodesFragment = document.createDocumentFragment();
  state.sentenceGraph.nodes.forEach((node) => {
    const nodeEl = document.createElement("div");
    nodeEl.className = "sentenceNode";
    if (node.id === state.selectedGraphNodeId) {
      nodeEl.classList.add("selected");
    }
    if (node.id === state.pendingLinkFromNodeId) {
      nodeEl.classList.add("pending");
    }
    if (state.graphLockEnabled || node.locked) {
      nodeEl.classList.add("locked");
    }
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
    if (state.pendingLinkFromNodeId === node.id) {
      outputPort.classList.add("active");
    }

    nodeEl.appendChild(inputPort);
    nodeEl.appendChild(word);
    nodeEl.appendChild(outputPort);
    nodesFragment.appendChild(nodeEl);
  });
  elements.sentenceNodes.appendChild(nodesFragment);

  const edgesFragment = document.createDocumentFragment();
  state.sentenceGraph.links.forEach((link) => {
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
  elements.sentenceEdges.appendChild(edgesFragment);

  if (refreshPreview) {
    renderSentencePreview();
  }
  if (refreshSuggestions) {
    renderSentenceSuggestions();
  }
  renderGraphMiniMap();
  if (state.activeView === VIEW_STATISTICS) {
    renderStatisticsView();
  }
  recordDiagnosticPerf("render_graph_ms", performance.now() - startedAt);
}

function renderGraphMiniMap() {
  if (
    !(elements.graphMiniMapSvg instanceof SVGElement) ||
    !(elements.graphMiniMapViewport instanceof HTMLElement) ||
    !(elements.sentenceViewport instanceof HTMLElement)
  ) {
    return;
  }

  const miniSvg = elements.graphMiniMapSvg;
  const miniMapKey = `${graphVersion}|${graphLayoutVersion}|${state.selectedGraphNodeId || ""}`;
  if (graphMiniMapCacheKey !== miniMapKey) {
    graphMiniMapCacheKey = miniMapKey;
    miniSvg.innerHTML = "";
    const miniFragment = document.createDocumentFragment();

    state.sentenceGraph.links.forEach((link) => {
      const from = getGraphNodeById(link.fromNodeId);
      const to = getGraphNodeById(link.toNodeId);
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
    state.sentenceGraph.nodes.forEach((node) => {
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

    state.sentenceGraph.nodes.forEach((node) => {
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", String(node.x));
      rect.setAttribute("y", String(node.y));
      rect.setAttribute("width", String(GRAPH_NODE_WIDTH));
      rect.setAttribute("height", String(GRAPH_NODE_HEIGHT));
      rect.setAttribute("rx", "20");
      rect.setAttribute(
        "fill",
        node.id === state.selectedGraphNodeId ? "rgba(99,169,255,0.95)" : "rgba(95,120,165,0.85)"
      );
      miniFragment.appendChild(rect);
    });
    miniSvg.appendChild(miniFragment);
  }

  const viewport = elements.sentenceViewport;
  const leftRatio = viewport.scrollLeft / GRAPH_STAGE_WIDTH;
  const topRatio = viewport.scrollTop / GRAPH_STAGE_HEIGHT;
  const widthRatio = viewport.clientWidth / GRAPH_STAGE_WIDTH;
  const heightRatio = viewport.clientHeight / GRAPH_STAGE_HEIGHT;
  elements.graphMiniMapViewport.style.left = `${leftRatio * 100}%`;
  elements.graphMiniMapViewport.style.top = `${topRatio * 100}%`;
  elements.graphMiniMapViewport.style.width = `${Math.min(100, widthRatio * 100)}%`;
  elements.graphMiniMapViewport.style.height = `${Math.min(100, heightRatio * 100)}%`;
}

function ensureLabelExists(label) {
  if (!label) {
    return;
  }
  if (store.addLabel(label)) {
    state.labels.sort((a, b) => a.localeCompare(b));
  }
}

function ensureLabelsExist(labels) {
  labels.forEach(ensureLabelExists);
}

function buildSnapshot() {
  return {
    version: 4,
    labels: [...state.labels],
    entries: state.entries.map((entry) => ({
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
      nodes: state.sentenceGraph.nodes.map((node) => ({
        id: node.id,
        entryId: node.entryId,
        word: node.word,
        locked: Boolean(node.locked),
        x: node.x,
        y: node.y
      })),
      links: state.sentenceGraph.links.map((link) => ({
        id: link.id,
        fromNodeId: link.fromNodeId,
        toNodeId: link.toNodeId
      }))
    },
    history: state.history.map((checkpoint) => ({
      id: checkpoint.id,
      reason: checkpoint.reason,
      createdAt: checkpoint.createdAt,
      labels: checkpoint.labels,
      entries: checkpoint.entries,
      sentenceGraph: checkpoint.sentenceGraph
    })),
    graphLockEnabled: state.graphLockEnabled,
    localAssistEnabled: state.localAssistEnabled,
    diagnostics: normalizeDiagnostics(state.diagnostics),
    lastSavedAt: state.lastSavedAt
  };
}

function getSelectedEntry() {
  if (!state.selectedEntryId) {
    return null;
  }
  return getEntryById(state.selectedEntryId);
}

function sortEntries() {
  state.entries.sort((a, b) => {
    if (Boolean(a.favorite) !== Boolean(b.favorite)) {
      return a.favorite ? -1 : 1;
    }
    return a.word.localeCompare(b.word, undefined, { sensitivity: "base" }) || a.word.localeCompare(b.word);
  });
}

function clearAutosaveTimer() {
  if (autosaveTask) {
    autosaveTask.clear();
  }
}

function clearLookupTimer() {
  if (lookupTask) {
    lookupTask.clear();
  }
}

function clearEntryCommitTimer() {
  if (entryCommitTask) {
    entryCommitTask.clear();
  }
}

function clearTreeSearchTimer() {
  if (treeSearchTask) {
    treeSearchTask.clear();
  }
}

function clearStatsWorkerTimer() {
  if (statsWorkerTask) {
    statsWorkerTask.clear();
  }
}

function clearUniverseBuildTimer() {
  if (universeBuildTask) {
    universeBuildTask.clear();
  }
}

function clearUniverseCacheSaveTimer(flush = false) {
  if (universeCacheSaveTimer) {
    window.clearTimeout(universeCacheSaveTimer);
    universeCacheSaveTimer = 0;
  }
  if (flush && window.dictionaryAPI?.saveUniverseCache) {
    window.dictionaryAPI.saveUniverseCache(buildUniverseCachePayload()).catch(() => {});
  }
}

function disposeUniverseWebgl() {
  if (!universeWebglState || !universeWebglState.gl) {
    universeWebglState = null;
    return;
  }
  const { gl, line, point, buffers } = universeWebglState;
  try {
    if (buffers?.linePosition) {
      gl.deleteBuffer(buffers.linePosition);
    }
    if (buffers?.lineColor) {
      gl.deleteBuffer(buffers.lineColor);
    }
    if (buffers?.pointPosition) {
      gl.deleteBuffer(buffers.pointPosition);
    }
    if (buffers?.pointSize) {
      gl.deleteBuffer(buffers.pointSize);
    }
    if (buffers?.pointColor) {
      gl.deleteBuffer(buffers.pointColor);
    }
    if (line?.program) {
      gl.deleteProgram(line.program);
    }
    if (point?.program) {
      gl.deleteProgram(point.program);
    }
  } catch {
    // Ignore WebGL cleanup errors.
  }
  universeWebglState = null;
}

function clearRenderSchedules() {
  if (treeRenderFrameId) {
    window.cancelAnimationFrame(treeRenderFrameId);
    treeRenderFrameId = 0;
  }
  if (graphRenderFrameId) {
    window.cancelAnimationFrame(graphRenderFrameId);
    graphRenderFrameId = 0;
  }
  if (universeRenderFrameId) {
    window.cancelAnimationFrame(universeRenderFrameId);
    universeRenderFrameId = 0;
  }
  graphRenderNeedsPreview = false;
  graphRenderNeedsSuggestions = false;
}

function getGroupLimit(groupKey) {
  if (!state.groupLimits[groupKey]) {
    state.groupLimits[groupKey] = TREE_PAGE_SIZE;
  }
  return state.groupLimits[groupKey];
}

function isGroupExpanded(groupKey) {
  return state.expandedGroups[groupKey] === true;
}

function setGroupExpanded(groupKey, expanded) {
  state.expandedGroups[groupKey] = Boolean(expanded);
  if (expanded) {
    getGroupLimit(groupKey);
  }
}

function toggleGroupExpanded(groupKey) {
  setGroupExpanded(groupKey, !isGroupExpanded(groupKey));
}

function increaseGroupLimit(groupKey) {
  state.groupLimits[groupKey] = getGroupLimit(groupKey) + TREE_PAGE_SIZE;
}

function getEntriesForLabel(label) {
  return getEntriesIndex().byLabel.get(label) || [];
}

function getUnlabeledEntries() {
  return getEntriesIndex().unlabeled;
}

function getSearchQuery() {
  return cleanText(state.treeSearch, MAX.WORD).toLowerCase();
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
  const cacheKey = `${entriesVersion}|${normalizedQuery}`;
  if (searchMatchCacheKey === cacheKey && searchMatchCacheValue instanceof Set) {
    return searchMatchCacheValue;
  }
  const ids = new Set();
  getEntriesIndex().byId.forEach((entry) => {
    if (entryMatchesSearch(entry, normalizedQuery)) {
      ids.add(entry.id);
    }
  });
  searchMatchCacheKey = cacheKey;
  searchMatchCacheValue = ids;
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
      state.groupScrollTops[groupKey] = Math.max(0, (index - 2) * TREE_VIRTUAL_ROW_HEIGHT);
      return;
    }

    const requiredLimit = Math.ceil((index + 1) / TREE_PAGE_SIZE) * TREE_PAGE_SIZE;
    if (getGroupLimit(groupKey) < requiredLimit) {
      state.groupLimits[groupKey] = requiredLimit;
    }
  });
}

async function saveState() {
  const startedAt = performance.now();
  try {
    ensureCheckpoint("autosave");
    const response = await window.dictionaryAPI.save(buildSnapshot());
    state.lastSavedAt = response.lastSavedAt || nowIso();
    setStatus(formatSaved(state.lastSavedAt));
    updateHistoryRestoreOptions();
    recordDiagnosticPerf("save_state_ms", performance.now() - startedAt);
  } catch (error) {
    setStatus("Save failed.", true);
    recordDiagnosticError("save_failed", String(error?.message || error), "saveState");
    console.error(error);
  }
}

function scheduleAutosave() {
  if (!readyForAutosave) {
    return;
  }

  clearAutosaveTimer();
  setStatus("Saving...");
  autosaveTask.schedule();
}

function renderEntryInsights(entry = null) {
  if (!(elements.entryInsights instanceof HTMLElement)) {
    return;
  }
  if (!entry) {
    elements.entryInsights.textContent = "Insights appear when you select an entry.";
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
  elements.entryInsights.textContent = `Backlinks: ${backlinks}. ${favoriteStatus}. ${archiveStatus}. ${modeStatus}. ${usageStatus}. ${duplicateText}. ${relatedText}.`;
}

function renderEditorForNewEntry() {
  clearEntryCommitTimer();
  state.selectedEntryId = null;
  elements.formTitle.textContent = "New Entry";
  elements.entryForm.reset();
  if (elements.entryModeSelect instanceof HTMLSelectElement) {
    elements.entryModeSelect.value = "definition";
  }
  if (elements.entryLanguageInput instanceof HTMLInputElement) {
    elements.entryLanguageInput.value = "";
  }
  updateEntryModeVisualState();
  setHelperText(DEFAULT_HELPER_TEXT);
  setEntryWarnings([]);
  renderEntryInsights(null);
  syncUniverseSelectionWithEntry("");
}

function renderEditorForEntry(entry, options = {}) {
  const { syncSelection = true, syncUniverse = true } = options;
  clearEntryCommitTimer();
  state.selectedEntryId = entry.id;
  if (syncSelection) {
    setSingleEntrySelection(entry.id);
  }
  elements.formTitle.textContent = `Edit: ${entry.word}`;
  elements.wordInput.value = entry.word;
  if (elements.entryModeSelect instanceof HTMLSelectElement) {
    elements.entryModeSelect.value = normalizeEntryMode(entry.mode);
  }
  if (elements.entryLanguageInput instanceof HTMLInputElement) {
    elements.entryLanguageInput.value = normalizeEntryLanguage(entry.language || "");
  }
  updateEntryModeVisualState();
  elements.definitionInput.value = entry.definition;
  elements.labelsInput.value = entry.labels.join(", ");
  const near = getNearDuplicateEntries(entry.word, entry.id)
    .map((item) => item.word)
    .slice(0, 4);
  setHelperText(near.length > 0 ? `${SELECTED_HELPER_TEXT} Similar: ${near.join(", ")}` : SELECTED_HELPER_TEXT);
  setEntryWarnings([]);
  renderEntryInsights(entry);
  if (syncUniverse) {
    syncUniverseSelectionWithEntry(entry.id);
  }
}

function resetEditor() {
  renderEditorForNewEntry();
  clearEntrySelections();
  requestTreeRender();
}

function selectEntry(entryId) {
  const entry = getEntryById(entryId);
  if (!entry) {
    return;
  }
  incrementEntryUsage(entry.id, 1);
  renderEditorForEntry(entry);
  ensureEntryVisible(entry);
  requestTreeRender();
  renderStatisticsView();
}

function removeLabel(label) {
  const normalizedLabel = normalizeLabel(label);
  store.updateState(
    () => {
      state.labels = state.labels.filter((item) => item !== normalizedLabel);
      state.entries = state.entries.map((entry) => ({
        ...entry,
        labels: entry.labels.filter((entryLabel) => entryLabel !== normalizedLabel),
        updatedAt: nowIso()
      }));
    },
    { labels: true, entries: true }
  );

  if (
    normalizedLabel &&
    state.selectedTreeLabel &&
    state.selectedTreeLabel.toLowerCase() === normalizedLabel.toLowerCase()
  ) {
    state.selectedTreeLabel = "";
    state.selectedTreeGroupKey = "";
  }
  if (state.treeLabelFilter === normalizedLabel) {
    state.treeLabelFilter = LABEL_FILTER_ALL;
  }

  const selectedEntry = getSelectedEntry();
  if (selectedEntry) {
    elements.labelsInput.value = selectedEntry.labels.join(", ");
    ensureEntryVisible(selectedEntry);
  }

  requestTreeRender();
  requestSentenceGraphRender();
  scheduleAutosave();
}

function beginNewEntryInLabel(label) {
  const normalized = resolvePreferredEntryLabel(label);
  renderEditorForNewEntry();
  if (normalized) {
    elements.labelsInput.value = normalized;
    state.selectedTreeLabel = normalized;
    state.selectedTreeGroupKey = keyForLabel(normalized);
  }
  elements.wordInput.focus();
  requestTreeRender();
}

function detachGraphNodesFromEntry(entryId) {
  const id = cleanText(entryId, MAX.WORD);
  if (!id) {
    return;
  }
  let changed = false;
  const nextNodes = state.sentenceGraph.nodes.map((node) => {
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
    store.updateState(
      () => {
        state.sentenceGraph = {
          ...state.sentenceGraph,
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

  const wasSelected = state.selectedEntryId === entryId;
  store.removeEntryById(entryId);
  detachGraphNodesFromEntry(entryId);

  if (wasSelected) {
    resetEditor();
  } else {
    requestTreeRender();
  }

  requestSentenceGraphRender();

  scheduleAutosave();
}

function deleteSelectedEntry() {
  archiveEntryById(state.selectedEntryId);
}

function toggleFavoriteEntry(entryId) {
  const id = cleanText(entryId, MAX.WORD);
  if (!id) {
    return false;
  }
  let changed = false;
  store.updateEntryById(id, (entry) => {
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
  requestTreeRender();
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
  store.updateEntryById(id, (entry) => {
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
  requestTreeRender();
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
  store.updateEntryById(id, (entry) => {
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
  requestTreeRender();
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
  store.updateEntryById(id, (entry) => ({
    ...entry,
    usageCount: Math.max(0, Math.floor(Number(entry.usageCount) || 0) + delta)
  }));
}

function collectEntryFromForm() {
  const labelsFromForm = parseLabels(elements.labelsInput.value);
  const fallbackLabel = resolvePreferredEntryLabel();
  return {
    word: cleanText(elements.wordInput.value, MAX.WORD),
    definition: cleanText(elements.definitionInput.value, MAX.DEFINITION),
    labels: labelsFromForm.length > 0 ? labelsFromForm : fallbackLabel ? [fallbackLabel] : [],
    mode: normalizeEntryMode(
      elements.entryModeSelect instanceof HTMLSelectElement ? elements.entryModeSelect.value : "definition"
    ),
    language: normalizeEntryLanguage(
      elements.entryLanguageInput instanceof HTMLInputElement ? elements.entryLanguageInput.value : ""
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
  const wasEditing = Boolean(state.selectedEntryId);
  let formData = collectEntryFromForm();
  if (!formData.word || !formData.definition) {
    setStatus("Word and definition are required.", true);
    return false;
  }

  const localAssist = applyLocalAssist(formData);
  formData = localAssist.formData;
  setEntryWarnings(localAssist.warnings);
  elements.definitionInput.value = formData.definition;
  elements.labelsInput.value = formData.labels.join(", ");

  const duplicate = getDuplicateEntry(formData.word, state.selectedEntryId || "");
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
    elements.labelsInput.value = formData.labels.join(", ");
  }

  ensureLabelsExist(formData.labels);

  if (!state.selectedEntryId) {
    const entry = createEntryFromFormData(formData);
    store.addEntry(entry);
    incrementEntryUsage(entry.id, 1);
    state.selectedEntryId = entry.id;
  } else {
    store.updateEntryById(state.selectedEntryId, (entry) => updateEntryFromFormData(entry, formData));
    incrementEntryUsage(state.selectedEntryId, 1);
  }

  sortEntries();

  const selectedEntry = getSelectedEntry();
  if (forceNewAfterSave) {
    if (selectedEntry) {
      ensureEntryVisible(selectedEntry);
    }
    renderEditorForNewEntry();
    setHelperText(SAVED_NEXT_HELPER_TEXT);
    elements.wordInput.focus();
  } else if (selectedEntry && !(advanceToNext && !wasEditing)) {
    ensureEntryVisible(selectedEntry);
    renderEditorForEntry(selectedEntry);
  } else if (advanceToNext && !wasEditing) {
    if (selectedEntry) {
      ensureEntryVisible(selectedEntry);
    }
    renderEditorForNewEntry();
    setHelperText(SAVED_NEXT_HELPER_TEXT);
    elements.wordInput.focus();
  } else {
    renderEditorForNewEntry();
  }

  requestTreeRender();
  requestSentenceGraphRender();
  renderStatisticsView();
  if (localAssist.warnings.length > 0) {
    setHelperText(`${SELECTED_HELPER_TEXT} ${localAssist.warnings.join(" | ")}`);
  }
  scheduleAutosave();
  return true;
}

function hasReadyDraftForAutoCommit() {
  if (lookupInFlightRequestId !== 0) {
    return false;
  }

  const draft = collectEntryFromForm();
  return Boolean(draft.word && draft.definition);
}

function autoSaveDraftAndAdvance() {
  if (!hasReadyDraftForAutoCommit()) {
    return;
  }

  saveEntryFromForm({ advanceToNext: !state.selectedEntryId });
}

function scheduleAutoCommitDraft(delayMs = AUTO_ENTRY_COMMIT_DELAY_MS) {
  clearEntryCommitTimer();

  if (!hasReadyDraftForAutoCommit()) {
    return;
  }

  entryCommitTask.schedule(delayMs);
}

function mergeLookupLabels(lookupLabels) {
  const fromForm = parseLabels(elements.labelsInput.value);
  const fromLookup = normalizeLabelArray(lookupLabels);
  const inferred = inferLabelsFromDefinition(elements.definitionInput.value);
  const questionLabels = inferQuestionLabelsFromDefinition(elements.definitionInput.value);
  return unique([...fromForm, ...fromLookup, ...inferred, ...questionLabels]);
}

async function lookupAndSaveEntry(wordOverride = "") {
  const word = cleanText(wordOverride || elements.wordInput.value, MAX.WORD);
  if (!word) {
    setStatus("Enter a word first.", true);
    return;
  }

  if (cleanText(elements.definitionInput.value, MAX.DEFINITION)) {
    return;
  }

  if (!window.dictionaryAPI?.lookupDefinition) {
    setStatus("Lookup API unavailable.", true);
    return;
  }

  const requestId = ++lookupRequestId;
  lookupInFlightRequestId = requestId;
  setStatus(`Looking up "${word}"...`);

  try {
    const result = await window.dictionaryAPI.lookupDefinition(word);

    if (requestId !== lookupRequestId) {
      return;
    }
    if (word !== cleanText(elements.wordInput.value, MAX.WORD)) {
      return;
    }
    if (cleanText(elements.definitionInput.value, MAX.DEFINITION)) {
      return;
    }
    if (!result?.ok) {
      setStatus(result?.error || "Definition not found.", true);
      return;
    }

    elements.definitionInput.value = cleanText(result.definition || "", MAX.DEFINITION);
    elements.labelsInput.value = mergeLookupLabels(result.labels).join(", ");

    const saved = saveEntryFromForm({ advanceToNext: !state.selectedEntryId });
    if (!saved) {
      return;
    }

    clearAutosaveTimer();
    await saveState();
    if (state.selectedEntryId) {
      setHelperText(`Definition fetched online for "${word}" and saved locally.`);
    } else {
      setHelperText(SAVED_NEXT_HELPER_TEXT);
    }
  } catch (error) {
    setStatus("Lookup failed. Try again.", true);
    console.error(error);
  } finally {
    if (lookupInFlightRequestId === requestId) {
      lookupInFlightRequestId = 0;
    }
    scheduleAutoCommitDraft();
  }
}

function scheduleAutoLookup() {
  const word = cleanText(elements.wordInput.value, MAX.WORD);
  const definition = cleanText(elements.definitionInput.value, MAX.DEFINITION);
  const mode = normalizeEntryMode(
    elements.entryModeSelect instanceof HTMLSelectElement ? elements.entryModeSelect.value : "definition"
  );
  clearLookupTimer();
  queuedLookupWord = "";

  if (mode === "code" || mode === "bytes" || word.length < MIN_LOOKUP_LENGTH || definition) {
    return;
  }
  queuedLookupWord = word;
  lookupTask.schedule();
}

function closeContextMenu() {
  contextMenuActions = [];
  elements.contextMenu.innerHTML = "";
  elements.contextMenu.classList.add("hidden");
}

function openContextMenu(items, x, y) {
  if (!Array.isArray(items) || items.length === 0) {
    closeContextMenu();
    return;
  }

  contextMenuActions = items;
  elements.contextMenu.innerHTML = "";

  items.forEach((item, index) => {
    const menuItem = document.createElement("div");
    menuItem.className = "contextMenuItem";
    menuItem.setAttribute("role", "menuitem");
    menuItem.tabIndex = 0;
    menuItem.dataset.action = "context-action";
    menuItem.dataset.contextIndex = String(index);
    menuItem.textContent = item.label;
    if (item.dangerous) {
      menuItem.classList.add("contextDanger");
    }
    elements.contextMenu.appendChild(menuItem);
  });

  elements.contextMenu.classList.remove("hidden");
  elements.contextMenu.style.left = `${x}px`;
  elements.contextMenu.style.top = `${y}px`;

  const bounds = elements.contextMenu.getBoundingClientRect();
  const adjustedLeft = Math.max(8, Math.min(x, window.innerWidth - bounds.width - 8));
  const adjustedTop = Math.max(8, Math.min(y, window.innerHeight - bounds.height - 8));
  elements.contextMenu.style.left = `${adjustedLeft}px`;
  elements.contextMenu.style.top = `${adjustedTop}px`;
}

function openEntryContextMenu(entryId, x, y) {
  const entry = getEntryById(entryId);
  if (!entry) {
    return;
  }

  const selectedEntries = getSelectedEntries();
  if (selectedEntries.length > 1 && state.selectedEntryIds.includes(entryId)) {
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
                  requestTreeRender();
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
  const entriesIndex = getEntriesIndex();
  const useAll = state.treeShowArchived;
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
  const sortedLabels = getEntriesIndex().sortedLabels;

  const isValidFilter =
    state.treeLabelFilter === LABEL_FILTER_ALL ||
    state.treeLabelFilter === LABEL_FILTER_UNLABELED ||
    sortedLabels.includes(state.treeLabelFilter);

  if (!isValidFilter) {
    state.treeLabelFilter = LABEL_FILTER_ALL;
  }

  if (
    state.selectedTreeLabel &&
    !sortedLabels.some((label) => label.toLowerCase() === state.selectedTreeLabel.toLowerCase())
  ) {
    state.selectedTreeLabel = "";
    if (state.selectedTreeGroupKey.startsWith("label:")) {
      state.selectedTreeGroupKey = "";
    }
  }

  const cacheKey = `${entriesVersion}|${state.treeLabelFilter}|${state.treeShowArchived ? 1 : 0}`;
  if (labelFilterOptionsCacheKey === cacheKey) {
    if (elements.treeLabelFilter.value !== state.treeLabelFilter) {
      elements.treeLabelFilter.value = state.treeLabelFilter;
    }
    return;
  }

  elements.treeLabelFilter.innerHTML = "";

  const allOption = document.createElement("option");
  allOption.value = LABEL_FILTER_ALL;
  allOption.textContent = `All Labels (${state.entries.length})`;
  elements.treeLabelFilter.appendChild(allOption);

  sortedLabels.forEach((label) => {
    const option = document.createElement("option");
    option.value = label;
    option.textContent = `${label} (${labelCounts[label] || 0})`;
    elements.treeLabelFilter.appendChild(option);
  });

  const unlabeledOption = document.createElement("option");
  unlabeledOption.value = LABEL_FILTER_UNLABELED;
  unlabeledOption.textContent = `${UNLABELED_NAME} (${unlabeledCount})`;
  elements.treeLabelFilter.appendChild(unlabeledOption);

  elements.treeLabelFilter.value = state.treeLabelFilter;
  labelFilterOptionsCacheKey = cacheKey;
}

function updatePartOfSpeechFilterOptions() {
  if (!(elements.treePartOfSpeechFilter instanceof HTMLSelectElement)) {
    return;
  }

  const current = cleanText(state.treePartOfSpeechFilter, 40) || TREE_POS_FILTER_ALL;
  const posLabels = [...PARTS_OF_SPEECH].sort((a, b) => a.localeCompare(b));
  elements.treePartOfSpeechFilter.innerHTML = "";

  const allOption = document.createElement("option");
  allOption.value = TREE_POS_FILTER_ALL;
  allOption.textContent = "All Parts of Speech";
  elements.treePartOfSpeechFilter.appendChild(allOption);

  posLabels.forEach((pos) => {
    const option = document.createElement("option");
    option.value = pos;
    option.textContent = pos;
    elements.treePartOfSpeechFilter.appendChild(option);
  });

  const valid = current === TREE_POS_FILTER_ALL || posLabels.includes(current);
  state.treePartOfSpeechFilter = valid ? current : TREE_POS_FILTER_ALL;
  elements.treePartOfSpeechFilter.value = state.treePartOfSpeechFilter;
}

function updateActivityFilterOptions() {
  if (!(elements.treeActivityFilter instanceof HTMLSelectElement)) {
    return;
  }
  const allowed = new Set([TREE_ACTIVITY_FILTER_ALL, "favorites", "recent", "linked"]);
  const current = cleanText(state.treeActivityFilter, 40) || TREE_ACTIVITY_FILTER_ALL;
  state.treeActivityFilter = allowed.has(current) ? current : TREE_ACTIVITY_FILTER_ALL;
  elements.treeActivityFilter.value = state.treeActivityFilter;
}

function setQuickCaptureStatus(message, isError = false) {
  if (!(elements.quickCaptureStatus instanceof HTMLElement)) {
    return;
  }
  elements.quickCaptureStatus.textContent = message;
  elements.quickCaptureStatus.classList.toggle("error", isError);
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
  state.labels.forEach((label) => {
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
  const entriesIndex = getEntriesIndex();
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
  state.treeLabelFilter = normalized;
  state.selectedTreeLabel = normalized;
  state.selectedTreeGroupKey = keyForLabel(normalized);
  if (!state.selectedEntryId && elements.labelsInput instanceof HTMLInputElement) {
    elements.labelsInput.value = normalized;
  }
  setQuickCaptureStatus(`Label filter set: ${normalized}`);
  requestTreeRender();
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
  if (!(elements.topLabelBar instanceof HTMLElement)) {
    return;
  }
  elements.topLabelBar.innerHTML = "";
  const allChip = document.createElement("span");
  allChip.className = `toolAction topLabelChip${state.treeLabelFilter === LABEL_FILTER_ALL ? " active" : ""}`;
  const allCount = getEntriesIndex().activeEntriesCount || 0;
  allChip.textContent = `All (${allCount})`;
  allChip.setAttribute("role", "button");
  allChip.tabIndex = 0;
  const onAllSelect = () => {
    state.treeLabelFilter = LABEL_FILTER_ALL;
    state.selectedTreeLabel = "";
    state.selectedTreeGroupKey = "";
    requestTreeRender();
  };
  allChip.addEventListener("click", onAllSelect);
  allChip.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onAllSelect();
    }
  });
  elements.topLabelBar.appendChild(allChip);

  getTopTreeLabels().forEach((label, index) => {
    const chip = document.createElement("span");
    chip.className = `toolAction topLabelChip${state.treeLabelFilter === label ? " active" : ""}`;
    chip.textContent = `${label} (${getTopLabelCount(label)})`;
    chip.setAttribute("role", "button");
    chip.title = `Alt+${index + 1}`;
    chip.tabIndex = 0;
    const onLabelSelect = () => {
      selectTopLabel(label);
    };
    chip.addEventListener("click", onLabelSelect);
    chip.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onLabelSelect();
      }
    });
    elements.topLabelBar.appendChild(chip);
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
  elements.wordInput.value = normalizedWord;
  elements.definitionInput.value = "";
  if (preferredLabel) {
    elements.labelsInput.value = preferredLabel;
  }
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
  if (quickBatchRunning || !(elements.quickWordInput instanceof HTMLInputElement)) {
    return;
  }
  const word = cleanText(elements.quickWordInput.value, MAX.WORD);
  if (!word) {
    return;
  }
  elements.quickWordInput.value = "";
  await captureSingleWord(word);
  elements.quickWordInput.focus();
}

async function captureBatchWordsFromQuickInput() {
  if (quickBatchRunning || !(elements.quickBatchInput instanceof HTMLTextAreaElement)) {
    return;
  }
  const words = parseQuickBatchWords(elements.quickBatchInput.value).slice(0, 400);
  if (words.length === 0) {
    setQuickCaptureStatus("No words found in batch input.", true);
    return;
  }

  quickBatchRunning = true;
  elements.quickBatchInput.disabled = true;
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
    quickBatchRunning = false;
    elements.quickBatchInput.disabled = false;
    elements.quickBatchInput.value = "";
    elements.quickWordInput?.focus();
  }
}

function entryPassesAdvancedFilters(entry, graphEntryIds, nowMs = Date.now()) {
  const posFilter = cleanText(state.treePartOfSpeechFilter, 40).toLowerCase();
  if (posFilter && posFilter !== TREE_POS_FILTER_ALL) {
    if (!entry.labels.some((label) => label.toLowerCase() === posFilter)) {
      return false;
    }
  }
  if (state.treeHasGraphOnly && !graphEntryIds.has(entry.id)) {
    return false;
  }
  if (state.treeActivityFilter === "favorites" && !entry.favorite) {
    return false;
  }
  if (state.treeActivityFilter === "linked" && !graphEntryIds.has(entry.id)) {
    return false;
  }
  if (state.treeActivityFilter === "recent") {
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
  state.entries.forEach((entry) => {
    if (!state.treeShowArchived && entry.archivedAt) {
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
  const cacheKey = `${entriesVersion}|${graphVersion}|${state.treeLabelFilter}|${state.treePartOfSpeechFilter}|${state.treeActivityFilter}|${state.treeHasGraphOnly ? 1 : 0}|${state.treeShowArchived ? 1 : 0}|${searchQuery}`;
  if (treeModelCacheKey === cacheKey && treeModelCacheValue) {
    return treeModelCacheValue;
  }

  const sortedLabels = getEntriesIndex().sortedLabels;
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

  if (state.treeLabelFilter === LABEL_FILTER_UNLABELED) {
    if (unlabeledGroup) {
      categories.push({
        key: CATEGORY_UNLABELED_KEY,
        title: UNLABELED_NAME,
        groups: [unlabeledGroup]
      });
    }
    treeModelCacheKey = cacheKey;
    treeModelCacheValue = { categories, searchQuery };
    return treeModelCacheValue;
  }

  if (state.treeLabelFilter !== LABEL_FILTER_ALL) {
    const selected = state.treeLabelFilter;
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
    treeModelCacheKey = cacheKey;
    treeModelCacheValue = { categories, searchQuery };
    return treeModelCacheValue;
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
    state.entries.filter((entry) => entry.favorite)
  );
  const linkedGroup = buildActivityGroup(
    "activity:linked",
    "Linked in Graph",
    state.entries.filter((entry) => graphEntryIds.has(entry.id))
  );
  const recentGroup = buildActivityGroup(
    "activity:recent",
    "Recently Updated",
    [...state.entries]
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

  treeModelCacheKey = cacheKey;
  treeModelCacheValue = { categories, searchQuery };
  return treeModelCacheValue;
}

function createFileRow(entry) {
  const row = document.createElement("li");
  row.className = "fileItem";
  row.setAttribute("role", "button");
  row.tabIndex = 0;
  const selectedSet = new Set(state.selectedEntryIds);
  if (entry.id === state.selectedEntryId) {
    row.classList.add("selected");
  }
  if (selectedSet.has(entry.id)) {
    row.classList.add("multi");
  }
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
  const scrollTop = Number(state.groupScrollTops[descriptor.key]) || viewport.scrollTop || 0;

  const windowState = calculateVirtualWindow({
    totalCount: entryCount,
    scrollTop,
    viewportHeight,
    rowHeight: TREE_VIRTUAL_ROW_HEIGHT,
    overscan: TREE_VIRTUAL_OVERSCAN
  });

  state.groupScrollTops[descriptor.key] = windowState.scrollTop;
  if (viewport.scrollTop !== windowState.scrollTop) {
    viewport.scrollTop = windowState.scrollTop;
  }
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

  const savedScrollTop = Number(state.groupScrollTops[descriptor.key]) || 0;
  if (savedScrollTop > 0) {
    viewport.scrollTop = savedScrollTop;
  }

  viewport.addEventListener("scroll", () => {
    state.groupScrollTops[descriptor.key] = viewport.scrollTop;
    renderVirtualizedGroupRows(viewport, descriptor);
  });

  renderVirtualizedGroupRows(viewport, descriptor);
  return viewport;
}

function createTreeGroup(descriptor, forceExpanded) {
  const group = document.createElement("li");
  group.className = "treeGroup";
  group.dataset.groupKey = descriptor.key;
  if (descriptor.canRemove && descriptor.labelValue) {
    group.dataset.label = descriptor.labelValue;
  }

  const folderRow = document.createElement("div");
  folderRow.className = "folderRow";
  folderRow.setAttribute("role", "button");
  folderRow.tabIndex = 0;
  folderRow.dataset.action = "select-folder";
  folderRow.dataset.groupKey = descriptor.key;
  folderRow.dataset.label = descriptor.labelValue || "";
  if (state.selectedTreeGroupKey === descriptor.key) {
    folderRow.classList.add("selected");
  }

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
  if (state.selectedTreeGroupKey === categoryStateKey) {
    categoryRow.classList.add("selected");
  }

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
  const contextLabel = normalizeLabel(state.selectedTreeLabel);
  const contextSuffix = contextLabel ? ` Context: ${contextLabel}.` : "";

  categories.forEach((category) => {
    folderCount += category.groups.length;
    category.groups.forEach((group) => {
      group.entries.forEach((entry) => visibleWordIds.add(entry.id));
    });
  });

  if (categories.length === 0) {
    elements.treeSummary.textContent = `No results.${contextSuffix}`.trim();
    return;
  }

  if (searchQuery) {
    elements.treeSummary.textContent = `Found ${visibleWordIds.size} matching words in ${folderCount} folder(s).${contextSuffix}`;
    return;
  }

  if (state.treeLabelFilter !== LABEL_FILTER_ALL) {
    elements.treeSummary.textContent = `Showing ${visibleWordIds.size} words.${contextSuffix}`;
    return;
  }

  if (state.treeActivityFilter !== TREE_ACTIVITY_FILTER_ALL) {
    elements.treeSummary.textContent = `Showing ${visibleWordIds.size} words in activity filter "${state.treeActivityFilter}".${contextSuffix}`;
    return;
  }

  elements.treeSummary.textContent = `Brain: ${visibleWordIds.size} active words across ${folderCount} folders. Alt+1..6 = quick top-label filter.${contextSuffix}`;
}

function getFilteredArchivedEntries() {
  const query = cleanText(state.archiveSearch, MAX.WORD).toLowerCase();
  return state.entries
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
  if (!(elements.archiveList instanceof HTMLElement) || !(elements.archiveSummary instanceof HTMLElement)) {
    return;
  }
  const filtered = getFilteredArchivedEntries();
  const totalArchived = state.entries.filter((entry) => entry.archivedAt).length;
  const searchText = cleanText(state.archiveSearch, MAX.WORD);
  elements.archiveSummary.textContent = searchText
    ? `Archive: ${filtered.length}/${totalArchived} word(s) match "${searchText}".`
    : `Archive: ${totalArchived} word(s).`;

  elements.archiveList.innerHTML = "";
  if (filtered.length === 0) {
    const empty = document.createElement("li");
    empty.className = "archiveItem";
    empty.textContent = "No archived words.";
    elements.archiveList.appendChild(empty);
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
    elements.archiveList.appendChild(row);
  });
}

function renderTree() {
  const startedAt = performance.now();
  updateLabelFilterOptions();
  updatePartOfSpeechFilterOptions();
  updateActivityFilterOptions();
  renderTopLabelBar();
  updateHistoryRestoreOptions();
  if (elements.treeHasGraphOnly instanceof HTMLInputElement) {
    elements.treeHasGraphOnly.checked = state.treeHasGraphOnly;
  }
  if (elements.treeShowArchived instanceof HTMLInputElement) {
    elements.treeShowArchived.checked = state.treeShowArchived;
  }
  if (elements.toggleGraphLockAction instanceof HTMLElement) {
    elements.toggleGraphLockAction.textContent = state.graphLockEnabled ? "Unlock Graph Drag" : "Lock Graph Drag";
  }

  const { categories, searchQuery } = buildTreeModel();
  const forceExpanded = searchQuery.length > 0;

  elements.treeView.innerHTML = "";
  renderTreeSummary(categories, searchQuery);

  if (categories.length === 0) {
    const empty = document.createElement("li");
    empty.className = "treeEmpty";
    empty.textContent = "No words found.";
    elements.treeView.appendChild(empty);
    renderArchivePanel();
    return;
  }

  categories.forEach((category) => {
    elements.treeView.appendChild(createCategoryGroup(category, forceExpanded));
  });
  renderArchivePanel();
  if (state.activeView === VIEW_STATISTICS) {
    renderStatisticsView();
  } else if (state.activeView === VIEW_UNIVERSE) {
    renderUniverseSummary();
    renderUniverseClusterPanel();
    requestUniverseRender();
  }
  recordDiagnosticPerf("render_tree_ms", performance.now() - startedAt);
}

function getAllGroupKeys() {
  const sortedLabels = getEntriesIndex().sortedLabels;
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
  requestTreeRender();
}

function collapseAllGroups() {
  state.expandedGroups = {};
  state.groupScrollTops = {};
  requestTreeRender();
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

  store.setLabels([...labelSet].sort((a, b) => a.localeCompare(b)));
  store.setEntries(hydratedEntries);
  sortEntries();
  store.setGraph(normalizeLoadedSentenceGraph(source.sentenceGraph));
  state.selectedEntryId = null;
  clearEntrySelections();
  state.selectedGraphNodeId = null;
  clearPendingGraphLink();
  state.activeView = VIEW_WORKBENCH;

  state.treeSearch = "";
  state.treeLabelFilter = LABEL_FILTER_ALL;
  state.treePartOfSpeechFilter = TREE_POS_FILTER_ALL;
  state.treeActivityFilter = TREE_ACTIVITY_FILTER_ALL;
  state.treeHasGraphOnly = false;
  state.treeShowArchived = false;
  state.selectedTreeGroupKey = "";
  state.selectedTreeLabel = "";
  state.explorerLayoutMode = EXPLORER_LAYOUT_NORMAL;
  state.archiveSearch = "";
  state.localAssistEnabled = source.localAssistEnabled !== false;
  state.expandedGroups = {
    [keyForCategory(CATEGORY_POS_KEY)]: true,
    [keyForCategory(CATEGORY_LABELS_KEY)]: true,
    [keyForCategory(CATEGORY_UNLABELED_KEY)]: true
  };
  state.groupLimits = {};
  state.groupScrollTops = {};
  state.graphLockEnabled = Boolean(source.graphLockEnabled);
  universeConfig = createDefaultUniverseConfig();
  universeCacheLoaded = false;
  universeViewState.filter = "";
  universeViewState.zoom = 1;
  universeViewState.panX = 0;
  universeViewState.panY = 0;
  universeViewState.hoverNodeIndex = -1;
  universeViewState.selectedNodeIndex = -1;
  universeViewState.pulseNodeIndex = -1;
  universeViewState.pulseUntil = 0;
  universePerfSampleAt = 0;
  universePerfSmoothedMs = 0;
  universeFrameSampleAt = 0;
  universeFrameSmoothedMs = 0;
  universePerfHudUpdatedAt = 0;
  universeSelectedNodeIndices = new Set();
  universeSelectionFlags = new Uint8Array(0);
  universeCustomSearchSets = [];
  universeActiveCustomSetId = "";
  universeBenchmarkState = createUniverseBenchmarkState(universeBenchmarkState.lastResult);
  universeGpuForcedCanvas = false;
  invalidateUniverseHighlightCache();
  invalidateUniverseAdjacencyCache();
  clearUniversePathHighlights();
  state.diagnostics = normalizeDiagnostics(source.diagnostics);
  state.history = Array.isArray(source.history)
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
  lastHistoryDigest = "";
  state.lastSavedAt = cleanText(source.lastSavedAt, MAX.DATE) || null;
  undoStack = [];
  redoStack = [];
  lastUndoDigest = "";
  captureUndoSnapshot("initial");
  if (elements.localAssistEnabled instanceof HTMLInputElement) {
    elements.localAssistEnabled.checked = state.localAssistEnabled;
  }
  setExplorerLayoutMode(EXPLORER_LAYOUT_NORMAL, { announce: false });
  setEntryWarnings([]);
  renderDiagnosticsSummary();
  scheduleIndexWarmup();
  scheduleUniverseGraphBuild();
  updateHistoryRestoreOptions();
  setActiveView(VIEW_WORKBENCH);
  setQuickCaptureStatus("Quick capture ready.");
  if (elements.archiveSearchInput instanceof HTMLInputElement) {
    elements.archiveSearchInput.value = "";
  }
  if (elements.universeFilterInput instanceof HTMLInputElement) {
    elements.universeFilterInput.value = "";
  }
  if (elements.universePathFromInput instanceof HTMLInputElement) {
    elements.universePathFromInput.value = "";
  }
  if (elements.universePathToInput instanceof HTMLInputElement) {
    elements.universePathToInput.value = "";
  }
  syncUniverseControls();
  updateUniverseBookmarkSelect();
  updateUniverseCanvasVisibility();
  renderUniversePerfHud(true);
  renderUniverseClusterPanel();
}

async function loadDictionaryData() {
  try {
    const loaded = await window.dictionaryAPI.load();
    hydrateState(loaded);
    if (window.dictionaryAPI?.loadDiagnostics) {
      try {
        const diagnostics = await window.dictionaryAPI.loadDiagnostics();
        state.diagnostics = normalizeDiagnostics(diagnostics);
      } catch (error) {
        recordDiagnosticError("diagnostics_load_failed", String(error?.message || error), "loadDictionaryData");
      }
    }
    await loadUniverseCache();
    if (elements.treeSearchInput instanceof HTMLInputElement) {
      elements.treeSearchInput.value = "";
    }
    resetEditor();
    if (state.sentenceGraph.nodes.length === 0) {
      setSentenceStatus("Add words, drag nodes, and connect right port to left port.");
    } else {
      setSentenceStatus(`Graph loaded: ${state.sentenceGraph.nodes.length} node(s).`);
    }
    setActiveView(VIEW_WORKBENCH);
    renderStatisticsView();
    renderUniverseSummary();
    void loadUniverseGpuStatus(true);
    requestUniverseRender();
    renderDiagnosticsSummary();
    setStatus(formatSaved(state.lastSavedAt));
    if (elements.wordInput instanceof HTMLInputElement) {
      elements.wordInput.focus();
      elements.wordInput.select();
    }
    readyForAutosave = true;
    return true;
  } catch (error) {
    readyForAutosave = false;
    setStatus("Failed to load dictionary file.", true);
    setAuthHint("Could not open dictionary after login.", true);
    setAuthGateVisible(true);
    console.error(error);
    return false;
  }
}

async function submitAuth() {
  if (authBusy) {
    return;
  }

  const { username, password } = getAuthCredentials();
  if (!username || !password) {
    setAuthHint("Username and password are required.", true);
    return;
  }

  authBusy = true;
  pushRuntimeLog("info", "auth", `Auth submit requested for "${username}".`, authMode);
  setAuthHint(authMode === AUTH_MODE_CREATE ? "Creating account..." : "Signing in...");

  try {
    let result =
      authMode === AUTH_MODE_CREATE
        ? await window.dictionaryAPI.createAccount(username, password)
        : await window.dictionaryAPI.login(username, password);

    if (!result?.ok && authMode === AUTH_MODE_CREATE && /already exists/i.test(String(result?.error || ""))) {
      result = await window.dictionaryAPI.login(username, password);
    } else if (!result?.ok && authMode === AUTH_MODE_LOGIN && /no account found/i.test(String(result?.error || ""))) {
      result = await window.dictionaryAPI.createAccount(username, password);
    }

    if (!result?.ok) {
      setAuthHint(result?.error || "Authentication failed.", true);
      pushRuntimeLog("warn", "auth", `Authentication failed for "${username}".`, String(result?.error || ""));
      return;
    }

    elements.authPasswordInput.value = "";
    setAuthGateVisible(false);
    pushRuntimeLog("info", "auth", `Authenticated as "${result.username || username}".`, authMode);
    await loadDictionaryData();
  } catch (error) {
    setAuthHint("Authentication failed.", true);
    pushRuntimeLog("error", "auth", "Authentication exception.", String(error?.message || error));
    console.error(error);
  } finally {
    authBusy = false;
  }
}

async function initializeAuthGate() {
  try {
    const status = await window.dictionaryAPI.getAuthStatus();
    authStatus = {
      quickLoginEnabled: Boolean(status?.quickLoginEnabled)
    };
    const shouldShowLogin = Boolean(status?.hasAccount) || authStatus.quickLoginEnabled;
    setAuthMode(shouldShowLogin ? AUTH_MODE_LOGIN : AUTH_MODE_CREATE);
    setAuthGateVisible(true);
    elements.authUsernameInput.value = "";
    elements.authPasswordInput.value = "";
    elements.authUsernameInput.focus();
  } catch (error) {
    authStatus = {
      quickLoginEnabled: false
    };
    setAuthMode(AUTH_MODE_CREATE);
    setAuthHint("Could not read account state.", true);
    setAuthGateVisible(true);
    console.error(error);
  }
}

function getAuthSubmitHint() {
  return getAuthSubmitHintUtil(authMode);
}

function resetAuthHintIfNeeded() {
  if (elements.authHint.classList.contains("error")) {
    setAuthHint(getAuthSubmitHint());
  }
}

function bindAutoCommitField(field, options = {}) {
  const { onInput = null, onBlur = null } = options;
  if (!(field instanceof HTMLElement)) {
    return;
  }

  field.addEventListener("input", () => {
    if (typeof onInput === "function") {
      onInput();
    }
    scheduleAutoCommitDraft();
  });

  field.addEventListener("paste", () => {
    window.setTimeout(() => {
      if (typeof onInput === "function") {
        onInput();
      }
      scheduleAutoCommitDraft();
    }, 0);
  });

  field.addEventListener("blur", () => {
    if (typeof onBlur === "function") {
      onBlur();
    }
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
  const canvases = [elements.universeCanvas, elements.universeCanvasGl].filter(
    (canvas) => canvas instanceof HTMLCanvasElement
  );
  if (canvases.length === 0) {
    return;
  }
  syncUniverseControls();
  updateUniverseBookmarkSelect();
  updateUniverseCanvasVisibility();
  renderUniversePerfHud(true);

  if (typeof ResizeObserver === "function") {
    universeResizeObserver = new ResizeObserver(() => {
      if (ensureUniverseCanvasSize() && state.activeView === VIEW_UNIVERSE) {
        requestUniverseRender();
      }
    });
    canvases.forEach((canvas) => universeResizeObserver.observe(canvas));
  }

  if (elements.universeFilterInput instanceof HTMLInputElement) {
    elements.universeFilterInput.addEventListener("input", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement)) {
        return;
      }
      universeViewState.filter = target.value;
      renderUniverseSummary();
      renderUniverseClusterPanel();
      requestUniverseRender();
    });
    elements.universeFilterInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        jumpToUniverseFilter();
      }
    });
  }
  bindActionElement(elements.universeJumpAction, () => jumpToUniverseFilter());
  bindActionElement(elements.universeBenchmarkAction, () => startUniverseBenchmark());
  bindActionElement(elements.universeBenchmarkStopAction, () => stopUniverseBenchmark("stopped"));
  bindActionElement(elements.universeGpuStatusAction, () => {
    void showUniverseGpuStatus(true);
  });

  if (elements.universeColorModeSelect instanceof HTMLSelectElement) {
    elements.universeColorModeSelect.addEventListener("change", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLSelectElement)) {
        return;
      }
      universeConfig = normalizeUniverseConfig({
        ...universeConfig,
        colorMode: target.value,
        bookmarks: universeConfig.bookmarks
      });
      syncUniverseControls();
      queueUniverseCacheSave();
      requestUniverseRender();
    });
  }

  if (elements.universeRenderModeSelect instanceof HTMLSelectElement) {
    elements.universeRenderModeSelect.addEventListener("change", (event) => {
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

  bindActionElement(elements.universeApplyFiltersAction, () => applyUniverseOptionsFromInputs());
  [
    elements.universeMinWordLengthInput,
    elements.universeMaxNodesInput,
    elements.universeMaxEdgesInput,
    elements.universeLabelFilterInput
  ].forEach((input) => {
    if (!(input instanceof HTMLInputElement)) {
      return;
    }
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        applyUniverseOptionsFromInputs();
      }
    });
  });
  if (elements.universeFavoritesOnlyInput instanceof HTMLInputElement) {
    elements.universeFavoritesOnlyInput.addEventListener("change", () => {
      applyUniverseOptionsFromInputs();
    });
  }

  bindActionElement(elements.universeEdgeContainsAction, () => toggleUniverseEdgeMode("contains"));
  bindActionElement(elements.universeEdgePrefixAction, () => toggleUniverseEdgeMode("prefix"));
  bindActionElement(elements.universeEdgeSuffixAction, () => toggleUniverseEdgeMode("suffix"));
  bindActionElement(elements.universeEdgeStemAction, () => toggleUniverseEdgeMode("stem"));
  bindActionElement(elements.universeEdgeSameLabelAction, () => toggleUniverseEdgeMode("sameLabel"));

  bindActionElement(elements.universeFindPathAction, () => applyUniversePathFinder());
  if (elements.universePathFromInput instanceof HTMLInputElement) {
    elements.universePathFromInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        applyUniversePathFinder();
      }
    });
  }
  if (elements.universePathToInput instanceof HTMLInputElement) {
    elements.universePathToInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        applyUniversePathFinder();
      }
    });
  }

  bindActionElement(elements.universeResetCameraAction, () => {
    resetUniverseCamera();
    setStatus("Universe camera reset.");
  });
  bindActionElement(elements.universeFitCameraAction, () => {
    fitUniverseCamera();
    setStatus("Universe camera fitted.");
  });
  bindActionElement(elements.universeSaveViewAction, () => saveUniverseBookmark());
  bindActionElement(elements.universeLoadViewAction, () => {
    if (!(elements.universeBookmarkSelect instanceof HTMLSelectElement)) {
      return;
    }
    if (!loadUniverseBookmark(elements.universeBookmarkSelect.value)) {
      setStatus("Select a saved view first.", true);
    }
  });
  bindActionElement(elements.universeExportPngAction, () => exportUniversePng());
  bindActionElement(elements.universeExportJsonAction, () => exportUniverseGraphJson());

  const toCanvasPoint = (event, canvas) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  };

  const stopDrag = (canvas) => {
    universeViewState.dragActive = false;
    if (canvas instanceof HTMLCanvasElement) {
      canvas.classList.remove("dragging");
    }
  };

  const scheduleHoverHitTest = () => {
    if (universeHoverFrameId) {
      return;
    }
    universeHoverFrameId = window.requestAnimationFrame(() => {
      universeHoverFrameId = 0;
      const point = universeHoverPoint;
      if (!point || universeViewState.dragActive) {
        return;
      }
      const hoverIndex = findUniverseNodeIndexAt(point.x, point.y);
      if (hoverIndex !== universeViewState.hoverNodeIndex) {
        universeViewState.hoverNodeIndex = hoverIndex;
        requestUniverseRender();
      }
    });
  };

  const attachCanvasInteractions = (canvas) => {
    canvas.addEventListener("pointerdown", (event) => {
      if (canvas !== getActiveUniverseCanvas()) {
        return;
      }
      if (event.button !== 0) {
        return;
      }
      const point = toCanvasPoint(event, canvas);
      universeViewState.dragActive = true;
      universeViewState.dragMoved = false;
      universeViewState.dragStartX = point.x;
      universeViewState.dragStartY = point.y;
      universeViewState.dragPanX = universeViewState.panX;
      universeViewState.dragPanY = universeViewState.panY;
      markUniverseInteraction();
      canvas.classList.add("dragging");
      canvas.setPointerCapture(event.pointerId);
    });

    canvas.addEventListener("pointermove", (event) => {
      if (canvas !== getActiveUniverseCanvas()) {
        return;
      }
      const point = toCanvasPoint(event, canvas);
      if (universeViewState.dragActive) {
        const dx = point.x - universeViewState.dragStartX;
        const dy = point.y - universeViewState.dragStartY;
        if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
          universeViewState.dragMoved = true;
        }
        const zoom = clampNumber(universeViewState.zoom, UNIVERSE_ZOOM_MIN, UNIVERSE_ZOOM_MAX);
        universeViewState.panX = clampNumber(
          universeViewState.dragPanX + dx / (Math.max(1, universeCanvasSize.width) * zoom),
          -1.6,
          1.6
        );
        universeViewState.panY = clampNumber(
          universeViewState.dragPanY + dy / (Math.max(1, universeCanvasSize.height) * zoom),
          -1.6,
          1.6
        );
        markUniverseInteraction();
        clearUniverseProjectionCache();
        requestUniverseRender();
        return;
      }
      universeHoverPoint = point;
      scheduleHoverHitTest();
    });

    canvas.addEventListener("pointerup", (event) => {
      if (canvas !== getActiveUniverseCanvas()) {
        return;
      }
      if (!universeViewState.dragActive) {
        return;
      }
      if (canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }
      const dragged = universeViewState.dragMoved;
      stopDrag(canvas);
      if (dragged) {
        queueUniverseCacheSave();
        return;
      }
      const point = toCanvasPoint(event, canvas);
      universeHoverPoint = point;
      const nodeIndex = findUniverseNodeIndexAt(point.x, point.y);
      if (!Number.isInteger(nodeIndex) || nodeIndex < 0) {
        clearUniverseNodeSelection();
        return;
      }
      const withModifier = event.shiftKey || event.ctrlKey || event.metaKey;
      if (withModifier) {
        toggleUniverseNodeSelection(nodeIndex, {
          center: false,
          focusEntry: true,
          announce: `Updated selection: "${universeGraph.nodes[nodeIndex]?.word || "word"}".`
        });
        return;
      }
      focusUniverseNodeIndex(nodeIndex, {
        center: false,
        announce: `Selected "${universeGraph.nodes[nodeIndex]?.word || "word"}" from universe.`,
        focusEntry: true
      });
    });

    canvas.addEventListener("pointerleave", () => {
      if (canvas !== getActiveUniverseCanvas()) {
        return;
      }
      if (universeViewState.dragActive) {
        return;
      }
      if (universeHoverFrameId) {
        window.cancelAnimationFrame(universeHoverFrameId);
        universeHoverFrameId = 0;
      }
      universeHoverPoint = null;
      if (universeViewState.hoverNodeIndex !== -1) {
        universeViewState.hoverNodeIndex = -1;
        requestUniverseRender();
      }
    });

    canvas.addEventListener("pointercancel", () => {
      if (canvas !== getActiveUniverseCanvas()) {
        return;
      }
      stopDrag(canvas);
      if (universeHoverFrameId) {
        window.cancelAnimationFrame(universeHoverFrameId);
        universeHoverFrameId = 0;
      }
      universeHoverPoint = null;
    });

    canvas.addEventListener(
      "wheel",
      (event) => {
        if (canvas !== getActiveUniverseCanvas()) {
          return;
        }
        event.preventDefault();
        const delta = event.deltaY < 0 ? 1.1 : 1 / 1.1;
        universeViewState.zoom = clampNumber(universeViewState.zoom * delta, UNIVERSE_ZOOM_MIN, UNIVERSE_ZOOM_MAX);
        markUniverseInteraction();
        clearUniverseProjectionCache();
        requestUniverseRender();
      },
      { passive: false }
    );
  };

  canvases.forEach((canvas) => attachCanvasInteractions(canvas));
}

function isCommandPaletteVisible() {
  return !(elements.commandPalette instanceof HTMLElement)
    ? false
    : !elements.commandPalette.classList.contains("hidden");
}

function closeCommandPalette() {
  if (!(elements.commandPalette instanceof HTMLElement)) {
    return;
  }
  elements.commandPalette.classList.add("hidden");
  commandPaletteItems = [];
  commandPaletteActiveIndex = 0;
}

function executeCommandPaletteItem(item) {
  if (!item || typeof item.run !== "function") {
    return;
  }
  closeCommandPalette();
  Promise.resolve(item.run()).catch((error) => {
    setStatus("Command failed.", true);
    recordDiagnosticError("command_failed", String(error?.message || error), item.label || "palette");
  });
}

function renderCommandPaletteList() {
  if (!(elements.commandPaletteList instanceof HTMLElement)) {
    return;
  }
  elements.commandPaletteList.innerHTML = "";
  if (commandPaletteItems.length === 0) {
    const empty = document.createElement("li");
    empty.className = "commandPaletteItem";
    empty.textContent = "No matching commands.";
    elements.commandPaletteList.appendChild(empty);
    return;
  }
  commandPaletteItems.forEach((item, index) => {
    const row = document.createElement("li");
    row.className = `commandPaletteItem${index === commandPaletteActiveIndex ? " active" : ""}`;
    row.textContent = item.label;
    row.addEventListener("click", () => executeCommandPaletteItem(item));
    elements.commandPaletteList.appendChild(row);
  });
}

function buildCommandPaletteActions() {
  return [
    { label: "[View] Focus Lexicon Explorer", run: () => elements.treeView?.focus() },
    { label: "[Entry] New Entry", run: () => beginNewEntryInLabel("") },
    { label: "[Entry] Save Entry and Next", run: () => saveEntryFromForm({ forceNewAfterSave: true }) },
    { label: "[Entry] Archive Selected Entries", run: () => deleteSelectedEntries() },
    {
      label: "[Entry] Restore Selected Entries",
      run: () => {
        getSelectedEntries().forEach((entry) => restoreEntryById(entry.id));
        requestTreeRender();
      }
    },
    { label: "[Entry] Restore Filtered Archived Entries", run: () => restoreFilteredArchivedEntries() },
    { label: "[Entry] Purge Filtered Archived Entries", run: () => purgeFilteredArchivedEntries() },
    {
      label: "[Entry] Toggle Favorite",
      run: () => state.selectedEntryId && toggleFavoriteEntry(state.selectedEntryId)
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
      run: () => updateReduceMotionPreference(!uiPreferences?.reduceMotion)
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
        const node = getGraphNodeById(state.selectedGraphNodeId);
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
        const node = getGraphNodeById(state.selectedGraphNodeId);
        const entry = getSelectedEntry();
        if (!node || !entry) {
          setSentenceStatus("Select both a graph node and a tree entry.");
          return;
        }
        store.setGraph({
          ...state.sentenceGraph,
          nodes: state.sentenceGraph.nodes.map((item) =>
            item.id === node.id
              ? {
                  ...item,
                  entryId: entry.id,
                  word: entry.word
                }
              : item
          )
        });
        requestSentenceGraphRender();
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
        if (!result?.ok) {
          setStatus("Runtime console disabled.", true);
        }
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
        const next = await window.dictionaryAPI.setRuntimeLogEnabled(!runtimeLogEnabled);
        runtimeLogEnabled = next?.enabled !== false;
        setStatus(runtimeLogEnabled ? "Runtime logging enabled." : "Runtime logging disabled.");
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
        requestTreeRender();
        requestSentenceGraphRender();
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
    !(elements.commandPalette instanceof HTMLElement) ||
    !(elements.commandPaletteInput instanceof HTMLInputElement)
  ) {
    return;
  }
  elements.commandPalette.classList.remove("hidden");
  elements.commandPaletteInput.value = "";
  commandPaletteItems = buildCommandPaletteActions();
  commandPaletteActiveIndex = 0;
  renderCommandPaletteList();
  elements.commandPaletteInput.focus();
}

function filterCommandPalette(query) {
  const all = buildCommandPaletteActions();
  const ranked = rankCommands(query, all);
  commandPaletteItems = ranked.slice(0, 40);
  commandPaletteActiveIndex = 0;
  renderCommandPaletteList();
}

function isTypingTargetElement(activeElement) {
  return isTypingTargetUtil(activeElement, [
    elements.quickWordInput,
    elements.quickBatchInput,
    elements.wordInput,
    elements.entryModeSelect,
    elements.entryLanguageInput,
    elements.definitionInput,
    elements.labelsInput,
    elements.newLabelInput,
    elements.batchLabelInput,
    elements.batchRelabelInput,
    elements.bulkImportInput,
    elements.treeSearchInput,
    elements.archiveSearchInput,
    elements.universeFilterInput,
    elements.universeMinWordLengthInput,
    elements.universeMaxNodesInput,
    elements.universeMaxEdgesInput,
    elements.universeLabelFilterInput,
    elements.universeCreateSetInput,
    elements.universePathFromInput,
    elements.universePathToInput,
    elements.universeColorModeSelect,
    elements.universeRenderModeSelect,
    elements.universeBookmarkSelect,
    elements.sentenceWordInput,
    elements.commandPaletteInput,
    elements.uiSettingsTrigger,
    elements.uiThemeEnterpriseInput,
    elements.uiThemeFuturisticInput,
    elements.uiThemeMonochromeInput,
    elements.uiReduceMotionInput,
    elements.authUsernameInput,
    elements.authPasswordInput
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

  bindActionElement(elements.universeSelectAllVisibleAction, () => {
    selectAllUniverseVisibleNodes({
      announce: true
    });
  });

  bindActionElement(elements.universeClearSelectionAction, () => {
    clearUniverseNodeSelection({
      announce: true
    });
  });

  bindActionElement(elements.universeInspectorOpenEntryAction, () => {
    const selectedIndex = universeViewState.selectedNodeIndex;
    const selectedNode =
      Number.isInteger(selectedIndex) && selectedIndex >= 0 ? universeGraph.nodes[selectedIndex] : null;
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

  if (elements.universeCreateSetForm instanceof HTMLFormElement) {
    elements.universeCreateSetForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const value =
        elements.universeCreateSetInput instanceof HTMLInputElement ? elements.universeCreateSetInput.value : "";
      const created = createUniverseCustomSetFromSelection(value);
      if (created && elements.universeCreateSetInput instanceof HTMLInputElement) {
        elements.universeCreateSetInput.value = "";
      }
    });
  }

  if (elements.uiSettingsPopover instanceof HTMLElement) {
    elements.uiSettingsPopover.setAttribute("tabindex", "-1");
  }
  if (elements.uiSettingsTrigger instanceof HTMLElement) {
    elements.uiSettingsTrigger.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      toggleUiSettingsPopover();
    });
    elements.uiSettingsTrigger.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        openUiSettingsPopover();
      }
    });
  }

  [elements.uiThemeEnterpriseInput, elements.uiThemeFuturisticInput, elements.uiThemeMonochromeInput].forEach(
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

  if (elements.uiReduceMotionInput instanceof HTMLInputElement) {
    elements.uiReduceMotionInput.addEventListener("change", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement)) {
        return;
      }
      updateReduceMotionPreference(target.checked);
    });
  }

  if (elements.uiSettingsPopover instanceof HTMLElement) {
    elements.uiSettingsPopover.addEventListener("keydown", (event) => {
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
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    });
  }

  const submitBulkImport = async () => {
    const mergeMode =
      elements.bulkImportMergeMode instanceof HTMLSelectElement ? elements.bulkImportMergeMode.value : "skip";
    return importEntriesFromText(elements.bulkImportInput.value, mergeMode, { clearInputAfter: true });
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
      requestTreeRender();
      return;
    }

    if (isToggle) {
      toggleEntrySelection(entry.id);
      if (state.selectedEntryIds.length === 0) {
        resetEditor();
        return;
      }
      const stillSelected = state.selectedEntryIds.includes(entry.id);
      if (stillSelected) {
        renderEditorForEntry(entry, { syncSelection: false });
        ensureEntryVisible(entry);
      } else {
        const fallback = getEntryById(state.selectedEntryIds[state.selectedEntryIds.length - 1]);
        if (fallback) {
          renderEditorForEntry(fallback, { syncSelection: false });
          ensureEntryVisible(fallback);
        }
      }
      requestTreeRender();
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
    const item = Number.isInteger(index) ? contextMenuActions[index] : null;
    closeContextMenu();
    if (item && typeof item.onSelect === "function") {
      item.onSelect();
    }
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
      requestTreeRender();
      return true;
    }

    if (action === "show-more" && groupKey) {
      increaseGroupLimit(groupKey);
      requestTreeRender();
      return true;
    }

    if (action === "select-folder" && groupKey) {
      setTreeFolderSelection(groupKey, label || "");
      requestTreeRender();
      return true;
    }

    if (action === "select-entry" && entryId) {
      applyTreeEntrySelection(entryId, event);
      return true;
    }

    return false;
  };

  elements.authForm.addEventListener("submit", (event) => {
    event.preventDefault();
    event.stopPropagation();
    submitAuth();
  });

  elements.authUsernameInput.addEventListener("input", () => {
    resetAuthHintIfNeeded();
  });

  elements.authUsernameInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") {
      return;
    }
    event.preventDefault();
    submitAuth();
  });

  elements.authPasswordInput.addEventListener("input", () => {
    resetAuthHintIfNeeded();
  });

  elements.authPasswordInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") {
      return;
    }
    event.preventDefault();
    submitAuth();
  });

  elements.quickWordForm.addEventListener("submit", (event) => {
    event.preventDefault();
    captureWordFromQuickInput().catch((error) => {
      recordDiagnosticError("quick_capture_failed", String(error?.message || error), "quickWordForm");
    });
  });

  elements.quickBatchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    captureBatchWordsFromQuickInput().catch((error) => {
      recordDiagnosticError("quick_batch_submit_failed", String(error?.message || error), "quickBatchForm");
    });
  });

  elements.quickBatchInput.addEventListener("keydown", (event) => {
    if (!(event.metaKey || event.ctrlKey) || event.key !== "Enter") {
      return;
    }
    event.preventDefault();
    captureBatchWordsFromQuickInput().catch((error) => {
      recordDiagnosticError("quick_batch_hotkey_failed", String(error?.message || error), "quickBatchInput");
    });
  });

  elements.treePartOfSpeechFilter.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLSelectElement)) {
      return;
    }
    state.treePartOfSpeechFilter = cleanText(target.value, 40) || TREE_POS_FILTER_ALL;
    requestTreeRender();
  });

  elements.treeActivityFilter.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLSelectElement)) {
      return;
    }
    state.treeActivityFilter = cleanText(target.value, 40) || TREE_ACTIVITY_FILTER_ALL;
    requestTreeRender();
  });

  elements.treeHasGraphOnly.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }
    state.treeHasGraphOnly = target.checked;
    requestTreeRender();
  });

  elements.treeShowArchived.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }
    state.treeShowArchived = target.checked;
    requestTreeRender();
  });

  elements.archiveSearchInput.addEventListener("input", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }
    state.archiveSearch = target.value;
    requestTreeRender();
  });

  elements.localAssistEnabled.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }
    state.localAssistEnabled = target.checked;
    scheduleAutosave();
  });

  elements.commandPaletteInput.addEventListener("input", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }
    filterCommandPalette(target.value);
  });

  elements.commandPaletteInput.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (commandPaletteItems.length === 0) {
        return;
      }
      commandPaletteActiveIndex = (commandPaletteActiveIndex + 1) % commandPaletteItems.length;
      renderCommandPaletteList();
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (commandPaletteItems.length === 0) {
        return;
      }
      commandPaletteActiveIndex =
        (commandPaletteActiveIndex - 1 + commandPaletteItems.length) % commandPaletteItems.length;
      renderCommandPaletteList();
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      executeCommandPaletteItem(commandPaletteItems[commandPaletteActiveIndex]);
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      closeCommandPalette();
    }
  });

  elements.commandPalette.addEventListener("click", (event) => {
    if (event.target === elements.commandPalette) {
      closeCommandPalette();
    }
  });

  elements.batchLabelForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const success = applyBatchLabel(elements.batchLabelInput.value);
    if (!success) {
      setStatus("Select one or more words first.", true);
      return;
    }
    elements.batchLabelInput.value = "";
    setStatus("Batch label applied.");
  });

  elements.batchRelabelForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const success = applyBatchRelabel(elements.batchRelabelInput.value);
    if (!success) {
      setStatus("Select one or more words first.", true);
      return;
    }
    elements.batchRelabelInput.value = "";
    setStatus("Batch relabel applied.");
  });

  elements.bulkImportForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await submitBulkImport();
  });

  elements.bulkImportInput.addEventListener("keydown", async (event) => {
    if (!(event.metaKey || event.ctrlKey) || event.key !== "Enter") {
      return;
    }
    event.preventDefault();
    await submitBulkImport();
  });

  elements.importFileInput.addEventListener("change", async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement) || !target.files || target.files.length === 0) {
      return;
    }

    try {
      const file = target.files[0];
      const text = await file.text();
      const mergeMode =
        elements.bulkImportMergeMode instanceof HTMLSelectElement ? elements.bulkImportMergeMode.value : "skip";
      await importEntriesFromText(text, mergeMode);
    } catch (error) {
      setStatus("Could not import file.", true);
      console.error(error);
    } finally {
      target.value = "";
    }
  });

  bindActionElement(elements.exportDataAction, () => {
    const format =
      elements.exportFormatSelect instanceof HTMLSelectElement ? elements.exportFormatSelect.value : "json";
    exportCurrentData(format);
    setStatus(`Exported ${format.toUpperCase()}.`);
  });

  bindActionElement(elements.restoreHistoryAction, () => {
    const checkpointId =
      elements.historyRestoreSelect instanceof HTMLSelectElement ? elements.historyRestoreSelect.value : "";
    const restored = restoreCheckpointById(checkpointId);
    if (!restored) {
      setStatus("Choose a checkpoint first.", true);
      return;
    }
    setStatus("Checkpoint restored.");
  });

  bindActionElement(elements.autoLayoutGraphAction, () => {
    autoLayoutGraph();
  });

  bindActionElement(elements.explorerCompactAction, () => {
    const nextMode =
      state.explorerLayoutMode === EXPLORER_LAYOUT_COMPACT ? EXPLORER_LAYOUT_NORMAL : EXPLORER_LAYOUT_COMPACT;
    setExplorerLayoutMode(nextMode);
  });

  bindActionElement(elements.explorerFocusAction, () => {
    const nextMode =
      state.explorerLayoutMode === EXPLORER_LAYOUT_MAXIMIZED ? EXPLORER_LAYOUT_NORMAL : EXPLORER_LAYOUT_MAXIMIZED;
    setExplorerLayoutMode(nextMode);
  });

  bindActionElement(elements.showWorkbenchViewAction, () => {
    setActiveView(VIEW_WORKBENCH);
  });

  bindActionElement(elements.showSentenceGraphViewAction, () => {
    setActiveView(VIEW_SENTENCE_GRAPH);
  });

  bindActionElement(elements.showStatisticsViewAction, () => {
    setActiveView(VIEW_STATISTICS);
  });

  bindActionElement(elements.showUniverseViewAction, () => {
    setActiveView(VIEW_UNIVERSE);
  });

  bindActionElement(elements.toggleGraphLockAction, () => {
    toggleGraphLock();
  });

  bindActionElement(elements.buildSentenceSelectionAction, () => {
    buildSentenceFromSelectedEntries();
  });

  bindActionElement(elements.deleteSelectedAction, () => {
    const deleted = deleteSelectedEntries();
    if (!deleted) {
      setStatus("No selected words to archive.", true);
      return;
    }
    setStatus("Selected words archived.");
  });

  bindActionElement(elements.restoreArchivedFilteredAction, () => {
    restoreFilteredArchivedEntries();
  });

  bindActionElement(elements.purgeArchivedFilteredAction, () => {
    purgeFilteredArchivedEntries();
  });

  bindActionElement(elements.openRuntimeConsoleAction, async () => {
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

  bindActionElement(elements.assistantNormalizeDefinition, () => {
    const mode = normalizeEntryMode(
      elements.entryModeSelect instanceof HTMLSelectElement ? elements.entryModeSelect.value : "definition"
    );
    elements.definitionInput.value =
      mode === "code" || mode === "bytes"
        ? cleanText(elements.definitionInput.value, MAX.DEFINITION)
        : sanitizeDefinitionText(elements.definitionInput.value);
    setEntryWarnings([]);
    scheduleAutoCommitDraft();
    setStatus("Definition normalized.");
  });

  bindActionElement(elements.assistantSuggestLabels, () => {
    const inferred = inferLabelsFromDefinition(elements.definitionInput.value);
    const current = parseLabels(elements.labelsInput.value);
    const next = unique([...current, ...inferred]);
    elements.labelsInput.value = next.join(", ");
    setEntryWarnings([]);
    scheduleAutoCommitDraft();
    setStatus("Suggested labels applied.");
  });

  bindActionElement(elements.assistantResolvePos, () => {
    const current = parseLabels(elements.labelsInput.value);
    const resolved = resolvePosConflictLabels(current, elements.definitionInput.value);
    elements.labelsInput.value = resolved.join(", ");
    const conflicts = detectPosConflicts(resolved);
    setEntryWarnings(conflicts.length > 1 ? [`POS conflict: ${conflicts.join(", ")}`] : []);
    setStatus(conflicts.length > 1 ? "POS conflict remains." : "POS conflict resolved.");
    scheduleAutoCommitDraft();
  });

  elements.sentenceWordForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const typed = cleanText(elements.sentenceWordInput.value, MAX.DEFINITION);
    const words = parseSentenceInputWords(typed);
    if (words.length > 1) {
      const entryIds = words.map((word) => getDuplicateEntry(word)?.id || "");
      addSuggestedPhrase(words, entryIds, {
        statusPrefix: "Added passage"
      });
      elements.sentenceWordInput.value = "";
      return;
    }
    if (words.length === 1) {
      addNodeToSentenceGraph(words[0], getDuplicateEntry(words[0])?.id || "");
      elements.sentenceWordInput.value = "";
      return;
    }

    const fromEntry = addNodeFromSelectedEntry();
    if (!fromEntry) {
      setSentenceStatus("Type a sentence/paragraph or select one in the tree first.");
    }
  });

  if (elements.sentenceWordInput instanceof HTMLTextAreaElement) {
    elements.sentenceWordInput.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" || event.shiftKey) {
        return;
      }
      event.preventDefault();
      elements.sentenceWordForm.requestSubmit();
    });
  }

  elements.treeView.addEventListener("dblclick", (event) => {
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

  elements.sentenceViewport.addEventListener("click", (event) => {
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
        state.pendingLinkFromNodeId = nodeId;
        state.selectedGraphNodeId = nodeId;
        setSentenceStatus("Link mode: click an input port to connect.");
        requestSentenceGraphRender();
        return;
      }

      if (portType === "in" && state.pendingLinkFromNodeId) {
        const fromNodeId = state.pendingLinkFromNodeId;
        clearPendingGraphLink();
        state.selectedGraphNodeId = nodeId;
        addSentenceLink(fromNodeId, nodeId, {
          render: false
        });
        requestSentenceGraphRender();
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
      state.selectedGraphNodeId = nodeId;
      requestSentenceGraphRender();
      return;
    }

    state.selectedGraphNodeId = null;
    clearPendingGraphLink();
    requestSentenceGraphRender();
  });

  elements.sentenceViewport.addEventListener("scroll", () => {
    renderGraphMiniMap();
  });

  elements.graphMiniMap.addEventListener("click", (event) => {
    const rect = elements.graphMiniMap.getBoundingClientRect();
    const relativeX = clampNumber(event.clientX - rect.left, 0, rect.width);
    const relativeY = clampNumber(event.clientY - rect.top, 0, rect.height);
    const ratioX = rect.width > 0 ? relativeX / rect.width : 0;
    const ratioY = rect.height > 0 ? relativeY / rect.height : 0;
    elements.sentenceViewport.scrollLeft = clampNumber(
      ratioX * GRAPH_STAGE_WIDTH - elements.sentenceViewport.clientWidth / 2,
      0,
      GRAPH_STAGE_WIDTH
    );
    elements.sentenceViewport.scrollTop = clampNumber(
      ratioY * GRAPH_STAGE_HEIGHT - elements.sentenceViewport.clientHeight / 2,
      0,
      GRAPH_STAGE_HEIGHT
    );
    renderGraphMiniMap();
  });

  elements.sentenceViewport.addEventListener("contextmenu", (event) => {
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
    const node = getGraphNodeById(nodeId);
    if (!node) {
      return;
    }
    openContextMenu(
      [
        {
          label: `Start Link from "${node.word}"`,
          onSelect: () => {
            state.pendingLinkFromNodeId = node.id;
            state.selectedGraphNodeId = node.id;
            setSentenceStatus("Link mode: click an input port to connect.");
            requestSentenceGraphRender();
          }
        },
        {
          label: node.locked ? `Unlock "${node.word}"` : `Lock "${node.word}"`,
          onSelect: () => {
            store.setGraph({
              ...state.sentenceGraph,
              nodes: state.sentenceGraph.nodes.map((item) =>
                item.id === node.id
                  ? {
                      ...item,
                      locked: !item.locked
                    }
                  : item
              )
            });
            requestSentenceGraphRender();
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
            store.setGraph({
              ...state.sentenceGraph,
              nodes: state.sentenceGraph.nodes.map((item) =>
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
            requestSentenceGraphRender();
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
    const suggestion = Number.isInteger(suggestionIndex) ? sentenceSuggestionActions[suggestionIndex] : null;
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

  elements.sentenceSuggestions.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    handleSuggestionAction(target);
  });

  elements.sentenceSuggestions.addEventListener("keydown", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }
    if (handleSuggestionAction(target)) {
      event.preventDefault();
    }
  });

  elements.sentenceNodes.addEventListener("mousedown", (event) => {
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
    const node = getGraphNodeById(nodeId);
    if (!node) {
      return;
    }
    if (state.graphLockEnabled || node.locked) {
      setSentenceStatus("Node dragging is locked.");
      return;
    }

    graphDragState = {
      nodeId: node.id,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startX: node.x,
      startY: node.y
    };
    state.selectedGraphNodeId = node.id;
    requestSentenceGraphRender();
  });

  window.addEventListener("mousemove", (event) => {
    if (!graphDragState) {
      return;
    }

    const node = getGraphNodeById(graphDragState.nodeId);
    if (!node) {
      graphDragState = null;
      return;
    }

    const deltaX = event.clientX - graphDragState.startClientX;
    const deltaY = event.clientY - graphDragState.startClientY;
    if (state.graphLockEnabled || node.locked) {
      graphDragState = null;
      setSentenceStatus("Node dragging is locked.");
      return;
    }
    const nextX = clampNumber(graphDragState.startX + deltaX, 8, GRAPH_STAGE_WIDTH - GRAPH_NODE_WIDTH - 8);
    const nextY = clampNumber(graphDragState.startY + deltaY, 8, GRAPH_STAGE_HEIGHT - GRAPH_NODE_HEIGHT - 8);
    if (node.x !== nextX || node.y !== nextY) {
      graphLayoutVersion += 1;
    }
    node.x = nextX;
    node.y = nextY;
    requestSentenceGraphRender({
      refreshPreview: false,
      refreshSuggestions: false
    });
  });

  window.addEventListener("mouseup", () => {
    if (!graphDragState) {
      return;
    }
    graphDragState = null;
    setSentenceStatus("Node moved.");
    scheduleAutosave();
  });

  elements.contextMenu.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    handleContextAction(target);
  });

  elements.contextMenu.addEventListener("keydown", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }
    if (handleContextAction(target)) {
      event.preventDefault();
    }
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!elements.contextMenu.classList.contains("hidden")) {
      if (!(target instanceof Node) || !elements.contextMenu.contains(target)) {
        closeContextMenu();
      }
    }

    if (!isUiSettingsPopoverOpen()) {
      return;
    }
    const clickedSettings =
      target instanceof Node &&
      ((elements.uiSettingsPopover instanceof HTMLElement && elements.uiSettingsPopover.contains(target)) ||
        (elements.uiSettingsTrigger instanceof HTMLElement && elements.uiSettingsTrigger.contains(target)));
    if (!clickedSettings) {
      closeUiSettingsPopover({ restoreFocus: false });
    }
  });

  window.addEventListener("resize", () => {
    closeContextMenu();
    closeUiSettingsPopover({ restoreFocus: false });
    renderGraphMiniMap();
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
      closeCommandPalette();
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
      if (state.pendingLinkFromNodeId) {
        clearPendingGraphLink();
        setSentenceStatus("Link mode canceled.");
        requestSentenceGraphRender();
      }
      if (
        document.activeElement instanceof HTMLElement &&
        (document.activeElement === elements.wordInput ||
          document.activeElement === elements.entryModeSelect ||
          document.activeElement === elements.entryLanguageInput ||
          document.activeElement === elements.definitionInput ||
          document.activeElement === elements.labelsInput)
      ) {
        beginNewEntryInLabel("");
      }
    }

    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      const active = document.activeElement;
      if (active === elements.newLabelInput) {
        event.preventDefault();
        elements.newLabelForm.requestSubmit();
        return;
      }
      if (
        active === elements.wordInput ||
        active === elements.entryLanguageInput ||
        active === elements.definitionInput ||
        active === elements.labelsInput
      ) {
        event.preventDefault();
        saveEntryFromForm({ forceNewAfterSave: true });
        return;
      }
    }

    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      (document.activeElement === elements.wordInput ||
        document.activeElement === elements.entryLanguageInput ||
        document.activeElement === elements.definitionInput ||
        document.activeElement === elements.labelsInput)
    ) {
      event.preventDefault();
      saveEntryFromForm({ forceNewAfterSave: true });
      return;
    }

    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "n") {
      event.preventDefault();
      beginNewEntryInLabel("");
    }

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
      if (!runRedo()) {
        setStatus("Nothing to redo.");
      }
      return;
    }

    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      if (isElementVisibleForInteraction(elements.treeSearchInput)) {
        elements.treeSearchInput.focus();
        elements.treeSearchInput.select();
        return;
      }
      if (elements.treeView instanceof HTMLElement) {
        elements.treeView.focus();
      }
    }

    if (
      (event.metaKey || event.ctrlKey) &&
      event.key.toLowerCase() === "a" &&
      state.activeView === VIEW_UNIVERSE &&
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

    if (event.altKey && event.key === "ArrowRight") {
      event.preventDefault();
      expandAllGroups();
    }

    if (event.altKey && event.key === "ArrowLeft") {
      event.preventDefault();
      collapseAllGroups();
    }

    if ((event.key === "ArrowDown" || event.key === "ArrowUp") && !isTypingTargetElement(document.activeElement)) {
      const visible = getVisibleTreeEntries();
      if (visible.length > 0) {
        const currentId = state.selectedEntryId || visible[0].id;
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
            requestTreeRender();
          } else {
            selectEntry(nextEntry.id);
          }
        }
      }
    }

    if (event.key === "Delete") {
      const active = document.activeElement;
      if (!isTypingTargetElement(active)) {
        if (state.selectedGraphNodeId) {
          event.preventDefault();
          removeSentenceNode(state.selectedGraphNodeId);
          return;
        }
        if (state.selectedEntryIds.length > 1) {
          event.preventDefault();
          if (event.shiftKey) {
            [...new Set(state.selectedEntryIds)].forEach((entryId) => deleteEntryById(entryId));
          } else {
            deleteSelectedEntries();
          }
          return;
        }
        if (state.selectedEntryId) {
          event.preventDefault();
          if (event.shiftKey) {
            deleteEntryById(state.selectedEntryId);
          } else {
            deleteSelectedEntry();
          }
        }
      }
    }
  });

  elements.newLabelForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const label = normalizeLabel(elements.newLabelInput.value);
    if (!label) {
      return;
    }
    ensureLabelExists(label);
    elements.newLabelInput.value = "";
    requestTreeRender();
    scheduleAutosave();
  });

  elements.treeSearchInput.addEventListener("input", (event) => {
    const startedAt = performance.now();
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }
    state.treeSearch = target.value;
    if (treeSearchTask) {
      treeSearchTask.schedule();
    } else {
      requestTreeRender();
    }
    recordDiagnosticPerf("search_input_ms", performance.now() - startedAt);
  });

  elements.treeLabelFilter.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLSelectElement)) {
      return;
    }
    state.treeLabelFilter = target.value;
    requestTreeRender();
  });

  elements.treeView.addEventListener("click", (event) => {
    closeContextMenu();

    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    handleTreeAction(target, event);
  });

  elements.treeView.addEventListener("keydown", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }
    if (handleTreeAction(target, event)) {
      event.preventDefault();
    }
  });

  elements.treeView.addEventListener("contextmenu", (event) => {
    event.preventDefault();

    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const entryItem = target.closest(".fileItem");
    if (entryItem instanceof HTMLElement) {
      const entryId = cleanText(entryItem.dataset.entryId, MAX.WORD);
      if (entryId) {
        if (!state.selectedEntryIds.includes(entryId)) {
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
        requestTreeRender();
        openLabelContextMenu(label, event.clientX, event.clientY);
      }
      return;
    }

    closeContextMenu();
  });

  elements.entryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    saveEntryFromForm({ advanceToNext: !state.selectedEntryId });
  });

  bindAutoCommitField(elements.wordInput, {
    onInput: () => {
      refreshInlineWarningsFromForm();
      scheduleAutoLookup();
    },
    onBlur: () => {
      const word = cleanText(elements.wordInput.value, MAX.WORD);
      const mode = normalizeEntryMode(
        elements.entryModeSelect instanceof HTMLSelectElement ? elements.entryModeSelect.value : "definition"
      );
      if (mode !== "code" && mode !== "bytes" && word.length >= MIN_LOOKUP_LENGTH) {
        clearLookupTimer();
        lookupAndSaveEntry(word);
      }
    }
  });
  bindAutoCommitField(elements.entryModeSelect, {
    onInput: () => {
      updateEntryModeVisualState();
      refreshInlineWarningsFromForm();
      scheduleAutoLookup();
    }
  });
  bindAutoCommitField(elements.entryLanguageInput, {
    onInput: () => {
      refreshInlineWarningsFromForm();
    }
  });
  bindAutoCommitField(elements.definitionInput, {
    onInput: () => {
      refreshInlineWarningsFromForm();
    }
  });
  bindAutoCommitField(elements.labelsInput, {
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
    if (universeBenchmarkState.running) {
      universeBenchmarkState = createUniverseBenchmarkState(universeBenchmarkState.lastResult);
    }
    if (universeHoverFrameId) {
      window.cancelAnimationFrame(universeHoverFrameId);
      universeHoverFrameId = 0;
    }
    universeHoverPoint = null;
    disposeUniverseWebgl();
    if (statsWorker) {
      try {
        statsWorker.terminate();
      } catch {
        // Ignore termination errors.
      }
      statsWorker = null;
      statsWorkerReady = false;
    }
    if (universeWorker) {
      try {
        universeWorker.terminate();
      } catch {
        // Ignore termination errors.
      }
      universeWorker = null;
      universeWorkerReady = false;
    }
    if (universeResizeObserver) {
      universeResizeObserver.disconnect();
      universeResizeObserver = null;
    }
    if (reduceMotionMediaQuery && reduceMotionMediaQueryListener) {
      if (typeof reduceMotionMediaQuery.removeEventListener === "function") {
        reduceMotionMediaQuery.removeEventListener("change", reduceMotionMediaQueryListener);
      } else if (typeof reduceMotionMediaQuery.removeListener === "function") {
        reduceMotionMediaQuery.removeListener(reduceMotionMediaQueryListener);
      }
    }
    reduceMotionMediaQuery = null;
    reduceMotionMediaQueryListener = null;

    if (readyForAutosave) {
      window.dictionaryAPI.save(buildSnapshot()).catch(() => {});
    }
    if (window.dictionaryAPI?.appendDiagnostics) {
      const pendingDiagnostics = normalizeDiagnostics(state.diagnostics);
      if (pendingDiagnostics.errors.length > 0 || pendingDiagnostics.perf.length > 0) {
        window.dictionaryAPI.appendDiagnostics(pendingDiagnostics).catch(() => {});
      }
    }
  });
}

async function initialize() {
  applyUiPreferences(createDefaultUiPreferences());
  if (window.dictionaryAPI?.loadUiPreferences) {
    await loadUiPreferencesFromDisk();
  }
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
      runtimeLogEnabled = logStatus?.enabled !== false;
    } catch {
      runtimeLogEnabled = false;
    }
  }

  pushRuntimeLog("info", "renderer", "Renderer initialized.", "initialize");

  await initializeAuthGate();
}

initialize();
