"use strict";

const {
  NORMALIZE_LIMITS,
  now_iso,
  to_source_object,
  cleanText,
  normalizeUsername
} = require("./normalize_core.js");
const { NORMALIZE_AUTH_DEFAULTS } = require("./normalize_specs.js");
const { createDefaultAuthState } = require("./normalize_defaults.js");

function normalizeAuthState(rawAuthState) {
  const fallback = createDefaultAuthState();
  const state = to_source_object(rawAuthState, fallback);
  const sourceAccount = to_source_object(state.account, null);
  const username = normalizeUsername(sourceAccount?.username || "");
  const salt = cleanText(sourceAccount?.salt || "", NORMALIZE_LIMITS.AUTH_HASH);
  const passwordHash = cleanText(sourceAccount?.passwordHash || "", NORMALIZE_LIMITS.AUTH_HASH);

  const account =
    username && salt && passwordHash
      ? {
          username,
          salt,
          passwordHash,
          createdAt: cleanText(sourceAccount?.createdAt, NORMALIZE_LIMITS.TIMESTAMP) || now_iso(),
          updatedAt: cleanText(sourceAccount?.updatedAt, NORMALIZE_LIMITS.TIMESTAMP) || now_iso()
        }
      : null;

  return {
    version: NORMALIZE_AUTH_DEFAULTS.VERSION,
    account,
    lastAuthAt: cleanText(state.lastAuthAt, NORMALIZE_LIMITS.TIMESTAMP) || null
  };
}

module.exports = {
  normalizeAuthState
};
