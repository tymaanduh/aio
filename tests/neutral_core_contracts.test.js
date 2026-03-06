"use strict";

const fs = require("fs");
const path = require("path");
const test = require("node:test");
const assert = require("node:assert/strict");

const {
  OUTPUT_FILES,
  generateNeutralCoreAssets,
  checkNeutralCoreAssets
} = require("../scripts/generate-neutral-core-assets.js");
const { validateNeutralCore } = require("../scripts/validate-neutral-core-contracts.js");

const ROOT = path.resolve(__dirname, "..");

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), "utf8"));
}

test("neutral core assets generate and validate cleanly", () => {
  const generation = generateNeutralCoreAssets({ root: ROOT, checkOnly: false, quiet: true });
  assert.equal(generation.status, "pass");

  const check = checkNeutralCoreAssets({ root: ROOT, quiet: true });
  assert.equal(check.status, "pass");

  const validation = validateNeutralCore({ root: ROOT });
  assert.equal(validation.status, "pass", JSON.stringify(validation, null, 2));
});

test("runtime implementation manifest stays direct and benchmark-backed", () => {
  const runtimeManifest = readJson(OUTPUT_FILES.runtimeManifest);

  assert.equal(runtimeManifest.subsystems.math_core.benchmark.overall_winner_language, "javascript");
  ["javascript", "python", "cpp", "ruby"].forEach((runtimeId) => {
    const subsystem = runtimeManifest.runtimes[runtimeId].subsystems.math_core;
    assert.equal(subsystem.status, "implemented");
    assert.equal(subsystem.production_ready, true);
    assert.equal(subsystem.artifact.includes("repo_polyglot_equivalents"), false);
    assert.equal(subsystem.artifact.includes("repo-polyglot-module-bridge"), false);
  });
});

test("generated neutral core artifacts do not reference proxy-backed repo equivalents", () => {
  const artifactPaths = [
    OUTPUT_FILES.javascriptCore,
    OUTPUT_FILES.pythonCore,
    OUTPUT_FILES.cppHeader,
    OUTPUT_FILES.cppSource,
    OUTPUT_FILES.rubyCore
  ];

  artifactPaths.forEach((relativePath) => {
    const text = fs.readFileSync(path.join(ROOT, relativePath), "utf8");
    assert.equal(text.includes("repo_module_proxy"), false, relativePath);
    assert.equal(text.includes("repo-polyglot-module-bridge"), false, relativePath);
    assert.equal(text.includes("repo_polyglot_equivalents"), false, relativePath);
  });
});

test("shell and storage manifests expose the new ABI surfaces", () => {
  const storageManifest = readJson(OUTPUT_FILES.storageManifest);
  const shellManifest = readJson(OUTPUT_FILES.shellManifest);

  assert.equal(storageManifest.default_backend, "raw_file");
  assert.deepEqual(Object.keys(storageManifest.providers).sort(), ["memory", "raw_file", "sqlite"]);
  assert.equal(shellManifest.implemented_shells.includes("electron"), true);
  assert.deepEqual(Object.keys(shellManifest.shells).sort(), ["electron", "qt", "winforms", "winui"]);
  assert.equal(shellManifest.commands.includes("dictionary.save"), true);
  assert.equal(shellManifest.commands.includes("platform.get_runtime_status"), true);
  assert.equal(shellManifest.commands.includes("storage.export_raw_envelope"), true);
  assert.equal(shellManifest.views.includes("universe_page"), true);
});
