# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "scripts/run-local-governance.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "buildMarkdown",
  "commandText",
  "ensureDirForFile",
  "main",
  "normalizePath",
  "parseArgs",
  "runLocalGovernance",
  "runTask"
]
      SYMBOL_MAP = {
  "buildMarkdown": "build_markdown",
  "commandText": "command_text",
  "ensureDirForFile": "ensure_dir_for_file",
  "main": "main",
  "normalizePath": "normalize_path",
  "parseArgs": "parse_args",
  "runLocalGovernance": "run_local_governance",
  "runTask": "run_task"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.build_markdown(*args)
        raise NotImplementedError, "Equivalent stub for 'buildMarkdown' from scripts/run-local-governance.js"
      end

      def self.command_text(*args)
        raise NotImplementedError, "Equivalent stub for 'commandText' from scripts/run-local-governance.js"
      end

      def self.ensure_dir_for_file(*args)
        raise NotImplementedError, "Equivalent stub for 'ensureDirForFile' from scripts/run-local-governance.js"
      end

      def self.main(*args)
        raise NotImplementedError, "Equivalent stub for 'main' from scripts/run-local-governance.js"
      end

      def self.normalize_path(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizePath' from scripts/run-local-governance.js"
      end

      def self.parse_args(*args)
        raise NotImplementedError, "Equivalent stub for 'parseArgs' from scripts/run-local-governance.js"
      end

      def self.run_local_governance(*args)
        raise NotImplementedError, "Equivalent stub for 'runLocalGovernance' from scripts/run-local-governance.js"
      end

      def self.run_task(*args)
        raise NotImplementedError, "Equivalent stub for 'runTask' from scripts/run-local-governance.js"
      end
    end
  end
end
