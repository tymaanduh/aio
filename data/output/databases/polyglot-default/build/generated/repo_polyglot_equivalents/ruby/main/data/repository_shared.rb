# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "main/data/repository_shared.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "build_user_data_export_path",
  "create_export_stamp",
  "create_repository_result",
  "create_repository_state_api",
  "ensure_repository_file",
  "load_repository_state",
  "now_iso",
  "save_repository_state"
]
      SYMBOL_MAP = {
  "build_user_data_export_path": "build_user_data_export_path",
  "create_export_stamp": "create_export_stamp",
  "create_repository_result": "create_repository_result",
  "create_repository_state_api": "create_repository_state_api",
  "ensure_repository_file": "ensure_repository_file",
  "load_repository_state": "load_repository_state",
  "now_iso": "now_iso",
  "save_repository_state": "save_repository_state"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.build_user_data_export_path(*args)
        raise NotImplementedError, "Equivalent stub for 'build_user_data_export_path' from main/data/repository_shared.js"
      end

      def self.create_export_stamp(*args)
        raise NotImplementedError, "Equivalent stub for 'create_export_stamp' from main/data/repository_shared.js"
      end

      def self.create_repository_result(*args)
        raise NotImplementedError, "Equivalent stub for 'create_repository_result' from main/data/repository_shared.js"
      end

      def self.create_repository_state_api(*args)
        raise NotImplementedError, "Equivalent stub for 'create_repository_state_api' from main/data/repository_shared.js"
      end

      def self.ensure_repository_file(*args)
        raise NotImplementedError, "Equivalent stub for 'ensure_repository_file' from main/data/repository_shared.js"
      end

      def self.load_repository_state(*args)
        raise NotImplementedError, "Equivalent stub for 'load_repository_state' from main/data/repository_shared.js"
      end

      def self.now_iso(*args)
        raise NotImplementedError, "Equivalent stub for 'now_iso' from main/data/repository_shared.js"
      end

      def self.save_repository_state(*args)
        raise NotImplementedError, "Equivalent stub for 'save_repository_state' from main/data/repository_shared.js"
      end
    end
  end
end
