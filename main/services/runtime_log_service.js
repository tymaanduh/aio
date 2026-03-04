"use strict";

const crypto = require("crypto");
const { IPC_EVENTS } = require("../ipc/ipc_events.js");
const { clean_text } = require("./normalize_service.js");
const { create_logs_window } = require("../windows/logs_window_create.js");
const RUNTIME_LOG_CATALOG = require("../../data/input/shared/main/runtime_log_catalog.json");

const RUNTIME_LOG_LIMITS = (() => {
  const limits = RUNTIME_LOG_CATALOG && RUNTIME_LOG_CATALOG.limits ? RUNTIME_LOG_CATALOG.limits : {};
  return Object.freeze({
    BUFFER_MAX: Number.isFinite(Number(limits.buffer_max)) ? Number(limits.buffer_max) : 3000,
    LEVEL_MAX: Number.isFinite(Number(limits.level_max)) ? Number(limits.level_max) : 20,
    MESSAGE_MAX: Number.isFinite(Number(limits.message_max)) ? Number(limits.message_max) : 1200,
    TIMESTAMP_MAX: Number.isFinite(Number(limits.timestamp_max)) ? Number(limits.timestamp_max) : 80,
    SOURCE_MAX: Number.isFinite(Number(limits.source_max)) ? Number(limits.source_max) : 80,
    CONTEXT_MAX: Number.isFinite(Number(limits.context_max)) ? Number(limits.context_max) : 1000
  });
})();

const RUNTIME_LOG_RULES = (() => {
  const rules = RUNTIME_LOG_CATALOG && RUNTIME_LOG_CATALOG.rules ? RUNTIME_LOG_CATALOG.rules : {};
  const level_allowed_source = Array.isArray(rules.level_allowed) ? rules.level_allowed : ["info", "warn", "error", "debug"];
  const level_allowed = level_allowed_source
    .map((entry) => clean_text(entry, 20).toLowerCase())
    .filter((entry) => Boolean(entry));
  return Object.freeze({
    LEVEL_ALLOWED: Object.freeze(level_allowed.length ? level_allowed : ["info", "warn", "error", "debug"]),
    DEFAULT_LEVEL: clean_text(rules.default_level, 20).toLowerCase() || "info",
    DEFAULT_SOURCE: clean_text(rules.default_source, 80) || "app",
    ENV_ENABLE_REALTIME_LOGS: clean_text(rules.env_enable_realtime_logs, 120) || "DICTIONARY_ENABLE_REALTIME_LOGS",
    ENV_DISABLED_VALUE: clean_text(rules.env_disabled_value, 20) || "0"
  });
})();

const RUNTIME_LOG_STATE = {
  enabled:
    process.env[RUNTIME_LOG_RULES.ENV_ENABLE_REALTIME_LOGS] !==
    RUNTIME_LOG_RULES.ENV_DISABLED_VALUE,
  console_window: null,
  buffer: []
};

const RUNTIME_LOG_LEVEL_ALLOWED = new Set(RUNTIME_LOG_RULES.LEVEL_ALLOWED);

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
  const level = RUNTIME_LOG_LEVEL_ALLOWED.has(level_raw)
    ? level_raw
    : RUNTIME_LOG_RULES.DEFAULT_LEVEL;
  const message = clean_text(source.message, RUNTIME_LOG_LIMITS.MESSAGE_MAX);
  if (!message) {
    return null;
  }
  return {
    id: crypto.randomUUID(),
    at: clean_text(source.at, RUNTIME_LOG_LIMITS.TIMESTAMP_MAX) || now_iso(),
    level,
    source:
      clean_text(source.source, RUNTIME_LOG_LIMITS.SOURCE_MAX) ||
      RUNTIME_LOG_RULES.DEFAULT_SOURCE,
    message,
    context: clean_text(source.context, RUNTIME_LOG_LIMITS.CONTEXT_MAX)
  };
}

function broadcast_runtime_log(entry) {
  if (
    !entry ||
    !RUNTIME_LOG_STATE.console_window ||
    RUNTIME_LOG_STATE.console_window.isDestroyed()
  ) {
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
    RUNTIME_LOG_STATE.buffer.splice(
      0,
      RUNTIME_LOG_STATE.buffer.length - RUNTIME_LOG_LIMITS.BUFFER_MAX
    );
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
  if (
    RUNTIME_LOG_STATE.console_window &&
    !RUNTIME_LOG_STATE.console_window.isDestroyed()
  ) {
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
