"use strict";

const fs = require("fs");
const path = require("path");
const test = require("node:test");
const assert = require("node:assert/strict");
const { spawnSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");

test("repository polyglot equivalents check passes", () => {
  const generate = spawnSync(process.execPath, ["scripts/generate-repo-polyglot-equivalents.js"], {
    cwd: ROOT,
    encoding: "utf8",
    shell: false
  });
  assert.equal(generate.status, 0, `${String(generate.stdout || "")}\n${String(generate.stderr || "")}`);

  const run = spawnSync(process.execPath, ["scripts/generate-repo-polyglot-equivalents.js", "--check"], {
    cwd: ROOT,
    encoding: "utf8",
    shell: false
  });

  assert.equal(run.status, 0, `${String(run.stdout || "")}\n${String(run.stderr || "")}`);
});

test("repository polyglot equivalents generate runnable proxy artifacts", () => {
  const generate = spawnSync(process.execPath, ["scripts/generate-repo-polyglot-equivalents.js"], {
    cwd: ROOT,
    encoding: "utf8",
    shell: false
  });
  assert.equal(generate.status, 0, `${String(generate.stdout || "")}\n${String(generate.stderr || "")}`);

  const pythonEquivalent = path.join(
    ROOT,
    "data",
    "output",
    "databases",
    "polyglot-default",
    "build",
    "generated",
    "repo_polyglot_equivalents",
    "python",
    "scripts",
    "lib",
    "robust-file-write.py"
  );
  const pythonContent = fs.readFileSync(pythonEquivalent, "utf8");

  assert.match(pythonContent, /AIO_EQUIVALENT_KIND = "repo_module_proxy"/);
  assert.doesNotMatch(pythonContent, /NotImplementedError/);

  const pythonCheck = spawnSync("python", ["--version"], {
    cwd: ROOT,
    encoding: "utf8",
    shell: false
  });
  if (pythonCheck.status !== 0) {
    return;
  }

  const invoke = spawnSync(
    "python",
    [
      pythonEquivalent,
      "--function",
      "isRetryableFileWriteError",
      "--args-json",
      '[{"code":"EBUSY"}]'
    ],
    {
      cwd: ROOT,
      encoding: "utf8",
      shell: false
    }
  );

  assert.equal(invoke.status, 0, `${String(invoke.stdout || "")}\n${String(invoke.stderr || "")}`);
  assert.match(String(invoke.stdout || ""), /"result"\s*:\s*true/);
});
