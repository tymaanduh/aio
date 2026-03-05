# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "scripts/sync-agent-skill-scope.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "buildDefaultPrompt",
  "dedupeCaseInsensitive",
  "ensureAgentYamlScope",
  "ensureHardGovernanceAgentContract",
  "ensureKeywordRule",
  "ensureOpenAiYamlScope",
  "ensurePathRule",
  "ensureSkillMarkdownScope",
  "main",
  "normalizeRuleValue",
  "normalizeSkills",
  "normalizeString",
  "readJson",
  "readText",
  "skillSignature",
  "titleCaseSkillName",
  "updateAgentAccessControlJson",
  "updateAgentsRegistryYaml",
  "updateAgentWorkflowsJson",
  "updateRepeatActionRoutingJson",
  "writeJson",
  "writeText"
]
      SYMBOL_MAP = {
  "buildDefaultPrompt": "build_default_prompt",
  "dedupeCaseInsensitive": "dedupe_case_insensitive",
  "ensureAgentYamlScope": "ensure_agent_yaml_scope",
  "ensureHardGovernanceAgentContract": "ensure_hard_governance_agent_contract",
  "ensureKeywordRule": "ensure_keyword_rule",
  "ensureOpenAiYamlScope": "ensure_open_ai_yaml_scope",
  "ensurePathRule": "ensure_path_rule",
  "ensureSkillMarkdownScope": "ensure_skill_markdown_scope",
  "main": "main",
  "normalizeRuleValue": "normalize_rule_value",
  "normalizeSkills": "normalize_skills",
  "normalizeString": "normalize_string",
  "readJson": "read_json",
  "readText": "read_text",
  "skillSignature": "skill_signature",
  "titleCaseSkillName": "title_case_skill_name",
  "updateAgentAccessControlJson": "update_agent_access_control_json",
  "updateAgentsRegistryYaml": "update_agents_registry_yaml",
  "updateAgentWorkflowsJson": "update_agent_workflows_json",
  "updateRepeatActionRoutingJson": "update_repeat_action_routing_json",
  "writeJson": "write_json",
  "writeText": "write_text"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.build_default_prompt(*args)
        raise NotImplementedError, "Equivalent stub for 'buildDefaultPrompt' from scripts/sync-agent-skill-scope.js"
      end

      def self.dedupe_case_insensitive(*args)
        raise NotImplementedError, "Equivalent stub for 'dedupeCaseInsensitive' from scripts/sync-agent-skill-scope.js"
      end

      def self.ensure_agent_yaml_scope(*args)
        raise NotImplementedError, "Equivalent stub for 'ensureAgentYamlScope' from scripts/sync-agent-skill-scope.js"
      end

      def self.ensure_hard_governance_agent_contract(*args)
        raise NotImplementedError, "Equivalent stub for 'ensureHardGovernanceAgentContract' from scripts/sync-agent-skill-scope.js"
      end

      def self.ensure_keyword_rule(*args)
        raise NotImplementedError, "Equivalent stub for 'ensureKeywordRule' from scripts/sync-agent-skill-scope.js"
      end

      def self.ensure_open_ai_yaml_scope(*args)
        raise NotImplementedError, "Equivalent stub for 'ensureOpenAiYamlScope' from scripts/sync-agent-skill-scope.js"
      end

      def self.ensure_path_rule(*args)
        raise NotImplementedError, "Equivalent stub for 'ensurePathRule' from scripts/sync-agent-skill-scope.js"
      end

      def self.ensure_skill_markdown_scope(*args)
        raise NotImplementedError, "Equivalent stub for 'ensureSkillMarkdownScope' from scripts/sync-agent-skill-scope.js"
      end

      def self.main(*args)
        raise NotImplementedError, "Equivalent stub for 'main' from scripts/sync-agent-skill-scope.js"
      end

      def self.normalize_rule_value(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizeRuleValue' from scripts/sync-agent-skill-scope.js"
      end

      def self.normalize_skills(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizeSkills' from scripts/sync-agent-skill-scope.js"
      end

      def self.normalize_string(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizeString' from scripts/sync-agent-skill-scope.js"
      end

      def self.read_json(*args)
        raise NotImplementedError, "Equivalent stub for 'readJson' from scripts/sync-agent-skill-scope.js"
      end

      def self.read_text(*args)
        raise NotImplementedError, "Equivalent stub for 'readText' from scripts/sync-agent-skill-scope.js"
      end

      def self.skill_signature(*args)
        raise NotImplementedError, "Equivalent stub for 'skillSignature' from scripts/sync-agent-skill-scope.js"
      end

      def self.title_case_skill_name(*args)
        raise NotImplementedError, "Equivalent stub for 'titleCaseSkillName' from scripts/sync-agent-skill-scope.js"
      end

      def self.update_agent_access_control_json(*args)
        raise NotImplementedError, "Equivalent stub for 'updateAgentAccessControlJson' from scripts/sync-agent-skill-scope.js"
      end

      def self.update_agents_registry_yaml(*args)
        raise NotImplementedError, "Equivalent stub for 'updateAgentsRegistryYaml' from scripts/sync-agent-skill-scope.js"
      end

      def self.update_agent_workflows_json(*args)
        raise NotImplementedError, "Equivalent stub for 'updateAgentWorkflowsJson' from scripts/sync-agent-skill-scope.js"
      end

      def self.update_repeat_action_routing_json(*args)
        raise NotImplementedError, "Equivalent stub for 'updateRepeatActionRoutingJson' from scripts/sync-agent-skill-scope.js"
      end

      def self.write_json(*args)
        raise NotImplementedError, "Equivalent stub for 'writeJson' from scripts/sync-agent-skill-scope.js"
      end

      def self.write_text(*args)
        raise NotImplementedError, "Equivalent stub for 'writeText' from scripts/sync-agent-skill-scope.js"
      end
    end
  end
end
