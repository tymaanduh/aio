# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "brain/math/camera_math.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "compute_fit_camera"
]
      SYMBOL_MAP = {
  "compute_fit_camera": "compute_fit_camera"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.compute_fit_camera(*args)
        raise NotImplementedError, "Equivalent stub for 'compute_fit_camera' from brain/math/camera_math.js"
      end
    end
  end
end
