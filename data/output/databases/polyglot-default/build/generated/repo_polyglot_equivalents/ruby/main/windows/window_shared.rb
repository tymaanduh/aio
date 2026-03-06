# frozen_string_literal: true

require_relative "../../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "main/windows/window_shared.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
  "create_browser_window",
  "create_window_chrome_options",
  "create_window_from_spec",
  "is_windows_platform",
  "resolve_window_view_path"
]
      SYMBOL_MAP = {
  "create_browser_window": "create_browser_window",
  "create_window_chrome_options": "create_window_chrome_options",
  "create_window_from_spec": "create_window_from_spec",
  "is_windows_platform": "is_windows_platform",
  "resolve_window_view_path": "resolve_window_view_path"
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

      def self.create_browser_window(*args, **kwargs)
        invoke_source_function("create_browser_window", *args, **kwargs)
      end

      def self.create_window_chrome_options(*args, **kwargs)
        invoke_source_function("create_window_chrome_options", *args, **kwargs)
      end

      def self.create_window_from_spec(*args, **kwargs)
        invoke_source_function("create_window_from_spec", *args, **kwargs)
      end

      def self.is_windows_platform(*args, **kwargs)
        invoke_source_function("is_windows_platform", *args, **kwargs)
      end

      def self.resolve_window_view_path(*args, **kwargs)
        invoke_source_function("resolve_window_view_path", *args, **kwargs)
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
