# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "brain/modules/page_namespace_utils.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "bindPageNamespace"
]
      SYMBOL_MAP = {
  "bindPageNamespace": "bind_page_namespace"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.bind_page_namespace(*args)
        raise NotImplementedError, "Equivalent stub for 'bindPageNamespace' from brain/modules/page_namespace_utils.js"
      end
    end
  end
end
