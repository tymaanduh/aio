#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const DEFAULT_REPORT_FILE = path.join(
  ROOT,
  "data",
  "output",
  "databases",
  "polyglot-default",
  "analysis",
  "workflow_preflight_report.json"
);
const DEFAULT_SCOPE = "workflow-preflight";

const REQUIRED_FILES = Object.freeze([
  "RULES",
  "package.json",
  "scripts/general-workflow.js",
  "scripts/polyglot-default-pipeline.js",
  "scripts/validate-agent-registry.js",
  "scripts/build-agent-workflow-shards.js",
  "scripts/prune-workflow-artifacts.js",
  "scripts/hard-governance-gate.js",
  "scripts/standards-baseline-gate.js",
  "scripts/iso-standards-compliance-gate.js",
  "scripts/generate-uiux-blueprint.js",
  "scripts/validate-workflow-pipeline-order.js",
  "scripts/polyglot-runtime-benchmark.js",
  "scripts/generate-wrapper-polyglot-bindings.js",
  "scripts/codex-efficiency-audit.js",
  "scripts/optimize-codex-automations.js",
  "to-do/skills/agent_workflows.json",
  "to-do/agents/agent_workflow_shards/index.json",
  "to-do/agents/agent_access_control.json",
  "data/input/shared/main/polyglot_default_catalog.json",
  "data/input/shared/main/polyglot_contract_catalog.json",
  "data/input/shared/main/hard_governance_ruleset.json",
  "data/input/shared/main/executive_engineering_baseline.json",
  "data/input/shared/main/polyglot_engineering_standards_catalog.json",
  "data/input/shared/main/iso_standards_traceability_catalog.json",
  "data/input/shared/main/ui_ux_blueprint_catalog.json",
  "data/input/shared/main/workflow_execution_pipeline.json",
  "data/input/shared/wrapper/function_contracts.json",
  "data/input/shared/wrapper/unified_wrapper_specs.json",
  "data/input/shared/wrapper/wrapper_symbol_registry.json",
  "data/input/shared/wrapper/runtime_benchmark_cases.json"
]);

const REQUIRED_JSON_FILES = Object.freeze([
  "package.json",
  "to-do/skills/agent_workflows.json",
  "to-do/agents/agent_workflow_shards/index.json",
  "to-do/agents/agent_access_control.json",
  "data/input/shared/main/polyglot_default_catalog.json",
  "data/input/shared/main/polyglot_contract_catalog.json",
  "data/input/shared/main/hard_governance_ruleset.json",
  "data/input/shared/main/executive_engineering_baseline.json",
  "data/input/shared/main/polyglot_engineering_standards_catalog.json",
  "data/input/shared/main/iso_standards_traceability_catalog.json",
  "data/input/shared/main/ui_ux_blueprint_catalog.json",
  "data/input/shared/main/workflow_execution_pipeline.json",
  "data/input/shared/wrapper/function_contracts.json",
  "data/input/shared/wrapper/unified_wrapper_specs.json",
  "data/input/shared/wrapper/wrapper_symbol_registry.json",
  "data/input/shared/wrapper/runtime_benchmark_cases.json"
]);

const SCAN_ROOTS = Object.freeze([
  "scripts",
  "to-do/skills",
  "to-do/agents",
  "data/input/shared/main",
  "data/input/shared/wrapper",
  "RULES",
  "README.md"
]);

const TEXT_FILE_EXTENSIONS = new Set([".js", ".json", ".md", ".yaml", ".yml", ".sh", ".ts"]);
const MERGE_STATUS_CODES = new Set(["UU", "AA", "DD", "AU", "UA", "DU", "UD"]);

function parseArgs(argv) {
  const args = {
    strict: !argv.includes("--no-strict"),
    scope: DEFAULT_SCOPE,
    reportFile: DEFAULT_REPORT_FILE,
    writeReport: !argv.includes("--no-report")
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--scope") {
      args.scope = String(argv[index + 1] || "").trim() || DEFAULT_SCOPE;
      index += 1;
      continue;
    }
    if (token === "--report-file") {
      args.reportFile = path.resolve(process.cwd(), String(argv[index + 1] || "").trim());
      index += 1;
      continue;
    }
  }

  return args;
}

function ensureParentDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function listTextFiles(scanRoots) {
  const queue = scanRoots.map((entry) => path.resolve(ROOT, entry)).filter((filePath) => fs.existsSync(filePath));
  const files = [];

  while (queue.length > 0) {
    const current = queue.shift();
    const stat = fs.statSync(current);

    if (stat.isDirectory()) {
      const entries = fs.readdirSync(current);
      entries.forEach((name) => {
        const child = path.join(current, name);
        const childStat = fs.statSync(child);
        if (childStat.isDirectory()) {
          queue.push(child);
          return;
        }
        const ext = path.extname(name).toLowerCase();
        if (TEXT_FILE_EXTENSIONS.has(ext)) {
          files.push(child);
        }
      });
      continue;
    }

    const ext = path.extname(current).toLowerCase();
    if (TEXT_FILE_EXTENSIONS.has(ext) || path.basename(current) === "RULES") {
      files.push(current);
    }
  }

  return files;
}

function scanConflictMarkers(files) {
  const hits = [];

  files.forEach((filePath) => {
    const text = fs.readFileSync(filePath, "utf8");
    const lines = text.split(/\r?\n/);
    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index];
      if (!line.startsWith("<<<<<<< ") && !line.startsWith("=======") && !line.startsWith(">>>>>>> ")) {
        continue;
      }
      hits.push({
        file: path.relative(ROOT, filePath).replace(/\\/g, "/"),
        line: index + 1,
        marker: line.slice(0, 16)
      });
      if (hits.length >= 500) {
        return hits;
      }
    }
    return undefined;
  });

  return hits;
}

function collectUnmergedFiles() {
  const result = spawnSync("git", ["status", "--porcelain=v1"], {
    cwd: ROOT,
    encoding: "utf8",
    shell: false
  });

  if ((result.status || 0) !== 0) {
    return {
      command_status: Number(result.status || 1),
      parse_error: String(result.stderr || result.stdout || "git status failed").trim(),
      files: []
    };
  }

  const files = String(result.stdout || "")
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter(Boolean)
    .filter((line) => MERGE_STATUS_CODES.has(line.slice(0, 2)))
    .map((line) => line.slice(3).trim())
    .filter(Boolean);

  return {
    command_status: 0,
    files
  };
}

function checkRequiredFiles() {
  const missing = REQUIRED_FILES.filter((entry) => !fs.existsSync(path.resolve(ROOT, entry)));
  return {
    ok: missing.length === 0,
    missing
  };
}

function checkRequiredJson() {
  const invalid = [];
  REQUIRED_JSON_FILES.forEach((entry) => {
    const filePath = path.resolve(ROOT, entry);
    if (!fs.existsSync(filePath)) {
      invalid.push({ file: entry, error: "missing file" });
      return;
    }
    try {
      JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch (error) {
      invalid.push({ file: entry, error: String(error.message || error) });
    }
  });

  return {
    ok: invalid.length === 0,
    invalid
  };
}

function checkShellShebangLineEndings(files) {
  const invalid = [];

  files
    .filter((filePath) => path.extname(filePath).toLowerCase() === ".sh")
    .forEach((filePath) => {
      const content = fs.readFileSync(filePath, "utf8");
      const firstLine = content.split("\n")[0] || "";
      if (!firstLine.startsWith("#!")) {
        return;
      }
      if (firstLine.includes("\r")) {
        invalid.push(path.relative(ROOT, filePath).replace(/\\/g, "/"));
      }
    });

  return {
    ok: invalid.length === 0,
    invalid
  };
}

function checkRoutingKeywordConflicts() {
  const routingPath = path.resolve(ROOT, "to-do", "skills", "repeat_action_routing.json");
  if (!fs.existsSync(routingPath)) {
    return {
      ok: false,
      error: "missing to-do/skills/repeat_action_routing.json",
      conflicts: []
    };
  }

  const routing = JSON.parse(fs.readFileSync(routingPath, "utf8"));
  const keywordRules = Array.isArray(routing.keyword_rules) ? routing.keyword_rules : [];
  const keywordMap = new Map();
  const conflicts = [];

  keywordRules.forEach((rule, ruleIndex) => {
    const skills = Array.isArray(rule.skills) ? rule.skills : [];
    const skillsSignature = [...skills].sort().join("|");
    const keywords = Array.isArray(rule.keywords) ? rule.keywords : [];

    keywords.forEach((keyword) => {
      const normalized = String(keyword || "")
        .trim()
        .toLowerCase();
      if (!normalized) {
        return;
      }
      const existing = keywordMap.get(normalized);
      if (!existing) {
        keywordMap.set(normalized, {
          skillsSignature,
          ruleIndex
        });
        return;
      }
      if (existing.skillsSignature !== skillsSignature) {
        conflicts.push({
          keyword: normalized,
          first_rule_index: existing.ruleIndex,
          second_rule_index: ruleIndex
        });
      }
    });
  });

  return {
    ok: conflicts.length === 0,
    conflicts
  };
}

function checkWorkflowShards() {
  const result = spawnSync("node", ["scripts/build-agent-workflow-shards.js", "--check"], {
    cwd: ROOT,
    encoding: "utf8",
    shell: false
  });
  const statusCode = Number(result.status || 0);
  let payload = {};
  try {
    payload = JSON.parse(String(result.stdout || "{}"));
  } catch {
    payload = {
      output_tail: String(result.stdout || "").slice(-1000)
    };
  }
  return {
    ok: statusCode === 0,
    status_code: statusCode,
    report: payload
  };
}

function checkHardGovernanceGate() {
  const result = spawnSync("node", ["scripts/hard-governance-gate.js", "--check", "--enforce"], {
    cwd: ROOT,
    encoding: "utf8",
    shell: false
  });
  const statusCode = Number(result.status || 0);
  let payload = {};
  try {
    payload = JSON.parse(String(result.stdout || "{}"));
  } catch {
    payload = {
      output_tail: String(result.stdout || "").slice(-1000)
    };
  }
  return {
    ok: statusCode === 0,
    status_code: statusCode,
    report: payload
  };
}

function checkWorkflowOrderGate() {
  const result = spawnSync("node", ["scripts/validate-workflow-pipeline-order.js", "--check", "--enforce"], {
    cwd: ROOT,
    encoding: "utf8",
    shell: false
  });
  const statusCode = Number(result.status || 0);
  let payload = {};
  try {
    payload = JSON.parse(String(result.stdout || "{}"));
  } catch {
    payload = {
      output_tail: String(result.stdout || "").slice(-1000)
    };
  }
  return {
    ok: statusCode === 0,
    status_code: statusCode,
    report: payload
  };
}

function buildReport(args) {
  const textFiles = listTextFiles(SCAN_ROOTS);
  const conflictMarkerHits = scanConflictMarkers(textFiles);
  const unmergedFiles = collectUnmergedFiles();
  const requiredFiles = checkRequiredFiles();
  const requiredJson = checkRequiredJson();
  const shellLineEndings = checkShellShebangLineEndings(textFiles);
  const routingKeywordConflicts = checkRoutingKeywordConflicts();
  const workflowShards = checkWorkflowShards();
  const workflowOrderGate = checkWorkflowOrderGate();
  const hardGovernance = checkHardGovernanceGate();

  const checks = {
    unmerged_files: {
      ok: (unmergedFiles.files || []).length === 0,
      files: unmergedFiles.files || [],
      command_status: unmergedFiles.command_status
    },
    merge_markers: {
      ok: conflictMarkerHits.length === 0,
      hit_count: conflictMarkerHits.length,
      hits: conflictMarkerHits.slice(0, 80)
    },
    required_files: requiredFiles,
    required_json: requiredJson,
    shell_shebang_line_endings: shellLineEndings,
    routing_keyword_conflicts: routingKeywordConflicts,
    workflow_shards: workflowShards,
    workflow_order_gate: workflowOrderGate,
    hard_governance_gate: hardGovernance
  };

  const ok =
    checks.unmerged_files.ok &&
    checks.merge_markers.ok &&
    checks.required_files.ok &&
    checks.required_json.ok &&
    checks.shell_shebang_line_endings.ok &&
    checks.routing_keyword_conflicts.ok &&
    checks.workflow_shards.ok &&
    checks.workflow_order_gate.ok &&
    checks.hard_governance_gate.ok;

  return {
    ok,
    scope: args.scope,
    generated_at: new Date().toISOString(),
    root: ROOT,
    checks,
    report_file: path.relative(ROOT, args.reportFile).replace(/\\/g, "/")
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const report = buildReport(args);
  if (args.writeReport) {
    ensureParentDir(args.reportFile);
    fs.writeFileSync(args.reportFile, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  }
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);

  if (args.strict && !report.ok) {
    process.exit(1);
  }
}

try {
  main();
} catch (error) {
  process.stderr.write(`workflow-preflight failed: ${error.message}\n`);
  process.exit(1);
}
