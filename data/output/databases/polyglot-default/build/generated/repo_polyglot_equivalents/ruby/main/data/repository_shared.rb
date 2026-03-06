# frozen_string_literal: true

require_relative "../../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "main/data/repository_shared.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
  "build_user_data_export_path",
  "create_export_stamp",
  "create_repository_result",
  "create_repository_state_api",
  "ensure_repository_file",
  "load_repository_state",
  "now_iso",
  "save_repository_state"
]
      SYMBOL_MAP = {
  "build_user_data_export_path": "build_user_data_export_path",
  "create_export_stamp": "create_export_stamp",
  "create_repository_result": "create_repository_result",
  "create_repository_state_api": "create_repository_state_api",
  "ensure_repository_file": "ensure_repository_file",
  "load_repository_state": "load_repository_state",
  "now_iso": "now_iso",
  "save_repository_state": "save_repository_state"
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

      def self.build_user_data_export_path(*args, **kwargs)
        invoke_source_function("build_user_data_export_path", *args, **kwargs)
      end

      def self.create_export_stamp(*args, **kwargs)
        invoke_source_function("create_export_stamp", *args, **kwargs)
      end

      def self.create_repository_result(*args, **kwargs)
        invoke_source_function("create_repository_result", *args, **kwargs)
      end

      def self.create_repository_state_api(*args, **kwargs)
        invoke_source_function("create_repository_state_api", *args, **kwargs)
      end

      def self.ensure_repository_file(*args, **kwargs)
        invoke_source_function("ensure_repository_file", *args, **kwargs)
      end

      def self.load_repository_state(*args, **kwargs)
        invoke_source_function("load_repository_state", *args, **kwargs)
      end

      def self.now_iso(*args, **kwargs)
        invoke_source_function("now_iso", *args, **kwargs)
      end

      def self.save_repository_state(*args, **kwargs)
        invoke_source_function("save_repository_state", *args, **kwargs)
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
