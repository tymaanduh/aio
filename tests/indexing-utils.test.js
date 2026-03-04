const test = require("node:test");
const assert = require("node:assert/strict");

const { buildWordPrefixIndex } = require("../brain/modules/indexing-utils.js");

test("word prefix index groups by first 3 letters", () => {
  const entries = [
    { id: "1", word: "alpha" },
    { id: "2", word: "alphabet" },
    { id: "3", word: "beta" }
  ];
  const index = buildWordPrefixIndex(entries);
  assert.equal(Array.isArray(index.get("alp")), true);
  assert.equal(index.get("alp").length, 2);
  assert.equal(index.get("bet").length, 1);
});
