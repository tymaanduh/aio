"use strict";

const { FILE_KEYS } = require("./repository_manifest.js");
const { REPOSITORY_TIME_FIELDS } = require("./repository_shared.js");
const normalize_service = require("../services/normalize_service.js");
const { createDefaultUiPreferences, normalizeUiPreferences } = require("../../app/modules/ui-preferences-utils.js");

const REPOSITORY_DOMAIN_KEYS = Object.freeze({
  STATE: "state",
  AUTH: "auth",
  DIAGNOSTICS: "diagnostics",
  UNIVERSE: "universe",
  UI_PREFERENCES: "ui_preferences",
  LANGUAGE_BRIDGE: "language_bridge"
});

const REPOSITORY_SPEC_MAP = Object.freeze({
  [REPOSITORY_DOMAIN_KEYS.STATE]: Object.freeze({
    file_key: FILE_KEYS.APP_STATE,
    create_default_state: normalize_service.create_default_state,
    normalize_state: normalize_service.normalize_state,
    touch_field: REPOSITORY_TIME_FIELDS.LAST_SAVED_AT
  }),
  [REPOSITORY_DOMAIN_KEYS.AUTH]: Object.freeze({
    file_key: FILE_KEYS.AUTH_STATE,
    create_default_state: normalize_service.create_default_auth_state,
    normalize_state: normalize_service.normalize_auth_state
  }),
  [REPOSITORY_DOMAIN_KEYS.DIAGNOSTICS]: Object.freeze({
    file_key: FILE_KEYS.DIAGNOSTICS_STATE,
    create_default_state: normalize_service.create_default_diagnostics_state,
    normalize_state: normalize_service.normalize_diagnostics_state
  }),
  [REPOSITORY_DOMAIN_KEYS.UNIVERSE]: Object.freeze({
    file_key: FILE_KEYS.UNIVERSE_CACHE,
    create_default_state: normalize_service.create_default_universe_cache_state,
    normalize_state: normalize_service.normalize_universe_cache_state,
    touch_field: REPOSITORY_TIME_FIELDS.UPDATED_AT
  }),
  [REPOSITORY_DOMAIN_KEYS.UI_PREFERENCES]: Object.freeze({
    file_key: FILE_KEYS.UI_PREFERENCES,
    create_default_state: createDefaultUiPreferences,
    normalize_state: normalizeUiPreferences,
    touch_field: REPOSITORY_TIME_FIELDS.UPDATED_AT
  }),
  [REPOSITORY_DOMAIN_KEYS.LANGUAGE_BRIDGE]: Object.freeze({
    file_key: FILE_KEYS.LANGUAGE_BRIDGE_STATE,
    create_default_state: normalize_service.create_default_language_bridge_state,
    normalize_state: normalize_service.normalize_language_bridge_state,
    touch_field: REPOSITORY_TIME_FIELDS.UPDATED_AT
  })
});

const REPOSITORY_DOMAIN_KEY_LIST = Object.freeze(Object.keys(REPOSITORY_SPEC_MAP));

function get_repository_spec(domain_key) {
  return REPOSITORY_SPEC_MAP[domain_key] || null;
}

module.exports = {
  REPOSITORY_DOMAIN_KEYS,
  REPOSITORY_DOMAIN_KEY_LIST,
  REPOSITORY_SPEC_MAP,
  get_repository_spec
};
