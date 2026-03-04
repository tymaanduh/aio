"use strict";

const { REPOSITORY_DOMAIN_KEYS, get_repository_api } = require("./repository_registry.js");

const STATE_REPOSITORY_API = get_repository_api(REPOSITORY_DOMAIN_KEYS.STATE);
const ensure_state_file = STATE_REPOSITORY_API.ensure_state_file;
const load_state = STATE_REPOSITORY_API.load_state;
const save_state = STATE_REPOSITORY_API.save_state;

module.exports = {
  ensure_state_file,
  load_state,
  save_state
};
