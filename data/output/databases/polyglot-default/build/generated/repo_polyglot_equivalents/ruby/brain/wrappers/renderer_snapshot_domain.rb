# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "brain/wrappers/renderer_snapshot_domain.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "buildSnapshot",
  "hydrateState",
  "initializeAuthGate",
  "loadDictionaryData",
  "submitAuth"
]
      SYMBOL_MAP = {
  "buildSnapshot": "build_snapshot",
  "hydrateState": "hydrate_state",
  "initializeAuthGate": "initialize_auth_gate",
  "loadDictionaryData": "load_dictionary_data",
  "submitAuth": "submit_auth"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.build_snapshot(*args)
        raise NotImplementedError, "Equivalent stub for 'buildSnapshot' from brain/wrappers/renderer_snapshot_domain.js"
      end

      def self.hydrate_state(*args)
        raise NotImplementedError, "Equivalent stub for 'hydrateState' from brain/wrappers/renderer_snapshot_domain.js"
      end

      def self.initialize_auth_gate(*args)
        raise NotImplementedError, "Equivalent stub for 'initializeAuthGate' from brain/wrappers/renderer_snapshot_domain.js"
      end

      def self.load_dictionary_data(*args)
        raise NotImplementedError, "Equivalent stub for 'loadDictionaryData' from brain/wrappers/renderer_snapshot_domain.js"
      end

      def self.submit_auth(*args)
        raise NotImplementedError, "Equivalent stub for 'submitAuth' from brain/wrappers/renderer_snapshot_domain.js"
      end
    end
  end
end
