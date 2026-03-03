const test = require("node:test");
const assert = require("node:assert/strict");

const { createStateStore } = require("../app/modules/store.js");

test("store typed mutations trigger hooks", () => {
  const state = {
    labels: [],
    entries: [],
    sentenceGraph: { nodes: [], links: [] }
  };

  let entriesMutations = 0;
  let graphMutations = 0;
  const store = createStateStore(state, {
    onEntriesMutation: () => {
      entriesMutations += 1;
    },
    onGraphMutation: () => {
      graphMutations += 1;
    }
  });

  store.addLabel("noun");
  store.addEntry({ id: "e1", word: "alpha", labels: ["noun"] });
  store.updateEntryById("e1", (entry) => ({ ...entry, word: "beta" }));
  store.removeEntryById("e1");

  store.addGraphNode({ id: "n1", word: "beta" });
  store.addGraphLink({ id: "l1", fromNodeId: "n1", toNodeId: "n1" });

  assert.equal(entriesMutations >= 4, true);
  assert.equal(graphMutations >= 2, true);
  assert.equal(state.labels.includes("noun"), true);
  assert.equal(state.entries.length, 0);
  assert.equal(state.sentenceGraph.nodes.length, 1);
  assert.equal(state.sentenceGraph.links.length, 1);
});
