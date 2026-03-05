"use strict";

const { IPC_CHANNELS } = require("./ipc_channels.js");
const { IPC_ROUTE_AUTH, create_ipc_route_spec } = require("./ipc_route_shared.js");

function create_ipc_route_universe(deps) {
  const { repository_universe } = deps;
  return [
    create_ipc_route_spec(IPC_CHANNELS.UNIVERSE_LOAD_CACHE, IPC_ROUTE_AUTH.REQUIRED, () =>
      repository_universe.load_universe_cache_state()
    ),
    create_ipc_route_spec(IPC_CHANNELS.UNIVERSE_SAVE_CACHE, IPC_ROUTE_AUTH.REQUIRED, (payload) =>
      repository_universe.save_universe_cache_state(payload)
    ),
    create_ipc_route_spec(IPC_CHANNELS.UNIVERSE_EXPORT, IPC_ROUTE_AUTH.REQUIRED, (payload) =>
      repository_universe.export_universe(payload)
    )
  ];
}

module.exports = {
  create_ipc_route_universe
};
