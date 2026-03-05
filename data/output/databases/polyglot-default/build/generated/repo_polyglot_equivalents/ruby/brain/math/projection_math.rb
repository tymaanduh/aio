# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "brain/math/projection_math.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "norm_graph_coord"
]
      SYMBOL_MAP = {
  "norm_graph_coord": "norm_graph_coord"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.norm_graph_coord(*args)
        raise NotImplementedError, "Equivalent stub for 'norm_graph_coord' from brain/math/projection_math.js"
      end
    end
  end
end
