#!/usr/bin/env node
"use strict";

const { spawnSync } = require("child_process");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const CHECKS = Object.freeze([
  Object.freeze({
    id: "agents_validate",
    command: "npm",
    args: ["run", "agents:validate"]
  }),
  Object.freeze({
    id: "commit_slices_strict",
    command: "npm",
    args: ["run", "commit:slices:report", "--", "--strict"]
  }),
  Object.freeze({
    id: "separation_audit_guard",
    command: "npm",
    args: [
      "run",
      "audit:data-separation",
      "--",
      "--enforce-no-regression",
      "--baseline-file",
      "data/output/databases/polyglot-default/analysis/data_separation_baseline.json"
    ]
  }),
  Object.freeze({
    id: "lint",
    command: "npm",
    args: ["run", "lint", "--silent"]
  }),
  Object.freeze({
    id: "test",
    command: "npm",
    args: ["test", "--silent"]
  }),
  Object.freeze({
    id: "refactor_gate",
    command: "npm",
    args: ["run", "refactor:gate", "--silent"]
  })
]);

function run_check(check) {
  const result = spawnSync(check.command, check.args, {
    cwd: ROOT,
    stdio: "inherit",
    shell: false
  });
  return {
    id: check.id,
    statusCode: Number(result.status || 0),
    passed: Number(result.status || 0) === 0
  };
}

function main() {
  const summary = {
    run_at: new Date().toISOString(),
    checks: CHECKS.map((check) => run_check(check))
  };
  summary.passed = summary.checks.every((check) => check.passed);
  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
  if (!summary.passed) {
    process.exit(1);
  }
}

main();
