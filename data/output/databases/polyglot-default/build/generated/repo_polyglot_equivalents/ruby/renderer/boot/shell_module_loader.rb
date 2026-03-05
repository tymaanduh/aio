# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "renderer/boot/shell_module_loader.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "load_module",
  "load_shell_scope"
]
      SYMBOL_MAP = {
  "load_module": "load_module",
  "load_shell_scope": "load_shell_scope"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.load_module(*args)
        raise NotImplementedError, "Equivalent stub for 'load_module' from renderer/boot/shell_module_loader.js"
      end

      def self.load_shell_scope(*args)
        raise NotImplementedError, "Equivalent stub for 'load_shell_scope' from renderer/boot/shell_module_loader.js"
      end
    end
  end
end
