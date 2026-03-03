const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("dictionaryAPI", {
  getAuthStatus() {
    return ipcRenderer.invoke("auth:getStatus");
  },
  createAccount(username, password) {
    return ipcRenderer.invoke("auth:createAccount", username, password);
  },
  login(username, password) {
    return ipcRenderer.invoke("auth:login", username, password);
  },
  logout() {
    return ipcRenderer.invoke("auth:logout");
  },
  load() {
    return ipcRenderer.invoke("dictionary:load");
  },
  save(state) {
    return ipcRenderer.invoke("dictionary:save", state);
  },
  compact(state) {
    return ipcRenderer.invoke("dictionary:compact", state);
  },
  lookupDefinition(word) {
    return ipcRenderer.invoke("dictionary:lookupDefinition", word);
  },
  loadDiagnostics() {
    return ipcRenderer.invoke("diagnostics:load");
  },
  appendDiagnostics(payload) {
    return ipcRenderer.invoke("diagnostics:append", payload);
  },
  exportDiagnostics() {
    return ipcRenderer.invoke("diagnostics:export");
  },
  loadUniverseCache() {
    return ipcRenderer.invoke("universe:loadCache");
  },
  saveUniverseCache(payload) {
    return ipcRenderer.invoke("universe:saveCache", payload);
  },
  exportUniverse(payload) {
    return ipcRenderer.invoke("universe:export", payload);
  },
  loadUiPreferences() {
    return ipcRenderer.invoke("ui:loadPreferences");
  },
  saveUiPreferences(payload) {
    return ipcRenderer.invoke("ui:savePreferences", payload);
  },
  getRuntimeLogStatus() {
    return ipcRenderer.invoke("runtime-log:status");
  },
  setRuntimeLogEnabled(enabled) {
    return ipcRenderer.invoke("runtime-log:setEnabled", Boolean(enabled));
  },
  openRuntimeLogConsole() {
    return ipcRenderer.invoke("runtime-log:openConsole");
  },
  appendRuntimeLog(entry) {
    return ipcRenderer.invoke("runtime-log:append", entry);
  },
  loadRuntimeLogs() {
    return ipcRenderer.invoke("runtime-log:load");
  },
  getGpuStatus() {
    return ipcRenderer.invoke("gpu:getStatus");
  },
  onRuntimeLog(callback) {
    if (typeof callback !== "function") {
      return () => {};
    }
    const listener = (_event, entry) => callback(entry);
    ipcRenderer.on("runtime-log:entry", listener);
    return () => {
      ipcRenderer.removeListener("runtime-log:entry", listener);
    };
  }
});
