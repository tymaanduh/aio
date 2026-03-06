# frozen_string_literal: true

require_relative "../../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "renderer/core/load_hook_registry.js"
      EQUIVALENT_KIND = "repo_module_proxy"
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

      def self.invoke_source_function(function_name, *args, **kwargs)
        Aio::RepoPolyglotEquivalents::Shared::RepoModuleProxy.invoke_js_function(
          SOURCE_JS_FILE,
          function_name,
          args,
          kwargs
        )
      end

      def self.run_source_entrypoint(args = [])
        Aio::RepoPolyglotEquivalents::Shared::RepoModuleProxy.run_js_entrypoint(SOURCE_JS_FILE, args)
      end

      def self.apply_record_filter(*args, **kwargs)
        invoke_source_function("apply_record_filter", *args, **kwargs)
      end

      def self.build_load_hook_argument_payload(*args, **kwargs)
        invoke_source_function("build_load_hook_argument_payload", *args, **kwargs)
      end

      def self.chain_match(*args, **kwargs)
        invoke_source_function("chain_match", *args, **kwargs)
      end

      def self.clean_text(*args, **kwargs)
        invoke_source_function("clean_text", *args, **kwargs)
      end

      def self.compare_chain_records(*args, **kwargs)
        invoke_source_function("compare_chain_records", *args, **kwargs)
      end

      def self.compare_records(*args, **kwargs)
        invoke_source_function("compare_records", *args, **kwargs)
      end

      def self.create_load_hook_api(*args, **kwargs)
        invoke_source_function("create_load_hook_api", *args, **kwargs)
      end

      def self.ensure_load_hook_registry(*args, **kwargs)
        invoke_source_function("ensure_load_hook_registry", *args, **kwargs)
      end

      def self.ensure_tree_page(*args, **kwargs)
        invoke_source_function("ensure_tree_page", *args, **kwargs)
      end

      def self.ensure_tree_window(*args, **kwargs)
        invoke_source_function("ensure_tree_window", *args, **kwargs)
      end

      def self.get_load_hook_arguments(*args, **kwargs)
        invoke_source_function("get_load_hook_arguments", *args, **kwargs)
      end

      def self.get_load_hook_arguments_by_tag(*args, **kwargs)
        invoke_source_function("get_load_hook_arguments_by_tag", *args, **kwargs)
      end

      def self.get_load_hook_chain(*args, **kwargs)
        invoke_source_function("get_load_hook_chain", *args, **kwargs)
      end

      def self.get_search_blob(*args, **kwargs)
        invoke_source_function("get_search_blob", *args, **kwargs)
      end

      def self.get_window_page_control_tree(*args, **kwargs)
        invoke_source_function("get_window_page_control_tree", *args, **kwargs)
      end

      def self.list_load_hook_records(*args, **kwargs)
        invoke_source_function("list_load_hook_records", *args, **kwargs)
      end

      def self.normalize_argument_spec(*args, **kwargs)
        invoke_source_function("normalize_argument_spec", *args, **kwargs)
      end

      def self.normalize_argument_specs(*args, **kwargs)
        invoke_source_function("normalize_argument_specs", *args, **kwargs)
      end

      def self.normalize_hook_record(*args, **kwargs)
        invoke_source_function("normalize_hook_record", *args, **kwargs)
      end

      def self.normalize_registry(*args, **kwargs)
        invoke_source_function("normalize_registry", *args, **kwargs)
      end

      def self.normalize_scope(*args, **kwargs)
        invoke_source_function("normalize_scope", *args, **kwargs)
      end

      def self.normalize_stage(*args, **kwargs)
        invoke_source_function("normalize_stage", *args, **kwargs)
      end

      def self.normalize_string_array(*args, **kwargs)
        invoke_source_function("normalize_string_array", *args, **kwargs)
      end

      def self.publish_load_hook_api(*args, **kwargs)
        invoke_source_function("publish_load_hook_api", *args, **kwargs)
      end

      def self.read_ctx(*args, **kwargs)
        invoke_source_function("read_ctx", *args, **kwargs)
      end

      def self.register_load_hook(*args, **kwargs)
        invoke_source_function("register_load_hook", *args, **kwargs)
      end

      def self.register_post_load_hook(*args, **kwargs)
        invoke_source_function("register_post_load_hook", *args, **kwargs)
      end

      def self.register_pre_load_hook(*args, **kwargs)
        invoke_source_function("register_pre_load_hook", *args, **kwargs)
      end

      def self.search_load_hooks(*args, **kwargs)
        invoke_source_function("search_load_hooks", *args, **kwargs)
      end

      def self.string_match(*args, **kwargs)
        invoke_source_function("string_match", *args, **kwargs)
      end

      def self.unique_by(*args, **kwargs)
        invoke_source_function("unique_by", *args, **kwargs)
      end
    end
  end
end

if __FILE__ == $PROGRAM_NAME
  args = ARGV.dup
  function_flag_index = args.index("--function")
  if function_flag_index
    function_name = args[function_flag_index + 1] || ""
    args_json_index = args.index("--args-json")
    args_json = args_json_index ? (args[args_json_index + 1] || "[]") : "[]"
    result = Aio::RepoPolyglotEquivalents::ModuleProxy.invoke_source_function(
      function_name,
      *Array(JSON.parse(args_json))
    )
    puts(JSON.generate({ ok: true, result: result }))
    exit(0)
  end

  report = Aio::RepoPolyglotEquivalents::ModuleProxy.run_source_entrypoint(ARGV)
  exit(Integer(report.fetch("exit_code", 0)))
end
