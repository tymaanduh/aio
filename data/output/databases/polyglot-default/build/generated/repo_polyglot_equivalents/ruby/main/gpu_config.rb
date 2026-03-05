# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "main/gpu_config.js"
      EQUIVALENT_KIND = "repo_module_stub"
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

      def self.append_gpu_switch(*args)
        raise NotImplementedError, "Equivalent stub for 'append_gpu_switch' from main/gpu_config.js"
      end

      def self.apply_gpu_disabled_state(*args)
        raise NotImplementedError, "Equivalent stub for 'apply_gpu_disabled_state' from main/gpu_config.js"
      end

      def self.configure_gpu_performance_switches(*args)
        raise NotImplementedError, "Equivalent stub for 'configure_gpu_performance_switches' from main/gpu_config.js"
      end

      def self.configure_non_windows_gpu_switches(*args)
        raise NotImplementedError, "Equivalent stub for 'configure_non_windows_gpu_switches' from main/gpu_config.js"
      end

      def self.configure_windows_gpu_switches(*args)
        raise NotImplementedError, "Equivalent stub for 'configure_windows_gpu_switches' from main/gpu_config.js"
      end

      def self.configure_gpu_mode(*args)
        raise NotImplementedError, "Equivalent stub for 'configureGpuMode' from main/gpu_config.js"
      end

      def self.disable_hardware_acceleration(*args)
        raise NotImplementedError, "Equivalent stub for 'disable_hardware_acceleration' from main/gpu_config.js"
      end

      def self.get_gpu_diagnostics(*args)
        raise NotImplementedError, "Equivalent stub for 'getGpuDiagnostics' from main/gpu_config.js"
      end

      def self.get_gpu_state(*args)
        raise NotImplementedError, "Equivalent stub for 'getGpuState' from main/gpu_config.js"
      end

      def self.increment_gpu_crash_count(*args)
        raise NotImplementedError, "Equivalent stub for 'incrementGpuCrashCount' from main/gpu_config.js"
      end

      def self.normalize_gpu_token(*args)
        raise NotImplementedError, "Equivalent stub for 'normalize_gpu_token' from main/gpu_config.js"
      end

      def self.normalize_optional_token(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizeOptionalToken' from main/gpu_config.js"
      end
    end
  end
end
