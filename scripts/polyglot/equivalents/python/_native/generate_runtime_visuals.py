#!/usr/bin/env python3
"""Native Python implementation for scripts/generate-runtime-visuals.js."""

from __future__ import annotations

import json
import pathlib
import sys

from _common import find_repo_root, load_json, normalize_path, write_text_file_robust

DEFAULT_BENCHMARK_FILE = pathlib.PurePosixPath("data/output/databases/polyglot-default/reports/polyglot_runtime_benchmark_report.json")
DEFAULT_SWAP_REPORT_FILE = pathlib.PurePosixPath("data/output/databases/polyglot-default/analysis/script_runtime_swap_report.json")
DEFAULT_EFFICIENCY_REPORT_FILE = pathlib.PurePosixPath("data/output/databases/polyglot-default/analysis/codex_efficiency_report.json")
DEFAULT_DOCS_FRESHNESS_REPORT_FILE = pathlib.PurePosixPath("data/output/databases/polyglot-default/analysis/docs_freshness_report.json")
DEFAULT_HISTORY_FILE = pathlib.PurePosixPath("docs/visuals/runtime_trend_history.json")
DEFAULT_ASSETS_DIR = pathlib.PurePosixPath("docs/visuals/assets")
DEFAULT_DASHBOARD_FILE = pathlib.PurePosixPath("docs/visuals/runtime_dashboard.md")
DEFAULT_SUMMARY_FILE = pathlib.PurePosixPath("docs/visuals/runtime_dashboard.json")


def parse_args(argv: list[str]) -> dict:
    args = {
        "benchmark_file": str(DEFAULT_BENCHMARK_FILE),
        "swap_report_file": str(DEFAULT_SWAP_REPORT_FILE),
        "efficiency_report_file": str(DEFAULT_EFFICIENCY_REPORT_FILE),
        "docs_freshness_report_file": str(DEFAULT_DOCS_FRESHNESS_REPORT_FILE),
        "history_file": str(DEFAULT_HISTORY_FILE),
        "assets_dir": str(DEFAULT_ASSETS_DIR),
        "dashboard_file": str(DEFAULT_DASHBOARD_FILE),
        "summary_file": str(DEFAULT_SUMMARY_FILE),
    }
    index = 0
    while index < len(argv):
        token = str(argv[index] or "").strip()
        if token == "--benchmark-file" and index + 1 < len(argv):
            args["benchmark_file"] = str(argv[index + 1] or "").strip()
            index += 2
            continue
        if token == "--swap-report-file" and index + 1 < len(argv):
            args["swap_report_file"] = str(argv[index + 1] or "").strip()
            index += 2
            continue
        if token == "--efficiency-report-file" and index + 1 < len(argv):
            args["efficiency_report_file"] = str(argv[index + 1] or "").strip()
            index += 2
            continue
        if token == "--docs-freshness-report-file" and index + 1 < len(argv):
            args["docs_freshness_report_file"] = str(argv[index + 1] or "").strip()
            index += 2
            continue
        if token == "--history-file" and index + 1 < len(argv):
            args["history_file"] = str(argv[index + 1] or "").strip()
            index += 2
            continue
        if token == "--assets-dir" and index + 1 < len(argv):
            args["assets_dir"] = str(argv[index + 1] or "").strip()
            index += 2
            continue
        if token == "--dashboard-file" and index + 1 < len(argv):
            args["dashboard_file"] = str(argv[index + 1] or "").strip()
            index += 2
            continue
        if token == "--summary-file" and index + 1 < len(argv):
            args["summary_file"] = str(argv[index + 1] or "").strip()
            index += 2
            continue
        index += 1
    return args


def number(value: object, fallback: float = 0.0) -> float:
    try:
        numeric = float(value)
    except Exception:
        return float(fallback)
    return numeric if numeric == numeric else float(fallback)


def format_ms(value: object) -> str:
    return f"{number(value):.3f} ms"


def escape_xml(value: object) -> str:
    return (
        str(value or "")
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
        .replace("'", "&apos;")
    )


def color_for_language(language: object) -> str:
    key = str(language or "").lower()
    if key == "javascript":
        return "#d97706"
    if key == "python":
        return "#1d4ed8"
    if key == "cpp":
        return "#047857"
    return "#4b5563"


def compute_ranking(benchmark_doc: dict) -> list[dict]:
    ranking = benchmark_doc.get("ranking")
    if isinstance(ranking, list) and ranking:
        rows = []
        for entry in ranking:
            if not isinstance(entry, dict):
                continue
            label = str(entry.get("language", "")).strip() or "unknown"
            value = number(entry.get("total_ms"), number(entry.get("total_ns")) / 1_000_000.0)
            rows.append({"label": label, "value": value})
        return sorted(rows, key=lambda row: float(row["value"]))

    results = benchmark_doc.get("results") if isinstance(benchmark_doc.get("results"), dict) else {}
    rows = []
    for language, result in results.items():
        total_ns = number(result.get("total_ns") if isinstance(result, dict) else 0.0)
        if total_ns <= 0:
            continue
        rows.append({"label": str(language or ""), "value": total_ns / 1_000_000.0})
    return sorted(rows, key=lambda row: float(row["value"]))


def compute_stage_durations(swap_doc: dict) -> list[dict]:
    stages = swap_doc.get("stages") if isinstance(swap_doc.get("stages"), list) else []
    rows = []
    for index, stage in enumerate(stages, start=1):
        item = stage if isinstance(stage, dict) else {}
        rows.append(
            {
                "order": index,
                "stage": str(item.get("stage", f"stage_{index}")),
                "duration_ms": number(item.get("duration_ms")),
                "selected_language": str(item.get("selected_language", "")).strip() or "unknown",
                "status_code": int(number(item.get("status_code"))),
            }
        )
    return rows


def classify_changed_file(file_path: object) -> str:
    normalized = normalize_path(file_path)
    if normalized.startswith("docs/"):
        return "docs"
    if normalized.startswith("scripts/"):
        return "scripts"
    if normalized.startswith("tests/"):
        return "tests"
    if normalized.startswith("app/"):
        return "app"
    if normalized.startswith("renderer/"):
        return "renderer"
    if normalized.startswith("brain/"):
        return "brain"
    if normalized.startswith("main/"):
        return "main"
    if normalized.startswith("data/input/"):
        return "data_input"
    if normalized.startswith("data/output/"):
        return "data_output"
    if normalized.startswith("to-do/"):
        return "agent_skill_meta"
    if normalized.startswith(".github/workflows/"):
        return "github_workflows"
    return "other"


def compute_feature_update_counts(docs_freshness_doc: dict) -> list[dict]:
    changed_files = docs_freshness_doc.get("changed_files") if isinstance(docs_freshness_doc.get("changed_files"), list) else []
    counts: dict[str, int] = {}
    for changed_file in changed_files:
        normalized = normalize_path(changed_file)
        if not normalized or normalized.startswith(".vs/"):
            continue
        category = classify_changed_file(normalized)
        counts[category] = int(counts.get(category, 0)) + 1
    return sorted(
        [{"label": key, "value": value} for key, value in counts.items()],
        key=lambda row: (-int(row["value"]), str(row["label"])),
    )


def build_token_optimization_snapshot(efficiency_doc: dict) -> dict:
    thresholds = efficiency_doc.get("thresholds") if isinstance(efficiency_doc.get("thresholds"), dict) else {}
    counts = efficiency_doc.get("counts") if isinstance(efficiency_doc.get("counts"), dict) else {}
    trend = efficiency_doc.get("trend") if isinstance(efficiency_doc.get("trend"), dict) else {}
    max_total_tokens = number(thresholds.get("max_total_tokens_estimate"))
    current_tokens = number(counts.get("total_tokens_estimate"))
    previous_tokens = number(trend.get("total_tokens_previous"), current_tokens)
    delta_tokens = number(trend.get("total_tokens_delta"), current_tokens - previous_tokens)
    delta_percent = number(trend.get("total_tokens_delta_percent"))
    headroom_tokens = max(0.0, max_total_tokens - current_tokens)
    over_budget_tokens = max(0.0, current_tokens - max_total_tokens)
    return {
        "current_tokens": current_tokens,
        "max_total_tokens": max_total_tokens,
        "previous_tokens": previous_tokens,
        "delta_tokens": delta_tokens,
        "delta_percent": delta_percent,
        "headroom_tokens": headroom_tokens,
        "over_budget_tokens": over_budget_tokens,
    }


def date_key_from_iso(iso_value: object) -> str:
    value = str(iso_value or "").strip()
    if not value:
        return __import__("datetime").datetime.utcnow().isoformat()[:10]
    return value[:10]


def to_history_entry(record: dict) -> dict:
    return {
        "date": date_key_from_iso(record.get("date") if isinstance(record, dict) else ""),
        "tokens": number(record.get("tokens") if isinstance(record, dict) else 0.0),
        "feature_updates": number(record.get("feature_updates") if isinstance(record, dict) else 0.0),
    }


def build_trend_history(history_doc: dict, current_entry: dict) -> dict:
    existing_entries = history_doc.get("entries") if isinstance(history_doc.get("entries"), list) else []
    deduped_by_date = {}
    for entry in existing_entries:
        row = to_history_entry(entry if isinstance(entry, dict) else {})
        deduped_by_date[row["date"]] = row
    current_row = to_history_entry(current_entry)
    deduped_by_date[current_row["date"]] = current_row
    entries = [deduped_by_date[date] for date in sorted(deduped_by_date.keys())][-90:]
    return {
        "schema_version": 1,
        "generated_at": __import__("datetime").datetime.utcnow().isoformat() + "Z",
        "entries": entries,
    }


def build_weekly_trend_rows(history_doc: dict) -> list[dict]:
    entries = history_doc.get("entries") if isinstance(history_doc.get("entries"), list) else []
    rows = [to_history_entry(entry if isinstance(entry, dict) else {}) for entry in entries]
    return sorted(rows, key=lambda row: str(row["date"]))[-7:]


def build_horizontal_bar_chart_svg(title: str, subtitle: str, rows: list[dict]) -> str:
    width = 1200
    row_height = 54
    chart_top = 120
    chart_height = max(1, len(rows)) * row_height
    height = chart_top + chart_height + 70
    margin_left = 250
    margin_right = 80
    bar_max_width = width - margin_left - margin_right
    max_value = max([number(row.get("value")) for row in rows] + [1.0])
    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" role="img" aria-label="{escape_xml(title)}">',
        f'<rect x="0" y="0" width="{width}" height="{height}" fill="#f8fafc" />',
        f'<text x="36" y="54" font-family="Segoe UI, Arial, sans-serif" font-size="34" fill="#0f172a">{escape_xml(title)}</text>',
        f'<text x="36" y="88" font-family="Segoe UI, Arial, sans-serif" font-size="18" fill="#334155">{escape_xml(subtitle)}</text>',
    ]
    for index, row in enumerate(rows):
        y = chart_top + index * row_height
        bar_width = max(4.0, (number(row.get("value")) / max_value) * bar_max_width)
        label = str(row.get("label", ""))
        parts.extend(
            [
                f'<text x="{margin_left - 20}" y="{y + 22}" text-anchor="end" font-family="Segoe UI, Arial, sans-serif" font-size="18" fill="#0f172a">{escape_xml(label)}</text>',
                f'<rect x="{margin_left}" y="{y}" width="{bar_width:.2f}" height="32" rx="6" ry="6" fill="{color_for_language(label)}" opacity="0.88" />',
                f'<text x="{margin_left + bar_width + 12:.2f}" y="{y + 22}" font-family="Segoe UI, Arial, sans-serif" font-size="16" fill="#111827">{escape_xml(format_ms(row.get("value")))}</text>',
            ]
        )
    parts.append("</svg>")
    return "".join(parts)


def build_weekly_progress_trend_svg(rows: list[dict]) -> str:
    trend_rows = rows if rows else [{"date": date_key_from_iso(""), "tokens": 0.0, "feature_updates": 0.0}]
    width = 1320
    height = 560
    margin = {"left": 90, "right": 120, "top": 110, "bottom": 120}
    plot_width = width - margin["left"] - margin["right"]
    plot_height = height - margin["top"] - margin["bottom"]
    max_tokens = max([number(row.get("tokens")) for row in trend_rows] + [1.0])
    max_features = max([number(row.get("feature_updates")) for row in trend_rows] + [1.0])
    token_points = []
    feature_points = []
    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" role="img" aria-label="Weekly progress trend for tokens and feature updates">',
        f'<rect x="0" y="0" width="{width}" height="{height}" fill="#f8fafc" />',
        '<text x="32" y="54" font-family="Segoe UI, Arial, sans-serif" font-size="33" fill="#0f172a">Weekly Progress Trend</text>',
        '<text x="32" y="88" font-family="Segoe UI, Arial, sans-serif" font-size="18" fill="#334155">7-point trend: token total (left axis) and feature-update files (right axis).</text>',
        f'<line x1="{margin["left"]}" y1="{margin["top"] + plot_height}" x2="{width - margin["right"]}" y2="{margin["top"] + plot_height}" stroke="#94a3b8" stroke-width="1.4" />',
        f'<line x1="{margin["left"]}" y1="{margin["top"]}" x2="{margin["left"]}" y2="{margin["top"] + plot_height}" stroke="#94a3b8" stroke-width="1.4" />',
        f'<line x1="{width - margin["right"]}" y1="{margin["top"]}" x2="{width - margin["right"]}" y2="{margin["top"] + plot_height}" stroke="#94a3b8" stroke-width="1.4" />',
        f'<text x="{margin["left"]}" y="{margin["top"] - 20}" font-family="Segoe UI, Arial, sans-serif" font-size="13" fill="#0ea5e9">Tokens</text>',
        f'<text x="{width - margin["right"] - 58}" y="{margin["top"] - 20}" font-family="Segoe UI, Arial, sans-serif" font-size="13" fill="#f97316">Feature updates</text>',
    ]
    for index, row in enumerate(trend_rows):
        x_value = margin["left"] + (plot_width / 2.0 if len(trend_rows) <= 1 else (index / float(len(trend_rows) - 1)) * plot_width)
        token_y = margin["top"] + plot_height - (number(row.get("tokens")) / max_tokens) * plot_height
        feature_y = margin["top"] + plot_height - (number(row.get("feature_updates")) / max_features) * plot_height
        token_points.append(f"{x_value:.2f},{token_y:.2f}")
        feature_points.append(f"{x_value:.2f},{feature_y:.2f}")
        parts.extend(
            [
                f'<text x="{x_value:.2f}" y="{margin["top"] + plot_height + 24:.2f}" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="11" fill="#334155">{escape_xml(str(row.get("date", ""))[5:])}</text>',
                f'<text x="{x_value + 4:.2f}" y="{token_y - 8:.2f}" font-family="Segoe UI, Arial, sans-serif" font-size="10" fill="#0ea5e9">{escape_xml(str(int(number(row.get("tokens")))))}</text>',
                f'<text x="{x_value + 4:.2f}" y="{feature_y + 14:.2f}" font-family="Segoe UI, Arial, sans-serif" font-size="10" fill="#f97316">{escape_xml(str(int(number(row.get("feature_updates")))))}</text>',
            ]
        )
    parts.extend(
        [
            f'<polyline points="{" ".join(token_points)}" fill="none" stroke="#0ea5e9" stroke-width="3" />',
            f'<polyline points="{" ".join(feature_points)}" fill="none" stroke="#f97316" stroke-width="3" />',
        ]
    )
    for index, row in enumerate(trend_rows):
        x_value = margin["left"] + (plot_width / 2.0 if len(trend_rows) <= 1 else (index / float(len(trend_rows) - 1)) * plot_width)
        token_y = margin["top"] + plot_height - (number(row.get("tokens")) / max_tokens) * plot_height
        feature_y = margin["top"] + plot_height - (number(row.get("feature_updates")) / max_features) * plot_height
        parts.extend(
            [
                f'<circle cx="{x_value:.2f}" cy="{token_y:.2f}" r="4.2" fill="#0ea5e9" />',
                f'<circle cx="{x_value:.2f}" cy="{feature_y:.2f}" r="4.2" fill="#f97316" />',
            ]
        )
    parts.extend(
        [
            f'<rect x="36" y="{height - 58}" width="18" height="4" fill="#0ea5e9" />',
            f'<text x="60" y="{height - 52}" font-family="Segoe UI, Arial, sans-serif" font-size="13" fill="#334155">tokens</text>',
            f'<rect x="132" y="{height - 58}" width="18" height="4" fill="#f97316" />',
            f'<text x="156" y="{height - 52}" font-family="Segoe UI, Arial, sans-serif" font-size="13" fill="#334155">feature updates</text>',
            "</svg>",
        ]
    )
    return "".join(parts)


def build_feature_update_footprint_svg(rows: list[dict]) -> str:
    ranking_rows = rows[:10] if rows else [{"label": "no_data", "value": 0.0}]
    width = 1200
    row_height = 50
    chart_top = 140
    chart_height = max(1, len(ranking_rows)) * row_height
    height = chart_top + chart_height + 70
    margin_left = 320
    margin_right = 60
    bar_max_width = width - margin_left - margin_right
    max_value = max([number(row.get("value")) for row in ranking_rows] + [1.0])
    palette = ["#0ea5e9", "#f59e0b", "#10b981", "#ef4444", "#6366f1", "#14b8a6", "#8b5cf6", "#84cc16", "#f97316", "#3b82f6"]
    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" role="img" aria-label="Feature update footprint by area">',
        f'<rect x="0" y="0" width="{width}" height="{height}" fill="#f8fafc" />',
        '<text x="36" y="56" font-family="Segoe UI, Arial, sans-serif" font-size="33" fill="#0f172a">Feature Update Footprint by Area</text>',
        '<text x="36" y="90" font-family="Segoe UI, Arial, sans-serif" font-size="18" fill="#334155">Counts of changed files grouped by repository area (excluding .vs).</text>',
    ]
    for index, row in enumerate(ranking_rows):
        y = chart_top + index * row_height
        bar_width = max(4.0, (number(row.get("value")) / max_value) * bar_max_width)
        color = palette[index % len(palette)]
        parts.extend(
            [
                f'<text x="{margin_left - 20}" y="{y + 21}" text-anchor="end" font-family="Segoe UI, Arial, sans-serif" font-size="17" fill="#0f172a">{escape_xml(row.get("label"))}</text>',
                f'<rect x="{margin_left}" y="{y}" width="{bar_width:.2f}" height="30" rx="5" ry="5" fill="{color}" opacity="0.9" />',
                f'<text x="{margin_left + bar_width + 10:.2f}" y="{y + 21}" font-family="Segoe UI, Arial, sans-serif" font-size="16" fill="#111827">{escape_xml(str(int(number(row.get("value")))))}</text>',
            ]
        )
    parts.append("</svg>")
    return "".join(parts)


def build_token_optimization_progress_svg(token_snapshot: dict) -> str:
    width = 1200
    height = 460
    budget = max(number(token_snapshot.get("max_total_tokens")), 1.0)
    current = number(token_snapshot.get("current_tokens"))
    previous = number(token_snapshot.get("previous_tokens"))
    headroom = max(0.0, budget - current)
    ratio = min(1.0, current / budget)
    bar_x = 70
    bar_y = 150
    bar_width = 1050
    bar_height = 56
    used_width = bar_width * ratio
    over_budget = current > budget
    used_color = "#dc2626" if over_budget else "#0ea5e9"
    delta_tokens = number(token_snapshot.get("delta_tokens"))
    delta_sign = "+" if delta_tokens >= 0 else ""
    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" role="img" aria-label="Token optimization progress">',
        f'<rect x="0" y="0" width="{width}" height="{height}" fill="#f8fafc" />',
        '<text x="36" y="56" font-family="Segoe UI, Arial, sans-serif" font-size="33" fill="#0f172a">Token Optimization Progress</text>',
        '<text x="36" y="90" font-family="Segoe UI, Arial, sans-serif" font-size="18" fill="#334155">Budget utilization and trend from codex efficiency analysis.</text>',
        f'<rect x="{bar_x}" y="{bar_y}" width="{bar_width}" height="{bar_height}" fill="#e2e8f0" rx="8" ry="8" />',
        f'<rect x="{bar_x}" y="{bar_y}" width="{used_width:.2f}" height="{bar_height}" fill="{used_color}" rx="8" ry="8" />',
        f'<text x="{bar_x}" y="{bar_y - 12}" font-family="Segoe UI, Arial, sans-serif" font-size="16" fill="#111827">Used: {int(current):,} / Budget: {int(budget):,} tokens</text>',
        f'<text x="{bar_x}" y="{bar_y + bar_height + 26}" font-family="Segoe UI, Arial, sans-serif" font-size="16" fill="#111827">Headroom: {int(headroom):,} tokens</text>',
        f'<text x="{bar_x}" y="300" font-family="Segoe UI, Arial, sans-serif" font-size="17" fill="#0f172a">Previous total: {int(previous):,} tokens</text>',
        f'<text x="{bar_x}" y="334" font-family="Segoe UI, Arial, sans-serif" font-size="17" fill="#0f172a">Delta: {delta_sign}{int(delta_tokens):,} tokens ({number(token_snapshot.get("delta_percent")):.2f}%)</text>',
        f'<text x="{bar_x}" y="368" font-family="Segoe UI, Arial, sans-serif" font-size="17" fill="#0f172a">Utilization: {(ratio * 100):.2f}%</text>',
    ]
    if over_budget:
        parts.append(f'<text x="{bar_x + 280}" y="{bar_y + bar_height + 26}" font-family="Segoe UI, Arial, sans-serif" font-size="16" fill="#b91c1c">Over budget: {int(current - budget):,} tokens</text>')
    parts.append("</svg>")
    return "".join(parts)


def build_stage_timeline_svg(stages: list[dict]) -> str:
    rows = stages if stages else [{"stage": "no_data", "duration_ms": 0.0, "selected_language": "unknown", "order": 1, "status_code": 0}]
    width = 1300
    height = 560
    margin = {"left": 90, "right": 40, "top": 100, "bottom": 130}
    plot_width = width - margin["left"] - margin["right"]
    plot_height = height - margin["top"] - margin["bottom"]
    max_duration = max([number(row.get("duration_ms")) for row in rows] + [1.0])
    cumulative = []
    running = 0.0
    for stage in rows:
        running += number(stage.get("duration_ms"))
        cumulative.append(running)
    max_cumulative = max(cumulative + [1.0])
    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" role="img" aria-label="Workflow stage duration timeline">',
        f'<rect x="0" y="0" width="{width}" height="{height}" fill="#f8fafc" />',
        '<text x="32" y="50" font-family="Segoe UI, Arial, sans-serif" font-size="32" fill="#0f172a">Workflow Stage Timeline (Duration + Cumulative)</text>',
        '<text x="32" y="84" font-family="Segoe UI, Arial, sans-serif" font-size="17" fill="#334155">Bars show per-stage duration. Line shows cumulative runtime progression.</text>',
        f'<line x1="{margin["left"]}" y1="{margin["top"] + plot_height}" x2="{width - margin["right"]}" y2="{margin["top"] + plot_height}" stroke="#94a3b8" stroke-width="1.3" />',
        f'<line x1="{margin["left"]}" y1="{margin["top"]}" x2="{margin["left"]}" y2="{margin["top"] + plot_height}" stroke="#94a3b8" stroke-width="1.3" />',
    ]
    points = []
    for index, stage in enumerate(rows):
        x_value = margin["left"] + (plot_width / 2.0 if len(rows) <= 1 else (index / float(len(rows) - 1)) * plot_width)
        bar_width = max(18.0, plot_width / max(len(rows) * 1.8, 12.0))
        bar_x = x_value - bar_width / 2.0
        bar_y = margin["top"] + plot_height - (number(stage.get("duration_ms")) / max_duration) * plot_height
        bar_height = margin["top"] + plot_height - bar_y
        point_y = margin["top"] + plot_height - (cumulative[index] / max_cumulative) * plot_height
        points.append(f"{x_value:.2f},{point_y:.2f}")
        parts.extend(
            [
                f'<rect x="{bar_x:.2f}" y="{bar_y:.2f}" width="{bar_width:.2f}" height="{bar_height:.2f}" fill="{color_for_language(stage.get("selected_language"))}" opacity="0.75" rx="4" ry="4" />',
                f'<text x="{x_value:.2f}" y="{margin["top"] + plot_height + 22:.2f}" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="11" fill="#1f2937">{escape_xml(index + 1)}</text>',
                f'<text x="{x_value:.2f}" y="{margin["top"] + plot_height + 44:.2f}" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="10" fill="#334155" transform="rotate(25 {x_value:.2f} {margin["top"] + plot_height + 44:.2f})">{escape_xml(stage.get("stage"))}</text>',
                f'<text x="{x_value + 4:.2f}" y="{bar_y - 6:.2f}" font-family="Segoe UI, Arial, sans-serif" font-size="10" fill="#111827">{escape_xml(f"{number(stage.get("duration_ms")):.1f}")}</text>',
            ]
        )
    parts.append(f'<polyline points="{" ".join(points)}" fill="none" stroke="#7c3aed" stroke-width="3" />')
    for index, _stage in enumerate(rows):
        x_value = margin["left"] + (plot_width / 2.0 if len(rows) <= 1 else (index / float(len(rows) - 1)) * plot_width)
        point_y = margin["top"] + plot_height - (cumulative[index] / max_cumulative) * plot_height
        parts.append(f'<circle cx="{x_value:.2f}" cy="{point_y:.2f}" r="4.5" fill="#7c3aed" />')
    parts.extend(
        [
            f'<text x="{margin["left"]}" y="{margin["top"] - 20}" font-family="Segoe UI, Arial, sans-serif" font-size="13" fill="#334155">Per-stage and cumulative timing in milliseconds</text>',
            "</svg>",
        ]
    )
    return "".join(parts)


def build_language_coverage_svg(coverage_map: dict) -> str:
    entries = sorted(
        [{"label": str(key or "").strip(), "value": number(value)} for key, value in (coverage_map or {}).items() if str(key or "").strip()],
        key=lambda row: (-number(row["value"]), str(row["label"])),
    )
    width = 900
    height = 420
    total = max(1.0, sum(number(entry.get("value")) for entry in entries))
    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" role="img" aria-label="Language selection coverage">',
        f'<rect x="0" y="0" width="{width}" height="{height}" fill="#f8fafc" />',
        '<text x="28" y="48" font-family="Segoe UI, Arial, sans-serif" font-size="30" fill="#0f172a">Stage Runtime Language Coverage</text>',
        '<text x="28" y="78" font-family="Segoe UI, Arial, sans-serif" font-size="16" fill="#334155">Share of workflow stages selected per runtime language.</text>',
    ]
    bar_x = 40
    bar_y = 130
    bar_width = 820
    bar_height = 44
    cursor = float(bar_x)
    for entry in entries:
        width_slice = bar_width * (number(entry.get("value")) / total)
        parts.append(f'<rect x="{cursor:.2f}" y="{bar_y}" width="{width_slice:.2f}" height="{bar_height}" fill="{color_for_language(entry.get("label"))}" />')
        cursor += width_slice
    parts.append(f'<rect x="{bar_x}" y="{bar_y}" width="{bar_width}" height="{bar_height}" fill="none" stroke="#64748b" stroke-width="1" />')
    row_y = 230
    for entry in entries:
        percent = (number(entry.get("value")) / total) * 100.0 if total > 0 else 0.0
        parts.extend(
            [
                f'<rect x="44" y="{row_y - 16}" width="14" height="14" fill="{color_for_language(entry.get("label"))}" rx="2" ry="2" />',
                f'<text x="66" y="{row_y - 4}" font-family="Segoe UI, Arial, sans-serif" font-size="17" fill="#111827">{escape_xml(entry.get("label"))}: {int(number(entry.get("value")))} stages ({percent:.1f}%)</text>',
            ]
        )
        row_y += 34
    parts.append("</svg>")
    return "".join(parts)


def build_dashboard_markdown(report: dict) -> str:
    ranking_rows = "\n".join([f'| {index + 1} | {row["label"]} | {number(row["value"]):.3f} |' for index, row in enumerate(report["ranking"])]) or "| 1 | n/a | 0.000 |"
    stage_rows = "\n".join(
        [
            f'| {row["order"]} | {row["stage"]} | {row["selected_language"]} | {number(row["duration_ms"]):.3f} | {row["status_code"]} |'
            for row in report["stages"]
        ]
    ) or "| 1 | n/a | n/a | 0.000 | 0 |"
    coverage_rows = "\n".join([f'| {row["label"]} | {int(number(row["value"]))} |' for row in report["language_coverage_rows"]]) or "| n/a | 0 |"
    feature_rows = "\n".join([f'| {index + 1} | {row["label"]} | {int(number(row["value"]))} |' for index, row in enumerate(report["feature_update_rows"][:10])]) or "| 1 | n/a | 0 |"
    weekly_rows = "\n".join([f'| {row["date"]} | {int(number(row["tokens"])):,} | {int(number(row["feature_updates"]))} |' for row in report["weekly_trend_rows"]]) or "| n/a | 0 | 0 |"
    lines = [
        "# Runtime Visual Dashboard",
        "",
        f'- Generated at: {report["generated_at"]}',
        f'- Benchmark report source: `{report["sources"]["benchmark_file"]}`',
        f'- Script swap source: `{report["sources"]["swap_report_file"]}`',
        f'- Efficiency source: `{report["sources"]["efficiency_report_file"]}`',
        f'- Docs freshness source: `{report["sources"]["docs_freshness_report_file"]}`',
        f'- Overall runtime winner: `{report["overall_winner_language"] or "unknown"}`',
        f'- Workflow stage count: {len(report["stages"])}',
        f'- Workflow total duration: {number(report["total_stage_duration_ms"]):.3f} ms',
        "",
        "## Runtime Comparison",
        "",
        "![Runtime total ms by language](assets/runtime_language_total_ms.svg)",
        "",
        "| Rank | Language | Total Runtime (ms) |",
        "|---:|---|---:|",
        ranking_rows,
        "",
        "## Workflow Timeline",
        "",
        "![Workflow stage timeline](assets/workflow_stage_timeline.svg)",
        "",
        "| # | Stage | Selected Runtime | Duration (ms) | Status |",
        "|---:|---|---|---:|---:|",
        stage_rows,
        "",
        "## Runtime Coverage",
        "",
        "![Runtime stage language coverage](assets/runtime_stage_coverage.svg)",
        "",
        "| Language | Stage Count |",
        "|---|---:|",
        coverage_rows,
        "",
        "## Token Optimization Progress",
        "",
        "![Token optimization progress](assets/token_optimization_progress.svg)",
        "",
        f'- Token budget: {int(number(report["token_optimization"]["max_total_tokens"])):,}',
        f'- Current tokens: {int(number(report["token_optimization"]["current_tokens"])):,}',
        f'- Headroom tokens: {int(number(report["token_optimization"]["headroom_tokens"])):,}',
        f'- Delta vs previous: {int(number(report["token_optimization"]["delta_tokens"])):,} ({number(report["token_optimization"]["delta_percent"]):.2f}%)',
        "",
        "## Feature Update Footprint",
        "",
        "![Feature update footprint](assets/feature_update_footprint.svg)",
        "",
        "| Rank | Area | Changed Files |",
        "|---:|---|---:|",
        feature_rows,
        "",
        "## Weekly Trend",
        "",
        "![Weekly progress trend](assets/weekly_progress_trend.svg)",
        "",
        "| Date | Tokens | Feature Updates |",
        "|---|---:|---:|",
        weekly_rows,
        "",
        "## Token/Prompt Efficiency Snapshot",
        "",
        f'- Total tokens estimate: {int(number(report["efficiency_snapshot"]["total_tokens_estimate"])):,}',
        f'- Automation active count: {int(number(report["efficiency_snapshot"]["automation_active"])):,}',
        f'- Skill prompts scanned: {int(number(report["efficiency_snapshot"]["skill_prompts_scanned"])):,}',
        "",
        "_This file is generated by `npm run visuals:runtime`._",
        "",
    ]
    return "\n".join(lines)


def generate(root: pathlib.Path, args: dict | None = None) -> dict:
    options = args or {}
    benchmark_file = root / pathlib.PurePosixPath(str(options.get("benchmark_file") or DEFAULT_BENCHMARK_FILE))
    swap_report_file = root / pathlib.PurePosixPath(str(options.get("swap_report_file") or DEFAULT_SWAP_REPORT_FILE))
    efficiency_report_file = root / pathlib.PurePosixPath(str(options.get("efficiency_report_file") or DEFAULT_EFFICIENCY_REPORT_FILE))
    docs_freshness_report_file = root / pathlib.PurePosixPath(str(options.get("docs_freshness_report_file") or DEFAULT_DOCS_FRESHNESS_REPORT_FILE))
    history_file = root / pathlib.PurePosixPath(str(options.get("history_file") or DEFAULT_HISTORY_FILE))
    assets_dir = root / pathlib.PurePosixPath(str(options.get("assets_dir") or DEFAULT_ASSETS_DIR))
    dashboard_file = root / pathlib.PurePosixPath(str(options.get("dashboard_file") or DEFAULT_DASHBOARD_FILE))
    summary_file = root / pathlib.PurePosixPath(str(options.get("summary_file") or DEFAULT_SUMMARY_FILE))

    benchmark_doc = load_json(benchmark_file, {}) or {}
    swap_doc = load_json(swap_report_file, {}) or {}
    efficiency_doc = load_json(efficiency_report_file, {}) or {}
    docs_freshness_doc = load_json(docs_freshness_report_file, {}) or {}
    history_doc = load_json(history_file, {}) or {}

    ranking = compute_ranking(benchmark_doc)
    stages = compute_stage_durations(swap_doc)
    coverage_map = swap_doc.get("metrics", {}).get("selected_language_coverage", {}) if isinstance(swap_doc.get("metrics"), dict) else {}
    coverage_rows = sorted(
        [{"label": str(key or "").strip(), "value": number(value)} for key, value in (coverage_map or {}).items() if str(key or "").strip()],
        key=lambda row: (-number(row["value"]), str(row["label"])),
    )
    winner_mapping = benchmark_doc.get("winner_mapping") if isinstance(benchmark_doc.get("winner_mapping"), dict) else {}
    winner = str(winner_mapping.get("overall_winner_language", "")).strip() or (str(ranking[0]["label"]) if ranking else "")
    total_stage_duration_ms = sum(number(stage.get("duration_ms")) for stage in stages)
    feature_update_rows = compute_feature_update_counts(docs_freshness_doc)
    token_optimization = build_token_optimization_snapshot(efficiency_doc)
    generated_at = __import__("datetime").datetime.utcnow().isoformat() + "Z"
    total_feature_updates = sum(number(row.get("value")) for row in feature_update_rows)
    next_history = build_trend_history(
        history_doc,
        {
            "date": date_key_from_iso(generated_at),
            "tokens": token_optimization["current_tokens"],
            "feature_updates": total_feature_updates,
        },
    )
    weekly_trend_rows = build_weekly_trend_rows(next_history)

    runtime_language_svg = build_horizontal_bar_chart_svg("Runtime Comparison by Language", "Lower total runtime is better (derived from benchmark report totals).", ranking if ranking else [{"label": "no-data", "value": 0.0}])
    timeline_svg = build_stage_timeline_svg(stages)
    coverage_svg = build_language_coverage_svg(coverage_map if isinstance(coverage_map, dict) else {})
    token_optimization_svg = build_token_optimization_progress_svg(token_optimization)
    feature_update_svg = build_feature_update_footprint_svg(feature_update_rows)
    weekly_trend_svg = build_weekly_progress_trend_svg(weekly_trend_rows)

    runtime_language_svg_path = assets_dir / "runtime_language_total_ms.svg"
    workflow_timeline_svg_path = assets_dir / "workflow_stage_timeline.svg"
    runtime_coverage_svg_path = assets_dir / "runtime_stage_coverage.svg"
    token_optimization_svg_path = assets_dir / "token_optimization_progress.svg"
    feature_update_svg_path = assets_dir / "feature_update_footprint.svg"
    weekly_trend_svg_path = assets_dir / "weekly_progress_trend.svg"

    write_text_file_robust(runtime_language_svg_path, runtime_language_svg, atomic=False)
    write_text_file_robust(workflow_timeline_svg_path, timeline_svg, atomic=False)
    write_text_file_robust(runtime_coverage_svg_path, coverage_svg, atomic=False)
    write_text_file_robust(token_optimization_svg_path, token_optimization_svg, atomic=False)
    write_text_file_robust(feature_update_svg_path, feature_update_svg, atomic=False)
    write_text_file_robust(weekly_trend_svg_path, weekly_trend_svg, atomic=False)
    write_text_file_robust(history_file, f"{json.dumps(next_history, indent=2)}\n", atomic=False)

    counts = efficiency_doc.get("counts") if isinstance(efficiency_doc.get("counts"), dict) else {}
    automation = efficiency_doc.get("automation") if isinstance(efficiency_doc.get("automation"), dict) else {}
    report = {
        "schema_version": 1,
        "report_id": "aio_runtime_visual_dashboard",
        "generated_at": generated_at,
        "root": normalize_path(root),
        "sources": {
            "benchmark_file": normalize_path(benchmark_file.relative_to(root)),
            "swap_report_file": normalize_path(swap_report_file.relative_to(root)),
            "efficiency_report_file": normalize_path(efficiency_report_file.relative_to(root)),
            "docs_freshness_report_file": normalize_path(docs_freshness_report_file.relative_to(root)),
            "history_file": normalize_path(history_file.relative_to(root)),
        },
        "outputs": {
            "dashboard_file": normalize_path(dashboard_file.relative_to(root)),
            "summary_file": normalize_path(summary_file.relative_to(root)),
            "assets": {
                "runtime_language_total_ms": normalize_path(runtime_language_svg_path.relative_to(root)),
                "workflow_stage_timeline": normalize_path(workflow_timeline_svg_path.relative_to(root)),
                "runtime_stage_coverage": normalize_path(runtime_coverage_svg_path.relative_to(root)),
                "token_optimization_progress": normalize_path(token_optimization_svg_path.relative_to(root)),
                "feature_update_footprint": normalize_path(feature_update_svg_path.relative_to(root)),
                "weekly_progress_trend": normalize_path(weekly_trend_svg_path.relative_to(root)),
            },
        },
        "ranking": ranking,
        "stages": stages,
        "overall_winner_language": winner,
        "total_stage_duration_ms": total_stage_duration_ms,
        "language_coverage_rows": coverage_rows,
        "feature_update_rows": feature_update_rows,
        "weekly_trend_rows": weekly_trend_rows,
        "token_optimization": token_optimization,
        "efficiency_snapshot": {
            "total_tokens_estimate": number(counts.get("total_tokens_estimate")),
            "automation_active": number(automation.get("active")),
            "skill_prompts_scanned": number(counts.get("skill_prompts_scanned")),
        },
    }

    write_text_file_robust(dashboard_file, build_dashboard_markdown(report), atomic=False)
    write_text_file_robust(summary_file, f"{json.dumps(report, indent=2)}\n", atomic=False)
    return {
        "status": "pass",
        "generated_at": report["generated_at"],
        "dashboard_file": report["outputs"]["dashboard_file"],
        "summary_file": report["outputs"]["summary_file"],
        "assets": report["outputs"]["assets"],
        "overall_winner_language": report["overall_winner_language"],
    }


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv or [])
    root = find_repo_root(pathlib.Path(__file__))
    report = generate(root, args)
    sys.stdout.write(f"{json.dumps(report, indent=2)}\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
