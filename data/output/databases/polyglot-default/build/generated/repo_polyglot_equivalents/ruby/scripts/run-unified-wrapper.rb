# frozen_string_literal: true

require_relative "../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "scripts/run-unified-wrapper.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
  "ids",
  "parseArgs",
  "parseCsv",
  "parseJsonObject",
  "printHelpAndExit",
  "readJsonFile",
  "run"
]
      SYMBOL_MAP = {
  "ids": "ids",
  "parseArgs": "parse_args",
  "parseCsv": "parse_csv",
  "parseJsonObject": "parse_json_object",
  "printHelpAndExit": "print_help_and_exit",
  "readJsonFile": "read_json_file",
  "run": "run"
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

      def self.ids(*args, **kwargs)
        invoke_source_function("ids", *args, **kwargs)
      end

      def self.parse_args(*args, **kwargs)
        invoke_source_function("parseArgs", *args, **kwargs)
      end

      def self.parse_csv(*args, **kwargs)
        invoke_source_function("parseCsv", *args, **kwargs)
      end

      def self.parse_json_object(*args, **kwargs)
        invoke_source_function("parseJsonObject", *args, **kwargs)
      end

      def self.print_help_and_exit(*args, **kwargs)
        invoke_source_function("printHelpAndExit", *args, **kwargs)
      end

      def self.read_json_file(*args, **kwargs)
        invoke_source_function("readJsonFile", *args, **kwargs)
      end

      def self.run(*args, **kwargs)
        invoke_source_function("run", *args, **kwargs)
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
