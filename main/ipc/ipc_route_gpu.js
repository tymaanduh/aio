"use strict";

const { IPC_CHANNELS } = require("./ipc_channels.js");
const { IPC_ROUTE_AUTH, create_ipc_route_spec } = require("./ipc_route_shared.js");

function create_ipc_route_gpu(deps) {
  const { gpu_service } = deps;
  return [
    create_ipc_route_spec(
      IPC_CHANNELS.GPU_GET_STATUS,
      IPC_ROUTE_AUTH.REQUIRED,
      () => gpu_service.get_gpu_diagnostics()
    )
  ];
}

module.exports = {
  create_ipc_route_gpu
};
