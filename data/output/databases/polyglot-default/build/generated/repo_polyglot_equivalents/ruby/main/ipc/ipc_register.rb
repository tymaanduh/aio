# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "main/ipc/ipc_register.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "register_ipc_routes",
  "resolve_ipc_route_specs"
]
      SYMBOL_MAP = {
  "register_ipc_routes": "register_ipc_routes",
  "resolve_ipc_route_specs": "resolve_ipc_route_specs"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.register_ipc_routes(*args)
        raise NotImplementedError, "Equivalent stub for 'register_ipc_routes' from main/ipc/ipc_register.js"
      end

      def self.resolve_ipc_route_specs(*args)
        raise NotImplementedError, "Equivalent stub for 'resolve_ipc_route_specs' from main/ipc/ipc_register.js"
      end
    end
  end
end
