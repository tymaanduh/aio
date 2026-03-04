const test = require("node:test");
const assert = require("node:assert/strict");

const normalize_service = require("../main/services/normalize_service.js");
const language_bridge_service = require("../main/services/language_bridge_service.js");

function create_memory_bridge_repository(seed_state = null) {
  let state = seed_state || normalize_service.create_default_language_bridge_state();
  return {
    async load_bridge_state() {
      return state;
    },
    async save_bridge_state(next_state) {
      state = next_state;
      return state;
    },
    get_state() {
      return state;
    }
  };
}

test("capture_sources stores chat artifacts and creates keyword/triad/glossary records", async () => {
  const repository = create_memory_bridge_repository();
  language_bridge_service.inject_language_bridge_repository(repository);

  const result = await language_bridge_service.capture_sources({
    user_text: "Use `saveEntryFromForm` when input is valid then set state and return saved entry.",
    assistant_text: "If entry is valid then call save state and return success."
  });

  assert.equal(result.ok, true);
  const state = repository.get_state();
  assert.equal(state.sources.chat_turns.length, 1);
  assert.ok(Object.keys(state.keyword_index).length > 0);
  assert.ok(Object.keys(state.triad_map).length > 0);
  assert.ok(Object.keys(state.glossary).length > 0);
});

test("index_dictionary_entries links artifacts to entry IDs and supports searches", async () => {
  const repository = create_memory_bridge_repository();
  language_bridge_service.inject_language_bridge_repository(repository);

  const index_result = await language_bridge_service.index_dictionary_entries(
    [
      {
        id: "entry-1",
        word: "Autosave",
        definition: "If a word and definition are present then set save state and return.",
        labels: ["What", "verb"],
        mode: "definition",
        language: "english"
      }
    ],
    { source_id: "dictionary_save" }
  );

  assert.equal(index_result.ok, true);
  assert.equal(index_result.indexed_count, 1);

  const state = repository.get_state();
  assert.equal(state.sources.dictionary_entries.length, 1);
  assert.ok(state.entry_links["entry-1"]);

  const keyword_results = await language_bridge_service.search_keyword("autosave");
  assert.equal(keyword_results.ok, true);
  assert.ok(keyword_results.results.length > 0);

  const triad_results = await language_bridge_service.search_triad("set save state");
  assert.equal(triad_results.ok, true);
  assert.ok(triad_results.results.length > 0);

  const glossary_keys = Object.keys(state.glossary);
  assert.ok(glossary_keys.length > 0);
  const glossary_results = await language_bridge_service.search_glossary(glossary_keys[0]);
  assert.equal(glossary_results.ok, true);
  assert.ok(glossary_results.results.length > 0);
});

test("link_entry_artifacts merges explicit refs into entry_links", async () => {
  const repository = create_memory_bridge_repository();
  language_bridge_service.inject_language_bridge_repository(repository);

  const result = await language_bridge_service.link_entry_artifacts("entry-2", {
    keywords: ["entry", "save"],
    triads: ["triad-1"],
    glossary: ["save state"]
  });

  assert.equal(result.ok, true);
  assert.equal(result.entry_id, "entry-2");

  const state = repository.get_state();
  const link = state.entry_links["entry-2"];
  assert.ok(link);
  assert.deepEqual(link.keyword_refs.sort(), ["entry", "save"]);
  assert.deepEqual(link.triad_refs, ["triad-1"]);
  assert.deepEqual(link.glossary_refs, ["save state"]);
});
