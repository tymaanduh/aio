"use strict";

const { app, BrowserWindow, ipcMain, nativeTheme } = require("electron");

const normalize_service = require("../services/normalize_service.js");
const auth_service = require("../services/auth_service.js");
const runtime_log_service = require("../services/runtime_log_service.js");
const gpu_service = require("../services/gpu_service.js");

const repository_state = require("../data/repository_state.js");
const repository_auth = require("../data/repository_auth.js");
const repository_diagnostics = require("../data/repository_diagnostics.js");
const repository_universe = require("../data/repository_universe.js");
const repository_ui_preferences = require("../data/repository_ui_preferences.js");
const { run_data_pre_load } = require("../data/data_pre_load.js");
const { run_data_post_load } = require("../data/data_post_load.js");

const { register_ipc_routes } = require("../ipc/ipc_register.js");
const { run_window_pre_load } = require("../windows/window_pre_load.js");
const { run_window_post_load } = require("../windows/window_post_load.js");
const { create_main_window } = require("../windows/main_window_create.js");
const { run_app_pre_load } = require("./app_pre_load.js");
const { run_app_post_load } = require("./app_post_load.js");
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

let main_window_ref = null;

function log_runtime(level, source, message, context) {
  runtime_log_service.append_runtime_log({
    level,
    source,
    message,
    context
  });
}

function create_and_show_main_window() {
  main_window_ref = run_window_lifecycle_wrapper(APP_BOOT_WINDOW_SCOPE.MAIN, create_main_window);
  log_runtime(
    APP_BOOT_LOG_LEVEL.INFO,
    APP_BOOT_LOG_SOURCE.MAIN,
    APP_BOOT_RUNTIME_TEXT.MAIN_WINDOW_CREATED,
    APP_BOOT_LOG_CONTEXT.CREATE_MAIN_WINDOW
  );
  return main_window_ref;
}

function run_window_lifecycle_wrapper(window_scope, create_window_logic) {
  run_window_pre_load({ window_scope });
  const window_instance = create_window_logic();
  run_window_post_load({ window_scope });
  return window_instance;
}

function open_log_console_if_requested() {
  if (process.env[APP_BOOT_ENV_KEYS.OPEN_LOG_CONSOLE] === APP_BOOT_ENV_VALUES.ENABLED) {
    runtime_log_service.create_log_console_window();
  }
}

function log_app_ready_diagnostics() {
  const gpu_state = gpu_service.get_gpu_state();
  log_runtime(APP_BOOT_LOG_LEVEL.INFO, APP_BOOT_LOG_SOURCE.MAIN, APP_BOOT_RUNTIME_TEXT.APP_READY, APP_BOOT_LOG_CONTEXT.APP_READY);
  log_runtime(
    APP_BOOT_LOG_LEVEL.INFO,
    APP_BOOT_LOG_SOURCE.GPU,
    `GPU mode: ${gpu_state.effectiveGpuMode} | ANGLE: ${gpu_state.effectiveAngleBackend || APP_BOOT_DEFAULT_GPU_TEXT.VALUE} | GL: ${gpu_state.effectiveGlImplementation || APP_BOOT_DEFAULT_GPU_TEXT.VALUE}`,
    JSON.stringify({
      switches: gpu_state.gpuSwitchesApplied,
      featureStatus: app.getGPUFeatureStatus()
    })
  );
}

function maybe_recover_from_gpu_crash(crash_count, gpu_state) {
  const should_recover =
    gpu_state.GPU_AUTO_RECOVER_ENABLED &&
    gpu_state.effectiveGpuMode !== gpu_state.GPU_MODE_OFF &&
    crash_count >= 2 &&
    process.env[APP_BOOT_ENV_KEYS.GPU_RECOVERED] !== APP_BOOT_ENV_VALUES.ENABLED;

  if (!should_recover) {
    return;
  }

  log_runtime(
    APP_BOOT_LOG_LEVEL.WARN,
    APP_BOOT_LOG_SOURCE.GPU,
    APP_BOOT_RUNTIME_TEXT.GPU_INSTABILITY,
    APP_BOOT_LOG_CONTEXT.GPU_AUTO_RECOVER
  );
  app.relaunch({
    args: process.argv.slice(1),
    env: {
      ...process.env,
      [APP_BOOT_ENV_KEYS.GPU_MODE]: APP_BOOT_ENV_VALUES.GPU_MODE_OFF,
      [APP_BOOT_ENV_KEYS.GPU_RECOVERED]: APP_BOOT_ENV_VALUES.ENABLED
    }
  });
  app.exit(0);
}

function bind_runtime_error_hooks() {
  APP_BOOT_PROCESS_ERROR_HOOKS.forEach(([event_name, message]) => {
    process.on(event_name, (error_or_reason) => {
      log_runtime(
        APP_BOOT_LOG_LEVEL.ERROR,
        APP_BOOT_LOG_SOURCE.MAIN,
        message,
        normalize_service.clean_text(
          String(error_or_reason?.stack || error_or_reason?.message || error_or_reason),
          APP_BOOT_CLEAN_TEXT_LIMITS.PROCESS_ERROR
        )
      );
    });
  });
}

function bind_app_lifecycle_hooks() {
  app.on(APP_BOOT_APP_EVENTS.ACTIVATE, () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      create_and_show_main_window();
    }
  });

  app.on(APP_BOOT_APP_EVENTS.CHILD_PROCESS_GONE, (_event, details) => {
    if (details?.type !== APP_BOOT_GPU_EVENT.TYPE) {
      return;
    }

    const crash_count = gpu_service.increment_gpu_crash_count();
    log_runtime(
      APP_BOOT_LOG_LEVEL.WARN,
      APP_BOOT_LOG_SOURCE.GPU,
      APP_BOOT_RUNTIME_TEXT.GPU_EXITED,
      normalize_service.clean_text(JSON.stringify(details), APP_BOOT_CLEAN_TEXT_LIMITS.GPU_DETAILS)
    );
    maybe_recover_from_gpu_crash(crash_count, gpu_service.get_gpu_state());
  });

  app.on(APP_BOOT_APP_EVENTS.WINDOW_ALL_CLOSED, () => {
    if (process.platform !== APP_BOOT_PLATFORM.MACOS) {
      app.quit();
    }
  });
}

function create_ipc_dependencies() {
  return {
    auth_service,
    runtime_log_service,
    gpu_service,
    normalize_service,
    repository_state,
    repository_auth,
    repository_diagnostics,
    repository_universe,
    repository_ui_preferences
  };
}

function inject_auth_repository_binding() {
  auth_service.inject_auth_repository({
    load_auth_state: repository_auth.load_auth_state,
    save_auth_state: repository_auth.save_auth_state
  });
}

async function bootstrap_main_app() {
  let bootstrap_ctx = {
    app,
    ipc_main: ipcMain,
    gpu_service,
    runtime_log_service,
    APP_BOOT_HOOK_REGISTRY
  };

  bootstrap_ctx = run_app_pre_load(bootstrap_ctx);
  nativeTheme.themeSource = APP_BOOT_THEME.SOURCE_DARK;

  await run_data_pre_load();

  inject_auth_repository_binding();
  register_ipc_routes(ipcMain, create_ipc_dependencies());

  create_and_show_main_window();
  open_log_console_if_requested();
  await run_data_post_load();
  log_app_ready_diagnostics();

  bind_app_lifecycle_hooks();
  bind_runtime_error_hooks();

  bootstrap_ctx = run_app_post_load(bootstrap_ctx);
  return bootstrap_ctx;
}

module.exports = {
  bootstrap_main_app
};
