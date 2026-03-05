const test = require("node:test");
const assert = require("node:assert/strict");

const { createRendererRuntimeSpec, createRendererVisualState } = require("../brain/modules/renderer_state_data.js");

test("createRendererRuntimeSpec builds runtime defaults with benchmark factory", () => {
  const spec = createRendererRuntimeSpec({
    authModeCreate: "create",
    createUniverseBenchmarkState: () => ({ running: true, token: 1 })
  });

  assert.equal(spec.authMode, "create");
  assert.equal(spec.entriesIndexDirty, true);
  assert.deepEqual(spec.uBench(), { running: true, token: 1 });
});

test("createRendererVisualState returns isolated mutable structures", () => {
  const a = createRendererVisualState();
  const b = createRendererVisualState();

  assert.notEqual(a.view, b.view);
  assert.notEqual(a.canvasSize, b.canvasSize);
  assert.equal(a.renderFlags.selected instanceof Uint8Array, true);
  assert.equal(a.renderFlags.selected.length, 0);

  a.view.zoom = 2;
  assert.equal(b.view.zoom, 1);
});

