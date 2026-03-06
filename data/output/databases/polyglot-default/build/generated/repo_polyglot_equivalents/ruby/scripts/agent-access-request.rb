# frozen_string_literal: true

require_relative "../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "scripts/agent-access-request.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
  "appendRequestLog",
  "createRequestId",
  "ensureParentDir",
  "nowIso",
  "parseArgs",
  "printHelpAndExit",
  "readPolicy",
  "resolveLogFile",
  "run",
  "toUniqueSorted",
  "validateRequest"
]
      SYMBOL_MAP = {
  "appendRequestLog": "append_request_log",
  "createRequestId": "create_request_id",
  "ensureParentDir": "ensure_parent_dir",
  "nowIso": "now_iso",
  "parseArgs": "parse_args",
  "printHelpAndExit": "print_help_and_exit",
  "readPolicy": "read_policy",
  "resolveLogFile": "resolve_log_file",
  "run": "run",
  "toUniqueSorted": "to_unique_sorted",
  "validateRequest": "validate_request"
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

      def self.append_request_log(*args, **kwargs)
        invoke_source_function("appendRequestLog", *args, **kwargs)
      end

      def self.create_request_id(*args, **kwargs)
        invoke_source_function("createRequestId", *args, **kwargs)
      end

      def self.ensure_parent_dir(*args, **kwargs)
        invoke_source_function("ensureParentDir", *args, **kwargs)
      end

      def self.now_iso(*args, **kwargs)
        invoke_source_function("nowIso", *args, **kwargs)
      end

      def self.parse_args(*args, **kwargs)
        invoke_source_function("parseArgs", *args, **kwargs)
      end

      def self.print_help_and_exit(*args, **kwargs)
        invoke_source_function("printHelpAndExit", *args, **kwargs)
      end

      def self.read_policy(*args, **kwargs)
        invoke_source_function("readPolicy", *args, **kwargs)
      end

      def self.resolve_log_file(*args, **kwargs)
        invoke_source_function("resolveLogFile", *args, **kwargs)
      end

      def self.run(*args, **kwargs)
        invoke_source_function("run", *args, **kwargs)
      end

      def self.to_unique_sorted(*args, **kwargs)
        invoke_source_function("toUniqueSorted", *args, **kwargs)
      end

      def self.validate_request(*args, **kwargs)
        invoke_source_function("validateRequest", *args, **kwargs)
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
