# frozen_string_literal: true

require "json"

module Aio
  module WrapperSymbols
    WRAPPER_SYMBOL_REGISTRY = JSON.parse(<<~'JSON')
{
  "schema_version": 1,
  "catalog_id": "aio_wrapper_symbol_registry",
  "source_files": {
    "function_contracts": "data/input/shared/wrapper/function_contracts.json",
    "wrapper_specs": "data/input/shared/wrapper/unified_wrapper_specs.json",
    "function_behavior_specs": "data/input/shared/wrapper/function_behavior_specs.json"
  },
  "runtime_defaults": {
    "wrapper_id": "wrapper_two_pass_unified",
    "input_group_id": "input",
    "work_group_id": "work",
    "output_group_id": "output",
    "meta_group_id": "meta"
  },
  "name_index": {
    "function_ids": [
      "math.abs",
      "math.add",
      "math.assign",
      "math.chain_assign",
      "math.clamp",
      "math.divide",
      "math.equal",
      "math.max",
      "math.min",
      "math.multiply",
      "math.subtract"
    ],
    "object_names": [
      "a",
      "max",
      "min",
      "x",
      "y"
    ],
    "symbol_names": [
      "a",
      "abs",
      "c",
      "clamped",
      "difference",
      "equal",
      "max",
      "min",
      "product",
      "quotient",
      "sum",
      "x",
      "y"
    ],
    "const_names": [
      "GROUP_INPUT_ID",
      "GROUP_META_ID",
      "GROUP_OUTPUT_ID",
      "GROUP_WORK_ID",
      "MATH_ABS",
      "MATH_ADD",
      "MATH_ASSIGN",
      "MATH_CHAIN_ASSIGN",
      "MATH_CLAMP",
      "MATH_DIVIDE",
      "MATH_EQUAL",
      "MATH_MAX",
      "MATH_MIN",
      "MATH_MULTIPLY",
      "MATH_SUBTRACT",
      "OBJECT_A",
      "OBJECT_MAX",
      "OBJECT_MIN",
      "OBJECT_X",
      "OBJECT_Y",
      "OP_ABS_X",
      "OP_ADD",
      "OP_ASSIGN_ABC",
      "OP_ASSIGN_XY",
      "OP_CLAMP_X",
      "OP_DIVIDE",
      "OP_EQUAL",
      "OP_MAX",
      "OP_MIN",
      "OP_MULTIPLY",
      "OP_SUBTRACT",
      "PIPELINE_ABS_THEN_CLAMP",
      "PIPELINE_ASSIGN_THEN_ADD",
      "PIPELINE_CLAMP_X",
      "PIPELINE_COMPARE_BOUNDS",
      "PIPELINE_DEFAULT_MATH",
      "SYMBOL_A",
      "SYMBOL_ABS",
      "SYMBOL_C",
      "SYMBOL_CLAMPED",
      "SYMBOL_DIFFERENCE",
      "SYMBOL_EQUAL",
      "SYMBOL_MAX",
      "SYMBOL_MIN",
      "SYMBOL_PRODUCT",
      "SYMBOL_QUOTIENT",
      "SYMBOL_SUM",
      "SYMBOL_X",
      "SYMBOL_Y",
      "WRAPPER_ID"
    ]
  },
  "function_index": {
    "math.abs": {
      "function_id": "math.abs",
      "wrapper_action_id": "op_abs_x",
      "module_id": "brain/wrappers/unified_io_wrapper.js",
      "inputs": [
        {
          "arg": "x",
          "symbol": "x",
          "type": "number",
          "required": true
        }
      ],
      "output": {
        "symbol": "abs",
        "group": "output",
        "type": "number"
      },
      "function_behavior": {
        "kind": "unary_math",
        "operator": "abs",
        "arg": "x",
        "left": "",
        "right": "",
        "value_arg": "",
        "min_arg": "",
        "max_arg": "",
        "swap_bounds_when_inverted": true,
        "true_value": 1,
        "false_value": 0
      },
      "language_symbols": {
        "javascript": "mathAbs",
        "typescript": "mathAbs",
        "python": "math_abs",
        "cpp": "aio::wrapper_symbols::math_abs",
        "ruby": "Aio::WrapperSymbols.math_abs"
      }
    },
    "math.add": {
      "function_id": "math.add",
      "wrapper_action_id": "op_add",
      "module_id": "brain/wrappers/unified_io_wrapper.js",
      "inputs": [
        {
          "arg": "x",
          "symbol": "x",
          "type": "number",
          "required": true
        },
        {
          "arg": "y",
          "symbol": "y",
          "type": "number",
          "required": true
        }
      ],
      "output": {
        "symbol": "sum",
        "group": "output",
        "type": "number"
      },
      "function_behavior": {
        "kind": "binary_arithmetic",
        "operator": "add",
        "arg": "",
        "left": "x",
        "right": "y",
        "value_arg": "",
        "min_arg": "",
        "max_arg": "",
        "swap_bounds_when_inverted": true,
        "true_value": 1,
        "false_value": 0
      },
      "language_symbols": {
        "javascript": "mathAdd",
        "typescript": "mathAdd",
        "python": "math_add",
        "cpp": "aio::wrapper_symbols::math_add",
        "ruby": "Aio::WrapperSymbols.math_add"
      }
    },
    "math.assign": {
      "function_id": "math.assign",
      "wrapper_action_id": "op_assign_xy",
      "module_id": "brain/wrappers/unified_io_wrapper.js",
      "inputs": [
        {
          "arg": "x",
          "symbol": "x",
          "type": "number",
          "required": true
        }
      ],
      "output": {
        "symbol": "y",
        "group": "output",
        "type": "number"
      },
      "function_behavior": {
        "kind": "pass_through",
        "operator": "",
        "arg": "x",
        "left": "",
        "right": "",
        "value_arg": "",
        "min_arg": "",
        "max_arg": "",
        "swap_bounds_when_inverted": true,
        "true_value": 1,
        "false_value": 0
      },
      "language_symbols": {
        "javascript": "mathAssign",
        "typescript": "mathAssign",
        "python": "math_assign",
        "cpp": "aio::wrapper_symbols::math_assign",
        "ruby": "Aio::WrapperSymbols.math_assign"
      }
    },
    "math.chain_assign": {
      "function_id": "math.chain_assign",
      "wrapper_action_id": "op_assign_abc",
      "module_id": "brain/wrappers/unified_io_wrapper.js",
      "inputs": [
        {
          "arg": "a",
          "symbol": "a",
          "type": "number",
          "required": true
        }
      ],
      "output": {
        "symbol": "c",
        "group": "output",
        "type": "number"
      },
      "function_behavior": {
        "kind": "pass_through",
        "operator": "",
        "arg": "a",
        "left": "",
        "right": "",
        "value_arg": "",
        "min_arg": "",
        "max_arg": "",
        "swap_bounds_when_inverted": true,
        "true_value": 1,
        "false_value": 0
      },
      "language_symbols": {
        "javascript": "mathChainAssign",
        "typescript": "mathChainAssign",
        "python": "math_chain_assign",
        "cpp": "aio::wrapper_symbols::math_chain_assign",
        "ruby": "Aio::WrapperSymbols.math_chain_assign"
      }
    },
    "math.clamp": {
      "function_id": "math.clamp",
      "wrapper_action_id": "op_clamp_x",
      "module_id": "brain/wrappers/unified_io_wrapper.js",
      "inputs": [
        {
          "arg": "x",
          "symbol": "x",
          "type": "number",
          "required": true
        },
        {
          "arg": "min",
          "symbol": "min",
          "type": "number",
          "required": true
        },
        {
          "arg": "max",
          "symbol": "max",
          "type": "number",
          "required": true
        }
      ],
      "output": {
        "symbol": "clamped",
        "group": "output",
        "type": "number"
      },
      "function_behavior": {
        "kind": "clamp",
        "operator": "",
        "arg": "",
        "left": "",
        "right": "",
        "value_arg": "x",
        "min_arg": "min",
        "max_arg": "max",
        "swap_bounds_when_inverted": true,
        "true_value": 1,
        "false_value": 0
      },
      "language_symbols": {
        "javascript": "mathClamp",
        "typescript": "mathClamp",
        "python": "math_clamp",
        "cpp": "aio::wrapper_symbols::math_clamp",
        "ruby": "Aio::WrapperSymbols.math_clamp"
      }
    },
    "math.divide": {
      "function_id": "math.divide",
      "wrapper_action_id": "op_divide",
      "module_id": "brain/wrappers/unified_io_wrapper.js",
      "inputs": [
        {
          "arg": "x",
          "symbol": "x",
          "type": "number",
          "required": true
        },
        {
          "arg": "y",
          "symbol": "y",
          "type": "number",
          "required": true
        }
      ],
      "output": {
        "symbol": "quotient",
        "group": "output",
        "type": "number"
      },
      "function_behavior": {
        "kind": "binary_arithmetic",
        "operator": "divide",
        "arg": "",
        "left": "x",
        "right": "y",
        "value_arg": "",
        "min_arg": "",
        "max_arg": "",
        "swap_bounds_when_inverted": true,
        "true_value": 1,
        "false_value": 0
      },
      "language_symbols": {
        "javascript": "mathDivide",
        "typescript": "mathDivide",
        "python": "math_divide",
        "cpp": "aio::wrapper_symbols::math_divide",
        "ruby": "Aio::WrapperSymbols.math_divide"
      }
    },
    "math.equal": {
      "function_id": "math.equal",
      "wrapper_action_id": "op_equal",
      "module_id": "brain/wrappers/unified_io_wrapper.js",
      "inputs": [
        {
          "arg": "x",
          "symbol": "x",
          "type": "number",
          "required": true
        },
        {
          "arg": "y",
          "symbol": "y",
          "type": "number",
          "required": true
        }
      ],
      "output": {
        "symbol": "equal",
        "group": "output",
        "type": "number"
      },
      "function_behavior": {
        "kind": "binary_compare",
        "operator": "equal",
        "arg": "",
        "left": "x",
        "right": "y",
        "value_arg": "",
        "min_arg": "",
        "max_arg": "",
        "swap_bounds_when_inverted": true,
        "true_value": 1,
        "false_value": 0
      },
      "language_symbols": {
        "javascript": "mathEqual",
        "typescript": "mathEqual",
        "python": "math_equal",
        "cpp": "aio::wrapper_symbols::math_equal",
        "ruby": "Aio::WrapperSymbols.math_equal"
      }
    },
    "math.max": {
      "function_id": "math.max",
      "wrapper_action_id": "op_max",
      "module_id": "brain/wrappers/unified_io_wrapper.js",
      "inputs": [
        {
          "arg": "x",
          "symbol": "x",
          "type": "number",
          "required": true
        },
        {
          "arg": "y",
          "symbol": "y",
          "type": "number",
          "required": true
        }
      ],
      "output": {
        "symbol": "max",
        "group": "output",
        "type": "number"
      },
      "function_behavior": {
        "kind": "binary_compare",
        "operator": "max",
        "arg": "",
        "left": "x",
        "right": "y",
        "value_arg": "",
        "min_arg": "",
        "max_arg": "",
        "swap_bounds_when_inverted": true,
        "true_value": 1,
        "false_value": 0
      },
      "language_symbols": {
        "javascript": "mathMax",
        "typescript": "mathMax",
        "python": "math_max",
        "cpp": "aio::wrapper_symbols::math_max",
        "ruby": "Aio::WrapperSymbols.math_max"
      }
    },
    "math.min": {
      "function_id": "math.min",
      "wrapper_action_id": "op_min",
      "module_id": "brain/wrappers/unified_io_wrapper.js",
      "inputs": [
        {
          "arg": "x",
          "symbol": "x",
          "type": "number",
          "required": true
        },
        {
          "arg": "y",
          "symbol": "y",
          "type": "number",
          "required": true
        }
      ],
      "output": {
        "symbol": "min",
        "group": "output",
        "type": "number"
      },
      "function_behavior": {
        "kind": "binary_compare",
        "operator": "min",
        "arg": "",
        "left": "x",
        "right": "y",
        "value_arg": "",
        "min_arg": "",
        "max_arg": "",
        "swap_bounds_when_inverted": true,
        "true_value": 1,
        "false_value": 0
      },
      "language_symbols": {
        "javascript": "mathMin",
        "typescript": "mathMin",
        "python": "math_min",
        "cpp": "aio::wrapper_symbols::math_min",
        "ruby": "Aio::WrapperSymbols.math_min"
      }
    },
    "math.multiply": {
      "function_id": "math.multiply",
      "wrapper_action_id": "op_multiply",
      "module_id": "brain/wrappers/unified_io_wrapper.js",
      "inputs": [
        {
          "arg": "x",
          "symbol": "x",
          "type": "number",
          "required": true
        },
        {
          "arg": "y",
          "symbol": "y",
          "type": "number",
          "required": true
        }
      ],
      "output": {
        "symbol": "product",
        "group": "output",
        "type": "number"
      },
      "function_behavior": {
        "kind": "binary_arithmetic",
        "operator": "multiply",
        "arg": "",
        "left": "x",
        "right": "y",
        "value_arg": "",
        "min_arg": "",
        "max_arg": "",
        "swap_bounds_when_inverted": true,
        "true_value": 1,
        "false_value": 0
      },
      "language_symbols": {
        "javascript": "mathMultiply",
        "typescript": "mathMultiply",
        "python": "math_multiply",
        "cpp": "aio::wrapper_symbols::math_multiply",
        "ruby": "Aio::WrapperSymbols.math_multiply"
      }
    },
    "math.subtract": {
      "function_id": "math.subtract",
      "wrapper_action_id": "op_subtract",
      "module_id": "brain/wrappers/unified_io_wrapper.js",
      "inputs": [
        {
          "arg": "x",
          "symbol": "x",
          "type": "number",
          "required": true
        },
        {
          "arg": "y",
          "symbol": "y",
          "type": "number",
          "required": true
        }
      ],
      "output": {
        "symbol": "difference",
        "group": "output",
        "type": "number"
      },
      "function_behavior": {
        "kind": "binary_arithmetic",
        "operator": "subtract",
        "arg": "",
        "left": "x",
        "right": "y",
        "value_arg": "",
        "min_arg": "",
        "max_arg": "",
        "swap_bounds_when_inverted": true,
        "true_value": 1,
        "false_value": 0
      },
      "language_symbols": {
        "javascript": "mathSubtract",
        "typescript": "mathSubtract",
        "python": "math_subtract",
        "cpp": "aio::wrapper_symbols::math_subtract",
        "ruby": "Aio::WrapperSymbols.math_subtract"
      }
    }
  },
  "function_behavior_index": {
    "math.abs": {
      "kind": "unary_math",
      "operator": "abs",
      "arg": "x",
      "left": "",
      "right": "",
      "value_arg": "",
      "min_arg": "",
      "max_arg": "",
      "swap_bounds_when_inverted": true,
      "true_value": 1,
      "false_value": 0
    },
    "math.add": {
      "kind": "binary_arithmetic",
      "operator": "add",
      "arg": "",
      "left": "x",
      "right": "y",
      "value_arg": "",
      "min_arg": "",
      "max_arg": "",
      "swap_bounds_when_inverted": true,
      "true_value": 1,
      "false_value": 0
    },
    "math.assign": {
      "kind": "pass_through",
      "operator": "",
      "arg": "x",
      "left": "",
      "right": "",
      "value_arg": "",
      "min_arg": "",
      "max_arg": "",
      "swap_bounds_when_inverted": true,
      "true_value": 1,
      "false_value": 0
    },
    "math.chain_assign": {
      "kind": "pass_through",
      "operator": "",
      "arg": "a",
      "left": "",
      "right": "",
      "value_arg": "",
      "min_arg": "",
      "max_arg": "",
      "swap_bounds_when_inverted": true,
      "true_value": 1,
      "false_value": 0
    },
    "math.clamp": {
      "kind": "clamp",
      "operator": "",
      "arg": "",
      "left": "",
      "right": "",
      "value_arg": "x",
      "min_arg": "min",
      "max_arg": "max",
      "swap_bounds_when_inverted": true,
      "true_value": 1,
      "false_value": 0
    },
    "math.divide": {
      "kind": "binary_arithmetic",
      "operator": "divide",
      "arg": "",
      "left": "x",
      "right": "y",
      "value_arg": "",
      "min_arg": "",
      "max_arg": "",
      "swap_bounds_when_inverted": true,
      "true_value": 1,
      "false_value": 0
    },
    "math.equal": {
      "kind": "binary_compare",
      "operator": "equal",
      "arg": "",
      "left": "x",
      "right": "y",
      "value_arg": "",
      "min_arg": "",
      "max_arg": "",
      "swap_bounds_when_inverted": true,
      "true_value": 1,
      "false_value": 0
    },
    "math.max": {
      "kind": "binary_compare",
      "operator": "max",
      "arg": "",
      "left": "x",
      "right": "y",
      "value_arg": "",
      "min_arg": "",
      "max_arg": "",
      "swap_bounds_when_inverted": true,
      "true_value": 1,
      "false_value": 0
    },
    "math.min": {
      "kind": "binary_compare",
      "operator": "min",
      "arg": "",
      "left": "x",
      "right": "y",
      "value_arg": "",
      "min_arg": "",
      "max_arg": "",
      "swap_bounds_when_inverted": true,
      "true_value": 1,
      "false_value": 0
    },
    "math.multiply": {
      "kind": "binary_arithmetic",
      "operator": "multiply",
      "arg": "",
      "left": "x",
      "right": "y",
      "value_arg": "",
      "min_arg": "",
      "max_arg": "",
      "swap_bounds_when_inverted": true,
      "true_value": 1,
      "false_value": 0
    },
    "math.subtract": {
      "kind": "binary_arithmetic",
      "operator": "subtract",
      "arg": "",
      "left": "x",
      "right": "y",
      "value_arg": "",
      "min_arg": "",
      "max_arg": "",
      "swap_bounds_when_inverted": true,
      "true_value": 1,
      "false_value": 0
    }
  },
  "numeric_policies": {
    "require_finite_numbers": true,
    "invalid_number_error_code": "E_INVALID_NUMBER",
    "divide_by_zero_error_code": "E_DIVIDE_BY_ZERO",
    "swap_clamp_bounds_when_inverted": true,
    "equal_true_value": 1,
    "equal_false_value": 0
  },
  "operation_index": {
    "op_abs_x": {
      "operation_id": "op_abs_x",
      "function_id": "math.abs",
      "input_args": [
        {
          "arg": "x",
          "symbol": "x"
        }
      ],
      "output_symbol": "abs",
      "output_group": "output"
    },
    "op_add": {
      "operation_id": "op_add",
      "function_id": "math.add",
      "input_args": [
        {
          "arg": "x",
          "symbol": "x"
        },
        {
          "arg": "y",
          "symbol": "y"
        }
      ],
      "output_symbol": "sum",
      "output_group": "output"
    },
    "op_assign_abc": {
      "operation_id": "op_assign_abc",
      "function_id": "math.chain_assign",
      "input_args": [
        {
          "arg": "a",
          "symbol": "a"
        }
      ],
      "output_symbol": "c",
      "output_group": "output"
    },
    "op_assign_xy": {
      "operation_id": "op_assign_xy",
      "function_id": "math.assign",
      "input_args": [
        {
          "arg": "x",
          "symbol": "x"
        }
      ],
      "output_symbol": "y",
      "output_group": "output"
    },
    "op_clamp_x": {
      "operation_id": "op_clamp_x",
      "function_id": "math.clamp",
      "input_args": [
        {
          "arg": "x",
          "symbol": "x"
        },
        {
          "arg": "min",
          "symbol": "min"
        },
        {
          "arg": "max",
          "symbol": "max"
        }
      ],
      "output_symbol": "clamped",
      "output_group": "output"
    },
    "op_divide": {
      "operation_id": "op_divide",
      "function_id": "math.divide",
      "input_args": [
        {
          "arg": "x",
          "symbol": "x"
        },
        {
          "arg": "y",
          "symbol": "y"
        }
      ],
      "output_symbol": "quotient",
      "output_group": "output"
    },
    "op_equal": {
      "operation_id": "op_equal",
      "function_id": "math.equal",
      "input_args": [
        {
          "arg": "x",
          "symbol": "x"
        },
        {
          "arg": "y",
          "symbol": "y"
        }
      ],
      "output_symbol": "equal",
      "output_group": "output"
    },
    "op_max": {
      "operation_id": "op_max",
      "function_id": "math.max",
      "input_args": [
        {
          "arg": "x",
          "symbol": "x"
        },
        {
          "arg": "y",
          "symbol": "y"
        }
      ],
      "output_symbol": "max",
      "output_group": "output"
    },
    "op_min": {
      "operation_id": "op_min",
      "function_id": "math.min",
      "input_args": [
        {
          "arg": "x",
          "symbol": "x"
        },
        {
          "arg": "y",
          "symbol": "y"
        }
      ],
      "output_symbol": "min",
      "output_group": "output"
    },
    "op_multiply": {
      "operation_id": "op_multiply",
      "function_id": "math.multiply",
      "input_args": [
        {
          "arg": "x",
          "symbol": "x"
        },
        {
          "arg": "y",
          "symbol": "y"
        }
      ],
      "output_symbol": "product",
      "output_group": "output"
    },
    "op_subtract": {
      "operation_id": "op_subtract",
      "function_id": "math.subtract",
      "input_args": [
        {
          "arg": "x",
          "symbol": "x"
        },
        {
          "arg": "y",
          "symbol": "y"
        }
      ],
      "output_symbol": "difference",
      "output_group": "output"
    }
  },
  "pipeline_index": {
    "pipeline_abs_then_clamp": [
      "op_abs_x",
      "op_clamp_x"
    ],
    "pipeline_assign_then_add": [
      "op_assign_xy",
      "op_add"
    ],
    "pipeline_clamp_x": [
      "op_clamp_x"
    ],
    "pipeline_compare_bounds": [
      "op_min",
      "op_max"
    ],
    "pipeline_default_math": [
      "op_add"
    ]
  },
  "const_index": {
    "wrapper": {
      "WRAPPER_ID": "wrapper_two_pass_unified",
      "GROUP_INPUT_ID": "input",
      "GROUP_WORK_ID": "work",
      "GROUP_OUTPUT_ID": "output",
      "GROUP_META_ID": "meta"
    },
    "function_ids": {
      "MATH_ABS": "math.abs",
      "MATH_ADD": "math.add",
      "MATH_ASSIGN": "math.assign",
      "MATH_CHAIN_ASSIGN": "math.chain_assign",
      "MATH_CLAMP": "math.clamp",
      "MATH_DIVIDE": "math.divide",
      "MATH_EQUAL": "math.equal",
      "MATH_MAX": "math.max",
      "MATH_MIN": "math.min",
      "MATH_MULTIPLY": "math.multiply",
      "MATH_SUBTRACT": "math.subtract"
    },
    "operation_ids": {
      "OP_ABS_X": "op_abs_x",
      "OP_ADD": "op_add",
      "OP_ASSIGN_XY": "op_assign_xy",
      "OP_ASSIGN_ABC": "op_assign_abc",
      "OP_CLAMP_X": "op_clamp_x",
      "OP_DIVIDE": "op_divide",
      "OP_EQUAL": "op_equal",
      "OP_MAX": "op_max",
      "OP_MIN": "op_min",
      "OP_MULTIPLY": "op_multiply",
      "OP_SUBTRACT": "op_subtract"
    },
    "pipeline_ids": {
      "PIPELINE_ABS_THEN_CLAMP": "pipeline_abs_then_clamp",
      "PIPELINE_ASSIGN_THEN_ADD": "pipeline_assign_then_add",
      "PIPELINE_CLAMP_X": "pipeline_clamp_x",
      "PIPELINE_COMPARE_BOUNDS": "pipeline_compare_bounds",
      "PIPELINE_DEFAULT_MATH": "pipeline_default_math"
    },
    "object_names": {
      "OBJECT_A": "a",
      "OBJECT_MAX": "max",
      "OBJECT_MIN": "min",
      "OBJECT_X": "x",
      "OBJECT_Y": "y"
    },
    "symbol_names": {
      "SYMBOL_A": "a",
      "SYMBOL_ABS": "abs",
      "SYMBOL_C": "c",
      "SYMBOL_CLAMPED": "clamped",
      "SYMBOL_DIFFERENCE": "difference",
      "SYMBOL_EQUAL": "equal",
      "SYMBOL_MAX": "max",
      "SYMBOL_MIN": "min",
      "SYMBOL_PRODUCT": "product",
      "SYMBOL_QUOTIENT": "quotient",
      "SYMBOL_SUM": "sum",
      "SYMBOL_X": "x",
      "SYMBOL_Y": "y"
    }
  }
}
JSON
    FUNCTION_IDS = WRAPPER_SYMBOL_REGISTRY["const_index"]["function_ids"]
    OPERATION_IDS = WRAPPER_SYMBOL_REGISTRY["const_index"]["operation_ids"]
    PIPELINE_IDS = WRAPPER_SYMBOL_REGISTRY["const_index"]["pipeline_ids"]
    OBJECT_NAMES = WRAPPER_SYMBOL_REGISTRY["const_index"]["object_names"]
    SYMBOL_NAMES = WRAPPER_SYMBOL_REGISTRY["const_index"]["symbol_names"]
    WRAPPER_CONSTS = WRAPPER_SYMBOL_REGISTRY["const_index"]["wrapper"]
    FUNCTION_BEHAVIOR_INDEX = WRAPPER_SYMBOL_REGISTRY["function_behavior_index"] || {}
    NUMERIC_POLICIES = WRAPPER_SYMBOL_REGISTRY["numeric_policies"] || {}

    def self.parse_numeric_arg(bound_args, arg_name)
      raw = bound_args[arg_name]
      begin
        value = Float(raw)
      rescue StandardError
        return { "ok" => false, "value" => 0.0, "error_code" => NUMERIC_POLICIES.fetch("invalid_number_error_code", "E_INVALID_NUMBER") }
      end
      require_finite = NUMERIC_POLICIES.fetch("require_finite_numbers", true) != false
      if value.nan? || (require_finite && !value.finite?)
        return { "ok" => false, "value" => 0.0, "error_code" => NUMERIC_POLICIES.fetch("invalid_number_error_code", "E_INVALID_NUMBER") }
      end
      { "ok" => true, "value" => value, "error_code" => "" }
    end

    def self.compute_wrapper_value(function_id, bound_args)
      behavior = FUNCTION_BEHAVIOR_INDEX[function_id]
      unless behavior.is_a?(Hash) && behavior["kind"]
        return { "ok" => false, "value" => nil, "error_code" => "E_UNIMPLEMENTED_BEHAVIOR" }
      end
      kind = behavior["kind"].to_s

      if kind == "pass_through"
        parsed = parse_numeric_arg(bound_args, behavior["arg"].to_s)
        return parsed["ok"] ? { "ok" => true, "value" => parsed["value"], "error_code" => "" } : { "ok" => false, "value" => nil, "error_code" => parsed["error_code"] }
      end

      if kind == "unary_math"
        parsed = parse_numeric_arg(bound_args, behavior["arg"].to_s)
        return { "ok" => false, "value" => nil, "error_code" => parsed["error_code"] } unless parsed["ok"]
        if behavior["operator"].to_s == "abs"
          return { "ok" => true, "value" => parsed["value"].abs, "error_code" => "" }
        end
      end

      if kind == "binary_arithmetic"
        left = parse_numeric_arg(bound_args, behavior["left"].to_s)
        right = parse_numeric_arg(bound_args, behavior["right"].to_s)
        return { "ok" => false, "value" => nil, "error_code" => left["error_code"] } unless left["ok"]
        return { "ok" => false, "value" => nil, "error_code" => right["error_code"] } unless right["ok"]
        operator = behavior["operator"].to_s
        return { "ok" => true, "value" => left["value"] + right["value"], "error_code" => "" } if operator == "add"
        return { "ok" => true, "value" => left["value"] - right["value"], "error_code" => "" } if operator == "subtract"
        return { "ok" => true, "value" => left["value"] * right["value"], "error_code" => "" } if operator == "multiply"
        if operator == "divide"
          return { "ok" => false, "value" => nil, "error_code" => NUMERIC_POLICIES.fetch("divide_by_zero_error_code", "E_DIVIDE_BY_ZERO") } if right["value"] == 0
          return { "ok" => true, "value" => left["value"] / right["value"], "error_code" => "" }
        end
      end

      if kind == "binary_compare"
        left = parse_numeric_arg(bound_args, behavior["left"].to_s)
        right = parse_numeric_arg(bound_args, behavior["right"].to_s)
        return { "ok" => false, "value" => nil, "error_code" => left["error_code"] } unless left["ok"]
        return { "ok" => false, "value" => nil, "error_code" => right["error_code"] } unless right["ok"]
        operator = behavior["operator"].to_s
        if operator == "equal"
          true_value = Float(behavior.fetch("true_value", NUMERIC_POLICIES.fetch("equal_true_value", 1)))
          false_value = Float(behavior.fetch("false_value", NUMERIC_POLICIES.fetch("equal_false_value", 0)))
          return { "ok" => true, "value" => left["value"] == right["value"] ? true_value : false_value, "error_code" => "" }
        end
        return { "ok" => true, "value" => [left["value"], right["value"]].min, "error_code" => "" } if operator == "min"
        return { "ok" => true, "value" => [left["value"], right["value"]].max, "error_code" => "" } if operator == "max"
      end

      if kind == "clamp"
        source = parse_numeric_arg(bound_args, behavior["value_arg"].to_s)
        min_value = parse_numeric_arg(bound_args, behavior["min_arg"].to_s)
        max_value = parse_numeric_arg(bound_args, behavior["max_arg"].to_s)
        return { "ok" => false, "value" => nil, "error_code" => source["error_code"] } unless source["ok"]
        return { "ok" => false, "value" => nil, "error_code" => min_value["error_code"] } unless min_value["ok"]
        return { "ok" => false, "value" => nil, "error_code" => max_value["error_code"] } unless max_value["ok"]
        lower = min_value["value"]
        upper = max_value["value"]
        swap_bounds = behavior.fetch("swap_bounds_when_inverted", true) != false
        if swap_bounds && lower > upper
          lower, upper = upper, lower
        end
        return { "ok" => true, "value" => [[source["value"], lower].max, upper].min, "error_code" => "" }
      end

      { "ok" => false, "value" => nil, "error_code" => "E_UNIMPLEMENTED_BEHAVIOR" }
    end

    def self.run_wrapper_function(function_id, bound_args = {})
      args = bound_args.is_a?(Hash) ? bound_args : {}
      contract = WRAPPER_SYMBOL_REGISTRY["function_index"][function_id]
      unless contract
        return {
          "ok" => false,
          "function_id" => function_id,
          "wrapper_action_id" => "",
          "output_symbol" => "",
          "output_group" => "",
          "result" => {},
          "value" => nil,
          "missing_args" => [],
          "error_code" => "E_UNKNOWN_FUNCTION"
        }
      end
      missing_args = contract["inputs"]
        .select { |input| input["required"] && (!args.key?(input["arg"]) || args[input["arg"]].nil?) }
        .map { |input| input["arg"] }
      unless missing_args.empty?
        return {
          "ok" => false,
          "function_id" => function_id,
          "wrapper_action_id" => contract["wrapper_action_id"],
          "output_symbol" => contract["output"]["symbol"],
          "output_group" => contract["output"]["group"],
          "result" => {},
          "value" => nil,
          "missing_args" => missing_args,
          "error_code" => "E_MISSING_ARG"
        }
      end
      computed = compute_wrapper_value(function_id, args)
      unless computed["ok"]
        return {
          "ok" => false,
          "function_id" => function_id,
          "wrapper_action_id" => contract["wrapper_action_id"],
          "output_symbol" => contract["output"]["symbol"],
          "output_group" => contract["output"]["group"],
          "result" => {},
          "value" => nil,
          "missing_args" => [],
          "error_code" => computed.fetch("error_code", "E_RUNTIME")
        }
      end
      value = computed["value"]
      {
        "ok" => true,
        "function_id" => function_id,
        "wrapper_action_id" => contract["wrapper_action_id"],
        "output_symbol" => contract["output"]["symbol"],
        "output_group" => contract["output"]["group"],
        "result" => { contract["output"]["symbol"] => value },
        "value" => value,
        "missing_args" => [],
        "error_code" => ""
      }
    end

    def self.math_abs(bound_args = {})
      run_wrapper_function(FUNCTION_IDS["MATH_ABS"], bound_args)
    end

    def self.math_add(bound_args = {})
      run_wrapper_function(FUNCTION_IDS["MATH_ADD"], bound_args)
    end

    def self.math_assign(bound_args = {})
      run_wrapper_function(FUNCTION_IDS["MATH_ASSIGN"], bound_args)
    end

    def self.math_chain_assign(bound_args = {})
      run_wrapper_function(FUNCTION_IDS["MATH_CHAIN_ASSIGN"], bound_args)
    end

    def self.math_clamp(bound_args = {})
      run_wrapper_function(FUNCTION_IDS["MATH_CLAMP"], bound_args)
    end

    def self.math_divide(bound_args = {})
      run_wrapper_function(FUNCTION_IDS["MATH_DIVIDE"], bound_args)
    end

    def self.math_equal(bound_args = {})
      run_wrapper_function(FUNCTION_IDS["MATH_EQUAL"], bound_args)
    end

    def self.math_max(bound_args = {})
      run_wrapper_function(FUNCTION_IDS["MATH_MAX"], bound_args)
    end

    def self.math_min(bound_args = {})
      run_wrapper_function(FUNCTION_IDS["MATH_MIN"], bound_args)
    end

    def self.math_multiply(bound_args = {})
      run_wrapper_function(FUNCTION_IDS["MATH_MULTIPLY"], bound_args)
    end

    def self.math_subtract(bound_args = {})
      run_wrapper_function(FUNCTION_IDS["MATH_SUBTRACT"], bound_args)
    end

    WRAPPER_FUNCTION_MAP = {
      "math.abs" => method(:math_abs),
      "math.add" => method(:math_add),
      "math.assign" => method(:math_assign),
      "math.chain_assign" => method(:math_chain_assign),
      "math.clamp" => method(:math_clamp),
      "math.divide" => method(:math_divide),
      "math.equal" => method(:math_equal),
      "math.max" => method(:math_max),
      "math.min" => method(:math_min),
      "math.multiply" => method(:math_multiply),
      "math.subtract" => method(:math_subtract)
    }.freeze
  end
end

