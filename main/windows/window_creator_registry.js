"use strict";

const { WINDOW_KEYS, WINDOW_CALLBACK_KEYS } = require("./window_specs");
const { create_window_creator } = require("./window_create_wrapper");

const windowCreators = Object.freeze({
  [WINDOW_KEYS.MAIN]: create_window_creator(WINDOW_KEYS.MAIN),
  [WINDOW_KEYS.LOGS]: create_window_creator(WINDOW_KEYS.LOGS)
});

function create_window_by_key(window_key, runtime_callbacks = {}) {
  const create_window = windowCreators[window_key];
  if (typeof create_window !== "function") {
    throw new Error(`Unknown window key: ${window_key}`);
  }
  return create_window(runtime_callbacks);
}

function create_main_window() {
  return create_window_by_key(WINDOW_KEYS.MAIN);
}

function create_logs_window(on_closed) {
  return create_window_by_key(WINDOW_KEYS.LOGS, {
    [WINDOW_CALLBACK_KEYS.ON_CLOSED]: on_closed
  });
}

module.exports = {
  WINDOW_CREATOR_MAP: windowCreators,
  WINDOW_CREATORS: windowCreators,
  windowCreators,
  create_window_by_key,
  create_main_window,
  create_logs_window
};
