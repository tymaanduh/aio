# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "main/ipc/ipc_route_auth.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "create_ipc_route_auth"
]
      SYMBOL_MAP = {
  "create_ipc_route_auth": "create_ipc_route_auth"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.create_ipc_route_auth(*args)
        raise NotImplementedError, "Equivalent stub for 'create_ipc_route_auth' from main/ipc/ipc_route_auth.js"
      end
    end
  end
end
