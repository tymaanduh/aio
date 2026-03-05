"use strict";

const fs = require("fs");
const path = require("path");
const test = require("node:test");
const assert = require("node:assert/strict");
const { analyze, buildBlueprintMarkdown } = require("../scripts/generate-uiux-blueprint.js");

const ROOT = path.resolve(__dirname, "..");

test("uiux blueprint analyzer returns structured report", () => {
  const report = analyze(ROOT, {
    check: true
  });
  assert.equal(typeof report.status, "string");
  assert.equal(Array.isArray(report.issues), true);
  assert.equal(typeof report.metrics, "object");
  assert.equal(typeof report.metrics.color_semantics, "object");
  assert.equal(typeof report.metrics.layout_ergonomics, "object");
  assert.equal(typeof report.metrics.component_taxonomy, "object");
  assert.equal(typeof report.metrics.user_preferences, "object");
  assert.equal(typeof report.metrics.measurement, "object");
});

test("uiux blueprint markdown includes required sections", () => {
  const catalogPath = path.join(ROOT, "data", "input", "shared", "main", "ui_ux_blueprint_catalog.json");
  const componentCatalogPath = path.join(ROOT, "data", "input", "shared", "main", "ui_component_blueprint_catalog.json");
  const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
  const componentCatalog = JSON.parse(fs.readFileSync(componentCatalogPath, "utf8"));
  const markdown = buildBlueprintMarkdown(catalog, componentCatalog, true);
  assert.equal(markdown.includes("# UI UX Blueprint"), true);
  assert.equal(markdown.includes("## Color Semantics"), true);
  assert.equal(markdown.includes("## Component Taxonomy"), true);
  assert.equal(markdown.includes("`boxes`"), true);
  assert.equal(markdown.includes("## User Preference Handling"), true);
  assert.equal(markdown.includes("prefers-reduced-motion"), true);
  assert.equal(markdown.includes("task_success_rate"), true);
});
