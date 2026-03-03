const test = require("node:test");
const assert = require("node:assert/strict");

const { applyInChunks } = require("../app/modules/import-utils.js");

test("chunked import callback receives full sequence", async () => {
  const items = Array.from({ length: 11 }, (_, index) => index + 1);
  const seen = [];
  await applyInChunks(items, 4, async (chunk) => {
    seen.push(...chunk);
  });
  assert.deepEqual(seen, items);
});
