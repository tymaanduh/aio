#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const { childProcessSpawnAllowed } = require("./lib/in-process-script-runner");

const ROOT = path.resolve(__dirname, "..");
const DEFAULT_REPORT_FILE = path.join(
  "data",
  "output",
  "databases",
  "polyglot-default",
  "analysis",
  "docs_freshness_report.json"
);

const REQUIRED_DOCS = Object.freeze([
  "docs/README.md",
  "docs/architecture/pipeline.md",
  "docs/governance/compliance.md",
  "docs/contracts/wrapper_contracts.md",
  "docs/runbooks/maintenance.md",
  "docs/changelog/decisions.md",
  "docs/reference/file_catalog.md",
  "docs/visuals/runtime_dashboard.md"
]);

const MONITORED_ROOTS = Object.freeze([
  ".github/",
  "app/",
  "brain/",
  "main/",
  "renderer/",
  "tests/",
  "scripts/",
  "to-do/",
  "data/input/",
  "data/output/"
]);

const SUBSYSTEM_RULES = Object.freeze([
  {
    id: "workflow_governance",
    description: "Workflow/governance contract changes require architecture + governance + decision docs updates.",
    matchers: [
      /^scripts\/(general-workflow|workflow-preflight|hard-governance-gate|standards-baseline-gate|iso-standards-compliance-gate|validate-workflow-pipeline-order|refactor-blocking-gate|prune-workflow-artifacts)\.js$/,
      /^data\/input\/shared\/main\/(executive_engineering_baseline|hard_governance_ruleset|workflow_execution_pipeline|polyglot_engineering_standards_catalog|iso_standards_traceability_catalog|ui_ux_blueprint_catalog|ui_component_blueprint_catalog|rendering_runtime_policy_catalog|search_strategy_routing_catalog|memory_data_lifecycle_policy_catalog|ai_automation_safety_speech_catalog)\.json$/
    ],
    required_docs: ["docs/architecture/pipeline.md", "docs/governance/compliance.md", "docs/changelog/decisions.md"]
  },
  {
    id: "wrapper_contracts",
    description: "Wrapper/runtime benchmark changes require contract docs updates.",
    matchers: [
      /^data\/input\/shared\/wrapper\//,
      /^scripts\/(polyglot-runtime-benchmark|validate-wrapper-contracts|generate-wrapper-polyglot-bindings)\.js$/,
      /^data\/input\/shared\/wrapper\/function_contracts\.json$/
    ],
    required_docs: ["docs/contracts/wrapper_contracts.md", "docs/changelog/decisions.md"]
  },
  {
    id: "automation_ops",
    description: "Automation/workflow-ci changes require runbook updates.",
    matchers: [
      /^\.github\/workflows\//,
      /^scripts\/(optimize-codex-automations|sync-agent-skill-scope|codex-desktop-sync)\.js$/,
      /^to-do\/skills\/(agent_workflows|repeat_action_routing)\.json$/
    ],
    required_docs: ["docs/runbooks/maintenance.md", "docs/changelog/decisions.md"]
  },
  {
    id: "runtime_visuals",
    description: "Benchmark/runtime report changes require visual dashboard refresh.",
    matchers: [
      /^scripts\/(polyglot-runtime-benchmark|generate-runtime-visuals|generate-documentation-suite)\.js$/,
      /^data\/output\/databases\/polyglot-default\/(analysis\/script_runtime_swap_report|reports\/polyglot_runtime_benchmark_report)\.json$/,
      /^docs\/visuals\/assets\/.*\.svg$/
    ],
    required_docs: ["docs/visuals/runtime_dashboard.md", "docs/changelog/decisions.md"]
  },
  {
    id: "repository_file_catalog",
    description: "Project file changes require repository file catalog refresh.",
    matchers: [
      /^\.github\//,
      /^app\//,
      /^brain\//,
      /^data\/input\//,
      /^data\/output\//,
      /^main\//,
      /^renderer\//,
      /^scripts\//,
      /^tests\//,
      /^to-do\//
    ],
    required_docs: ["docs/reference/file_catalog.md"]
  }
]);

function parseArgs(argv) {
  const args = {
    baseRef: "",
    headRef: "HEAD",
    reportFile: DEFAULT_REPORT_FILE,
    enforce: argv.includes("--enforce") || argv.includes("--check")
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = String(argv[index] || "");
    if (token === "--base-ref" && argv[index + 1]) {
      args.baseRef = String(argv[index + 1] || "").trim();
      index += 1;
      continue;
    }
    if (token === "--head-ref" && argv[index + 1]) {
      args.headRef = String(argv[index + 1] || "").trim();
      index += 1;
      continue;
    }
    if (token === "--report-file" && argv[index + 1]) {
      args.reportFile = String(argv[index + 1] || "").trim();
      index += 1;
      continue;
    }
  }

  return args;
}

function normalizePath(value) {
  return String(value || "").replace(/\\/g, "/").trim();
}

function git(args) {
  return spawnSync("git", args, {
    cwd: ROOT,
    encoding: "utf8",
    shell: false
  });
}

function readChangedFiles(baseRef, headRef) {
  if (!childProcessSpawnAllowed()) {
    return {
      ok: true,
      skipped: true,
      warning: "child process execution unavailable in current runtime",
      files: []
    };
  }

  let args;
  if (baseRef) {
    args = ["diff", "--name-only", `${baseRef}...${headRef || "HEAD"}`];
  } else {
    args = ["diff", "--name-only", "HEAD"];
  }

  const result = git(args);
  if (result.error || Number(result.status || 0) !== 0) {
    return {
      ok: false,
      error: String(result.stderr || result.error?.message || "git diff failed").trim(),
      files: []
    };
  }

  const files = String(result.stdout || "")
    .split(/\r?\n/)
    .map((line) => normalizePath(line))
    .filter(Boolean)
    .sort((left, right) => left.localeCompare(right));

  const untrackedResult = git(["ls-files", "--others", "--exclude-standard"]);
  if (!untrackedResult.error && Number(untrackedResult.status || 0) === 0) {
    const untrackedFiles = String(untrackedResult.stdout || "")
      .split(/\r?\n/)
      .map((line) => normalizePath(line))
      .filter(Boolean);
    untrackedFiles.forEach((file) => files.push(file));
  }

  const unique = [...new Set(files)].sort((left, right) => left.localeCompare(right));

  return {
    ok: true,
    files: unique
  };
}

function ensureDirForFile(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function ruleMatched(rule, file) {
  return rule.matchers.some((matcher) => matcher.test(file));
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const baseRef = args.baseRef || (process.env.GITHUB_BASE_REF ? `origin/${String(process.env.GITHUB_BASE_REF).trim()}` : "");
  const changed = readChangedFiles(baseRef, args.headRef || "HEAD");

  const report = {
    status: "pass",
    generated_at: new Date().toISOString(),
    root: ROOT,
    base_ref: baseRef || "HEAD",
    head_ref: args.headRef || "HEAD",
    report_file: normalizePath(path.resolve(ROOT, args.reportFile || DEFAULT_REPORT_FILE)),
    required_docs: REQUIRED_DOCS,
    changed_files: changed.files,
    issues: []
  };

  if (!changed.ok) {
    report.status = "fail";
    report.issues.push({
      level: "error",
      type: "git_diff_failed",
      detail: changed.error
    });
  }

  REQUIRED_DOCS.forEach((docPath) => {
    const absolute = path.resolve(ROOT, docPath);
    if (!fs.existsSync(absolute)) {
      report.status = "fail";
      report.issues.push({
        level: "error",
        type: "missing_required_doc",
        detail: "required documentation file is missing",
        file: docPath
      });
    }
  });

  if (changed.ok) {
    if (changed.skipped) {
      report.issues.push({
        level: "warn",
        type: "git_diff_skipped",
        detail: String(changed.warning || "git diff inspection skipped")
      });
    }

    const docsChanged = new Set(changed.files.filter((file) => file.startsWith("docs/")));
    const monitoredChanges = changed.files.filter((file) => MONITORED_ROOTS.some((root) => file.startsWith(root)));

    if (monitoredChanges.length > 0 && docsChanged.size === 0) {
      report.status = "fail";
      report.issues.push({
        level: "error",
        type: "docs_not_updated",
        detail: "subsystem changes detected without documentation updates",
        changed_roots: [...new Set(monitoredChanges.map((file) => file.split("/")[0]))]
      });
    }

    SUBSYSTEM_RULES.forEach((rule) => {
      const touched = changed.files.filter((file) => ruleMatched(rule, file));
      if (touched.length === 0) {
        return;
      }
      const missingDocs = rule.required_docs.filter((docPath) => !docsChanged.has(docPath));
      if (missingDocs.length > 0) {
        report.status = "fail";
        report.issues.push({
          level: "error",
          type: "subsystem_docs_stale",
          detail: rule.description,
          rule_id: rule.id,
          missing_docs: missingDocs,
          touched_files: touched.slice(0, 40)
        });
      }
    });
  }

  const reportPath = path.resolve(ROOT, args.reportFile || DEFAULT_REPORT_FILE);
  ensureDirForFile(reportPath);
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);

  if (args.enforce && report.status !== "pass") {
    process.exit(1);
  }
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    process.stderr.write(`docs-freshness-check failed: ${error.message}\n`);
    process.exit(1);
  }
}
