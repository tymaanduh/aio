# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "main/normalize_defaults.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "createDefaultAuthState",
  "createDefaultDiagnosticsState",
  "createDefaultSentenceGraph",
  "createDefaultState",
  "createDefaultUniverseCacheState"
]
      SYMBOL_MAP = {
  "createDefaultAuthState": "create_default_auth_state",
  "createDefaultDiagnosticsState": "create_default_diagnostics_state",
  "createDefaultSentenceGraph": "create_default_sentence_graph",
  "createDefaultState": "create_default_state",
  "createDefaultUniverseCacheState": "create_default_universe_cache_state"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.create_default_auth_state(*args)
        raise NotImplementedError, "Equivalent stub for 'createDefaultAuthState' from main/normalize_defaults.js"
      end

      def self.create_default_diagnostics_state(*args)
        raise NotImplementedError, "Equivalent stub for 'createDefaultDiagnosticsState' from main/normalize_defaults.js"
      end

      def self.create_default_sentence_graph(*args)
        raise NotImplementedError, "Equivalent stub for 'createDefaultSentenceGraph' from main/normalize_defaults.js"
      end

      def self.create_default_state(*args)
        raise NotImplementedError, "Equivalent stub for 'createDefaultState' from main/normalize_defaults.js"
      end

      def self.create_default_universe_cache_state(*args)
        raise NotImplementedError, "Equivalent stub for 'createDefaultUniverseCacheState' from main/normalize_defaults.js"
      end
    end
  end
end
