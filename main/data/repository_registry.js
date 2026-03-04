"use strict";

const { create_repository_state_api } = require("./repository_shared.js");
const { REPOSITORY_DOMAIN_KEYS, REPOSITORY_SPEC_MAP } = require("./repository_specs.js");

const REPOSITORY_API_MAP = Object.freeze(
  Object.keys(REPOSITORY_SPEC_MAP).reduce((acc, domain_key) => {
    acc[domain_key] = create_repository_state_api(REPOSITORY_SPEC_MAP[domain_key]);
    return acc;
  }, {})
);

const dataPreLoadRepositoryOrder = Object.freeze([
  REPOSITORY_DOMAIN_KEYS.STATE,
  REPOSITORY_DOMAIN_KEYS.AUTH,
  REPOSITORY_DOMAIN_KEYS.DIAGNOSTICS,
  REPOSITORY_DOMAIN_KEYS.UNIVERSE,
  REPOSITORY_DOMAIN_KEYS.UI_PREFERENCES,
  REPOSITORY_DOMAIN_KEYS.LANGUAGE_BRIDGE
]);

function get_repository_api(domain_key) {
  const repository_api = REPOSITORY_API_MAP[domain_key];
  if (!repository_api) {
    throw new Error(`Unknown repository domain key: ${domain_key}`);
  }
  return repository_api;
}

function get_repository_ensure_tasks(domain_order = dataPreLoadRepositoryOrder) {
  return Object.freeze(domain_order.map((domain_key) => get_repository_api(domain_key).ensure_state_file));
}

module.exports = {
  DATA_PRE_LOAD_REPOSITORY_ORDER: dataPreLoadRepositoryOrder,
  dataPreLoadRepositoryOrder,
  REPOSITORY_DOMAIN_KEYS,
  REPOSITORY_API_MAP,
  get_repository_api,
  get_repository_ensure_tasks
};
