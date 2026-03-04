"use strict";

const {
  NORMALIZE_RUNTIME,
  NORMALIZE_LIMITS,
  NORMALIZE_PATTERNS,
  now_iso,
  to_source_object,
  cleanText,
  round_positive_milliseconds
} = require("./normalize_core.js");
const { NORMALIZE_DIAGNOSTICS_DEFAULTS } = require("./normalize_specs.js");
const { createDefaultDiagnosticsState } = require("./normalize_defaults.js");

function normalizeDiagnosticsState(rawDiagnosticsState) {
  const source = to_source_object(rawDiagnosticsState, createDefaultDiagnosticsState());
  const errors = Array.isArray(source.errors)
    ? source.errors
        .map((item) => {
          const errorItem = to_source_object(item);
          const message = cleanText(errorItem.message, NORMALIZE_LIMITS.DIAGNOSTIC_MESSAGE);
          if (!message) {
            return null;
          }
          return {
            at: cleanText(errorItem.at, NORMALIZE_LIMITS.TIMESTAMP) || now_iso(),
            code: cleanText(errorItem.code, NORMALIZE_LIMITS.DIAGNOSTIC_CODE) || NORMALIZE_PATTERNS.DEFAULT_DIAGNOSTIC_CODE,
            message,
            context: cleanText(errorItem.context || "", NORMALIZE_LIMITS.DIAGNOSTIC_CONTEXT)
          };
        })
        .filter(Boolean)
        .slice(-NORMALIZE_RUNTIME.DIAGNOSTICS_MAX_ERRORS)
    : [];
  const perf = Array.isArray(source.perf)
    ? source.perf
        .map((item) => {
          const perfItem = to_source_object(item);
          const key = cleanText(perfItem.key, NORMALIZE_LIMITS.DIAGNOSTIC_PERF_KEY);
          if (!key) {
            return null;
          }
          return {
            at: cleanText(perfItem.at, NORMALIZE_LIMITS.TIMESTAMP) || now_iso(),
            key,
            ms: round_positive_milliseconds(perfItem.ms)
          };
        })
        .filter(Boolean)
        .slice(-NORMALIZE_RUNTIME.DIAGNOSTICS_MAX_PERF)
    : [];
  return {
    version: NORMALIZE_DIAGNOSTICS_DEFAULTS.VERSION,
    errors,
    perf
  };
}

module.exports = {
  normalizeDiagnosticsState
};
