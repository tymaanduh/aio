# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "main/normalize_diagnostics_domain.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "normalizeDiagnosticsState"
]
      SYMBOL_MAP = {
  "normalizeDiagnosticsState": "normalize_diagnostics_state"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.normalize_diagnostics_state(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizeDiagnosticsState' from main/normalize_diagnostics_domain.js"
      end
    end
  end
end
