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
    counts: {
      total_tokens_estimate: 12345,
      skill_prompts_scanned: 12
    },
    automation: {
      active: 5
    }
  };

  fs.writeFileSync(benchmarkPath, `${JSON.stringify(benchmark, null, 2)}\n`, "utf8");
  fs.writeFileSync(swapPath, `${JSON.stringify(swap, null, 2)}\n`, "utf8");
  fs.writeFileSync(efficiencyPath, `${JSON.stringify(efficiency, null, 2)}\n`, "utf8");

  const report = generate(root, {
    benchmarkFile: "bench.json",
    swapReportFile: "swap.json",
    efficiencyReportFile: "efficiency.json",
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

  const summary = JSON.parse(fs.readFileSync(summaryPath, "utf8"));
  assert.equal(summary.schema_version, 1);
  assert.equal(summary.overall_winner_language, "javascript");
});
