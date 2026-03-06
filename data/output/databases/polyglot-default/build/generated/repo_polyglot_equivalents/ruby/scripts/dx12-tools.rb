# frozen_string_literal: true

require_relative "../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "scripts/dx12-tools.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
  "detectVisualStudioInstallPath",
  "existsExecutable",
  "firstExisting",
  "getMakePath",
  "getMingwCompilers",
  "getNativeLinuxCmakePath",
  "getWindowsPowershellPath",
  "isWsl",
  "runCommand"
]
      SYMBOL_MAP = {
  "detectVisualStudioInstallPath": "detect_visual_studio_install_path",
  "existsExecutable": "exists_executable",
  "firstExisting": "first_existing",
  "getMakePath": "get_make_path",
  "getMingwCompilers": "get_mingw_compilers",
  "getNativeLinuxCmakePath": "get_native_linux_cmake_path",
  "getWindowsPowershellPath": "get_windows_powershell_path",
  "isWsl": "is_wsl",
  "runCommand": "run_command"
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

      def self.detect_visual_studio_install_path(*args, **kwargs)
        invoke_source_function("detectVisualStudioInstallPath", *args, **kwargs)
      end

      def self.exists_executable(*args, **kwargs)
        invoke_source_function("existsExecutable", *args, **kwargs)
      end

      def self.first_existing(*args, **kwargs)
        invoke_source_function("firstExisting", *args, **kwargs)
      end

      def self.get_make_path(*args, **kwargs)
        invoke_source_function("getMakePath", *args, **kwargs)
      end

      def self.get_mingw_compilers(*args, **kwargs)
        invoke_source_function("getMingwCompilers", *args, **kwargs)
      end

      def self.get_native_linux_cmake_path(*args, **kwargs)
        invoke_source_function("getNativeLinuxCmakePath", *args, **kwargs)
      end

      def self.get_windows_powershell_path(*args, **kwargs)
        invoke_source_function("getWindowsPowershellPath", *args, **kwargs)
      end

      def self.is_wsl(*args, **kwargs)
        invoke_source_function("isWsl", *args, **kwargs)
      end

      def self.run_command(*args, **kwargs)
        invoke_source_function("runCommand", *args, **kwargs)
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
