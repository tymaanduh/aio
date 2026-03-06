# frozen_string_literal: true

require_relative "../../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "brain/wrappers/renderer_diagnostics_domain.js"
      EQUIVALENT_KIND = "repo_module_proxy"
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

      def self.invoke_source_function(function_name, *args, **kwargs)
        Aio::RepoPolyglotEquivalents::Shared::RepoModuleProxy.invoke_js_function(
          SOURCE_JS_FILE,
          function_name,
          args,
          kwargs
        )
      end

      def self.run_source_entrypoint(args = [])
        Aio::RepoPolyglotEquivalents::Shared::RepoModuleProxy.run_js_entrypoint(SOURCE_JS_FILE, args)
      end

      def self.clear_diagnostics_flush_timer(*args, **kwargs)
        invoke_source_function("clearDiagnosticsFlushTimer", *args, **kwargs)
      end

      def self.push_runtime_log(*args, **kwargs)
        invoke_source_function("pushRuntimeLog", *args, **kwargs)
      end

      def self.record_diagnostic_error(*args, **kwargs)
        invoke_source_function("recordDiagnosticError", *args, **kwargs)
      end

      def self.record_diagnostic_perf(*args, **kwargs)
        invoke_source_function("recordDiagnosticPerf", *args, **kwargs)
      end

      def self.render_diagnostics_panel(*args, **kwargs)
        invoke_source_function("renderDiagnosticsPanel", *args, **kwargs)
      end

      def self.render_diagnostics_summary(*args, **kwargs)
        invoke_source_function("renderDiagnosticsSummary", *args, **kwargs)
      end

      def self.schedule_diagnostics_flush(*args, **kwargs)
        invoke_source_function("scheduleDiagnosticsFlush", *args, **kwargs)
      end

      def self.set_entry_warnings(*args, **kwargs)
        invoke_source_function("setEntryWarnings", *args, **kwargs)
      end

      def self.set_sentence_status(*args, **kwargs)
        invoke_source_function("setSentenceStatus", *args, **kwargs)
      end
    end
  end
end

if __FILE__ == $PROGRAM_NAME
  args = ARGV.dup
  function_flag_index = args.index("--function")
  if function_flag_index
    function_name = args[function_flag_index + 1] || ""
    args_json_index = args.index("--args-json")
    args_json = args_json_index ? (args[args_json_index + 1] || "[]") : "[]"
    result = Aio::RepoPolyglotEquivalents::ModuleProxy.invoke_source_function(
      function_name,
      *Array(JSON.parse(args_json))
    )
    puts(JSON.generate({ ok: true, result: result }))
    exit(0)
  end

  report = Aio::RepoPolyglotEquivalents::ModuleProxy.run_source_entrypoint(ARGV)
  exit(Integer(report.fetch("exit_code", 0)))
end
