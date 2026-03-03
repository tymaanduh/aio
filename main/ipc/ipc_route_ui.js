"use strict";

const { IPC_CHANNELS } = require("./ipc_channels.js");
const { IPC_ROUTE_AUTH, create_ipc_route_spec } = require("./ipc_route_shared.js");

function create_ipc_route_ui(deps) {
  const { repository_ui_preferences } = deps;
  return [
    create_ipc_route_spec(
      IPC_CHANNELS.UI_LOAD_PREFERENCES,
      IPC_ROUTE_AUTH.OPTIONAL,
      () => repository_ui_preferences.load_ui_preferences_state()
    ),
    create_ipc_route_spec(
      IPC_CHANNELS.UI_SAVE_PREFERENCES,
      IPC_ROUTE_AUTH.OPTIONAL,
      (payload) => repository_ui_preferences.save_ui_preferences_state(payload)
    )
  ];
}

module.exports = {
  create_ipc_route_ui
};
