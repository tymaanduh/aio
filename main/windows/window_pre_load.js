"use strict";

const {
  WINDOW_HOOK_KEYS,
  WINDOW_HOOK_TIMESTAMP_KEYS,
  create_window_hook_pair
} = require("./window_hook_shared");

const WINDOW_PRE_LOAD_HOOK = create_window_hook_pair(
  WINDOW_HOOK_KEYS.PRE_LOAD,
  WINDOW_HOOK_TIMESTAMP_KEYS.PRE_LOAD,
  true
);

const WINDOW_PRE_LOAD_HOOK_SPEC = WINDOW_PRE_LOAD_HOOK.hook_spec;
const run_window_pre_load = WINDOW_PRE_LOAD_HOOK.run_hook;

module.exports = {
  WINDOW_PRE_LOAD_HOOK_SPEC,
  run_window_pre_load
};
