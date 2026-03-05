# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "scripts/reset-and-benchmark-polyglot-runtime.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "main",
  "parseArgs",
  "printHelpAndExit",
  "removePathIfExists",
  "runResetAndBenchmark",
  "toPosix",
  "toSlug",
  "writeJson"
]
      SYMBOL_MAP = {
  "main": "main",
  "parseArgs": "parse_args",
  "printHelpAndExit": "print_help_and_exit",
  "removePathIfExists": "remove_path_if_exists",
  "runResetAndBenchmark": "run_reset_and_benchmark",
  "toPosix": "to_posix",
  "toSlug": "to_slug",
  "writeJson": "write_json"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.main(*args)
        raise NotImplementedError, "Equivalent stub for 'main' from scripts/reset-and-benchmark-polyglot-runtime.js"
      end

      def self.parse_args(*args)
        raise NotImplementedError, "Equivalent stub for 'parseArgs' from scripts/reset-and-benchmark-polyglot-runtime.js"
      end

      def self.print_help_and_exit(*args)
        raise NotImplementedError, "Equivalent stub for 'printHelpAndExit' from scripts/reset-and-benchmark-polyglot-runtime.js"
      end

      def self.remove_path_if_exists(*args)
        raise NotImplementedError, "Equivalent stub for 'removePathIfExists' from scripts/reset-and-benchmark-polyglot-runtime.js"
      end

      def self.run_reset_and_benchmark(*args)
        raise NotImplementedError, "Equivalent stub for 'runResetAndBenchmark' from scripts/reset-and-benchmark-polyglot-runtime.js"
      end

      def self.to_posix(*args)
        raise NotImplementedError, "Equivalent stub for 'toPosix' from scripts/reset-and-benchmark-polyglot-runtime.js"
      end

      def self.to_slug(*args)
        raise NotImplementedError, "Equivalent stub for 'toSlug' from scripts/reset-and-benchmark-polyglot-runtime.js"
      end

      def self.write_json(*args)
        raise NotImplementedError, "Equivalent stub for 'writeJson' from scripts/reset-and-benchmark-polyglot-runtime.js"
      end
    end
  end
end
