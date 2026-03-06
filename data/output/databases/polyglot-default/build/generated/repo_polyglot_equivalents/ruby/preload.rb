# frozen_string_literal: true

require_relative "_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "preload.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
  "apply_flat_alias_methods",
  "build_namespace_api",
  "create_forward_method",
  "create_invoke_method",
  "create_runtime_log_listener",
  "is_plain_object",
  "listener",
  "resolve_arg_normalizers",
  "resolve_channel_by_key",
  "resolve_method_by_path",
  "resolve_namespace_channels"
]
      SYMBOL_MAP = {
  "apply_flat_alias_methods": "apply_flat_alias_methods",
  "build_namespace_api": "build_namespace_api",
  "create_forward_method": "create_forward_method",
  "create_invoke_method": "create_invoke_method",
  "create_runtime_log_listener": "create_runtime_log_listener",
  "is_plain_object": "is_plain_object",
  "listener": "listener",
  "resolve_arg_normalizers": "resolve_arg_normalizers",
  "resolve_channel_by_key": "resolve_channel_by_key",
  "resolve_method_by_path": "resolve_method_by_path",
  "resolve_namespace_channels": "resolve_namespace_channels"
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

      def self.apply_flat_alias_methods(*args, **kwargs)
        invoke_source_function("apply_flat_alias_methods", *args, **kwargs)
      end

      def self.build_namespace_api(*args, **kwargs)
        invoke_source_function("build_namespace_api", *args, **kwargs)
      end

      def self.create_forward_method(*args, **kwargs)
        invoke_source_function("create_forward_method", *args, **kwargs)
      end

      def self.create_invoke_method(*args, **kwargs)
        invoke_source_function("create_invoke_method", *args, **kwargs)
      end

      def self.create_runtime_log_listener(*args, **kwargs)
        invoke_source_function("create_runtime_log_listener", *args, **kwargs)
      end

      def self.is_plain_object(*args, **kwargs)
        invoke_source_function("is_plain_object", *args, **kwargs)
      end

      def self.listener(*args, **kwargs)
        invoke_source_function("listener", *args, **kwargs)
      end

      def self.resolve_arg_normalizers(*args, **kwargs)
        invoke_source_function("resolve_arg_normalizers", *args, **kwargs)
      end

      def self.resolve_channel_by_key(*args, **kwargs)
        invoke_source_function("resolve_channel_by_key", *args, **kwargs)
      end

      def self.resolve_method_by_path(*args, **kwargs)
        invoke_source_function("resolve_method_by_path", *args, **kwargs)
      end

      def self.resolve_namespace_channels(*args, **kwargs)
        invoke_source_function("resolve_namespace_channels", *args, **kwargs)
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
