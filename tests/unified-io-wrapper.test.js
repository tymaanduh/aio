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

test("unified wrapper resolves aliased input keys during identify + execute", () => {
  const wrapper = create_unified_wrapper();
  const pipeline = wrapper.build_pipeline_from_operation_ids(["op_add"]);
  const result = wrapper.run_two_pass(pipeline, {
    left: 7,
    right: 8
  });

  assert.equal(result.ok, true);
  assert.equal(result.final_output, 15);
  assert.equal(result.runtime.output.sum, 15);
});

test("unified wrapper returns deterministic error for unknown pipeline id", () => {
  const wrapper = create_unified_wrapper();
  const result = wrapper.run_pipeline_by_id("pipeline_does_not_exist", {
    x: 1,
    y: 2
  });

  assert.equal(result.ok, false);
  assert.equal(result.error, "pipeline_not_found");
});

test("unified wrapper returns deterministic error for unresolved auto pipeline", () => {
  const wrapper = create_unified_wrapper();
  const result = wrapper.run_auto_pipeline(["math.unknown_function"], {
    x: 1,
    y: 2
  });

  assert.equal(result.ok, false);
  assert.equal(result.error, "pipeline_not_resolved");
  assert.equal(result.requested_stage_count, 1);
});

test("unified wrapper reports execution failure when a function runner is missing", () => {
  const wrapper = create_unified_wrapper({}, { "math.add": null });
  const pipeline = wrapper.build_pipeline_from_operation_ids(["op_add"]);
  const result = wrapper.run_two_pass(pipeline, {
    x: 1,
    y: 2
  });

  assert.equal(result.ok, false);
  assert.equal(result.error, "pipeline_execution_failed");
  assert.equal(typeof result.message, "string");
  assert.equal(result.message.includes("missing function runner: math.add"), true);
});
