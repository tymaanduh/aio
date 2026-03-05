# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "brain/modules/dom_utils.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "createElementMap"
]
      SYMBOL_MAP = {
  "createElementMap": "create_element_map"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.create_element_map(*args)
        raise NotImplementedError, "Equivalent stub for 'createElementMap' from brain/modules/dom_utils.js"
      end
    end
  end
end
