# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "scripts/lib/agent-access-policy.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "compactAccessPolicy",
  "expandAccessPolicy",
  "normalizeList",
  "normalizeProfile",
  "normalizeText",
  "profileSignature",
  "stableProfileId"
]
      SYMBOL_MAP = {
  "compactAccessPolicy": "compact_access_policy",
  "expandAccessPolicy": "expand_access_policy",
  "normalizeList": "normalize_list",
  "normalizeProfile": "normalize_profile",
  "normalizeText": "normalize_text",
  "profileSignature": "profile_signature",
  "stableProfileId": "stable_profile_id"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.compact_access_policy(*args)
        raise NotImplementedError, "Equivalent stub for 'compactAccessPolicy' from scripts/lib/agent-access-policy.js"
      end

      def self.expand_access_policy(*args)
        raise NotImplementedError, "Equivalent stub for 'expandAccessPolicy' from scripts/lib/agent-access-policy.js"
      end

      def self.normalize_list(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizeList' from scripts/lib/agent-access-policy.js"
      end

      def self.normalize_profile(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizeProfile' from scripts/lib/agent-access-policy.js"
      end

      def self.normalize_text(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizeText' from scripts/lib/agent-access-policy.js"
      end

      def self.profile_signature(*args)
        raise NotImplementedError, "Equivalent stub for 'profileSignature' from scripts/lib/agent-access-policy.js"
      end

      def self.stable_profile_id(*args)
        raise NotImplementedError, "Equivalent stub for 'stableProfileId' from scripts/lib/agent-access-policy.js"
      end
    end
  end
end
