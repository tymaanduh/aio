#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { findProjectRoot } = require("./project-source-resolver");
const { writeTextFileRobust } = require("./lib/robust-file-write");
const { checkNeutralCoreAssets, OUTPUT_FILES } = require("./generate-neutral-core-assets");
const { validateElectronShellAdapter } = require("../main/shell/electron_shell_adapter.js");

const CORE_CONTRACT_PATH = path.join("data", "input", "shared", "core", "core_contract_catalog.json");
const RUNTIME_SOURCES_PATH = path.join("data", "input", "shared", "core", "runtime_implementation_sources.json");
const STORAGE_CONTRACT_PATH = path.join("data", "input", "shared", "core", "storage_provider_contract.json");
const SHELL_CONTRACT_PATH = path.join("data", "input", "shared", "core", "shell_adapter_contract.json");
const DEFAULT_REPORT_FILE = path.join(
  "data",
  "output",
  "databases",
  "polyglot-default",
  "analysis",
  "neutral_core_validation_report.json"
);

const REQUIRED_SUBSYSTEMS = Object.freeze(["math_core", "shell_core", "storage_core"]);
const REQUIRED_RUNTIMES = Object.freeze(["javascript", "python", "cpp", "ruby"]);
const REQUIRED_STORAGE_BACKENDS = Object.freeze(["memory", "raw_file", "sqlite"]);
const REQUIRED_SHELLS = Object.freeze(["electron", "winui", "winforms", "qt"]);

function parseArgs(argv) {
  return {
    strict: !argv.includes("--no-strict")
  };
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

function validateNeutralCore(options = {}) {
  const root = findProjectRoot(options.root || process.cwd());
  const reportPath = path.join(root, DEFAULT_REPORT_FILE);
  const report = {
    status: "pass",
    generated_at: new Date().toISOString(),
    root: ".",
    report_file: DEFAULT_REPORT_FILE.replace(/\\/g, "/"),
    counts: {
      errors: 0,
      warnings: 0
    },
    issues: []
  };

  const generation = checkNeutralCoreAssets({
    root,
    quiet: true
  });
  if (generation.status !== "pass") {
    report.status = "fail";
    report.issues.push(...(generation.issues || []));
  }

  const coreDoc = readJson(path.join(root, CORE_CONTRACT_PATH));
  const runtimeSources = readJson(path.join(root, RUNTIME_SOURCES_PATH));
  const storageContract = readJson(path.join(root, STORAGE_CONTRACT_PATH));
  const shellContract = readJson(path.join(root, SHELL_CONTRACT_PATH));
  const runtimeManifest = readJson(path.join(root, OUTPUT_FILES.runtimeManifest));
  const storageManifest = readJson(path.join(root, OUTPUT_FILES.storageManifest));
  const shellManifest = readJson(path.join(root, OUTPUT_FILES.shellManifest));

  REQUIRED_SUBSYSTEMS.forEach((subsystemId) => {
    if (!coreDoc.subsystems || !coreDoc.subsystems[subsystemId]) {
      report.issues.push(issue("error", "missing_subsystem_contract", "missing required subsystem contract", { subsystem_id: subsystemId }));
    }
  });

  REQUIRED_RUNTIMES.forEach((runtimeId) => {
    if (!runtimeSources.runtimes || !runtimeSources.runtimes[runtimeId]) {
      report.issues.push(issue("error", "missing_runtime_source", "missing runtime implementation source", { runtime_id: runtimeId }));
    }
  });

  REQUIRED_STORAGE_BACKENDS.forEach((backendId) => {
    if (!storageContract.providers || !storageContract.providers[backendId]) {
      report.issues.push(issue("error", "missing_storage_backend", "missing storage backend contract", { backend_id: backendId }));
    }
  });

  REQUIRED_SHELLS.forEach((shellId) => {
    if (!shellContract.shells || !shellContract.shells[shellId]) {
      report.issues.push(issue("error", "missing_shell_contract", "missing shell adapter contract", { shell_id: shellId }));
    }
  });

  if (String(storageContract.default_backend || "") !== "raw_file") {
    report.issues.push(
      issue("warn", "unexpected_default_storage_backend", "default storage backend is not raw_file", {
        actual: String(storageContract.default_backend || "")
      })
    );
  }

  if (!Array.isArray(shellContract.commands) || shellContract.commands.length === 0) {
    report.issues.push(issue("error", "missing_shell_commands", "shell adapter contract must define commands"));
  }
  if (!Array.isArray(shellContract.views) || shellContract.views.length === 0) {
    report.issues.push(issue("error", "missing_shell_views", "shell adapter contract must define views"));
  }

  const mathCoreSubsystem = runtimeManifest.subsystems && runtimeManifest.subsystems.math_core
    ? runtimeManifest.subsystems.math_core
    : null;
  if (!mathCoreSubsystem || !mathCoreSubsystem.benchmark) {
    report.issues.push(issue("error", "missing_math_core_benchmark", "runtime implementation manifest is missing math_core benchmark data"));
  }

  REQUIRED_RUNTIMES.forEach((runtimeId) => {
    const runtimeRow = runtimeManifest.runtimes && runtimeManifest.runtimes[runtimeId]
      ? runtimeManifest.runtimes[runtimeId]
      : null;
    if (!runtimeRow) {
      report.issues.push(issue("error", "missing_runtime_manifest_row", "runtime implementation manifest missing runtime row", { runtime_id: runtimeId }));
      return;
    }
    if (!runtimeRow.subsystems || !runtimeRow.subsystems.math_core) {
      report.issues.push(issue("error", "missing_math_core_runtime", "runtime missing math_core implementation", { runtime_id: runtimeId }));
      return;
    }
    const subsystem = runtimeRow.subsystems.math_core;
    const artifact = String(subsystem.artifact || "");
    if (String(subsystem.status || "") !== "implemented") {
      report.issues.push(issue("error", "math_core_not_implemented", "math_core must be implemented for all required runtimes", { runtime_id: runtimeId }));
    }
    if (artifact.includes("repo_polyglot_equivalents") || artifact.includes("repo-polyglot-module-bridge")) {
      report.issues.push(issue("error", "proxy_backed_runtime_artifact", "math_core artifact may not use proxy-backed equivalents", { runtime_id: runtimeId, artifact }));
    }
    if (subsystem.production_ready !== true) {
      report.issues.push(issue("error", "runtime_not_production_ready", "math_core implementation is not marked production_ready", { runtime_id: runtimeId }));
    }
  });

  if (!Array.isArray(storageManifest.operations) || storageManifest.operations.length < 5) {
    report.issues.push(issue("error", "storage_manifest_incomplete", "storage backend manifest is missing required operations"));
  }
  if (!Array.isArray(shellManifest.implemented_shells) || !shellManifest.implemented_shells.includes("electron")) {
    report.issues.push(issue("error", "electron_shell_not_implemented", "shell manifest must list electron as implemented"));
  }

  const electronShellValidation = validateElectronShellAdapter();
  if (electronShellValidation.status !== "pass") {
    (electronShellValidation.issues || []).forEach((adapterIssue) => {
      report.issues.push(issue(adapterIssue.level || "error", adapterIssue.type || "electron_shell_adapter_issue", adapterIssue.detail || "electron shell adapter validation failed", adapterIssue));
    });
  }

  report.counts.errors = report.issues.filter((row) => row.level === "error").length;
  report.counts.warnings = report.issues.filter((row) => row.level === "warn").length;
  if (report.counts.errors > 0) {
    report.status = "fail";
  }

  writeTextFileRobust(reportPath, `${JSON.stringify(report, null, 2)}\n`, { atomic: false });
  return report;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const report = validateNeutralCore({
    root: process.cwd()
  });
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (args.strict && report.status !== "pass") {
    process.exit(1);
  }
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    process.stderr.write(`validate-neutral-core-contracts failed: ${error.message}\n`);
    process.exit(1);
  }
}

module.exports = {
  validateNeutralCore
};
