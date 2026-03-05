#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { expandAccessPolicy } = require("./lib/agent-access-policy");

const DEFAULT_IGNORE_DIRS = Object.freeze([
  ".git",
  "node_modules",
  "dist",
  ".vs",
  "native/dx12/build",
  "data/output/logs/change-log"
]);

function normalizePath(value) {
  return String(value || "").replace(/\\/g, "/");
}

function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

function isFile(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch {
    return false;
  }
}

function findProjectRoot(startDir) {
  let current = path.resolve(startDir || process.cwd());
  let previous = "";
  while (current && current !== previous) {
    if (fileExists(path.join(current, "package.json"))) {
      return current;
    }
    previous = current;
    current = path.dirname(current);
  }
  return path.resolve(startDir || process.cwd());
}

function shouldIgnoreDirectory(relativePath) {
  const rel = normalizePath(relativePath);
  return DEFAULT_IGNORE_DIRS.some((entry) => rel === entry || rel.startsWith(`${entry}/`));
}

function listMatchingFiles(rootPath, targetFileName, validator) {
  const results = [];
  const stack = [rootPath];

  while (stack.length > 0) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });

    entries.forEach((entry) => {
      const abs = path.join(current, entry.name);
      const rel = normalizePath(path.relative(rootPath, abs));
      if (entry.isDirectory()) {
        if (!shouldIgnoreDirectory(rel)) {
          stack.push(abs);
        }
        return;
      }
      if (!entry.isFile()) {
        return;
      }
      if (entry.name !== targetFileName) {
        return;
      }
      if (typeof validator === "function") {
        try {
          if (!validator(abs)) {
            return;
          }
        } catch {
          return;
        }
      }
      results.push(abs);
    });
  }

  results.sort((left, right) => {
    const leftRel = normalizePath(path.relative(rootPath, left));
    const rightRel = normalizePath(path.relative(rootPath, right));
    const leftDepth = leftRel.split("/").length;
    const rightDepth = rightRel.split("/").length;
    const leftPreferred =
      leftRel.includes("/to-do/agents/") ||
      leftRel.startsWith("to-do/agents/") ||
      leftRel.includes("/agents/") ||
      leftRel.startsWith("agents/")
        ? -1
        : 0;
    const rightPreferred =
      rightRel.includes("/to-do/agents/") ||
      rightRel.startsWith("to-do/agents/") ||
      rightRel.includes("/agents/") ||
      rightRel.startsWith("agents/")
        ? -1
        : 0;
    if (leftPreferred !== rightPreferred) {
      return leftPreferred - rightPreferred;
    }
    if (leftDepth !== rightDepth) {
      return leftDepth - rightDepth;
    }
    return leftRel.localeCompare(rightRel);
  });

  return results;
}

function isAgentAccessControlFile(filePath) {
  if (!isFile(filePath)) {
    return false;
  }
  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return Boolean(parsed && parsed.system && parsed.agents);
  } catch {
    return false;
  }
}

function resolveAgentAccessControl(startDir) {
  const root = findProjectRoot(startDir);
  const envPath = process.env.AGENT_ACCESS_CONTROL_FILE
    ? path.resolve(root, process.env.AGENT_ACCESS_CONTROL_FILE)
    : "";
  if (envPath && isAgentAccessControlFile(envPath)) {
    const parsed = JSON.parse(fs.readFileSync(envPath, "utf8"));
    return {
      root,
      policyPath: envPath,
      policy: expandAccessPolicy(parsed)
    };
  }

  const matches = listMatchingFiles(root, "agent_access_control.json", isAgentAccessControlFile);
  if (!matches.length) {
    throw new Error("unable to locate agent_access_control.json in project scope");
  }
  const policyPath = matches[0];
  const parsed = JSON.parse(fs.readFileSync(policyPath, "utf8"));
  return {
    root,
    policyPath,
    policy: expandAccessPolicy(parsed)
  };
}

function resolveMaybeRelocatedPath(root, policyPath, configuredPath, options = {}) {
  const opts = {
    allowBasenameSearch: true,
    ...options
  };
  const value = String(configuredPath || "").trim();
  if (!value) {
    return "";
  }
  if (path.isAbsolute(value)) {
    return value;
  }

  const nearPolicyCandidate = path.resolve(path.dirname(policyPath), value);
  if (fileExists(nearPolicyCandidate)) {
    return nearPolicyCandidate;
  }

  const fromRootCandidate = path.resolve(root, value);
  if (fileExists(fromRootCandidate)) {
    return fromRootCandidate;
  }

  if (opts.allowBasenameSearch) {
    const baseName = path.basename(value);
    const matches = listMatchingFiles(root, baseName);
    if (matches.length === 1) {
      return matches[0];
    }
    if (matches.length > 1) {
      return matches[0];
    }
  }

  return nearPolicyCandidate;
}

function resolveRequestLogFile(root, policyPath, policy) {
  const configured = policy && policy.system ? policy.system.request_log_file : "";
  return resolveMaybeRelocatedPath(root, policyPath, configured || "data/input/databases/agent_access_requests.ndjson");
}

function resolveUpdateLogPaths(root, policyPath, policy) {
  const updateLog = policy && policy.system ? policy.system.update_log || {} : {};
  const events = resolveMaybeRelocatedPath(
    root,
    policyPath,
    updateLog.events_file || "data/output/logs/change-log/update_events.ndjson"
  );
  const sessions = resolveMaybeRelocatedPath(
    root,
    policyPath,
    updateLog.sessions_file || "data/output/logs/change-log/sessions.ndjson"
  );
  const state = resolveMaybeRelocatedPath(
    root,
    policyPath,
    updateLog.state_file || "data/output/logs/change-log/state_snapshot.json",
    {
      allowBasenameSearch: false
    }
  );
  return {
    eventsFile: events,
    sessionsFile: sessions,
    stateFile: state
  };
}

module.exports = {
  DEFAULT_IGNORE_DIRS,
  findProjectRoot,
  listMatchingFiles,
  normalizePath,
  resolveAgentAccessControl,
  resolveMaybeRelocatedPath,
  resolveRequestLogFile,
  resolveUpdateLogPaths
};
