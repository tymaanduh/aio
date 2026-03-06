# frozen_string_literal: true

require_relative "../../../../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "scripts/polyglot/swaps/cpp/cpp_node_bridge.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
  "buildBridgeBinary",
  "commandExists",
  "main",
  "parseArgs",
  "resolveCompiler",
  "runCommand",
  "shouldRebuildBinary"
]
      SYMBOL_MAP = {
  "buildBridgeBinary": "build_bridge_binary",
  "commandExists": "command_exists",
  "main": "main",
  "parseArgs": "parse_args",
  "resolveCompiler": "resolve_compiler",
  "runCommand": "run_command",
  "shouldRebuildBinary": "should_rebuild_binary"
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

      def self.build_bridge_binary(*args, **kwargs)
        invoke_source_function("buildBridgeBinary", *args, **kwargs)
      end

      def self.command_exists(*args, **kwargs)
        invoke_source_function("commandExists", *args, **kwargs)
      end

      def self.main(*args, **kwargs)
        invoke_source_function("main", *args, **kwargs)
      end

      def self.parse_args(*args, **kwargs)
        invoke_source_function("parseArgs", *args, **kwargs)
      end

      def self.resolve_compiler(*args, **kwargs)
        invoke_source_function("resolveCompiler", *args, **kwargs)
      end

      def self.run_command(*args, **kwargs)
        invoke_source_function("runCommand", *args, **kwargs)
      end

      def self.should_rebuild_binary(*args, **kwargs)
        invoke_source_function("shouldRebuildBinary", *args, **kwargs)
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
