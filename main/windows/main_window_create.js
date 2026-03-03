"use strict";

const { WINDOW_KEYS } = require("./window_specs");
const { create_window_creator } = require("./window_create_wrapper");

const create_main_window = create_window_creator(WINDOW_KEYS.MAIN);

module.exports = {
  create_main_window
};
