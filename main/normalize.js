"use strict";

const CORE = require("./normalize_core.js");
const DEFAULTS = require("./normalize_defaults.js");
const UNIVERSE_DOMAIN = require("./normalize_universe_domain.js");
const STATE_DOMAIN = require("./normalize_state_domain.js");
const DIAGNOSTICS_DOMAIN = require("./normalize_diagnostics_domain.js");
const AUTH_DOMAIN = require("./normalize_auth_domain.js");

module.exports = {
  cleanText: CORE.cleanText,
  normalizeLabel: CORE.normalizeLabel,
  normalizeUsername: CORE.normalizeUsername,
  normalizePassword: CORE.normalizePassword,
  normalizeEntryMode: CORE.normalizeEntryMode,
  normalizeEntryUsageCount: CORE.normalizeEntryUsageCount,
  toTimestampMs: CORE.toTimestampMs,
  normalizeGraphCoordinate: CORE.normalizeGraphCoordinate,
  createDefaultState: DEFAULTS.createDefaultState,
  createDefaultSentenceGraph: DEFAULTS.createDefaultSentenceGraph,
  createDefaultAuthState: DEFAULTS.createDefaultAuthState,
  createDefaultDiagnosticsState: DEFAULTS.createDefaultDiagnosticsState,
  createDefaultUniverseCacheState: DEFAULTS.createDefaultUniverseCacheState,
  normalizeUniverseCacheState: UNIVERSE_DOMAIN.normalizeUniverseCacheState,
  normalizeState: STATE_DOMAIN.normalizeState,
  normalizeDiagnosticsState: DIAGNOSTICS_DOMAIN.normalizeDiagnosticsState,
  normalizeAuthState: AUTH_DOMAIN.normalizeAuthState,
  normalizeStateEntry: STATE_DOMAIN.normalizeStateEntry,
  compactState: STATE_DOMAIN.compactState
};
