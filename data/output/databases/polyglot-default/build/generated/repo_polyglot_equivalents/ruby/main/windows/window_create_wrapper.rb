# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "main/windows/window_create_wrapper.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "bind_window_auto_show_on_ready",
  "bind_window_optional_close_callback",
  "bind_window_runtime_rules",
  "create_window",
  "create_window_creator",
  "show_if_possible"
]
      SYMBOL_MAP = {
  "bind_window_auto_show_on_ready": "bind_window_auto_show_on_ready",
  "bind_window_optional_close_callback": "bind_window_optional_close_callback",
  "bind_window_runtime_rules": "bind_window_runtime_rules",
  "create_window": "create_window",
  "create_window_creator": "create_window_creator",
  "show_if_possible": "show_if_possible"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.bind_window_auto_show_on_ready(*args)
        raise NotImplementedError, "Equivalent stub for 'bind_window_auto_show_on_ready' from main/windows/window_create_wrapper.js"
      end

      def self.bind_window_optional_close_callback(*args)
        raise NotImplementedError, "Equivalent stub for 'bind_window_optional_close_callback' from main/windows/window_create_wrapper.js"
      end

      def self.bind_window_runtime_rules(*args)
        raise NotImplementedError, "Equivalent stub for 'bind_window_runtime_rules' from main/windows/window_create_wrapper.js"
      end

      def self.create_window(*args)
        raise NotImplementedError, "Equivalent stub for 'create_window' from main/windows/window_create_wrapper.js"
      end

      def self.create_window_creator(*args)
        raise NotImplementedError, "Equivalent stub for 'create_window_creator' from main/windows/window_create_wrapper.js"
      end

      def self.show_if_possible(*args)
        raise NotImplementedError, "Equivalent stub for 'show_if_possible' from main/windows/window_create_wrapper.js"
      end
    end
  end
end
