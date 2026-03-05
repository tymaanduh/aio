# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "scripts/dx12-doctor.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "checkDefaultCmake",
  "checkNode",
  "checkNpm",
  "main",
  "printLine"
]
      SYMBOL_MAP = {
  "checkDefaultCmake": "check_default_cmake",
  "checkNode": "check_node",
  "checkNpm": "check_npm",
  "main": "main",
  "printLine": "print_line"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.check_default_cmake(*args)
        raise NotImplementedError, "Equivalent stub for 'checkDefaultCmake' from scripts/dx12-doctor.js"
      end

      def self.check_node(*args)
        raise NotImplementedError, "Equivalent stub for 'checkNode' from scripts/dx12-doctor.js"
      end

      def self.check_npm(*args)
        raise NotImplementedError, "Equivalent stub for 'checkNpm' from scripts/dx12-doctor.js"
      end

      def self.main(*args)
        raise NotImplementedError, "Equivalent stub for 'main' from scripts/dx12-doctor.js"
      end

      def self.print_line(*args)
        raise NotImplementedError, "Equivalent stub for 'printLine' from scripts/dx12-doctor.js"
      end
    end
  end
end
