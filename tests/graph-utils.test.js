const test = require("node:test");
const assert = require("node:assert/strict");

const { buildGraphIndex } = require("../brain/modules/graph-utils.js");

test("graph index maps links and nodes", () => {
  const nodes = [
    { id: "a", word: "hello", entryId: "e1" },
    { id: "b", word: "world", entryId: "e2" }
  ];
  const links = [{ id: "l1", fromNodeId: "a", toNodeId: "b" }];

  const index = buildGraphIndex(nodes, links);

  assert.equal(index.nodeById.get("a").word, "hello");
  assert.deepEqual(index.outgoingIdsByNodeId.get("a"), ["b"]);
  assert.deepEqual(index.incomingIdsByNodeId.get("b"), ["a"]);
  assert.equal(index.linkKeySet.has("a->b"), true);
  assert.equal(Array.isArray(index.linkedTargetsByWordLower.get("hello")), true);
  assert.equal(index.linkedEntryIds.has("e1"), true);
  assert.equal(index.backlinkCountByEntryId.get("e1"), 1);
});
