import { run_window_pre_load } from "./window_pre_load.js";
import { run_window_post_load } from "./window_post_load.js";
import { PATTERN_HOOK_SCOPE } from "../../core/pattern_registry.js";
import {
  TEXT_TERM,
  text_desc,
  text_hook_key,
  text_list,
  text_path,
  text_path_list,
  text_tags
} from "../../core/text_dictionary.js";
import { register_post_load_hook, register_pre_load_hook } from "../../core/load_hook_registry.js";
import { run_renderer_app_bootstrap, sync_renderer_hook_ctx } from "../../boot/app_bootstrap.js";

const T = TEXT_TERM;
const PATH = (...tokens) => text_path(...tokens);
const PATH_LIST = (rows) => text_path_list(rows);
const TXT_LIST = (...tokens) => text_list(...tokens);
const TAG_LIST = (...tokens) => text_tags(...tokens);
const DESC = (desc_key, fallback = "") => text_desc(desc_key, fallback);
const HOOK_KEY = (...tokens) => text_hook_key(...tokens);

const WINDOW_PRE_LOAD_HOOK_ENTRY = Object.freeze({
  key: HOOK_KEY(T.LOGS_WINDOW, T.PRE_LOAD),
  scope: PATTERN_HOOK_SCOPE.WINDOW,
  required: true,
  window_key: T.LOGS_WINDOW,
  connectors_before: PATH_LIST([
    [T.RENDERER, T.VIEWS, T.LOGS_WINDOW, "html"],
    [T.RENDERER, T.WINDOWS, T.LOGS_WINDOW, T.WINDOW, T.SHELL]
  ]),
  data_structures: TXT_LIST(
    PATH(T.WINDOW, T.DOCUMENT),
    PATH(T.WINDOW, T.APP_API, T.RUNTIME_LOG)
  ),
  argument_specs: [
    {
      name: T.WINDOW_SCOPE,
      type: "string",
      source: PATH(T.WINDOW, T.SHELL, "ctx", T.WINDOW_SCOPE),
      required: true,
      description: DESC("WINDOW_SCOPE")
    }
  ],
  tags: TAG_LIST(T.WINDOW, T.LOGS_WINDOW, T.PRE_LOAD)
});

const WINDOW_POST_LOAD_HOOK_ENTRY = Object.freeze({
  key: HOOK_KEY(T.LOGS_WINDOW, T.POST_LOAD),
  scope: PATTERN_HOOK_SCOPE.WINDOW,
  required: false,
  window_key: T.LOGS_WINDOW,
  linked_objects_after: PATH_LIST([
    [T.WINDOW, T.APP_API, T.RUNTIME_LOG, "read"],
    [T.WINDOW, T.APP_API, T.RUNTIME_LOG, "subscribe"]
  ]),
  data_structures: TXT_LIST(T.LOAD_HOOK_REGISTRY, T.HOOK_TRACE),
  tags: TAG_LIST(T.WINDOW, T.LOGS_WINDOW, T.POST_LOAD)
});

async function run_logs_window_shell() {
  let ctx = {
    window_scope: T.LOGS_WINDOW,
    hook_trace: []
  };

  ctx = run_window_pre_load(ctx);
  ctx = register_pre_load_hook(ctx, WINDOW_PRE_LOAD_HOOK_ENTRY);
  sync_renderer_hook_ctx(ctx);

  ctx = await run_renderer_app_bootstrap(ctx);
  ctx = run_window_post_load(ctx);
  ctx = register_post_load_hook(ctx, WINDOW_POST_LOAD_HOOK_ENTRY);
  sync_renderer_hook_ctx(ctx);
}

run_logs_window_shell().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("logs_window shell bootstrap failed", error);
});
