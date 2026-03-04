"use strict";

const { REPOSITORY_DOMAIN_KEYS, get_repository_api } = require("./repository_registry.js");

const UI_PREFERENCES_REPOSITORY_API = get_repository_api(REPOSITORY_DOMAIN_KEYS.UI_PREFERENCES);

const ensure_ui_preferences_file = UI_PREFERENCES_REPOSITORY_API.ensure_state_file;
const load_ui_preferences_state = UI_PREFERENCES_REPOSITORY_API.load_state;
const save_ui_preferences_state = UI_PREFERENCES_REPOSITORY_API.save_state;

module.exports = {
  ensure_ui_preferences_file,
  load_ui_preferences_state,
  save_ui_preferences_state
};
