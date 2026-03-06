"use strict";

const fs = require("fs");
const path = require("path");
const { writeTextFileRobust } = require("./robust-file-write");

const DEFAULT_DECISION_CHANGELOG_FILE = path.join("docs", "changelog", "decisions.md");
const DEFAULT_MIGRATION_REPORT_FILE = path.join(
  "data",
  "output",
  "databases",
  "polyglot-default",
  "analysis",
  "script_runtime_migration_report.json"
);
const DEFAULT_BENCHMARK_REPORT_FILE = path.join(
  "data",
  "output",
  "databases",
  "polyglot-default",
  "reports",
  "polyglot_runtime_benchmark_report.json"
);
const DEFAULT_GOVERNANCE_REPORT_FILE = path.join(
  "data",
  "output",
  "databases",
  "polyglot-default",
  "reports",
  "local-governance",
  "local_governance_report.json"
);
const GENERATED_START_MARKER = "<!-- GENERATED STATUS SNAPSHOT START -->";
const GENERATED_END_MARKER = "<!-- GENERATED STATUS SNAPSHOT END -->";

function normalizePath(value) {
  return String(value || "").replace(/\\/g, "/");
}

function readJsonIfExists(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return {};
  }
}

function resolveOverallWinner(benchmarkDoc) {
  const winner =
    benchmarkDoc &&
    benchmarkDoc.winner_mapping &&
    typeof benchmarkDoc.winner_mapping === "object"
      ? String(benchmarkDoc.winner_mapping.overall_winner_language || "").trim()
      : "";
  if (winner) {
    return winner;
  }
  const ranking = Array.isArray(benchmarkDoc && benchmarkDoc.ranking) ? benchmarkDoc.ranking : [];
  for (const row of ranking) {
    const label = String((row && (row.language || row.label)) || "").trim();
    if (label) {
      return label;
    }
  }
  return "";
}

function resolveMeasuredLanguages(benchmarkDoc) {
  const ranking = Array.isArray(benchmarkDoc && benchmarkDoc.ranking) ? benchmarkDoc.ranking : [];
  const rankingLabels = ranking
    .map((row) => String((row && (row.language || row.label)) || "").trim())
    .filter(Boolean);
  if (rankingLabels.length > 0) {
    return rankingLabels;
  }
  const results = benchmarkDoc && benchmarkDoc.results && typeof benchmarkDoc.results === "object" ? benchmarkDoc.results : {};
  return Object.keys(results).filter(Boolean);
}

function buildGeneratedBlock(report) {
  const migrationMetrics = report.migration_metrics || {};
  const governanceMetrics = report.governance_metrics || {};
  const measuredLanguages = Array.isArray(report.measured_languages) ? report.measured_languages : [];
  const languageSuffix = measuredLanguages.length > 0 ? ` (${measuredLanguages.join(", ")})` : "";
  return [
    GENERATED_START_MARKER,
    "### Generated Status Snapshot",
    "",
    `- Script-runtime migration: ${Number(migrationMetrics.python_native_implementation_count || 0)} Python-native implementations, ${Number(migrationMetrics.cpp_native_dispatch_count || 0)} C++ direct dispatch entrypoints, ${Number(migrationMetrics.cpp_python_native_direct_count || 0)} C++ direct-native dispatches, ${Number(migrationMetrics.cpp_python_wrapper_delegate_count || 0)} C++ wrapper delegates, and ${Number(migrationMetrics.direct_node_package_script_count || 0)} direct \`node scripts/...\` package scripts.`,
    `- Runtime benchmark winner: \`${report.overall_winner_language || "unknown"}\`${languageSuffix}.`,
    `- Local governance: \`${String(report.governance_status || "unknown").toUpperCase()}\` (${Number(governanceMetrics.passed || 0)}/${Number(governanceMetrics.task_count || 0)} tasks).`,
    "- Documentation suite refresh keeps these artifacts in the governed docs lane:",
    "- `docs/reference/file_catalog.md`",
    "- `docs/reference/script_runtime_migration.md`",
    "- `docs/visuals/runtime_dashboard.md`",
    GENERATED_END_MARKER
  ].join("\n");
}

function stripGeneratedBlock(sectionBody) {
  const escapedStart = GENERATED_START_MARKER.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const escapedEnd = GENERATED_END_MARKER.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const blockPattern = new RegExp(`${escapedStart}[\\s\\S]*?${escapedEnd}\\n?`, "m");
  return String(sectionBody || "").replace(blockPattern, "").trimEnd();
}

function upsertTodaySection(content, dateKey, generatedBlock) {
  const sectionPattern = new RegExp(`(^## ${dateKey}\\n)([\\s\\S]*?)(?=^## \\d{4}-\\d{2}-\\d{2}\\n|\\Z)`, "m");
  const match = sectionPattern.exec(content);
  if (match) {
    const body = stripGeneratedBlock(match[2]);
    const rebuiltBody = body ? `${body}\n\n${generatedBlock}\n` : `${generatedBlock}\n`;
    return `${content.slice(0, match.index + match[1].length)}${rebuiltBody}${content.slice(match.index + match[0].length)}`;
  }

  if (content.startsWith("# Decision Changelog")) {
    const headingMatch = /^# Decision Changelog\s*\n\n?/.exec(content);
    if (headingMatch) {
      const insertion = `## ${dateKey}\n\n${generatedBlock}\n\n`;
      return `${content.slice(0, headingMatch[0].length)}${insertion}${content.slice(headingMatch[0].length)}`;
    }
  }
  if (String(content || "").trim()) {
    return `# Decision Changelog\n\n## ${dateKey}\n\n${generatedBlock}\n\n${String(content).trim()}\n`;
  }
  return `# Decision Changelog\n\n## ${dateKey}\n\n${generatedBlock}\n`;
}

function generate(root, args = {}) {
  const migrationReportFile = path.resolve(root, args.migrationReportFile || DEFAULT_MIGRATION_REPORT_FILE);
  const benchmarkReportFile = path.resolve(root, args.benchmarkReportFile || DEFAULT_BENCHMARK_REPORT_FILE);
  const governanceReportFile = path.resolve(root, args.governanceReportFile || DEFAULT_GOVERNANCE_REPORT_FILE);
  const decisionChangelogFile = path.resolve(root, args.decisionChangelogFile || DEFAULT_DECISION_CHANGELOG_FILE);

  const migrationDoc = readJsonIfExists(migrationReportFile);
  const benchmarkDoc = readJsonIfExists(benchmarkReportFile);
  const governanceDoc = readJsonIfExists(governanceReportFile);

  const report = {
    generated_at: new Date().toISOString(),
    migration_metrics: migrationDoc.metrics || {},
    overall_winner_language: resolveOverallWinner(benchmarkDoc),
    measured_languages: resolveMeasuredLanguages(benchmarkDoc),
    governance_status: String(governanceDoc.status || "").trim() || "unknown",
    governance_metrics: governanceDoc.metrics || {}
  };

  const content = fs.existsSync(decisionChangelogFile) ? fs.readFileSync(decisionChangelogFile, "utf8") : "";
  const dateKey = report.generated_at.slice(0, 10);
  const nextContent = upsertTodaySection(content, dateKey, buildGeneratedBlock(report));
  writeTextFileRobust(decisionChangelogFile, `${nextContent.trimEnd()}\n`);

  return {
    status: "pass",
    generated_at: report.generated_at,
    markdown_file: normalizePath(path.relative(root, decisionChangelogFile)),
    date: dateKey,
    overall_winner_language: report.overall_winner_language,
    governance_status: report.governance_status
  };
}

module.exports = {
  DEFAULT_BENCHMARK_REPORT_FILE,
  DEFAULT_DECISION_CHANGELOG_FILE,
  DEFAULT_GOVERNANCE_REPORT_FILE,
  DEFAULT_MIGRATION_REPORT_FILE,
  generate
};
