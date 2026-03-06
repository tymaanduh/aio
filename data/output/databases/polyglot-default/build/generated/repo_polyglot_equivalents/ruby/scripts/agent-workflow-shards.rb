# frozen_string_literal: true

require_relative "../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "scripts/agent-workflow-shards.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
  "buildShards",
  "ensureDir",
  "ensureShardsCurrent",
  "getPaths",
  "isShardsCurrent",
  "listWorkflowAgents",
  "loadWorkflowFromCanonical",
  "loadWorkflowFromShards",
  "normalizePathForJson",
  "normalizeScopeGuardrailsCatalog",
  "normalizeText",
  "readCanonicalDoc",
  "readJson",
  "readShardIndex",
  "readWorkflowDoc",
  "resolveScopeGuardrails",
  "sha256",
  "toShardFileName",
  "writeJsonIfChanged"
]
      SYMBOL_MAP = {
  "buildShards": "build_shards",
  "ensureDir": "ensure_dir",
  "ensureShardsCurrent": "ensure_shards_current",
  "getPaths": "get_paths",
  "isShardsCurrent": "is_shards_current",
  "listWorkflowAgents": "list_workflow_agents",
  "loadWorkflowFromCanonical": "load_workflow_from_canonical",
  "loadWorkflowFromShards": "load_workflow_from_shards",
  "normalizePathForJson": "normalize_path_for_json",
  "normalizeScopeGuardrailsCatalog": "normalize_scope_guardrails_catalog",
  "normalizeText": "normalize_text",
  "readCanonicalDoc": "read_canonical_doc",
  "readJson": "read_json",
  "readShardIndex": "read_shard_index",
  "readWorkflowDoc": "read_workflow_doc",
  "resolveScopeGuardrails": "resolve_scope_guardrails",
  "sha256": "sha256",
  "toShardFileName": "to_shard_file_name",
  "writeJsonIfChanged": "write_json_if_changed"
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

      def self.build_shards(*args, **kwargs)
        invoke_source_function("buildShards", *args, **kwargs)
      end

      def self.ensure_dir(*args, **kwargs)
        invoke_source_function("ensureDir", *args, **kwargs)
      end

      def self.ensure_shards_current(*args, **kwargs)
        invoke_source_function("ensureShardsCurrent", *args, **kwargs)
      end

      def self.get_paths(*args, **kwargs)
        invoke_source_function("getPaths", *args, **kwargs)
      end

      def self.is_shards_current(*args, **kwargs)
        invoke_source_function("isShardsCurrent", *args, **kwargs)
      end

      def self.list_workflow_agents(*args, **kwargs)
        invoke_source_function("listWorkflowAgents", *args, **kwargs)
      end

      def self.load_workflow_from_canonical(*args, **kwargs)
        invoke_source_function("loadWorkflowFromCanonical", *args, **kwargs)
      end

      def self.load_workflow_from_shards(*args, **kwargs)
        invoke_source_function("loadWorkflowFromShards", *args, **kwargs)
      end

      def self.normalize_path_for_json(*args, **kwargs)
        invoke_source_function("normalizePathForJson", *args, **kwargs)
      end

      def self.normalize_scope_guardrails_catalog(*args, **kwargs)
        invoke_source_function("normalizeScopeGuardrailsCatalog", *args, **kwargs)
      end

      def self.normalize_text(*args, **kwargs)
        invoke_source_function("normalizeText", *args, **kwargs)
      end

      def self.read_canonical_doc(*args, **kwargs)
        invoke_source_function("readCanonicalDoc", *args, **kwargs)
      end

      def self.read_json(*args, **kwargs)
        invoke_source_function("readJson", *args, **kwargs)
      end

      def self.read_shard_index(*args, **kwargs)
        invoke_source_function("readShardIndex", *args, **kwargs)
      end

      def self.read_workflow_doc(*args, **kwargs)
        invoke_source_function("readWorkflowDoc", *args, **kwargs)
      end

      def self.resolve_scope_guardrails(*args, **kwargs)
        invoke_source_function("resolveScopeGuardrails", *args, **kwargs)
      end

      def self.sha256(*args, **kwargs)
        invoke_source_function("sha256", *args, **kwargs)
      end

      def self.to_shard_file_name(*args, **kwargs)
        invoke_source_function("toShardFileName", *args, **kwargs)
      end

      def self.write_json_if_changed(*args, **kwargs)
        invoke_source_function("writeJsonIfChanged", *args, **kwargs)
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
