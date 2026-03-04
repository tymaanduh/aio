const test = require("node:test");
const assert = require("node:assert/strict");

const { create_math_io_database, create_math_io_handler } = require("../brain/math/io_assembly_line_math.js");

test("identify_needed_data resolves canonical symbols and stage slots", () => {
  const database = create_math_io_database();
  const handler = create_math_io_handler(database);

  handler.load_data({ input_a: 12, input_b: 4 });

  const needed = handler.identify_needed_data({
    operation_id: "op_subtract",
    input_slots: {
      x: "input_a",
      y: "input_b"
    }
  });

  assert.equal(needed.ok, true);
  assert.deepEqual(needed.needed_symbols, ["x", "y"]);
  assert.deepEqual(needed.needed_slots, ["input_a", "input_b"]);
});

test("run_assembly_line pipes each stage output into the next stage input", () => {
  const handler = create_math_io_handler(create_math_io_database());

  const result = handler.run_assembly_line(
    [
      {
        stage_name: "add_inputs",
        operation_id: "op_add",
        output_slot: "sum_out"
      },
      {
        stage_name: "multiply_sum",
        operation_id: "op_multiply",
        input_slots: {
          x: "sum_out",
          y: { literal: 2 }
        },
        output_slot: "final_out",
        output_group: "io_output"
      }
    ],
    { x: 5, y: 7 }
  );

  assert.equal(result.ok, true);
  assert.equal(result.stage_count, 2);
  assert.equal(result.final_output, 24);
  assert.equal(result.final_output_slot, "final_out");

  const snapshot = handler.get_database_snapshot();
  assert.equal(snapshot.slot_store.final_out.value, 24);
  assert.equal(snapshot.slot_store.final_out.group_id, "io_output");
});

test("load_data and unload_data manage slot lifecycle", () => {
  const handler = create_math_io_handler(create_math_io_database());

  const loaded = handler.load_data({ source_a: 9, source_b: 9 }, { group_id: "io_input" });
  assert.deepEqual(loaded.sort(), ["source_a", "source_b"]);

  const stage = handler.execute_stage({
    operation_id: "op_equal",
    input_slots: {
      x: "source_a",
      y: "source_b"
    },
    output_slot: "eq_flag"
  });
  assert.equal(stage.output_value, 1);

  const removed = handler.unload_data(["source_a", "source_b", "missing_slot"]);
  assert.deepEqual(removed.sort(), ["source_a", "source_b"]);
  assert.equal(handler.get_slot_value("source_a"), undefined);
});

test("execute_stage throws on missing input values", () => {
  const handler = create_math_io_handler(create_math_io_database());
  handler.load_data({ x: 10 });

  assert.throws(
    () =>
      handler.execute_stage({
        operation_id: "op_divide",
        input_slots: { x: "x", y: "missing_value" }
      }),
    /missing value for symbol "y"/
  );
});

test("assignment operations support x=y and a=b=c flows", () => {
  const handler = create_math_io_handler(create_math_io_database());

  const assignXy = handler.run_assembly_line(
    [
      {
        operation_id: "op_assign_xy",
        output_slot: "y"
      }
    ],
    { x: 42 }
  );
  assert.equal(assignXy.final_output, 42);
  assert.equal(handler.get_slot_value("y"), 42);

  const assignAbc = handler.run_assembly_line(
    [
      {
        operation_id: "op_assign_abc",
        output_slot: "c"
      }
    ],
    { a: 17 }
  );
  assert.equal(assignAbc.final_output, 17);
  assert.equal(handler.get_slot_value("c"), 17);
});

test("operation specs resolve instruction templates from JSON catalogs", () => {
  const database = create_math_io_database();
  const addOperation = database.operation_index.op_add;
  assert.ok(addOperation);
  assert.ok(Array.isArray(addOperation.instruction_template_refs));
  assert.deepEqual(addOperation.instruction_template_refs, ["tpl_read_xy_numeric", "tpl_math_add"]);
  assert.ok(Array.isArray(addOperation.instruction_set));
  assert.equal(addOperation.instruction_set.length, 5);
});
