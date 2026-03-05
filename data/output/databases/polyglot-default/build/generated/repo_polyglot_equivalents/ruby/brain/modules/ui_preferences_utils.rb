# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "brain/modules/ui_preferences_utils.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "cleanText",
  "createDefaultUiPreferences",
  "normalizeUiPreferences",
  "normalizeUiTheme"
]
      SYMBOL_MAP = {
  "cleanText": "clean_text",
  "createDefaultUiPreferences": "create_default_ui_preferences",
  "normalizeUiPreferences": "normalize_ui_preferences",
  "normalizeUiTheme": "normalize_ui_theme"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.clean_text(*args)
        raise NotImplementedError, "Equivalent stub for 'cleanText' from brain/modules/ui_preferences_utils.js"
      end

      def self.create_default_ui_preferences(*args)
        raise NotImplementedError, "Equivalent stub for 'createDefaultUiPreferences' from brain/modules/ui_preferences_utils.js"
      end

      def self.normalize_ui_preferences(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizeUiPreferences' from brain/modules/ui_preferences_utils.js"
      end

      def self.normalize_ui_theme(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizeUiTheme' from brain/modules/ui_preferences_utils.js"
      end
    end
  end
end
