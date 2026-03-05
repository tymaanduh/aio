# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "scripts/generate-repo-polyglot-equivalents.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "buildCatalog",
  "buildCppEquivalentContent",
  "buildLanguageSymbolMap",
  "buildPythonEquivalentContent",
  "buildRubyEquivalentContent",
  "buildTargetsAndEntries",
  "ensureDirForFile",
  "extractFunctionTokens",
  "listFilesRecursive",
  "listRepositoryJsFiles",
  "main",
  "normalizeCatalogForComparison",
  "normalizeRelativePath",
  "parseArgs",
  "removeStaleFiles",
  "runCheck",
  "runWrite",
  "shouldSkip",
  "toCppIdentifier",
  "toNamespacePath",
  "toPosix",
  "toPythonIdentifier",
  "toRubyIdentifier",
  "toSnake",
  "uniqueSorted"
]
      SYMBOL_MAP = {
  "buildCatalog": "build_catalog",
  "buildCppEquivalentContent": "build_cpp_equivalent_content",
  "buildLanguageSymbolMap": "build_language_symbol_map",
  "buildPythonEquivalentContent": "build_python_equivalent_content",
  "buildRubyEquivalentContent": "build_ruby_equivalent_content",
  "buildTargetsAndEntries": "build_targets_and_entries",
  "ensureDirForFile": "ensure_dir_for_file",
  "extractFunctionTokens": "extract_function_tokens",
  "listFilesRecursive": "list_files_recursive",
  "listRepositoryJsFiles": "list_repository_js_files",
  "main": "main",
  "normalizeCatalogForComparison": "normalize_catalog_for_comparison",
  "normalizeRelativePath": "normalize_relative_path",
  "parseArgs": "parse_args",
  "removeStaleFiles": "remove_stale_files",
  "runCheck": "run_check",
  "runWrite": "run_write",
  "shouldSkip": "should_skip",
  "toCppIdentifier": "to_cpp_identifier",
  "toNamespacePath": "to_namespace_path",
  "toPosix": "to_posix",
  "toPythonIdentifier": "to_python_identifier",
  "toRubyIdentifier": "to_ruby_identifier",
  "toSnake": "to_snake",
  "uniqueSorted": "unique_sorted"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.build_catalog(*args)
        raise NotImplementedError, "Equivalent stub for 'buildCatalog' from scripts/generate-repo-polyglot-equivalents.js"
      end

      def self.build_cpp_equivalent_content(*args)
        raise NotImplementedError, "Equivalent stub for 'buildCppEquivalentContent' from scripts/generate-repo-polyglot-equivalents.js"
      end

      def self.build_language_symbol_map(*args)
        raise NotImplementedError, "Equivalent stub for 'buildLanguageSymbolMap' from scripts/generate-repo-polyglot-equivalents.js"
      end

      def self.build_python_equivalent_content(*args)
        raise NotImplementedError, "Equivalent stub for 'buildPythonEquivalentContent' from scripts/generate-repo-polyglot-equivalents.js"
      end

      def self.build_ruby_equivalent_content(*args)
        raise NotImplementedError, "Equivalent stub for 'buildRubyEquivalentContent' from scripts/generate-repo-polyglot-equivalents.js"
      end

      def self.build_targets_and_entries(*args)
        raise NotImplementedError, "Equivalent stub for 'buildTargetsAndEntries' from scripts/generate-repo-polyglot-equivalents.js"
      end

      def self.ensure_dir_for_file(*args)
        raise NotImplementedError, "Equivalent stub for 'ensureDirForFile' from scripts/generate-repo-polyglot-equivalents.js"
      end

      def self.extract_function_tokens(*args)
        raise NotImplementedError, "Equivalent stub for 'extractFunctionTokens' from scripts/generate-repo-polyglot-equivalents.js"
      end

      def self.list_files_recursive(*args)
        raise NotImplementedError, "Equivalent stub for 'listFilesRecursive' from scripts/generate-repo-polyglot-equivalents.js"
      end

      def self.list_repository_js_files(*args)
        raise NotImplementedError, "Equivalent stub for 'listRepositoryJsFiles' from scripts/generate-repo-polyglot-equivalents.js"
      end

      def self.main(*args)
        raise NotImplementedError, "Equivalent stub for 'main' from scripts/generate-repo-polyglot-equivalents.js"
      end

      def self.normalize_catalog_for_comparison(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizeCatalogForComparison' from scripts/generate-repo-polyglot-equivalents.js"
      end

      def self.normalize_relative_path(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizeRelativePath' from scripts/generate-repo-polyglot-equivalents.js"
      end

      def self.parse_args(*args)
        raise NotImplementedError, "Equivalent stub for 'parseArgs' from scripts/generate-repo-polyglot-equivalents.js"
      end

      def self.remove_stale_files(*args)
        raise NotImplementedError, "Equivalent stub for 'removeStaleFiles' from scripts/generate-repo-polyglot-equivalents.js"
      end

      def self.run_check(*args)
        raise NotImplementedError, "Equivalent stub for 'runCheck' from scripts/generate-repo-polyglot-equivalents.js"
      end

      def self.run_write(*args)
        raise NotImplementedError, "Equivalent stub for 'runWrite' from scripts/generate-repo-polyglot-equivalents.js"
      end

      def self.should_skip(*args)
        raise NotImplementedError, "Equivalent stub for 'shouldSkip' from scripts/generate-repo-polyglot-equivalents.js"
      end

      def self.to_cpp_identifier(*args)
        raise NotImplementedError, "Equivalent stub for 'toCppIdentifier' from scripts/generate-repo-polyglot-equivalents.js"
      end

      def self.to_namespace_path(*args)
        raise NotImplementedError, "Equivalent stub for 'toNamespacePath' from scripts/generate-repo-polyglot-equivalents.js"
      end

      def self.to_posix(*args)
        raise NotImplementedError, "Equivalent stub for 'toPosix' from scripts/generate-repo-polyglot-equivalents.js"
      end

      def self.to_python_identifier(*args)
        raise NotImplementedError, "Equivalent stub for 'toPythonIdentifier' from scripts/generate-repo-polyglot-equivalents.js"
      end

      def self.to_ruby_identifier(*args)
        raise NotImplementedError, "Equivalent stub for 'toRubyIdentifier' from scripts/generate-repo-polyglot-equivalents.js"
      end

      def self.to_snake(*args)
        raise NotImplementedError, "Equivalent stub for 'toSnake' from scripts/generate-repo-polyglot-equivalents.js"
      end

      def self.unique_sorted(*args)
        raise NotImplementedError, "Equivalent stub for 'uniqueSorted' from scripts/generate-repo-polyglot-equivalents.js"
      end
    end
  end
end
