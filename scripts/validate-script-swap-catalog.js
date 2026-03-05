#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const CATALOG_FILE = path.join(ROOT, "data", "input", "shared", "main", "polyglot_script_swap_catalog.json");

const SUPPORTED_ADAPTER_KINDS = new Set(["native_node", "python_node_bridge", "cpp_node_bridge"]);
const SUPPORTED_LANGUAGE_IDS = new Set(["javascript", "python", "cpp"]);

function toLanguageId(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function normalizePath(filePath) {
  return path.relative(ROOT, filePath).replace(/\\/g, "/");
}

function issue(level, code, message, details = {}) {
  return {
    level,
    code,
    message,
    details
  };
}

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function runValidation() {
  const issues = [];
  if (!fs.existsSync(CATALOG_FILE)) {
    issues.push(issue("error", "missing_catalog", "polyglot script swap catalog file is missing"));
    return {
      status: "fail",
      generated_at: new Date().toISOString(),
      root: ROOT,
      files: {
        catalog_file: normalizePath(CATALOG_FILE)
      },
      metrics: {
        stage_count: 0,
        adapter_count: 0
      },
      issues
    };
  }

  let catalog = {};
  try {
    catalog = loadJson(CATALOG_FILE);
  } catch (error) {
    issues.push(issue("error", "invalid_catalog_json", "catalog JSON parsing failed", { error: String(error.message || error) }));
    return {
      status: "fail",
      generated_at: new Date().toISOString(),
      root: ROOT,
      files: {
        catalog_file: normalizePath(CATALOG_FILE)
      },
      metrics: {
        stage_count: 0,
        adapter_count: 0
      },
      issues
    };
  }

  const schemaVersion = Number(catalog.schema_version);
  if (!Number.isFinite(schemaVersion) || schemaVersion <= 0) {
    issues.push(issue("error", "invalid_schema_version", "schema_version must be a positive number"));
  }

  const runtimeContract =
    catalog.runtime_contract && typeof catalog.runtime_contract === "object" ? catalog.runtime_contract : {};
  const envOverrides =
    runtimeContract.env_overrides && typeof runtimeContract.env_overrides === "object" ? runtimeContract.env_overrides : {};
  const requiredEnvOverrideKeys = [
    "preferred_language",
    "ordered_languages",
    "disable_swaps",
    "strict_runtime",
    "auto_select_best"
  ];
  requiredEnvOverrideKeys.forEach((key) => {
    if (!envOverrides[key] || !String(envOverrides[key]).trim()) {
      issues.push(issue("error", "missing_runtime_env_override", `runtime_contract.env_overrides is missing '${key}'`, { key }));
    }
  });

  const baselineLanguage = toLanguageId(runtimeContract.baseline_language || "");
  if (!SUPPORTED_LANGUAGE_IDS.has(baselineLanguage)) {
    issues.push(
      issue("error", "invalid_baseline_language", "runtime_contract.baseline_language is not supported", {
        baseline_language: runtimeContract.baseline_language
      })
    );
  }

  const winnerMapFileRaw = String(runtimeContract.benchmark_winner_map_file || "").trim();
  if (!winnerMapFileRaw) {
    issues.push(
      issue(
        "error",
        "missing_benchmark_winner_map_file",
        "runtime_contract.benchmark_winner_map_file is required for benchmark-driven runtime selection"
      )
    );
  } else {
    const winnerMapFile = path.resolve(ROOT, winnerMapFileRaw);
    if (!fs.existsSync(winnerMapFile)) {
      issues.push(
        issue("warn", "missing_benchmark_winner_map_report", "benchmark winner map file is missing", {
          benchmark_winner_map_file: normalizePath(winnerMapFile)
        })
      );
    }
  }

  const adapters = catalog.adapters && typeof catalog.adapters === "object" ? catalog.adapters : {};
  Object.entries(adapters).forEach(([language, adapter]) => {
    const languageId = toLanguageId(language);
    if (!SUPPORTED_LANGUAGE_IDS.has(languageId)) {
      issues.push(issue("error", "unsupported_language_id", "adapter language id is unsupported", { language }));
      return;
    }
    const kind = String(adapter && adapter.kind ? adapter.kind : "");
    if (!SUPPORTED_ADAPTER_KINDS.has(kind)) {
      issues.push(issue("error", "unsupported_adapter_kind", `unsupported adapter kind for ${language}`, { language, kind }));
      return;
    }
    if (kind === "python_node_bridge" || kind === "cpp_node_bridge") {
      const bridgeFile = path.resolve(ROOT, String(adapter.bridge_script || ""));
      if (!fs.existsSync(bridgeFile)) {
        issues.push(
          issue("error", "missing_bridge_script", "adapter bridge script file is missing", {
            language,
            bridge_script: normalizePath(bridgeFile)
          })
        );
      }
    }
  });

  const stageMap = catalog.stage_script_map && typeof catalog.stage_script_map === "object" ? catalog.stage_script_map : {};
  Object.entries(stageMap).forEach(([stageId, entry]) => {
    const scriptFile = path.resolve(ROOT, String(entry && entry.script_file ? entry.script_file : ""));
    if (!entry || !entry.script_file) {
      issues.push(issue("error", "missing_stage_script_file", `stage '${stageId}' is missing script_file`));
      return;
    }
    if (!fs.existsSync(scriptFile)) {
      issues.push(
        issue("error", "missing_stage_script_target", `script target for stage '${stageId}' does not exist`, {
          stage_id: stageId,
          script_file: normalizePath(scriptFile)
        })
      );
    }

    const preferredLanguage = toLanguageId(entry.preferred_language || "");
    if (preferredLanguage && !SUPPORTED_LANGUAGE_IDS.has(preferredLanguage)) {
      issues.push(
        issue("error", "unsupported_stage_preferred_language", "stage preferred_language is unsupported", {
          stage_id: stageId,
          preferred_language: entry.preferred_language
        })
      );
    }

    const runtimeOrder = Array.isArray(entry.runtime_order) ? entry.runtime_order : [];
    runtimeOrder.forEach((value) => {
      const languageId = toLanguageId(value);
      if (!SUPPORTED_LANGUAGE_IDS.has(languageId)) {
        issues.push(
          issue("error", "unsupported_stage_runtime_order_language", "stage runtime_order includes unsupported language", {
            stage_id: stageId,
            language: value
          })
        );
      }
    });

    if (
      Object.prototype.hasOwnProperty.call(entry, "allow_swaps") &&
      typeof entry.allow_swaps !== "boolean"
    ) {
      issues.push(
        issue("error", "invalid_allow_swaps_type", "stage allow_swaps must be boolean when present", {
          stage_id: stageId,
          allow_swaps: entry.allow_swaps
        })
      );
    }

    if (
      Object.prototype.hasOwnProperty.call(entry, "strict_runtime") &&
      typeof entry.strict_runtime !== "boolean"
    ) {
      issues.push(
        issue("error", "invalid_strict_runtime_type", "stage strict_runtime must be boolean when present", {
          stage_id: stageId,
          strict_runtime: entry.strict_runtime
        })
      );
    }

    if (
      Object.prototype.hasOwnProperty.call(entry, "auto_select_from_benchmark") &&
      typeof entry.auto_select_from_benchmark !== "boolean"
    ) {
      issues.push(
        issue(
          "error",
          "invalid_auto_select_from_benchmark_type",
          "stage auto_select_from_benchmark must be boolean when present",
          {
            stage_id: stageId,
            auto_select_from_benchmark: entry.auto_select_from_benchmark
          }
        )
      );
    }

    if (Object.prototype.hasOwnProperty.call(entry, "benchmark_function_ids")) {
      if (!Array.isArray(entry.benchmark_function_ids)) {
        issues.push(
          issue(
            "error",
            "invalid_benchmark_function_ids_type",
            "stage benchmark_function_ids must be an array when present",
            {
              stage_id: stageId,
              benchmark_function_ids: entry.benchmark_function_ids
            }
          )
        );
      } else {
        entry.benchmark_function_ids.forEach((functionId, index) => {
          if (!String(functionId || "").trim()) {
            issues.push(
              issue(
                "error",
                "invalid_benchmark_function_id_value",
                "stage benchmark_function_ids entries must be non-empty strings",
                {
                  stage_id: stageId,
                  index
                }
              )
            );
          }
        });
      }
    }
  });

  const errors = issues.filter((entry) => entry.level === "error");
  return {
    status: errors.length > 0 ? "fail" : "pass",
    generated_at: new Date().toISOString(),
    root: ROOT,
    files: {
      catalog_file: normalizePath(CATALOG_FILE)
    },
    metrics: {
      stage_count: Object.keys(stageMap).length,
      adapter_count: Object.keys(adapters).length
    },
    issues
  };
}

function main() {
  const report = runValidation();
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (report.status !== "pass") {
    process.exit(1);
  }
}

try {
  main();
} catch (error) {
  process.stderr.write(`validate-script-swap-catalog failed: ${error.message}\n`);
  process.exit(1);
}
