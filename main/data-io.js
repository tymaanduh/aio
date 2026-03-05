"use strict";

const repository_state = require("./data/repository_state.js");
const repository_auth = require("./data/repository_auth.js");
const repository_diagnostics = require("./data/repository_diagnostics.js");
const repository_universe = require("./data/repository_universe.js");
const repository_ui_preferences = require("./data/repository_ui_preferences.js");
const normalize_service = require("./services/normalize_service.js");
const { run_data_pre_load } = require("./data/data_pre_load.js");

const DATA_IO_ENSURE_NAMES = Object.freeze({
  DATA: "ensureDataFile",
  AUTH: "ensureAuthFile",
  DIAGNOSTICS: "ensureDiagnosticsFile",
  UNIVERSE_CACHE: "ensureUniverseCacheFile",
  UI_PREFERENCES: "ensureUiPreferencesFile"
});

async function ensure_data_pre_loaded() {
  await run_data_pre_load();
}

const ensureDataFile = ensure_data_pre_loaded;
const ensureAuthFile = ensure_data_pre_loaded;
const ensureDiagnosticsFile = ensure_data_pre_loaded;
const ensureUniverseCacheFile = ensure_data_pre_loaded;
const ensureUiPreferencesFile = ensure_data_pre_loaded;

const DATA_IO_EXPORT_MAP = Object.freeze({
  [DATA_IO_ENSURE_NAMES.DATA]: ensureDataFile,
  [DATA_IO_ENSURE_NAMES.AUTH]: ensureAuthFile,
  [DATA_IO_ENSURE_NAMES.DIAGNOSTICS]: ensureDiagnosticsFile,
  [DATA_IO_ENSURE_NAMES.UNIVERSE_CACHE]: ensureUniverseCacheFile,
  [DATA_IO_ENSURE_NAMES.UI_PREFERENCES]: ensureUiPreferencesFile,
  loadState: repository_state.load_state,
  saveState: repository_state.save_state,
  loadAuthState: repository_auth.load_auth_state,
  saveAuthState: repository_auth.save_auth_state,
  loadDiagnosticsState: repository_diagnostics.load_diagnostics_state,
  saveDiagnosticsState: repository_diagnostics.save_diagnostics_state,
  loadUniverseCacheState: repository_universe.load_universe_cache_state,
  saveUniverseCacheState: repository_universe.save_universe_cache_state,
  loadUiPreferencesState: repository_ui_preferences.load_ui_preferences_state,
  saveUiPreferencesState: repository_ui_preferences.save_ui_preferences_state,
  exportUniverse: repository_universe.export_universe,
  appendDiagnostics: repository_diagnostics.append_diagnostics,
  exportDiagnostics: repository_diagnostics.export_diagnostics,
  compactState: normalize_service.compact_state
});

module.exports = {
  ...DATA_IO_EXPORT_MAP
};
