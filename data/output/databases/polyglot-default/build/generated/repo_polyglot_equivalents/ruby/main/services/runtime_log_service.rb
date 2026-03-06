# frozen_string_literal: true

require_relative "../../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "main/services/runtime_log_service.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
  "append_runtime_log",
  "broadcast_runtime_log",
  "create_log_console_window",
  "create_runtime_log_result",
  "get_runtime_log_buffer",
  "get_runtime_log_status",
  "is_runtime_logs_enabled",
  "now_iso",
  "sanitize_runtime_log_entry",
  "set_runtime_logs_enabled"
]
      SYMBOL_MAP = {
  "append_runtime_log": "append_runtime_log",
  "broadcast_runtime_log": "broadcast_runtime_log",
  "create_log_console_window": "create_log_console_window",
  "create_runtime_log_result": "create_runtime_log_result",
  "get_runtime_log_buffer": "get_runtime_log_buffer",
  "get_runtime_log_status": "get_runtime_log_status",
  "is_runtime_logs_enabled": "is_runtime_logs_enabled",
  "now_iso": "now_iso",
  "sanitize_runtime_log_entry": "sanitize_runtime_log_entry",
  "set_runtime_logs_enabled": "set_runtime_logs_enabled"
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

      def self.append_runtime_log(*args, **kwargs)
        invoke_source_function("append_runtime_log", *args, **kwargs)
      end

      def self.broadcast_runtime_log(*args, **kwargs)
        invoke_source_function("broadcast_runtime_log", *args, **kwargs)
      end

      def self.create_log_console_window(*args, **kwargs)
        invoke_source_function("create_log_console_window", *args, **kwargs)
      end

      def self.create_runtime_log_result(*args, **kwargs)
        invoke_source_function("create_runtime_log_result", *args, **kwargs)
      end

      def self.get_runtime_log_buffer(*args, **kwargs)
        invoke_source_function("get_runtime_log_buffer", *args, **kwargs)
      end

      def self.get_runtime_log_status(*args, **kwargs)
        invoke_source_function("get_runtime_log_status", *args, **kwargs)
      end

      def self.is_runtime_logs_enabled(*args, **kwargs)
        invoke_source_function("is_runtime_logs_enabled", *args, **kwargs)
      end

      def self.now_iso(*args, **kwargs)
        invoke_source_function("now_iso", *args, **kwargs)
      end

      def self.sanitize_runtime_log_entry(*args, **kwargs)
        invoke_source_function("sanitize_runtime_log_entry", *args, **kwargs)
      end

      def self.set_runtime_logs_enabled(*args, **kwargs)
        invoke_source_function("set_runtime_logs_enabled", *args, **kwargs)
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
