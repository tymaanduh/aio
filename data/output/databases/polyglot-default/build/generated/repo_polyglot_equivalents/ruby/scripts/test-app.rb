# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "scripts/test-app.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "connectWs",
  "evaluate",
  "fail",
  "getTargets",
  "handler",
  "ok",
  "runTests",
  "sendCommand"
]
      SYMBOL_MAP = {
  "connectWs": "connect_ws",
  "evaluate": "evaluate",
  "fail": "fail",
  "getTargets": "get_targets",
  "handler": "handler",
  "ok": "ok",
  "runTests": "run_tests",
  "sendCommand": "send_command"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.connect_ws(*args)
        raise NotImplementedError, "Equivalent stub for 'connectWs' from scripts/test-app.js"
      end

      def self.evaluate(*args)
        raise NotImplementedError, "Equivalent stub for 'evaluate' from scripts/test-app.js"
      end

      def self.fail(*args)
        raise NotImplementedError, "Equivalent stub for 'fail' from scripts/test-app.js"
      end

      def self.get_targets(*args)
        raise NotImplementedError, "Equivalent stub for 'getTargets' from scripts/test-app.js"
      end

      def self.handler(*args)
        raise NotImplementedError, "Equivalent stub for 'handler' from scripts/test-app.js"
      end

      def self.ok(*args)
        raise NotImplementedError, "Equivalent stub for 'ok' from scripts/test-app.js"
      end

      def self.run_tests(*args)
        raise NotImplementedError, "Equivalent stub for 'runTests' from scripts/test-app.js"
      end

      def self.send_command(*args)
        raise NotImplementedError, "Equivalent stub for 'sendCommand' from scripts/test-app.js"
      end
    end
  end
end
