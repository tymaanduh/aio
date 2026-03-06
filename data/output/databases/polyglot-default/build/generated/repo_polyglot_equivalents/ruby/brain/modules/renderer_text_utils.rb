# frozen_string_literal: true

require_relative "../../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "brain/modules/renderer_text_utils.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
  "cleanText",
  "collectRuleLabels",
  "createRendererTextUtils",
  "detectPosConflicts",
  "getBytesWarningText",
  "hasPatternMatch",
  "inferLabelsFromDefinition",
  "inferQuestionLabelsFromDefinition",
  "isBytesMode",
  "isBytesPayloadLike",
  "isCodeLikeMode",
  "isPartOfSpeechLabel",
  "keyForCategory",
  "keyForLabel",
  "normalizeEntryLanguage",
  "normalizeEntryMode",
  "normalizeLabel",
  "normalizeLabelArray",
  "normalizeWordLower",
  "nowIso",
  "parseLabels",
  "resolveEntryModeLabelHint",
  "resolveEntryModePlaceholder",
  "sanitizeDefinitionText",
  "shouldInferModeLabels",
  "unique"
]
      SYMBOL_MAP = {
  "cleanText": "clean_text",
  "collectRuleLabels": "collect_rule_labels",
  "createRendererTextUtils": "create_renderer_text_utils",
  "detectPosConflicts": "detect_pos_conflicts",
  "getBytesWarningText": "get_bytes_warning_text",
  "hasPatternMatch": "has_pattern_match",
  "inferLabelsFromDefinition": "infer_labels_from_definition",
  "inferQuestionLabelsFromDefinition": "infer_question_labels_from_definition",
  "isBytesMode": "is_bytes_mode",
  "isBytesPayloadLike": "is_bytes_payload_like",
  "isCodeLikeMode": "is_code_like_mode",
  "isPartOfSpeechLabel": "is_part_of_speech_label",
  "keyForCategory": "key_for_category",
  "keyForLabel": "key_for_label",
  "normalizeEntryLanguage": "normalize_entry_language",
  "normalizeEntryMode": "normalize_entry_mode",
  "normalizeLabel": "normalize_label",
  "normalizeLabelArray": "normalize_label_array",
  "normalizeWordLower": "normalize_word_lower",
  "nowIso": "now_iso",
  "parseLabels": "parse_labels",
  "resolveEntryModeLabelHint": "resolve_entry_mode_label_hint",
  "resolveEntryModePlaceholder": "resolve_entry_mode_placeholder",
  "sanitizeDefinitionText": "sanitize_definition_text",
  "shouldInferModeLabels": "should_infer_mode_labels",
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

      def self.clean_text(*args, **kwargs)
        invoke_source_function("cleanText", *args, **kwargs)
      end

      def self.collect_rule_labels(*args, **kwargs)
        invoke_source_function("collectRuleLabels", *args, **kwargs)
      end

      def self.create_renderer_text_utils(*args, **kwargs)
        invoke_source_function("createRendererTextUtils", *args, **kwargs)
      end

      def self.detect_pos_conflicts(*args, **kwargs)
        invoke_source_function("detectPosConflicts", *args, **kwargs)
      end

      def self.get_bytes_warning_text(*args, **kwargs)
        invoke_source_function("getBytesWarningText", *args, **kwargs)
      end

      def self.has_pattern_match(*args, **kwargs)
        invoke_source_function("hasPatternMatch", *args, **kwargs)
      end

      def self.infer_labels_from_definition(*args, **kwargs)
        invoke_source_function("inferLabelsFromDefinition", *args, **kwargs)
      end

      def self.infer_question_labels_from_definition(*args, **kwargs)
        invoke_source_function("inferQuestionLabelsFromDefinition", *args, **kwargs)
      end

      def self.is_bytes_mode(*args, **kwargs)
        invoke_source_function("isBytesMode", *args, **kwargs)
      end

      def self.is_bytes_payload_like(*args, **kwargs)
        invoke_source_function("isBytesPayloadLike", *args, **kwargs)
      end

      def self.is_code_like_mode(*args, **kwargs)
        invoke_source_function("isCodeLikeMode", *args, **kwargs)
      end

      def self.is_part_of_speech_label(*args, **kwargs)
        invoke_source_function("isPartOfSpeechLabel", *args, **kwargs)
      end

      def self.key_for_category(*args, **kwargs)
        invoke_source_function("keyForCategory", *args, **kwargs)
      end

      def self.key_for_label(*args, **kwargs)
        invoke_source_function("keyForLabel", *args, **kwargs)
      end

      def self.normalize_entry_language(*args, **kwargs)
        invoke_source_function("normalizeEntryLanguage", *args, **kwargs)
      end

      def self.normalize_entry_mode(*args, **kwargs)
        invoke_source_function("normalizeEntryMode", *args, **kwargs)
      end

      def self.normalize_label(*args, **kwargs)
        invoke_source_function("normalizeLabel", *args, **kwargs)
      end

      def self.normalize_label_array(*args, **kwargs)
        invoke_source_function("normalizeLabelArray", *args, **kwargs)
      end

      def self.normalize_word_lower(*args, **kwargs)
        invoke_source_function("normalizeWordLower", *args, **kwargs)
      end

      def self.now_iso(*args, **kwargs)
        invoke_source_function("nowIso", *args, **kwargs)
      end

      def self.parse_labels(*args, **kwargs)
        invoke_source_function("parseLabels", *args, **kwargs)
      end

      def self.resolve_entry_mode_label_hint(*args, **kwargs)
        invoke_source_function("resolveEntryModeLabelHint", *args, **kwargs)
      end

      def self.resolve_entry_mode_placeholder(*args, **kwargs)
        invoke_source_function("resolveEntryModePlaceholder", *args, **kwargs)
      end

      def self.sanitize_definition_text(*args, **kwargs)
        invoke_source_function("sanitizeDefinitionText", *args, **kwargs)
      end

      def self.should_infer_mode_labels(*args, **kwargs)
        invoke_source_function("shouldInferModeLabels", *args, **kwargs)
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
