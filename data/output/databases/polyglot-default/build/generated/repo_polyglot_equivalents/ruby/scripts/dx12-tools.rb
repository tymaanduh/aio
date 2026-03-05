# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "scripts/dx12-tools.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "detectVisualStudioInstallPath",
  "existsExecutable",
  "firstExisting",
  "getMakePath",
  "getMingwCompilers",
  "getNativeLinuxCmakePath",
  "getWindowsPowershellPath",
  "isWsl",
  "runCommand"
]
      SYMBOL_MAP = {
  "detectVisualStudioInstallPath": "detect_visual_studio_install_path",
  "existsExecutable": "exists_executable",
  "firstExisting": "first_existing",
  "getMakePath": "get_make_path",
  "getMingwCompilers": "get_mingw_compilers",
  "getNativeLinuxCmakePath": "get_native_linux_cmake_path",
  "getWindowsPowershellPath": "get_windows_powershell_path",
  "isWsl": "is_wsl",
  "runCommand": "run_command"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.detect_visual_studio_install_path(*args)
        raise NotImplementedError, "Equivalent stub for 'detectVisualStudioInstallPath' from scripts/dx12-tools.js"
      end

      def self.exists_executable(*args)
        raise NotImplementedError, "Equivalent stub for 'existsExecutable' from scripts/dx12-tools.js"
      end

      def self.first_existing(*args)
        raise NotImplementedError, "Equivalent stub for 'firstExisting' from scripts/dx12-tools.js"
      end

      def self.get_make_path(*args)
        raise NotImplementedError, "Equivalent stub for 'getMakePath' from scripts/dx12-tools.js"
      end

      def self.get_mingw_compilers(*args)
        raise NotImplementedError, "Equivalent stub for 'getMingwCompilers' from scripts/dx12-tools.js"
      end

      def self.get_native_linux_cmake_path(*args)
        raise NotImplementedError, "Equivalent stub for 'getNativeLinuxCmakePath' from scripts/dx12-tools.js"
      end

      def self.get_windows_powershell_path(*args)
        raise NotImplementedError, "Equivalent stub for 'getWindowsPowershellPath' from scripts/dx12-tools.js"
      end

      def self.is_wsl(*args)
        raise NotImplementedError, "Equivalent stub for 'isWsl' from scripts/dx12-tools.js"
      end

      def self.run_command(*args)
        raise NotImplementedError, "Equivalent stub for 'runCommand' from scripts/dx12-tools.js"
      end
    end
  end
end
