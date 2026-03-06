"use strict";

const fs = require("fs");
const path = require("path");
const {
  buildRuntimeSelectionSnapshot,
  loadRuntimeImplementationManifest,
  selectStartupRuntime
} = require("./runtime_arbiter.js");

const DEFAULT_STORAGE_MANIFEST_PATH = path.join(
  __dirname,
  "..",
  "..",
  "data",
  "output",
  "databases",
  "polyglot-default",
  "build",
  "storage_backend_manifest.json"
);

const DEFAULT_SHELL_MANIFEST_PATH = path.join(
  __dirname,
  "..",
  "..",
  "data",
  "output",
  "databases",
  "polyglot-default",
  "build",
  "shell_adapter_manifest.json"
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

function loadStorageBackendManifest(options = {}) {
  const filePath = path.resolve(options.filePath || DEFAULT_STORAGE_MANIFEST_PATH);
  return readJsonIfExists(filePath, {});
}

function loadShellAdapterManifest(options = {}) {
  const filePath = path.resolve(options.filePath || DEFAULT_SHELL_MANIFEST_PATH);
  return readJsonIfExists(filePath, {});
}

function listImplementedShells(manifest) {
  const explicitList = Array.isArray(manifest?.implemented_shells)
    ? manifest.implemented_shells.map((item) => normalizeText(item)).filter(Boolean)
    : [];
  if (explicitList.length > 0) {
    return [...new Set(explicitList)];
  }
  return Object.keys(manifest?.shells || {})
    .sort((left, right) => left.localeCompare(right))
    .filter((shellId) => normalizeText(manifest?.shells?.[shellId]?.status) === "implemented");
}

function selectStartupShell(options = {}) {
  const manifest = options.manifest || loadShellAdapterManifest(options);
  const implementedShells = listImplementedShells(manifest);
  const preferredShell = normalizeText(options.preferredShell || "");
  if (preferredShell && implementedShells.includes(preferredShell)) {
    return {
      selected_shell: preferredShell,
      selection_source: "preferred_input",
      implemented_shells: implementedShells,
      shell_contract: manifest?.shells?.[preferredShell] || null
    };
  }
  const selectedShell = implementedShells[0] || "";
  return {
    selected_shell: selectedShell,
    selection_source: selectedShell ? "manifest" : "none",
    implemented_shells: implementedShells,
    shell_contract: selectedShell ? manifest?.shells?.[selectedShell] || null : null
  };
}

function buildPlatformRuntimeStatus(options = {}) {
  const runtimeManifest = options.runtimeManifest || loadRuntimeImplementationManifest(options);
  const storageManifest = options.storageManifest || loadStorageBackendManifest(options);
  const shellManifest = options.shellManifest || loadShellAdapterManifest(options);
  return {
    manifest_ids: {
      runtime: String(runtimeManifest?.manifest_id || ""),
      storage: String(storageManifest?.manifest_id || ""),
      shell: String(shellManifest?.manifest_id || "")
    },
    runtime_selection_snapshot: buildRuntimeSelectionSnapshot({
      manifest: runtimeManifest,
      preferredRuntime: options.preferredRuntime
    }),
    storage_runtime_selection: selectStartupRuntime("storage_core", {
      manifest: runtimeManifest,
      preferredRuntime: options.preferredRuntime
    }),
    shell_selection: selectStartupShell({
      manifest: shellManifest,
      preferredShell: options.preferredShell
    }),
    storage_defaults: {
      contract_id: String(storageManifest?.contract_id || ""),
      storage_version: String(storageManifest?.storage_version || ""),
      default_backend: String(storageManifest?.default_backend || ""),
      operations: Array.isArray(storageManifest?.operations) ? storageManifest.operations : [],
      providers: storageManifest?.providers && typeof storageManifest.providers === "object" ? storageManifest.providers : {}
    },
    shell_defaults: {
      contract_id: String(shellManifest?.contract_id || ""),
      lifecycle: Array.isArray(shellManifest?.lifecycle) ? shellManifest.lifecycle : [],
      commands: Array.isArray(shellManifest?.commands) ? shellManifest.commands : [],
      events: Array.isArray(shellManifest?.events) ? shellManifest.events : [],
      views: Array.isArray(shellManifest?.views) ? shellManifest.views : []
    }
  };
}

module.exports = {
  DEFAULT_SHELL_MANIFEST_PATH,
  DEFAULT_STORAGE_MANIFEST_PATH,
  buildPlatformRuntimeStatus,
  listImplementedShells,
  loadShellAdapterManifest,
  loadStorageBackendManifest,
  selectStartupShell
};
