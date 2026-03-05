# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "main/ipc/ipc_channels.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "build_ipc_channel"
]
      SYMBOL_MAP = {
  "build_ipc_channel": "build_ipc_channel"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.build_ipc_channel(*args)
        raise NotImplementedError, "Equivalent stub for 'build_ipc_channel' from main/ipc/ipc_channels.js"
      end
    end
  end
end
