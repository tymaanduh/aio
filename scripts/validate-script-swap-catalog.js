#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const CATALOG_FILE = path.join(ROOT, "data", "input", "shared", "main", "polyglot_script_swap_catalog.json");

const SUPPORTED_ADAPTER_KINDS = new Set(["native_node", "python_node_bridge", "cpp_node_bridge"]);

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

  const adapters = catalog.adapters && typeof catalog.adapters === "object" ? catalog.adapters : {};
  Object.entries(adapters).forEach(([language, adapter]) => {
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
