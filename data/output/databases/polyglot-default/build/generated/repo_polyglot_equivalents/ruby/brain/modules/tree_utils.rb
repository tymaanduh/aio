# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "brain/modules/tree_utils.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "calculateVirtualWindow",
  "clamp",
  "shouldVirtualizeGroup"
]
      SYMBOL_MAP = {
  "calculateVirtualWindow": "calculate_virtual_window",
  "clamp": "clamp",
  "shouldVirtualizeGroup": "should_virtualize_group"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.calculate_virtual_window(*args)
        raise NotImplementedError, "Equivalent stub for 'calculateVirtualWindow' from brain/modules/tree_utils.js"
      end

      def self.clamp(*args)
        raise NotImplementedError, "Equivalent stub for 'clamp' from brain/modules/tree_utils.js"
      end

      def self.should_virtualize_group(*args)
        raise NotImplementedError, "Equivalent stub for 'shouldVirtualizeGroup' from brain/modules/tree_utils.js"
      end
    end
  end
end
