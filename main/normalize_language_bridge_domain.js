"use strict";

const crypto = require("crypto");
const { now_iso, cleanText, to_source_object } = require("./normalize_core.js");

const LANGUAGE_BRIDGE_DEFAULTS = Object.freeze({
  VERSION: 1
});

const LANGUAGE_BRIDGE_LIMITS = Object.freeze({
  SOURCE_ID: 160,
  SNIPPET: 400,
  TERM: 120,
  DEFINITION: 500,
  EXAMPLE: 260,
  KEYWORD_REF_MAX: 120,
  TRIAD_REF_MAX: 120,
  GLOSSARY_REF_MAX: 120
});

function normalize_string_list(list, max_length, max_items = 5000) {
  const source = Array.isArray(list) ? list : [];
  const normalized = [];
  const seen = new Set();
  for (let index = 0; index < source.length; index += 1) {
    const value = cleanText(source[index], max_length);
    if (!value) {
      continue;
    }
    const key = value.toLowerCase();
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    normalized.push(value);
    if (normalized.length >= max_items) {
      break;
    }
  }
  return normalized;
}

function normalize_source_entry(raw_source) {
  const source = to_source_object(raw_source, {});
  return {
    source_id: cleanText(source.source_id, LANGUAGE_BRIDGE_LIMITS.SOURCE_ID) || crypto.randomUUID(),
    created_at: cleanText(source.created_at, 80) || now_iso(),
    snippet_user: cleanText(source.snippet_user, LANGUAGE_BRIDGE_LIMITS.SNIPPET),
    snippet_assistant: cleanText(source.snippet_assistant, LANGUAGE_BRIDGE_LIMITS.SNIPPET),
    snippet_definition: cleanText(source.snippet_definition, LANGUAGE_BRIDGE_LIMITS.SNIPPET),
    content_hash_user: cleanText(source.content_hash_user, 128),
    content_hash_assistant: cleanText(source.content_hash_assistant, 128),
    content_hash: cleanText(source.content_hash, 128),
    artifact_refs: {
      keywords: normalize_string_list(
        source?.artifact_refs?.keywords,
        LANGUAGE_BRIDGE_LIMITS.KEYWORD_REF_MAX
      ),
      triads: normalize_string_list(source?.artifact_refs?.triads, LANGUAGE_BRIDGE_LIMITS.TRIAD_REF_MAX),
      glossary: normalize_string_list(
        source?.artifact_refs?.glossary,
        LANGUAGE_BRIDGE_LIMITS.GLOSSARY_REF_MAX
      )
    },
    links: {
      entry_ids: normalize_string_list(source?.links?.entry_ids, LANGUAGE_BRIDGE_LIMITS.SOURCE_ID)
    }
  };
}

function normalize_keyword_index(keyword_index_raw) {
  const source = to_source_object(keyword_index_raw, {});
  const normalized = {};
  Object.entries(source).forEach(([raw_key, raw_value]) => {
    const key = cleanText(raw_key, LANGUAGE_BRIDGE_LIMITS.TERM).toLowerCase();
    if (!key) {
      return;
    }
    const value = to_source_object(raw_value, {});
    normalized[key] = {
      term: cleanText(value.term, LANGUAGE_BRIDGE_LIMITS.TERM) || key,
      normalized: key,
      kind_tags: normalize_string_list(value.kind_tags, 30),
      count: Math.max(0, Math.floor(Number(value.count) || 0)),
      variants: normalize_string_list(value.variants, LANGUAGE_BRIDGE_LIMITS.TERM),
      source_refs: normalize_string_list(value.source_refs, LANGUAGE_BRIDGE_LIMITS.SOURCE_ID)
    };
  });
  return normalized;
}

function normalize_triad_map(triad_map_raw) {
  const source = to_source_object(triad_map_raw, {});
  const normalized = {};
  Object.entries(source).forEach(([raw_key, raw_value]) => {
    const key = cleanText(raw_key, 160);
    if (!key) {
      return;
    }
    const value = to_source_object(raw_value, {});
    normalized[key] = {
      code_token: cleanText(value.code_token, LANGUAGE_BRIDGE_LIMITS.TERM),
      pseudo_phrase: cleanText(value.pseudo_phrase, LANGUAGE_BRIDGE_LIMITS.SNIPPET),
      english_phrase: cleanText(value.english_phrase, LANGUAGE_BRIDGE_LIMITS.SNIPPET),
      confidence: Math.max(0, Math.min(1, Number(value.confidence) || 0)),
      source_refs: normalize_string_list(value.source_refs, LANGUAGE_BRIDGE_LIMITS.SOURCE_ID),
      related_keywords: normalize_string_list(value.related_keywords, LANGUAGE_BRIDGE_LIMITS.TERM)
    };
  });
  return normalized;
}

function normalize_glossary(glossary_raw) {
  const source = to_source_object(glossary_raw, {});
  const normalized = {};
  Object.entries(source).forEach(([raw_key, raw_value]) => {
    const key = cleanText(raw_key, LANGUAGE_BRIDGE_LIMITS.TERM).toLowerCase();
    if (!key) {
      return;
    }
    const value = to_source_object(raw_value, {});
    normalized[key] = {
      term: cleanText(value.term, LANGUAGE_BRIDGE_LIMITS.TERM) || key,
      definition: cleanText(value.definition, LANGUAGE_BRIDGE_LIMITS.DEFINITION),
      aliases: normalize_string_list(value.aliases, LANGUAGE_BRIDGE_LIMITS.TERM),
      examples: normalize_string_list(value.examples, LANGUAGE_BRIDGE_LIMITS.EXAMPLE),
      related_triads: normalize_string_list(value.related_triads, 160),
      source_refs: normalize_string_list(value.source_refs, LANGUAGE_BRIDGE_LIMITS.SOURCE_ID)
    };
  });
  return normalized;
}

function normalize_entry_links(entry_links_raw) {
  const source = to_source_object(entry_links_raw, {});
  const normalized = {};
  Object.entries(source).forEach(([raw_key, raw_value]) => {
    const key = cleanText(raw_key, LANGUAGE_BRIDGE_LIMITS.SOURCE_ID);
    if (!key) {
      return;
    }
    const value = to_source_object(raw_value, {});
    normalized[key] = {
      keyword_refs: normalize_string_list(value.keyword_refs, LANGUAGE_BRIDGE_LIMITS.KEYWORD_REF_MAX),
      triad_refs: normalize_string_list(value.triad_refs, LANGUAGE_BRIDGE_LIMITS.TRIAD_REF_MAX),
      glossary_refs: normalize_string_list(value.glossary_refs, LANGUAGE_BRIDGE_LIMITS.GLOSSARY_REF_MAX),
      updated_at: cleanText(value.updated_at, 80) || now_iso()
    };
  });
  return normalized;
}

function create_default_language_bridge_state() {
  return {
    version: LANGUAGE_BRIDGE_DEFAULTS.VERSION,
    updated_at: now_iso(),
    stats: {
      source_count: 0,
      keyword_count: 0,
      triad_count: 0,
      glossary_count: 0
    },
    sources: {
      chat_turns: [],
      dictionary_entries: []
    },
    keyword_index: {},
    triad_map: {},
    glossary: {},
    entry_links: {}
  };
}

function normalize_language_bridge_state(raw_state) {
  const fallback = create_default_language_bridge_state();
  const state = to_source_object(raw_state, fallback);
  const chat_turns = (Array.isArray(state?.sources?.chat_turns) ? state.sources.chat_turns : []).map(
    normalize_source_entry
  );
  const dictionary_entries = (
    Array.isArray(state?.sources?.dictionary_entries) ? state.sources.dictionary_entries : []
  ).map(normalize_source_entry);
  const keyword_index = normalize_keyword_index(state.keyword_index);
  const triad_map = normalize_triad_map(state.triad_map);
  const glossary = normalize_glossary(state.glossary);
  const entry_links = normalize_entry_links(state.entry_links);

  return {
    version: LANGUAGE_BRIDGE_DEFAULTS.VERSION,
    updated_at: cleanText(state.updated_at, 80) || now_iso(),
    stats: {
      source_count: chat_turns.length + dictionary_entries.length,
      keyword_count: Object.keys(keyword_index).length,
      triad_count: Object.keys(triad_map).length,
      glossary_count: Object.keys(glossary).length
    },
    sources: {
      chat_turns,
      dictionary_entries
    },
    keyword_index,
    triad_map,
    glossary,
    entry_links
  };
}

module.exports = {
  LANGUAGE_BRIDGE_DEFAULTS,
  LANGUAGE_BRIDGE_LIMITS,
  create_default_language_bridge_state,
  normalize_language_bridge_state
};
