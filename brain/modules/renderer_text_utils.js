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
    const textRules = deps.rules && typeof deps.rules === "object" ? deps.rules : {};
    const partsOfSpeech = deps.partsOfSpeech instanceof Set ? deps.partsOfSpeech : new Set();
    const normalizeWordLowerImpl =
      typeof deps.normalizeWordLowerImpl === "function"
        ? deps.normalizeWordLowerImpl
        : (value, maxLength = 1000) =>
            String(value || "")
              .trim()
              .toLowerCase()
              .slice(0, maxLength);
    const maxLabel = Number(max.LABEL) || 120;
    const maxWord = Number(max.WORD) || 120;
    const maxDefinition = Number(max.DEFINITION) || 20000;
    const defaultEntryMode = "definition";
    const defaultEntryModeRules = Object.freeze({
      default_mode: defaultEntryMode,
      bytes_mode: "bytes",
      allowed_modes: Object.freeze([defaultEntryMode, "slang", "code", "bytes"]),
      code_like_modes: Object.freeze(["code", "bytes"]),
      infer_label_modes: Object.freeze([defaultEntryMode, "slang"]),
      label_hints: Object.freeze({
        slang: "slang",
        code: "code",
        bytes: "bytes"
      }),
      placeholders: Object.freeze({
        code: "Paste code snippet, pseudo-code, or API usage.",
        bytes: "Paste hex or base64 bytes payload.",
        slang: "Explain slang meaning, origin, and usage."
      })
    });
    const entryModeRules =
      textRules.entry_mode_rules && typeof textRules.entry_mode_rules === "object"
        ? textRules.entry_mode_rules
        : defaultEntryModeRules;
    const entryModeDefault = cleanText(entryModeRules.default_mode, 20).toLowerCase() || defaultEntryMode;
    const entryModeAllowed = new Set(
      (Array.isArray(entryModeRules.allowed_modes) ? entryModeRules.allowed_modes : defaultEntryModeRules.allowed_modes)
        .map((mode) => cleanText(mode, 20).toLowerCase())
        .filter(Boolean)
    );
    entryModeAllowed.add(entryModeDefault);
    const entryModeCodeLike = new Set(
      (Array.isArray(entryModeRules.code_like_modes)
        ? entryModeRules.code_like_modes
        : defaultEntryModeRules.code_like_modes
      )
        .map((mode) => cleanText(mode, 20).toLowerCase())
        .filter(Boolean)
    );
    const entryModeInferLabel = new Set(
      (Array.isArray(entryModeRules.infer_label_modes)
        ? entryModeRules.infer_label_modes
        : defaultEntryModeRules.infer_label_modes
      )
        .map((mode) => cleanText(mode, 20).toLowerCase())
        .filter(Boolean)
    );
    const bytesMode = cleanText(entryModeRules.bytes_mode, 20).toLowerCase() || "bytes";
    const entryModeLabelHints =
      entryModeRules.label_hints && typeof entryModeRules.label_hints === "object"
        ? entryModeRules.label_hints
        : defaultEntryModeRules.label_hints;
    const entryModePlaceholders =
      entryModeRules.placeholders && typeof entryModeRules.placeholders === "object"
        ? entryModeRules.placeholders
        : defaultEntryModeRules.placeholders;
    const defaultPosTagTestPattern =
      /\[(noun|verb|adjective|adverb|pronoun|preposition|conjunction|interjection|determiner|article|numeral)\]/;
    const defaultPosTagMatchPattern =
      /\[(noun|verb|adjective|adverb|pronoun|preposition|conjunction|interjection|determiner|article|numeral)\]/g;
    const posTagRules =
      textRules.pos_tag_rules && typeof textRules.pos_tag_rules === "object" ? textRules.pos_tag_rules : {};
    const posTagTestPattern =
      posTagRules.test_pattern instanceof RegExp ? posTagRules.test_pattern : defaultPosTagTestPattern;
    const posTagMatchPattern =
      posTagRules.match_pattern instanceof RegExp ? posTagRules.match_pattern : defaultPosTagMatchPattern;
    const defaultLabelInferRules = Object.freeze([
      Object.freeze({
        label: "verb",
        patterns: Object.freeze([/^to\s+[a-z]/, /\bto\s+[a-z]+\b/])
      }),
      Object.freeze({
        label: "noun",
        patterns: Object.freeze([/^\ba\s|\ban\s|\bthe\s/])
      }),
      Object.freeze({
        label: "adverb",
        patterns: Object.freeze([/\bly\b/, /\bin an? .* manner\b/])
      })
    ]);
    const labelInferRules = Array.isArray(textRules.label_infer_rules)
      ? textRules.label_infer_rules
      : defaultLabelInferRules;
    const defaultQuestionLabelRules = Object.freeze([
      Object.freeze({
        label: "Who",
        patterns: Object.freeze([
          /\b(person|individual|someone|somebody|human|character|author|developer|team|organization|company)\b/
        ])
      }),
      Object.freeze({
        label: "Where",
        patterns: Object.freeze([/\b(place|location|city|country|region|area|site|office|server|environment|domain)\b/])
      }),
      Object.freeze({
        label: "When",
        patterns: Object.freeze([/\b(time|date|year|month|day|hour|era|period|schedule|deadline|timestamp)\b/])
      }),
      Object.freeze({
        label: "Why",
        patterns: Object.freeze([/\b(reason|purpose|because|cause|motivation|motive|goal|intent)\b/])
      }),
      Object.freeze({
        label: "How",
        patterns: Object.freeze([/\b(method|process|procedure|way|step|technique|algorithm|implementation)\b/])
      })
    ]);
    const questionLabelRules = Array.isArray(textRules.question_label_rules)
      ? textRules.question_label_rules
      : defaultQuestionLabelRules;
    const questionLabelDefault = cleanText(textRules.question_label_default, maxLabel) || "What";
    const questionLabelFallbackPattern =
      textRules.question_label_fallback_pattern instanceof RegExp
        ? textRules.question_label_fallback_pattern
        : /\b(thing|object|concept|term|word|value|type|entity)\b/;
    const bytesPayloadPattern =
      textRules.bytes_payload_pattern instanceof RegExp ? textRules.bytes_payload_pattern : /^[0-9a-fA-F+/_=\s-]+$/;
    const bytesWarningText =
      cleanText(textRules.bytes_warning_text, maxDefinition) || "Bytes mode expects hex/base64-like text.";

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
      if (entryModeAllowed.has(mode)) {
        return mode;
      }
      return entryModeDefault;
    }

    function normalizeEntryLanguage(value) {
      return cleanText(value, 80);
    }

    function hasPatternMatch(text, patterns) {
      return (Array.isArray(patterns) ? patterns : []).some((pattern) => {
        if (!(pattern instanceof RegExp)) {
          return false;
        }
        if (pattern.global) {
          pattern.lastIndex = 0;
        }
        const matched = pattern.test(text);
        if (pattern.global) {
          pattern.lastIndex = 0;
        }
        return matched;
      });
    }

    function collectRuleLabels(text, rules, labelSet) {
      (Array.isArray(rules) ? rules : []).forEach((rule) => {
        const rawLabel = cleanText(rule?.label, maxLabel);
        const label = normalizeLabel(rawLabel);
        if (!label) {
          return;
        }
        const patterns = Array.isArray(rule?.patterns) ? rule.patterns : [];
        if (hasPatternMatch(text, patterns)) {
          labelSet.add(label);
        }
      });
    }

    function inferLabelsFromDefinition(definition) {
      const text = cleanText(definition, maxDefinition).toLowerCase();
      if (!text) {
        return [];
      }

      const inferred = new Set();
      if (hasPatternMatch(text, [posTagTestPattern])) {
        if (posTagMatchPattern.global) {
          posTagMatchPattern.lastIndex = 0;
        }
        const matches = text.match(posTagMatchPattern) || [];
        if (posTagMatchPattern.global) {
          posTagMatchPattern.lastIndex = 0;
        }
        matches.forEach((tag) => inferred.add(tag.replace(/\[|\]/g, "")));
      }
      collectRuleLabels(text, labelInferRules, inferred);

      return [...inferred].map(normalizeLabel).filter((label) => isPartOfSpeechLabel(label));
    }

    function inferQuestionLabelsFromDefinition(definition) {
      const text = cleanText(definition, maxDefinition).toLowerCase();
      if (!text) {
        return [];
      }

      const labels = new Set();
      collectRuleLabels(text, questionLabelRules, labels);
      (labels.size === 0 || hasPatternMatch(text, [questionLabelFallbackPattern])) && labels.add(questionLabelDefault);

      return [...labels].map(normalizeLabel).filter(Boolean);
    }

    function sanitizeDefinitionText(text) {
      return cleanText(String(text || "").replace(/\s+/g, " "), maxDefinition);
    }

    function normalizeWordLower(word) {
      return normalizeWordLowerImpl(word, maxWord);
    }

    function isCodeLikeMode(mode) {
      return entryModeCodeLike.has(normalizeEntryMode(mode));
    }

    function isBytesMode(mode) {
      return normalizeEntryMode(mode) === bytesMode;
    }

    function shouldInferModeLabels(mode) {
      return entryModeInferLabel.has(normalizeEntryMode(mode));
    }

    function resolveEntryModeLabelHint(mode) {
      const normalizedMode = normalizeEntryMode(mode);
      const hint = cleanText(entryModeLabelHints[normalizedMode], maxLabel);
      return hint ? normalizeLabel(hint).toLowerCase() : "";
    }

    function resolveEntryModePlaceholder(mode) {
      return cleanText(entryModePlaceholders[normalizeEntryMode(mode)], maxDefinition);
    }

    function isBytesPayloadLike(value) {
      const text = cleanText(value, maxDefinition);
      if (!text) {
        return true;
      }
      return hasPatternMatch(text, [bytesPayloadPattern]);
    }

    function getBytesWarningText() {
      return bytesWarningText;
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
      isCodeLikeMode,
      isBytesMode,
      shouldInferModeLabels,
      resolveEntryModeLabelHint,
      resolveEntryModePlaceholder,
      isBytesPayloadLike,
      getBytesWarningText,
      detectPosConflicts
    };
  }

  return {
    createRendererTextUtils
  };
});
