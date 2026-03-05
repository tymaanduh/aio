# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "preload.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "apply_flat_alias_methods",
  "build_namespace_api",
  "create_forward_method",
  "create_invoke_method",
  "create_runtime_log_listener",
  "is_plain_object",
  "listener",
  "resolve_arg_normalizers",
  "resolve_channel_by_key",
  "resolve_method_by_path",
  "resolve_namespace_channels"
]
      SYMBOL_MAP = {
  "apply_flat_alias_methods": "apply_flat_alias_methods",
  "build_namespace_api": "build_namespace_api",
  "create_forward_method": "create_forward_method",
  "create_invoke_method": "create_invoke_method",
  "create_runtime_log_listener": "create_runtime_log_listener",
  "is_plain_object": "is_plain_object",
  "listener": "listener",
  "resolve_arg_normalizers": "resolve_arg_normalizers",
  "resolve_channel_by_key": "resolve_channel_by_key",
  "resolve_method_by_path": "resolve_method_by_path",
  "resolve_namespace_channels": "resolve_namespace_channels"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.apply_flat_alias_methods(*args)
        raise NotImplementedError, "Equivalent stub for 'apply_flat_alias_methods' from preload.js"
      end

      def self.build_namespace_api(*args)
        raise NotImplementedError, "Equivalent stub for 'build_namespace_api' from preload.js"
      end

      def self.create_forward_method(*args)
        raise NotImplementedError, "Equivalent stub for 'create_forward_method' from preload.js"
      end

      def self.create_invoke_method(*args)
        raise NotImplementedError, "Equivalent stub for 'create_invoke_method' from preload.js"
      end

      def self.create_runtime_log_listener(*args)
        raise NotImplementedError, "Equivalent stub for 'create_runtime_log_listener' from preload.js"
      end

      def self.is_plain_object(*args)
        raise NotImplementedError, "Equivalent stub for 'is_plain_object' from preload.js"
      end

      def self.listener(*args)
        raise NotImplementedError, "Equivalent stub for 'listener' from preload.js"
      end

      def self.resolve_arg_normalizers(*args)
        raise NotImplementedError, "Equivalent stub for 'resolve_arg_normalizers' from preload.js"
      end

      def self.resolve_channel_by_key(*args)
        raise NotImplementedError, "Equivalent stub for 'resolve_channel_by_key' from preload.js"
      end

      def self.resolve_method_by_path(*args)
        raise NotImplementedError, "Equivalent stub for 'resolve_method_by_path' from preload.js"
      end

      def self.resolve_namespace_channels(*args)
        raise NotImplementedError, "Equivalent stub for 'resolve_namespace_channels' from preload.js"
      end
    end
  end
end
