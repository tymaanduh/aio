# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "brain/modules/duplicates_utils.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "buildNearDuplicateCluster",
  "jaccardSimilarity",
  "normalizeWordLower",
  "tokenize"
]
      SYMBOL_MAP = {
  "buildNearDuplicateCluster": "build_near_duplicate_cluster",
  "jaccardSimilarity": "jaccard_similarity",
  "normalizeWordLower": "normalize_word_lower",
  "tokenize": "tokenize"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.build_near_duplicate_cluster(*args)
        raise NotImplementedError, "Equivalent stub for 'buildNearDuplicateCluster' from brain/modules/duplicates_utils.js"
      end

      def self.jaccard_similarity(*args)
        raise NotImplementedError, "Equivalent stub for 'jaccardSimilarity' from brain/modules/duplicates_utils.js"
      end

      def self.normalize_word_lower(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizeWordLower' from brain/modules/duplicates_utils.js"
      end

      def self.tokenize(*args)
        raise NotImplementedError, "Equivalent stub for 'tokenize' from brain/modules/duplicates_utils.js"
      end
    end
  end
end
