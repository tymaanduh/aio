# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "main/data/data_pre_load.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "ensure_data_pre_load_files",
  "run_data_pre_load_logic"
]
      SYMBOL_MAP = {
  "ensure_data_pre_load_files": "ensure_data_pre_load_files",
  "run_data_pre_load_logic": "run_data_pre_load_logic"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.ensure_data_pre_load_files(*args)
        raise NotImplementedError, "Equivalent stub for 'ensure_data_pre_load_files' from main/data/data_pre_load.js"
      end

      def self.run_data_pre_load_logic(*args)
        raise NotImplementedError, "Equivalent stub for 'run_data_pre_load_logic' from main/data/data_pre_load.js"
      end
    end
  end
end
