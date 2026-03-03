"use strict";

const crypto = require("crypto");
const path = require("path");
const { BrowserWindow } = require("electron");
const { cleanText } = require("./normalize.js");

const RUNTIME_LOGS_MAX = 3000;

let runtimeLogsEnabled = process.env.DICTIONARY_ENABLE_REALTIME_LOGS !== "0";
let logConsoleWindow = null;
const runtimeLogBuffer = [];

function sanitizeRuntimeLogEntry(rawEntry) {
  const source = rawEntry && typeof rawEntry === "object" ? rawEntry : {};
  const levelRaw = cleanText(source.level, 20).toLowerCase();
  const level = levelRaw === "error" || levelRaw === "warn" || levelRaw === "debug" ? levelRaw : "info";
  const message = cleanText(source.message, 1200);
  if (!message) {
    return null;
  }
  return {
    id: crypto.randomUUID(),
    at: cleanText(source.at, 80) || new Date().toISOString(),
    level,
    source: cleanText(source.source, 80) || "app",
    message,
    context: cleanText(source.context, 1000)
  };
}

function broadcastRuntimeLog(entry) {
  if (!entry || !logConsoleWindow || logConsoleWindow.isDestroyed()) {
    return;
  }
  logConsoleWindow.webContents.send("runtime-log:entry", entry);
}

function appendRuntimeLog(entry) {
  if (!runtimeLogsEnabled) {
    return {
      ok: false,
      enabled: false
    };
  }
  const normalized = sanitizeRuntimeLogEntry(entry);
  if (!normalized) {
    return {
      ok: false,
      enabled: true
    };
  }
  runtimeLogBuffer.push(normalized);
  if (runtimeLogBuffer.length > RUNTIME_LOGS_MAX) {
    runtimeLogBuffer.splice(0, runtimeLogBuffer.length - RUNTIME_LOGS_MAX);
  }
  broadcastRuntimeLog(normalized);
  return {
    ok: true,
    enabled: true,
    count: runtimeLogBuffer.length
  };
}

function getRuntimeLogStatus() {
  return {
    enabled: runtimeLogsEnabled,
    count: runtimeLogBuffer.length
  };
}

function setRuntimeLogsEnabled(rawEnabled) {
  runtimeLogsEnabled = Boolean(rawEnabled);
  return getRuntimeLogStatus();
}

function isRuntimeLogsEnabled() {
  return runtimeLogsEnabled;
}

function getRuntimeLogBuffer() {
  return runtimeLogBuffer;
}

function createLogConsoleWindow() {
  if (!runtimeLogsEnabled) {
    return null;
  }
  if (logConsoleWindow && !logConsoleWindow.isDestroyed()) {
    logConsoleWindow.focus();
    return logConsoleWindow;
  }
  const isWindows = process.platform === "win32";
  logConsoleWindow = new BrowserWindow({
    width: 980,
    height: 620,
    minWidth: 760,
    minHeight: 420,
    title: "Dictionary Runtime Console",
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
      preload: path.join(__dirname, "..", "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      devTools: true
    }
  });

  logConsoleWindow.loadFile(path.join(__dirname, "..", "app", "logs.html"));
  logConsoleWindow.on("closed", () => {
    logConsoleWindow = null;
  });
  return logConsoleWindow;
}

module.exports = {
  appendRuntimeLog,
  getRuntimeLogStatus,
  setRuntimeLogsEnabled,
  isRuntimeLogsEnabled,
  getRuntimeLogBuffer,
  createLogConsoleWindow
};
