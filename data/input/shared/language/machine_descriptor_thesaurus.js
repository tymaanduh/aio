"use strict";

const THESAURUS_SEED_MAP = Object.freeze({
  required: Object.freeze(["mandatory", "necessary", "essential", "obligatory", "needed"]),
  include: Object.freeze(["add", "insert", "embed", "import", "attach"]),
  if: Object.freeze(["when", "provided", "assuming", "in-case", "conditioned"]),
  then: Object.freeze(["afterward", "subsequently", "next", "thereafter", "resulting"]),
  else: Object.freeze(["otherwise", "alternatively", "or-else", "fallback", "instead"]),
  set: Object.freeze(["assign", "store", "write", "update", "persist"]),
  call: Object.freeze(["invoke", "execute", "run", "trigger", "dispatch"]),
  return: Object.freeze(["yield", "emit", "output", "deliver", "send-back"]),
  and: Object.freeze(["plus", "along-with", "combined-with", "paired-with", "jointly"]),
  or: Object.freeze(["alternatively", "either", "otherwise", "optionally", "fallback"]),
  not: Object.freeze(["negate", "invert", "deny", "exclude", "forbid"]),
  equal: Object.freeze(["same", "match", "equivalent", "identical", "aligned"]),
  loop: Object.freeze(["iterate", "repeat", "cycle", "walk", "traverse"]),
  flag: Object.freeze(["marker", "indicator", "signal", "toggle", "switch"]),
  validate: Object.freeze(["check", "verify", "confirm", "assert", "inspect"]),
  optimize: Object.freeze(["improve", "refine", "tune", "accelerate", "streamline", "optimization", "optimizing"])
});

const MACHINE_DESCRIPTOR_RULE_MAP = Object.freeze({
  include_required: Object.freeze({
    opcode: "#include",
    operation: "include_flag",
    matched_terms: Object.freeze([
      "include",
      "required",
      "mandatory",
      "must",
      "need",
      "needed",
      "import",
      "attach",
      "embed"
    ]),
    pseudocode_descriptor: "include_if(flag_required == true)",
    machine_instruction: "include if flag_required == true",
    descriptor_signature: "[#include = required]",
    confidence: 0.98
  }),
  conditional_if: Object.freeze({
    opcode: "COND_IF",
    operation: "branch_if",
    matched_terms: Object.freeze(["if", "when", "provided", "assuming", "unless", "then", "else"]),
    pseudocode_descriptor: "if (x == y) then branch_true() else branch_false()",
    machine_instruction: "evaluate condition and route control flow",
    descriptor_signature: "[if[if x = y then]=true]",
    confidence: 0.95
  }),
  assignment_set: Object.freeze({
    opcode: "ASSIGN_SET",
    operation: "state_mutation",
    matched_terms: Object.freeze(["set", "assign", "store", "write", "update", "persist", "save"]),
    pseudocode_descriptor: "set(target, value)",
    machine_instruction: "write value into target state slot",
    descriptor_signature: "[set target = value]",
    confidence: 0.93
  }),
  invoke_call: Object.freeze({
    opcode: "CALL_FN",
    operation: "invoke_callable",
    matched_terms: Object.freeze(["call", "invoke", "run", "execute", "trigger", "dispatch"]),
    pseudocode_descriptor: "call(function_name, args)",
    machine_instruction: "invoke function and pass runtime arguments",
    descriptor_signature: "[call(fn,args)]",
    confidence: 0.92
  }),
  return_emit: Object.freeze({
    opcode: "RETURN",
    operation: "return_value",
    matched_terms: Object.freeze(["return", "yield", "emit", "output", "deliver"]),
    pseudocode_descriptor: "return(result)",
    machine_instruction: "exit scope and return computed payload",
    descriptor_signature: "[return = payload]",
    confidence: 0.91
  }),
  compare_equal: Object.freeze({
    opcode: "CMP_EQ",
    operation: "compare_equality",
    matched_terms: Object.freeze(["equal", "equals", "same", "match", "identical"]),
    pseudocode_descriptor: "compare(x, y) -> (x == y)",
    machine_instruction: "set compare flag when lhs equals rhs",
    descriptor_signature: "[x == y]",
    confidence: 0.9
  }),
  logic_and: Object.freeze({
    opcode: "LOGIC_AND",
    operation: "boolean_conjunction",
    matched_terms: Object.freeze(["and", "plus", "with", "along", "combined"]),
    pseudocode_descriptor: "lhs && rhs",
    machine_instruction: "require both boolean operands to be true",
    descriptor_signature: "[and = both_true]",
    confidence: 0.88
  }),
  logic_or: Object.freeze({
    opcode: "LOGIC_OR",
    operation: "boolean_disjunction",
    matched_terms: Object.freeze(["or", "either", "otherwise", "optionally", "fallback"]),
    pseudocode_descriptor: "lhs || rhs",
    machine_instruction: "require at least one boolean operand to be true",
    descriptor_signature: "[or = any_true]",
    confidence: 0.88
  }),
  logic_not: Object.freeze({
    opcode: "LOGIC_NOT",
    operation: "boolean_negation",
    matched_terms: Object.freeze(["not", "no", "never", "without", "exclude", "deny"]),
    pseudocode_descriptor: "!value",
    machine_instruction: "invert boolean operand",
    descriptor_signature: "[not = invert]",
    confidence: 0.87
  }),
  iterate_loop: Object.freeze({
    opcode: "ITERATE_LOOP",
    operation: "iterative_control",
    matched_terms: Object.freeze(["for", "each", "every", "loop", "iterate", "repeat", "while"]),
    pseudocode_descriptor: "for each item in collection -> execute(block)",
    machine_instruction: "iterate collection and execute block per item",
    descriptor_signature: "[for each item]",
    confidence: 0.86
  }),
  validate_check: Object.freeze({
    opcode: "VALIDATE",
    operation: "validation_gate",
    matched_terms: Object.freeze(["validate", "check", "verify", "confirm", "assert", "inspect"]),
    pseudocode_descriptor: "validate(input) -> pass|fail",
    machine_instruction: "run validation checks and emit pass/fail",
    descriptor_signature: "[validate = gate]",
    confidence: 0.85
  }),
  optimize_tune: Object.freeze({
    opcode: "OPTIMIZE",
    operation: "performance_tuning",
    matched_terms: Object.freeze([
      "optimize",
      "optimization",
      "optimized",
      "optimizing",
      "improve",
      "refine",
      "tune",
      "accelerate",
      "streamline"
    ]),
    pseudocode_descriptor: "optimize(path) -> faster_variant",
    machine_instruction: "apply optimization transform and measure delta",
    descriptor_signature: "[optimize = faster]",
    confidence: 0.84
  })
});

module.exports = {
  THESAURUS_SEED_MAP,
  MACHINE_DESCRIPTOR_RULE_MAP
};
