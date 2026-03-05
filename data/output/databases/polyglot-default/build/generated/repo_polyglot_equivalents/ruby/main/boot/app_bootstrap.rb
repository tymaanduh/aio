# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "main/boot/app_bootstrap.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "bootstrap_main_app",
  "create_ipc_dependencies",
  "inject_auth_repository_binding",
  "inject_language_bridge_repository_binding"
]
      SYMBOL_MAP = {
  "bootstrap_main_app": "bootstrap_main_app",
  "create_ipc_dependencies": "create_ipc_dependencies",
  "inject_auth_repository_binding": "inject_auth_repository_binding",
  "inject_language_bridge_repository_binding": "inject_language_bridge_repository_binding"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.bootstrap_main_app(*args)
        raise NotImplementedError, "Equivalent stub for 'bootstrap_main_app' from main/boot/app_bootstrap.js"
      end

      def self.create_ipc_dependencies(*args)
        raise NotImplementedError, "Equivalent stub for 'create_ipc_dependencies' from main/boot/app_bootstrap.js"
      end

      def self.inject_auth_repository_binding(*args)
        raise NotImplementedError, "Equivalent stub for 'inject_auth_repository_binding' from main/boot/app_bootstrap.js"
      end

      def self.inject_language_bridge_repository_binding(*args)
        raise NotImplementedError, "Equivalent stub for 'inject_language_bridge_repository_binding' from main/boot/app_bootstrap.js"
      end
    end
  end
end
