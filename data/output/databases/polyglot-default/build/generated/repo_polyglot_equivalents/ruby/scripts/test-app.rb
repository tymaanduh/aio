# frozen_string_literal: true

require_relative "../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "scripts/test-app.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
  "connectWs",
  "evaluate",
  "fail",
  "getTargets",
  "handler",
  "ok",
  "runTests",
  "sendCommand"
]
      SYMBOL_MAP = {
  "connectWs": "connect_ws",
  "evaluate": "evaluate",
  "fail": "fail",
  "getTargets": "get_targets",
  "handler": "handler",
  "ok": "ok",
  "runTests": "run_tests",
  "sendCommand": "send_command"
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

      def self.connect_ws(*args, **kwargs)
        invoke_source_function("connectWs", *args, **kwargs)
      end

      def self.evaluate(*args, **kwargs)
        invoke_source_function("evaluate", *args, **kwargs)
      end

      def self.fail(*args, **kwargs)
        invoke_source_function("fail", *args, **kwargs)
      end

      def self.get_targets(*args, **kwargs)
        invoke_source_function("getTargets", *args, **kwargs)
      end

      def self.handler(*args, **kwargs)
        invoke_source_function("handler", *args, **kwargs)
      end

      def self.ok(*args, **kwargs)
        invoke_source_function("ok", *args, **kwargs)
      end

      def self.run_tests(*args, **kwargs)
        invoke_source_function("runTests", *args, **kwargs)
      end

      def self.send_command(*args, **kwargs)
        invoke_source_function("sendCommand", *args, **kwargs)
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
