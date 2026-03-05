"use strict";

const { PATTERN_IPC_DOMAIN, build_ipc_channel } = require("./ipc_channels.js");

const IPC_EVENTS = Object.freeze({
  RUNTIME_LOG_ENTRY: build_ipc_channel(PATTERN_IPC_DOMAIN.RUNTIME_LOG, "entry")
});

module.exports = {
  IPC_EVENTS
};
