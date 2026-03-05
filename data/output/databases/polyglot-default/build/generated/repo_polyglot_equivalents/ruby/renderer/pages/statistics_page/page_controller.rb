# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "renderer/pages/statistics_page/page_controller.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "create_page_controller"
]
      SYMBOL_MAP = {
  "create_page_controller": "create_page_controller"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.create_page_controller(*args)
        raise NotImplementedError, "Equivalent stub for 'create_page_controller' from renderer/pages/statistics_page/page_controller.js"
      end
    end
  end
end
