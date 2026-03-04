"use strict";

const { APP_HOOK_KEYS } = require("./app_hook_shared.js");
const { DATA_HOOK_KEYS } = require("../data/data_hook_shared.js");
const { WINDOW_HOOK_KEYS } = require("../windows/window_hook_shared.js");
const APP_BOOT_CATALOG = require("../../data/input/shared/main/app_boot_catalog.json");

function freeze_catalog_value(value, fallback) {
  const source = value && typeof value === "object" ? value : fallback;
  return Object.freeze({ ...(source && typeof source === "object" ? source : {}) });
}

const APP_BOOT_THEME = freeze_catalog_value(APP_BOOT_CATALOG.app_boot_theme, {
  SOURCE_DARK: "dark"
});

function create_app_boot_hook_registry() {
  return {
    APP_PRE: APP_HOOK_KEYS.PRE_LOAD,
    DATA_PRE: DATA_HOOK_KEYS.PRE_LOAD,
    IPC_REGISTER: String(
      APP_BOOT_CATALOG &&
        APP_BOOT_CATALOG.app_boot_hook_registry &&
        APP_BOOT_CATALOG.app_boot_hook_registry.IPC_REGISTER
        ? APP_BOOT_CATALOG.app_boot_hook_registry.IPC_REGISTER
        : "IPC_REGISTER"
    ),
    WINDOW_PRE: WINDOW_HOOK_KEYS.PRE_LOAD,
    WINDOW_POST: WINDOW_HOOK_KEYS.POST_LOAD,
    APP_POST: APP_HOOK_KEYS.POST_LOAD
  };
}

const APP_BOOT_HOOK_REGISTRY = freeze_catalog_value(create_app_boot_hook_registry(), {});

const APP_BOOT_WINDOW_SCOPE = freeze_catalog_value(APP_BOOT_CATALOG.app_boot_window_scope, {
  MAIN: "main_window"
});

const APP_BOOT_CLEAN_TEXT_LIMITS = freeze_catalog_value(APP_BOOT_CATALOG.app_boot_clean_text_limits, {
  PROCESS_ERROR: 1000,
  GPU_DETAILS: 900
});

const APP_BOOT_LOG_LEVEL = freeze_catalog_value(APP_BOOT_CATALOG.app_boot_log_level, {
  INFO: "info",
  WARN: "warn",
  ERROR: "error"
});

const APP_BOOT_LOG_SOURCE = freeze_catalog_value(APP_BOOT_CATALOG.app_boot_log_source, {
  MAIN: "main",
  GPU: "gpu"
});

const APP_BOOT_LOG_CONTEXT = freeze_catalog_value(APP_BOOT_CATALOG.app_boot_log_context, {
  CREATE_MAIN_WINDOW: "create_main_window",
  APP_READY: "app.whenReady",
  GPU_AUTO_RECOVER: "auto-recover"
});

const APP_BOOT_ENV_KEYS = freeze_catalog_value(APP_BOOT_CATALOG.app_boot_env_keys, {
  OPEN_LOG_CONSOLE: "DICTIONARY_OPEN_LOG_CONSOLE",
  GPU_MODE: "DICTIONARY_GPU_MODE",
  GPU_RECOVERED: "DICTIONARY_GPU_RECOVERED"
});

const APP_BOOT_ENV_VALUES = freeze_catalog_value(APP_BOOT_CATALOG.app_boot_env_values, {
  ENABLED: "1",
  GPU_MODE_OFF: "off"
});

const APP_BOOT_APP_EVENTS = freeze_catalog_value(APP_BOOT_CATALOG.app_boot_app_events, {
  ACTIVATE: "activate",
  CHILD_PROCESS_GONE: "child-process-gone",
  WINDOW_ALL_CLOSED: "window-all-closed"
});

const APP_BOOT_PROCESS_EVENTS = freeze_catalog_value(APP_BOOT_CATALOG.app_boot_process_events, {
  UNCAUGHT_EXCEPTION: "uncaughtException",
  UNHANDLED_REJECTION: "unhandledRejection"
});

const appBootProcessErrorHooks = Object.freeze([
  [APP_BOOT_PROCESS_EVENTS.UNCAUGHT_EXCEPTION, "Uncaught exception in main process."],
  [APP_BOOT_PROCESS_EVENTS.UNHANDLED_REJECTION, "Unhandled promise rejection in main process."]
]);

const APP_BOOT_GPU_EVENT = freeze_catalog_value(APP_BOOT_CATALOG.app_boot_gpu_event, {
  TYPE: "GPU"
});

const APP_BOOT_DEFAULT_GPU_TEXT = freeze_catalog_value(APP_BOOT_CATALOG.app_boot_default_gpu_text, {
  VALUE: "default"
});

const APP_BOOT_PLATFORM = freeze_catalog_value(APP_BOOT_CATALOG.app_boot_platform, {
  MACOS: "darwin"
});

const APP_BOOT_RUNTIME_TEXT = freeze_catalog_value(APP_BOOT_CATALOG.app_boot_runtime_text, {
  MAIN_WINDOW_CREATED: "Main window created.",
  APP_READY: "Application ready.",
  GPU_EXITED: "GPU process exited.",
  GPU_INSTABILITY: "GPU instability detected. Relaunching in safe mode (GPU off)."
});

module.exports = {
  APP_BOOT_THEME,
  APP_BOOT_HOOK_REGISTRY,
  APP_BOOT_WINDOW_SCOPE,
  APP_BOOT_CLEAN_TEXT_LIMITS,
  APP_BOOT_LOG_LEVEL,
  APP_BOOT_LOG_SOURCE,
  APP_BOOT_LOG_CONTEXT,
  APP_BOOT_ENV_KEYS,
  APP_BOOT_ENV_VALUES,
  APP_BOOT_APP_EVENTS,
  APP_BOOT_PROCESS_EVENTS,
  APP_BOOT_PROCESS_ERROR_HOOKS: appBootProcessErrorHooks,
  appBootProcessErrorHooks,
  APP_BOOT_GPU_EVENT,
  APP_BOOT_DEFAULT_GPU_TEXT,
  APP_BOOT_PLATFORM,
  APP_BOOT_RUNTIME_TEXT
};
