"use strict";

const { IPC_CHANNELS } = require("./ipc_channels.js");
const { IPC_ROUTE_AUTH, create_ipc_route_spec } = require("./ipc_route_shared.js");

function create_ipc_route_bridge(deps) {
  const { language_bridge_service } = deps;
  return [
    create_ipc_route_spec(
      IPC_CHANNELS.BRIDGE_LOAD_STATE,
      IPC_ROUTE_AUTH.REQUIRED,
      () => language_bridge_service.load_bridge_state()
    ),
    create_ipc_route_spec(
      IPC_CHANNELS.BRIDGE_CAPTURE_SOURCES,
      IPC_ROUTE_AUTH.REQUIRED,
      (payload) => language_bridge_service.capture_sources(payload)
    ),
    create_ipc_route_spec(
      IPC_CHANNELS.BRIDGE_SEARCH_KEYWORD,
      IPC_ROUTE_AUTH.REQUIRED,
      (query, options) => language_bridge_service.search_keyword(query, options)
    ),
    create_ipc_route_spec(
      IPC_CHANNELS.BRIDGE_SEARCH_TRIAD,
      IPC_ROUTE_AUTH.REQUIRED,
      (query, options) => language_bridge_service.search_triad(query, options)
    ),
    create_ipc_route_spec(
      IPC_CHANNELS.BRIDGE_SEARCH_GLOSSARY,
      IPC_ROUTE_AUTH.REQUIRED,
      (query, options) => language_bridge_service.search_glossary(query, options)
    ),
    create_ipc_route_spec(
      IPC_CHANNELS.BRIDGE_LINK_ENTRY_ARTIFACTS,
      IPC_ROUTE_AUTH.REQUIRED,
      (entry_id, artifact_refs) => language_bridge_service.link_entry_artifacts(entry_id, artifact_refs)
    )
  ];
}

module.exports = {
  create_ipc_route_bridge
};
