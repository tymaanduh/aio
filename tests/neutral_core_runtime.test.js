"use strict";

const path = require("path");
const test = require("node:test");
const assert = require("node:assert/strict");

const {
  GENERATED_JAVASCRIPT_NEUTRAL_CORE_PATH,
  loadJavascriptNeutralCore,
  resolveMathCoreExecutionPlan,
  runNeutralMathFunction
} = require("../brain/core/neutral_core_runtime.js");

test("neutral core runtime loads generated javascript implementation", () => {
  const runtime = loadJavascriptNeutralCore();

  assert.equal(path.basename(GENERATED_JAVASCRIPT_NEUTRAL_CORE_PATH), "neutral_core.js");
  assert.equal(Boolean(runtime && typeof runtime.runMathFunction === "function"), true);
});

test("neutral core runtime executes math functions through generated bindings", () => {
  const plan = resolveMathCoreExecutionPlan();
  const sum = runNeutralMathFunction("math.add", { x: 8, y: 5 });

  assert.equal(plan.execution_runtime, "javascript");
  assert.equal(sum, 13);
});
