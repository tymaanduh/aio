# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "brain/modules/autosave_utils.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "clear",
  "createDebouncedTask",
  "flush",
  "isScheduled",
  "run",
  "schedule"
]
      SYMBOL_MAP = {
  "clear": "clear",
  "createDebouncedTask": "create_debounced_task",
  "flush": "flush",
  "isScheduled": "is_scheduled",
  "run": "run",
  "schedule": "schedule"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.clear(*args)
        raise NotImplementedError, "Equivalent stub for 'clear' from brain/modules/autosave_utils.js"
      end

      def self.create_debounced_task(*args)
        raise NotImplementedError, "Equivalent stub for 'createDebouncedTask' from brain/modules/autosave_utils.js"
      end

      def self.flush(*args)
        raise NotImplementedError, "Equivalent stub for 'flush' from brain/modules/autosave_utils.js"
      end

      def self.is_scheduled(*args)
        raise NotImplementedError, "Equivalent stub for 'isScheduled' from brain/modules/autosave_utils.js"
      end

      def self.run(*args)
        raise NotImplementedError, "Equivalent stub for 'run' from brain/modules/autosave_utils.js"
      end

      def self.schedule(*args)
        raise NotImplementedError, "Equivalent stub for 'schedule' from brain/modules/autosave_utils.js"
      end
    end
  end
end
