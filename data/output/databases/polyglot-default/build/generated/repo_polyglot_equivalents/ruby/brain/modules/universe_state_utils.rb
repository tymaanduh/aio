# frozen_string_literal: true

require_relative "../../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "brain/modules/universe_state_utils.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
  "clampNumber",
  "cleanText",
  "createDefaultUniverseConfig",
  "createEmptyUniverseGraph",
  "createFallbackId",
  "createUniverseStateTools",
  "getUniverseDatasetSignature",
  "inferQuestionBucketFromLabels",
  "normalizeConfig",
  "normalizeEntryMode",
  "normalizeLabelArray",
  "normalizeUniverseBookmark",
  "normalizeUniverseCustomSearchSet",
  "normalizeUniverseCustomSearchSets",
  "normalizeUniverseGraph",
  "normalizeWordLower",
  "unique"
]
      SYMBOL_MAP = {
  "clampNumber": "clamp_number",
  "cleanText": "clean_text",
  "createDefaultUniverseConfig": "create_default_universe_config",
  "createEmptyUniverseGraph": "create_empty_universe_graph",
  "createFallbackId": "create_fallback_id",
  "createUniverseStateTools": "create_universe_state_tools",
  "getUniverseDatasetSignature": "get_universe_dataset_signature",
  "inferQuestionBucketFromLabels": "infer_question_bucket_from_labels",
  "normalizeConfig": "normalize_config",
  "normalizeEntryMode": "normalize_entry_mode",
  "normalizeLabelArray": "normalize_label_array",
  "normalizeUniverseBookmark": "normalize_universe_bookmark",
  "normalizeUniverseCustomSearchSet": "normalize_universe_custom_search_set",
  "normalizeUniverseCustomSearchSets": "normalize_universe_custom_search_sets",
  "normalizeUniverseGraph": "normalize_universe_graph",
  "normalizeWordLower": "normalize_word_lower",
  "unique": "unique"
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

      def self.clamp_number(*args, **kwargs)
        invoke_source_function("clampNumber", *args, **kwargs)
      end

      def self.clean_text(*args, **kwargs)
        invoke_source_function("cleanText", *args, **kwargs)
      end

      def self.create_default_universe_config(*args, **kwargs)
        invoke_source_function("createDefaultUniverseConfig", *args, **kwargs)
      end

      def self.create_empty_universe_graph(*args, **kwargs)
        invoke_source_function("createEmptyUniverseGraph", *args, **kwargs)
      end

      def self.create_fallback_id(*args, **kwargs)
        invoke_source_function("createFallbackId", *args, **kwargs)
      end

      def self.create_universe_state_tools(*args, **kwargs)
        invoke_source_function("createUniverseStateTools", *args, **kwargs)
      end

      def self.get_universe_dataset_signature(*args, **kwargs)
        invoke_source_function("getUniverseDatasetSignature", *args, **kwargs)
      end

      def self.infer_question_bucket_from_labels(*args, **kwargs)
        invoke_source_function("inferQuestionBucketFromLabels", *args, **kwargs)
      end

      def self.normalize_config(*args, **kwargs)
        invoke_source_function("normalizeConfig", *args, **kwargs)
      end

      def self.normalize_entry_mode(*args, **kwargs)
        invoke_source_function("normalizeEntryMode", *args, **kwargs)
      end

      def self.normalize_label_array(*args, **kwargs)
        invoke_source_function("normalizeLabelArray", *args, **kwargs)
      end

      def self.normalize_universe_bookmark(*args, **kwargs)
        invoke_source_function("normalizeUniverseBookmark", *args, **kwargs)
      end

      def self.normalize_universe_custom_search_set(*args, **kwargs)
        invoke_source_function("normalizeUniverseCustomSearchSet", *args, **kwargs)
      end

      def self.normalize_universe_custom_search_sets(*args, **kwargs)
        invoke_source_function("normalizeUniverseCustomSearchSets", *args, **kwargs)
      end

      def self.normalize_universe_graph(*args, **kwargs)
        invoke_source_function("normalizeUniverseGraph", *args, **kwargs)
      end

      def self.normalize_word_lower(*args, **kwargs)
        invoke_source_function("normalizeWordLower", *args, **kwargs)
      end

      def self.unique(*args, **kwargs)
        invoke_source_function("unique", *args, **kwargs)
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
