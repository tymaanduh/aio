#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { findProjectRoot } = require("./project-source-resolver");
const { analyze: analyzeEfficiency } = require("./codex-efficiency-audit");
const { writeTextFileRobust } = require("./lib/robust-file-write");

const DEFAULT_REPORT_FILE = path.join(
  "data",
  "output",
  "databases",
  "polyglot-default",
  "analysis",
  "standards_baseline_report.json"
);
const DEFAULT_BASELINE_FILE = path.join("data", "input", "shared", "main", "executive_engineering_baseline.json");
const DEFAULT_STANDARDS_FILE = path.join(
  "data",
  "input",
  "shared",
  "main",
  "polyglot_engineering_standards_catalog.json"
);
const DEFAULT_ISO_TRACEABILITY_FILE = path.join(
  "data",
  "input",
  "shared",
  "main",
  "iso_standards_traceability_catalog.json"
);
const DEFAULT_UIUX_CATALOG_FILE = path.join("data", "input", "shared", "main", "ui_ux_blueprint_catalog.json");
const DEFAULT_UI_COMPONENT_CATALOG_FILE = path.join(
  "data",
  "input",
  "shared",
  "main",
  "ui_component_blueprint_catalog.json"
);
const DEFAULT_RENDERING_POLICY_CATALOG_FILE = path.join(
  "data",
  "input",
  "shared",
  "main",
  "rendering_runtime_policy_catalog.json"
);
const DEFAULT_SEARCH_POLICY_CATALOG_FILE = path.join(
  "data",
  "input",
  "shared",
  "main",
  "search_strategy_routing_catalog.json"
);
const DEFAULT_MEMORY_POLICY_CATALOG_FILE = path.join(
  "data",
  "input",
  "shared",
  "main",
  "memory_data_lifecycle_policy_catalog.json"
);
const DEFAULT_AI_AUTOMATION_POLICY_CATALOG_FILE = path.join(
  "data",
  "input",
  "shared",
  "main",
  "ai_automation_safety_speech_catalog.json"
);
const DEFAULT_TOKEN_POLICY_CATALOG_FILE = path.join(
  "data",
  "input",
  "shared",
  "main",
  "token_usage_optimization_policy_catalog.json"
);
const WRAPPER_SYMBOL_REGISTRY_FILE = path.join("data", "input", "shared", "wrapper", "wrapper_symbol_registry.json");
const BENCHMARK_CASES_FILE = path.join("data", "input", "shared", "wrapper", "runtime_benchmark_cases.json");
const DEFAULT_RUNTIME_BENCHMARK_REPORT_FILE = path.join(
  "data",
  "output",
  "databases",
  "polyglot-default",
  "reports",
  "polyglot_runtime_benchmark_report.json"
);
const DEFAULT_RUNTIME_WINNER_MAP_FILE = path.join(
  "data",
  "output",
  "databases",
  "polyglot-default",
  "reports",
  "polyglot_runtime_winner_map.json"
);
const DEFAULT_SCRIPT_RUNTIME_SWAP_REPORT_FILE = path.join(
  "data",
  "output",
  "databases",
  "polyglot-default",
  "analysis",
  "script_runtime_swap_report.json"
);

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
    uiuxCatalogFile: "",
    uiComponentCatalogFile: "",
    renderingPolicyCatalogFile: "",
    searchPolicyCatalogFile: "",
    memoryPolicyCatalogFile: "",
    aiAutomationPolicyCatalogFile: "",
    tokenPolicyCatalogFile: ""
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
    if (token === "--ui-component-catalog-file" && argv[index + 1]) {
      args.uiComponentCatalogFile = String(argv[index + 1]).trim();
      index += 1;
      continue;
    }
    if (token === "--rendering-policy-catalog-file" && argv[index + 1]) {
      args.renderingPolicyCatalogFile = String(argv[index + 1]).trim();
      index += 1;
      continue;
    }
    if (token === "--search-policy-catalog-file" && argv[index + 1]) {
      args.searchPolicyCatalogFile = String(argv[index + 1]).trim();
      index += 1;
      continue;
    }
    if (token === "--memory-policy-catalog-file" && argv[index + 1]) {
      args.memoryPolicyCatalogFile = String(argv[index + 1]).trim();
      index += 1;
      continue;
    }
    if (token === "--ai-automation-policy-catalog-file" && argv[index + 1]) {
      args.aiAutomationPolicyCatalogFile = String(argv[index + 1]).trim();
      index += 1;
      continue;
    }
    if (token === "--token-policy-catalog-file" && argv[index + 1]) {
      args.tokenPolicyCatalogFile = String(argv[index + 1]).trim();
      index += 1;
      continue;
    }
  }

  return args;
}

function normalizePath(root, absolutePath) {
  return String(path.relative(root, absolutePath)).replace(/\\/g, "/");
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
  const scriptPolicy =
    namingPolicy.script_root && typeof namingPolicy.script_root === "object" ? namingPolicy.script_root : {};

  const runtimeRoots = Array.isArray(runtimePolicy.roots) ? runtimePolicy.roots : [];
  const scriptRoots = Array.isArray(scriptPolicy.roots) ? scriptPolicy.roots : ["scripts"];

  const files = listFilesRecursively(root, [...runtimeRoots, ...scriptRoots], SOURCE_FILE_EXTENSIONS);
  const caseCounts = new Map();
  const runtimeAllowed = new Set(
    Array.isArray(runtimePolicy.allowed_cases) ? runtimePolicy.allowed_cases : ["snake_case"]
  );
  const runtimeLegacy = new Set(
    Array.isArray(runtimePolicy.legacy_allowed_cases) ? runtimePolicy.legacy_allowed_cases : []
  );
  const scriptAllowed = new Set(
    Array.isArray(scriptPolicy.allowed_cases) ? scriptPolicy.allowed_cases : ["snake_case", "kebab-case"]
  );

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
      report.issues.push(
        issue("error", "invalid_function_id_format", "function_id must be lower dot namespace format", { value: item })
      );
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
        report.issues.push(
          issue("error", `invalid_${type}_format`, `${type} must be lower_snake_case`, { value: item })
        );
      }
      const key = item.toLowerCase();
      if (local.has(key)) {
        report.issues.push(
          issue("error", `duplicate_${type}`, `${type} must be unique (case-insensitive)`, { value: item })
        );
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
      report.issues.push(
        issue("error", "invalid_const_name_format", "const_names must be UPPER_SNAKE_CASE", { value: item })
      );
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
    String(catalogRequirements.legacy_missing_schema_level || "error")
      .trim()
      .toLowerCase() === "warn"
      ? "warn"
      : "error";

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
      report.issues.push(
        issue("error", "invalid_policy_json", "failed to parse policy json", { file: rel, error: error.message })
      );
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

function validateOptimizationPolicies(root, baseline, tokenPolicy, report) {
  const optimizationPolicy =
    baseline && baseline.optimization_policy && typeof baseline.optimization_policy === "object"
      ? baseline.optimization_policy
      : {};
  const baselineThresholds =
    optimizationPolicy.thresholds && typeof optimizationPolicy.thresholds === "object"
      ? optimizationPolicy.thresholds
      : {};
  const tokenBudgets =
    tokenPolicy && tokenPolicy.token_budgets && typeof tokenPolicy.token_budgets === "object"
      ? tokenPolicy.token_budgets
      : {};
  const tokenRegressions =
    tokenPolicy && tokenPolicy.regression_limits && typeof tokenPolicy.regression_limits === "object"
      ? tokenPolicy.regression_limits
      : {};
  const requiredScripts = Array.isArray(optimizationPolicy.required_scripts)
    ? optimizationPolicy.required_scripts.map((item) => String(item || "").trim()).filter(Boolean)
    : [];

  const maxFileTokens = Number(tokenBudgets.max_file_tokens || baselineThresholds.max_file_tokens || 16000);
  const maxSkillPromptTokens = Number(
    tokenBudgets.max_skill_prompt_tokens || baselineThresholds.max_skill_prompt_tokens || 72
  );
  const maxAutomationPromptTokens = Number(
    tokenBudgets.max_automation_prompt_tokens || baselineThresholds.max_automation_prompt_tokens || 72
  );
  const maxTotalTokensEstimate = Number(
    tokenBudgets.max_total_tokens_estimate || baselineThresholds.max_total_tokens_estimate || 0
  );
  const maxScopeGuardrailDuplicateCount = Number(
    tokenBudgets.max_scope_guardrail_duplicate_count || baselineThresholds.max_scope_guardrail_duplicate_count || 0
  );
  const maxTotalTokenIncrease = Number(tokenRegressions.max_total_token_increase || 0);
  const maxTotalTokenIncreasePercent = Number(tokenRegressions.max_total_token_increase_percent || 0);
  const maxPerFileTokenIncrease = Number(tokenRegressions.max_per_file_token_increase || 0);

  const packageJsonPath = path.join(root, "package.json");
  if (!fs.existsSync(packageJsonPath)) {
    report.issues.push(issue("error", "missing_package_json", "package.json is required"));
    report.metrics.optimization = {
      package_scripts_checked: 0,
      benchmark_coverage_ratio: 0,
      benchmark_case_count: 0,
      efficiency_status: "unknown",
      token_budgets: {}
    };
    return;
  }

  const packageJson = readJson(packageJsonPath);
  const scripts =
    packageJson && packageJson.scripts && typeof packageJson.scripts === "object" ? packageJson.scripts : {};
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
  let benchmarkCaseCount = 0;
  if (fs.existsSync(registryPath) && fs.existsSync(benchmarkPath)) {
    const registry = readJson(registryPath);
    const benchmarkDoc = readJson(benchmarkPath);
    const functionIds =
      registry && registry.name_index && Array.isArray(registry.name_index.function_ids)
        ? registry.name_index.function_ids.map((item) => String(item || "").trim()).filter(Boolean)
        : [];
    const benchmarkFunctionIds = new Set(
      Array.isArray(benchmarkDoc.cases)
        ? benchmarkDoc.cases.map((entry) => String((entry && entry.function_id) || "").trim()).filter(Boolean)
        : []
    );
    benchmarkCaseCount = Array.isArray(benchmarkDoc.cases) ? benchmarkDoc.cases.length : 0;
    const covered = functionIds.filter((functionId) => benchmarkFunctionIds.has(functionId)).length;
    benchmarkCoverageRatio = functionIds.length > 0 ? covered / functionIds.length : 0;
    const requiredRatio = Number(baselineThresholds.benchmark_min_function_coverage_ratio);
    const requiredCaseCount = Number(baselineThresholds.benchmark_min_case_count);
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
    if (Number.isFinite(requiredCaseCount) && benchmarkCaseCount < requiredCaseCount) {
      report.issues.push(
        issue(
          "error",
          "benchmark_case_count_below_threshold",
          "benchmark case count is below executive baseline threshold",
          {
            benchmark_case_count: benchmarkCaseCount,
            required_case_count: requiredCaseCount
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
    maxFileTokens,
    maxSkillPromptTokens,
    maxAutomationPromptTokens,
    maxTotalTokensEstimate:
      Number.isFinite(maxTotalTokensEstimate) && maxTotalTokensEstimate > 0 ? maxTotalTokensEstimate : null,
    maxScopeGuardrailDuplicateCount:
      Number.isFinite(maxScopeGuardrailDuplicateCount) && maxScopeGuardrailDuplicateCount > 0
        ? maxScopeGuardrailDuplicateCount
        : null,
    maxTotalTokenIncrease:
      Number.isFinite(maxTotalTokenIncrease) && maxTotalTokenIncrease > 0 ? maxTotalTokenIncrease : null,
    maxTotalTokenIncreasePercent:
      Number.isFinite(maxTotalTokenIncreasePercent) && maxTotalTokenIncreasePercent > 0
        ? maxTotalTokenIncreasePercent
        : null,
    maxPerFileTokenIncrease:
      Number.isFinite(maxPerFileTokenIncrease) && maxPerFileTokenIncrease > 0 ? maxPerFileTokenIncrease : null,
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
    benchmark_case_count: benchmarkCaseCount,
    efficiency_status: efficiencyReport.status,
    token_budgets: {
      max_file_tokens: maxFileTokens,
      max_skill_prompt_tokens: maxSkillPromptTokens,
      max_automation_prompt_tokens: maxAutomationPromptTokens,
      max_total_tokens_estimate:
        Number.isFinite(maxTotalTokensEstimate) && maxTotalTokensEstimate > 0 ? maxTotalTokensEstimate : 0,
      max_scope_guardrail_duplicate_count:
        Number.isFinite(maxScopeGuardrailDuplicateCount) && maxScopeGuardrailDuplicateCount > 0
          ? maxScopeGuardrailDuplicateCount
          : 0
    },
    token_regression_limits: {
      max_total_token_increase:
        Number.isFinite(maxTotalTokenIncrease) && maxTotalTokenIncrease > 0 ? maxTotalTokenIncrease : 0,
      max_total_token_increase_percent:
        Number.isFinite(maxTotalTokenIncreasePercent) && maxTotalTokenIncreasePercent > 0
          ? maxTotalTokenIncreasePercent
          : 0,
      max_per_file_token_increase:
        Number.isFinite(maxPerFileTokenIncrease) && maxPerFileTokenIncrease > 0 ? maxPerFileTokenIncrease : 0
    }
  };
}

function validateUiUxCatalog(uiuxCatalog, report) {
  const catalog = uiuxCatalog && typeof uiuxCatalog === "object" ? uiuxCatalog : {};
  const colorSystem = catalog.color_system && typeof catalog.color_system === "object" ? catalog.color_system : {};
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
      issue(
        "error",
        "insufficient_uiux_semantic_roles",
        "ui ux blueprint catalog must define at least five semantic color roles",
        {
          role_count: semanticRoles.length
        }
      )
    );
  }

  const roleIds = new Set();
  semanticRoles.forEach((role) => {
    const roleId = String((role && role.role_id) || "")
      .trim()
      .toLowerCase();
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
      .map((entry) =>
        String(entry || "")
          .trim()
          .toLowerCase()
      )
      .filter(Boolean)
  );
  [
    "prefers-color-scheme",
    "prefers-contrast",
    "prefers-reduced-motion",
    "prefers-reduced-data",
    "forced-colors"
  ].forEach((feature) => {
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
  });

  const coreMetrics = Array.isArray(measurement.core_metrics) ? measurement.core_metrics : [];
  if (coreMetrics.length < 5) {
    report.issues.push(
      issue(
        "error",
        "uiux_insufficient_core_metrics",
        "measurement_plan.core_metrics must include at least five metrics",
        {
          metric_count: coreMetrics.length
        }
      )
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

function validateFutureRoadmapCatalogs(catalogs, report) {
  const uiComponents =
    catalogs && catalogs.uiComponents && typeof catalogs.uiComponents === "object" ? catalogs.uiComponents : {};
  const rendering = catalogs && catalogs.rendering && typeof catalogs.rendering === "object" ? catalogs.rendering : {};
  const search = catalogs && catalogs.search && typeof catalogs.search === "object" ? catalogs.search : {};
  const memory = catalogs && catalogs.memory && typeof catalogs.memory === "object" ? catalogs.memory : {};
  const automation =
    catalogs && catalogs.automation && typeof catalogs.automation === "object" ? catalogs.automation : {};

  const schemaChecks = [
    { id: "ui_component_blueprint", doc: uiComponents },
    { id: "rendering_runtime_policy", doc: rendering },
    { id: "search_strategy_routing", doc: search },
    { id: "memory_data_lifecycle_policy", doc: memory },
    { id: "ai_automation_safety_speech", doc: automation }
  ];
  schemaChecks.forEach((entry) => {
    if (!Number.isFinite(Number(entry.doc && entry.doc.schema_version))) {
      report.issues.push(
        issue(
          "error",
          "invalid_future_policy_catalog_schema_version",
          "future roadmap policy catalog schema_version must be numeric",
          {
            catalog: entry.id
          }
        )
      );
    }
  });

  const categories = Array.isArray(uiComponents.component_categories) ? uiComponents.component_categories : [];
  const requiredCategorySet = new Set(["boxes", "forms", "grids", "navigation", "state_messaging", "error_recovery"]);
  const seenCategorySet = new Set();
  categories.forEach((entry) => {
    const categoryId = String(entry && entry.category_id ? entry.category_id : "")
      .trim()
      .toLowerCase();
    if (!categoryId) {
      report.issues.push(
        issue("error", "ui_component_category_missing_id", "ui component taxonomy category is missing category_id")
      );
      return;
    }
    seenCategorySet.add(categoryId);
    const requiredComponents = Array.isArray(entry.required_components) ? entry.required_components : [];
    const contracts = Array.isArray(entry.contracts) ? entry.contracts : [];
    if (requiredComponents.length === 0) {
      report.issues.push(
        issue(
          "error",
          "ui_component_category_missing_components",
          "ui component taxonomy category must define required_components",
          {
            category_id: categoryId
          }
        )
      );
    }
    if (contracts.length === 0) {
      report.issues.push(
        issue(
          "error",
          "ui_component_category_missing_contracts",
          "ui component taxonomy category must define contracts",
          {
            category_id: categoryId
          }
        )
      );
    }
  });
  requiredCategorySet.forEach((categoryId) => {
    if (!seenCategorySet.has(categoryId)) {
      report.issues.push(
        issue(
          "error",
          "missing_required_ui_component_category",
          "ui component blueprint catalog is missing required category",
          {
            category_id: categoryId
          }
        )
      );
    }
  });

  const layoutFoundation =
    uiComponents.layout_foundation && typeof uiComponents.layout_foundation === "object"
      ? uiComponents.layout_foundation
      : {};
  const minUiTargetSize = Number(layoutFoundation.minimum_target_size_css_px);
  if (!Number.isFinite(minUiTargetSize) || minUiTargetSize < 24) {
    report.issues.push(
      issue(
        "error",
        "ui_component_layout_target_size_invalid",
        "ui component layout foundation minimum_target_size_css_px must be numeric and at least 24"
      )
    );
  }

  const pivot =
    rendering.rendering_pivot && typeof rendering.rendering_pivot === "object" ? rendering.rendering_pivot : {};
  const primaryBackend = String(pivot.primary_backend || "")
    .trim()
    .toLowerCase();
  const fallbackBackends = new Set(
    (Array.isArray(pivot.fallback_backends) ? pivot.fallback_backends : [])
      .map((entry) =>
        String(entry || "")
          .trim()
          .toLowerCase()
      )
      .filter(Boolean)
  );
  if (!primaryBackend) {
    report.issues.push(
      issue(
        "error",
        "rendering_primary_backend_missing",
        "rendering runtime policy must define rendering_pivot.primary_backend"
      )
    );
  }
  if (!fallbackBackends.has("webgl") && !fallbackBackends.has("canvas")) {
    report.issues.push(
      issue("error", "rendering_fallback_missing", "rendering runtime policy requires webgl or canvas fallback backend")
    );
  }

  const sceneInterchange =
    rendering.scene_interchange && typeof rendering.scene_interchange === "object" ? rendering.scene_interchange : {};
  const primaryFormat = String(sceneInterchange.primary_format || "")
    .trim()
    .toLowerCase();
  if (!primaryFormat.includes("gltf")) {
    report.issues.push(
      issue(
        "error",
        "rendering_scene_interchange_format_invalid",
        "rendering scene_interchange.primary_format must be gltf-compatible"
      )
    );
  }

  const budgets =
    rendering.performance_budgets && typeof rendering.performance_budgets === "object"
      ? rendering.performance_budgets
      : {};
  const fpsTarget = Number(budgets.fps_target);
  const frameP95 = Number(budgets.frame_time_p95_ms);
  const frameP99 = Number(budgets.frame_time_p99_ms);
  if (!Number.isFinite(fpsTarget) || fpsTarget < 30) {
    report.issues.push(
      issue("error", "rendering_fps_target_invalid", "rendering fps_target must be numeric and at least 30")
    );
  }
  if (!Number.isFinite(frameP95) || frameP95 <= 0) {
    report.issues.push(
      issue("error", "rendering_frame_time_p95_invalid", "rendering frame_time_p95_ms must be numeric and > 0")
    );
  }
  if (!Number.isFinite(frameP99) || frameP99 <= 0) {
    report.issues.push(
      issue("error", "rendering_frame_time_p99_invalid", "rendering frame_time_p99_ms must be numeric and > 0")
    );
  }

  const retrievalLayers =
    search.retrieval_layers && typeof search.retrieval_layers === "object" ? search.retrieval_layers : {};
  ["lexical", "vector", "graph"].forEach((layerId) => {
    const layer =
      retrievalLayers[layerId] && typeof retrievalLayers[layerId] === "object" ? retrievalLayers[layerId] : {};
    if (layer.required !== true) {
      report.issues.push(
        issue(
          "error",
          "search_required_layer_missing",
          "search strategy routing must require lexical/vector/graph retrieval layers",
          {
            layer: layerId
          }
        )
      );
    }
  });
  const queryRouting = Array.isArray(search.query_routing_policy) ? search.query_routing_policy : [];
  const requiredQueryTypes = new Set(["exact", "prefix", "fuzzy", "semantic", "path"]);
  const seenQueryTypes = new Set();
  queryRouting.forEach((entry) => {
    const queryType = String(entry && entry.query_type ? entry.query_type : "")
      .trim()
      .toLowerCase();
    if (!queryType) {
      return;
    }
    seenQueryTypes.add(queryType);
    const pipeline = Array.isArray(entry.pipeline) ? entry.pipeline : [];
    if (pipeline.length === 0) {
      report.issues.push(
        issue("error", "search_query_pipeline_missing", "search routing entry must define pipeline", {
          query_type: queryType
        })
      );
    }
  });
  requiredQueryTypes.forEach((queryType) => {
    if (!seenQueryTypes.has(queryType)) {
      report.issues.push(
        issue("error", "search_required_query_type_missing", "search strategy routing missing required query type", {
          query_type: queryType
        })
      );
    }
  });

  const subsystemBudgets = Array.isArray(memory.subsystem_budgets) ? memory.subsystem_budgets : [];
  if (subsystemBudgets.length < 3) {
    report.issues.push(
      issue(
        "error",
        "memory_subsystem_budget_short",
        "memory lifecycle policy must define at least three subsystem budgets",
        {
          count: subsystemBudgets.length
        }
      )
    );
  }
  subsystemBudgets.forEach((entry) => {
    const subsystemId = String(entry && entry.subsystem_id ? entry.subsystem_id : "").trim();
    const maxMemory = Number(entry && entry.max_memory_mb);
    if (!subsystemId) {
      report.issues.push(
        issue("error", "memory_subsystem_id_missing", "memory subsystem budget is missing subsystem_id")
      );
    }
    if (!Number.isFinite(maxMemory) || maxMemory <= 0) {
      report.issues.push(
        issue(
          "error",
          "memory_subsystem_max_memory_invalid",
          "memory subsystem max_memory_mb must be numeric and > 0",
          {
            subsystem_id: subsystemId || "unknown"
          }
        )
      );
    }
  });
  const cacheTiering = memory.cache_tiering && typeof memory.cache_tiering === "object" ? memory.cache_tiering : {};
  ["hot", "warm", "cold"].forEach((tierId) => {
    if (!cacheTiering[tierId] || typeof cacheTiering[tierId] !== "object") {
      report.issues.push(
        issue("error", "memory_cache_tier_missing", "memory cache_tiering must include hot/warm/cold tiers", {
          tier: tierId
        })
      );
    }
  });

  const automationRuntime =
    automation.automation_runtime_policy && typeof automation.automation_runtime_policy === "object"
      ? automation.automation_runtime_policy
      : {};
  if (
    String(automationRuntime.mode || "")
      .trim()
      .toLowerCase() !== "policy_gated_autonomy"
  ) {
    report.issues.push(
      issue(
        "error",
        "automation_runtime_mode_invalid",
        "ai automation safety policy must set mode to policy_gated_autonomy"
      )
    );
  }
  if (automationRuntime.tool_allowlist_required !== true) {
    report.issues.push(
      issue(
        "error",
        "automation_tool_allowlist_not_required",
        "ai automation safety policy must require tool allowlist"
      )
    );
  }
  const maxPromptTokens = Number(automationRuntime.max_prompt_tokens);
  if (!Number.isFinite(maxPromptTokens) || maxPromptTokens > 36) {
    report.issues.push(
      issue(
        "error",
        "automation_max_prompt_tokens_invalid",
        "ai automation safety policy max_prompt_tokens must be numeric and <= 36"
      )
    );
  }

  const securityControls =
    automation.security_controls && typeof automation.security_controls === "object"
      ? automation.security_controls
      : {};
  const requiredControls = Array.isArray(securityControls.required_controls) ? securityControls.required_controls : [];
  if (requiredControls.length < 4) {
    report.issues.push(
      issue(
        "error",
        "automation_security_controls_short",
        "ai automation security controls must define at least four required controls"
      )
    );
  }
  const speechPolicy =
    automation.speech_interaction_policy && typeof automation.speech_interaction_policy === "object"
      ? automation.speech_interaction_policy
      : {};
  if (
    String(speechPolicy.turn_detection || "")
      .trim()
      .toLowerCase() !== "vad_required"
  ) {
    report.issues.push(
      issue(
        "error",
        "speech_turn_detection_policy_invalid",
        "speech interaction policy must require vad turn detection"
      )
    );
  }
  const dataBoundary =
    automation.data_boundary_policy && typeof automation.data_boundary_policy === "object"
      ? automation.data_boundary_policy
      : {};
  if (
    String(dataBoundary.mode || "")
      .trim()
      .toLowerCase() !== "local_first_controlled_egress"
  ) {
    report.issues.push(
      issue(
        "error",
        "automation_data_boundary_policy_invalid",
        "ai automation safety policy must enforce local_first_controlled_egress"
      )
    );
  }

  report.metrics.future_catalogs = {
    ui_component_categories: categories.length,
    rendering_fallback_backends: fallbackBackends.size,
    search_query_routes: queryRouting.length,
    memory_subsystem_budgets: subsystemBudgets.length,
    automation_security_controls: requiredControls.length
  };
}

function validateTokenUsagePolicyCatalog(tokenPolicy, report) {
  const catalog = tokenPolicy && typeof tokenPolicy === "object" ? tokenPolicy : {};
  if (!Number.isFinite(Number(catalog.schema_version))) {
    report.issues.push(
      issue("error", "invalid_token_policy_schema_version", "token usage policy catalog schema_version must be numeric")
    );
  }

  const budgets = catalog.token_budgets && typeof catalog.token_budgets === "object" ? catalog.token_budgets : {};
  const regressions =
    catalog.regression_limits && typeof catalog.regression_limits === "object" ? catalog.regression_limits : {};
  const promptPolicy =
    catalog.prompt_template_policy && typeof catalog.prompt_template_policy === "object"
      ? catalog.prompt_template_policy
      : {};
  const automationPolicy =
    catalog.automation_prompt_policy && typeof catalog.automation_prompt_policy === "object"
      ? catalog.automation_prompt_policy
      : {};

  const maxSkill = Number(budgets.max_skill_prompt_tokens);
  const maxAutomation = Number(budgets.max_automation_prompt_tokens);
  const maxTotal = Number(budgets.max_total_tokens_estimate);
  const maxScopeDuplicate = Number(budgets.max_scope_guardrail_duplicate_count);
  const maxRegression = Number(regressions.max_total_token_increase);
  const maxRegressionPercent = Number(regressions.max_total_token_increase_percent);
  const maxPerFileRegression = Number(regressions.max_per_file_token_increase);
  const outputCapMarker = String(automationPolicy.required_output_cap_marker || "").trim();
  const maxExpectedAutomationOutputTokens = Number(automationPolicy.max_expected_output_tokens);

  if (!Number.isFinite(maxSkill) || maxSkill > 24) {
    report.issues.push(
      issue(
        "error",
        "token_policy_max_skill_prompt_tokens_invalid",
        "token usage policy max_skill_prompt_tokens must be numeric and <= 24"
      )
    );
  }
  if (!Number.isFinite(maxAutomation) || maxAutomation > 36) {
    report.issues.push(
      issue(
        "error",
        "token_policy_max_automation_prompt_tokens_invalid",
        "token usage policy max_automation_prompt_tokens must be numeric and <= 36"
      )
    );
  }
  if (!Number.isFinite(maxTotal) || maxTotal <= 0) {
    report.issues.push(
      issue(
        "error",
        "token_policy_max_total_tokens_invalid",
        "token usage policy max_total_tokens_estimate must be numeric and > 0"
      )
    );
  }
  if (!Number.isFinite(maxScopeDuplicate) || maxScopeDuplicate <= 0) {
    report.issues.push(
      issue(
        "error",
        "token_policy_scope_duplicate_budget_invalid",
        "token usage policy max_scope_guardrail_duplicate_count must be numeric and > 0"
      )
    );
  }
  if (!Number.isFinite(maxRegression) || maxRegression <= 0) {
    report.issues.push(
      issue(
        "error",
        "token_policy_total_regression_limit_invalid",
        "token usage policy max_total_token_increase must be numeric and > 0"
      )
    );
  }
  if (!Number.isFinite(maxRegressionPercent) || maxRegressionPercent <= 0) {
    report.issues.push(
      issue(
        "error",
        "token_policy_percent_regression_limit_invalid",
        "token usage policy max_total_token_increase_percent must be numeric and > 0"
      )
    );
  }
  if (!Number.isFinite(maxPerFileRegression) || maxPerFileRegression <= 0) {
    report.issues.push(
      issue(
        "error",
        "token_policy_per_file_regression_limit_invalid",
        "token usage policy max_per_file_token_increase must be numeric and > 0"
      )
    );
  }

  if (promptPolicy.enforce_compact_default_prompt !== true) {
    report.issues.push(
      issue(
        "error",
        "token_policy_compact_prompt_not_enforced",
        "token usage policy must enforce compact default skill prompts"
      )
    );
  }
  if (!String(promptPolicy.required_skill_prompt_template || "").trim()) {
    report.issues.push(
      issue(
        "error",
        "token_policy_skill_prompt_template_missing",
        "token usage policy must define required_skill_prompt_template"
      )
    );
  }

  if (automationPolicy.require_command_first_prompt !== true) {
    report.issues.push(
      issue(
        "error",
        "token_policy_automation_command_first_missing",
        "token usage policy automation prompts must require command-first format"
      )
    );
  }
  if (!outputCapMarker) {
    report.issues.push(
      issue(
        "error",
        "token_policy_automation_output_cap_marker_missing",
        "token usage policy automation prompts must define required_output_cap_marker"
      )
    );
  }
  if (!Number.isFinite(maxExpectedAutomationOutputTokens) || maxExpectedAutomationOutputTokens > 120) {
    report.issues.push(
      issue(
        "error",
        "token_policy_max_expected_automation_output_tokens_invalid",
        "token usage policy max_expected_output_tokens must be numeric and <= 120"
      )
    );
  }

  report.metrics.token_policy = {
    max_skill_prompt_tokens: Number.isFinite(maxSkill) ? maxSkill : 0,
    max_automation_prompt_tokens: Number.isFinite(maxAutomation) ? maxAutomation : 0,
    max_total_tokens_estimate: Number.isFinite(maxTotal) ? maxTotal : 0,
    max_scope_guardrail_duplicate_count: Number.isFinite(maxScopeDuplicate) ? maxScopeDuplicate : 0,
    max_total_token_increase: Number.isFinite(maxRegression) ? maxRegression : 0,
    max_total_token_increase_percent: Number.isFinite(maxRegressionPercent) ? maxRegressionPercent : 0,
    max_per_file_token_increase: Number.isFinite(maxPerFileRegression) ? maxPerFileRegression : 0,
    required_output_cap_marker: outputCapMarker,
    max_expected_output_tokens: Number.isFinite(maxExpectedAutomationOutputTokens)
      ? maxExpectedAutomationOutputTokens
      : 0
  };
}

function validatePolyglotRuntimeActivation(root, baseline, report) {
  const runtimePolicy =
    baseline && baseline.polyglot_runtime_policy && typeof baseline.polyglot_runtime_policy === "object"
      ? baseline.polyglot_runtime_policy
      : {};
  const requireBenchmarkSelected = runtimePolicy.benchmark_selected_runtime_required === true;
  const requiredLanguages = Array.isArray(runtimePolicy.required_languages_run)
    ? runtimePolicy.required_languages_run
        .map((entry) =>
          String(entry || "")
            .trim()
            .toLowerCase()
        )
        .filter(Boolean)
    : ["javascript", "python", "cpp"];
  const runtimeReportPath = path.resolve(
    root,
    String(runtimePolicy.runtime_benchmark_report_file || DEFAULT_RUNTIME_BENCHMARK_REPORT_FILE)
  );
  const winnerMapPath = path.resolve(
    root,
    String(runtimePolicy.runtime_winner_map_file || DEFAULT_RUNTIME_WINNER_MAP_FILE)
  );
  const swapReportPath = path.resolve(
    root,
    String(runtimePolicy.script_runtime_swap_report_file || DEFAULT_SCRIPT_RUNTIME_SWAP_REPORT_FILE)
  );
  const requiredSwapControls =
    runtimePolicy.required_swap_controls && typeof runtimePolicy.required_swap_controls === "object"
      ? runtimePolicy.required_swap_controls
      : {};

  let benchmarkReport = null;
  let swapReport = null;

  if (!fs.existsSync(runtimeReportPath)) {
    report.issues.push(
      issue(
        "error",
        "missing_runtime_benchmark_report",
        "runtime benchmark report is required for polyglot runtime policy",
        {
          file: normalizePath(root, runtimeReportPath)
        }
      )
    );
  } else {
    try {
      benchmarkReport = readJson(runtimeReportPath);
    } catch (error) {
      report.issues.push(
        issue("error", "invalid_runtime_benchmark_report", "runtime benchmark report is invalid json", {
          file: normalizePath(root, runtimeReportPath),
          error: error.message
        })
      );
    }
  }

  if (!fs.existsSync(winnerMapPath)) {
    report.issues.push(
      issue(
        "error",
        "missing_runtime_winner_map",
        "runtime winner map file is required for benchmark-selected runtime",
        {
          file: normalizePath(root, winnerMapPath)
        }
      )
    );
  }

  if (!fs.existsSync(swapReportPath)) {
    report.issues.push(
      issue(
        "error",
        "missing_script_runtime_swap_report",
        "script runtime swap report is required for runtime selection validation",
        {
          file: normalizePath(root, swapReportPath)
        }
      )
    );
  } else {
    try {
      swapReport = readJson(swapReportPath);
    } catch (error) {
      report.issues.push(
        issue("error", "invalid_script_runtime_swap_report", "script runtime swap report is invalid json", {
          file: normalizePath(root, swapReportPath),
          error: error.message
        })
      );
    }
  }

  if (
    benchmarkReport &&
    String(benchmarkReport.status || "")
      .trim()
      .toLowerCase() !== "pass"
  ) {
    report.issues.push(
      issue(
        "error",
        "runtime_benchmark_report_failed",
        "runtime benchmark report status must be pass for runtime activation"
      )
    );
  }

  const languagesRun = new Set(
    (benchmarkReport && Array.isArray(benchmarkReport.languages_run) ? benchmarkReport.languages_run : [])
      .map((entry) =>
        String(entry || "")
          .trim()
          .toLowerCase()
      )
      .filter(Boolean)
  );
  requiredLanguages.forEach((language) => {
    if (!languagesRun.has(language)) {
      report.issues.push(
        issue(
          "error",
          "runtime_benchmark_language_missing",
          "runtime benchmark report missing required language in languages_run",
          {
            language
          }
        )
      );
    }
  });

  if (requireBenchmarkSelected && swapReport) {
    const controls = swapReport.controls && typeof swapReport.controls === "object" ? swapReport.controls : {};
    if (requiredSwapControls.auto_select_best === true && controls.auto_select_best !== true) {
      report.issues.push(
        issue(
          "error",
          "runtime_swap_auto_select_disabled",
          "script runtime swap report must indicate auto_select_best=true for benchmark-selected runtime policy"
        )
      );
    }

    const stages = Array.isArray(swapReport.stages) ? swapReport.stages : [];
    stages.forEach((entry) => {
      const scriptFile = String(entry && entry.script_file ? entry.script_file : "").trim();
      const attemptCount = Number(entry && entry.attempt_count ? entry.attempt_count : 0);
      if (!scriptFile || attemptCount <= 0) {
        return;
      }
      const stageName = String(entry && entry.stage ? entry.stage : "unknown").trim();
      const selection = entry && entry.selection && typeof entry.selection === "object" ? entry.selection : {};
      if (selection.auto_select_enabled !== true) {
        report.issues.push(
          issue(
            "error",
            "runtime_stage_not_benchmark_selected",
            "script runtime stage must have benchmark-based auto selection enabled",
            { stage: stageName }
          )
        );
      }
      if (!String(selection.auto_best_language || "").trim()) {
        report.issues.push(
          issue(
            "warn",
            "runtime_stage_missing_auto_best_language",
            "stage selection should include auto_best_language evidence",
            {
              stage: stageName
            }
          )
        );
      }
      const autoBestSource = String(selection.auto_best_source || "")
        .trim()
        .toLowerCase();
      if (!autoBestSource) {
        report.issues.push(
          issue(
            "warn",
            "runtime_stage_missing_auto_best_source",
            "stage selection should include auto_best_source evidence",
            {
              stage: stageName
            }
          )
        );
      } else if (!["benchmark_winner_map", "fallback_runtime_order"].includes(autoBestSource)) {
        report.issues.push(
          issue(
            "error",
            "runtime_stage_invalid_auto_best_source",
            "auto_best_source must be benchmark_winner_map or fallback_runtime_order",
            {
              stage: stageName,
              auto_best_source: autoBestSource
            }
          )
        );
      }
    });
  }

  report.metrics.runtime_activation = {
    required_languages: requiredLanguages.length,
    languages_run: languagesRun.size,
    benchmark_selected_runtime_required: requireBenchmarkSelected,
    auto_select_best_enabled: Boolean(
      swapReport && swapReport.controls && swapReport.controls.auto_select_best === true
    )
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
  if (
    report.issues.some((entry) => entry.type.startsWith("token_policy_") || entry.type.includes("token_usage_policy"))
  ) {
    recommendations.push(
      "Tighten token usage catalog budgets/regression limits and keep prompts in canonical compact format."
    );
  }
  if (report.issues.some((entry) => entry.type === "benchmark_function_coverage_below_threshold")) {
    recommendations.push("Add benchmark cases until function coverage meets baseline ratio.");
  }
  if (report.issues.some((entry) => entry.type.startsWith("uiux_") || entry.type.includes("_uiux_"))) {
    recommendations.push(
      "Fix UI UX catalog coverage for semantics, ergonomics, preferences, and measurement baselines."
    );
  }
  if (report.issues.some((entry) => entry.type.startsWith("runtime_"))) {
    recommendations.push(
      "Run npm run benchmark:runtime and workflow:general with benchmark-selected script runtimes enabled."
    );
  }
  if (report.issues.some((entry) => entry.type.startsWith("search_") || entry.type.startsWith("memory_"))) {
    recommendations.push(
      "Align search and memory lifecycle catalogs with required routing tiers, budgets, and validation contracts."
    );
  }
  if (report.issues.some((entry) => entry.type.startsWith("automation_") || entry.type.startsWith("speech_"))) {
    recommendations.push(
      "Harden AI automation and speech policies for tool allowlists, local-first egress, and turn-detection safety."
    );
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
  const uiComponentCatalogPath = path.resolve(root, args.uiComponentCatalogFile || DEFAULT_UI_COMPONENT_CATALOG_FILE);
  const renderingPolicyCatalogPath = path.resolve(
    root,
    args.renderingPolicyCatalogFile || DEFAULT_RENDERING_POLICY_CATALOG_FILE
  );
  const searchPolicyCatalogPath = path.resolve(
    root,
    args.searchPolicyCatalogFile || DEFAULT_SEARCH_POLICY_CATALOG_FILE
  );
  const memoryPolicyCatalogPath = path.resolve(
    root,
    args.memoryPolicyCatalogFile || DEFAULT_MEMORY_POLICY_CATALOG_FILE
  );
  const aiAutomationPolicyCatalogPath = path.resolve(
    root,
    args.aiAutomationPolicyCatalogFile || DEFAULT_AI_AUTOMATION_POLICY_CATALOG_FILE
  );
  const tokenPolicyCatalogPath = path.resolve(root, args.tokenPolicyCatalogFile || DEFAULT_TOKEN_POLICY_CATALOG_FILE);

  const report = {
    status: "pass",
    generated_at: new Date().toISOString(),
    root,
    files: {
      baseline: normalizePath(root, baselinePath),
      standards_catalog: normalizePath(root, standardsPath),
      iso_traceability_catalog: normalizePath(root, isoTraceabilityPath),
      uiux_catalog: normalizePath(root, uiuxCatalogPath),
      ui_component_catalog: normalizePath(root, uiComponentCatalogPath),
      rendering_runtime_policy_catalog: normalizePath(root, renderingPolicyCatalogPath),
      search_strategy_routing_catalog: normalizePath(root, searchPolicyCatalogPath),
      memory_data_lifecycle_policy_catalog: normalizePath(root, memoryPolicyCatalogPath),
      ai_automation_safety_speech_catalog: normalizePath(root, aiAutomationPolicyCatalogPath),
      token_usage_optimization_policy_catalog: normalizePath(root, tokenPolicyCatalogPath),
      wrapper_symbol_registry: WRAPPER_SYMBOL_REGISTRY_FILE.replace(/\\/g, "/"),
      runtime_benchmark_cases: BENCHMARK_CASES_FILE.replace(/\\/g, "/"),
      runtime_benchmark_report: DEFAULT_RUNTIME_BENCHMARK_REPORT_FILE.replace(/\\/g, "/"),
      runtime_winner_map: DEFAULT_RUNTIME_WINNER_MAP_FILE.replace(/\\/g, "/"),
      script_runtime_swap_report: DEFAULT_SCRIPT_RUNTIME_SWAP_REPORT_FILE.replace(/\\/g, "/")
    },
    metrics: {},
    issues: [],
    recommendations: []
  };

  if (!fs.existsSync(baselinePath)) {
    report.issues.push(issue("error", "missing_baseline_catalog", "executive engineering baseline file is missing"));
  }
  if (!fs.existsSync(standardsPath)) {
    report.issues.push(
      issue("error", "missing_standards_catalog", "polyglot engineering standards catalog file is missing")
    );
  }
  if (!fs.existsSync(isoTraceabilityPath)) {
    report.issues.push(
      issue("error", "missing_iso_traceability_catalog", "iso standards traceability catalog file is missing")
    );
  }
  if (!fs.existsSync(uiuxCatalogPath)) {
    report.issues.push(issue("error", "missing_uiux_catalog", "ui ux blueprint catalog file is missing"));
  }
  if (!fs.existsSync(uiComponentCatalogPath)) {
    report.issues.push(
      issue("error", "missing_ui_component_catalog", "ui component blueprint catalog file is missing")
    );
  }
  if (!fs.existsSync(renderingPolicyCatalogPath)) {
    report.issues.push(
      issue("error", "missing_rendering_runtime_policy_catalog", "rendering runtime policy catalog file is missing")
    );
  }
  if (!fs.existsSync(searchPolicyCatalogPath)) {
    report.issues.push(
      issue("error", "missing_search_strategy_routing_catalog", "search strategy routing catalog file is missing")
    );
  }
  if (!fs.existsSync(memoryPolicyCatalogPath)) {
    report.issues.push(
      issue(
        "error",
        "missing_memory_data_lifecycle_policy_catalog",
        "memory data lifecycle policy catalog file is missing"
      )
    );
  }
  if (!fs.existsSync(aiAutomationPolicyCatalogPath)) {
    report.issues.push(
      issue("error", "missing_ai_automation_safety_catalog", "ai automation safety speech catalog file is missing")
    );
  }
  if (!fs.existsSync(tokenPolicyCatalogPath)) {
    report.issues.push(
      issue("error", "missing_token_usage_policy_catalog", "token usage optimization policy catalog file is missing")
    );
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
      },
      future_catalogs: {
        ui_component_categories: 0,
        rendering_fallback_backends: 0,
        search_query_routes: 0,
        memory_subsystem_budgets: 0,
        automation_security_controls: 0
      },
      token_policy: {
        max_skill_prompt_tokens: 0,
        max_automation_prompt_tokens: 0,
        max_total_tokens_estimate: 0,
        max_scope_guardrail_duplicate_count: 0,
        max_total_token_increase: 0,
        max_total_token_increase_percent: 0,
        max_per_file_token_increase: 0
      },
      runtime_activation: {
        required_languages: 0,
        languages_run: 0,
        benchmark_selected_runtime_required: false,
        auto_select_best_enabled: false
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
  const uiComponentCatalog = readJson(uiComponentCatalogPath);
  const renderingPolicyCatalog = readJson(renderingPolicyCatalogPath);
  const searchPolicyCatalog = readJson(searchPolicyCatalogPath);
  const memoryPolicyCatalog = readJson(memoryPolicyCatalogPath);
  const aiAutomationPolicyCatalog = readJson(aiAutomationPolicyCatalogPath);
  const tokenPolicyCatalog = readJson(tokenPolicyCatalogPath);

  if (!Number.isFinite(Number(baseline.schema_version))) {
    report.issues.push(issue("error", "invalid_baseline_schema_version", "baseline.schema_version must be numeric"));
  }
  if (!Number.isFinite(Number(standardsCatalog.schema_version))) {
    report.issues.push(
      issue("error", "invalid_standards_catalog_schema_version", "standards catalog schema_version must be numeric")
    );
  }
  if (!Number.isFinite(Number(isoTraceabilityCatalog.schema_version))) {
    report.issues.push(
      issue(
        "error",
        "invalid_iso_traceability_schema_version",
        "iso traceability catalog schema_version must be numeric"
      )
    );
  }
  if (!Number.isFinite(Number(uiuxCatalog.schema_version))) {
    report.issues.push(
      issue("error", "invalid_uiux_schema_version", "ui ux blueprint catalog schema_version must be numeric")
    );
  }
  if (!Number.isFinite(Number(uiComponentCatalog.schema_version))) {
    report.issues.push(
      issue(
        "error",
        "invalid_ui_component_catalog_schema_version",
        "ui component blueprint catalog schema_version must be numeric"
      )
    );
  }
  if (!Number.isFinite(Number(renderingPolicyCatalog.schema_version))) {
    report.issues.push(
      issue(
        "error",
        "invalid_rendering_runtime_policy_schema_version",
        "rendering runtime policy catalog schema_version must be numeric"
      )
    );
  }
  if (!Number.isFinite(Number(searchPolicyCatalog.schema_version))) {
    report.issues.push(
      issue(
        "error",
        "invalid_search_strategy_routing_schema_version",
        "search strategy routing catalog schema_version must be numeric"
      )
    );
  }
  if (!Number.isFinite(Number(memoryPolicyCatalog.schema_version))) {
    report.issues.push(
      issue(
        "error",
        "invalid_memory_data_lifecycle_schema_version",
        "memory data lifecycle policy catalog schema_version must be numeric"
      )
    );
  }
  if (!Number.isFinite(Number(aiAutomationPolicyCatalog.schema_version))) {
    report.issues.push(
      issue(
        "error",
        "invalid_ai_automation_safety_schema_version",
        "ai automation safety speech catalog schema_version must be numeric"
      )
    );
  }
  if (!Number.isFinite(Number(tokenPolicyCatalog.schema_version))) {
    report.issues.push(
      issue(
        "error",
        "invalid_token_usage_policy_schema_version",
        "token usage optimization policy schema_version must be numeric"
      )
    );
  }

  if (!Array.isArray(isoTraceabilityCatalog.standards) || isoTraceabilityCatalog.standards.length < 10) {
    report.issues.push(
      issue(
        "error",
        "iso_traceability_insufficient_coverage",
        "iso traceability catalog must include at least 10 standards"
      )
    );
  }

  collectNamingMetrics(root, baseline, report);
  validateSymbolRegistry(root, report);
  validateStoragePolicies(root, baseline, report);
  validateOptimizationPolicies(root, baseline, tokenPolicyCatalog, report);
  validateUiUxCatalog(uiuxCatalog, report);
  validateFutureRoadmapCatalogs(
    {
      uiComponents: uiComponentCatalog,
      rendering: renderingPolicyCatalog,
      search: searchPolicyCatalog,
      memory: memoryPolicyCatalog,
      automation: aiAutomationPolicyCatalog
    },
    report
  );
  validateTokenUsagePolicyCatalog(tokenPolicyCatalog, report);
  validatePolyglotRuntimeActivation(root, baseline, report);

  report.recommendations = buildRecommendations(report);
  report.status = report.issues.some((entry) => entry.level === "error") ? "fail" : "pass";
  return report;
}

function writeReport(root, args, report) {
  if (args.check) {
    return;
  }
  const reportPath = path.resolve(root, args.reportFile || DEFAULT_REPORT_FILE);
  writeTextFileRobust(reportPath, `${JSON.stringify(report, null, 2)}\n`);
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
