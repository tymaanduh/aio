#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const TOOLING_SCAN_CATALOG = require("../data/input/shared/main/tooling_scan_catalog.json");

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
const DEFAULT_BASELINE_FILE = path.join(
  ROOT,
  "data",
  "output",
  "databases",
  "polyglot-default",
  "analysis",
  "data_separation_baseline.json"
);

const SCAN_DIRS_FALLBACK = Object.freeze(["main", "app", "renderer", "brain", "scripts"]);
const IGNORE_DIRS_FALLBACK = Object.freeze(["node_modules", ".git", "dist", "data/output", "to-do", "artifacts"]);
const TOKEN_HINTS_FALLBACK = Object.freeze([
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

function to_string_array(values, fallback = []) {
  const source = Array.isArray(values) ? values : fallback;
  return source
    .map((entry) => String(entry || "").trim())
    .filter((entry) => Boolean(entry));
}

const SCAN_DIRS = Object.freeze(
  to_string_array(
    TOOLING_SCAN_CATALOG &&
      TOOLING_SCAN_CATALOG.data_separation_audit &&
      TOOLING_SCAN_CATALOG.data_separation_audit.scan_dirs,
    SCAN_DIRS_FALLBACK
  )
);
const IGNORE_DIRS = Object.freeze(
  to_string_array(
    TOOLING_SCAN_CATALOG &&
      TOOLING_SCAN_CATALOG.data_separation_audit &&
      TOOLING_SCAN_CATALOG.data_separation_audit.ignore_dirs,
    IGNORE_DIRS_FALLBACK
  )
);
const TOKEN_HINTS = Object.freeze(
  to_string_array(
    TOOLING_SCAN_CATALOG &&
      TOOLING_SCAN_CATALOG.data_separation_audit &&
      TOOLING_SCAN_CATALOG.data_separation_audit.token_hints,
    TOKEN_HINTS_FALLBACK
  )
);

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
  return IGNORE_DIRS.some((ignore) => rel === ignore || rel.startsWith(`${ignore}/`));
}

function parseArgs(argv) {
  const args = {
    reportFile: DEFAULT_REPORT_FILE,
    baselineFile: DEFAULT_BASELINE_FILE,
    enforce: false,
    enforceNoRegression: false,
    writeBaseline: false
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
    if (token === "--baseline-file") {
      args.baselineFile = path.resolve(process.cwd(), String(argv[index + 1] || ""));
      index += 1;
      continue;
    }
    if (token === "--enforce-no-regression") {
      args.enforceNoRegression = true;
      continue;
    }
    if (token === "--write-baseline") {
      args.writeBaseline = true;
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
    "  --baseline-file <path> Baseline file for no-regression checks",
    "  --enforce              Exit non-zero when required-separation candidates exist",
    "  --enforce-no-regression Exit non-zero if required count increases vs baseline",
    "  --write-baseline       Write current required count to baseline file",
    "  --help                 Show help"
  ].join("\n");
  process.stdout.write(`${help}\n`);
  process.exit(code);
}

function collectJsFiles() {
  const files = [];
  const stack = SCAN_DIRS
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

function loadBaseline(filePath) {
  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const count = Number(parsed && parsed.separation_required_total);
    if (!Number.isFinite(count) || count < 0) {
      return null;
    }
    return {
      file_path: filePath,
      separation_required_total: Math.floor(count),
      recorded_at: String(parsed.recorded_at || "")
    };
  } catch {
    return null;
  }
}

function writeBaseline(filePath, requiredCount) {
  const payload = {
    recorded_at: nowIso(),
    separation_required_total: Number(requiredCount || 0)
  };
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  return payload;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const files = collectJsFiles();
  const candidates = files.flatMap((filePath) => detectCandidatesInFile(filePath));
  const required = candidates.filter((candidate) => candidate.separation_required);
  const summaryByFile = summarizeByPath(candidates);
  const baseline = loadBaseline(args.baselineFile);
  const baselineDelta = baseline ? required.length - baseline.separation_required_total : null;

  const report = {
    generated_at: nowIso(),
    project_root: ROOT,
    scan_dirs: SCAN_DIRS,
    ignored_dirs: IGNORE_DIRS,
    counts: {
      files_scanned: files.length,
      candidate_total: candidates.length,
      separation_required_total: required.length
    },
    highest_priority_files: summaryByFile.slice(0, 25),
    baseline: baseline
      ? {
          file_path: baseline.file_path,
          separation_required_total: baseline.separation_required_total,
          delta: baselineDelta
        }
      : null,
    candidates
  };

  ensureDir(path.dirname(args.reportFile));
  fs.writeFileSync(args.reportFile, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  const result = {
    report_file: args.reportFile,
    files_scanned: files.length,
    candidate_total: candidates.length,
    separation_required_total: required.length,
    enforce: args.enforce,
    enforce_no_regression: args.enforceNoRegression,
    baseline_file: args.baselineFile,
    baseline_required_total: baseline ? baseline.separation_required_total : null,
    baseline_delta: baselineDelta
  };

  if (args.writeBaseline) {
    writeBaseline(args.baselineFile, required.length);
    result.baseline_written = true;
  }

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);

  if (args.enforce && required.length > 0) {
    process.exit(2);
  }
  if (args.enforceNoRegression && baseline && baselineDelta > 0) {
    process.exit(3);
  }
}

try {
  main();
} catch (error) {
  process.stderr.write(`data-separation-audit failed: ${error.message}\n`);
  process.exit(1);
}
