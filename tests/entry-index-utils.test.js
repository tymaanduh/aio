const test = require("node:test");
const assert = require("node:assert/strict");

const { buildWordPrefixIndex } = require("../brain/modules/indexing-utils.js");
const { createEntryIndexTools } = require("../brain/modules/entry-index-utils.js");

const { buildEntriesIndex } = createEntryIndexTools({
  buildWordPrefixIndex,
  isPartOfSpeechLabel: (value) => ["noun", "verb", "adjective", "adverb", "pronoun"].includes(value),
  maxWord: 120,
  maxLabel: 80
});

test("buildEntriesIndex creates label and word maps with active counts", () => {
  const labels = ["noun", "tech"];
  const entries = [
    { id: "1", word: "Alpha", labels: ["noun", "tech"], archivedAt: null },
    { id: "2", word: "Beta", labels: [], archivedAt: "2026-03-01T00:00:00.000Z" },
    { id: "3", word: "Gamma", labels: ["verb"], archivedAt: null }
  ];

  const idx = buildEntriesIndex(labels, entries);
  assert.equal(idx.byId.get("1").word, "Alpha");
  assert.equal(idx.byWordLower.get("alpha").id, "1");
  assert.equal(idx.activeEntriesCount, 2);
  assert.equal(idx.unlabeled.length, 1);
  assert.equal(idx.unlabeledActive.length, 0);
  assert.equal(idx.byLabel.get("tech").length, 1);
  assert.equal(idx.byLabel.get("verb").length, 1);
  assert.equal(idx.labelCounts.tech, 1);
  assert.equal(idx.posIndex.noun.length, 1);
  assert.equal(Array.isArray(idx.wordPrefixIndex.get("alp")), true);
});
