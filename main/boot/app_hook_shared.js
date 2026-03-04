"use strict";

const APP_HOOK_SCOPE = "app";

function create_app_hook_keys() {
  return {
    PRE_LOAD: "APP_PRE_LOAD",
    POST_LOAD: "APP_POST_LOAD"
  };
}

function create_app_hook_timestamp_keys() {
  return {
    PRE_LOAD: "app_pre_loaded_at",
    POST_LOAD: "app_post_loaded_at"
  };
}

const APP_HOOK_KEYS = Object.freeze(create_app_hook_keys());
const APP_HOOK_TIMESTAMP_KEYS = Object.freeze(create_app_hook_timestamp_keys());

function create_app_hook_spec(key, required) {
  return Object.freeze({
    key,
    scope: APP_HOOK_SCOPE,
    required
  });
}

function create_app_hook_result(ctx, timestamp_key) {
  return {
    ...ctx,
    [timestamp_key]: new Date().toISOString()
  };
}

function create_app_hook_runner(hook_key, timestamp_key, required, run_logic = (ctx) => ctx) {
  const hook_spec = create_app_hook_spec(hook_key, required);
  function run_hook(ctx) {
    const next_ctx = typeof run_logic === "function" ? run_logic(ctx) : ctx;
    return create_app_hook_result(next_ctx, timestamp_key);
  }
  return Object.freeze({
    hook_spec,
    run_hook
  });
}

module.exports = {
  APP_HOOK_SCOPE,
  APP_HOOK_KEYS,
  APP_HOOK_TIMESTAMP_KEYS,
  create_app_hook_spec,
  create_app_hook_result,
  create_app_hook_runner
};
