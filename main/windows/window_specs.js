"use strict";

const WINDOW_KEYS = Object.freeze({
  MAIN: "main",
  LOGS: "logs"
});

const WINDOW_EVENTS = Object.freeze({
  READY_TO_SHOW: "ready-to-show",
  CLOSED: "closed"
});

const WINDOW_CALLBACK_KEYS = Object.freeze({
  ON_CLOSED: "on_closed"
});

const WINDOW_SPEC_KEYS = Object.freeze({
  WINDOW_STYLE: "window_style",
  WEB_PREFERENCES: "web_preferences",
  VIEW_FILE_NAME: "view_file_name",
  RUNTIME_RULES: "runtime_rules"
});

const WINDOW_RUNTIME_RULE_KEYS = Object.freeze({
  AUTO_SHOW_ON_READY: "auto_show_on_ready",
  FORWARD_ON_CLOSED_CALLBACK: "forward_on_closed_callback"
});

const WINDOW_SPEC_FALLBACK = Object.freeze({
  [WINDOW_SPEC_KEYS.WINDOW_STYLE]: Object.freeze({}),
  [WINDOW_SPEC_KEYS.WEB_PREFERENCES]: Object.freeze({}),
  [WINDOW_SPEC_KEYS.VIEW_FILE_NAME]: ""
});

const WINDOW_RUNTIME_RULES_FALLBACK = Object.freeze({
  [WINDOW_RUNTIME_RULE_KEYS.AUTO_SHOW_ON_READY]: false,
  [WINDOW_RUNTIME_RULE_KEYS.FORWARD_ON_CLOSED_CALLBACK]: false
});

const WINDOW_DEFINITIONS = Object.freeze({
  [WINDOW_KEYS.MAIN]: Object.freeze({
    [WINDOW_SPEC_KEYS.WINDOW_STYLE]: Object.freeze({
      width: 1200,
      height: 800,
      minWidth: 900,
      minHeight: 650,
      show: false,
      backgroundColor: "#0b1114",
      autoHideMenuBar: true
    }),
    [WINDOW_SPEC_KEYS.WEB_PREFERENCES]: Object.freeze({
      webSecurity: true,
      allowRunningInsecureContent: false,
      spellcheck: false,
      backgroundThrottling: true
    }),
    [WINDOW_SPEC_KEYS.VIEW_FILE_NAME]: "main_window.html",
    [WINDOW_SPEC_KEYS.RUNTIME_RULES]: Object.freeze({
      [WINDOW_RUNTIME_RULE_KEYS.AUTO_SHOW_ON_READY]: true,
      [WINDOW_RUNTIME_RULE_KEYS.FORWARD_ON_CLOSED_CALLBACK]: false
    })
  }),
  [WINDOW_KEYS.LOGS]: Object.freeze({
    [WINDOW_SPEC_KEYS.WINDOW_STYLE]: Object.freeze({
      width: 980,
      height: 620,
      minWidth: 760,
      minHeight: 420,
      title: "Dictionary Runtime Console",
      backgroundColor: "#0b1114",
      autoHideMenuBar: true
    }),
    [WINDOW_SPEC_KEYS.WEB_PREFERENCES]: Object.freeze({
      devTools: true
    }),
    [WINDOW_SPEC_KEYS.VIEW_FILE_NAME]: "logs_window.html",
    [WINDOW_SPEC_KEYS.RUNTIME_RULES]: Object.freeze({
      [WINDOW_RUNTIME_RULE_KEYS.AUTO_SHOW_ON_READY]: false,
      [WINDOW_RUNTIME_RULE_KEYS.FORWARD_ON_CLOSED_CALLBACK]: true
    })
  })
});

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
