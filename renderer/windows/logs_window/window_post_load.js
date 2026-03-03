export const WINDOW_POST_LOAD_HOOK_SPEC = Object.freeze({
  key: "LOGS_WINDOW_POST_LOAD",
  scope: "window",
  required: false
});

export function run_window_post_load(ctx = {}) {
  return {
    ...ctx,
    logs_window_post_loaded_at: new Date().toISOString()
  };
}
