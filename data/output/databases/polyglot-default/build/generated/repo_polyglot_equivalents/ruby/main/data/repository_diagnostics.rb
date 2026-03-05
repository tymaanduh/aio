# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "main/data/repository_diagnostics.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "append_diagnostics",
  "export_diagnostics"
]
      SYMBOL_MAP = {
  "append_diagnostics": "append_diagnostics",
  "export_diagnostics": "export_diagnostics"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.append_diagnostics(*args)
        raise NotImplementedError, "Equivalent stub for 'append_diagnostics' from main/data/repository_diagnostics.js"
      end

      def self.export_diagnostics(*args)
        raise NotImplementedError, "Equivalent stub for 'export_diagnostics' from main/data/repository_diagnostics.js"
      end
    end
  end
end
