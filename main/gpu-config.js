"use strict";

const electron = require("electron");
const app = electron && typeof electron === "object" ? electron.app : null;

const GPU_MODE_AUTO = "auto";
const GPU_MODE_ON = "on";
const GPU_MODE_OFF = "off";
const ANGLE_BACKEND_DEFAULT = "d3d11";
const ANGLE_BACKEND_ALLOWED = new Set(["d3d11", "d3d11on12", "gl", "vulkan", "swiftshader"]);
const GL_IMPLEMENTATION_ALLOWED = new Set(["angle", "desktop", "egl", "swiftshader"]);
const FORCE_GPU_MODE = process.env.DICTIONARY_FORCE_GPU === "1";
const FPS_BOOST_ENABLED = process.env.DICTIONARY_FPS_BOOST === "1";
const AGGRESSIVE_GPU_FLAGS_ENABLED = process.env.DICTIONARY_AGGRESSIVE_GPU === "1" || FORCE_GPU_MODE;
const GPU_AUTO_RECOVER_ENABLED = process.env.DICTIONARY_GPU_AUTO_RECOVER !== "0";
const NON_WINDOWS_GPU_AUTO_OFF = process.env.DICTIONARY_NON_WINDOWS_GPU !== "on";

const requestedGpuMode = String(process.env.DICTIONARY_GPU_MODE || GPU_MODE_AUTO)
  .trim()
  .toLowerCase();
const requestedAngleBackend = String(process.env.DICTIONARY_ANGLE_BACKEND || "")
  .trim()
  .toLowerCase();
const requestedGlImplementation = String(process.env.DICTIONARY_GL_BACKEND || "")
  .trim()
  .toLowerCase();
let effectiveGpuMode = GPU_MODE_AUTO;
let effectiveAngleBackend = "";
let effectiveGlImplementation = "";
const gpuSwitchesApplied = [];
let gpuCrashCount = 0;

function normalizeOptionalToken(value, allowedValues) {
  const normalized = String(value || "")
    .trim()
    .toLowerCase();
  if (!normalized || !(allowedValues instanceof Set)) {
    return "";
  }
  return allowedValues.has(normalized) ? normalized : "";
}

function appendGpuSwitch(name, value = null) {
  if (!app || !app.commandLine || typeof app.commandLine.appendSwitch !== "function") {
    return;
  }
  if (!name) {
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

function configureGpuMode() {
  if (!app) {
    effectiveGpuMode = GPU_MODE_OFF;
    effectiveAngleBackend = "unavailable";
    effectiveGlImplementation = "unavailable";
    return;
  }

  if (requestedGpuMode === GPU_MODE_OFF || process.env.DICTIONARY_DISABLE_GPU === "1") {
    if (typeof app.disableHardwareAcceleration === "function") {
      app.disableHardwareAcceleration();
    }
    effectiveGpuMode = GPU_MODE_OFF;
    effectiveAngleBackend = "disabled";
    effectiveGlImplementation = "disabled";
    return;
  }

  if (
    process.platform !== "win32" &&
    requestedGpuMode === GPU_MODE_AUTO &&
    !FORCE_GPU_MODE &&
    NON_WINDOWS_GPU_AUTO_OFF
  ) {
    if (typeof app.disableHardwareAcceleration === "function") {
      app.disableHardwareAcceleration();
    }
    effectiveGpuMode = GPU_MODE_OFF;
    effectiveAngleBackend = "disabled";
    effectiveGlImplementation = "disabled";
    return;
  }

  if (process.platform === "win32") {
    const angleBackend = normalizeOptionalToken(requestedAngleBackend, ANGLE_BACKEND_ALLOWED) || ANGLE_BACKEND_DEFAULT;
    const glImplementation = normalizeOptionalToken(requestedGlImplementation, GL_IMPLEMENTATION_ALLOWED) || "angle";
    appendGpuSwitch("use-angle", angleBackend);
    appendGpuSwitch("use-gl", glImplementation);
    appendGpuSwitch("enable-direct-composition");
    effectiveAngleBackend = angleBackend;
    effectiveGlImplementation = glImplementation;
  } else {
    const glImplementation = normalizeOptionalToken(requestedGlImplementation, GL_IMPLEMENTATION_ALLOWED);
    if (glImplementation) {
      appendGpuSwitch("use-gl", glImplementation);
      effectiveGlImplementation = glImplementation;
    } else {
      effectiveGlImplementation = "default";
    }
    effectiveAngleBackend = "n/a";
  }

  if (AGGRESSIVE_GPU_FLAGS_ENABLED || requestedGpuMode === GPU_MODE_ON) {
    appendGpuSwitch("enable-gpu-rasterization");
    appendGpuSwitch("enable-zero-copy");
    appendGpuSwitch("enable-native-gpu-memory-buffers");
  }
  if (FPS_BOOST_ENABLED) {
    appendGpuSwitch("disable-frame-rate-limit");
    appendGpuSwitch("disable-gpu-vsync");
  }

  if (requestedGpuMode === GPU_MODE_ON || FORCE_GPU_MODE) {
    appendGpuSwitch("ignore-gpu-blocklist");
    effectiveGpuMode = GPU_MODE_ON;
    return;
  }

  effectiveGpuMode = GPU_MODE_AUTO;
}

async function getGpuDiagnostics() {
  let gpuInfo = null;
  try {
    if (app && typeof app.getGPUInfo === "function") {
      gpuInfo = await app.getGPUInfo("basic");
    }
  } catch {
    gpuInfo = null;
  }
  const featureStatus = app && typeof app.getGPUFeatureStatus === "function" ? app.getGPUFeatureStatus() : null;
  return {
    ok: true,
    platform: process.platform,
    requestedGpuMode,
    effectiveGpuMode,
    fpsBoostEnabled: FPS_BOOST_ENABLED,
    aggressiveGpuFlagsEnabled: AGGRESSIVE_GPU_FLAGS_ENABLED,
    gpuAutoRecoverEnabled: GPU_AUTO_RECOVER_ENABLED,
    nonWindowsGpuAutoOff: NON_WINDOWS_GPU_AUTO_OFF,
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
    GPU_MODE_OFF,
    GPU_AUTO_RECOVER_ENABLED
  };
}

module.exports = {
  GPU_MODE_OFF,
  GPU_AUTO_RECOVER_ENABLED,
  configureGpuMode,
  getGpuDiagnostics,
  incrementGpuCrashCount,
  getGpuState
};
