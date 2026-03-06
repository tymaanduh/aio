"use strict";

const path = require("path");
const test = require("node:test");
const assert = require("node:assert/strict");

const { generateNeutralCoreAssets } = require("../scripts/generate-neutral-core-assets.js");
const {
  buildRuntimeSelectionSnapshot,
  canHotSwap,
  loadRuntimeImplementationManifest,
  selectStartupRuntime
} = require("../brain/core/runtime_arbiter.js");

const ROOT = path.resolve(__dirname, "..");

test("runtime arbiter selects benchmark-backed startup runtimes", () => {
  const generation = generateNeutralCoreAssets({ root: ROOT, checkOnly: false, quiet: true });
  assert.equal(generation.status, "pass");

  const manifest = loadRuntimeImplementationManifest();
  const mathSelection = selectStartupRuntime("math_core", { manifest });
  assert.equal(mathSelection.selected_runtime, "javascript");
  assert.equal(mathSelection.selection_source, "benchmark");
  assert.equal(mathSelection.ranked_runtimes.length > 0, true);

  const snapshot = buildRuntimeSelectionSnapshot({ manifest });
  assert.equal(snapshot.some((row) => row.subsystem_id === "storage_core"), true);
});

test("runtime arbiter enforces swap safety by subsystem and purity", () => {
  const manifest = loadRuntimeImplementationManifest();

  assert.equal(canHotSwap("math_core", "python", "per_call", { manifest, functionId: "math.add" }), true);
  assert.equal(canHotSwap("math_core", "python", "per_call", { manifest, functionId: "storage.save" }), false);
  assert.equal(canHotSwap("storage_core", "javascript", "per_call", { manifest }), false);
  assert.equal(canHotSwap("storage_core", "javascript", "startup", { manifest }), true);
});
