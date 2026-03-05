export const CONTROL_PRE_LOAD_HOOK_SPEC = Object.freeze({
  key: "UNIVERSE_CANVAS_CONTROL_PRE_LOAD",
  scope: "control",
  required: true
});

export function run_control_pre_load(ctx = {}) {
  return {
    ...ctx,
    universe_canvas_control_pre_loaded_at: new Date().toISOString()
  };
}
