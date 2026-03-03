"use strict";

const { FILE_KEYS } = require("./repository_manifest.js");
const { REPOSITORY_TIME_FIELDS, create_repository_state_api } = require("./repository_shared.js");
const { createDefaultUiPreferences, normalizeUiPreferences } = require("../../app/modules/ui-preferences-utils.js");

const UI_PREFERENCES_REPOSITORY_SPEC = Object.freeze({
  file_key: FILE_KEYS.UI_PREFERENCES,
  create_default_state: createDefaultUiPreferences,
  normalize_state: normalizeUiPreferences,
  touch_field: REPOSITORY_TIME_FIELDS.UPDATED_AT
});

const UI_PREFERENCES_REPOSITORY_API = create_repository_state_api(UI_PREFERENCES_REPOSITORY_SPEC);

const ensure_ui_preferences_file = UI_PREFERENCES_REPOSITORY_API.ensure_state_file;
const load_ui_preferences_state = UI_PREFERENCES_REPOSITORY_API.load_state;
const save_ui_preferences_state = UI_PREFERENCES_REPOSITORY_API.save_state;

module.exports = {
  ensure_ui_preferences_file,
  load_ui_preferences_state,
  save_ui_preferences_state
};
