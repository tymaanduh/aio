"use strict";

const path = require("path");
const test = require("node:test");
const assert = require("node:assert/strict");
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
  assert.equal(addResult.value.function_id, "math.add");
  assert.deepEqual(addResult.value.bound_args, { x: 3, y: 4 });

  const missingArgs = bindings.mathClamp({ x: 3, min: 0 });
  assert.equal(missingArgs.ok, false);
  assert.equal(missingArgs.error_code, "E_MISSING_ARG");
  assert.deepEqual(missingArgs.missing_args, ["max"]);
});
