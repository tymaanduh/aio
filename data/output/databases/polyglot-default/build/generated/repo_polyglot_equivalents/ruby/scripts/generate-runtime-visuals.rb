# frozen_string_literal: true

require_relative "../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "scripts/generate-runtime-visuals.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
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
      SYMBOL_MAP = {
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

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.invoke_source_function(function_name, *args, **kwargs)
        Aio::RepoPolyglotEquivalents::Shared::RepoModuleProxy.invoke_js_function(
          SOURCE_JS_FILE,
          function_name,
          args,
          kwargs
        )
      end

      def self.run_source_entrypoint(args = [])
        Aio::RepoPolyglotEquivalents::Shared::RepoModuleProxy.run_js_entrypoint(SOURCE_JS_FILE, args)
      end

      def self.bar_width_for(*args, **kwargs)
        invoke_source_function("barWidthFor", *args, **kwargs)
      end

      def self.build_dashboard_markdown(*args, **kwargs)
        invoke_source_function("buildDashboardMarkdown", *args, **kwargs)
      end

      def self.build_feature_update_footprint_svg(*args, **kwargs)
        invoke_source_function("buildFeatureUpdateFootprintSvg", *args, **kwargs)
      end

      def self.build_horizontal_bar_chart_svg(*args, **kwargs)
        invoke_source_function("buildHorizontalBarChartSvg", *args, **kwargs)
      end

      def self.build_language_coverage_svg(*args, **kwargs)
        invoke_source_function("buildLanguageCoverageSvg", *args, **kwargs)
      end

      def self.build_stage_timeline_svg(*args, **kwargs)
        invoke_source_function("buildStageTimelineSvg", *args, **kwargs)
      end

      def self.build_token_optimization_progress_svg(*args, **kwargs)
        invoke_source_function("buildTokenOptimizationProgressSvg", *args, **kwargs)
      end

      def self.build_token_optimization_snapshot(*args, **kwargs)
        invoke_source_function("buildTokenOptimizationSnapshot", *args, **kwargs)
      end

      def self.build_trend_history(*args, **kwargs)
        invoke_source_function("buildTrendHistory", *args, **kwargs)
      end

      def self.build_weekly_progress_trend_svg(*args, **kwargs)
        invoke_source_function("buildWeeklyProgressTrendSvg", *args, **kwargs)
      end

      def self.build_weekly_trend_rows(*args, **kwargs)
        invoke_source_function("buildWeeklyTrendRows", *args, **kwargs)
      end

      def self.classify_changed_file(*args, **kwargs)
        invoke_source_function("classifyChangedFile", *args, **kwargs)
      end

      def self.color_for_language(*args, **kwargs)
        invoke_source_function("colorForLanguage", *args, **kwargs)
      end

      def self.compute_feature_update_counts(*args, **kwargs)
        invoke_source_function("computeFeatureUpdateCounts", *args, **kwargs)
      end

      def self.compute_ranking(*args, **kwargs)
        invoke_source_function("computeRanking", *args, **kwargs)
      end

      def self.compute_stage_durations(*args, **kwargs)
        invoke_source_function("computeStageDurations", *args, **kwargs)
      end

      def self.date_key_from_iso(*args, **kwargs)
        invoke_source_function("dateKeyFromIso", *args, **kwargs)
      end

      def self.escape_xml(*args, **kwargs)
        invoke_source_function("escapeXml", *args, **kwargs)
      end

      def self.format_ms(*args, **kwargs)
        invoke_source_function("formatMs", *args, **kwargs)
      end

      def self.generate(*args, **kwargs)
        invoke_source_function("generate", *args, **kwargs)
      end

      def self.main(*args, **kwargs)
        invoke_source_function("main", *args, **kwargs)
      end

      def self.normalize_path(*args, **kwargs)
        invoke_source_function("normalizePath", *args, **kwargs)
      end

      def self.number(*args, **kwargs)
        invoke_source_function("number", *args, **kwargs)
      end

      def self.parse_args(*args, **kwargs)
        invoke_source_function("parseArgs", *args, **kwargs)
      end

      def self.read_json_if_exists(*args, **kwargs)
        invoke_source_function("readJsonIfExists", *args, **kwargs)
      end

      def self.to_history_entry(*args, **kwargs)
        invoke_source_function("toHistoryEntry", *args, **kwargs)
      end

      def self.x_for(*args, **kwargs)
        invoke_source_function("xFor", *args, **kwargs)
      end

      def self.y_cumulative(*args, **kwargs)
        invoke_source_function("yCumulative", *args, **kwargs)
      end

      def self.y_duration(*args, **kwargs)
        invoke_source_function("yDuration", *args, **kwargs)
      end

      def self.y_features(*args, **kwargs)
        invoke_source_function("yFeatures", *args, **kwargs)
      end

      def self.y_tokens(*args, **kwargs)
        invoke_source_function("yTokens", *args, **kwargs)
      end
    end
  end
end

if __FILE__ == $PROGRAM_NAME
  args = ARGV.dup
  function_flag_index = args.index("--function")
  if function_flag_index
    function_name = args[function_flag_index + 1] || ""
    args_json_index = args.index("--args-json")
    args_json = args_json_index ? (args[args_json_index + 1] || "[]") : "[]"
    result = Aio::RepoPolyglotEquivalents::ModuleProxy.invoke_source_function(
      function_name,
      *Array(JSON.parse(args_json))
    )
    puts(JSON.generate({ ok: true, result: result }))
    exit(0)
  end

  report = Aio::RepoPolyglotEquivalents::ModuleProxy.run_source_entrypoint(ARGV)
  exit(Integer(report.fetch("exit_code", 0)))
end
