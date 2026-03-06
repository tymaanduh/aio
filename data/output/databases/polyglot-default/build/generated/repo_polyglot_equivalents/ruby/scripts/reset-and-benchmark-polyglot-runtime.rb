# frozen_string_literal: true

require_relative "../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "scripts/reset-and-benchmark-polyglot-runtime.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
  "main",
  "parseArgs",
  "printHelpAndExit",
  "removePathIfExists",
  "runResetAndBenchmark",
  "toPosix",
  "toSlug",
  "writeJson"
]
      SYMBOL_MAP = {
  "main": "main",
  "parseArgs": "parse_args",
  "printHelpAndExit": "print_help_and_exit",
  "removePathIfExists": "remove_path_if_exists",
  "runResetAndBenchmark": "run_reset_and_benchmark",
  "toPosix": "to_posix",
  "toSlug": "to_slug",
  "writeJson": "write_json"
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

      def self.main(*args, **kwargs)
        invoke_source_function("main", *args, **kwargs)
      end

      def self.parse_args(*args, **kwargs)
        invoke_source_function("parseArgs", *args, **kwargs)
      end

      def self.print_help_and_exit(*args, **kwargs)
        invoke_source_function("printHelpAndExit", *args, **kwargs)
      end

      def self.remove_path_if_exists(*args, **kwargs)
        invoke_source_function("removePathIfExists", *args, **kwargs)
      end

      def self.run_reset_and_benchmark(*args, **kwargs)
        invoke_source_function("runResetAndBenchmark", *args, **kwargs)
      end

      def self.to_posix(*args, **kwargs)
        invoke_source_function("toPosix", *args, **kwargs)
      end

      def self.to_slug(*args, **kwargs)
        invoke_source_function("toSlug", *args, **kwargs)
      end

      def self.write_json(*args, **kwargs)
        invoke_source_function("writeJson", *args, **kwargs)
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
