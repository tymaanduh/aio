#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const { findProjectRoot } = require("./project-source-resolver");

const DEFAULT_LOG_DIR = path.join(
  "data",
  "output",
  "databases",
  "polyglot-default",
  "reports",
  "local-governance",
  "logs"
);
const DEFAULT_REPORT_FILE = path.join(
  "data",
  "output",
  "databases",
  "polyglot-default",
  "reports",
  "local-governance",
  "local_governance_report.json"
);
const DEFAULT_MARKDOWN_FILE = path.join("docs", "visuals", "local_governance_status.md");

const TASKS = Object.freeze([
  {
    id: "workflow_preflight",
    label: "Workflow Preflight",
    command: "npm",
    args: ["run", "workflow:preflight"]
  },
  {
    id: "workflow_order_gate",
    label: "Workflow Order Gate",
    command: "npm",
    args: ["run", "workflow:order:gate"]
  },
  {
    id: "wrapper_contract_validation",
    label: "Wrapper Contract Validation",
    command: "npm",
    args: ["run", "contracts:validate"]
  },
  {
    id: "standards_baseline_gate",
    label: "Standards Baseline Gate",
    command: "npm",
    args: ["run", "standards:baseline:gate"]
  },
  {
    id: "iso_standards_gate",
    label: "ISO Standards Gate",
    command: "npm",
    args: ["run", "standards:iso:gate"]
  },
  {
    id: "uiux_blueprint_check",
    label: "UIUX Blueprint Check",
    command: "npm",
    args: ["run", "uiux:blueprint:check"]
  },
  {
    id: "hard_governance_gate",
    label: "Hard Governance Gate",
    command: "npm",
    args: ["run", "governance:hard:gate"]
  },
  {
    id: "efficiency_gate",
    label: "Efficiency Gate",
    command: "npm",
    args: ["run", "efficiency:gate"]
  },
  {
    id: "docs_generate",
    label: "Docs Generate",
    command: "npm",
    args: ["run", "docs:generate"]
  },
  {
    id: "docs_freshness_enforce",
    label: "Docs Freshness Enforce",
    command: "npm",
    args: ["run", "docs:freshness:check", "--", "--enforce"]
  },
  {
    id: "refactor_gate",
    label: "Refactor Gate",
    command: "npm",
    args: ["run", "refactor:gate"]
  },
  {
    id: "wrapper_bindings_check",
    label: "Wrapper Bindings Check",
    command: "npm",
    args: ["run", "wrappers:check"]
  },
  {
    id: "script_swap_catalog_check",
    label: "Script Swap Catalog Check",
    command: "npm",
    args: ["run", "script-swaps:validate"]
  },
  {
    id: "script_equivalents_check",
    label: "Script Equivalents Check",
    command: "npm",
    args: ["run", "scripts:polyglot:check"]
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

function commandText(command, args) {
  return [command, ...args].join(" ");
}

function ensureDirForFile(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function runTask(root, logDir, task) {
  const startedAt = new Date().toISOString();
  const start = Date.now();
  let resolvedCommand = task.command;
  let resolvedArgs = task.args.slice();
  if (task.command.toLowerCase() === "npm" && process.env.npm_execpath && fs.existsSync(process.env.npm_execpath)) {
    resolvedCommand = process.execPath;
    resolvedArgs = [process.env.npm_execpath, ...task.args];
  }
  const result = spawnSync(resolvedCommand, resolvedArgs, {
    cwd: root,
    encoding: "utf8",
    shell: false
  });
  const endedAt = new Date().toISOString();
  const durationMs = Date.now() - start;
  const statusCode = result.error ? 1 : typeof result.status === "number" ? result.status : 1;
  const passed = statusCode === 0;
  const logFile = path.join(logDir, `${task.id}.log`);
  const logBody = [
    `# ${task.label}`,
    `command: ${commandText(task.command, task.args)}`,
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
    command: commandText(task.command, task.args),
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
  return [
    "# Local Governance Status",
    "",
    "This status is produced by local checks and does not require GitHub Actions billing.",
    "",
    `- Generated at: ${report.generated_at}`,
    `- Overall status: **${report.status.toUpperCase()}**`,
    `- Root: \`${report.root}\``,
    "",
    "## Run Command",
    "",
    "```bash",
    "npm run local:governance",
    "```",
    "",
    "## Task Results",
    "",
    "Log paths below are local-only artifacts (gitignored) generated on each run.",
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

function runLocalGovernance(options = {}) {
  const root = findProjectRoot(options.root || process.cwd());
  const logDir = path.join(root, DEFAULT_LOG_DIR);
  const reportPath = path.join(root, DEFAULT_REPORT_FILE);
  const markdownPath = path.join(root, DEFAULT_MARKDOWN_FILE);
  const stopOnFailure = options.stopOnFailure === true;
  const strict = options.strict === true;

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
  const report = runLocalGovernance({
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
    process.stderr.write(`run-local-governance failed: ${error.message}\n`);
    process.exit(1);
  }
}

module.exports = {
  runLocalGovernance
};
