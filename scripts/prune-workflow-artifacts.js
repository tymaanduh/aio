#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { findProjectRoot, resolveAgentAccessControl, resolveUpdateLogPaths } = require("./project-source-resolver");

const DEFAULT_OUT_DIR = path.join("data", "output", "databases", "polyglot-default");
const PYTHON_CACHE_DIR_NAME = "__pycache__";
const TEMP_FILE_SUFFIXES = Object.freeze([".tmp", ".temp", ".bak", ".old", ".orig", ".rej"]);

function parseArgs(argv) {
  const args = {
    strict: !argv.includes("--no-strict"),
    dryRun: argv.includes("--dry-run"),
    outDir: DEFAULT_OUT_DIR,
    skipLogPrune: argv.includes("--skip-log-prune"),
    skipCachePrune: argv.includes("--skip-cache-prune"),
    sessionsMaxLines: 2000,
    eventsMaxLines: 5000
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--out-dir" && argv[index + 1]) {
      args.outDir = String(argv[index + 1]).trim();
      index += 1;
      continue;
    }
    if (token === "--sessions-max-lines" && argv[index + 1]) {
      args.sessionsMaxLines = Number(argv[index + 1]);
      index += 1;
      continue;
    }
    if (token === "--events-max-lines" && argv[index + 1]) {
      args.eventsMaxLines = Number(argv[index + 1]);
      index += 1;
      continue;
    }
  }

  return args;
}

function normalizePath(value) {
  return String(value || "").replace(/\\/g, "/");
}

function toRel(root, absolutePath) {
  return normalizePath(path.relative(root, absolutePath));
}

function collectDirectoriesByName(startDir, folderName) {
  const out = [];
  if (!fs.existsSync(startDir)) {
    return out;
  }
  const stack = [startDir];
  while (stack.length > 0) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });
    entries.forEach((entry) => {
      if (!entry.isDirectory()) {
        return;
      }
      const absolute = path.join(current, entry.name);
      if (entry.name === folderName) {
        out.push(absolute);
        return;
      }
      stack.push(absolute);
    });
  }
  return out;
}

function collectFilesByPredicate(startDir, predicate) {
  const out = [];
  if (!fs.existsSync(startDir)) {
    return out;
  }
  const stack = [startDir];
  while (stack.length > 0) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });
    entries.forEach((entry) => {
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(absolute);
        return;
      }
      if (entry.isFile() && predicate(absolute)) {
        out.push(absolute);
      }
    });
  }
  return out;
}

function removePaths(paths, dryRun) {
  const removed = [];
  const errors = [];
  paths.forEach((absolutePath) => {
    try {
      if (!dryRun) {
        fs.rmSync(absolutePath, {
          recursive: true,
          force: true
        });
      }
      removed.push(absolutePath);
    } catch (error) {
      errors.push({
        path: absolutePath,
        error: String(error.message || error)
      });
    }
  });
  return {
    removed,
    errors
  };
}

function trimNdjson(filePath, maxLines, dryRun) {
  if (!fs.existsSync(filePath)) {
    return {
      file: filePath,
      exists: false,
      line_count_before: 0,
      line_count_after: 0,
      removed_lines: 0,
      changed: false
    };
  }
  const safeMax = Math.max(1, Number(maxLines) || 1);
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length <= safeMax) {
    return {
      file: filePath,
      exists: true,
      line_count_before: lines.length,
      line_count_after: lines.length,
      removed_lines: 0,
      changed: false
    };
  }
  const nextLines = lines.slice(-safeMax);
  if (!dryRun) {
    fs.writeFileSync(filePath, `${nextLines.join("\n")}\n`, "utf8");
  }
  return {
    file: filePath,
    exists: true,
    line_count_before: lines.length,
    line_count_after: nextLines.length,
    removed_lines: lines.length - nextLines.length,
    changed: true
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const root = findProjectRoot(process.cwd());
  const outputRoot = path.resolve(root, args.outDir);
  const issues = [];

  const report = {
    status: "pass",
    root,
    dry_run: args.dryRun,
    targets: {
      output_root: toRel(root, outputRoot)
    },
    cache_prune: {
      skipped: args.skipCachePrune,
      cache_dirs_removed: [],
      pyc_files_removed: [],
      temp_files_removed: []
    },
    log_prune: {
      skipped: args.skipLogPrune,
      sessions: null,
      events: null
    },
    issues
  };

  if (!args.skipCachePrune) {
    const pycacheDirs = collectDirectoriesByName(outputRoot, PYTHON_CACHE_DIR_NAME);
    const pycFiles = collectFilesByPredicate(outputRoot, (absolutePath) => absolutePath.endsWith(".pyc"));
    const tempFiles = collectFilesByPredicate(outputRoot, (absolutePath) =>
      TEMP_FILE_SUFFIXES.some((suffix) => absolutePath.toLowerCase().endsWith(suffix))
    );

    const removedCacheDirs = removePaths(pycacheDirs, args.dryRun);
    const removedPycFiles = removePaths(pycFiles, args.dryRun);
    const removedTempFiles = removePaths(tempFiles, args.dryRun);

    report.cache_prune.cache_dirs_removed = removedCacheDirs.removed.map((item) => toRel(root, item));
    report.cache_prune.pyc_files_removed = removedPycFiles.removed.map((item) => toRel(root, item));
    report.cache_prune.temp_files_removed = removedTempFiles.removed.map((item) => toRel(root, item));

    [...removedCacheDirs.errors, ...removedPycFiles.errors, ...removedTempFiles.errors].forEach((row) => {
      issues.push({
        level: "error",
        type: "cache_prune_failed",
        path: toRel(root, row.path),
        detail: row.error
      });
    });
  }

  if (!args.skipLogPrune) {
    try {
      const { policyPath, policy } = resolveAgentAccessControl(root);
      const logs = resolveUpdateLogPaths(root, policyPath, policy);
      const sessionTrim = trimNdjson(logs.sessionsFile, args.sessionsMaxLines, args.dryRun);
      const eventTrim = trimNdjson(logs.eventsFile, args.eventsMaxLines, args.dryRun);
      report.log_prune.sessions = {
        ...sessionTrim,
        file: toRel(root, sessionTrim.file)
      };
      report.log_prune.events = {
        ...eventTrim,
        file: toRel(root, eventTrim.file)
      };
    } catch (error) {
      issues.push({
        level: "warn",
        type: "log_prune_skipped",
        detail: String(error.message || error)
      });
    }
  }

  if (issues.some((issue) => issue.level === "error")) {
    report.status = "fail";
  }

  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (args.strict && report.status !== "pass") {
    process.exit(1);
  }
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    process.stderr.write(`prune-workflow-artifacts failed: ${error.message}\n`);
    process.exit(1);
  }
}
