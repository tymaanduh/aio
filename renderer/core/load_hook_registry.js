import { PATTERN_HOOK_SCOPE, PATTERN_LOAD_STAGE } from "./pattern_registry.js";
import { TEXT_TERM } from "./text_dictionary.js";

const T = TEXT_TERM;

const hookScopeOrder = Object.freeze({
  [PATTERN_HOOK_SCOPE.APP]: 0,
  [PATTERN_HOOK_SCOPE.WINDOW]: 1,
  [PATTERN_HOOK_SCOPE.PAGE]: 2,
  [PATTERN_HOOK_SCOPE.CONTROL]: 3
});

const hookStageOrder = Object.freeze({
  [PATTERN_LOAD_STAGE.PRE_LOAD]: 0,
  [PATTERN_LOAD_STAGE.POST_LOAD]: 1
});

function clean_text(value, fallback = "", max_length = 180) {
  if (typeof value !== "string") {
    return fallback;
  }
  const cleaned = value.trim().slice(0, max_length);
  return cleaned || fallback;
}

function normalize_string_array(values, max_length = 180) {
  const source = Array.isArray(values) ? values : [];
  const output = [];
  const seen = new Set();
  source.forEach((value) => {
    const item = clean_text(value, "", max_length);
    if (!item || seen.has(item)) {
      return;
    }
    seen.add(item);
    output.push(item);
  });
  return output;
}

function normalize_argument_spec(raw_spec, index = 0) {
  const source = raw_spec && typeof raw_spec === "object" ? raw_spec : {};
  return {
    name: clean_text(source.name, `arg_${index + 1}`, 120),
    type: clean_text(source.type, "any", 80),
    source: clean_text(source.source, "", 240),
    required: source.required !== false,
    description: clean_text(source.description, "", 260)
  };
}

function normalize_argument_specs(values) {
  const source = Array.isArray(values) ? values : [];
  return source.map((entry, index) => normalize_argument_spec(entry, index));
}

function normalize_scope(value) {
  const fallback = PATTERN_HOOK_SCOPE.APP;
  const scope = clean_text(value, fallback, 40).toLowerCase();
  return Object.values(PATTERN_HOOK_SCOPE).includes(scope) ? scope : fallback;
}

function normalize_stage(value) {
  const fallback = PATTERN_LOAD_STAGE.PRE_LOAD;
  const stage = clean_text(value, fallback, 40).toLowerCase();
  return Object.values(PATTERN_LOAD_STAGE).includes(stage) ? stage : fallback;
}

function normalize_hook_record(raw_spec, stage, order, default_window_scope = "") {
  const source = raw_spec && typeof raw_spec === "object" ? raw_spec : {};
  const scope = normalize_scope(source.scope);
  return {
    key: clean_text(source.key, `HOOK_${order + 1}`, 140),
    scope,
    stage: normalize_stage(stage),
    required: source.required !== false,
    order: Number.isInteger(order) ? order : 0,
    window_key: clean_text(source.window_key, clean_text(default_window_scope, "", 80), 80),
    page_key: clean_text(source.page_key, "", 80),
    control_key: clean_text(source.control_key, "", 80),
    connectors_before: normalize_string_array(source.connectors_before, 220),
    linked_objects_after: normalize_string_array(source.linked_objects_after, 220),
    data_structures: normalize_string_array(source.data_structures, 220),
    tags: normalize_string_array(source.tags, 80),
    argument_specs: normalize_argument_specs(source.argument_specs),
    created_at: new Date().toISOString()
  };
}

function normalize_registry(raw_registry) {
  const source = raw_registry && typeof raw_registry === "object" ? raw_registry : {};
  const records = Array.isArray(source.records) ? source.records.slice() : [];
  const next_record_order = Number.isInteger(source.next_record_order)
    ? source.next_record_order
    : records.length;
  return {
    records,
    next_record_order
  };
}

function compare_records(a, b) {
  return (a.order || 0) - (b.order || 0);
}

function compare_chain_records(a, b) {
  const stage_delta = (hookStageOrder[a.stage] || 0) - (hookStageOrder[b.stage] || 0);
  if (stage_delta !== 0) {
    return stage_delta;
  }
  const left_scope = hookScopeOrder[a.scope] || 0;
  const right_scope = hookScopeOrder[b.scope] || 0;
  const scope_delta = a.stage === PATTERN_LOAD_STAGE.POST_LOAD
    ? right_scope - left_scope
    : left_scope - right_scope;
  if (scope_delta !== 0) {
    return scope_delta;
  }
  return compare_records(a, b);
}

function string_match(value, expected) {
  const expected_text = clean_text(expected, "", 120);
  if (!expected_text) {
    return true;
  }
  return clean_text(value, "", 120) === expected_text;
}

function apply_record_filter(record, filter = {}) {
  if (!record || typeof record !== "object") {
    return false;
  }
  if (!string_match(record.scope, filter.scope)) {
    return false;
  }
  if (!string_match(record.stage, filter.stage)) {
    return false;
  }
  if (!string_match(record.window_key, filter.window_key)) {
    return false;
  }
  if (!string_match(record.page_key, filter.page_key)) {
    return false;
  }
  if (!string_match(record.control_key, filter.control_key)) {
    return false;
  }
  if (!string_match(record.key, filter.key)) {
    return false;
  }
  const tag = clean_text(filter.tag, "", 80);
  if (tag && !record.tags.includes(tag)) {
    return false;
  }
  return true;
}

function unique_by(rows, key_builder) {
  const output = [];
  const seen = new Set();
  (Array.isArray(rows) ? rows : []).forEach((row) => {
    const key = String(key_builder(row));
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    output.push(row);
  });
  return output;
}

function chain_match(record, path = {}) {
  const window_key = clean_text(path.window_key, "", 80);
  const page_key = clean_text(path.page_key, "", 80);
  const control_key = clean_text(path.control_key, "", 80);
  if (record.scope === PATTERN_HOOK_SCOPE.APP) {
    return true;
  }
  if (record.scope === PATTERN_HOOK_SCOPE.WINDOW) {
    return !window_key || record.window_key === window_key;
  }
  if (record.scope === PATTERN_HOOK_SCOPE.PAGE) {
    if (window_key && record.window_key !== window_key) {
      return false;
    }
    return !page_key || record.page_key === page_key;
  }
  if (record.scope === PATTERN_HOOK_SCOPE.CONTROL) {
    if (window_key && record.window_key !== window_key) {
      return false;
    }
    if (page_key && record.page_key !== page_key) {
      return false;
    }
    return !control_key || record.control_key === control_key;
  }
  return false;
}

function get_search_blob(record) {
  const argument_blob = record.argument_specs
    .map((entry) => `${entry.name} ${entry.type} ${entry.source} ${entry.description}`)
    .join(" ");
  return [
    record.key,
    record.scope,
    record.stage,
    record.window_key,
    record.page_key,
    record.control_key,
    argument_blob,
    ...record.connectors_before,
    ...record.linked_objects_after,
    ...record.data_structures,
    ...record.tags
  ]
    .join(" ")
    .toLowerCase();
}

function ensure_tree_window(tree, window_key) {
  const key = clean_text(window_key, "global_window", 80);
  if (!tree.windows[key]) {
    tree.windows[key] = {
      pre_load: [],
      post_load: [],
      pages: {}
    };
  }
  return tree.windows[key];
}

function ensure_tree_page(window_node, page_key) {
  const key = clean_text(page_key, "default_page", 80);
  if (!window_node.pages[key]) {
    window_node.pages[key] = {
      pre_load: [],
      post_load: [],
      controls: {}
    };
  }
  return window_node.pages[key];
}

export function ensure_load_hook_registry(ctx = {}) {
  const next_ctx = ctx && typeof ctx === "object" ? ctx : {};
  return {
    ...next_ctx,
    load_hook_registry: normalize_registry(next_ctx.load_hook_registry)
  };
}

export function register_load_hook(ctx = {}, stage = PATTERN_LOAD_STAGE.PRE_LOAD, hook_spec = {}) {
  const next_ctx = ensure_load_hook_registry(ctx);
  const registry = next_ctx.load_hook_registry;
  const record = normalize_hook_record(hook_spec, stage, registry.next_record_order, next_ctx.window_scope);
  return {
    ...next_ctx,
    load_hook_registry: {
      records: [...registry.records, record],
      next_record_order: registry.next_record_order + 1
    }
  };
}

export function register_pre_load_hook(ctx = {}, hook_spec = {}) {
  return register_load_hook(ctx, PATTERN_LOAD_STAGE.PRE_LOAD, hook_spec);
}

export function register_post_load_hook(ctx = {}, hook_spec = {}) {
  return register_load_hook(ctx, PATTERN_LOAD_STAGE.POST_LOAD, hook_spec);
}

export function list_load_hook_records(ctx = {}, filter = {}) {
  const registry = normalize_registry(ctx.load_hook_registry);
  return registry.records.filter((record) => apply_record_filter(record, filter)).sort(compare_records);
}

export function get_load_hook_chain(ctx = {}, path = {}) {
  return list_load_hook_records(ctx)
    .filter((record) => chain_match(record, path))
    .sort(compare_chain_records);
}

export function get_load_hook_arguments(ctx = {}, path = {}) {
  return build_load_hook_argument_payload(get_load_hook_chain(ctx, path));
}

function build_load_hook_argument_payload(chain = []) {
  const argument_specs = unique_by(
    chain.flatMap((record) =>
      record.argument_specs.map((entry) => ({
        ...entry,
        hook_key: record.key,
        hook_scope: record.scope,
        hook_stage: record.stage
      }))
    ),
    (entry) => `${entry.hook_key}:${entry.name}:${entry.source}`
  );
  const connectors_before = unique_by(
    chain.flatMap((record) => record.connectors_before),
    (entry) => entry
  );
  const linked_objects_after = unique_by(
    chain.flatMap((record) => record.linked_objects_after),
    (entry) => entry
  );
  const data_structures = unique_by(
    chain.flatMap((record) => record.data_structures),
    (entry) => entry
  );
  const tags = unique_by(
    chain.flatMap((record) => record.tags),
    (entry) => entry
  );
  return {
    chain,
    argument_specs,
    connectors_before,
    linked_objects_after,
    data_structures,
    tags
  };
}

export function get_load_hook_arguments_by_tag(ctx = {}, tag = "", path = {}) {
  const tag_key = clean_text(tag, "", 80);
  if (!tag_key) {
    return get_load_hook_arguments(ctx, path);
  }
  const chain = get_load_hook_chain(ctx, path).filter((record) => record.tags.includes(tag_key));
  return build_load_hook_argument_payload(chain);
}

export function search_load_hooks(ctx = {}, query_text = "", filter = {}) {
  const query = clean_text(query_text, "", 180).toLowerCase();
  const records = list_load_hook_records(ctx, filter);
  if (!query) {
    return records;
  }
  return records.filter((record) => get_search_blob(record).includes(query));
}

export function get_window_page_control_tree(ctx = {}) {
  const tree = {
    app: {
      pre_load: [],
      post_load: []
    },
    windows: {}
  };

  list_load_hook_records(ctx).forEach((record) => {
    if (record.scope === PATTERN_HOOK_SCOPE.APP) {
      tree.app[record.stage].push(record);
      return;
    }
    const window_node = ensure_tree_window(tree, record.window_key);
    if (record.scope === PATTERN_HOOK_SCOPE.WINDOW) {
      window_node[record.stage].push(record);
      return;
    }
    const page_node = ensure_tree_page(window_node, record.page_key);
    if (record.scope === PATTERN_HOOK_SCOPE.PAGE) {
      page_node[record.stage].push(record);
      return;
    }
    if (record.scope === PATTERN_HOOK_SCOPE.CONTROL) {
      const control_key = clean_text(record.control_key, "default_control", 80);
      if (!page_node.controls[control_key]) {
        page_node.controls[control_key] = {
          pre_load: [],
          post_load: []
        };
      }
      page_node.controls[control_key][record.stage].push(record);
    }
  });

  return tree;
}

export function create_load_hook_api(get_ctx) {
  const read_ctx = () => (typeof get_ctx === "function" ? get_ctx() || {} : {});
  return Object.freeze({
    list_records: (filter = {}) => list_load_hook_records(read_ctx(), filter),
    get_chain: (path = {}) => get_load_hook_chain(read_ctx(), path),
    get_arguments: (path = {}) => get_load_hook_arguments(read_ctx(), path),
    get_login_arguments: () =>
      get_load_hook_arguments_by_tag(read_ctx(), T.LOGIN, {
        window_key: T.MAIN_WINDOW,
        page_key: T.WORKBENCH_PAGE
      }),
    search: (query_text = "", filter = {}) => search_load_hooks(read_ctx(), query_text, filter),
    get_tree: () => get_window_page_control_tree(read_ctx())
  });
}

export function publish_load_hook_api(target, api) {
  const host = target && typeof target === "object" ? target : globalThis;
  host[T.APP_LOAD_HOOK] = api;
  const page_namespace = host.page && typeof host.page === "object" ? host.page : {};
  page_namespace.hook = api;
  host.page = page_namespace;
  return api;
}
