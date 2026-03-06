# frozen_string_literal: true

require_relative "../../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "brain/modules/word_universe_worker.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
  "addEdge",
  "buildComponentSizes",
  "buildContainmentEdges",
  "buildEdges",
  "buildPrefixEdges",
  "buildSameLabelEdges",
  "buildStemEdges",
  "buildSuffixEdges",
  "buildUniverseGraph",
  "cleanText",
  "createEdgeContext",
  "createRng",
  "find",
  "hashString",
  "layoutNodes",
  "normalizeEdgeModes",
  "normalizeLabelList",
  "normalizeStem",
  "normalizeWord",
  "resolvePartOfSpeech",
  "selectNodes",
  "toBooleanScore",
  "toFiniteNumber",
  "union"
]
      SYMBOL_MAP = {
  "addEdge": "add_edge",
  "buildComponentSizes": "build_component_sizes",
  "buildContainmentEdges": "build_containment_edges",
  "buildEdges": "build_edges",
  "buildPrefixEdges": "build_prefix_edges",
  "buildSameLabelEdges": "build_same_label_edges",
  "buildStemEdges": "build_stem_edges",
  "buildSuffixEdges": "build_suffix_edges",
  "buildUniverseGraph": "build_universe_graph",
  "cleanText": "clean_text",
  "createEdgeContext": "create_edge_context",
  "createRng": "create_rng",
  "find": "find",
  "hashString": "hash_string",
  "layoutNodes": "layout_nodes",
  "normalizeEdgeModes": "normalize_edge_modes",
  "normalizeLabelList": "normalize_label_list",
  "normalizeStem": "normalize_stem",
  "normalizeWord": "normalize_word",
  "resolvePartOfSpeech": "resolve_part_of_speech",
  "selectNodes": "select_nodes",
  "toBooleanScore": "to_boolean_score",
  "toFiniteNumber": "to_finite_number",
  "union": "union"
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

      def self.add_edge(*args, **kwargs)
        invoke_source_function("addEdge", *args, **kwargs)
      end

      def self.build_component_sizes(*args, **kwargs)
        invoke_source_function("buildComponentSizes", *args, **kwargs)
      end

      def self.build_containment_edges(*args, **kwargs)
        invoke_source_function("buildContainmentEdges", *args, **kwargs)
      end

      def self.build_edges(*args, **kwargs)
        invoke_source_function("buildEdges", *args, **kwargs)
      end

      def self.build_prefix_edges(*args, **kwargs)
        invoke_source_function("buildPrefixEdges", *args, **kwargs)
      end

      def self.build_same_label_edges(*args, **kwargs)
        invoke_source_function("buildSameLabelEdges", *args, **kwargs)
      end

      def self.build_stem_edges(*args, **kwargs)
        invoke_source_function("buildStemEdges", *args, **kwargs)
      end

      def self.build_suffix_edges(*args, **kwargs)
        invoke_source_function("buildSuffixEdges", *args, **kwargs)
      end

      def self.build_universe_graph(*args, **kwargs)
        invoke_source_function("buildUniverseGraph", *args, **kwargs)
      end

      def self.clean_text(*args, **kwargs)
        invoke_source_function("cleanText", *args, **kwargs)
      end

      def self.create_edge_context(*args, **kwargs)
        invoke_source_function("createEdgeContext", *args, **kwargs)
      end

      def self.create_rng(*args, **kwargs)
        invoke_source_function("createRng", *args, **kwargs)
      end

      def self.find(*args, **kwargs)
        invoke_source_function("find", *args, **kwargs)
      end

      def self.hash_string(*args, **kwargs)
        invoke_source_function("hashString", *args, **kwargs)
      end

      def self.layout_nodes(*args, **kwargs)
        invoke_source_function("layoutNodes", *args, **kwargs)
      end

      def self.normalize_edge_modes(*args, **kwargs)
        invoke_source_function("normalizeEdgeModes", *args, **kwargs)
      end

      def self.normalize_label_list(*args, **kwargs)
        invoke_source_function("normalizeLabelList", *args, **kwargs)
      end

      def self.normalize_stem(*args, **kwargs)
        invoke_source_function("normalizeStem", *args, **kwargs)
      end

      def self.normalize_word(*args, **kwargs)
        invoke_source_function("normalizeWord", *args, **kwargs)
      end

      def self.resolve_part_of_speech(*args, **kwargs)
        invoke_source_function("resolvePartOfSpeech", *args, **kwargs)
      end

      def self.select_nodes(*args, **kwargs)
        invoke_source_function("selectNodes", *args, **kwargs)
      end

      def self.to_boolean_score(*args, **kwargs)
        invoke_source_function("toBooleanScore", *args, **kwargs)
      end

      def self.to_finite_number(*args, **kwargs)
        invoke_source_function("toFiniteNumber", *args, **kwargs)
      end

      def self.union(*args, **kwargs)
        invoke_source_function("union", *args, **kwargs)
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
