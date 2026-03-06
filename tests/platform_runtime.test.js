"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const {
  buildPlatformRuntimeStatus,
  loadShellAdapterManifest,
  loadStorageBackendManifest,
  selectStartupShell
} = require("../brain/core/platform_runtime.js");

test("platform runtime loads storage and shell manifests", () => {
  const storageManifest = loadStorageBackendManifest();
  const shellManifest = loadShellAdapterManifest();

  assert.equal(storageManifest.default_backend, "raw_file");
  assert.equal(Array.isArray(shellManifest.commands), true);
  assert.equal(shellManifest.commands.includes("platform.get_runtime_status"), true);
  assert.equal(shellManifest.commands.includes("storage.export_raw_envelope"), true);
});

test("platform runtime selects implemented startup shell and reports runtime selections", () => {
  const shellSelection = selectStartupShell();
  const status = buildPlatformRuntimeStatus();

  assert.equal(shellSelection.selected_shell, "electron");
  assert.equal(status.shell_selection.selected_shell, "electron");
  assert.equal(status.storage_runtime_selection.selected_runtime, "javascript");
  assert.equal(
    status.runtime_selection_snapshot.some((row) => row.subsystem_id === "math_core" && row.selected_runtime === "javascript"),
    true
  );
});
