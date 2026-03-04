"use strict";

const { create_ipc_route_auth } = require("./ipc_route_auth.js");
const { create_ipc_route_data } = require("./ipc_route_data.js");
const { create_ipc_route_diagnostics } = require("./ipc_route_diagnostics.js");
const { create_ipc_route_universe } = require("./ipc_route_universe.js");
const { create_ipc_route_ui } = require("./ipc_route_ui.js");
const { create_ipc_route_runtime_log } = require("./ipc_route_runtime_log.js");
const { create_ipc_route_gpu } = require("./ipc_route_gpu.js");
const { create_ipc_route_bridge } = require("./ipc_route_bridge.js");

const ipcRouteCreators = Object.freeze([
  create_ipc_route_auth,
  create_ipc_route_data,
  create_ipc_route_diagnostics,
  create_ipc_route_universe,
  create_ipc_route_ui,
  create_ipc_route_runtime_log,
  create_ipc_route_gpu,
  create_ipc_route_bridge
]);

function resolve_ipc_route_specs(deps) {
  return ipcRouteCreators.flatMap((create_routes) => create_routes(deps));
}

function register_ipc_routes(ipc_main, deps) {
  resolve_ipc_route_specs(deps).forEach((route_spec) => {
    ipc_main.handle(route_spec.channel, async (_event, ...args) => {
      if (route_spec.requires_auth) {
        deps.auth_service.ensure_authenticated();
      }
      return route_spec.handler(...args);
    });
  });
}

module.exports = {
  register_ipc_routes
};
