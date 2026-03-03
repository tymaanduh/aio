/* eslint-disable no-undef */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }
  const __MODULE_API = factory();
  root.Dictionary_Renderer_Text_Utils = __MODULE_API;
  root.DictionaryRendererTextUtils = __MODULE_API;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function createRendererTextUtils(deps = {}) {
    const max = deps.max && typeof deps.max === "object" ? deps.max : {};
    const partsOfSpeech = deps.partsOfSpeech instanceof Set ? deps.partsOfSpeech : new Set();
    const normalizeWordLowerImpl =
      typeof deps.normalizeWordLowerImpl === "function"
        ? deps.normalizeWordLowerImpl
        : (value, maxLength = 1000) => String(value || "").trim().toLowerCase().slice(0, maxLength);
    const maxLabel = Number(max.LABEL) || 120;
    const maxWord = Number(max.WORD) || 120;
    const maxDefinition = Number(max.DEFINITION) || 20000;

    function cleanText(value, maxLength = 1000) {
      if (typeof value !== "string") {
        return "";
      }
      return value.trim().slice(0, maxLength);
    }

    function unique(values) {
      const seen = new Set();
      const result = [];
      (Array.isArray(values) ? values : []).forEach((item) => {
        if (seen.has(item)) {
          return;
        }
        seen.add(item);
        result.push(item);
      });
      return result;
    }

    function nowIso() {
      return new Date().toISOString();
    }

    function normalizeLabel(label) {
      return cleanText(label, maxLabel);
    }

    function parseLabels(csv) {
      return unique(
        String(csv || "")
          .split(",")
          .map(normalizeLabel)
          .filter(Boolean)
      );
    }

    function normalizeLabelArray(labels) {
      return unique((Array.isArray(labels) ? labels : []).map(normalizeLabel).filter(Boolean));
    }

    function keyForLabel(label) {
      return `label:${label}`;
    }

    function keyForCategory(categoryKey) {
      return `category:${categoryKey}`;
    }

    function isPartOfSpeechLabel(label) {
      return partsOfSpeech.has(String(label || "").toLowerCase());
    }

    function normalizeEntryMode(value) {
      const mode = cleanText(value, 20).toLowerCase();
      if (mode === "slang" || mode === "code" || mode === "bytes") {
        return mode;
      }
      return "definition";
    }

    function normalizeEntryLanguage(value) {
      return cleanText(value, 80);
    }

    function inferLabelsFromDefinition(definition) {
      const text = cleanText(definition, maxDefinition).toLowerCase();
      if (!text) {
        return [];
      }

      const inferred = new Set();
      if (
        /\[(noun|verb|adjective|adverb|pronoun|preposition|conjunction|interjection|determiner|article|numeral)\]/.test(
          text
        )
      ) {
        const matches =
          text.match(
            /\[(noun|verb|adjective|adverb|pronoun|preposition|conjunction|interjection|determiner|article|numeral)\]/g
          ) || [];
        matches.forEach((tag) => inferred.add(tag.replace(/\[|\]/g, "")));
      }
      (/^to\s+[a-z]/.test(text) || /\bto\s+[a-z]+\b/.test(text)) && (inferred.add("verb"));
      (/^\ba\s|\ban\s|\bthe\s/.test(text)) && (inferred.add("noun"));
      (/\bly\b/.test(text) || /\bin an? .* manner\b/.test(text)) && (inferred.add("adverb"));

      return [...inferred].map(normalizeLabel).filter((label) => isPartOfSpeechLabel(label));
    }

    function inferQuestionLabelsFromDefinition(definition) {
      const text = cleanText(definition, maxDefinition).toLowerCase();
      if (!text) {
        return [];
      }

      const labels = new Set();
      if (
        /\b(person|individual|someone|somebody|human|character|author|developer|team|organization|company)\b/.test(
          text
        )
      ) {
        labels.add("Who");
      }
      (/\b(place|location|city|country|region|area|site|office|server|environment|domain)\b/.test(text)) &&
        (labels.add("Where"));
      (/\b(time|date|year|month|day|hour|era|period|schedule|deadline|timestamp)\b/.test(text)) &&
        (labels.add("When"));
      (/\b(reason|purpose|because|cause|motivation|motive|goal|intent)\b/.test(text)) && (labels.add("Why"));
      (/\b(method|process|procedure|way|step|technique|algorithm|implementation)\b/.test(text)) &&
        (labels.add("How"));
      (labels.size === 0 || /\b(thing|object|concept|term|word|value|type|entity)\b/.test(text)) &&
        (labels.add("What"));

      return [...labels].map(normalizeLabel).filter(Boolean);
    }

    function sanitizeDefinitionText(text) {
      return cleanText(String(text || "").replace(/\s+/g, " "), maxDefinition);
    }

    function normalizeWordLower(word) {
      return normalizeWordLowerImpl(word, maxWord);
    }

    function detectPosConflicts(labels) {
      const posLabels = normalizeLabelArray(labels)
        .map((label) => label.toLowerCase())
        .filter((label) => isPartOfSpeechLabel(label));
      return unique(posLabels);
    }

    return {
      cleanText,
      unique,
      nowIso,
      normalizeLabel,
      parseLabels,
      normalizeLabelArray,
      keyForLabel,
      keyForCategory,
      isPartOfSpeechLabel,
      normalizeEntryMode,
      normalizeEntryLanguage,
      inferLabelsFromDefinition,
      inferQuestionLabelsFromDefinition,
      sanitizeDefinitionText,
      normalizeWordLower,
      detectPosConflicts
    };
  }

  return {
    createRendererTextUtils
  };
});
