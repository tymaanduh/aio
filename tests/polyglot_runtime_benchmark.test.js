"use strict";

const path = require("path");
const test = require("node:test");
const assert = require("node:assert/strict");
const { generateWrapperBindingArtifacts } = require("../scripts/generate-wrapper-polyglot-bindings.js");
const { loadBenchmarkInput, runPolyglotBenchmark } = require("../scripts/polyglot-runtime-benchmark.js");

const ROOT = path.resolve(__dirname, "..");

test("runtime benchmark catalog loads against wrapper registry", () => {
  generateWrapperBindingArtifacts({ root: ROOT, checkOnly: false });
  const input = loadBenchmarkInput(ROOT, {});
  assert.equal(Array.isArray(input.cases), true);
  assert.equal(input.cases.length > 0, true);
  assert.equal(input.warmupIterations >= 0, true);
});

test("polyglot runtime benchmark runs javascript adapter from shared case catalog", () => {
  generateWrapperBindingArtifacts({ root: ROOT, checkOnly: false });
  const report = runPolyglotBenchmark({
    root: ROOT,
    languages: ["javascript"],
    iterationsOverride: 200,
    warmupOverride: 10,
    outputFile: "data/output/databases/polyglot-default/reports/polyglot_runtime_benchmark_report.test.json",
    strict: true
  });

  assert.equal(report.status, "pass");
  assert.deepEqual(report.languages_run, ["javascript"]);
  assert.equal(Array.isArray(report.results.javascript.cases), true);
  assert.equal(report.results.javascript.cases.length > 0, true);
  assert.equal(typeof report.results.javascript.total_ns, "number");
  assert.equal(report.results.javascript.total_ns > 0, true);
  assert.equal(typeof report.winner_mapping, "object");
  assert.equal(Array.isArray(report.winner_mapping.per_case), true);
  assert.equal(Array.isArray(report.winner_mapping.per_function), true);
  assert.equal(report.winner_mapping.case_count > 0, true);
  assert.equal(report.winner_mapping.function_count > 0, true);
  assert.equal(typeof report.function_language_plan, "object");
  assert.equal(Array.isArray(report.function_language_plan.assignments), true);
  assert.equal(report.function_language_plan.function_count > 0, true);
  assert.equal(report.function_language_plan.assignments.every((entry) => entry.selected_language === "javascript"), true);
});
