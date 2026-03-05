#!/usr/bin/env node
"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");
const yaml = require("js-yaml");
const { findProjectRoot } = require("./project-source-resolver");
const { writeTextFileRobust } = require("./lib/robust-file-write");
const { readRoutingPolicy } = require("./lib/routing-policy");
const { analyze: analyzeStandardsBaseline } = require("./standards-baseline-gate");
const { analyze: analyzeIsoStandardsCompliance } = require("./iso-standards-compliance-gate");
const { analyze: analyzeUiuxBlueprint } = require("./generate-uiux-blueprint");
const { analyze: analyzeWorkflowPipelineOrder } = require("./validate-workflow-pipeline-order");

const DEFAULT_RULESET_FILE = path.join("data", "input", "shared", "main", "hard_governance_ruleset.json");
const DEFAULT_REPORT_FILE = path.join(
  "data",
  "output",
  "databases",
  "polyglot-default",
  "analysis",
  "hard_governance_report.json"
);
const DEFAULT_ROADMAP_FILE = path.join(
  "data",
  "output",
  "databases",
  "polyglot-default",
  "plan",
  "automation_roadmap.md"
);
const DEFAULT_BLUEPRINT_FILE = path.join(
  "data",
  "output",
  "databases",
  "polyglot-default",
  "plan",
  "future_blueprint.md"
);

function parseArgs(argv) {
  const args = {
    strict: !argv.includes("--no-strict"),
    enforce: argv.includes("--enforce"),
    check: argv.includes("--check"),
    codexHome: "",
    rulesetFile: "",
    reportFile: "",
    roadmapFile: "",
    blueprintFile: ""
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--codex-home" && argv[index + 1]) {
      args.codexHome = String(argv[index + 1]).trim();
      index += 1;
      continue;
    }
    if (token === "--ruleset-file" && argv[index + 1]) {
      args.rulesetFile = String(argv[index + 1]).trim();
      index += 1;
      continue;
    }
    if (token === "--report-file" && argv[index + 1]) {
      args.reportFile = String(argv[index + 1]).trim();
      index += 1;
      continue;
    }
    if (token === "--roadmap-file" && argv[index + 1]) {
      args.roadmapFile = String(argv[index + 1]).trim();
      index += 1;
      continue;
    }
    if (token === "--blueprint-file" && argv[index + 1]) {
      args.blueprintFile = String(argv[index + 1]).trim();
      index += 1;
      continue;
    }
  }
  return args;
}

function normalizeText(value) {
  return String(value || "").trim();
}

function normalizePathForOutput(root, absolutePath) {
  return String(path.relative(root, absolutePath)).replace(/\\/g, "/");
}

function issue(level, type, detail, extra = {}) {
  return {
    level,
    type,
    detail,
    ...extra
  };
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function readYaml(filePath) {
  return yaml.load(fs.readFileSync(filePath, "utf8"));
}

function estimateTokens(text) {
  return Math.max(1, Math.ceil(String(text || "").length / 4));
}

function parseRRule(rrule) {
  const parts = {};
  String(rrule || "")
    .split(";")
    .forEach((entry) => {
      const [rawKey, rawValue] = String(entry || "").split("=");
      const key = normalizeText(rawKey).toUpperCase();
      const value = normalizeText(rawValue);
      if (key && value) {
        parts[key] = value;
      }
    });

  const days = parts.BYDAY
    ? parts.BYDAY.split(",").map((day) => normalizeText(day).toUpperCase()).filter(Boolean)
    : ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];

  const hours = parts.BYHOUR
    ? parts.BYHOUR.split(",").map((item) => Number(item)).filter((item) => Number.isFinite(item))
    : [];

  return {
    freq: normalizeText(parts.FREQ).toUpperCase(),
    days,
    hours
  };
}

function readAutomations(codexHome) {
  const automationsRoot = path.join(codexHome, "automations");
  const rows = [];
  if (!fs.existsSync(automationsRoot)) {
    return {
      root: automationsRoot,
      rows,
      exists: false
    };
  }
  const dirs = fs.readdirSync(automationsRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory());
  dirs.forEach((entry) => {
    const id = entry.name;
    const tomlPath = path.join(automationsRoot, id, "automation.toml");
    if (!fs.existsSync(tomlPath)) {
      return;
    }
    const source = fs.readFileSync(tomlPath, "utf8");
    const nameMatch = source.match(/^name\s*=\s*"([^"]*)"/m);
    const statusMatch = source.match(/^status\s*=\s*"([^"]*)"/m);
    const promptMatch = source.match(/^prompt\s*=\s*"([^"]*)"/m);
    const rruleMatch = source.match(/^rrule\s*=\s*"([^"]*)"/m);
    const name = nameMatch ? nameMatch[1] : "";
    const status = statusMatch ? statusMatch[1] : "";
    const prompt = promptMatch ? promptMatch[1] : "";
    const rrule = rruleMatch ? rruleMatch[1] : "";
    rows.push({
      id,
      name,
      status,
      prompt,
      rrule,
      prompt_tokens_estimate: estimateTokens(prompt),
      parsed_rrule: parseRRule(rrule)
    });
  });
  return {
    root: automationsRoot,
    rows,
    exists: true
  };
}

function analyzeRouting(routingDoc, ruleset, report) {
  const routing = routingDoc && typeof routingDoc === "object" ? routingDoc : {};
  const keywordRules = Array.isArray(routing.keyword_rules) ? routing.keyword_rules : [];
  const keywordToRule = new Map();
  const signatureToRules = new Map();
  let duplicateKeywordCount = 0;

  keywordRules.forEach((rule, ruleIndex) => {
    const skills = Array.isArray(rule && rule.skills) ? rule.skills.map((item) => normalizeText(item)).filter(Boolean) : [];
    const signature = [...skills].sort().join("|");
    if (!signatureToRules.has(signature)) {
      signatureToRules.set(signature, []);
    }
    signatureToRules.get(signature).push(ruleIndex);

    const keywords = Array.isArray(rule && rule.keywords)
      ? rule.keywords.map((item) => normalizeText(item).toLowerCase()).filter(Boolean)
      : [];
    keywords.forEach((keyword) => {
      const existing = keywordToRule.get(keyword);
      if (!existing) {
        keywordToRule.set(keyword, {
          signature,
          rule_index: ruleIndex
        });
        return;
      }
      duplicateKeywordCount += 1;
      if (ruleset.routing && ruleset.routing.forbid_keyword_collisions && existing.signature !== signature) {
        report.issues.push(
          issue("error", "routing_keyword_collision", "keyword maps to different skill stacks", {
            keyword,
            first_rule_index: existing.rule_index,
            second_rule_index: ruleIndex
          })
        );
        return;
      }
      if (ruleset.routing && ruleset.routing.warn_on_redundant_keyword_rules) {
        report.issues.push(
          issue("warn", "routing_redundant_keyword", "keyword repeats with equivalent skill stack", {
            keyword,
            first_rule_index: existing.rule_index,
            second_rule_index: ruleIndex
          })
        );
      }
    });
  });

  if (ruleset.routing && ruleset.routing.warn_on_duplicate_skill_stacks) {
    signatureToRules.forEach((ruleIndexes, signature) => {
      if (!signature || ruleIndexes.length <= 1) {
        return;
      }
      report.issues.push(
        issue("warn", "routing_duplicate_skill_stack", "multiple keyword rules share identical skill stack", {
          rule_indexes: ruleIndexes,
          skill_stack_signature: signature
        })
      );
    });
  }

  report.metrics.routing = {
    keyword_rules: keywordRules.length,
    duplicate_keywords: duplicateKeywordCount
  };
}

function analyzeAgents(workflowDoc, registryDoc, ruleset, report) {
  const doc = workflowDoc && typeof workflowDoc === "object" ? workflowDoc : {};
  const agents = Array.isArray(doc.agents) ? doc.agents : [];
  const seenIds = new Set();
  let missingHardGate = 0;

  agents.forEach((agent, index) => {
    const agentId = normalizeText(agent && agent.id);
    if (!agentId) {
      report.issues.push(issue("error", "missing_agent_id", "agent_workflows entry is missing id", { index }));
      return;
    }
    if (seenIds.has(agentId)) {
      report.issues.push(issue("error", "duplicate_agent_id", "duplicate agent id in workflow metadata", { agent_id: agentId }));
    }
    seenIds.add(agentId);

    const blockingChecks = Array.isArray(agent && agent.blocking_checks)
      ? agent.blocking_checks.map((item) => normalizeText(item)).filter(Boolean)
      : [];
    if (ruleset.agents && ruleset.agents.require_blocking_checks && blockingChecks.length === 0) {
      report.issues.push(
        issue("error", "missing_blocking_checks", "agent is missing blocking checks", { agent_id: agentId })
      );
    }
    if (ruleset.agents && ruleset.agents.require_hard_governance_gate) {
      const hasGate = blockingChecks.some((entry) => /hard governance gate|governance:hard:gate|automation governance/i.test(entry));
      if (!hasGate) {
        missingHardGate += 1;
        report.issues.push(
          issue("error", "missing_hard_governance_gate_check", "agent blocking checks missing hard governance gate", {
            agent_id: agentId
          })
        );
      }
    }

    const workflowLines = Array.isArray(agent && agent.workflow)
      ? agent.workflow.map((item) => normalizeText(item)).filter(Boolean)
      : [];
    const uniqueWorkflowLines = new Set(workflowLines.map((item) => item.toLowerCase()));
    if (workflowLines.length !== uniqueWorkflowLines.size) {
      report.issues.push(
        issue("warn", "duplicate_agent_workflow_lines", "agent workflow contains repeated lines", {
          agent_id: agentId
        })
      );
    }
  });

  const registry = registryDoc && typeof registryDoc === "object" ? registryDoc : {};
  const projectScope =
    registry.project_scope && typeof registry.project_scope === "object" ? registry.project_scope : {};
  const expectedProjectId = normalizeText(ruleset.project_scope && ruleset.project_scope.project_id);
  const expectedProjectName = normalizeText(ruleset.project_scope && ruleset.project_scope.project_name);
  if (expectedProjectId && normalizeText(projectScope.project_id) !== expectedProjectId) {
    report.issues.push(
      issue("error", "registry_project_id_mismatch", "agents registry project_scope.project_id mismatch", {
        expected: expectedProjectId,
        actual: normalizeText(projectScope.project_id)
      })
    );
  }
  if (expectedProjectName && normalizeText(projectScope.project_name) !== expectedProjectName) {
    report.issues.push(
      issue("error", "registry_project_name_mismatch", "agents registry project_scope.project_name mismatch", {
        expected: expectedProjectName,
        actual: normalizeText(projectScope.project_name)
      })
    );
  }

  report.metrics.agents = {
    total: agents.length,
    missing_hard_gate_checks: missingHardGate
  };
}

function analyzeAutomations(automationData, ruleset, report) {
  if (!automationData.exists) {
    report.issues.push(
      issue("warn", "automation_root_missing", "codex automations root is missing; automation checks skipped", {
        root: automationData.root
      })
    );
    report.metrics.automations = {
      total: 0,
      active: 0,
      duplicate_signatures: 0
    };
    return;
  }

  const rows = Array.isArray(automationData.rows) ? automationData.rows : [];
  const active = rows.filter((row) => normalizeText(row.status).toUpperCase() === "ACTIVE");
  const duplicateMap = new Map();
  const dayCoverage = new Map();
  const requiredDays = Array.isArray(ruleset.automation && ruleset.automation.required_days)
    ? ruleset.automation.required_days.map((item) => normalizeText(item).toUpperCase()).filter(Boolean)
    : [];
  const requiredHours = Array.isArray(ruleset.automation && ruleset.automation.required_hours)
    ? ruleset.automation.required_hours.map((item) => Number(item)).filter((item) => Number.isFinite(item))
    : [];
  requiredDays.forEach((day) => {
    dayCoverage.set(day, new Set());
  });

  let duplicateSignatures = 0;
  active.forEach((row) => {
    const signature = `${normalizeText(row.name).toLowerCase()}|${normalizeText(row.rrule)}|${normalizeText(row.prompt)}`;
    if (!duplicateMap.has(signature)) {
      duplicateMap.set(signature, []);
    }
    duplicateMap.get(signature).push(row.id);

    if (ruleset.automation && ruleset.automation.require_command_first_prompt && !/^Run\s+/i.test(normalizeText(row.prompt))) {
      report.issues.push(
        issue("error", "automation_prompt_not_command_first", "active automation prompt must start with 'Run'", {
          id: row.id
        })
      );
    }

    const maxPromptTokens = Number(ruleset.automation && ruleset.automation.max_prompt_tokens);
    if (Number.isFinite(maxPromptTokens) && row.prompt_tokens_estimate > maxPromptTokens) {
      report.issues.push(
        issue("error", "automation_prompt_budget_exceeded", "active automation prompt exceeds token budget", {
          id: row.id,
          prompt_tokens_estimate: row.prompt_tokens_estimate,
          max_prompt_tokens: maxPromptTokens
        })
      );
    }

    const parsedDays = Array.isArray(row.parsed_rrule.days) && row.parsed_rrule.days.length > 0 ? row.parsed_rrule.days : requiredDays;
    const parsedHours = Array.isArray(row.parsed_rrule.hours) ? row.parsed_rrule.hours : [];
    parsedDays.forEach((day) => {
      if (!dayCoverage.has(day)) {
        dayCoverage.set(day, new Set());
      }
      parsedHours.forEach((hour) => {
        dayCoverage.get(day).add(hour);
      });
    });
  });

  duplicateMap.forEach((ids) => {
    if (ids.length <= 1) {
      return;
    }
    duplicateSignatures += 1;
    report.issues.push(
      issue("error", "duplicate_automation_signature", "automation has duplicate name/rrule/prompt signature", {
        ids
      })
    );
  });

  const minActive = Number(ruleset.automation && ruleset.automation.min_active_automations);
  if (Number.isFinite(minActive) && active.length < minActive) {
    report.issues.push(
      issue("error", "insufficient_active_automations", "active automation count is below minimum", {
        active_count: active.length,
        min_active_automations: minActive
      })
    );
  }

  requiredDays.forEach((day) => {
    const coverageHours = dayCoverage.get(day) || new Set();
    requiredHours.forEach((hour) => {
      if (!coverageHours.has(hour)) {
        report.issues.push(
          issue("error", "automation_schedule_gap", "required schedule slot is not covered", {
            day,
            hour
          })
        );
      }
    });
  });

  report.metrics.automations = {
    total: rows.length,
    active: active.length,
    duplicate_signatures: duplicateSignatures
  };
}

function checkRequiredWorkflowScripts(packageJson, ruleset, report) {
  const scripts = packageJson && packageJson.scripts && typeof packageJson.scripts === "object" ? packageJson.scripts : {};
  const required = Array.isArray(ruleset.workflow && ruleset.workflow.required_npm_scripts)
    ? ruleset.workflow.required_npm_scripts
    : [];
  required.forEach((scriptName) => {
    if (!scripts[scriptName]) {
      report.issues.push(
        issue("error", "missing_required_npm_script", "required npm script is missing", {
          script: scriptName
        })
      );
    }
  });
}

function checkRequiredStandardsCatalogs(root, ruleset, report) {
  const requiredCatalogs = Array.isArray(ruleset.standards && ruleset.standards.required_catalogs)
    ? ruleset.standards.required_catalogs.map((item) => normalizeText(item)).filter(Boolean)
    : [];
  requiredCatalogs.forEach((catalogPath) => {
    const absolute = path.resolve(root, catalogPath);
    if (!fs.existsSync(absolute)) {
      report.issues.push(
        issue("error", "missing_required_standards_catalog", "required standards catalog is missing", {
          catalog: catalogPath
        })
      );
      return;
    }
    try {
      JSON.parse(fs.readFileSync(absolute, "utf8"));
    } catch (error) {
      report.issues.push(
        issue("error", "invalid_required_standards_catalog", "required standards catalog is not valid json", {
          catalog: catalogPath,
          error: error.message
        })
      );
    }
  });
}

function runStandardsBaselineSubcheck(root, ruleset, report) {
  const standards = ruleset.standards && typeof ruleset.standards === "object" ? ruleset.standards : {};
  const baselineReport = analyzeStandardsBaseline(root, {
    check: true,
    baselineFile: normalizeText(standards.baseline_catalog) || "data/input/shared/main/executive_engineering_baseline.json",
    standardsFile:
      normalizeText(standards.engineering_standards_catalog) ||
      "data/input/shared/main/polyglot_engineering_standards_catalog.json",
    isoTraceabilityFile:
      normalizeText(standards.iso_traceability_catalog) ||
      "data/input/shared/main/iso_standards_traceability_catalog.json",
    uiuxCatalogFile:
      normalizeText(standards.ui_ux_blueprint_catalog) || "data/input/shared/main/ui_ux_blueprint_catalog.json"
  });

  const baselineErrors = Array.isArray(baselineReport.issues)
    ? baselineReport.issues.filter((entry) => entry.level === "error")
    : [];
  const baselineWarnings = Array.isArray(baselineReport.issues)
    ? baselineReport.issues.filter((entry) => entry.level === "warn")
    : [];

  report.metrics.standards_baseline = {
    status: baselineReport.status,
    errors: baselineErrors.length,
    warnings: baselineWarnings.length,
    report_file: "data/output/databases/polyglot-default/analysis/standards_baseline_report.json"
  };

  if (baselineReport.status !== "pass") {
    report.issues.push(
      issue(
        "error",
        "standards_baseline_gate_failed",
        "standards baseline gate did not pass; resolve naming/storage/optimization issues",
        {
          error_count: baselineErrors.length,
          warning_count: baselineWarnings.length
        }
      )
    );
  } else if (baselineWarnings.length > 0) {
    report.issues.push(
      issue("warn", "standards_baseline_gate_warnings", "standards baseline gate passed with warnings", {
        warning_count: baselineWarnings.length
      })
    );
  }
}

function runWorkflowPipelineOrderSubcheck(root, report) {
  const workflowOrderReport = analyzeWorkflowPipelineOrder(root, {
    check: true
  });
  const orderErrors = Array.isArray(workflowOrderReport.issues)
    ? workflowOrderReport.issues.filter((entry) => entry.level === "error")
    : [];
  const orderWarnings = Array.isArray(workflowOrderReport.issues)
    ? workflowOrderReport.issues.filter((entry) => entry.level === "warn")
    : [];

  report.metrics.workflow_pipeline_order = {
    status: workflowOrderReport.status,
    errors: orderErrors.length,
    warnings: orderWarnings.length,
    report_file: "data/output/databases/polyglot-default/analysis/workflow_pipeline_order_report.json"
  };

  if (workflowOrderReport.status !== "pass") {
    report.issues.push(
      issue("error", "workflow_pipeline_order_gate_failed", "workflow pipeline order gate did not pass", {
        error_count: orderErrors.length,
        warning_count: orderWarnings.length
      })
    );
    return;
  }

  if (orderWarnings.length > 0) {
    report.issues.push(
      issue("warn", "workflow_pipeline_order_gate_warnings", "workflow pipeline order gate passed with warnings", {
        warning_count: orderWarnings.length
      })
    );
  }
}

function runIsoStandardsComplianceSubcheck(root, ruleset, report) {
  const standards = ruleset.standards && typeof ruleset.standards === "object" ? ruleset.standards : {};
  const isoComplianceReport = analyzeIsoStandardsCompliance(root, {
    check: true,
    isoTraceabilityFile:
      normalizeText(standards.iso_traceability_catalog) ||
      "data/input/shared/main/iso_standards_traceability_catalog.json"
  });

  const isoErrors = Array.isArray(isoComplianceReport.issues)
    ? isoComplianceReport.issues.filter((entry) => entry.level === "error")
    : [];
  const isoWarnings = Array.isArray(isoComplianceReport.issues)
    ? isoComplianceReport.issues.filter((entry) => entry.level === "warn")
    : [];

  report.metrics.iso_standards_compliance = {
    status: isoComplianceReport.status,
    errors: isoErrors.length,
    warnings: isoWarnings.length,
    total_standards: Number(isoComplianceReport.metrics && isoComplianceReport.metrics.total_standards) || 0,
    passed_standards: Number(isoComplianceReport.metrics && isoComplianceReport.metrics.passed_standards) || 0,
    failed_standards: Number(isoComplianceReport.metrics && isoComplianceReport.metrics.failed_standards) || 0,
    report_file: "data/output/databases/polyglot-default/analysis/iso_standards_compliance_checklist.json",
    checklist_markdown_file: "data/output/databases/polyglot-default/analysis/iso_standards_compliance_checklist.md"
  };

  if (isoComplianceReport.status !== "pass") {
    report.issues.push(
      issue("error", "iso_standards_compliance_gate_failed", "iso standards compliance gate did not pass", {
        error_count: isoErrors.length,
        warning_count: isoWarnings.length
      })
    );
    return;
  }

  if (isoWarnings.length > 0) {
    report.issues.push(
      issue("warn", "iso_standards_compliance_gate_warnings", "iso standards compliance gate passed with warnings", {
        warning_count: isoWarnings.length
      })
    );
  }
}

function runUiuxBlueprintSubcheck(root, ruleset, report) {
  const standards = ruleset.standards && typeof ruleset.standards === "object" ? ruleset.standards : {};
  const uiuxReport = analyzeUiuxBlueprint(root, {
    check: true,
    catalogFile: normalizeText(standards.ui_ux_blueprint_catalog) || "data/input/shared/main/ui_ux_blueprint_catalog.json",
    researchFile:
      normalizeText(standards.ui_ux_research_file) ||
      "data/output/databases/polyglot-default/research/ui_ux_psychology_ergonomics_research_2026-03-05.md"
  });

  const uiuxErrors = Array.isArray(uiuxReport.issues)
    ? uiuxReport.issues.filter((entry) => entry.level === "error")
    : [];
  const uiuxWarnings = Array.isArray(uiuxReport.issues)
    ? uiuxReport.issues.filter((entry) => entry.level === "warn")
    : [];

  report.metrics.ui_ux_blueprint = {
    status: uiuxReport.status,
    errors: uiuxErrors.length,
    warnings: uiuxWarnings.length,
    report_file: "data/output/databases/polyglot-default/analysis/uiux_blueprint_report.json",
    blueprint_file: "data/output/databases/polyglot-default/plan/ui_ux_blueprint.md"
  };

  if (uiuxReport.status !== "pass") {
    report.issues.push(
      issue("error", "uiux_blueprint_gate_failed", "ui ux blueprint gate did not pass", {
        error_count: uiuxErrors.length,
        warning_count: uiuxWarnings.length
      })
    );
    return;
  }

  if (uiuxWarnings.length > 0) {
    report.issues.push(
      issue("warn", "uiux_blueprint_gate_warnings", "ui ux blueprint gate passed with warnings", {
        warning_count: uiuxWarnings.length
      })
    );
  }
}

function buildSuggestions(report) {
  const errors = report.issues.filter((entry) => entry.level === "error");
  const warnings = report.issues.filter((entry) => entry.level === "warn");
  const suggestions = [];

  if (errors.some((entry) => entry.type === "missing_hard_governance_gate_check")) {
    suggestions.push("Run npm run agents:scope-sync to propagate hard governance gate checks across agent metadata.");
  }
  if (errors.some((entry) => entry.type === "routing_keyword_collision")) {
    suggestions.push("Consolidate conflicting keyword rules in to-do/skills/repeat_action_routing.json to one skill stack per keyword.");
  }
  if (errors.some((entry) => entry.type === "automation_schedule_gap")) {
    suggestions.push("Update automation contracts to close required condition-gated coverage gaps.");
  }
  if (errors.some((entry) => entry.type === "registry_project_id_mismatch")) {
    suggestions.push("Normalize to-do/agents/agents_registry.yaml project_scope to AIO naming.");
  }
  if (errors.some((entry) => entry.type === "standards_baseline_gate_failed")) {
    suggestions.push("Run npm run standards:baseline:gate and resolve all naming/storage/optimization failures.");
  }
  if (errors.some((entry) => entry.type === "workflow_pipeline_order_gate_failed")) {
    suggestions.push("Run npm run workflow:order:gate and restore canonical stage/gate order before continuing.");
  }
  if (errors.some((entry) => entry.type === "iso_standards_compliance_gate_failed")) {
    suggestions.push("Run npm run standards:iso:gate and restore missing compliance evidence links for failing standards.");
  }
  if (errors.some((entry) => entry.type === "uiux_blueprint_gate_failed")) {
    suggestions.push("Run npm run uiux:blueprint:check and resolve UI UX catalog coverage gaps.");
  }
  if (warnings.length > 0) {
    suggestions.push("Merge redundant routing rules and duplicate workflow lines to reduce token and maintenance cost.");
  }
  if (suggestions.length === 0) {
    suggestions.push("Keep governance gate active in workflow and refactor gates to maintain first-time-right execution.");
  }
  return suggestions;
}

function buildRoadmapMarkdown(report) {
  const errors = report.issues.filter((entry) => entry.level === "error");
  const warnings = report.issues.filter((entry) => entry.level === "warn");
  const lines = [];
  lines.push("# Automation Roadmap");
  lines.push("");
  lines.push(`- Status: ${report.status.toUpperCase()}`);
  lines.push(`- Errors: ${errors.length}`);
  lines.push(`- Warnings: ${warnings.length}`);
  lines.push("");
  lines.push("## Trigger: Gate Failures (Immediate)");
  if (errors.length === 0) {
    lines.push("- Keep current governance gate configuration locked and monitored.");
  } else {
    errors.slice(0, 10).forEach((entry) => {
      lines.push(`- Resolve ${entry.type}: ${entry.detail}`);
    });
  }
  lines.push("");
  lines.push("## Trigger: Warning Drift (Continuous)");
  if (warnings.length === 0) {
    lines.push("- Expand automated checks only when new repetition patterns appear.");
  } else {
    warnings.slice(0, 10).forEach((entry) => {
      lines.push(`- Reduce ${entry.type}: ${entry.detail}`);
    });
  }
  lines.push("");
  lines.push("## Trigger: Capability Expansion (On Demand)");
  lines.push("- Add new automation slots only through hard ruleset updates.");
  lines.push("- Keep skill/agent metadata aligned with governance policies in the same change pass.");
  lines.push("- Track token and completion-time deltas in each gate-triggered run.");
  lines.push("");
  lines.push("## Suggested Actions");
  report.suggestions.forEach((entry) => {
    lines.push(`- ${entry}`);
  });
  lines.push("");
  return lines.join("\n");
}

function buildFutureBlueprintMarkdown(report, ruleset) {
  const automationRules = ruleset.automation && typeof ruleset.automation === "object" ? ruleset.automation : {};
  const lines = [];
  lines.push("# Future Blueprint");
  lines.push("");
  lines.push("## Architecture Direction");
  lines.push("- Keep automation policy machine-readable in one ruleset file.");
  lines.push("- Keep automations condition-gated and event-driven (no day/time wave dependency).");
  lines.push("- Keep workflow stages fail-fast; never defer governance failures.");
  lines.push("- Keep prompts command-first, token-bounded, and deduplicated.");
  lines.push("");
  lines.push("## Non-Negotiable Contracts");
  lines.push(`- Active automations minimum: ${Number(automationRules.min_active_automations || 0)}`);
  lines.push(`- Prompt token cap: ${Number(automationRules.max_prompt_tokens || 0)}`);
  lines.push(`- Command-first prompts: ${automationRules.require_command_first_prompt === true ? "required" : "optional"}`);
  lines.push(`- Condition-gated automation mode: ${automationRules.condition_gated_mode === true ? "required" : "optional"}`);
  lines.push("- Agent workflows must include hard governance gate checks.");
  lines.push("- Routing keywords must map deterministically to one skill stack.");
  lines.push("- Workflow pipeline order must match data/input/shared/main/workflow_execution_pipeline.json.");
  lines.push("- ISO standards compliance checklist must pass with evidence links for every standard row.");
  lines.push("- UI UX blueprint catalog must pass semantic color, ergonomics, preference, and measurement checks.");
  lines.push("- UI component taxonomy, rendering policy, search policy, memory lifecycle policy, and AI safety policy catalogs must remain present and schema-valid.");
  lines.push("- Stage runtime selection must remain benchmark-evidence-driven (no default-runtime bias).");
  lines.push("");
  lines.push("## Expansion Plan");
  lines.push("- Add new capabilities only when they can be enforced by deterministic validators.");
  lines.push("- Gate every new skill/agent/routing change through governance + efficiency + refactor checks.");
  lines.push("- Keep roadmap and blueprint artifacts updated from each governance run.");
  lines.push("");
  lines.push("## Current Governance Suggestions");
  report.suggestions.forEach((entry) => {
    lines.push(`- ${entry}`);
  });
  lines.push("");
  return lines.join("\n");
}

function analyze(root, args) {
  const rulesetPath = path.resolve(root, args.rulesetFile || DEFAULT_RULESET_FILE);
  const reportFile = path.resolve(root, args.reportFile || DEFAULT_REPORT_FILE);
  const roadmapFile = path.resolve(root, args.roadmapFile || DEFAULT_ROADMAP_FILE);
  const blueprintFile = path.resolve(root, args.blueprintFile || DEFAULT_BLUEPRINT_FILE);
  const codexHome = path.resolve(args.codexHome || process.env.CODEX_HOME || path.join(os.homedir(), ".codex"));
  const issues = [];

  const report = {
    status: "pass",
    generated_at: new Date().toISOString(),
    root,
    inputs: {
      ruleset_file: normalizePathForOutput(root, rulesetPath),
      codex_home: codexHome
    },
    outputs: {
      report_file: normalizePathForOutput(root, reportFile),
      roadmap_file: normalizePathForOutput(root, roadmapFile),
      blueprint_file: normalizePathForOutput(root, blueprintFile)
    },
    metrics: {},
    issues,
    suggestions: []
  };

  if (!fs.existsSync(rulesetPath)) {
    issues.push(issue("error", "missing_ruleset_file", "hard governance ruleset file is missing", { path: rulesetPath }));
    report.status = "fail";
    return report;
  }

  let ruleset = {};
  let packageJson = {};
  let routingDoc = {};
  let workflowDoc = {};
  let registryDoc = {};
  try {
    ruleset = readJson(rulesetPath);
  } catch (error) {
    issues.push(issue("error", "invalid_ruleset_json", "unable to parse hard governance ruleset json", { error: error.message }));
  }

  try {
    packageJson = readJson(path.join(root, "package.json"));
  } catch (error) {
    issues.push(issue("error", "invalid_package_json", "unable to parse package.json", { error: error.message }));
  }

  try {
    routingDoc = readRoutingPolicy(root).doc;
  } catch (error) {
    issues.push(issue("error", "invalid_routing_json", "unable to parse repeat_action_routing.json", { error: error.message }));
  }

  try {
    workflowDoc = readJson(path.join(root, "to-do", "skills", "agent_workflows.json"));
  } catch (error) {
    issues.push(issue("error", "invalid_agent_workflows_json", "unable to parse agent_workflows.json", { error: error.message }));
  }

  try {
    registryDoc = readYaml(path.join(root, "to-do", "agents", "agents_registry.yaml"));
  } catch (error) {
    issues.push(issue("error", "invalid_agents_registry_yaml", "unable to parse agents_registry.yaml", { error: error.message }));
  }

  if (!issues.some((entry) => entry.level === "error")) {
    checkRequiredWorkflowScripts(packageJson, ruleset, report);
    checkRequiredStandardsCatalogs(root, ruleset, report);
    runWorkflowPipelineOrderSubcheck(root, report);
    analyzeRouting(routingDoc, ruleset, report);
    analyzeAgents(workflowDoc, registryDoc, ruleset, report);
    analyzeAutomations(readAutomations(codexHome), ruleset, report);
    runStandardsBaselineSubcheck(root, ruleset, report);
    runIsoStandardsComplianceSubcheck(root, ruleset, report);
    runUiuxBlueprintSubcheck(root, ruleset, report);
  }

  report.suggestions = buildSuggestions(report);
  report.status = report.issues.some((entry) => entry.level === "error") ? "fail" : "pass";
  return report;
}

function writeOutputs(report, args) {
  if (args.check) {
    return;
  }
  const root = report.root;
  const reportPath = path.resolve(root, args.reportFile || DEFAULT_REPORT_FILE);
  const roadmapPath = path.resolve(root, args.roadmapFile || DEFAULT_ROADMAP_FILE);
  const blueprintPath = path.resolve(root, args.blueprintFile || DEFAULT_BLUEPRINT_FILE);
  writeTextFileRobust(reportPath, `${JSON.stringify(report, null, 2)}\n`);

  const rulesetPath = path.resolve(root, args.rulesetFile || DEFAULT_RULESET_FILE);
  let ruleset = {};
  try {
    ruleset = readJson(rulesetPath);
  } catch {
    ruleset = {};
  }
  writeTextFileRobust(roadmapPath, buildRoadmapMarkdown(report));
  writeTextFileRobust(blueprintPath, buildFutureBlueprintMarkdown(report, ruleset));
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const root = findProjectRoot(process.cwd());
  const report = analyze(root, args);
  writeOutputs(report, args);
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (args.strict && (args.enforce || args.check) && report.status !== "pass") {
    process.exit(1);
  }
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    process.stderr.write(`hard-governance-gate failed: ${error.message}\n`);
    process.exit(1);
  }
}

module.exports = {
  analyze,
  parseRRule,
  estimateTokens
};
