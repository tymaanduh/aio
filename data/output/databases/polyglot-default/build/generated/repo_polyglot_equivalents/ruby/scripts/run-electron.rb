# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "scripts/run-electron.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "isWslRuntime",
  "toCmdQuoted",
  "toWindowsPath"
]
      SYMBOL_MAP = {
  "isWslRuntime": "is_wsl_runtime",
  "toCmdQuoted": "to_cmd_quoted",
  "toWindowsPath": "to_windows_path"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.is_wsl_runtime(*args)
        raise NotImplementedError, "Equivalent stub for 'isWslRuntime' from scripts/run-electron.js"
      end

      def self.to_cmd_quoted(*args)
        raise NotImplementedError, "Equivalent stub for 'toCmdQuoted' from scripts/run-electron.js"
      end

      def self.to_windows_path(*args)
        raise NotImplementedError, "Equivalent stub for 'toWindowsPath' from scripts/run-electron.js"
      end
    end
  end
end
