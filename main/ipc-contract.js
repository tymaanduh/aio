"use strict";

const IPC_CH = Object.freeze({
  AUTH_GET_STATUS: "auth:getStatus",
  AUTH_CREATE_ACCOUNT: "auth:createAccount",
  AUTH_LOGIN: "auth:login",
  AUTH_LOGOUT: "auth:logout",
  DICT_LOAD: "dictionary:load",
  DICT_SAVE: "dictionary:save",
  DICT_COMPACT: "dictionary:compact",
  DICT_LOOKUP_DEFINITION: "dictionary:lookupDefinition",
  DIAG_LOAD: "diagnostics:load",
  DIAG_APPEND: "diagnostics:append",
  DIAG_EXPORT: "diagnostics:export",
  UNI_LOAD_CACHE: "universe:loadCache",
  UNI_SAVE_CACHE: "universe:saveCache",
  UNI_EXPORT: "universe:export",
  UI_LOAD_PREFS: "ui:loadPreferences",
  UI_SAVE_PREFS: "ui:savePreferences",
  RT_LOG_STATUS: "runtime-log:status",
  RT_LOG_SET_ENABLED: "runtime-log:setEnabled",
  RT_LOG_OPEN_CONSOLE: "runtime-log:openConsole",
  RT_LOG_APPEND: "runtime-log:append",
  RT_LOG_LOAD: "runtime-log:load",
  GPU_GET_STATUS: "gpu:getStatus"
});

const IPC_EVT = Object.freeze({
  RT_LOG_ENTRY: "runtime-log:entry"
});

const PRELOAD_API_CH_MAP = Object.freeze({
  getAuthStatus: IPC_CH.AUTH_GET_STATUS,
  createAccount: IPC_CH.AUTH_CREATE_ACCOUNT,
  login: IPC_CH.AUTH_LOGIN,
  logout: IPC_CH.AUTH_LOGOUT,
  load: IPC_CH.DICT_LOAD,
  save: IPC_CH.DICT_SAVE,
  compact: IPC_CH.DICT_COMPACT,
  lookupDefinition: IPC_CH.DICT_LOOKUP_DEFINITION,
  loadDiagnostics: IPC_CH.DIAG_LOAD,
  appendDiagnostics: IPC_CH.DIAG_APPEND,
  exportDiagnostics: IPC_CH.DIAG_EXPORT,
  loadUniverseCache: IPC_CH.UNI_LOAD_CACHE,
  saveUniverseCache: IPC_CH.UNI_SAVE_CACHE,
  exportUniverse: IPC_CH.UNI_EXPORT,
  loadUiPreferences: IPC_CH.UI_LOAD_PREFS,
  saveUiPreferences: IPC_CH.UI_SAVE_PREFS,
  getRuntimeLogStatus: IPC_CH.RT_LOG_STATUS,
  setRuntimeLogEnabled: IPC_CH.RT_LOG_SET_ENABLED,
  openRuntimeLogConsole: IPC_CH.RT_LOG_OPEN_CONSOLE,
  appendRuntimeLog: IPC_CH.RT_LOG_APPEND,
  loadRuntimeLogs: IPC_CH.RT_LOG_LOAD,
  getGpuStatus: IPC_CH.GPU_GET_STATUS
});

module.exports = {
  IPC_CH,
  IPC_EVT,
  PRELOAD_API_CH_MAP
};
