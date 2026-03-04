"use strict";

const { load_manifest } = require("./repository_manifest.js");
const { DATA_HOOK_KEYS, DATA_HOOK_TIMESTAMP_KEYS, create_data_hook_runner } = require("./data_hook_shared.js");

async function run_data_post_load_logic() {
  const manifest = await load_manifest();
  return {
    storage_version: manifest?.storage_version || "v1"
  };
}

const DATA_POST_LOAD_HOOK = create_data_hook_runner(
  DATA_HOOK_KEYS.POST_LOAD,
  DATA_HOOK_TIMESTAMP_KEYS.POST_LOAD,
  false,
  run_data_post_load_logic
);

const DATA_POST_LOAD_HOOK_SPEC = DATA_POST_LOAD_HOOK.hook_spec;
const run_data_post_load = DATA_POST_LOAD_HOOK.run_hook;

module.exports = {
  DATA_POST_LOAD_HOOK_SPEC,
  run_data_post_load
};
