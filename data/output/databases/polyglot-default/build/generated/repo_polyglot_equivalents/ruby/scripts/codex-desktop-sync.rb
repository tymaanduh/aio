# frozen_string_literal: true

require_relative "../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "scripts/codex-desktop-sync.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
  "copyDirectory",
  "ensureDirectory",
  "ensureManagedDestination",
  "listFilesRecursively",
  "listSkillDirectories",
  "main",
  "normalizePath",
  "normalizeRelativePath",
  "parseArgs",
  "readJsonIfExists",
  "readManagementMarker",
  "syncAgentsSnapshot",
  "syncSkills"
]
      SYMBOL_MAP = {
  "copyDirectory": "copy_directory",
  "ensureDirectory": "ensure_directory",
  "ensureManagedDestination": "ensure_managed_destination",
  "listFilesRecursively": "list_files_recursively",
  "listSkillDirectories": "list_skill_directories",
  "main": "main",
  "normalizePath": "normalize_path",
  "normalizeRelativePath": "normalize_relative_path",
  "parseArgs": "parse_args",
  "readJsonIfExists": "read_json_if_exists",
  "readManagementMarker": "read_management_marker",
  "syncAgentsSnapshot": "sync_agents_snapshot",
  "syncSkills": "sync_skills"
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

      def self.copy_directory(*args, **kwargs)
        invoke_source_function("copyDirectory", *args, **kwargs)
      end

      def self.ensure_directory(*args, **kwargs)
        invoke_source_function("ensureDirectory", *args, **kwargs)
      end

      def self.ensure_managed_destination(*args, **kwargs)
        invoke_source_function("ensureManagedDestination", *args, **kwargs)
      end

      def self.list_files_recursively(*args, **kwargs)
        invoke_source_function("listFilesRecursively", *args, **kwargs)
      end

      def self.list_skill_directories(*args, **kwargs)
        invoke_source_function("listSkillDirectories", *args, **kwargs)
      end

      def self.main(*args, **kwargs)
        invoke_source_function("main", *args, **kwargs)
      end

      def self.normalize_path(*args, **kwargs)
        invoke_source_function("normalizePath", *args, **kwargs)
      end

      def self.normalize_relative_path(*args, **kwargs)
        invoke_source_function("normalizeRelativePath", *args, **kwargs)
      end

      def self.parse_args(*args, **kwargs)
        invoke_source_function("parseArgs", *args, **kwargs)
      end

      def self.read_json_if_exists(*args, **kwargs)
        invoke_source_function("readJsonIfExists", *args, **kwargs)
      end

      def self.read_management_marker(*args, **kwargs)
        invoke_source_function("readManagementMarker", *args, **kwargs)
      end

      def self.sync_agents_snapshot(*args, **kwargs)
        invoke_source_function("syncAgentsSnapshot", *args, **kwargs)
      end

      def self.sync_skills(*args, **kwargs)
        invoke_source_function("syncSkills", *args, **kwargs)
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
