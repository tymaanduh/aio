# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "main/boot/app_boot_runtime.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "bind_app_lifecycle_hooks",
  "bind_runtime_error_hooks",
  "create_and_show_main_window",
  "create_app_boot_runtime",
  "log_app_ready_diagnostics",
  "log_runtime",
  "maybe_recover_from_gpu_crash",
  "open_log_console_if_requested",
  "run_window_lifecycle_wrapper"
]
      SYMBOL_MAP = {
  "bind_app_lifecycle_hooks": "bind_app_lifecycle_hooks",
  "bind_runtime_error_hooks": "bind_runtime_error_hooks",
  "create_and_show_main_window": "create_and_show_main_window",
  "create_app_boot_runtime": "create_app_boot_runtime",
  "log_app_ready_diagnostics": "log_app_ready_diagnostics",
  "log_runtime": "log_runtime",
  "maybe_recover_from_gpu_crash": "maybe_recover_from_gpu_crash",
  "open_log_console_if_requested": "open_log_console_if_requested",
  "run_window_lifecycle_wrapper": "run_window_lifecycle_wrapper"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.bind_app_lifecycle_hooks(*args)
        raise NotImplementedError, "Equivalent stub for 'bind_app_lifecycle_hooks' from main/boot/app_boot_runtime.js"
      end

      def self.bind_runtime_error_hooks(*args)
        raise NotImplementedError, "Equivalent stub for 'bind_runtime_error_hooks' from main/boot/app_boot_runtime.js"
      end

      def self.create_and_show_main_window(*args)
        raise NotImplementedError, "Equivalent stub for 'create_and_show_main_window' from main/boot/app_boot_runtime.js"
      end

      def self.create_app_boot_runtime(*args)
        raise NotImplementedError, "Equivalent stub for 'create_app_boot_runtime' from main/boot/app_boot_runtime.js"
      end

      def self.log_app_ready_diagnostics(*args)
        raise NotImplementedError, "Equivalent stub for 'log_app_ready_diagnostics' from main/boot/app_boot_runtime.js"
      end

      def self.log_runtime(*args)
        raise NotImplementedError, "Equivalent stub for 'log_runtime' from main/boot/app_boot_runtime.js"
      end

      def self.maybe_recover_from_gpu_crash(*args)
        raise NotImplementedError, "Equivalent stub for 'maybe_recover_from_gpu_crash' from main/boot/app_boot_runtime.js"
      end

      def self.open_log_console_if_requested(*args)
        raise NotImplementedError, "Equivalent stub for 'open_log_console_if_requested' from main/boot/app_boot_runtime.js"
      end

      def self.run_window_lifecycle_wrapper(*args)
        raise NotImplementedError, "Equivalent stub for 'run_window_lifecycle_wrapper' from main/boot/app_boot_runtime.js"
      end
    end
  end
end
