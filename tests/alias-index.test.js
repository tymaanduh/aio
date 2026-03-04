const test = require("node:test");
const assert = require("node:assert/strict");

const { ALIAS_WORD_INDEX, createAliasMap, getAliasWords } = require("../brain/modules/alias-index.js");

test("alias index is array-first and includes core mappings", () => {
  assert.equal(Array.isArray(ALIAS_WORD_INDEX), true);
  const map = createAliasMap(ALIAS_WORD_INDEX);
  assert.deepEqual(map.get("pg"), ["page"]);
  assert.deepEqual(map.get("app"), ["application"]);
  assert.deepEqual(map.get("rt"), ["runtime"]);
});

test("getAliasWords resolves aliases case-insensitively", () => {
  const map = createAliasMap(ALIAS_WORD_INDEX);
  assert.deepEqual(getAliasWords("PG", map), ["page"]);
  assert.deepEqual(getAliasWords("unknown", map), []);
});
