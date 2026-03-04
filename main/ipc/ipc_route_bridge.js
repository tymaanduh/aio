"use strict";

const { IPC_CHANNELS } = require("./ipc_channels.js");
const {
  IPC_ROUTE_AUTH,
  create_ipc_route_specs_from_service_catalog
} = require("./ipc_route_shared.js");
const BRIDGE_ROUTE_CATALOG = require("../../data/input/shared/ipc/bridge_route_catalog.json");

function create_ipc_route_bridge(deps) {
  const { language_bridge_service } = deps;
  return create_ipc_route_specs_from_service_catalog({
    channel_lookup: IPC_CHANNELS,
    route_rows: BRIDGE_ROUTE_CATALOG.bridge_required_routes,
    requires_auth: IPC_ROUTE_AUTH.REQUIRED,
    service: language_bridge_service
  });
}

module.exports = {
  create_ipc_route_bridge
};
