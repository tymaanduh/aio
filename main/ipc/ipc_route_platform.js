"use strict";

const { IPC_CHANNELS } = require("./ipc_channels.js");
const { IPC_ROUTE_AUTH, create_ipc_route_spec } = require("./ipc_route_shared.js");

function create_ipc_route_platform(deps) {
  const { platform_runtime_service } = deps;
  return [
    create_ipc_route_spec(IPC_CHANNELS.PLATFORM_GET_RUNTIME_STATUS, IPC_ROUTE_AUTH.OPTIONAL, () =>
      platform_runtime_service.get_platform_runtime_status()
    )
  ];
}

module.exports = {
  create_ipc_route_platform
};
