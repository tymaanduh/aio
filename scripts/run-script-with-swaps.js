#!/usr/bin/env node
"use strict";

const path = require("path");
const { runScriptWithSwaps } = require("./lib/polyglot-script-swap-runner");

function parseArgs(argv) {
  const args = {
    stageId: "",
    script: "",
    preferredLanguage: "",
    runtimeOrder: [],
    strictRuntime: false,
    autoSelectBest: false,
    allowSwaps: true,
    cwd: "",
    scriptArgs: []
  };

  let passthrough = false;
  for (let index = 0; index < argv.length; index += 1) {
    const token = String(argv[index] || "");
    if (passthrough) {
      args.scriptArgs.push(token);
      continue;
    }
    if (token === "--") {
      passthrough = true;
      continue;
    }
    if (token === "--stage-id" && argv[index + 1]) {
      args.stageId = String(argv[index + 1] || "").trim();
      index += 1;
      continue;
    }
    if (token === "--script" && argv[index + 1]) {
      args.script = String(argv[index + 1] || "").trim();
      index += 1;
      continue;
    }
    if (token === "--preferred-language" && argv[index + 1]) {
      args.preferredLanguage = String(argv[index + 1] || "").trim();
      index += 1;
      continue;
    }
    if (token === "--runtime-order" && argv[index + 1]) {
      args.runtimeOrder = String(argv[index + 1] || "")
        .split(",")
        .map((entry) => String(entry || "").trim())
        .filter(Boolean);
      index += 1;
      continue;
    }
    if (token === "--cwd" && argv[index + 1]) {
      args.cwd = String(argv[index + 1] || "").trim();
      index += 1;
      continue;
    }
    if (token === "--strict-runtime") {
      args.strictRuntime = true;
      continue;
    }
    if (token === "--auto-select-best") {
      args.autoSelectBest = true;
      continue;
    }
    if (token === "--no-swaps") {
      args.allowSwaps = false;
      continue;
    }
  }

  return args;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.script && !args.stageId) {
    throw new Error("run-script-with-swaps requires --script or --stage-id");
  }

  const result = runScriptWithSwaps({
    stageId: args.stageId,
    scriptPath: args.script ? path.resolve(process.cwd(), args.script) : "",
    scriptArgs: args.scriptArgs,
    preferredLanguage: args.preferredLanguage,
    runtimeOrder: args.runtimeOrder,
    strictRuntime: args.strictRuntime,
    autoSelectBest: args.autoSelectBest,
    allowSwaps: args.allowSwaps,
    cwd: args.cwd ? path.resolve(process.cwd(), args.cwd) : process.cwd()
  });

  if (result.stdout) {
    process.stdout.write(String(result.stdout));
  }
  if (result.stderr) {
    process.stderr.write(String(result.stderr));
  }
  process.exit(Number(result.statusCode || 0));
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    process.stderr.write(`run-script-with-swaps failed: ${error.message}\n`);
    process.exit(1);
  }
}
