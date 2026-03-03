const path = require("path");
const electron = require("electron");

if (!electron || typeof electron !== "object") {
  // Fail fast with a clear message when launched in a plain Node runtime.
  console.error(
    "Electron APIs are unavailable. Launch this app with Electron (use Windows shell if running from WSL)."
  );
  process.exit(1);
}

const { app, BrowserWindow, ipcMain, nativeTheme } = electron;

if (!app || typeof app.whenReady !== "function") {
  console.error("Electron app lifecycle is unavailable in this runtime.");
  process.exit(1);
}

const { configureGpuMode, getGpuDiagnostics, incrementGpuCrashCount, getGpuState } = require("./main/gpu-config.js");
const { cleanText } = require("./main/normalize.js");
const {
  compactState,
  ensureDataFile,
  ensureAuthFile,
  ensureDiagnosticsFile,
  ensureUniverseCacheFile,
  ensureUiPreferencesFile,
  loadState,
  saveState,
  loadAuthState,
  saveAuthState,
  loadDiagnosticsState,
  appendDiagnostics,
  exportDiagnostics,
  loadUniverseCacheState,
  saveUniverseCacheState,
  loadUiPreferencesState,
  saveUiPreferencesState,
  exportUniverse
} = require("./main/data-io.js");
const {
  appendRuntimeLog,
  getRuntimeLogStatus,
  setRuntimeLogsEnabled,
  isRuntimeLogsEnabled,
  getRuntimeLogBuffer,
  createLogConsoleWindow
} = require("./main/runtime-log.js");
const {
  injectDataIo,
  ensureAuthenticated,
  getAuthStatus,
  createAccount,
  login,
  logout,
  lookupDefinitionOnline
} = require("./main/auth.js");
const { IPC_CH } = require("./main/ipc-contract.js");

const PATHS = Object.freeze({
  PRELOAD: path.join(__dirname, "preload.js"),
  INDEX_HTML: path.join(__dirname, "app", "index.html")
});

const WIN_STYLE = Object.freeze({
  base: Object.freeze({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 650,
    show: false,
    backgroundColor: "#0b1114",
    autoHideMenuBar: true
  }),
  overlay: Object.freeze({
    color: "#0b1114",
    symbolColor: "#d5fbff",
    height: 34
  }),
  webPrefs: Object.freeze({
    contextIsolation: true,
    nodeIntegration: false,
    webSecurity: true,
    allowRunningInsecureContent: false,
    spellcheck: false,
    backgroundThrottling: true
  })
});

const registerIpcGroup = (handlers, options = {}) => {
  const requiresAuth = options.requiresAuth === true;
  Object.entries(handlers).forEach(([channel, handler]) => {
    ipcMain.handle(channel, async (_event, ...args) => {
      if (requiresAuth) {
        ensureAuthenticated();
      }
      return handler(...args);
    });
  });
};

const IPC_HANDLERS_OPEN = Object.freeze({
  [IPC_CH.AUTH_GET_STATUS]: () => getAuthStatus(),
  [IPC_CH.AUTH_CREATE_ACCOUNT]: (username, password) => createAccount(username, password),
  [IPC_CH.AUTH_LOGIN]: (username, password) => login(username, password),
  [IPC_CH.AUTH_LOGOUT]: () => logout(),
  [IPC_CH.UI_LOAD_PREFS]: () => loadUiPreferencesState(),
  [IPC_CH.UI_SAVE_PREFS]: (payload) => saveUiPreferencesState(payload),
  [IPC_CH.RT_LOG_STATUS]: () => getRuntimeLogStatus(),
  [IPC_CH.RT_LOG_SET_ENABLED]: (enabled) => setRuntimeLogsEnabled(enabled),
  [IPC_CH.RT_LOG_OPEN_CONSOLE]: () => {
    const win = createLogConsoleWindow();
    return {
      ok: Boolean(win),
      enabled: isRuntimeLogsEnabled()
    };
  },
  [IPC_CH.RT_LOG_APPEND]: (payload) => appendRuntimeLog(payload),
  [IPC_CH.RT_LOG_LOAD]: () => ({
    enabled: isRuntimeLogsEnabled(),
    entries: getRuntimeLogBuffer().slice(-1000)
  })
});

const IPC_HANDLERS_AUTH = Object.freeze({
  [IPC_CH.DICT_LOAD]: () => loadState(),
  [IPC_CH.DICT_SAVE]: (payload) => saveState(payload),
  [IPC_CH.DICT_LOOKUP_DEFINITION]: (word) => lookupDefinitionOnline(word),
  [IPC_CH.DICT_COMPACT]: (payload) => compactState(payload),
  [IPC_CH.DIAG_LOAD]: () => loadDiagnosticsState(),
  [IPC_CH.DIAG_APPEND]: (payload) => appendDiagnostics(payload),
  [IPC_CH.DIAG_EXPORT]: () => exportDiagnostics(),
  [IPC_CH.UNI_LOAD_CACHE]: () => loadUniverseCacheState(),
  [IPC_CH.UNI_SAVE_CACHE]: (payload) => saveUniverseCacheState(payload),
  [IPC_CH.UNI_EXPORT]: (payload) => exportUniverse(payload),
  [IPC_CH.GPU_GET_STATUS]: () => getGpuDiagnostics()
});

const toErrorContext = (value, maxLength = 1000) => cleanText(String(value?.stack || value?.message || value), maxLength);

const logMainError = (message, reason) => {
  appendRuntimeLog({
    level: "error",
    source: "main",
    message,
    context: toErrorContext(reason)
  });
};

const ensureAppFiles = async () => {
  await ensureDataFile();
  await ensureAuthFile();
  await ensureDiagnosticsFile();
  await ensureUniverseCacheFile();
  await ensureUiPreferencesFile();
};

const openLogConsoleIfRequested = () => {
  if (process.env.DICTIONARY_OPEN_LOG_CONSOLE === "1") {
    createLogConsoleWindow();
  }
};

const buildMainWindowOptions = () => {
  const isWindows = process.platform === "win32";
  return {
    ...WIN_STYLE.base,
    titleBarStyle: isWindows ? "hidden" : undefined,
    titleBarOverlay: isWindows ? WIN_STYLE.overlay : false,
    webPreferences: {
      ...WIN_STYLE.webPrefs,
      preload: PATHS.PRELOAD
    }
  };
};

function createWindow() {
  const win = new BrowserWindow(buildMainWindowOptions());

  win.once("ready-to-show", () => {
    if (!win.isDestroyed()) {
      win.show();
    }
  });

  win.loadFile(PATHS.INDEX_HTML);
  appendRuntimeLog({
    level: "info",
    source: "main",
    message: "Main window created.",
    context: "createWindow"
  });
}

const logAppReadyDiagnostics = () => {
  const gpuState = getGpuState();
  appendRuntimeLog({
    level: "info",
    source: "main",
    message: "Application ready.",
    context: "app.whenReady"
  });
  appendRuntimeLog({
    level: "info",
    source: "gpu",
    message: `GPU mode: ${gpuState.effectiveGpuMode} | ANGLE: ${gpuState.effectiveAngleBackend || "default"} | GL: ${gpuState.effectiveGlImplementation || "default"}`,
    context: JSON.stringify({
      switches: gpuState.gpuSwitchesApplied,
      featureStatus: app.getGPUFeatureStatus()
    })
  });
};

const maybeRecoverFromGpuCrash = (crashCount, gpuState) => {
  const shouldRecover =
    gpuState.GPU_AUTO_RECOVER_ENABLED &&
    gpuState.effectiveGpuMode !== gpuState.GPU_MODE_OFF &&
    crashCount >= 2 &&
    process.env.DICTIONARY_GPU_RECOVERED !== "1";

  if (!shouldRecover) {
    return;
  }

  appendRuntimeLog({
    level: "warn",
    source: "gpu",
    message: "GPU instability detected. Relaunching in safe mode (GPU off).",
    context: "auto-recover"
  });
  app.relaunch({
    args: process.argv.slice(1),
    env: {
      ...process.env,
      DICTIONARY_GPU_MODE: "off",
      DICTIONARY_GPU_RECOVERED: "1"
    }
  });
  app.exit(0);
};

// Must run before app.whenReady() to set GPU switches
configureGpuMode();

// Wire auth module to data-io (avoids circular require)
injectDataIo({ loadAuthState, saveAuthState });

app.whenReady().then(async () => {
  nativeTheme.themeSource = "dark";
  await ensureAppFiles();

  registerIpcGroup(IPC_HANDLERS_OPEN);
  registerIpcGroup(IPC_HANDLERS_AUTH, { requiresAuth: true });

  createWindow();
  openLogConsoleIfRequested();
  logAppReadyDiagnostics();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("child-process-gone", (_event, details) => {
  if (details?.type !== "GPU") {
    return;
  }

  const crashCount = incrementGpuCrashCount();
  appendRuntimeLog({
    level: "warn",
    source: "gpu",
    message: "GPU process exited.",
    context: cleanText(JSON.stringify(details), 900)
  });

  maybeRecoverFromGpuCrash(crashCount, getGpuState());
});

process.on("uncaughtException", (error) => {
  logMainError("Uncaught exception in main process.", error);
});

process.on("unhandledRejection", (reason) => {
  logMainError("Unhandled promise rejection in main process.", reason);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
