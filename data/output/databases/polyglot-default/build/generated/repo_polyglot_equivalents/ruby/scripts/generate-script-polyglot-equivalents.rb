# frozen_string_literal: true

require_relative "../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "scripts/generate-script-polyglot-equivalents.js"
      EQUIVALENT_KIND = "repo_module_proxy"
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

      def self.build_cpp_shared_runner_content(*args, **kwargs)
        invoke_source_function("buildCppSharedRunnerContent", *args, **kwargs)
      end

      def self.build_cpp_wrapper_content(*args, **kwargs)
        invoke_source_function("buildCppWrapperContent", *args, **kwargs)
      end

      def self.build_equivalent_targets(*args, **kwargs)
        invoke_source_function("buildEquivalentTargets", *args, **kwargs)
      end

      def self.build_python_shared_runner_content(*args, **kwargs)
        invoke_source_function("buildPythonSharedRunnerContent", *args, **kwargs)
      end

      def self.build_python_wrapper_content(*args, **kwargs)
        invoke_source_function("buildPythonWrapperContent", *args, **kwargs)
      end

      def self.ensure_dir_for_file(*args, **kwargs)
        invoke_source_function("ensureDirForFile", *args, **kwargs)
      end

      def self.list_generated_files(*args, **kwargs)
        invoke_source_function("listGeneratedFiles", *args, **kwargs)
      end

      def self.list_script_source_files(*args, **kwargs)
        invoke_source_function("listScriptSourceFiles", *args, **kwargs)
      end

      def self.main(*args, **kwargs)
        invoke_source_function("main", *args, **kwargs)
      end

      def self.normalize_catalog_for_comparison(*args, **kwargs)
        invoke_source_function("normalizeCatalogForComparison", *args, **kwargs)
      end

      def self.parse_args(*args, **kwargs)
        invoke_source_function("parseArgs", *args, **kwargs)
      end

      def self.read_text(*args, **kwargs)
        invoke_source_function("readText", *args, **kwargs)
      end

      def self.remove_stale_generated_files(*args, **kwargs)
        invoke_source_function("removeStaleGeneratedFiles", *args, **kwargs)
      end

      def self.run_check(*args, **kwargs)
        invoke_source_function("runCheck", *args, **kwargs)
      end

      def self.run_write(*args, **kwargs)
        invoke_source_function("runWrite", *args, **kwargs)
      end

      def self.to_posix(*args, **kwargs)
        invoke_source_function("toPosix", *args, **kwargs)
      end

      def self.to_snake_case_base_name(*args, **kwargs)
        invoke_source_function("toSnakeCaseBaseName", *args, **kwargs)
      end

      def self.write_catalog(*args, **kwargs)
        invoke_source_function("writeCatalog", *args, **kwargs)
      end

      def self.write_targets(*args, **kwargs)
        invoke_source_function("writeTargets", *args, **kwargs)
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
