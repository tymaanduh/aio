"use strict";

const crypto = require("crypto");
const normalize_service = require("./normalize_service.js");
const { ALIAS_WORD_INDEX, createAliasMap } = require("../../brain/modules/alias-index.js");
const {
  THESAURUS_SEED_MAP,
  MACHINE_DESCRIPTOR_RULE_MAP
} = require("../../data/input/shared/language/machine_descriptor_thesaurus.js");

const languageBridgeLimits = Object.freeze({
  SOURCE_ID: 160,
  SNIPPET: 400,
  TERM: 120,
  DEFINITION: 500,
  PHRASE: 400,
  TRIAD_LIMIT: 80,
  KEYWORD_REF_MAX: 120,
  TRIAD_REF_MAX: 120,
  GLOSSARY_REF_MAX: 120,
  DESCRIPTOR_REF_MAX: 160,
  SEARCH_LIMIT_DEFAULT: 30,
  SEARCH_LIMIT_MAX: 200
});

const languageBridgeRegex = Object.freeze({
  CODE_BACKTICK: /`([^`]{1,120})`/g,
  IDENTIFIER: /\b[A-Za-z_][A-Za-z0-9_]{1,119}\b/g,
  SPLIT_SENTENCE: /[\n\r.!?;]+/g,
  WORD: /[A-Za-z][A-Za-z0-9'_/-]*/g,
  SPACE: /\s+/g,
  PSEUDO_MARKER: /\b(if|when|for each|for|then|return|call|set|while|loop|else|switch|case)\b/i
});

const LANGUAGE_BRIDGE_STOPWORDS = new Set(
  [
    "a",
    "an",
    "and",
    "are",
    "as",
    "at",
    "be",
    "by",
    "do",
    "for",
    "from",
    "how",
    "in",
    "into",
    "is",
    "it",
    "of",
    "on",
    "or",
    "that",
    "the",
    "this",
    "to",
    "up",
    "was",
    "we",
    "with",
    "you",
    "your"
  ].map((word) => word.toLowerCase())
);

const languageBridgeIo = {
  load_bridge_state: null,
  save_bridge_state: null
};

let LANGUAGE_BRIDGE_MEMORY_STATE = normalize_service.create_default_language_bridge_state();

const ALIAS_MAP = createAliasMap(ALIAS_WORD_INDEX);
const MACHINE_DESCRIPTOR_RULES = Object.freeze(
  Object.entries(MACHINE_DESCRIPTOR_RULE_MAP).map(([rule_key, rule]) => ({
    rule_key,
    ...rule
  }))
);
const MACHINE_DESCRIPTOR_TERM_RULE_MAP = (() => {
  const map = new Map();
  MACHINE_DESCRIPTOR_RULES.forEach((rule) => {
    to_array(rule.matched_terms).forEach((term) => {
      const key = String(term || "").toLowerCase().trim();
      if (!key) {
        return;
      }
      if (!map.has(key)) {
        map.set(key, rule.rule_key);
      }
    });
  });
  return map;
})();

function now_iso() {
  return new Date().toISOString();
}

function normalize_machine_term(value) {
  return clean_text(value, languageBridgeLimits.TERM).toLowerCase();
}

function get_seed_synonyms(term) {
  const key = normalize_machine_term(term);
  if (!key) {
    return [];
  }
  const canonical = to_array(THESAURUS_SEED_MAP[key]);
  const alias = to_array(ALIAS_MAP.get(key));
  return unique_strings([...canonical, ...alias], languageBridgeLimits.TERM);
}

function lookup_machine_rule(term) {
  const key = normalize_machine_term(term);
  if (!key) {
    return null;
  }
  const direct_rule_key = MACHINE_DESCRIPTOR_TERM_RULE_MAP.get(key);
  if (direct_rule_key && MACHINE_DESCRIPTOR_RULE_MAP[direct_rule_key]) {
    return MACHINE_DESCRIPTOR_RULE_MAP[direct_rule_key];
  }
  const seed_synonyms = get_seed_synonyms(key);
  for (let index = 0; index < seed_synonyms.length; index += 1) {
    const synonym_key = normalize_machine_term(seed_synonyms[index]);
    const synonym_rule_key = MACHINE_DESCRIPTOR_TERM_RULE_MAP.get(synonym_key);
    if (synonym_rule_key && MACHINE_DESCRIPTOR_RULE_MAP[synonym_rule_key]) {
      return MACHINE_DESCRIPTOR_RULE_MAP[synonym_rule_key];
    }
  }
  return null;
}

function extract_machine_terms(text) {
  const words = String(text || "").match(languageBridgeRegex.WORD) || [];
  return unique_strings(
    words
      .map((word) => normalize_machine_term(word))
      .filter((word) => word.length >= 1 && word.length <= languageBridgeLimits.TERM),
    languageBridgeLimits.TERM
  );
}

function create_machine_descriptor_record(term, source_ref) {
  const key = normalize_machine_term(term);
  if (!key) {
    return null;
  }
  const rule = lookup_machine_rule(key);
  const synonyms = get_seed_synonyms(key);
  const aliases = unique_strings(to_array(ALIAS_MAP.get(key)), languageBridgeLimits.TERM);

  if (!rule) {
    return {
      term: key,
      opcode: "TOKEN_LITERAL",
      operation: "literal_token",
      pseudocode_descriptor: `emit_token("${key}")`,
      machine_instruction: `set token_${key.replace(/[^a-z0-9_]/g, "_")} = true`,
      descriptor_signature: `[token:${key}]`,
      definition_variants: unique_strings(
        [
          `${key} is represented as a literal semantic token.`,
          `Literal token ${key} can be flagged for downstream parser stages.`
        ],
        languageBridgeLimits.DEFINITION,
        8
      ),
      synonyms,
      aliases,
      source_refs: unique_strings([source_ref], languageBridgeLimits.SOURCE_ID),
      confidence: 0.55,
      updated_at: now_iso()
    };
  }

  const definition_variants = unique_strings(
    [
      `${key} maps to opcode ${rule.opcode} for ${rule.operation}.`,
      `Machine instruction for ${key}: ${rule.machine_instruction}.`,
      `${key} descriptor signature ${rule.descriptor_signature}.`,
      ...synonyms.slice(0, 6).map((synonym) => `${synonym} is treated as a ${rule.opcode} synonym for ${key}.`)
    ],
    languageBridgeLimits.DEFINITION,
    18
  );

  return {
    term: key,
    opcode: clean_text(rule.opcode, 80),
    operation: clean_text(rule.operation, 120),
    pseudocode_descriptor: clean_text(rule.pseudocode_descriptor, languageBridgeLimits.SNIPPET),
    machine_instruction: clean_text(rule.machine_instruction, languageBridgeLimits.SNIPPET),
    descriptor_signature: clean_text(rule.descriptor_signature, languageBridgeLimits.SNIPPET),
    definition_variants,
    synonyms,
    aliases,
    source_refs: unique_strings([source_ref], languageBridgeLimits.SOURCE_ID),
    confidence: Math.max(0, Math.min(1, Number(rule.confidence) || 0.7)),
    updated_at: now_iso()
  };
}

function upsert_machine_descriptor(state, term, source_ref) {
  const key = normalize_machine_term(term);
  if (!key) {
    return "";
  }
  const descriptor = create_machine_descriptor_record(key, source_ref);
  if (!descriptor) {
    return "";
  }
  const machine_descriptor_index = state.machine_descriptor_index || {};
  const current = machine_descriptor_index[key] || {
    term: key,
    opcode: "",
    operation: "",
    pseudocode_descriptor: "",
    machine_instruction: "",
    descriptor_signature: "",
    definition_variants: [],
    synonyms: [],
    aliases: [],
    source_refs: [],
    confidence: 0,
    updated_at: now_iso()
  };
  current.term = descriptor.term;
  current.opcode = descriptor.opcode;
  current.operation = descriptor.operation;
  current.pseudocode_descriptor = descriptor.pseudocode_descriptor;
  current.machine_instruction = descriptor.machine_instruction;
  current.descriptor_signature = descriptor.descriptor_signature;
  current.definition_variants = add_array_values(
    current.definition_variants,
    descriptor.definition_variants,
    languageBridgeLimits.DEFINITION
  ).slice(0, 24);
  current.synonyms = add_array_values(current.synonyms, descriptor.synonyms, languageBridgeLimits.TERM).slice(0, 120);
  current.aliases = add_array_values(current.aliases, descriptor.aliases, languageBridgeLimits.TERM).slice(0, 120);
  current.source_refs = add_array_values(current.source_refs, [source_ref], languageBridgeLimits.SOURCE_ID);
  current.confidence = Math.max(Number(current.confidence || 0), Number(descriptor.confidence || 0));
  current.updated_at = now_iso();
  state.machine_descriptor_index[key] = current;
  return key;
}

function clean_text(value, max_length = languageBridgeLimits.PHRASE) {
  return normalize_service.clean_text(value, max_length);
}

function normalize_spaces(value) {
  return clean_text(value, languageBridgeLimits.PHRASE)
    .replace(languageBridgeRegex.SPACE, " ")
    .trim();
}

function normalize_key(value) {
  return normalize_spaces(value).toLowerCase();
}

function hash_text(value) {
  return crypto.createHash("sha256").update(String(value || ""), "utf8").digest("hex");
}

function clip_snippet(value) {
  return normalize_spaces(value).slice(0, languageBridgeLimits.SNIPPET);
}

function make_source_id(prefix = "bridge") {
  const seed = clean_text(prefix, 30).toLowerCase() || "bridge";
  return `${seed}-${crypto.randomUUID()}`;
}

function to_array(value) {
  return Array.isArray(value) ? value : [];
}

function unique_strings(values, max_length = languageBridgeLimits.TERM) {
  const dedup = [];
  const seen = new Set();
  to_array(values).forEach((raw_value) => {
    const value = clean_text(raw_value, max_length);
    if (!value) {
      return;
    }
    const key = value.toLowerCase();
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    dedup.push(value);
  });
  return dedup;
}

function is_code_identifier(token) {
  if (!token) {
    return false;
  }
  return (
    token.includes("_") ||
    /[a-z][A-Z]/.test(token) ||
    /^[A-Z0-9_]+$/.test(token) ||
    /(util|service|controller|module|index|cache|state|entry|graph|render)/i.test(token)
  );
}

function split_sentences(text) {
  return normalize_spaces(text)
    .split(languageBridgeRegex.SPLIT_SENTENCE)
    .map((part) => normalize_spaces(part))
    .filter(Boolean);
}

function extract_code_tokens(text) {
  const source = String(text || "");
  const values = [];
  const backtick_matches = source.matchAll(languageBridgeRegex.CODE_BACKTICK);
  for (const match of backtick_matches) {
    const token = clean_text(match?.[1], languageBridgeLimits.TERM);
    if (token) {
      values.push(token);
    }
  }
  const identifier_matches = source.match(languageBridgeRegex.IDENTIFIER) || [];
  identifier_matches.forEach((token) => {
    const value = clean_text(token, languageBridgeLimits.TERM);
    if (is_code_identifier(value)) {
      values.push(value);
    }
  });
  return unique_strings(values, languageBridgeLimits.TERM);
}

function extract_pseudocode_phrases(text) {
  return unique_strings(
    split_sentences(text).filter((sentence) => {
      const words = sentence.match(languageBridgeRegex.WORD) || [];
      return words.length >= 4 && languageBridgeRegex.PSEUDO_MARKER.test(sentence);
    }),
    languageBridgeLimits.PHRASE
  );
}

function extract_english_terms(text) {
  const words = String(text || "").match(languageBridgeRegex.WORD) || [];
  const terms = words
    .map((word) => clean_text(word, languageBridgeLimits.TERM).toLowerCase())
    .filter((word) => word.length >= 3 && !LANGUAGE_BRIDGE_STOPWORDS.has(word));
  return unique_strings(terms, languageBridgeLimits.TERM);
}

function extract_english_phrases(text) {
  const phrases = [];
  split_sentences(text).forEach((sentence) => {
    if (languageBridgeRegex.PSEUDO_MARKER.test(sentence)) {
      return;
    }
    const words = sentence
      .match(languageBridgeRegex.WORD)
      ?.map((word) => word.toLowerCase())
      ?.filter((word) => word.length >= 3 && !LANGUAGE_BRIDGE_STOPWORDS.has(word));
    if (!words || words.length < 3) {
      return;
    }
    phrases.push(words.slice(0, 12).join(" "));
  });
  return unique_strings(phrases, languageBridgeLimits.PHRASE);
}

function add_array_values(target, values, max_length) {
  const merged = unique_strings([...(to_array(target) || []), ...to_array(values)], max_length);
  return merged;
}

function upsert_keyword(state, term, kind_tag, source_ref) {
  const normalized = normalize_key(term).slice(0, languageBridgeLimits.TERM);
  if (!normalized) {
    return "";
  }
  const keyword_index = state.keyword_index;
  const current = keyword_index[normalized] || {
    term: clean_text(term, languageBridgeLimits.TERM) || normalized,
    normalized,
    kind_tags: [],
    count: 0,
    variants: [],
    source_refs: []
  };
  current.kind_tags = add_array_values(current.kind_tags, [kind_tag], 30);
  current.count = Math.max(0, Math.floor(Number(current.count) || 0) + 1);
  current.variants = add_array_values(current.variants, [clean_text(term, languageBridgeLimits.TERM)], languageBridgeLimits.TERM);
  current.source_refs = add_array_values(current.source_refs, [source_ref], languageBridgeLimits.SOURCE_ID);
  keyword_index[normalized] = current;
  return normalized;
}

function build_triad_id(code_token, pseudo_phrase, english_phrase) {
  const normalized_seed = `${normalize_key(code_token)}|${normalize_key(pseudo_phrase)}|${normalize_key(english_phrase)}`;
  return hash_text(normalized_seed).slice(0, 24);
}

function build_triads(code_tokens, pseudo_phrases, english_phrases) {
  const triads = [];
  if (code_tokens.length === 0 || pseudo_phrases.length === 0 || english_phrases.length === 0) {
    return triads;
  }
  const max_size = Math.min(
    languageBridgeLimits.TRIAD_LIMIT,
    Math.max(code_tokens.length, pseudo_phrases.length, english_phrases.length)
  );
  for (let index = 0; index < max_size; index += 1) {
    const code_token = code_tokens[index % code_tokens.length];
    const pseudo_phrase = pseudo_phrases[index % pseudo_phrases.length];
    const english_phrase = english_phrases[index % english_phrases.length];
    if (!code_token || !pseudo_phrase || !english_phrase) {
      continue;
    }
    const marker_score = languageBridgeRegex.PSEUDO_MARKER.test(pseudo_phrase) ? 0.2 : 0;
    const confidence = Math.min(
      1,
      0.35 +
        marker_score +
        Math.min(0.2, code_tokens.length * 0.01) +
        Math.min(0.15, english_phrases.length * 0.01) +
        Math.min(0.1, pseudo_phrases.length * 0.01)
    );
    triads.push({
      triad_id: build_triad_id(code_token, pseudo_phrase, english_phrase),
      code_token: clean_text(code_token, languageBridgeLimits.TERM),
      pseudo_phrase: clean_text(pseudo_phrase, languageBridgeLimits.PHRASE),
      english_phrase: clean_text(english_phrase, languageBridgeLimits.PHRASE),
      confidence
    });
  }
  return triads;
}

function upsert_triad(state, triad, source_ref, related_keywords) {
  const triad_id = clean_text(triad?.triad_id, 40);
  if (!triad_id) {
    return "";
  }
  const triad_map = state.triad_map;
  const current = triad_map[triad_id] || {
    code_token: "",
    pseudo_phrase: "",
    english_phrase: "",
    confidence: 0,
    source_refs: [],
    related_keywords: []
  };
  current.code_token = clean_text(triad.code_token, languageBridgeLimits.TERM);
  current.pseudo_phrase = clean_text(triad.pseudo_phrase, languageBridgeLimits.PHRASE);
  current.english_phrase = clean_text(triad.english_phrase, languageBridgeLimits.PHRASE);
  current.confidence = Math.max(0, Math.min(1, Number(triad.confidence) || 0));
  current.source_refs = add_array_values(current.source_refs, [source_ref], languageBridgeLimits.SOURCE_ID);
  current.related_keywords = add_array_values(current.related_keywords, related_keywords, languageBridgeLimits.TERM);
  triad_map[triad_id] = current;
  return triad_id;
}

function upsert_glossary(state, term_key, source_ref, options = {}) {
  const key = normalize_key(term_key).slice(0, languageBridgeLimits.TERM);
  if (!key) {
    return "";
  }
  const current = state.glossary[key] || {
    term: key,
    definition: "",
    aliases: [],
    examples: [],
    related_triads: [],
    source_refs: []
  };
  current.term = clean_text(options.term || current.term || key, languageBridgeLimits.TERM) || key;
  const definition_value =
    clean_text(options.definition, 500) ||
    current.definition ||
    `${current.term} term captured by the code/pseudocode/english bridge index.`;
  current.definition = definition_value;
  const alias_words = ALIAS_MAP.get(key) || [];
  current.aliases = add_array_values(current.aliases, [...alias_words, ...to_array(options.aliases)], languageBridgeLimits.TERM);
  current.examples = add_array_values(current.examples, to_array(options.examples), 260);
  current.related_triads = add_array_values(current.related_triads, to_array(options.related_triads), 40);
  current.source_refs = add_array_values(current.source_refs, [source_ref], languageBridgeLimits.SOURCE_ID);
  state.glossary[key] = current;
  return key;
}

function ensure_entry_link(state, entry_id) {
  const key = clean_text(entry_id, languageBridgeLimits.SOURCE_ID);
  if (!key) {
    return null;
  }
  if (!state.entry_links[key]) {
    state.entry_links[key] = {
      keyword_refs: [],
      triad_refs: [],
      glossary_refs: [],
      descriptor_refs: [],
      updated_at: now_iso()
    };
  }
  return state.entry_links[key];
}

function link_entry_refs(state, entry_ids, keyword_refs, triad_refs, glossary_refs, descriptor_refs) {
  unique_strings(entry_ids, languageBridgeLimits.SOURCE_ID).forEach((entry_id) => {
    const link = ensure_entry_link(state, entry_id);
    if (!link) {
      return;
    }
    link.keyword_refs = add_array_values(link.keyword_refs, keyword_refs, languageBridgeLimits.KEYWORD_REF_MAX);
    link.triad_refs = add_array_values(link.triad_refs, triad_refs, languageBridgeLimits.TRIAD_REF_MAX);
    link.glossary_refs = add_array_values(link.glossary_refs, glossary_refs, languageBridgeLimits.GLOSSARY_REF_MAX);
    link.descriptor_refs = add_array_values(
      link.descriptor_refs,
      descriptor_refs,
      languageBridgeLimits.DESCRIPTOR_REF_MAX
    );
    link.updated_at = now_iso();
  });
}

function set_dictionary_source(state, source_record) {
  const source_id = clean_text(source_record.source_id, languageBridgeLimits.SOURCE_ID);
  if (!source_id) {
    return;
  }
  const rows = state.sources.dictionary_entries;
  const existing_index = rows.findIndex((row) => row.source_id === source_id);
  if (existing_index >= 0) {
    rows[existing_index] = source_record;
    return;
  }
  rows.push(source_record);
}

function build_descriptor_refs_from_text(state, text, source_ref) {
  const descriptor_refs = [];
  extract_machine_terms(text).forEach((word) => {
    const descriptor_ref = upsert_machine_descriptor(state, word, source_ref);
    if (descriptor_ref) {
      descriptor_refs.push(descriptor_ref);
    }
  });
  return unique_strings(descriptor_refs, languageBridgeLimits.DESCRIPTOR_REF_MAX);
}

function process_text_into_artifacts(state, text, source_ref, entry_ids = []) {
  const code_tokens = extract_code_tokens(text);
  const pseudo_phrases = extract_pseudocode_phrases(text);
  const english_terms = extract_english_terms(text);
  const english_phrases = extract_english_phrases(text);

  const keyword_refs = [];
  code_tokens.forEach((term) => {
    const ref = upsert_keyword(state, term, "code", source_ref);
    if (ref) {
      keyword_refs.push(ref);
    }
  });
  pseudo_phrases.forEach((term) => {
    const ref = upsert_keyword(state, term, "pseudo", source_ref);
    if (ref) {
      keyword_refs.push(ref);
    }
  });
  english_terms.forEach((term) => {
    const ref = upsert_keyword(state, term, "english", source_ref);
    if (ref) {
      keyword_refs.push(ref);
    }
  });

  const triad_refs = [];
  const triad_english_pool = english_phrases.length > 0 ? english_phrases : english_terms;
  const triads = build_triads(code_tokens, pseudo_phrases, triad_english_pool);
  triads.forEach((triad) => {
    const ref = upsert_triad(state, triad, source_ref, keyword_refs.slice(0, 8));
    if (ref) {
      triad_refs.push(ref);
    }
  });

  const glossary_refs = [];
  keyword_refs.forEach((keyword_key) => {
    const keyword_record = state.keyword_index[keyword_key];
    if (!keyword_record) {
      return;
    }
    if (keyword_record.count >= 2) {
      const glossary_ref = upsert_glossary(state, keyword_key, source_ref, {
        term: keyword_record.term,
        related_triads: triad_refs.slice(0, 8),
        examples: [clip_snippet(text)]
      });
      if (glossary_ref) {
        glossary_refs.push(glossary_ref);
      }
    }
  });
  triad_refs.forEach((triad_id) => {
    const triad = state.triad_map[triad_id];
    if (!triad || triad.confidence < 0.55) {
      return;
    }
    const english_key = normalize_key(triad.english_phrase).split(" ").slice(0, 4).join(" ");
    const glossary_ref = upsert_glossary(state, english_key, source_ref, {
      term: triad.english_phrase.split(" ").slice(0, 4).join(" "),
      definition: `Mapped from code token "${triad.code_token}" through pseudocode phrase.`,
      related_triads: [triad_id],
      examples: [triad.pseudo_phrase]
    });
    if (glossary_ref) {
      glossary_refs.push(glossary_ref);
    }
  });

  if (glossary_refs.length === 0) {
    keyword_refs.slice(0, 4).forEach((keyword_key) => {
      const keyword_record = state.keyword_index[keyword_key];
      if (!keyword_record) {
        return;
      }
      const glossary_ref = upsert_glossary(state, keyword_key, source_ref, {
        term: keyword_record.term,
        examples: [clip_snippet(text)]
      });
      if (glossary_ref) {
        glossary_refs.push(glossary_ref);
      }
    });
  }

  const descriptor_refs = build_descriptor_refs_from_text(state, text, source_ref);

  link_entry_refs(state, entry_ids, keyword_refs, triad_refs, glossary_refs, descriptor_refs);

  return {
    keyword_refs: unique_strings(keyword_refs, languageBridgeLimits.KEYWORD_REF_MAX),
    triad_refs: unique_strings(triad_refs, languageBridgeLimits.TRIAD_REF_MAX),
    glossary_refs: unique_strings(glossary_refs, languageBridgeLimits.GLOSSARY_REF_MAX),
    descriptor_refs: unique_strings(descriptor_refs, languageBridgeLimits.DESCRIPTOR_REF_MAX)
  };
}

function build_state_stats(state) {
  return {
    source_count: state.sources.chat_turns.length + state.sources.dictionary_entries.length,
    keyword_count: Object.keys(state.keyword_index).length,
    triad_count: Object.keys(state.triad_map).length,
    glossary_count: Object.keys(state.glossary).length,
    machine_descriptor_count: Object.keys(state.machine_descriptor_index || {}).length
  };
}

function to_search_limit(raw_limit) {
  const parsed = Number(raw_limit);
  if (!Number.isFinite(parsed)) {
    return languageBridgeLimits.SEARCH_LIMIT_DEFAULT;
  }
  return Math.max(1, Math.min(languageBridgeLimits.SEARCH_LIMIT_MAX, Math.floor(parsed)));
}

async function load_state_internal() {
  if (typeof languageBridgeIo.load_bridge_state === "function") {
    const loaded = await languageBridgeIo.load_bridge_state();
    return normalize_service.normalize_language_bridge_state(loaded);
  }
  return normalize_service.normalize_language_bridge_state(LANGUAGE_BRIDGE_MEMORY_STATE);
}

async function save_state_internal(state) {
  const normalized = normalize_service.normalize_language_bridge_state({
    ...state,
    updated_at: now_iso(),
    stats: build_state_stats(state)
  });
  if (typeof languageBridgeIo.save_bridge_state === "function") {
    await languageBridgeIo.save_bridge_state(normalized);
    return normalized;
  }
  LANGUAGE_BRIDGE_MEMORY_STATE = normalized;
  return normalized;
}

function inject_language_bridge_repository({ load_bridge_state, save_bridge_state } = {}) {
  languageBridgeIo.load_bridge_state =
    typeof load_bridge_state === "function" ? load_bridge_state : null;
  languageBridgeIo.save_bridge_state =
    typeof save_bridge_state === "function" ? save_bridge_state : null;
}

async function load_bridge_state() {
  return load_state_internal();
}

async function capture_sources(payload = {}) {
  const source = payload && typeof payload === "object" ? payload : {};
  const user_text = clean_text(source.user_text, 20000);
  const assistant_text = clean_text(source.assistant_text, 20000);
  const source_meta = source.source_meta && typeof source.source_meta === "object" ? source.source_meta : {};
  const source_id = clean_text(source_meta.source_id, languageBridgeLimits.SOURCE_ID) || make_source_id("chat");
  const entry_ids = unique_strings(source_meta.entry_ids, languageBridgeLimits.SOURCE_ID);
  const dictionary_entries = to_array(source.dictionary_entries);
  const joined_text = normalize_spaces(`${user_text}\n${assistant_text}`);

  const state = await load_state_internal();
  const artifacts = process_text_into_artifacts(state, joined_text, source_id, entry_ids);

  state.sources.chat_turns.push({
    source_id,
    created_at: now_iso(),
    snippet_user: clip_snippet(user_text),
    snippet_assistant: clip_snippet(assistant_text),
    content_hash_user: hash_text(user_text),
    content_hash_assistant: hash_text(assistant_text),
    artifact_refs: {
      keywords: artifacts.keyword_refs,
      triads: artifacts.triad_refs,
      glossary: artifacts.glossary_refs,
      descriptors: artifacts.descriptor_refs
    },
    links: {
      entry_ids
    }
  });

  if (dictionary_entries.length > 0) {
    for (let index = 0; index < dictionary_entries.length; index += 1) {
      const entry = dictionary_entries[index] && typeof dictionary_entries[index] === "object" ? dictionary_entries[index] : {};
      const entry_id = clean_text(entry.id, languageBridgeLimits.SOURCE_ID);
      if (!entry_id) {
        continue;
      }
      const entry_text = normalize_spaces(
        `${entry.word || ""}\n${entry.definition || ""}\n${to_array(entry.labels).join(" ")}\n${entry.mode || ""}\n${entry.language || ""}`
      );
      const entry_artifacts = process_text_into_artifacts(state, entry_text, entry_id, [entry_id]);
      set_dictionary_source(state, {
        source_id: entry_id,
        created_at: now_iso(),
        snippet_definition: clip_snippet(String(entry.definition || "")),
        content_hash: hash_text(entry_text),
        artifact_refs: {
          keywords: entry_artifacts.keyword_refs,
          triads: entry_artifacts.triad_refs,
          glossary: entry_artifacts.glossary_refs,
          descriptors: entry_artifacts.descriptor_refs
        },
        links: {
          entry_ids: [entry_id]
        }
      });
    }
  }

  const saved = await save_state_internal(state);
  return {
    ok: true,
    source_id,
    keyword_refs: artifacts.keyword_refs,
    triad_refs: artifacts.triad_refs,
    glossary_refs: artifacts.glossary_refs,
    descriptor_refs: artifacts.descriptor_refs,
    stats: saved.stats
  };
}

async function index_dictionary_entries(entries = [], source_meta = {}) {
  const source_entries = to_array(entries);
  const meta = source_meta && typeof source_meta === "object" ? source_meta : {};
  const state = await load_state_internal();

  let indexed_count = 0;
  for (let index = 0; index < source_entries.length; index += 1) {
    const entry = source_entries[index] && typeof source_entries[index] === "object" ? source_entries[index] : {};
    const entry_id = clean_text(entry.id, languageBridgeLimits.SOURCE_ID);
    if (!entry_id) {
      continue;
    }
    const source_ref = clean_text(meta.source_id, languageBridgeLimits.SOURCE_ID) || entry_id;
    const entry_text = normalize_spaces(
      `${entry.word || ""}\n${entry.definition || ""}\n${to_array(entry.labels).join(" ")}\n${entry.mode || ""}\n${entry.language || ""}`
    );
    const artifacts = process_text_into_artifacts(state, entry_text, source_ref, [entry_id]);
    set_dictionary_source(state, {
      source_id: entry_id,
      created_at: now_iso(),
      snippet_definition: clip_snippet(String(entry.definition || "")),
      content_hash: hash_text(entry_text),
      artifact_refs: {
        keywords: artifacts.keyword_refs,
        triads: artifacts.triad_refs,
        glossary: artifacts.glossary_refs,
        descriptors: artifacts.descriptor_refs
      },
      links: {
        entry_ids: [entry_id]
      }
    });
    indexed_count += 1;
  }

  const saved = await save_state_internal(state);
  return {
    ok: true,
    indexed_count,
    stats: saved.stats
  };
}

async function compile_machine_descriptors(payload = {}) {
  const source = payload && typeof payload === "object" ? payload : {};
  const source_meta = source.source_meta && typeof source.source_meta === "object" ? source.source_meta : {};
  const source_id = clean_text(source_meta.source_id, languageBridgeLimits.SOURCE_ID) || make_source_id("descriptor");
  const entry_ids = unique_strings(source_meta.entry_ids, languageBridgeLimits.SOURCE_ID);
  const dictionary_entries = to_array(source.dictionary_entries);
  const text_input = normalize_spaces(source.text || source.user_text || source.assistant_text || "");

  const state = await load_state_internal();
  const descriptor_refs = [];

  if (text_input) {
    descriptor_refs.push(...build_descriptor_refs_from_text(state, text_input, source_id));
  }

  for (let index = 0; index < dictionary_entries.length; index += 1) {
    const entry = dictionary_entries[index] && typeof dictionary_entries[index] === "object" ? dictionary_entries[index] : {};
    const entry_id = clean_text(entry.id, languageBridgeLimits.SOURCE_ID) || make_source_id("entry");
    const entry_text = normalize_spaces(
      `${entry.word || ""}\n${entry.definition || ""}\n${to_array(entry.labels).join(" ")}\n${entry.mode || ""}\n${entry.language || ""}`
    );
    if (!entry_text) {
      continue;
    }
    descriptor_refs.push(...build_descriptor_refs_from_text(state, entry_text, entry_id));
    if (!entry_ids.includes(entry_id)) {
      entry_ids.push(entry_id);
    }
  }

  const normalized_descriptor_refs = unique_strings(
    descriptor_refs,
    languageBridgeLimits.DESCRIPTOR_REF_MAX
  );
  link_entry_refs(state, entry_ids, [], [], [], normalized_descriptor_refs);

  const saved = await save_state_internal(state);
  return {
    ok: true,
    source_id,
    descriptor_count: normalized_descriptor_refs.length,
    descriptor_refs: normalized_descriptor_refs,
    stats: saved.stats
  };
}

function rank_and_limit_results(rows, limit) {
  return rows
    .sort((left, right) => {
      const score_delta = Number(right.score || 0) - Number(left.score || 0);
      if (score_delta !== 0) {
        return score_delta;
      }
      return String(left.key || "").localeCompare(String(right.key || ""));
    })
    .slice(0, limit)
    .map(({ score: _score, ...rest }) => rest);
}

async function search_keyword(query, options = {}) {
  const q = normalize_key(query).slice(0, languageBridgeLimits.TERM);
  const limit = to_search_limit(options?.limit);
  if (!q) {
    return { ok: true, query: "", results: [] };
  }
  const state = await load_state_internal();
  const rows = [];
  Object.entries(state.keyword_index).forEach(([key, value]) => {
    const term = String(value?.term || "");
    const normalized = String(value?.normalized || key);
    let score = 0;
    if (normalized === q) {
      score = 1;
    } else if (normalized.startsWith(q)) {
      score = 0.8;
    } else if (normalized.includes(q)) {
      score = 0.55;
    } else if (term.toLowerCase().includes(q)) {
      score = 0.45;
    }
    if (score > 0) {
      rows.push({
        score,
        key,
        ...value
      });
    }
  });

  return {
    ok: true,
    query: q,
    results: rank_and_limit_results(rows, limit)
  };
}

async function search_triad(query, options = {}) {
  const q = normalize_key(query).slice(0, languageBridgeLimits.PHRASE);
  const limit = to_search_limit(options?.limit);
  if (!q) {
    return { ok: true, query: "", results: [] };
  }
  const state = await load_state_internal();
  const rows = [];
  Object.entries(state.triad_map).forEach(([triad_id, triad]) => {
    const code = String(triad?.code_token || "").toLowerCase();
    const pseudo = String(triad?.pseudo_phrase || "").toLowerCase();
    const english = String(triad?.english_phrase || "").toLowerCase();
    let score = 0;
    if (code === q || pseudo === q || english === q) {
      score = 1;
    } else if (code.includes(q)) {
      score = 0.82;
    } else if (pseudo.includes(q)) {
      score = 0.72;
    } else if (english.includes(q)) {
      score = 0.62;
    }
    if (score > 0) {
      rows.push({
        score,
        triad_id,
        ...triad
      });
    }
  });
  return {
    ok: true,
    query: q,
    results: rank_and_limit_results(rows, limit)
  };
}

async function search_glossary(query, options = {}) {
  const q = normalize_key(query).slice(0, languageBridgeLimits.TERM);
  const limit = to_search_limit(options?.limit);
  if (!q) {
    return { ok: true, query: "", results: [] };
  }
  const state = await load_state_internal();
  const rows = [];
  Object.entries(state.glossary).forEach(([key, glossary]) => {
    const term = String(glossary?.term || "").toLowerCase();
    const aliases = to_array(glossary?.aliases).map((alias) => String(alias || "").toLowerCase());
    let score = 0;
    if (key === q || term === q) {
      score = 1;
    } else if (key.startsWith(q) || term.startsWith(q)) {
      score = 0.8;
    } else if (key.includes(q) || term.includes(q) || aliases.some((alias) => alias.includes(q))) {
      score = 0.6;
    }
    if (score > 0) {
      rows.push({
        score,
        key,
        ...glossary
      });
    }
  });
  return {
    ok: true,
    query: q,
    results: rank_and_limit_results(rows, limit)
  };
}

async function search_machine_descriptor(query, options = {}) {
  const q = normalize_key(query).slice(0, languageBridgeLimits.TERM);
  const limit = to_search_limit(options?.limit);
  if (!q) {
    return { ok: true, query: "", results: [] };
  }
  const state = await load_state_internal();
  const rows = [];
  Object.entries(state.machine_descriptor_index || {}).forEach(([key, descriptor]) => {
    const term = String(descriptor?.term || "").toLowerCase();
    const opcode = String(descriptor?.opcode || "").toLowerCase();
    const operation = String(descriptor?.operation || "").toLowerCase();
    const signature = String(descriptor?.descriptor_signature || "").toLowerCase();
    const synonyms = to_array(descriptor?.synonyms).map((value) => String(value || "").toLowerCase());
    const aliases = to_array(descriptor?.aliases).map((value) => String(value || "").toLowerCase());
    let score = 0;
    if (key === q || term === q) {
      score = 1;
    } else if (key.startsWith(q) || term.startsWith(q)) {
      score = 0.82;
    } else if (
      key.includes(q) ||
      term.includes(q) ||
      opcode.includes(q) ||
      operation.includes(q) ||
      signature.includes(q) ||
      synonyms.some((value) => value.includes(q)) ||
      aliases.some((value) => value.includes(q))
    ) {
      score = 0.62;
    }
    if (score > 0) {
      rows.push({
        score,
        key,
        ...descriptor
      });
    }
  });
  return {
    ok: true,
    query: q,
    results: rank_and_limit_results(rows, limit)
  };
}

async function link_entry_artifacts(entry_id, artifact_refs = {}) {
  const entry_key = clean_text(entry_id, languageBridgeLimits.SOURCE_ID);
  if (!entry_key) {
    return {
      ok: false,
      error: "entry_id is required"
    };
  }
  const state = await load_state_internal();
  link_entry_refs(
    state,
    [entry_key],
    unique_strings(artifact_refs.keywords, languageBridgeLimits.KEYWORD_REF_MAX),
    unique_strings(artifact_refs.triads, languageBridgeLimits.TRIAD_REF_MAX),
    unique_strings(artifact_refs.glossary, languageBridgeLimits.GLOSSARY_REF_MAX),
    unique_strings(artifact_refs.descriptors, languageBridgeLimits.DESCRIPTOR_REF_MAX)
  );
  const saved = await save_state_internal(state);
  return {
    ok: true,
    entry_id: entry_key,
    entry_link: saved.entry_links[entry_key] || null
  };
}

const languageBridgeServiceApi = Object.freeze({
  inject_language_bridge_repository,
  load_bridge_state,
  capture_sources,
  index_dictionary_entries,
  compile_machine_descriptors,
  search_keyword,
  search_triad,
  search_glossary,
  search_machine_descriptor,
  link_entry_artifacts
});

module.exports = languageBridgeServiceApi;
