"use strict";

const {
  NORMALIZE_LIMITS,
  NORMALIZE_RANGES,
  NORMALIZE_PATTERNS,
  NORMALIZE_EDGE_MODE_KEYS
} = require("./normalize_specs.js");

const normalizeRuntime = Object.freeze({
  HISTORY_MAX: NORMALIZE_LIMITS.HISTORY_MAX,
  DIAGNOSTICS_MAX_ERRORS: NORMALIZE_LIMITS.DIAGNOSTICS_MAX_ERRORS,
  DIAGNOSTICS_MAX_PERF: NORMALIZE_LIMITS.DIAGNOSTICS_MAX_PERF,
  ENTRY_MODES: new Set(NORMALIZE_PATTERNS.ENTRY_MODES)
});

function now_iso() {
  return new Date().toISOString();
}

function clamp_number(value, min, max, fallback = min) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return fallback;
  }
  return Math.max(min, Math.min(max, numeric));
}

function to_source_object(value, fallback = {}) {
  return value && typeof value === "object" ? value : fallback;
}

function cleanText(value, maxLength = NORMALIZE_LIMITS.CLEAN_TEXT_DEFAULT) {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim().slice(0, maxLength);
}

function normalizeLabel(label) {
  return cleanText(label, NORMALIZE_LIMITS.LABEL);
}

function normalize_unique_labels(labels) {
  return (Array.isArray(labels) ? labels : [])
    .map(normalizeLabel)
    .filter(Boolean)
    .filter((item, index, list) => list.indexOf(item) === index);
}

function to_non_negative_int(value, fallback = 0) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return fallback;
  }
  return Math.max(0, Math.floor(numeric));
}

function round_positive_milliseconds(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return 0;
  }
  return Math.max(0, Math.round(numeric * 1000) / 1000);
}

function build_edge_mode_counts(edge_mode_counts_source) {
  return NORMALIZE_EDGE_MODE_KEYS.reduce((accumulator, mode_key) => {
    accumulator[mode_key] = to_non_negative_int(edge_mode_counts_source?.[mode_key], 0);
    return accumulator;
  }, {});
}

function normalizeUsername(value) {
  return cleanText(value, NORMALIZE_LIMITS.USERNAME);
}

function normalizePassword(value) {
  if (typeof value !== "string") {
    return "";
  }
  return value.slice(0, NORMALIZE_LIMITS.PASSWORD);
}

function normalizeEntryMode(value) {
  const mode = cleanText(value, NORMALIZE_LIMITS.MODE).toLowerCase();
  if (!mode || !normalizeRuntime.ENTRY_MODES.has(mode)) {
    return NORMALIZE_PATTERNS.DEFAULT_ENTRY_MODE;
  }
  return mode;
}

function normalizeEntryUsageCount(value) {
  return Math.floor(
    clamp_number(
      value,
      NORMALIZE_RANGES.ENTRY_USAGE.MIN,
      NORMALIZE_RANGES.ENTRY_USAGE.MAX,
      NORMALIZE_RANGES.ENTRY_USAGE.MIN
    )
  );
}

function toTimestampMs(value) {
  const timestamp = Date.parse(cleanText(value, NORMALIZE_LIMITS.TIMESTAMP));
  if (!Number.isFinite(timestamp)) {
    return 0;
  }
  return timestamp;
}

function normalizeWordIdentityKey(value) {
  return cleanText(value, NORMALIZE_LIMITS.WORD_IDENTITY).toLowerCase();
}

function normalizeGraphCoordinate(value, min, max) {
  return clamp_number(value, min, max, min);
}

module.exports = {
  NORMALIZE_RUNTIME: normalizeRuntime,
  normalizeRuntime,
  NORMALIZE_LIMITS,
  NORMALIZE_RANGES,
  NORMALIZE_PATTERNS,
  NORMALIZE_EDGE_MODE_KEYS,
  now_iso,
  clamp_number,
  to_source_object,
  cleanText,
  normalizeLabel,
  normalize_unique_labels,
  to_non_negative_int,
  round_positive_milliseconds,
  build_edge_mode_counts,
  normalizeUsername,
  normalizePassword,
  normalizeEntryMode,
  normalizeEntryUsageCount,
  toTimestampMs,
  normalizeWordIdentityKey,
  normalizeGraphCoordinate
};
