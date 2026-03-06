# frozen_string_literal: true

require_relative "../../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "scripts/lib/routing-policy.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
  "compactRoutingDoc",
  "dedupeCaseInsensitive",
  "normalizeSkills",
  "normalizeSkillStacks",
  "normalizeText",
  "readRoutingPolicy",
  "resolveRoutingDoc",
  "resolveRuleSkills",
  "skillSignature",
  "stableStackId",
  "upsertSkillStack"
]
      SYMBOL_MAP = {
  "compactRoutingDoc": "compact_routing_doc",
  "dedupeCaseInsensitive": "dedupe_case_insensitive",
  "normalizeSkills": "normalize_skills",
  "normalizeSkillStacks": "normalize_skill_stacks",
  "normalizeText": "normalize_text",
  "readRoutingPolicy": "read_routing_policy",
  "resolveRoutingDoc": "resolve_routing_doc",
  "resolveRuleSkills": "resolve_rule_skills",
  "skillSignature": "skill_signature",
  "stableStackId": "stable_stack_id",
  "upsertSkillStack": "upsert_skill_stack"
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

      def self.compact_routing_doc(*args, **kwargs)
        invoke_source_function("compactRoutingDoc", *args, **kwargs)
      end

      def self.dedupe_case_insensitive(*args, **kwargs)
        invoke_source_function("dedupeCaseInsensitive", *args, **kwargs)
      end

      def self.normalize_skills(*args, **kwargs)
        invoke_source_function("normalizeSkills", *args, **kwargs)
      end

      def self.normalize_skill_stacks(*args, **kwargs)
        invoke_source_function("normalizeSkillStacks", *args, **kwargs)
      end

      def self.normalize_text(*args, **kwargs)
        invoke_source_function("normalizeText", *args, **kwargs)
      end

      def self.read_routing_policy(*args, **kwargs)
        invoke_source_function("readRoutingPolicy", *args, **kwargs)
      end

      def self.resolve_routing_doc(*args, **kwargs)
        invoke_source_function("resolveRoutingDoc", *args, **kwargs)
      end

      def self.resolve_rule_skills(*args, **kwargs)
        invoke_source_function("resolveRuleSkills", *args, **kwargs)
      end

      def self.skill_signature(*args, **kwargs)
        invoke_source_function("skillSignature", *args, **kwargs)
      end

      def self.stable_stack_id(*args, **kwargs)
        invoke_source_function("stableStackId", *args, **kwargs)
      end

      def self.upsert_skill_stack(*args, **kwargs)
        invoke_source_function("upsertSkillStack", *args, **kwargs)
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
