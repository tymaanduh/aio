# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "to-do/skills/polyglot-quality-benchmark-gate/scripts/run_sxs_benchmark.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "bytesForPath",
  "main",
  "median",
  "nowMs",
  "readJson",
  "runCommand",
  "safeSize"
]
      SYMBOL_MAP = {
  "bytesForPath": "bytes_for_path",
  "main": "main",
  "median": "median",
  "nowMs": "now_ms",
  "readJson": "read_json",
  "runCommand": "run_command",
  "safeSize": "safe_size"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.bytes_for_path(*args)
        raise NotImplementedError, "Equivalent stub for 'bytesForPath' from to-do/skills/polyglot-quality-benchmark-gate/scripts/run_sxs_benchmark.js"
      end

      def self.main(*args)
        raise NotImplementedError, "Equivalent stub for 'main' from to-do/skills/polyglot-quality-benchmark-gate/scripts/run_sxs_benchmark.js"
      end

      def self.median(*args)
        raise NotImplementedError, "Equivalent stub for 'median' from to-do/skills/polyglot-quality-benchmark-gate/scripts/run_sxs_benchmark.js"
      end

      def self.now_ms(*args)
        raise NotImplementedError, "Equivalent stub for 'nowMs' from to-do/skills/polyglot-quality-benchmark-gate/scripts/run_sxs_benchmark.js"
      end

      def self.read_json(*args)
        raise NotImplementedError, "Equivalent stub for 'readJson' from to-do/skills/polyglot-quality-benchmark-gate/scripts/run_sxs_benchmark.js"
      end

      def self.run_command(*args)
        raise NotImplementedError, "Equivalent stub for 'runCommand' from to-do/skills/polyglot-quality-benchmark-gate/scripts/run_sxs_benchmark.js"
      end

      def self.safe_size(*args)
        raise NotImplementedError, "Equivalent stub for 'safeSize' from to-do/skills/polyglot-quality-benchmark-gate/scripts/run_sxs_benchmark.js"
      end
    end
  end
end
