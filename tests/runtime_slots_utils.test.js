const test = require("node:test");
const assert = require("node:assert/strict");

const { createRuntimeSlots } = require("../brain/modules/runtime_slots_utils.js");

test("createRuntimeSlots materializes functions and clones mutable values", () => {
  const srcList = [1, 2];
  const srcObj = { on: true };
  const srcMap = new Map([["k", 1]]);
  const srcSet = new Set(["a"]);
  const slots = createRuntimeSlots({
    count: 0,
    list: srcList,
    obj: srcObj,
    map: srcMap,
    set: srcSet,
    lazy: () => ({ id: "x" })
  });

  assert.deepEqual(slots.list, [1, 2]);
  assert.equal(slots.list === srcList, false);
  assert.equal(slots.obj === srcObj, false);
  assert.equal(slots.obj.on, true);
  assert.equal(slots.map instanceof Map, true);
  assert.equal(slots.set instanceof Set, true);
  assert.equal(slots.lazy.id, "x");

  slots.list.push(3);
  slots.obj.on = false;
  slots.map.set("k2", 2);
  slots.set.add("b");

  assert.deepEqual(createRuntimeSlots({ list: [1, 2] }).list, [1, 2]);
  assert.equal(srcMap.has("k2"), false);
  assert.equal(srcSet.has("b"), false);
});

