(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }
  const __MODULE_API = factory();
  root.Dictionary_Renderer_Text_Rules = __MODULE_API;
  root.DictionaryRendererTextRules = __MODULE_API;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const RENDERER_TEXT_RULES = Object.freeze({
    entry_mode_rules: Object.freeze({
      default_mode: "definition",
      bytes_mode: "bytes",
      allowed_modes: Object.freeze(["definition", "slang", "code", "bytes"]),
      code_like_modes: Object.freeze(["code", "bytes"]),
      infer_label_modes: Object.freeze(["definition", "slang"]),
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
    }),
    pos_tag_rules: Object.freeze({
      test_pattern:
        /\[(noun|verb|adjective|adverb|pronoun|preposition|conjunction|interjection|determiner|article|numeral)\]/,
      match_pattern:
        /\[(noun|verb|adjective|adverb|pronoun|preposition|conjunction|interjection|determiner|article|numeral)\]/g
    }),
    label_infer_rules: Object.freeze([
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
    ]),
    question_label_rules: Object.freeze([
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
    ]),
    question_label_default: "What",
    question_label_fallback_pattern: /\b(thing|object|concept|term|word|value|type|entity)\b/,
    bytes_payload_pattern: /^[0-9a-fA-F+/_=\s-]+$/,
    bytes_warning_text: "Bytes mode expects hex/base64-like text."
  });

  return {
    RENDERER_TEXT_RULES
  };
});
