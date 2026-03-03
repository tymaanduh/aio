"use strict";

const DATA_HOOK_SCOPE = "data";

const DATA_HOOK_KEYS = Object.freeze({
  PRE_LOAD: "DATA_PRE_LOAD",
  POST_LOAD: "DATA_POST_LOAD"
});

const DATA_HOOK_TIMESTAMP_KEYS = Object.freeze({
  PRE_LOAD: "loaded_at",
  POST_LOAD: "loaded_at"
});

function create_data_hook_spec(key, required) {
  return Object.freeze({
    key,
    scope: DATA_HOOK_SCOPE,
    required
  });
}

function create_data_hook_result(timestamp_key, fields = {}) {
  return {
    ok: true,
    [timestamp_key]: new Date().toISOString(),
    ...fields
  };
}

function create_data_hook_runner(hook_key, timestamp_key, required, run_logic = async () => ({})) {
  const hook_spec = create_data_hook_spec(hook_key, required);
  async function run_hook(ctx) {
    const fields = typeof run_logic === "function" ? await run_logic(ctx) : {};
    return create_data_hook_result(timestamp_key, fields && typeof fields === "object" ? fields : {});
  }
  return Object.freeze({
    hook_spec,
    run_hook
  });
}

module.exports = {
  DATA_HOOK_SCOPE,
  DATA_HOOK_KEYS,
  DATA_HOOK_TIMESTAMP_KEYS,
  create_data_hook_spec,
  create_data_hook_result,
  create_data_hook_runner
};
