export const TEXT_TERM = Object.freeze({
  APP: "app",
  BOOT: "boot",
  BOOTSTRAP: "bootstrap",
  PRE_LOAD: "pre_load",
  POST_LOAD: "post_load",
  WINDOW: "window",
  WINDOWS: "windows",
  PAGE: "page",
  CONTROL: "control",
  SHELL: "shell",
  HOOK: "hook",
  VIEWS: "views",
  RENDERER: "renderer",
  MAIN_WINDOW: "main_window",
  LOGS_WINDOW: "logs_window",
  WORKBENCH_PAGE: "workbench_page",
  SENTENCE_GRAPH_PAGE: "sentence_graph_page",
  STATISTICS_PAGE: "statistics_page",
  UNIVERSE_PAGE: "universe_page",
  TREE_CONTROL: "tree_control",
  GRAPH_CONTROL: "graph_control",
  UNIVERSE_CANVAS_CONTROL: "universe_canvas_control",
  COMMAND_PALETTE_CONTROL: "command_palette_control",
  APP_API: "app_api",
  AUTH: "auth",
  LOGIN: "login",
  CREATE_ACCOUNT: "createAccount",
  DATA: "data",
  SAVE: "save",
  RUNTIME_LOG: "runtime_log",
  DOCUMENT: "document",
  TREE: "tree",
  SENTENCE: "sentence",
  UNIVERSE: "universe",
  DICTIONARY: "dictionary",
  GET_TREE: "get_tree",
  GET_ARGUMENTS: "get_arguments",
  GET_LOGIN_ARGUMENTS: "get_login_arguments",
  SEARCH: "search",
  GET_NODE: "getNode",
  POST_MESSAGE: "postMessage",
  LOAD_CACHE: "loadCache",
  SAVE_CACHE: "saveCache",
  GET_ENTRIES_INDEX: "getEntriesIndex",
  REQ_RENDER: "reqRender",
  RENDER_SUMMARY: "renderSummary",
  RENDER_CLUSTER: "renderCluster",
  AUTH_FORM: "authForm",
  AUTH_GATE: "auth_gate",
  WORD_INPUT: "wordInput",
  DEFINITION_INPUT: "definitionInput",
  GRAPH_CANVAS: "graphCanvas",
  STATS_WORKER: "stats_worker",
  DICTIONARY_STATS_WORKER: "Dictionary_Stats_Worker",
  DICTIONARY_UNIVERSE_GRAPHICS_ENGINE: "Dictionary_Universe_Graphics_Engine",
  STATS_WORKER_TASK: "statsWorkerTask",
  CMD_ITEMS: "cmdItems",
  CMD_INDEX: "cmdIdx",
  ENTRY: "entry",
  ENTRIES: "entries",
  LABELS: "labels",
  SELECTED_ENTRY_ID: "selectedEntryId",
  SELECTED_GRAPH_NODE_ID: "selectedGraphNodeId",
  GRAPH_LOCK_ENABLED: "graphLockEnabled",
  TREE_SEARCH: "treeSearch",
  TREE_LABEL_FILTER: "treeLabelFilter",
  AUTH_MODE: "authMode",
  AUTH_USERNAME_INPUT: "authUsernameInput",
  AUTH_PASSWORD_INPUT: "authPasswordInput",
  VALUE: "value",
  LENGTH: "length",
  WINDOW_SCOPE: "window_scope",
  ARGUMENT: "argument",
  UTILITY: "util",
  RUNTIME_GROUP_REGISTRY: "RUNTIME_GROUP_REGISTRY",
  LOAD_HOOK_REGISTRY: "load_hook_registry",
  HOOK_TRACE: "hook_trace",
  RENDERER_LOAD_HOOK_CTX: "renderer_load_hook_ctx",
  APP_LOAD_HOOK: "app_load_hook",
  GROUP_APP: "G_APP",
  GROUP_RT: "G_RT",
  GROUP_PAGE: "G_PAGE",
  GROUP_DOM: "G_DOM",
  GROUP_UNI: "G_UNI",
  GROUP_UNI_FX: "G_UNI_FX",
  SELECTED_ENTRY_IDS: "selectedEntryIds",
  EXPANDED_GROUPS: "expandedGroups",
  SENTENCE_GRAPH: "sentenceGraph",
  NODES: "nodes",
  LINKS: "links",
  SELECTION: "sel",
  PATH: "path",
  CONFIG: "cfg",
  CANVAS: "canvas",
  VIEW: "view",
  MAX_NODES: "maxNodes",
  ZOOM: "zoom",
  STATE_SLOT: "s",
  TREE_VIEW: "treeView",
  STATS_LIST: "statsList",
  UNIVERSE_FILTER_INPUT: "universeFilterInput",
  COMMAND_PALETTE_INPUT: "commandPaletteInput",
  COMMAND_PALETTE_LIST: "commandPaletteList",
  AUTH_MODE_ARG: "auth_mode",
  AUTH_USERNAME_ARG: "auth_username",
  AUTH_PASSWORD_ARG: "auth_password",
  SELECTED_ENTRY_ID_ARG: "selected_entry_id",
  SELECTED_GRAPH_NODE_ID_ARG: "selected_graph_node_id",
  STATS_ENTRY_COUNT_ARG: "stats_entry_count",
  UNIVERSE_FILTER_TEXT_ARG: "universe_filter_text",
  UNIVERSE_MAX_NODES_ARG: "universe_max_nodes",
  TREE_SEARCH_ARG: "tree_search",
  TREE_LABEL_FILTER_ARG: "tree_label_filter",
  GRAPH_LOCK_ENABLED_ARG: "graph_lock_enabled",
  UNIVERSE_ZOOM_ARG: "universe_zoom",
  COMMAND_PALETTE_QUERY_ARG: "command_palette_query"
});

export const TEXT_DESC = Object.freeze({
  WINDOW_SCOPE:
    "Renderer window scope key.",
  CURRENT_WINDOW_SCOPE:
    "Current renderer window scope.",
  AUTH_MODE:
    "Login/create mode selector for auth gate.",
  AUTH_USERNAME:
    "Login username input value.",
  AUTH_PASSWORD:
    "Login password input value.",
  SELECTED_ENTRY_ID:
    "Selected entry id used by entry commands.",
  SELECTED_GRAPH_NODE_ID:
    "Active graph node id.",
  STATS_ENTRY_COUNT:
    "Entry count for statistics updates.",
  UNIVERSE_FILTER_TEXT:
    "Universe graph filter input.",
  UNIVERSE_MAX_NODES:
    "Universe max node budget.",
  TREE_SEARCH:
    "Current lexicon explorer search query.",
  TREE_LABEL_FILTER:
    "Current tree label filter.",
  GRAPH_LOCK_ENABLED:
    "Sentence graph lock toggle.",
  UNIVERSE_ZOOM:
    "Current universe zoom value.",
  COMMAND_PALETTE_QUERY:
    "Command palette search text."
});

function clean_text(value, fallback = "", max_length = 220) {
  if (typeof value !== "string") {
    return fallback;
  }
  const cleaned = value.trim().slice(0, max_length);
  return cleaned || fallback;
}

function normalize_key(value) {
  return clean_text(value, "", 140).toUpperCase();
}

function normalize_token(token_or_key) {
  const key = normalize_key(token_or_key);
  return TEXT_TERM[key] || clean_text(token_or_key, "", 220);
}

function unique_text_list(values) {
  const output = [];
  const seen = new Set();
  (Array.isArray(values) ? values : []).forEach((value) => {
    const item = clean_text(value, "", 220);
    if (!item || seen.has(item)) {
      return;
    }
    seen.add(item);
    output.push(item);
  });
  return output;
}

function to_hook_key_token(token_or_key) {
  return normalize_token(token_or_key)
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toUpperCase();
}

export function text_token(token_or_key, fallback = "") {
  return normalize_token(token_or_key) || clean_text(fallback, "", 220);
}

export function text_desc(desc_key, fallback = "") {
  const key = normalize_key(desc_key);
  return TEXT_DESC[key] || clean_text(fallback, "", 280);
}

export function text_join(tokens = [], delimiter = " ") {
  const source = Array.isArray(tokens) ? tokens : [tokens];
  const parts = source.map((token) => normalize_token(token)).filter(Boolean);
  return parts.join(String(delimiter || " "));
}

export function text_path(...tokens) {
  return text_join(tokens, ".");
}

export function text_path_list(rows = []) {
  return unique_text_list(
    (Array.isArray(rows) ? rows : []).map((entry) =>
      Array.isArray(entry) ? text_path(...entry) : normalize_token(entry)
    )
  );
}

export function text_list(...tokens) {
  return unique_text_list(tokens.map((token) => normalize_token(token)));
}

export function text_tags(...tokens) {
  return unique_text_list(tokens.map((token) => normalize_token(token).toLowerCase()));
}

export function text_hook_key(...tokens) {
  return unique_text_list(tokens.map((token) => to_hook_key_token(token))).join("_");
}
