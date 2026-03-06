# frozen_string_literal: true

require_relative "../../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "scripts/lib/polyglot-script-swap-runner.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
  "append",
  "commandExists",
  "detectPythonRuntime",
  "includeScore",
  "loadBenchmarkWinnerMap",
  "loadCatalog",
  "parseLanguageOrderCsv",
  "parseTruthy",
  "readJsonFile",
  "resolveAdapter",
  "resolveBenchmarkPreferredLanguage",
  "resolveExecutionCommand",
  "resolveLanguageOrder",
  "resolveLanguageSelection",
  "resolveStagePolicy",
  "resolveStageScriptPath",
  "runScriptWithSwaps",
  "toLanguageId",
  "toPathFromRoot",
  "toUniqueLanguageList",
  "toUniqueStringList"
]
      SYMBOL_MAP = {
  "append": "append",
  "commandExists": "command_exists",
  "detectPythonRuntime": "detect_python_runtime",
  "includeScore": "include_score",
  "loadBenchmarkWinnerMap": "load_benchmark_winner_map",
  "loadCatalog": "load_catalog",
  "parseLanguageOrderCsv": "parse_language_order_csv",
  "parseTruthy": "parse_truthy",
  "readJsonFile": "read_json_file",
  "resolveAdapter": "resolve_adapter",
  "resolveBenchmarkPreferredLanguage": "resolve_benchmark_preferred_language",
  "resolveExecutionCommand": "resolve_execution_command",
  "resolveLanguageOrder": "resolve_language_order",
  "resolveLanguageSelection": "resolve_language_selection",
  "resolveStagePolicy": "resolve_stage_policy",
  "resolveStageScriptPath": "resolve_stage_script_path",
  "runScriptWithSwaps": "run_script_with_swaps",
  "toLanguageId": "to_language_id",
  "toPathFromRoot": "to_path_from_root",
  "toUniqueLanguageList": "to_unique_language_list",
  "toUniqueStringList": "to_unique_string_list"
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

      def self.append(*args, **kwargs)
        invoke_source_function("append", *args, **kwargs)
      end

      def self.command_exists(*args, **kwargs)
        invoke_source_function("commandExists", *args, **kwargs)
      end

      def self.detect_python_runtime(*args, **kwargs)
        invoke_source_function("detectPythonRuntime", *args, **kwargs)
      end

      def self.include_score(*args, **kwargs)
        invoke_source_function("includeScore", *args, **kwargs)
      end

      def self.load_benchmark_winner_map(*args, **kwargs)
        invoke_source_function("loadBenchmarkWinnerMap", *args, **kwargs)
      end

      def self.load_catalog(*args, **kwargs)
        invoke_source_function("loadCatalog", *args, **kwargs)
      end

      def self.parse_language_order_csv(*args, **kwargs)
        invoke_source_function("parseLanguageOrderCsv", *args, **kwargs)
      end

      def self.parse_truthy(*args, **kwargs)
        invoke_source_function("parseTruthy", *args, **kwargs)
      end

      def self.read_json_file(*args, **kwargs)
        invoke_source_function("readJsonFile", *args, **kwargs)
      end

      def self.resolve_adapter(*args, **kwargs)
        invoke_source_function("resolveAdapter", *args, **kwargs)
      end

      def self.resolve_benchmark_preferred_language(*args, **kwargs)
        invoke_source_function("resolveBenchmarkPreferredLanguage", *args, **kwargs)
      end

      def self.resolve_execution_command(*args, **kwargs)
        invoke_source_function("resolveExecutionCommand", *args, **kwargs)
      end

      def self.resolve_language_order(*args, **kwargs)
        invoke_source_function("resolveLanguageOrder", *args, **kwargs)
      end

      def self.resolve_language_selection(*args, **kwargs)
        invoke_source_function("resolveLanguageSelection", *args, **kwargs)
      end

      def self.resolve_stage_policy(*args, **kwargs)
        invoke_source_function("resolveStagePolicy", *args, **kwargs)
      end

      def self.resolve_stage_script_path(*args, **kwargs)
        invoke_source_function("resolveStageScriptPath", *args, **kwargs)
      end

      def self.run_script_with_swaps(*args, **kwargs)
        invoke_source_function("runScriptWithSwaps", *args, **kwargs)
      end

      def self.to_language_id(*args, **kwargs)
        invoke_source_function("toLanguageId", *args, **kwargs)
      end

      def self.to_path_from_root(*args, **kwargs)
        invoke_source_function("toPathFromRoot", *args, **kwargs)
      end

      def self.to_unique_language_list(*args, **kwargs)
        invoke_source_function("toUniqueLanguageList", *args, **kwargs)
      end

      def self.to_unique_string_list(*args, **kwargs)
        invoke_source_function("toUniqueStringList", *args, **kwargs)
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
