"use strict";

const { app, BrowserWindow, ipcMain, nativeTheme } = require("electron");

const normalize_service = require("../services/normalize_service.js");
const auth_service = require("../services/auth_service.js");
const runtime_log_service = require("../services/runtime_log_service.js");
const gpu_service = require("../services/gpu_service.js");
const language_bridge_service = require("../services/language_bridge_service.js");
const { createPlatformRuntimeService } = require("../services/platform_runtime_service.js");

const repository_state = require("../data/repository_state.js");
const repository_auth = require("../data/repository_auth.js");
const repository_diagnostics = require("../data/repository_diagnostics.js");
const repository_universe = require("../data/repository_universe.js");
const repository_ui_preferences = require("../data/repository_ui_preferences.js");
const repository_language_bridge = require("../data/repository_language_bridge.js");
const { run_data_pre_load } = require("../data/data_pre_load.js");
const { run_data_post_load } = require("../data/data_post_load.js");

const { register_ipc_routes } = require("../ipc/ipc_register.js");
const { create_main_window } = require("../windows/main_window_create.js");
const { run_app_pre_load } = require("./app_pre_load.js");
const { run_app_post_load } = require("./app_post_load.js");
const { run_window_pre_load } = require("../windows/window_pre_load.js");
const { run_window_post_load } = require("../windows/window_post_load.js");
const APP_BOOT_SPECS = require("./app_boot_specs.js");
const { APP_BOOT_THEME, APP_BOOT_HOOK_REGISTRY } = APP_BOOT_SPECS;
const { create_app_boot_runtime } = require("./app_boot_runtime.js");

const platform_runtime_service = createPlatformRuntimeService();

function create_ipc_dependencies() {
  return {
    auth_service,
    runtime_log_service,
    gpu_service,
    language_bridge_service,
    normalize_service,
    repository_state,
    repository_auth,
    repository_diagnostics,
    repository_universe,
    repository_ui_preferences,
    repository_language_bridge,
    platform_runtime_service
  };
}

function inject_auth_repository_binding() {
  auth_service.inject_auth_repository({
    load_auth_state: repository_auth.load_auth_state,
    save_auth_state: repository_auth.save_auth_state
  });
}

function inject_language_bridge_repository_binding() {
  language_bridge_service.inject_language_bridge_repository({
    load_bridge_state: repository_language_bridge.load_language_bridge_state,
    save_bridge_state: repository_language_bridge.save_language_bridge_state
  });
}

const APP_BOOT_RUNTIME = create_app_boot_runtime({
  app,
  BrowserWindow,
  process_obj: process,
  normalize_service,
  runtime_log_service,
  gpu_service,
  run_window_pre_load,
  run_window_post_load,
  create_main_window,
  app_boot_specs: APP_BOOT_SPECS
});

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
  inject_language_bridge_repository_binding();
  register_ipc_routes(ipcMain, create_ipc_dependencies());

  APP_BOOT_RUNTIME.create_and_show_main_window();
  APP_BOOT_RUNTIME.open_log_console_if_requested();
  await run_data_post_load();
  const platformRuntimeStatus = platform_runtime_service.get_platform_runtime_status();
  runtime_log_service.append_runtime_log({
    level: "info",
    source: "main",
    message: `Neutral core platform: ${platformRuntimeStatus.shell_selection.selected_shell || "unavailable"} shell`,
    context: JSON.stringify({
      runtime_selection_snapshot: platformRuntimeStatus.runtime_selection_snapshot,
      storage_runtime_selection: platformRuntimeStatus.storage_runtime_selection,
      shell_selection: platformRuntimeStatus.shell_selection,
      active_storage_backend: platformRuntimeStatus.active_storage_backend
    })
  });
  APP_BOOT_RUNTIME.log_app_ready_diagnostics();

  APP_BOOT_RUNTIME.bind_app_lifecycle_hooks();
  APP_BOOT_RUNTIME.bind_runtime_error_hooks();

  bootstrap_ctx = run_app_post_load(bootstrap_ctx);
  return bootstrap_ctx;
}

module.exports = {
  bootstrap_main_app
};
