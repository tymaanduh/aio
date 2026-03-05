# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "brain/modules/diagnostics_utils.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "createDefaultDiagnostics",
  "mergeDiagnostics",
  "normalizeDiagnostics"
]
      SYMBOL_MAP = {
  "createDefaultDiagnostics": "create_default_diagnostics",
  "mergeDiagnostics": "merge_diagnostics",
  "normalizeDiagnostics": "normalize_diagnostics"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.create_default_diagnostics(*args)
        raise NotImplementedError, "Equivalent stub for 'createDefaultDiagnostics' from brain/modules/diagnostics_utils.js"
      end

      def self.merge_diagnostics(*args)
        raise NotImplementedError, "Equivalent stub for 'mergeDiagnostics' from brain/modules/diagnostics_utils.js"
      end

      def self.normalize_diagnostics(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizeDiagnostics' from brain/modules/diagnostics_utils.js"
      end
    end
  end
end
