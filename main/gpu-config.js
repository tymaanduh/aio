"use strict";

const electron = require("electron");
const GPU_CONFIG_CATALOG = require("../data/input/shared/main/gpu_config_catalog.json");

const app = electron && typeof electron === "object" ? electron.app : null;

function as_object(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function as_non_empty_text(value, fallback) {
  if (typeof value !== "string") {
    return fallback;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}

function as_non_empty_text_list(value, fallback) {
  const source = Array.isArray(value) ? value : fallback;
  const output = [];
  for (const item of source) {
    if (typeof item !== "string") {
      continue;
    }
    const normalized = item.trim().toLowerCase();
    if (!normalized || output.includes(normalized)) {
      continue;
    }
    output.push(normalized);
  }
  return output.length ? output : fallback.slice();
}

const gpuMode = (() => {
  const source = as_object(GPU_CONFIG_CATALOG.mode);
  return Object.freeze({
    AUTO: as_non_empty_text(source.auto, "auto").toLowerCase(),
    ON: as_non_empty_text(source.on, "on").toLowerCase(),
    OFF: as_non_empty_text(source.off, "off").toLowerCase()
  });
})();

const gpuPlatform = (() => {
  const source = as_object(GPU_CONFIG_CATALOG.platform);
  return Object.freeze({
    WINDOWS: as_non_empty_text(source.windows, "win32").toLowerCase()
  });
})();

const gpuStatusText = (() => {
  const source = as_object(GPU_CONFIG_CATALOG.status_text);
  return Object.freeze({
    DEFAULT: as_non_empty_text(source.default, "default"),
    UNAVAILABLE: as_non_empty_text(source.unavailable, "unavailable"),
    DISABLED: as_non_empty_text(source.disabled, "disabled"),
    NOT_APPLICABLE: as_non_empty_text(source.not_applicable, "n/a")
  });
})();

const gpuDefaults = (() => {
  const source = as_object(GPU_CONFIG_CATALOG.defaults);
  return Object.freeze({
    ANGLE_BACKEND: as_non_empty_text(source.angle_backend, "d3d11").toLowerCase(),
    WINDOWS_GL_IMPLEMENTATION: as_non_empty_text(source.windows_gl_implementation, "angle").toLowerCase()
  });
})();

const gpuSwitch = (() => {
  const source = as_object(GPU_CONFIG_CATALOG.switches);
  return Object.freeze({
    USE_ANGLE: as_non_empty_text(source.use_angle, "use-angle"),
    USE_GL: as_non_empty_text(source.use_gl, "use-gl"),
    ENABLE_DIRECT_COMPOSITION: as_non_empty_text(source.enable_direct_composition, "enable-direct-composition"),
    ENABLE_GPU_RASTERIZATION: as_non_empty_text(source.enable_gpu_rasterization, "enable-gpu-rasterization"),
    ENABLE_ZERO_COPY: as_non_empty_text(source.enable_zero_copy, "enable-zero-copy"),
    ENABLE_NATIVE_GPU_MEMORY_BUFFERS: as_non_empty_text(
      source.enable_native_gpu_memory_buffers,
      "enable-native-gpu-memory-buffers"
    ),
    DISABLE_FRAME_RATE_LIMIT: as_non_empty_text(source.disable_frame_rate_limit, "disable-frame-rate-limit"),
    DISABLE_GPU_VSYNC: as_non_empty_text(source.disable_gpu_vsync, "disable-gpu-vsync"),
    IGNORE_GPU_BLOCKLIST: as_non_empty_text(source.ignore_gpu_blocklist, "ignore-gpu-blocklist")
  });
})();

const gpuAllowed = (() => {
  const source = as_object(GPU_CONFIG_CATALOG.allowed);
  const angleBackends = as_non_empty_text_list(
    source.angle_backends,
    ["d3d11", "d3d11on12", "gl", "vulkan", "swiftshader"]
  );
  const glImplementations = as_non_empty_text_list(
    source.gl_implementations,
    ["angle", "desktop", "egl", "swiftshader"]
  );
  return Object.freeze({
    ANGLE_BACKENDS: new Set(angleBackends),
    GL_IMPLEMENTATIONS: new Set(glImplementations)
  });
})();

const gpuEnvKey = (() => {
  const source = as_object(GPU_CONFIG_CATALOG.env_key);
  return Object.freeze({
    FORCE_GPU: as_non_empty_text(source.force_gpu, "DICTIONARY_FORCE_GPU"),
    FPS_BOOST: as_non_empty_text(source.fps_boost, "DICTIONARY_FPS_BOOST"),
    AGGRESSIVE_GPU: as_non_empty_text(source.aggressive_gpu, "DICTIONARY_AGGRESSIVE_GPU"),
    GPU_AUTO_RECOVER: as_non_empty_text(source.gpu_auto_recover, "DICTIONARY_GPU_AUTO_RECOVER"),
    NON_WINDOWS_GPU: as_non_empty_text(source.non_windows_gpu, "DICTIONARY_NON_WINDOWS_GPU"),
    GPU_MODE: as_non_empty_text(source.gpu_mode, "DICTIONARY_GPU_MODE"),
    ANGLE_BACKEND: as_non_empty_text(source.angle_backend, "DICTIONARY_ANGLE_BACKEND"),
    GL_BACKEND: as_non_empty_text(source.gl_backend, "DICTIONARY_GL_BACKEND"),
    DISABLE_GPU: as_non_empty_text(source.disable_gpu, "DICTIONARY_DISABLE_GPU")
  });
})();

const gpuEnvValue = (() => {
  const source = as_object(GPU_CONFIG_CATALOG.env_value);
  return Object.freeze({
    ENABLED: as_non_empty_text(source.enabled, "1"),
    DISABLED: as_non_empty_text(source.disabled, "0"),
    ON: as_non_empty_text(source.on, "on").toLowerCase()
  });
})();

const forceGpuMode = process.env[gpuEnvKey.FORCE_GPU] === gpuEnvValue.ENABLED;
const fpsBoostEnabled = process.env[gpuEnvKey.FPS_BOOST] === gpuEnvValue.ENABLED;
const aggressiveGpuFlagsEnabled =
  process.env[gpuEnvKey.AGGRESSIVE_GPU] === gpuEnvValue.ENABLED || forceGpuMode;
const gpuAutoRecoverEnabled = process.env[gpuEnvKey.GPU_AUTO_RECOVER] !== gpuEnvValue.DISABLED;
const nonWindowsGpuAutoOff = process.env[gpuEnvKey.NON_WINDOWS_GPU] !== gpuEnvValue.ON;

function normalize_gpu_token(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

const requestedGpuMode = normalize_gpu_token(process.env[gpuEnvKey.GPU_MODE] || gpuMode.AUTO);
const requestedAngleBackend = normalize_gpu_token(process.env[gpuEnvKey.ANGLE_BACKEND] || "");
const requestedGlImplementation = normalize_gpu_token(process.env[gpuEnvKey.GL_BACKEND] || "");

let effectiveGpuMode = gpuMode.AUTO;
let effectiveAngleBackend = "";
let effectiveGlImplementation = "";
const gpuSwitchesApplied = [];
let gpuCrashCount = 0;

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
    gpuSwitchesApplied.push(`--${name}=${value}`);
    return;
  }
  app.commandLine.appendSwitch(name);
  gpuSwitchesApplied.push(`--${name}`);
}

function disable_hardware_acceleration() {
  if (typeof app?.disableHardwareAcceleration === "function") {
    app.disableHardwareAcceleration();
  }
}

function apply_gpu_disabled_state(status_text) {
  effectiveGpuMode = gpuMode.OFF;
  effectiveAngleBackend = status_text;
  effectiveGlImplementation = status_text;
}

function configure_windows_gpu_switches() {
  const angleBackend =
    normalizeOptionalToken(requestedAngleBackend, gpuAllowed.ANGLE_BACKENDS) || gpuDefaults.ANGLE_BACKEND;
  const glImplementation =
    normalizeOptionalToken(requestedGlImplementation, gpuAllowed.GL_IMPLEMENTATIONS) ||
    gpuDefaults.WINDOWS_GL_IMPLEMENTATION;

  append_gpu_switch(gpuSwitch.USE_ANGLE, angleBackend);
  append_gpu_switch(gpuSwitch.USE_GL, glImplementation);
  append_gpu_switch(gpuSwitch.ENABLE_DIRECT_COMPOSITION);

  effectiveAngleBackend = angleBackend;
  effectiveGlImplementation = glImplementation;
}

function configure_non_windows_gpu_switches() {
  const glImplementation = normalizeOptionalToken(requestedGlImplementation, gpuAllowed.GL_IMPLEMENTATIONS);
  if (glImplementation) {
    append_gpu_switch(gpuSwitch.USE_GL, glImplementation);
    effectiveGlImplementation = glImplementation;
  } else {
    effectiveGlImplementation = gpuStatusText.DEFAULT;
  }
  effectiveAngleBackend = gpuStatusText.NOT_APPLICABLE;
}

function configure_gpu_performance_switches() {
  if (aggressiveGpuFlagsEnabled || requestedGpuMode === gpuMode.ON) {
    append_gpu_switch(gpuSwitch.ENABLE_GPU_RASTERIZATION);
    append_gpu_switch(gpuSwitch.ENABLE_ZERO_COPY);
    append_gpu_switch(gpuSwitch.ENABLE_NATIVE_GPU_MEMORY_BUFFERS);
  }
  if (fpsBoostEnabled) {
    append_gpu_switch(gpuSwitch.DISABLE_FRAME_RATE_LIMIT);
    append_gpu_switch(gpuSwitch.DISABLE_GPU_VSYNC);
  }
}

function configureGpuMode() {
  if (!app) {
    apply_gpu_disabled_state(gpuStatusText.UNAVAILABLE);
    return;
  }

  if (
    requestedGpuMode === gpuMode.OFF ||
    process.env[gpuEnvKey.DISABLE_GPU] === gpuEnvValue.ENABLED
  ) {
    disable_hardware_acceleration();
    apply_gpu_disabled_state(gpuStatusText.DISABLED);
    return;
  }

  if (
    process.platform !== gpuPlatform.WINDOWS &&
    requestedGpuMode === gpuMode.AUTO &&
    !forceGpuMode &&
    nonWindowsGpuAutoOff
  ) {
    disable_hardware_acceleration();
    apply_gpu_disabled_state(gpuStatusText.DISABLED);
    return;
  }

  if (process.platform === gpuPlatform.WINDOWS) {
    configure_windows_gpu_switches();
  } else {
    configure_non_windows_gpu_switches();
  }

  configure_gpu_performance_switches();

  if (requestedGpuMode === gpuMode.ON || forceGpuMode) {
    append_gpu_switch(gpuSwitch.IGNORE_GPU_BLOCKLIST);
    effectiveGpuMode = gpuMode.ON;
    return;
  }
  effectiveGpuMode = gpuMode.AUTO;
}

async function getGpuDiagnostics() {
  let gpuInfo = null;
  try {
    if (typeof app?.getGPUInfo === "function") {
      gpuInfo = await app.getGPUInfo("basic");
    }
  } catch {
    gpuInfo = null;
  }

  const featureStatus = typeof app?.getGPUFeatureStatus === "function" ? app.getGPUFeatureStatus() : null;

  return {
    ok: true,
    platform: process.platform,
    requestedGpuMode,
    effectiveGpuMode,
    fpsBoostEnabled,
    aggressiveGpuFlagsEnabled,
    gpuAutoRecoverEnabled,
    nonWindowsGpuAutoOff,
    requestedAngleBackend: requestedAngleBackend || null,
    effectiveAngleBackend: effectiveAngleBackend || null,
    requestedGlImplementation: requestedGlImplementation || null,
    effectiveGlImplementation: effectiveGlImplementation || null,
    switches: gpuSwitchesApplied.slice(),
    featureStatus,
    gpuInfo
  };
}

function incrementGpuCrashCount() {
  gpuCrashCount += 1;
  return gpuCrashCount;
}

function getGpuState() {
  return {
    effectiveGpuMode,
    effectiveAngleBackend,
    effectiveGlImplementation,
    gpuSwitchesApplied,
    gpuCrashCount,
    GPU_MODE_OFF: gpuMode.OFF,
    GPU_AUTO_RECOVER_ENABLED: gpuAutoRecoverEnabled
  };
}

module.exports = {
  GPU_MODE_OFF: gpuMode.OFF,
  GPU_AUTO_RECOVER_ENABLED: gpuAutoRecoverEnabled,
  configureGpuMode,
  getGpuDiagnostics,
  incrementGpuCrashCount,
  getGpuState
};
