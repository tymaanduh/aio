const test = require("node:test");
const assert = require("node:assert/strict");

const { createUniverseGraphicsEngine } = require("../app/modules/universe-graphics-engine.js");

test("interaction state toggles after markInteraction", () => {
  const engine = createUniverseGraphicsEngine({ interactionActiveMs: 120 });
  assert.equal(engine.isInteractionActive(), false);
  engine.markInteraction(120);
  assert.equal(engine.isInteractionActive(), true);
});

test("edge target and stride respond to runtime pressure", () => {
  const engine = createUniverseGraphicsEngine({
    interactionEdgeTarget: 5000,
    idleEdgeTarget: 12000,
    perfEdgeTargetSoft: 8000,
    perfEdgeTargetHard: 5200,
    minEdgeTarget: 1200
  });
  const idleTarget = engine.getEdgeTarget({ perfSmoothedMs: 0, benchmarkRunning: false });
  assert.equal(idleTarget, 12000);
  const softTarget = engine.getEdgeTarget({ perfSmoothedMs: 10, benchmarkRunning: false });
  assert.equal(softTarget, 8000);
  const hardTarget = engine.getEdgeTarget({ perfSmoothedMs: 16, benchmarkRunning: false });
  assert.equal(hardTarget, 5200);
  assert.equal(engine.getEdgeStride(4000, { perfSmoothedMs: 0, benchmarkRunning: false }), 1);
  assert.equal(engine.getEdgeStride(24000, { perfSmoothedMs: 10, benchmarkRunning: false }), 3);
});

test("projection data is cached by signature and node index hit-test works", () => {
  const engine = createUniverseGraphicsEngine();
  const nodes = [
    { x: 0.2, y: 0.3, degree: 2, componentSize: 1 },
    { x: 0.8, y: 0.7, degree: 5, componentSize: 2 }
  ];
  const first = engine.getProjectionData({
    nodes,
    width: 1000,
    height: 800,
    zoom: 1,
    panX: 0,
    panY: 0,
    cacheToken: "abc"
  });
  const second = engine.getProjectionData({
    nodes,
    width: 1000,
    height: 800,
    zoom: 1,
    panX: 0,
    panY: 0,
    cacheToken: "abc"
  });
  assert.equal(first, second);
  const hitLeft = engine.findNodeIndexAt({
    canvasX: first.x[0],
    canvasY: first.y[0],
    nodes,
    width: 1000,
    height: 800,
    zoom: 1,
    panX: 0,
    panY: 0,
    cacheToken: "abc"
  });
  const hitRight = engine.findNodeIndexAt({
    canvasX: first.x[1],
    canvasY: first.y[1],
    nodes,
    width: 1000,
    height: 800,
    zoom: 1,
    panX: 0,
    panY: 0,
    cacheToken: "abc"
  });
  assert.equal(hitLeft, 0);
  assert.equal(hitRight, 1);
});
