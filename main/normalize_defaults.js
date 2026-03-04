"use strict";

const {
  NORMALIZE_STATE_DEFAULTS,
  NORMALIZE_AUTH_DEFAULTS,
  NORMALIZE_DIAGNOSTICS_DEFAULTS,
  NORMALIZE_UNIVERSE_DEFAULTS
} = require("./normalize_specs.js");

function createDefaultSentenceGraph() {
  return {
    nodes: [],
    links: []
  };
}

function createDefaultAuthState() {
  return {
    version: NORMALIZE_AUTH_DEFAULTS.VERSION,
    account: null,
    lastAuthAt: null
  };
}

function createDefaultDiagnosticsState() {
  return {
    version: NORMALIZE_DIAGNOSTICS_DEFAULTS.VERSION,
    errors: [],
    perf: []
  };
}

function createDefaultUniverseCacheState() {
  return {
    version: NORMALIZE_UNIVERSE_DEFAULTS.VERSION,
    datasetSignature: NORMALIZE_UNIVERSE_DEFAULTS.DATASET_SIGNATURE,
    modelKey: NORMALIZE_UNIVERSE_DEFAULTS.MODEL_KEY,
    config: {},
    bookmarks: [],
    graph: {
      nodes: [],
      edges: [],
      meta: {}
    },
    updatedAt: null
  };
}

function createDefaultState() {
  return {
    version: NORMALIZE_STATE_DEFAULTS.VERSION,
    labels: Array.from(NORMALIZE_STATE_DEFAULTS.LABELS),
    entries: [],
    sentenceGraph: createDefaultSentenceGraph(),
    history: [],
    graphLockEnabled: NORMALIZE_STATE_DEFAULTS.GRAPH_LOCK_ENABLED,
    localAssistEnabled: NORMALIZE_STATE_DEFAULTS.LOCAL_ASSIST_ENABLED,
    diagnostics: createDefaultDiagnosticsState(),
    lastSavedAt: null
  };
}

module.exports = {
  createDefaultState,
  createDefaultSentenceGraph,
  createDefaultAuthState,
  createDefaultDiagnosticsState,
  createDefaultUniverseCacheState
};
