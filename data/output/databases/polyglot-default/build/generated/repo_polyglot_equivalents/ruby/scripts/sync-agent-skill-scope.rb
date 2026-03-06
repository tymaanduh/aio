# frozen_string_literal: true

require_relative "../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "scripts/sync-agent-skill-scope.js"
      EQUIVALENT_KIND = "repo_module_proxy"
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

      def self.build_default_prompt(*args, **kwargs)
        invoke_source_function("buildDefaultPrompt", *args, **kwargs)
      end

      def self.dedupe_case_insensitive(*args, **kwargs)
        invoke_source_function("dedupeCaseInsensitive", *args, **kwargs)
      end

      def self.ensure_agent_yaml_scope(*args, **kwargs)
        invoke_source_function("ensureAgentYamlScope", *args, **kwargs)
      end

      def self.ensure_hard_governance_agent_contract(*args, **kwargs)
        invoke_source_function("ensureHardGovernanceAgentContract", *args, **kwargs)
      end

      def self.ensure_keyword_rule(*args, **kwargs)
        invoke_source_function("ensureKeywordRule", *args, **kwargs)
      end

      def self.ensure_open_ai_yaml_scope(*args, **kwargs)
        invoke_source_function("ensureOpenAiYamlScope", *args, **kwargs)
      end

      def self.ensure_path_rule(*args, **kwargs)
        invoke_source_function("ensurePathRule", *args, **kwargs)
      end

      def self.ensure_skill_markdown_scope(*args, **kwargs)
        invoke_source_function("ensureSkillMarkdownScope", *args, **kwargs)
      end

      def self.main(*args, **kwargs)
        invoke_source_function("main", *args, **kwargs)
      end

      def self.normalize_rule_value(*args, **kwargs)
        invoke_source_function("normalizeRuleValue", *args, **kwargs)
      end

      def self.normalize_skills(*args, **kwargs)
        invoke_source_function("normalizeSkills", *args, **kwargs)
      end

      def self.normalize_string(*args, **kwargs)
        invoke_source_function("normalizeString", *args, **kwargs)
      end

      def self.read_json(*args, **kwargs)
        invoke_source_function("readJson", *args, **kwargs)
      end

      def self.read_text(*args, **kwargs)
        invoke_source_function("readText", *args, **kwargs)
      end

      def self.skill_signature(*args, **kwargs)
        invoke_source_function("skillSignature", *args, **kwargs)
      end

      def self.title_case_skill_name(*args, **kwargs)
        invoke_source_function("titleCaseSkillName", *args, **kwargs)
      end

      def self.update_agent_access_control_json(*args, **kwargs)
        invoke_source_function("updateAgentAccessControlJson", *args, **kwargs)
      end

      def self.update_agents_registry_yaml(*args, **kwargs)
        invoke_source_function("updateAgentsRegistryYaml", *args, **kwargs)
      end

      def self.update_agent_workflows_json(*args, **kwargs)
        invoke_source_function("updateAgentWorkflowsJson", *args, **kwargs)
      end

      def self.update_repeat_action_routing_json(*args, **kwargs)
        invoke_source_function("updateRepeatActionRoutingJson", *args, **kwargs)
      end

      def self.write_json(*args, **kwargs)
        invoke_source_function("writeJson", *args, **kwargs)
      end

      def self.write_text(*args, **kwargs)
        invoke_source_function("writeText", *args, **kwargs)
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
