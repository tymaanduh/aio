"use strict";

const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const test = require("node:test");
const assert = require("node:assert/strict");
const { runNodeScript } = require("../scripts/lib/in-process-script-runner.js");

const ROOT = path.resolve(__dirname, "..");

function resolvePythonInvocation() {
  const candidates = [];
  if (process.env.AIO_PYTHON_EXEC) {
    candidates.push({ command: process.env.AIO_PYTHON_EXEC, argsPrefix: [] });
  }
  candidates.push(
    { command: "python", argsPrefix: [] },
    { command: "py", argsPrefix: ["-3"] }
  );

  for (const candidate of candidates) {
    const probe = spawnSync(candidate.command, [...candidate.argsPrefix, "--version"], {
      cwd: ROOT,
      encoding: "utf8",
      shell: false
    });
    if (probe.status === 0) {
      return candidate;
    }
  }
  return null;
}

const PYTHON = resolvePythonInvocation();

test("script polyglot equivalents check passes", () => {
  const run = runNodeScript("scripts/generate-script-polyglot-equivalents.js", ["--check"], { cwd: ROOT });

  assert.equal(run.status, 0, `${String(run.stdout || "")}\n${String(run.stderr || "")}`);
});

test("generated script equivalents use native runtime dispatch", () => {
  const pythonWrapper = fs.readFileSync(
    path.join(ROOT, "scripts", "polyglot", "equivalents", "python", "validate_script_swap_catalog.py"),
    "utf8"
  );
  const cppWrapper = fs.readFileSync(
    path.join(ROOT, "scripts", "polyglot", "equivalents", "cpp", "validate_script_swap_catalog.cpp"),
    "utf8"
  );
  const pythonRuntime = fs.readFileSync(
    path.join(ROOT, "scripts", "polyglot", "equivalents", "python", "_shared", "native_script_runtime.py"),
    "utf8"
  );
  const catalog = JSON.parse(
    fs.readFileSync(
      path.join(ROOT, "data", "output", "databases", "polyglot-default", "build", "script_polyglot_equivalents_catalog.json"),
      "utf8"
    )
  );

  assert.match(pythonWrapper, /run_native_script/);
  assert.doesNotMatch(pythonWrapper, /run_node_script/);
  assert.match(cppWrapper, /native_script_runtime::run_native_script/);
  assert.match(pythonRuntime, /AIO_SCRIPT_NATIVE_ALLOW_JS_FALLBACK/);
  assert.equal(Number(catalog.metrics.python_native_implementation_count) >= 9, true);
  const nativeScriptIds = catalog.entries
    .filter((entry) => entry.python_native_implemented === true)
    .map((entry) => entry.script_id);
  assert.equal(nativeScriptIds.includes("generate_neutral_core_assets"), true);
  assert.equal(nativeScriptIds.includes("validate_neutral_core_contracts"), true);
  assert.equal(nativeScriptIds.includes("general_workflow"), true);
  assert.equal(nativeScriptIds.includes("polyglot_runtime_benchmark"), true);
  assert.equal(nativeScriptIds.includes("run_script_with_swaps"), true);
});

test("package efficiency scripts use the native Python audit entrypoint", () => {
  const packageDoc = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));
  const scripts = packageDoc.scripts || {};

  assert.equal(
    scripts["efficiency:audit"],
    "python scripts/polyglot/equivalents/python/codex_efficiency_audit.py"
  );
  assert.equal(
    scripts["efficiency:gate"],
    "python scripts/polyglot/equivalents/python/codex_efficiency_audit.py --enforce"
  );
});

test("native run-script-with-swaps executes a Python stage without JS fallback", (t) => {
  if (!PYTHON) {
    t.skip("python runtime unavailable");
    return;
  }
  const run = spawnSync(
    PYTHON.command,
    [
      ...PYTHON.argsPrefix,
      "scripts/polyglot/equivalents/python/run_script_with_swaps.py",
      "--stage-id",
      "validate_script_swap_catalog",
      "--preferred-language",
      "python",
      "--runtime-order",
      "python,javascript,cpp",
      "--strict-runtime"
    ],
    {
      cwd: ROOT,
      encoding: "utf8",
      env: {
        ...process.env,
        AIO_SCRIPT_NATIVE_ALLOW_JS_FALLBACK: "0",
        PYTHONDONTWRITEBYTECODE: "1"
      }
    }
  );

  assert.equal(run.status, 0, `${String(run.stdout || "")}\n${String(run.stderr || "")}`);
  const payload = JSON.parse(String(run.stdout || "{}").trim());
  assert.equal(payload.status, "pass");
});

test("native general_workflow handles help output without JS fallback", (t) => {
  if (!PYTHON) {
    t.skip("python runtime unavailable");
    return;
  }
  const run = spawnSync(PYTHON.command, [...PYTHON.argsPrefix, "scripts/polyglot/equivalents/python/general_workflow.py", "--help"], {
    cwd: ROOT,
    encoding: "utf8",
    env: {
      ...process.env,
      AIO_SCRIPT_NATIVE_ALLOW_JS_FALLBACK: "0",
      PYTHONDONTWRITEBYTECODE: "1"
    }
  });

  assert.equal(run.status, 0, `${String(run.stdout || "")}\n${String(run.stderr || "")}`);
  assert.match(String(run.stdout || ""), /general-workflow/);
  assert.match(String(run.stdout || ""), /workflow:continue/);
});

test("native polyglot_runtime_benchmark runs javascript and python lanes without JS fallback", (t) => {
  if (!PYTHON) {
    t.skip("python runtime unavailable");
    return;
  }
  const run = spawnSync(
    PYTHON.command,
    [
      ...PYTHON.argsPrefix,
      "scripts/polyglot/equivalents/python/polyglot_runtime_benchmark.py",
      "--languages",
      "javascript,python",
      "--iterations",
      "50",
      "--warmup",
      "2",
      "--function-ids",
      "math.add",
      "--output-file",
      "data/output/databases/polyglot-default/reports/polyglot_runtime_benchmark_report.native.smoke.test.json",
      "--strict"
    ],
    {
      cwd: ROOT,
      encoding: "utf8",
      env: {
        ...process.env,
        AIO_SCRIPT_NATIVE_ALLOW_JS_FALLBACK: "0",
        PYTHONDONTWRITEBYTECODE: "1"
      }
    }
  );

  assert.equal(run.status, 0, `${String(run.stdout || "")}\n${String(run.stderr || "")}`);
  const payload = JSON.parse(String(run.stdout || "{}").trim());
  assert.equal(payload.status, "pass");
  assert.deepEqual(payload.languages_run, ["javascript", "python"]);
  assert.equal(Array.isArray(payload.winner_mapping.per_case), true);
  assert.equal(Array.isArray(payload.function_language_plan.assignments), true);
});
