"use strict";

const { FILE_KEYS } = require("./repository_manifest.js");
const { create_repository_state_api } = require("./repository_shared.js");
const normalize_service = require("../services/normalize_service.js");

const AUTH_REPOSITORY_SPEC = Object.freeze({
  file_key: FILE_KEYS.AUTH_STATE,
  create_default_state: normalize_service.create_default_auth_state,
  normalize_state: normalize_service.normalize_auth_state
});

const AUTH_REPOSITORY_API = create_repository_state_api(AUTH_REPOSITORY_SPEC);

const ensure_auth_state_file = AUTH_REPOSITORY_API.ensure_state_file;
const load_auth_state = AUTH_REPOSITORY_API.load_state;
const save_auth_state = AUTH_REPOSITORY_API.save_state;

module.exports = {
  ensure_auth_state_file,
  load_auth_state,
  save_auth_state
};
