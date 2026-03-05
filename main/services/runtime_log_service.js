"use strict";

const crypto = require("crypto");
const { IPC_EVENTS } = require("../ipc/ipc_events.js");
const { clean_text } = require("./normalize_service.js");
const { create_logs_window } = require("../windows/logs_window_create.js");

const RUNTIME_LOG_LIMITS = Object.freeze({
  BUFFER_MAX: 3000,
  LEVEL_MAX: 20,
  MESSAGE_MAX: 1200,
  TIMESTAMP_MAX: 80,
  SOURCE_MAX: 80,
  CONTEXT_MAX: 1000
});

const RUNTIME_LOG_PATTERNS = Object.freeze({
  LEVEL_ALLOWED: Object.freeze(["info", "warn", "error", "debug"]),
  DEFAULT_LEVEL: "info",
  DEFAULT_SOURCE: "app",
  ENV_ENABLE_REALTIME_LOGS: "DICTIONARY_ENABLE_REALTIME_LOGS",
  ENV_DISABLED_VALUE: "0"
});

const RUNTIME_LOG_STATE = {
  enabled: process.env[RUNTIME_LOG_PATTERNS.ENV_ENABLE_REALTIME_LOGS] !== RUNTIME_LOG_PATTERNS.ENV_DISABLED_VALUE,
  console_window: null,
  buffer: []
};

const RUNTIME_LOG_LEVEL_ALLOWED = new Set(RUNTIME_LOG_PATTERNS.LEVEL_ALLOWED);

function create_runtime_log_result(ok, enabled, count = null) {
  const result = { ok: Boolean(ok), enabled: Boolean(enabled) };
  if (Number.isInteger(count)) {
    result.count = count;
  }
  return result;
}

function now_iso() {
  return new Date().toISOString();
}

function sanitize_runtime_log_entry(raw_entry) {
  const source = raw_entry && typeof raw_entry === "object" ? raw_entry : {};
  const level_raw = clean_text(source.level, RUNTIME_LOG_LIMITS.LEVEL_MAX).toLowerCase();
  const level = RUNTIME_LOG_LEVEL_ALLOWED.has(level_raw) ? level_raw : RUNTIME_LOG_PATTERNS.DEFAULT_LEVEL;
  const message = clean_text(source.message, RUNTIME_LOG_LIMITS.MESSAGE_MAX);
  if (!message) {
    return null;
  }
  return {
    id: crypto.randomUUID(),
    at: clean_text(source.at, RUNTIME_LOG_LIMITS.TIMESTAMP_MAX) || now_iso(),
    level,
    source: clean_text(source.source, RUNTIME_LOG_LIMITS.SOURCE_MAX) || RUNTIME_LOG_PATTERNS.DEFAULT_SOURCE,
    message,
    context: clean_text(source.context, RUNTIME_LOG_LIMITS.CONTEXT_MAX)
  };
}

function broadcast_runtime_log(entry) {
  if (!entry || !RUNTIME_LOG_STATE.console_window || RUNTIME_LOG_STATE.console_window.isDestroyed()) {
    return;
  }
  RUNTIME_LOG_STATE.console_window.webContents.send(IPC_EVENTS.RUNTIME_LOG_ENTRY, entry);
}

function append_runtime_log(entry) {
  if (!RUNTIME_LOG_STATE.enabled) {
    return create_runtime_log_result(false, false);
  }

  const normalized = sanitize_runtime_log_entry(entry);
  if (!normalized) {
    return create_runtime_log_result(false, true);
  }

  RUNTIME_LOG_STATE.buffer.push(normalized);
  if (RUNTIME_LOG_STATE.buffer.length > RUNTIME_LOG_LIMITS.BUFFER_MAX) {
    RUNTIME_LOG_STATE.buffer.splice(0, RUNTIME_LOG_STATE.buffer.length - RUNTIME_LOG_LIMITS.BUFFER_MAX);
  }
  broadcast_runtime_log(normalized);

  return create_runtime_log_result(true, true, RUNTIME_LOG_STATE.buffer.length);
}

function get_runtime_log_status() {
  return {
    enabled: RUNTIME_LOG_STATE.enabled,
    count: RUNTIME_LOG_STATE.buffer.length
  };
}

function set_runtime_logs_enabled(raw_enabled) {
  RUNTIME_LOG_STATE.enabled = Boolean(raw_enabled);
  return get_runtime_log_status();
}

function is_runtime_logs_enabled() {
  return RUNTIME_LOG_STATE.enabled;
}

function get_runtime_log_buffer() {
  return RUNTIME_LOG_STATE.buffer;
}

function create_log_console_window() {
  if (!RUNTIME_LOG_STATE.enabled) {
    return null;
  }
  if (RUNTIME_LOG_STATE.console_window && !RUNTIME_LOG_STATE.console_window.isDestroyed()) {
    RUNTIME_LOG_STATE.console_window.focus();
    return RUNTIME_LOG_STATE.console_window;
  }

  RUNTIME_LOG_STATE.console_window = create_logs_window(() => {
    RUNTIME_LOG_STATE.console_window = null;
  });
  return RUNTIME_LOG_STATE.console_window;
}

module.exports = {
  append_runtime_log,
  get_runtime_log_status,
  set_runtime_logs_enabled,
  is_runtime_logs_enabled,
  get_runtime_log_buffer,
  create_log_console_window
};
