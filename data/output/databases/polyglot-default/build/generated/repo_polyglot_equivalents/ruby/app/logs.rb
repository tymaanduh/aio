# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "app/logs.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "appendRow",
  "applyUiPreferences",
  "hydrateLogs",
  "hydrateUiPreferences",
  "normalizeTheme",
  "setStatus"
]
      SYMBOL_MAP = {
  "appendRow": "append_row",
  "applyUiPreferences": "apply_ui_preferences",
  "hydrateLogs": "hydrate_logs",
  "hydrateUiPreferences": "hydrate_ui_preferences",
  "normalizeTheme": "normalize_theme",
  "setStatus": "set_status"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.append_row(*args)
        raise NotImplementedError, "Equivalent stub for 'appendRow' from app/logs.js"
      end

      def self.apply_ui_preferences(*args)
        raise NotImplementedError, "Equivalent stub for 'applyUiPreferences' from app/logs.js"
      end

      def self.hydrate_logs(*args)
        raise NotImplementedError, "Equivalent stub for 'hydrateLogs' from app/logs.js"
      end

      def self.hydrate_ui_preferences(*args)
        raise NotImplementedError, "Equivalent stub for 'hydrateUiPreferences' from app/logs.js"
      end

      def self.normalize_theme(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizeTheme' from app/logs.js"
      end

      def self.set_status(*args)
        raise NotImplementedError, "Equivalent stub for 'setStatus' from app/logs.js"
      end
    end
  end
end
