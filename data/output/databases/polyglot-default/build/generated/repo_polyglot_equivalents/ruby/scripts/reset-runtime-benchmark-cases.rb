# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "scripts/reset-runtime-benchmark-cases.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "buildArgsForFunction",
  "main",
  "resetRuntimeBenchmarkCases",
  "toCaseId"
]
      SYMBOL_MAP = {
  "buildArgsForFunction": "build_args_for_function",
  "main": "main",
  "resetRuntimeBenchmarkCases": "reset_runtime_benchmark_cases",
  "toCaseId": "to_case_id"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.build_args_for_function(*args)
        raise NotImplementedError, "Equivalent stub for 'buildArgsForFunction' from scripts/reset-runtime-benchmark-cases.js"
      end

      def self.main(*args)
        raise NotImplementedError, "Equivalent stub for 'main' from scripts/reset-runtime-benchmark-cases.js"
      end

      def self.reset_runtime_benchmark_cases(*args)
        raise NotImplementedError, "Equivalent stub for 'resetRuntimeBenchmarkCases' from scripts/reset-runtime-benchmark-cases.js"
      end

      def self.to_case_id(*args)
        raise NotImplementedError, "Equivalent stub for 'toCaseId' from scripts/reset-runtime-benchmark-cases.js"
      end
    end
  end
end
