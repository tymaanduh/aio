# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "brain/modules/command_palette_utils.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "normalizeQuery",
  "rankCommands",
  "scoreCommand"
]
      SYMBOL_MAP = {
  "normalizeQuery": "normalize_query",
  "rankCommands": "rank_commands",
  "scoreCommand": "score_command"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.normalize_query(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizeQuery' from brain/modules/command_palette_utils.js"
      end

      def self.rank_commands(*args)
        raise NotImplementedError, "Equivalent stub for 'rankCommands' from brain/modules/command_palette_utils.js"
      end

      def self.score_command(*args)
        raise NotImplementedError, "Equivalent stub for 'scoreCommand' from brain/modules/command_palette_utils.js"
      end
    end
  end
end
