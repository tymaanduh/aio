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
    "  --skip-prune                    Skip workflow artifact prune step",
    "  --skip-hard-governance          Skip hard governance gate stage",
    "  --skip-preflight                Skip workflow preflight checks",
    "  --skip-output-format            Skip prettier formatting for generated output artifacts",
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
    skipPrune: false,
    skipHardGovernance: false,
    skipPreflight: false,
    skipOutputFormat: false,
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

    if (token === "--skip-prune") {
      args.skipPrune = true;
      continue;
    }

    if (token === "--skip-hard-governance") {
      args.skipHardGovernance = true;
      continue;
    }

    if (token === "--skip-preflight") {
      args.skipPreflight = true;
      continue;
    }

    if (token === "--skip-output-format") {
      args.skipOutputFormat = true;
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

  const errorMessage = result && result.error ? `${result.error.message || String(result.error)}\n` : "";
  const hasStatusCode = typeof result.status === "number";
  const statusCode = result && result.error ? 1 : hasStatusCode ? Number(result.status) : 0;

  return {
    command: [command, ...commandArgs].join(" "),
    statusCode,
    stdout: String(result.stdout || ""),
    stderr: `${String(result.stderr || "")}${errorMessage}`
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

function runPruneStage(args) {
  if (args.skipPrune) {
    return skippedStage("node scripts/prune-workflow-artifacts.js", "--skip-prune enabled");
  }
  return runCommandWithSummary("node", ["scripts/prune-workflow-artifacts.js"]);
}

function runHardGovernanceStage(args) {
  if (args.skipHardGovernance) {
    return skippedStage("node scripts/hard-governance-gate.js --enforce", "--skip-hard-governance enabled");
  }
  return runCommandWithSummary("node", ["scripts/hard-governance-gate.js", "--enforce"]);
}

function runUiuxBlueprintStage() {
  return runCommandWithSummary("node", ["scripts/generate-uiux-blueprint.js"]);
}

function runWrapperContractStage() {
  return runCommandWithSummary("node", ["scripts/validate-wrapper-contracts.js"]);
}

function runEfficiencyStage() {
  return runCommandWithSummary("node", ["scripts/codex-efficiency-audit.js", "--enforce"]);
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

function resolveNpxCommand() {
  return process.platform === "win32" ? "npx.cmd" : "npx";
}

function resolvePrettierCommand() {
  const localCli = path.join(ROOT, "node_modules", "prettier", "bin", "prettier.cjs");
  if (fs.existsSync(localCli)) {
    return {
      command: "node",
      commandArgsPrefix: [localCli]
    };
  }
  return {
    command: resolveNpxCommand(),
    commandArgsPrefix: ["prettier"]
  };
}

function buildOutputFormatTargets() {
  return [
    "data/output/databases/polyglot-default/analysis/workflow_preflight_report.json",
    "data/output/databases/polyglot-default/analysis/data_separation_audit_report.json",
    "data/output/databases/polyglot-default/build/polyglot_manifest.json",
    "data/output/databases/polyglot-default/context/run_state.json",
    "data/output/databases/polyglot-default/plan/hierarchy_order.md",
    "data/output/databases/polyglot-default/reports/final_recommendation.md"
  ];
}

function buildOutputFormatSummary(stdout, stderr, targets, skipped = false) {
  if (skipped) {
    return {
      skipped: true,
      reason: "--skip-output-format enabled"
    };
  }
  const lines = `${String(stdout || "")}\n${String(stderr || "")}`
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  return {
    skipped: false,
    targets,
    output_line_count: lines.length,
    output_tail: lines.slice(-50)
  };
}

function runOutputFormatStage(args) {
  const targets = buildOutputFormatTargets();
  if (args.skipOutputFormat) {
    const summary = buildOutputFormatSummary("", "", targets, true);
    return {
      result: {
        command: `prettier --write ${targets.join(" ")}`,
        statusCode: 0,
        stdout: JSON.stringify(summary, null, 2),
        stderr: ""
      },
      summary
    };
  }
  const prettierCommand = resolvePrettierCommand();
  const result = runCommand(prettierCommand.command, [...prettierCommand.commandArgsPrefix, "--write", ...targets]);
  return {
    result,
    summary: buildOutputFormatSummary(result.stdout, result.stderr, targets, false)
  };
}

function writeJsonSummary(payload) {
  process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
}

function exitOnFailedStage(stageResult) {
  process.stderr.write(stageResult.stderr);
  process.exit(stageResult.statusCode);
}

function skippedStage(command, reason) {
  return {
    result: {
      command,
      statusCode: 0,
      stdout: "",
      stderr: ""
    },
    summary: {
      skipped: true,
      reason
    }
  };
}

function buildWorkflowSummary({
  args,
  resolvedMode,
  preflightResult,
  preflightSummary,
  pruneResult,
  pruneSummary,
  uiuxBlueprintResult,
  uiuxBlueprintSummary,
  hardGovernanceResult,
  hardGovernanceSummary,
  agentRegistryValidationResult,
  agentRegistryValidationSummary,
  wrapperContractResult,
  wrapperContractSummary,
  efficiencyResult,
  efficiencySummary,
  pipelineCommandResult,
  pipelineSummary,
  separationCommandResult,
  separationSummary,
  outputFormatResult,
  outputFormatSummary
}) {
  return {
    mode_requested: args.mode,
    mode_resolved: resolvedMode,
    preflight: {
      command: preflightResult.command,
      statusCode: preflightResult.statusCode,
      summary: preflightSummary
    },
    prune: {
      command: pruneResult.command,
      statusCode: pruneResult.statusCode,
      summary: pruneSummary
    },
    uiux_blueprint: {
      command: uiuxBlueprintResult.command,
      statusCode: uiuxBlueprintResult.statusCode,
      summary: uiuxBlueprintSummary
    },
    hard_governance: {
      command: hardGovernanceResult.command,
      statusCode: hardGovernanceResult.statusCode,
      summary: hardGovernanceSummary
    },
    agent_registry_validation: {
      command: agentRegistryValidationResult.command,
      statusCode: agentRegistryValidationResult.statusCode,
      summary: agentRegistryValidationSummary
    },
    wrapper_contract_gate: {
      command: wrapperContractResult.command,
      statusCode: wrapperContractResult.statusCode,
      summary: wrapperContractSummary
    },
    efficiency_gate: {
      command: efficiencyResult.command,
      statusCode: efficiencyResult.statusCode,
      summary: efficiencySummary
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
    output_format: {
      command: outputFormatResult.command,
      statusCode: outputFormatResult.statusCode,
      summary: outputFormatSummary
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

  const pruneStage = runPruneStage(args);
  const pruneResult = pruneStage.result;
  const pruneSummary = pruneStage.summary;
  if (pruneResult.statusCode !== 0) {
    const pipelineRun = buildPipelineArgs(args);
    const skippedUiuxBlueprint = skippedStage(
      "node scripts/generate-uiux-blueprint.js",
      "blocked by prune failure"
    );
    const skippedHardGovernance = skippedStage(
      "node scripts/hard-governance-gate.js --enforce",
      "blocked by prune failure"
    );
    const skippedValidation = skippedStage("node scripts/validate-agent-registry.js", "blocked by prune failure");
    const skippedWrapper = skippedStage("node scripts/validate-wrapper-contracts.js", "blocked by prune failure");
    const skippedEfficiency = skippedStage("node scripts/codex-efficiency-audit.js --enforce", "blocked by prune failure");
    const skippedPipeline = skippedStage(`node ${pipelineRun.commandArgs.join(" ")}`, "blocked by prune failure");
    const skippedSeparation = skippedStage(
      `node scripts/data-separation-audit.js${args.enforceDataSeparation ? " --enforce" : ""}`,
      "blocked by prune failure"
    );
    const skippedOutputFormat = skippedStage(
      `prettier --write ${buildOutputFormatTargets().join(" ")}`,
      "blocked by prune failure"
    );
    writeJsonSummary(
      buildWorkflowSummary({
        args,
        resolvedMode: pipelineRun.resolvedMode,
        preflightResult,
        preflightSummary,
        pruneResult,
        pruneSummary,
        uiuxBlueprintResult: skippedUiuxBlueprint.result,
        uiuxBlueprintSummary: skippedUiuxBlueprint.summary,
        hardGovernanceResult: skippedHardGovernance.result,
        hardGovernanceSummary: skippedHardGovernance.summary,
        agentRegistryValidationResult: skippedValidation.result,
        agentRegistryValidationSummary: skippedValidation.summary,
        wrapperContractResult: skippedWrapper.result,
        wrapperContractSummary: skippedWrapper.summary,
        efficiencyResult: skippedEfficiency.result,
        efficiencySummary: skippedEfficiency.summary,
        pipelineCommandResult: skippedPipeline.result,
        pipelineSummary: skippedPipeline.summary,
        separationCommandResult: skippedSeparation.result,
        separationSummary: skippedSeparation.summary,
        outputFormatResult: skippedOutputFormat.result,
        outputFormatSummary: skippedOutputFormat.summary
      })
    );
    exitOnFailedStage(pruneResult);
  }

  const uiuxBlueprintStage = runUiuxBlueprintStage();
  const uiuxBlueprintResult = uiuxBlueprintStage.result;
  const uiuxBlueprintSummary = uiuxBlueprintStage.summary;
  if (uiuxBlueprintResult.statusCode !== 0) {
    const pipelineRun = buildPipelineArgs(args);
    const skippedHardGovernance = skippedStage(
      "node scripts/hard-governance-gate.js --enforce",
      "blocked by uiux blueprint failure"
    );
    const skippedValidation = skippedStage("node scripts/validate-agent-registry.js", "blocked by uiux blueprint failure");
    const skippedWrapper = skippedStage("node scripts/validate-wrapper-contracts.js", "blocked by uiux blueprint failure");
    const skippedEfficiency = skippedStage(
      "node scripts/codex-efficiency-audit.js --enforce",
      "blocked by uiux blueprint failure"
    );
    const skippedPipeline = skippedStage(
      `node ${pipelineRun.commandArgs.join(" ")}`,
      "blocked by uiux blueprint failure"
    );
    const skippedSeparation = skippedStage(
      `node scripts/data-separation-audit.js${args.enforceDataSeparation ? " --enforce" : ""}`,
      "blocked by uiux blueprint failure"
    );
    const skippedOutputFormat = skippedStage(
      `prettier --write ${buildOutputFormatTargets().join(" ")}`,
      "blocked by uiux blueprint failure"
    );

    writeJsonSummary(
      buildWorkflowSummary({
        args,
        resolvedMode: pipelineRun.resolvedMode,
        preflightResult,
        preflightSummary,
        pruneResult,
        pruneSummary,
        uiuxBlueprintResult,
        uiuxBlueprintSummary,
        hardGovernanceResult: skippedHardGovernance.result,
        hardGovernanceSummary: skippedHardGovernance.summary,
        agentRegistryValidationResult: skippedValidation.result,
        agentRegistryValidationSummary: skippedValidation.summary,
        wrapperContractResult: skippedWrapper.result,
        wrapperContractSummary: skippedWrapper.summary,
        efficiencyResult: skippedEfficiency.result,
        efficiencySummary: skippedEfficiency.summary,
        pipelineCommandResult: skippedPipeline.result,
        pipelineSummary: skippedPipeline.summary,
        separationCommandResult: skippedSeparation.result,
        separationSummary: skippedSeparation.summary,
        outputFormatResult: skippedOutputFormat.result,
        outputFormatSummary: skippedOutputFormat.summary
      })
    );
    exitOnFailedStage(uiuxBlueprintResult);
  }

  const hardGovernanceStage = runHardGovernanceStage(args);
  const hardGovernanceResult = hardGovernanceStage.result;
  const hardGovernanceSummary = hardGovernanceStage.summary;
  if (hardGovernanceResult.statusCode !== 0) {
    const pipelineRun = buildPipelineArgs(args);
    const skippedValidation = skippedStage("node scripts/validate-agent-registry.js", "blocked by hard governance failure");
    const skippedWrapper = skippedStage("node scripts/validate-wrapper-contracts.js", "blocked by hard governance failure");
    const skippedEfficiency = skippedStage(
      "node scripts/codex-efficiency-audit.js --enforce",
      "blocked by hard governance failure"
    );
    const skippedPipeline = skippedStage(`node ${pipelineRun.commandArgs.join(" ")}`, "blocked by hard governance failure");
    const skippedSeparation = skippedStage(
      `node scripts/data-separation-audit.js${args.enforceDataSeparation ? " --enforce" : ""}`,
      "blocked by hard governance failure"
    );
    const skippedOutputFormat = skippedStage(
      `prettier --write ${buildOutputFormatTargets().join(" ")}`,
      "blocked by hard governance failure"
    );
    writeJsonSummary(
      buildWorkflowSummary({
        args,
        resolvedMode: pipelineRun.resolvedMode,
        preflightResult,
        preflightSummary,
        pruneResult,
        pruneSummary,
        uiuxBlueprintResult,
        uiuxBlueprintSummary,
        hardGovernanceResult,
        hardGovernanceSummary,
        agentRegistryValidationResult: skippedValidation.result,
        agentRegistryValidationSummary: skippedValidation.summary,
        wrapperContractResult: skippedWrapper.result,
        wrapperContractSummary: skippedWrapper.summary,
        efficiencyResult: skippedEfficiency.result,
        efficiencySummary: skippedEfficiency.summary,
        pipelineCommandResult: skippedPipeline.result,
        pipelineSummary: skippedPipeline.summary,
        separationCommandResult: skippedSeparation.result,
        separationSummary: skippedSeparation.summary,
        outputFormatResult: skippedOutputFormat.result,
        outputFormatSummary: skippedOutputFormat.summary
      })
    );
    exitOnFailedStage(hardGovernanceResult);
  }

  const agentRegistryValidationStage = runAgentRegistryValidationStage();
  const agentRegistryValidationResult = agentRegistryValidationStage.result;
  const agentRegistryValidationSummary = agentRegistryValidationStage.summary;

  const wrapperContractStage = runWrapperContractStage();
  const wrapperContractResult = wrapperContractStage.result;
  const wrapperContractSummary = wrapperContractStage.summary;
  const efficiencyStage = runEfficiencyStage();
  const efficiencyResult = efficiencyStage.result;
  const efficiencySummary = efficiencyStage.summary;

  if (
    agentRegistryValidationResult.statusCode !== 0 ||
    wrapperContractResult.statusCode !== 0 ||
    efficiencyResult.statusCode !== 0
  ) {
    const pipelineRun = buildPipelineArgs(args);
    const skippedPipeline = skippedStage(
      `node ${pipelineRun.commandArgs.join(" ")}`,
      "blocked by validation gate failure"
    );
    const skippedSeparation = skippedStage(
      `node scripts/data-separation-audit.js${args.enforceDataSeparation ? " --enforce" : ""}`,
      "blocked by validation gate failure"
    );
    const skippedOutputFormat = skippedStage(
      `prettier --write ${buildOutputFormatTargets().join(" ")}`,
      "blocked by validation gate failure"
    );

    writeJsonSummary(
      buildWorkflowSummary({
        args,
        resolvedMode: pipelineRun.resolvedMode,
        preflightResult,
        preflightSummary,
        pruneResult,
        pruneSummary,
        uiuxBlueprintResult,
        uiuxBlueprintSummary,
        hardGovernanceResult,
        hardGovernanceSummary,
        agentRegistryValidationResult,
        agentRegistryValidationSummary,
        wrapperContractResult,
        wrapperContractSummary,
        efficiencyResult,
        efficiencySummary,
        pipelineCommandResult: skippedPipeline.result,
        pipelineSummary: skippedPipeline.summary,
        separationCommandResult: skippedSeparation.result,
        separationSummary: skippedSeparation.summary,
        outputFormatResult: skippedOutputFormat.result,
        outputFormatSummary: skippedOutputFormat.summary
      })
    );

    if (agentRegistryValidationResult.statusCode !== 0) {
      exitOnFailedStage(agentRegistryValidationResult);
    }
    if (wrapperContractResult.statusCode !== 0) {
      exitOnFailedStage(wrapperContractResult);
    }
    exitOnFailedStage(efficiencyResult);
  }

  const pipelineStage = runPipelineStage(args);
  const pipelineRun = pipelineStage.pipelineRun;
  const pipelineCommandResult = pipelineStage.result;
  const pipelineSummary = pipelineStage.summary;

  const separationStage = runSeparationAuditStage(args);
  const separationCommandResult = separationStage.result;
  const separationSummary = separationStage.summary;

  const outputFormatStage = runOutputFormatStage(args);
  const outputFormatResult = outputFormatStage.result;
  const outputFormatSummary = outputFormatStage.summary;

  writeJsonSummary(
    buildWorkflowSummary({
      args,
      resolvedMode: pipelineRun.resolvedMode,
      preflightResult,
      preflightSummary,
      pruneResult,
      pruneSummary,
      uiuxBlueprintResult,
      uiuxBlueprintSummary,
      hardGovernanceResult,
      hardGovernanceSummary,
      agentRegistryValidationResult,
      agentRegistryValidationSummary,
      wrapperContractResult,
      wrapperContractSummary,
      efficiencyResult,
      efficiencySummary,
      pipelineCommandResult,
      pipelineSummary,
      separationCommandResult,
      separationSummary,
      outputFormatResult,
      outputFormatSummary
    })
  );

  if (agentRegistryValidationResult.statusCode !== 0) {
    exitOnFailedStage(agentRegistryValidationResult);
  }

  if (wrapperContractResult.statusCode !== 0) {
    exitOnFailedStage(wrapperContractResult);
  }

  if (efficiencyResult.statusCode !== 0) {
    exitOnFailedStage(efficiencyResult);
  }

  if (pipelineCommandResult.statusCode !== 0) {
    exitOnFailedStage(pipelineCommandResult);
  }

  if (separationCommandResult.statusCode !== 0) {
    exitOnFailedStage(separationCommandResult);
  }

  if (outputFormatResult.statusCode !== 0) {
    exitOnFailedStage(outputFormatResult);
  }
}

try {
  main();
} catch (error) {
  process.stderr.write(`general-workflow failed: ${error.message}\n`);
  process.exit(1);
}
