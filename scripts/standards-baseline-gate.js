#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { findProjectRoot } = require("./project-source-resolver");
const { analyze: analyzeEfficiency } = require("./codex-efficiency-audit");

const DEFAULT_REPORT_FILE = path.join(
  "data",
  "output",
  "databases",
  "polyglot-default",
  "analysis",
  "standards_baseline_report.json"
);
const DEFAULT_BASELINE_FILE = path.join("data", "input", "shared", "main", "executive_engineering_baseline.json");
const DEFAULT_STANDARDS_FILE = path.join("data", "input", "shared", "main", "polyglot_engineering_standards_catalog.json");
const DEFAULT_ISO_TRACEABILITY_FILE = path.join("data", "input", "shared", "main", "iso_standards_traceability_catalog.json");
const DEFAULT_UIUX_CATALOG_FILE = path.join("data", "input", "shared", "main", "ui_ux_blueprint_catalog.json");
const WRAPPER_SYMBOL_REGISTRY_FILE = path.join("data", "input", "shared", "wrapper", "wrapper_symbol_registry.json");
const BENCHMARK_CASES_FILE = path.join("data", "input", "shared", "wrapper", "runtime_benchmark_cases.json");

const RUNTIME_SCAN_ROOTS = Object.freeze(["app", "brain", "main", "renderer"]);
const SOURCE_FILE_EXTENSIONS = new Set([".js", ".ts", ".py", ".rb", ".c", ".h", ".hpp", ".cpp"]);
const JSON_POLICY_SCAN_ROOTS = Object.freeze(["data/input/shared/main", "data/input/shared/wrapper"]);
const SKIP_DIRS = new Set([".git", "node_modules", "dist", ".vs", ".vscode"]);

function parseArgs(argv) {
  const args = {
    strict: !argv.includes("--no-strict"),
    enforce: argv.includes("--enforce"),
    check: argv.includes("--check"),
    reportFile: "",
    baselineFile: "",
    standardsFile: "",
    isoTraceabilityFile: "",
    uiuxCatalogFile: ""
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--report-file" && argv[index + 1]) {
      args.reportFile = String(argv[index + 1]).trim();
      index += 1;
      continue;
    }
    if (token === "--baseline-file" && argv[index + 1]) {
      args.baselineFile = String(argv[index + 1]).trim();
      index += 1;
      continue;
    }
    if (token === "--standards-file" && argv[index + 1]) {
      args.standardsFile = String(argv[index + 1]).trim();
      index += 1;
      continue;
    }
    if (token === "--iso-traceability-file" && argv[index + 1]) {
      args.isoTraceabilityFile = String(argv[index + 1]).trim();
      index += 1;
      continue;
    }
    if (token === "--uiux-catalog-file" && argv[index + 1]) {
      args.uiuxCatalogFile = String(argv[index + 1]).trim();
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

function issue(level, type, detail, extra = {}) {
  return {
    level,
    type,
    detail,
    ...extra
  };
}

function listFilesRecursively(root, scanRoots, extensionSet) {
  const files = [];
  const queue = [];
  scanRoots.forEach((scanRoot) => {
    const absolute = path.resolve(root, scanRoot);
    if (fs.existsSync(absolute)) {
      queue.push(absolute);
    }
  });

  while (queue.length > 0) {
    const current = queue.pop();
    const rel = normalizePath(root, current);
    const basename = path.basename(current);
    if (SKIP_DIRS.has(basename)) {
      continue;
    }
    if (rel.startsWith("native/dx12/build-mingw/") || rel.startsWith("native/dx12/build/")) {
      continue;
    }
    const stat = fs.statSync(current);
    if (stat.isDirectory()) {
      const entries = fs.readdirSync(current);
      entries.forEach((entry) => {
        queue.push(path.join(current, entry));
      });
      continue;
    }
    const ext = path.extname(current).toLowerCase();
    if (!extensionSet || extensionSet.has(ext)) {
      files.push(current);
    }
  }

  return files.sort((left, right) => normalizePath(root, left).localeCompare(normalizePath(root, right)));
}

function classifyBaseName(baseName) {
  if (/^[a-z0-9]+(?:_[a-z0-9]+)*$/.test(baseName)) {
    return "snake_case";
  }
  if (/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(baseName)) {
    return "kebab-case";
  }
  if (/^[a-z]+(?:[A-Z][a-z0-9]*)+$/.test(baseName)) {
    return "camelCase";
  }
  if (/^[A-Z][A-Za-z0-9]*$/.test(baseName)) {
    return "PascalCase";
  }
  return "other";
}

function collectNamingMetrics(root, baseline, report) {
  const namingPolicy =
    baseline &&
    baseline.naming_policy &&
    baseline.naming_policy.filename_policy &&
    typeof baseline.naming_policy.filename_policy === "object"
      ? baseline.naming_policy.filename_policy
      : {};

  const runtimePolicy =
    namingPolicy.runtime_roots && typeof namingPolicy.runtime_roots === "object" ? namingPolicy.runtime_roots : {};
  const scriptPolicy = namingPolicy.script_root && typeof namingPolicy.script_root === "object" ? namingPolicy.script_root : {};

  const runtimeRoots = Array.isArray(runtimePolicy.roots) ? runtimePolicy.roots : [];
  const scriptRoots = Array.isArray(scriptPolicy.roots) ? scriptPolicy.roots : ["scripts"];

  const files = listFilesRecursively(root, [...runtimeRoots, ...scriptRoots], SOURCE_FILE_EXTENSIONS);
  const caseCounts = new Map();
  const runtimeAllowed = new Set(Array.isArray(runtimePolicy.allowed_cases) ? runtimePolicy.allowed_cases : ["snake_case"]);
  const runtimeLegacy = new Set(Array.isArray(runtimePolicy.legacy_allowed_cases) ? runtimePolicy.legacy_allowed_cases : []);
  const scriptAllowed = new Set(Array.isArray(scriptPolicy.allowed_cases) ? scriptPolicy.allowed_cases : ["snake_case", "kebab-case"]);

  const violations = [];
  const legacyHits = [];

  files.forEach((filePath) => {
    const rel = normalizePath(root, filePath);
    const ext = path.extname(rel).toLowerCase();
    if (!SOURCE_FILE_EXTENSIONS.has(ext)) {
      return;
    }
    const rawBaseName = path.basename(rel, ext);
    const baseName = rawBaseName.replace(/\.(test|spec)$/i, "");
    const style = classifyBaseName(baseName);
    caseCounts.set(style, Number(caseCounts.get(style) || 0) + 1);

    const isRuntime = runtimeRoots.some((item) => rel.startsWith(`${String(item).replace(/\\/g, "/")}/`));
    const isScript = scriptRoots.some((item) => rel.startsWith(`${String(item).replace(/\\/g, "/")}/`));

    if (isRuntime) {
      if (runtimeAllowed.has(style)) {
        return;
      }
      if (runtimeLegacy.has(style)) {
        legacyHits.push({ file: rel, style });
        return;
      }
      violations.push({ file: rel, style, scope: "runtime" });
      return;
    }
    if (isScript) {
      if (!scriptAllowed.has(style)) {
        violations.push({ file: rel, style, scope: "scripts" });
      }
    }
  });

  violations.slice(0, 200).forEach((row) => {
    report.issues.push(
      issue("error", "filename_style_violation", "file basename style violates executive baseline policy", row)
    );
  });
  legacyHits.slice(0, 200).forEach((row) => {
    report.issues.push(
      issue(
        "warn",
        "filename_legacy_style_detected",
        "file uses legacy-allowed style; migrate to preferred style when touched",
        row
      )
    );
  });

  report.metrics.naming = {
    files_scanned: files.length,
    styles: Object.fromEntries([...caseCounts.entries()].sort((left, right) => left[0].localeCompare(right[0]))),
    hard_violations: violations.length,
    legacy_hits: legacyHits.length
  };
}

function validateSymbolRegistry(root, report) {
  const registryPath = path.resolve(root, WRAPPER_SYMBOL_REGISTRY_FILE);
  if (!fs.existsSync(registryPath)) {
    report.issues.push(
      issue("error", "missing_wrapper_symbol_registry", "wrapper_symbol_registry.json is required", {
        file: WRAPPER_SYMBOL_REGISTRY_FILE
      })
    );
    return;
  }

  const registry = readJson(registryPath);
  const nameIndex = registry && typeof registry.name_index === "object" ? registry.name_index : {};
  const functionIds = Array.isArray(nameIndex.function_ids) ? nameIndex.function_ids : [];
  const objectNames = Array.isArray(nameIndex.object_names) ? nameIndex.object_names : [];
  const symbolNames = Array.isArray(nameIndex.symbol_names) ? nameIndex.symbol_names : [];
  const constNames = Array.isArray(nameIndex.const_names) ? nameIndex.const_names : [];

  const seen = new Set();
  functionIds.forEach((value) => {
    const item = String(value || "").trim();
    const key = `fn:${item}`;
    if (!item) {
      report.issues.push(issue("error", "empty_function_id", "function_ids cannot contain empty values"));
      return;
    }
    if (!/^[a-z][a-z0-9]*(\.[a-z][a-z0-9_]*)+$/.test(item)) {
      report.issues.push(issue("error", "invalid_function_id_format", "function_id must be lower dot namespace format", { value: item }));
    }
    if (seen.has(key)) {
      report.issues.push(issue("error", "duplicate_function_id", "function_ids must be unique", { value: item }));
    } else {
      seen.add(key);
    }
  });

  const checkUniqueLowerSnake = (values, type) => {
    const local = new Set();
    values.forEach((value) => {
      const item = String(value || "").trim();
      if (!item) {
        report.issues.push(issue("error", `empty_${type}`, `${type} cannot contain empty values`));
        return;
      }
      if (!/^[a-z][a-z0-9_]*$/.test(item)) {
        report.issues.push(issue("error", `invalid_${type}_format`, `${type} must be lower_snake_case`, { value: item }));
      }
      const key = item.toLowerCase();
      if (local.has(key)) {
        report.issues.push(issue("error", `duplicate_${type}`, `${type} must be unique (case-insensitive)`, { value: item }));
      } else {
        local.add(key);
      }
    });
  };

  checkUniqueLowerSnake(objectNames, "object_name");
  checkUniqueLowerSnake(symbolNames, "symbol_name");

  const constSeen = new Set();
  constNames.forEach((value) => {
    const item = String(value || "").trim();
    if (!item) {
      report.issues.push(issue("error", "empty_const_name", "const_names cannot contain empty values"));
      return;
    }
    if (!/^[A-Z][A-Z0-9_]*$/.test(item)) {
      report.issues.push(issue("error", "invalid_const_name_format", "const_names must be UPPER_SNAKE_CASE", { value: item }));
    }
    const key = item.toUpperCase();
    if (constSeen.has(key)) {
      report.issues.push(issue("error", "duplicate_const_name", "const_names must be unique", { value: item }));
    } else {
      constSeen.add(key);
    }
  });

  report.metrics.symbol_registry = {
    function_ids: functionIds.length,
    object_names: objectNames.length,
    symbol_names: symbolNames.length,
    const_names: constNames.length
  };
}

function validateStoragePolicies(root, baseline, report) {
  const storagePolicy =
    baseline && baseline.data_storage_policy && typeof baseline.data_storage_policy === "object"
      ? baseline.data_storage_policy
      : {};
  const forbiddenPrefixes = Array.isArray(storagePolicy.runtime_forbidden_source_prefixes)
    ? storagePolicy.runtime_forbidden_source_prefixes.map((entry) => String(entry || "").trim()).filter(Boolean)
    : [];
  const catalogRequirements =
    storagePolicy.catalog_contract_requirements && typeof storagePolicy.catalog_contract_requirements === "object"
      ? storagePolicy.catalog_contract_requirements
      : {};
  const missingSchemaLevel =
    String(catalogRequirements.legacy_missing_schema_level || "error").trim().toLowerCase() === "warn" ? "warn" : "error";

  const runtimeFiles = listFilesRecursively(root, RUNTIME_SCAN_ROOTS, new Set([".js", ".ts"]));
  const runtimeViolations = [];
  runtimeFiles.forEach((filePath) => {
    const rel = normalizePath(root, filePath);
    const source = fs.readFileSync(filePath, "utf8");
    const matches = [...source.matchAll(/(?:from\s+["']|require\(\s*["'])([^"']+)(?:["'])/g)];
    matches.forEach((match) => {
      const target = String(match[1] || "");
      forbiddenPrefixes.forEach((prefix) => {
        if (target.includes(prefix)) {
          runtimeViolations.push({
            file: rel,
            import_target: target,
            forbidden_prefix: prefix
          });
        }
      });
    });
  });

  runtimeViolations.slice(0, 200).forEach((row) => {
    report.issues.push(
      issue("error", "runtime_imports_forbidden_storage", "runtime code imports from forbidden storage tier", row)
    );
  });

  const jsonFiles = listFilesRecursively(root, JSON_POLICY_SCAN_ROOTS, new Set([".json"]));
  let missingSchemaVersion = 0;
  jsonFiles.forEach((filePath) => {
    const rel = normalizePath(root, filePath);
    let parsed = {};
    try {
      parsed = readJson(filePath);
    } catch (error) {
      report.issues.push(issue("error", "invalid_policy_json", "failed to parse policy json", { file: rel, error: error.message }));
      return;
    }
    if (!Number.isFinite(Number(parsed.schema_version))) {
      missingSchemaVersion += 1;
      report.issues.push(
        issue(missingSchemaLevel, "missing_schema_version", "policy/catalog json is missing numeric schema_version", {
          file: rel
        })
      );
    }
  });

  report.metrics.storage = {
    runtime_files_scanned: runtimeFiles.length,
    forbidden_runtime_imports: runtimeViolations.length,
    policy_json_files_scanned: jsonFiles.length,
    policy_json_missing_schema_version: missingSchemaVersion
  };
}

function validateOptimizationPolicies(root, baseline, report) {
  const optimizationPolicy =
    baseline && baseline.optimization_policy && typeof baseline.optimization_policy === "object"
      ? baseline.optimization_policy
      : {};
  const thresholds =
    optimizationPolicy.thresholds && typeof optimizationPolicy.thresholds === "object"
      ? optimizationPolicy.thresholds
      : {};
  const requiredScripts = Array.isArray(optimizationPolicy.required_scripts)
    ? optimizationPolicy.required_scripts.map((item) => String(item || "").trim()).filter(Boolean)
    : [];

  const packageJsonPath = path.join(root, "package.json");
  if (!fs.existsSync(packageJsonPath)) {
    report.issues.push(issue("error", "missing_package_json", "package.json is required"));
    report.metrics.optimization = {
      package_scripts_checked: 0,
      benchmark_coverage_ratio: 0,
      efficiency_status: "unknown"
    };
    return;
  }

  const packageJson = readJson(packageJsonPath);
  const scripts = packageJson && packageJson.scripts && typeof packageJson.scripts === "object" ? packageJson.scripts : {};
  requiredScripts.forEach((scriptName) => {
    if (!scripts[scriptName]) {
      report.issues.push(
        issue("error", "missing_required_optimization_script", "required optimization script is missing", {
          script: scriptName
        })
      );
    }
  });

  const registryPath = path.resolve(root, WRAPPER_SYMBOL_REGISTRY_FILE);
  const benchmarkPath = path.resolve(root, BENCHMARK_CASES_FILE);
  let benchmarkCoverageRatio = 0;
  if (fs.existsSync(registryPath) && fs.existsSync(benchmarkPath)) {
    const registry = readJson(registryPath);
    const benchmarkDoc = readJson(benchmarkPath);
    const functionIds =
      registry &&
      registry.name_index &&
      Array.isArray(registry.name_index.function_ids)
        ? registry.name_index.function_ids.map((item) => String(item || "").trim()).filter(Boolean)
        : [];
    const benchmarkFunctionIds = new Set(
      Array.isArray(benchmarkDoc.cases)
        ? benchmarkDoc.cases.map((entry) => String((entry && entry.function_id) || "").trim()).filter(Boolean)
        : []
    );
    const covered = functionIds.filter((functionId) => benchmarkFunctionIds.has(functionId)).length;
    benchmarkCoverageRatio = functionIds.length > 0 ? covered / functionIds.length : 0;
    const requiredRatio = Number(thresholds.benchmark_min_function_coverage_ratio);
    if (Number.isFinite(requiredRatio) && benchmarkCoverageRatio < requiredRatio) {
      report.issues.push(
        issue(
          "error",
          "benchmark_function_coverage_below_threshold",
          "benchmark function coverage ratio is below executive baseline threshold",
          {
            covered_function_count: covered,
            total_function_count: functionIds.length,
            coverage_ratio: Number(benchmarkCoverageRatio.toFixed(4)),
            required_ratio: requiredRatio
          }
        )
      );
    }
  } else {
    report.issues.push(
      issue("error", "missing_benchmark_or_registry_file", "wrapper symbol registry and benchmark cases are required", {
        missing_registry: !fs.existsSync(registryPath),
        missing_benchmark_cases: !fs.existsSync(benchmarkPath)
      })
    );
  }

  const efficiencyReport = analyzeEfficiency(root, {
    maxFileTokens: 16000,
    maxSkillPromptTokens: Number(thresholds.max_skill_prompt_tokens || 72),
    maxAutomationPromptTokens: Number(thresholds.max_automation_prompt_tokens || 72),
    skipAutomations: true,
    codexHome: ""
  });
  if (efficiencyReport.status !== "pass") {
    const efficiencyErrors = Array.isArray(efficiencyReport.issues)
      ? efficiencyReport.issues.filter((entry) => entry.level === "error")
      : [];
    if (efficiencyErrors.length > 0) {
      report.issues.push(
        issue(
          "error",
          "efficiency_policy_violation",
          "codex efficiency audit failed executive optimization thresholds",
          {
            error_count: efficiencyErrors.length
          }
        )
      );
    }
  }

  report.metrics.optimization = {
    package_scripts_checked: requiredScripts.length,
    benchmark_coverage_ratio: Number(benchmarkCoverageRatio.toFixed(4)),
    efficiency_status: efficiencyReport.status
  };
}

function validateUiUxCatalog(uiuxCatalog, report) {
  const catalog = uiuxCatalog && typeof uiuxCatalog === "object" ? uiuxCatalog : {};
  const colorSystem =
    catalog.color_system && typeof catalog.color_system === "object" ? catalog.color_system : {};
  const semanticRoles = Array.isArray(colorSystem.semantic_roles) ? colorSystem.semantic_roles : [];
  const layout =
    catalog.layout_ergonomics && typeof catalog.layout_ergonomics === "object" ? catalog.layout_ergonomics : {};
  const preferences =
    catalog.user_preferences && typeof catalog.user_preferences === "object" ? catalog.user_preferences : {};
  const measurement =
    catalog.measurement_plan && typeof catalog.measurement_plan === "object" ? catalog.measurement_plan : {};
  const requiredSections = Array.isArray(catalog.required_blueprint_sections)
    ? catalog.required_blueprint_sections
    : [];

  if (!Number.isFinite(Number(catalog.schema_version))) {
    report.issues.push(
      issue("error", "invalid_uiux_catalog_schema_version", "ui ux blueprint catalog schema_version must be numeric")
    );
  }

  if (semanticRoles.length < 5) {
    report.issues.push(
      issue("error", "insufficient_uiux_semantic_roles", "ui ux blueprint catalog must define at least five semantic color roles", {
        role_count: semanticRoles.length
      })
    );
  }

  const roleIds = new Set();
  semanticRoles.forEach((role) => {
    const roleId = String((role && role.role_id) || "").trim().toLowerCase();
    if (!roleId) {
      report.issues.push(issue("error", "uiux_semantic_role_missing_id", "semantic color role is missing role_id"));
      return;
    }
    if (roleIds.has(roleId)) {
      report.issues.push(
        issue("error", "uiux_semantic_role_duplicate_id", "semantic color role ids must be unique", {
          role_id: roleId
        })
      );
    } else {
      roleIds.add(roleId);
    }
    if (!String((role && role.psychological_goal) || "").trim()) {
      report.issues.push(
        issue("warn", "uiux_semantic_role_missing_psychology", "semantic color role should define psychological_goal", {
          role_id: roleId
        })
      );
    }
  });

  const minTargetSize = Number(layout.target_size_min_css_px);
  if (!Number.isFinite(minTargetSize) || minTargetSize < 24) {
    report.issues.push(
      issue(
        "error",
        "uiux_layout_target_size_invalid",
        "layout_ergonomics.target_size_min_css_px must be numeric and at least 24"
      )
    );
  }

  const requiredFeatures = new Set(
    (Array.isArray(preferences.required_media_features) ? preferences.required_media_features : [])
      .map((entry) => String(entry || "").trim().toLowerCase())
      .filter(Boolean)
  );
  ["prefers-color-scheme", "prefers-contrast", "prefers-reduced-motion", "prefers-reduced-data", "forced-colors"].forEach(
    (feature) => {
      if (!requiredFeatures.has(feature)) {
        report.issues.push(
          issue(
            "error",
            "uiux_missing_required_media_feature",
            "ui ux blueprint catalog is missing required media feature",
            {
              feature
            }
          )
        );
      }
    }
  );

  const coreMetrics = Array.isArray(measurement.core_metrics) ? measurement.core_metrics : [];
  if (coreMetrics.length < 5) {
    report.issues.push(
      issue("error", "uiux_insufficient_core_metrics", "measurement_plan.core_metrics must include at least five metrics", {
        metric_count: coreMetrics.length
      })
    );
  }

  if (requiredSections.length < 6) {
    report.issues.push(
      issue(
        "warn",
        "uiux_required_blueprint_sections_short",
        "required_blueprint_sections should include at least six sections",
        {
          count: requiredSections.length
        }
      )
    );
  }

  report.metrics.ui_ux = {
    semantic_roles: semanticRoles.length,
    unique_role_ids: roleIds.size,
    min_target_size_css_px: Number.isFinite(minTargetSize) ? minTargetSize : 0,
    required_media_features: requiredFeatures.size,
    core_metrics: coreMetrics.length,
    required_blueprint_sections: requiredSections.length
  };
}

function buildRecommendations(report) {
  const recommendations = [];
  if (report.issues.some((entry) => entry.type === "filename_style_violation")) {
    recommendations.push("Normalize runtime filenames to snake_case and reserve kebab-case for scripts only.");
  }
  if (report.issues.some((entry) => entry.type === "runtime_imports_forbidden_storage")) {
    recommendations.push("Move runtime imports from data/output/* to data/input/shared/* catalogs.");
  }
  if (report.issues.some((entry) => entry.type === "efficiency_policy_violation")) {
    recommendations.push("Reduce skill prompt tokens and centralize repeated guardrails through scope-sync constants.");
  }
  if (report.issues.some((entry) => entry.type === "benchmark_function_coverage_below_threshold")) {
    recommendations.push("Add benchmark cases until function coverage meets baseline ratio.");
  }
  if (report.issues.some((entry) => entry.type.startsWith("uiux_") || entry.type.includes("_uiux_"))) {
    recommendations.push("Fix UI UX catalog coverage for semantics, ergonomics, preferences, and measurement baselines.");
  }
  if (recommendations.length === 0) {
    recommendations.push("Keep executive baseline gate in enforce mode for all workflow and refactor runs.");
  }
  return recommendations;
}

function analyze(root, args = {}) {
  const baselinePath = path.resolve(root, args.baselineFile || DEFAULT_BASELINE_FILE);
  const standardsPath = path.resolve(root, args.standardsFile || DEFAULT_STANDARDS_FILE);
  const isoTraceabilityPath = path.resolve(root, args.isoTraceabilityFile || DEFAULT_ISO_TRACEABILITY_FILE);
  const uiuxCatalogPath = path.resolve(root, args.uiuxCatalogFile || DEFAULT_UIUX_CATALOG_FILE);

  const report = {
    status: "pass",
    generated_at: new Date().toISOString(),
    root,
    files: {
      baseline: normalizePath(root, baselinePath),
      standards_catalog: normalizePath(root, standardsPath),
      iso_traceability_catalog: normalizePath(root, isoTraceabilityPath),
      uiux_catalog: normalizePath(root, uiuxCatalogPath),
      wrapper_symbol_registry: WRAPPER_SYMBOL_REGISTRY_FILE.replace(/\\/g, "/"),
      runtime_benchmark_cases: BENCHMARK_CASES_FILE.replace(/\\/g, "/")
    },
    metrics: {},
    issues: [],
    recommendations: []
  };

  if (!fs.existsSync(baselinePath)) {
    report.issues.push(issue("error", "missing_baseline_catalog", "executive engineering baseline file is missing"));
  }
  if (!fs.existsSync(standardsPath)) {
    report.issues.push(issue("error", "missing_standards_catalog", "polyglot engineering standards catalog file is missing"));
  }
  if (!fs.existsSync(isoTraceabilityPath)) {
    report.issues.push(issue("error", "missing_iso_traceability_catalog", "iso standards traceability catalog file is missing"));
  }
  if (!fs.existsSync(uiuxCatalogPath)) {
    report.issues.push(issue("error", "missing_uiux_catalog", "ui ux blueprint catalog file is missing"));
  }
  if (report.issues.some((entry) => entry.level === "error")) {
    report.metrics = {
      naming: { files_scanned: 0, styles: {}, hard_violations: 0, legacy_hits: 0 },
      symbol_registry: { function_ids: 0, object_names: 0, symbol_names: 0, const_names: 0 },
      storage: {
        runtime_files_scanned: 0,
        forbidden_runtime_imports: 0,
        policy_json_files_scanned: 0,
        policy_json_missing_schema_version: 0
      },
      optimization: { package_scripts_checked: 0, benchmark_coverage_ratio: 0, efficiency_status: "unknown" },
      ui_ux: {
        semantic_roles: 0,
        unique_role_ids: 0,
        min_target_size_css_px: 0,
        required_media_features: 0,
        core_metrics: 0,
        required_blueprint_sections: 0
      }
    };
    report.recommendations = buildRecommendations(report);
    report.status = "fail";
    return report;
  }

  const baseline = readJson(baselinePath);
  const standardsCatalog = readJson(standardsPath);
  const isoTraceabilityCatalog = readJson(isoTraceabilityPath);
  const uiuxCatalog = readJson(uiuxCatalogPath);

  if (!Number.isFinite(Number(baseline.schema_version))) {
    report.issues.push(issue("error", "invalid_baseline_schema_version", "baseline.schema_version must be numeric"));
  }
  if (!Number.isFinite(Number(standardsCatalog.schema_version))) {
    report.issues.push(issue("error", "invalid_standards_catalog_schema_version", "standards catalog schema_version must be numeric"));
  }
  if (!Number.isFinite(Number(isoTraceabilityCatalog.schema_version))) {
    report.issues.push(
      issue("error", "invalid_iso_traceability_schema_version", "iso traceability catalog schema_version must be numeric")
    );
  }
  if (!Number.isFinite(Number(uiuxCatalog.schema_version))) {
    report.issues.push(issue("error", "invalid_uiux_schema_version", "ui ux blueprint catalog schema_version must be numeric"));
  }

  if (!Array.isArray(isoTraceabilityCatalog.standards) || isoTraceabilityCatalog.standards.length < 10) {
    report.issues.push(
      issue("error", "iso_traceability_insufficient_coverage", "iso traceability catalog must include at least 10 standards")
    );
  }

  collectNamingMetrics(root, baseline, report);
  validateSymbolRegistry(root, report);
  validateStoragePolicies(root, baseline, report);
  validateOptimizationPolicies(root, baseline, report);
  validateUiUxCatalog(uiuxCatalog, report);

  report.recommendations = buildRecommendations(report);
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
  if (args.strict && args.enforce && report.status !== "pass") {
    process.exit(1);
  }
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    process.stderr.write(`standards-baseline-gate failed: ${error.message}\n`);
    process.exit(1);
  }
}

module.exports = {
  analyze,
  classifyBaseName
};
