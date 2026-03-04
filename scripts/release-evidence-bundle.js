#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const POLYGLOT_ROOT = path.join(ROOT, "data", "output", "databases", "polyglot-default");

const default_paths = Object.freeze({
  runState: path.join(POLYGLOT_ROOT, "context", "run_state.json"),
  validation: path.join(POLYGLOT_ROOT, "analysis", "validation_report.json"),
  updateScan: path.join(POLYGLOT_ROOT, "analysis", "update_scan_report.json"),
  separation: path.join(POLYGLOT_ROOT, "analysis", "data_separation_audit_report.json"),
  security: path.join(POLYGLOT_ROOT, "analysis", "security_report.json"),
  benchmark: path.join(POLYGLOT_ROOT, "reports", "sxs_benchmark_report.json"),
  smoke: path.join(POLYGLOT_ROOT, "reports", "smoke_checklist_report.json"),
  recommendation: path.join(POLYGLOT_ROOT, "reports", "final_recommendation.md"),
  output: path.join(POLYGLOT_ROOT, "reports", "release_evidence_bundle.json")
});

function now_iso() {
  return new Date().toISOString();
}

function print_help_and_exit(code) {
  process.stdout.write(
    [
      "release-evidence-bundle",
      "",
      "Usage:",
      "  node scripts/release-evidence-bundle.js [options]",
      "",
      "Options:",
      "  --out-file <path>   Output bundle file path",
      "  --help              Show help"
    ].join("\n") + "\n"
  );
  process.exit(code);
}

function parse_args(argv) {
  const args = {
    outFile: default_paths.output
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--out-file") {
      args.outFile = path.resolve(process.cwd(), String(argv[index + 1] || ""));
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

function read_required_json(file_path, label) {
  if (!fs.existsSync(file_path)) {
    throw new Error(`missing required ${label} file: ${path.relative(ROOT, file_path)}`);
  }
  return JSON.parse(fs.readFileSync(file_path, "utf8"));
}

function read_required_text(file_path, label) {
  if (!fs.existsSync(file_path)) {
    throw new Error(`missing required ${label} file: ${path.relative(ROOT, file_path)}`);
  }
  return fs.readFileSync(file_path, "utf8");
}

function get_file_mtime(file_path) {
  const stat = fs.statSync(file_path);
  return stat.mtime.toISOString();
}

function resolve_evidence_file_path(evidence_path) {
  const relative_path = String(evidence_path || "").trim();
  if (!relative_path) {
    return null;
  }
  const absolute_path = path.resolve(ROOT, relative_path);
  const root_relative = path.relative(ROOT, absolute_path);
  if (!root_relative || root_relative.startsWith("..") || path.isAbsolute(root_relative)) {
    return null;
  }
  return absolute_path;
}

function build_smoke_item_state(item) {
  const status = String(item && item.status ? item.status : "pending").toLowerCase();
  const evidence_path = String(item && item.evidence_path ? item.evidence_path : "").trim();
  const evidence_file = resolve_evidence_file_path(evidence_path);
  if (!evidence_file || !fs.existsSync(evidence_file)) {
    return {
      status,
      evidence_path,
      evidence_exists: false,
      evidence_mtime_utc: null
    };
  }
  const stat = fs.statSync(evidence_file);
  return {
    status,
    evidence_path,
    evidence_exists: stat.isFile(),
    evidence_mtime_utc: stat.isFile() ? stat.mtime.toISOString() : null
  };
}

function build_checks(validation, security, update_scan, separation, smoke_report, run_state) {
  const validation_steps = Array.isArray(validation.steps) ? validation.steps : [];
  const step_status = validation_steps.reduce((acc, step) => {
    acc[String(step.id || "")] = Boolean(step.passed);
    return acc;
  }, {});

  const smoke_items = Array.isArray(smoke_report.items) ? smoke_report.items : [];
  const smoke_item_states = smoke_items.map((item) => build_smoke_item_state(item));
  const smoke_all_passed =
    smoke_item_states.length > 0 &&
    smoke_item_states.every(
      (item) => item.status === "pass" && Boolean(item.evidence_path) && item.evidence_exists
    );
  const smoke_missing_evidence_count = smoke_item_states.filter(
    (item) => item.status === "pass" && !item.evidence_exists
  ).length;
  const stage_status = run_state && run_state.stage_status && typeof run_state.stage_status === "object" ? run_state.stage_status : {};
  const benchmark_stage = stage_status.benchmark || {};
  const recommendation_stage = stage_status.recommendation || {};

  return {
    current_stage: String(run_state.current_stage || ""),
    validation_passed: Boolean(validation.passed),
    lint_passed: Boolean(step_status.lint),
    tests_passed: Boolean(step_status.test),
    refactor_gate_passed: Boolean(step_status.refactor_gate),
    security_passed: Boolean(security.passed),
    update_scan_start_ok: Boolean(update_scan.start && update_scan.start.ok),
    update_scan_complete_ok: Boolean(update_scan.complete && update_scan.complete.ok),
    separation_required_total: Number(
      (separation.counts && separation.counts.separation_required_total) || separation.separation_required_total || 0
    ),
    smoke_all_passed,
    smoke_missing_evidence_count,
    benchmark_stage_completed: String(benchmark_stage.status || "") === "completed",
    recommendation_stage_completed: String(recommendation_stage.status || "") === "completed"
  };
}

function build_smoke_evidence(smoke_report) {
  const smoke_items = Array.isArray(smoke_report.items) ? smoke_report.items : [];
  return smoke_items.map((item) => ({
    ...build_smoke_item_state(item),
    id: String(item.id || ""),
    label: String(item.label || ""),
    status: String(item.status || "pending"),
    evidence_path: String(item.evidence_path || ""),
    note: String(item.note || "")
  }));
}

function build_language_selection(run_state, recommendation_markdown) {
  const selection = run_state && run_state.language_selection && typeof run_state.language_selection === "object" ? run_state.language_selection : {};
  const primary = String(selection.primary_language || "");
  const fallback = String(selection.fallback_language || "");
  const recommendation_text = recommendation_markdown.toLowerCase();
  const alias_map = {
    cpp: ["cpp", "c++"],
    csharp: ["csharp", "c#"],
    javascript: ["javascript", "js"],
    typescript: ["typescript", "ts"],
    python: ["python"]
  };
  const primary_aliases = alias_map[primary] || [primary];
  const fallback_aliases = alias_map[fallback] || [fallback];
  const recommendation_mentions_primary = primary_aliases.some((alias) =>
    recommendation_text.includes(`primary language: ${alias}`.toLowerCase())
  );
  const recommendation_mentions_fallback = fallback_aliases.some((alias) =>
    recommendation_text.includes(`fallback language: ${alias}`.toLowerCase())
  );

  return {
    primary_language: primary,
    fallback_language: fallback,
    benchmark_languages: Array.isArray(selection.benchmark_languages) ? selection.benchmark_languages.slice() : [],
    locked_cpp_python: primary === "cpp" && fallback === "python",
    recommendation_mentions_primary,
    recommendation_mentions_fallback
  };
}

function build_benchmark_summary(benchmark_report) {
  const ranking = Array.isArray(benchmark_report.ranking) ? benchmark_report.ranking.slice() : [];
  const results = Array.isArray(benchmark_report.results) ? benchmark_report.results : [];

  return {
    mode: String(benchmark_report.mode || ""),
    iterations: Number(benchmark_report.iterations || 0),
    ranking,
    top_result: ranking.length > 0 ? String(ranking[0]) : "",
    results_count: results.length
  };
}

function build_issues(checks, language, benchmark) {
  const issues = [];
  if (checks.current_stage !== "completed") {
    issues.push(`run_state current_stage expected completed, got ${checks.current_stage || "unknown"}`);
  }
  if (!checks.validation_passed) {
    issues.push("validation report indicates failed checks");
  }
  if (!checks.lint_passed || !checks.tests_passed || !checks.refactor_gate_passed) {
    issues.push("validation step set lint/test/refactor_gate is not fully passing");
  }
  if (!checks.security_passed) {
    issues.push("security report indicates failed gate");
  }
  if (!checks.update_scan_start_ok || !checks.update_scan_complete_ok) {
    issues.push("update scan start/complete did not both pass");
  }
  if (!checks.smoke_all_passed) {
    issues.push("smoke checklist is not fully passed with evidence");
  }
  if (checks.smoke_missing_evidence_count > 0) {
    issues.push(`smoke checklist has ${checks.smoke_missing_evidence_count} pass entries with missing evidence files`);
  }
  if (!checks.benchmark_stage_completed || !checks.recommendation_stage_completed) {
    issues.push("benchmark/recommendation stages are not both completed");
  }
  if (!language.locked_cpp_python) {
    issues.push(
      `language lock mismatch (expected cpp/python, got ${language.primary_language || "unknown"}/${language.fallback_language || "unknown"})`
    );
  }
  if (!language.recommendation_mentions_primary || !language.recommendation_mentions_fallback) {
    issues.push("final recommendation markdown does not mention resolved primary/fallback language lines");
  }
  if (!benchmark.top_result) {
    issues.push("benchmark report has empty ranking");
  }
  return issues;
}

function write_json(file_path, value) {
  fs.mkdirSync(path.dirname(file_path), { recursive: true });
  fs.writeFileSync(file_path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function relative_path(file_path) {
  return path.relative(ROOT, file_path).replace(/\\/g, "/");
}

function main() {
  const args = parse_args(process.argv.slice(2));
  const run_state = read_required_json(default_paths.runState, "run state");
  const validation = read_required_json(default_paths.validation, "validation report");
  const update_scan = read_required_json(default_paths.updateScan, "update scan report");
  const separation = read_required_json(default_paths.separation, "data separation report");
  const security = read_required_json(default_paths.security, "security report");
  const benchmark = read_required_json(default_paths.benchmark, "benchmark report");
  const smoke = read_required_json(default_paths.smoke, "smoke checklist report");
  const recommendation_markdown = read_required_text(default_paths.recommendation, "final recommendation");

  const checks = build_checks(validation, security, update_scan, separation, smoke, run_state);
  const smoke_evidence = build_smoke_evidence(smoke);
  const language = build_language_selection(run_state, recommendation_markdown);
  const benchmark_summary = build_benchmark_summary(benchmark);
  const issues = build_issues(checks, language, benchmark_summary);

  const bundle = {
    generated_at: now_iso(),
    gate_pass: issues.length === 0,
    issues,
    artifacts: {
      run_state: relative_path(default_paths.runState),
      validation_report: relative_path(default_paths.validation),
      update_scan_report: relative_path(default_paths.updateScan),
      data_separation_report: relative_path(default_paths.separation),
      security_report: relative_path(default_paths.security),
      benchmark_report: relative_path(default_paths.benchmark),
      smoke_report: relative_path(default_paths.smoke),
      final_recommendation: relative_path(default_paths.recommendation)
    },
    artifact_mtime_utc: {
      run_state: get_file_mtime(default_paths.runState),
      validation_report: get_file_mtime(default_paths.validation),
      update_scan_report: get_file_mtime(default_paths.updateScan),
      data_separation_report: get_file_mtime(default_paths.separation),
      security_report: get_file_mtime(default_paths.security),
      benchmark_report: get_file_mtime(default_paths.benchmark),
      smoke_report: get_file_mtime(default_paths.smoke),
      final_recommendation: get_file_mtime(default_paths.recommendation)
    },
    checks,
    language_selection: language,
    benchmark: benchmark_summary,
    smoke_evidence
  };

  write_json(args.outFile, bundle);
  process.stdout.write(
    `${JSON.stringify(
      {
        out_file: args.outFile,
        gate_pass: bundle.gate_pass,
        issues_count: issues.length,
        primary_language: language.primary_language,
        fallback_language: language.fallback_language,
        separation_required_total: checks.separation_required_total,
        benchmark_top: benchmark_summary.top_result
      },
      null,
      2
    )}\n`
  );

  if (!bundle.gate_pass) {
    process.exit(1);
  }
}

try {
  main();
} catch (error) {
  process.stderr.write(`release-evidence-bundle failed: ${error.message}\n`);
  process.exit(1);
}
