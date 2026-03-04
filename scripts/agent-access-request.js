#!/usr/bin/env node
"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const {
  resolveAgentAccessControl,
  resolveRequestLogFile
} = require("./project-source-resolver");

const runtimeContext = {
  root: "",
  policyPath: ""
};

function printHelpAndExit(code) {
  const helpText = [
    "agent-access-request",
    "",
    "Usage:",
    "  npm run agent:request-access -- --agent-id <id> --requested-tool <tool-id> --privilege-flag <flag-id> --reason \"<why-needed>\"",
    "",
    "Options:",
    "  --agent-id <id>                     Agent id in to-do/agents/agent_access_control.json",
    "  --requested-tool <tool-id>          Requested tool id (repeatable)",
    "  --requested-toolset <a,b,c>         Comma-separated requested tools",
    "  --requested-control <control-id>    Requested control scope entry (repeatable)",
    "  --privilege-flag <flag-id>          Privilege flag id (repeatable)",
    "  --reason \"text\"                    Required explanation for escalation",
    "  --explanation \"text\"               Alias for --reason",
    "  --help                              Show help"
  ].join("\n");
  process.stdout.write(`${helpText}\n`);
  process.exit(code);
}

function toUniqueSorted(values) {
  return [...new Set((Array.isArray(values) ? values : []).map((value) => String(value || "").trim()).filter(Boolean))].sort();
}

function parseArgs(argv) {
  const args = {
    agentId: "",
    requestedTools: [],
    requestedControls: [],
    privilegeFlags: [],
    reason: ""
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (token === "--agent-id") {
      args.agentId = String(argv[index + 1] || "").trim();
      index += 1;
      continue;
    }

    if (token === "--requested-tool") {
      const value = String(argv[index + 1] || "").trim();
      if (value) {
        args.requestedTools.push(value);
      }
      index += 1;
      continue;
    }

    if (token === "--requested-toolset") {
      const value = String(argv[index + 1] || "").trim();
      if (value) {
        value
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
          .forEach((item) => args.requestedTools.push(item));
      }
      index += 1;
      continue;
    }

    if (token === "--requested-control") {
      const value = String(argv[index + 1] || "").trim();
      if (value) {
        args.requestedControls.push(value);
      }
      index += 1;
      continue;
    }

    if (token === "--privilege-flag") {
      const value = String(argv[index + 1] || "").trim();
      if (value) {
        args.privilegeFlags.push(value);
      }
      index += 1;
      continue;
    }

    if (token === "--reason" || token === "--explanation") {
      args.reason = String(argv[index + 1] || "").trim();
      index += 1;
      continue;
    }

    if (token === "--help" || token === "-h") {
      printHelpAndExit(0);
    }

    throw new Error(`unknown argument: ${token}`);
  }

  args.requestedTools = toUniqueSorted(args.requestedTools);
  args.requestedControls = toUniqueSorted(args.requestedControls);
  args.privilegeFlags = toUniqueSorted(args.privilegeFlags);

  if (!args.agentId) {
    throw new Error("--agent-id is required");
  }
  if (!args.requestedTools.length) {
    throw new Error("at least one --requested-tool (or --requested-toolset) is required");
  }
  if (!args.privilegeFlags.length) {
    throw new Error("at least one --privilege-flag is required");
  }
  if (!args.reason) {
    throw new Error("--reason (or --explanation) is required");
  }

  return args;
}

function readPolicy() {
  const resolved = resolveAgentAccessControl(process.cwd());
  runtimeContext.root = resolved.root;
  runtimeContext.policyPath = resolved.policyPath;
  return resolved.policy;
}

function validateRequest(args, policy) {
  const errors = [];
  const warnings = [];

  const system = policy && policy.system ? policy.system : {};
  const requestContract = system && system.request_contract ? system.request_contract : {};
  const privilegeFlags = toUniqueSorted(policy && Array.isArray(policy.privilege_flags) ? policy.privilege_flags : []);
  const agents = policy && policy.agents ? policy.agents : {};
  const agent = agents[args.agentId];

  if (!agent) {
    errors.push(`agent not registered in policy: ${args.agentId}`);
    return {
      errors,
      warnings
    };
  }

  const startupTools = toUniqueSorted(agent.startup_tools || []);
  const startupToolCap = Number(agent.startup_tool_cap || startupTools.length);
  const allowedControls = toUniqueSorted(agent.allowed_controls || []);
  const nonStartupTools = args.requestedTools.filter((toolId) => !startupTools.includes(toolId));
  const startupOnlyTools = args.requestedTools.filter((toolId) => startupTools.includes(toolId));
  const invalidFlags = args.privilegeFlags.filter((flagId) => !privilegeFlags.includes(flagId));
  const outOfScopeControls = args.requestedControls.filter((controlId) => !allowedControls.includes(controlId));
  const reasonMinChars = Number(requestContract.reason_min_chars || 1);

  if (startupToolCap > 0 && startupTools.length > startupToolCap) {
    warnings.push(
      `policy mismatch for ${args.agentId}: startup_tools (${startupTools.length}) exceed startup_tool_cap (${startupToolCap})`
    );
  }

  if (system.request_required_for_non_startup_tools === true && !nonStartupTools.length) {
    errors.push("requested tools are already in startup_tools; escalation request is not required");
  }

  if (invalidFlags.length) {
    errors.push(`invalid privilege flags: ${invalidFlags.join(", ")}`);
  }

  if (args.reason.length < reasonMinChars) {
    errors.push(`reason must be at least ${reasonMinChars} characters`);
  }

  if (outOfScopeControls.length) {
    warnings.push(`requested controls are outside current allowed_controls: ${outOfScopeControls.join(", ")}`);
  }

  if (startupOnlyTools.length) {
    warnings.push(`startup tool IDs included and ignored for escalation: ${startupOnlyTools.join(", ")}`);
  }

  return {
    errors,
    warnings,
    agent,
    startupTools,
    startupToolCap,
    allowedControls,
    nonStartupTools,
    startupOnlyTools,
    outOfScopeControls
  };
}

function ensureParentDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function resolveLogFile(policy) {
  return resolveRequestLogFile(runtimeContext.root || process.cwd(), runtimeContext.policyPath || process.cwd(), policy);
}

function createRequestId() {
  if (typeof crypto.randomUUID === "function") {
    return `req_${crypto.randomUUID()}`;
  }
  const random = crypto.randomBytes(16).toString("hex");
  return `req_${random}`;
}

function nowIso() {
  return new Date().toISOString();
}

function appendRequestLog(logFilePath, payload) {
  ensureParentDir(logFilePath);
  fs.appendFileSync(logFilePath, `${JSON.stringify(payload)}\n`, "utf8");
}

function run() {
  const args = parseArgs(process.argv.slice(2));
  const policy = readPolicy();
  const validation = validateRequest(args, policy);
  const requestContract = policy && policy.system && policy.system.request_contract ? policy.system.request_contract : {};
  const defaultStatus = String(requestContract.default_status || "pending").trim() || "pending";

  if (validation.errors.length > 0) {
    const errorPayload = {
      ok: false,
      errors: validation.errors,
      warnings: validation.warnings
    };
    process.stderr.write(`${JSON.stringify(errorPayload, null, 2)}\n`);
    process.exit(1);
  }

  const logFilePath = resolveLogFile(policy);
  const requestPayload = {
    request_id: createRequestId(),
    requested_at: nowIso(),
    agent_id: args.agentId,
    role: String(validation.agent.role || ""),
    policy_mode: String((policy.system && policy.system.policy_mode) || ""),
    startup_tool_cap: validation.startupToolCap,
    startup_tools: validation.startupTools,
    allowed_controls: validation.allowedControls,
    requested_tools: args.requestedTools,
    requested_non_startup_tools: validation.nonStartupTools,
    requested_controls: args.requestedControls,
    requested_privilege_flags: args.privilegeFlags,
    reason: args.reason,
    status: defaultStatus,
    review: {
      decided_at: null,
      decision: "pending",
      reviewer: null,
      notes: ""
    },
    warnings: validation.warnings
  };

  appendRequestLog(logFilePath, requestPayload);

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        request_id: requestPayload.request_id,
        log_file: path.relative(runtimeContext.root || process.cwd(), logFilePath),
        agent_id: args.agentId,
        requested_non_startup_tools: requestPayload.requested_non_startup_tools,
        requested_privilege_flags: args.privilegeFlags,
        status: requestPayload.status,
        warnings: validation.warnings
      },
      null,
      2
    )}\n`
  );
}

try {
  run();
} catch (error) {
  process.stderr.write(`agent-access-request failed: ${error.message}\n`);
  process.exit(1);
}
