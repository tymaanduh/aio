# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "scripts/polyglot-runtime-benchmark.js"
      EQUIVALENT_KIND = "repo_module_stub"
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

      def self.build_cpp_runner_source(*args)
        raise NotImplementedError, "Equivalent stub for 'buildCppRunnerSource' from scripts/polyglot-runtime-benchmark.js"
      end

      def self.build_function_language_plan(*args)
        raise NotImplementedError, "Equivalent stub for 'buildFunctionLanguagePlan' from scripts/polyglot-runtime-benchmark.js"
      end

      def self.build_ranking(*args)
        raise NotImplementedError, "Equivalent stub for 'buildRanking' from scripts/polyglot-runtime-benchmark.js"
      end

      def self.build_winner_mapping(*args)
        raise NotImplementedError, "Equivalent stub for 'buildWinnerMapping' from scripts/polyglot-runtime-benchmark.js"
      end

      def self.command_exists(*args)
        raise NotImplementedError, "Equivalent stub for 'commandExists' from scripts/polyglot-runtime-benchmark.js"
      end

      def self.c_string_literal(*args)
        raise NotImplementedError, "Equivalent stub for 'cStringLiteral' from scripts/polyglot-runtime-benchmark.js"
      end

      def self.detect_cpp_compiler(*args)
        raise NotImplementedError, "Equivalent stub for 'detectCppCompiler' from scripts/polyglot-runtime-benchmark.js"
      end

      def self.detect_python_runtime(*args)
        raise NotImplementedError, "Equivalent stub for 'detectPythonRuntime' from scripts/polyglot-runtime-benchmark.js"
      end

      def self.load_benchmark_input(*args)
        raise NotImplementedError, "Equivalent stub for 'loadBenchmarkInput' from scripts/polyglot-runtime-benchmark.js"
      end

      def self.main(*args)
        raise NotImplementedError, "Equivalent stub for 'main' from scripts/polyglot-runtime-benchmark.js"
      end

      def self.normalize_language(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizeLanguage' from scripts/polyglot-runtime-benchmark.js"
      end

      def self.normalize_path_for_output(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizePathForOutput' from scripts/polyglot-runtime-benchmark.js"
      end

      def self.normalize_value_for_runtime(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizeValueForRuntime' from scripts/polyglot-runtime-benchmark.js"
      end

      def self.parse_args(*args)
        raise NotImplementedError, "Equivalent stub for 'parseArgs' from scripts/polyglot-runtime-benchmark.js"
      end

      def self.parse_json_from_text(*args)
        raise NotImplementedError, "Equivalent stub for 'parseJsonFromText' from scripts/polyglot-runtime-benchmark.js"
      end

      def self.print_help_and_exit(*args)
        raise NotImplementedError, "Equivalent stub for 'printHelpAndExit' from scripts/polyglot-runtime-benchmark.js"
      end

      def self.read_json(*args)
        raise NotImplementedError, "Equivalent stub for 'readJson' from scripts/polyglot-runtime-benchmark.js"
      end

      def self.resolve_function_ids(*args)
        raise NotImplementedError, "Equivalent stub for 'resolveFunctionIds' from scripts/polyglot-runtime-benchmark.js"
      end

      def self.resolve_languages(*args)
        raise NotImplementedError, "Equivalent stub for 'resolveLanguages' from scripts/polyglot-runtime-benchmark.js"
      end

      def self.run_cpp_benchmark(*args)
        raise NotImplementedError, "Equivalent stub for 'runCppBenchmark' from scripts/polyglot-runtime-benchmark.js"
      end

      def self.run_javascript_benchmark(*args)
        raise NotImplementedError, "Equivalent stub for 'runJavascriptBenchmark' from scripts/polyglot-runtime-benchmark.js"
      end

      def self.run_language_benchmark(*args)
        raise NotImplementedError, "Equivalent stub for 'runLanguageBenchmark' from scripts/polyglot-runtime-benchmark.js"
      end

      def self.run_polyglot_benchmark(*args)
        raise NotImplementedError, "Equivalent stub for 'runPolyglotBenchmark' from scripts/polyglot-runtime-benchmark.js"
      end

      def self.run_python_benchmark(*args)
        raise NotImplementedError, "Equivalent stub for 'runPythonBenchmark' from scripts/polyglot-runtime-benchmark.js"
      end

      def self.to_finite_number(*args)
        raise NotImplementedError, "Equivalent stub for 'toFiniteNumber' from scripts/polyglot-runtime-benchmark.js"
      end
    end
  end
end
