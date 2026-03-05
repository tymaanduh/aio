"use strict";

function create_app_boot_runtime({
  app,
  BrowserWindow,
  process_obj = process,
  normalize_service,
  runtime_log_service,
  gpu_service,
  run_window_pre_load,
  run_window_post_load,
  create_main_window,
  app_boot_specs
}) {
  const {
    APP_BOOT_WINDOW_SCOPE,
    APP_BOOT_CLEAN_TEXT_LIMITS,
    APP_BOOT_LOG_LEVEL,
    APP_BOOT_LOG_SOURCE,
    APP_BOOT_LOG_CONTEXT,
    APP_BOOT_ENV_KEYS,
    APP_BOOT_ENV_VALUES,
    APP_BOOT_APP_EVENTS,
    APP_BOOT_PROCESS_ERROR_HOOKS,
    APP_BOOT_GPU_EVENT,
    APP_BOOT_DEFAULT_GPU_TEXT,
    APP_BOOT_PLATFORM,
    APP_BOOT_RUNTIME_TEXT
  } = app_boot_specs;

  const APP_BOOT_RUNTIME_STATE = {
    main_window_ref: null
  };

  function log_runtime(level, source, message, context) {
    runtime_log_service.append_runtime_log({
      level,
      source,
      message,
      context
    });
  }

  function run_window_lifecycle_wrapper(window_scope, create_window_logic) {
    run_window_pre_load({ window_scope });
    const window_instance = create_window_logic();
    run_window_post_load({ window_scope });
    return window_instance;
  }

  function create_and_show_main_window() {
    APP_BOOT_RUNTIME_STATE.main_window_ref = run_window_lifecycle_wrapper(
      APP_BOOT_WINDOW_SCOPE.MAIN,
      create_main_window
    );
    log_runtime(
      APP_BOOT_LOG_LEVEL.INFO,
      APP_BOOT_LOG_SOURCE.MAIN,
      APP_BOOT_RUNTIME_TEXT.MAIN_WINDOW_CREATED,
      APP_BOOT_LOG_CONTEXT.CREATE_MAIN_WINDOW
    );
    return APP_BOOT_RUNTIME_STATE.main_window_ref;
  }

  function open_log_console_if_requested() {
    if (process_obj.env[APP_BOOT_ENV_KEYS.OPEN_LOG_CONSOLE] === APP_BOOT_ENV_VALUES.ENABLED) {
      runtime_log_service.create_log_console_window();
    }
  }

  function log_app_ready_diagnostics() {
    const gpu_state = gpu_service.get_gpu_state();
    log_runtime(
      APP_BOOT_LOG_LEVEL.INFO,
      APP_BOOT_LOG_SOURCE.MAIN,
      APP_BOOT_RUNTIME_TEXT.APP_READY,
      APP_BOOT_LOG_CONTEXT.APP_READY
    );
    log_runtime(
      APP_BOOT_LOG_LEVEL.INFO,
      APP_BOOT_LOG_SOURCE.GPU,
      `GPU mode: ${gpu_state.effectiveGpuMode} | ANGLE: ${
        gpu_state.effectiveAngleBackend || APP_BOOT_DEFAULT_GPU_TEXT.VALUE
      } | GL: ${gpu_state.effectiveGlImplementation || APP_BOOT_DEFAULT_GPU_TEXT.VALUE}`,
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
      process_obj.env[APP_BOOT_ENV_KEYS.GPU_RECOVERED] !== APP_BOOT_ENV_VALUES.ENABLED;

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
      args: process_obj.argv.slice(1),
      env: {
        ...process_obj.env,
        [APP_BOOT_ENV_KEYS.GPU_MODE]: APP_BOOT_ENV_VALUES.GPU_MODE_OFF,
        [APP_BOOT_ENV_KEYS.GPU_RECOVERED]: APP_BOOT_ENV_VALUES.ENABLED
      }
    });
    app.exit(0);
  }

  function bind_runtime_error_hooks() {
    APP_BOOT_PROCESS_ERROR_HOOKS.forEach(([event_name, message]) => {
      process_obj.on(event_name, (error_or_reason) => {
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
      if (process_obj.platform !== APP_BOOT_PLATFORM.MACOS) {
        app.quit();
      }
    });
  }

  return Object.freeze({
    create_and_show_main_window,
    open_log_console_if_requested,
    log_app_ready_diagnostics,
    bind_app_lifecycle_hooks,
    bind_runtime_error_hooks
  });
}

module.exports = {
  create_app_boot_runtime
};
