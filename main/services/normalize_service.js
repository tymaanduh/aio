"use strict";

const normalize = require("../normalize.js");

const NORMALIZE_SERVICE_API = Object.freeze({
  clean_text: normalize.cleanText,
  normalize_label: normalize.normalizeLabel,
  normalize_username: normalize.normalizeUsername,
  normalize_password: normalize.normalizePassword,
  normalize_state: normalize.normalizeState,
  normalize_auth_state: normalize.normalizeAuthState,
  normalize_diagnostics_state: normalize.normalizeDiagnosticsState,
  normalize_universe_cache_state: normalize.normalizeUniverseCacheState,
  create_default_state: normalize.createDefaultState,
  create_default_auth_state: normalize.createDefaultAuthState,
  create_default_diagnostics_state: normalize.createDefaultDiagnosticsState,
  create_default_universe_cache_state: normalize.createDefaultUniverseCacheState,
  compact_state: normalize.compactState
});

module.exports = NORMALIZE_SERVICE_API;
