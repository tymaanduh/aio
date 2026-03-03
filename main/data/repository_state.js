"use strict";

const { FILE_KEYS } = require("./repository_manifest.js");
const { REPOSITORY_TIME_FIELDS, create_repository_state_api } = require("./repository_shared.js");
const normalize_service = require("../services/normalize_service.js");

const STATE_REPOSITORY_SPEC = Object.freeze({
  file_key: FILE_KEYS.APP_STATE,
  create_default_state: normalize_service.create_default_state,
  normalize_state: normalize_service.normalize_state,
  touch_field: REPOSITORY_TIME_FIELDS.LAST_SAVED_AT
});

const STATE_REPOSITORY_API = create_repository_state_api(STATE_REPOSITORY_SPEC);

const { ensure_state_file, load_state, save_state } = STATE_REPOSITORY_API;

module.exports = {
  ensure_state_file,
  load_state,
  save_state
};
