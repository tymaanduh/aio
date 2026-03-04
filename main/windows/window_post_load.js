"use strict";

const { WINDOW_HOOK_KEYS } = require("./window_hook_shared");
const { get_window_hook_pair } = require("./window_hook_registry");

const WINDOW_POST_LOAD_HOOK = get_window_hook_pair(WINDOW_HOOK_KEYS.POST_LOAD);

const WINDOW_POST_LOAD_HOOK_SPEC = WINDOW_POST_LOAD_HOOK.hook_spec;
const run_window_post_load = WINDOW_POST_LOAD_HOOK.run_hook;

module.exports = {
  WINDOW_POST_LOAD_HOOK_SPEC,
  run_window_post_load
};
