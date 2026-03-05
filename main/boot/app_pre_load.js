"use strict";

const { APP_HOOK_KEYS, APP_HOOK_TIMESTAMP_KEYS, create_app_hook_runner } = require("./app_hook_shared.js");

function run_app_gpu_pre_load(ctx) {
  if (ctx?.gpu_service && typeof ctx.gpu_service.configure_gpu_mode === "function") {
    ctx.gpu_service.configure_gpu_mode();
  }
}

function run_app_pre_load_logic(ctx) {
  run_app_gpu_pre_load(ctx);
  return ctx;
}

const APP_PRE_LOAD_HOOK = create_app_hook_runner(
  APP_HOOK_KEYS.PRE_LOAD,
  APP_HOOK_TIMESTAMP_KEYS.PRE_LOAD,
  true,
  run_app_pre_load_logic
);

const APP_PRE_LOAD_HOOK_SPEC = APP_PRE_LOAD_HOOK.hook_spec;
const run_app_pre_load = APP_PRE_LOAD_HOOK.run_hook;

module.exports = {
  APP_PRE_LOAD_HOOK_SPEC,
  run_app_pre_load
};
