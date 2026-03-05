# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "renderer/boot/specs/app_hook_specs.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "DESC",
  "HOOK_KEY",
  "PATH",
  "PATH_LIST",
  "TAG_LIST",
  "TXT_LIST"
]
      SYMBOL_MAP = {
  "DESC": "desc",
  "HOOK_KEY": "hook_key",
  "PATH": "path",
  "PATH_LIST": "path_list",
  "TAG_LIST": "tag_list",
  "TXT_LIST": "txt_list"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.desc(*args)
        raise NotImplementedError, "Equivalent stub for 'DESC' from renderer/boot/specs/app_hook_specs.js"
      end

      def self.hook_key(*args)
        raise NotImplementedError, "Equivalent stub for 'HOOK_KEY' from renderer/boot/specs/app_hook_specs.js"
      end

      def self.path(*args)
        raise NotImplementedError, "Equivalent stub for 'PATH' from renderer/boot/specs/app_hook_specs.js"
      end

      def self.path_list(*args)
        raise NotImplementedError, "Equivalent stub for 'PATH_LIST' from renderer/boot/specs/app_hook_specs.js"
      end

      def self.tag_list(*args)
        raise NotImplementedError, "Equivalent stub for 'TAG_LIST' from renderer/boot/specs/app_hook_specs.js"
      end

      def self.txt_list(*args)
        raise NotImplementedError, "Equivalent stub for 'TXT_LIST' from renderer/boot/specs/app_hook_specs.js"
      end
    end
  end
end
