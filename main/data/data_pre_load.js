"use strict";

const { load_manifest, ensure_data_dirs } = require("./repository_manifest.js");
const { run_data_migrate_v0_to_v1 } = require("./data_migrate_v0_to_v1.js");
const { DATA_HOOK_KEYS, DATA_HOOK_TIMESTAMP_KEYS, create_data_hook_runner } = require("./data_hook_shared.js");
const repository_state = require("./repository_state.js");
const repository_auth = require("./repository_auth.js");
const repository_diagnostics = require("./repository_diagnostics.js");
const repository_universe = require("./repository_universe.js");
const repository_ui_preferences = require("./repository_ui_preferences.js");

const DATA_PRE_LOAD_ENSURE_TASKS = Object.freeze([
  repository_state.ensure_state_file,
  repository_auth.ensure_auth_state_file,
  repository_diagnostics.ensure_diagnostics_state_file,
  repository_universe.ensure_universe_cache_file,
  repository_ui_preferences.ensure_ui_preferences_file
]);

async function ensure_data_pre_load_files() {
  for (const ensure_task of DATA_PRE_LOAD_ENSURE_TASKS) {
    // Keep file creation and manifest sync order deterministic.
    // eslint-disable-next-line no-await-in-loop
    await ensure_task();
  }
}

async function run_data_pre_load_logic() {
  await ensure_data_dirs();
  const manifest = await load_manifest();
  if (!manifest) {
    await run_data_migrate_v0_to_v1();
  }

  await ensure_data_pre_load_files();
  return {};
}

const DATA_PRE_LOAD_HOOK = create_data_hook_runner(
  DATA_HOOK_KEYS.PRE_LOAD,
  DATA_HOOK_TIMESTAMP_KEYS.PRE_LOAD,
  true,
  run_data_pre_load_logic
);

const DATA_PRE_LOAD_HOOK_SPEC = DATA_PRE_LOAD_HOOK.hook_spec;
const run_data_pre_load = DATA_PRE_LOAD_HOOK.run_hook;

module.exports = {
  DATA_PRE_LOAD_HOOK_SPEC,
  run_data_pre_load
};
