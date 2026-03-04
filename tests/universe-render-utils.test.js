const test = require("node:test");
const assert = require("node:assert/strict");

const {
  getUniverseColorRgb,
  getUniverseColorRgbBytes,
  ensureFloat32Capacity,
  ensureWebglBufferCapacity,
  pushRgbaPair,
  pushRgba,
  pushRgbaFromArray
} = require("../brain/modules/universe-render-utils.js");

test("hex color parsing returns expected rgb and byte channels", () => {
  assert.deepEqual(getUniverseColorRgb("#112233"), [17 / 255, 34 / 255, 51 / 255]);
  assert.deepEqual(getUniverseColorRgbBytes("#112233"), [17, 34, 51]);
});

test("invalid color uses fallback color", () => {
  assert.deepEqual(getUniverseColorRgb("invalid"), [118 / 255, 166 / 255, 236 / 255]);
  assert.deepEqual(getUniverseColorRgbBytes("invalid"), [118, 166, 236]);
});

test("ensureFloat32Capacity grows only when needed", () => {
  const source = new Float32Array(8);
  assert.equal(ensureFloat32Capacity(source, 8), source);
  const grown = ensureFloat32Capacity(source, 9);
  assert.ok(grown instanceof Float32Array);
  assert.ok(grown.length >= 9);
});

test("ensureWebglBufferCapacity allocates and records capacity", () => {
  const calls = [];
  const gl = {
    ARRAY_BUFFER: 34962,
    DYNAMIC_DRAW: 35048,
    bindBuffer(target, buffer) {
      calls.push(["bindBuffer", target, buffer]);
    },
    bufferData(target, size, usage) {
      calls.push(["bufferData", target, size, usage]);
    }
  };
  const glState = { bufferCapacities: { line: 0 } };

  ensureWebglBufferCapacity(gl, glState, "line-buffer", "line", 10);

  assert.equal(glState.bufferCapacities.line, 1024);
  assert.deepEqual(calls, [
    ["bindBuffer", 34962, "line-buffer"],
    ["bufferData", 34962, 1024, 35048]
  ]);
});

test("rgba push helpers append packed values and offsets", () => {
  const pairTarget = new Float32Array(8);
  const pairOffset = pushRgbaPair(pairTarget, 0, [1, 0.5, 0.25, 0.75]);
  assert.equal(pairOffset, 8);
  assert.deepEqual(Array.from(pairTarget), [1, 0.5, 0.25, 0.75, 1, 0.5, 0.25, 0.75]);

  const rgbaTarget = new Float32Array(8);
  let offset = pushRgba(rgbaTarget, 0, 0.2, 0.3, 0.4, 0.5);
  offset = pushRgbaFromArray(rgbaTarget, offset, [0.6, 0.7, 0.8, 0.9]);
  assert.equal(offset, 8);
  const expected = [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
  Array.from(rgbaTarget).forEach((value, index) => {
    assert.ok(Math.abs(value - expected[index]) < 1e-6);
  });
});
