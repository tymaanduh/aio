#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { findProjectRoot } = require("./project-source-resolver");

const DEFAULT_PIPELINE_FILE = path.join("data", "input", "shared", "main", "workflow_execution_pipeline.json");
const DEFAULT_BASELINE_FILE = path.join("data", "input", "shared", "main", "executive_engineering_baseline.json");
const DEFAULT_RULESET_FILE = path.join("data", "input", "shared", "main", "hard_governance_ruleset.json");
const DEFAULT_GENERAL_WORKFLOW_FILE = path.join("scripts", "general-workflow.js");
const DEFAULT_REPORT_FILE = path.join(
  "data",
  "output",
  "databases",
  "polyglot-default",
  "analysis",
  "workflow_pipeline_order_report.json"
);

const EXPECTED_STAGE_ORDER = Object.freeze([
  "preflight",
  "prune",
  "uiux_blueprint",
  "hard_governance",
  "agent_registry_validation",
  "wrapper_contract_gate",
  "efficiency_gate",
  "pipeline",
  "separation_audit",
  "output_format"
]);

const EXPECTED_GATE_ORDER = Object.freeze([
  "workflow:preflight",
  "workflow:order:gate",
  "contracts:validate",
  "standards:baseline:gate",
  "standards:iso:gate",
  "uiux:blueprint:check",
  "governance:hard:gate",
  "efficiency:gate",
  "refactor:gate"
]);

const GENERAL_WORKFLOW_ORDER_MARKERS = Object.freeze([
  "const preflightStage = runPreflightStage(args);",
  "const pruneStage = runPruneStage(args);",
  "const uiuxBlueprintStage = runUiuxBlueprintStage(args);",
  "const hardGovernanceStage = runHardGovernanceStage(args);",
  "const agentRegistryValidationStage = runAgentRegistryValidationStage(args);",
  "const wrapperContractStage = runWrapperContractStage(args);",
  "const efficiencyStage = runEfficiencyStage(args);",
  "const pipelineStage = runPipelineStage(args);",
  "const separationStage = runSeparationAuditStage(args);",
  "const outputFormatStage = runOutputFormatStage(args);"
]);

function parseArgs(argv) {
  const args = {
    strict: !argv.includes("--no-strict"),
    enforce: argv.includes("--enforce"),
    check: argv.includes("--check"),
    pipelineFile: "",
    baselineFile: "",
    rulesetFile: "",
    generalWorkflowFile: "",
    reportFile: ""
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--pipeline-file" && argv[index + 1]) {
      args.pipelineFile = String(argv[index + 1]).trim();
      index += 1;
      continue;
    }
    if (token === "--baseline-file" && argv[index + 1]) {
      args.baselineFile = String(argv[index + 1]).trim();
      index += 1;
      continue;
    }
    if (token === "--ruleset-file" && argv[index + 1]) {
      args.rulesetFile = String(argv[index + 1]).trim();
      index += 1;
      continue;
    }
    if (token === "--general-workflow-file" && argv[index + 1]) {
      args.generalWorkflowFile = String(argv[index + 1]).trim();
      index += 1;
      continue;
    }
    if (token === "--report-file" && argv[index + 1]) {
      args.reportFile = String(argv[index + 1]).trim();
      index += 1;
      continue;
    }
  }

  return args;
}

function normalizePath(root, absolutePath) {
  return String(path.relative(root, absolutePath)).replace(/\\/g, "/");
}

function normalizeText(value) {
  return String(value || "").trim();
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function ensureDirForFile(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function issue(level, type, detail, extra = {}) {
  return {
    level,
    type,
    detail,
    ...extra
  };
}

function validateUniqueList(values) {
  const source = Array.isArray(values) ? values : [];
  const seen = new Set();
  const duplicates = new Set();
  source.forEach((entry) => {
    const normalized = normalizeText(entry);
    if (!normalized) {
      return;
    }
    if (seen.has(normalized)) {
      duplicates.add(normalized);
      return;
    }
    seen.add(normalized);
  });
  return {
    unique_count: seen.size,
    duplicate_values: [...duplicates]
  };
}

function validateOrder(expected, actual) {
  const expectedList = Array.isArray(expected) ? expected : [];
  const actualList = Array.isArray(actual) ? actual.map((entry) => normalizeText(entry)) : [];
  const missing = expectedList.filter((entry) => !actualList.includes(entry));
  const indexMap = expectedList.map((entry) => ({
    value: entry,
    index: actualList.indexOf(entry)
  }));
  let orderValid = true;
  for (let index = 1; index < indexMap.length; index += 1) {
    const previous = indexMap[index - 1];
    const current = indexMap[index];
    if (previous.index < 0 || current.index < 0) {
      continue;
    }
    if (current.index < previous.index) {
      orderValid = false;
      break;
    }
  }
  return {
    missing,
    order_valid: orderValid,
    index_map: indexMap
  };
}

function validateGeneralWorkflowSource(generalWorkflowSource) {
  const markerIndexes = GENERAL_WORKFLOW_ORDER_MARKERS.map((entry) => ({
    marker: entry,
    index: generalWorkflowSource.indexOf(entry)
  }));
  const missingMarkers = markerIndexes.filter((entry) => entry.index < 0).map((entry) => entry.marker);
  let orderValid = true;
  for (let index = 1; index < markerIndexes.length; index += 1) {
    const previous = markerIndexes[index - 1];
    const current = markerIndexes[index];
    if (previous.index < 0 || current.index < 0) {
      continue;
    }
    if (current.index < previous.index) {
      orderValid = false;
      break;
    }
  }
  return {
    marker_count: markerIndexes.length,
    missing_markers: missingMarkers,
    order_valid: orderValid,
    markers: markerIndexes
  };
}

function analyze(root, args = {}) {
  const pipelinePath = path.resolve(root, args.pipelineFile || DEFAULT_PIPELINE_FILE);
  const baselinePath = path.resolve(root, args.baselineFile || DEFAULT_BASELINE_FILE);
  const rulesetPath = path.resolve(root, args.rulesetFile || DEFAULT_RULESET_FILE);
  const generalWorkflowPath = path.resolve(root, args.generalWorkflowFile || DEFAULT_GENERAL_WORKFLOW_FILE);

  const report = {
    status: "pass",
    generated_at: new Date().toISOString(),
    root,
    files: {
      workflow_pipeline: normalizePath(root, pipelinePath),
      baseline: normalizePath(root, baselinePath),
      ruleset: normalizePath(root, rulesetPath),
      general_workflow: normalizePath(root, generalWorkflowPath)
    },
    metrics: {
      stage_order_count: 0,
      stage_contract_count: 0,
      gate_order_count: 0,
      baseline_gate_order_count: 0,
      ruleset_required_script_count: 0,
      general_workflow_marker_count: 0
    },
    checks: {},
    issues: []
  };

  if (!fs.existsSync(pipelinePath)) {
    report.issues.push(issue("error", "missing_workflow_pipeline_file", "workflow execution pipeline file is missing"));
    report.status = "fail";
    return report;
  }
  if (!fs.existsSync(baselinePath)) {
    report.issues.push(issue("error", "missing_baseline_file", "executive engineering baseline file is missing"));
    report.status = "fail";
    return report;
  }
  if (!fs.existsSync(rulesetPath)) {
    report.issues.push(issue("error", "missing_ruleset_file", "hard governance ruleset file is missing"));
    report.status = "fail";
    return report;
  }
  if (!fs.existsSync(generalWorkflowPath)) {
    report.issues.push(issue("error", "missing_general_workflow_file", "general workflow script file is missing"));
    report.status = "fail";
    return report;
  }

  let pipelineDoc = {};
  let baselineDoc = {};
  let rulesetDoc = {};
  try {
    pipelineDoc = readJson(pipelinePath);
  } catch (error) {
    report.issues.push(issue("error", "invalid_workflow_pipeline_json", "workflow execution pipeline is invalid json", { error: error.message }));
  }
  try {
    baselineDoc = readJson(baselinePath);
  } catch (error) {
    report.issues.push(issue("error", "invalid_baseline_json", "baseline file is invalid json", { error: error.message }));
  }
  try {
    rulesetDoc = readJson(rulesetPath);
  } catch (error) {
    report.issues.push(issue("error", "invalid_ruleset_json", "ruleset file is invalid json", { error: error.message }));
  }
  if (report.issues.some((entry) => entry.level === "error")) {
    report.status = "fail";
    return report;
  }

  const stageOrder = Array.isArray(pipelineDoc.general_workflow_stage_order) ? pipelineDoc.general_workflow_stage_order : [];
  const stageContracts = Array.isArray(pipelineDoc.stage_contracts) ? pipelineDoc.stage_contracts : [];
  const gateOrder = Array.isArray(pipelineDoc.gate_pipeline_order) ? pipelineDoc.gate_pipeline_order : [];
  const baselineGateOrder =
    baselineDoc &&
    baselineDoc.workflow_policy &&
    Array.isArray(baselineDoc.workflow_policy.required_gate_order)
      ? baselineDoc.workflow_policy.required_gate_order
      : [];
  const rulesetRequiredScripts =
    rulesetDoc &&
    rulesetDoc.workflow &&
    Array.isArray(rulesetDoc.workflow.required_npm_scripts)
      ? rulesetDoc.workflow.required_npm_scripts
      : [];

  report.metrics.stage_order_count = stageOrder.length;
  report.metrics.stage_contract_count = stageContracts.length;
  report.metrics.gate_order_count = gateOrder.length;
  report.metrics.baseline_gate_order_count = baselineGateOrder.length;
  report.metrics.ruleset_required_script_count = rulesetRequiredScripts.length;

  const stageUniqueness = validateUniqueList(stageOrder);
  const gateUniqueness = validateUniqueList(gateOrder);
  const stageOrderValidation = validateOrder(EXPECTED_STAGE_ORDER, stageOrder);
  const gateOrderValidation = validateOrder(EXPECTED_GATE_ORDER, gateOrder);
  const baselineGateValidation = validateOrder(EXPECTED_GATE_ORDER, baselineGateOrder);

  report.checks.stage_uniqueness = stageUniqueness;
  report.checks.gate_uniqueness = gateUniqueness;
  report.checks.stage_order = stageOrderValidation;
  report.checks.gate_order = gateOrderValidation;
  report.checks.baseline_gate_order = baselineGateValidation;

  if (!Number.isFinite(Number(pipelineDoc.schema_version))) {
    report.issues.push(issue("error", "invalid_workflow_pipeline_schema_version", "workflow execution pipeline schema_version must be numeric"));
  }
  if (stageContracts.length !== stageOrder.length) {
    report.issues.push(
      issue("error", "stage_contract_count_mismatch", "stage_contracts count must match general_workflow_stage_order count", {
        stage_contract_count: stageContracts.length,
        stage_order_count: stageOrder.length
      })
    );
  }
  if (stageUniqueness.duplicate_values.length > 0) {
    report.issues.push(
      issue("error", "duplicate_workflow_stage_ids", "general_workflow_stage_order contains duplicate stages", {
        duplicates: stageUniqueness.duplicate_values
      })
    );
  }
  if (gateUniqueness.duplicate_values.length > 0) {
    report.issues.push(
      issue("error", "duplicate_gate_stage_ids", "gate_pipeline_order contains duplicate scripts", {
        duplicates: gateUniqueness.duplicate_values
      })
    );
  }
  if (stageOrderValidation.missing.length > 0) {
    report.issues.push(
      issue("error", "missing_expected_workflow_stages", "general_workflow_stage_order is missing expected stages", {
        missing: stageOrderValidation.missing
      })
    );
  }
  if (!stageOrderValidation.order_valid) {
    report.issues.push(
      issue("error", "workflow_stage_order_invalid", "general workflow stage order is not in the canonical sequence")
    );
  }
  if (gateOrderValidation.missing.length > 0) {
    report.issues.push(
      issue("error", "missing_expected_gate_stages", "gate_pipeline_order is missing expected scripts", {
        missing: gateOrderValidation.missing
      })
    );
  }
  if (!gateOrderValidation.order_valid) {
    report.issues.push(issue("error", "gate_pipeline_order_invalid", "gate pipeline order is not in canonical sequence"));
  }
  if (baselineGateValidation.missing.length > 0) {
    report.issues.push(
      issue("error", "baseline_missing_gate_stages", "baseline required_gate_order is missing expected scripts", {
        missing: baselineGateValidation.missing
      })
    );
  }
  if (!baselineGateValidation.order_valid) {
    report.issues.push(
      issue("error", "baseline_gate_order_invalid", "baseline required_gate_order is not in canonical sequence")
    );
  }

  EXPECTED_GATE_ORDER.forEach((scriptName) => {
    if (!rulesetRequiredScripts.includes(scriptName)) {
      report.issues.push(
        issue("error", "ruleset_missing_required_script", "hard governance ruleset is missing required workflow script", {
          script: scriptName
        })
      );
    }
  });

  const generalWorkflowSource = fs.readFileSync(generalWorkflowPath, "utf8");
  const generalWorkflowOrderValidation = validateGeneralWorkflowSource(generalWorkflowSource);
  report.metrics.general_workflow_marker_count = generalWorkflowOrderValidation.marker_count;
  report.checks.general_workflow_source_order = generalWorkflowOrderValidation;
  if (generalWorkflowOrderValidation.missing_markers.length > 0) {
    report.issues.push(
      issue("error", "general_workflow_missing_stage_markers", "general-workflow.js is missing stage invocation markers", {
        missing_markers: generalWorkflowOrderValidation.missing_markers
      })
    );
  }
  if (!generalWorkflowOrderValidation.order_valid) {
    report.issues.push(
      issue("error", "general_workflow_stage_invocation_order_invalid", "general-workflow.js stage invocation order is invalid")
    );
  }

  report.status = report.issues.some((entry) => entry.level === "error") ? "fail" : "pass";
  return report;
}

function writeReport(root, args, report) {
  if (args.check) {
    return;
  }
  const reportPath = path.resolve(root, args.reportFile || DEFAULT_REPORT_FILE);
  ensureDirForFile(reportPath);
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const root = findProjectRoot(process.cwd());
  const report = analyze(root, args);
  writeReport(root, args, report);
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (args.strict && (args.enforce || args.check) && report.status !== "pass") {
    process.exit(1);
  }
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    process.stderr.write(`validate-workflow-pipeline-order failed: ${error.message}\n`);
    process.exit(1);
  }
}

module.exports = {
  analyze,
  validateOrder
};
