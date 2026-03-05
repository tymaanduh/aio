"use strict";

const electron = require("electron");

const app = electron && typeof electron === "object" ? electron.app : null;

const GPU_MODE = Object.freeze({
  AUTO: "auto",
  ON: "on",
  OFF: "off"
});

const GPU_PLATFORM = Object.freeze({
  WINDOWS: "win32"
});

const GPU_STATUS_TEXT = Object.freeze({
  DEFAULT: "default",
  UNAVAILABLE: "unavailable",
  DISABLED: "disabled",
  NOT_APPLICABLE: "n/a"
});

const GPU_DEFAULTS = Object.freeze({
  ANGLE_BACKEND: "d3d11",
  WINDOWS_GL_IMPLEMENTATION: "angle"
});

const GPU_SWITCH = Object.freeze({
  USE_ANGLE: "use-angle",
  USE_GL: "use-gl",
  ENABLE_DIRECT_COMPOSITION: "enable-direct-composition",
  ENABLE_GPU_RASTERIZATION: "enable-gpu-rasterization",
  ENABLE_ZERO_COPY: "enable-zero-copy",
  ENABLE_NATIVE_GPU_MEMORY_BUFFERS: "enable-native-gpu-memory-buffers",
  DISABLE_FRAME_RATE_LIMIT: "disable-frame-rate-limit",
  DISABLE_GPU_VSYNC: "disable-gpu-vsync",
  IGNORE_GPU_BLOCKLIST: "ignore-gpu-blocklist"
});

const GPU_ALLOWED = Object.freeze({
  ANGLE_BACKENDS: new Set(["d3d11", "d3d11on12", "gl", "vulkan", "swiftshader"]),
  GL_IMPLEMENTATIONS: new Set(["angle", "desktop", "egl", "swiftshader"])
});

const GPU_ENV_KEY = Object.freeze({
  FORCE_GPU: "DICTIONARY_FORCE_GPU",
  FPS_BOOST: "DICTIONARY_FPS_BOOST",
  AGGRESSIVE_GPU: "DICTIONARY_AGGRESSIVE_GPU",
  GPU_AUTO_RECOVER: "DICTIONARY_GPU_AUTO_RECOVER",
  NON_WINDOWS_GPU: "DICTIONARY_NON_WINDOWS_GPU",
  GPU_MODE: "DICTIONARY_GPU_MODE",
  ANGLE_BACKEND: "DICTIONARY_ANGLE_BACKEND",
  GL_BACKEND: "DICTIONARY_GL_BACKEND",
  DISABLE_GPU: "DICTIONARY_DISABLE_GPU"
});

const GPU_ENV_VALUE = Object.freeze({
  ENABLED: "1",
  DISABLED: "0",
  ON: "on"
});

const FORCE_GPU_MODE = process.env[GPU_ENV_KEY.FORCE_GPU] === GPU_ENV_VALUE.ENABLED;
const FPS_BOOST_ENABLED = process.env[GPU_ENV_KEY.FPS_BOOST] === GPU_ENV_VALUE.ENABLED;
const AGGRESSIVE_GPU_FLAGS_ENABLED =
  process.env[GPU_ENV_KEY.AGGRESSIVE_GPU] === GPU_ENV_VALUE.ENABLED || FORCE_GPU_MODE;
const GPU_AUTO_RECOVER_ENABLED = process.env[GPU_ENV_KEY.GPU_AUTO_RECOVER] !== GPU_ENV_VALUE.DISABLED;
const NON_WINDOWS_GPU_AUTO_OFF = process.env[GPU_ENV_KEY.NON_WINDOWS_GPU] !== GPU_ENV_VALUE.ON;

function normalize_gpu_token(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

const requested_gpu_mode = normalize_gpu_token(process.env[GPU_ENV_KEY.GPU_MODE] || GPU_MODE.AUTO);
const requested_angle_backend = normalize_gpu_token(process.env[GPU_ENV_KEY.ANGLE_BACKEND] || "");
const requested_gl_implementation = normalize_gpu_token(process.env[GPU_ENV_KEY.GL_BACKEND] || "");

let effective_gpu_mode = GPU_MODE.AUTO;
let effective_angle_backend = "";
let effective_gl_implementation = "";
const gpu_switches_applied = [];
let gpu_crash_count = 0;

function normalizeOptionalToken(value, allowedValues) {
  const normalized = normalize_gpu_token(value);
  if (!normalized || !(allowedValues instanceof Set)) {
    return "";
  }
  return allowedValues.has(normalized) ? normalized : "";
}

function append_gpu_switch(name, value = "") {
  if (!app?.commandLine || typeof app.commandLine.appendSwitch !== "function" || !name) {
    return;
  }
  if (typeof value === "string" && value.length > 0) {
    app.commandLine.appendSwitch(name, value);
    gpu_switches_applied.push(`--${name}=${value}`);
    return;
  }
  app.commandLine.appendSwitch(name);
  gpu_switches_applied.push(`--${name}`);
}

function disable_hardware_acceleration() {
  if (typeof app?.disableHardwareAcceleration === "function") {
    app.disableHardwareAcceleration();
  }
}

function apply_gpu_disabled_state(status_text) {
  effective_gpu_mode = GPU_MODE.OFF;
  effective_angle_backend = status_text;
  effective_gl_implementation = status_text;
}

function configure_windows_gpu_switches() {
  const angle_backend =
    normalizeOptionalToken(requested_angle_backend, GPU_ALLOWED.ANGLE_BACKENDS) || GPU_DEFAULTS.ANGLE_BACKEND;
  const gl_implementation =
    normalizeOptionalToken(requested_gl_implementation, GPU_ALLOWED.GL_IMPLEMENTATIONS) ||
    GPU_DEFAULTS.WINDOWS_GL_IMPLEMENTATION;

  append_gpu_switch(GPU_SWITCH.USE_ANGLE, angle_backend);
  append_gpu_switch(GPU_SWITCH.USE_GL, gl_implementation);
  append_gpu_switch(GPU_SWITCH.ENABLE_DIRECT_COMPOSITION);

  effective_angle_backend = angle_backend;
  effective_gl_implementation = gl_implementation;
}

function configure_non_windows_gpu_switches() {
  const gl_implementation = normalizeOptionalToken(requested_gl_implementation, GPU_ALLOWED.GL_IMPLEMENTATIONS);
  if (gl_implementation) {
    append_gpu_switch(GPU_SWITCH.USE_GL, gl_implementation);
    effective_gl_implementation = gl_implementation;
  } else {
    effective_gl_implementation = GPU_STATUS_TEXT.DEFAULT;
  }
  effective_angle_backend = GPU_STATUS_TEXT.NOT_APPLICABLE;
}

function configure_gpu_performance_switches() {
  if (AGGRESSIVE_GPU_FLAGS_ENABLED || requested_gpu_mode === GPU_MODE.ON) {
    append_gpu_switch(GPU_SWITCH.ENABLE_GPU_RASTERIZATION);
    append_gpu_switch(GPU_SWITCH.ENABLE_ZERO_COPY);
    append_gpu_switch(GPU_SWITCH.ENABLE_NATIVE_GPU_MEMORY_BUFFERS);
  }
  if (FPS_BOOST_ENABLED) {
    append_gpu_switch(GPU_SWITCH.DISABLE_FRAME_RATE_LIMIT);
    append_gpu_switch(GPU_SWITCH.DISABLE_GPU_VSYNC);
  }
}

function configureGpuMode() {
  if (!app) {
    apply_gpu_disabled_state(GPU_STATUS_TEXT.UNAVAILABLE);
    return;
  }

  if (requested_gpu_mode === GPU_MODE.OFF || process.env[GPU_ENV_KEY.DISABLE_GPU] === GPU_ENV_VALUE.ENABLED) {
    disable_hardware_acceleration();
    apply_gpu_disabled_state(GPU_STATUS_TEXT.DISABLED);
    return;
  }

  if (
    process.platform !== GPU_PLATFORM.WINDOWS &&
    requested_gpu_mode === GPU_MODE.AUTO &&
    !FORCE_GPU_MODE &&
    NON_WINDOWS_GPU_AUTO_OFF
  ) {
    disable_hardware_acceleration();
    apply_gpu_disabled_state(GPU_STATUS_TEXT.DISABLED);
    return;
  }

  if (process.platform === GPU_PLATFORM.WINDOWS) {
    configure_windows_gpu_switches();
  } else {
    configure_non_windows_gpu_switches();
  }

  configure_gpu_performance_switches();

  if (requested_gpu_mode === GPU_MODE.ON || FORCE_GPU_MODE) {
    append_gpu_switch(GPU_SWITCH.IGNORE_GPU_BLOCKLIST);
    effective_gpu_mode = GPU_MODE.ON;
    return;
  }
  effective_gpu_mode = GPU_MODE.AUTO;
}

async function getGpuDiagnostics() {
  let gpu_info = null;
  try {
    if (typeof app?.getGPUInfo === "function") {
      gpu_info = await app.getGPUInfo("basic");
    }
  } catch {
    gpu_info = null;
  }

  const feature_status = typeof app?.getGPUFeatureStatus === "function" ? app.getGPUFeatureStatus() : null;

  return {
    ok: true,
    platform: process.platform,
    requestedGpuMode: requested_gpu_mode,
    effectiveGpuMode: effective_gpu_mode,
    fpsBoostEnabled: FPS_BOOST_ENABLED,
    aggressiveGpuFlagsEnabled: AGGRESSIVE_GPU_FLAGS_ENABLED,
    gpuAutoRecoverEnabled: GPU_AUTO_RECOVER_ENABLED,
    nonWindowsGpuAutoOff: NON_WINDOWS_GPU_AUTO_OFF,
    requestedAngleBackend: requested_angle_backend || null,
    effectiveAngleBackend: effective_angle_backend || null,
    requestedGlImplementation: requested_gl_implementation || null,
    effectiveGlImplementation: effective_gl_implementation || null,
    switches: gpu_switches_applied.slice(),
    featureStatus: feature_status,
    gpuInfo: gpu_info
  };
}

function incrementGpuCrashCount() {
  gpu_crash_count += 1;
  return gpu_crash_count;
}

function getGpuState() {
  return {
    effectiveGpuMode: effective_gpu_mode,
    effectiveAngleBackend: effective_angle_backend,
    effectiveGlImplementation: effective_gl_implementation,
    gpuSwitchesApplied: gpu_switches_applied,
    gpuCrashCount: gpu_crash_count,
    GPU_MODE_OFF: GPU_MODE.OFF,
    GPU_AUTO_RECOVER_ENABLED
  };
}

module.exports = {
  GPU_MODE_OFF: GPU_MODE.OFF,
  GPU_AUTO_RECOVER_ENABLED,
  configureGpuMode,
  getGpuDiagnostics,
  incrementGpuCrashCount,
  getGpuState
};
