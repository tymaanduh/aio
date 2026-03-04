"use strict";

const {
  WINDOW_HOOK_KEYS,
  WINDOW_HOOK_TIMESTAMP_KEYS,
  create_window_hook_pair
} = require("./window_hook_shared");

const WINDOW_HOOK_PAIRS = Object.freeze({
  [WINDOW_HOOK_KEYS.PRE_LOAD]: create_window_hook_pair(
    WINDOW_HOOK_KEYS.PRE_LOAD,
    WINDOW_HOOK_TIMESTAMP_KEYS.PRE_LOAD,
    true
  ),
  [WINDOW_HOOK_KEYS.POST_LOAD]: create_window_hook_pair(
    WINDOW_HOOK_KEYS.POST_LOAD,
    WINDOW_HOOK_TIMESTAMP_KEYS.POST_LOAD,
    false
  )
});

function get_window_hook_pair(hook_key) {
  return WINDOW_HOOK_PAIRS[hook_key] || null;
}

module.exports = {
  WINDOW_HOOK_REGISTRY: WINDOW_HOOK_PAIRS,
  WINDOW_HOOK_PAIRS,
  get_window_hook_pair
};
