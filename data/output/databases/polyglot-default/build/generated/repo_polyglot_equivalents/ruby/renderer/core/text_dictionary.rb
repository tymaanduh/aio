# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "renderer/core/text_dictionary.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "clean_text",
  "normalize_key",
  "normalize_token",
  "text_desc",
  "text_hook_key",
  "text_join",
  "text_list",
  "text_path",
  "text_path_list",
  "text_tags",
  "text_token",
  "to_hook_key_token",
  "unique_text_list"
]
      SYMBOL_MAP = {
  "clean_text": "clean_text",
  "normalize_key": "normalize_key",
  "normalize_token": "normalize_token",
  "text_desc": "text_desc",
  "text_hook_key": "text_hook_key",
  "text_join": "text_join",
  "text_list": "text_list",
  "text_path": "text_path",
  "text_path_list": "text_path_list",
  "text_tags": "text_tags",
  "text_token": "text_token",
  "to_hook_key_token": "to_hook_key_token",
  "unique_text_list": "unique_text_list"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.clean_text(*args)
        raise NotImplementedError, "Equivalent stub for 'clean_text' from renderer/core/text_dictionary.js"
      end

      def self.normalize_key(*args)
        raise NotImplementedError, "Equivalent stub for 'normalize_key' from renderer/core/text_dictionary.js"
      end

      def self.normalize_token(*args)
        raise NotImplementedError, "Equivalent stub for 'normalize_token' from renderer/core/text_dictionary.js"
      end

      def self.text_desc(*args)
        raise NotImplementedError, "Equivalent stub for 'text_desc' from renderer/core/text_dictionary.js"
      end

      def self.text_hook_key(*args)
        raise NotImplementedError, "Equivalent stub for 'text_hook_key' from renderer/core/text_dictionary.js"
      end

      def self.text_join(*args)
        raise NotImplementedError, "Equivalent stub for 'text_join' from renderer/core/text_dictionary.js"
      end

      def self.text_list(*args)
        raise NotImplementedError, "Equivalent stub for 'text_list' from renderer/core/text_dictionary.js"
      end

      def self.text_path(*args)
        raise NotImplementedError, "Equivalent stub for 'text_path' from renderer/core/text_dictionary.js"
      end

      def self.text_path_list(*args)
        raise NotImplementedError, "Equivalent stub for 'text_path_list' from renderer/core/text_dictionary.js"
      end

      def self.text_tags(*args)
        raise NotImplementedError, "Equivalent stub for 'text_tags' from renderer/core/text_dictionary.js"
      end

      def self.text_token(*args)
        raise NotImplementedError, "Equivalent stub for 'text_token' from renderer/core/text_dictionary.js"
      end

      def self.to_hook_key_token(*args)
        raise NotImplementedError, "Equivalent stub for 'to_hook_key_token' from renderer/core/text_dictionary.js"
      end

      def self.unique_text_list(*args)
        raise NotImplementedError, "Equivalent stub for 'unique_text_list' from renderer/core/text_dictionary.js"
      end
    end
  end
end
