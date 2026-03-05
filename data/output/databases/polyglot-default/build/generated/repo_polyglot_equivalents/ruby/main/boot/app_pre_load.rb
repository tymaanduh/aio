# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "main/boot/app_pre_load.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "run_app_gpu_pre_load",
  "run_app_pre_load_logic"
]
      SYMBOL_MAP = {
  "run_app_gpu_pre_load": "run_app_gpu_pre_load",
  "run_app_pre_load_logic": "run_app_pre_load_logic"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.run_app_gpu_pre_load(*args)
        raise NotImplementedError, "Equivalent stub for 'run_app_gpu_pre_load' from main/boot/app_pre_load.js"
      end

      def self.run_app_pre_load_logic(*args)
        raise NotImplementedError, "Equivalent stub for 'run_app_pre_load_logic' from main/boot/app_pre_load.js"
      end
    end
  end
end
