# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "data/input/shared/renderer/dispatch_specs.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "freeze_list"
]
      SYMBOL_MAP = {
  "freeze_list": "freeze_list"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.freeze_list(*args)
        raise NotImplementedError, "Equivalent stub for 'freeze_list' from data/input/shared/renderer/dispatch_specs.js"
      end
    end
  end
end
