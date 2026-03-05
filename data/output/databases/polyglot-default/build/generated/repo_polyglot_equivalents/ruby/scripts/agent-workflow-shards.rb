# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "scripts/agent-workflow-shards.js"
      EQUIVALENT_KIND = "repo_module_stub"
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

      def self.build_shards(*args)
        raise NotImplementedError, "Equivalent stub for 'buildShards' from scripts/agent-workflow-shards.js"
      end

      def self.ensure_dir(*args)
        raise NotImplementedError, "Equivalent stub for 'ensureDir' from scripts/agent-workflow-shards.js"
      end

      def self.ensure_shards_current(*args)
        raise NotImplementedError, "Equivalent stub for 'ensureShardsCurrent' from scripts/agent-workflow-shards.js"
      end

      def self.get_paths(*args)
        raise NotImplementedError, "Equivalent stub for 'getPaths' from scripts/agent-workflow-shards.js"
      end

      def self.is_shards_current(*args)
        raise NotImplementedError, "Equivalent stub for 'isShardsCurrent' from scripts/agent-workflow-shards.js"
      end

      def self.list_workflow_agents(*args)
        raise NotImplementedError, "Equivalent stub for 'listWorkflowAgents' from scripts/agent-workflow-shards.js"
      end

      def self.load_workflow_from_canonical(*args)
        raise NotImplementedError, "Equivalent stub for 'loadWorkflowFromCanonical' from scripts/agent-workflow-shards.js"
      end

      def self.load_workflow_from_shards(*args)
        raise NotImplementedError, "Equivalent stub for 'loadWorkflowFromShards' from scripts/agent-workflow-shards.js"
      end

      def self.normalize_path_for_json(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizePathForJson' from scripts/agent-workflow-shards.js"
      end

      def self.normalize_scope_guardrails_catalog(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizeScopeGuardrailsCatalog' from scripts/agent-workflow-shards.js"
      end

      def self.normalize_text(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizeText' from scripts/agent-workflow-shards.js"
      end

      def self.read_canonical_doc(*args)
        raise NotImplementedError, "Equivalent stub for 'readCanonicalDoc' from scripts/agent-workflow-shards.js"
      end

      def self.read_json(*args)
        raise NotImplementedError, "Equivalent stub for 'readJson' from scripts/agent-workflow-shards.js"
      end

      def self.read_shard_index(*args)
        raise NotImplementedError, "Equivalent stub for 'readShardIndex' from scripts/agent-workflow-shards.js"
      end

      def self.read_workflow_doc(*args)
        raise NotImplementedError, "Equivalent stub for 'readWorkflowDoc' from scripts/agent-workflow-shards.js"
      end

      def self.resolve_scope_guardrails(*args)
        raise NotImplementedError, "Equivalent stub for 'resolveScopeGuardrails' from scripts/agent-workflow-shards.js"
      end

      def self.sha256(*args)
        raise NotImplementedError, "Equivalent stub for 'sha256' from scripts/agent-workflow-shards.js"
      end

      def self.to_shard_file_name(*args)
        raise NotImplementedError, "Equivalent stub for 'toShardFileName' from scripts/agent-workflow-shards.js"
      end

      def self.write_json_if_changed(*args)
        raise NotImplementedError, "Equivalent stub for 'writeJsonIfChanged' from scripts/agent-workflow-shards.js"
      end
    end
  end
end
