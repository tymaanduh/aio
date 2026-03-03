import { run_app_pre_load } from "./app_pre_load.js";
import { run_app_post_load } from "./app_post_load.js";
import { PATTERN_HOOK_SCOPE } from "../core/pattern_registry.js";
import { PAGE_REGISTRY } from "../core/page_registry.js";
import {
  TEXT_TERM,
  text_desc,
  text_hook_key,
  text_list,
  text_path,
  text_path_list,
  text_tags
} from "../core/text_dictionary.js";
import {
  create_load_hook_api,
  ensure_load_hook_registry,
  publish_load_hook_api,
  register_post_load_hook,
  register_pre_load_hook
} from "../core/load_hook_registry.js";

import { run_page_pre_load as run_workbench_page_pre_load } from "../pages/workbench_page/page_pre_load.js";
import { run_page_post_load as run_workbench_page_post_load } from "../pages/workbench_page/page_post_load.js";
import { run_page_pre_load as run_sentence_graph_page_pre_load } from "../pages/sentence_graph_page/page_pre_load.js";
import { run_page_post_load as run_sentence_graph_page_post_load } from "../pages/sentence_graph_page/page_post_load.js";
import { run_page_pre_load as run_statistics_page_pre_load } from "../pages/statistics_page/page_pre_load.js";
import { run_page_post_load as run_statistics_page_post_load } from "../pages/statistics_page/page_post_load.js";
import { run_page_pre_load as run_universe_page_pre_load } from "../pages/universe_page/page_pre_load.js";
import { run_page_post_load as run_universe_page_post_load } from "../pages/universe_page/page_post_load.js";

import { run_control_pre_load as run_tree_control_pre_load } from "../controls/tree_control/control_pre_load.js";
import { run_control_post_load as run_tree_control_post_load } from "../controls/tree_control/control_post_load.js";
import { run_control_pre_load as run_graph_control_pre_load } from "../controls/graph_control/control_pre_load.js";
import { run_control_post_load as run_graph_control_post_load } from "../controls/graph_control/control_post_load.js";
import { run_control_pre_load as run_universe_canvas_control_pre_load } from "../controls/universe_canvas_control/control_pre_load.js";
import { run_control_post_load as run_universe_canvas_control_post_load } from "../controls/universe_canvas_control/control_post_load.js";
import { run_control_pre_load as run_command_palette_control_pre_load } from "../controls/command_palette_control/control_pre_load.js";
import { run_control_post_load as run_command_palette_control_post_load } from "../controls/command_palette_control/control_post_load.js";

const T = TEXT_TERM;
const PATH = (...tokens) => text_path(...tokens);
const PATH_LIST = (rows) => text_path_list(rows);
const TXT_LIST = (...tokens) => text_list(...tokens);
const TAG_LIST = (...tokens) => text_tags(...tokens);
const DESC = (desc_key, fallback = "") => text_desc(desc_key, fallback);
const HOOK_KEY = (...tokens) => text_hook_key(...tokens);

const WINDOW_REGISTRY = Object.freeze({
  MAIN: T.MAIN_WINDOW,
  LOGS: T.LOGS_WINDOW
});

const CONTROL_REGISTRY = Object.freeze({
  TREE: T.TREE_CONTROL,
  GRAPH: T.GRAPH_CONTROL,
  UNIVERSE_CANVAS: T.UNIVERSE_CANVAS_CONTROL,
  COMMAND_PALETTE: T.COMMAND_PALETTE_CONTROL
});

const APP_PRE_LOAD_HOOK_ENTRY = Object.freeze({
  key: HOOK_KEY(T.APP, T.PRE_LOAD),
  scope: PATTERN_HOOK_SCOPE.APP,
  required: true,
  connectors_before: PATH_LIST([
    [T.WINDOW, T.SHELL],
    [T.RENDERER, T.BOOT, T.APP, T.PRE_LOAD],
    [T.RENDERER, T.BOOT, T.APP, T.BOOTSTRAP]
  ]),
  data_structures: TXT_LIST(
    T.RUNTIME_GROUP_REGISTRY,
    PATH(T.WINDOW, T.APP_API),
    PATH(T.WINDOW, T.PAGE)
  ),
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

const APP_POST_LOAD_HOOK_ENTRY = Object.freeze({
  key: HOOK_KEY(T.APP, T.POST_LOAD),
  scope: PATTERN_HOOK_SCOPE.APP,
  required: false,
  linked_objects_after: PATH_LIST([
    [T.WINDOW, T.PAGE, T.HOOK],
    [T.WINDOW, T.APP_LOAD_HOOK],
    [T.WINDOW, T.RENDERER_LOAD_HOOK_CTX]
  ]),
  data_structures: TXT_LIST(
    T.LOAD_HOOK_REGISTRY,
    T.HOOK_TRACE
  ),
  tags: TAG_LIST(T.APP, T.BOOTSTRAP, T.POST_LOAD)
});

const PAGE_PRE_LOAD_BINDINGS = Object.freeze([
  Object.freeze({
    runner: run_workbench_page_pre_load,
    hook_spec: Object.freeze({
      key: HOOK_KEY(PAGE_REGISTRY.WORKBENCH, T.PRE_LOAD),
      scope: PATTERN_HOOK_SCOPE.PAGE,
      required: true,
      window_key: WINDOW_REGISTRY.MAIN,
      page_key: PAGE_REGISTRY.WORKBENCH,
      connectors_before: PATH_LIST([
        [T.WINDOW, T.MAIN_WINDOW],
        [T.WINDOW, T.MAIN_WINDOW, T.PAGE, PAGE_REGISTRY.WORKBENCH],
        [T.WINDOW, T.MAIN_WINDOW, T.AUTH_GATE]
      ]),
      data_structures: TXT_LIST(
        T.GROUP_APP,
        T.GROUP_RT,
        T.GROUP_DOM,
        PATH(T.GROUP_PAGE, T.TREE),
        PATH(T.GROUP_PAGE, T.SENTENCE),
        PATH(T.GROUP_PAGE, T.UNIVERSE)
      ),
      argument_specs: [
        {
          name: T.AUTH_MODE_ARG,
          type: "string",
          source: PATH(T.GROUP_RT, T.AUTH_MODE),
          required: false,
          description: DESC("AUTH_MODE")
        },
        {
          name: T.AUTH_USERNAME_ARG,
          type: "string",
          source: PATH(T.GROUP_DOM, T.AUTH_USERNAME_INPUT, T.VALUE),
          required: false,
          description: DESC("AUTH_USERNAME")
        },
        {
          name: T.AUTH_PASSWORD_ARG,
          type: "string",
          source: PATH(T.GROUP_DOM, T.AUTH_PASSWORD_INPUT, T.VALUE),
          required: false,
          description: DESC("AUTH_PASSWORD")
        },
        {
          name: T.SELECTED_ENTRY_ID_ARG,
          type: "string",
          source: PATH(T.GROUP_APP, T.STATE_SLOT, T.SELECTED_ENTRY_ID),
          required: false,
          description: DESC("SELECTED_ENTRY_ID")
        }
      ],
      tags: TAG_LIST(PAGE_REGISTRY.WORKBENCH, T.AUTH, T.LOGIN, T.ENTRY, T.PRE_LOAD)
    })
  }),
  Object.freeze({
    runner: run_sentence_graph_page_pre_load,
    hook_spec: Object.freeze({
      key: HOOK_KEY(PAGE_REGISTRY.SENTENCE_GRAPH, T.PRE_LOAD),
      scope: PATTERN_HOOK_SCOPE.PAGE,
      required: true,
      window_key: WINDOW_REGISTRY.MAIN,
      page_key: PAGE_REGISTRY.SENTENCE_GRAPH,
      connectors_before: PATH_LIST([
        [T.WINDOW, T.MAIN_WINDOW],
        [T.WINDOW, T.MAIN_WINDOW, T.PAGE, PAGE_REGISTRY.SENTENCE_GRAPH]
      ]),
      data_structures: TXT_LIST(
        PATH(T.GROUP_APP, T.STATE_SLOT, T.SENTENCE_GRAPH),
        PATH(T.GROUP_PAGE, T.SENTENCE),
        PATH(T.GROUP_DOM, T.GRAPH_CANVAS)
      ),
      argument_specs: [
        {
          name: T.SELECTED_GRAPH_NODE_ID_ARG,
          type: "string",
          source: PATH(T.GROUP_APP, T.STATE_SLOT, T.SELECTED_GRAPH_NODE_ID),
          required: false,
          description: DESC("SELECTED_GRAPH_NODE_ID")
        }
      ],
      tags: TAG_LIST(PAGE_REGISTRY.SENTENCE_GRAPH, T.GRAPH, T.PRE_LOAD)
    })
  }),
  Object.freeze({
    runner: run_statistics_page_pre_load,
    hook_spec: Object.freeze({
      key: HOOK_KEY(PAGE_REGISTRY.STATISTICS, T.PRE_LOAD),
      scope: PATTERN_HOOK_SCOPE.PAGE,
      required: true,
      window_key: WINDOW_REGISTRY.MAIN,
      page_key: PAGE_REGISTRY.STATISTICS,
      connectors_before: PATH_LIST([
        [T.WINDOW, T.MAIN_WINDOW],
        [T.WINDOW, T.MAIN_WINDOW, T.PAGE, PAGE_REGISTRY.STATISTICS]
      ]),
      data_structures: TXT_LIST(
        PATH(T.GROUP_APP, T.STATE_SLOT, T.ENTRIES),
        PATH(T.WINDOW, T.DICTIONARY_STATS_WORKER)
      ),
      argument_specs: [
        {
          name: T.STATS_ENTRY_COUNT_ARG,
          type: "number",
          source: PATH(T.GROUP_APP, T.STATE_SLOT, T.ENTRIES, T.LENGTH),
          required: false,
          description: DESC("STATS_ENTRY_COUNT")
        }
      ],
      tags: TAG_LIST(PAGE_REGISTRY.STATISTICS, T.PRE_LOAD)
    })
  }),
  Object.freeze({
    runner: run_universe_page_pre_load,
    hook_spec: Object.freeze({
      key: HOOK_KEY(PAGE_REGISTRY.UNIVERSE, T.PRE_LOAD),
      scope: PATTERN_HOOK_SCOPE.PAGE,
      required: true,
      window_key: WINDOW_REGISTRY.MAIN,
      page_key: PAGE_REGISTRY.UNIVERSE,
      connectors_before: PATH_LIST([
        [T.WINDOW, T.MAIN_WINDOW],
        [T.WINDOW, T.MAIN_WINDOW, T.PAGE, PAGE_REGISTRY.UNIVERSE]
      ]),
      data_structures: TXT_LIST(
        T.GROUP_UNI,
        T.GROUP_UNI_FX,
        PATH(T.WINDOW, T.DICTIONARY_UNIVERSE_GRAPHICS_ENGINE)
      ),
      argument_specs: [
        {
          name: T.UNIVERSE_FILTER_TEXT_ARG,
          type: "string",
          source: PATH(T.GROUP_DOM, T.UNIVERSE_FILTER_INPUT, T.VALUE),
          required: false,
          description: DESC("UNIVERSE_FILTER_TEXT")
        },
        {
          name: T.UNIVERSE_MAX_NODES_ARG,
          type: "number",
          source: PATH(T.GROUP_UNI, T.CONFIG, T.MAX_NODES),
          required: false,
          description: DESC("UNIVERSE_MAX_NODES")
        }
      ],
      tags: TAG_LIST(PAGE_REGISTRY.UNIVERSE, T.GRAPH, T.PRE_LOAD)
    })
  })
]);

const PAGE_POST_LOAD_BINDINGS = Object.freeze([
  Object.freeze({
    runner: run_workbench_page_post_load,
    hook_spec: Object.freeze({
      key: HOOK_KEY(PAGE_REGISTRY.WORKBENCH, T.POST_LOAD),
      scope: PATTERN_HOOK_SCOPE.PAGE,
      required: false,
      window_key: WINDOW_REGISTRY.MAIN,
      page_key: PAGE_REGISTRY.WORKBENCH,
      linked_objects_after: PATH_LIST([
        [T.WINDOW, T.APP_API, T.AUTH, T.LOGIN],
        [T.WINDOW, T.APP_API, T.AUTH, T.CREATE_ACCOUNT],
        [T.WINDOW, T.APP_API, T.DATA, T.SAVE],
        [T.WINDOW, T.PAGE, T.TREE, T.REQ_RENDER]
      ]),
      data_structures: TXT_LIST(
        PATH(T.GROUP_DOM, T.AUTH_FORM),
        PATH(T.GROUP_DOM, T.WORD_INPUT),
        PATH(T.GROUP_DOM, T.DEFINITION_INPUT)
      ),
      tags: TAG_LIST(PAGE_REGISTRY.WORKBENCH, T.AUTH, T.LOGIN, T.POST_LOAD)
    })
  }),
  Object.freeze({
    runner: run_sentence_graph_page_post_load,
    hook_spec: Object.freeze({
      key: HOOK_KEY(PAGE_REGISTRY.SENTENCE_GRAPH, T.POST_LOAD),
      scope: PATTERN_HOOK_SCOPE.PAGE,
      required: false,
      window_key: WINDOW_REGISTRY.MAIN,
      page_key: PAGE_REGISTRY.SENTENCE_GRAPH,
      linked_objects_after: PATH_LIST([
        [T.WINDOW, T.PAGE, T.SENTENCE, T.REQ_RENDER],
        [T.WINDOW, T.PAGE, T.SENTENCE, T.GET_NODE]
      ]),
      data_structures: TXT_LIST(
        PATH(T.GROUP_APP, T.STATE_SLOT, T.SENTENCE_GRAPH, T.NODES),
        PATH(T.GROUP_APP, T.STATE_SLOT, T.SENTENCE_GRAPH, T.LINKS)
      ),
      tags: TAG_LIST(PAGE_REGISTRY.SENTENCE_GRAPH, T.GRAPH, T.POST_LOAD)
    })
  }),
  Object.freeze({
    runner: run_statistics_page_post_load,
    hook_spec: Object.freeze({
      key: HOOK_KEY(PAGE_REGISTRY.STATISTICS, T.POST_LOAD),
      scope: PATTERN_HOOK_SCOPE.PAGE,
      required: false,
      window_key: WINDOW_REGISTRY.MAIN,
      page_key: PAGE_REGISTRY.STATISTICS,
      linked_objects_after: PATH_LIST([
        [T.WINDOW, T.DICTIONARY_STATS_WORKER, T.POST_MESSAGE]
      ]),
      data_structures: TXT_LIST(
        PATH(T.GROUP_DOM, T.STATS_LIST),
        PATH(T.GROUP_RT, T.STATS_WORKER_TASK)
      ),
      tags: TAG_LIST(PAGE_REGISTRY.STATISTICS, T.POST_LOAD)
    })
  }),
  Object.freeze({
    runner: run_universe_page_post_load,
    hook_spec: Object.freeze({
      key: HOOK_KEY(PAGE_REGISTRY.UNIVERSE, T.POST_LOAD),
      scope: PATTERN_HOOK_SCOPE.PAGE,
      required: false,
      window_key: WINDOW_REGISTRY.MAIN,
      page_key: PAGE_REGISTRY.UNIVERSE,
      linked_objects_after: PATH_LIST([
        [T.WINDOW, T.PAGE, T.UNIVERSE, T.REQ_RENDER],
        [T.WINDOW, T.APP_API, T.UNIVERSE, T.LOAD_CACHE],
        [T.WINDOW, T.APP_API, T.UNIVERSE, T.SAVE_CACHE]
      ]),
      data_structures: TXT_LIST(
        PATH(T.GROUP_UNI, T.GRAPH),
        PATH(T.GROUP_UNI, T.SELECTION),
        PATH(T.GROUP_UNI, T.PATH)
      ),
      tags: TAG_LIST(PAGE_REGISTRY.UNIVERSE, T.GRAPH, T.POST_LOAD)
    })
  })
]);

const CONTROL_PRE_LOAD_BINDINGS = Object.freeze([
  Object.freeze({
    runner: run_tree_control_pre_load,
    hook_spec: Object.freeze({
      key: HOOK_KEY(CONTROL_REGISTRY.TREE, T.PRE_LOAD),
      scope: PATTERN_HOOK_SCOPE.CONTROL,
      required: true,
      window_key: WINDOW_REGISTRY.MAIN,
      page_key: PAGE_REGISTRY.WORKBENCH,
      control_key: CONTROL_REGISTRY.TREE,
      connectors_before: PATH_LIST([
        [T.WINDOW, T.MAIN_WINDOW, T.PAGE, PAGE_REGISTRY.WORKBENCH],
        [T.WINDOW, T.MAIN_WINDOW, T.PAGE, PAGE_REGISTRY.WORKBENCH, T.CONTROL, CONTROL_REGISTRY.TREE]
      ]),
      data_structures: TXT_LIST(
        PATH(T.GROUP_DOM, T.TREE_VIEW),
        PATH(T.GROUP_APP, T.STATE_SLOT, T.LABELS),
        PATH(T.GROUP_APP, T.STATE_SLOT, T.ENTRIES)
      ),
      argument_specs: [
        {
          name: T.TREE_SEARCH_ARG,
          type: "string",
          source: PATH(T.GROUP_APP, T.STATE_SLOT, T.TREE_SEARCH),
          required: false,
          description: DESC("TREE_SEARCH")
        },
        {
          name: T.TREE_LABEL_FILTER_ARG,
          type: "string",
          source: PATH(T.GROUP_APP, T.STATE_SLOT, T.TREE_LABEL_FILTER),
          required: false,
          description: DESC("TREE_LABEL_FILTER")
        }
      ],
      tags: TAG_LIST(T.TREE, T.CONTROL, T.PRE_LOAD)
    })
  }),
  Object.freeze({
    runner: run_graph_control_pre_load,
    hook_spec: Object.freeze({
      key: HOOK_KEY(CONTROL_REGISTRY.GRAPH, T.PRE_LOAD),
      scope: PATTERN_HOOK_SCOPE.CONTROL,
      required: true,
      window_key: WINDOW_REGISTRY.MAIN,
      page_key: PAGE_REGISTRY.SENTENCE_GRAPH,
      control_key: CONTROL_REGISTRY.GRAPH,
      connectors_before: PATH_LIST([
        [T.WINDOW, T.MAIN_WINDOW, T.PAGE, PAGE_REGISTRY.SENTENCE_GRAPH],
        [T.WINDOW, T.MAIN_WINDOW, T.PAGE, PAGE_REGISTRY.SENTENCE_GRAPH, T.CONTROL, CONTROL_REGISTRY.GRAPH]
      ]),
      data_structures: TXT_LIST(
        PATH(T.GROUP_APP, T.STATE_SLOT, T.SENTENCE_GRAPH),
        PATH(T.GROUP_APP, T.STATE_SLOT, T.SELECTED_GRAPH_NODE_ID)
      ),
      argument_specs: [
        {
          name: T.GRAPH_LOCK_ENABLED_ARG,
          type: "boolean",
          source: PATH(T.GROUP_APP, T.STATE_SLOT, T.GRAPH_LOCK_ENABLED),
          required: false,
          description: DESC("GRAPH_LOCK_ENABLED")
        }
      ],
      tags: TAG_LIST(T.GRAPH, T.CONTROL, T.PRE_LOAD)
    })
  }),
  Object.freeze({
    runner: run_universe_canvas_control_pre_load,
    hook_spec: Object.freeze({
      key: HOOK_KEY(CONTROL_REGISTRY.UNIVERSE_CANVAS, T.PRE_LOAD),
      scope: PATTERN_HOOK_SCOPE.CONTROL,
      required: true,
      window_key: WINDOW_REGISTRY.MAIN,
      page_key: PAGE_REGISTRY.UNIVERSE,
      control_key: CONTROL_REGISTRY.UNIVERSE_CANVAS,
      connectors_before: PATH_LIST([
        [T.WINDOW, T.MAIN_WINDOW, T.PAGE, PAGE_REGISTRY.UNIVERSE],
        [T.WINDOW, T.MAIN_WINDOW, T.PAGE, PAGE_REGISTRY.UNIVERSE, T.CONTROL, CONTROL_REGISTRY.UNIVERSE_CANVAS]
      ]),
      data_structures: TXT_LIST(
        PATH(T.GROUP_UNI, T.CANVAS),
        PATH(T.GROUP_UNI, T.VIEW),
        PATH(T.GROUP_UNI, T.GRAPH)
      ),
      argument_specs: [
        {
          name: T.UNIVERSE_ZOOM_ARG,
          type: "number",
          source: PATH(T.GROUP_UNI, T.VIEW, T.ZOOM),
          required: false,
          description: DESC("UNIVERSE_ZOOM")
        }
      ],
      tags: TAG_LIST(T.UNIVERSE, T.CANVAS, T.CONTROL, T.PRE_LOAD)
    })
  }),
  Object.freeze({
    runner: run_command_palette_control_pre_load,
    hook_spec: Object.freeze({
      key: HOOK_KEY(CONTROL_REGISTRY.COMMAND_PALETTE, T.PRE_LOAD),
      scope: PATTERN_HOOK_SCOPE.CONTROL,
      required: true,
      window_key: WINDOW_REGISTRY.MAIN,
      page_key: PAGE_REGISTRY.WORKBENCH,
      control_key: CONTROL_REGISTRY.COMMAND_PALETTE,
      connectors_before: PATH_LIST([
        [T.WINDOW, T.MAIN_WINDOW, T.PAGE, PAGE_REGISTRY.WORKBENCH],
        [T.WINDOW, T.MAIN_WINDOW, T.PAGE, PAGE_REGISTRY.WORKBENCH, T.CONTROL, CONTROL_REGISTRY.COMMAND_PALETTE]
      ]),
      data_structures: TXT_LIST(
        PATH(T.GROUP_RT, T.CMD_ITEMS),
        PATH(T.GROUP_DOM, T.COMMAND_PALETTE_INPUT),
        PATH(T.GROUP_DOM, T.COMMAND_PALETTE_LIST)
      ),
      argument_specs: [
        {
          name: T.COMMAND_PALETTE_QUERY_ARG,
          type: "string",
          source: PATH(T.GROUP_DOM, T.COMMAND_PALETTE_INPUT, T.VALUE),
          required: false,
          description: DESC("COMMAND_PALETTE_QUERY")
        }
      ],
      tags: TAG_LIST(T.COMMAND_PALETTE_CONTROL, T.CONTROL, T.PRE_LOAD)
    })
  })
]);

const CONTROL_POST_LOAD_BINDINGS = Object.freeze([
  Object.freeze({
    runner: run_tree_control_post_load,
    hook_spec: Object.freeze({
      key: HOOK_KEY(CONTROL_REGISTRY.TREE, T.POST_LOAD),
      scope: PATTERN_HOOK_SCOPE.CONTROL,
      required: false,
      window_key: WINDOW_REGISTRY.MAIN,
      page_key: PAGE_REGISTRY.WORKBENCH,
      control_key: CONTROL_REGISTRY.TREE,
      linked_objects_after: PATH_LIST([
        [T.WINDOW, T.PAGE, T.TREE, T.REQ_RENDER],
        [T.WINDOW, T.PAGE, T.DICTIONARY, T.GET_ENTRIES_INDEX]
      ]),
      data_structures: TXT_LIST(
        PATH(T.GROUP_APP, T.STATE_SLOT, T.SELECTED_ENTRY_IDS),
        PATH(T.GROUP_APP, T.STATE_SLOT, T.EXPANDED_GROUPS)
      ),
      tags: TAG_LIST(T.TREE, T.CONTROL, T.POST_LOAD)
    })
  }),
  Object.freeze({
    runner: run_graph_control_post_load,
    hook_spec: Object.freeze({
      key: HOOK_KEY(CONTROL_REGISTRY.GRAPH, T.POST_LOAD),
      scope: PATTERN_HOOK_SCOPE.CONTROL,
      required: false,
      window_key: WINDOW_REGISTRY.MAIN,
      page_key: PAGE_REGISTRY.SENTENCE_GRAPH,
      control_key: CONTROL_REGISTRY.GRAPH,
      linked_objects_after: PATH_LIST([
        [T.WINDOW, T.PAGE, T.SENTENCE, T.REQ_RENDER],
        [T.WINDOW, T.PAGE, T.SENTENCE, T.GET_NODE]
      ]),
      data_structures: TXT_LIST(
        PATH(T.GROUP_APP, T.STATE_SLOT, T.SELECTED_GRAPH_NODE_ID),
        PATH(T.GROUP_APP, T.STATE_SLOT, T.SENTENCE_GRAPH)
      ),
      tags: TAG_LIST(T.GRAPH, T.CONTROL, T.POST_LOAD)
    })
  }),
  Object.freeze({
    runner: run_universe_canvas_control_post_load,
    hook_spec: Object.freeze({
      key: HOOK_KEY(CONTROL_REGISTRY.UNIVERSE_CANVAS, T.POST_LOAD),
      scope: PATTERN_HOOK_SCOPE.CONTROL,
      required: false,
      window_key: WINDOW_REGISTRY.MAIN,
      page_key: PAGE_REGISTRY.UNIVERSE,
      control_key: CONTROL_REGISTRY.UNIVERSE_CANVAS,
      linked_objects_after: PATH_LIST([
        [T.WINDOW, T.PAGE, T.UNIVERSE, T.REQ_RENDER],
        [T.WINDOW, T.PAGE, T.UNIVERSE, T.RENDER_SUMMARY],
        [T.WINDOW, T.PAGE, T.UNIVERSE, T.RENDER_CLUSTER]
      ]),
      data_structures: TXT_LIST(
        PATH(T.GROUP_UNI, T.PATH),
        PATH(T.GROUP_UNI, T.SELECTION),
        PATH(T.GROUP_UNI, T.CONFIG)
      ),
      tags: TAG_LIST(T.UNIVERSE, T.CANVAS, T.CONTROL, T.POST_LOAD)
    })
  }),
  Object.freeze({
    runner: run_command_palette_control_post_load,
    hook_spec: Object.freeze({
      key: HOOK_KEY(CONTROL_REGISTRY.COMMAND_PALETTE, T.POST_LOAD),
      scope: PATTERN_HOOK_SCOPE.CONTROL,
      required: false,
      window_key: WINDOW_REGISTRY.MAIN,
      page_key: PAGE_REGISTRY.WORKBENCH,
      control_key: CONTROL_REGISTRY.COMMAND_PALETTE,
      linked_objects_after: PATH_LIST([
        [T.WINDOW, T.PAGE, T.HOOK, T.GET_ARGUMENTS],
        [T.WINDOW, T.PAGE, T.HOOK, T.SEARCH]
      ]),
      data_structures: TXT_LIST(
        PATH(T.GROUP_RT, T.CMD_ITEMS),
        PATH(T.GROUP_RT, T.CMD_INDEX)
      ),
      tags: TAG_LIST(T.COMMAND_PALETTE_CONTROL, T.CONTROL, T.POST_LOAD)
    })
  })
]);

async function run_legacy_shell(window_scope) {
  await import("./legacy_module_loader.js");
  if (window_scope === WINDOW_REGISTRY.LOGS) {
    await import("../windows/logs_window/legacy_logs_bridge.js");
    return;
  }
  await import("../windows/main_window/legacy_renderer_bridge.js");
}

let ACTIVE_RENDERER_CTX = {};
const LOAD_HOOK_API = create_load_hook_api(() => ACTIVE_RENDERER_CTX);

function publish_renderer_ctx(ctx) {
  ACTIVE_RENDERER_CTX = ctx && typeof ctx === "object" ? ctx : {};
  globalThis.renderer_load_hook_ctx = ACTIVE_RENDERER_CTX;
  publish_load_hook_api(globalThis, LOAD_HOOK_API);
  return ACTIVE_RENDERER_CTX;
}

function append_hook_trace(ctx, label) {
  const trace = Array.isArray(ctx?.hook_trace) ? ctx.hook_trace.slice() : [];
  trace.push(String(label));
  return {
    ...ctx,
    hook_trace: trace
  };
}

function run_pre_load_bindings(ctx, bindings = []) {
  let next_ctx = ctx;
  (Array.isArray(bindings) ? bindings : []).forEach((binding) => {
    next_ctx = binding.runner(next_ctx);
    next_ctx = register_pre_load_hook(next_ctx, binding.hook_spec);
    next_ctx = append_hook_trace(next_ctx, `${binding.hook_spec.scope}.pre_load:${binding.hook_spec.key}`);
  });
  return next_ctx;
}

function run_post_load_bindings(ctx, bindings = []) {
  let next_ctx = ctx;
  (Array.isArray(bindings) ? bindings : []).forEach((binding) => {
    next_ctx = binding.runner(next_ctx);
    next_ctx = register_post_load_hook(next_ctx, binding.hook_spec);
    next_ctx = append_hook_trace(next_ctx, `${binding.hook_spec.scope}.post_load:${binding.hook_spec.key}`);
  });
  return next_ctx;
}

export function sync_renderer_hook_ctx(ctx = {}) {
  return publish_renderer_ctx(ensure_load_hook_registry(ctx));
}

export async function run_renderer_app_bootstrap(options = {}) {
  const input = options && typeof options === "object" ? options : {};
  let ctx = {
    ...input,
    window_scope: input.window_scope || WINDOW_REGISTRY.MAIN,
    hook_trace: Array.isArray(input.hook_trace) ? input.hook_trace.slice() : []
  };
  ctx = ensure_load_hook_registry(ctx);
  sync_renderer_hook_ctx(ctx);

  ctx = run_app_pre_load(ctx);
  ctx = register_pre_load_hook(ctx, APP_PRE_LOAD_HOOK_ENTRY);
  ctx = append_hook_trace(ctx, `${PATTERN_HOOK_SCOPE.APP}.${T.PRE_LOAD}:${APP_PRE_LOAD_HOOK_ENTRY.key}`);
  sync_renderer_hook_ctx(ctx);

  if (ctx.window_scope === WINDOW_REGISTRY.MAIN) {
    ctx = run_pre_load_bindings(ctx, PAGE_PRE_LOAD_BINDINGS);
    ctx = run_pre_load_bindings(ctx, CONTROL_PRE_LOAD_BINDINGS);
    sync_renderer_hook_ctx(ctx);
  }

  await run_legacy_shell(ctx.window_scope);

  if (ctx.window_scope === WINDOW_REGISTRY.MAIN) {
    ctx = run_post_load_bindings(ctx, CONTROL_POST_LOAD_BINDINGS);
    ctx = run_post_load_bindings(ctx, PAGE_POST_LOAD_BINDINGS);
    sync_renderer_hook_ctx(ctx);
  }

  ctx = run_app_post_load(ctx);
  ctx = register_post_load_hook(ctx, APP_POST_LOAD_HOOK_ENTRY);
  ctx = append_hook_trace(ctx, `${PATTERN_HOOK_SCOPE.APP}.${T.POST_LOAD}:${APP_POST_LOAD_HOOK_ENTRY.key}`);
  sync_renderer_hook_ctx(ctx);

  return ctx;
}
