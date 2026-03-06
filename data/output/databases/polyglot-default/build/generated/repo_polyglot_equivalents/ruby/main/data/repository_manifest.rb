# frozen_string_literal: true

require_relative "../../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "main/data/repository_manifest.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
  "build_file_meta",
  "create_manifest",
  "ensure_data_dirs",
  "file_exists",
  "get_data_paths",
  "is_plain_object",
  "load_manifest",
  "read_json_file",
  "save_manifest",
  "sync_manifest_file",
  "write_json_atomic"
]
      SYMBOL_MAP = {
  "build_file_meta": "build_file_meta",
  "create_manifest": "create_manifest",
  "ensure_data_dirs": "ensure_data_dirs",
  "file_exists": "file_exists",
  "get_data_paths": "get_data_paths",
  "is_plain_object": "is_plain_object",
  "load_manifest": "load_manifest",
  "read_json_file": "read_json_file",
  "save_manifest": "save_manifest",
  "sync_manifest_file": "sync_manifest_file",
  "write_json_atomic": "write_json_atomic"
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

      def self.build_file_meta(*args, **kwargs)
        invoke_source_function("build_file_meta", *args, **kwargs)
      end

      def self.create_manifest(*args, **kwargs)
        invoke_source_function("create_manifest", *args, **kwargs)
      end

      def self.ensure_data_dirs(*args, **kwargs)
        invoke_source_function("ensure_data_dirs", *args, **kwargs)
      end

      def self.file_exists(*args, **kwargs)
        invoke_source_function("file_exists", *args, **kwargs)
      end

      def self.get_data_paths(*args, **kwargs)
        invoke_source_function("get_data_paths", *args, **kwargs)
      end

      def self.is_plain_object(*args, **kwargs)
        invoke_source_function("is_plain_object", *args, **kwargs)
      end

      def self.load_manifest(*args, **kwargs)
        invoke_source_function("load_manifest", *args, **kwargs)
      end

      def self.read_json_file(*args, **kwargs)
        invoke_source_function("read_json_file", *args, **kwargs)
      end

      def self.save_manifest(*args, **kwargs)
        invoke_source_function("save_manifest", *args, **kwargs)
      end

      def self.sync_manifest_file(*args, **kwargs)
        invoke_source_function("sync_manifest_file", *args, **kwargs)
      end

      def self.write_json_atomic(*args, **kwargs)
        invoke_source_function("write_json_atomic", *args, **kwargs)
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
