# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "data/input/shared/renderer/group_paths.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "cleanText",
  "pathJoin"
]
      SYMBOL_MAP = {
  "cleanText": "clean_text",
  "pathJoin": "path_join"
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
        raise NotImplementedError, "Equivalent stub for 'cleanText' from data/input/shared/renderer/group_paths.js"
      end

      def self.path_join(*args)
        raise NotImplementedError, "Equivalent stub for 'pathJoin' from data/input/shared/renderer/group_paths.js"
      end
    end
  end
end
