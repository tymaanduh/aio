"use strict";

const path = require("path");
const test = require("node:test");
const assert = require("node:assert/strict");
const { analyze, estimateTokens } = require("../scripts/codex-efficiency-audit.js");
const { mappedPrompt, normalizePrompt } = require("../scripts/optimize-codex-automations.js");

const ROOT = path.resolve(__dirname, "..");

test("codex efficiency audit analyzes workspace metadata", () => {
  const report = analyze(ROOT, {
    maxFileTokens: 20000,
    maxSkillPromptTokens: 80,
    maxAutomationPromptTokens: 80,
    skipAutomations: true,
    codexHome: ""
  });

  assert.equal(typeof report.status, "string");
  assert.equal(Array.isArray(report.top_heavy_files), true);
  assert.equal(report.top_heavy_files.length > 0, true);
  assert.equal(Array.isArray(report.skill_prompt_metrics), true);
  assert.equal(report.skill_prompt_metrics.length > 0, true);
});

test("automation prompt optimizer compacts mapped prompts", () => {
  const source =
    "Run npm run workflow:preflight and npm run agents:validate. Open an inbox item with pass or fail status.";
  const normalized = normalizePrompt(source);
  assert.equal(normalized.includes("Inbox<=120t:"), true);
  assert.equal(estimateTokens(normalized) < estimateTokens(source), true);

  const mapped = mappedPrompt("aio-9am-preflight", source);
  assert.equal(mapped.includes("Inbox<=120t:"), true);
  assert.equal(
    mapped,
    "Run npm run workflow:preflight && npm run agents:validate. Inbox<=120t: pass/fail, blockers, failed cmds."
  );
});
