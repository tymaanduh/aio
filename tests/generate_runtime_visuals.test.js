"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { generate } = require("../scripts/generate-runtime-visuals");

function makeTempRoot() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "aio-runtime-visuals-"));
}

test("generate-runtime-visuals creates dashboard markdown, json, and svg assets", () => {
  const root = makeTempRoot();
  const benchmarkPath = path.join(root, "bench.json");
  const swapPath = path.join(root, "swap.json");
  const efficiencyPath = path.join(root, "efficiency.json");
  const docsFreshnessPath = path.join(root, "docs-freshness.json");
  const historyPath = path.join(root, "history.json");

  const benchmark = {
    ranking: [
      { language: "javascript", total_ms: 120.5 },
      { language: "cpp", total_ms: 180.2 },
      { language: "python", total_ms: 260.8 }
    ],
    winner_mapping: {
      overall_winner_language: "javascript"
    }
  };
  const swap = {
    metrics: {
      selected_language_coverage: {
        javascript: 2,
        cpp: 1
      }
    },
    stages: [
      { stage: "preflight", duration_ms: 50, selected_language: "javascript", status_code: 0 },
      { stage: "pipeline", duration_ms: 120, selected_language: "cpp", status_code: 0 },
      { stage: "wrapup", duration_ms: 20, selected_language: "javascript", status_code: 0 }
    ]
  };
  const efficiency = {
    thresholds: {
      max_total_tokens_estimate: 20000
    },
    counts: {
      total_tokens_estimate: 12345,
      skill_prompts_scanned: 12
    },
    trend: {
      total_tokens_previous: 13000,
      total_tokens_delta: -655,
      total_tokens_delta_percent: -5.04
    },
    automation: {
      active: 5
    }
  };
  const docsFreshness = {
    changed_files: [
      "docs/README.md",
      "docs/visuals/runtime_dashboard.md",
      "scripts/generate-runtime-visuals.js",
      "scripts/generate-documentation-suite.js",
      "app/renderer.js",
      "to-do/skills/agent_workflows.json"
    ]
  };
  const existingHistory = {
    schema_version: 1,
    generated_at: "2026-03-01T00:00:00.000Z",
    entries: [
      { date: "2026-03-01", tokens: 14000, feature_updates: 4 },
      { date: "2026-03-02", tokens: 13500, feature_updates: 5 },
      { date: "2026-03-03", tokens: 13000, feature_updates: 6 }
    ]
  };

  fs.writeFileSync(benchmarkPath, `${JSON.stringify(benchmark, null, 2)}\n`, "utf8");
  fs.writeFileSync(swapPath, `${JSON.stringify(swap, null, 2)}\n`, "utf8");
  fs.writeFileSync(efficiencyPath, `${JSON.stringify(efficiency, null, 2)}\n`, "utf8");
  fs.writeFileSync(docsFreshnessPath, `${JSON.stringify(docsFreshness, null, 2)}\n`, "utf8");
  fs.writeFileSync(historyPath, `${JSON.stringify(existingHistory, null, 2)}\n`, "utf8");

  const report = generate(root, {
    benchmarkFile: "bench.json",
    swapReportFile: "swap.json",
    efficiencyReportFile: "efficiency.json",
    docsFreshnessReportFile: "docs-freshness.json",
    historyFile: "history.json",
    assetsDir: "docs/visuals/assets",
    dashboardFile: "docs/visuals/runtime_dashboard.md",
    summaryFile: "docs/visuals/runtime_dashboard.json"
  });

  assert.equal(report.status, "pass");
  const dashboardPath = path.join(root, report.dashboard_file);
  const summaryPath = path.join(root, report.summary_file);
  assert.equal(fs.existsSync(dashboardPath), true);
  assert.equal(fs.existsSync(summaryPath), true);

  Object.values(report.assets).forEach((relativeFile) => {
    assert.equal(fs.existsSync(path.join(root, relativeFile)), true);
  });

  const dashboard = fs.readFileSync(dashboardPath, "utf8");
  assert.match(dashboard, /Runtime Visual Dashboard/);
  assert.match(dashboard, /runtime_language_total_ms\.svg/);
  assert.match(dashboard, /workflow_stage_timeline\.svg/);
  assert.match(dashboard, /token_optimization_progress\.svg/);
  assert.match(dashboard, /feature_update_footprint\.svg/);
  assert.match(dashboard, /weekly_progress_trend\.svg/);

  const summary = JSON.parse(fs.readFileSync(summaryPath, "utf8"));
  assert.equal(summary.schema_version, 1);
  assert.equal(summary.overall_winner_language, "javascript");
  assert.equal(summary.token_optimization.max_total_tokens, 20000);
  assert.equal(summary.feature_update_rows.length > 0, true);
  assert.equal(summary.weekly_trend_rows.length > 0, true);

  const historyOut = JSON.parse(fs.readFileSync(historyPath, "utf8"));
  assert.equal(Array.isArray(historyOut.entries), true);
  assert.equal(historyOut.entries.length >= existingHistory.entries.length, true);
});
