# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "scripts/lib/robust-file-write.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "ensureDirForFile",
  "isRetryableFileWriteError",
  "sleepSync",
  "writeTextFileRobust"
]
      SYMBOL_MAP = {
  "ensureDirForFile": "ensure_dir_for_file",
  "isRetryableFileWriteError": "is_retryable_file_write_error",
  "sleepSync": "sleep_sync",
  "writeTextFileRobust": "write_text_file_robust"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.ensure_dir_for_file(*args)
        raise NotImplementedError, "Equivalent stub for 'ensureDirForFile' from scripts/lib/robust-file-write.js"
      end

      def self.is_retryable_file_write_error(*args)
        raise NotImplementedError, "Equivalent stub for 'isRetryableFileWriteError' from scripts/lib/robust-file-write.js"
      end

      def self.sleep_sync(*args)
        raise NotImplementedError, "Equivalent stub for 'sleepSync' from scripts/lib/robust-file-write.js"
      end

      def self.write_text_file_robust(*args)
        raise NotImplementedError, "Equivalent stub for 'writeTextFileRobust' from scripts/lib/robust-file-write.js"
      end
    end
  end
end
