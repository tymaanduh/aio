#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const DEFAULT_MANIFEST = path.join(ROOT, "to-do", "commit_slices.json");
const DEFAULT_REPORT = path.join(
  ROOT,
  "data",
  "output",
  "databases",
  "polyglot-default",
  "reports",
  "commit_slice_report.json"
);

function now_iso() {
  return new Date().toISOString();
}

function print_help_and_exit(code) {
  process.stdout.write(
    [
      "commit-slice-report",
      "",
      "Usage:",
      "  node scripts/commit-slice-report.js [options]",
      "",
      "Options:",
      "  --manifest <path>      Slice manifest JSON (default: to-do/commit_slices.json)",
      "  --write-report <path>  Write report JSON file",
      "  --strict               Exit non-zero if unsliced/overlap files exist",
      "                         (slice precedence is manifest order: first match wins)",
      "  --help                 Show help"
    ].join("\n") + "\n"
  );
  process.exit(code);
}

function parse_args(argv) {
  const args = {
    manifest: DEFAULT_MANIFEST,
    reportFile: DEFAULT_REPORT,
    strict: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--manifest") {
      args.manifest = path.resolve(process.cwd(), String(argv[index + 1] || ""));
      index += 1;
      continue;
    }
    if (token === "--write-report") {
      args.reportFile = path.resolve(process.cwd(), String(argv[index + 1] || ""));
      index += 1;
      continue;
    }
    if (token === "--strict") {
      args.strict = true;
      continue;
    }
    if (token === "--help" || token === "-h") {
      print_help_and_exit(0);
    }
    throw new Error(`unknown argument: ${token}`);
  }

  return args;
}

function read_json(file_path) {
  return JSON.parse(fs.readFileSync(file_path, "utf8"));
}

function normalize_rel_path(value) {
  return String(value || "").trim().replace(/\\/g, "/").replace(/^\.?\//, "");
}

function normalize_prefix(value) {
  const normalized = normalize_rel_path(value);
  return normalized.endsWith("/") ? normalized : normalized;
}

function load_manifest(file_path) {
  if (!fs.existsSync(file_path)) {
    throw new Error(`manifest not found: ${file_path}`);
  }
  const parsed = read_json(file_path);
  const slices = Array.isArray(parsed.slices) ? parsed.slices : [];
  if (!slices.length) {
    throw new Error("manifest has no slices");
  }
  return {
    file: file_path,
    schema_version: parsed.schema_version || null,
    slices: slices.map((slice) => ({
      id: String(slice.id || "").trim(),
      description: String(slice.description || "").trim(),
      path_prefixes: (Array.isArray(slice.path_prefixes) ? slice.path_prefixes : [])
        .map((prefix) => normalize_prefix(prefix))
        .filter(Boolean)
    }))
  };
}

function read_changed_paths() {
  const result = spawnSync("git", ["status", "--porcelain"], {
    cwd: ROOT,
    encoding: "utf8",
    shell: false
  });
  if ((result.status || 0) !== 0) {
    throw new Error(`git status failed: ${String(result.stderr || result.stdout || "").trim()}`);
  }

  return String(result.stdout || "")
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter(Boolean)
    .map((line) => {
      const raw = line.slice(3).trim();
      if (!raw) {
        return "";
      }
      const arrow_index = raw.indexOf("->");
      if (arrow_index >= 0) {
        return normalize_rel_path(raw.slice(arrow_index + 2).trim());
      }
      return normalize_rel_path(raw);
    })
    .filter(Boolean);
}

function path_matches_prefix(file_path, prefix) {
  if (!prefix) {
    return false;
  }
  if (file_path === prefix) {
    return true;
  }
  const normalized_prefix = prefix.endsWith("/") ? prefix : `${prefix}/`;
  return file_path.startsWith(normalized_prefix);
}

function classify_paths(changed_paths, slices) {
  const per_slice = slices.map((slice) => ({
    id: slice.id,
    description: slice.description,
    path_prefixes: slice.path_prefixes,
    paths: []
  }));

  const multi_match = [];
  const unsliced = [];

  changed_paths.forEach((file_path) => {
    const matches = [];
    per_slice.forEach((slice, slice_index) => {
      const matched = slice.path_prefixes.some((prefix) => path_matches_prefix(file_path, prefix));
      if (matched) {
        matches.push({
          slice_index: slice_index,
          slice_id: slice.id
        });
      }
    });

    if (matches.length === 0) {
      unsliced.push(file_path);
      return;
    }

    const primary = matches[0];
    per_slice[primary.slice_index].paths.push(file_path);

    if (matches.length > 1) {
      multi_match.push({
        path: file_path,
        primary_slice_id: primary.slice_id,
        matched_slice_ids: matches.map((item) => item.slice_id)
      });
    }
  });

  per_slice.forEach((slice) => {
    slice.paths = slice.paths.sort();
    slice.matched_count = slice.paths.length;
  });

  return {
    per_slice,
    unsliced: unsliced.sort(),
    multi_match
  };
}

function chunk_paths(paths, size) {
  const chunks = [];
  for (let index = 0; index < paths.length; index += size) {
    chunks.push(paths.slice(index, index + size));
  }
  return chunks;
}

function build_add_commands(per_slice) {
  const commands = [];
  per_slice.forEach((slice) => {
    if (!slice.paths.length) {
      return;
    }
    const path_chunks = chunk_paths(slice.paths, 25);
    path_chunks.forEach((chunk, chunk_index) => {
      commands.push({
        slice_id: slice.id,
        chunk_index: chunk_index + 1,
        command: `git add -- ${chunk.map((item) => `"${item}"`).join(" ")}`
      });
    });
  });
  return commands;
}

function write_json(file_path, value) {
  fs.mkdirSync(path.dirname(file_path), { recursive: true });
  fs.writeFileSync(file_path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function main() {
  const args = parse_args(process.argv.slice(2));
  const manifest = load_manifest(args.manifest);
  const changed_paths = read_changed_paths();
  const classification = classify_paths(changed_paths, manifest.slices);
  const add_commands = build_add_commands(classification.per_slice);

  const report = {
    generated_at: now_iso(),
    root: ROOT,
    manifest: path.relative(ROOT, args.manifest).replace(/\\/g, "/"),
    changed_files_total: changed_paths.length,
    slice_match_total: classification.per_slice.reduce((total, slice) => total + slice.matched_count, 0),
    unsliced_total: classification.unsliced.length,
    multi_match_total: classification.multi_match.length,
    status: classification.unsliced.length === 0 ? "clean" : "attention_required",
    slices: classification.per_slice,
    unsliced_paths: classification.unsliced,
    multi_match_paths: classification.multi_match,
    suggested_add_commands: add_commands
  };

  write_json(args.reportFile, report);
  process.stdout.write(
    `${JSON.stringify(
      {
        report_file: args.reportFile,
        changed_files_total: report.changed_files_total,
        unsliced_total: report.unsliced_total,
        multi_match_total: report.multi_match_total,
        status: report.status
      },
      null,
      2
    )}\n`
  );

  if (args.strict && report.unsliced_total > 0) {
    process.exit(1);
  }
}

try {
  main();
} catch (error) {
  process.stderr.write(`commit-slice-report failed: ${error.message}\n`);
  process.exit(1);
}
