# frozen_string_literal: true

require_relative "../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "scripts/project-source-resolver.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
  "fileExists",
  "findProjectRoot",
  "isAgentAccessControlFile",
  "isFile",
  "listMatchingFiles",
  "normalizePath",
  "resolveAgentAccessControl",
  "resolveMaybeRelocatedPath",
  "resolveRequestLogFile",
  "resolveUpdateLogPaths",
  "shouldIgnoreDirectory"
]
      SYMBOL_MAP = {
  "fileExists": "file_exists",
  "findProjectRoot": "find_project_root",
  "isAgentAccessControlFile": "is_agent_access_control_file",
  "isFile": "is_file",
  "listMatchingFiles": "list_matching_files",
  "normalizePath": "normalize_path",
  "resolveAgentAccessControl": "resolve_agent_access_control",
  "resolveMaybeRelocatedPath": "resolve_maybe_relocated_path",
  "resolveRequestLogFile": "resolve_request_log_file",
  "resolveUpdateLogPaths": "resolve_update_log_paths",
  "shouldIgnoreDirectory": "should_ignore_directory"
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

      def self.file_exists(*args, **kwargs)
        invoke_source_function("fileExists", *args, **kwargs)
      end

      def self.find_project_root(*args, **kwargs)
        invoke_source_function("findProjectRoot", *args, **kwargs)
      end

      def self.is_agent_access_control_file(*args, **kwargs)
        invoke_source_function("isAgentAccessControlFile", *args, **kwargs)
      end

      def self.is_file(*args, **kwargs)
        invoke_source_function("isFile", *args, **kwargs)
      end

      def self.list_matching_files(*args, **kwargs)
        invoke_source_function("listMatchingFiles", *args, **kwargs)
      end

      def self.normalize_path(*args, **kwargs)
        invoke_source_function("normalizePath", *args, **kwargs)
      end

      def self.resolve_agent_access_control(*args, **kwargs)
        invoke_source_function("resolveAgentAccessControl", *args, **kwargs)
      end

      def self.resolve_maybe_relocated_path(*args, **kwargs)
        invoke_source_function("resolveMaybeRelocatedPath", *args, **kwargs)
      end

      def self.resolve_request_log_file(*args, **kwargs)
        invoke_source_function("resolveRequestLogFile", *args, **kwargs)
      end

      def self.resolve_update_log_paths(*args, **kwargs)
        invoke_source_function("resolveUpdateLogPaths", *args, **kwargs)
      end

      def self.should_ignore_directory(*args, **kwargs)
        invoke_source_function("shouldIgnoreDirectory", *args, **kwargs)
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
