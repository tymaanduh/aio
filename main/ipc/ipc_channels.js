"use strict";

const PATTERN_IPC_DOMAIN = Object.freeze({
  AUTH: "auth",
  DICTIONARY: "dictionary",
  DIAGNOSTICS: "diagnostics",
  UNIVERSE: "universe",
  UI: "ui",
  RUNTIME_LOG: "runtime-log",
  GPU: "gpu"
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
  RUNTIME_LOG_STATUS: build_ipc_channel(PATTERN_IPC_DOMAIN.RUNTIME_LOG, "status"),
  RUNTIME_LOG_SET_ENABLED: build_ipc_channel(PATTERN_IPC_DOMAIN.RUNTIME_LOG, "setEnabled"),
  RUNTIME_LOG_OPEN_CONSOLE: build_ipc_channel(PATTERN_IPC_DOMAIN.RUNTIME_LOG, "openConsole"),
  RUNTIME_LOG_APPEND: build_ipc_channel(PATTERN_IPC_DOMAIN.RUNTIME_LOG, "append"),
  RUNTIME_LOG_LOAD: build_ipc_channel(PATTERN_IPC_DOMAIN.RUNTIME_LOG, "load"),
  GPU_GET_STATUS: build_ipc_channel(PATTERN_IPC_DOMAIN.GPU, "getStatus")
});

module.exports = {
  PATTERN_IPC_DOMAIN,
  build_ipc_channel,
  IPC_CHANNELS
};
