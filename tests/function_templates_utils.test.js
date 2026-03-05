const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createIoTemplate,
  createControlTemplate,
  createTemplateRegistry,
  typeOfValue,
  isTypeMatch
} = require("../brain/modules/function_templates_utils.js");

test("io template validates inputs/returns and exposes metadata", () => {
  const makeLabel = createIoTemplate({
    name: "makeLabel",
    args: [
      { name: "word", type: "string" },
      { name: "count", type: "integer", defaultValue: 1 }
    ],
    returns: { type: "object", label: "labelPacket" },
    logic: ({ word, count }) => ({
      id: `${word}:${count}`,
      word,
      count
    })
  });

  const result = makeLabel({ word: "alpha" });
  assert.deepEqual(result, { id: "alpha:1", word: "alpha", count: 1 });
  assert.equal(makeLabel.meta.name, "makeLabel");
  assert.equal(makeLabel.meta.kind, "io");

  assert.throws(() => makeLabel({ word: 99 }), /invalid input/);
});

test("control template composes multiple functions in pipeline mode", () => {
  const pipeline = createControlTemplate({
    name: "calcScore",
    mode: "pipeline",
    args: [
      { name: "base", type: "number" },
      { name: "bonus", type: "number", defaultValue: 0 },
      { name: "double", type: "boolean", defaultValue: false }
    ],
    returns: { type: "number" },
    initial: ({ base }) => base,
    steps: [
      { name: "addBonus", run: ({ value, input }) => value + input.bonus },
      { name: "doubleIfNeeded", when: ({ input }) => input.double, run: ({ value }) => value * 2 }
    ],
    logic: ({ value }) => value
  });

  assert.equal(pipeline({ base: 10, bonus: 5, double: true }), 30);
  assert.equal(pipeline({ base: 10, bonus: 5, double: false }), 15);
});

test("control template supports fanout mode and typed final logic", () => {
  const fanout = createControlTemplate({
    name: "fanoutSummary",
    mode: "fanout",
    args: [{ name: "value", type: "number" }],
    returns: { type: "object" },
    steps: [
      { name: "double", run: ({ input }) => input.value * 2 },
      { name: "square", run: ({ input }) => input.value * input.value }
    ],
    logic: ({ output }) => ({ sum: output.double + output.square, output })
  });

  const result = fanout({ value: 4 });
  assert.equal(result.sum, 24);
  assert.equal(result.output.double, 8);
  assert.equal(result.output.square, 16);
});

test("template registry stores and runs templates by function name", () => {
  const registry = createTemplateRegistry();
  const echo = createIoTemplate({
    name: "echo",
    args: [{ name: "text", type: "string" }],
    returns: { type: "string" },
    logic: ({ text }) => text
  });

  registry.add(echo);
  assert.equal(registry.has("echo"), true);
  assert.equal(registry.run("echo", { text: "ok" }), "ok");
  assert.equal(registry.list().length, 1);
  assert.throws(() => registry.run("missing", {}), /unknown template/);
});

test("type helpers expose normalized type labels and matching", () => {
  assert.equal(typeOfValue([1, 2]), "array");
  assert.equal(typeOfValue(new Uint8Array(2)), "uint8array");
  assert.equal(isTypeMatch(2, "integer"), true);
  assert.equal(isTypeMatch(2.1, "integer"), false);
  assert.equal(isTypeMatch({ a: 1 }, "object"), true);
});

