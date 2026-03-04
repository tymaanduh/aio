export const CONTROL_POST_LOAD_HOOK_SPEC = Object.freeze({
  key: "GRAPH_CONTROL_POST_LOAD",
  scope: "control",
  required: false
});

export function run_control_post_load(ctx = {}) {
  return {
    ...ctx,
    graph_control_post_loaded_at: new Date().toISOString()
  };
}
