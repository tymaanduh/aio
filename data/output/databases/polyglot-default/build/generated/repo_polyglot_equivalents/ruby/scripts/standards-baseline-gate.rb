# frozen_string_literal: true

require_relative "../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "scripts/standards-baseline-gate.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
  "analyze",
  "buildRecommendations",
  "checkUniqueLowerSnake",
  "classifyBaseName",
  "collectNamingMetrics",
  "issue",
  "listFilesRecursively",
  "main",
  "normalizePath",
  "parseArgs",
  "readJson",
  "validateFutureRoadmapCatalogs",
  "validateOptimizationPolicies",
  "validatePolyglotRuntimeActivation",
  "validateStoragePolicies",
  "validateSymbolRegistry",
  "validateTokenUsagePolicyCatalog",
  "validateUiUxCatalog",
  "writeReport"
]
      SYMBOL_MAP = {
  "analyze": "analyze",
  "buildRecommendations": "build_recommendations",
  "checkUniqueLowerSnake": "check_unique_lower_snake",
  "classifyBaseName": "classify_base_name",
  "collectNamingMetrics": "collect_naming_metrics",
  "issue": "issue",
  "listFilesRecursively": "list_files_recursively",
  "main": "main",
  "normalizePath": "normalize_path",
  "parseArgs": "parse_args",
  "readJson": "read_json",
  "validateFutureRoadmapCatalogs": "validate_future_roadmap_catalogs",
  "validateOptimizationPolicies": "validate_optimization_policies",
  "validatePolyglotRuntimeActivation": "validate_polyglot_runtime_activation",
  "validateStoragePolicies": "validate_storage_policies",
  "validateSymbolRegistry": "validate_symbol_registry",
  "validateTokenUsagePolicyCatalog": "validate_token_usage_policy_catalog",
  "validateUiUxCatalog": "validate_ui_ux_catalog",
  "writeReport": "write_report"
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

      def self.analyze(*args, **kwargs)
        invoke_source_function("analyze", *args, **kwargs)
      end

      def self.build_recommendations(*args, **kwargs)
        invoke_source_function("buildRecommendations", *args, **kwargs)
      end

      def self.check_unique_lower_snake(*args, **kwargs)
        invoke_source_function("checkUniqueLowerSnake", *args, **kwargs)
      end

      def self.classify_base_name(*args, **kwargs)
        invoke_source_function("classifyBaseName", *args, **kwargs)
      end

      def self.collect_naming_metrics(*args, **kwargs)
        invoke_source_function("collectNamingMetrics", *args, **kwargs)
      end

      def self.issue(*args, **kwargs)
        invoke_source_function("issue", *args, **kwargs)
      end

      def self.list_files_recursively(*args, **kwargs)
        invoke_source_function("listFilesRecursively", *args, **kwargs)
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

      def self.read_json(*args, **kwargs)
        invoke_source_function("readJson", *args, **kwargs)
      end

      def self.validate_future_roadmap_catalogs(*args, **kwargs)
        invoke_source_function("validateFutureRoadmapCatalogs", *args, **kwargs)
      end

      def self.validate_optimization_policies(*args, **kwargs)
        invoke_source_function("validateOptimizationPolicies", *args, **kwargs)
      end

      def self.validate_polyglot_runtime_activation(*args, **kwargs)
        invoke_source_function("validatePolyglotRuntimeActivation", *args, **kwargs)
      end

      def self.validate_storage_policies(*args, **kwargs)
        invoke_source_function("validateStoragePolicies", *args, **kwargs)
      end

      def self.validate_symbol_registry(*args, **kwargs)
        invoke_source_function("validateSymbolRegistry", *args, **kwargs)
      end

      def self.validate_token_usage_policy_catalog(*args, **kwargs)
        invoke_source_function("validateTokenUsagePolicyCatalog", *args, **kwargs)
      end

      def self.validate_ui_ux_catalog(*args, **kwargs)
        invoke_source_function("validateUiUxCatalog", *args, **kwargs)
      end

      def self.write_report(*args, **kwargs)
        invoke_source_function("writeReport", *args, **kwargs)
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
