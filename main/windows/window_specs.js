"use strict";

const WINDOW_SPEC_CATALOG = require("../../data/input/shared/main/window_specs_catalog.json");

function is_plain_object(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function clone_plain_object(value) {
  return is_plain_object(value) ? { ...value } : {};
}

function deep_freeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) {
    return value;
  }

  Object.getOwnPropertyNames(value).forEach((key) => {
    const nested = value[key];
    if (nested && typeof nested === "object") {
      deep_freeze(nested);
    }
  });

  return Object.freeze(value);
}

function read_text(value, fallback) {
  return typeof value === "string" && value.trim() ? value : fallback;
}

const RAW_WINDOW_KEYS = is_plain_object(WINDOW_SPEC_CATALOG.window_keys) ? WINDOW_SPEC_CATALOG.window_keys : {};
const WINDOW_KEYS = deep_freeze({
  MAIN: read_text(RAW_WINDOW_KEYS.MAIN, "main"),
  LOGS: read_text(RAW_WINDOW_KEYS.LOGS, "logs")
});

const RAW_WINDOW_EVENTS = is_plain_object(WINDOW_SPEC_CATALOG.window_events) ? WINDOW_SPEC_CATALOG.window_events : {};
const WINDOW_EVENTS = deep_freeze({
  READY_TO_SHOW: read_text(RAW_WINDOW_EVENTS.READY_TO_SHOW, "ready-to-show"),
  CLOSED: read_text(RAW_WINDOW_EVENTS.CLOSED, "closed")
});

const RAW_WINDOW_CALLBACK_KEYS = is_plain_object(WINDOW_SPEC_CATALOG.window_callback_keys)
  ? WINDOW_SPEC_CATALOG.window_callback_keys
  : {};
const WINDOW_CALLBACK_KEYS = deep_freeze({
  ON_CLOSED: read_text(RAW_WINDOW_CALLBACK_KEYS.ON_CLOSED, "on_closed")
});

const RAW_WINDOW_SPEC_KEYS = is_plain_object(WINDOW_SPEC_CATALOG.window_spec_keys) ? WINDOW_SPEC_CATALOG.window_spec_keys : {};
const WINDOW_SPEC_KEYS = deep_freeze({
  WINDOW_STYLE: read_text(RAW_WINDOW_SPEC_KEYS.WINDOW_STYLE, "window_style"),
  WEB_PREFERENCES: read_text(RAW_WINDOW_SPEC_KEYS.WEB_PREFERENCES, "web_preferences"),
  VIEW_FILE_NAME: read_text(RAW_WINDOW_SPEC_KEYS.VIEW_FILE_NAME, "view_file_name"),
  RUNTIME_RULES: read_text(RAW_WINDOW_SPEC_KEYS.RUNTIME_RULES, "runtime_rules")
});

const RAW_WINDOW_RUNTIME_RULE_KEYS = is_plain_object(WINDOW_SPEC_CATALOG.window_runtime_rule_keys)
  ? WINDOW_SPEC_CATALOG.window_runtime_rule_keys
  : {};
const WINDOW_RUNTIME_RULE_KEYS = deep_freeze({
  AUTO_SHOW_ON_READY: read_text(RAW_WINDOW_RUNTIME_RULE_KEYS.AUTO_SHOW_ON_READY, "auto_show_on_ready"),
  FORWARD_ON_CLOSED_CALLBACK: read_text(
    RAW_WINDOW_RUNTIME_RULE_KEYS.FORWARD_ON_CLOSED_CALLBACK,
    "forward_on_closed_callback"
  )
});

const RAW_WINDOW_SPEC_FALLBACK = is_plain_object(WINDOW_SPEC_CATALOG.window_spec_fallback)
  ? WINDOW_SPEC_CATALOG.window_spec_fallback
  : {};
const WINDOW_SPEC_FALLBACK = deep_freeze({
  [WINDOW_SPEC_KEYS.WINDOW_STYLE]: clone_plain_object(RAW_WINDOW_SPEC_FALLBACK[WINDOW_SPEC_KEYS.WINDOW_STYLE]),
  [WINDOW_SPEC_KEYS.WEB_PREFERENCES]: clone_plain_object(RAW_WINDOW_SPEC_FALLBACK[WINDOW_SPEC_KEYS.WEB_PREFERENCES]),
  [WINDOW_SPEC_KEYS.VIEW_FILE_NAME]: read_text(RAW_WINDOW_SPEC_FALLBACK[WINDOW_SPEC_KEYS.VIEW_FILE_NAME], "")
});

const RAW_WINDOW_RUNTIME_RULES_FALLBACK = is_plain_object(WINDOW_SPEC_CATALOG.window_runtime_rules_fallback)
  ? WINDOW_SPEC_CATALOG.window_runtime_rules_fallback
  : {};
const WINDOW_RUNTIME_RULES_FALLBACK = deep_freeze({
  [WINDOW_RUNTIME_RULE_KEYS.AUTO_SHOW_ON_READY]: Boolean(
    RAW_WINDOW_RUNTIME_RULES_FALLBACK[WINDOW_RUNTIME_RULE_KEYS.AUTO_SHOW_ON_READY]
  ),
  [WINDOW_RUNTIME_RULE_KEYS.FORWARD_ON_CLOSED_CALLBACK]: Boolean(
    RAW_WINDOW_RUNTIME_RULES_FALLBACK[WINDOW_RUNTIME_RULE_KEYS.FORWARD_ON_CLOSED_CALLBACK]
  )
});

function normalize_runtime_rules(value) {
  const source = is_plain_object(value) ? value : {};
  return {
    [WINDOW_RUNTIME_RULE_KEYS.AUTO_SHOW_ON_READY]: Boolean(source[WINDOW_RUNTIME_RULE_KEYS.AUTO_SHOW_ON_READY]),
    [WINDOW_RUNTIME_RULE_KEYS.FORWARD_ON_CLOSED_CALLBACK]: Boolean(
      source[WINDOW_RUNTIME_RULE_KEYS.FORWARD_ON_CLOSED_CALLBACK]
    )
  };
}

function normalize_window_definition(value) {
  const source = is_plain_object(value) ? value : {};
  return {
    [WINDOW_SPEC_KEYS.WINDOW_STYLE]: clone_plain_object(source[WINDOW_SPEC_KEYS.WINDOW_STYLE]),
    [WINDOW_SPEC_KEYS.WEB_PREFERENCES]: clone_plain_object(source[WINDOW_SPEC_KEYS.WEB_PREFERENCES]),
    [WINDOW_SPEC_KEYS.VIEW_FILE_NAME]: read_text(
      source[WINDOW_SPEC_KEYS.VIEW_FILE_NAME],
      WINDOW_SPEC_FALLBACK[WINDOW_SPEC_KEYS.VIEW_FILE_NAME]
    ),
    [WINDOW_SPEC_KEYS.RUNTIME_RULES]: normalize_runtime_rules(source[WINDOW_SPEC_KEYS.RUNTIME_RULES])
  };
}

const RAW_WINDOW_DEFINITIONS = is_plain_object(WINDOW_SPEC_CATALOG.window_definitions)
  ? WINDOW_SPEC_CATALOG.window_definitions
  : {};

const normalized_definition_entries = Object.entries(RAW_WINDOW_DEFINITIONS).map(([window_key, definition]) => {
  return [window_key, normalize_window_definition(definition)];
});

if (!normalized_definition_entries.length) {
  normalized_definition_entries.push([WINDOW_KEYS.MAIN, normalize_window_definition({})]);
  normalized_definition_entries.push([WINDOW_KEYS.LOGS, normalize_window_definition({})]);
}

const WINDOW_DEFINITIONS = deep_freeze(Object.fromEntries(normalized_definition_entries));

function get_window_definition(window_key) {
  return WINDOW_DEFINITIONS[window_key] || null;
}

function pick_window_spec(definition) {
  const source = definition && typeof definition === "object" ? definition : {};
  return Object.freeze({
    [WINDOW_SPEC_KEYS.WINDOW_STYLE]:
      source[WINDOW_SPEC_KEYS.WINDOW_STYLE] || WINDOW_SPEC_FALLBACK[WINDOW_SPEC_KEYS.WINDOW_STYLE],
    [WINDOW_SPEC_KEYS.WEB_PREFERENCES]:
      source[WINDOW_SPEC_KEYS.WEB_PREFERENCES] || WINDOW_SPEC_FALLBACK[WINDOW_SPEC_KEYS.WEB_PREFERENCES],
    [WINDOW_SPEC_KEYS.VIEW_FILE_NAME]:
      source[WINDOW_SPEC_KEYS.VIEW_FILE_NAME] || WINDOW_SPEC_FALLBACK[WINDOW_SPEC_KEYS.VIEW_FILE_NAME]
  });
}

function pick_window_runtime_rules(definition) {
  const source = definition && typeof definition === "object" ? definition : {};
  const runtime_rules = source[WINDOW_SPEC_KEYS.RUNTIME_RULES] || WINDOW_RUNTIME_RULES_FALLBACK;
  return Object.freeze({
    [WINDOW_RUNTIME_RULE_KEYS.AUTO_SHOW_ON_READY]: Boolean(
      runtime_rules[WINDOW_RUNTIME_RULE_KEYS.AUTO_SHOW_ON_READY]
    ),
    [WINDOW_RUNTIME_RULE_KEYS.FORWARD_ON_CLOSED_CALLBACK]: Boolean(
      runtime_rules[WINDOW_RUNTIME_RULE_KEYS.FORWARD_ON_CLOSED_CALLBACK]
    )
  });
}

const WINDOW_SPEC_MAP = Object.freeze(
  Object.fromEntries(
    Object.keys(WINDOW_DEFINITIONS).map((window_key) => {
      return [window_key, pick_window_spec(WINDOW_DEFINITIONS[window_key])];
    })
  )
);

const WINDOW_RUNTIME_RULES = Object.freeze(
  Object.fromEntries(
    Object.keys(WINDOW_DEFINITIONS).map((window_key) => {
      return [window_key, pick_window_runtime_rules(WINDOW_DEFINITIONS[window_key])];
    })
  )
);

const WINDOW_VIEW_FILES = Object.freeze(
  Object.fromEntries(
    Object.keys(WINDOW_DEFINITIONS).map((window_key) => {
      return [window_key, WINDOW_DEFINITIONS[window_key][WINDOW_SPEC_KEYS.VIEW_FILE_NAME]];
    })
  )
);

const WINDOW_STYLES = Object.freeze(
  Object.fromEntries(
    Object.keys(WINDOW_DEFINITIONS).map((window_key) => {
      return [window_key, WINDOW_DEFINITIONS[window_key][WINDOW_SPEC_KEYS.WINDOW_STYLE]];
    })
  )
);

const WINDOW_WEB_PREFERENCES = Object.freeze(
  Object.fromEntries(
    Object.keys(WINDOW_DEFINITIONS).map((window_key) => {
      return [window_key, WINDOW_DEFINITIONS[window_key][WINDOW_SPEC_KEYS.WEB_PREFERENCES]];
    })
  )
);

function get_window_spec(window_key) {
  return WINDOW_SPEC_MAP[window_key] || WINDOW_SPEC_FALLBACK;
}

function get_window_runtime_rules(window_key) {
  return WINDOW_RUNTIME_RULES[window_key] || WINDOW_RUNTIME_RULES_FALLBACK;
}

module.exports = {
  WINDOW_KEYS,
  WINDOW_SPEC_KEYS,
  WINDOW_RUNTIME_RULE_KEYS,
  WINDOW_VIEW_FILES,
  WINDOW_EVENTS,
  WINDOW_CALLBACK_KEYS,
  WINDOW_STYLES,
  WINDOW_WEB_PREFERENCES,
  WINDOW_DEFINITIONS,
  WINDOW_SPEC_FALLBACK,
  WINDOW_SPEC_MAP,
  WINDOW_RUNTIME_RULES,
  WINDOW_RUNTIME_RULES_FALLBACK,
  get_window_definition,
  get_window_spec,
  pick_window_spec,
  pick_window_runtime_rules,
  get_window_runtime_rules
};
