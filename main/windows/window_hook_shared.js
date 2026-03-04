"use strict";

const WINDOW_HOOK_SCOPE = "window";

function create_window_hook_keys() {
  return {
    PRE_LOAD: "WINDOW_PRE_LOAD",
    POST_LOAD: "WINDOW_POST_LOAD"
  };
}

function create_window_hook_timestamp_keys() {
  return {
    PRE_LOAD: "window_pre_loaded_at",
    POST_LOAD: "window_post_loaded_at"
  };
}

const WINDOW_HOOK_KEYS = Object.freeze(create_window_hook_keys());
const WINDOW_HOOK_TIMESTAMP_KEYS = Object.freeze(create_window_hook_timestamp_keys());

function create_window_hook_spec(key, required) {
  return Object.freeze({
    key,
    scope: WINDOW_HOOK_SCOPE,
    required
  });
}

function create_window_hook_result(ctx, timestamp_key) {
  return {
    ...ctx,
    [timestamp_key]: new Date().toISOString()
  };
}

function create_window_hook_pair(hook_key, timestamp_key, required) {
  const hook_spec = create_window_hook_spec(hook_key, required);
  function run_hook(ctx) {
    return create_window_hook_result(ctx, timestamp_key);
  }
  return Object.freeze({
    hook_spec,
    run_hook
  });
}

module.exports = {
  WINDOW_HOOK_SCOPE,
  WINDOW_HOOK_KEYS,
  WINDOW_HOOK_TIMESTAMP_KEYS,
  create_window_hook_spec,
  create_window_hook_result,
  create_window_hook_pair
};
