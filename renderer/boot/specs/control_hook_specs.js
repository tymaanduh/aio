import { PATTERN_HOOK_SCOPE } from "../../core/pattern_registry.js";
import { PAGE_REGISTRY } from "../../core/page_registry.js";
import {
  TEXT_TERM,
  text_desc,
  text_hook_key,
  text_list,
  text_path,
  text_path_list,
  text_tags
} from "../../core/text_dictionary.js";
import { CONTROL_REGISTRY, WINDOW_REGISTRY } from "./app_hook_specs.js";

import { run_control_pre_load as run_tree_control_pre_load } from "../../controls/tree_control/control_pre_load.js";
import { run_control_post_load as run_tree_control_post_load } from "../../controls/tree_control/control_post_load.js";
import { run_control_pre_load as run_graph_control_pre_load } from "../../controls/graph_control/control_pre_load.js";
import { run_control_post_load as run_graph_control_post_load } from "../../controls/graph_control/control_post_load.js";
import { run_control_pre_load as run_universe_canvas_control_pre_load } from "../../controls/universe_canvas_control/control_pre_load.js";
import { run_control_post_load as run_universe_canvas_control_post_load } from "../../controls/universe_canvas_control/control_post_load.js";
import { run_control_pre_load as run_command_palette_control_pre_load } from "../../controls/command_palette_control/control_pre_load.js";
import { run_control_post_load as run_command_palette_control_post_load } from "../../controls/command_palette_control/control_post_load.js";

const T = TEXT_TERM;
const PATH = (...tokens) => text_path(...tokens);
const PATH_LIST = (rows) => text_path_list(rows);
const TXT_LIST = (...tokens) => text_list(...tokens);
const TAG_LIST = (...tokens) => text_tags(...tokens);
const DESC = (desc_key, fallback = "") => text_desc(desc_key, fallback);
const HOOK_KEY = (...tokens) => text_hook_key(...tokens);

export const CONTROL_PRE_LOAD_BINDINGS = Object.freeze([
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
      data_structures: TXT_LIST(PATH(T.GROUP_UNI, T.CANVAS), PATH(T.GROUP_UNI, T.VIEW), PATH(T.GROUP_UNI, T.GRAPH)),
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

export const CONTROL_POST_LOAD_BINDINGS = Object.freeze([
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
      data_structures: TXT_LIST(PATH(T.GROUP_UNI, T.PATH), PATH(T.GROUP_UNI, T.SELECTION), PATH(T.GROUP_UNI, T.CONFIG)),
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
      data_structures: TXT_LIST(PATH(T.GROUP_RT, T.CMD_ITEMS), PATH(T.GROUP_RT, T.CMD_INDEX)),
      tags: TAG_LIST(T.COMMAND_PALETTE_CONTROL, T.CONTROL, T.POST_LOAD)
    })
  })
]);
