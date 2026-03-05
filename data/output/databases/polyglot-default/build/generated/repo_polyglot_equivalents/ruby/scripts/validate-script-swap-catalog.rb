# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "scripts/validate-script-swap-catalog.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "issue",
  "loadJson",
  "main",
  "normalizePath",
  "runValidation",
  "toLanguageId"
]
      SYMBOL_MAP = {
  "issue": "issue",
  "loadJson": "load_json",
  "main": "main",
  "normalizePath": "normalize_path",
  "runValidation": "run_validation",
  "toLanguageId": "to_language_id"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.issue(*args)
        raise NotImplementedError, "Equivalent stub for 'issue' from scripts/validate-script-swap-catalog.js"
      end

      def self.load_json(*args)
        raise NotImplementedError, "Equivalent stub for 'loadJson' from scripts/validate-script-swap-catalog.js"
      end

      def self.main(*args)
        raise NotImplementedError, "Equivalent stub for 'main' from scripts/validate-script-swap-catalog.js"
      end

      def self.normalize_path(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizePath' from scripts/validate-script-swap-catalog.js"
      end

      def self.run_validation(*args)
        raise NotImplementedError, "Equivalent stub for 'runValidation' from scripts/validate-script-swap-catalog.js"
      end

      def self.to_language_id(*args)
        raise NotImplementedError, "Equivalent stub for 'toLanguageId' from scripts/validate-script-swap-catalog.js"
      end
    end
  end
end
