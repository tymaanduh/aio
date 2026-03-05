# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "tests/agent_workflow_shards.test.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "writeJson"
]
      SYMBOL_MAP = {
  "writeJson": "write_json"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.write_json(*args)
        raise NotImplementedError, "Equivalent stub for 'writeJson' from tests/agent_workflow_shards.test.js"
      end
    end
  end
end
