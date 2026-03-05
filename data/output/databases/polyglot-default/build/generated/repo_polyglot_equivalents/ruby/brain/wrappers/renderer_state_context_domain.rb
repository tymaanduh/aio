# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "brain/wrappers/renderer_state_context_domain.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "createRendererStateContext",
  "safeRecordDiagnosticError"
]
      SYMBOL_MAP = {
  "createRendererStateContext": "create_renderer_state_context",
  "safeRecordDiagnosticError": "safe_record_diagnostic_error"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.create_renderer_state_context(*args)
        raise NotImplementedError, "Equivalent stub for 'createRendererStateContext' from brain/wrappers/renderer_state_context_domain.js"
      end

      def self.safe_record_diagnostic_error(*args)
        raise NotImplementedError, "Equivalent stub for 'safeRecordDiagnosticError' from brain/wrappers/renderer_state_context_domain.js"
      end
    end
  end
end
