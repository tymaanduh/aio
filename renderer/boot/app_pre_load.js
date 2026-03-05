import { RUNTIME_GROUP_REGISTRY } from "../core/runtime_registry.js";

export const APP_PRE_LOAD_HOOK_SPEC = Object.freeze({
  key: "APP_PRE_LOAD",
  scope: "app",
  required: true
});

export function run_app_pre_load(ctx = {}) {
  return {
    ...ctx,
    runtime_groups: RUNTIME_GROUP_REGISTRY,
    app_pre_loaded_at: new Date().toISOString()
  };
}
