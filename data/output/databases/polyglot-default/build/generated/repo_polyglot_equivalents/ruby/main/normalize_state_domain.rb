# frozen_string_literal: true

require_relative "../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "main/normalize_state_domain.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
  "compactState",
  "mergeEntriesByWordIdentity",
  "normalizeHistoryCheckpoint",
  "normalizeSentenceGraph",
  "normalizeState",
  "normalizeStateEntry",
  "remapSentenceGraphEntryIds",
  "resolveEntryIdAlias"
]
      SYMBOL_MAP = {
  "compactState": "compact_state",
  "mergeEntriesByWordIdentity": "merge_entries_by_word_identity",
  "normalizeHistoryCheckpoint": "normalize_history_checkpoint",
  "normalizeSentenceGraph": "normalize_sentence_graph",
  "normalizeState": "normalize_state",
  "normalizeStateEntry": "normalize_state_entry",
  "remapSentenceGraphEntryIds": "remap_sentence_graph_entry_ids",
  "resolveEntryIdAlias": "resolve_entry_id_alias"
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

      def self.compact_state(*args, **kwargs)
        invoke_source_function("compactState", *args, **kwargs)
      end

      def self.merge_entries_by_word_identity(*args, **kwargs)
        invoke_source_function("mergeEntriesByWordIdentity", *args, **kwargs)
      end

      def self.normalize_history_checkpoint(*args, **kwargs)
        invoke_source_function("normalizeHistoryCheckpoint", *args, **kwargs)
      end

      def self.normalize_sentence_graph(*args, **kwargs)
        invoke_source_function("normalizeSentenceGraph", *args, **kwargs)
      end

      def self.normalize_state(*args, **kwargs)
        invoke_source_function("normalizeState", *args, **kwargs)
      end

      def self.normalize_state_entry(*args, **kwargs)
        invoke_source_function("normalizeStateEntry", *args, **kwargs)
      end

      def self.remap_sentence_graph_entry_ids(*args, **kwargs)
        invoke_source_function("remapSentenceGraphEntryIds", *args, **kwargs)
      end

      def self.resolve_entry_id_alias(*args, **kwargs)
        invoke_source_function("resolveEntryIdAlias", *args, **kwargs)
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
