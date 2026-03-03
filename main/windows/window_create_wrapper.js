"use strict";

const { create_window_from_spec } = require("./window_shared");
const {
  WINDOW_EVENTS,
  WINDOW_CALLBACK_KEYS,
  WINDOW_RUNTIME_RULE_KEYS,
  get_window_spec,
  get_window_runtime_rules
} = require("./window_specs");

const WINDOW_RUNTIME_BINDERS = Object.freeze({
  [WINDOW_RUNTIME_RULE_KEYS.AUTO_SHOW_ON_READY]: bind_window_auto_show_on_ready,
  [WINDOW_RUNTIME_RULE_KEYS.FORWARD_ON_CLOSED_CALLBACK]: bind_window_optional_close_callback
});

function bind_window_auto_show_on_ready(window_instance, _runtime_callbacks, enabled) {
  if (!enabled) {
    return;
  }
  window_instance.once(WINDOW_EVENTS.READY_TO_SHOW, () => {
    if (!window_instance.isDestroyed()) {
      window_instance.show();
    }
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
  Object.entries(WINDOW_RUNTIME_BINDERS).forEach(([rule_key, bind_logic]) => {
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
  WINDOW_RUNTIME_BINDERS,
  bind_window_auto_show_on_ready,
  bind_window_optional_close_callback,
  bind_window_runtime_rules,
  create_window_creator
};
