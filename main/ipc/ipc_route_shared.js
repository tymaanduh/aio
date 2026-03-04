"use strict";

const ipcRouteAuth = Object.freeze({
  REQUIRED: true,
  OPTIONAL: false
});

function create_service_method_handler(service, method_name) {
  return (...args) => {
    const candidate = service && service[method_name];
    if (typeof candidate !== "function") {
      throw new Error(`ipc route catalog method not found: ${method_name}`);
    }
    return candidate(...args);
  };
}

function create_ipc_route_spec(channel, requires_auth, handler) {
  return {
    channel,
    requires_auth: Boolean(requires_auth),
    handler
  };
}

function create_ipc_route_specs_from_service_catalog(payload = {}) {
  const source = payload && typeof payload === "object" ? payload : {};
  const channel_lookup = source.channel_lookup && typeof source.channel_lookup === "object" ? source.channel_lookup : {};
  const route_rows = Array.isArray(source.route_rows) ? source.route_rows : [];
  const requires_auth = source.requires_auth;
  const service = source.service;

  return route_rows.map((row) => {
    const entry = row && typeof row === "object" ? row : {};
    const channel_key = String(entry.channel_key || "");
    const method_name = String(entry.method_name || "");
    const channel = channel_lookup[channel_key];
    return create_ipc_route_spec(channel, requires_auth, create_service_method_handler(service, method_name));
  });
}

module.exports = {
  IPC_ROUTE_AUTH: ipcRouteAuth,
  ipcRouteAuth,
  create_ipc_route_spec,
  create_service_method_handler,
  create_ipc_route_specs_from_service_catalog
};
