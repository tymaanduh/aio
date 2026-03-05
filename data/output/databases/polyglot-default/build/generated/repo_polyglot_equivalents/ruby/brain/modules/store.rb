# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "brain/modules/store.js"
      EQUIVALENT_KIND = "repo_module_stub"
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

      def self.add_entry(*args)
        raise NotImplementedError, "Equivalent stub for 'addEntry' from brain/modules/store.js"
      end

      def self.add_graph_link(*args)
        raise NotImplementedError, "Equivalent stub for 'addGraphLink' from brain/modules/store.js"
      end

      def self.add_graph_node(*args)
        raise NotImplementedError, "Equivalent stub for 'addGraphNode' from brain/modules/store.js"
      end

      def self.add_label(*args)
        raise NotImplementedError, "Equivalent stub for 'addLabel' from brain/modules/store.js"
      end

      def self.call_hook(*args)
        raise NotImplementedError, "Equivalent stub for 'callHook' from brain/modules/store.js"
      end

      def self.create_state_store(*args)
        raise NotImplementedError, "Equivalent stub for 'createStateStore' from brain/modules/store.js"
      end

      def self.mutate_entries(*args)
        raise NotImplementedError, "Equivalent stub for 'mutateEntries' from brain/modules/store.js"
      end

      def self.mutate_graph(*args)
        raise NotImplementedError, "Equivalent stub for 'mutateGraph' from brain/modules/store.js"
      end

      def self.mutate_labels(*args)
        raise NotImplementedError, "Equivalent stub for 'mutateLabels' from brain/modules/store.js"
      end

      def self.notify_mutated(*args)
        raise NotImplementedError, "Equivalent stub for 'notifyMutated' from brain/modules/store.js"
      end

      def self.remove_entry_by_id(*args)
        raise NotImplementedError, "Equivalent stub for 'removeEntryById' from brain/modules/store.js"
      end

      def self.remove_label(*args)
        raise NotImplementedError, "Equivalent stub for 'removeLabel' from brain/modules/store.js"
      end

      def self.set_entries(*args)
        raise NotImplementedError, "Equivalent stub for 'setEntries' from brain/modules/store.js"
      end

      def self.set_graph(*args)
        raise NotImplementedError, "Equivalent stub for 'setGraph' from brain/modules/store.js"
      end

      def self.set_hooks(*args)
        raise NotImplementedError, "Equivalent stub for 'setHooks' from brain/modules/store.js"
      end

      def self.set_labels(*args)
        raise NotImplementedError, "Equivalent stub for 'setLabels' from brain/modules/store.js"
      end

      def self.update_entry_by_id(*args)
        raise NotImplementedError, "Equivalent stub for 'updateEntryById' from brain/modules/store.js"
      end

      def self.update_state(*args)
        raise NotImplementedError, "Equivalent stub for 'updateState' from brain/modules/store.js"
      end
    end
  end
end
