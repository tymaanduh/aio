"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { create_unified_wrapper } = require("../brain/wrappers/unified_io_wrapper.js");

test("unified wrapper runs two-pass math pipeline from operation ids", () => {
  const wrapper = create_unified_wrapper();
  const pipeline = wrapper.build_pipeline_from_operation_ids(["op_add", "op_multiply"]);

  const result = wrapper.run_two_pass(pipeline, {
    x: 3,
    y: 4,
    sum: 7
  });

  assert.equal(result.ok, true);
  assert.equal(result.pass_execute.stage_count, 2);
  assert.equal(result.final_output, 12);
  assert.equal(result.runtime.output.sum, 7);
  assert.equal(result.runtime.output.product, 12);
});

test("unified wrapper reports missing args in identify pass", () => {
  const wrapper = create_unified_wrapper();
  const pipeline = wrapper.build_pipeline_from_operation_ids(["op_add"]);

  const result = wrapper.run_two_pass(pipeline, {
    x: 5
  });

  assert.equal(result.ok, false);
  assert.equal(result.error, "missing_input_arguments");
  assert.equal(result.pass_identify.missing.length > 0, true);
});

test("unified wrapper can run named pipeline ids", () => {
  const wrapper = create_unified_wrapper();
  const result = wrapper.run_pipeline_by_id("pipeline_default_math", {
    x: 10,
    y: 2
  });

  assert.equal(result.ok, true);
  assert.equal(result.final_output, 12);
});

test("unified wrapper can auto-build from function id sequence", () => {
  const wrapper = create_unified_wrapper();
  const result = wrapper.run_auto_pipeline(["math.add", "math.equal"], {
    x: 5,
    y: 5
  });

  assert.equal(result.ok, true);
  assert.equal(result.pass_execute.stage_count, 2);
  assert.equal(result.runtime.output.sum, 10);
  assert.equal(result.runtime.output.equal, 1);
});

test("unified wrapper supports custom function stage specs", () => {
  const wrapper = create_unified_wrapper();
  const result = wrapper.run_auto_pipeline(
    [
      {
        function_id: "math.add",
        input_args: [
          { arg: "x", symbol: "x" },
          { arg: "y", symbol: "y" }
        ],
        output_symbol: "result",
        output_group: "output"
      }
    ],
    { x: 2, y: 9 }
  );

  assert.equal(result.ok, true);
  assert.equal(result.final_output, 11);
  assert.equal(result.runtime.output.result, 11);
});

test("unified wrapper exposes runtime io stream helpers", () => {
  const wrapper = create_unified_wrapper();
  const ioStream = wrapper.create_runtime_io_stream({
    X: 4,
    y: 6
  });

  assert.equal(ioStream.read_symbol_value("x"), 4);
  assert.equal(ioStream.read_symbol_value("y"), 6);

  const outputSymbol = ioStream.write_symbol_value("sum", "output", 10);
  assert.equal(outputSymbol, "sum");
  assert.equal(ioStream.runtime.output.sum, 10);
});

test("unified wrapper can execute two-pass pipeline with explicit io stream wrapper", () => {
  const wrapper = create_unified_wrapper();
  const pipeline = wrapper.build_pipeline_from_operation_ids(["op_add", "op_multiply"]);
  const ioStream = wrapper.create_runtime_io_stream({
    x: 3,
    y: 4,
    sum: 7
  });

  const result = wrapper.run_two_pass_with_stream(pipeline, ioStream);

  assert.equal(result.ok, true);
  assert.equal(result.runtime, ioStream.runtime);
  assert.equal(result.pass_execute.stage_count, 2);
  assert.equal(result.final_output, 12);
  assert.equal(ioStream.runtime.output.product, 12);
});

test("unified wrapper supports compare bounds pipeline", () => {
  const wrapper = create_unified_wrapper();
  const result = wrapper.run_pipeline_by_id("pipeline_compare_bounds", {
    x: 13,
    y: -2
  });

  assert.equal(result.ok, true);
  assert.equal(result.runtime.output.min, -2);
  assert.equal(result.runtime.output.max, 13);
  assert.equal(result.final_output, 13);
});

test("unified wrapper supports clamp pipeline", () => {
  const wrapper = create_unified_wrapper();
  const result = wrapper.run_pipeline_by_id("pipeline_clamp_x", {
    x: 25,
    min: -4,
    max: 10
  });

  assert.equal(result.ok, true);
  assert.equal(result.runtime.output.clamped, 10);
  assert.equal(result.final_output, 10);
});

test("unified wrapper supports abs auto function sequence", () => {
  const wrapper = create_unified_wrapper();
  const result = wrapper.run_auto_pipeline(["math.abs"], { x: -9 });

  assert.equal(result.ok, true);
  assert.equal(result.runtime.output.abs, 9);
  assert.equal(result.final_output, 9);
});

test("unified wrapper prefers neutral core registry when available in node runtime", () => {
  const neutralCoreRuntimePath = require.resolve("../brain/core/neutral_core_runtime.js");
  const originalCacheEntry = require.cache[neutralCoreRuntimePath];

  require.cache[neutralCoreRuntimePath] = {
    id: neutralCoreRuntimePath,
    filename: neutralCoreRuntimePath,
    loaded: true,
    exports: {
      buildNeutralMathFunctionRegistry: () => ({
        "math.add": ({ x, y }) => Number(x || 0) + Number(y || 0) + 100
      })
    }
  };

  try {
    const wrapper = create_unified_wrapper();
    const result = wrapper.run_auto_pipeline(["math.add"], { x: 2, y: 3 });
    assert.equal(result.ok, true);
    assert.equal(result.final_output, 105);
  } finally {
    if (originalCacheEntry) {
      require.cache[neutralCoreRuntimePath] = originalCacheEntry;
    } else {
      delete require.cache[neutralCoreRuntimePath];
    }
  }
});
