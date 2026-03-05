# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "scripts/polyglot/swaps/cpp/cpp_node_bridge.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "buildBridgeBinary",
  "commandExists",
  "main",
  "parseArgs",
  "resolveCompiler",
  "runCommand",
  "shouldRebuildBinary"
]
      SYMBOL_MAP = {
  "buildBridgeBinary": "build_bridge_binary",
  "commandExists": "command_exists",
  "main": "main",
  "parseArgs": "parse_args",
  "resolveCompiler": "resolve_compiler",
  "runCommand": "run_command",
  "shouldRebuildBinary": "should_rebuild_binary"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.build_bridge_binary(*args)
        raise NotImplementedError, "Equivalent stub for 'buildBridgeBinary' from scripts/polyglot/swaps/cpp/cpp_node_bridge.js"
      end

      def self.command_exists(*args)
        raise NotImplementedError, "Equivalent stub for 'commandExists' from scripts/polyglot/swaps/cpp/cpp_node_bridge.js"
      end

      def self.main(*args)
        raise NotImplementedError, "Equivalent stub for 'main' from scripts/polyglot/swaps/cpp/cpp_node_bridge.js"
      end

      def self.parse_args(*args)
        raise NotImplementedError, "Equivalent stub for 'parseArgs' from scripts/polyglot/swaps/cpp/cpp_node_bridge.js"
      end

      def self.resolve_compiler(*args)
        raise NotImplementedError, "Equivalent stub for 'resolveCompiler' from scripts/polyglot/swaps/cpp/cpp_node_bridge.js"
      end

      def self.run_command(*args)
        raise NotImplementedError, "Equivalent stub for 'runCommand' from scripts/polyglot/swaps/cpp/cpp_node_bridge.js"
      end

      def self.should_rebuild_binary(*args)
        raise NotImplementedError, "Equivalent stub for 'shouldRebuildBinary' from scripts/polyglot/swaps/cpp/cpp_node_bridge.js"
      end
    end
  end
end
