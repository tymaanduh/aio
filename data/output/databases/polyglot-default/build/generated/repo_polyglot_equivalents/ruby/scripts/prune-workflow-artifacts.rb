# frozen_string_literal: true

require_relative "../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "scripts/prune-workflow-artifacts.js"
      EQUIVALENT_KIND = "repo_module_proxy"
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

      def self.collect_directories_by_name(*args, **kwargs)
        invoke_source_function("collectDirectoriesByName", *args, **kwargs)
      end

      def self.collect_files_by_predicate(*args, **kwargs)
        invoke_source_function("collectFilesByPredicate", *args, **kwargs)
      end

      def self.main(*args, **kwargs)
        invoke_source_function("main", *args, **kwargs)
      end

      def self.normalize_path(*args, **kwargs)
        invoke_source_function("normalizePath", *args, **kwargs)
      end

      def self.parse_args(*args, **kwargs)
        invoke_source_function("parseArgs", *args, **kwargs)
      end

      def self.remove_paths(*args, **kwargs)
        invoke_source_function("removePaths", *args, **kwargs)
      end

      def self.to_rel(*args, **kwargs)
        invoke_source_function("toRel", *args, **kwargs)
      end

      def self.trim_ndjson(*args, **kwargs)
        invoke_source_function("trimNdjson", *args, **kwargs)
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
