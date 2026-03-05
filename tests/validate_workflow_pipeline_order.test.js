"use strict";

const path = require("path");
const test = require("node:test");
const assert = require("node:assert/strict");
const { analyze, validateOrder } = require("../scripts/validate-workflow-pipeline-order.js");

const ROOT = path.resolve(__dirname, "..");

test("validateOrder detects ordered sequence and missing values", () => {
  const result = validateOrder(["a", "b", "c"], ["x", "a", "c", "b"]);
  assert.deepEqual(result.missing, []);
  assert.equal(result.order_valid, false);
});

test("workflow pipeline order analyzer returns structured report", () => {
  const report = analyze(ROOT, {
    check: true
  });
  assert.equal(typeof report.status, "string");
  assert.equal(Array.isArray(report.issues), true);
  assert.equal(typeof report.metrics, "object");
  assert.equal(typeof report.checks, "object");
  assert.equal(report.metrics.stage_order_count > 0, true);
});
