"use strict";

const { APP_HOOK_KEYS } = require("./app_hook_shared.js");
const { DATA_HOOK_KEYS } = require("../data/data_hook_shared.js");
const { WINDOW_HOOK_KEYS } = require("../windows/window_hook_shared.js");

const APP_BOOT_THEME = Object.freeze({
  SOURCE_DARK: "dark"
});

const APP_BOOT_HOOK_REGISTRY = Object.freeze({
  APP_PRE: APP_HOOK_KEYS.PRE_LOAD,
  DATA_PRE: DATA_HOOK_KEYS.PRE_LOAD,
  IPC_REGISTER: "IPC_REGISTER",
  WINDOW_PRE: WINDOW_HOOK_KEYS.PRE_LOAD,
  WINDOW_POST: WINDOW_HOOK_KEYS.POST_LOAD,
  APP_POST: APP_HOOK_KEYS.POST_LOAD
});

const APP_BOOT_WINDOW_SCOPE = Object.freeze({
  MAIN: "main_window"
});

const APP_BOOT_CLEAN_TEXT_LIMITS = Object.freeze({
  PROCESS_ERROR: 1000,
  GPU_DETAILS: 900
});

const APP_BOOT_LOG_LEVEL = Object.freeze({
  INFO: "info",
  WARN: "warn",
  ERROR: "error"
});

const APP_BOOT_LOG_SOURCE = Object.freeze({
  MAIN: "main",
  GPU: "gpu"
});

const APP_BOOT_LOG_CONTEXT = Object.freeze({
  CREATE_MAIN_WINDOW: "create_main_window",
  APP_READY: "app.whenReady",
  GPU_AUTO_RECOVER: "auto-recover"
});

const APP_BOOT_ENV_KEYS = Object.freeze({
  OPEN_LOG_CONSOLE: "DICTIONARY_OPEN_LOG_CONSOLE",
  GPU_MODE: "DICTIONARY_GPU_MODE",
  GPU_RECOVERED: "DICTIONARY_GPU_RECOVERED"
});

const APP_BOOT_ENV_VALUES = Object.freeze({
  ENABLED: "1",
  GPU_MODE_OFF: "off"
});

const APP_BOOT_APP_EVENTS = Object.freeze({
  ACTIVATE: "activate",
  CHILD_PROCESS_GONE: "child-process-gone",
  WINDOW_ALL_CLOSED: "window-all-closed"
});

const APP_BOOT_PROCESS_EVENTS = Object.freeze({
  UNCAUGHT_EXCEPTION: "uncaughtException",
  UNHANDLED_REJECTION: "unhandledRejection"
});

const APP_BOOT_PROCESS_ERROR_HOOKS = Object.freeze([
  [APP_BOOT_PROCESS_EVENTS.UNCAUGHT_EXCEPTION, "Uncaught exception in main process."],
  [APP_BOOT_PROCESS_EVENTS.UNHANDLED_REJECTION, "Unhandled promise rejection in main process."]
]);

const APP_BOOT_GPU_EVENT = Object.freeze({
  TYPE: "GPU"
});

const APP_BOOT_DEFAULT_GPU_TEXT = Object.freeze({
  VALUE: "default"
});

const APP_BOOT_PLATFORM = Object.freeze({
  MACOS: "darwin"
});

const APP_BOOT_RUNTIME_TEXT = Object.freeze({
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
  APP_BOOT_PROCESS_ERROR_HOOKS,
  APP_BOOT_GPU_EVENT,
  APP_BOOT_DEFAULT_GPU_TEXT,
  APP_BOOT_PLATFORM,
  APP_BOOT_RUNTIME_TEXT
};
