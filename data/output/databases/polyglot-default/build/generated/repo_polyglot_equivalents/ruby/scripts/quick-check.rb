# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "scripts/quick-check.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "ev",
  "handler",
  "send"
]
      SYMBOL_MAP = {
  "ev": "ev",
  "handler": "handler",
  "send": "send"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.ev(*args)
        raise NotImplementedError, "Equivalent stub for 'ev' from scripts/quick-check.js"
      end

      def self.handler(*args)
        raise NotImplementedError, "Equivalent stub for 'handler' from scripts/quick-check.js"
      end

      def self.send(*args)
        raise NotImplementedError, "Equivalent stub for 'send' from scripts/quick-check.js"
      end
    end
  end
end
