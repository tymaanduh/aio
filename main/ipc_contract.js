"use strict";

const { IPC_CHANNELS } = require("./ipc/ipc_channels.js");
const { IPC_EVENTS } = require("./ipc/ipc_events.js");
const {
  buildPreloadCompatibilityChannelMap
} = require("./shell/electron_shell_adapter.js");

const PRELOAD_API_CH_MAP = Object.freeze(buildPreloadCompatibilityChannelMap());

module.exports = {
  IPC_CH: IPC_CHANNELS,
  IPC_EVT: IPC_EVENTS,
  PRELOAD_API_CH_MAP
};
