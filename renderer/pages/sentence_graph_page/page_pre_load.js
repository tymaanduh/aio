export const PAGE_PRE_LOAD_HOOK_SPEC = Object.freeze({
  key: "SENTENCE_GRAPH_PAGE_PRE_LOAD",
  scope: "page",
  required: true
});

export function run_page_pre_load(ctx = {}) {
  return {
    ...ctx,
    sentence_graph_page_pre_loaded_at: new Date().toISOString()
  };
}
