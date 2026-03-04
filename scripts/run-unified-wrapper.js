#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { create_unified_wrapper } = require("../brain/wrappers/unified_io_wrapper.js");

function printHelpAndExit(code) {
  const helpText = [
    "run-unified-wrapper",
    "",
    "Usage:",
    "  npm run wrapper:run -- [options]",
    "",
    "Options:",
    "  --pipeline-id <id>              Named pipeline id from catalog",
    "  --operations <a,b,c>            Comma-separated operation ids",
    "  --functions <f1,f2>             Comma-separated function ids (auto-build mode)",
    "  --function-specs-json <json>     JSON array of function stage specs",
    "  --input-json <json>              Input payload JSON object",
    "  --input-file <path>              Input payload JSON file",
    "  --spec-file <path>               Optional wrapper spec override JSON file",
    "  --help                           Show help"
  ].join("\n");
  process.stdout.write(`${helpText}\n`);
  process.exit(code);
}

function parseCsv(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function readJsonFile(filePath) {
  const absolute = path.resolve(process.cwd(), String(filePath || ""));
  const text = fs.readFileSync(absolute, "utf8");
  return JSON.parse(text);
}

function parseJsonObject(value, fallback = {}) {
  if (!value) {
    return fallback;
  }
  const parsed = JSON.parse(String(value));
  return parsed && typeof parsed === "object" ? parsed : fallback;
}

function parseArgs(argv) {
  const args = {
    pipelineId: "",
    operations: [],
    functions: [],
    functionSpecs: [],
    input: {},
    spec: {}
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (token === "--pipeline-id") {
      args.pipelineId = String(argv[index + 1] || "").trim();
      index += 1;
      continue;
    }

    if (token === "--operations") {
      args.operations = parseCsv(argv[index + 1]);
      index += 1;
      continue;
    }

    if (token === "--functions") {
      args.functions = parseCsv(argv[index + 1]);
      index += 1;
      continue;
    }

    if (token === "--function-specs-json") {
      const parsed = JSON.parse(String(argv[index + 1] || "[]"));
      args.functionSpecs = Array.isArray(parsed) ? parsed : [];
      index += 1;
      continue;
    }

    if (token === "--input-json") {
      args.input = parseJsonObject(argv[index + 1], {});
      index += 1;
      continue;
    }

    if (token === "--input-file") {
      args.input = readJsonFile(argv[index + 1]);
      index += 1;
      continue;
    }

    if (token === "--spec-file") {
      args.spec = readJsonFile(argv[index + 1]);
      index += 1;
      continue;
    }

    if (token === "--help" || token === "-h") {
      printHelpAndExit(0);
    }

    throw new Error(`unknown argument: ${token}`);
  }

  return args;
}

function run() {
  const args = parseArgs(process.argv.slice(2));
  const wrapper = create_unified_wrapper(args.spec, {});

  let result = null;

  if (args.pipelineId) {
    result = wrapper.run_pipeline_by_id(args.pipelineId, args.input);
  } else if (args.operations.length > 0) {
    const pipeline = wrapper.build_pipeline_from_operation_ids(args.operations);
    result = wrapper.run_two_pass(pipeline, args.input);
  } else if (args.functionSpecs.length > 0) {
    result = wrapper.run_auto_pipeline(args.functionSpecs, args.input);
  } else if (args.functions.length > 0) {
    result = wrapper.run_auto_pipeline(args.functions, args.input);
  } else {
    result = wrapper.run_pipeline_by_id("pipeline_default_math", args.input);
  }

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

try {
  run();
} catch (error) {
  process.stderr.write(`run-unified-wrapper failed: ${error.message}\n`);
  process.exit(1);
}
