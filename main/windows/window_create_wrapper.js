"use strict";

const { create_window_from_spec } = require("./window_shared");
const {
  WINDOW_EVENTS,
  WINDOW_CALLBACK_KEYS,
  get_window_spec,
  get_window_runtime_rules
} = require("./window_specs");

function bind_window_auto_show_on_ready(window_instance, enabled) {
  if (!enabled) {
    return;
  }
  window_instance.once(WINDOW_EVENTS.READY_TO_SHOW, () => {
    if (!window_instance.isDestroyed()) {
      window_instance.show();
    }
  });
}

function bind_window_optional_close_callback(window_instance, enabled, runtime_callbacks) {
  if (!enabled) {
    return;
  }
  const on_closed = runtime_callbacks?.[WINDOW_CALLBACK_KEYS.ON_CLOSED];
  if (typeof on_closed === "function") {
    window_instance.on(WINDOW_EVENTS.CLOSED, on_closed);
  }
}

function create_window_creator(window_key) {
  const window_spec = get_window_spec(window_key);
  const runtime_rules = get_window_runtime_rules(window_key);

  return function create_window(runtime_callbacks = {}) {
    const window_instance = create_window_from_spec(window_spec);
    bind_window_auto_show_on_ready(window_instance, Boolean(runtime_rules.auto_show_on_ready));
    bind_window_optional_close_callback(
      window_instance,
      Boolean(runtime_rules.forward_on_closed_callback),
      runtime_callbacks
    );
    return window_instance;
  };
}

module.exports = {
  bind_window_auto_show_on_ready,
  bind_window_optional_close_callback,
  create_window_creator
};
