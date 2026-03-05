# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "scripts/word-machine-descriptor-compile.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "createMemoryBridgeRepository",
  "ensureDir",
  "parseArgs",
  "printHelpAndExit",
  "readJsonFile",
  "readTextFile",
  "run",
  "writeJson"
]
      SYMBOL_MAP = {
  "createMemoryBridgeRepository": "create_memory_bridge_repository",
  "ensureDir": "ensure_dir",
  "parseArgs": "parse_args",
  "printHelpAndExit": "print_help_and_exit",
  "readJsonFile": "read_json_file",
  "readTextFile": "read_text_file",
  "run": "run",
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

      def self.create_memory_bridge_repository(*args)
        raise NotImplementedError, "Equivalent stub for 'createMemoryBridgeRepository' from scripts/word-machine-descriptor-compile.js"
      end

      def self.ensure_dir(*args)
        raise NotImplementedError, "Equivalent stub for 'ensureDir' from scripts/word-machine-descriptor-compile.js"
      end

      def self.parse_args(*args)
        raise NotImplementedError, "Equivalent stub for 'parseArgs' from scripts/word-machine-descriptor-compile.js"
      end

      def self.print_help_and_exit(*args)
        raise NotImplementedError, "Equivalent stub for 'printHelpAndExit' from scripts/word-machine-descriptor-compile.js"
      end

      def self.read_json_file(*args)
        raise NotImplementedError, "Equivalent stub for 'readJsonFile' from scripts/word-machine-descriptor-compile.js"
      end

      def self.read_text_file(*args)
        raise NotImplementedError, "Equivalent stub for 'readTextFile' from scripts/word-machine-descriptor-compile.js"
      end

      def self.run(*args)
        raise NotImplementedError, "Equivalent stub for 'run' from scripts/word-machine-descriptor-compile.js"
      end

      def self.write_json(*args)
        raise NotImplementedError, "Equivalent stub for 'writeJson' from scripts/word-machine-descriptor-compile.js"
      end
    end
  end
end
