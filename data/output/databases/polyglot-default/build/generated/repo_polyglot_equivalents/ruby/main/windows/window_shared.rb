# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "main/windows/window_shared.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "create_browser_window",
  "create_window_chrome_options",
  "create_window_from_spec",
  "is_windows_platform",
  "resolve_window_view_path"
]
      SYMBOL_MAP = {
  "create_browser_window": "create_browser_window",
  "create_window_chrome_options": "create_window_chrome_options",
  "create_window_from_spec": "create_window_from_spec",
  "is_windows_platform": "is_windows_platform",
  "resolve_window_view_path": "resolve_window_view_path"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.create_browser_window(*args)
        raise NotImplementedError, "Equivalent stub for 'create_browser_window' from main/windows/window_shared.js"
      end

      def self.create_window_chrome_options(*args)
        raise NotImplementedError, "Equivalent stub for 'create_window_chrome_options' from main/windows/window_shared.js"
      end

      def self.create_window_from_spec(*args)
        raise NotImplementedError, "Equivalent stub for 'create_window_from_spec' from main/windows/window_shared.js"
      end

      def self.is_windows_platform(*args)
        raise NotImplementedError, "Equivalent stub for 'is_windows_platform' from main/windows/window_shared.js"
      end

      def self.resolve_window_view_path(*args)
        raise NotImplementedError, "Equivalent stub for 'resolve_window_view_path' from main/windows/window_shared.js"
      end
    end
  end
end
