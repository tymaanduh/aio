# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "scripts/build-agent-workflow-shards.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "buildCheckReport",
  "main",
  "parseArgs"
]
      SYMBOL_MAP = {
  "buildCheckReport": "build_check_report",
  "main": "main",
  "parseArgs": "parse_args"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.build_check_report(*args)
        raise NotImplementedError, "Equivalent stub for 'buildCheckReport' from scripts/build-agent-workflow-shards.js"
      end

      def self.main(*args)
        raise NotImplementedError, "Equivalent stub for 'main' from scripts/build-agent-workflow-shards.js"
      end

      def self.parse_args(*args)
        raise NotImplementedError, "Equivalent stub for 'parseArgs' from scripts/build-agent-workflow-shards.js"
      end
    end
  end
end
