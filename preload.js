const { contextBridge, ipcRenderer } = require("electron");
const { IPC_EVT, PRELOAD_API_CH_MAP } = require("./main/ipc-contract.js");

const PRELOAD_API_ARG_MAP = Object.freeze({
  setRuntimeLogEnabled: ([enabled]) => [Boolean(enabled)]
});

const createInvokeMethod = (channel, mapArgs) => (...args) => {
  const normalizedArgs = typeof mapArgs === "function" ? mapArgs(args) : args;
  return ipcRenderer.invoke(channel, ...(Array.isArray(normalizedArgs) ? normalizedArgs : []));
};

const dictionaryAPI = Object.keys(PRELOAD_API_CH_MAP).reduce((api, methodName) => {
  api[methodName] = createInvokeMethod(PRELOAD_API_CH_MAP[methodName], PRELOAD_API_ARG_MAP[methodName]);
  return api;
}, {
  onRuntimeLog(callback) {
    if (typeof callback !== "function") {
      return () => {};
    }
    const listener = (_event, entry) => callback(entry);
    ipcRenderer.on(IPC_EVT.RT_LOG_ENTRY, listener);
    return () => {
      ipcRenderer.removeListener(IPC_EVT.RT_LOG_ENTRY, listener);
    };
  }
});

contextBridge.exposeInMainWorld("dictionaryAPI", dictionaryAPI);
