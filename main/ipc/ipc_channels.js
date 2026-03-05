"use strict";

const PATTERN_IPC_DOMAIN = Object.freeze({
  AUTH: "auth",
  DICTIONARY: "dictionary",
  DIAGNOSTICS: "diagnostics",
  UNIVERSE: "universe",
  UI: "ui",
  WINDOW: "window",
  RUNTIME_LOG: "runtime-log",
  GPU: "gpu",
  BRIDGE: "bridge"
});

function build_ipc_channel(domain, action) {
  return `${domain}:${action}`;
}

const IPC_CHANNELS = Object.freeze({
  AUTH_GET_STATUS: build_ipc_channel(PATTERN_IPC_DOMAIN.AUTH, "getStatus"),
  AUTH_CREATE_ACCOUNT: build_ipc_channel(PATTERN_IPC_DOMAIN.AUTH, "createAccount"),
  AUTH_LOGIN: build_ipc_channel(PATTERN_IPC_DOMAIN.AUTH, "login"),
  AUTH_LOGOUT: build_ipc_channel(PATTERN_IPC_DOMAIN.AUTH, "logout"),
  DICTIONARY_LOAD: build_ipc_channel(PATTERN_IPC_DOMAIN.DICTIONARY, "load"),
  DICTIONARY_SAVE: build_ipc_channel(PATTERN_IPC_DOMAIN.DICTIONARY, "save"),
  DICTIONARY_COMPACT: build_ipc_channel(PATTERN_IPC_DOMAIN.DICTIONARY, "compact"),
  DICTIONARY_LOOKUP_DEFINITION: build_ipc_channel(PATTERN_IPC_DOMAIN.DICTIONARY, "lookupDefinition"),
  DIAGNOSTICS_LOAD: build_ipc_channel(PATTERN_IPC_DOMAIN.DIAGNOSTICS, "load"),
  DIAGNOSTICS_APPEND: build_ipc_channel(PATTERN_IPC_DOMAIN.DIAGNOSTICS, "append"),
  DIAGNOSTICS_EXPORT: build_ipc_channel(PATTERN_IPC_DOMAIN.DIAGNOSTICS, "export"),
  UNIVERSE_LOAD_CACHE: build_ipc_channel(PATTERN_IPC_DOMAIN.UNIVERSE, "loadCache"),
  UNIVERSE_SAVE_CACHE: build_ipc_channel(PATTERN_IPC_DOMAIN.UNIVERSE, "saveCache"),
  UNIVERSE_EXPORT: build_ipc_channel(PATTERN_IPC_DOMAIN.UNIVERSE, "export"),
  UI_LOAD_PREFERENCES: build_ipc_channel(PATTERN_IPC_DOMAIN.UI, "loadPreferences"),
  UI_SAVE_PREFERENCES: build_ipc_channel(PATTERN_IPC_DOMAIN.UI, "savePreferences"),
  WINDOW_MINIMIZE: build_ipc_channel(PATTERN_IPC_DOMAIN.WINDOW, "minimize"),
  WINDOW_TOGGLE_MAXIMIZE: build_ipc_channel(PATTERN_IPC_DOMAIN.WINDOW, "toggleMaximize"),
  WINDOW_CLOSE: build_ipc_channel(PATTERN_IPC_DOMAIN.WINDOW, "close"),
  WINDOW_IS_MAXIMIZED: build_ipc_channel(PATTERN_IPC_DOMAIN.WINDOW, "isMaximized"),
  RUNTIME_LOG_STATUS: build_ipc_channel(PATTERN_IPC_DOMAIN.RUNTIME_LOG, "status"),
  RUNTIME_LOG_SET_ENABLED: build_ipc_channel(PATTERN_IPC_DOMAIN.RUNTIME_LOG, "setEnabled"),
  RUNTIME_LOG_OPEN_CONSOLE: build_ipc_channel(PATTERN_IPC_DOMAIN.RUNTIME_LOG, "openConsole"),
  RUNTIME_LOG_APPEND: build_ipc_channel(PATTERN_IPC_DOMAIN.RUNTIME_LOG, "append"),
  RUNTIME_LOG_LOAD: build_ipc_channel(PATTERN_IPC_DOMAIN.RUNTIME_LOG, "load"),
  GPU_GET_STATUS: build_ipc_channel(PATTERN_IPC_DOMAIN.GPU, "getStatus"),
  BRIDGE_LOAD_STATE: build_ipc_channel(PATTERN_IPC_DOMAIN.BRIDGE, "loadState"),
  BRIDGE_CAPTURE_SOURCES: build_ipc_channel(PATTERN_IPC_DOMAIN.BRIDGE, "captureSources"),
  BRIDGE_COMPILE_MACHINE_DESCRIPTORS: build_ipc_channel(PATTERN_IPC_DOMAIN.BRIDGE, "compileMachineDescriptors"),
  BRIDGE_SEARCH_KEYWORD: build_ipc_channel(PATTERN_IPC_DOMAIN.BRIDGE, "searchKeyword"),
  BRIDGE_SEARCH_TRIAD: build_ipc_channel(PATTERN_IPC_DOMAIN.BRIDGE, "searchTriad"),
  BRIDGE_SEARCH_GLOSSARY: build_ipc_channel(PATTERN_IPC_DOMAIN.BRIDGE, "searchGlossary"),
  BRIDGE_SEARCH_MACHINE_DESCRIPTOR: build_ipc_channel(PATTERN_IPC_DOMAIN.BRIDGE, "searchMachineDescriptor"),
  BRIDGE_LINK_ENTRY_ARTIFACTS: build_ipc_channel(PATTERN_IPC_DOMAIN.BRIDGE, "linkEntryArtifacts")
});

module.exports = {
  PATTERN_IPC_DOMAIN,
  build_ipc_channel,
  IPC_CHANNELS
};
