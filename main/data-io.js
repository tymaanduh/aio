"use strict";

const fs = require("fs/promises");
const path = require("path");
const { app } = require("electron");
const { createDefaultUiPreferences, normalizeUiPreferences } = require("../app/modules/ui-preferences-utils.js");
const {
  cleanText,
  createDefaultState,
  createDefaultAuthState,
  createDefaultDiagnosticsState,
  createDefaultUniverseCacheState,
  normalizeState,
  normalizeDiagnosticsState,
  normalizeAuthState,
  normalizeUniverseCacheState,
  compactState
} = require("./normalize.js");

const STORE_FILE = "dictionary-data.json";
const AUTH_FILE = "dictionary-auth.json";
const DIAGNOSTICS_FILE = "diagnostics.json";
const UNIVERSE_CACHE_FILE = "universe-cache.json";
const UI_PREFERENCES_FILE = "ui-preferences.json";

let dataFilePath = "";
let authFilePath = "";
let diagnosticsFilePath = "";
let universeCacheFilePath = "";
let uiPreferencesFilePath = "";

async function writeJsonAtomic(filePath, data) {
  const temporaryFile = `${filePath}.tmp`;
  await fs.writeFile(temporaryFile, JSON.stringify(data, null, 2), "utf8");
  await fs.rename(temporaryFile, filePath);
}

async function ensureDataFile() {
  const userDataDir = app.getPath("userData");
  dataFilePath = path.join(userDataDir, STORE_FILE);

  try {
    await fs.access(dataFilePath);
  } catch {
    const initialState = JSON.stringify(createDefaultState(), null, 2);
    await fs.writeFile(dataFilePath, initialState, "utf8");
  }
}

async function ensureAuthFile() {
  const userDataDir = app.getPath("userData");
  authFilePath = path.join(userDataDir, AUTH_FILE);

  try {
    await fs.access(authFilePath);
  } catch {
    const initialState = JSON.stringify(createDefaultAuthState(), null, 2);
    await fs.writeFile(authFilePath, initialState, "utf8");
  }
}

async function ensureDiagnosticsFile() {
  const userDataDir = app.getPath("userData");
  diagnosticsFilePath = path.join(userDataDir, DIAGNOSTICS_FILE);

  try {
    await fs.access(diagnosticsFilePath);
  } catch {
    const initialState = JSON.stringify(createDefaultDiagnosticsState(), null, 2);
    await fs.writeFile(diagnosticsFilePath, initialState, "utf8");
  }
}

async function ensureUniverseCacheFile() {
  const userDataDir = app.getPath("userData");
  universeCacheFilePath = path.join(userDataDir, UNIVERSE_CACHE_FILE);

  try {
    await fs.access(universeCacheFilePath);
  } catch {
    const initialState = JSON.stringify(createDefaultUniverseCacheState(), null, 2);
    await fs.writeFile(universeCacheFilePath, initialState, "utf8");
  }
}

async function ensureUiPreferencesFile() {
  const userDataDir = app.getPath("userData");
  uiPreferencesFilePath = path.join(userDataDir, UI_PREFERENCES_FILE);

  try {
    await fs.access(uiPreferencesFilePath);
  } catch {
    const initialState = JSON.stringify(createDefaultUiPreferences(), null, 2);
    await fs.writeFile(uiPreferencesFilePath, initialState, "utf8");
  }
}

async function loadState() {
  await ensureDataFile();

  try {
    const content = await fs.readFile(dataFilePath, "utf8");
    return normalizeState(JSON.parse(content));
  } catch {
    const fallback = createDefaultState();
    await fs.writeFile(dataFilePath, JSON.stringify(fallback, null, 2), "utf8");
    return fallback;
  }
}

async function saveState(payload) {
  await ensureDataFile();

  const normalized = normalizeState(payload);
  normalized.lastSavedAt = new Date().toISOString();

  await writeJsonAtomic(dataFilePath, normalized);

  return normalized;
}

async function loadAuthState() {
  await ensureAuthFile();

  try {
    const content = await fs.readFile(authFilePath, "utf8");
    return normalizeAuthState(JSON.parse(content));
  } catch {
    const fallback = createDefaultAuthState();
    await fs.writeFile(authFilePath, JSON.stringify(fallback, null, 2), "utf8");
    return fallback;
  }
}

async function saveAuthState(payload) {
  await ensureAuthFile();
  const normalized = normalizeAuthState(payload);
  await writeJsonAtomic(authFilePath, normalized);
  return normalized;
}

async function loadDiagnosticsState() {
  await ensureDiagnosticsFile();
  try {
    const content = await fs.readFile(diagnosticsFilePath, "utf8");
    return normalizeDiagnosticsState(JSON.parse(content));
  } catch {
    const fallback = createDefaultDiagnosticsState();
    await fs.writeFile(diagnosticsFilePath, JSON.stringify(fallback, null, 2), "utf8");
    return fallback;
  }
}

async function saveDiagnosticsState(payload) {
  await ensureDiagnosticsFile();
  const normalized = normalizeDiagnosticsState(payload);
  await writeJsonAtomic(diagnosticsFilePath, normalized);
  return normalized;
}

async function loadUniverseCacheState() {
  await ensureUniverseCacheFile();
  try {
    const content = await fs.readFile(universeCacheFilePath, "utf8");
    return normalizeUniverseCacheState(JSON.parse(content));
  } catch {
    const fallback = createDefaultUniverseCacheState();
    await fs.writeFile(universeCacheFilePath, JSON.stringify(fallback, null, 2), "utf8");
    return fallback;
  }
}

async function saveUniverseCacheState(payload) {
  await ensureUniverseCacheFile();
  const normalized = normalizeUniverseCacheState(payload);
  normalized.updatedAt = new Date().toISOString();
  await writeJsonAtomic(universeCacheFilePath, normalized);
  return normalized;
}

async function loadUiPreferencesState() {
  await ensureUiPreferencesFile();
  try {
    const content = await fs.readFile(uiPreferencesFilePath, "utf8");
    return normalizeUiPreferences(JSON.parse(content));
  } catch {
    const fallback = createDefaultUiPreferences();
    await fs.writeFile(uiPreferencesFilePath, JSON.stringify(fallback, null, 2), "utf8");
    return fallback;
  }
}

async function saveUiPreferencesState(payload) {
  await ensureUiPreferencesFile();
  const normalized = normalizeUiPreferences(payload);
  normalized.updatedAt = new Date().toISOString();
  await writeJsonAtomic(uiPreferencesFilePath, normalized);
  return normalized;
}

async function exportUniverse(payload) {
  const source = payload && typeof payload === "object" ? payload : {};
  const format = cleanText(source.format, 10).toLowerCase();
  const userDataDir = app.getPath("userData");
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");

  if (format === "png") {
    const dataUrl = cleanText(source.dataUrl, 12_000_000);
    const match = dataUrl.match(/^data:image\/png;base64,([A-Za-z0-9+/=\s]+)$/);
    if (!match) {
      throw new Error("Invalid PNG payload.");
    }
    const base64 = match[1].replace(/\s+/g, "");
    const filePath = path.join(userDataDir, `universe-${stamp}.png`);
    await fs.writeFile(filePath, Buffer.from(base64, "base64"));
    return {
      ok: true,
      filePath
    };
  }

  const filePath = path.join(userDataDir, `universe-${stamp}.json`);
  const data = source.data && typeof source.data === "object" ? source.data : {};
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
  return {
    ok: true,
    filePath
  };
}

async function appendDiagnostics(payload) {
  const incoming = normalizeDiagnosticsState(payload);
  const current = await loadDiagnosticsState();
  const next = normalizeDiagnosticsState({
    version: 1,
    errors: [...current.errors, ...incoming.errors],
    perf: [...current.perf, ...incoming.perf]
  });
  await saveDiagnosticsState(next);
  return {
    ok: true,
    errors: next.errors.length,
    perf: next.perf.length
  };
}

async function exportDiagnostics() {
  const diagnostics = await loadDiagnosticsState();
  const userDataDir = app.getPath("userData");
  const filePath = path.join(userDataDir, `diagnostics-export-${new Date().toISOString().replace(/[:.]/g, "-")}.json`);
  await fs.writeFile(filePath, JSON.stringify(diagnostics, null, 2), "utf8");
  return {
    ok: true,
    filePath
  };
}

module.exports = {
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
  saveDiagnosticsState,
  loadUniverseCacheState,
  saveUniverseCacheState,
  loadUiPreferencesState,
  saveUiPreferencesState,
  exportUniverse,
  appendDiagnostics,
  exportDiagnostics,
  compactState
};
