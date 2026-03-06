#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { findProjectRoot, resolveAgentAccessControl, resolveUpdateLogPaths } = require("./project-source-resolver");

const DEFAULT_OUT_DIR = path.join("data", "output", "databases", "polyglot-default");
const PYTHON_CACHE_DIR_NAME = "__pycache__";
const TEMP_FILE_SUFFIXES = Object.freeze([".tmp", ".temp", ".bak", ".old", ".orig", ".rej"]);
const BENCHMARK_TEMP_DIR_PREFIX = "aio-polyglot-bench-";

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
    let entries = [];
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch {
      continue;
    }
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

function collectDirectoriesByPrefix(startDir, prefix) {
  const out = [];
  if (!fs.existsSync(startDir)) {
    return out;
  }
  const stack = [startDir];
  while (stack.length > 0) {
    const current = stack.pop();
    let entries = [];
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch {
      continue;
    }
    entries.forEach((entry) => {
      if (!entry.isDirectory()) {
        return;
      }
      const absolute = path.join(current, entry.name);
      if (entry.name.startsWith(prefix)) {
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
    let entries = [];
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch {
      continue;
    }
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

function isDescendantPath(parentPath, candidatePath) {
  const parent = path.resolve(parentPath);
  const candidate = path.resolve(candidatePath);
  if (parent === candidate) {
    return true;
  }
  const relative = path.relative(parent, candidate);
  return relative !== "" && !relative.startsWith("..") && !path.isAbsolute(relative);
}

function excludeDescendants(paths, ancestorPaths) {
  const ancestors = Array.isArray(ancestorPaths) ? ancestorPaths.map((item) => path.resolve(item)) : [];
  return (Array.isArray(paths) ? paths : []).filter(
    (candidatePath) => !ancestors.some((ancestorPath) => isDescendantPath(ancestorPath, candidatePath))
  );
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

function isRetryableCachePruneError(errorText) {
  const text = String(errorText || "").toLowerCase();
  return (
    text.includes("access is denied") ||
    text.includes("permission denied") ||
    text.includes("eperm") ||
    text.includes("eacces") ||
    text.includes("winerror 5")
  );
}

function buildCachePruneIssues(root, rows) {
  return (Array.isArray(rows) ? rows : []).map((row) => {
    const detail = String(row && row.error ? row.error : "");
    const deferred = isRetryableCachePruneError(detail);
    return {
      level: deferred ? "warn" : "error",
      type: deferred ? "cache_prune_deferred" : "cache_prune_failed",
      path: toRel(root, row.path),
      detail
    };
  });
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
      benchmark_temp_dirs_removed: [],
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
    const benchmarkTempDirs = collectDirectoriesByPrefix(path.join(outputRoot, "build", "tmp"), BENCHMARK_TEMP_DIR_PREFIX);
    const pycFiles = excludeDescendants(
      collectFilesByPredicate(outputRoot, (absolutePath) => absolutePath.endsWith(".pyc")),
      [...pycacheDirs, ...benchmarkTempDirs]
    );
    const tempFiles = excludeDescendants(
      collectFilesByPredicate(outputRoot, (absolutePath) =>
      TEMP_FILE_SUFFIXES.some((suffix) => absolutePath.toLowerCase().endsWith(suffix))
      ),
      [...pycacheDirs, ...benchmarkTempDirs]
    );

    const removedCacheDirs = removePaths(pycacheDirs, args.dryRun);
    const removedBenchmarkTempDirs = removePaths(benchmarkTempDirs, args.dryRun);
    const removedPycFiles = removePaths(pycFiles, args.dryRun);
    const removedTempFiles = removePaths(tempFiles, args.dryRun);

    report.cache_prune.cache_dirs_removed = removedCacheDirs.removed.map((item) => toRel(root, item));
    report.cache_prune.benchmark_temp_dirs_removed = removedBenchmarkTempDirs.removed.map((item) => toRel(root, item));
    report.cache_prune.pyc_files_removed = removedPycFiles.removed.map((item) => toRel(root, item));
    report.cache_prune.temp_files_removed = removedTempFiles.removed.map((item) => toRel(root, item));

    buildCachePruneIssues(
      root,
      [...removedCacheDirs.errors, ...removedBenchmarkTempDirs.errors, ...removedPycFiles.errors, ...removedTempFiles.errors]
    ).forEach(
      (issue) => {
        issues.push(issue);
      }
    );
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

module.exports = {
  buildCachePruneIssues,
  collectDirectoriesByPrefix,
  excludeDescendants,
  isRetryableCachePruneError,
  isDescendantPath,
  parseArgs
};

if (require.main === module) {
  try {
    main();
  } catch (error) {
    process.stderr.write(`prune-workflow-artifacts failed: ${error.message}\n`);
    process.exit(1);
  }
}
