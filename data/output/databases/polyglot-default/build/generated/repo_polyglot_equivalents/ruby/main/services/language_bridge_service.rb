# frozen_string_literal: true

require_relative "../../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "main/services/language_bridge_service.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
  "add_array_values",
  "build_descriptor_refs_from_text",
  "build_state_stats",
  "build_triad_id",
  "build_triads",
  "capture_sources",
  "clean_text",
  "clip_snippet",
  "compile_machine_descriptors",
  "create_machine_descriptor_record",
  "ensure_entry_link",
  "extract_code_tokens",
  "extract_english_phrases",
  "extract_english_terms",
  "extract_machine_terms",
  "extract_pseudocode_phrases",
  "get_seed_synonyms",
  "hash_text",
  "index_dictionary_entries",
  "inject_language_bridge_repository",
  "is_code_identifier",
  "link_entry_artifacts",
  "link_entry_refs",
  "load_bridge_state",
  "load_state_internal",
  "lookup_machine_rule",
  "MACHINE_DESCRIPTOR_TERM_RULE_MAP",
  "make_source_id",
  "normalize_key",
  "normalize_machine_term",
  "normalize_spaces",
  "now_iso",
  "process_text_into_artifacts",
  "rank_and_limit_results",
  "save_state_internal",
  "search_glossary",
  "search_keyword",
  "search_machine_descriptor",
  "search_triad",
  "set_dictionary_source",
  "split_sentences",
  "to_array",
  "to_search_limit",
  "unique_strings",
  "upsert_glossary",
  "upsert_keyword",
  "upsert_machine_descriptor",
  "upsert_triad"
]
      SYMBOL_MAP = {
  "add_array_values": "add_array_values",
  "build_descriptor_refs_from_text": "build_descriptor_refs_from_text",
  "build_state_stats": "build_state_stats",
  "build_triad_id": "build_triad_id",
  "build_triads": "build_triads",
  "capture_sources": "capture_sources",
  "clean_text": "clean_text",
  "clip_snippet": "clip_snippet",
  "compile_machine_descriptors": "compile_machine_descriptors",
  "create_machine_descriptor_record": "create_machine_descriptor_record",
  "ensure_entry_link": "ensure_entry_link",
  "extract_code_tokens": "extract_code_tokens",
  "extract_english_phrases": "extract_english_phrases",
  "extract_english_terms": "extract_english_terms",
  "extract_machine_terms": "extract_machine_terms",
  "extract_pseudocode_phrases": "extract_pseudocode_phrases",
  "get_seed_synonyms": "get_seed_synonyms",
  "hash_text": "hash_text",
  "index_dictionary_entries": "index_dictionary_entries",
  "inject_language_bridge_repository": "inject_language_bridge_repository",
  "is_code_identifier": "is_code_identifier",
  "link_entry_artifacts": "link_entry_artifacts",
  "link_entry_refs": "link_entry_refs",
  "load_bridge_state": "load_bridge_state",
  "load_state_internal": "load_state_internal",
  "lookup_machine_rule": "lookup_machine_rule",
  "MACHINE_DESCRIPTOR_TERM_RULE_MAP": "machine_descriptor_term_rule_map",
  "make_source_id": "make_source_id",
  "normalize_key": "normalize_key",
  "normalize_machine_term": "normalize_machine_term",
  "normalize_spaces": "normalize_spaces",
  "now_iso": "now_iso",
  "process_text_into_artifacts": "process_text_into_artifacts",
  "rank_and_limit_results": "rank_and_limit_results",
  "save_state_internal": "save_state_internal",
  "search_glossary": "search_glossary",
  "search_keyword": "search_keyword",
  "search_machine_descriptor": "search_machine_descriptor",
  "search_triad": "search_triad",
  "set_dictionary_source": "set_dictionary_source",
  "split_sentences": "split_sentences",
  "to_array": "to_array",
  "to_search_limit": "to_search_limit",
  "unique_strings": "unique_strings",
  "upsert_glossary": "upsert_glossary",
  "upsert_keyword": "upsert_keyword",
  "upsert_machine_descriptor": "upsert_machine_descriptor",
  "upsert_triad": "upsert_triad"
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

      def self.add_array_values(*args, **kwargs)
        invoke_source_function("add_array_values", *args, **kwargs)
      end

      def self.build_descriptor_refs_from_text(*args, **kwargs)
        invoke_source_function("build_descriptor_refs_from_text", *args, **kwargs)
      end

      def self.build_state_stats(*args, **kwargs)
        invoke_source_function("build_state_stats", *args, **kwargs)
      end

      def self.build_triad_id(*args, **kwargs)
        invoke_source_function("build_triad_id", *args, **kwargs)
      end

      def self.build_triads(*args, **kwargs)
        invoke_source_function("build_triads", *args, **kwargs)
      end

      def self.capture_sources(*args, **kwargs)
        invoke_source_function("capture_sources", *args, **kwargs)
      end

      def self.clean_text(*args, **kwargs)
        invoke_source_function("clean_text", *args, **kwargs)
      end

      def self.clip_snippet(*args, **kwargs)
        invoke_source_function("clip_snippet", *args, **kwargs)
      end

      def self.compile_machine_descriptors(*args, **kwargs)
        invoke_source_function("compile_machine_descriptors", *args, **kwargs)
      end

      def self.create_machine_descriptor_record(*args, **kwargs)
        invoke_source_function("create_machine_descriptor_record", *args, **kwargs)
      end

      def self.ensure_entry_link(*args, **kwargs)
        invoke_source_function("ensure_entry_link", *args, **kwargs)
      end

      def self.extract_code_tokens(*args, **kwargs)
        invoke_source_function("extract_code_tokens", *args, **kwargs)
      end

      def self.extract_english_phrases(*args, **kwargs)
        invoke_source_function("extract_english_phrases", *args, **kwargs)
      end

      def self.extract_english_terms(*args, **kwargs)
        invoke_source_function("extract_english_terms", *args, **kwargs)
      end

      def self.extract_machine_terms(*args, **kwargs)
        invoke_source_function("extract_machine_terms", *args, **kwargs)
      end

      def self.extract_pseudocode_phrases(*args, **kwargs)
        invoke_source_function("extract_pseudocode_phrases", *args, **kwargs)
      end

      def self.get_seed_synonyms(*args, **kwargs)
        invoke_source_function("get_seed_synonyms", *args, **kwargs)
      end

      def self.hash_text(*args, **kwargs)
        invoke_source_function("hash_text", *args, **kwargs)
      end

      def self.index_dictionary_entries(*args, **kwargs)
        invoke_source_function("index_dictionary_entries", *args, **kwargs)
      end

      def self.inject_language_bridge_repository(*args, **kwargs)
        invoke_source_function("inject_language_bridge_repository", *args, **kwargs)
      end

      def self.is_code_identifier(*args, **kwargs)
        invoke_source_function("is_code_identifier", *args, **kwargs)
      end

      def self.link_entry_artifacts(*args, **kwargs)
        invoke_source_function("link_entry_artifacts", *args, **kwargs)
      end

      def self.link_entry_refs(*args, **kwargs)
        invoke_source_function("link_entry_refs", *args, **kwargs)
      end

      def self.load_bridge_state(*args, **kwargs)
        invoke_source_function("load_bridge_state", *args, **kwargs)
      end

      def self.load_state_internal(*args, **kwargs)
        invoke_source_function("load_state_internal", *args, **kwargs)
      end

      def self.lookup_machine_rule(*args, **kwargs)
        invoke_source_function("lookup_machine_rule", *args, **kwargs)
      end

      def self.machine_descriptor_term_rule_map(*args, **kwargs)
        invoke_source_function("MACHINE_DESCRIPTOR_TERM_RULE_MAP", *args, **kwargs)
      end

      def self.make_source_id(*args, **kwargs)
        invoke_source_function("make_source_id", *args, **kwargs)
      end

      def self.normalize_key(*args, **kwargs)
        invoke_source_function("normalize_key", *args, **kwargs)
      end

      def self.normalize_machine_term(*args, **kwargs)
        invoke_source_function("normalize_machine_term", *args, **kwargs)
      end

      def self.normalize_spaces(*args, **kwargs)
        invoke_source_function("normalize_spaces", *args, **kwargs)
      end

      def self.now_iso(*args, **kwargs)
        invoke_source_function("now_iso", *args, **kwargs)
      end

      def self.process_text_into_artifacts(*args, **kwargs)
        invoke_source_function("process_text_into_artifacts", *args, **kwargs)
      end

      def self.rank_and_limit_results(*args, **kwargs)
        invoke_source_function("rank_and_limit_results", *args, **kwargs)
      end

      def self.save_state_internal(*args, **kwargs)
        invoke_source_function("save_state_internal", *args, **kwargs)
      end

      def self.search_glossary(*args, **kwargs)
        invoke_source_function("search_glossary", *args, **kwargs)
      end

      def self.search_keyword(*args, **kwargs)
        invoke_source_function("search_keyword", *args, **kwargs)
      end

      def self.search_machine_descriptor(*args, **kwargs)
        invoke_source_function("search_machine_descriptor", *args, **kwargs)
      end

      def self.search_triad(*args, **kwargs)
        invoke_source_function("search_triad", *args, **kwargs)
      end

      def self.set_dictionary_source(*args, **kwargs)
        invoke_source_function("set_dictionary_source", *args, **kwargs)
      end

      def self.split_sentences(*args, **kwargs)
        invoke_source_function("split_sentences", *args, **kwargs)
      end

      def self.to_array(*args, **kwargs)
        invoke_source_function("to_array", *args, **kwargs)
      end

      def self.to_search_limit(*args, **kwargs)
        invoke_source_function("to_search_limit", *args, **kwargs)
      end

      def self.unique_strings(*args, **kwargs)
        invoke_source_function("unique_strings", *args, **kwargs)
      end

      def self.upsert_glossary(*args, **kwargs)
        invoke_source_function("upsert_glossary", *args, **kwargs)
      end

      def self.upsert_keyword(*args, **kwargs)
        invoke_source_function("upsert_keyword", *args, **kwargs)
      end

      def self.upsert_machine_descriptor(*args, **kwargs)
        invoke_source_function("upsert_machine_descriptor", *args, **kwargs)
      end

      def self.upsert_triad(*args, **kwargs)
        invoke_source_function("upsert_triad", *args, **kwargs)
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
