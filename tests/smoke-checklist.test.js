"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const SMOKE_CHECKLIST_SCRIPT = path.join(ROOT, "scripts", "smoke-checklist.js");

function run_smoke_checklist(args) {
  return spawnSync(process.execPath, [SMOKE_CHECKLIST_SCRIPT, ...args], {
    cwd: ROOT,
    encoding: "utf8"
  });
}

test("smoke-checklist verifies evidence files for all pass entries", (t) => {
  const temp_dir = fs.mkdtempSync(path.join(ROOT, "data", "output", "logs", "tmp-smoke-checklist-"));
  t.after(() => {
    fs.rmSync(temp_dir, { recursive: true, force: true });
  });

  const report_file = path.join(temp_dir, "smoke_report.json");
  const evidence_dir = path.join(temp_dir, "evidence");

  const mark_result = run_smoke_checklist([
    "--report-file",
    report_file,
    "--evidence-dir",
    evidence_dir,
    "--mark-all-pass",
    "--set-note",
    "auth_flow:validated_in_test"
  ]);

  assert.equal(mark_result.status, 0, `stdout=${mark_result.stdout}\nstderr=${mark_result.stderr}`);

  const report = JSON.parse(fs.readFileSync(report_file, "utf8"));
  assert.equal(report.items.length, 6);
  report.items.forEach((item) => {
    assert.equal(item.status, "pass");
    const evidence_abs = path.resolve(ROOT, item.evidence_path);
    assert.equal(fs.existsSync(evidence_abs), true);
  });

  const verify_result = run_smoke_checklist([
    "--report-file",
    report_file,
    "--verify-evidence",
    "--require-all-pass"
  ]);

  assert.equal(verify_result.status, 0, `stdout=${verify_result.stdout}\nstderr=${verify_result.stderr}`);
  const verify_summary = JSON.parse(verify_result.stdout);
  assert.equal(verify_summary.all_passed, true);
  assert.equal(verify_summary.validation.verify_evidence, true);
  assert.equal(verify_summary.validation.missing_evidence_count, 0);
});

test("smoke-checklist fails when evidence is stale or missing", (t) => {
  const temp_dir = fs.mkdtempSync(path.join(ROOT, "data", "output", "logs", "tmp-smoke-checklist-"));
  t.after(() => {
    fs.rmSync(temp_dir, { recursive: true, force: true });
  });

  const report_file = path.join(temp_dir, "smoke_report.json");
  const evidence_dir = path.join(temp_dir, "evidence");

  const mark_result = run_smoke_checklist([
    "--report-file",
    report_file,
    "--evidence-dir",
    evidence_dir,
    "--mark-all-pass"
  ]);
  assert.equal(mark_result.status, 0, `stdout=${mark_result.stdout}\nstderr=${mark_result.stderr}`);

  const report = JSON.parse(fs.readFileSync(report_file, "utf8"));
  const stale_path = path.resolve(ROOT, report.items[0].evidence_path);
  const old_date = new Date(Date.now() - 48 * 60 * 60 * 1000);
  fs.utimesSync(stale_path, old_date, old_date);

  const stale_result = run_smoke_checklist([
    "--report-file",
    report_file,
    "--verify-evidence",
    "--require-all-pass",
    "--max-evidence-age-hours",
    "1"
  ]);
  assert.notEqual(stale_result.status, 0, `stdout=${stale_result.stdout}\nstderr=${stale_result.stderr}`);
  const stale_summary = JSON.parse(stale_result.stdout);
  assert.equal(stale_summary.validation.stale_evidence_count > 0, true);

  const missing_path = path.resolve(ROOT, report.items[1].evidence_path);
  fs.rmSync(missing_path, { force: true });

  const missing_result = run_smoke_checklist([
    "--report-file",
    report_file,
    "--verify-evidence",
    "--require-all-pass"
  ]);
  assert.notEqual(
    missing_result.status,
    0,
    `stdout=${missing_result.stdout}\nstderr=${missing_result.stderr}`
  );
  const missing_summary = JSON.parse(missing_result.stdout);
  assert.equal(missing_summary.validation.missing_evidence_count > 0, true);
});
