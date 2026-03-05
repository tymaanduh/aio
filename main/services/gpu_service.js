"use strict";

const gpu = require("../gpu_config.js");

const GPU_SERVICE_API = Object.freeze({
  GPU_MODE_OFF: gpu.GPU_MODE_OFF,
  GPU_AUTO_RECOVER_ENABLED: gpu.GPU_AUTO_RECOVER_ENABLED,
  configure_gpu_mode: gpu.configureGpuMode,
  get_gpu_diagnostics: gpu.getGpuDiagnostics,
  increment_gpu_crash_count: gpu.incrementGpuCrashCount,
  get_gpu_state: gpu.getGpuState
});

module.exports = GPU_SERVICE_API;

