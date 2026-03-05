# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "tests/wrapper_polyglot_bindings.test.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "detectPythonRuntime"
]
      SYMBOL_MAP = {
  "detectPythonRuntime": "detect_python_runtime"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.detect_python_runtime(*args)
        raise NotImplementedError, "Equivalent stub for 'detectPythonRuntime' from tests/wrapper_polyglot_bindings.test.js"
      end
    end
  end
end
