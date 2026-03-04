export const WINDOW_PRE_LOAD_HOOK_SPEC = Object.freeze({
  key: "MAIN_WINDOW_PRE_LOAD",
  scope: "window",
  required: true
});

export function run_window_pre_load(ctx = {}) {
  return {
    ...ctx,
    main_window_pre_loaded_at: new Date().toISOString()
  };
}
