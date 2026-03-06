"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");
const test = require("node:test");
const assert = require("node:assert/strict");

const {
  buildCachePruneIssues,
  collectDirectoriesByPrefix,
  excludeDescendants,
  isRetryableCachePruneError
} = require("../scripts/prune-workflow-artifacts.js");

test("excludeDescendants removes nested files under selected cache directories", () => {
  const filtered = excludeDescendants(
    [
      "V:/dicccc/data/output/databases/polyglot-default/build/generated/python/__pycache__/wrapper_symbols.cpython-312.pyc",
      "V:/dicccc/data/output/databases/polyglot-default/analysis/script_runtime_swap_report.json.tmp-1"
    ],
    ["V:/dicccc/data/output/databases/polyglot-default/build/generated/python/__pycache__"]
  );

  assert.deepEqual(filtered, ["V:/dicccc/data/output/databases/polyglot-default/analysis/script_runtime_swap_report.json.tmp-1"]);
});

test("isRetryableCachePruneError recognizes locked Windows cache cleanup failures", () => {
  assert.equal(
    isRetryableCachePruneError("[WinError 5] Access is denied: 'V:\\dicccc\\data\\output\\databases\\polyglot-default\\build\\generated\\python\\__pycache__\\wrapper_symbols.cpython-312.pyc'"),
    true
  );
  assert.equal(isRetryableCachePruneError("EPERM: operation not permitted"), true);
  assert.equal(isRetryableCachePruneError("ENOENT: no such file or directory"), false);
});

test("buildCachePruneIssues downgrades locked cache removals to warnings", () => {
  const issues = buildCachePruneIssues("V:/dicccc", [
    {
      path: "V:/dicccc/data/output/databases/polyglot-default/build/generated/python/__pycache__",
      error:
        "[WinError 5] Access is denied: 'V:\\dicccc\\data\\output\\databases\\polyglot-default\\build\\generated\\python\\__pycache__\\wrapper_symbols.cpython-312.pyc'"
    },
    {
      path: "V:/dicccc/data/output/databases/polyglot-default/analysis/file.json",
      error: "ENOENT: no such file or directory"
    }
  ]);

  assert.deepEqual(
    issues.map((issue) => ({ level: issue.level, type: issue.type, path: issue.path })),
    [
      {
        level: "warn",
        type: "cache_prune_deferred",
        path: "data/output/databases/polyglot-default/build/generated/python/__pycache__"
      },
      {
        level: "error",
        type: "cache_prune_failed",
        path: "data/output/databases/polyglot-default/analysis/file.json"
      }
    ]
  );
});

test("collectDirectoriesByPrefix finds benchmark temp directories under build tmp roots", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "aio-prune-test-"));
  try {
    const buildTmpRoot = path.join(tempRoot, "build", "tmp");
    const keepDir = path.join(buildTmpRoot, "other-temp");
    const matchDir = path.join(buildTmpRoot, "aio-polyglot-bench-123");
    const nestedMatchDir = path.join(keepDir, "aio-polyglot-bench-456");
    fs.mkdirSync(matchDir, { recursive: true });
    fs.mkdirSync(nestedMatchDir, { recursive: true });

    const collected = collectDirectoriesByPrefix(buildTmpRoot, "aio-polyglot-bench-")
      .map((item) => item.replace(/\\/g, "/"))
      .sort();

    assert.deepEqual(collected, [matchDir, nestedMatchDir].map((item) => item.replace(/\\/g, "/")).sort());
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});
