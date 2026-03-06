# frozen_string_literal: true

require_relative "../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "scripts/repo-polyglot-module-bridge.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
  "main",
  "normalizeArgsList",
  "normalizeJsPath",
  "normalizeKwargs",
  "parseArgs",
  "parsePayload",
  "readPayloadText",
  "resolveFunctionCandidate",
  "runEntrypoint",
  "runInvokeFunction",
  "runPayload",
  "sanitizeForJson",
  "truncateText"
]
      SYMBOL_MAP = {
  "main": "main",
  "normalizeArgsList": "normalize_args_list",
  "normalizeJsPath": "normalize_js_path",
  "normalizeKwargs": "normalize_kwargs",
  "parseArgs": "parse_args",
  "parsePayload": "parse_payload",
  "readPayloadText": "read_payload_text",
  "resolveFunctionCandidate": "resolve_function_candidate",
  "runEntrypoint": "run_entrypoint",
  "runInvokeFunction": "run_invoke_function",
  "runPayload": "run_payload",
  "sanitizeForJson": "sanitize_for_json",
  "truncateText": "truncate_text"
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

      def self.normalize_args_list(*args, **kwargs)
        invoke_source_function("normalizeArgsList", *args, **kwargs)
      end

      def self.normalize_js_path(*args, **kwargs)
        invoke_source_function("normalizeJsPath", *args, **kwargs)
      end

      def self.normalize_kwargs(*args, **kwargs)
        invoke_source_function("normalizeKwargs", *args, **kwargs)
      end

      def self.parse_args(*args, **kwargs)
        invoke_source_function("parseArgs", *args, **kwargs)
      end

      def self.parse_payload(*args, **kwargs)
        invoke_source_function("parsePayload", *args, **kwargs)
      end

      def self.read_payload_text(*args, **kwargs)
        invoke_source_function("readPayloadText", *args, **kwargs)
      end

      def self.resolve_function_candidate(*args, **kwargs)
        invoke_source_function("resolveFunctionCandidate", *args, **kwargs)
      end

      def self.run_entrypoint(*args, **kwargs)
        invoke_source_function("runEntrypoint", *args, **kwargs)
      end

      def self.run_invoke_function(*args, **kwargs)
        invoke_source_function("runInvokeFunction", *args, **kwargs)
      end

      def self.run_payload(*args, **kwargs)
        invoke_source_function("runPayload", *args, **kwargs)
      end

      def self.sanitize_for_json(*args, **kwargs)
        invoke_source_function("sanitizeForJson", *args, **kwargs)
      end

      def self.truncate_text(*args, **kwargs)
        invoke_source_function("truncateText", *args, **kwargs)
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
