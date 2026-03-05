# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "scripts/validate-agent-registry.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "buildReport",
  "compareArray",
  "findSinglePath",
  "main",
  "normalizeList",
  "normalizeScopeGuardrailsCatalog",
  "parseArgs",
  "readYaml",
  "resolveAccessAllowedPaths",
  "resolveScopeGuardrails"
]
      SYMBOL_MAP = {
  "buildReport": "build_report",
  "compareArray": "compare_array",
  "findSinglePath": "find_single_path",
  "main": "main",
  "normalizeList": "normalize_list",
  "normalizeScopeGuardrailsCatalog": "normalize_scope_guardrails_catalog",
  "parseArgs": "parse_args",
  "readYaml": "read_yaml",
  "resolveAccessAllowedPaths": "resolve_access_allowed_paths",
  "resolveScopeGuardrails": "resolve_scope_guardrails"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.build_report(*args)
        raise NotImplementedError, "Equivalent stub for 'buildReport' from scripts/validate-agent-registry.js"
      end

      def self.compare_array(*args)
        raise NotImplementedError, "Equivalent stub for 'compareArray' from scripts/validate-agent-registry.js"
      end

      def self.find_single_path(*args)
        raise NotImplementedError, "Equivalent stub for 'findSinglePath' from scripts/validate-agent-registry.js"
      end

      def self.main(*args)
        raise NotImplementedError, "Equivalent stub for 'main' from scripts/validate-agent-registry.js"
      end

      def self.normalize_list(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizeList' from scripts/validate-agent-registry.js"
      end

      def self.normalize_scope_guardrails_catalog(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizeScopeGuardrailsCatalog' from scripts/validate-agent-registry.js"
      end

      def self.parse_args(*args)
        raise NotImplementedError, "Equivalent stub for 'parseArgs' from scripts/validate-agent-registry.js"
      end

      def self.read_yaml(*args)
        raise NotImplementedError, "Equivalent stub for 'readYaml' from scripts/validate-agent-registry.js"
      end

      def self.resolve_access_allowed_paths(*args)
        raise NotImplementedError, "Equivalent stub for 'resolveAccessAllowedPaths' from scripts/validate-agent-registry.js"
      end

      def self.resolve_scope_guardrails(*args)
        raise NotImplementedError, "Equivalent stub for 'resolveScopeGuardrails' from scripts/validate-agent-registry.js"
      end
    end
  end
end
