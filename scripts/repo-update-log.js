#!/usr/bin/env node
"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const {
  DEFAULT_IGNORE_DIRS,
  findProjectRoot,
  normalizePath,
  resolveAgentAccessControl,
  resolveUpdateLogPaths
} = require("./project-source-resolver");

const RUNTIME = {
  root: "",
  policyPath: "",
  eventsLogFile: "",
  sessionLogFile: "",
  stateFile: "",
  ignoredPaths: []
};

function nowIso() {
  return new Date().toISOString();
}

function createEventId() {
  if (typeof crypto.randomUUID === "function") {
    return `evt_${crypto.randomUUID()}`;
  }
  return `evt_${crypto.randomBytes(16).toString("hex")}`;
}

function printHelpAndExit(code) {
  const helpText = [
    "repo-update-log",
    "",
    "Usage:",
    "  npm run updates:scan -- [options]",
    "  npm run updates:watch -- [options]",
    "",
    "Commands:",
    "  scan   Compare current project state to previous snapshot and log file changes",
    "  watch  Watch project scope for real-time file update events",
    "",
    "Options:",
    "  --actor <id>             Actor tag for events (default: system)",
    "  --scope <text>           Scope/reason tag for scan mode",
    "  --session-id <id>        Explicit session id (watch mode)",
    "  --help                   Show help"
  ].join("\n");
  process.stdout.write(`${helpText}\n`);
  process.exit(code);
}

function parseArgs(argv) {
  if (!argv.length || argv.includes("--help") || argv.includes("-h")) {
    printHelpAndExit(0);
  }

  const args = {
    command: String(argv[0] || "")
      .trim()
      .toLowerCase(),
    actor: "system",
    scope: "",
    sessionId: ""
  };

  for (let index = 1; index < argv.length; index += 1) {
    const token = argv[index];

    if (token === "--actor") {
      args.actor = String(argv[index + 1] || "").trim() || "system";
      index += 1;
      continue;
    }

    if (token === "--scope") {
      args.scope = String(argv[index + 1] || "").trim();
      index += 1;
      continue;
    }

    if (token === "--session-id") {
      args.sessionId = String(argv[index + 1] || "").trim();
      index += 1;
      continue;
    }

    throw new Error(`unknown argument: ${token}`);
  }

  if (!["scan", "watch"].includes(args.command)) {
    throw new Error("first argument must be one of: scan, watch");
  }

  return args;
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function unique(values) {
  return [...new Set(values)];
}

function configureRuntime() {
  let root = findProjectRoot(process.cwd());
  let policyPath = "";
  let updateLogPaths = null;

  try {
    const resolved = resolveAgentAccessControl(process.cwd());
    root = resolved.root;
    policyPath = resolved.policyPath;
    updateLogPaths = resolveUpdateLogPaths(root, policyPath, resolved.policy);
  } catch {
    const fallbackDir = path.join(root, "data", "logs", "change-log");
    updateLogPaths = {
      eventsFile: path.join(fallbackDir, "update_events.ndjson"),
      sessionsFile: path.join(fallbackDir, "sessions.ndjson"),
      stateFile: path.join(fallbackDir, "state_snapshot.json")
    };
  }

  RUNTIME.root = root;
  RUNTIME.policyPath = policyPath;
  RUNTIME.eventsLogFile = updateLogPaths.eventsFile;
  RUNTIME.sessionLogFile = updateLogPaths.sessionsFile;
  RUNTIME.stateFile = updateLogPaths.stateFile;

  const derivedIgnored = [
    ...DEFAULT_IGNORE_DIRS,
    normalizePath(path.relative(root, path.dirname(updateLogPaths.eventsFile))),
    normalizePath(path.relative(root, path.dirname(updateLogPaths.sessionsFile))),
    normalizePath(path.relative(root, path.dirname(updateLogPaths.stateFile)))
  ].filter((entry) => Boolean(entry) && entry !== ".");

  RUNTIME.ignoredPaths = unique(derivedIgnored);
}

function ensureLogPaths() {
  ensureDir(path.dirname(RUNTIME.eventsLogFile));
  ensureDir(path.dirname(RUNTIME.sessionLogFile));
  if (!fs.existsSync(RUNTIME.eventsLogFile)) {
    fs.writeFileSync(RUNTIME.eventsLogFile, "", "utf8");
  }
  if (!fs.existsSync(RUNTIME.sessionLogFile)) {
    fs.writeFileSync(RUNTIME.sessionLogFile, "", "utf8");
  }
}

function toRelativePath(filePath) {
  return normalizePath(path.relative(RUNTIME.root, filePath));
}

function isIgnored(relativePath) {
  const rel = normalizePath(relativePath || "");
  if (!rel || rel === ".") {
    return false;
  }
  return RUNTIME.ignoredPaths.some((ignorePath) => rel === ignorePath || rel.startsWith(`${ignorePath}/`));
}

function createFileHash(filePath) {
  const content = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(content).digest("hex");
}

function fileSnapshot(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const stat = fs.statSync(filePath);
  if (!stat.isFile()) {
    return null;
  }
  return {
    size_bytes: stat.size,
    mtime_ms: Number(stat.mtimeMs.toFixed(3)),
    hash: createFileHash(filePath)
  };
}

function scanFileState() {
  const state = {};
  const stack = [RUNTIME.root];

  while (stack.length > 0) {
    const currentDir = stack.pop();
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    entries.forEach((entry) => {
      const abs = path.join(currentDir, entry.name);
      const rel = toRelativePath(abs);
      if (isIgnored(rel)) {
        return;
      }
      if (entry.isDirectory()) {
        stack.push(abs);
        return;
      }
      if (!entry.isFile()) {
        return;
      }
      const snapshot = fileSnapshot(abs);
      if (snapshot) {
        state[rel] = snapshot;
      }
    });
  }

  return state;
}

function readState() {
  if (!fs.existsSync(RUNTIME.stateFile)) {
    return {
      files: {},
      updated_at: null
    };
  }
  try {
    const parsed = JSON.parse(fs.readFileSync(RUNTIME.stateFile, "utf8"));
    return {
      files: parsed && parsed.files ? parsed.files : {},
      updated_at: parsed && parsed.updated_at ? parsed.updated_at : null
    };
  } catch {
    return {
      files: {},
      updated_at: null
    };
  }
}

function writeState(fileMap) {
  ensureDir(path.dirname(RUNTIME.stateFile));
  fs.writeFileSync(
    RUNTIME.stateFile,
    `${JSON.stringify(
      {
        updated_at: nowIso(),
        file_count: Object.keys(fileMap).length,
        files: fileMap
      },
      null,
      2
    )}\n`,
    "utf8"
  );
}

function appendNdjson(filePath, payload) {
  ensureDir(path.dirname(filePath));
  fs.appendFileSync(filePath, `${JSON.stringify(payload)}\n`, "utf8");
}

function classifyDiffs(previousFiles, currentFiles) {
  const allPaths = [...new Set([...Object.keys(previousFiles), ...Object.keys(currentFiles)])].sort();
  const diffs = [];

  allPaths.forEach((relPath) => {
    const before = previousFiles[relPath] || null;
    const after = currentFiles[relPath] || null;

    if (!before && after) {
      diffs.push({
        change_type: "file_created",
        path: relPath,
        before,
        after
      });
      return;
    }

    if (before && !after) {
      diffs.push({
        change_type: "file_deleted",
        path: relPath,
        before,
        after
      });
      return;
    }

    if (
      before &&
      after &&
      (before.hash !== after.hash || before.size_bytes !== after.size_bytes || before.mtime_ms !== after.mtime_ms)
    ) {
      diffs.push({
        change_type: "file_updated",
        path: relPath,
        before,
        after
      });
    }
  });

  return diffs;
}

function runScanMode(args) {
  ensureLogPaths();
  const startedAtMs = Date.now();
  const startedAt = nowIso();

  const previousState = readState();
  const currentFiles = scanFileState();
  const diffs = classifyDiffs(previousState.files, currentFiles);

  const eventRows = diffs.map((diff, index) => ({
    event_id: createEventId(),
    event_at: nowIso(),
    actor: args.actor,
    source: "scan",
    scope: args.scope || "unspecified",
    change_type: diff.change_type,
    path: diff.path,
    elapsed_ms_from_scan_start: Date.now() - startedAtMs,
    before: diff.before,
    after: diff.after,
    diff_index: index + 1
  }));

  eventRows.forEach((row) => appendNdjson(RUNTIME.eventsLogFile, row));
  writeState(currentFiles);

  const finishedAt = nowIso();
  const durationMs = Date.now() - startedAtMs;
  const summary = {
    session_id: createEventId().replace(/^evt_/, "scan_"),
    mode: "scan",
    actor: args.actor,
    scope: args.scope || "unspecified",
    started_at: startedAt,
    finished_at: finishedAt,
    duration_ms: durationMs,
    changes_total: eventRows.length,
    changed_paths: eventRows.map((row) => row.path)
  };
  appendNdjson(RUNTIME.sessionLogFile, summary);

  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
}

function buildDirectoryList(baseDirPath) {
  const dirs = [];
  const stack = [baseDirPath];

  while (stack.length > 0) {
    const current = stack.pop();
    const relCurrent = toRelativePath(current);
    if (isIgnored(relCurrent)) {
      continue;
    }
    dirs.push(current);
    const entries = fs.readdirSync(current, { withFileTypes: true });
    entries.forEach((entry) => {
      if (!entry.isDirectory()) {
        return;
      }
      const abs = path.join(current, entry.name);
      const rel = toRelativePath(abs);
      if (!isIgnored(rel)) {
        stack.push(abs);
      }
    });
  }

  return dirs;
}

function runWatchMode(args) {
  ensureLogPaths();
  const startedAtMs = Date.now();
  const startedAt = nowIso();
  const sessionId = args.sessionId || `watch_${createEventId().replace(/^evt_/, "")}`;

  const knownState = scanFileState();
  writeState(knownState);

  const watchers = new Map();
  const pendingByPath = new Map();

  function saveKnownState() {
    writeState(knownState);
  }

  function recordEvent(changeType, relPath, before, after) {
    const event = {
      event_id: createEventId(),
      event_at: nowIso(),
      actor: args.actor,
      source: "watch",
      session_id: sessionId,
      change_type: changeType,
      path: relPath,
      elapsed_ms_from_session_start: Date.now() - startedAtMs,
      before: before || null,
      after: after || null
    };
    appendNdjson(RUNTIME.eventsLogFile, event);
  }

  function removeWatcherByPrefix(absPathPrefix) {
    const normalized = path.resolve(absPathPrefix);
    Array.from(watchers.keys()).forEach((watchedDir) => {
      if (watchedDir === normalized || watchedDir.startsWith(`${normalized}${path.sep}`)) {
        const watcher = watchers.get(watchedDir);
        if (watcher) {
          watcher.close();
        }
        watchers.delete(watchedDir);
      }
    });
  }

  function syncPath(relativePath) {
    if (!relativePath || isIgnored(relativePath)) {
      return;
    }

    const abs = path.join(RUNTIME.root, relativePath);
    const before = knownState[relativePath] || null;

    if (!fs.existsSync(abs)) {
      if (before) {
        delete knownState[relativePath];
        recordEvent("file_deleted", relativePath, before, null);
        saveKnownState();
      }
      return;
    }

    const stat = fs.statSync(abs);
    if (stat.isDirectory()) {
      const dirs = buildDirectoryList(abs);
      dirs.forEach((dirPath) => addWatcher(dirPath));
      return;
    }

    if (!stat.isFile()) {
      return;
    }

    const after = fileSnapshot(abs);
    if (!before && after) {
      knownState[relativePath] = after;
      recordEvent("file_created", relativePath, null, after);
      saveKnownState();
      return;
    }

    if (
      before &&
      after &&
      (before.hash !== after.hash || before.size_bytes !== after.size_bytes || before.mtime_ms !== after.mtime_ms)
    ) {
      knownState[relativePath] = after;
      recordEvent("file_updated", relativePath, before, after);
      saveKnownState();
    }
  }

  function scheduleSync(relativePath) {
    if (!relativePath || isIgnored(relativePath)) {
      return;
    }
    const existing = pendingByPath.get(relativePath);
    if (existing) {
      clearTimeout(existing);
    }
    const timer = setTimeout(() => {
      pendingByPath.delete(relativePath);
      syncPath(relativePath);
    }, 75);
    pendingByPath.set(relativePath, timer);
  }

  function addWatcher(directoryPath) {
    const absDir = path.resolve(directoryPath);
    if (watchers.has(absDir)) {
      return;
    }
    const relDir = toRelativePath(absDir);
    if (isIgnored(relDir)) {
      return;
    }
    let watcher = null;
    try {
      watcher = fs.watch(absDir, { persistent: true }, (eventType, filename) => {
        const name = String(filename || "").trim();
        if (!name) {
          return;
        }
        const targetAbs = path.resolve(absDir, name);
        const targetRel = toRelativePath(targetAbs);
        if (eventType === "rename" && !fs.existsSync(targetAbs)) {
          removeWatcherByPrefix(targetAbs);
        }
        scheduleSync(targetRel);
      });
    } catch {
      return;
    }

    watcher.on("error", () => {
      watchers.delete(absDir);
    });
    watchers.set(absDir, watcher);
  }

  const startupDirs = buildDirectoryList(RUNTIME.root);
  startupDirs.forEach((dirPath) => addWatcher(dirPath));

  const sessionStartPayload = {
    session_id: sessionId,
    mode: "watch",
    actor: args.actor,
    started_at: startedAt,
    status: "started",
    watcher_count: watchers.size
  };
  appendNdjson(RUNTIME.sessionLogFile, sessionStartPayload);

  function shutdown(signalName) {
    pendingByPath.forEach((timer) => clearTimeout(timer));
    watchers.forEach((watcher) => watcher.close());
    watchers.clear();
    saveKnownState();
    appendNdjson(RUNTIME.sessionLogFile, {
      session_id: sessionId,
      mode: "watch",
      actor: args.actor,
      started_at: startedAt,
      finished_at: nowIso(),
      duration_ms: Date.now() - startedAtMs,
      status: "stopped",
      signal: signalName
    });
    process.exit(0);
  }

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("exit", () => {
    if (watchers.size > 0) {
      watchers.forEach((watcher) => watcher.close());
      watchers.clear();
    }
  });

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        mode: "watch",
        session_id: sessionId,
        actor: args.actor,
        project_root: RUNTIME.root,
        policy_file: RUNTIME.policyPath || null,
        watcher_count: watchers.size,
        events_file: path.relative(RUNTIME.root, RUNTIME.eventsLogFile),
        sessions_file: path.relative(RUNTIME.root, RUNTIME.sessionLogFile)
      },
      null,
      2
    )}\n`
  );
}

function run() {
  configureRuntime();
  const args = parseArgs(process.argv.slice(2));
  if (args.command === "scan") {
    runScanMode(args);
    return;
  }
  runWatchMode(args);
}

try {
  run();
} catch (error) {
  process.stderr.write(`repo-update-log failed: ${error.message}\n`);
  process.exit(1);
}
