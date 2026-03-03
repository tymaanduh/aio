"use strict";

const { WINDOW_HOOK_KEYS } = require("./window_hook_shared");
const { get_window_hook_pair } = require("./window_hook_registry");

const WINDOW_PRE_LOAD_HOOK = get_window_hook_pair(WINDOW_HOOK_KEYS.PRE_LOAD);

const WINDOW_PRE_LOAD_HOOK_SPEC = WINDOW_PRE_LOAD_HOOK.hook_spec;
const run_window_pre_load = WINDOW_PRE_LOAD_HOOK.run_hook;

module.exports = {
  WINDOW_PRE_LOAD_HOOK_SPEC,
  run_window_pre_load
};
