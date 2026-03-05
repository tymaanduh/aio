# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "renderer/core/load_hook_registry.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "apply_record_filter",
  "build_load_hook_argument_payload",
  "chain_match",
  "clean_text",
  "compare_chain_records",
  "compare_records",
  "create_load_hook_api",
  "ensure_load_hook_registry",
  "ensure_tree_page",
  "ensure_tree_window",
  "get_load_hook_arguments",
  "get_load_hook_arguments_by_tag",
  "get_load_hook_chain",
  "get_search_blob",
  "get_window_page_control_tree",
  "list_load_hook_records",
  "normalize_argument_spec",
  "normalize_argument_specs",
  "normalize_hook_record",
  "normalize_registry",
  "normalize_scope",
  "normalize_stage",
  "normalize_string_array",
  "publish_load_hook_api",
  "read_ctx",
  "register_load_hook",
  "register_post_load_hook",
  "register_pre_load_hook",
  "search_load_hooks",
  "string_match",
  "unique_by"
]
      SYMBOL_MAP = {
  "apply_record_filter": "apply_record_filter",
  "build_load_hook_argument_payload": "build_load_hook_argument_payload",
  "chain_match": "chain_match",
  "clean_text": "clean_text",
  "compare_chain_records": "compare_chain_records",
  "compare_records": "compare_records",
  "create_load_hook_api": "create_load_hook_api",
  "ensure_load_hook_registry": "ensure_load_hook_registry",
  "ensure_tree_page": "ensure_tree_page",
  "ensure_tree_window": "ensure_tree_window",
  "get_load_hook_arguments": "get_load_hook_arguments",
  "get_load_hook_arguments_by_tag": "get_load_hook_arguments_by_tag",
  "get_load_hook_chain": "get_load_hook_chain",
  "get_search_blob": "get_search_blob",
  "get_window_page_control_tree": "get_window_page_control_tree",
  "list_load_hook_records": "list_load_hook_records",
  "normalize_argument_spec": "normalize_argument_spec",
  "normalize_argument_specs": "normalize_argument_specs",
  "normalize_hook_record": "normalize_hook_record",
  "normalize_registry": "normalize_registry",
  "normalize_scope": "normalize_scope",
  "normalize_stage": "normalize_stage",
  "normalize_string_array": "normalize_string_array",
  "publish_load_hook_api": "publish_load_hook_api",
  "read_ctx": "read_ctx",
  "register_load_hook": "register_load_hook",
  "register_post_load_hook": "register_post_load_hook",
  "register_pre_load_hook": "register_pre_load_hook",
  "search_load_hooks": "search_load_hooks",
  "string_match": "string_match",
  "unique_by": "unique_by"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.apply_record_filter(*args)
        raise NotImplementedError, "Equivalent stub for 'apply_record_filter' from renderer/core/load_hook_registry.js"
      end

      def self.build_load_hook_argument_payload(*args)
        raise NotImplementedError, "Equivalent stub for 'build_load_hook_argument_payload' from renderer/core/load_hook_registry.js"
      end

      def self.chain_match(*args)
        raise NotImplementedError, "Equivalent stub for 'chain_match' from renderer/core/load_hook_registry.js"
      end

      def self.clean_text(*args)
        raise NotImplementedError, "Equivalent stub for 'clean_text' from renderer/core/load_hook_registry.js"
      end

      def self.compare_chain_records(*args)
        raise NotImplementedError, "Equivalent stub for 'compare_chain_records' from renderer/core/load_hook_registry.js"
      end

      def self.compare_records(*args)
        raise NotImplementedError, "Equivalent stub for 'compare_records' from renderer/core/load_hook_registry.js"
      end

      def self.create_load_hook_api(*args)
        raise NotImplementedError, "Equivalent stub for 'create_load_hook_api' from renderer/core/load_hook_registry.js"
      end

      def self.ensure_load_hook_registry(*args)
        raise NotImplementedError, "Equivalent stub for 'ensure_load_hook_registry' from renderer/core/load_hook_registry.js"
      end

      def self.ensure_tree_page(*args)
        raise NotImplementedError, "Equivalent stub for 'ensure_tree_page' from renderer/core/load_hook_registry.js"
      end

      def self.ensure_tree_window(*args)
        raise NotImplementedError, "Equivalent stub for 'ensure_tree_window' from renderer/core/load_hook_registry.js"
      end

      def self.get_load_hook_arguments(*args)
        raise NotImplementedError, "Equivalent stub for 'get_load_hook_arguments' from renderer/core/load_hook_registry.js"
      end

      def self.get_load_hook_arguments_by_tag(*args)
        raise NotImplementedError, "Equivalent stub for 'get_load_hook_arguments_by_tag' from renderer/core/load_hook_registry.js"
      end

      def self.get_load_hook_chain(*args)
        raise NotImplementedError, "Equivalent stub for 'get_load_hook_chain' from renderer/core/load_hook_registry.js"
      end

      def self.get_search_blob(*args)
        raise NotImplementedError, "Equivalent stub for 'get_search_blob' from renderer/core/load_hook_registry.js"
      end

      def self.get_window_page_control_tree(*args)
        raise NotImplementedError, "Equivalent stub for 'get_window_page_control_tree' from renderer/core/load_hook_registry.js"
      end

      def self.list_load_hook_records(*args)
        raise NotImplementedError, "Equivalent stub for 'list_load_hook_records' from renderer/core/load_hook_registry.js"
      end

      def self.normalize_argument_spec(*args)
        raise NotImplementedError, "Equivalent stub for 'normalize_argument_spec' from renderer/core/load_hook_registry.js"
      end

      def self.normalize_argument_specs(*args)
        raise NotImplementedError, "Equivalent stub for 'normalize_argument_specs' from renderer/core/load_hook_registry.js"
      end

      def self.normalize_hook_record(*args)
        raise NotImplementedError, "Equivalent stub for 'normalize_hook_record' from renderer/core/load_hook_registry.js"
      end

      def self.normalize_registry(*args)
        raise NotImplementedError, "Equivalent stub for 'normalize_registry' from renderer/core/load_hook_registry.js"
      end

      def self.normalize_scope(*args)
        raise NotImplementedError, "Equivalent stub for 'normalize_scope' from renderer/core/load_hook_registry.js"
      end

      def self.normalize_stage(*args)
        raise NotImplementedError, "Equivalent stub for 'normalize_stage' from renderer/core/load_hook_registry.js"
      end

      def self.normalize_string_array(*args)
        raise NotImplementedError, "Equivalent stub for 'normalize_string_array' from renderer/core/load_hook_registry.js"
      end

      def self.publish_load_hook_api(*args)
        raise NotImplementedError, "Equivalent stub for 'publish_load_hook_api' from renderer/core/load_hook_registry.js"
      end

      def self.read_ctx(*args)
        raise NotImplementedError, "Equivalent stub for 'read_ctx' from renderer/core/load_hook_registry.js"
      end

      def self.register_load_hook(*args)
        raise NotImplementedError, "Equivalent stub for 'register_load_hook' from renderer/core/load_hook_registry.js"
      end

      def self.register_post_load_hook(*args)
        raise NotImplementedError, "Equivalent stub for 'register_post_load_hook' from renderer/core/load_hook_registry.js"
      end

      def self.register_pre_load_hook(*args)
        raise NotImplementedError, "Equivalent stub for 'register_pre_load_hook' from renderer/core/load_hook_registry.js"
      end

      def self.search_load_hooks(*args)
        raise NotImplementedError, "Equivalent stub for 'search_load_hooks' from renderer/core/load_hook_registry.js"
      end

      def self.string_match(*args)
        raise NotImplementedError, "Equivalent stub for 'string_match' from renderer/core/load_hook_registry.js"
      end

      def self.unique_by(*args)
        raise NotImplementedError, "Equivalent stub for 'unique_by' from renderer/core/load_hook_registry.js"
      end
    end
  end
end
