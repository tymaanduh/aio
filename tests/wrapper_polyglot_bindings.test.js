"use strict";

const path = require("path");
const test = require("node:test");
const assert = require("node:assert/strict");
const { spawnSync } = require("child_process");
const {
  generateWrapperBindingArtifacts,
  checkWrapperBindingArtifacts
} = require("../scripts/generate-wrapper-polyglot-bindings.js");

const ROOT = path.resolve(__dirname, "..");
const JS_BINDINGS_PATH = path.join(
  ROOT,
  "data",
  "output",
  "databases",
  "polyglot-default",
  "build",
  "generated",
  "javascript",
  "wrapper_symbols.js"
);
const PYTHON_BINDINGS_PATH = path.join(
  ROOT,
  "data",
  "output",
  "databases",
  "polyglot-default",
  "build",
  "generated",
  "python",
  "wrapper_symbols.py"
);

function detectPythonRuntime() {
  const candidates = [
    { command: "python", argsPrefix: [] },
    { command: "py", argsPrefix: ["-3"] }
  ];
  for (const candidate of candidates) {
    const probe = spawnSync(candidate.command, [...candidate.argsPrefix, "--version"], {
      cwd: ROOT,
      encoding: "utf8",
      shell: false
    });
    if (!probe.error && Number(probe.status || 0) === 0) {
      return candidate;
    }
  }
  return null;
}

test("polyglot wrapper artifacts generate and stay in sync", () => {
  const generation = generateWrapperBindingArtifacts({ root: ROOT, checkOnly: false });
  assert.equal(generation.status, "pass");
  assert.equal(generation.issues.length, 0);

  const check = checkWrapperBindingArtifacts({ root: ROOT });
  assert.equal(check.status, "pass");
  assert.equal(check.issues.length, 0);
});

test("javascript wrapper symbols expose 1:1 wrapper functions", () => {
  const bindings = require(JS_BINDINGS_PATH);

  const functionIds = Object.values(bindings.FUNCTION_IDS);
  assert.equal(new Set(functionIds).size, functionIds.length);

  const addResult = bindings.mathAdd({ x: 3, y: 4 });
  assert.equal(addResult.ok, true);
  assert.equal(addResult.function_id, bindings.FUNCTION_IDS.MATH_ADD);
  assert.equal(addResult.output_symbol, "sum");
  assert.equal(addResult.value, 7);
  assert.deepEqual(addResult.result, { sum: 7 });

  const missingArgs = bindings.mathClamp({ x: 3, min: 0 });
  assert.equal(missingArgs.ok, false);
  assert.equal(missingArgs.error_code, "E_MISSING_ARG");
  assert.deepEqual(missingArgs.missing_args, ["max"]);

  const divideByZero = bindings.mathDivide({ x: 7, y: 0 });
  assert.equal(divideByZero.ok, false);
  assert.equal(divideByZero.error_code, "E_DIVIDE_BY_ZERO");

  const clampInvertedBounds = bindings.mathClamp({ x: 12, min: 20, max: 10 });
  assert.equal(clampInvertedBounds.ok, true);
  assert.equal(clampInvertedBounds.value, 12);
});

test("python wrapper symbols follow canonical behavior when python runtime is available", () => {
  const python = detectPythonRuntime();
  if (!python) {
    return;
  }

  const script = [
    "import importlib.util",
    "import json",
    "import sys",
    "payload = json.loads(sys.stdin.read())",
    "spec = importlib.util.spec_from_file_location('wrapper_symbols_module', payload['module_path'])",
    "if spec is None or spec.loader is None:",
    "    raise RuntimeError('unable to load python wrapper symbols module')",
    "module = importlib.util.module_from_spec(spec)",
    "spec.loader.exec_module(module)",
    "rows = {}",
    "for case in payload['cases']:",
    "    result = module.run_wrapper_function(case['function_id'], case['args'])",
    "    rows[case['case_id']] = {",
    "        'ok': bool(result.get('ok', False)),",
    "        'value': result.get('value'),",
    "        'error_code': str(result.get('error_code', '')),",
    "        'missing_args': list(result.get('missing_args', []))",
    "    }",
    "print(json.dumps(rows))"
  ].join("\n");

  const run = spawnSync(python.command, [...python.argsPrefix, "-c", script], {
    cwd: ROOT,
    encoding: "utf8",
    shell: false,
    input: JSON.stringify({
      module_path: PYTHON_BINDINGS_PATH,
      cases: [
        { case_id: "add", function_id: "math.add", args: { x: 3, y: 4 } },
        { case_id: "clamp_swapped", function_id: "math.clamp", args: { x: 12, min: 20, max: 10 } },
        { case_id: "missing", function_id: "math.clamp", args: { x: 5, min: 0 } },
        { case_id: "divide_zero", function_id: "math.divide", args: { x: 9, y: 0 } }
      ]
    })
  });

  assert.equal(run.status, 0, `${String(run.stdout || "")}\n${String(run.stderr || "")}`);
  const rows = JSON.parse(String(run.stdout || "{}"));
  assert.equal(rows.add.ok, true);
  assert.equal(rows.add.value, 7);
  assert.equal(rows.clamp_swapped.ok, true);
  assert.equal(rows.clamp_swapped.value, 12);
  assert.equal(rows.missing.ok, false);
  assert.equal(rows.missing.error_code, "E_MISSING_ARG");
  assert.deepEqual(rows.missing.missing_args, ["max"]);
  assert.equal(rows.divide_zero.ok, false);
  assert.equal(rows.divide_zero.error_code, "E_DIVIDE_BY_ZERO");
});
