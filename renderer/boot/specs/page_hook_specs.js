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
import { WINDOW_REGISTRY } from "./app_hook_specs.js";

import { run_page_pre_load as run_workbench_page_pre_load } from "../../pages/workbench_page/page_pre_load.js";
import { run_page_post_load as run_workbench_page_post_load } from "../../pages/workbench_page/page_post_load.js";
import { run_page_pre_load as run_sentence_graph_page_pre_load } from "../../pages/sentence_graph_page/page_pre_load.js";
import { run_page_post_load as run_sentence_graph_page_post_load } from "../../pages/sentence_graph_page/page_post_load.js";
import { run_page_pre_load as run_statistics_page_pre_load } from "../../pages/statistics_page/page_pre_load.js";
import { run_page_post_load as run_statistics_page_post_load } from "../../pages/statistics_page/page_post_load.js";
import { run_page_pre_load as run_universe_page_pre_load } from "../../pages/universe_page/page_pre_load.js";
import { run_page_post_load as run_universe_page_post_load } from "../../pages/universe_page/page_post_load.js";

const T = TEXT_TERM;
const PATH = (...tokens) => text_path(...tokens);
const PATH_LIST = (rows) => text_path_list(rows);
const TXT_LIST = (...tokens) => text_list(...tokens);
const TAG_LIST = (...tokens) => text_tags(...tokens);
const DESC = (desc_key, fallback = "") => text_desc(desc_key, fallback);
const HOOK_KEY = (...tokens) => text_hook_key(...tokens);

export const PAGE_PRE_LOAD_BINDINGS = Object.freeze([
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
      data_structures: TXT_LIST(PATH(T.GROUP_APP, T.STATE_SLOT, T.ENTRIES), PATH(T.WINDOW, T.DICTIONARY_STATS_WORKER)),
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
      data_structures: TXT_LIST(T.GROUP_UNI, T.GROUP_UNI_FX, PATH(T.WINDOW, T.DICTIONARY_UNIVERSE_GRAPHICS_ENGINE)),
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

export const PAGE_POST_LOAD_BINDINGS = Object.freeze([
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
      linked_objects_after: PATH_LIST([[T.WINDOW, T.DICTIONARY_STATS_WORKER, T.POST_MESSAGE]]),
      data_structures: TXT_LIST(PATH(T.GROUP_DOM, T.STATS_LIST), PATH(T.GROUP_RT, T.STATS_WORKER_TASK)),
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
      data_structures: TXT_LIST(PATH(T.GROUP_UNI, T.GRAPH), PATH(T.GROUP_UNI, T.SELECTION), PATH(T.GROUP_UNI, T.PATH)),
      tags: TAG_LIST(PAGE_REGISTRY.UNIVERSE, T.GRAPH, T.POST_LOAD)
    })
  })
]);
