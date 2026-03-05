"use strict";

/**
 * Shared constants for the Dictionary renderer.
 * Source of truth — all values match the original renderer.js declarations.
 * Exposed as window.Dictionary_Constants for use across renderer modules.
 */
(function () {
  const DEFAULT_LABELS = ["Who", "What", "Where", "When", "Why", "How"];
  const DEFAULT_HELPER_TEXT = "Paste word + definition/content. Choose type for slang/code/bytes. Enter to save next.";
  const SAVED_NEXT_HELPER_TEXT = "Saved. Paste the next word.";
  const SELECTED_HELPER_TEXT = "This entry is selected in the tree.";

  const LABEL_FILTER_ALL = "__all__";
  const LABEL_FILTER_UNLABELED = "__unlabeled__";
  const UNLABELED_NAME = "Unlabeled";
  const UNLABELED_KEY = "label:__unlabeled__";
  const CATEGORY_POS_KEY = "parts-of-speech";
  const CATEGORY_LABELS_KEY = "labels";
  const CATEGORY_UNLABELED_KEY = "unlabeled";
  const CATEGORY_FILTERED_KEY = "filtered";
  const TOP_TREE_LABELS = ["Who", "What", "Where", "When", "Why", "How"];

  const PARTS_OF_SPEECH = new Set([
    "noun",
    "verb",
    "adjective",
    "adverb",
    "pronoun",
    "preposition",
    "conjunction",
    "interjection",
    "determiner",
    "article",
    "numeral"
  ]);

  const MAX = {
    LABEL: 60,
    WORD: 120,
    DEFINITION: 30000,
    DATE: 80
  };

  const AUTOSAVE_DELAY_MS = 300;
  const AUTO_LOOKUP_DELAY_MS = 700;
  const AUTO_ENTRY_COMMIT_DELAY_MS = 350;
  const TREE_SEARCH_DELAY_MS = 90;
  const STATS_WORKER_SYNC_DELAY_MS = 240;
  const MIN_LOOKUP_LENGTH = 2;
  const TREE_PAGE_SIZE = 80;
  const TREE_VIRTUALIZATION_THRESHOLD = 180;
  const TREE_VIRTUAL_ROW_HEIGHT = 34;
  const TREE_VIRTUAL_OVERSCAN = 8;
  const TREE_VIRTUAL_VIEWPORT_MAX_HEIGHT = 320;
  const HISTORY_MAX = 40;
  const TREE_POS_FILTER_ALL = "__all_pos__";
  const TREE_ACTIVITY_FILTER_ALL = "__all_activity__";
  const AUTH_MODE_CREATE = "create";
  const AUTH_MODE_LOGIN = "login";
  const VIEW_WORKBENCH = "workbench";
  const VIEW_SENTENCE_GRAPH = "sentence-graph";
  const VIEW_STATISTICS = "statistics";
  const VIEW_UNIVERSE = "universe";
  const EXPLORER_LAYOUT_NORMAL = "normal";
  const EXPLORER_LAYOUT_COMPACT = "compact";
  const EXPLORER_LAYOUT_MAXIMIZED = "maximized";
  const GRAPH_STAGE_WIDTH = 2200;
  const GRAPH_STAGE_HEIGHT = 1200;
  const GRAPH_NODE_WIDTH = 180;
  const GRAPH_NODE_HEIGHT = 56;
  const STATS_WORKER_MIN_ENTRIES = 1200;
  const AUTO_COMPLETE_STEPS = 6;
  const UNIVERSE_BUILD_DELAY_MS = 520;
  const UNIVERSE_MAX_NODES = 1800;
  const UNIVERSE_MAX_EDGES = 18000;
  const UNIVERSE_MIN_WORD_LENGTH = 3;
  const UNIVERSE_MAX_WORD_LENGTH = 28;
  const UNIVERSE_CACHE_SAVE_DELAY_MS = 900;
  const UNIVERSE_BOOKMARK_LIMIT = 24;
  const UNIVERSE_VIEW_MODE_CANVAS = "canvas";
  const UNIVERSE_VIEW_MODE_WEBGL = "webgl";
  const UNIVERSE_COLOR_MODE_QUESTION = "question";
  const UNIVERSE_COLOR_MODE_POS = "pos";
  const UNIVERSE_COLOR_MODE_MODE = "mode";
  const UNIVERSE_ZOOM_MIN = 0.45;
  const UNIVERSE_ZOOM_MAX = 4.5;
  const UNIVERSE_WEBGL_CLEAR_COLOR = [0.02, 0.04, 0.08, 1];
  const UNIVERSE_WEBGL_LINE_COLOR_PATH = [154 / 255, 228 / 255, 255 / 255, 0.92];
  const UNIVERSE_WEBGL_LINE_COLOR_DIM = [106 / 255, 135 / 255, 179 / 255, 0.06];
  const UNIVERSE_WEBGL_LINE_COLOR_LABEL = [170 / 255, 151 / 255, 255 / 255, 0.16];
  const UNIVERSE_WEBGL_LINE_COLOR_DEFAULT = [129 / 255, 168 / 255, 226 / 255, 0.16];
  const UNIVERSE_WEBGL_POINT_COLOR_PRIMARY = [237 / 255, 248 / 255, 255 / 255, 0.99];
  const UNIVERSE_WEBGL_POINT_COLOR_SECONDARY = [159 / 255, 210 / 255, 255 / 255, 0.94];
  const UNIVERSE_WEBGL_POINT_COLOR_HOVER = [188 / 255, 226 / 255, 255 / 255, 0.96];
  const UNIVERSE_WEBGL_POINT_COLOR_PATH = [167 / 255, 233 / 255, 255 / 255, 0.95];
  const UNIVERSE_WEBGL_POINT_COLOR_HIGHLIGHT = [126 / 255, 197 / 255, 255 / 255, 0.93];
  const UNIVERSE_INTERACTION_ACTIVE_MS = 220;
  const UNIVERSE_INTERACTION_EDGE_TARGET = 5200;
  const UNIVERSE_IDLE_EDGE_TARGET = 12000;
  const UNIVERSE_PERF_EDGE_TARGET_SOFT = 8000;
  const UNIVERSE_PERF_EDGE_TARGET_HARD = 5200;
  const UNIVERSE_MIN_EDGE_TARGET = 1200;
  const UNIVERSE_DPR_MAX = 2;
  const UNIVERSE_DPR_HEAVY = 1.35;
  const UNIVERSE_DPR_SOFT = 1.25;
  const UNIVERSE_DPR_LOW = 1;
  const UNIVERSE_PERF_SAMPLE_INTERVAL_MS = 1800;
  const UNIVERSE_PERF_HUD_UPDATE_INTERVAL_MS = 180;
  const UNIVERSE_BENCHMARK_DEFAULT_DURATION_MS = 12000;
  const UNIVERSE_BENCHMARK_MAX_DURATION_MS = 60000;
  const UNIVERSE_BENCHMARK_SAMPLE_LIMIT = 12000;
  const UNIVERSE_GPU_STATUS_CACHE_MS = 10000;
  const UI_PREFERENCES_SAVE_DELAY_MS = 220;

  const UI_SETTINGS_FOCUSABLE_SELECTOR = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

  const PHRASE_PATTERNS = [
    ["article", "adjective", "noun"],
    ["pronoun", "verb", "article", "noun"],
    ["noun", "verb", "adverb"],
    ["verb", "article", "noun"]
  ];

  const POS_FOLLOW_RULES = {
    article: ["adjective", "noun", "numeral"],
    determiner: ["adjective", "noun", "numeral"],
    adjective: ["noun"],
    noun: ["verb", "preposition", "conjunction", "adverb"],
    pronoun: ["verb", "adverb"],
    verb: ["adverb", "preposition", "article", "noun", "pronoun"],
    adverb: ["verb", "adjective", "adverb"],
    preposition: ["article", "noun", "pronoun", "adjective"],
    conjunction: ["pronoun", "noun", "article"],
    interjection: ["conjunction", "pronoun", "noun"],
    numeral: ["noun"]
  };

  const QW_LABELS = Object.freeze({
    who: "Who",
    what: "What",
    where: "Where",
    when: "When",
    why: "Why",
    how: "How"
  });

  const QW_RULES = Object.freeze([
    {
      patterns: [/\bperson\b/i, /\bwho\b/i, /\bname\b/i, /\bpeople\b/i, /\bauthor\b/i, /\bindividual\b/i],
      label: "Who"
    },
    { patterns: [/\bthing\b/i, /\bobject\b/i, /\bconcept\b/i, /\bwhat\b/i, /\bitem\b/i, /\bdevice\b/i], label: "What" },
    {
      patterns: [/\bplace\b/i, /\blocation\b/i, /\bwhere\b/i, /\bcity\b/i, /\bcountry\b/i, /\bregion\b/i],
      label: "Where"
    },
    {
      patterns: [/\btime\b/i, /\bdate\b/i, /\bwhen\b/i, /\byear\b/i, /\bperiod\b/i, /\bera\b/i, /\bcentury\b/i],
      label: "When"
    },
    { patterns: [/\breason\b/i, /\bcause\b/i, /\bwhy\b/i, /\bpurpose\b/i, /\bbecause\b/i, /\bmotiv/i], label: "Why" },
    {
      patterns: [/\bmethod\b/i, /\bprocess\b/i, /\bhow\b/i, /\btechnique\b/i, /\bstep\b/i, /\bprocedure\b/i],
      label: "How"
    }
  ]);

  const __MODULE_API = {
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
    POS_FOLLOW_RULES,
    QW_LABELS,
    QW_RULES
  };
  window.Dictionary_Constants = __MODULE_API;
})();
