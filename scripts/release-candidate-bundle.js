#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const POLYGLOT_ROOT = path.join(ROOT, "data", "output", "databases", "polyglot-default");

const defaultPaths = Object.freeze({
  runState: path.join(POLYGLOT_ROOT, "context", "run_state.json"),
  validation: path.join(POLYGLOT_ROOT, "analysis", "validation_report.json"),
  updateScan: path.join(POLYGLOT_ROOT, "analysis", "update_scan_report.json"),
  separation: path.join(POLYGLOT_ROOT, "analysis", "data_separation_audit_report.json"),
  benchmark: path.join(POLYGLOT_ROOT, "reports", "sxs_benchmark_report.json"),
  smoke: path.join(POLYGLOT_ROOT, "reports", "smoke_checklist_report.json"),
  recommendation: path.join(POLYGLOT_ROOT, "reports", "final_recommendation.md"),
  releaseEvidence: path.join(POLYGLOT_ROOT, "reports", "release_evidence_bundle.json"),
  commitSlice: path.join(POLYGLOT_ROOT, "reports", "commit_slice_report.json"),
  output: path.join(POLYGLOT_ROOT, "reports", "release_candidate_bundle.json")
});

function nowIso() {
  return new Date().toISOString();
}

function printHelpAndExit(code) {
  process.stdout.write(
    [
      "release-candidate-bundle",
      "",
      "Usage:",
      "  node scripts/release-candidate-bundle.js [options]",
      "",
      "Options:",
      "  --out-file <path>        Output bundle file path",
      "  --planned-update <text>  Optional release note included in bundle",
      "  --help                   Show help"
    ].join("\n") + "\n"
  );
  process.exit(code);
}

function parseArgs(argv) {
  const args = {
    outFile: defaultPaths.output,
    plannedUpdate: ""
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--out-file") {
      args.outFile = path.resolve(process.cwd(), String(argv[index + 1] || ""));
      index += 1;
      continue;
    }
    if (token === "--planned-update") {
      args.plannedUpdate = String(argv[index + 1] || "").trim();
      index += 1;
      continue;
    }
    if (token === "--help" || token === "-h") {
      printHelpAndExit(0);
    }
    throw new Error(`unknown argument: ${token}`);
  }

  return args;
}

function readRequiredJson(filePath, label) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`missing required ${label} file: ${path.relative(ROOT, filePath)}`);
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function readRequiredText(filePath, label) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`missing required ${label} file: ${path.relative(ROOT, filePath)}`);
  }
  return fs.readFileSync(filePath, "utf8");
}

function relativePath(filePath) {
  return path.relative(ROOT, filePath).replace(/\\/g, "/");
}

function getLanguageSelection(runState) {
  const selection = runState && runState.language_selection && typeof runState.language_selection === "object"
    ? runState.language_selection
    : {};
  return {
    primary_language: String(selection.primary_language || ""),
    fallback_language: String(selection.fallback_language || ""),
    benchmark_languages: Array.isArray(selection.benchmark_languages) ? selection.benchmark_languages.slice() : []
  };
}

function getRecommendationSignals(markdown, languageSelection) {
  const text = String(markdown || "").toLowerCase();
  const primary = String(languageSelection.primary_language || "").toLowerCase();
  const fallback = String(languageSelection.fallback_language || "").toLowerCase();
  return {
    mentions_primary_language: primary
      ? text.includes(`primary language: ${primary}`) || (primary === "cpp" && text.includes("primary language: c++"))
      : false,
    mentions_fallback_language: fallback
      ? text.includes(`fallback language: ${fallback}`)
      : false
  };
}

function getBenchmarkSummary(benchmark) {
  const ranking = Array.isArray(benchmark.ranking) ? benchmark.ranking.slice() : [];
  return {
    mode: String(benchmark.mode || ""),
    iterations: Number(benchmark.iterations || 0),
    ranking,
    top_result: ranking.length > 0 ? String(ranking[0]) : "",
    results_count: Array.isArray(benchmark.results) ? benchmark.results.length : 0
  };
}

function getSmokeStatus(smokeReport) {
  const items = Array.isArray(smokeReport.items) ? smokeReport.items : [];
  const passCount = items.filter((item) => String(item.status || "").toLowerCase() === "pass").length;
  const missingEvidence = items.filter(
    (item) =>
      String(item.status || "").toLowerCase() === "pass" &&
      !String(item.evidence_path || "").trim()
  ).length;
  return {
    total_items: items.length,
    pass_count: passCount,
    missing_evidence_count: missingEvidence,
    all_pass_with_evidence: items.length > 0 && passCount === items.length && missingEvidence === 0
  };
}

function getUpdateScanStatus(updateScan) {
  return {
    start_ok: Boolean(updateScan.start && updateScan.start.ok),
    complete_ok: Boolean(updateScan.complete && updateScan.complete.ok)
  };
}

function getValidationStatus(validation) {
  const steps = Array.isArray(validation.steps) ? validation.steps : [];
  const byId = steps.reduce((acc, step) => {
    acc[String(step.id || "")] = Boolean(step.passed);
    return acc;
  }, {});
  return {
    passed: Boolean(validation.passed),
    lint_passed: Boolean(byId.lint),
    test_passed: Boolean(byId.test),
    refactor_gate_passed: Boolean(byId.refactor_gate)
  };
}

function getSeparationSummary(separation) {
  const counts = separation && separation.counts && typeof separation.counts === "object" ? separation.counts : {};
  return {
    files_scanned: Number(counts.files_scanned || 0),
    candidate_total: Number(counts.candidate_total || 0),
    separation_required_total: Number(counts.separation_required_total || 0)
  };
}

function getCommitSliceSummary(commitSlice) {
  return {
    changed_files_total: Number(commitSlice.changed_files_total || 0),
    unsliced_total: Number(commitSlice.unsliced_total || 0),
    multi_match_total: Number(commitSlice.multi_match_total || 0),
    status: String(commitSlice.status || ""),
    clean: Number(commitSlice.unsliced_total || 0) === 0 && Number(commitSlice.multi_match_total || 0) === 0
  };
}

function buildIssues(payload) {
  const issues = [];
  if (payload.run_state.current_stage !== "completed") {
    issues.push(`run_state current_stage expected completed, got ${payload.run_state.current_stage || "unknown"}`);
  }
  if (!payload.release_evidence_gate_pass) {
    issues.push("release_evidence gate is not passing");
  }
  if (!payload.validation.passed || !payload.validation.lint_passed || !payload.validation.test_passed) {
    issues.push("validation report indicates failed lint/test checks");
  }
  if (!payload.validation.refactor_gate_passed) {
    issues.push("validation report indicates failed refactor gate");
  }
  if (!payload.update_scan.start_ok || !payload.update_scan.complete_ok) {
    issues.push("update scan start/complete checks are not both passing");
  }
  if (payload.separation.separation_required_total > 0) {
    issues.push(`separation_required_total expected 0, got ${payload.separation.separation_required_total}`);
  }
  if (!payload.commit_slices.clean) {
    issues.push(
      `commit slices not clean (unsliced=${payload.commit_slices.unsliced_total}, multi_match=${payload.commit_slices.multi_match_total})`
    );
  }
  if (!payload.smoke.all_pass_with_evidence) {
    issues.push("smoke checklist is not fully pass with evidence");
  }
  if (payload.language.primary_language !== "cpp" || payload.language.fallback_language !== "python") {
    issues.push(
      `language lock mismatch (expected cpp/python, got ${payload.language.primary_language || "unknown"}/${payload.language.fallback_language || "unknown"})`
    );
  }
  if (!payload.recommendation_signals.mentions_primary_language) {
    issues.push("final recommendation does not mention primary language");
  }
  if (!payload.recommendation_signals.mentions_fallback_language) {
    issues.push("final recommendation does not mention fallback language");
  }
  if (!payload.benchmark.top_result) {
    issues.push("benchmark ranking is empty");
  }
  return issues;
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  const runState = readRequiredJson(defaultPaths.runState, "run state");
  const validation = readRequiredJson(defaultPaths.validation, "validation report");
  const updateScan = readRequiredJson(defaultPaths.updateScan, "update scan report");
  const separation = readRequiredJson(defaultPaths.separation, "data separation report");
  const benchmark = readRequiredJson(defaultPaths.benchmark, "benchmark report");
  const smoke = readRequiredJson(defaultPaths.smoke, "smoke report");
  const recommendation = readRequiredText(defaultPaths.recommendation, "final recommendation");
  const releaseEvidence = readRequiredJson(defaultPaths.releaseEvidence, "release evidence bundle");
  const commitSlice = readRequiredJson(defaultPaths.commitSlice, "commit slice report");

  const payload = {
    generated_at: nowIso(),
    planned_update: args.plannedUpdate || null,
    release_evidence_gate_pass: Boolean(releaseEvidence.gate_pass),
    run_state: {
      mode_last_run: String(runState.mode_last_run || ""),
      current_stage: String(runState.current_stage || ""),
      last_run_at: String(runState.last_run_at || "")
    },
    validation: getValidationStatus(validation),
    update_scan: getUpdateScanStatus(updateScan),
    separation: getSeparationSummary(separation),
    language: getLanguageSelection(runState),
    benchmark: getBenchmarkSummary(benchmark),
    smoke: getSmokeStatus(smoke),
    commit_slices: getCommitSliceSummary(commitSlice),
    recommendation_signals: getRecommendationSignals(recommendation, getLanguageSelection(runState)),
    reproducible_commands: [
      "npm run premerge:checklist",
      "npm run workflow:continue -- --planned-update \"<summary>\"",
      "npm run release:evidence",
      "npm run release:candidate -- --planned-update \"<summary>\""
    ],
    artifacts: {
      run_state: relativePath(defaultPaths.runState),
      validation_report: relativePath(defaultPaths.validation),
      update_scan_report: relativePath(defaultPaths.updateScan),
      separation_report: relativePath(defaultPaths.separation),
      benchmark_report: relativePath(defaultPaths.benchmark),
      smoke_report: relativePath(defaultPaths.smoke),
      final_recommendation: relativePath(defaultPaths.recommendation),
      release_evidence_bundle: relativePath(defaultPaths.releaseEvidence),
      commit_slice_report: relativePath(defaultPaths.commitSlice)
    }
  };

  payload.issues = buildIssues(payload);
  payload.gate_pass = payload.issues.length === 0;

  writeJson(args.outFile, payload);
  process.stdout.write(
    `${JSON.stringify(
      {
        out_file: args.outFile,
        gate_pass: payload.gate_pass,
        issues_count: payload.issues.length,
        primary_language: payload.language.primary_language,
        fallback_language: payload.language.fallback_language,
        benchmark_top: payload.benchmark.top_result,
        commit_multi_match_total: payload.commit_slices.multi_match_total
      },
      null,
      2
    )}\n`
  );

  if (!payload.gate_pass) {
    process.exit(1);
  }
}

try {
  main();
} catch (error) {
  process.stderr.write(`release-candidate-bundle failed: ${error.message}\n`);
  process.exit(1);
}
