# frozen_string_literal: true

require_relative "../../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "main/boot/app_boot_runtime.js"
      EQUIVALENT_KIND = "repo_module_proxy"
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

      def self.bind_app_lifecycle_hooks(*args, **kwargs)
        invoke_source_function("bind_app_lifecycle_hooks", *args, **kwargs)
      end

      def self.bind_runtime_error_hooks(*args, **kwargs)
        invoke_source_function("bind_runtime_error_hooks", *args, **kwargs)
      end

      def self.create_and_show_main_window(*args, **kwargs)
        invoke_source_function("create_and_show_main_window", *args, **kwargs)
      end

      def self.create_app_boot_runtime(*args, **kwargs)
        invoke_source_function("create_app_boot_runtime", *args, **kwargs)
      end

      def self.log_app_ready_diagnostics(*args, **kwargs)
        invoke_source_function("log_app_ready_diagnostics", *args, **kwargs)
      end

      def self.log_runtime(*args, **kwargs)
        invoke_source_function("log_runtime", *args, **kwargs)
      end

      def self.maybe_recover_from_gpu_crash(*args, **kwargs)
        invoke_source_function("maybe_recover_from_gpu_crash", *args, **kwargs)
      end

      def self.open_log_console_if_requested(*args, **kwargs)
        invoke_source_function("open_log_console_if_requested", *args, **kwargs)
      end

      def self.run_window_lifecycle_wrapper(*args, **kwargs)
        invoke_source_function("run_window_lifecycle_wrapper", *args, **kwargs)
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
