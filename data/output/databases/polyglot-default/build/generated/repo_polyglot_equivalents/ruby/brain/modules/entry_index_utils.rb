# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "brain/modules/entry_index_utils.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "buildEntriesIndex",
  "cleanText",
  "createEntryIndexTools"
]
      SYMBOL_MAP = {
  "buildEntriesIndex": "build_entries_index",
  "cleanText": "clean_text",
  "createEntryIndexTools": "create_entry_index_tools"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.build_entries_index(*args)
        raise NotImplementedError, "Equivalent stub for 'buildEntriesIndex' from brain/modules/entry_index_utils.js"
      end

      def self.clean_text(*args)
        raise NotImplementedError, "Equivalent stub for 'cleanText' from brain/modules/entry_index_utils.js"
      end

      def self.create_entry_index_tools(*args)
        raise NotImplementedError, "Equivalent stub for 'createEntryIndexTools' from brain/modules/entry_index_utils.js"
      end
    end
  end
end
