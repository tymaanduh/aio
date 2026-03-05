# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "main/windows/window_specs.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "clone_plain_object",
  "deep_freeze",
  "get_window_definition",
  "get_window_runtime_rules",
  "get_window_spec",
  "is_plain_object",
  "normalize_runtime_rules",
  "normalize_window_definition",
  "pick_window_runtime_rules",
  "pick_window_spec",
  "read_text"
]
      SYMBOL_MAP = {
  "clone_plain_object": "clone_plain_object",
  "deep_freeze": "deep_freeze",
  "get_window_definition": "get_window_definition",
  "get_window_runtime_rules": "get_window_runtime_rules",
  "get_window_spec": "get_window_spec",
  "is_plain_object": "is_plain_object",
  "normalize_runtime_rules": "normalize_runtime_rules",
  "normalize_window_definition": "normalize_window_definition",
  "pick_window_runtime_rules": "pick_window_runtime_rules",
  "pick_window_spec": "pick_window_spec",
  "read_text": "read_text"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.clone_plain_object(*args)
        raise NotImplementedError, "Equivalent stub for 'clone_plain_object' from main/windows/window_specs.js"
      end

      def self.deep_freeze(*args)
        raise NotImplementedError, "Equivalent stub for 'deep_freeze' from main/windows/window_specs.js"
      end

      def self.get_window_definition(*args)
        raise NotImplementedError, "Equivalent stub for 'get_window_definition' from main/windows/window_specs.js"
      end

      def self.get_window_runtime_rules(*args)
        raise NotImplementedError, "Equivalent stub for 'get_window_runtime_rules' from main/windows/window_specs.js"
      end

      def self.get_window_spec(*args)
        raise NotImplementedError, "Equivalent stub for 'get_window_spec' from main/windows/window_specs.js"
      end

      def self.is_plain_object(*args)
        raise NotImplementedError, "Equivalent stub for 'is_plain_object' from main/windows/window_specs.js"
      end

      def self.normalize_runtime_rules(*args)
        raise NotImplementedError, "Equivalent stub for 'normalize_runtime_rules' from main/windows/window_specs.js"
      end

      def self.normalize_window_definition(*args)
        raise NotImplementedError, "Equivalent stub for 'normalize_window_definition' from main/windows/window_specs.js"
      end

      def self.pick_window_runtime_rules(*args)
        raise NotImplementedError, "Equivalent stub for 'pick_window_runtime_rules' from main/windows/window_specs.js"
      end

      def self.pick_window_spec(*args)
        raise NotImplementedError, "Equivalent stub for 'pick_window_spec' from main/windows/window_specs.js"
      end

      def self.read_text(*args)
        raise NotImplementedError, "Equivalent stub for 'read_text' from main/windows/window_specs.js"
      end
    end
  end
end
