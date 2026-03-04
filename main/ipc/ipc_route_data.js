"use strict";

const { IPC_CHANNELS } = require("./ipc_channels.js");
const { IPC_ROUTE_AUTH, create_ipc_route_spec } = require("./ipc_route_shared.js");

function passthrough_storage_route(handler) {
  return async (payload) => {
    try {
      return await handler(payload);
    } catch (error) {
      const code = error && error.code ? String(error.code) : "RAW_STORAGE_INTERNAL";
      const message = error && error.message ? String(error.message) : "raw storage route failed";
      const wrapped = new Error(`${code}: ${message}`);
      wrapped.name = "RawStorageRouteError";
      wrapped.code = code;
      wrapped.details = error && error.details ? error.details : {};
      throw wrapped;
    }
  };
}

function create_ipc_route_data(deps) {
  const {
    repository_state,
    normalize_service,
    language_bridge_service,
    repository_raw_storage
  } = deps;
  return [
    create_ipc_route_spec(
      IPC_CHANNELS.DICTIONARY_LOAD,
      IPC_ROUTE_AUTH.REQUIRED,
      () => repository_state.load_state()
    ),
    create_ipc_route_spec(
      IPC_CHANNELS.DICTIONARY_SAVE,
      IPC_ROUTE_AUTH.REQUIRED,
      async (payload) => {
        const saved_state = await repository_state.save_state(payload);
        try {
          await language_bridge_service.index_dictionary_entries(saved_state.entries, {
            source_id: "dictionary_save"
          });
        } catch {
          // Language bridge indexing must not block dictionary save.
        }
        return saved_state;
      }
    ),
    create_ipc_route_spec(
      IPC_CHANNELS.DICTIONARY_COMPACT,
      IPC_ROUTE_AUTH.REQUIRED,
      (payload) => normalize_service.compact_state(payload)
    ),
    create_ipc_route_spec(
      IPC_CHANNELS.STORAGE_WRITE_FILE,
      IPC_ROUTE_AUTH.REQUIRED,
      passthrough_storage_route((payload) => repository_raw_storage.write_raw_file(payload))
    ),
    create_ipc_route_spec(
      IPC_CHANNELS.STORAGE_READ_FILE,
      IPC_ROUTE_AUTH.REQUIRED,
      passthrough_storage_route((payload) => repository_raw_storage.read_raw_file(payload))
    ),
    create_ipc_route_spec(
      IPC_CHANNELS.STORAGE_LIST_FILES,
      IPC_ROUTE_AUTH.REQUIRED,
      passthrough_storage_route((payload) => repository_raw_storage.list_raw_files(payload))
    ),
    create_ipc_route_spec(
      IPC_CHANNELS.STORAGE_DELETE_PATH,
      IPC_ROUTE_AUTH.REQUIRED,
      passthrough_storage_route((payload) => repository_raw_storage.delete_raw_path(payload))
    ),
    create_ipc_route_spec(
      IPC_CHANNELS.STORAGE_ENSURE_DIRECTORY,
      IPC_ROUTE_AUTH.REQUIRED,
      passthrough_storage_route((payload) => repository_raw_storage.ensure_raw_directory(payload))
    )
  ];
}

module.exports = {
  create_ipc_route_data
};
