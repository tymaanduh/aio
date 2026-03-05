# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "main/ipc/ipc_route_data.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "create_ipc_route_data"
]
      SYMBOL_MAP = {
  "create_ipc_route_data": "create_ipc_route_data"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.create_ipc_route_data(*args)
        raise NotImplementedError, "Equivalent stub for 'create_ipc_route_data' from main/ipc/ipc_route_data.js"
      end
    end
  end
end
