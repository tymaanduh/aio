#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { findProjectRoot } = require("./project-source-resolver");

const DEFAULT_CATALOG_FILE = path.join("data", "input", "shared", "main", "ui_ux_blueprint_catalog.json");
const DEFAULT_RESEARCH_FILE = path.join(
  "data",
  "output",
  "databases",
  "polyglot-default",
  "research",
  "ui_ux_psychology_ergonomics_research_2026-03-05.md"
);
const DEFAULT_BLUEPRINT_FILE = path.join("data", "output", "databases", "polyglot-default", "plan", "ui_ux_blueprint.md");
const DEFAULT_REPORT_FILE = path.join(
  "data",
  "output",
  "databases",
  "polyglot-default",
  "analysis",
  "uiux_blueprint_report.json"
);

function parseArgs(argv) {
  const args = {
    strict: !argv.includes("--no-strict"),
    enforce: argv.includes("--enforce"),
    check: argv.includes("--check"),
    catalogFile: "",
    researchFile: "",
    outputFile: "",
    reportFile: ""
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--catalog-file" && argv[index + 1]) {
      args.catalogFile = String(argv[index + 1]).trim();
      index += 1;
      continue;
    }
    if (token === "--research-file" && argv[index + 1]) {
      args.researchFile = String(argv[index + 1]).trim();
      index += 1;
      continue;
    }
    if (token === "--output-file" && argv[index + 1]) {
      args.outputFile = String(argv[index + 1]).trim();
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

function ensureDirForFile(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function normalizeText(value) {
  return String(value || "").trim();
}

function issue(level, type, detail, extra = {}) {
  return {
    level,
    type,
    detail,
    ...extra
  };
}

function validateColorRoles(catalog, report) {
  const colorSystem =
    catalog && catalog.color_system && typeof catalog.color_system === "object" ? catalog.color_system : {};
  const roles = Array.isArray(colorSystem.semantic_roles) ? colorSystem.semantic_roles : [];
  if (roles.length < 5) {
    report.issues.push(
      issue("error", "insufficient_color_roles", "color system must define at least five semantic roles", {
        role_count: roles.length
      })
    );
  }

  const seenRoles = new Set();
  roles.forEach((role, index) => {
    const roleId = normalizeText(role && role.role_id).toLowerCase();
    if (!roleId) {
      report.issues.push(issue("error", "missing_color_role_id", "semantic color role is missing role_id", { index }));
      return;
    }
    if (seenRoles.has(roleId)) {
      report.issues.push(
        issue("error", "duplicate_color_role_id", "semantic color role ids must be unique", {
          role_id: roleId
        })
      );
    } else {
      seenRoles.add(roleId);
    }

    const purpose = normalizeText(role && role.purpose);
    const psychology = normalizeText(role && role.psychological_goal);
    if (!purpose) {
      report.issues.push(
        issue("error", "missing_color_role_purpose", "semantic color role must define purpose", {
          role_id: roleId
        })
      );
    }
    if (!psychology) {
      report.issues.push(
        issue("error", "missing_color_role_psychology", "semantic color role must define psychological_goal", {
          role_id: roleId
        })
      );
    }

    const requirements = Array.isArray(role && role.requirements) ? role.requirements : [];
    if (requirements.length === 0) {
      report.issues.push(
        issue("warn", "missing_color_role_requirements", "semantic color role should define requirements", {
          role_id: roleId
        })
      );
    }
  });

  report.metrics.color_semantics = {
    semantic_roles: roles.length,
    unique_roles: seenRoles.size
  };
}

function validateLayoutErgonomics(catalog, report) {
  const layout =
    catalog && catalog.layout_ergonomics && typeof catalog.layout_ergonomics === "object"
      ? catalog.layout_ergonomics
      : {};
  const minTargetSize = Number(layout.target_size_min_css_px);
  const recommendedTargetSize = Number(layout.target_size_recommended_css_px);
  const rules = Array.isArray(layout.rules) ? layout.rules : [];

  if (!Number.isFinite(minTargetSize)) {
    report.issues.push(
      issue("error", "missing_layout_min_target_size", "layout_ergonomics.target_size_min_css_px must be numeric")
    );
  } else if (minTargetSize < 24) {
    report.issues.push(
      issue("error", "layout_min_target_too_small", "layout minimum target size must be at least 24 CSS px", {
        value: minTargetSize
      })
    );
  }

  if (!Number.isFinite(recommendedTargetSize)) {
    report.issues.push(
      issue(
        "warn",
        "missing_layout_recommended_target_size",
        "layout_ergonomics.target_size_recommended_css_px should be numeric"
      )
    );
  } else if (recommendedTargetSize < minTargetSize) {
    report.issues.push(
      issue(
        "warn",
        "layout_recommended_target_below_min",
        "layout recommended target size is below minimum target size",
        {
          min: minTargetSize,
          recommended: recommendedTargetSize
        }
      )
    );
  }

  if (rules.length < 4) {
    report.issues.push(
      issue("warn", "layout_rules_too_short", "layout ergonomics should define at least four enforceable rules", {
        rule_count: rules.length
      })
    );
  }

  report.metrics.layout_ergonomics = {
    min_target_size_css_px: Number.isFinite(minTargetSize) ? minTargetSize : 0,
    recommended_target_size_css_px: Number.isFinite(recommendedTargetSize) ? recommendedTargetSize : 0,
    rule_count: rules.length
  };
}

function validateUserPreferences(catalog, report) {
  const preferences =
    catalog && catalog.user_preferences && typeof catalog.user_preferences === "object" ? catalog.user_preferences : {};
  const requiredFeatures = Array.isArray(preferences.required_media_features)
    ? preferences.required_media_features.map((entry) => normalizeText(entry).toLowerCase()).filter(Boolean)
    : [];
  const requiredSet = new Set(requiredFeatures);
  const expected = [
    "prefers-color-scheme",
    "prefers-contrast",
    "prefers-reduced-motion",
    "prefers-reduced-data",
    "forced-colors"
  ];
  const missing = expected.filter((entry) => !requiredSet.has(entry));
  if (missing.length > 0) {
    report.issues.push(
      issue("error", "missing_required_media_features", "user preference media features are missing", {
        missing
      })
    );
  }

  const overrides = Array.isArray(preferences.runtime_override_contracts) ? preferences.runtime_override_contracts : [];
  if (overrides.length < 3) {
    report.issues.push(
      issue(
        "warn",
        "insufficient_runtime_overrides",
        "user preference runtime_override_contracts should define at least three override contracts",
        {
          count: overrides.length
        }
      )
    );
  }

  report.metrics.user_preferences = {
    required_media_features: requiredFeatures.length,
    runtime_override_contracts: overrides.length
  };
}

function validateMeasurementPlan(catalog, report) {
  const measurement =
    catalog && catalog.measurement_plan && typeof catalog.measurement_plan === "object" ? catalog.measurement_plan : {};
  const metrics = Array.isArray(measurement.core_metrics) ? measurement.core_metrics : [];

  if (metrics.length < 5) {
    report.issues.push(
      issue(
        "error",
        "insufficient_measurement_metrics",
        "measurement_plan.core_metrics must define at least five UX metrics",
        {
          metric_count: metrics.length
        }
      )
    );
  }

  const seenMetricIds = new Set();
  metrics.forEach((entry, index) => {
    const metricId = normalizeText(entry && entry.metric_id).toLowerCase();
    if (!metricId) {
      report.issues.push(issue("error", "missing_metric_id", "measurement metric is missing metric_id", { index }));
      return;
    }
    if (seenMetricIds.has(metricId)) {
      report.issues.push(
        issue("error", "duplicate_metric_id", "measurement metric ids must be unique", {
          metric_id: metricId
        })
      );
    } else {
      seenMetricIds.add(metricId);
    }

    if (!normalizeText(entry && entry.definition)) {
      report.issues.push(
        issue("warn", "missing_metric_definition", "measurement metric should define a clear definition", {
          metric_id: metricId
        })
      );
    }
    if (!normalizeText(entry && entry.target)) {
      report.issues.push(
        issue("warn", "missing_metric_target", "measurement metric should define a target", {
          metric_id: metricId
        })
      );
    }
  });

  report.metrics.measurement = {
    metric_count: metrics.length,
    unique_metric_ids: seenMetricIds.size
  };
}

function buildBlueprintMarkdown(catalog, researchFileExists) {
  const lines = [];
  const generatedOn = normalizeText(catalog.generated_on) || new Date().toISOString().slice(0, 10);
  const principles = Array.isArray(catalog.design_principles) ? catalog.design_principles : [];
  const colorRoles =
    catalog && catalog.color_system && Array.isArray(catalog.color_system.semantic_roles)
      ? catalog.color_system.semantic_roles
      : [];
  const layout =
    catalog && catalog.layout_ergonomics && typeof catalog.layout_ergonomics === "object"
      ? catalog.layout_ergonomics
      : {};
  const psychology =
    catalog && catalog.interaction_psychology && typeof catalog.interaction_psychology === "object"
      ? catalog.interaction_psychology
      : {};
  const preferenceFeatures =
    catalog && catalog.user_preferences && Array.isArray(catalog.user_preferences.required_media_features)
      ? catalog.user_preferences.required_media_features
      : [];
  const coreMetrics =
    catalog && catalog.measurement_plan && Array.isArray(catalog.measurement_plan.core_metrics)
      ? catalog.measurement_plan.core_metrics
      : [];
  const sources = Array.isArray(catalog.source_index) ? catalog.source_index : [];

  lines.push("# UI UX Blueprint");
  lines.push("");
  lines.push(`- Catalog ID: ${normalizeText(catalog.catalog_id) || "unknown"}`);
  lines.push(`- Generated On: ${generatedOn}`);
  lines.push(`- Research Pack Linked: ${researchFileExists ? "yes" : "no"}`);
  lines.push("");
  lines.push("## UX Objectives");
  principles.forEach((entry) => {
    lines.push(`- ${String(entry)}`);
  });
  lines.push("");
  lines.push("## Color Semantics");
  colorRoles.forEach((role) => {
    const roleId = normalizeText(role && role.role_id) || "unknown";
    const purpose = normalizeText(role && role.purpose) || "n/a";
    const psychologyGoal = normalizeText(role && role.psychological_goal) || "n/a";
    lines.push(`- \`${roleId}\`: ${purpose} Psychological goal: ${psychologyGoal}`);
  });
  lines.push("");
  lines.push("## Layout Ergonomics");
  lines.push(`- Minimum target size: ${Number(layout.target_size_min_css_px) || 0}px`);
  lines.push(`- Recommended target size: ${Number(layout.target_size_recommended_css_px) || 0}px`);
  const layoutRules = Array.isArray(layout.rules) ? layout.rules : [];
  layoutRules.forEach((entry) => {
    lines.push(`- ${String(entry)}`);
  });
  lines.push("");
  lines.push("## Interaction Psychology");
  const laws = Array.isArray(psychology.laws) ? psychology.laws : [];
  laws.forEach((entry) => {
    lines.push(`- ${normalizeText(entry && entry.law_id)}: ${normalizeText(entry && entry.application)}`);
  });
  const decisionRules = Array.isArray(psychology.decision_architecture_rules) ? psychology.decision_architecture_rules : [];
  decisionRules.forEach((entry) => {
    lines.push(`- ${String(entry)}`);
  });
  lines.push("");
  lines.push("## User Preference Handling");
  preferenceFeatures.forEach((entry) => {
    lines.push(`- ${String(entry)}`);
  });
  lines.push("");
  lines.push("## Measurement Plan");
  coreMetrics.forEach((entry) => {
    lines.push(`- ${normalizeText(entry && entry.metric_id)}: ${normalizeText(entry && entry.target)}`);
  });
  lines.push("");
  lines.push("## Compliance Traceability");
  sources.forEach((source) => {
    const sourceId = normalizeText(source && source.source_id) || "unknown_source";
    const url = normalizeText(source && source.url) || "";
    if (!url) {
      return;
    }
    lines.push(`- ${sourceId}: ${url}`);
  });
  lines.push("");
  return lines.join("\n");
}

function buildRecommendations(report) {
  const recommendations = [];
  if (report.issues.some((entry) => entry.type === "missing_required_media_features")) {
    recommendations.push("Include all required preference media features and keep preference resolution deterministic.");
  }
  if (report.issues.some((entry) => entry.type === "insufficient_color_roles")) {
    recommendations.push("Expand semantic color system to danger/warning/success/info/neutral with explicit rationale.");
  }
  if (report.issues.some((entry) => entry.type === "layout_min_target_too_small")) {
    recommendations.push("Raise minimum target size to at least 24 CSS px and keep 32 CSS px as preferred target.");
  }
  if (report.issues.some((entry) => entry.type === "insufficient_measurement_metrics")) {
    recommendations.push("Add full UX measurement metrics covering success, speed, errors, accessibility, and satisfaction.");
  }
  if (recommendations.length === 0) {
    recommendations.push("Keep UI UX catalog and blueprint generator in gate path to preserve first-time-right outcomes.");
  }
  return recommendations;
}

function analyze(root, args = {}) {
  const catalogPath = path.resolve(root, args.catalogFile || DEFAULT_CATALOG_FILE);
  const researchPath = path.resolve(root, args.researchFile || DEFAULT_RESEARCH_FILE);
  const outputPath = path.resolve(root, args.outputFile || DEFAULT_BLUEPRINT_FILE);
  const reportPath = path.resolve(root, args.reportFile || DEFAULT_REPORT_FILE);

  const report = {
    status: "pass",
    generated_at: new Date().toISOString(),
    root,
    files: {
      catalog_file: normalizePath(root, catalogPath),
      research_file: normalizePath(root, researchPath)
    },
    outputs: {
      blueprint_file: normalizePath(root, outputPath),
      report_file: normalizePath(root, reportPath)
    },
    metrics: {
      design_principles: 0,
      required_blueprint_sections: 0,
      color_semantics: { semantic_roles: 0, unique_roles: 0 },
      layout_ergonomics: { min_target_size_css_px: 0, recommended_target_size_css_px: 0, rule_count: 0 },
      user_preferences: { required_media_features: 0, runtime_override_contracts: 0 },
      measurement: { metric_count: 0, unique_metric_ids: 0 }
    },
    issues: [],
    recommendations: [],
    blueprint_markdown: ""
  };

  if (!fs.existsSync(catalogPath)) {
    report.issues.push(
      issue("error", "missing_uiux_catalog", "UI UX blueprint catalog file is missing", {
        file: normalizePath(root, catalogPath)
      })
    );
    report.recommendations = buildRecommendations(report);
    report.status = "fail";
    return report;
  }

  let catalog = {};
  try {
    catalog = readJson(catalogPath);
  } catch (error) {
    report.issues.push(
      issue("error", "invalid_uiux_catalog_json", "UI UX blueprint catalog is not valid JSON", {
        error: error.message
      })
    );
    report.recommendations = buildRecommendations(report);
    report.status = "fail";
    return report;
  }

  if (!Number.isFinite(Number(catalog.schema_version))) {
    report.issues.push(
      issue("error", "invalid_uiux_catalog_schema_version", "UI UX blueprint catalog schema_version must be numeric")
    );
  }

  const principles = Array.isArray(catalog.design_principles) ? catalog.design_principles : [];
  if (principles.length < 5) {
    report.issues.push(
      issue("error", "insufficient_design_principles", "design_principles must contain at least five principles", {
        count: principles.length
      })
    );
  }
  report.metrics.design_principles = principles.length;

  const requiredSections = Array.isArray(catalog.required_blueprint_sections) ? catalog.required_blueprint_sections : [];
  if (requiredSections.length < 6) {
    report.issues.push(
      issue(
        "warn",
        "insufficient_required_blueprint_sections",
        "required_blueprint_sections should define at least six sections",
        { count: requiredSections.length }
      )
    );
  }
  report.metrics.required_blueprint_sections = requiredSections.length;

  validateColorRoles(catalog, report);
  validateLayoutErgonomics(catalog, report);
  validateUserPreferences(catalog, report);
  validateMeasurementPlan(catalog, report);

  const sourceIndex = Array.isArray(catalog.source_index) ? catalog.source_index : [];
  if (sourceIndex.length < 8) {
    report.issues.push(
      issue("warn", "short_source_index", "source_index should include at least eight references", {
        count: sourceIndex.length
      })
    );
  }

  if (!fs.existsSync(researchPath)) {
    report.issues.push(
      issue("warn", "uiux_research_file_missing", "UI UX research markdown was not found; catalog validation still ran", {
        file: normalizePath(root, researchPath)
      })
    );
  }

  report.blueprint_markdown = buildBlueprintMarkdown(catalog, fs.existsSync(researchPath));
  report.recommendations = buildRecommendations(report);
  report.status = report.issues.some((entry) => entry.level === "error") ? "fail" : "pass";
  return report;
}

function writeOutputs(root, args, report) {
  if (args.check) {
    return;
  }
  const outputPath = path.resolve(root, args.outputFile || DEFAULT_BLUEPRINT_FILE);
  const reportPath = path.resolve(root, args.reportFile || DEFAULT_REPORT_FILE);
  ensureDirForFile(outputPath);
  ensureDirForFile(reportPath);
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  if (report.status === "pass" && normalizeText(report.blueprint_markdown)) {
    fs.writeFileSync(outputPath, report.blueprint_markdown, "utf8");
  }
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
    process.stderr.write(`generate-uiux-blueprint failed: ${error.message}\n`);
    process.exit(1);
  }
}

module.exports = {
  analyze,
  buildBlueprintMarkdown
};
