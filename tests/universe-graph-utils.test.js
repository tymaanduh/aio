const test = require("node:test");
const assert = require("node:assert/strict");

const {
  getNodeWordLower,
  buildGraphCacheToken,
  buildIndexFlags,
  computeHighlightState,
  computeAdjacencyState,
  findPathIndices
} = require("../brain/modules/universe-graph-utils.js");

test("buildGraphCacheToken trims and caps cache key text", () => {
  assert.equal(buildGraphCacheToken("  abcdef  ", 4), "abcd");
  assert.equal(buildGraphCacheToken(null, 10), "");
});

test("buildIndexFlags maps iterable indices to typed flags", () => {
  const flags = buildIndexFlags(6, [0, 2, "3", -1, 9, "x"]);
  assert.deepEqual(Array.from(flags), [1, 0, 1, 1, 0, 0]);
});

test("getNodeWordLower normalizes and caches lowercase node words", () => {
  const node = { word: "  Alpha  " };
  assert.equal(getNodeWordLower(node, 120), "alpha");
  assert.equal(node.wordLower, "alpha");
  node.wordLower = " BETA ";
  assert.equal(getNodeWordLower(node, 120), "beta");
});

test("computeHighlightState computes highlights and reuses cached state", () => {
  const nodes = [{ word: "Alpha" }, { word: "Beta" }, { word: "Gamma" }, { word: "Echo" }];
  const first = computeHighlightState({
    nodes,
    filterLower: "a",
    graphCacheKey: "model-key",
    previousFlags: new Uint8Array(0),
    previousCount: 0,
    previousCacheKey: "",
    maxWordLength: 120
  });
  assert.equal(first.count, 3);
  assert.deepEqual(Array.from(first.flags), [1, 1, 1, 0]);

  const second = computeHighlightState({
    nodes,
    filterLower: "a",
    graphCacheKey: "model-key",
    previousFlags: first.flags,
    previousCount: first.count,
    previousCacheKey: first.cacheKey,
    maxWordLength: 120
  });
  assert.equal(second.flags, first.flags);
  assert.equal(second.count, first.count);
  assert.equal(second.cacheKey, first.cacheKey);

  const cleared = computeHighlightState({
    nodes,
    filterLower: "",
    graphCacheKey: "model-key",
    previousFlags: first.flags,
    previousCount: first.count,
    previousCacheKey: first.cacheKey,
    maxWordLength: 120
  });
  assert.equal(cleared.count, 0);
  assert.equal(cleared.cacheKey, "");
  assert.equal(cleared.flags.length, nodes.length);
});

test("computeAdjacencyState and findPathIndices produce expected graph paths", () => {
  const nodes = [{}, {}, {}, {}];
  const edges = [
    { a: 0, b: 1 },
    { a: 1, b: 2 },
    { a: 2, b: 3 },
    { a: 9, b: 1 },
    { a: 0, b: 0 }
  ];
  const first = computeAdjacencyState({
    nodes,
    edges,
    graphCacheKey: "k",
    previousAdjacency: [],
    previousCacheKey: ""
  });
  assert.deepEqual(first.adjacency, [[1], [0, 2], [1, 3], [2]]);

  const cached = computeAdjacencyState({
    nodes,
    edges,
    graphCacheKey: "k",
    previousAdjacency: first.adjacency,
    previousCacheKey: first.cacheKey
  });
  assert.equal(cached.adjacency, first.adjacency);

  assert.deepEqual(findPathIndices(0, 3, nodes.length, first.adjacency), [0, 1, 2, 3]);
  assert.deepEqual(findPathIndices(3, 0, nodes.length, first.adjacency), [3, 2, 1, 0]);
  assert.deepEqual(findPathIndices(0, 9, nodes.length, first.adjacency), []);
});
