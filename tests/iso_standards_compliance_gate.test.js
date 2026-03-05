"use strict";

const path = require("path");
const test = require("node:test");
const assert = require("node:assert/strict");
const { analyze, buildChecklistMarkdown } = require("../scripts/iso-standards-compliance-gate.js");

const ROOT = path.resolve(__dirname, "..");

test("iso standards compliance analyzer returns checklist metrics", () => {
  const report = analyze(ROOT, {
    check: true
  });
  assert.equal(typeof report.status, "string");
  assert.equal(Array.isArray(report.issues), true);
  assert.equal(Array.isArray(report.checklist), true);
  assert.equal(typeof report.metrics, "object");
  assert.equal(typeof report.metrics.total_standards, "number");
  assert.equal(report.checklist.length > 0, true);
});

test("iso standards checklist markdown renders pass/fail table", () => {
  const report = analyze(ROOT, {
    check: true
  });
  const markdown = buildChecklistMarkdown(report);
  assert.equal(markdown.includes("# ISO Standards Compliance Checklist"), true);
  assert.equal(markdown.includes("| Standard | Domain | Compliance | Evidence |"), true);
  assert.equal(markdown.includes("PASS") || markdown.includes("FAIL"), true);
});
