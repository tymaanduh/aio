#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const CONTEXT_FILE = path.join(ROOT, "data", "output", "databases", "polyglot-default", "context", "run_state.json");

function printHelpAndExit(code) {
  const help = [
    "general-workflow",
    "",
    "Usage:",
    "  npm run workflow:general -- [options]",
    "  npm run workflow:continue -- [options]",
    "",
    "Options:",
    "  --mode <auto|create|maintain>   Run mode (default: auto)",
    "  --brief \"text\"                  Project brief",
    "  --brief-file <path>             Project brief file path",
    "  --project <name>                Project name",
    "  --scope <summary>               Scope summary",
    "  --planned-update \"text\"        Planned update item (repeatable)",
    "  --enforce-data-separation       Fail when separation audit reports remaining candidates",
    "  --skip-preflight                Skip workflow preflight checks",
    "  --fast                          Skip checks and benchmarks for quick iteration",
    "  --help                          Show help"
  ].join("\n");
  process.stdout.write(`${help}\n`);
  process.exit(code);
}

function parseArgs(argv) {
  const args = {
    mode: "auto",
    brief: "",
    briefFile: "",
    project: "",
    scope: "",
    plannedUpdates: [],
    enforceDataSeparation: false,
    skipPreflight: false,
    fast: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (token === "--mode") {
      args.mode = String(argv[index + 1] || "").trim().toLowerCase();
      index += 1;
      continue;
    }

    if (token === "--brief") {
      args.brief = String(argv[index + 1] || "");
      index += 1;
      continue;
    }

    if (token === "--brief-file") {
      args.briefFile = path.resolve(process.cwd(), String(argv[index + 1] || ""));
      index += 1;
      continue;
    }

    if (token === "--project") {
      args.project = String(argv[index + 1] || "");
      index += 1;
      continue;
    }

    if (token === "--scope") {
      args.scope = String(argv[index + 1] || "");
      index += 1;
      continue;
    }

    if (token === "--planned-update") {
      const value = String(argv[index + 1] || "").trim();
      if (value) {
        args.plannedUpdates.push(value);
      }
      index += 1;
      continue;
    }

    if (token === "--enforce-data-separation") {
      args.enforceDataSeparation = true;
      continue;
    }

    if (token === "--skip-preflight") {
      args.skipPreflight = true;
      continue;
    }

    if (token === "--fast") {
      args.fast = true;
      continue;
    }

    if (token === "--help" || token === "-h") {
      printHelpAndExit(0);
    }

    throw new Error(`unknown argument: ${token}`);
  }

  if (!["auto", "create", "maintain"].includes(args.mode)) {
    throw new Error("--mode must be one of: auto, create, maintain");
  }

  return args;
}

function parseJsonFromCommandOutput(rawText, fallback = {}) {
  const text = String(rawText || "").trim();
  if (!text) {
    return fallback;
  }

  const candidates = [text];
  const newlineObjectStart = text.lastIndexOf("\n{");
  if (newlineObjectStart >= 0) {
    candidates.push(text.slice(newlineObjectStart + 1).trim());
  }
  const braceStart = text.indexOf("{");
  const braceEnd = text.lastIndexOf("}");
  if (braceStart >= 0 && braceEnd >= braceStart) {
    candidates.push(text.slice(braceStart, braceEnd + 1));
  }

  for (let index = 0; index < candidates.length; index += 1) {
    try {
      return JSON.parse(candidates[index]);
    } catch {
      // continue
    }
  }

  return fallback;
}

function runCommand(command, commandArgs) {
  const result = spawnSync(command, commandArgs, {
    cwd: ROOT,
    encoding: "utf8",
    shell: false
  });

  return {
    command: [command, ...commandArgs].join(" "),
    statusCode: Number(result.status || 0),
    stdout: String(result.stdout || ""),
    stderr: String(result.stderr || "")
  };
}

function resolveMode(mode) {
  if (mode === "create" || mode === "maintain") {
    return mode;
  }
  return fs.existsSync(CONTEXT_FILE) ? "maintain" : "create";
}

function buildPipelineArgs(args) {
  const resolvedMode = resolveMode(args.mode);
  const commandArgs = ["scripts/polyglot-default-pipeline.js", "--mode", resolvedMode, "--sync-translation", "--rerun-gates"];

  if (args.brief) {
    commandArgs.push("--brief", args.brief);
  }
  if (args.briefFile) {
    commandArgs.push("--brief-file", args.briefFile);
  }
  if (args.project) {
    commandArgs.push("--project", args.project);
  }
  if (args.scope) {
    commandArgs.push("--scope", args.scope);
  }
  args.plannedUpdates.forEach((update) => {
    commandArgs.push("--planned-update", update);
  });
  if (args.fast) {
    commandArgs.push("--skip-checks", "--no-benchmark");
  }

  return {
    resolvedMode,
    commandArgs
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const preflightResult = args.skipPreflight
    ? {
        command: "node scripts/workflow-preflight.js --scope general-workflow",
        statusCode: 0,
        stdout: JSON.stringify(
          {
            ok: true,
            skipped: true,
            reason: "--skip-preflight enabled"
          },
          null,
          2
        ),
        stderr: ""
      }
    : runCommand("node", ["scripts/workflow-preflight.js", "--scope", "general-workflow"]);
  const preflightSummary = parseJsonFromCommandOutput(preflightResult.stdout, {
    parse_error: true,
    output_tail: preflightResult.stdout.slice(-2000)
  });

  if (preflightResult.statusCode !== 0) {
    const summary = {
      mode_requested: args.mode,
      mode_resolved: resolveMode(args.mode),
      preflight: {
        command: preflightResult.command,
        statusCode: preflightResult.statusCode,
        summary: preflightSummary
      },
      skipped_after_preflight_failure: true
    };
    process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
    process.stderr.write(preflightResult.stderr);
    process.exit(preflightResult.statusCode);
  }

  const agentRegistryValidationResult = runCommand("node", ["scripts/validate-agent-registry.js"]);
  const agentRegistryValidationSummary = parseJsonFromCommandOutput(agentRegistryValidationResult.stdout, {
    parse_error: true,
    output_tail: agentRegistryValidationResult.stdout.slice(-2000)
  });

  const pipelineRun = buildPipelineArgs(args);

  const pipelineCommandResult = runCommand("node", pipelineRun.commandArgs);
  const pipelineSummary = parseJsonFromCommandOutput(pipelineCommandResult.stdout, {
    parse_error: true,
    output_tail: pipelineCommandResult.stdout.slice(-2000)
  });

  const separationArgs = ["scripts/data-separation-audit.js"];
  if (args.enforceDataSeparation) {
    separationArgs.push("--enforce");
  }
  const separationCommandResult = runCommand("node", separationArgs);
  const separationSummary = parseJsonFromCommandOutput(separationCommandResult.stdout, {
    parse_error: true,
    output_tail: separationCommandResult.stdout.slice(-2000)
  });

  const summary = {
    mode_requested: args.mode,
    mode_resolved: pipelineRun.resolvedMode,
    preflight: {
      command: preflightResult.command,
      statusCode: preflightResult.statusCode,
      summary: preflightSummary
    },
    agent_registry_validation: {
      command: agentRegistryValidationResult.command,
      statusCode: agentRegistryValidationResult.statusCode,
      summary: agentRegistryValidationSummary
    },
    pipeline: {
      command: pipelineCommandResult.command,
      statusCode: pipelineCommandResult.statusCode,
      summary: pipelineSummary
    },
    separation_audit: {
      command: separationCommandResult.command,
      statusCode: separationCommandResult.statusCode,
      summary: separationSummary
    },
    stage_agents: [
      "pseudo-blueprint-planner-agent",
      "instruction-registry-governor-agent",
      "unified-wrapper-orchestrator-agent",
      "language-fit-selector-agent",
      "pseudocode-polyglot-translator-agent",
      "polyglot-quality-benchmark-agent"
    ]
  };

  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);

  if (agentRegistryValidationResult.statusCode !== 0) {
    process.stderr.write(agentRegistryValidationResult.stderr);
    process.exit(agentRegistryValidationResult.statusCode);
  }

  if (pipelineCommandResult.statusCode !== 0) {
    process.stderr.write(pipelineCommandResult.stderr);
    process.exit(pipelineCommandResult.statusCode);
  }

  if (separationCommandResult.statusCode !== 0) {
    process.stderr.write(separationCommandResult.stderr);
    process.exit(separationCommandResult.statusCode);
  }
}

try {
  main();
} catch (error) {
  process.stderr.write(`general-workflow failed: ${error.message}\n`);
  process.exit(1);
}
