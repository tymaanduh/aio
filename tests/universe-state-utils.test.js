const test = require("node:test");
const assert = require("node:assert/strict");

const { createUniverseStateTools } = require("../brain/modules/universe-state-utils.js");

function createTools() {
  return createUniverseStateTools({
    minWordLength: 3,
    maxWordLength: 24,
    maxNodes: 1200,
    maxEdges: 9000,
    zoomMin: 0.5,
    zoomMax: 4,
    colorModeQuestion: "question",
    colorModePos: "pos",
    colorModeMode: "mode",
    viewModeCanvas: "canvas",
    viewModeWebgl: "webgl",
    bookmarkLimit: 2,
    maxWord: 120,
    maxLabel: 80,
    maxDate: 64,
    createUuid: () => "uuid-fixed",
    nowIso: () => "2026-03-03T00:00:00.000Z"
  });
}

test("universe state tools normalize config and keep at least one edge mode", () => {
  const tools = createTools();
  const config = tools.normalizeConfig({
    minWordLength: 1,
    maxWordLength: 200,
    edgeModes: {
      contains: false,
      prefix: false,
      suffix: false,
      stem: false,
      sameLabel: false
    },
    colorMode: "invalid",
    renderMode: "canvas"
  });

  assert.equal(config.minWordLength, 2);
  assert.equal(config.maxWordLength, 48);
  assert.equal(config.edgeModes.contains, true);
  assert.equal(config.colorMode, "question");
  assert.equal(config.renderMode, "canvas");
});

test("universe state tools normalize custom sets and bookmarks", () => {
  const tools = createTools();
  const sets = tools.normalizeUniverseCustomSearchSets([
    {
      id: "",
      name: "",
      entryIds: ["a", "a", "b"],
      words: [" Alpha ", "alpha", "beta"]
    }
  ]);
  assert.equal(sets.length, 1);
  assert.equal(sets[0].id, "uuid-fixed");
  assert.deepEqual(sets[0].entryIds, ["a", "b"]);
  assert.deepEqual(sets[0].words, ["alpha", "beta"]);

  const config = tools.normalizeConfig({
    bookmarks: [{ name: "", panX: 4, panY: -4, zoom: 9 }, { name: "B" }, { name: "C" }]
  });
  assert.equal(config.bookmarks.length, 2);
  assert.equal(config.bookmarks[0].name, "View 1");
  assert.equal(config.bookmarks[0].zoom, 4);
  assert.equal(config.bookmarks[0].createdAt, "2026-03-03T00:00:00.000Z");
});

test("universe dataset signature changes when active entry changes", () => {
  const tools = createTools();
  const entriesA = [{ id: "1", word: "Alpha", mode: "definition", labels: ["What"], usageCount: 1, favorite: false }];
  const entriesB = [{ id: "1", word: "Alpha", mode: "definition", labels: ["What"], usageCount: 2, favorite: false }];
  const sigA = tools.getUniverseDatasetSignature(entriesA);
  const sigB = tools.getUniverseDatasetSignature(entriesB);
  assert.notEqual(sigA, sigB);
});

test("normalizeUniverseGraph filters invalid edges and infers question buckets", () => {
  const tools = createTools();
  const graph = tools.normalizeUniverseGraph({
    nodes: [
      { id: "n1", word: "Alpha", labels: ["Who"], x: 9, y: -9 },
      { id: "n2", word: "Beta", labels: ["Where"] }
    ],
    edges: [
      { a: 0, b: 1, modes: ["prefix", "prefix"] },
      { a: 1, b: 0, modes: ["contains"] },
      { a: 0, b: 0 }
    ]
  });

  assert.equal(graph.nodes.length, 2);
  assert.equal(graph.nodes[0].questionBucket, "who");
  assert.equal(graph.nodes[0].x, 4);
  assert.equal(graph.nodes[0].y, -4);
  assert.equal(graph.edges.length, 1);
  assert.deepEqual(graph.edges[0].modes, ["prefix"]);
});
