# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "main/data/repository_specs.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "get_repository_spec"
]
      SYMBOL_MAP = {
  "get_repository_spec": "get_repository_spec"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.get_repository_spec(*args)
        raise NotImplementedError, "Equivalent stub for 'get_repository_spec' from main/data/repository_specs.js"
      end
    end
  end
end
