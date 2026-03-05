# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "main/data/repository_manifest.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "build_file_meta",
  "create_manifest",
  "ensure_data_dirs",
  "file_exists",
  "get_data_paths",
  "is_plain_object",
  "load_manifest",
  "read_json_file",
  "save_manifest",
  "sync_manifest_file",
  "write_json_atomic"
]
      SYMBOL_MAP = {
  "build_file_meta": "build_file_meta",
  "create_manifest": "create_manifest",
  "ensure_data_dirs": "ensure_data_dirs",
  "file_exists": "file_exists",
  "get_data_paths": "get_data_paths",
  "is_plain_object": "is_plain_object",
  "load_manifest": "load_manifest",
  "read_json_file": "read_json_file",
  "save_manifest": "save_manifest",
  "sync_manifest_file": "sync_manifest_file",
  "write_json_atomic": "write_json_atomic"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.build_file_meta(*args)
        raise NotImplementedError, "Equivalent stub for 'build_file_meta' from main/data/repository_manifest.js"
      end

      def self.create_manifest(*args)
        raise NotImplementedError, "Equivalent stub for 'create_manifest' from main/data/repository_manifest.js"
      end

      def self.ensure_data_dirs(*args)
        raise NotImplementedError, "Equivalent stub for 'ensure_data_dirs' from main/data/repository_manifest.js"
      end

      def self.file_exists(*args)
        raise NotImplementedError, "Equivalent stub for 'file_exists' from main/data/repository_manifest.js"
      end

      def self.get_data_paths(*args)
        raise NotImplementedError, "Equivalent stub for 'get_data_paths' from main/data/repository_manifest.js"
      end

      def self.is_plain_object(*args)
        raise NotImplementedError, "Equivalent stub for 'is_plain_object' from main/data/repository_manifest.js"
      end

      def self.load_manifest(*args)
        raise NotImplementedError, "Equivalent stub for 'load_manifest' from main/data/repository_manifest.js"
      end

      def self.read_json_file(*args)
        raise NotImplementedError, "Equivalent stub for 'read_json_file' from main/data/repository_manifest.js"
      end

      def self.save_manifest(*args)
        raise NotImplementedError, "Equivalent stub for 'save_manifest' from main/data/repository_manifest.js"
      end

      def self.sync_manifest_file(*args)
        raise NotImplementedError, "Equivalent stub for 'sync_manifest_file' from main/data/repository_manifest.js"
      end

      def self.write_json_atomic(*args)
        raise NotImplementedError, "Equivalent stub for 'write_json_atomic' from main/data/repository_manifest.js"
      end
    end
  end
end
