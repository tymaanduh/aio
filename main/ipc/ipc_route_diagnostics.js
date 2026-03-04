"use strict";

const { IPC_CHANNELS } = require("./ipc_channels.js");
const { IPC_ROUTE_AUTH, create_ipc_route_spec } = require("./ipc_route_shared.js");

function create_ipc_route_diagnostics(deps) {
  const { repository_diagnostics } = deps;
  return [
    create_ipc_route_spec(
      IPC_CHANNELS.DIAGNOSTICS_LOAD,
      IPC_ROUTE_AUTH.REQUIRED,
      () => repository_diagnostics.load_diagnostics_state()
    ),
    create_ipc_route_spec(
      IPC_CHANNELS.DIAGNOSTICS_APPEND,
      IPC_ROUTE_AUTH.REQUIRED,
      (payload) => repository_diagnostics.append_diagnostics(payload)
    ),
    create_ipc_route_spec(
      IPC_CHANNELS.DIAGNOSTICS_EXPORT,
      IPC_ROUTE_AUTH.REQUIRED,
      () => repository_diagnostics.export_diagnostics()
    )
  ];
}

module.exports = {
  create_ipc_route_diagnostics
};
