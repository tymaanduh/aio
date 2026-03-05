#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { findProjectRoot } = require("./project-source-resolver");
const { generateWrapperBindingArtifacts } = require("./generate-wrapper-polyglot-bindings");
const { resetRuntimeBenchmarkCases } = require("./reset-runtime-benchmark-cases");
const { runPolyglotBenchmark } = require("./polyglot-runtime-benchmark");

const REPORTS_ROOT = path.join("data", "output", "databases", "polyglot-default", "reports");
const FULL_REPORT_FILE = path.join(REPORTS_ROOT, "polyglot_runtime_benchmark_report.json");
const WINNER_MAP_FILE = path.join(REPORTS_ROOT, "polyglot_runtime_winner_map.json");
const FUNCTION_REPORTS_DIR = path.join(REPORTS_ROOT, "polyglot_runtime_function_reports");
const MODULE_REPORTS_DIR = path.join(REPORTS_ROOT, "polyglot_runtime_module_reports");
const MATRIX_REPORT_FILE = path.join(REPORTS_ROOT, "polyglot_runtime_reset_matrix.json");
const WRAPPER_REGISTRY_FILE = path.join("data", "input", "shared", "wrapper", "wrapper_symbol_registry.json");

function parseArgs(argv) {
  const options = {
    languages: ["javascript", "python", "cpp"],
    strict: false
  };
  for (let index = 0; index < argv.length; index += 1) {
    const token = String(argv[index] || "");
    if (token === "--languages") {
      options.languages = String(argv[index + 1] || "")
        .split(",")
        .map((item) => item.trim().toLowerCase())
        .filter(Boolean);
      index += 1;
      continue;
    }
    if (token === "--strict") {
      options.strict = true;
      continue;
    }
    if (token === "--help" || token === "-h") {
      printHelpAndExit(0);
    }
    throw new Error(`unknown argument: ${token}`);
  }
  return options;
}

function printHelpAndExit(code) {
  const help = [
    "reset-and-benchmark-polyglot-runtime",
    "",
    "Usage:",
    "  npm run benchmark:reset-and-run -- [options]",
    "",
    "Options:",
    "  --languages <csv>   Runtime languages (default: javascript,python,cpp).",
    "  --strict            Fail when benchmark runs include skipped languages.",
    "  --help              Show this help."
  ].join("\n");
  process.stdout.write(`${help}\n`);
  process.exit(code);
}

function toPosix(value) {
  return String(value || "").replace(/\\/g, "/");
}

function toSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function removePathIfExists(targetPath) {
  if (!fs.existsSync(targetPath)) {
    return;
  }
  const stat = fs.statSync(targetPath);
  if (stat.isDirectory()) {
    fs.rmSync(targetPath, { recursive: true, force: true });
    return;
  }
  fs.unlinkSync(targetPath);
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function runResetAndBenchmark(options = {}) {
  const root = findProjectRoot(options.root || process.cwd());
  const reportsRoot = path.join(root, REPORTS_ROOT);
  const fullReportFile = path.join(root, FULL_REPORT_FILE);
  const winnerMapFile = path.join(root, WINNER_MAP_FILE);
  const functionReportsDir = path.join(root, FUNCTION_REPORTS_DIR);
  const moduleReportsDir = path.join(root, MODULE_REPORTS_DIR);
  const matrixReportFile = path.join(root, MATRIX_REPORT_FILE);
  const registryFile = path.join(root, WRAPPER_REGISTRY_FILE);
  const languages = Array.isArray(options.languages) && options.languages.length > 0 ? options.languages : ["javascript"];

  generateWrapperBindingArtifacts({ root, checkOnly: false });
  const resetCasesReport = resetRuntimeBenchmarkCases({ root });

  [fullReportFile, winnerMapFile, functionReportsDir, moduleReportsDir, matrixReportFile].forEach(removePathIfExists);
  fs.mkdirSync(reportsRoot, { recursive: true });

  const fullReport = runPolyglotBenchmark({
    root,
    languages,
    outputFile: FULL_REPORT_FILE,
    strict: Boolean(options.strict)
  });
  writeJson(winnerMapFile, fullReport.winner_mapping || {});

  const registry = JSON.parse(fs.readFileSync(registryFile, "utf8"));
  const functionEntries = Object.values(registry && registry.function_index && typeof registry.function_index === "object" ? registry.function_index : {})
    .filter((entry) => entry && typeof entry === "object")
    .sort((left, right) => String(left.function_id || "").localeCompare(String(right.function_id || "")));

  const functionReports = [];
  functionEntries.forEach((entry) => {
    const functionId = String(entry.function_id || "").trim();
    if (!functionId) {
      return;
    }
    const fileName = `${toSlug(functionId)}.json`;
    const relativeOutputFile = toPosix(path.join(FUNCTION_REPORTS_DIR, fileName));
    const report = runPolyglotBenchmark({
      root,
      languages,
      functionIds: [functionId],
      outputFile: relativeOutputFile,
      strict: false
    });
    functionReports.push({
      function_id: functionId,
      module_id: String(entry.module_id || ""),
      report_file: relativeOutputFile,
      status: report.status,
      languages_run: report.languages_run,
      languages_skipped: report.languages_skipped
    });
  });

  const functionsByModule = new Map();
  functionEntries.forEach((entry) => {
    const moduleId = String(entry.module_id || "").trim() || "unknown_module";
    const functionId = String(entry.function_id || "").trim();
    if (!functionId) {
      return;
    }
    if (!functionsByModule.has(moduleId)) {
      functionsByModule.set(moduleId, []);
    }
    functionsByModule.get(moduleId).push(functionId);
  });

  const moduleReports = [];
  [...functionsByModule.entries()]
    .sort((left, right) => left[0].localeCompare(right[0]))
    .forEach(([moduleId, functionIds]) => {
      const sortedFunctionIds = [...new Set(functionIds)].sort((left, right) => left.localeCompare(right));
      const relativeOutputFile = toPosix(path.join(MODULE_REPORTS_DIR, `${toSlug(moduleId)}.json`));
      const report = runPolyglotBenchmark({
        root,
        languages,
        functionIds: sortedFunctionIds,
        outputFile: relativeOutputFile,
        strict: false
      });
      moduleReports.push({
        module_id: moduleId,
        function_count: sortedFunctionIds.length,
        function_ids: sortedFunctionIds,
        report_file: relativeOutputFile,
        status: report.status,
        languages_run: report.languages_run,
        languages_skipped: report.languages_skipped
      });
    });

  const matrixReport = {
    status:
      fullReport.status === "fail" ||
      functionReports.some((item) => item.status === "fail") ||
      moduleReports.some((item) => item.status === "fail")
        ? "fail"
        : "pass",
    generated_at: new Date().toISOString(),
    root: ".",
    languages_requested: languages,
    strict: Boolean(options.strict),
    outputs: {
      full_report_file: toPosix(FULL_REPORT_FILE),
      winner_map_file: toPosix(WINNER_MAP_FILE),
      function_reports_dir: toPosix(FUNCTION_REPORTS_DIR),
      module_reports_dir: toPosix(MODULE_REPORTS_DIR)
    },
    reset_cases: resetCasesReport,
    full_report_status: fullReport.status,
    function_reports: functionReports,
    module_reports: moduleReports
  };
  writeJson(matrixReportFile, matrixReport);
  return matrixReport;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const report = runResetAndBenchmark({
    root: process.cwd(),
    languages: args.languages,
    strict: args.strict
  });
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (report.status === "fail") {
    process.exit(1);
  }
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    process.stderr.write(`reset-and-benchmark-polyglot-runtime failed: ${error.message}\n`);
    process.exit(1);
  }
}

module.exports = {
  runResetAndBenchmark
};

