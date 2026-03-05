# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "scripts/prune-workflow-artifacts.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "collectDirectoriesByName",
  "collectFilesByPredicate",
  "main",
  "normalizePath",
  "parseArgs",
  "removePaths",
  "toRel",
  "trimNdjson"
]
      SYMBOL_MAP = {
  "collectDirectoriesByName": "collect_directories_by_name",
  "collectFilesByPredicate": "collect_files_by_predicate",
  "main": "main",
  "normalizePath": "normalize_path",
  "parseArgs": "parse_args",
  "removePaths": "remove_paths",
  "toRel": "to_rel",
  "trimNdjson": "trim_ndjson"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.collect_directories_by_name(*args)
        raise NotImplementedError, "Equivalent stub for 'collectDirectoriesByName' from scripts/prune-workflow-artifacts.js"
      end

      def self.collect_files_by_predicate(*args)
        raise NotImplementedError, "Equivalent stub for 'collectFilesByPredicate' from scripts/prune-workflow-artifacts.js"
      end

      def self.main(*args)
        raise NotImplementedError, "Equivalent stub for 'main' from scripts/prune-workflow-artifacts.js"
      end

      def self.normalize_path(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizePath' from scripts/prune-workflow-artifacts.js"
      end

      def self.parse_args(*args)
        raise NotImplementedError, "Equivalent stub for 'parseArgs' from scripts/prune-workflow-artifacts.js"
      end

      def self.remove_paths(*args)
        raise NotImplementedError, "Equivalent stub for 'removePaths' from scripts/prune-workflow-artifacts.js"
      end

      def self.to_rel(*args)
        raise NotImplementedError, "Equivalent stub for 'toRel' from scripts/prune-workflow-artifacts.js"
      end

      def self.trim_ndjson(*args)
        raise NotImplementedError, "Equivalent stub for 'trimNdjson' from scripts/prune-workflow-artifacts.js"
      end
    end
  end
end
