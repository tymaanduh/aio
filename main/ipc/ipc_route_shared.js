"use strict";

const IPC_ROUTE_AUTH = Object.freeze({
  REQUIRED: true,
  OPTIONAL: false
});

function create_ipc_route_spec(channel, requires_auth, handler) {
  return {
    channel,
    requires_auth: Boolean(requires_auth),
    handler
  };
}

module.exports = {
  IPC_ROUTE_AUTH,
  create_ipc_route_spec
};
