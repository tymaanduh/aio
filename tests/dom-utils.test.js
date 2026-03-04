const test = require("node:test");
const assert = require("node:assert/strict");

const { RENDERER_ELEMENT_IDS, createElementMap } = require("../brain/modules/dom-utils.js");

test("renderer element ids are exported and can build element maps", () => {
  assert.equal(Array.isArray(RENDERER_ELEMENT_IDS), true);
  assert.equal(RENDERER_ELEMENT_IDS.length > 100, true);

  const root = {
    getElementById(id) {
      return { id };
    }
  };
  const map = createElementMap(["a", "b"], root);
  assert.equal(map.a.id, "a");
  assert.equal(map.b.id, "b");
});
