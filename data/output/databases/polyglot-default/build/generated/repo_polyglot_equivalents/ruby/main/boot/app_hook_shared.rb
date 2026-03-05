# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "main/boot/app_hook_shared.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "create_app_hook_result",
  "create_app_hook_runner",
  "create_app_hook_spec",
  "run_hook"
]
      SYMBOL_MAP = {
  "create_app_hook_result": "create_app_hook_result",
  "create_app_hook_runner": "create_app_hook_runner",
  "create_app_hook_spec": "create_app_hook_spec",
  "run_hook": "run_hook"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.create_app_hook_result(*args)
        raise NotImplementedError, "Equivalent stub for 'create_app_hook_result' from main/boot/app_hook_shared.js"
      end

      def self.create_app_hook_runner(*args)
        raise NotImplementedError, "Equivalent stub for 'create_app_hook_runner' from main/boot/app_hook_shared.js"
      end

      def self.create_app_hook_spec(*args)
        raise NotImplementedError, "Equivalent stub for 'create_app_hook_spec' from main/boot/app_hook_shared.js"
      end

      def self.run_hook(*args)
        raise NotImplementedError, "Equivalent stub for 'run_hook' from main/boot/app_hook_shared.js"
      end
    end
  end
end
