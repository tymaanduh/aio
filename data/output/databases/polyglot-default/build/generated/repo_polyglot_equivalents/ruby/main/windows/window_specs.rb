# frozen_string_literal: true

require_relative "../../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "main/windows/window_specs.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
  "clone_plain_object",
  "deep_freeze",
  "get_window_definition",
  "get_window_runtime_rules",
  "get_window_spec",
  "is_plain_object",
  "normalize_runtime_rules",
  "normalize_window_definition",
  "pick_window_runtime_rules",
  "pick_window_spec",
  "read_text"
]
      SYMBOL_MAP = {
  "clone_plain_object": "clone_plain_object",
  "deep_freeze": "deep_freeze",
  "get_window_definition": "get_window_definition",
  "get_window_runtime_rules": "get_window_runtime_rules",
  "get_window_spec": "get_window_spec",
  "is_plain_object": "is_plain_object",
  "normalize_runtime_rules": "normalize_runtime_rules",
  "normalize_window_definition": "normalize_window_definition",
  "pick_window_runtime_rules": "pick_window_runtime_rules",
  "pick_window_spec": "pick_window_spec",
  "read_text": "read_text"
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

      def self.clone_plain_object(*args, **kwargs)
        invoke_source_function("clone_plain_object", *args, **kwargs)
      end

      def self.deep_freeze(*args, **kwargs)
        invoke_source_function("deep_freeze", *args, **kwargs)
      end

      def self.get_window_definition(*args, **kwargs)
        invoke_source_function("get_window_definition", *args, **kwargs)
      end

      def self.get_window_runtime_rules(*args, **kwargs)
        invoke_source_function("get_window_runtime_rules", *args, **kwargs)
      end

      def self.get_window_spec(*args, **kwargs)
        invoke_source_function("get_window_spec", *args, **kwargs)
      end

      def self.is_plain_object(*args, **kwargs)
        invoke_source_function("is_plain_object", *args, **kwargs)
      end

      def self.normalize_runtime_rules(*args, **kwargs)
        invoke_source_function("normalize_runtime_rules", *args, **kwargs)
      end

      def self.normalize_window_definition(*args, **kwargs)
        invoke_source_function("normalize_window_definition", *args, **kwargs)
      end

      def self.pick_window_runtime_rules(*args, **kwargs)
        invoke_source_function("pick_window_runtime_rules", *args, **kwargs)
      end

      def self.pick_window_spec(*args, **kwargs)
        invoke_source_function("pick_window_spec", *args, **kwargs)
      end

      def self.read_text(*args, **kwargs)
        invoke_source_function("read_text", *args, **kwargs)
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
