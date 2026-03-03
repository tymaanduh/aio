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
const { compactState } = require("./main/data-io.js");
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
const {
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

// Must run before app.whenReady() to set GPU switches
configureGpuMode();

// Wire auth module to data-io (avoids circular require)
injectDataIo({ loadAuthState, saveAuthState });

function createWindow() {
  const isWindows = process.platform === "win32";
  const window = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 650,
    show: false,
    backgroundColor: "#0b1114",
    titleBarStyle: isWindows ? "hidden" : undefined,
    titleBarOverlay: isWindows
      ? {
          color: "#0b1114",
          symbolColor: "#d5fbff",
          height: 34
        }
      : false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: true,
      allowRunningInsecureContent: false,
      spellcheck: false,
      backgroundThrottling: true
    }
  });

  window.once("ready-to-show", () => {
    if (!window.isDestroyed()) {
      window.show();
    }
  });

  window.loadFile(path.join(__dirname, "app", "index.html"));
  appendRuntimeLog({
    level: "info",
    source: "main",
    message: "Main window created.",
    context: "createWindow"
  });
}

app.whenReady().then(async () => {
  nativeTheme.themeSource = "dark";
  await ensureDataFile();
  await ensureAuthFile();
  await ensureDiagnosticsFile();
  await ensureUniverseCacheFile();
  await ensureUiPreferencesFile();

  // Auth IPC
  ipcMain.handle("auth:getStatus", async () => getAuthStatus());
  ipcMain.handle("auth:createAccount", async (_event, username, password) => createAccount(username, password));
  ipcMain.handle("auth:login", async (_event, username, password) => login(username, password));
  ipcMain.handle("auth:logout", async () => logout());

  // Dictionary IPC
  ipcMain.handle("dictionary:load", async () => {
    ensureAuthenticated();
    return loadState();
  });
  ipcMain.handle("dictionary:save", async (_event, payload) => {
    ensureAuthenticated();
    return saveState(payload);
  });
  ipcMain.handle("dictionary:lookupDefinition", async (_event, word) => {
    ensureAuthenticated();
    return lookupDefinitionOnline(word);
  });
  ipcMain.handle("dictionary:compact", async (_event, payload) => {
    ensureAuthenticated();
    return compactState(payload);
  });

  // Diagnostics IPC
  ipcMain.handle("diagnostics:load", async () => {
    ensureAuthenticated();
    return loadDiagnosticsState();
  });
  ipcMain.handle("diagnostics:append", async (_event, payload) => {
    ensureAuthenticated();
    return appendDiagnostics(payload);
  });
  ipcMain.handle("diagnostics:export", async () => {
    ensureAuthenticated();
    return exportDiagnostics();
  });

  // Universe IPC
  ipcMain.handle("universe:loadCache", async () => {
    ensureAuthenticated();
    return loadUniverseCacheState();
  });
  ipcMain.handle("universe:saveCache", async (_event, payload) => {
    ensureAuthenticated();
    return saveUniverseCacheState(payload);
  });
  ipcMain.handle("universe:export", async (_event, payload) => {
    ensureAuthenticated();
    return exportUniverse(payload);
  });

  // UI Preferences IPC
  ipcMain.handle("ui:loadPreferences", async () => loadUiPreferencesState());
  ipcMain.handle("ui:savePreferences", async (_event, payload) => saveUiPreferencesState(payload));

  // Runtime Log IPC
  ipcMain.handle("runtime-log:status", async () => getRuntimeLogStatus());
  ipcMain.handle("runtime-log:setEnabled", async (_event, enabled) => setRuntimeLogsEnabled(enabled));
  ipcMain.handle("runtime-log:openConsole", async () => {
    const win = createLogConsoleWindow();
    return {
      ok: Boolean(win),
      enabled: isRuntimeLogsEnabled()
    };
  });
  ipcMain.handle("runtime-log:append", async (_event, payload) => appendRuntimeLog(payload));
  ipcMain.handle("runtime-log:load", async () => ({
    enabled: isRuntimeLogsEnabled(),
    entries: getRuntimeLogBuffer().slice(-1000)
  }));

  // GPU IPC
  ipcMain.handle("gpu:getStatus", async () => {
    ensureAuthenticated();
    return getGpuDiagnostics();
  });

  createWindow();
  if (process.env.DICTIONARY_OPEN_LOG_CONSOLE === "1") {
    createLogConsoleWindow();
  }

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
  const gpuState = getGpuState();
  if (!gpuState.GPU_AUTO_RECOVER_ENABLED) {
    return;
  }
  if (gpuState.effectiveGpuMode === gpuState.GPU_MODE_OFF) {
    return;
  }
  if (crashCount < 2) {
    return;
  }
  if (process.env.DICTIONARY_GPU_RECOVERED === "1") {
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
});

process.on("uncaughtException", (error) => {
  appendRuntimeLog({
    level: "error",
    source: "main",
    message: "Uncaught exception in main process.",
    context: cleanText(String(error?.stack || error?.message || error), 1000)
  });
});

process.on("unhandledRejection", (reason) => {
  appendRuntimeLog({
    level: "error",
    source: "main",
    message: "Unhandled promise rejection in main process.",
    context: cleanText(String(reason?.stack || reason?.message || reason), 1000)
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
