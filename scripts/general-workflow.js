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
    '  --brief "text"                  Project brief',
    "  --brief-file <path>             Project brief file path",
    "  --project <name>                Project name",
    "  --scope <summary>               Scope summary",
    '  --planned-update "text"        Planned update item (repeatable)',
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
      args.mode = String(argv[index + 1] || "")
        .trim()
        .toLowerCase();
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

function parseCommandSummary(stdout) {
  return parseJsonFromCommandOutput(stdout, {
    parse_error: true,
    output_tail: String(stdout || "").slice(-2000)
  });
}

function runCommandWithSummary(command, commandArgs) {
  const result = runCommand(command, commandArgs);
  return {
    result,
    summary: parseCommandSummary(result.stdout)
  };
}

function runPreflightStage(args) {
  if (args.skipPreflight) {
    const summary = {
      ok: true,
      skipped: true,
      reason: "--skip-preflight enabled"
    };
    return {
      result: {
        command: "node scripts/workflow-preflight.js --scope general-workflow",
        statusCode: 0,
        stdout: JSON.stringify(summary, null, 2),
        stderr: ""
      },
      summary
    };
  }
  return runCommandWithSummary("node", ["scripts/workflow-preflight.js", "--scope", "general-workflow"]);
}

function runAgentRegistryValidationStage() {
  return runCommandWithSummary("node", ["scripts/validate-agent-registry.js"]);
}

function runPipelineStage(args) {
  const pipelineRun = buildPipelineArgs(args);
  const stage = runCommandWithSummary("node", pipelineRun.commandArgs);
  return {
    pipelineRun,
    result: stage.result,
    summary: stage.summary
  };
}

function runSeparationAuditStage(args) {
  const separationArgs = ["scripts/data-separation-audit.js"];
  if (args.enforceDataSeparation) {
    separationArgs.push("--enforce");
  }
  return runCommandWithSummary("node", separationArgs);
}

function writeJsonSummary(payload) {
  process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
}

function exitOnFailedStage(stageResult) {
  process.stderr.write(stageResult.stderr);
  process.exit(stageResult.statusCode);
}

function buildWorkflowSummary({
  args,
  resolvedMode,
  preflightResult,
  preflightSummary,
  agentRegistryValidationResult,
  agentRegistryValidationSummary,
  pipelineCommandResult,
  pipelineSummary,
  separationCommandResult,
  separationSummary
}) {
  return {
    mode_requested: args.mode,
    mode_resolved: resolvedMode,
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
}

function resolveMode(mode) {
  if (mode === "create" || mode === "maintain") {
    return mode;
  }
  return fs.existsSync(CONTEXT_FILE) ? "maintain" : "create";
}

function buildPipelineArgs(args) {
  const resolvedMode = resolveMode(args.mode);
  const commandArgs = [
    "scripts/polyglot-default-pipeline.js",
    "--mode",
    resolvedMode,
    "--sync-translation",
    "--rerun-gates"
  ];

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
  const preflightStage = runPreflightStage(args);
  const preflightResult = preflightStage.result;
  const preflightSummary = preflightStage.summary;

  if (preflightResult.statusCode !== 0) {
    writeJsonSummary({
      mode_requested: args.mode,
      mode_resolved: resolveMode(args.mode),
      preflight: {
        command: preflightResult.command,
        statusCode: preflightResult.statusCode,
        summary: preflightSummary
      },
      skipped_after_preflight_failure: true
    });
    exitOnFailedStage(preflightResult);
  }

  const agentRegistryValidationStage = runAgentRegistryValidationStage();
  const agentRegistryValidationResult = agentRegistryValidationStage.result;
  const agentRegistryValidationSummary = agentRegistryValidationStage.summary;

  const pipelineStage = runPipelineStage(args);
  const pipelineRun = pipelineStage.pipelineRun;
  const pipelineCommandResult = pipelineStage.result;
  const pipelineSummary = pipelineStage.summary;

  const separationStage = runSeparationAuditStage(args);
  const separationCommandResult = separationStage.result;
  const separationSummary = separationStage.summary;

  writeJsonSummary(
    buildWorkflowSummary({
      args,
      resolvedMode: pipelineRun.resolvedMode,
      preflightResult,
      preflightSummary,
      agentRegistryValidationResult,
      agentRegistryValidationSummary,
      pipelineCommandResult,
      pipelineSummary,
      separationCommandResult,
      separationSummary
    })
  );

  if (agentRegistryValidationResult.statusCode !== 0) {
    exitOnFailedStage(agentRegistryValidationResult);
  }

  if (pipelineCommandResult.statusCode !== 0) {
    exitOnFailedStage(pipelineCommandResult);
  }

  if (separationCommandResult.statusCode !== 0) {
    exitOnFailedStage(separationCommandResult);
  }
}

try {
  main();
} catch (error) {
  process.stderr.write(`general-workflow failed: ${error.message}\n`);
  process.exit(1);
}
