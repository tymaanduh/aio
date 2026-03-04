#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { spawn, spawnSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const CONTEXT_FILE = path.join(ROOT, "data", "output", "databases", "polyglot-default", "context", "run_state.json");
const UPDATE_WATCH_ACTOR = "polyglot-default-director-agent";
const UPDATE_WATCH_OUTPUT_LIMIT = 8000;

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
    "  --skip-update-watch             Skip updates:watch process during workflow run",
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
    skipUpdateWatch: false,
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

    if (token === "--skip-update-watch") {
      args.skipUpdateWatch = true;
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

function createUpdateWatchSessionId() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const suffix = Math.random().toString(36).slice(2, 8);
  return `workflow_${timestamp}_${suffix}`;
}

function trimTail(text) {
  return String(text || "").slice(-2000);
}

function startUpdateWatch(skipUpdateWatch) {
  if (skipUpdateWatch) {
    return {
      skipped: true,
      reason: "--skip-update-watch enabled"
    };
  }

  const sessionId = createUpdateWatchSessionId();
  const child = spawn(
    "node",
    ["scripts/repo-update-log.js", "watch", "--actor", UPDATE_WATCH_ACTOR, "--session-id", sessionId],
    {
      cwd: ROOT,
      shell: false,
      stdio: ["ignore", "pipe", "pipe"]
    }
  );

  let stdoutBuffer = "";
  let stderrBuffer = "";
  if (child.stdout) {
    child.stdout.on("data", (chunk) => {
      stdoutBuffer = `${stdoutBuffer}${String(chunk || "")}`.slice(-UPDATE_WATCH_OUTPUT_LIMIT);
    });
  }
  if (child.stderr) {
    child.stderr.on("data", (chunk) => {
      stderrBuffer = `${stderrBuffer}${String(chunk || "")}`.slice(-UPDATE_WATCH_OUTPUT_LIMIT);
    });
  }

  return {
    skipped: false,
    started_at: new Date().toISOString(),
    session_id: sessionId,
    child,
    get_stdout_tail() {
      return trimTail(stdoutBuffer);
    },
    get_stderr_tail() {
      return trimTail(stderrBuffer);
    }
  };
}

function stopUpdateWatch(watchHandle) {
  if (!watchHandle || watchHandle.skipped) {
    return Promise.resolve({
      skipped: true,
      reason: watchHandle && watchHandle.reason ? watchHandle.reason : "watch_not_started"
    });
  }

  const child = watchHandle.child;
  if (!child) {
    return Promise.resolve({
      skipped: true,
      reason: "watch_process_unavailable",
      session_id: watchHandle.session_id || ""
    });
  }

  if (child.exitCode !== null) {
    return Promise.resolve({
      skipped: false,
      session_id: watchHandle.session_id,
      started_at: watchHandle.started_at,
      stopped_with: "already_exited",
      exit_code: child.exitCode,
      signal: child.signalCode || null,
      stdout_tail: watchHandle.get_stdout_tail(),
      stderr_tail: watchHandle.get_stderr_tail()
    });
  }

  return new Promise((resolve) => {
    let settled = false;
    const settle = (payload) => {
      if (settled) {
        return;
      }
      settled = true;
      resolve(payload);
    };

    const forceKillTimer = setTimeout(() => {
      if (child.exitCode === null) {
        child.kill("SIGKILL");
      }
    }, 4000);

    child.once("exit", (code, signal) => {
      clearTimeout(forceKillTimer);
      settle({
        skipped: false,
        session_id: watchHandle.session_id,
        started_at: watchHandle.started_at,
        stopped_with: "signal",
        exit_code: Number.isFinite(Number(code)) ? Number(code) : null,
        signal: signal || null,
        stdout_tail: watchHandle.get_stdout_tail(),
        stderr_tail: watchHandle.get_stderr_tail()
      });
    });

    child.kill("SIGTERM");
  });
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

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const updateWatchHandle = startUpdateWatch(args.skipUpdateWatch);
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
  const updateWatchSummary = await stopUpdateWatch(updateWatchHandle);

  const summary = {
    mode_requested: args.mode,
    mode_resolved: pipelineRun.resolvedMode,
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
    update_watch: updateWatchSummary,
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

main().catch((error) => {
  process.stderr.write(`general-workflow failed: ${error.message}\n`);
  process.exit(1);
});
