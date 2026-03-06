# frozen_string_literal: true

require_relative "../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "scripts/polyglot-runtime-benchmark.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
  "buildCppRunnerSource",
  "buildFunctionLanguagePlan",
  "buildRanking",
  "buildWinnerMapping",
  "commandExists",
  "cStringLiteral",
  "detectCppCompiler",
  "detectPythonRuntime",
  "loadBenchmarkInput",
  "main",
  "normalizeLanguage",
  "normalizePathForOutput",
  "normalizeValueForRuntime",
  "parseArgs",
  "parseJsonFromText",
  "printHelpAndExit",
  "readJson",
  "resolveFunctionIds",
  "resolveLanguages",
  "runCppBenchmark",
  "runJavascriptBenchmark",
  "runLanguageBenchmark",
  "runPolyglotBenchmark",
  "runPythonBenchmark",
  "toFiniteNumber"
]
      SYMBOL_MAP = {
  "buildCppRunnerSource": "build_cpp_runner_source",
  "buildFunctionLanguagePlan": "build_function_language_plan",
  "buildRanking": "build_ranking",
  "buildWinnerMapping": "build_winner_mapping",
  "commandExists": "command_exists",
  "cStringLiteral": "c_string_literal",
  "detectCppCompiler": "detect_cpp_compiler",
  "detectPythonRuntime": "detect_python_runtime",
  "loadBenchmarkInput": "load_benchmark_input",
  "main": "main",
  "normalizeLanguage": "normalize_language",
  "normalizePathForOutput": "normalize_path_for_output",
  "normalizeValueForRuntime": "normalize_value_for_runtime",
  "parseArgs": "parse_args",
  "parseJsonFromText": "parse_json_from_text",
  "printHelpAndExit": "print_help_and_exit",
  "readJson": "read_json",
  "resolveFunctionIds": "resolve_function_ids",
  "resolveLanguages": "resolve_languages",
  "runCppBenchmark": "run_cpp_benchmark",
  "runJavascriptBenchmark": "run_javascript_benchmark",
  "runLanguageBenchmark": "run_language_benchmark",
  "runPolyglotBenchmark": "run_polyglot_benchmark",
  "runPythonBenchmark": "run_python_benchmark",
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

      def self.build_cpp_runner_source(*args, **kwargs)
        invoke_source_function("buildCppRunnerSource", *args, **kwargs)
      end

      def self.build_function_language_plan(*args, **kwargs)
        invoke_source_function("buildFunctionLanguagePlan", *args, **kwargs)
      end

      def self.build_ranking(*args, **kwargs)
        invoke_source_function("buildRanking", *args, **kwargs)
      end

      def self.build_winner_mapping(*args, **kwargs)
        invoke_source_function("buildWinnerMapping", *args, **kwargs)
      end

      def self.command_exists(*args, **kwargs)
        invoke_source_function("commandExists", *args, **kwargs)
      end

      def self.c_string_literal(*args, **kwargs)
        invoke_source_function("cStringLiteral", *args, **kwargs)
      end

      def self.detect_cpp_compiler(*args, **kwargs)
        invoke_source_function("detectCppCompiler", *args, **kwargs)
      end

      def self.detect_python_runtime(*args, **kwargs)
        invoke_source_function("detectPythonRuntime", *args, **kwargs)
      end

      def self.load_benchmark_input(*args, **kwargs)
        invoke_source_function("loadBenchmarkInput", *args, **kwargs)
      end

      def self.main(*args, **kwargs)
        invoke_source_function("main", *args, **kwargs)
      end

      def self.normalize_language(*args, **kwargs)
        invoke_source_function("normalizeLanguage", *args, **kwargs)
      end

      def self.normalize_path_for_output(*args, **kwargs)
        invoke_source_function("normalizePathForOutput", *args, **kwargs)
      end

      def self.normalize_value_for_runtime(*args, **kwargs)
        invoke_source_function("normalizeValueForRuntime", *args, **kwargs)
      end

      def self.parse_args(*args, **kwargs)
        invoke_source_function("parseArgs", *args, **kwargs)
      end

      def self.parse_json_from_text(*args, **kwargs)
        invoke_source_function("parseJsonFromText", *args, **kwargs)
      end

      def self.print_help_and_exit(*args, **kwargs)
        invoke_source_function("printHelpAndExit", *args, **kwargs)
      end

      def self.read_json(*args, **kwargs)
        invoke_source_function("readJson", *args, **kwargs)
      end

      def self.resolve_function_ids(*args, **kwargs)
        invoke_source_function("resolveFunctionIds", *args, **kwargs)
      end

      def self.resolve_languages(*args, **kwargs)
        invoke_source_function("resolveLanguages", *args, **kwargs)
      end

      def self.run_cpp_benchmark(*args, **kwargs)
        invoke_source_function("runCppBenchmark", *args, **kwargs)
      end

      def self.run_javascript_benchmark(*args, **kwargs)
        invoke_source_function("runJavascriptBenchmark", *args, **kwargs)
      end

      def self.run_language_benchmark(*args, **kwargs)
        invoke_source_function("runLanguageBenchmark", *args, **kwargs)
      end

      def self.run_polyglot_benchmark(*args, **kwargs)
        invoke_source_function("runPolyglotBenchmark", *args, **kwargs)
      end

      def self.run_python_benchmark(*args, **kwargs)
        invoke_source_function("runPythonBenchmark", *args, **kwargs)
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
