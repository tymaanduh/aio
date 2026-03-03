"use strict";

const { WINDOW_KEYS, WINDOW_CALLBACK_KEYS } = require("./window_specs");
const { create_window_creator } = require("./window_create_wrapper");

const create_logs_window_base = create_window_creator(WINDOW_KEYS.LOGS);

function create_logs_window(on_closed) {
  return create_logs_window_base({
    [WINDOW_CALLBACK_KEYS.ON_CLOSED]: on_closed
  });
}

module.exports = {
  create_logs_window
};
