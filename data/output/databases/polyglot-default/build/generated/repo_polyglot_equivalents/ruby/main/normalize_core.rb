# frozen_string_literal: true

require_relative "../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "main/normalize_core.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
  "build_edge_mode_counts",
  "clamp_number",
  "cleanText",
  "normalize_unique_labels",
  "normalizeEntryMode",
  "normalizeEntryUsageCount",
  "normalizeGraphCoordinate",
  "normalizeLabel",
  "normalizePassword",
  "normalizeUsername",
  "normalizeWordIdentityKey",
  "now_iso",
  "round_positive_milliseconds",
  "to_non_negative_int",
  "to_source_object",
  "toTimestampMs"
]
      SYMBOL_MAP = {
  "build_edge_mode_counts": "build_edge_mode_counts",
  "clamp_number": "clamp_number",
  "cleanText": "clean_text",
  "normalize_unique_labels": "normalize_unique_labels",
  "normalizeEntryMode": "normalize_entry_mode",
  "normalizeEntryUsageCount": "normalize_entry_usage_count",
  "normalizeGraphCoordinate": "normalize_graph_coordinate",
  "normalizeLabel": "normalize_label",
  "normalizePassword": "normalize_password",
  "normalizeUsername": "normalize_username",
  "normalizeWordIdentityKey": "normalize_word_identity_key",
  "now_iso": "now_iso",
  "round_positive_milliseconds": "round_positive_milliseconds",
  "to_non_negative_int": "to_non_negative_int",
  "to_source_object": "to_source_object",
  "toTimestampMs": "to_timestamp_ms"
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

      def self.build_edge_mode_counts(*args, **kwargs)
        invoke_source_function("build_edge_mode_counts", *args, **kwargs)
      end

      def self.clamp_number(*args, **kwargs)
        invoke_source_function("clamp_number", *args, **kwargs)
      end

      def self.clean_text(*args, **kwargs)
        invoke_source_function("cleanText", *args, **kwargs)
      end

      def self.normalize_unique_labels(*args, **kwargs)
        invoke_source_function("normalize_unique_labels", *args, **kwargs)
      end

      def self.normalize_entry_mode(*args, **kwargs)
        invoke_source_function("normalizeEntryMode", *args, **kwargs)
      end

      def self.normalize_entry_usage_count(*args, **kwargs)
        invoke_source_function("normalizeEntryUsageCount", *args, **kwargs)
      end

      def self.normalize_graph_coordinate(*args, **kwargs)
        invoke_source_function("normalizeGraphCoordinate", *args, **kwargs)
      end

      def self.normalize_label(*args, **kwargs)
        invoke_source_function("normalizeLabel", *args, **kwargs)
      end

      def self.normalize_password(*args, **kwargs)
        invoke_source_function("normalizePassword", *args, **kwargs)
      end

      def self.normalize_username(*args, **kwargs)
        invoke_source_function("normalizeUsername", *args, **kwargs)
      end

      def self.normalize_word_identity_key(*args, **kwargs)
        invoke_source_function("normalizeWordIdentityKey", *args, **kwargs)
      end

      def self.now_iso(*args, **kwargs)
        invoke_source_function("now_iso", *args, **kwargs)
      end

      def self.round_positive_milliseconds(*args, **kwargs)
        invoke_source_function("round_positive_milliseconds", *args, **kwargs)
      end

      def self.to_non_negative_int(*args, **kwargs)
        invoke_source_function("to_non_negative_int", *args, **kwargs)
      end

      def self.to_source_object(*args, **kwargs)
        invoke_source_function("to_source_object", *args, **kwargs)
      end

      def self.to_timestamp_ms(*args, **kwargs)
        invoke_source_function("toTimestampMs", *args, **kwargs)
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
