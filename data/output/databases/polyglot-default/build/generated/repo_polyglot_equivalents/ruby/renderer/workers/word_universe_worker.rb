# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "renderer/workers/word_universe_worker.js"
      EQUIVALENT_KIND = "repo_module_stub"
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

      def self.add_edge(*args)
        raise NotImplementedError, "Equivalent stub for 'addEdge' from renderer/workers/word_universe_worker.js"
      end

      def self.build_component_sizes(*args)
        raise NotImplementedError, "Equivalent stub for 'buildComponentSizes' from renderer/workers/word_universe_worker.js"
      end

      def self.build_containment_edges(*args)
        raise NotImplementedError, "Equivalent stub for 'buildContainmentEdges' from renderer/workers/word_universe_worker.js"
      end

      def self.build_edges(*args)
        raise NotImplementedError, "Equivalent stub for 'buildEdges' from renderer/workers/word_universe_worker.js"
      end

      def self.build_prefix_edges(*args)
        raise NotImplementedError, "Equivalent stub for 'buildPrefixEdges' from renderer/workers/word_universe_worker.js"
      end

      def self.build_same_label_edges(*args)
        raise NotImplementedError, "Equivalent stub for 'buildSameLabelEdges' from renderer/workers/word_universe_worker.js"
      end

      def self.build_stem_edges(*args)
        raise NotImplementedError, "Equivalent stub for 'buildStemEdges' from renderer/workers/word_universe_worker.js"
      end

      def self.build_suffix_edges(*args)
        raise NotImplementedError, "Equivalent stub for 'buildSuffixEdges' from renderer/workers/word_universe_worker.js"
      end

      def self.build_universe_graph(*args)
        raise NotImplementedError, "Equivalent stub for 'buildUniverseGraph' from renderer/workers/word_universe_worker.js"
      end

      def self.clean_text(*args)
        raise NotImplementedError, "Equivalent stub for 'cleanText' from renderer/workers/word_universe_worker.js"
      end

      def self.create_edge_context(*args)
        raise NotImplementedError, "Equivalent stub for 'createEdgeContext' from renderer/workers/word_universe_worker.js"
      end

      def self.create_rng(*args)
        raise NotImplementedError, "Equivalent stub for 'createRng' from renderer/workers/word_universe_worker.js"
      end

      def self.find(*args)
        raise NotImplementedError, "Equivalent stub for 'find' from renderer/workers/word_universe_worker.js"
      end

      def self.hash_string(*args)
        raise NotImplementedError, "Equivalent stub for 'hashString' from renderer/workers/word_universe_worker.js"
      end

      def self.layout_nodes(*args)
        raise NotImplementedError, "Equivalent stub for 'layoutNodes' from renderer/workers/word_universe_worker.js"
      end

      def self.normalize_edge_modes(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizeEdgeModes' from renderer/workers/word_universe_worker.js"
      end

      def self.normalize_label_list(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizeLabelList' from renderer/workers/word_universe_worker.js"
      end

      def self.normalize_stem(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizeStem' from renderer/workers/word_universe_worker.js"
      end

      def self.normalize_word(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizeWord' from renderer/workers/word_universe_worker.js"
      end

      def self.resolve_part_of_speech(*args)
        raise NotImplementedError, "Equivalent stub for 'resolvePartOfSpeech' from renderer/workers/word_universe_worker.js"
      end

      def self.select_nodes(*args)
        raise NotImplementedError, "Equivalent stub for 'selectNodes' from renderer/workers/word_universe_worker.js"
      end

      def self.to_boolean_score(*args)
        raise NotImplementedError, "Equivalent stub for 'toBooleanScore' from renderer/workers/word_universe_worker.js"
      end

      def self.to_finite_number(*args)
        raise NotImplementedError, "Equivalent stub for 'toFiniteNumber' from renderer/workers/word_universe_worker.js"
      end

      def self.union(*args)
        raise NotImplementedError, "Equivalent stub for 'union' from renderer/workers/word_universe_worker.js"
      end
    end
  end
end
