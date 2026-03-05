"use strict";

const path = require("path");
const test = require("node:test");
const assert = require("node:assert/strict");
const { spawnSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");

test("script polyglot equivalents check passes", () => {
  const run = spawnSync(process.execPath, ["scripts/generate-script-polyglot-equivalents.js", "--check"], {
    cwd: ROOT,
    encoding: "utf8",
    shell: false
  });

  assert.equal(run.status, 0, `${String(run.stdout || "")}\n${String(run.stderr || "")}`);
});
