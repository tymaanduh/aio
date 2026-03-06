"use strict";

const { IPC_CHANNELS } = require("./ipc_channels.js");
const { IPC_ROUTE_AUTH, create_ipc_route_spec } = require("./ipc_route_shared.js");

function create_ipc_route_storage(deps) {
  const { platform_runtime_service } = deps;
  return [
    create_ipc_route_spec(IPC_CHANNELS.STORAGE_GET_STATUS, IPC_ROUTE_AUTH.OPTIONAL, () =>
      platform_runtime_service.get_storage_runtime_status()
    ),
    create_ipc_route_spec(IPC_CHANNELS.STORAGE_EXPORT_RAW_ENVELOPE, IPC_ROUTE_AUTH.REQUIRED, () =>
      platform_runtime_service.export_storage_envelope()
    ),
    create_ipc_route_spec(IPC_CHANNELS.STORAGE_IMPORT_RAW_ENVELOPE, IPC_ROUTE_AUTH.REQUIRED, (payload) =>
      platform_runtime_service.import_storage_envelope(payload)
    ),
    create_ipc_route_spec(IPC_CHANNELS.STORAGE_LIST_JOURNAL, IPC_ROUTE_AUTH.REQUIRED, (filter) =>
      platform_runtime_service.list_storage_journal(filter)
    ),
    create_ipc_route_spec(IPC_CHANNELS.STORAGE_ROLLBACK_DOMAIN, IPC_ROUTE_AUTH.REQUIRED, (payload) =>
      platform_runtime_service.rollback_storage_domain(payload)
    ),
    create_ipc_route_spec(IPC_CHANNELS.STORAGE_VALIDATE_RAW_ENVELOPE, IPC_ROUTE_AUTH.REQUIRED, (payload) =>
      platform_runtime_service.validate_storage_raw_envelope(payload)
    )
  ];
}

module.exports = {
  create_ipc_route_storage
};
