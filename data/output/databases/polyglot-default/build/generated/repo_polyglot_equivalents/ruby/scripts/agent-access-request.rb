# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "scripts/agent-access-request.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "appendRequestLog",
  "createRequestId",
  "ensureParentDir",
  "nowIso",
  "parseArgs",
  "printHelpAndExit",
  "readPolicy",
  "resolveLogFile",
  "run",
  "toUniqueSorted",
  "validateRequest"
]
      SYMBOL_MAP = {
  "appendRequestLog": "append_request_log",
  "createRequestId": "create_request_id",
  "ensureParentDir": "ensure_parent_dir",
  "nowIso": "now_iso",
  "parseArgs": "parse_args",
  "printHelpAndExit": "print_help_and_exit",
  "readPolicy": "read_policy",
  "resolveLogFile": "resolve_log_file",
  "run": "run",
  "toUniqueSorted": "to_unique_sorted",
  "validateRequest": "validate_request"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.append_request_log(*args)
        raise NotImplementedError, "Equivalent stub for 'appendRequestLog' from scripts/agent-access-request.js"
      end

      def self.create_request_id(*args)
        raise NotImplementedError, "Equivalent stub for 'createRequestId' from scripts/agent-access-request.js"
      end

      def self.ensure_parent_dir(*args)
        raise NotImplementedError, "Equivalent stub for 'ensureParentDir' from scripts/agent-access-request.js"
      end

      def self.now_iso(*args)
        raise NotImplementedError, "Equivalent stub for 'nowIso' from scripts/agent-access-request.js"
      end

      def self.parse_args(*args)
        raise NotImplementedError, "Equivalent stub for 'parseArgs' from scripts/agent-access-request.js"
      end

      def self.print_help_and_exit(*args)
        raise NotImplementedError, "Equivalent stub for 'printHelpAndExit' from scripts/agent-access-request.js"
      end

      def self.read_policy(*args)
        raise NotImplementedError, "Equivalent stub for 'readPolicy' from scripts/agent-access-request.js"
      end

      def self.resolve_log_file(*args)
        raise NotImplementedError, "Equivalent stub for 'resolveLogFile' from scripts/agent-access-request.js"
      end

      def self.run(*args)
        raise NotImplementedError, "Equivalent stub for 'run' from scripts/agent-access-request.js"
      end

      def self.to_unique_sorted(*args)
        raise NotImplementedError, "Equivalent stub for 'toUniqueSorted' from scripts/agent-access-request.js"
      end

      def self.validate_request(*args)
        raise NotImplementedError, "Equivalent stub for 'validateRequest' from scripts/agent-access-request.js"
      end
    end
  end
end
