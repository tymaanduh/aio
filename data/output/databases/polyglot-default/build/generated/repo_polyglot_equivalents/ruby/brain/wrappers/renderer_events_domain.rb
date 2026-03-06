# frozen_string_literal: true

require_relative "../../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "brain/wrappers/renderer_events_domain.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
  "applyTreeEntrySelection",
  "bindEvents",
  "handleContextAction",
  "handleSuggestionAction",
  "handleTreeAction",
  "submitBulkImport"
]
      SYMBOL_MAP = {
  "applyTreeEntrySelection": "apply_tree_entry_selection",
  "bindEvents": "bind_events",
  "handleContextAction": "handle_context_action",
  "handleSuggestionAction": "handle_suggestion_action",
  "handleTreeAction": "handle_tree_action",
  "submitBulkImport": "submit_bulk_import"
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

      def self.apply_tree_entry_selection(*args, **kwargs)
        invoke_source_function("applyTreeEntrySelection", *args, **kwargs)
      end

      def self.bind_events(*args, **kwargs)
        invoke_source_function("bindEvents", *args, **kwargs)
      end

      def self.handle_context_action(*args, **kwargs)
        invoke_source_function("handleContextAction", *args, **kwargs)
      end

      def self.handle_suggestion_action(*args, **kwargs)
        invoke_source_function("handleSuggestionAction", *args, **kwargs)
      end

      def self.handle_tree_action(*args, **kwargs)
        invoke_source_function("handleTreeAction", *args, **kwargs)
      end

      def self.submit_bulk_import(*args, **kwargs)
        invoke_source_function("submitBulkImport", *args, **kwargs)
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
