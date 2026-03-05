#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { findProjectRoot } = require("./project-source-resolver");

const REGISTRY_PATH = path.join("data", "input", "shared", "wrapper", "wrapper_symbol_registry.json");
const OUTPUT_CASES_PATH = path.join("data", "input", "shared", "wrapper", "runtime_benchmark_cases.json");

function toCaseId(functionId) {
  return String(functionId || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function buildArgsForFunction(entry) {
  const functionId = String(entry && entry.function_id ? entry.function_id : "");
  const requiredInputs = (Array.isArray(entry && entry.inputs) ? entry.inputs : [])
    .filter((input) => Boolean(input && input.required))
    .map((input) => String(input.arg || "").trim())
    .filter(Boolean);

  const defaults = {
    x: 12,
    y: 3,
    a: 7,
    min: 0,
    max: 10
  };
  const args = {};
  requiredInputs.forEach((argName) => {
    args[argName] = Object.prototype.hasOwnProperty.call(defaults, argName) ? defaults[argName] : 1;
  });

  if (functionId === "math.divide") {
    args.y = 2;
  } else if (functionId === "math.equal") {
    args.x = 9;
    args.y = 9;
  } else if (functionId === "math.clamp") {
    args.x = 14;
    args.min = 0;
    args.max = 10;
  }

  return args;
}

function resetRuntimeBenchmarkCases(options = {}) {
  const root = findProjectRoot(options.root || process.cwd());
  const registryFile = path.join(root, REGISTRY_PATH);
  const outputFile = path.join(root, OUTPUT_CASES_PATH);

  if (!fs.existsSync(registryFile)) {
    throw new Error(`missing wrapper registry: ${registryFile}`);
  }

  const registry = JSON.parse(fs.readFileSync(registryFile, "utf8"));
  const functionEntries = Object.values(registry && registry.function_index && typeof registry.function_index === "object" ? registry.function_index : {})
    .filter((entry) => entry && typeof entry === "object")
    .sort((left, right) => String(left.function_id || "").localeCompare(String(right.function_id || "")));

  if (functionEntries.length === 0) {
    throw new Error("wrapper symbol registry contains zero function entries");
  }

  const cases = functionEntries.map((entry) => ({
    case_id: `${toCaseId(entry.function_id)}_default`,
    function_id: entry.function_id,
    args: buildArgsForFunction(entry)
  }));

  const payload = {
    schema_version: 1,
    benchmark_id: "aio_wrapper_runtime_matrix",
    description: "Reset benchmark cases generated from canonical wrapper function registry.",
    default_iterations: 50000,
    warmup_iterations: 1000,
    cases
  };

  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  return {
    status: "pass",
    root,
    output_file: OUTPUT_CASES_PATH.replace(/\\/g, "/"),
    function_count: functionEntries.length,
    case_count: cases.length
  };
}

function main() {
  const report = resetRuntimeBenchmarkCases({ root: process.cwd() });
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    process.stderr.write(`reset-runtime-benchmark-cases failed: ${error.message}\n`);
    process.exit(1);
  }
}

module.exports = {
  resetRuntimeBenchmarkCases
};

