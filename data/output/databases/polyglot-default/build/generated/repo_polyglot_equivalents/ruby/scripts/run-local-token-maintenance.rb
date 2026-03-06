# frozen_string_literal: true

require_relative "../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "scripts/run-local-token-maintenance.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
  "buildEfficiencySummary",
  "buildMarkdown",
  "commandText",
  "ensureDirForFile",
  "main",
  "normalizePath",
  "parseArgs",
  "readJsonIfExists",
  "runLocalTokenMaintenance",
  "runTask"
]
      SYMBOL_MAP = {
  "buildEfficiencySummary": "build_efficiency_summary",
  "buildMarkdown": "build_markdown",
  "commandText": "command_text",
  "ensureDirForFile": "ensure_dir_for_file",
  "main": "main",
  "normalizePath": "normalize_path",
  "parseArgs": "parse_args",
  "readJsonIfExists": "read_json_if_exists",
  "runLocalTokenMaintenance": "run_local_token_maintenance",
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

      def self.build_efficiency_summary(*args, **kwargs)
        invoke_source_function("buildEfficiencySummary", *args, **kwargs)
      end

      def self.build_markdown(*args, **kwargs)
        invoke_source_function("buildMarkdown", *args, **kwargs)
      end

      def self.command_text(*args, **kwargs)
        invoke_source_function("commandText", *args, **kwargs)
      end

      def self.ensure_dir_for_file(*args, **kwargs)
        invoke_source_function("ensureDirForFile", *args, **kwargs)
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

      def self.read_json_if_exists(*args, **kwargs)
        invoke_source_function("readJsonIfExists", *args, **kwargs)
      end

      def self.run_local_token_maintenance(*args, **kwargs)
        invoke_source_function("runLocalTokenMaintenance", *args, **kwargs)
      end

      def self.run_task(*args, **kwargs)
        invoke_source_function("runTask", *args, **kwargs)
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
