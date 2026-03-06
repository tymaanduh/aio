# frozen_string_literal: true

require_relative "../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "scripts/generate-file-catalog-docs.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
  "buildBucketSummary",
  "buildMarkdown",
  "classifyFile",
  "collectFileRows",
  "escapePipes",
  "generate",
  "main",
  "normalizePath",
  "parseArgs",
  "shouldIgnoreDir",
  "sumBytes",
  "toBytesLabel",
  "toRelative"
]
      SYMBOL_MAP = {
  "buildBucketSummary": "build_bucket_summary",
  "buildMarkdown": "build_markdown",
  "classifyFile": "classify_file",
  "collectFileRows": "collect_file_rows",
  "escapePipes": "escape_pipes",
  "generate": "generate",
  "main": "main",
  "normalizePath": "normalize_path",
  "parseArgs": "parse_args",
  "shouldIgnoreDir": "should_ignore_dir",
  "sumBytes": "sum_bytes",
  "toBytesLabel": "to_bytes_label",
  "toRelative": "to_relative"
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

      def self.build_bucket_summary(*args, **kwargs)
        invoke_source_function("buildBucketSummary", *args, **kwargs)
      end

      def self.build_markdown(*args, **kwargs)
        invoke_source_function("buildMarkdown", *args, **kwargs)
      end

      def self.classify_file(*args, **kwargs)
        invoke_source_function("classifyFile", *args, **kwargs)
      end

      def self.collect_file_rows(*args, **kwargs)
        invoke_source_function("collectFileRows", *args, **kwargs)
      end

      def self.escape_pipes(*args, **kwargs)
        invoke_source_function("escapePipes", *args, **kwargs)
      end

      def self.generate(*args, **kwargs)
        invoke_source_function("generate", *args, **kwargs)
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

      def self.should_ignore_dir(*args, **kwargs)
        invoke_source_function("shouldIgnoreDir", *args, **kwargs)
      end

      def self.sum_bytes(*args, **kwargs)
        invoke_source_function("sumBytes", *args, **kwargs)
      end

      def self.to_bytes_label(*args, **kwargs)
        invoke_source_function("toBytesLabel", *args, **kwargs)
      end

      def self.to_relative(*args, **kwargs)
        invoke_source_function("toRelative", *args, **kwargs)
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
