#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DEFAULT_REPORT_FILE = path.join(
  ROOT,
  "data",
  "output",
  "databases",
  "polyglot-default",
  "analysis",
  "data_separation_audit_report.json"
);

const DEFAULT_SCAN_DIRS = Object.freeze(["main", "app", "renderer", "brain", "scripts"]);
const DEFAULT_IGNORE_DIRS = Object.freeze(["node_modules", ".git", "dist", "data/output", "to-do", "artifacts"]);
const TOKEN_HINTS = Object.freeze([
  "GROUP",
  "LABEL",
  "ALIAS",
  "MAP",
  "REGISTRY",
  "SPEC",
  "KEY",
  "DEFAULT",
  "CONFIG",
  "PATTERN"
]);

function nowIso() {
  return new Date().toISOString();
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function normalizePath(value) {
  return String(value || "").replace(/\\/g, "/");
}

function toRelativePath(filePath) {
  return normalizePath(path.relative(ROOT, filePath));
}

function isIgnoredPath(relativePath) {
  const rel = normalizePath(relativePath);
  return DEFAULT_IGNORE_DIRS.some((ignore) => rel === ignore || rel.startsWith(`${ignore}/`));
}

function parseArgs(argv) {
  const args = {
    reportFile: DEFAULT_REPORT_FILE,
    enforce: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--report-file") {
      args.reportFile = path.resolve(process.cwd(), String(argv[index + 1] || ""));
      index += 1;
      continue;
    }
    if (token === "--enforce") {
      args.enforce = true;
      continue;
    }
    if (token === "--help" || token === "-h") {
      printHelpAndExit(0);
    }
    throw new Error(`unknown argument: ${token}`);
  }

  return args;
}

function printHelpAndExit(code) {
  const help = [
    "data-separation-audit",
    "",
    "Usage:",
    "  npm run audit:data-separation -- [options]",
    "",
    "Options:",
    "  --report-file <path>   Output report path",
    "  --enforce              Exit non-zero when required-separation candidates exist",
    "  --help                 Show help"
  ].join("\n");
  process.stdout.write(`${help}\n`);
  process.exit(code);
}

function collectJsFiles() {
  const files = [];
  const stack = DEFAULT_SCAN_DIRS
    .map((entry) => path.join(ROOT, entry))
    .filter((entry) => fs.existsSync(entry) && fs.statSync(entry).isDirectory());

  while (stack.length > 0) {
    const current = stack.pop();
    const relCurrent = toRelativePath(current);
    if (isIgnoredPath(relCurrent)) {
      continue;
    }
    const entries = fs.readdirSync(current, { withFileTypes: true });
    entries.forEach((entry) => {
      const absolute = path.join(current, entry.name);
      const relative = toRelativePath(absolute);
      if (isIgnoredPath(relative)) {
        return;
      }
      if (entry.isDirectory()) {
        stack.push(absolute);
        return;
      }
      if (!entry.isFile()) {
        return;
      }
      if (!relative.endsWith(".js")) {
        return;
      }
      files.push(absolute);
    });
  }

  files.sort((left, right) => toRelativePath(left).localeCompare(toRelativePath(right)));
  return files;
}

function classifyConstant(name) {
  const upper = String(name || "").toUpperCase();
  const requiredToken = TOKEN_HINTS.find((token) => upper.includes(token)) || "";
  if (requiredToken) {
    return {
      separationRequired: true,
      reason: `name contains ${requiredToken}`
    };
  }
  return {
    separationRequired: false,
    reason: "non-governed constant name"
  };
}

function detectCandidatesInFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split(/\r?\n/);
  const candidates = [];
  const regex = /^\s*const\s+([A-Z0-9_]+)\s*=\s*(?:Object\.freeze\()?(?:\{|\[)/;

  lines.forEach((line, index) => {
    const match = line.match(regex);
    if (!match) {
      return;
    }
    const name = String(match[1] || "");
    const classification = classifyConstant(name);
    candidates.push({
      file: toRelativePath(filePath),
      line: index + 1,
      constant: name,
      separation_required: classification.separationRequired,
      reason: classification.reason
    });
  });

  return candidates;
}

function summarizeByPath(candidates) {
  const grouped = {};
  candidates.forEach((candidate) => {
    const file = candidate.file;
    if (!grouped[file]) {
      grouped[file] = {
        file,
        candidate_count: 0,
        required_count: 0
      };
    }
    grouped[file].candidate_count += 1;
    if (candidate.separation_required) {
      grouped[file].required_count += 1;
    }
  });
  return Object.values(grouped).sort((left, right) => {
    if (right.required_count !== left.required_count) {
      return right.required_count - left.required_count;
    }
    return left.file.localeCompare(right.file);
  });
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const files = collectJsFiles();
  const candidates = files.flatMap((filePath) => detectCandidatesInFile(filePath));
  const required = candidates.filter((candidate) => candidate.separation_required);
  const summaryByFile = summarizeByPath(candidates);

  const report = {
    generated_at: nowIso(),
    project_root: ROOT,
    scan_dirs: DEFAULT_SCAN_DIRS,
    ignored_dirs: DEFAULT_IGNORE_DIRS,
    counts: {
      files_scanned: files.length,
      candidate_total: candidates.length,
      separation_required_total: required.length
    },
    highest_priority_files: summaryByFile.slice(0, 25),
    candidates
  };

  ensureDir(path.dirname(args.reportFile));
  fs.writeFileSync(args.reportFile, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  const result = {
    report_file: args.reportFile,
    files_scanned: files.length,
    candidate_total: candidates.length,
    separation_required_total: required.length,
    enforce: args.enforce
  };

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);

  if (args.enforce && required.length > 0) {
    process.exit(2);
  }
}

try {
  main();
} catch (error) {
  process.stderr.write(`data-separation-audit failed: ${error.message}\n`);
  process.exit(1);
}
