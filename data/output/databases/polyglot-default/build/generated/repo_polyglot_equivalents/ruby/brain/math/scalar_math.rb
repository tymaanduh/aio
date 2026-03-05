# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "brain/math/scalar_math.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "calculate_percentile",
  "clamp_number"
]
      SYMBOL_MAP = {
  "calculate_percentile": "calculate_percentile",
  "clamp_number": "clamp_number"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.calculate_percentile(*args)
        raise NotImplementedError, "Equivalent stub for 'calculate_percentile' from brain/math/scalar_math.js"
      end

      def self.clamp_number(*args)
        raise NotImplementedError, "Equivalent stub for 'clamp_number' from brain/math/scalar_math.js"
      end
    end
  end
end
