"use strict";

const WINDOW_HOOK_SCOPE = "window";

const WINDOW_HOOK_KEYS = Object.freeze({
  PRE_LOAD: "WINDOW_PRE_LOAD",
  POST_LOAD: "WINDOW_POST_LOAD"
});

const WINDOW_HOOK_TIMESTAMP_KEYS = Object.freeze({
  PRE_LOAD: "window_pre_loaded_at",
  POST_LOAD: "window_post_loaded_at"
});

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
