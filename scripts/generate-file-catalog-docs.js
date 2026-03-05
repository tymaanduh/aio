#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { findProjectRoot } = require("./project-source-resolver");
const { writeTextFileRobust } = require("./lib/robust-file-write");

const DEFAULT_MARKDOWN_FILE = path.join("docs", "reference", "file_catalog.md");
const DEFAULT_JSON_FILE = path.join("docs", "reference", "file_catalog.json");

const DEFAULT_IGNORE_DIRS = Object.freeze([
  ".git",
  ".vs",
  ".vscode",
  "node_modules",
  "dist",
  "native/dx12/build",
  "data/output/logs/change-log"
]);

function parseArgs(argv) {
  const args = {
    markdownFile: DEFAULT_MARKDOWN_FILE,
    jsonFile: DEFAULT_JSON_FILE
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = String(argv[index] || "").trim();
    if (token === "--markdown-file" && argv[index + 1]) {
      args.markdownFile = String(argv[index + 1] || "").trim();
      index += 1;
      continue;
    }
    if (token === "--json-file" && argv[index + 1]) {
      args.jsonFile = String(argv[index + 1] || "").trim();
      index += 1;
      continue;
    }
  }

  return args;
}

function normalizePath(value) {
  return String(value || "").replace(/\\/g, "/");
}

function toRelative(root, filePath) {
  return normalizePath(path.relative(root, filePath));
}

function shouldIgnoreDir(relativeDir) {
  const normalized = normalizePath(relativeDir).replace(/\/+$/, "");
  if (!normalized) {
    return false;
  }
  return DEFAULT_IGNORE_DIRS.some((entry) => normalized === entry || normalized.startsWith(`${entry}/`));
}

function classifyFile(relativePath) {
  const rel = normalizePath(relativePath);
  if (rel.startsWith(".github/")) {
    return "github_automation";
  }
  if (rel.startsWith("docs/")) {
    return "documentation";
  }
  if (rel.startsWith("app/")) {
    return "desktop_ui";
  }
  if (rel.startsWith("brain/")) {
    return "runtime_brain";
  }
  if (rel.startsWith("main/")) {
    return "main_process";
  }
  if (rel.startsWith("renderer/")) {
    return "renderer_surface";
  }
  if (rel.startsWith("scripts/")) {
    return "automation_script";
  }
  if (rel.startsWith("tests/")) {
    return "test_asset";
  }
  if (rel.startsWith("to-do/skills/")) {
    return "skill_metadata";
  }
  if (rel.startsWith("to-do/agents/")) {
    return "agent_metadata";
  }
  if (rel.startsWith("data/input/")) {
    return "catalog_input";
  }
  if (rel.startsWith("data/output/")) {
    return "generated_output";
  }
  if (rel === "package.json" || rel === "package-lock.json") {
    return "package_config";
  }
  if (rel.startsWith("native/")) {
    return "native_runtime";
  }
  return "workspace_misc";
}

function collectFileRows(root) {
  const stack = [root];
  const rows = [];

  while (stack.length > 0) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });
    entries.forEach((entry) => {
      const absolute = path.join(current, entry.name);
      const relative = toRelative(root, absolute);
      if (entry.isDirectory()) {
        if (!shouldIgnoreDir(relative)) {
          stack.push(absolute);
        }
        return;
      }
      if (!entry.isFile()) {
        return;
      }
      const stat = fs.statSync(absolute);
      const ext = normalizePath(path.extname(entry.name)).toLowerCase();
      rows.push({
        path: relative,
        extension: ext || "(none)",
        bytes: Number(stat.size || 0),
        modified_utc: new Date(stat.mtimeMs).toISOString(),
        category: classifyFile(relative)
      });
    });
  }

  rows.sort((left, right) => left.path.localeCompare(right.path));
  return rows;
}

function sumBytes(rows) {
  return rows.reduce((sum, row) => sum + Number(row.bytes || 0), 0);
}

function toBytesLabel(bytes) {
  const value = Number(bytes || 0);
  if (value < 1024) {
    return `${value} B`;
  }
  const kb = value / 1024;
  if (kb < 1024) {
    return `${kb.toFixed(2)} KB`;
  }
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
}

function buildBucketSummary(rows, selector) {
  const map = new Map();
  rows.forEach((row) => {
    const key = String(selector(row) || "").trim() || "unknown";
    if (!map.has(key)) {
      map.set(key, {
        key,
        count: 0,
        bytes: 0
      });
    }
    const bucket = map.get(key);
    bucket.count += 1;
    bucket.bytes += Number(row.bytes || 0);
  });
  return [...map.values()].sort((left, right) => {
    if (right.count !== left.count) {
      return right.count - left.count;
    }
    return left.key.localeCompare(right.key);
  });
}

function escapePipes(text) {
  return String(text || "").replace(/\|/g, "\\|");
}

function buildMarkdown(root, rows, generatedAt) {
  const topLevelSummary = buildBucketSummary(rows, (row) => row.path.split("/")[0] || ".");
  const categorySummary = buildBucketSummary(rows, (row) => row.category);
  const extensionSummary = buildBucketSummary(rows, (row) => row.extension);
  const totalBytes = sumBytes(rows);
  const lines = [];

  lines.push("# Repository File Catalog");
  lines.push("");
  lines.push(`- Generated at: ${generatedAt}`);
  lines.push(`- Workspace root: \`${normalizePath(root)}\``);
  lines.push(`- Total files documented: ${rows.length}`);
  lines.push(`- Total bytes: ${totalBytes} (${toBytesLabel(totalBytes)})`);
  lines.push(
    `- Ignored directories: ${DEFAULT_IGNORE_DIRS.map((entry) => `\`${entry}\``).join(", ")}`
  );
  lines.push("");
  lines.push("## Top-Level Summary");
  lines.push("");
  lines.push("| Root | Files | Bytes | Size |");
  lines.push("|---|---:|---:|---:|");
  topLevelSummary.forEach((row) => {
    lines.push(`| ${escapePipes(row.key)} | ${row.count} | ${row.bytes} | ${toBytesLabel(row.bytes)} |`);
  });
  lines.push("");
  lines.push("## Category Summary");
  lines.push("");
  lines.push("| Category | Files | Bytes | Size |");
  lines.push("|---|---:|---:|---:|");
  categorySummary.forEach((row) => {
    lines.push(`| ${escapePipes(row.key)} | ${row.count} | ${row.bytes} | ${toBytesLabel(row.bytes)} |`);
  });
  lines.push("");
  lines.push("## Extension Summary");
  lines.push("");
  lines.push("| Extension | Files | Bytes | Size |");
  lines.push("|---|---:|---:|---:|");
  extensionSummary.forEach((row) => {
    lines.push(`| ${escapePipes(row.key)} | ${row.count} | ${row.bytes} | ${toBytesLabel(row.bytes)} |`);
  });
  lines.push("");
  lines.push("## Full File Index");
  lines.push("");
  lines.push("| # | File | Category | Ext | Bytes | Modified (UTC) |");
  lines.push("|---:|---|---|---|---:|---|");
  rows.forEach((row, index) => {
    lines.push(
      `| ${index + 1} | \`${escapePipes(row.path)}\` | ${escapePipes(row.category)} | ${escapePipes(
        row.extension
      )} | ${row.bytes} | ${row.modified_utc} |`
    );
  });
  lines.push("");
  lines.push("_This file is generated by `npm run docs:catalog`._");
  lines.push("");
  return lines.join("\n");
}

function generate(root, args = {}) {
  const markdownFile = path.resolve(root, args.markdownFile || DEFAULT_MARKDOWN_FILE);
  const jsonFile = path.resolve(root, args.jsonFile || DEFAULT_JSON_FILE);
  const rows = collectFileRows(root);
  const generatedAt = new Date().toISOString();
  const payload = {
    schema_version: 1,
    report_id: "aio_repository_file_catalog",
    generated_at: generatedAt,
    root: normalizePath(root),
    ignored_directories: [...DEFAULT_IGNORE_DIRS],
    totals: {
      files: rows.length,
      bytes: sumBytes(rows)
    },
    files: rows
  };

  writeTextFileRobust(jsonFile, `${JSON.stringify(payload, null, 2)}\n`);
  writeTextFileRobust(markdownFile, buildMarkdown(root, rows, generatedAt));

  return {
    status: "pass",
    generated_at: generatedAt,
    root: normalizePath(root),
    markdown_file: normalizePath(path.relative(root, markdownFile)),
    json_file: normalizePath(path.relative(root, jsonFile)),
    file_count: rows.length,
    total_bytes: sumBytes(rows)
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const root = findProjectRoot(process.cwd());
  const report = generate(root, args);
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    process.stderr.write(`generate-file-catalog-docs failed: ${error.message}\n`);
    process.exit(1);
  }
}

module.exports = {
  DEFAULT_JSON_FILE,
  DEFAULT_MARKDOWN_FILE,
  DEFAULT_IGNORE_DIRS,
  collectFileRows,
  generate
};
