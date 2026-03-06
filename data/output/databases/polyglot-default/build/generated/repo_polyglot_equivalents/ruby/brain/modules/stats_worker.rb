# frozen_string_literal: true

require_relative "../../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "brain/modules/stats_worker.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
  "cleanText",
  "computeModel",
  "normalizeEntryMode",
  "normalizeUsageCount",
  "toTimestamp"
]
      SYMBOL_MAP = {
  "cleanText": "clean_text",
  "computeModel": "compute_model",
  "normalizeEntryMode": "normalize_entry_mode",
  "normalizeUsageCount": "normalize_usage_count",
  "toTimestamp": "to_timestamp"
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

      def self.clean_text(*args, **kwargs)
        invoke_source_function("cleanText", *args, **kwargs)
      end

      def self.compute_model(*args, **kwargs)
        invoke_source_function("computeModel", *args, **kwargs)
      end

      def self.normalize_entry_mode(*args, **kwargs)
        invoke_source_function("normalizeEntryMode", *args, **kwargs)
      end

      def self.normalize_usage_count(*args, **kwargs)
        invoke_source_function("normalizeUsageCount", *args, **kwargs)
      end

      def self.to_timestamp(*args, **kwargs)
        invoke_source_function("toTimestamp", *args, **kwargs)
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
