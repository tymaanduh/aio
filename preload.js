"use strict";

const { contextBridge, ipcRenderer } = require("electron");
const { IPC_CHANNELS } = require("./main/ipc/ipc_channels.js");
const { IPC_EVENTS } = require("./main/ipc/ipc_events.js");

const API_NAMESPACE_CHANNELS = Object.freeze({
  auth: Object.freeze({
    get_auth_status: IPC_CHANNELS.AUTH_GET_STATUS,
    create_account: IPC_CHANNELS.AUTH_CREATE_ACCOUNT,
    login: IPC_CHANNELS.AUTH_LOGIN,
    logout: IPC_CHANNELS.AUTH_LOGOUT
  }),
  data: Object.freeze({
    load: IPC_CHANNELS.DICTIONARY_LOAD,
    save: IPC_CHANNELS.DICTIONARY_SAVE,
    compact: IPC_CHANNELS.DICTIONARY_COMPACT,
    lookup_definition: IPC_CHANNELS.DICTIONARY_LOOKUP_DEFINITION
  }),
  diagnostics: Object.freeze({
    load: IPC_CHANNELS.DIAGNOSTICS_LOAD,
    append: IPC_CHANNELS.DIAGNOSTICS_APPEND,
    export: IPC_CHANNELS.DIAGNOSTICS_EXPORT
  }),
  universe: Object.freeze({
    load_cache: IPC_CHANNELS.UNIVERSE_LOAD_CACHE,
    save_cache: IPC_CHANNELS.UNIVERSE_SAVE_CACHE,
    export: IPC_CHANNELS.UNIVERSE_EXPORT
  }),
  ui: Object.freeze({
    load_preferences: IPC_CHANNELS.UI_LOAD_PREFERENCES,
    save_preferences: IPC_CHANNELS.UI_SAVE_PREFERENCES
  }),
  runtime_log: Object.freeze({
    status: IPC_CHANNELS.RUNTIME_LOG_STATUS,
    set_enabled: IPC_CHANNELS.RUNTIME_LOG_SET_ENABLED,
    open_console: IPC_CHANNELS.RUNTIME_LOG_OPEN_CONSOLE,
    append: IPC_CHANNELS.RUNTIME_LOG_APPEND,
    load: IPC_CHANNELS.RUNTIME_LOG_LOAD
  }),
  gpu: Object.freeze({
    get_status: IPC_CHANNELS.GPU_GET_STATUS
  }),
  bridge: Object.freeze({
    load_state: IPC_CHANNELS.BRIDGE_LOAD_STATE,
    capture_sources: IPC_CHANNELS.BRIDGE_CAPTURE_SOURCES,
    search_keyword: IPC_CHANNELS.BRIDGE_SEARCH_KEYWORD,
    search_triad: IPC_CHANNELS.BRIDGE_SEARCH_TRIAD,
    search_glossary: IPC_CHANNELS.BRIDGE_SEARCH_GLOSSARY,
    link_entry_artifacts: IPC_CHANNELS.BRIDGE_LINK_ENTRY_ARTIFACTS
  })
});

const ARG_NORMALIZER_MAP = Object.freeze({
  "runtime_log.set_enabled": (args) => [Boolean(args[0])]
});

function create_invoke_method(channel, normalizer) {
  return (...args) => {
    const normalized_args = typeof normalizer === "function" ? normalizer(args) : args;
    return ipcRenderer.invoke(channel, ...(Array.isArray(normalized_args) ? normalized_args : []));
  };
}

function build_namespace_api() {
  return Object.keys(API_NAMESPACE_CHANNELS).reduce((namespace_api, namespace_key) => {
    const method_map = API_NAMESPACE_CHANNELS[namespace_key];
    namespace_api[namespace_key] = Object.keys(method_map).reduce((api_methods, method_key) => {
      const channel = method_map[method_key];
      const normalizer = ARG_NORMALIZER_MAP[`${namespace_key}.${method_key}`];
      api_methods[method_key] = create_invoke_method(channel, normalizer);
      return api_methods;
    }, {});
    return namespace_api;
  }, {});
}

function create_runtime_log_listener(callback) {
  if (typeof callback !== "function") {
    return () => {};
  }
  const listener = (_event, entry) => callback(entry);
  ipcRenderer.on(IPC_EVENTS.RUNTIME_LOG_ENTRY, listener);
  return () => {
    ipcRenderer.removeListener(IPC_EVENTS.RUNTIME_LOG_ENTRY, listener);
  };
}

const app_api = build_namespace_api();

app_api.on_runtime_log = create_runtime_log_listener;

// Flat compatibility shims for existing renderer logic during hard cutover.
app_api.getAuthStatus = (...args) => app_api.auth.get_auth_status(...args);
app_api.createAccount = (...args) => app_api.auth.create_account(...args);
app_api.login = (...args) => app_api.auth.login(...args);
app_api.logout = (...args) => app_api.auth.logout(...args);
app_api.load = (...args) => app_api.data.load(...args);
app_api.save = (...args) => app_api.data.save(...args);
app_api.compact = (...args) => app_api.data.compact(...args);
app_api.lookupDefinition = (...args) => app_api.data.lookup_definition(...args);
app_api.loadDiagnostics = (...args) => app_api.diagnostics.load(...args);
app_api.appendDiagnostics = (...args) => app_api.diagnostics.append(...args);
app_api.exportDiagnostics = (...args) => app_api.diagnostics.export(...args);
app_api.loadUniverseCache = (...args) => app_api.universe.load_cache(...args);
app_api.saveUniverseCache = (...args) => app_api.universe.save_cache(...args);
app_api.exportUniverse = (...args) => app_api.universe.export(...args);
app_api.loadUiPreferences = (...args) => app_api.ui.load_preferences(...args);
app_api.saveUiPreferences = (...args) => app_api.ui.save_preferences(...args);
app_api.getRuntimeLogStatus = (...args) => app_api.runtime_log.status(...args);
app_api.setRuntimeLogEnabled = (...args) => app_api.runtime_log.set_enabled(...args);
app_api.openRuntimeLogConsole = (...args) => app_api.runtime_log.open_console(...args);
app_api.appendRuntimeLog = (...args) => app_api.runtime_log.append(...args);
app_api.loadRuntimeLogs = (...args) => app_api.runtime_log.load(...args);
app_api.getGpuStatus = (...args) => app_api.gpu.get_status(...args);
app_api.loadBridgeState = (...args) => app_api.bridge.load_state(...args);
app_api.captureBridgeSources = (...args) => app_api.bridge.capture_sources(...args);
app_api.searchBridgeKeyword = (...args) => app_api.bridge.search_keyword(...args);
app_api.searchBridgeTriad = (...args) => app_api.bridge.search_triad(...args);
app_api.searchBridgeGlossary = (...args) => app_api.bridge.search_glossary(...args);
app_api.linkBridgeEntryArtifacts = (...args) => app_api.bridge.link_entry_artifacts(...args);
app_api.onRuntimeLog = (...args) => app_api.on_runtime_log(...args);

contextBridge.exposeInMainWorld("app_api", app_api);
