# frozen_string_literal: true

require_relative "../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "main/gpu_config.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
  "append_gpu_switch",
  "apply_gpu_disabled_state",
  "configure_gpu_performance_switches",
  "configure_non_windows_gpu_switches",
  "configure_windows_gpu_switches",
  "configureGpuMode",
  "disable_hardware_acceleration",
  "getGpuDiagnostics",
  "getGpuState",
  "incrementGpuCrashCount",
  "normalize_gpu_token",
  "normalizeOptionalToken"
]
      SYMBOL_MAP = {
  "append_gpu_switch": "append_gpu_switch",
  "apply_gpu_disabled_state": "apply_gpu_disabled_state",
  "configure_gpu_performance_switches": "configure_gpu_performance_switches",
  "configure_non_windows_gpu_switches": "configure_non_windows_gpu_switches",
  "configure_windows_gpu_switches": "configure_windows_gpu_switches",
  "configureGpuMode": "configure_gpu_mode",
  "disable_hardware_acceleration": "disable_hardware_acceleration",
  "getGpuDiagnostics": "get_gpu_diagnostics",
  "getGpuState": "get_gpu_state",
  "incrementGpuCrashCount": "increment_gpu_crash_count",
  "normalize_gpu_token": "normalize_gpu_token",
  "normalizeOptionalToken": "normalize_optional_token"
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

      def self.append_gpu_switch(*args, **kwargs)
        invoke_source_function("append_gpu_switch", *args, **kwargs)
      end

      def self.apply_gpu_disabled_state(*args, **kwargs)
        invoke_source_function("apply_gpu_disabled_state", *args, **kwargs)
      end

      def self.configure_gpu_performance_switches(*args, **kwargs)
        invoke_source_function("configure_gpu_performance_switches", *args, **kwargs)
      end

      def self.configure_non_windows_gpu_switches(*args, **kwargs)
        invoke_source_function("configure_non_windows_gpu_switches", *args, **kwargs)
      end

      def self.configure_windows_gpu_switches(*args, **kwargs)
        invoke_source_function("configure_windows_gpu_switches", *args, **kwargs)
      end

      def self.configure_gpu_mode(*args, **kwargs)
        invoke_source_function("configureGpuMode", *args, **kwargs)
      end

      def self.disable_hardware_acceleration(*args, **kwargs)
        invoke_source_function("disable_hardware_acceleration", *args, **kwargs)
      end

      def self.get_gpu_diagnostics(*args, **kwargs)
        invoke_source_function("getGpuDiagnostics", *args, **kwargs)
      end

      def self.get_gpu_state(*args, **kwargs)
        invoke_source_function("getGpuState", *args, **kwargs)
      end

      def self.increment_gpu_crash_count(*args, **kwargs)
        invoke_source_function("incrementGpuCrashCount", *args, **kwargs)
      end

      def self.normalize_gpu_token(*args, **kwargs)
        invoke_source_function("normalize_gpu_token", *args, **kwargs)
      end

      def self.normalize_optional_token(*args, **kwargs)
        invoke_source_function("normalizeOptionalToken", *args, **kwargs)
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
