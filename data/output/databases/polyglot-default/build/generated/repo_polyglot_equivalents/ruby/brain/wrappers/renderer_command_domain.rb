# frozen_string_literal: true

require_relative "../../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "brain/wrappers/renderer_command_domain.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
  "buildCommandPaletteActions",
  "closeCmdPalette",
  "createCommandItem",
  "createCommandLabel",
  "createCommandRunner",
  "executeCommandPaletteItem",
  "filterCommandPalette",
  "isCommandPaletteVisible",
  "openCommandPalette",
  "renderCmdList"
]
      SYMBOL_MAP = {
  "buildCommandPaletteActions": "build_command_palette_actions",
  "closeCmdPalette": "close_cmd_palette",
  "createCommandItem": "create_command_item",
  "createCommandLabel": "create_command_label",
  "createCommandRunner": "create_command_runner",
  "executeCommandPaletteItem": "execute_command_palette_item",
  "filterCommandPalette": "filter_command_palette",
  "isCommandPaletteVisible": "is_command_palette_visible",
  "openCommandPalette": "open_command_palette",
  "renderCmdList": "render_cmd_list"
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

      def self.build_command_palette_actions(*args, **kwargs)
        invoke_source_function("buildCommandPaletteActions", *args, **kwargs)
      end

      def self.close_cmd_palette(*args, **kwargs)
        invoke_source_function("closeCmdPalette", *args, **kwargs)
      end

      def self.create_command_item(*args, **kwargs)
        invoke_source_function("createCommandItem", *args, **kwargs)
      end

      def self.create_command_label(*args, **kwargs)
        invoke_source_function("createCommandLabel", *args, **kwargs)
      end

      def self.create_command_runner(*args, **kwargs)
        invoke_source_function("createCommandRunner", *args, **kwargs)
      end

      def self.execute_command_palette_item(*args, **kwargs)
        invoke_source_function("executeCommandPaletteItem", *args, **kwargs)
      end

      def self.filter_command_palette(*args, **kwargs)
        invoke_source_function("filterCommandPalette", *args, **kwargs)
      end

      def self.is_command_palette_visible(*args, **kwargs)
        invoke_source_function("isCommandPaletteVisible", *args, **kwargs)
      end

      def self.open_command_palette(*args, **kwargs)
        invoke_source_function("openCommandPalette", *args, **kwargs)
      end

      def self.render_cmd_list(*args, **kwargs)
        invoke_source_function("renderCmdList", *args, **kwargs)
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
