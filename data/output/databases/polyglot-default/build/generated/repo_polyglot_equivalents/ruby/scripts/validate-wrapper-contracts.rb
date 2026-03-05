# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "scripts/validate-wrapper-contracts.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "compareInputLists",
  "escapeRegExp",
  "issue",
  "listJsFiles",
  "main",
  "normalizeInputList",
  "normalizeText",
  "parseArgs",
  "readJson",
  "requireArg",
  "symbolPatternForLanguage",
  "validate"
]
      SYMBOL_MAP = {
  "compareInputLists": "compare_input_lists",
  "escapeRegExp": "escape_reg_exp",
  "issue": "issue",
  "listJsFiles": "list_js_files",
  "main": "main",
  "normalizeInputList": "normalize_input_list",
  "normalizeText": "normalize_text",
  "parseArgs": "parse_args",
  "readJson": "read_json",
  "requireArg": "require_arg",
  "symbolPatternForLanguage": "symbol_pattern_for_language",
  "validate": "validate"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.compare_input_lists(*args)
        raise NotImplementedError, "Equivalent stub for 'compareInputLists' from scripts/validate-wrapper-contracts.js"
      end

      def self.escape_reg_exp(*args)
        raise NotImplementedError, "Equivalent stub for 'escapeRegExp' from scripts/validate-wrapper-contracts.js"
      end

      def self.issue(*args)
        raise NotImplementedError, "Equivalent stub for 'issue' from scripts/validate-wrapper-contracts.js"
      end

      def self.list_js_files(*args)
        raise NotImplementedError, "Equivalent stub for 'listJsFiles' from scripts/validate-wrapper-contracts.js"
      end

      def self.main(*args)
        raise NotImplementedError, "Equivalent stub for 'main' from scripts/validate-wrapper-contracts.js"
      end

      def self.normalize_input_list(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizeInputList' from scripts/validate-wrapper-contracts.js"
      end

      def self.normalize_text(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizeText' from scripts/validate-wrapper-contracts.js"
      end

      def self.parse_args(*args)
        raise NotImplementedError, "Equivalent stub for 'parseArgs' from scripts/validate-wrapper-contracts.js"
      end

      def self.read_json(*args)
        raise NotImplementedError, "Equivalent stub for 'readJson' from scripts/validate-wrapper-contracts.js"
      end

      def self.require_arg(*args)
        raise NotImplementedError, "Equivalent stub for 'requireArg' from scripts/validate-wrapper-contracts.js"
      end

      def self.symbol_pattern_for_language(*args)
        raise NotImplementedError, "Equivalent stub for 'symbolPatternForLanguage' from scripts/validate-wrapper-contracts.js"
      end

      def self.validate(*args)
        raise NotImplementedError, "Equivalent stub for 'validate' from scripts/validate-wrapper-contracts.js"
      end
    end
  end
end
