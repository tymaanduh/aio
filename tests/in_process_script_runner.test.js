"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");
const test = require("node:test");
const assert = require("node:assert/strict");

const { runNodeScriptInProcess } = require("../scripts/lib/in-process-script-runner.js");

test("runNodeScriptInProcess executes a CommonJS entrypoint as main", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "aio-in-process-runner-"));
  const scriptPath = path.join(tempDir, "entry.js");

  fs.writeFileSync(
    scriptPath,
    [
      '"use strict";',
      "if (require.main !== module) {",
      "  throw new Error('script did not execute as main');",
      "}",
      "process.stdout.write(JSON.stringify({ argv: process.argv.slice(2), main: require.main === module }));"
    ].join("\n"),
    "utf8"
  );

  const result = runNodeScriptInProcess(scriptPath, ["alpha", "beta"]);
  assert.equal(result.status, 0);

  const payload = JSON.parse(String(result.stdout || "{}"));
  assert.equal(payload.main, true);
  assert.deepEqual(payload.argv, ["alpha", "beta"]);
});

test("runNodeScriptInProcess captures explicit process.exit codes", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "aio-in-process-runner-exit-"));
  const scriptPath = path.join(tempDir, "exit.js");

  fs.writeFileSync(
    scriptPath,
    ['"use strict";', "process.stderr.write('bye\\n');", "process.exit(3);"].join("\n"),
    "utf8"
  );

  const result = runNodeScriptInProcess(scriptPath);
  assert.equal(result.status, 3);
  assert.equal(String(result.stderr || "").includes("bye"), true);
});
