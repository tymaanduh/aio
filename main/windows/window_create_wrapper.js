"use strict";

const { create_window_from_spec } = require("./window_shared");
const {
  WINDOW_EVENTS,
  WINDOW_CALLBACK_KEYS,
  WINDOW_RUNTIME_RULE_KEYS,
  get_window_spec,
  get_window_runtime_rules
} = require("./window_specs");

const windowRuntimeBinders = Object.freeze({
  [WINDOW_RUNTIME_RULE_KEYS.AUTO_SHOW_ON_READY]: bind_window_auto_show_on_ready,
  [WINDOW_RUNTIME_RULE_KEYS.FORWARD_ON_CLOSED_CALLBACK]: bind_window_optional_close_callback
});

const WINDOW_AUTO_SHOW_FALLBACK_DELAY_MS = 3500;

function bind_window_auto_show_on_ready(window_instance, _runtime_callbacks, enabled) {
  if (!enabled) {
    return;
  }
  let did_show = false;
  const show_if_possible = () => {
    if (did_show || window_instance.isDestroyed()) {
      return;
    }
    did_show = true;
    window_instance.show();
  };

  const fallback_timer = setTimeout(show_if_possible, WINDOW_AUTO_SHOW_FALLBACK_DELAY_MS);

  window_instance.once(WINDOW_EVENTS.READY_TO_SHOW, () => {
    clearTimeout(fallback_timer);
    show_if_possible();
  });

  window_instance.webContents.once("did-fail-load", () => {
    clearTimeout(fallback_timer);
    show_if_possible();
  });
}
function bind_window_optional_close_callback(window_instance, runtime_callbacks, enabled) {
  if (!enabled) {
    return;
  }
  const on_closed = runtime_callbacks?.[WINDOW_CALLBACK_KEYS.ON_CLOSED];
  if (typeof on_closed === "function") {
    window_instance.on(WINDOW_EVENTS.CLOSED, on_closed);
  }
}

function bind_window_runtime_rules(window_instance, runtime_rules, runtime_callbacks) {
  Object.entries(windowRuntimeBinders).forEach(([rule_key, bind_logic]) => {
    bind_logic(window_instance, runtime_callbacks, Boolean(runtime_rules?.[rule_key]));
  });
}

function create_window_creator(window_key) {
  const window_spec = get_window_spec(window_key);
  const runtime_rules = get_window_runtime_rules(window_key);

  return function create_window(runtime_callbacks = {}) {
    const window_instance = create_window_from_spec(window_spec);
    bind_window_runtime_rules(window_instance, runtime_rules, runtime_callbacks);
    return window_instance;
  };
}

module.exports = {
  WINDOW_RUNTIME_BINDERS: windowRuntimeBinders,
  windowRuntimeBinders,
  bind_window_auto_show_on_ready,
  bind_window_optional_close_callback,
  bind_window_runtime_rules,
  create_window_creator
};
