# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "scripts/docs-freshness-check.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "ensureDirForFile",
  "git",
  "main",
  "normalizePath",
  "parseArgs",
  "readChangedFiles",
  "ruleMatched"
]
      SYMBOL_MAP = {
  "ensureDirForFile": "ensure_dir_for_file",
  "git": "git",
  "main": "main",
  "normalizePath": "normalize_path",
  "parseArgs": "parse_args",
  "readChangedFiles": "read_changed_files",
  "ruleMatched": "rule_matched"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.ensure_dir_for_file(*args)
        raise NotImplementedError, "Equivalent stub for 'ensureDirForFile' from scripts/docs-freshness-check.js"
      end

      def self.git(*args)
        raise NotImplementedError, "Equivalent stub for 'git' from scripts/docs-freshness-check.js"
      end

      def self.main(*args)
        raise NotImplementedError, "Equivalent stub for 'main' from scripts/docs-freshness-check.js"
      end

      def self.normalize_path(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizePath' from scripts/docs-freshness-check.js"
      end

      def self.parse_args(*args)
        raise NotImplementedError, "Equivalent stub for 'parseArgs' from scripts/docs-freshness-check.js"
      end

      def self.read_changed_files(*args)
        raise NotImplementedError, "Equivalent stub for 'readChangedFiles' from scripts/docs-freshness-check.js"
      end

      def self.rule_matched(*args)
        raise NotImplementedError, "Equivalent stub for 'ruleMatched' from scripts/docs-freshness-check.js"
      end
    end
  end
end
