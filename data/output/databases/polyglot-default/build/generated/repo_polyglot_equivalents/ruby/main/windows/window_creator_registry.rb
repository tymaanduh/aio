# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "main/windows/window_creator_registry.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "create_logs_window",
  "create_main_window",
  "create_window_by_key"
]
      SYMBOL_MAP = {
  "create_logs_window": "create_logs_window",
  "create_main_window": "create_main_window",
  "create_window_by_key": "create_window_by_key"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.create_logs_window(*args)
        raise NotImplementedError, "Equivalent stub for 'create_logs_window' from main/windows/window_creator_registry.js"
      end

      def self.create_main_window(*args)
        raise NotImplementedError, "Equivalent stub for 'create_main_window' from main/windows/window_creator_registry.js"
      end

      def self.create_window_by_key(*args)
        raise NotImplementedError, "Equivalent stub for 'create_window_by_key' from main/windows/window_creator_registry.js"
      end
    end
  end
end
