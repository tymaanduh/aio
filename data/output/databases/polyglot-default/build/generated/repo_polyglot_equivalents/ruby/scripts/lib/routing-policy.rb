# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "scripts/lib/routing-policy.js"
      EQUIVALENT_KIND = "repo_module_stub"
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

      def self.compact_routing_doc(*args)
        raise NotImplementedError, "Equivalent stub for 'compactRoutingDoc' from scripts/lib/routing-policy.js"
      end

      def self.dedupe_case_insensitive(*args)
        raise NotImplementedError, "Equivalent stub for 'dedupeCaseInsensitive' from scripts/lib/routing-policy.js"
      end

      def self.normalize_skills(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizeSkills' from scripts/lib/routing-policy.js"
      end

      def self.normalize_skill_stacks(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizeSkillStacks' from scripts/lib/routing-policy.js"
      end

      def self.normalize_text(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizeText' from scripts/lib/routing-policy.js"
      end

      def self.read_routing_policy(*args)
        raise NotImplementedError, "Equivalent stub for 'readRoutingPolicy' from scripts/lib/routing-policy.js"
      end

      def self.resolve_routing_doc(*args)
        raise NotImplementedError, "Equivalent stub for 'resolveRoutingDoc' from scripts/lib/routing-policy.js"
      end

      def self.resolve_rule_skills(*args)
        raise NotImplementedError, "Equivalent stub for 'resolveRuleSkills' from scripts/lib/routing-policy.js"
      end

      def self.skill_signature(*args)
        raise NotImplementedError, "Equivalent stub for 'skillSignature' from scripts/lib/routing-policy.js"
      end

      def self.stable_stack_id(*args)
        raise NotImplementedError, "Equivalent stub for 'stableStackId' from scripts/lib/routing-policy.js"
      end

      def self.upsert_skill_stack(*args)
        raise NotImplementedError, "Equivalent stub for 'upsertSkillStack' from scripts/lib/routing-policy.js"
      end
    end
  end
end
