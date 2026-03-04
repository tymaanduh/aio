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
  "reports",
  "smoke_checklist_report.json"
);
const DEFAULT_EVIDENCE_DIR = path.join(ROOT, "data", "output", "logs", "smoke");

const SMOKE_ITEMS = Object.freeze([
  Object.freeze({ id: "auth_flow", label: "auth create/login/logout" }),
  Object.freeze({ id: "tree_flow", label: "tree selection/range/archive" }),
  Object.freeze({ id: "sentence_graph", label: "sentence graph interactions" }),
  Object.freeze({ id: "command_palette", label: "command palette open/filter/execute" }),
  Object.freeze({ id: "universe_flow", label: "universe render + benchmark + path + selection" }),
  Object.freeze({ id: "logs_stream", label: "logs window open/stream" })
]);

function now_iso() {
  return new Date().toISOString();
}

function ensure_dir(dir_path) {
  fs.mkdirSync(dir_path, { recursive: true });
}

function print_help_and_exit(code) {
  process.stdout.write(
    [
      "smoke-checklist",
      "",
      "Usage:",
      "  node scripts/smoke-checklist.js [options]",
      "",
      "Options:",
      "  --report-file <path>      Smoke report file",
      "  --evidence-dir <path>     Evidence output directory",
      "  --set-pass <id[,id...]>   Mark specific ids as pass with evidence log",
      "  --set-fail <id[,id...]>   Mark specific ids as fail",
      "  --set-note <id:note>      Attach note to item (repeatable)",
      "  --mark-all-pass           Mark all checklist items as pass",
      "  --help                    Show help"
    ].join("\n") + "\n"
  );
  process.exit(code);
}

function parse_args(argv) {
  const args = {
    reportFile: DEFAULT_REPORT_FILE,
    evidenceDir: DEFAULT_EVIDENCE_DIR,
    passIds: [],
    failIds: [],
    notes: {},
    markAllPass: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--report-file") {
      args.reportFile = path.resolve(process.cwd(), String(argv[index + 1] || ""));
      index += 1;
      continue;
    }
    if (token === "--evidence-dir") {
      args.evidenceDir = path.resolve(process.cwd(), String(argv[index + 1] || ""));
      index += 1;
      continue;
    }
    if (token === "--set-pass") {
      String(argv[index + 1] || "")
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean)
        .forEach((id) => args.passIds.push(id));
      index += 1;
      continue;
    }
    if (token === "--set-fail") {
      String(argv[index + 1] || "")
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean)
        .forEach((id) => args.failIds.push(id));
      index += 1;
      continue;
    }
    if (token === "--set-note") {
      const note_spec = String(argv[index + 1] || "");
      const split_index = note_spec.indexOf(":");
      if (split_index > 0) {
        const id = note_spec.slice(0, split_index).trim();
        const note = note_spec.slice(split_index + 1).trim();
        if (id && note) {
          args.notes[id] = note;
        }
      }
      index += 1;
      continue;
    }
    if (token === "--mark-all-pass") {
      args.markAllPass = true;
      continue;
    }
    if (token === "--help" || token === "-h") {
      print_help_and_exit(0);
    }
    throw new Error(`unknown argument: ${token}`);
  }

  return args;
}

function load_report(file_path) {
  try {
    const parsed = JSON.parse(fs.readFileSync(file_path, "utf8"));
    if (parsed && Array.isArray(parsed.items)) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

function create_default_report() {
  return {
    generated_at: now_iso(),
    updated_at: now_iso(),
    items: SMOKE_ITEMS.map((item) => ({
      id: item.id,
      label: item.label,
      status: "pending",
      note: "",
      evidence_path: ""
    }))
  };
}

function get_or_create_item(report, id) {
  const item = report.items.find((row) => row.id === id);
  if (!item) {
    throw new Error(`unknown smoke checklist id: ${id}`);
  }
  return item;
}

function write_evidence(args, item, note) {
  ensure_dir(args.evidenceDir);
  const stamp = now_iso().replace(/[:.]/g, "-");
  const file_name = `${item.id}-${stamp}.log`;
  const file_path = path.join(args.evidenceDir, file_name);
  const body = [
    `id=${item.id}`,
    `label=${item.label}`,
    `status=pass`,
    `timestamp=${now_iso()}`,
    `note=${note || ""}`
  ].join("\n");
  fs.writeFileSync(file_path, `${body}\n`, "utf8");
  return file_path;
}

function apply_updates(args, report) {
  const pass_set = new Set(args.passIds);
  const fail_set = new Set(args.failIds);

  if (args.markAllPass) {
    SMOKE_ITEMS.forEach((item) => pass_set.add(item.id));
  }

  pass_set.forEach((id) => {
    const item = get_or_create_item(report, id);
    const note = args.notes[id] || item.note || "";
    const evidence_path = write_evidence(args, item, note);
    item.status = "pass";
    item.note = note;
    item.evidence_path = path.relative(ROOT, evidence_path).replace(/\\/g, "/");
  });

  fail_set.forEach((id) => {
    const item = get_or_create_item(report, id);
    item.status = "fail";
    item.note = args.notes[id] || item.note || "";
    item.evidence_path = "";
  });

  Object.entries(args.notes).forEach(([id, note]) => {
    const item = get_or_create_item(report, id);
    item.note = note;
  });
}

function write_report(file_path, report) {
  ensure_dir(path.dirname(file_path));
  fs.writeFileSync(file_path, `${JSON.stringify(report, null, 2)}\n`, "utf8");
}

function summarize_report(report, report_file) {
  const counts = report.items.reduce(
    (acc, item) => {
      const status = String(item.status || "pending");
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    { pass: 0, fail: 0, pending: 0 }
  );
  return {
    report_file: report_file,
    updated_at: report.updated_at,
    counts,
    all_passed: counts.pass === report.items.length
  };
}

function main() {
  const args = parse_args(process.argv.slice(2));
  const report = load_report(args.reportFile) || create_default_report();
  apply_updates(args, report);
  report.updated_at = now_iso();
  write_report(args.reportFile, report);
  process.stdout.write(`${JSON.stringify(summarize_report(report, args.reportFile), null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`smoke-checklist failed: ${error.message}\n`);
  process.exit(1);
}
