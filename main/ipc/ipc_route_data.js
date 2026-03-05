"use strict";

const { IPC_CHANNELS } = require("./ipc_channels.js");
const { IPC_ROUTE_AUTH, create_ipc_route_spec } = require("./ipc_route_shared.js");

function create_ipc_route_data(deps) {
  const { repository_state, normalize_service, language_bridge_service } = deps;
  return [
    create_ipc_route_spec(IPC_CHANNELS.DICTIONARY_LOAD, IPC_ROUTE_AUTH.REQUIRED, () => repository_state.load_state()),
    create_ipc_route_spec(IPC_CHANNELS.DICTIONARY_SAVE, IPC_ROUTE_AUTH.REQUIRED, async (payload) => {
      const saved_state = await repository_state.save_state(payload);
      try {
        await language_bridge_service.index_dictionary_entries(saved_state.entries, {
          source_id: "dictionary_save"
        });
      } catch {
        // Language bridge indexing must not block dictionary save.
      }
      return saved_state;
    }),
    create_ipc_route_spec(IPC_CHANNELS.DICTIONARY_COMPACT, IPC_ROUTE_AUTH.REQUIRED, (payload) =>
      normalize_service.compact_state(payload)
    )
  ];
}

module.exports = {
  create_ipc_route_data
};
