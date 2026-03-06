# frozen_string_literal: true

require_relative "../../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "brain/wrappers/renderer_ui_shell_domain.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
  "formatSaved",
  "getAuthCredentials",
  "isAuthGateVisible",
  "isElementVisibleForInteraction",
  "normalizeExplorerLayoutMode",
  "resolvePreferredEntryLabel",
  "setAuthGateVisible",
  "setAuthHint",
  "setAuthMode",
  "setExplorerLayoutMode",
  "setHelperText",
  "setStatus",
  "setTreeFolderSelection",
  "syncExplorerLayoutControls"
]
      SYMBOL_MAP = {
  "formatSaved": "format_saved",
  "getAuthCredentials": "get_auth_credentials",
  "isAuthGateVisible": "is_auth_gate_visible",
  "isElementVisibleForInteraction": "is_element_visible_for_interaction",
  "normalizeExplorerLayoutMode": "normalize_explorer_layout_mode",
  "resolvePreferredEntryLabel": "resolve_preferred_entry_label",
  "setAuthGateVisible": "set_auth_gate_visible",
  "setAuthHint": "set_auth_hint",
  "setAuthMode": "set_auth_mode",
  "setExplorerLayoutMode": "set_explorer_layout_mode",
  "setHelperText": "set_helper_text",
  "setStatus": "set_status",
  "setTreeFolderSelection": "set_tree_folder_selection",
  "syncExplorerLayoutControls": "sync_explorer_layout_controls"
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

      def self.format_saved(*args, **kwargs)
        invoke_source_function("formatSaved", *args, **kwargs)
      end

      def self.get_auth_credentials(*args, **kwargs)
        invoke_source_function("getAuthCredentials", *args, **kwargs)
      end

      def self.is_auth_gate_visible(*args, **kwargs)
        invoke_source_function("isAuthGateVisible", *args, **kwargs)
      end

      def self.is_element_visible_for_interaction(*args, **kwargs)
        invoke_source_function("isElementVisibleForInteraction", *args, **kwargs)
      end

      def self.normalize_explorer_layout_mode(*args, **kwargs)
        invoke_source_function("normalizeExplorerLayoutMode", *args, **kwargs)
      end

      def self.resolve_preferred_entry_label(*args, **kwargs)
        invoke_source_function("resolvePreferredEntryLabel", *args, **kwargs)
      end

      def self.set_auth_gate_visible(*args, **kwargs)
        invoke_source_function("setAuthGateVisible", *args, **kwargs)
      end

      def self.set_auth_hint(*args, **kwargs)
        invoke_source_function("setAuthHint", *args, **kwargs)
      end

      def self.set_auth_mode(*args, **kwargs)
        invoke_source_function("setAuthMode", *args, **kwargs)
      end

      def self.set_explorer_layout_mode(*args, **kwargs)
        invoke_source_function("setExplorerLayoutMode", *args, **kwargs)
      end

      def self.set_helper_text(*args, **kwargs)
        invoke_source_function("setHelperText", *args, **kwargs)
      end

      def self.set_status(*args, **kwargs)
        invoke_source_function("setStatus", *args, **kwargs)
      end

      def self.set_tree_folder_selection(*args, **kwargs)
        invoke_source_function("setTreeFolderSelection", *args, **kwargs)
      end

      def self.sync_explorer_layout_controls(*args, **kwargs)
        invoke_source_function("syncExplorerLayoutControls", *args, **kwargs)
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
