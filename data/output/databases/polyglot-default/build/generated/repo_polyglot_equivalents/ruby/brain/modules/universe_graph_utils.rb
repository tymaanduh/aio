# frozen_string_literal: true

require_relative "../../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "brain/modules/universe_graph_utils.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
  "buildAdjacency",
  "buildGraphCacheToken",
  "buildIndexFlags",
  "cleanText",
  "computeAdjacencyState",
  "computeHighlightState",
  "findPathIndices",
  "getNodeWordLower",
  "normalizeWordLower"
]
      SYMBOL_MAP = {
  "buildAdjacency": "build_adjacency",
  "buildGraphCacheToken": "build_graph_cache_token",
  "buildIndexFlags": "build_index_flags",
  "cleanText": "clean_text",
  "computeAdjacencyState": "compute_adjacency_state",
  "computeHighlightState": "compute_highlight_state",
  "findPathIndices": "find_path_indices",
  "getNodeWordLower": "get_node_word_lower",
  "normalizeWordLower": "normalize_word_lower"
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

      def self.build_adjacency(*args, **kwargs)
        invoke_source_function("buildAdjacency", *args, **kwargs)
      end

      def self.build_graph_cache_token(*args, **kwargs)
        invoke_source_function("buildGraphCacheToken", *args, **kwargs)
      end

      def self.build_index_flags(*args, **kwargs)
        invoke_source_function("buildIndexFlags", *args, **kwargs)
      end

      def self.clean_text(*args, **kwargs)
        invoke_source_function("cleanText", *args, **kwargs)
      end

      def self.compute_adjacency_state(*args, **kwargs)
        invoke_source_function("computeAdjacencyState", *args, **kwargs)
      end

      def self.compute_highlight_state(*args, **kwargs)
        invoke_source_function("computeHighlightState", *args, **kwargs)
      end

      def self.find_path_indices(*args, **kwargs)
        invoke_source_function("findPathIndices", *args, **kwargs)
      end

      def self.get_node_word_lower(*args, **kwargs)
        invoke_source_function("getNodeWordLower", *args, **kwargs)
      end

      def self.normalize_word_lower(*args, **kwargs)
        invoke_source_function("normalizeWordLower", *args, **kwargs)
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
