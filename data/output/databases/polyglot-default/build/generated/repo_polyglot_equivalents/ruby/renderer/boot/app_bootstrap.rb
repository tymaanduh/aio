# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "renderer/boot/app_bootstrap.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "append_hook_trace",
  "publish_renderer_ctx",
  "run_post_load_bindings",
  "run_pre_load_bindings",
  "run_renderer_app_bootstrap",
  "sync_renderer_hook_ctx",
  "to_shell_scope"
]
      SYMBOL_MAP = {
  "append_hook_trace": "append_hook_trace",
  "publish_renderer_ctx": "publish_renderer_ctx",
  "run_post_load_bindings": "run_post_load_bindings",
  "run_pre_load_bindings": "run_pre_load_bindings",
  "run_renderer_app_bootstrap": "run_renderer_app_bootstrap",
  "sync_renderer_hook_ctx": "sync_renderer_hook_ctx",
  "to_shell_scope": "to_shell_scope"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.append_hook_trace(*args)
        raise NotImplementedError, "Equivalent stub for 'append_hook_trace' from renderer/boot/app_bootstrap.js"
      end

      def self.publish_renderer_ctx(*args)
        raise NotImplementedError, "Equivalent stub for 'publish_renderer_ctx' from renderer/boot/app_bootstrap.js"
      end

      def self.run_post_load_bindings(*args)
        raise NotImplementedError, "Equivalent stub for 'run_post_load_bindings' from renderer/boot/app_bootstrap.js"
      end

      def self.run_pre_load_bindings(*args)
        raise NotImplementedError, "Equivalent stub for 'run_pre_load_bindings' from renderer/boot/app_bootstrap.js"
      end

      def self.run_renderer_app_bootstrap(*args)
        raise NotImplementedError, "Equivalent stub for 'run_renderer_app_bootstrap' from renderer/boot/app_bootstrap.js"
      end

      def self.sync_renderer_hook_ctx(*args)
        raise NotImplementedError, "Equivalent stub for 'sync_renderer_hook_ctx' from renderer/boot/app_bootstrap.js"
      end

      def self.to_shell_scope(*args)
        raise NotImplementedError, "Equivalent stub for 'to_shell_scope' from renderer/boot/app_bootstrap.js"
      end
    end
  end
end
