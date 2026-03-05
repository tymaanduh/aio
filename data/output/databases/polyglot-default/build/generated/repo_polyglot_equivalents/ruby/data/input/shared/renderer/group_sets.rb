# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "data/input/shared/renderer/group_sets.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "freezeArray"
]
      SYMBOL_MAP = {
  "freezeArray": "freeze_array"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.freeze_array(*args)
        raise NotImplementedError, "Equivalent stub for 'freezeArray' from data/input/shared/renderer/group_sets.js"
      end
    end
  end
end
