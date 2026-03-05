"use strict";

const { REPOSITORY_DOMAIN_KEYS, get_repository_api } = require("./repository_registry.js");

const LANGUAGE_BRIDGE_REPOSITORY_API = get_repository_api(REPOSITORY_DOMAIN_KEYS.LANGUAGE_BRIDGE);
const ensure_language_bridge_state_file = LANGUAGE_BRIDGE_REPOSITORY_API.ensure_state_file;
const load_language_bridge_state = LANGUAGE_BRIDGE_REPOSITORY_API.load_state;
const save_language_bridge_state = LANGUAGE_BRIDGE_REPOSITORY_API.save_state;

module.exports = {
  ensure_language_bridge_state_file,
  load_language_bridge_state,
  save_language_bridge_state
};
