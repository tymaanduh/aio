# frozen_string_literal: true

require_relative "../../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "brain/wrappers/renderer_selection_domain.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
  "clearEntrySelections",
  "focusEntryWithoutUsage",
  "getEntryById",
  "getGraphEntryIdSet",
  "getSelectedEntries",
  "getVisibleTreeEntries",
  "selectEntryRange",
  "setSingleEntrySelection",
  "syncSelectionWithEntry",
  "toggleEntrySelection"
]
      SYMBOL_MAP = {
  "clearEntrySelections": "clear_entry_selections",
  "focusEntryWithoutUsage": "focus_entry_without_usage",
  "getEntryById": "get_entry_by_id",
  "getGraphEntryIdSet": "get_graph_entry_id_set",
  "getSelectedEntries": "get_selected_entries",
  "getVisibleTreeEntries": "get_visible_tree_entries",
  "selectEntryRange": "select_entry_range",
  "setSingleEntrySelection": "set_single_entry_selection",
  "syncSelectionWithEntry": "sync_selection_with_entry",
  "toggleEntrySelection": "toggle_entry_selection"
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

      def self.clear_entry_selections(*args, **kwargs)
        invoke_source_function("clearEntrySelections", *args, **kwargs)
      end

      def self.focus_entry_without_usage(*args, **kwargs)
        invoke_source_function("focusEntryWithoutUsage", *args, **kwargs)
      end

      def self.get_entry_by_id(*args, **kwargs)
        invoke_source_function("getEntryById", *args, **kwargs)
      end

      def self.get_graph_entry_id_set(*args, **kwargs)
        invoke_source_function("getGraphEntryIdSet", *args, **kwargs)
      end

      def self.get_selected_entries(*args, **kwargs)
        invoke_source_function("getSelectedEntries", *args, **kwargs)
      end

      def self.get_visible_tree_entries(*args, **kwargs)
        invoke_source_function("getVisibleTreeEntries", *args, **kwargs)
      end

      def self.select_entry_range(*args, **kwargs)
        invoke_source_function("selectEntryRange", *args, **kwargs)
      end

      def self.set_single_entry_selection(*args, **kwargs)
        invoke_source_function("setSingleEntrySelection", *args, **kwargs)
      end

      def self.sync_selection_with_entry(*args, **kwargs)
        invoke_source_function("syncSelectionWithEntry", *args, **kwargs)
      end

      def self.toggle_entry_selection(*args, **kwargs)
        invoke_source_function("toggleEntrySelection", *args, **kwargs)
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
