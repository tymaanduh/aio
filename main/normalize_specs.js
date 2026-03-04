"use strict";

const NORMALIZE_SPECS_CATALOG = require("../data/input/shared/main/normalize_specs_catalog.json");

function deep_freeze(value) {
  if (!value || typeof value !== "object") {
    return value;
  }
  if (Object.isFrozen(value)) {
    return value;
  }
  Object.getOwnPropertyNames(value).forEach((key) => {
    deep_freeze(value[key]);
  });
  return Object.freeze(value);
}

function freeze_catalog_value(value, fallback) {
  const source = value && typeof value === "object" ? value : fallback;
  const cloned = source && typeof source === "object" ? JSON.parse(JSON.stringify(source)) : source;
  return deep_freeze(cloned);
}

function freeze_catalog_array(value, fallback) {
  const source = Array.isArray(value) ? value.slice() : Array.isArray(fallback) ? fallback.slice() : [];
  return Object.freeze(source);
}

const NORMALIZE_LIMITS = freeze_catalog_value(NORMALIZE_SPECS_CATALOG.normalize_limits, {});
const NORMALIZE_RANGES = freeze_catalog_value(NORMALIZE_SPECS_CATALOG.normalize_ranges, {});
const NORMALIZE_PATTERNS = freeze_catalog_value(NORMALIZE_SPECS_CATALOG.normalize_patterns, {});
const NORMALIZE_EDGE_MODE_KEYS = freeze_catalog_array(
  NORMALIZE_SPECS_CATALOG.normalize_edge_mode_keys,
  ["contains", "prefix", "suffix", "stem", "sameLabel"]
);
const NORMALIZE_STATE_DEFAULTS = freeze_catalog_value(NORMALIZE_SPECS_CATALOG.normalize_state_defaults, {});
const NORMALIZE_AUTH_DEFAULTS = freeze_catalog_value(NORMALIZE_SPECS_CATALOG.normalize_auth_defaults, {});
const NORMALIZE_DIAGNOSTICS_DEFAULTS = freeze_catalog_value(
  NORMALIZE_SPECS_CATALOG.normalize_diagnostics_defaults,
  {}
);
const NORMALIZE_UNIVERSE_DEFAULTS = freeze_catalog_value(
  NORMALIZE_SPECS_CATALOG.normalize_universe_defaults,
  {}
);

module.exports = {
  NORMALIZE_LIMITS,
  NORMALIZE_RANGES,
  NORMALIZE_PATTERNS,
  NORMALIZE_EDGE_MODE_KEYS,
  NORMALIZE_STATE_DEFAULTS,
  NORMALIZE_AUTH_DEFAULTS,
  NORMALIZE_DIAGNOSTICS_DEFAULTS,
  NORMALIZE_UNIVERSE_DEFAULTS
};
