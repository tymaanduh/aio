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

const smokeItems = Object.freeze([
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
      "  --verify-evidence         Validate that pass items have existing evidence files",
      "  --require-all-pass        Fail when any checklist item is not pass",
      "  --max-evidence-age-hours <n>  Fail when pass evidence is older than n hours",
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
    markAllPass: false,
    verifyEvidence: false,
    requireAllPass: false,
    maxEvidenceAgeHours: null
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
    if (token === "--verify-evidence") {
      args.verifyEvidence = true;
      continue;
    }
    if (token === "--require-all-pass") {
      args.requireAllPass = true;
      continue;
    }
    if (token === "--max-evidence-age-hours") {
      const raw_value = Number(argv[index + 1]);
      if (!Number.isFinite(raw_value) || raw_value < 0) {
        throw new Error("--max-evidence-age-hours must be a non-negative number");
      }
      args.maxEvidenceAgeHours = raw_value;
      index += 1;
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
    items: smokeItems.map((item) => ({
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
  let did_update = false;

  if (args.markAllPass) {
    smokeItems.forEach((item) => pass_set.add(item.id));
  }

  pass_set.forEach((id) => {
    const item = get_or_create_item(report, id);
    const note = args.notes[id] || item.note || "";
    const evidence_path = write_evidence(args, item, note);
    item.status = "pass";
    item.note = note;
    item.evidence_path = path.relative(ROOT, evidence_path).replace(/\\/g, "/");
    did_update = true;
  });

  fail_set.forEach((id) => {
    const item = get_or_create_item(report, id);
    item.status = "fail";
    item.note = args.notes[id] || item.note || "";
    item.evidence_path = "";
    did_update = true;
  });

  Object.entries(args.notes).forEach(([id, note]) => {
    const item = get_or_create_item(report, id);
    if (item.note !== note) {
      item.note = note;
      did_update = true;
    }
  });

  return did_update;
}

function resolve_evidence_path(evidence_path) {
  const relative_path = String(evidence_path || "").trim();
  if (!relative_path) {
    return null;
  }
  const absolute_path = path.resolve(ROOT, relative_path);
  const root_relative = path.relative(ROOT, absolute_path);
  if (
    !root_relative ||
    root_relative.startsWith("..") ||
    path.isAbsolute(root_relative)
  ) {
    return null;
  }
  return absolute_path;
}

function build_validation(report, args) {
  const max_age_hours = Number.isFinite(args.maxEvidenceAgeHours)
    ? Number(args.maxEvidenceAgeHours)
    : null;
  const verify_evidence = Boolean(args.verifyEvidence || max_age_hours !== null);
  const missing_evidence = [];
  const stale_evidence = [];
  const pass_items = report.items.filter((item) => String(item.status || "") === "pass");
  const now_ms = Date.now();

  pass_items.forEach((item) => {
    const id = String(item.id || "");
    const evidence_path = String(item.evidence_path || "").trim();
    if (!evidence_path) {
      missing_evidence.push({ id, reason: "missing_evidence_path" });
      return;
    }
    if (!verify_evidence) {
      return;
    }
    const absolute_path = resolve_evidence_path(evidence_path);
    if (!absolute_path || !fs.existsSync(absolute_path)) {
      missing_evidence.push({ id, reason: "evidence_file_not_found", evidence_path });
      return;
    }
    const stat = fs.statSync(absolute_path);
    if (!stat.isFile()) {
      missing_evidence.push({ id, reason: "evidence_path_not_file", evidence_path });
      return;
    }
    if (max_age_hours === null) {
      return;
    }
    const age_hours = (now_ms - stat.mtimeMs) / (1000 * 60 * 60);
    if (age_hours > max_age_hours) {
      stale_evidence.push({
        id,
        evidence_path,
        age_hours: Number(age_hours.toFixed(3)),
        max_age_hours
      });
    }
  });

  return {
    verify_evidence,
    max_evidence_age_hours: max_age_hours,
    checked_pass_items: pass_items.length,
    missing_evidence_count: missing_evidence.length,
    missing_evidence,
    stale_evidence_count: stale_evidence.length,
    stale_evidence,
    evidence_verified:
      (!verify_evidence || missing_evidence.length === 0) && stale_evidence.length === 0
  };
}

function write_report(file_path, report) {
  ensure_dir(path.dirname(file_path));
  fs.writeFileSync(file_path, `${JSON.stringify(report, null, 2)}\n`, "utf8");
}

function summarize_report(report, report_file, args) {
  const counts = report.items.reduce(
    (acc, item) => {
      const status = String(item.status || "pending");
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    { pass: 0, fail: 0, pending: 0 }
  );
  const validation = build_validation(report, args);
  return {
    report_file: report_file,
    updated_at: report.updated_at,
    counts,
    all_passed: counts.pass === report.items.length,
    validation
  };
}

function main() {
  const args = parse_args(process.argv.slice(2));
  const had_report_file = fs.existsSync(args.reportFile);
  const report = load_report(args.reportFile) || create_default_report();
  const did_update = apply_updates(args, report);
  if (did_update) {
    report.updated_at = now_iso();
  }
  if (did_update || !had_report_file) {
    write_report(args.reportFile, report);
  }
  const summary = summarize_report(report, args.reportFile, args);
  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);

  const fail_reasons = [];
  if (args.requireAllPass && !summary.all_passed) {
    fail_reasons.push("not_all_items_passed");
  }
  if (summary.validation.verify_evidence && !summary.validation.evidence_verified) {
    fail_reasons.push("evidence_validation_failed");
  }
  if (fail_reasons.length > 0) {
    process.stderr.write(`smoke-checklist validation failed: ${fail_reasons.join(",")}\n`);
    process.exit(1);
  }
}

try {
  main();
} catch (error) {
  process.stderr.write(`smoke-checklist failed: ${error.message}\n`);
  process.exit(1);
}
