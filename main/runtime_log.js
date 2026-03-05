"use strict";

const runtime_log_service = require("./services/runtime_log_service.js");

const RUNTIME_LOG_EXPORT_MAP = Object.freeze({
  appendRuntimeLog: runtime_log_service.append_runtime_log,
  getRuntimeLogStatus: runtime_log_service.get_runtime_log_status,
  setRuntimeLogsEnabled: runtime_log_service.set_runtime_logs_enabled,
  isRuntimeLogsEnabled: runtime_log_service.is_runtime_logs_enabled,
  getRuntimeLogBuffer: runtime_log_service.get_runtime_log_buffer,
  createLogConsoleWindow: runtime_log_service.create_log_console_window
});

module.exports = {
  ...RUNTIME_LOG_EXPORT_MAP
};
