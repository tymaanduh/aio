const test = require("node:test");
const assert = require("node:assert/strict");

const { shouldVirtualizeGroup, calculateVirtualWindow } = require("../brain/modules/tree-utils.js");

test("virtualization threshold is respected", () => {
  assert.equal(shouldVirtualizeGroup(50), false);
  assert.equal(shouldVirtualizeGroup(500), true);
});

test("virtual window clamps and returns sane ranges", () => {
  const windowState = calculateVirtualWindow({
    totalCount: 1000,
    rowHeight: 34,
    viewportHeight: 340,
    scrollTop: 3400,
    overscan: 5
  });

  assert.equal(windowState.start >= 0, true);
  assert.equal(windowState.end > windowState.start, true);
  assert.equal(windowState.totalHeight, 34000);
  assert.equal(windowState.offsetTop, windowState.start * 34);
});
