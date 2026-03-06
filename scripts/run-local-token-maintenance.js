#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { findProjectRoot } = require("./project-source-resolver");
const { runNodeScript } = require("./lib/in-process-script-runner");

const DEFAULT_LOG_DIR = path.join(
  "data",
  "output",
  "databases",
  "polyglot-default",
  "reports",
  "local-token-maintenance",
  "logs"
);
const DEFAULT_REPORT_FILE = path.join(
  "data",
  "output",
  "databases",
  "polyglot-default",
  "reports",
  "local-token-maintenance",
  "local_token_maintenance_report.json"
);
const DEFAULT_MARKDOWN_FILE = path.join("docs", "visuals", "local_token_maintenance_status.md");
const DEFAULT_EFFICIENCY_REPORT = path.join(
  "data",
  "output",
  "databases",
  "polyglot-default",
  "analysis",
  "codex_efficiency_report.json"
);

const TASKS = Object.freeze([
  {
    id: "scope_sync",
    label: "Scope Sync",
    script: "scripts/sync-agent-skill-scope.js",
    args: []
  },
  {
    id: "agent_registry_validate",
    label: "Agent Registry Validate",
    script: "scripts/validate-agent-registry.js",
    args: []
  },
  {
    id: "codex_desktop_validate",
    label: "Codex Desktop Validate",
    script: "scripts/validate-codex-desktop-compat.js",
    args: []
  },
  {
    id: "workflow_preflight",
    label: "Workflow Preflight",
    script: "scripts/workflow-preflight.js",
    args: []
  },
  {
    id: "workflow_order_gate",
    label: "Workflow Order Gate",
    script: "scripts/validate-workflow-pipeline-order.js",
    args: ["--enforce"]
  },
  {
    id: "wrapper_contract_validation",
    label: "Wrapper Contract Validation",
    script: "scripts/validate-wrapper-contracts.js",
    args: []
  },
  {
    id: "neutral_core_generate",
    label: "Neutral Core Generate",
    script: "scripts/generate-neutral-core-assets.js",
    args: []
  },
  {
    id: "script_equivalents_generate",
    label: "Script Equivalents Generate",
    script: "scripts/generate-script-polyglot-equivalents.js",
    args: []
  },
  {
    id: "repo_equivalents_generate",
    label: "Repo Equivalents Generate",
    script: "scripts/generate-repo-polyglot-equivalents.js",
    args: []
  },
  {
    id: "benchmark_cases_reset",
    label: "Benchmark Cases Reset",
    script: "scripts/reset-runtime-benchmark-cases.js",
    args: []
  },
  {
    id: "benchmark_reset_and_run",
    label: "Benchmark Reset And Run",
    script: "scripts/reset-and-benchmark-polyglot-runtime.js",
    args: ["--languages", "javascript,python,cpp"]
  },
  {
    id: "automations_optimize",
    label: "Automations Optimize",
    script: "scripts/optimize-codex-automations.js",
    args: ["--apply"]
  },
  {
    id: "efficiency_audit",
    label: "Efficiency Audit",
    script: "scripts/codex-efficiency-audit.js",
    args: ["--enforce-skill-prompt-template"]
  },
  {
    id: "efficiency_gate",
    label: "Efficiency Gate",
    script: "scripts/codex-efficiency-audit.js",
    args: ["--enforce", "--enforce-skill-prompt-template"]
  },
  {
    id: "optimization_backlog",
    label: "Optimization Backlog",
    script: "scripts/generate-runtime-optimization-backlog.js",
    args: []
  },
  {
    id: "standards_baseline_gate",
    label: "Standards Baseline Gate",
    script: "scripts/standards-baseline-gate.js",
    args: ["--enforce"]
  },
  {
    id: "iso_standards_gate",
    label: "ISO Standards Gate",
    script: "scripts/iso-standards-compliance-gate.js",
    args: ["--enforce"]
  },
  {
    id: "uiux_blueprint_check",
    label: "UIUX Blueprint Check",
    script: "scripts/generate-uiux-blueprint.js",
    args: ["--check", "--enforce"]
  },
  {
    id: "hard_governance_gate",
    label: "Hard Governance Gate",
    script: "scripts/hard-governance-gate.js",
    args: ["--enforce"]
  },
  {
    id: "docs_catalog",
    label: "Docs Catalog",
    script: "scripts/generate-file-catalog-docs.js",
    args: []
  },
  {
    id: "visuals_runtime",
    label: "Runtime Visuals",
    script: "scripts/generate-runtime-visuals.js",
    args: []
  },
  {
    id: "docs_generate",
    label: "Docs Generate",
    script: "scripts/generate-documentation-suite.js",
    args: []
  },
  {
    id: "docs_freshness_enforce",
    label: "Docs Freshness Enforce",
    script: "scripts/docs-freshness-check.js",
    args: ["--enforce"]
  },
  {
    id: "refactor_gate",
    label: "Refactor Gate",
    script: "scripts/refactor-blocking-gate.js",
    args: []
  },
  {
    id: "wrapper_bindings_check",
    label: "Wrapper Bindings Check",
    script: "scripts/generate-wrapper-polyglot-bindings.js",
    args: ["--check"]
  },
  {
    id: "neutral_core_validate",
    label: "Neutral Core Validate",
    script: "scripts/validate-neutral-core-contracts.js",
    args: []
  },
  {
    id: "script_swap_catalog_check",
    label: "Script Swap Catalog Check",
    script: "scripts/validate-script-swap-catalog.js",
    args: []
  },
  {
    id: "script_equivalents_check",
    label: "Script Equivalents Check",
    script: "scripts/generate-script-polyglot-equivalents.js",
    args: ["--check"]
  },
  {
    id: "repo_equivalents_check",
    label: "Repo Equivalents Check",
    script: "scripts/generate-repo-polyglot-equivalents.js",
    args: ["--check"]
  }
]);

function parseArgs(argv) {
  return {
    strict: argv.includes("--strict"),
    stopOnFailure: argv.includes("--stop-on-failure")
  };
}

function normalizePath(value) {
  return String(value || "").replace(/\\/g, "/");
}

function ensureDirForFile(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function readJsonIfExists(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
}

function commandText(script, args) {
  return [process.execPath, script, ...args].join(" ");
}

function runTask(root, logDir, task) {
  const startedAt = new Date().toISOString();
  const start = Date.now();
  const result = runNodeScript(task.script, task.args, { cwd: root });
  const endedAt = new Date().toISOString();
  const durationMs = Date.now() - start;
  const statusCode = result.error ? 1 : typeof result.status === "number" ? result.status : 1;
  const passed = statusCode === 0;
  const logFile = path.join(logDir, `${task.id}.log`);
  const logBody = [
    `# ${task.label}`,
    `command: ${commandText(task.script, task.args)}`,
    `mode: ${String(result.mode || "unknown")}`,
    `started_at: ${startedAt}`,
    `ended_at: ${endedAt}`,
    `duration_ms: ${durationMs}`,
    `status_code: ${statusCode}`,
    "",
    "## stdout",
    String(result.stdout || ""),
    "",
    "## stderr",
    String(result.stderr || result.error?.message || "")
  ].join("\n");
  ensureDirForFile(logFile);
  fs.writeFileSync(logFile, logBody, "utf8");

  return {
    id: task.id,
    label: task.label,
    command: commandText(task.script, task.args),
    started_at: startedAt,
    ended_at: endedAt,
    duration_ms: durationMs,
    status: passed ? "pass" : "fail",
    status_code: statusCode,
    log_file: normalizePath(path.relative(root, logFile))
  };
}

function buildMarkdown(report) {
  const rows = report.tasks
    .map((task) => `| ${task.label} | ${task.status.toUpperCase()} | ${task.status_code} | ${task.duration_ms} | \`${task.log_file}\` |`)
    .join("\n");
  const efficiencySummary = report.efficiency_summary
    ? [
        `- Total token estimate: ${report.efficiency_summary.total_tokens_estimate}`,
        `- Token delta: ${report.efficiency_summary.total_tokens_delta}`,
        `- Token delta %: ${report.efficiency_summary.total_tokens_delta_percent}`,
        `- Issues: ${report.efficiency_summary.issue_count}`
      ].join("\n")
    : "- No efficiency summary available";
  return [
    "# Local Token Maintenance Status",
    "",
    "This report is generated entirely from local scripts to minimize manual/token-heavy maintenance work.",
    "",
    `- Generated at: ${report.generated_at}`,
    `- Overall status: **${report.status.toUpperCase()}**`,
    `- Root: \`${report.root}\``,
    "",
    "## Run Command",
    "",
    "```bash",
    "npm run token:maintain",
    "```",
    "",
    "## Efficiency Summary",
    "",
    efficiencySummary,
    "",
    "## Task Results",
    "",
    "| Task | Status | Exit | Duration (ms) | Log |",
    "| --- | --- | --- | ---: | --- |",
    rows,
    "",
    "## Report JSON",
    "",
    `\`${report.report_file}\``,
    ""
  ].join("\n");
}

function buildEfficiencySummary(root) {
  const reportPath = path.join(root, DEFAULT_EFFICIENCY_REPORT);
  const payload = readJsonIfExists(reportPath);
  if (!payload || typeof payload !== "object") {
    return null;
  }
  const counts = payload.counts && typeof payload.counts === "object" ? payload.counts : {};
  const regressions = payload.regressions && typeof payload.regressions === "object" ? payload.regressions : {};
  const issues = Array.isArray(payload.issues) ? payload.issues : [];
  return {
    report_file: normalizePath(path.relative(root, reportPath)),
    total_tokens_estimate: Number(counts.total_tokens_estimate || 0),
    total_tokens_delta: Number(regressions.total_tokens_delta || 0),
    total_tokens_delta_percent: Number(regressions.total_tokens_delta_percent || 0),
    issue_count: issues.length
  };
}

function runLocalTokenMaintenance(options = {}) {
  const root = findProjectRoot(options.root || process.cwd());
  const logDir = path.join(root, DEFAULT_LOG_DIR);
  const reportPath = path.join(root, DEFAULT_REPORT_FILE);
  const markdownPath = path.join(root, DEFAULT_MARKDOWN_FILE);
  const strict = options.strict === true;
  const stopOnFailure = options.stopOnFailure === true;

  const tasks = [];
  for (const task of TASKS) {
    const result = runTask(root, logDir, task);
    tasks.push(result);
    if (stopOnFailure && result.status !== "pass") {
      break;
    }
  }

  const failedCount = tasks.filter((task) => task.status !== "pass").length;
  const report = {
    status: failedCount === 0 ? "pass" : "fail",
    generated_at: new Date().toISOString(),
    root: ".",
    report_file: normalizePath(path.relative(root, reportPath)),
    markdown_file: normalizePath(path.relative(root, markdownPath)),
    strict,
    stop_on_failure: stopOnFailure,
    metrics: {
      task_count: tasks.length,
      passed: tasks.length - failedCount,
      failed: failedCount
    },
    efficiency_summary: buildEfficiencySummary(root),
    tasks
  };

  ensureDirForFile(reportPath);
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  ensureDirForFile(markdownPath);
  fs.writeFileSync(markdownPath, `${buildMarkdown(report)}\n`, "utf8");
  return report;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const report = runLocalTokenMaintenance({
    root: process.cwd(),
    strict: args.strict,
    stopOnFailure: args.stopOnFailure
  });
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (args.strict && report.status !== "pass") {
    process.exit(1);
  }
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    process.stderr.write(`run-local-token-maintenance failed: ${error.message}\n`);
    process.exit(1);
  }
}

module.exports = {
  runLocalTokenMaintenance
};
