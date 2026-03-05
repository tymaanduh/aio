# frozen_string_literal: true

module Aio
  module RepoPolyglotEquivalents
    module ModuleStub
      SOURCE_JS_FILE = "brain/modules/suggestions_utils.js"
      EQUIVALENT_KIND = "repo_module_stub"
      FUNCTION_TOKENS = [
  "inflectVerbForSubject",
  "isLikelyPluralNoun",
  "isThirdPersonSingularSubject",
  "matchWordCasing",
  "normalizeWordLower"
]
      SYMBOL_MAP = {
  "inflectVerbForSubject": "inflect_verb_for_subject",
  "isLikelyPluralNoun": "is_likely_plural_noun",
  "isThirdPersonSingularSubject": "is_third_person_singular_subject",
  "matchWordCasing": "match_word_casing",
  "normalizeWordLower": "normalize_word_lower"
}

      def self.module_equivalent_metadata
        {
          "source_js_file" => SOURCE_JS_FILE,
          "equivalent_kind" => EQUIVALENT_KIND,
          "function_tokens" => FUNCTION_TOKENS.dup,
          "symbol_map" => SYMBOL_MAP.dup
        }
      end

      def self.inflect_verb_for_subject(*args)
        raise NotImplementedError, "Equivalent stub for 'inflectVerbForSubject' from brain/modules/suggestions_utils.js"
      end

      def self.is_likely_plural_noun(*args)
        raise NotImplementedError, "Equivalent stub for 'isLikelyPluralNoun' from brain/modules/suggestions_utils.js"
      end

      def self.is_third_person_singular_subject(*args)
        raise NotImplementedError, "Equivalent stub for 'isThirdPersonSingularSubject' from brain/modules/suggestions_utils.js"
      end

      def self.match_word_casing(*args)
        raise NotImplementedError, "Equivalent stub for 'matchWordCasing' from brain/modules/suggestions_utils.js"
      end

      def self.normalize_word_lower(*args)
        raise NotImplementedError, "Equivalent stub for 'normalizeWordLower' from brain/modules/suggestions_utils.js"
      end
    end
  end
end
