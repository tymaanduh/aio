# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "scripts/data-separation-audit.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "classifyConstant",
  "collectJsFiles",
  "detectCandidatesInFile",
  "ensureDir",
  "isIgnoredPath",
  "main",
  "normalizePath",
  "nowIso",
  "parseArgs",
  "printHelpAndExit",
  "summarizeByPath",
  "toRelativePath"
]
      SYMBOL_MAP = {
  "classifyConstant": "classify_constant",
  "collectJsFiles": "collect_js_files",
  "detectCandidatesInFile": "detect_candidates_in_file",
  "ensureDir": "ensure_dir",
  "isIgnoredPath": "is_ignored_path",
  "main": "main",
  "normalizePath": "normalize_path",
  "nowIso": "now_iso",
  "parseArgs": "parse_args",
  "printHelpAndExit": "print_help_and_exit",
  "summarizeByPath": "summarize_by_path",
  "toRelativePath": "to_relative_path"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.classify_constant(*args)
        raise NotImplementedError, "Equivalent stub for 'classifyConstant' from scripts/data-separation-audit.js"
      end

      def self.collect_js_files(*args)
        raise NotImplementedError, "Equivalent stub for 'collectJsFiles' from scripts/data-separation-audit.js"
      end

      def self.detect_candidates_in_file(*args)
        raise NotImplementedError, "Equivalent stub for 'detectCandidatesInFile' from scripts/data-separation-audit.js"
      end

      def self.ensure_dir(*args)
        raise NotImplementedError, "Equivalent stub for 'ensureDir' from scripts/data-separation-audit.js"
      end

      def self.is_ignored_path(*args)
        raise NotImplementedError, "Equivalent stub for 'isIgnoredPath' from scripts/data-separation-audit.js"
      end

      def self.main(*args)
        raise NotImplementedError, "Equivalent stub for 'main' from scripts/data-separation-audit.js"
      end

      def self.normalize_path(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizePath' from scripts/data-separation-audit.js"
      end

      def self.now_iso(*args)
        raise NotImplementedError, "Equivalent stub for 'nowIso' from scripts/data-separation-audit.js"
      end

      def self.parse_args(*args)
        raise NotImplementedError, "Equivalent stub for 'parseArgs' from scripts/data-separation-audit.js"
      end

      def self.print_help_and_exit(*args)
        raise NotImplementedError, "Equivalent stub for 'printHelpAndExit' from scripts/data-separation-audit.js"
      end

      def self.summarize_by_path(*args)
        raise NotImplementedError, "Equivalent stub for 'summarizeByPath' from scripts/data-separation-audit.js"
      end

      def self.to_relative_path(*args)
        raise NotImplementedError, "Equivalent stub for 'toRelativePath' from scripts/data-separation-audit.js"
      end
    end
  end
end
