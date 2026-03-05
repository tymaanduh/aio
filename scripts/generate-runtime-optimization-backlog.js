#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DEFAULT_RUNTIME_REPORT = path.join(
  ROOT,
  "data",
  "output",
  "databases",
  "polyglot-default",
  "analysis",
  "script_runtime_swap_report.json"
);
const DEFAULT_EFFICIENCY_REPORT = path.join(
  ROOT,
  "data",
  "output",
  "databases",
  "polyglot-default",
  "analysis",
  "codex_efficiency_report.json"
);
const DEFAULT_SEPARATION_REPORT = path.join(
  ROOT,
  "data",
  "output",
  "databases",
  "polyglot-default",
  "analysis",
  "data_separation_audit_report.json"
);
const DEFAULT_BENCHMARK_REPORT = path.join(
  ROOT,
  "data",
  "output",
  "databases",
  "polyglot-default",
  "reports",
  "polyglot_runtime_benchmark_report.json"
);
const DEFAULT_JSON_OUT = path.join(
  ROOT,
  "data",
  "output",
  "databases",
  "polyglot-default",
  "plan",
  "runtime_optimization_backlog.json"
);
const DEFAULT_MD_OUT = path.join(
  ROOT,
  "data",
  "output",
  "databases",
  "polyglot-default",
  "plan",
  "runtime_optimization_backlog.md"
);

const PRIORITY_SCORE = Object.freeze({
  P0: 0,
  P1: 1,
  P2: 2
});

function parseArgs(argv) {
  const args = {
    strict: !argv.includes("--no-strict"),
    enforce: argv.includes("--enforce"),
    runtimeReport: DEFAULT_RUNTIME_REPORT,
    efficiencyReport: DEFAULT_EFFICIENCY_REPORT,
    separationReport: DEFAULT_SEPARATION_REPORT,
    benchmarkReport: DEFAULT_BENCHMARK_REPORT,
    jsonOut: DEFAULT_JSON_OUT,
    mdOut: DEFAULT_MD_OUT
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--runtime-report-file" && argv[index + 1]) {
      args.runtimeReport = path.resolve(process.cwd(), String(argv[index + 1]));
      index += 1;
      continue;
    }
    if (token === "--efficiency-report-file" && argv[index + 1]) {
      args.efficiencyReport = path.resolve(process.cwd(), String(argv[index + 1]));
      index += 1;
      continue;
    }
    if (token === "--separation-report-file" && argv[index + 1]) {
      args.separationReport = path.resolve(process.cwd(), String(argv[index + 1]));
      index += 1;
      continue;
    }
    if (token === "--benchmark-report-file" && argv[index + 1]) {
      args.benchmarkReport = path.resolve(process.cwd(), String(argv[index + 1]));
      index += 1;
      continue;
    }
    if (token === "--json-out" && argv[index + 1]) {
      args.jsonOut = path.resolve(process.cwd(), String(argv[index + 1]));
      index += 1;
      continue;
    }
    if (token === "--md-out" && argv[index + 1]) {
      args.mdOut = path.resolve(process.cwd(), String(argv[index + 1]));
      index += 1;
      continue;
    }
  }

  return args;
}

function ensureDirForFile(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function normalizePath(filePath) {
  return path.relative(ROOT, filePath).replace(/\\/g, "/");
}

function readJsonIfExists(filePath, issues, key) {
  if (!fs.existsSync(filePath)) {
    issues.push({
      level: "warn",
      code: "missing_input_report",
      report_key: key,
      file: normalizePath(filePath)
    });
    return {};
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    issues.push({
      level: "warn",
      code: "invalid_input_report_json",
      report_key: key,
      file: normalizePath(filePath),
      error: String(error.message || error)
    });
    return {};
  }
}

function addTask(tasks, task) {
  tasks.push({
    id: String(task.id || "").trim(),
    title: String(task.title || "").trim(),
    priority: String(task.priority || "P2"),
    category: String(task.category || "general"),
    impact: String(task.impact || ""),
    effort: String(task.effort || "medium"),
    action: String(task.action || ""),
    command: String(task.command || ""),
    evidence: Array.isArray(task.evidence) ? task.evidence : []
  });
}

function buildTasks(inputs) {
  const tasks = [];
  const runtimeMetrics =
    inputs.runtimeReport && inputs.runtimeReport.metrics && typeof inputs.runtimeReport.metrics === "object"
      ? inputs.runtimeReport.metrics
      : {};
  const runtimeStages = Array.isArray(inputs.runtimeReport && inputs.runtimeReport.stages) ? inputs.runtimeReport.stages : [];
  const runtimeControls =
    inputs.runtimeReport && inputs.runtimeReport.controls && typeof inputs.runtimeReport.controls === "object"
      ? inputs.runtimeReport.controls
      : {};
  const separationRequiredTotal = Number(inputs.separationReport.separation_required_total || 0);
  const benchmarkLanguagesRun = Array.isArray(inputs.benchmarkReport.languages_run) ? inputs.benchmarkReport.languages_run : [];
  const benchmarkLanguagesSkipped = Array.isArray(inputs.benchmarkReport.languages_skipped)
    ? inputs.benchmarkReport.languages_skipped
    : [];
  const benchmarkCaseCount = Number(inputs.benchmarkReport.benchmark_case_count || 0);
  const efficiencyTopHeavy = Array.isArray(inputs.efficiencyReport.top_heavy_files)
    ? inputs.efficiencyReport.top_heavy_files
    : [];
  const efficiencyAutomation =
    inputs.efficiencyReport &&
    inputs.efficiencyReport.automation &&
    Array.isArray(inputs.efficiencyReport.automation.prompts)
      ? inputs.efficiencyReport.automation.prompts
      : [];
  const duplicatedGuardrails = Array.isArray(inputs.efficiencyReport.duplicated_scope_guardrails)
    ? inputs.efficiencyReport.duplicated_scope_guardrails
    : [];

  if (separationRequiredTotal > 0) {
    addTask(tasks, {
      id: "separation-hardcoded-remaining",
      title: "Extract remaining hardcoded values into JSON catalogs",
      priority: "P0",
      category: "data-separation",
      impact: "Enforces 1:1 wrapper contract and removes duplicated inline data.",
      effort: "high",
      action: `Resolve ${separationRequiredTotal} separation-required findings from the latest audit and move constants, aliases, and labels to data catalogs.`,
      command: "npm run audit:data-separation -- --enforce",
      evidence: [normalizePath(DEFAULT_SEPARATION_REPORT)]
    });
  }

  if (Number(runtimeMetrics.fallback_used_stage_count || 0) > 0) {
    addTask(tasks, {
      id: "runtime-fallback-reduction",
      title: "Reduce runtime fallback retries across workflow stages",
      priority: "P0",
      category: "runtime",
      impact: "Cuts stage latency spikes and improves deterministic execution.",
      effort: "medium",
      action: "Tune stage runtime order and adapter health so first attempt succeeds for every stage.",
      command: "npm run workflow:general -- --mode maintain --script-runtime-auto-best --script-runtime-strict",
      evidence: [normalizePath(DEFAULT_RUNTIME_REPORT)]
    });
  }

  if (Number(runtimeMetrics.failed_stage_count || 0) > 0) {
    addTask(tasks, {
      id: "runtime-stage-failures",
      title: "Clear failed script runtime stages",
      priority: "P0",
      category: "runtime",
      impact: "Restores full pipeline reliability.",
      effort: "medium",
      action: `Fix ${Number(runtimeMetrics.failed_stage_count || 0)} failing stage runtime execution paths, then rerun maintain workflow.`,
      command: "npm run workflow:general -- --mode maintain",
      evidence: [normalizePath(DEFAULT_RUNTIME_REPORT)]
    });
  }

  if (Number(runtimeMetrics.strict_stage_count || 0) === 0 && runtimeControls.disable_swaps !== true) {
    addTask(tasks, {
      id: "runtime-strict-smoke",
      title: "Add strict runtime smoke run to detect adapter drift early",
      priority: "P1",
      category: "runtime",
      impact: "Detects adapter/toolchain regressions before fallback masks failures.",
      effort: "low",
      action: "Run a strict runtime maintain pass in automation and fail fast on missing adapters.",
      command: "npm run workflow:general -- --mode maintain --script-runtime-auto-best --script-runtime-strict",
      evidence: [normalizePath(DEFAULT_RUNTIME_REPORT)]
    });
  }

  const slowStages = runtimeStages.filter((stage) => Number(stage && stage.duration_ms ? stage.duration_ms : 0) >= 800);
  slowStages
    .sort((left, right) => Number(right.duration_ms || 0) - Number(left.duration_ms || 0))
    .slice(0, 5)
    .forEach((stage) => {
      addTask(tasks, {
        id: `runtime-stage-${String(stage.stage || "unknown")}-latency`,
        title: `Optimize ${String(stage.stage || "stage")} runtime latency`,
        priority: "P1",
        category: "runtime",
        impact: "Reduces total workflow completion time.",
        effort: "medium",
        action: `Profile and optimize '${String(stage.stage || "unknown")}' stage. Current duration: ${Number(stage.duration_ms || 0)} ms.`,
        command: `npm run workflow:general -- --mode maintain --script-runtime-auto-best --scope "${String(stage.stage || "unknown")} tuning"`,
        evidence: [normalizePath(DEFAULT_RUNTIME_REPORT)]
      });
    });

  const requiredLanguages = ["javascript", "python", "cpp"];
  const missingBenchmarkLanguages = requiredLanguages.filter((language) => !benchmarkLanguagesRun.includes(language));
  if (missingBenchmarkLanguages.length > 0 || benchmarkLanguagesSkipped.length > 0) {
    const missing = [...new Set([...missingBenchmarkLanguages, ...benchmarkLanguagesSkipped])];
    addTask(tasks, {
      id: "benchmark-language-coverage",
      title: "Restore full JS/Python/C++ benchmark coverage",
      priority: "P0",
      category: "benchmark",
      impact: "Keeps runtime winner selection evidence valid for modular swaps.",
      effort: "medium",
      action: `Install/fix toolchains for: ${missing.join(", ")} and rerun runtime benchmark gate.`,
      command: "npm run benchmark:runtime -- --languages javascript,python,cpp",
      evidence: [normalizePath(DEFAULT_BENCHMARK_REPORT)]
    });
  }

  if (benchmarkCaseCount < 20) {
    addTask(tasks, {
      id: "benchmark-case-expansion",
      title: "Expand runtime benchmark case catalog coverage",
      priority: "P2",
      category: "benchmark",
      impact: "Improves confidence in per-function language winner decisions.",
      effort: "medium",
      action: `Increase benchmark cases from ${benchmarkCaseCount} to at least 20 with representative IO-heavy and string-heavy wrappers.`,
      command: "npm run benchmark:runtime -- --languages javascript,python,cpp",
      evidence: [normalizePath(DEFAULT_BENCHMARK_REPORT), "data/input/shared/wrapper/runtime_benchmark_cases.json"]
    });
  }

  efficiencyTopHeavy
    .filter((row) => Number(row && row.tokens_estimate ? row.tokens_estimate : 0) > 1200)
    .slice(0, 8)
    .forEach((row) => {
      addTask(tasks, {
        id: `token-heavy-${String(row.file || "").replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase()}`,
        title: `Reduce token weight in ${String(row.file || "large_file")}`,
        priority: Number(row.tokens_estimate || 0) > 2500 ? "P1" : "P2",
        category: "token-efficiency",
        impact: "Lowers Codex context cost and speed variance.",
        effort: "medium",
        action: `Split high-token sections into smaller catalogs/modules. Current estimate: ${Number(row.tokens_estimate || 0)} tokens.`,
        command: "npm run efficiency:audit -- --enforce",
        evidence: [normalizePath(DEFAULT_EFFICIENCY_REPORT), String(row.file || "")]
      });
    });

  efficiencyAutomation
    .filter((row) => String(row.status || "").toUpperCase() === "ACTIVE")
    .filter((row) => Number(row.prompt_tokens_estimate || 0) >= 60)
    .slice(0, 8)
    .forEach((row) => {
      addTask(tasks, {
        id: `automation-prompt-${String(row.id || "").replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase()}`,
        title: `Trim automation prompt tokens for ${String(row.name || row.id || "automation")}`,
        priority: "P1",
        category: "automation",
        impact: "Reduces autonomous run token usage and prompt drift.",
        effort: "low",
        action: `Compress automation prompt to <= 52 estimated tokens. Current estimate: ${Number(row.prompt_tokens_estimate || 0)}.`,
        command: "npm run automations:optimize",
        evidence: [normalizePath(DEFAULT_EFFICIENCY_REPORT)]
      });
    });

  if (duplicatedGuardrails.length > 0) {
    addTask(tasks, {
      id: "guardrail-deduplication",
      title: "Deduplicate repeated scope guardrails in agent metadata",
      priority: "P2",
      category: "metadata",
      impact: "Shrinks prompt size and simplifies agent maintenance.",
      effort: "low",
      action: `Centralize repeated guardrails into shared constants; currently duplicated entries: ${duplicatedGuardrails.length}.`,
      command: "npm run agents:scope-sync && npm run agents:validate",
      evidence: [normalizePath(DEFAULT_EFFICIENCY_REPORT)]
    });
  }

  return tasks;
}

function toMarkdown(report) {
  const byPriority = {
    P0: report.tasks.filter((entry) => entry.priority === "P0"),
    P1: report.tasks.filter((entry) => entry.priority === "P1"),
    P2: report.tasks.filter((entry) => entry.priority === "P2")
  };

  const lines = [];
  lines.push("# Runtime Optimization Backlog");
  lines.push("");
  lines.push(`- Generated At: ${report.generated_at}`);
  lines.push(`- Total Tasks: ${report.metrics.total_tasks}`);
  lines.push(`- P0: ${report.metrics.priority_counts.P0}`);
  lines.push(`- P1: ${report.metrics.priority_counts.P1}`);
  lines.push(`- P2: ${report.metrics.priority_counts.P2}`);
  lines.push("");

  ["P0", "P1", "P2"].forEach((priority) => {
    lines.push(`## ${priority} Tasks`);
    lines.push("");
    if (byPriority[priority].length === 0) {
      lines.push("- none");
      lines.push("");
      return;
    }
    byPriority[priority].forEach((task, index) => {
      lines.push(`${index + 1}. [${task.id}] ${task.title}`);
      lines.push(`   - Category: ${task.category}`);
      lines.push(`   - Impact: ${task.impact}`);
      lines.push(`   - Effort: ${task.effort}`);
      lines.push(`   - Action: ${task.action}`);
      if (task.command) {
        lines.push(`   - Command: \`${task.command}\``);
      }
      if (task.evidence.length > 0) {
        lines.push(`   - Evidence: ${task.evidence.join(", ")}`);
      }
    });
    lines.push("");
  });

  return `${lines.join("\n")}\n`;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const issues = [];
  const runtimeReport = readJsonIfExists(args.runtimeReport, issues, "runtime_report");
  const efficiencyReport = readJsonIfExists(args.efficiencyReport, issues, "efficiency_report");
  const separationReport = readJsonIfExists(args.separationReport, issues, "separation_report");
  const benchmarkReport = readJsonIfExists(args.benchmarkReport, issues, "benchmark_report");

  const tasks = buildTasks({
    runtimeReport,
    efficiencyReport,
    separationReport,
    benchmarkReport
  });

  const sortedTasks = tasks.sort((left, right) => {
    const leftPriority = PRIORITY_SCORE[left.priority] ?? PRIORITY_SCORE.P2;
    const rightPriority = PRIORITY_SCORE[right.priority] ?? PRIORITY_SCORE.P2;
    if (leftPriority !== rightPriority) {
      return leftPriority - rightPriority;
    }
    return left.id.localeCompare(right.id);
  });

  const priorityCounts = {
    P0: sortedTasks.filter((entry) => entry.priority === "P0").length,
    P1: sortedTasks.filter((entry) => entry.priority === "P1").length,
    P2: sortedTasks.filter((entry) => entry.priority === "P2").length
  };

  const report = {
    schema_version: 1,
    report_id: "aio_runtime_optimization_backlog",
    generated_at: new Date().toISOString(),
    root: ROOT,
    inputs: {
      runtime_report_file: normalizePath(args.runtimeReport),
      efficiency_report_file: normalizePath(args.efficiencyReport),
      separation_report_file: normalizePath(args.separationReport),
      benchmark_report_file: normalizePath(args.benchmarkReport)
    },
    outputs: {
      json_file: normalizePath(args.jsonOut),
      markdown_file: normalizePath(args.mdOut)
    },
    metrics: {
      total_tasks: sortedTasks.length,
      priority_counts: priorityCounts
    },
    issues,
    tasks: sortedTasks
  };

  ensureDirForFile(args.jsonOut);
  ensureDirForFile(args.mdOut);
  fs.writeFileSync(args.jsonOut, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  fs.writeFileSync(args.mdOut, toMarkdown(report), "utf8");
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);

  if (args.enforce && priorityCounts.P0 > 0) {
    process.exit(1);
  }
  if (args.strict && issues.some((entry) => entry.level === "warn")) {
    process.exit(1);
  }
}

try {
  main();
} catch (error) {
  process.stderr.write(`generate-runtime-optimization-backlog failed: ${error.message}\n`);
  process.exit(1);
}
