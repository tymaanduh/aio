"use strict";

const { IPC_CHANNELS } = require("./ipc_channels.js");
const { IPC_ROUTE_AUTH, create_ipc_route_spec } = require("./ipc_route_shared.js");

function create_ipc_route_auth(deps) {
  const { auth_service } = deps;
  return [
    create_ipc_route_spec(
      IPC_CHANNELS.AUTH_GET_STATUS,
      IPC_ROUTE_AUTH.OPTIONAL,
      () => auth_service.get_auth_status()
    ),
    create_ipc_route_spec(
      IPC_CHANNELS.AUTH_CREATE_ACCOUNT,
      IPC_ROUTE_AUTH.OPTIONAL,
      (username, password) => auth_service.create_account(username, password)
    ),
    create_ipc_route_spec(
      IPC_CHANNELS.AUTH_LOGIN,
      IPC_ROUTE_AUTH.OPTIONAL,
      (username, password) => auth_service.login(username, password)
    ),
    create_ipc_route_spec(
      IPC_CHANNELS.AUTH_LOGOUT,
      IPC_ROUTE_AUTH.OPTIONAL,
      () => auth_service.logout()
    ),
    create_ipc_route_spec(
      IPC_CHANNELS.DICTIONARY_LOOKUP_DEFINITION,
      IPC_ROUTE_AUTH.REQUIRED,
      (word) => auth_service.lookup_definition_online(word)
    )
  ];
}

module.exports = {
  create_ipc_route_auth
};
