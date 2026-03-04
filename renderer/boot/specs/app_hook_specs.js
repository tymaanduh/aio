import { PATTERN_HOOK_SCOPE } from "../../core/pattern_registry.js";
import { TEXT_TERM, text_desc, text_hook_key, text_list, text_path, text_path_list, text_tags } from "../../core/text_dictionary.js";

const T = TEXT_TERM;
const PATH = (...tokens) => text_path(...tokens);
const PATH_LIST = (rows) => text_path_list(rows);
const TXT_LIST = (...tokens) => text_list(...tokens);
const TAG_LIST = (...tokens) => text_tags(...tokens);
const DESC = (desc_key, fallback = "") => text_desc(desc_key, fallback);
const HOOK_KEY = (...tokens) => text_hook_key(...tokens);

export const WINDOW_REGISTRY = Object.freeze({
  MAIN: T.MAIN_WINDOW,
  LOGS: T.LOGS_WINDOW
});

export const CONTROL_REGISTRY = Object.freeze({
  TREE: T.TREE_CONTROL,
  GRAPH: T.GRAPH_CONTROL,
  UNIVERSE_CANVAS: T.UNIVERSE_CANVAS_CONTROL,
  COMMAND_PALETTE: T.COMMAND_PALETTE_CONTROL
});

export const APP_PRE_LOAD_HOOK_ENTRY = Object.freeze({
  key: HOOK_KEY(T.APP, T.PRE_LOAD),
  scope: PATTERN_HOOK_SCOPE.APP,
  required: true,
  connectors_before: PATH_LIST([
    [T.WINDOW, T.SHELL],
    [T.RENDERER, T.BOOT, T.APP, T.PRE_LOAD],
    [T.RENDERER, T.BOOT, T.APP, T.BOOTSTRAP]
  ]),
  data_structures: TXT_LIST(T.RUNTIME_GROUP_REGISTRY, PATH(T.WINDOW, T.APP_API), PATH(T.WINDOW, T.PAGE)),
  argument_specs: [
    {
      name: T.WINDOW_SCOPE,
      type: "string",
      source: PATH(T.WINDOW, T.SHELL, "ctx", T.WINDOW_SCOPE),
      required: true,
      description: DESC("CURRENT_WINDOW_SCOPE")
    }
  ],
  tags: TAG_LIST(T.APP, T.BOOTSTRAP, T.PRE_LOAD)
});

export const APP_POST_LOAD_HOOK_ENTRY = Object.freeze({
  key: HOOK_KEY(T.APP, T.POST_LOAD),
  scope: PATTERN_HOOK_SCOPE.APP,
  required: false,
  linked_objects_after: PATH_LIST([
    [T.WINDOW, T.PAGE, T.HOOK],
    [T.WINDOW, T.APP_LOAD_HOOK],
    [T.WINDOW, T.RENDERER_LOAD_HOOK_CTX]
  ]),
  data_structures: TXT_LIST(T.LOAD_HOOK_REGISTRY, T.HOOK_TRACE),
  tags: TAG_LIST(T.APP, T.BOOTSTRAP, T.POST_LOAD)
});
