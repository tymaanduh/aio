"use strict";

const path = require("path");
const test = require("node:test");
const assert = require("node:assert/strict");
const { analyze, classifyBaseName } = require("../scripts/standards-baseline-gate.js");

const ROOT = path.resolve(__dirname, "..");

test("classifyBaseName detects expected naming styles", () => {
  assert.equal(classifyBaseName("renderer_state_data"), "snake_case");
  assert.equal(classifyBaseName("renderer-state-data"), "kebab-case");
  assert.equal(classifyBaseName("rendererStateData"), "camelCase");
  assert.equal(classifyBaseName("RendererStateData"), "PascalCase");
  assert.equal(classifyBaseName("renderer.state.data"), "other");
});

test("standards baseline analyzer returns structured report", () => {
  const report = analyze(ROOT, {});
  assert.equal(typeof report.status, "string");
  assert.equal(Array.isArray(report.issues), true);
  assert.equal(typeof report.metrics, "object");
  assert.equal(typeof report.metrics.naming, "object");
  assert.equal(typeof report.metrics.storage, "object");
  assert.equal(typeof report.metrics.optimization, "object");
  assert.equal(typeof report.metrics.optimization.benchmark_case_count, "number");
  assert.equal(report.metrics.optimization.benchmark_case_count >= 11, true);
  assert.equal(typeof report.metrics.ui_ux, "object");
  assert.equal(typeof report.metrics.future_catalogs, "object");
  assert.equal(typeof report.metrics.runtime_activation, "object");
});
