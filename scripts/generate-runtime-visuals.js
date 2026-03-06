#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { findProjectRoot } = require("./project-source-resolver");
const { writeTextFileRobust } = require("./lib/robust-file-write");

const DEFAULT_BENCHMARK_FILE = path.join(
  "data",
  "output",
  "databases",
  "polyglot-default",
  "reports",
  "polyglot_runtime_benchmark_report.json"
);
const DEFAULT_SWAP_REPORT_FILE = path.join(
  "data",
  "output",
  "databases",
  "polyglot-default",
  "analysis",
  "script_runtime_swap_report.json"
);
const DEFAULT_EFFICIENCY_REPORT_FILE = path.join(
  "data",
  "output",
  "databases",
  "polyglot-default",
  "analysis",
  "codex_efficiency_report.json"
);
const DEFAULT_DOCS_FRESHNESS_REPORT_FILE = path.join(
  "data",
  "output",
  "databases",
  "polyglot-default",
  "analysis",
  "docs_freshness_report.json"
);
const DEFAULT_HISTORY_FILE = path.join("docs", "visuals", "runtime_trend_history.json");
const DEFAULT_ASSETS_DIR = path.join("docs", "visuals", "assets");
const DEFAULT_DASHBOARD_FILE = path.join("docs", "visuals", "runtime_dashboard.md");
const DEFAULT_SUMMARY_FILE = path.join("docs", "visuals", "runtime_dashboard.json");

function parseArgs(argv) {
  const args = {
    benchmarkFile: DEFAULT_BENCHMARK_FILE,
    swapReportFile: DEFAULT_SWAP_REPORT_FILE,
    efficiencyReportFile: DEFAULT_EFFICIENCY_REPORT_FILE,
    docsFreshnessReportFile: DEFAULT_DOCS_FRESHNESS_REPORT_FILE,
    historyFile: DEFAULT_HISTORY_FILE,
    assetsDir: DEFAULT_ASSETS_DIR,
    dashboardFile: DEFAULT_DASHBOARD_FILE,
    summaryFile: DEFAULT_SUMMARY_FILE
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = String(argv[index] || "").trim();
    if (token === "--benchmark-file" && argv[index + 1]) {
      args.benchmarkFile = String(argv[index + 1] || "").trim();
      index += 1;
      continue;
    }
    if (token === "--swap-report-file" && argv[index + 1]) {
      args.swapReportFile = String(argv[index + 1] || "").trim();
      index += 1;
      continue;
    }
    if (token === "--efficiency-report-file" && argv[index + 1]) {
      args.efficiencyReportFile = String(argv[index + 1] || "").trim();
      index += 1;
      continue;
    }
    if (token === "--docs-freshness-report-file" && argv[index + 1]) {
      args.docsFreshnessReportFile = String(argv[index + 1] || "").trim();
      index += 1;
      continue;
    }
    if (token === "--history-file" && argv[index + 1]) {
      args.historyFile = String(argv[index + 1] || "").trim();
      index += 1;
      continue;
    }
    if (token === "--assets-dir" && argv[index + 1]) {
      args.assetsDir = String(argv[index + 1] || "").trim();
      index += 1;
      continue;
    }
    if (token === "--dashboard-file" && argv[index + 1]) {
      args.dashboardFile = String(argv[index + 1] || "").trim();
      index += 1;
      continue;
    }
    if (token === "--summary-file" && argv[index + 1]) {
      args.summaryFile = String(argv[index + 1] || "").trim();
      index += 1;
      continue;
    }
  }

  return args;
}

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

function number(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function formatMs(value) {
  return `${number(value).toFixed(3)} ms`;
}

function escapeXml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function colorForLanguage(language) {
  const key = String(language || "").toLowerCase();
  if (key === "javascript") {
    return "#d97706";
  }
  if (key === "python") {
    return "#1d4ed8";
  }
  if (key === "cpp") {
    return "#047857";
  }
  return "#4b5563";
}

function computeRanking(benchmarkDoc) {
  if (Array.isArray(benchmarkDoc && benchmarkDoc.ranking) && benchmarkDoc.ranking.length > 0) {
    return benchmarkDoc.ranking
      .map((entry) => ({
        label: String(entry.language || "").trim() || "unknown",
        value: number(entry.total_ms, number(entry.total_ns) / 1e6)
      }))
      .filter((entry) => entry.label)
      .sort((left, right) => left.value - right.value);
  }

  const results = benchmarkDoc && benchmarkDoc.results && typeof benchmarkDoc.results === "object" ? benchmarkDoc.results : {};
  return Object.keys(results)
    .map((language) => ({
      label: language,
      value: number(results[language] && results[language].total_ns) / 1e6
    }))
    .filter((entry) => entry.value > 0)
    .sort((left, right) => left.value - right.value);
}

function computeStageDurations(swapDoc) {
  const stages = Array.isArray(swapDoc && swapDoc.stages) ? swapDoc.stages : [];
  return stages.map((stage, index) => ({
    order: index + 1,
    stage: String(stage.stage || `stage_${index + 1}`),
    duration_ms: number(stage.duration_ms),
    selected_language: String(stage.selected_language || "").trim() || "unknown",
    status_code: number(stage.status_code)
  }));
}

function classifyChangedFile(filePath) {
  const normalized = normalizePath(filePath);
  if (normalized.startsWith("docs/")) return "docs";
  if (normalized.startsWith("scripts/")) return "scripts";
  if (normalized.startsWith("tests/")) return "tests";
  if (normalized.startsWith("app/")) return "app";
  if (normalized.startsWith("renderer/")) return "renderer";
  if (normalized.startsWith("brain/")) return "brain";
  if (normalized.startsWith("main/")) return "main";
  if (normalized.startsWith("data/input/")) return "data_input";
  if (normalized.startsWith("data/output/")) return "data_output";
  if (normalized.startsWith("to-do/")) return "agent_skill_meta";
  if (normalized.startsWith(".github/workflows/")) return "github_workflows";
  return "other";
}

function computeFeatureUpdateCounts(docsFreshnessDoc) {
  const changedFiles = Array.isArray(docsFreshnessDoc && docsFreshnessDoc.changed_files)
    ? docsFreshnessDoc.changed_files
    : [];
  const counts = {};
  changedFiles.forEach((changedFile) => {
    const normalized = normalizePath(changedFile);
    if (!normalized || normalized.startsWith(".vs/")) {
      return;
    }
    const category = classifyChangedFile(normalized);
    counts[category] = number(counts[category]) + 1;
  });
  return Object.keys(counts)
    .map((label) => ({ label, value: number(counts[label]) }))
    .sort((left, right) => right.value - left.value);
}

function buildTokenOptimizationSnapshot(efficiencyDoc) {
  const thresholds = (efficiencyDoc && efficiencyDoc.thresholds) || {};
  const counts = (efficiencyDoc && efficiencyDoc.counts) || {};
  const trend = (efficiencyDoc && efficiencyDoc.trend) || {};
  const maxTotalTokens = number(thresholds.max_total_tokens_estimate);
  const currentTokens = number(counts.total_tokens_estimate);
  const previousTokens = number(trend.total_tokens_previous, currentTokens);
  const deltaTokens = number(trend.total_tokens_delta, currentTokens - previousTokens);
  const deltaPercent = number(trend.total_tokens_delta_percent);
  const headroomTokens = Math.max(0, maxTotalTokens - currentTokens);
  const overBudgetTokens = Math.max(0, currentTokens - maxTotalTokens);
  return {
    current_tokens: currentTokens,
    max_total_tokens: maxTotalTokens,
    previous_tokens: previousTokens,
    delta_tokens: deltaTokens,
    delta_percent: deltaPercent,
    headroom_tokens: headroomTokens,
    over_budget_tokens: overBudgetTokens
  };
}

function dateKeyFromIso(isoValue) {
  const value = String(isoValue || "").trim();
  if (!value) {
    return new Date().toISOString().slice(0, 10);
  }
  return value.slice(0, 10);
}

function toHistoryEntry(record) {
  const date = dateKeyFromIso(record && record.date);
  return {
    date,
    tokens: number(record && record.tokens),
    feature_updates: number(record && record.feature_updates)
  };
}

function buildTrendHistory(historyDoc, currentEntry) {
  const existingEntries = Array.isArray(historyDoc && historyDoc.entries)
    ? historyDoc.entries.map((entry) => toHistoryEntry(entry))
    : [];
  const dedupedByDate = {};
  existingEntries.forEach((entry) => {
    dedupedByDate[entry.date] = entry;
  });
  dedupedByDate[currentEntry.date] = toHistoryEntry(currentEntry);
  const entries = Object.keys(dedupedByDate)
    .sort()
    .map((date) => dedupedByDate[date])
    .slice(-90);
  return {
    schema_version: 1,
    generated_at: new Date().toISOString(),
    entries
  };
}

function buildWeeklyTrendRows(historyDoc) {
  const entries = Array.isArray(historyDoc && historyDoc.entries) ? historyDoc.entries : [];
  return entries
    .map((entry) => toHistoryEntry(entry))
    .sort((left, right) => String(left.date).localeCompare(String(right.date)))
    .slice(-7);
}

function buildHorizontalBarChartSvg(title, subtitle, rows) {
  const width = 1200;
  const rowHeight = 54;
  const chartTop = 120;
  const chartHeight = Math.max(1, rows.length) * rowHeight;
  const height = chartTop + chartHeight + 70;
  const marginLeft = 250;
  const marginRight = 80;
  const barMaxWidth = width - marginLeft - marginRight;
  const maxValue = Math.max(...rows.map((row) => number(row.value)), 1);
  const barWidthFor = (value) => (number(value) / maxValue) * barMaxWidth;
  const parts = [];

  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeXml(
      title
    )}">`
  );
  parts.push(`<rect x="0" y="0" width="${width}" height="${height}" fill="#f8fafc" />`);
  parts.push(`<text x="36" y="54" font-family="Segoe UI, Arial, sans-serif" font-size="34" fill="#0f172a">${escapeXml(title)}</text>`);
  parts.push(`<text x="36" y="88" font-family="Segoe UI, Arial, sans-serif" font-size="18" fill="#334155">${escapeXml(subtitle)}</text>`);

  rows.forEach((row, index) => {
    const y = chartTop + index * rowHeight;
    const barHeight = 32;
    const barY = y;
    const barWidth = Math.max(4, barWidthFor(row.value));
    const color = colorForLanguage(row.label);
    parts.push(`<text x="${marginLeft - 20}" y="${barY + 22}" text-anchor="end" font-family="Segoe UI, Arial, sans-serif" font-size="18" fill="#0f172a">${escapeXml(row.label)}</text>`);
    parts.push(`<rect x="${marginLeft}" y="${barY}" width="${barWidth.toFixed(2)}" height="${barHeight}" rx="6" ry="6" fill="${color}" opacity="0.88" />`);
    parts.push(`<text x="${(marginLeft + barWidth + 12).toFixed(2)}" y="${barY + 22}" font-family="Segoe UI, Arial, sans-serif" font-size="16" fill="#111827">${escapeXml(formatMs(row.value))}</text>`);
  });

  parts.push("</svg>");
  return parts.join("");
}

function buildWeeklyProgressTrendSvg(rows) {
  const trendRows =
    rows.length > 0
      ? rows
      : [{ date: dateKeyFromIso(new Date().toISOString()), tokens: 0, feature_updates: 0 }];
  const width = 1320;
  const height = 560;
  const margin = { left: 90, right: 120, top: 110, bottom: 120 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const maxTokens = Math.max(...trendRows.map((row) => number(row.tokens)), 1);
  const maxFeatures = Math.max(...trendRows.map((row) => number(row.feature_updates)), 1);
  const xFor = (index) =>
    margin.left + (trendRows.length <= 1 ? plotWidth / 2 : (index / (trendRows.length - 1)) * plotWidth);
  const yTokens = (value) => margin.top + plotHeight - (number(value) / maxTokens) * plotHeight;
  const yFeatures = (value) => margin.top + plotHeight - (number(value) / maxFeatures) * plotHeight;
  const tokenPoints = [];
  const featurePoints = [];
  const parts = [];

  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Weekly progress trend for tokens and feature updates">`
  );
  parts.push(`<rect x="0" y="0" width="${width}" height="${height}" fill="#f8fafc" />`);
  parts.push(`<text x="32" y="54" font-family="Segoe UI, Arial, sans-serif" font-size="33" fill="#0f172a">Weekly Progress Trend</text>`);
  parts.push(`<text x="32" y="88" font-family="Segoe UI, Arial, sans-serif" font-size="18" fill="#334155">7-point trend: token total (left axis) and feature-update files (right axis).</text>`);

  parts.push(`<line x1="${margin.left}" y1="${margin.top + plotHeight}" x2="${width - margin.right}" y2="${margin.top + plotHeight}" stroke="#94a3b8" stroke-width="1.4" />`);
  parts.push(`<line x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${margin.top + plotHeight}" stroke="#94a3b8" stroke-width="1.4" />`);
  parts.push(`<line x1="${width - margin.right}" y1="${margin.top}" x2="${width - margin.right}" y2="${margin.top + plotHeight}" stroke="#94a3b8" stroke-width="1.4" />`);
  parts.push(`<text x="${margin.left}" y="${margin.top - 20}" font-family="Segoe UI, Arial, sans-serif" font-size="13" fill="#0ea5e9">Tokens</text>`);
  parts.push(`<text x="${width - margin.right - 58}" y="${margin.top - 20}" font-family="Segoe UI, Arial, sans-serif" font-size="13" fill="#f97316">Feature updates</text>`);

  trendRows.forEach((row, index) => {
    const x = xFor(index);
    const tokenY = yTokens(row.tokens);
    const featureY = yFeatures(row.feature_updates);
    tokenPoints.push(`${x.toFixed(2)},${tokenY.toFixed(2)}`);
    featurePoints.push(`${x.toFixed(2)},${featureY.toFixed(2)}`);
    parts.push(`<text x="${x.toFixed(2)}" y="${(margin.top + plotHeight + 24).toFixed(2)}" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="11" fill="#334155">${escapeXml(String(row.date).slice(5))}</text>`);
    parts.push(`<text x="${(x + 4).toFixed(2)}" y="${(tokenY - 8).toFixed(2)}" font-family="Segoe UI, Arial, sans-serif" font-size="10" fill="#0ea5e9">${escapeXml(String(number(row.tokens)))}</text>`);
    parts.push(`<text x="${(x + 4).toFixed(2)}" y="${(featureY + 14).toFixed(2)}" font-family="Segoe UI, Arial, sans-serif" font-size="10" fill="#f97316">${escapeXml(String(number(row.feature_updates)))}</text>`);
  });

  parts.push(`<polyline points="${tokenPoints.join(" ")}" fill="none" stroke="#0ea5e9" stroke-width="3" />`);
  parts.push(`<polyline points="${featurePoints.join(" ")}" fill="none" stroke="#f97316" stroke-width="3" />`);
  trendRows.forEach((row, index) => {
    const x = xFor(index);
    parts.push(`<circle cx="${x.toFixed(2)}" cy="${yTokens(row.tokens).toFixed(2)}" r="4.2" fill="#0ea5e9" />`);
    parts.push(`<circle cx="${x.toFixed(2)}" cy="${yFeatures(row.feature_updates).toFixed(2)}" r="4.2" fill="#f97316" />`);
  });

  parts.push(`<rect x="36" y="${height - 58}" width="18" height="4" fill="#0ea5e9" />`);
  parts.push(`<text x="60" y="${height - 52}" font-family="Segoe UI, Arial, sans-serif" font-size="13" fill="#334155">tokens</text>`);
  parts.push(`<rect x="132" y="${height - 58}" width="18" height="4" fill="#f97316" />`);
  parts.push(`<text x="156" y="${height - 52}" font-family="Segoe UI, Arial, sans-serif" font-size="13" fill="#334155">feature updates</text>`);

  parts.push("</svg>");
  return parts.join("");
}

function buildFeatureUpdateFootprintSvg(rows) {
  const rankingRows = rows.length > 0 ? rows.slice(0, 10) : [{ label: "no_data", value: 0 }];
  const width = 1200;
  const rowHeight = 50;
  const chartTop = 140;
  const chartHeight = Math.max(1, rankingRows.length) * rowHeight;
  const height = chartTop + chartHeight + 70;
  const marginLeft = 320;
  const marginRight = 60;
  const barMaxWidth = width - marginLeft - marginRight;
  const maxValue = Math.max(...rankingRows.map((row) => number(row.value)), 1);
  const barWidthFor = (value) => (number(value) / maxValue) * barMaxWidth;
  const palette = ["#0ea5e9", "#f59e0b", "#10b981", "#ef4444", "#6366f1", "#14b8a6", "#8b5cf6", "#84cc16", "#f97316", "#3b82f6"];
  const parts = [];

  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Feature update footprint by area">`
  );
  parts.push(`<rect x="0" y="0" width="${width}" height="${height}" fill="#f8fafc" />`);
  parts.push(`<text x="36" y="56" font-family="Segoe UI, Arial, sans-serif" font-size="33" fill="#0f172a">Feature Update Footprint by Area</text>`);
  parts.push(`<text x="36" y="90" font-family="Segoe UI, Arial, sans-serif" font-size="18" fill="#334155">Counts of changed files grouped by repository area (excluding .vs).</text>`);

  rankingRows.forEach((row, index) => {
    const y = chartTop + index * rowHeight;
    const barWidth = Math.max(4, barWidthFor(row.value));
    const color = palette[index % palette.length];
    parts.push(`<text x="${marginLeft - 20}" y="${y + 21}" text-anchor="end" font-family="Segoe UI, Arial, sans-serif" font-size="17" fill="#0f172a">${escapeXml(row.label)}</text>`);
    parts.push(`<rect x="${marginLeft}" y="${y}" width="${barWidth.toFixed(2)}" height="30" rx="5" ry="5" fill="${color}" opacity="0.9" />`);
    parts.push(`<text x="${(marginLeft + barWidth + 10).toFixed(2)}" y="${y + 21}" font-family="Segoe UI, Arial, sans-serif" font-size="16" fill="#111827">${escapeXml(String(number(row.value)))}</text>`);
  });

  parts.push("</svg>");
  return parts.join("");
}

function buildTokenOptimizationProgressSvg(tokenSnapshot) {
  const width = 1200;
  const height = 460;
  const parts = [];
  const budget = Math.max(number(tokenSnapshot.max_total_tokens), 1);
  const current = number(tokenSnapshot.current_tokens);
  const previous = number(tokenSnapshot.previous_tokens);
  const headroom = Math.max(0, budget - current);
  const ratio = Math.min(1, current / budget);
  const barX = 70;
  const barY = 150;
  const barWidth = 1050;
  const barHeight = 56;
  const usedWidth = barWidth * ratio;
  const overBudget = current > budget;
  const usedColor = overBudget ? "#dc2626" : "#0ea5e9";
  const deltaSign = number(tokenSnapshot.delta_tokens) >= 0 ? "+" : "";

  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Token optimization progress">`
  );
  parts.push(`<rect x="0" y="0" width="${width}" height="${height}" fill="#f8fafc" />`);
  parts.push(`<text x="36" y="56" font-family="Segoe UI, Arial, sans-serif" font-size="33" fill="#0f172a">Token Optimization Progress</text>`);
  parts.push(`<text x="36" y="90" font-family="Segoe UI, Arial, sans-serif" font-size="18" fill="#334155">Budget utilization and trend from codex efficiency analysis.</text>`);
  parts.push(`<rect x="${barX}" y="${barY}" width="${barWidth}" height="${barHeight}" fill="#e2e8f0" rx="8" ry="8" />`);
  parts.push(`<rect x="${barX}" y="${barY}" width="${usedWidth.toFixed(2)}" height="${barHeight}" fill="${usedColor}" rx="8" ry="8" />`);
  parts.push(`<text x="${barX}" y="${barY - 12}" font-family="Segoe UI, Arial, sans-serif" font-size="16" fill="#111827">Used: ${current.toLocaleString("en-US")} / Budget: ${budget.toLocaleString("en-US")} tokens</text>`);
  parts.push(`<text x="${barX}" y="${barY + barHeight + 26}" font-family="Segoe UI, Arial, sans-serif" font-size="16" fill="#111827">Headroom: ${headroom.toLocaleString("en-US")} tokens</text>`);
  if (overBudget) {
    parts.push(`<text x="${barX + 280}" y="${barY + barHeight + 26}" font-family="Segoe UI, Arial, sans-serif" font-size="16" fill="#b91c1c">Over budget: ${(current - budget).toLocaleString("en-US")} tokens</text>`);
  }
  parts.push(`<text x="${barX}" y="300" font-family="Segoe UI, Arial, sans-serif" font-size="17" fill="#0f172a">Previous total: ${previous.toLocaleString("en-US")} tokens</text>`);
  parts.push(`<text x="${barX}" y="334" font-family="Segoe UI, Arial, sans-serif" font-size="17" fill="#0f172a">Delta: ${deltaSign}${number(tokenSnapshot.delta_tokens).toLocaleString("en-US")} tokens (${number(tokenSnapshot.delta_percent).toFixed(2)}%)</text>`);
  parts.push(`<text x="${barX}" y="368" font-family="Segoe UI, Arial, sans-serif" font-size="17" fill="#0f172a">Utilization: ${(ratio * 100).toFixed(2)}%</text>`);
  parts.push("</svg>");
  return parts.join("");
}

function buildStageTimelineSvg(stages) {
  const width = 1300;
  const height = 560;
  const margin = {
    left: 90,
    right: 40,
    top: 100,
    bottom: 130
  };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const maxDuration = Math.max(...stages.map((row) => row.duration_ms), 1);
  const cumulative = [];
  let running = 0;
  stages.forEach((stage) => {
    running += number(stage.duration_ms);
    cumulative.push(running);
  });
  const maxCumulative = Math.max(...cumulative, 1);

  const xFor = (index) => margin.left + (stages.length <= 1 ? plotWidth / 2 : (index / (stages.length - 1)) * plotWidth);
  const yDuration = (value) => margin.top + plotHeight - (number(value) / maxDuration) * plotHeight;
  const yCumulative = (value) => margin.top + plotHeight - (number(value) / maxCumulative) * plotHeight;

  const parts = [];
  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Workflow stage duration timeline">`
  );
  parts.push(`<rect x="0" y="0" width="${width}" height="${height}" fill="#f8fafc" />`);
  parts.push(`<text x="32" y="50" font-family="Segoe UI, Arial, sans-serif" font-size="32" fill="#0f172a">Workflow Stage Timeline (Duration + Cumulative)</text>`);
  parts.push(`<text x="32" y="84" font-family="Segoe UI, Arial, sans-serif" font-size="17" fill="#334155">Bars show per-stage duration. Line shows cumulative runtime progression.</text>`);

  parts.push(`<line x1="${margin.left}" y1="${margin.top + plotHeight}" x2="${width - margin.right}" y2="${margin.top + plotHeight}" stroke="#94a3b8" stroke-width="1.3" />`);
  parts.push(`<line x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${margin.top + plotHeight}" stroke="#94a3b8" stroke-width="1.3" />`);

  const points = [];
  stages.forEach((stage, index) => {
    const x = xFor(index);
    const barWidth = Math.max(18, plotWidth / Math.max(stages.length * 1.8, 12));
    const barX = x - barWidth / 2;
    const barY = yDuration(stage.duration_ms);
    const barHeight = margin.top + plotHeight - barY;
    const color = colorForLanguage(stage.selected_language);
    parts.push(`<rect x="${barX.toFixed(2)}" y="${barY.toFixed(2)}" width="${barWidth.toFixed(2)}" height="${barHeight.toFixed(2)}" fill="${color}" opacity="0.75" rx="4" ry="4" />`);
    parts.push(`<text x="${x.toFixed(2)}" y="${(margin.top + plotHeight + 22).toFixed(2)}" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="11" fill="#1f2937">${escapeXml(String(index + 1))}</text>`);
    parts.push(`<text x="${x.toFixed(2)}" y="${(margin.top + plotHeight + 44).toFixed(2)}" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="10" fill="#334155" transform="rotate(25 ${x.toFixed(2)} ${(margin.top + plotHeight + 44).toFixed(2)})">${escapeXml(stage.stage)}</text>`);
    const pointY = yCumulative(cumulative[index]);
    points.push(`${x.toFixed(2)},${pointY.toFixed(2)}`);
    parts.push(`<text x="${(x + 4).toFixed(2)}" y="${(barY - 6).toFixed(2)}" font-family="Segoe UI, Arial, sans-serif" font-size="10" fill="#111827">${escapeXml(stage.duration_ms.toFixed(1))}</text>`);
  });

  parts.push(`<polyline points="${points.join(" ")}" fill="none" stroke="#7c3aed" stroke-width="3" />`);
  stages.forEach((stage, index) => {
    const x = xFor(index);
    const y = yCumulative(cumulative[index]);
    parts.push(`<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="4.5" fill="#7c3aed" />`);
  });

  parts.push(
    `<text x="${margin.left}" y="${margin.top - 20}" font-family="Segoe UI, Arial, sans-serif" font-size="13" fill="#334155">Per-stage and cumulative timing in milliseconds</text>`
  );
  parts.push("</svg>");
  return parts.join("");
}

function buildLanguageCoverageSvg(coverageMap) {
  const entries = Object.keys(coverageMap || {})
    .map((key) => ({
      label: String(key || "").trim(),
      value: number(coverageMap[key])
    }))
    .filter((entry) => entry.label && entry.value >= 0)
    .sort((left, right) => right.value - left.value);

  const width = 900;
  const height = 420;
  const total = Math.max(1, entries.reduce((sum, entry) => sum + entry.value, 0));
  const parts = [];

  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Language selection coverage">`
  );
  parts.push(`<rect x="0" y="0" width="${width}" height="${height}" fill="#f8fafc" />`);
  parts.push(`<text x="28" y="48" font-family="Segoe UI, Arial, sans-serif" font-size="30" fill="#0f172a">Stage Runtime Language Coverage</text>`);
  parts.push(`<text x="28" y="78" font-family="Segoe UI, Arial, sans-serif" font-size="16" fill="#334155">Share of workflow stages selected per runtime language.</text>`);

  const barX = 40;
  const barY = 130;
  const barWidth = 820;
  const barHeight = 44;
  let cursor = barX;
  entries.forEach((entry) => {
    const ratio = entry.value / total;
    const widthSlice = barWidth * ratio;
    const color = colorForLanguage(entry.label);
    parts.push(`<rect x="${cursor.toFixed(2)}" y="${barY}" width="${widthSlice.toFixed(2)}" height="${barHeight}" fill="${color}" />`);
    cursor += widthSlice;
  });
  parts.push(`<rect x="${barX}" y="${barY}" width="${barWidth}" height="${barHeight}" fill="none" stroke="#64748b" stroke-width="1" />`);

  let rowY = 230;
  entries.forEach((entry) => {
    const percent = total > 0 ? (entry.value / total) * 100 : 0;
    const color = colorForLanguage(entry.label);
    parts.push(`<rect x="44" y="${rowY - 16}" width="14" height="14" fill="${color}" rx="2" ry="2" />`);
    parts.push(`<text x="66" y="${rowY - 4}" font-family="Segoe UI, Arial, sans-serif" font-size="17" fill="#111827">${escapeXml(entry.label)}: ${entry.value} stages (${percent.toFixed(1)}%)</text>`);
    rowY += 34;
  });
  parts.push("</svg>");
  return parts.join("");
}

function buildDashboardMarkdown(report) {
  const rankingRows = report.ranking.map((row, index) => `| ${index + 1} | ${row.label} | ${row.value.toFixed(3)} |`).join("\n");
  const stageRows = report.stages
    .map(
      (row) =>
        `| ${row.order} | ${row.stage} | ${row.selected_language} | ${row.duration_ms.toFixed(3)} | ${row.status_code} |`
    )
    .join("\n");
  const coverageRows = report.language_coverage_rows
    .map((row) => `| ${row.label} | ${row.value} |`)
    .join("\n");
  const featureRows = report.feature_update_rows
    .slice(0, 10)
    .map((row, index) => `| ${index + 1} | ${row.label} | ${row.value} |`)
    .join("\n");
  const weeklyRows = report.weekly_trend_rows
    .map((row) => `| ${row.date} | ${number(row.tokens).toLocaleString("en-US")} | ${row.feature_updates} |`)
    .join("\n");
  const lines = [];
  lines.push("# Runtime Visual Dashboard");
  lines.push("");
  lines.push(`- Generated at: ${report.generated_at}`);
  lines.push(`- Benchmark report source: \`${report.sources.benchmark_file}\``);
  lines.push(`- Script swap source: \`${report.sources.swap_report_file}\``);
  lines.push(`- Efficiency source: \`${report.sources.efficiency_report_file}\``);
  lines.push(`- Docs freshness source: \`${report.sources.docs_freshness_report_file}\``);
  lines.push(`- Overall runtime winner: \`${report.overall_winner_language || "unknown"}\``);
  lines.push(`- Workflow stage count: ${report.stages.length}`);
  lines.push(`- Workflow total duration: ${report.total_stage_duration_ms.toFixed(3)} ms`);
  lines.push("");
  lines.push("## Runtime Comparison");
  lines.push("");
  lines.push("![Runtime total ms by language](assets/runtime_language_total_ms.svg)");
  lines.push("");
  lines.push("| Rank | Language | Total Runtime (ms) |");
  lines.push("|---:|---|---:|");
  lines.push(rankingRows || "| 1 | n/a | 0.000 |");
  lines.push("");
  lines.push("## Workflow Timeline");
  lines.push("");
  lines.push("![Workflow stage timeline](assets/workflow_stage_timeline.svg)");
  lines.push("");
  lines.push("| # | Stage | Selected Runtime | Duration (ms) | Status |");
  lines.push("|---:|---|---|---:|---:|");
  lines.push(stageRows || "| 1 | n/a | n/a | 0.000 | 0 |");
  lines.push("");
  lines.push("## Runtime Coverage");
  lines.push("");
  lines.push("![Runtime stage language coverage](assets/runtime_stage_coverage.svg)");
  lines.push("");
  lines.push("| Language | Stage Count |");
  lines.push("|---|---:|");
  lines.push(coverageRows || "| n/a | 0 |");
  lines.push("");
  lines.push("## Token Optimization Progress");
  lines.push("");
  lines.push("![Token optimization progress](assets/token_optimization_progress.svg)");
  lines.push("");
  lines.push(`- Token budget: ${number(report.token_optimization.max_total_tokens).toLocaleString("en-US")}`);
  lines.push(`- Current tokens: ${number(report.token_optimization.current_tokens).toLocaleString("en-US")}`);
  lines.push(`- Headroom tokens: ${number(report.token_optimization.headroom_tokens).toLocaleString("en-US")}`);
  lines.push(
    `- Delta vs previous: ${number(report.token_optimization.delta_tokens).toLocaleString("en-US")} (${number(report.token_optimization.delta_percent).toFixed(2)}%)`
  );
  lines.push("");
  lines.push("## Feature Update Footprint");
  lines.push("");
  lines.push("![Feature update footprint](assets/feature_update_footprint.svg)");
  lines.push("");
  lines.push("| Rank | Area | Changed Files |");
  lines.push("|---:|---|---:|");
  lines.push(featureRows || "| 1 | n/a | 0 |");
  lines.push("");
  lines.push("## Weekly Trend");
  lines.push("");
  lines.push("![Weekly progress trend](assets/weekly_progress_trend.svg)");
  lines.push("");
  lines.push("| Date | Tokens | Feature Updates |");
  lines.push("|---|---:|---:|");
  lines.push(weeklyRows || "| n/a | 0 | 0 |");
  lines.push("");
  lines.push("## Token/Prompt Efficiency Snapshot");
  lines.push("");
  lines.push(
    `- Total tokens estimate: ${number(report.efficiency_snapshot.total_tokens_estimate).toLocaleString("en-US")}`
  );
  lines.push(
    `- Automation active count: ${number(report.efficiency_snapshot.automation_active).toLocaleString("en-US")}`
  );
  lines.push(
    `- Skill prompts scanned: ${number(report.efficiency_snapshot.skill_prompts_scanned).toLocaleString("en-US")}`
  );
  lines.push("");
  lines.push("_This file is generated by `npm run visuals:runtime`._");
  lines.push("");
  return lines.join("\n");
}

function generate(root, args = {}) {
  const benchmarkFile = path.resolve(root, args.benchmarkFile || DEFAULT_BENCHMARK_FILE);
  const swapReportFile = path.resolve(root, args.swapReportFile || DEFAULT_SWAP_REPORT_FILE);
  const efficiencyReportFile = path.resolve(root, args.efficiencyReportFile || DEFAULT_EFFICIENCY_REPORT_FILE);
  const docsFreshnessReportFile = path.resolve(
    root,
    args.docsFreshnessReportFile || DEFAULT_DOCS_FRESHNESS_REPORT_FILE
  );
  const historyFile = path.resolve(root, args.historyFile || DEFAULT_HISTORY_FILE);
  const assetsDir = path.resolve(root, args.assetsDir || DEFAULT_ASSETS_DIR);
  const dashboardFile = path.resolve(root, args.dashboardFile || DEFAULT_DASHBOARD_FILE);
  const summaryFile = path.resolve(root, args.summaryFile || DEFAULT_SUMMARY_FILE);

  const benchmarkDoc = readJsonIfExists(benchmarkFile);
  const swapDoc = readJsonIfExists(swapReportFile);
  const efficiencyDoc = readJsonIfExists(efficiencyReportFile);
  const docsFreshnessDoc = readJsonIfExists(docsFreshnessReportFile);
  const historyDoc = readJsonIfExists(historyFile);

  const ranking = computeRanking(benchmarkDoc);
  const stages = computeStageDurations(swapDoc);
  const coverageMap =
    swapDoc && swapDoc.metrics && typeof swapDoc.metrics.selected_language_coverage === "object"
      ? swapDoc.metrics.selected_language_coverage
      : {};
  const coverageRows = Object.keys(coverageMap)
    .map((key) => ({
      label: String(key || "").trim(),
      value: number(coverageMap[key])
    }))
    .filter((entry) => entry.label)
    .sort((left, right) => right.value - left.value);

  const winner =
    (benchmarkDoc && benchmarkDoc.winner_mapping && benchmarkDoc.winner_mapping.overall_winner_language) ||
    (ranking[0] && ranking[0].label) ||
    "";
  const totalStageDurationMs = stages.reduce((sum, stage) => sum + number(stage.duration_ms), 0);
  const featureUpdateRows = computeFeatureUpdateCounts(docsFreshnessDoc);
  const tokenOptimization = buildTokenOptimizationSnapshot(efficiencyDoc);
  const generatedAt = new Date().toISOString();
  const totalFeatureUpdates = featureUpdateRows.reduce((sum, row) => sum + number(row.value), 0);
  const nextHistory = buildTrendHistory(historyDoc, {
    date: dateKeyFromIso(generatedAt),
    tokens: tokenOptimization.current_tokens,
    feature_updates: totalFeatureUpdates
  });
  const weeklyTrendRows = buildWeeklyTrendRows(nextHistory);

  const runtimeLanguageSvg = buildHorizontalBarChartSvg(
    "Runtime Comparison by Language",
    "Lower total runtime is better (derived from benchmark report totals).",
    ranking.length > 0 ? ranking : [{ label: "no-data", value: 0 }]
  );
  const timelineSvg = buildStageTimelineSvg(stages.length > 0 ? stages : [{ stage: "no_data", duration_ms: 0, selected_language: "unknown", order: 1, status_code: 0 }]);
  const coverageSvg = buildLanguageCoverageSvg(coverageMap);
  const tokenOptimizationSvg = buildTokenOptimizationProgressSvg(tokenOptimization);
  const featureUpdateSvg = buildFeatureUpdateFootprintSvg(featureUpdateRows);
  const weeklyTrendSvg = buildWeeklyProgressTrendSvg(weeklyTrendRows);

  const runtimeLanguageSvgPath = path.resolve(assetsDir, "runtime_language_total_ms.svg");
  const workflowTimelineSvgPath = path.resolve(assetsDir, "workflow_stage_timeline.svg");
  const runtimeCoverageSvgPath = path.resolve(assetsDir, "runtime_stage_coverage.svg");
  const tokenOptimizationSvgPath = path.resolve(assetsDir, "token_optimization_progress.svg");
  const featureUpdateSvgPath = path.resolve(assetsDir, "feature_update_footprint.svg");
  const weeklyTrendSvgPath = path.resolve(assetsDir, "weekly_progress_trend.svg");

  writeTextFileRobust(runtimeLanguageSvgPath, runtimeLanguageSvg);
  writeTextFileRobust(workflowTimelineSvgPath, timelineSvg);
  writeTextFileRobust(runtimeCoverageSvgPath, coverageSvg);
  writeTextFileRobust(tokenOptimizationSvgPath, tokenOptimizationSvg);
  writeTextFileRobust(featureUpdateSvgPath, featureUpdateSvg);
  writeTextFileRobust(weeklyTrendSvgPath, weeklyTrendSvg);
  writeTextFileRobust(historyFile, `${JSON.stringify(nextHistory, null, 2)}\n`);

  const report = {
    schema_version: 1,
    report_id: "aio_runtime_visual_dashboard",
    generated_at: generatedAt,
    root: normalizePath(root),
    sources: {
      benchmark_file: normalizePath(path.relative(root, benchmarkFile)),
      swap_report_file: normalizePath(path.relative(root, swapReportFile)),
      efficiency_report_file: normalizePath(path.relative(root, efficiencyReportFile)),
      docs_freshness_report_file: normalizePath(path.relative(root, docsFreshnessReportFile)),
      history_file: normalizePath(path.relative(root, historyFile))
    },
    outputs: {
      dashboard_file: normalizePath(path.relative(root, dashboardFile)),
      summary_file: normalizePath(path.relative(root, summaryFile)),
      assets: {
        runtime_language_total_ms: normalizePath(path.relative(root, runtimeLanguageSvgPath)),
        workflow_stage_timeline: normalizePath(path.relative(root, workflowTimelineSvgPath)),
        runtime_stage_coverage: normalizePath(path.relative(root, runtimeCoverageSvgPath)),
        token_optimization_progress: normalizePath(path.relative(root, tokenOptimizationSvgPath)),
        feature_update_footprint: normalizePath(path.relative(root, featureUpdateSvgPath)),
        weekly_progress_trend: normalizePath(path.relative(root, weeklyTrendSvgPath))
      }
    },
    ranking,
    stages,
    overall_winner_language: winner,
    total_stage_duration_ms: totalStageDurationMs,
    language_coverage_rows: coverageRows,
    feature_update_rows: featureUpdateRows,
    weekly_trend_rows: weeklyTrendRows,
    token_optimization: tokenOptimization,
    efficiency_snapshot: {
      total_tokens_estimate: number(efficiencyDoc && efficiencyDoc.counts && efficiencyDoc.counts.total_tokens_estimate),
      automation_active: number(efficiencyDoc && efficiencyDoc.automation && efficiencyDoc.automation.active),
      skill_prompts_scanned: number(efficiencyDoc && efficiencyDoc.counts && efficiencyDoc.counts.skill_prompts_scanned)
    }
  };

  writeTextFileRobust(dashboardFile, buildDashboardMarkdown(report));
  writeTextFileRobust(summaryFile, `${JSON.stringify(report, null, 2)}\n`);

  return {
    status: "pass",
    generated_at: report.generated_at,
    dashboard_file: report.outputs.dashboard_file,
    summary_file: report.outputs.summary_file,
    assets: report.outputs.assets,
    overall_winner_language: report.overall_winner_language
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
    process.stderr.write(`generate-runtime-visuals failed: ${error.message}\n`);
    process.exit(1);
  }
}

module.exports = {
  DEFAULT_ASSETS_DIR,
  DEFAULT_BENCHMARK_FILE,
  DEFAULT_DASHBOARD_FILE,
  DEFAULT_DOCS_FRESHNESS_REPORT_FILE,
  DEFAULT_EFFICIENCY_REPORT_FILE,
  DEFAULT_HISTORY_FILE,
  DEFAULT_SUMMARY_FILE,
  DEFAULT_SWAP_REPORT_FILE,
  computeRanking,
  computeFeatureUpdateCounts,
  computeStageDurations,
  generate
};
