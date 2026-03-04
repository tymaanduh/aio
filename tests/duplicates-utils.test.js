const test = require("node:test");
const assert = require("node:assert/strict");

const { buildNearDuplicateCluster } = require("../brain/modules/duplicates-utils.js");

test("near duplicate cluster returns similar words", () => {
  const entries = [
    { id: "1", word: "connect" },
    { id: "2", word: "connection" },
    { id: "3", word: "connector" },
    { id: "4", word: "banana" }
  ];
  const cluster = buildNearDuplicateCluster(entries, "connect", { excludeId: "1", limit: 8 });
  const words = cluster.map((item) => item.word);
  assert.equal(words.includes("connection"), true);
  assert.equal(words.includes("connector"), true);
  assert.equal(words.includes("banana"), false);
});
