# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "renderer/pages/universe_page/page_post_load.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "run_page_post_load"
]
      SYMBOL_MAP = {
  "run_page_post_load": "run_page_post_load"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.run_page_post_load(*args)
        raise NotImplementedError, "Equivalent stub for 'run_page_post_load' from renderer/pages/universe_page/page_post_load.js"
      end
    end
  end
end
