export const PAGE_PRE_LOAD_HOOK_SPEC = Object.freeze({
  key: "STATISTICS_PAGE_PRE_LOAD",
  scope: "page",
  required: true
});

export function run_page_pre_load(ctx = {}) {
  return {
    ...ctx,
    statistics_page_pre_loaded_at: new Date().toISOString()
  };
}
