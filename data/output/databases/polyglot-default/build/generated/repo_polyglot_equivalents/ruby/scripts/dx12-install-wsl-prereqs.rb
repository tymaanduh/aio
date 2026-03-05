# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "scripts/dx12-install-wsl-prereqs.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "fail",
  "hasSudoNoPrompt",
  "info",
  "main",
  "runApt"
]
      SYMBOL_MAP = {
  "fail": "fail",
  "hasSudoNoPrompt": "has_sudo_no_prompt",
  "info": "info",
  "main": "main",
  "runApt": "run_apt"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.fail(*args)
        raise NotImplementedError, "Equivalent stub for 'fail' from scripts/dx12-install-wsl-prereqs.js"
      end

      def self.has_sudo_no_prompt(*args)
        raise NotImplementedError, "Equivalent stub for 'hasSudoNoPrompt' from scripts/dx12-install-wsl-prereqs.js"
      end

      def self.info(*args)
        raise NotImplementedError, "Equivalent stub for 'info' from scripts/dx12-install-wsl-prereqs.js"
      end

      def self.main(*args)
        raise NotImplementedError, "Equivalent stub for 'main' from scripts/dx12-install-wsl-prereqs.js"
      end

      def self.run_apt(*args)
        raise NotImplementedError, "Equivalent stub for 'runApt' from scripts/dx12-install-wsl-prereqs.js"
      end
    end
  end
end
