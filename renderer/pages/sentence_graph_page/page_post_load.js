export const PAGE_POST_LOAD_HOOK_SPEC = Object.freeze({
  key: "SENTENCE_GRAPH_PAGE_POST_LOAD",
  scope: "page",
  required: false
});

export function run_page_post_load(ctx = {}) {
  return {
    ...ctx,
    sentence_graph_page_post_loaded_at: new Date().toISOString()
  };
}
