# frozen_string_literal: true

require_relative "../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "scripts/generate-repo-polyglot-equivalents.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
  "buildCatalog",
  "buildCppEquivalentContent",
  "buildCppSharedRunnerContent",
  "buildLanguageSymbolMap",
  "buildPythonEquivalentContent",
  "buildPythonSharedRunnerContent",
  "buildRubyEquivalentContent",
  "buildRubySharedRunnerContent",
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
  "shouldIgnoreGeneratedPath",
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
  "buildCppSharedRunnerContent": "build_cpp_shared_runner_content",
  "buildLanguageSymbolMap": "build_language_symbol_map",
  "buildPythonEquivalentContent": "build_python_equivalent_content",
  "buildPythonSharedRunnerContent": "build_python_shared_runner_content",
  "buildRubyEquivalentContent": "build_ruby_equivalent_content",
  "buildRubySharedRunnerContent": "build_ruby_shared_runner_content",
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
  "shouldIgnoreGeneratedPath": "should_ignore_generated_path",
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

      def self.invoke_source_function(function_name, *args, **kwargs)
        Aio::RepoPolyglotEquivalents::Shared::RepoModuleProxy.invoke_js_function(
          SOURCE_JS_FILE,
          function_name,
          args,
          kwargs
        )
      end

      def self.run_source_entrypoint(args = [])
        Aio::RepoPolyglotEquivalents::Shared::RepoModuleProxy.run_js_entrypoint(SOURCE_JS_FILE, args)
      end

      def self.build_catalog(*args, **kwargs)
        invoke_source_function("buildCatalog", *args, **kwargs)
      end

      def self.build_cpp_equivalent_content(*args, **kwargs)
        invoke_source_function("buildCppEquivalentContent", *args, **kwargs)
      end

      def self.build_cpp_shared_runner_content(*args, **kwargs)
        invoke_source_function("buildCppSharedRunnerContent", *args, **kwargs)
      end

      def self.build_language_symbol_map(*args, **kwargs)
        invoke_source_function("buildLanguageSymbolMap", *args, **kwargs)
      end

      def self.build_python_equivalent_content(*args, **kwargs)
        invoke_source_function("buildPythonEquivalentContent", *args, **kwargs)
      end

      def self.build_python_shared_runner_content(*args, **kwargs)
        invoke_source_function("buildPythonSharedRunnerContent", *args, **kwargs)
      end

      def self.build_ruby_equivalent_content(*args, **kwargs)
        invoke_source_function("buildRubyEquivalentContent", *args, **kwargs)
      end

      def self.build_ruby_shared_runner_content(*args, **kwargs)
        invoke_source_function("buildRubySharedRunnerContent", *args, **kwargs)
      end

      def self.build_targets_and_entries(*args, **kwargs)
        invoke_source_function("buildTargetsAndEntries", *args, **kwargs)
      end

      def self.ensure_dir_for_file(*args, **kwargs)
        invoke_source_function("ensureDirForFile", *args, **kwargs)
      end

      def self.extract_function_tokens(*args, **kwargs)
        invoke_source_function("extractFunctionTokens", *args, **kwargs)
      end

      def self.list_files_recursive(*args, **kwargs)
        invoke_source_function("listFilesRecursive", *args, **kwargs)
      end

      def self.list_repository_js_files(*args, **kwargs)
        invoke_source_function("listRepositoryJsFiles", *args, **kwargs)
      end

      def self.main(*args, **kwargs)
        invoke_source_function("main", *args, **kwargs)
      end

      def self.normalize_catalog_for_comparison(*args, **kwargs)
        invoke_source_function("normalizeCatalogForComparison", *args, **kwargs)
      end

      def self.normalize_relative_path(*args, **kwargs)
        invoke_source_function("normalizeRelativePath", *args, **kwargs)
      end

      def self.parse_args(*args, **kwargs)
        invoke_source_function("parseArgs", *args, **kwargs)
      end

      def self.remove_stale_files(*args, **kwargs)
        invoke_source_function("removeStaleFiles", *args, **kwargs)
      end

      def self.run_check(*args, **kwargs)
        invoke_source_function("runCheck", *args, **kwargs)
      end

      def self.run_write(*args, **kwargs)
        invoke_source_function("runWrite", *args, **kwargs)
      end

      def self.should_ignore_generated_path(*args, **kwargs)
        invoke_source_function("shouldIgnoreGeneratedPath", *args, **kwargs)
      end

      def self.should_skip(*args, **kwargs)
        invoke_source_function("shouldSkip", *args, **kwargs)
      end

      def self.to_cpp_identifier(*args, **kwargs)
        invoke_source_function("toCppIdentifier", *args, **kwargs)
      end

      def self.to_namespace_path(*args, **kwargs)
        invoke_source_function("toNamespacePath", *args, **kwargs)
      end

      def self.to_posix(*args, **kwargs)
        invoke_source_function("toPosix", *args, **kwargs)
      end

      def self.to_python_identifier(*args, **kwargs)
        invoke_source_function("toPythonIdentifier", *args, **kwargs)
      end

      def self.to_ruby_identifier(*args, **kwargs)
        invoke_source_function("toRubyIdentifier", *args, **kwargs)
      end

      def self.to_snake(*args, **kwargs)
        invoke_source_function("toSnake", *args, **kwargs)
      end

      def self.unique_sorted(*args, **kwargs)
        invoke_source_function("uniqueSorted", *args, **kwargs)
      end
    end
  end
end

if __FILE__ == $PROGRAM_NAME
  args = ARGV.dup
  function_flag_index = args.index("--function")
  if function_flag_index
    function_name = args[function_flag_index + 1] || ""
    args_json_index = args.index("--args-json")
    args_json = args_json_index ? (args[args_json_index + 1] || "[]") : "[]"
    result = Aio::RepoPolyglotEquivalents::ModuleProxy.invoke_source_function(
      function_name,
      *Array(JSON.parse(args_json))
    )
    puts(JSON.generate({ ok: true, result: result }))
    exit(0)
  end

  report = Aio::RepoPolyglotEquivalents::ModuleProxy.run_source_entrypoint(ARGV)
  exit(Integer(report.fetch("exit_code", 0)))
end
