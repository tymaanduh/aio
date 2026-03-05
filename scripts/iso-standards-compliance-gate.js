#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { findProjectRoot } = require("./project-source-resolver");
const { writeTextFileRobust } = require("./lib/robust-file-write");

const DEFAULT_ISO_TRACEABILITY_FILE = path.join(
  "data",
  "input",
  "shared",
  "main",
  "iso_standards_traceability_catalog.json"
);
const DEFAULT_REPORT_FILE = path.join(
  "data",
  "output",
  "databases",
  "polyglot-default",
  "analysis",
  "iso_standards_compliance_checklist.json"
);
const DEFAULT_MARKDOWN_FILE = path.join(
  "data",
  "output",
  "databases",
  "polyglot-default",
  "analysis",
  "iso_standards_compliance_checklist.md"
);

const DOMAIN_EVIDENCE_INDEX = Object.freeze({
  governance: Object.freeze([
    { path: "data/input/shared/main/hard_governance_ruleset.json", required: true },
    { path: "scripts/hard-governance-gate.js", required: true },
    { path: "data/output/databases/polyglot-default/analysis/hard_governance_report.json", required: false }
  ]),
  lifecycle: Object.freeze([
    { path: "scripts/general-workflow.js", required: true },
    { path: "scripts/workflow-preflight.js", required: true },
    { path: "data/output/databases/polyglot-default/context/run_state.json", required: false }
  ]),
  architecture: Object.freeze([
    { path: "data/output/databases/polyglot-default/plan/future_blueprint.md", required: false },
    { path: "data/output/databases/polyglot-default/plan/hierarchy_order.md", required: false },
    { path: "data/input/shared/main/polyglot_engineering_standards_catalog.json", required: true },
    { path: "data/input/shared/main/rendering_runtime_policy_catalog.json", required: true },
    { path: "data/input/shared/main/search_strategy_routing_catalog.json", required: true },
    { path: "data/input/shared/main/memory_data_lifecycle_policy_catalog.json", required: true }
  ]),
  requirements: Object.freeze([
    { path: "data/input/shared/main/polyglot_contract_catalog.json", required: true },
    { path: "data/input/shared/wrapper/function_contracts.json", required: true }
  ]),
  quality: Object.freeze([
    { path: "scripts/standards-baseline-gate.js", required: true },
    { path: "data/input/shared/main/executive_engineering_baseline.json", required: true },
    { path: "data/output/databases/polyglot-default/analysis/standards_baseline_report.json", required: false }
  ]),
  measurement: Object.freeze([
    { path: "scripts/polyglot-runtime-benchmark.js", required: true },
    { path: "data/input/shared/wrapper/runtime_benchmark_cases.json", required: true },
    { path: "data/output/databases/polyglot-default/reports/polyglot_runtime_benchmark_report.json", required: false }
  ]),
  testing: Object.freeze([
    { path: "tests/standards_baseline_gate.test.js", required: true },
    { path: "tests/polyglot_runtime_benchmark.test.js", required: true },
    { path: "package.json", required: true }
  ]),
  security: Object.freeze([
    { path: "scripts/hard-governance-gate.js", required: true },
    { path: "data/input/shared/main/hard_governance_ruleset.json", required: true },
    { path: "data/input/shared/main/polyglot_engineering_standards_catalog.json", required: true }
  ]),
  supply_chain: Object.freeze([
    { path: "data/input/shared/main/polyglot_engineering_standards_catalog.json", required: true },
    { path: "README.md", required: true }
  ]),
  usability_accessibility: Object.freeze([
    { path: "data/input/shared/main/ui_ux_blueprint_catalog.json", required: true },
    { path: "data/input/shared/main/ui_component_blueprint_catalog.json", required: true },
    { path: "scripts/generate-uiux-blueprint.js", required: true },
    { path: "data/output/databases/polyglot-default/analysis/uiux_blueprint_report.json", required: false }
  ]),
  ai_extension: Object.freeze([
    { path: "data/input/shared/main/iso_standards_traceability_catalog.json", required: true },
    { path: "data/input/shared/main/ai_automation_safety_speech_catalog.json", required: true },
    { path: "to-do/skills/agent_workflows.json", required: true },
    { path: "data/output/databases/polyglot-default/plan/automation_roadmap.md", required: false }
  ])
});

function parseArgs(argv) {
  const args = {
    strict: !argv.includes("--no-strict"),
    enforce: argv.includes("--enforce"),
    check: argv.includes("--check"),
    isoTraceabilityFile: "",
    reportFile: "",
    markdownFile: ""
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--iso-traceability-file" && argv[index + 1]) {
      args.isoTraceabilityFile = String(argv[index + 1]).trim();
      index += 1;
      continue;
    }
    if (token === "--report-file" && argv[index + 1]) {
      args.reportFile = String(argv[index + 1]).trim();
      index += 1;
      continue;
    }
    if (token === "--markdown-file" && argv[index + 1]) {
      args.markdownFile = String(argv[index + 1]).trim();
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

function issue(level, type, detail, extra = {}) {
  return {
    level,
    type,
    detail,
    ...extra
  };
}

function getStatusFieldName(standardRow) {
  if (!standardRow || typeof standardRow !== "object") {
    return "";
  }
  const key = Object.keys(standardRow).find((entry) => String(entry).startsWith("status_on_"));
  return normalizeText(key);
}

function evaluateEvidenceLinks(root, domain) {
  const entries = Array.isArray(DOMAIN_EVIDENCE_INDEX[domain]) ? DOMAIN_EVIDENCE_INDEX[domain] : [];
  return entries.map((entry) => {
    const relPath = normalizeText(entry.path).replace(/\\/g, "/");
    const absolute = path.resolve(root, relPath);
    const exists = fs.existsSync(absolute);
    return {
      path: relPath,
      required: entry.required === true,
      exists
    };
  });
}

function evaluateStandardRow(root, row, index, report) {
  const standardRef = normalizeText(row && row.standard_ref);
  const domain = normalizeText(row && row.domain).toLowerCase();
  const sourceUrl = normalizeText(row && row.source_url);
  const statusFieldName = getStatusFieldName(row);
  const statusValue = statusFieldName ? normalizeText(row[statusFieldName]) : "";
  const recommendedControls = Array.isArray(row && row.recommended_controls) ? row.recommended_controls : [];

  const checks = {
    standard_ref_present: Boolean(standardRef),
    domain_registered: Boolean(domain && DOMAIN_EVIDENCE_INDEX[domain]),
    source_url_valid: /^https?:\/\//i.test(sourceUrl),
    status_field_present: Boolean(statusFieldName && statusValue),
    recommended_controls_present: recommendedControls.length > 0
  };
  const evidenceLinks = checks.domain_registered ? evaluateEvidenceLinks(root, domain) : [];
  const requiredEvidenceMissing = evidenceLinks.filter((entry) => entry.required && !entry.exists);
  const optionalEvidenceMissing = evidenceLinks.filter((entry) => !entry.required && !entry.exists);
  checks.required_evidence_present = requiredEvidenceMissing.length === 0;

  const failedChecks = Object.entries(checks)
    .filter((entry) => entry[1] !== true)
    .map((entry) => entry[0]);
  const passed = failedChecks.length === 0;

  if (!checks.standard_ref_present) {
    report.issues.push(issue("error", "missing_standard_ref", "standard row is missing standard_ref", { index }));
  }
  if (!checks.domain_registered) {
    report.issues.push(
      issue("error", "unknown_standard_domain", "standard row domain is missing or unsupported", {
        index,
        domain
      })
    );
  }
  if (!checks.source_url_valid) {
    report.issues.push(
      issue("error", "invalid_standard_source_url", "standard row source_url must be an absolute http(s) url", {
        standard_ref: standardRef || `row_${index + 1}`,
        source_url: sourceUrl
      })
    );
  }
  if (!checks.status_field_present) {
    report.issues.push(
      issue("error", "missing_standard_status_field", "standard row is missing status_on_* field value", {
        standard_ref: standardRef || `row_${index + 1}`
      })
    );
  }
  if (!checks.recommended_controls_present) {
    report.issues.push(
      issue("error", "missing_recommended_controls", "standard row requires at least one recommended control", {
        standard_ref: standardRef || `row_${index + 1}`
      })
    );
  }
  requiredEvidenceMissing.forEach((entry) => {
    report.issues.push(
      issue("error", "missing_required_standard_evidence", "required evidence file is missing for standard domain", {
        standard_ref: standardRef || `row_${index + 1}`,
        domain,
        evidence_path: entry.path
      })
    );
  });
  optionalEvidenceMissing.forEach((entry) => {
    report.issues.push(
      issue("warn", "missing_optional_standard_evidence", "optional evidence file is missing for standard domain", {
        standard_ref: standardRef || `row_${index + 1}`,
        domain,
        evidence_path: entry.path
      })
    );
  });

  return {
    standard_ref: standardRef || `row_${index + 1}`,
    domain,
    source_url: sourceUrl,
    status_field: statusFieldName || "status_on_unknown",
    status_value: statusValue || "unknown",
    compliance_status: passed ? "PASS" : "FAIL",
    failed_checks: failedChecks,
    evidence_links: evidenceLinks
  };
}

function buildChecklistMarkdown(report) {
  const lines = [];
  lines.push("# ISO Standards Compliance Checklist");
  lines.push("");
  lines.push(`- Generated At: ${report.generated_at}`);
  lines.push(`- Catalog: ${report.files.iso_traceability_catalog}`);
  lines.push(`- Total Standards: ${report.metrics.total_standards}`);
  lines.push(`- Pass: ${report.metrics.passed_standards}`);
  lines.push(`- Fail: ${report.metrics.failed_standards}`);
  lines.push("");
  lines.push("| Standard | Domain | Compliance | Evidence |");
  lines.push("| --- | --- | --- | --- |");

  report.checklist.forEach((row) => {
    const evidence = row.evidence_links
      .map((entry) => {
        const label = entry.exists ? "pass" : entry.required ? "fail" : "warn";
        return `[${label}:${entry.path}](${entry.path})`;
      })
      .join("<br>");
    lines.push(`| ${row.standard_ref} | ${row.domain} | ${row.compliance_status} | ${evidence} |`);
  });

  lines.push("");
  return lines.join("\n");
}

function buildRecommendations(report) {
  const recommendations = [];
  if (report.issues.some((entry) => entry.type === "missing_required_standard_evidence")) {
    recommendations.push("Restore missing required evidence files mapped by domain before gate enforcement.");
  }
  if (report.issues.some((entry) => entry.type === "unknown_standard_domain")) {
    recommendations.push("Map every ISO domain to deterministic evidence paths in DOMAIN_EVIDENCE_INDEX.");
  }
  if (report.issues.some((entry) => entry.type === "missing_optional_standard_evidence")) {
    recommendations.push("Generate optional report artifacts regularly to strengthen evidence traceability links.");
  }
  if (recommendations.length === 0) {
    recommendations.push("Keep ISO compliance checklist gate in enforce mode for governance and refactor flows.");
  }
  return recommendations;
}

function analyze(root, args = {}) {
  const isoCatalogPath = path.resolve(root, args.isoTraceabilityFile || DEFAULT_ISO_TRACEABILITY_FILE);
  const reportPath = path.resolve(root, args.reportFile || DEFAULT_REPORT_FILE);
  const markdownPath = path.resolve(root, args.markdownFile || DEFAULT_MARKDOWN_FILE);

  const report = {
    status: "pass",
    generated_at: new Date().toISOString(),
    root,
    files: {
      iso_traceability_catalog: normalizePath(root, isoCatalogPath)
    },
    outputs: {
      checklist_json: normalizePath(root, reportPath),
      checklist_markdown: normalizePath(root, markdownPath)
    },
    metrics: {
      total_standards: 0,
      passed_standards: 0,
      failed_standards: 0
    },
    issues: [],
    recommendations: [],
    checklist: []
  };

  if (!fs.existsSync(isoCatalogPath)) {
    report.issues.push(
      issue("error", "missing_iso_traceability_catalog", "iso standards traceability catalog file is missing", {
        file: normalizePath(root, isoCatalogPath)
      })
    );
    report.recommendations = buildRecommendations(report);
    report.status = "fail";
    return report;
  }

  let catalog = {};
  try {
    catalog = readJson(isoCatalogPath);
  } catch (error) {
    report.issues.push(
      issue("error", "invalid_iso_traceability_json", "iso standards traceability catalog is not valid JSON", {
        error: error.message
      })
    );
    report.recommendations = buildRecommendations(report);
    report.status = "fail";
    return report;
  }

  if (!Number.isFinite(Number(catalog.schema_version))) {
    report.issues.push(
      issue("error", "invalid_iso_traceability_schema_version", "schema_version must be numeric")
    );
  }

  const standards = Array.isArray(catalog.standards) ? catalog.standards : [];
  if (standards.length === 0) {
    report.issues.push(
      issue("error", "missing_iso_standards", "standards array must contain at least one standard row")
    );
  }

  report.checklist = standards.map((row, index) => evaluateStandardRow(root, row, index, report));
  report.metrics.total_standards = standards.length;
  report.metrics.passed_standards = report.checklist.filter((row) => row.compliance_status === "PASS").length;
  report.metrics.failed_standards = report.checklist.filter((row) => row.compliance_status === "FAIL").length;

  report.recommendations = buildRecommendations(report);
  report.status = report.issues.some((entry) => entry.level === "error") ? "fail" : "pass";
  return report;
}

function writeOutputs(root, args, report) {
  if (args.check) {
    return;
  }
  const reportPath = path.resolve(root, args.reportFile || DEFAULT_REPORT_FILE);
  const markdownPath = path.resolve(root, args.markdownFile || DEFAULT_MARKDOWN_FILE);
  writeTextFileRobust(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  writeTextFileRobust(markdownPath, buildChecklistMarkdown(report));
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const root = findProjectRoot(process.cwd());
  const report = analyze(root, args);
  writeOutputs(root, args, report);
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (args.strict && (args.enforce || args.check) && report.status !== "pass") {
    process.exit(1);
  }
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    process.stderr.write(`iso-standards-compliance-gate failed: ${error.message}\n`);
    process.exit(1);
  }
}

module.exports = {
  analyze,
  buildChecklistMarkdown
};

