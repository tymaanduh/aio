# frozen_string_literal: true

require_relative "../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "scripts/codex-efficiency-audit.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
  "analyze",
  "analyzeAutomationDir",
  "collectFilesRecursively",
  "compareAgainstPreviousReport",
  "countWords",
  "estimateTokens",
  "main",
  "normalizeText",
  "parseArgs",
  "parseOpenAiPrompt",
  "readJsonIfExists",
  "readText",
  "resolveNumber",
  "resolveThresholds",
  "toFiniteNumber"
]
      SYMBOL_MAP = {
  "analyze": "analyze",
  "analyzeAutomationDir": "analyze_automation_dir",
  "collectFilesRecursively": "collect_files_recursively",
  "compareAgainstPreviousReport": "compare_against_previous_report",
  "countWords": "count_words",
  "estimateTokens": "estimate_tokens",
  "main": "main",
  "normalizeText": "normalize_text",
  "parseArgs": "parse_args",
  "parseOpenAiPrompt": "parse_open_ai_prompt",
  "readJsonIfExists": "read_json_if_exists",
  "readText": "read_text",
  "resolveNumber": "resolve_number",
  "resolveThresholds": "resolve_thresholds",
  "toFiniteNumber": "to_finite_number"
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

      def self.analyze(*args, **kwargs)
        invoke_source_function("analyze", *args, **kwargs)
      end

      def self.analyze_automation_dir(*args, **kwargs)
        invoke_source_function("analyzeAutomationDir", *args, **kwargs)
      end

      def self.collect_files_recursively(*args, **kwargs)
        invoke_source_function("collectFilesRecursively", *args, **kwargs)
      end

      def self.compare_against_previous_report(*args, **kwargs)
        invoke_source_function("compareAgainstPreviousReport", *args, **kwargs)
      end

      def self.count_words(*args, **kwargs)
        invoke_source_function("countWords", *args, **kwargs)
      end

      def self.estimate_tokens(*args, **kwargs)
        invoke_source_function("estimateTokens", *args, **kwargs)
      end

      def self.main(*args, **kwargs)
        invoke_source_function("main", *args, **kwargs)
      end

      def self.normalize_text(*args, **kwargs)
        invoke_source_function("normalizeText", *args, **kwargs)
      end

      def self.parse_args(*args, **kwargs)
        invoke_source_function("parseArgs", *args, **kwargs)
      end

      def self.parse_open_ai_prompt(*args, **kwargs)
        invoke_source_function("parseOpenAiPrompt", *args, **kwargs)
      end

      def self.read_json_if_exists(*args, **kwargs)
        invoke_source_function("readJsonIfExists", *args, **kwargs)
      end

      def self.read_text(*args, **kwargs)
        invoke_source_function("readText", *args, **kwargs)
      end

      def self.resolve_number(*args, **kwargs)
        invoke_source_function("resolveNumber", *args, **kwargs)
      end

      def self.resolve_thresholds(*args, **kwargs)
        invoke_source_function("resolveThresholds", *args, **kwargs)
      end

      def self.to_finite_number(*args, **kwargs)
        invoke_source_function("toFiniteNumber", *args, **kwargs)
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
