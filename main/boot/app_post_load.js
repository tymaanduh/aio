"use strict";

const { APP_HOOK_KEYS, APP_HOOK_TIMESTAMP_KEYS, create_app_hook_runner } = require("./app_hook_shared.js");

const APP_POST_LOAD_HOOK = create_app_hook_runner(
  APP_HOOK_KEYS.POST_LOAD,
  APP_HOOK_TIMESTAMP_KEYS.POST_LOAD,
  false
);

const APP_POST_LOAD_HOOK_SPEC = APP_POST_LOAD_HOOK.hook_spec;
const run_app_post_load = APP_POST_LOAD_HOOK.run_hook;

module.exports = {
  APP_POST_LOAD_HOOK_SPEC,
  run_app_post_load
};
