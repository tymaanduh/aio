# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "scripts/lib/polyglot-script-swap-runner.js"
      EQUIVALENT_KIND = "repo_module_stub"
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

      def self.append(*args)
        raise NotImplementedError, "Equivalent stub for 'append' from scripts/lib/polyglot-script-swap-runner.js"
      end

      def self.command_exists(*args)
        raise NotImplementedError, "Equivalent stub for 'commandExists' from scripts/lib/polyglot-script-swap-runner.js"
      end

      def self.detect_python_runtime(*args)
        raise NotImplementedError, "Equivalent stub for 'detectPythonRuntime' from scripts/lib/polyglot-script-swap-runner.js"
      end

      def self.include_score(*args)
        raise NotImplementedError, "Equivalent stub for 'includeScore' from scripts/lib/polyglot-script-swap-runner.js"
      end

      def self.load_benchmark_winner_map(*args)
        raise NotImplementedError, "Equivalent stub for 'loadBenchmarkWinnerMap' from scripts/lib/polyglot-script-swap-runner.js"
      end

      def self.load_catalog(*args)
        raise NotImplementedError, "Equivalent stub for 'loadCatalog' from scripts/lib/polyglot-script-swap-runner.js"
      end

      def self.parse_language_order_csv(*args)
        raise NotImplementedError, "Equivalent stub for 'parseLanguageOrderCsv' from scripts/lib/polyglot-script-swap-runner.js"
      end

      def self.parse_truthy(*args)
        raise NotImplementedError, "Equivalent stub for 'parseTruthy' from scripts/lib/polyglot-script-swap-runner.js"
      end

      def self.read_json_file(*args)
        raise NotImplementedError, "Equivalent stub for 'readJsonFile' from scripts/lib/polyglot-script-swap-runner.js"
      end

      def self.resolve_adapter(*args)
        raise NotImplementedError, "Equivalent stub for 'resolveAdapter' from scripts/lib/polyglot-script-swap-runner.js"
      end

      def self.resolve_benchmark_preferred_language(*args)
        raise NotImplementedError, "Equivalent stub for 'resolveBenchmarkPreferredLanguage' from scripts/lib/polyglot-script-swap-runner.js"
      end

      def self.resolve_execution_command(*args)
        raise NotImplementedError, "Equivalent stub for 'resolveExecutionCommand' from scripts/lib/polyglot-script-swap-runner.js"
      end

      def self.resolve_language_order(*args)
        raise NotImplementedError, "Equivalent stub for 'resolveLanguageOrder' from scripts/lib/polyglot-script-swap-runner.js"
      end

      def self.resolve_language_selection(*args)
        raise NotImplementedError, "Equivalent stub for 'resolveLanguageSelection' from scripts/lib/polyglot-script-swap-runner.js"
      end

      def self.resolve_stage_policy(*args)
        raise NotImplementedError, "Equivalent stub for 'resolveStagePolicy' from scripts/lib/polyglot-script-swap-runner.js"
      end

      def self.resolve_stage_script_path(*args)
        raise NotImplementedError, "Equivalent stub for 'resolveStageScriptPath' from scripts/lib/polyglot-script-swap-runner.js"
      end

      def self.run_script_with_swaps(*args)
        raise NotImplementedError, "Equivalent stub for 'runScriptWithSwaps' from scripts/lib/polyglot-script-swap-runner.js"
      end

      def self.to_language_id(*args)
        raise NotImplementedError, "Equivalent stub for 'toLanguageId' from scripts/lib/polyglot-script-swap-runner.js"
      end

      def self.to_path_from_root(*args)
        raise NotImplementedError, "Equivalent stub for 'toPathFromRoot' from scripts/lib/polyglot-script-swap-runner.js"
      end

      def self.to_unique_language_list(*args)
        raise NotImplementedError, "Equivalent stub for 'toUniqueLanguageList' from scripts/lib/polyglot-script-swap-runner.js"
      end

      def self.to_unique_string_list(*args)
        raise NotImplementedError, "Equivalent stub for 'toUniqueStringList' from scripts/lib/polyglot-script-swap-runner.js"
      end
    end
  end
end
