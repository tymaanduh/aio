# frozen_string_literal: true

require_relative "../../_shared/repo_module_proxy"
require "json"

module Aio
  module RepoPolyglotEquivalents
    module ModuleProxy
      SOURCE_JS_FILE = "brain/modules/store.js"
      EQUIVALENT_KIND = "repo_module_proxy"
      FUNCTION_TOKENS = [
  "addEntry",
  "addGraphLink",
  "addGraphNode",
  "addLabel",
  "callHook",
  "createStateStore",
  "mutateEntries",
  "mutateGraph",
  "mutateLabels",
  "notifyMutated",
  "removeEntryById",
  "removeLabel",
  "setEntries",
  "setGraph",
  "setHooks",
  "setLabels",
  "updateEntryById",
  "updateState"
]
      SYMBOL_MAP = {
  "addEntry": "add_entry",
  "addGraphLink": "add_graph_link",
  "addGraphNode": "add_graph_node",
  "addLabel": "add_label",
  "callHook": "call_hook",
  "createStateStore": "create_state_store",
  "mutateEntries": "mutate_entries",
  "mutateGraph": "mutate_graph",
  "mutateLabels": "mutate_labels",
  "notifyMutated": "notify_mutated",
  "removeEntryById": "remove_entry_by_id",
  "removeLabel": "remove_label",
  "setEntries": "set_entries",
  "setGraph": "set_graph",
  "setHooks": "set_hooks",
  "setLabels": "set_labels",
  "updateEntryById": "update_entry_by_id",
  "updateState": "update_state"
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

      def self.add_entry(*args, **kwargs)
        invoke_source_function("addEntry", *args, **kwargs)
      end

      def self.add_graph_link(*args, **kwargs)
        invoke_source_function("addGraphLink", *args, **kwargs)
      end

      def self.add_graph_node(*args, **kwargs)
        invoke_source_function("addGraphNode", *args, **kwargs)
      end

      def self.add_label(*args, **kwargs)
        invoke_source_function("addLabel", *args, **kwargs)
      end

      def self.call_hook(*args, **kwargs)
        invoke_source_function("callHook", *args, **kwargs)
      end

      def self.create_state_store(*args, **kwargs)
        invoke_source_function("createStateStore", *args, **kwargs)
      end

      def self.mutate_entries(*args, **kwargs)
        invoke_source_function("mutateEntries", *args, **kwargs)
      end

      def self.mutate_graph(*args, **kwargs)
        invoke_source_function("mutateGraph", *args, **kwargs)
      end

      def self.mutate_labels(*args, **kwargs)
        invoke_source_function("mutateLabels", *args, **kwargs)
      end

      def self.notify_mutated(*args, **kwargs)
        invoke_source_function("notifyMutated", *args, **kwargs)
      end

      def self.remove_entry_by_id(*args, **kwargs)
        invoke_source_function("removeEntryById", *args, **kwargs)
      end

      def self.remove_label(*args, **kwargs)
        invoke_source_function("removeLabel", *args, **kwargs)
      end

      def self.set_entries(*args, **kwargs)
        invoke_source_function("setEntries", *args, **kwargs)
      end

      def self.set_graph(*args, **kwargs)
        invoke_source_function("setGraph", *args, **kwargs)
      end

      def self.set_hooks(*args, **kwargs)
        invoke_source_function("setHooks", *args, **kwargs)
      end

      def self.set_labels(*args, **kwargs)
        invoke_source_function("setLabels", *args, **kwargs)
      end

      def self.update_entry_by_id(*args, **kwargs)
        invoke_source_function("updateEntryById", *args, **kwargs)
      end

      def self.update_state(*args, **kwargs)
        invoke_source_function("updateState", *args, **kwargs)
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
