"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const SCRIPT_PATH = path.join(ROOT, "scripts", "release-candidate-bundle.js");

test("release-candidate-bundle produces expected summary shape", (t) => {
  const tempDir = fs.mkdtempSync(path.join(ROOT, "data", "output", "logs", "tmp-release-candidate-"));
  t.after(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  const outFile = path.join(tempDir, "release_candidate_bundle.json");
  const result = spawnSync(
    process.execPath,
    [SCRIPT_PATH, "--out-file", outFile, "--planned-update", "test-release-candidate-bundle"],
    {
      cwd: ROOT,
      encoding: "utf8"
    }
  );

  assert.equal([0, 1].includes(result.status), true, `stdout=${result.stdout}\nstderr=${result.stderr}`);
  assert.equal(fs.existsSync(outFile), true);

  const bundle = JSON.parse(fs.readFileSync(outFile, "utf8"));
  assert.equal(bundle.gate_pass, result.status === 0);
  assert.equal(typeof bundle.gate_pass, "boolean");
  assert.equal(Array.isArray(bundle.issues), true);
  assert.equal(typeof bundle.release_evidence_gate_pass, "boolean");
  assert.equal(typeof bundle.commit_slices.multi_match_total, "number");
  assert.equal(typeof bundle.separation.separation_required_total, "number");
  assert.equal(typeof bundle.benchmark.top_result, "string");
  assert.equal(Array.isArray(bundle.reproducible_commands), true);
  assert.equal(bundle.language.primary_language, "cpp");
  assert.equal(bundle.language.fallback_language, "python");
});
