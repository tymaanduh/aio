# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "main/ipc/ipc_route_ui.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "create_ipc_route_ui",
  "with_focused_window"
]
      SYMBOL_MAP = {
  "create_ipc_route_ui": "create_ipc_route_ui",
  "with_focused_window": "with_focused_window"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.create_ipc_route_ui(*args)
        raise NotImplementedError, "Equivalent stub for 'create_ipc_route_ui' from main/ipc/ipc_route_ui.js"
      end

      def self.with_focused_window(*args)
        raise NotImplementedError, "Equivalent stub for 'with_focused_window' from main/ipc/ipc_route_ui.js"
      end
    end
  end
end
