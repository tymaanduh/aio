# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "brain/modules/runtime_slots_utils.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "cloneSlotValue",
  "createRuntimeSlots"
]
      SYMBOL_MAP = {
  "cloneSlotValue": "clone_slot_value",
  "createRuntimeSlots": "create_runtime_slots"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.clone_slot_value(*args)
        raise NotImplementedError, "Equivalent stub for 'cloneSlotValue' from brain/modules/runtime_slots_utils.js"
      end

      def self.create_runtime_slots(*args)
        raise NotImplementedError, "Equivalent stub for 'createRuntimeSlots' from brain/modules/runtime_slots_utils.js"
      end
    end
  end
end
