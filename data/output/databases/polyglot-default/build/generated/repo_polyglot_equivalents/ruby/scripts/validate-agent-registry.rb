# frozen_string_literal: true

require_relative "../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "scripts/validate-agent-registry.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
  "buildReport",
  "compareArray",
  "findSinglePath",
  "main",
  "normalizeList",
  "normalizeScopeGuardrailsCatalog",
  "parseArgs",
  "readYaml",
  "resolveAccessAllowedPaths",
  "resolveScopeGuardrails"
]
      SYMBOL_MAP = {
  "buildReport": "build_report",
  "compareArray": "compare_array",
  "findSinglePath": "find_single_path",
  "main": "main",
  "normalizeList": "normalize_list",
  "normalizeScopeGuardrailsCatalog": "normalize_scope_guardrails_catalog",
  "parseArgs": "parse_args",
  "readYaml": "read_yaml",
  "resolveAccessAllowedPaths": "resolve_access_allowed_paths",
  "resolveScopeGuardrails": "resolve_scope_guardrails"
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

      def self.build_report(*args, **kwargs)
        invoke_source_function("buildReport", *args, **kwargs)
      end

      def self.compare_array(*args, **kwargs)
        invoke_source_function("compareArray", *args, **kwargs)
      end

      def self.find_single_path(*args, **kwargs)
        invoke_source_function("findSinglePath", *args, **kwargs)
      end

      def self.main(*args, **kwargs)
        invoke_source_function("main", *args, **kwargs)
      end

      def self.normalize_list(*args, **kwargs)
        invoke_source_function("normalizeList", *args, **kwargs)
      end

      def self.normalize_scope_guardrails_catalog(*args, **kwargs)
        invoke_source_function("normalizeScopeGuardrailsCatalog", *args, **kwargs)
      end

      def self.parse_args(*args, **kwargs)
        invoke_source_function("parseArgs", *args, **kwargs)
      end

      def self.read_yaml(*args, **kwargs)
        invoke_source_function("readYaml", *args, **kwargs)
      end

      def self.resolve_access_allowed_paths(*args, **kwargs)
        invoke_source_function("resolveAccessAllowedPaths", *args, **kwargs)
      end

      def self.resolve_scope_guardrails(*args, **kwargs)
        invoke_source_function("resolveScopeGuardrails", *args, **kwargs)
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
