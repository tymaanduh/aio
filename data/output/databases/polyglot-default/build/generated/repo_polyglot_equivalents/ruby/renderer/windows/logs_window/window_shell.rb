# frozen_string_literal: true

require_relative "../../../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "renderer/windows/logs_window/window_shell.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
  "DESC",
  "HOOK_KEY",
  "PATH",
  "PATH_LIST",
  "run_logs_window_shell",
  "TAG_LIST",
  "TXT_LIST"
]
      SYMBOL_MAP = {
  "DESC": "desc",
  "HOOK_KEY": "hook_key",
  "PATH": "path",
  "PATH_LIST": "path_list",
  "run_logs_window_shell": "run_logs_window_shell",
  "TAG_LIST": "tag_list",
  "TXT_LIST": "txt_list"
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

      def self.desc(*args, **kwargs)
        invoke_source_function("DESC", *args, **kwargs)
      end

      def self.hook_key(*args, **kwargs)
        invoke_source_function("HOOK_KEY", *args, **kwargs)
      end

      def self.path(*args, **kwargs)
        invoke_source_function("PATH", *args, **kwargs)
      end

      def self.path_list(*args, **kwargs)
        invoke_source_function("PATH_LIST", *args, **kwargs)
      end

      def self.run_logs_window_shell(*args, **kwargs)
        invoke_source_function("run_logs_window_shell", *args, **kwargs)
      end

      def self.tag_list(*args, **kwargs)
        invoke_source_function("TAG_LIST", *args, **kwargs)
      end

      def self.txt_list(*args, **kwargs)
        invoke_source_function("TXT_LIST", *args, **kwargs)
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
