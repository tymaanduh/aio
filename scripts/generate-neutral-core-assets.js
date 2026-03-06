#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { findProjectRoot } = require("./project-source-resolver");
const { writeTextFileRobust } = require("./lib/robust-file-write");
const { generateWrapperBindingArtifacts } = require("./generate-wrapper-polyglot-bindings");

const CORE_CONTRACT_PATH = path.join("data", "input", "shared", "core", "core_contract_catalog.json");
const RUNTIME_SOURCES_PATH = path.join("data", "input", "shared", "core", "runtime_implementation_sources.json");
const STORAGE_CONTRACT_PATH = path.join("data", "input", "shared", "core", "storage_provider_contract.json");
const SHELL_CONTRACT_PATH = path.join("data", "input", "shared", "core", "shell_adapter_contract.json");
const WRAPPER_REGISTRY_PATH = path.join("data", "input", "shared", "wrapper", "wrapper_symbol_registry.json");
const BENCHMARK_REPORT_PATH = path.join(
  "data",
  "output",
  "databases",
  "polyglot-default",
  "reports",
  "polyglot_runtime_benchmark_report.json"
);
const WINNER_MAP_PATH = path.join(
  "data",
  "output",
  "databases",
  "polyglot-default",
  "reports",
  "polyglot_runtime_winner_map.json"
);

const OUTPUT_FILES = Object.freeze({
  runtimeManifest: path.join(
    "data",
    "output",
    "databases",
    "polyglot-default",
    "build",
    "runtime_implementation_manifest.json"
  ),
  storageManifest: path.join(
    "data",
    "output",
    "databases",
    "polyglot-default",
    "build",
    "storage_backend_manifest.json"
  ),
  shellManifest: path.join(
    "data",
    "output",
    "databases",
    "polyglot-default",
    "build",
    "shell_adapter_manifest.json"
  ),
  javascriptCore: path.join(
    "data",
    "output",
    "databases",
    "polyglot-default",
    "build",
    "generated",
    "javascript",
    "neutral_core.js"
  ),
  pythonCore: path.join(
    "data",
    "output",
    "databases",
    "polyglot-default",
    "build",
    "generated",
    "python",
    "neutral_core.py"
  ),
  cppHeader: path.join(
    "data",
    "output",
    "databases",
    "polyglot-default",
    "build",
    "generated",
    "cpp",
    "neutral_core.hpp"
  ),
  cppSource: path.join(
    "data",
    "output",
    "databases",
    "polyglot-default",
    "build",
    "generated",
    "cpp",
    "neutral_core.cpp"
  ),
  rubyCore: path.join(
    "data",
    "output",
    "databases",
    "polyglot-default",
    "build",
    "generated",
    "ruby",
    "neutral_core.rb"
  )
});

function parseArgs(argv) {
  return {
    checkOnly: argv.includes("--check"),
    quiet: argv.includes("--quiet")
  };
}

function readJson(filePath, fallback = null) {
  if (!fs.existsSync(filePath)) {
    return fallback;
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function stableJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function ensureOutputFile(filePath, content, checkOnly, report) {
  const absolutePath = path.resolve(report.root, filePath);
  const normalizedPath = filePath.replace(/\\/g, "/");
  const exists = fs.existsSync(absolutePath);
  const current = exists ? fs.readFileSync(absolutePath, "utf8") : "";
  const matches = exists && current === content;

  report.artifacts.push({
    file: normalizedPath,
    exists,
    matches
  });

  if (checkOnly) {
    if (!matches) {
      report.status = "fail";
      report.issues.push({
        level: "error",
        type: "artifact_out_of_date",
        detail: `${normalizedPath} is missing or out of date`,
        file: normalizedPath
      });
    }
    return;
  }

  writeTextFileRobust(absolutePath, content, { atomic: false });
}

function buildSubsystemBenchmark(functionIds, benchmarkReport, winnerMap) {
  const functionIdSet = new Set(Array.isArray(functionIds) ? functionIds : []);
  const perFunction = Array.isArray(winnerMap?.per_function) ? winnerMap.per_function : [];
  const filteredRows = perFunction.filter((row) => functionIdSet.has(String(row.function_id || "")));
  const preferredByLanguage = new Map();

  filteredRows.forEach((row) => {
    const rankings = Array.isArray(row.language_rankings) ? row.language_rankings : [];
    rankings.forEach((ranking) => {
      const language = String(ranking.language || "").trim().toLowerCase();
      const avg = Number(ranking.avg_ns_per_iteration || ranking.ns_per_iteration || 0);
      if (!language || !Number.isFinite(avg) || avg <= 0) {
        return;
      }
      const current = preferredByLanguage.get(language) || { total: 0, count: 0 };
      current.total += avg;
      current.count += 1;
      preferredByLanguage.set(language, current);
    });
  });

  const ranked = [...preferredByLanguage.entries()]
    .map(([language, row]) => ({
      language,
      sample_count: row.count,
      avg_ns_per_iteration: row.count > 0 ? row.total / row.count : Number.POSITIVE_INFINITY
    }))
    .sort((left, right) => left.avg_ns_per_iteration - right.avg_ns_per_iteration);

  return {
    benchmark_identity: "polyglot_wrapper_math_core",
    languages_run: Array.isArray(benchmarkReport?.languages_run) ? benchmarkReport.languages_run : [],
    benchmark_case_count: Number(benchmarkReport?.benchmark_case_count || 0),
    overall_winner_language: String(winnerMap?.overall_winner_language || ""),
    preferred_runtime_order: ranked.map((row) => row.language),
    per_function: filteredRows,
    ranked_languages: ranked
  };
}

function buildRuntimeManifest({ coreDoc, runtimeSources, storageContract, shellContract, wrapperRegistry, benchmarkReport, winnerMap }) {
  const runtimes = runtimeSources?.runtimes && typeof runtimeSources.runtimes === "object" ? runtimeSources.runtimes : {};
  const fallbackLanguageOrder = Array.isArray(runtimeSources?.runtime_defaults?.fallback_language_order)
    ? runtimeSources.runtime_defaults.fallback_language_order.map((item) => String(item || "").trim().toLowerCase()).filter(Boolean)
    : [];
  const mathPureFunctions = coreDoc?.subsystems?.math_core?.pure_function_ids || [];
  const subsystemBenchmarks = {
    math_core: buildSubsystemBenchmark(mathPureFunctions, benchmarkReport, winnerMap)
  };

  const runtimeManifest = {
    schema_version: 1,
    manifest_id: "aio_runtime_implementation_manifest",
    source_files: {
      core_contract_catalog: CORE_CONTRACT_PATH.replace(/\\/g, "/"),
      runtime_implementation_sources: RUNTIME_SOURCES_PATH.replace(/\\/g, "/"),
      storage_provider_contract: STORAGE_CONTRACT_PATH.replace(/\\/g, "/"),
      shell_adapter_contract: SHELL_CONTRACT_PATH.replace(/\\/g, "/"),
      wrapper_symbol_registry: WRAPPER_REGISTRY_PATH.replace(/\\/g, "/"),
      benchmark_report: BENCHMARK_REPORT_PATH.replace(/\\/g, "/"),
      winner_map: WINNER_MAP_PATH.replace(/\\/g, "/")
    },
    fallback_language_order: fallbackLanguageOrder,
    subsystems: {
      math_core: {
        ...coreDoc.subsystems.math_core,
        benchmark: subsystemBenchmarks.math_core
      },
      storage_core: {
        ...coreDoc.subsystems.storage_core,
        default_backend: storageContract.default_backend
      },
      shell_core: {
        ...coreDoc.subsystems.shell_core,
        implemented_shells: Object.keys(shellContract.shells || {}).filter(
          (shellId) => String(shellContract.shells[shellId]?.status || "") === "implemented"
        )
      }
    },
    runtimes: {}
  };

  Object.keys(runtimes)
    .sort((left, right) => left.localeCompare(right))
    .forEach((runtimeId) => {
      const runtime = runtimes[runtimeId] && typeof runtimes[runtimeId] === "object" ? runtimes[runtimeId] : {};
      const subsystemMap = runtime.subsystems && typeof runtime.subsystems === "object" ? runtime.subsystems : {};
      const nextRuntime = {
        runtime_id: String(runtime.runtime_id || runtimeId),
        implementation_kind: String(runtime.implementation_kind || "direct_generated"),
        subsystems: {}
      };

      Object.keys(subsystemMap)
        .sort((left, right) => left.localeCompare(right))
        .forEach((subsystemId) => {
          const subsystem = subsystemMap[subsystemId] && typeof subsystemMap[subsystemId] === "object" ? subsystemMap[subsystemId] : {};
          const artifact = String(subsystem.artifact || "").replace(/\\/g, "/");
          const productionReady =
            artifact &&
            !artifact.includes("repo_polyglot_equivalents") &&
            !artifact.includes("repo-polyglot-module-bridge") &&
            subsystem.status === "implemented";
          nextRuntime.subsystems[subsystemId] = {
            ...subsystem,
            artifact,
            production_ready: productionReady
          };
        });

      runtimeManifest.runtimes[runtimeId] = nextRuntime;
    });

  return runtimeManifest;
}

function buildStorageManifest(storageContract) {
  return {
    schema_version: 1,
    manifest_id: "aio_storage_backend_manifest",
    contract_id: storageContract.contract_id,
    storage_version: storageContract.storage_version,
    default_backend: storageContract.default_backend,
    operations: Array.isArray(storageContract.operations) ? storageContract.operations : [],
    providers: storageContract.providers || {},
    compatibility: storageContract.compatibility || {},
    raw_format: storageContract.raw_format || {}
  };
}

function buildShellManifest(shellContract) {
  const shells = shellContract.shells && typeof shellContract.shells === "object" ? shellContract.shells : {};
  return {
    schema_version: 1,
    manifest_id: "aio_shell_adapter_manifest",
    contract_id: shellContract.contract_id,
    lifecycle: Array.isArray(shellContract.lifecycle) ? shellContract.lifecycle : [],
    commands: Array.isArray(shellContract.commands) ? shellContract.commands : [],
    events: Array.isArray(shellContract.events) ? shellContract.events : [],
    views: Array.isArray(shellContract.views) ? shellContract.views : [],
    shells,
    implemented_shells: Object.keys(shells).filter((shellId) => String(shells[shellId]?.status || "") === "implemented")
  };
}

function renderJavascriptNeutralCore(coreDoc, wrapperRegistry) {
  const functionEntries = Object.values(wrapperRegistry.function_index || {}).sort((left, right) =>
    String(left.function_id || "").localeCompare(String(right.function_id || ""))
  );
  const contractText = JSON.stringify(coreDoc, null, 2);
  const wrappers = functionEntries
    .map((entry) => {
      const functionId = String(entry.function_id || "");
      const symbolName = String(entry.language_symbols?.javascript || "");
      const constKey = functionId
        .replace(/[^a-zA-Z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "")
        .toUpperCase();
      return `function ${symbolName}(boundArgs = {}) {\n  return runMathFunction(FUNCTION_IDS.${constKey}, boundArgs);\n}`;
    })
    .join("\n\n");
  const exportsBlock = functionEntries.map((entry) => `  ${entry.language_symbols.javascript},`).join("\n");
  return [
    "\"use strict\";",
    "",
    "const wrapperSymbols = require(\"./wrapper_symbols.js\");",
    "",
    `const CORE_CONTRACT_CATALOG = Object.freeze(${contractText});`,
    "const FUNCTION_IDS = Object.freeze({ ...wrapperSymbols.FUNCTION_IDS });",
    "const PURE_FUNCTION_IDS = Object.freeze([",
    ...coreDoc.subsystems.math_core.pure_function_ids.map((functionId) => `  ${JSON.stringify(functionId)},`),
    "]);",
    "",
    "function getSubsystemContract(subsystemId) {",
    "  return CORE_CONTRACT_CATALOG.subsystems[String(subsystemId || \"\")] || null;",
    "}",
    "",
    "function runMathFunction(functionId, boundArgs = {}) {",
    "  return wrapperSymbols.runWrapperFunction(functionId, boundArgs);",
    "}",
    "",
    wrappers,
    "",
    "module.exports = {",
    "  CORE_CONTRACT_CATALOG,",
    "  FUNCTION_IDS,",
    "  PURE_FUNCTION_IDS,",
    "  getSubsystemContract,",
    "  runMathFunction,",
    exportsBlock,
    "  runWrapperFunction: runMathFunction",
    "};",
    ""
  ].join("\n");
}

function renderPythonNeutralCore(coreDoc, wrapperRegistry) {
  const functionEntries = Object.values(wrapperRegistry.function_index || {}).sort((left, right) =>
    String(left.function_id || "").localeCompare(String(right.function_id || ""))
  );
  const wrappers = functionEntries
    .map((entry) => {
      const functionId = String(entry.function_id || "");
      const constKey = functionId
        .replace(/[^a-zA-Z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "")
        .toUpperCase();
      return [
        `def ${entry.language_symbols.python}(bound_args=None):`,
        `    return run_math_function(FUNCTION_IDS["${constKey}"], bound_args or {})`
      ].join("\n");
    })
    .join("\n\n");
  return [
    "\"\"\"Generated neutral core bindings for Python.\"\"\"",
    "",
    "from __future__ import annotations",
    "",
    "import importlib.util",
    "import json",
    "import pathlib",
    "",
    "",
    "def _load_wrapper_symbols():",
    "    module_path = pathlib.Path(__file__).resolve().with_name(\"wrapper_symbols.py\")",
    "    spec = importlib.util.spec_from_file_location(\"aio_wrapper_symbols\", module_path)",
    "    if spec is None or spec.loader is None:",
    "        raise RuntimeError(\"unable to load wrapper_symbols.py\")",
    "    module = importlib.util.module_from_spec(spec)",
    "    spec.loader.exec_module(module)",
    "    return module",
    "",
    "",
    "_WRAPPER_SYMBOLS = _load_wrapper_symbols()",
    `CORE_CONTRACT_CATALOG = json.loads(r'''${JSON.stringify(coreDoc, null, 2)}''')`,
    "FUNCTION_IDS = dict(getattr(_WRAPPER_SYMBOLS, \"FUNCTION_IDS\", {}))",
    `PURE_FUNCTION_IDS = tuple(${JSON.stringify(coreDoc.subsystems.math_core.pure_function_ids)})`,
    "",
    "",
    "def get_subsystem_contract(subsystem_id: str):",
    "    return CORE_CONTRACT_CATALOG.get(\"subsystems\", {}).get(str(subsystem_id or \"\"))",
    "",
    "",
    "def run_math_function(function_id: str, bound_args=None):",
    "    return _WRAPPER_SYMBOLS.run_wrapper_function(function_id, bound_args or {})",
    "",
    "",
    wrappers,
    "",
    "run_wrapper_function = run_math_function",
    ""
  ].join("\n");
}

function renderCppNeutralCoreHeader(coreDoc, wrapperRegistry) {
  const functionEntries = Object.values(wrapperRegistry.function_index || {}).sort((left, right) =>
    String(left.function_id || "").localeCompare(String(right.function_id || ""))
  );
  const declarations = functionEntries
    .map(
      (entry) =>
        `aio::wrapper_symbols::WrapperResult ${entry.language_symbols.python.replace(/[^a-z0-9_]/gi, "_")}(` +
        "const std::map<std::string, std::string>& bound_args);"
    )
    .join("\n");
  return [
    "#pragma once",
    "",
    "#include <map>",
    "#include <string>",
    "#include <vector>",
    "",
    "#include \"wrapper_symbols.hpp\"",
    "",
    "namespace aio::neutral_core {",
    "const std::vector<std::string>& pure_function_ids();",
    "const char* contract_id();",
    "aio::wrapper_symbols::WrapperResult run_math_function(",
    "    const std::string& function_id,",
    "    const std::map<std::string, std::string>& bound_args);",
    declarations,
    "}  // namespace aio::neutral_core",
    ""
  ].join("\n");
}

function renderCppNeutralCoreSource(coreDoc, wrapperRegistry) {
  const functionEntries = Object.values(wrapperRegistry.function_index || {}).sort((left, right) =>
    String(left.function_id || "").localeCompare(String(right.function_id || ""))
  );
  const pureFunctionRows = coreDoc.subsystems.math_core.pure_function_ids
    .map((functionId) => `      ${JSON.stringify(functionId)}`)
    .join(",\n");
  const wrappers = functionEntries
    .map((entry) => {
      const wrapperName = entry.language_symbols.python.replace(/[^a-z0-9_]/gi, "_");
      return [
        `aio::wrapper_symbols::WrapperResult ${wrapperName}(`,
        "    const std::map<std::string, std::string>& bound_args) {",
        `  return run_math_function(aio::wrapper_symbols::function_ids::${String(entry.function_id || "")
          .replace(/[^a-zA-Z0-9]+/g, "_")
          .replace(/^_+|_+$/g, "")
          .toUpperCase()}, bound_args);`,
        "}"
      ].join("\n");
    })
    .join("\n\n");
  return [
    "#include \"neutral_core.hpp\"",
    "",
    "namespace aio::neutral_core {",
    "const std::vector<std::string>& pure_function_ids() {",
    "  static const std::vector<std::string> kPureFunctionIds = {",
    pureFunctionRows,
    "  };",
    "  return kPureFunctionIds;",
    "}",
    "",
    "const char* contract_id() {",
    `  return ${JSON.stringify(coreDoc.catalog_id)};`,
    "}",
    "",
    "aio::wrapper_symbols::WrapperResult run_math_function(",
    "    const std::string& function_id,",
    "    const std::map<std::string, std::string>& bound_args) {",
    "  return aio::wrapper_symbols::run_wrapper_function(function_id, bound_args);",
    "}",
    "",
    wrappers,
    "}  // namespace aio::neutral_core",
    ""
  ].join("\n");
}

function renderRubyNeutralCore(coreDoc, wrapperRegistry) {
  const functionEntries = Object.values(wrapperRegistry.function_index || {}).sort((left, right) =>
    String(left.function_id || "").localeCompare(String(right.function_id || ""))
  );
  const wrappers = functionEntries
    .map((entry) => {
      const functionId = String(entry.function_id || "");
      const constKey = functionId
        .replace(/[^a-zA-Z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "")
        .toUpperCase();
      return [
        `    def self.${entry.language_symbols.ruby.split(".").pop}(bound_args = {})`,
        `      run_math_function(FUNCTION_IDS[${JSON.stringify(constKey)}], bound_args || {})`,
        "    end"
      ].join("\n");
    })
    .join("\n\n");
  return [
    "# frozen_string_literal: true",
    "",
    "require \"json\"",
    "require_relative \"wrapper_symbols\"",
    "",
    "module Aio",
    "  module NeutralCore",
    "    CORE_CONTRACT_CATALOG = JSON.parse(<<~'JSON')",
    JSON.stringify(coreDoc, null, 2),
    "    JSON",
    "",
    "    FUNCTION_IDS = Aio::WrapperSymbols::FUNCTION_IDS.dup.freeze",
    `    PURE_FUNCTION_IDS = ${JSON.stringify(coreDoc.subsystems.math_core.pure_function_ids)}.freeze`,
    "",
    "    def self.get_subsystem_contract(subsystem_id)",
    "      CORE_CONTRACT_CATALOG.fetch(\"subsystems\", {})[String(subsystem_id || \"\")]",
    "    end",
    "",
    "    def self.run_math_function(function_id, bound_args = {})",
    "      Aio::WrapperSymbols.run_wrapper_function(function_id, bound_args || {})",
    "    end",
    "",
    wrappers,
    "",
    "    class << self",
    "      alias run_wrapper_function run_math_function",
    "    end",
    "  end",
    "end",
    ""
  ].join("\n");
}

function generateNeutralCoreAssets(options = {}) {
  const root = findProjectRoot(options.root || process.cwd());
  const checkOnly = options.checkOnly === true;
  const quiet = options.quiet === true;
  const report = {
    status: "pass",
    root,
    check_only: checkOnly,
    artifacts: [],
    issues: []
  };

  const wrapperGeneration = generateWrapperBindingArtifacts({
    root,
    checkOnly,
    quiet: true
  });
  if (wrapperGeneration.status !== "pass") {
    return {
      ...report,
      status: "fail",
      issues: [
        ...report.issues,
        ...(wrapperGeneration.issues || [])
      ]
    };
  }

  const coreDoc = readJson(path.join(root, CORE_CONTRACT_PATH));
  const runtimeSources = readJson(path.join(root, RUNTIME_SOURCES_PATH));
  const storageContract = readJson(path.join(root, STORAGE_CONTRACT_PATH));
  const shellContract = readJson(path.join(root, SHELL_CONTRACT_PATH));
  const wrapperRegistry = readJson(path.join(root, WRAPPER_REGISTRY_PATH));
  const benchmarkReport = readJson(path.join(root, BENCHMARK_REPORT_PATH), {});
  const winnerMap = readJson(path.join(root, WINNER_MAP_PATH), {});

  const runtimeManifest = buildRuntimeManifest({
    coreDoc,
    runtimeSources,
    storageContract,
    shellContract,
    wrapperRegistry,
    benchmarkReport,
    winnerMap
  });
  const storageManifest = buildStorageManifest(storageContract);
  const shellManifest = buildShellManifest(shellContract);

  const outputs = {
    [OUTPUT_FILES.runtimeManifest]: stableJson(runtimeManifest),
    [OUTPUT_FILES.storageManifest]: stableJson(storageManifest),
    [OUTPUT_FILES.shellManifest]: stableJson(shellManifest),
    [OUTPUT_FILES.javascriptCore]: renderJavascriptNeutralCore(coreDoc, wrapperRegistry),
    [OUTPUT_FILES.pythonCore]: renderPythonNeutralCore(coreDoc, wrapperRegistry),
    [OUTPUT_FILES.cppHeader]: renderCppNeutralCoreHeader(coreDoc, wrapperRegistry),
    [OUTPUT_FILES.cppSource]: renderCppNeutralCoreSource(coreDoc, wrapperRegistry),
    [OUTPUT_FILES.rubyCore]: renderRubyNeutralCore(coreDoc, wrapperRegistry)
  };

  Object.keys(outputs).forEach((filePath) => {
    ensureOutputFile(filePath, outputs[filePath], checkOnly, report);
  });

  if (!quiet) {
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  }
  return report;
}

function checkNeutralCoreAssets(options = {}) {
  return generateNeutralCoreAssets({
    ...options,
    checkOnly: true
  });
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const report = generateNeutralCoreAssets({
    root: process.cwd(),
    checkOnly: args.checkOnly,
    quiet: args.quiet
  });
  if (report.status !== "pass") {
    process.exit(1);
  }
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    process.stderr.write(`generate-neutral-core-assets failed: ${error.message}\n`);
    process.exit(1);
  }
}

module.exports = {
  OUTPUT_FILES,
  generateNeutralCoreAssets,
  checkNeutralCoreAssets
};
