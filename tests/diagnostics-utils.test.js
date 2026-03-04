const test = require("node:test");
const assert = require("node:assert/strict");

const { normalizeDiagnostics, mergeDiagnostics, MAX_ERRORS, MAX_PERF } = require("../brain/modules/diagnostics-utils.js");

test("normalize diagnostics caps arrays", () => {
  const diagnostics = normalizeDiagnostics({
    errors: Array.from({ length: MAX_ERRORS + 10 }, (_, index) => ({ message: `e${index}` })),
    perf: Array.from({ length: MAX_PERF + 10 }, (_, index) => ({ key: `k${index}`, ms: index }))
  });
  assert.equal(diagnostics.errors.length, MAX_ERRORS);
  assert.equal(diagnostics.perf.length, MAX_PERF);
});

test("merge diagnostics combines and normalizes payloads", () => {
  const merged = mergeDiagnostics(
    { errors: [{ message: "left" }], perf: [{ key: "a", ms: 1 }] },
    { errors: [{ message: "right" }], perf: [{ key: "b", ms: 2 }] }
  );
  assert.equal(merged.errors.length, 2);
  assert.equal(merged.perf.length, 2);
});
