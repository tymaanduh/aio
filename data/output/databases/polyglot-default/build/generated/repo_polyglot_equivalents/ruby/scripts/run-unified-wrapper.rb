# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "scripts/run-unified-wrapper.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "ids",
  "parseArgs",
  "parseCsv",
  "parseJsonObject",
  "printHelpAndExit",
  "readJsonFile",
  "run"
]
      SYMBOL_MAP = {
  "ids": "ids",
  "parseArgs": "parse_args",
  "parseCsv": "parse_csv",
  "parseJsonObject": "parse_json_object",
  "printHelpAndExit": "print_help_and_exit",
  "readJsonFile": "read_json_file",
  "run": "run"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.ids(*args)
        raise NotImplementedError, "Equivalent stub for 'ids' from scripts/run-unified-wrapper.js"
      end

      def self.parse_args(*args)
        raise NotImplementedError, "Equivalent stub for 'parseArgs' from scripts/run-unified-wrapper.js"
      end

      def self.parse_csv(*args)
        raise NotImplementedError, "Equivalent stub for 'parseCsv' from scripts/run-unified-wrapper.js"
      end

      def self.parse_json_object(*args)
        raise NotImplementedError, "Equivalent stub for 'parseJsonObject' from scripts/run-unified-wrapper.js"
      end

      def self.print_help_and_exit(*args)
        raise NotImplementedError, "Equivalent stub for 'printHelpAndExit' from scripts/run-unified-wrapper.js"
      end

      def self.read_json_file(*args)
        raise NotImplementedError, "Equivalent stub for 'readJsonFile' from scripts/run-unified-wrapper.js"
      end

      def self.run(*args)
        raise NotImplementedError, "Equivalent stub for 'run' from scripts/run-unified-wrapper.js"
      end
    end
  end
end
