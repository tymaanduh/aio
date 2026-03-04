export const WINDOW_POST_LOAD_HOOK_SPEC = Object.freeze({
  key: "MAIN_WINDOW_POST_LOAD",
  scope: "window",
  required: false
});

export function run_window_post_load(ctx = {}) {
  return {
    ...ctx,
    main_window_post_loaded_at: new Date().toISOString()
  };
}
