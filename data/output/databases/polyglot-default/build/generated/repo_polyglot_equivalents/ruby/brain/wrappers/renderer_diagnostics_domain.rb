# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "brain/wrappers/renderer_diagnostics_domain.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "clearDiagnosticsFlushTimer",
  "pushRuntimeLog",
  "recordDiagnosticError",
  "recordDiagnosticPerf",
  "renderDiagnosticsPanel",
  "renderDiagnosticsSummary",
  "scheduleDiagnosticsFlush",
  "setEntryWarnings",
  "setSentenceStatus"
]
      SYMBOL_MAP = {
  "clearDiagnosticsFlushTimer": "clear_diagnostics_flush_timer",
  "pushRuntimeLog": "push_runtime_log",
  "recordDiagnosticError": "record_diagnostic_error",
  "recordDiagnosticPerf": "record_diagnostic_perf",
  "renderDiagnosticsPanel": "render_diagnostics_panel",
  "renderDiagnosticsSummary": "render_diagnostics_summary",
  "scheduleDiagnosticsFlush": "schedule_diagnostics_flush",
  "setEntryWarnings": "set_entry_warnings",
  "setSentenceStatus": "set_sentence_status"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.clear_diagnostics_flush_timer(*args)
        raise NotImplementedError, "Equivalent stub for 'clearDiagnosticsFlushTimer' from brain/wrappers/renderer_diagnostics_domain.js"
      end

      def self.push_runtime_log(*args)
        raise NotImplementedError, "Equivalent stub for 'pushRuntimeLog' from brain/wrappers/renderer_diagnostics_domain.js"
      end

      def self.record_diagnostic_error(*args)
        raise NotImplementedError, "Equivalent stub for 'recordDiagnosticError' from brain/wrappers/renderer_diagnostics_domain.js"
      end

      def self.record_diagnostic_perf(*args)
        raise NotImplementedError, "Equivalent stub for 'recordDiagnosticPerf' from brain/wrappers/renderer_diagnostics_domain.js"
      end

      def self.render_diagnostics_panel(*args)
        raise NotImplementedError, "Equivalent stub for 'renderDiagnosticsPanel' from brain/wrappers/renderer_diagnostics_domain.js"
      end

      def self.render_diagnostics_summary(*args)
        raise NotImplementedError, "Equivalent stub for 'renderDiagnosticsSummary' from brain/wrappers/renderer_diagnostics_domain.js"
      end

      def self.schedule_diagnostics_flush(*args)
        raise NotImplementedError, "Equivalent stub for 'scheduleDiagnosticsFlush' from brain/wrappers/renderer_diagnostics_domain.js"
      end

      def self.set_entry_warnings(*args)
        raise NotImplementedError, "Equivalent stub for 'setEntryWarnings' from brain/wrappers/renderer_diagnostics_domain.js"
      end

      def self.set_sentence_status(*args)
        raise NotImplementedError, "Equivalent stub for 'setSentenceStatus' from brain/wrappers/renderer_diagnostics_domain.js"
      end
    end
  end
end
