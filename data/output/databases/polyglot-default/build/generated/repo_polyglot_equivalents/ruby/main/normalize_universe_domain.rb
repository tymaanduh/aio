# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "main/normalize_universe_domain.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "normalizeUniverseBookmark",
  "normalizeUniverseCacheState",
  "normalizeUniverseGraphEdge",
  "normalizeUniverseGraphNode"
]
      SYMBOL_MAP = {
  "normalizeUniverseBookmark": "normalize_universe_bookmark",
  "normalizeUniverseCacheState": "normalize_universe_cache_state",
  "normalizeUniverseGraphEdge": "normalize_universe_graph_edge",
  "normalizeUniverseGraphNode": "normalize_universe_graph_node"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.normalize_universe_bookmark(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizeUniverseBookmark' from main/normalize_universe_domain.js"
      end

      def self.normalize_universe_cache_state(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizeUniverseCacheState' from main/normalize_universe_domain.js"
      end

      def self.normalize_universe_graph_edge(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizeUniverseGraphEdge' from main/normalize_universe_domain.js"
      end

      def self.normalize_universe_graph_node(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizeUniverseGraphNode' from main/normalize_universe_domain.js"
      end
    end
  end
end
