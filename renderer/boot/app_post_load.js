export const APP_POST_LOAD_HOOK_SPEC = Object.freeze({
  key: "APP_POST_LOAD",
  scope: "app",
  required: false
});

export function run_app_post_load(ctx = {}) {
  return {
    ...ctx,
    app_post_loaded_at: new Date().toISOString()
  };
}
