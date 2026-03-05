"use strict";

const { IPC_CHANNELS } = require("./ipc_channels.js");
const { IPC_ROUTE_AUTH, create_ipc_route_spec } = require("./ipc_route_shared.js");

const RUNTIME_LOG_ROUTE_LIMITS = Object.freeze({
  LOAD_ENTRIES_MAX: 1000
});

function create_ipc_route_runtime_log(deps) {
  const { runtime_log_service } = deps;
  return [
    create_ipc_route_spec(IPC_CHANNELS.RUNTIME_LOG_STATUS, IPC_ROUTE_AUTH.OPTIONAL, () =>
      runtime_log_service.get_runtime_log_status()
    ),
    create_ipc_route_spec(IPC_CHANNELS.RUNTIME_LOG_SET_ENABLED, IPC_ROUTE_AUTH.OPTIONAL, (enabled) =>
      runtime_log_service.set_runtime_logs_enabled(enabled)
    ),
    create_ipc_route_spec(IPC_CHANNELS.RUNTIME_LOG_OPEN_CONSOLE, IPC_ROUTE_AUTH.OPTIONAL, () => {
      const win = runtime_log_service.create_log_console_window();
      return {
        ok: Boolean(win),
        enabled: runtime_log_service.is_runtime_logs_enabled()
      };
    }),
    create_ipc_route_spec(IPC_CHANNELS.RUNTIME_LOG_APPEND, IPC_ROUTE_AUTH.OPTIONAL, (payload) =>
      runtime_log_service.append_runtime_log(payload)
    ),
    create_ipc_route_spec(IPC_CHANNELS.RUNTIME_LOG_LOAD, IPC_ROUTE_AUTH.OPTIONAL, () => ({
      enabled: runtime_log_service.is_runtime_logs_enabled(),
      entries: runtime_log_service.get_runtime_log_buffer().slice(-RUNTIME_LOG_ROUTE_LIMITS.LOAD_ENTRIES_MAX)
    }))
  ];
}

module.exports = {
  create_ipc_route_runtime_log
};
