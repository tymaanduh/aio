(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }
  root.DictionarySuggestionUtils = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const THIRD_PERSON_SINGULAR_PRONOUNS = new Set([
    "he",
    "she",
    "it",
    "this",
    "that",
    "someone",
    "somebody",
    "everyone",
    "everybody",
    "anyone",
    "anybody",
    "nobody",
    "one"
  ]);
  const NON_THIRD_PERSON_SINGULAR_PRONOUNS = new Set(["i", "you", "we", "they", "these", "those"]);

  function normalizeWordLower(word, maxLength = 120) {
    return String(word || "")
      .trim()
      .slice(0, maxLength)
      .toLowerCase();
  }

  function matchWordCasing(sourceWord, targetWord) {
    if (!sourceWord || !targetWord) {
      return targetWord;
    }
    const source = String(sourceWord);
    if (source[0] === source[0].toUpperCase()) {
      return `${targetWord[0].toUpperCase()}${targetWord.slice(1)}`;
    }
    return targetWord;
  }

  function isLikelyPluralNoun(wordLowerCase) {
    if (!wordLowerCase) {
      return false;
    }
    if (wordLowerCase.endsWith("ss")) {
      return false;
    }
    return wordLowerCase.endsWith("s");
  }

  function isThirdPersonSingularSubject(subjectWordLower, subjectPos) {
    if (!subjectWordLower) {
      return false;
    }

    if (subjectPos === "pronoun") {
      if (NON_THIRD_PERSON_SINGULAR_PRONOUNS.has(subjectWordLower)) {
        return false;
      }
      return THIRD_PERSON_SINGULAR_PRONOUNS.has(subjectWordLower);
    }

    if (subjectPos === "noun") {
      return !isLikelyPluralNoun(subjectWordLower);
    }

    return false;
  }

  function inflectVerbForSubject(baseVerb, subjectWord, subjectPos) {
    const base = String(baseVerb || "")
      .trim()
      .slice(0, 120);
    const baseLower = base.toLowerCase();
    const subjectLower = normalizeWordLower(subjectWord);
    if (!baseLower) {
      return base;
    }

    if (baseLower === "be" || baseLower === "am" || baseLower === "is" || baseLower === "are") {
      if (subjectLower === "i") {
        return matchWordCasing(base, "am");
      }
      const form = isThirdPersonSingularSubject(subjectLower, subjectPos) ? "is" : "are";
      return matchWordCasing(base, form);
    }

    if (baseLower === "have" || baseLower === "has") {
      const form = isThirdPersonSingularSubject(subjectLower, subjectPos) ? "has" : "have";
      return matchWordCasing(base, form);
    }

    if (baseLower === "do" || baseLower === "does") {
      const form = isThirdPersonSingularSubject(subjectLower, subjectPos) ? "does" : "do";
      return matchWordCasing(base, form);
    }

    if (baseLower === "go" || baseLower === "goes") {
      const form = isThirdPersonSingularSubject(subjectLower, subjectPos) ? "goes" : "go";
      return matchWordCasing(base, form);
    }

    if (!isThirdPersonSingularSubject(subjectLower, subjectPos)) {
      return base;
    }

    let inflected = baseLower;
    if (/[sxz]$/.test(baseLower) || /(ch|sh)$/.test(baseLower) || /o$/.test(baseLower)) {
      inflected = `${baseLower}es`;
    } else if (/[^aeiou]y$/.test(baseLower)) {
      inflected = `${baseLower.slice(0, -1)}ies`;
    } else if (!baseLower.endsWith("s")) {
      inflected = `${baseLower}s`;
    }

    return matchWordCasing(base, inflected);
  }

  return {
    THIRD_PERSON_SINGULAR_PRONOUNS,
    NON_THIRD_PERSON_SINGULAR_PRONOUNS,
    normalizeWordLower,
    matchWordCasing,
    isLikelyPluralNoun,
    isThirdPersonSingularSubject,
    inflectVerbForSubject
  };
});
