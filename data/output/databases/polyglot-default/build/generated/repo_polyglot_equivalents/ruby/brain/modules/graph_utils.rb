# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "brain/modules/graph_utils.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "buildGraphIndex",
  "normalizeWordLower"
]
      SYMBOL_MAP = {
  "buildGraphIndex": "build_graph_index",
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

      def self.build_graph_index(*args)
        raise NotImplementedError, "Equivalent stub for 'buildGraphIndex' from brain/modules/graph_utils.js"
      end

      def self.normalize_word_lower(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizeWordLower' from brain/modules/graph_utils.js"
      end
    end
  end
end
