#!/usr/bin/env python3
"""Auto-generated Python equivalent module proxy."""

from __future__ import annotations

import argparse
import importlib.util
import json
import pathlib
import sys

AIO_SOURCE_JS_FILE = "scripts/generate-runtime-visuals.js"
AIO_EQUIVALENT_KIND = "repo_module_proxy"
AIO_FUNCTION_TOKENS = [
  "barWidthFor",
  "buildDashboardMarkdown",
  "buildFeatureUpdateFootprintSvg",
  "buildHorizontalBarChartSvg",
  "buildLanguageCoverageSvg",
  "buildStageTimelineSvg",
  "buildTokenOptimizationProgressSvg",
  "buildTokenOptimizationSnapshot",
  "buildTrendHistory",
  "buildWeeklyProgressTrendSvg",
  "buildWeeklyTrendRows",
  "classifyChangedFile",
  "colorForLanguage",
  "computeFeatureUpdateCounts",
  "computeRanking",
  "computeStageDurations",
  "dateKeyFromIso",
  "escapeXml",
  "formatMs",
  "generate",
  "main",
  "normalizePath",
  "number",
  "parseArgs",
  "readJsonIfExists",
  "toHistoryEntry",
  "xFor",
  "yCumulative",
  "yDuration",
  "yFeatures",
  "yTokens"
]
AIO_SYMBOL_MAP = {
  "barWidthFor": "bar_width_for",
  "buildDashboardMarkdown": "build_dashboard_markdown",
  "buildFeatureUpdateFootprintSvg": "build_feature_update_footprint_svg",
  "buildHorizontalBarChartSvg": "build_horizontal_bar_chart_svg",
  "buildLanguageCoverageSvg": "build_language_coverage_svg",
  "buildStageTimelineSvg": "build_stage_timeline_svg",
  "buildTokenOptimizationProgressSvg": "build_token_optimization_progress_svg",
  "buildTokenOptimizationSnapshot": "build_token_optimization_snapshot",
  "buildTrendHistory": "build_trend_history",
  "buildWeeklyProgressTrendSvg": "build_weekly_progress_trend_svg",
  "buildWeeklyTrendRows": "build_weekly_trend_rows",
  "classifyChangedFile": "classify_changed_file",
  "colorForLanguage": "color_for_language",
  "computeFeatureUpdateCounts": "compute_feature_update_counts",
  "computeRanking": "compute_ranking",
  "computeStageDurations": "compute_stage_durations",
  "dateKeyFromIso": "date_key_from_iso",
  "escapeXml": "escape_xml",
  "formatMs": "format_ms",
  "generate": "generate",
  "main": "main",
  "normalizePath": "normalize_path",
  "number": "number",
  "parseArgs": "parse_args",
  "readJsonIfExists": "read_json_if_exists",
  "toHistoryEntry": "to_history_entry",
  "xFor": "x_for",
  "yCumulative": "y_cumulative",
  "yDuration": "y_duration",
  "yFeatures": "y_features",
  "yTokens": "y_tokens"
}


def _load_proxy_runner():
    shared_runner_path = (pathlib.Path(__file__).resolve().parent / "../_shared/repo_module_proxy.py").resolve()
    spec = importlib.util.spec_from_file_location("aio_repo_module_proxy", shared_runner_path)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"failed to load shared runner: {shared_runner_path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


_PROXY = _load_proxy_runner()


def module_equivalent_metadata():
    return {
        "source_js_file": AIO_SOURCE_JS_FILE,
        "equivalent_kind": AIO_EQUIVALENT_KIND,
        "function_tokens": list(AIO_FUNCTION_TOKENS),
        "symbol_map": dict(AIO_SYMBOL_MAP),
    }


def invoke_source_function(function_name, *args, **kwargs):
    return _PROXY.invoke_js_function(AIO_SOURCE_JS_FILE, function_name, list(args), dict(kwargs))


def run_source_entrypoint(args=None):
    return _PROXY.run_js_entrypoint(AIO_SOURCE_JS_FILE, list(args or []))

def bar_width_for(*args, **kwargs):
    return invoke_source_function("barWidthFor", *args, **kwargs)

def build_dashboard_markdown(*args, **kwargs):
    return invoke_source_function("buildDashboardMarkdown", *args, **kwargs)

def build_feature_update_footprint_svg(*args, **kwargs):
    return invoke_source_function("buildFeatureUpdateFootprintSvg", *args, **kwargs)

def build_horizontal_bar_chart_svg(*args, **kwargs):
    return invoke_source_function("buildHorizontalBarChartSvg", *args, **kwargs)

def build_language_coverage_svg(*args, **kwargs):
    return invoke_source_function("buildLanguageCoverageSvg", *args, **kwargs)

def build_stage_timeline_svg(*args, **kwargs):
    return invoke_source_function("buildStageTimelineSvg", *args, **kwargs)

def build_token_optimization_progress_svg(*args, **kwargs):
    return invoke_source_function("buildTokenOptimizationProgressSvg", *args, **kwargs)

def build_token_optimization_snapshot(*args, **kwargs):
    return invoke_source_function("buildTokenOptimizationSnapshot", *args, **kwargs)

def build_trend_history(*args, **kwargs):
    return invoke_source_function("buildTrendHistory", *args, **kwargs)

def build_weekly_progress_trend_svg(*args, **kwargs):
    return invoke_source_function("buildWeeklyProgressTrendSvg", *args, **kwargs)

def build_weekly_trend_rows(*args, **kwargs):
    return invoke_source_function("buildWeeklyTrendRows", *args, **kwargs)

def classify_changed_file(*args, **kwargs):
    return invoke_source_function("classifyChangedFile", *args, **kwargs)

def color_for_language(*args, **kwargs):
    return invoke_source_function("colorForLanguage", *args, **kwargs)

def compute_feature_update_counts(*args, **kwargs):
    return invoke_source_function("computeFeatureUpdateCounts", *args, **kwargs)

def compute_ranking(*args, **kwargs):
    return invoke_source_function("computeRanking", *args, **kwargs)

def compute_stage_durations(*args, **kwargs):
    return invoke_source_function("computeStageDurations", *args, **kwargs)

def date_key_from_iso(*args, **kwargs):
    return invoke_source_function("dateKeyFromIso", *args, **kwargs)

def escape_xml(*args, **kwargs):
    return invoke_source_function("escapeXml", *args, **kwargs)

def format_ms(*args, **kwargs):
    return invoke_source_function("formatMs", *args, **kwargs)

def generate(*args, **kwargs):
    return invoke_source_function("generate", *args, **kwargs)

def main(*args, **kwargs):
    return invoke_source_function("main", *args, **kwargs)

def normalize_path(*args, **kwargs):
    return invoke_source_function("normalizePath", *args, **kwargs)

def number(*args, **kwargs):
    return invoke_source_function("number", *args, **kwargs)

def parse_args(*args, **kwargs):
    return invoke_source_function("parseArgs", *args, **kwargs)

def read_json_if_exists(*args, **kwargs):
    return invoke_source_function("readJsonIfExists", *args, **kwargs)

def to_history_entry(*args, **kwargs):
    return invoke_source_function("toHistoryEntry", *args, **kwargs)

def x_for(*args, **kwargs):
    return invoke_source_function("xFor", *args, **kwargs)

def y_cumulative(*args, **kwargs):
    return invoke_source_function("yCumulative", *args, **kwargs)

def y_duration(*args, **kwargs):
    return invoke_source_function("yDuration", *args, **kwargs)

def y_features(*args, **kwargs):
    return invoke_source_function("yFeatures", *args, **kwargs)

def y_tokens(*args, **kwargs):
    return invoke_source_function("yTokens", *args, **kwargs)


def _main(argv):
    parser = argparse.ArgumentParser(add_help=False)
    parser.add_argument("--function", dest="function_name", default="")
    parser.add_argument("--args-json", dest="args_json", default="[]")
    parsed, _ = parser.parse_known_args(argv)
    if parsed.function_name:
        args = json.loads(parsed.args_json)
        result = invoke_source_function(parsed.function_name, *list(args))
        sys.stdout.write(json.dumps({"ok": True, "result": result}) + "\n")
        return 0
    report = run_source_entrypoint(argv)
    return int(report.get("exit_code", 0))


if __name__ == "__main__":
    raise SystemExit(_main(sys.argv[1:]))
