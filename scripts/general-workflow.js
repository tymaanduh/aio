#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const { runScriptWithSwaps, toLanguageId, parseLanguageOrderCsv } = require("./lib/polyglot-script-swap-runner.js");

const ROOT = path.resolve(__dirname, "..");
const CONTEXT_FILE = path.join(ROOT, "data", "output", "databases", "polyglot-default", "context", "run_state.json");
const DEFAULT_SCRIPT_RUNTIME_REPORT_FILE = path.join(
  ROOT,
  "data",
  "output",
  "databases",
  "polyglot-default",
  "analysis",
  "script_runtime_swap_report.json"
);
const DEFAULT_SCRIPT_RUNTIME_REPORT_RELATIVE = path
  .relative(ROOT, DEFAULT_SCRIPT_RUNTIME_REPORT_FILE)
  .replace(/\\/g, "/");
const DEFAULT_RUNTIME_BACKLOG_JSON_FILE = path.join(
  ROOT,
  "data",
  "output",
  "databases",
  "polyglot-default",
  "plan",
  "runtime_optimization_backlog.json"
);
const DEFAULT_RUNTIME_BACKLOG_MD_FILE = path.join(
  ROOT,
  "data",
  "output",
  "databases",
  "polyglot-default",
  "plan",
  "runtime_optimization_backlog.md"
);

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
    "  --script-runtime <language>     Preferred script runtime language (javascript|python|cpp)",
    "  --script-runtime-order <csv>    Runtime fallback order for script stages (for example: cpp,python,javascript)",
    "  --script-runtime-auto-best      Auto-select stage runtime from benchmark winner evidence (default on)",
    "  --script-runtime-strict         Enforce selected runtime with no fallback retries",
    "  --disable-script-swaps          Force javascript runtime only for script stages",
    "  --script-runtime-report-file    Custom output path for script runtime telemetry report",
    "  --runtime-backlog-json-file     Custom output path for runtime optimization backlog JSON",
    "  --runtime-backlog-md-file       Custom output path for runtime optimization backlog markdown",
    "  --skip-runtime-backlog          Skip runtime optimization backlog generation stage",
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
    scriptRuntime: "",
    scriptRuntimeOrder: [],
    scriptRuntimeAutoBest: true,
    scriptRuntimeStrict: false,
    disableScriptSwaps: false,
    scriptRuntimeReportFile: DEFAULT_SCRIPT_RUNTIME_REPORT_FILE,
    runtimeBacklogJsonFile: DEFAULT_RUNTIME_BACKLOG_JSON_FILE,
    runtimeBacklogMdFile: DEFAULT_RUNTIME_BACKLOG_MD_FILE,
    skipRuntimeBacklog: false,
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

    if (token === "--script-runtime") {
      args.scriptRuntime = toLanguageId(argv[index + 1] || "");
      index += 1;
      continue;
    }

    if (token === "--script-runtime-order") {
      args.scriptRuntimeOrder = parseLanguageOrderCsv(argv[index + 1] || "");
      index += 1;
      continue;
    }

    if (token === "--script-runtime-auto-best") {
      args.scriptRuntimeAutoBest = true;
      continue;
    }

    if (token === "--disable-script-swaps") {
      args.disableScriptSwaps = true;
      continue;
    }

    if (token === "--script-runtime-strict") {
      args.scriptRuntimeStrict = true;
      continue;
    }

    if (token === "--script-runtime-report-file") {
      args.scriptRuntimeReportFile = path.resolve(process.cwd(), String(argv[index + 1] || ""));
      index += 1;
      continue;
    }

    if (token === "--runtime-backlog-json-file") {
      args.runtimeBacklogJsonFile = path.resolve(process.cwd(), String(argv[index + 1] || ""));
      index += 1;
      continue;
    }

    if (token === "--runtime-backlog-md-file") {
      args.runtimeBacklogMdFile = path.resolve(process.cwd(), String(argv[index + 1] || ""));
      index += 1;
      continue;
    }

    if (token === "--skip-runtime-backlog") {
      args.skipRuntimeBacklog = true;
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

  if (args.scriptRuntime && !["javascript", "python", "cpp"].includes(args.scriptRuntime)) {
    throw new Error("--script-runtime must be one of: javascript, python, cpp");
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

function runSwappableScriptStage(stageId, scriptArgs, args) {
  const result = runScriptWithSwaps({
    stageId,
    scriptArgs,
    preferredLanguage: args.scriptRuntime,
    runtimeOrder: args.scriptRuntimeOrder,
    autoSelectBest: args.scriptRuntimeAutoBest,
    strictRuntime: args.scriptRuntimeStrict,
    allowSwaps: !args.disableScriptSwaps
  });
  return {
    result,
    summary: parseCommandSummary(result.stdout)
  };
}

function runPreflightStage(args) {
  const preflightScriptArgs = ["--scope", "general-workflow"];
  if (args.scriptRuntime) {
    preflightScriptArgs.push("--script-runtime", args.scriptRuntime);
  }
  if (args.scriptRuntimeOrder.length > 0) {
    preflightScriptArgs.push("--script-runtime-order", args.scriptRuntimeOrder.join(","));
  }
  if (args.scriptRuntimeAutoBest) {
    preflightScriptArgs.push("--script-runtime-auto-best");
  }
  if (args.scriptRuntimeStrict) {
    preflightScriptArgs.push("--script-runtime-strict");
  }
  if (args.disableScriptSwaps) {
    preflightScriptArgs.push("--disable-script-swaps");
  }

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
  return runSwappableScriptStage("workflow_preflight", preflightScriptArgs, args);
}

function runAgentRegistryValidationStage(args) {
  return runSwappableScriptStage("validate_agent_registry", [], args);
}

function runPruneStage(args) {
  if (args.skipPrune) {
    return skippedStage("node scripts/prune-workflow-artifacts.js", "--skip-prune enabled");
  }
  return runSwappableScriptStage("prune_workflow_artifacts", [], args);
}

function runHardGovernanceStage(args) {
  if (args.skipHardGovernance) {
    return skippedStage("node scripts/hard-governance-gate.js --enforce", "--skip-hard-governance enabled");
  }
  return runSwappableScriptStage("hard_governance_gate", ["--enforce"], args);
}

function runUiuxBlueprintStage(args) {
  return runSwappableScriptStage("generate_uiux_blueprint", [], args);
}

function runWrapperContractStage(args) {
  return runSwappableScriptStage("validate_wrapper_contracts", [], args);
}

function runEfficiencyStage(args) {
  return runSwappableScriptStage("codex_efficiency_audit", ["--enforce"], args);
}

function runPipelineStage(args) {
  const pipelineRun = buildPipelineArgs(args);
  const stage = runSwappableScriptStage("polyglot_default_pipeline", pipelineRun.scriptArgs, args);
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
  const scriptArgs = separationArgs.slice(1);
  return runSwappableScriptStage("data_separation_audit", scriptArgs, args);
}

function runRuntimeOptimizationBacklogStage(args) {
  if (args.skipRuntimeBacklog) {
    return skippedStage(
      "node scripts/generate-runtime-optimization-backlog.js",
      "--skip-runtime-backlog enabled"
    );
  }
  const scriptArgs = [
    "--runtime-report-file",
    args.scriptRuntimeReportFile,
    "--json-out",
    args.runtimeBacklogJsonFile,
    "--md-out",
    args.runtimeBacklogMdFile
  ];
  return runSwappableScriptStage("generate_runtime_optimization_backlog", scriptArgs, args);
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

function buildOutputFormatTargets(args = {}) {
  const reportFile = args.scriptRuntimeReportFile
    ? path.resolve(String(args.scriptRuntimeReportFile))
    : DEFAULT_SCRIPT_RUNTIME_REPORT_FILE;
  const reportFileRelative = path.relative(ROOT, reportFile).replace(/\\/g, "/");
  const runtimeBacklogJsonFile = args.runtimeBacklogJsonFile
    ? path.resolve(String(args.runtimeBacklogJsonFile))
    : DEFAULT_RUNTIME_BACKLOG_JSON_FILE;
  const runtimeBacklogMdFile = args.runtimeBacklogMdFile
    ? path.resolve(String(args.runtimeBacklogMdFile))
    : DEFAULT_RUNTIME_BACKLOG_MD_FILE;
  const targets = [
    "data/output/databases/polyglot-default/analysis/workflow_preflight_report.json",
    "data/output/databases/polyglot-default/analysis/data_separation_audit_report.json",
    "data/output/databases/polyglot-default/build/polyglot_manifest.json",
    "data/output/databases/polyglot-default/context/run_state.json",
    "data/output/databases/polyglot-default/plan/hierarchy_order.md",
    "data/output/databases/polyglot-default/reports/final_recommendation.md"
  ];
  if (fs.existsSync(reportFile)) {
    targets.push(reportFileRelative);
  }
  if (fs.existsSync(runtimeBacklogJsonFile)) {
    targets.push(path.relative(ROOT, runtimeBacklogJsonFile).replace(/\\/g, "/"));
  }
  if (fs.existsSync(runtimeBacklogMdFile)) {
    targets.push(path.relative(ROOT, runtimeBacklogMdFile).replace(/\\/g, "/"));
  }
  return targets;
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
  const targets = buildOutputFormatTargets(args);
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

function toRuntimeStageEntry(stageName, stageResult) {
  const runtime = stageResult && stageResult.runtime && typeof stageResult.runtime === "object" ? stageResult.runtime : {};
  const attempts = Array.isArray(runtime.attempts) ? runtime.attempts : [];
  const selection = runtime.selection && typeof runtime.selection === "object" ? runtime.selection : {};
  const fallbackUsed = Boolean(
    runtime.fallback_used ||
      attempts.filter((attempt) => attempt && attempt.skipped !== true).length > 1 ||
      attempts.length > 1
  );
  return {
    stage: stageName,
    script_file: String(runtime.script_file || ""),
    selected_language: String(runtime.selected_language || ""),
    swapped: Boolean(runtime.swapped),
    strict_runtime: Boolean(runtime.strict_runtime),
    auto_best_language: String(selection.auto_best_language || ""),
    auto_best_source: String(selection.auto_best_source || ""),
    auto_select_enabled: Boolean(selection.auto_select_enabled),
    status_code: Number(stageResult && typeof stageResult.statusCode === "number" ? stageResult.statusCode : 0),
    duration_ms: Number(runtime.duration_ms || 0),
    attempt_count: Number(runtime.attempt_count || attempts.length || 0),
    fallback_used: fallbackUsed,
    attempts,
    selection
  };
}

function buildScriptRuntimeReport(args, stageResults) {
  const stageEntries = [
    toRuntimeStageEntry("preflight", stageResults.preflightResult),
    toRuntimeStageEntry("prune", stageResults.pruneResult),
    toRuntimeStageEntry("uiux_blueprint", stageResults.uiuxBlueprintResult),
    toRuntimeStageEntry("hard_governance", stageResults.hardGovernanceResult),
    toRuntimeStageEntry("agent_registry_validation", stageResults.agentRegistryValidationResult),
    toRuntimeStageEntry("wrapper_contract_gate", stageResults.wrapperContractResult),
    toRuntimeStageEntry("efficiency_gate", stageResults.efficiencyResult),
    toRuntimeStageEntry("pipeline", stageResults.pipelineCommandResult),
    toRuntimeStageEntry("separation_audit", stageResults.separationCommandResult),
    toRuntimeStageEntry("runtime_optimization_backlog", stageResults.runtimeBacklogResult)
  ];

  const metric = {
    stage_count: stageEntries.length,
    swapped_stage_count: stageEntries.filter((entry) => entry.swapped).length,
    fallback_used_stage_count: stageEntries.filter((entry) => entry.fallback_used).length,
    strict_stage_count: stageEntries.filter((entry) => entry.strict_runtime).length,
    failed_stage_count: stageEntries.filter((entry) => entry.status_code !== 0).length,
    total_duration_ms: stageEntries.reduce((sum, entry) => sum + Number(entry.duration_ms || 0), 0)
  };

  const selectedLanguageCoverage = {};
  stageEntries.forEach((entry) => {
    const language = String(entry.selected_language || "").trim();
    if (!language) {
      return;
    }
    selectedLanguageCoverage[language] = Number(selectedLanguageCoverage[language] || 0) + 1;
  });

  return {
    schema_version: 1,
    report_id: "aio_script_runtime_swap_report",
    generated_at: new Date().toISOString(),
    root: ROOT,
    report_file: path.relative(ROOT, args.scriptRuntimeReportFile).replace(/\\/g, "/"),
    controls: {
      preferred_language: args.scriptRuntime,
      runtime_order: args.scriptRuntimeOrder,
      auto_select_best: args.scriptRuntimeAutoBest,
      strict_runtime: args.scriptRuntimeStrict,
      disable_swaps: args.disableScriptSwaps
    },
    metrics: {
      ...metric,
      selected_language_coverage: selectedLanguageCoverage
    },
    stages: stageEntries
  };
}

function writeScriptRuntimeReport(report, reportFilePath) {
  fs.mkdirSync(path.dirname(reportFilePath), { recursive: true });
  fs.writeFileSync(reportFilePath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
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
  runtimeBacklogResult,
  runtimeBacklogSummary,
  scriptRuntimeReport,
  outputFormatResult,
  outputFormatSummary
}) {
  return {
    mode_requested: args.mode,
    mode_resolved: resolvedMode,
    preflight: {
      command: preflightResult.command,
      statusCode: preflightResult.statusCode,
      runtime: preflightResult.runtime || null,
      summary: preflightSummary
    },
    prune: {
      command: pruneResult.command,
      statusCode: pruneResult.statusCode,
      runtime: pruneResult.runtime || null,
      summary: pruneSummary
    },
    uiux_blueprint: {
      command: uiuxBlueprintResult.command,
      statusCode: uiuxBlueprintResult.statusCode,
      runtime: uiuxBlueprintResult.runtime || null,
      summary: uiuxBlueprintSummary
    },
    hard_governance: {
      command: hardGovernanceResult.command,
      statusCode: hardGovernanceResult.statusCode,
      runtime: hardGovernanceResult.runtime || null,
      summary: hardGovernanceSummary
    },
    agent_registry_validation: {
      command: agentRegistryValidationResult.command,
      statusCode: agentRegistryValidationResult.statusCode,
      runtime: agentRegistryValidationResult.runtime || null,
      summary: agentRegistryValidationSummary
    },
    wrapper_contract_gate: {
      command: wrapperContractResult.command,
      statusCode: wrapperContractResult.statusCode,
      runtime: wrapperContractResult.runtime || null,
      summary: wrapperContractSummary
    },
    efficiency_gate: {
      command: efficiencyResult.command,
      statusCode: efficiencyResult.statusCode,
      runtime: efficiencyResult.runtime || null,
      summary: efficiencySummary
    },
    pipeline: {
      command: pipelineCommandResult.command,
      statusCode: pipelineCommandResult.statusCode,
      runtime: pipelineCommandResult.runtime || null,
      summary: pipelineSummary
    },
    separation_audit: {
      command: separationCommandResult.command,
      statusCode: separationCommandResult.statusCode,
      runtime: separationCommandResult.runtime || null,
      summary: separationSummary
    },
    runtime_optimization_backlog: {
      command:
        runtimeBacklogResult && runtimeBacklogResult.command
          ? runtimeBacklogResult.command
          : "node scripts/generate-runtime-optimization-backlog.js",
      statusCode:
        runtimeBacklogResult && typeof runtimeBacklogResult.statusCode === "number"
          ? runtimeBacklogResult.statusCode
          : 0,
      runtime: runtimeBacklogResult && runtimeBacklogResult.runtime ? runtimeBacklogResult.runtime : null,
      summary:
        runtimeBacklogSummary && typeof runtimeBacklogSummary === "object"
          ? runtimeBacklogSummary
          : {
              skipped: true,
              reason: "stage not reached"
            }
    },
    output_format: {
      command: outputFormatResult.command,
      statusCode: outputFormatResult.statusCode,
      summary: outputFormatSummary
    },
    script_runtime_optimization: {
      report_file:
        scriptRuntimeReport && scriptRuntimeReport.report_file
          ? scriptRuntimeReport.report_file
          : DEFAULT_SCRIPT_RUNTIME_REPORT_RELATIVE,
      controls: {
        preferred_language: args.scriptRuntime,
        runtime_order: args.scriptRuntimeOrder,
        auto_select_best: args.scriptRuntimeAutoBest,
        strict_runtime: args.scriptRuntimeStrict,
        disable_swaps: args.disableScriptSwaps
      },
      metrics:
        scriptRuntimeReport && scriptRuntimeReport.metrics
          ? scriptRuntimeReport.metrics
          : {
              stage_count: 0,
              swapped_stage_count: 0,
              fallback_used_stage_count: 0,
              strict_stage_count: 0,
              failed_stage_count: 0,
              total_duration_ms: 0,
              selected_language_coverage: {}
            }
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
  const scriptArgs = [
    "--mode",
    resolvedMode,
    "--sync-translation",
    "--rerun-gates"
  ];

  if (args.brief) {
    scriptArgs.push("--brief", args.brief);
  }
  if (args.briefFile) {
    scriptArgs.push("--brief-file", args.briefFile);
  }
  if (args.project) {
    scriptArgs.push("--project", args.project);
  }
  if (args.scope) {
    scriptArgs.push("--scope", args.scope);
  }
  args.plannedUpdates.forEach((update) => {
    scriptArgs.push("--planned-update", update);
  });
  if (args.fast) {
    scriptArgs.push("--skip-checks", "--no-benchmark");
  }

  return {
    resolvedMode,
    scriptArgs,
    commandArgs: ["scripts/polyglot-default-pipeline.js", ...scriptArgs]
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
      `prettier --write ${buildOutputFormatTargets(args).join(" ")}`,
      "blocked by prune failure"
    );
    const emptyRuntimeReport = buildScriptRuntimeReport(args, {
      preflightResult,
      pruneResult,
      uiuxBlueprintResult: skippedUiuxBlueprint.result,
      hardGovernanceResult: skippedHardGovernance.result,
      agentRegistryValidationResult: skippedValidation.result,
      wrapperContractResult: skippedWrapper.result,
      efficiencyResult: skippedEfficiency.result,
      pipelineCommandResult: skippedPipeline.result,
      separationCommandResult: skippedSeparation.result
    });
    writeScriptRuntimeReport(emptyRuntimeReport, args.scriptRuntimeReportFile);
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
        scriptRuntimeReport: emptyRuntimeReport,
        outputFormatResult: skippedOutputFormat.result,
        outputFormatSummary: skippedOutputFormat.summary
      })
    );
    exitOnFailedStage(pruneResult);
  }

  const uiuxBlueprintStage = runUiuxBlueprintStage(args);
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
      `prettier --write ${buildOutputFormatTargets(args).join(" ")}`,
      "blocked by uiux blueprint failure"
    );
    const emptyRuntimeReport = buildScriptRuntimeReport(args, {
      preflightResult,
      pruneResult,
      uiuxBlueprintResult,
      hardGovernanceResult: skippedHardGovernance.result,
      agentRegistryValidationResult: skippedValidation.result,
      wrapperContractResult: skippedWrapper.result,
      efficiencyResult: skippedEfficiency.result,
      pipelineCommandResult: skippedPipeline.result,
      separationCommandResult: skippedSeparation.result
    });
    writeScriptRuntimeReport(emptyRuntimeReport, args.scriptRuntimeReportFile);

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
        scriptRuntimeReport: emptyRuntimeReport,
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
      `prettier --write ${buildOutputFormatTargets(args).join(" ")}`,
      "blocked by hard governance failure"
    );
    const emptyRuntimeReport = buildScriptRuntimeReport(args, {
      preflightResult,
      pruneResult,
      uiuxBlueprintResult,
      hardGovernanceResult,
      agentRegistryValidationResult: skippedValidation.result,
      wrapperContractResult: skippedWrapper.result,
      efficiencyResult: skippedEfficiency.result,
      pipelineCommandResult: skippedPipeline.result,
      separationCommandResult: skippedSeparation.result
    });
    writeScriptRuntimeReport(emptyRuntimeReport, args.scriptRuntimeReportFile);
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
        scriptRuntimeReport: emptyRuntimeReport,
        outputFormatResult: skippedOutputFormat.result,
        outputFormatSummary: skippedOutputFormat.summary
      })
    );
    exitOnFailedStage(hardGovernanceResult);
  }

  const agentRegistryValidationStage = runAgentRegistryValidationStage(args);
  const agentRegistryValidationResult = agentRegistryValidationStage.result;
  const agentRegistryValidationSummary = agentRegistryValidationStage.summary;

  const wrapperContractStage = runWrapperContractStage(args);
  const wrapperContractResult = wrapperContractStage.result;
  const wrapperContractSummary = wrapperContractStage.summary;
  const efficiencyStage = runEfficiencyStage(args);
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
      `prettier --write ${buildOutputFormatTargets(args).join(" ")}`,
      "blocked by validation gate failure"
    );
    const emptyRuntimeReport = buildScriptRuntimeReport(args, {
      preflightResult,
      pruneResult,
      uiuxBlueprintResult,
      hardGovernanceResult,
      agentRegistryValidationResult,
      wrapperContractResult,
      efficiencyResult,
      pipelineCommandResult: skippedPipeline.result,
      separationCommandResult: skippedSeparation.result
    });
    writeScriptRuntimeReport(emptyRuntimeReport, args.scriptRuntimeReportFile);

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
        scriptRuntimeReport: emptyRuntimeReport,
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
  const runtimeBacklogStage = runRuntimeOptimizationBacklogStage(args);
  const runtimeBacklogResult = runtimeBacklogStage.result;
  const runtimeBacklogSummary = runtimeBacklogStage.summary;

  const scriptRuntimeReport = buildScriptRuntimeReport(args, {
    preflightResult,
    pruneResult,
    uiuxBlueprintResult,
    hardGovernanceResult,
    agentRegistryValidationResult,
    wrapperContractResult,
    efficiencyResult,
    pipelineCommandResult,
    separationCommandResult,
    runtimeBacklogResult
  });
  writeScriptRuntimeReport(scriptRuntimeReport, args.scriptRuntimeReportFile);

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
      runtimeBacklogResult,
      runtimeBacklogSummary,
      scriptRuntimeReport,
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

  if (runtimeBacklogResult.statusCode !== 0) {
    exitOnFailedStage(runtimeBacklogResult);
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
