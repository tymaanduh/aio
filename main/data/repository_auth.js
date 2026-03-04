"use strict";

const { REPOSITORY_DOMAIN_KEYS, get_repository_api } = require("./repository_registry.js");

const AUTH_REPOSITORY_API = get_repository_api(REPOSITORY_DOMAIN_KEYS.AUTH);

const ensure_auth_state_file = AUTH_REPOSITORY_API.ensure_state_file;
const load_auth_state = AUTH_REPOSITORY_API.load_state;
const save_auth_state = AUTH_REPOSITORY_API.save_state;

module.exports = {
  ensure_auth_state_file,
  load_auth_state,
  save_auth_state
};
