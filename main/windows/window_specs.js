"use strict";

const WINDOW_KEYS = Object.freeze({
  MAIN: "main",
  LOGS: "logs"
});

const WINDOW_VIEW_FILES = Object.freeze({
  [WINDOW_KEYS.MAIN]: "main_window.html",
  [WINDOW_KEYS.LOGS]: "logs_window.html"
});

const WINDOW_EVENTS = Object.freeze({
  READY_TO_SHOW: "ready-to-show",
  CLOSED: "closed"
});

const WINDOW_CALLBACK_KEYS = Object.freeze({
  ON_CLOSED: "on_closed"
});

const WINDOW_STYLES = Object.freeze({
  [WINDOW_KEYS.MAIN]: Object.freeze({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 650,
    show: false,
    backgroundColor: "#0b1114",
    autoHideMenuBar: true
  }),
  [WINDOW_KEYS.LOGS]: Object.freeze({
    width: 980,
    height: 620,
    minWidth: 760,
    minHeight: 420,
    title: "Dictionary Runtime Console",
    backgroundColor: "#0b1114",
    autoHideMenuBar: true
  })
});

const WINDOW_WEB_PREFERENCES = Object.freeze({
  [WINDOW_KEYS.MAIN]: Object.freeze({
    webSecurity: true,
    allowRunningInsecureContent: false,
    spellcheck: false,
    backgroundThrottling: true
  }),
  [WINDOW_KEYS.LOGS]: Object.freeze({
    devTools: true
  })
});

const WINDOW_SPEC_FALLBACK = Object.freeze({
  window_style: Object.freeze({}),
  web_preferences: Object.freeze({}),
  view_file_name: ""
});

const WINDOW_SPEC_MAP = Object.freeze({
  [WINDOW_KEYS.MAIN]: Object.freeze({
    window_style: WINDOW_STYLES[WINDOW_KEYS.MAIN],
    web_preferences: WINDOW_WEB_PREFERENCES[WINDOW_KEYS.MAIN],
    view_file_name: WINDOW_VIEW_FILES[WINDOW_KEYS.MAIN]
  }),
  [WINDOW_KEYS.LOGS]: Object.freeze({
    window_style: WINDOW_STYLES[WINDOW_KEYS.LOGS],
    web_preferences: WINDOW_WEB_PREFERENCES[WINDOW_KEYS.LOGS],
    view_file_name: WINDOW_VIEW_FILES[WINDOW_KEYS.LOGS]
  })
});

const WINDOW_RUNTIME_RULES = Object.freeze({
  [WINDOW_KEYS.MAIN]: Object.freeze({
    auto_show_on_ready: true,
    forward_on_closed_callback: false
  }),
  [WINDOW_KEYS.LOGS]: Object.freeze({
    auto_show_on_ready: false,
    forward_on_closed_callback: true
  })
});

const WINDOW_RUNTIME_RULES_FALLBACK = Object.freeze({
  auto_show_on_ready: false,
  forward_on_closed_callback: false
});

function get_window_spec(window_key) {
  return WINDOW_SPEC_MAP[window_key] || WINDOW_SPEC_FALLBACK;
}

function get_window_runtime_rules(window_key) {
  return WINDOW_RUNTIME_RULES[window_key] || WINDOW_RUNTIME_RULES_FALLBACK;
}

module.exports = {
  WINDOW_KEYS,
  WINDOW_VIEW_FILES,
  WINDOW_EVENTS,
  WINDOW_CALLBACK_KEYS,
  WINDOW_STYLES,
  WINDOW_WEB_PREFERENCES,
  WINDOW_SPEC_FALLBACK,
  WINDOW_SPEC_MAP,
  WINDOW_RUNTIME_RULES,
  WINDOW_RUNTIME_RULES_FALLBACK,
  get_window_spec,
  get_window_runtime_rules
};
