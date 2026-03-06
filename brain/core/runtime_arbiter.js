"use strict";

const fs = require("fs");
const path = require("path");

const DEFAULT_RUNTIME_MANIFEST_PATH = path.join(
  __dirname,
  "..",
  "..",
  "data",
  "output",
  "databases",
  "polyglot-default",
  "build",
  "runtime_implementation_manifest.json"
);

function readJsonIfExists(filePath, fallback = {}) {
  try {
    if (!fs.existsSync(filePath)) {
      return fallback;
    }
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return fallback;
  }
}

function normalizeText(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function loadRuntimeImplementationManifest(options = {}) {
  const filePath = path.resolve(options.filePath || DEFAULT_RUNTIME_MANIFEST_PATH);
  return readJsonIfExists(filePath, {});
}

function getSubsystemRuntimeRow(manifest, subsystemId, runtimeId) {
  const runtime = manifest?.runtimes && manifest.runtimes[runtimeId] ? manifest.runtimes[runtimeId] : null;
  if (!runtime || !runtime.subsystems) {
    return null;
  }
  return runtime.subsystems[subsystemId] || null;
}

function listImplementedRuntimes(manifest, subsystemId) {
  return Object.keys(manifest?.runtimes || {})
    .sort((left, right) => left.localeCompare(right))
    .filter((runtimeId) => {
      const row = getSubsystemRuntimeRow(manifest, subsystemId, runtimeId);
      return Boolean(row && row.status === "implemented" && row.production_ready === true);
    });
}

function rankRuntimeCandidates(subsystemId, options = {}) {
  const manifest = options.manifest || loadRuntimeImplementationManifest(options);
  const subsystem = manifest?.subsystems?.[subsystemId] || {};
  const benchmark = subsystem?.benchmark || {};
  const implemented = new Set(listImplementedRuntimes(manifest, subsystemId));
  const preferredFromInput = normalizeText(options.preferredRuntime || "");
  const preferredFromBenchmark = Array.isArray(benchmark.preferred_runtime_order)
    ? benchmark.preferred_runtime_order.map((item) => normalizeText(item)).filter(Boolean)
    : [];
  const fallbackOrder = Array.isArray(manifest?.fallback_language_order)
    ? manifest.fallback_language_order.map((item) => normalizeText(item)).filter(Boolean)
    : [];
  const ranked = [];
  const seen = new Set();

  function append(runtimeId, source) {
    const runtime = normalizeText(runtimeId);
    if (!runtime || seen.has(runtime) || !implemented.has(runtime)) {
      return;
    }
    seen.add(runtime);
    ranked.push({
      runtime_id: runtime,
      source
    });
  }

  append(preferredFromInput, "preferred_input");
  preferredFromBenchmark.forEach((runtimeId) => append(runtimeId, "benchmark"));
  fallbackOrder.forEach((runtimeId) => append(runtimeId, "fallback"));
  [...implemented].forEach((runtimeId) => append(runtimeId, "available"));

  return ranked;
}

function selectStartupRuntime(subsystemId, options = {}) {
  const manifest = options.manifest || loadRuntimeImplementationManifest(options);
  const ranked = rankRuntimeCandidates(subsystemId, {
    ...options,
    manifest
  });
  const selected = ranked[0] || null;
  return {
    subsystem_id: subsystemId,
    selected_runtime: selected ? selected.runtime_id : "",
    selection_source: selected ? selected.source : "none",
    ranked_runtimes: ranked,
    subsystem_contract: manifest?.subsystems?.[subsystemId] || null
  };
}

function canHotSwap(subsystemId, targetRuntime, swapMode, options = {}) {
  const manifest = options.manifest || loadRuntimeImplementationManifest(options);
  const subsystem = manifest?.subsystems?.[subsystemId] || {};
  const allowedModes = Array.isArray(subsystem.allowed_swap_modes) ? subsystem.allowed_swap_modes : [];
  const normalizedMode = normalizeText(swapMode || "subsystem");
  const runtimeId = normalizeText(targetRuntime);
  const runtimeRow = getSubsystemRuntimeRow(manifest, subsystemId, runtimeId);
  if (!runtimeRow || runtimeRow.status !== "implemented" || runtimeRow.production_ready !== true) {
    return false;
  }
  if (!allowedModes.includes(normalizedMode)) {
    return false;
  }
  if (normalizedMode === "per_call") {
    const functionId = String(options.functionId || "").trim();
    const pureFunctions = Array.isArray(subsystem.pure_function_ids) ? subsystem.pure_function_ids : [];
    if (!functionId || !pureFunctions.includes(functionId)) {
      return false;
    }
  }
  const hotSwap = runtimeRow.hotswap && typeof runtimeRow.hotswap === "object" ? runtimeRow.hotswap : {};
  return hotSwap[normalizedMode] === true;
}

function buildRuntimeSelectionSnapshot(options = {}) {
  const manifest = options.manifest || loadRuntimeImplementationManifest(options);
  return Object.keys(manifest?.subsystems || {})
    .sort((left, right) => left.localeCompare(right))
    .map((subsystemId) =>
      selectStartupRuntime(subsystemId, {
        ...options,
        manifest
      })
    );
}

module.exports = {
  buildRuntimeSelectionSnapshot,
  canHotSwap,
  loadRuntimeImplementationManifest,
  rankRuntimeCandidates,
  selectStartupRuntime
};
