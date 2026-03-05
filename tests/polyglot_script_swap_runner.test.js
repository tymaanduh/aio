"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");
const test = require("node:test");
const assert = require("node:assert/strict");
const {
  resolveLanguageOrder,
  runScriptWithSwaps,
  loadCatalog
} = require("../scripts/lib/polyglot-script-swap-runner.js");

test("resolveLanguageOrder honors preferred language and fallback ordering", () => {
  const catalog = loadCatalog();
  const order = resolveLanguageOrder({
    catalog,
    preferredLanguage: "cpp",
    runtimeOrder: ["python", "javascript"],
    allowSwaps: true
  });

  assert.equal(order[0], "cpp");
  assert.equal(order.includes("python"), true);
  assert.equal(order.includes("javascript"), true);
});

test("runScriptWithSwaps executes javascript stage when swaps disabled", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "aio-script-swap-"));
  const scriptPath = path.join(tempDir, "echo.js");
  fs.writeFileSync(
    scriptPath,
    [
      '"use strict";',
      "const payload = { ok: true, argv: process.argv.slice(2) };",
      "process.stdout.write(`${JSON.stringify(payload)}\\n`);"
    ].join("\n"),
    "utf8"
  );

  const result = runScriptWithSwaps({
    scriptPath,
    scriptArgs: ["hello", "world"],
    allowSwaps: false
  });

  assert.equal(result.statusCode, 0);
  assert.equal(result.runtime.selected_language, "javascript");
  assert.equal(result.runtime.swapped, false);

  const payload = JSON.parse(String(result.stdout || "{}").trim());
  assert.equal(payload.ok, true);
  assert.deepEqual(payload.argv, ["hello", "world"]);
});
