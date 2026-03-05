# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "scripts/generate-script-polyglot-equivalents.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "buildCatalog",
  "buildCppSharedRunnerContent",
  "buildCppWrapperContent",
  "buildEquivalentTargets",
  "buildPythonSharedRunnerContent",
  "buildPythonWrapperContent",
  "ensureDirForFile",
  "listGeneratedFiles",
  "listScriptSourceFiles",
  "main",
  "normalizeCatalogForComparison",
  "parseArgs",
  "readText",
  "removeStaleGeneratedFiles",
  "runCheck",
  "runWrite",
  "toPosix",
  "toSnakeCaseBaseName",
  "writeCatalog",
  "writeTargets"
]
      SYMBOL_MAP = {
  "buildCatalog": "build_catalog",
  "buildCppSharedRunnerContent": "build_cpp_shared_runner_content",
  "buildCppWrapperContent": "build_cpp_wrapper_content",
  "buildEquivalentTargets": "build_equivalent_targets",
  "buildPythonSharedRunnerContent": "build_python_shared_runner_content",
  "buildPythonWrapperContent": "build_python_wrapper_content",
  "ensureDirForFile": "ensure_dir_for_file",
  "listGeneratedFiles": "list_generated_files",
  "listScriptSourceFiles": "list_script_source_files",
  "main": "main",
  "normalizeCatalogForComparison": "normalize_catalog_for_comparison",
  "parseArgs": "parse_args",
  "readText": "read_text",
  "removeStaleGeneratedFiles": "remove_stale_generated_files",
  "runCheck": "run_check",
  "runWrite": "run_write",
  "toPosix": "to_posix",
  "toSnakeCaseBaseName": "to_snake_case_base_name",
  "writeCatalog": "write_catalog",
  "writeTargets": "write_targets"
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
        raise NotImplementedError, "Equivalent stub for 'buildCatalog' from scripts/generate-script-polyglot-equivalents.js"
      end

      def self.build_cpp_shared_runner_content(*args)
        raise NotImplementedError, "Equivalent stub for 'buildCppSharedRunnerContent' from scripts/generate-script-polyglot-equivalents.js"
      end

      def self.build_cpp_wrapper_content(*args)
        raise NotImplementedError, "Equivalent stub for 'buildCppWrapperContent' from scripts/generate-script-polyglot-equivalents.js"
      end

      def self.build_equivalent_targets(*args)
        raise NotImplementedError, "Equivalent stub for 'buildEquivalentTargets' from scripts/generate-script-polyglot-equivalents.js"
      end

      def self.build_python_shared_runner_content(*args)
        raise NotImplementedError, "Equivalent stub for 'buildPythonSharedRunnerContent' from scripts/generate-script-polyglot-equivalents.js"
      end

      def self.build_python_wrapper_content(*args)
        raise NotImplementedError, "Equivalent stub for 'buildPythonWrapperContent' from scripts/generate-script-polyglot-equivalents.js"
      end

      def self.ensure_dir_for_file(*args)
        raise NotImplementedError, "Equivalent stub for 'ensureDirForFile' from scripts/generate-script-polyglot-equivalents.js"
      end

      def self.list_generated_files(*args)
        raise NotImplementedError, "Equivalent stub for 'listGeneratedFiles' from scripts/generate-script-polyglot-equivalents.js"
      end

      def self.list_script_source_files(*args)
        raise NotImplementedError, "Equivalent stub for 'listScriptSourceFiles' from scripts/generate-script-polyglot-equivalents.js"
      end

      def self.main(*args)
        raise NotImplementedError, "Equivalent stub for 'main' from scripts/generate-script-polyglot-equivalents.js"
      end

      def self.normalize_catalog_for_comparison(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizeCatalogForComparison' from scripts/generate-script-polyglot-equivalents.js"
      end

      def self.parse_args(*args)
        raise NotImplementedError, "Equivalent stub for 'parseArgs' from scripts/generate-script-polyglot-equivalents.js"
      end

      def self.read_text(*args)
        raise NotImplementedError, "Equivalent stub for 'readText' from scripts/generate-script-polyglot-equivalents.js"
      end

      def self.remove_stale_generated_files(*args)
        raise NotImplementedError, "Equivalent stub for 'removeStaleGeneratedFiles' from scripts/generate-script-polyglot-equivalents.js"
      end

      def self.run_check(*args)
        raise NotImplementedError, "Equivalent stub for 'runCheck' from scripts/generate-script-polyglot-equivalents.js"
      end

      def self.run_write(*args)
        raise NotImplementedError, "Equivalent stub for 'runWrite' from scripts/generate-script-polyglot-equivalents.js"
      end

      def self.to_posix(*args)
        raise NotImplementedError, "Equivalent stub for 'toPosix' from scripts/generate-script-polyglot-equivalents.js"
      end

      def self.to_snake_case_base_name(*args)
        raise NotImplementedError, "Equivalent stub for 'toSnakeCaseBaseName' from scripts/generate-script-polyglot-equivalents.js"
      end

      def self.write_catalog(*args)
        raise NotImplementedError, "Equivalent stub for 'writeCatalog' from scripts/generate-script-polyglot-equivalents.js"
      end

      def self.write_targets(*args)
        raise NotImplementedError, "Equivalent stub for 'writeTargets' from scripts/generate-script-polyglot-equivalents.js"
      end
    end
  end
end
