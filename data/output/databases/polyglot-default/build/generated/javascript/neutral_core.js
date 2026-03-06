"use strict";

const wrapperSymbols = require("./wrapper_symbols.js");

const CORE_CONTRACT_CATALOG = Object.freeze({
  "schema_version": 1,
  "catalog_id": "aio_core_contract_catalog",
  "contract_version": "2026-03-06",
  "default_swap_policy": {
    "startup_selection": "benchmark_select_fastest_healthy",
    "subsystem_hotswap": "controlled_reload_only",
    "per_call_hotswap": "pure_operation_only"
  },
  "subsystems": {
    "math_core": {
      "subsystem_id": "math_core",
      "role": "neutral_compute",
      "state_model": "stateless",
      "side_effect_model": "pure",
      "contract_source": {
        "function_contracts": "data/input/shared/wrapper/function_contracts.json",
        "behavior_specs": "data/input/shared/wrapper/function_behavior_specs.json",
        "benchmark_cases": "data/input/shared/wrapper/runtime_benchmark_cases.json",
        "wrapper_registry": "data/input/shared/wrapper/wrapper_symbol_registry.json"
      },
      "pure_function_ids": [
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
      "allowed_swap_modes": [
        "startup",
        "subsystem",
        "per_call"
      ],
      "benchmark_identity": "polyglot_wrapper_math_core"
    },
    "storage_core": {
      "subsystem_id": "storage_core",
      "role": "persistence",
      "state_model": "stateful",
      "side_effect_model": "persistent_io",
      "contract_source": {
        "storage_provider_contract": "data/input/shared/core/storage_provider_contract.json",
        "repository_manifest_catalog": "data/input/shared/main/repository_manifest_catalog.json"
      },
      "required_backends": [
        "memory",
        "raw_file",
        "sqlite"
      ],
      "allowed_swap_modes": [
        "startup"
      ],
      "compatibility_mode": "legacy_file_mirror"
    },
    "shell_core": {
      "subsystem_id": "shell_core",
      "role": "shell_abi",
      "state_model": "shell_control",
      "side_effect_model": "ui_io",
      "contract_source": {
        "shell_adapter_contract": "data/input/shared/core/shell_adapter_contract.json"
      },
      "supported_shells": [
        "electron",
        "winui",
        "winforms",
        "qt"
      ],
      "allowed_swap_modes": [
        "startup"
      ]
    }
  }
});
const FUNCTION_IDS = Object.freeze({ ...wrapperSymbols.FUNCTION_IDS });
const PURE_FUNCTION_IDS = Object.freeze([
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
  "math.subtract",
]);

function getSubsystemContract(subsystemId) {
  return CORE_CONTRACT_CATALOG.subsystems[String(subsystemId || "")] || null;
}

function runMathFunction(functionId, boundArgs = {}) {
  return wrapperSymbols.runWrapperFunction(functionId, boundArgs);
}

function mathAbs(boundArgs = {}) {
  return runMathFunction(FUNCTION_IDS.MATH_ABS, boundArgs);
}

function mathAdd(boundArgs = {}) {
  return runMathFunction(FUNCTION_IDS.MATH_ADD, boundArgs);
}

function mathAssign(boundArgs = {}) {
  return runMathFunction(FUNCTION_IDS.MATH_ASSIGN, boundArgs);
}

function mathChainAssign(boundArgs = {}) {
  return runMathFunction(FUNCTION_IDS.MATH_CHAIN_ASSIGN, boundArgs);
}

function mathClamp(boundArgs = {}) {
  return runMathFunction(FUNCTION_IDS.MATH_CLAMP, boundArgs);
}

function mathDivide(boundArgs = {}) {
  return runMathFunction(FUNCTION_IDS.MATH_DIVIDE, boundArgs);
}

function mathEqual(boundArgs = {}) {
  return runMathFunction(FUNCTION_IDS.MATH_EQUAL, boundArgs);
}

function mathMax(boundArgs = {}) {
  return runMathFunction(FUNCTION_IDS.MATH_MAX, boundArgs);
}

function mathMin(boundArgs = {}) {
  return runMathFunction(FUNCTION_IDS.MATH_MIN, boundArgs);
}

function mathMultiply(boundArgs = {}) {
  return runMathFunction(FUNCTION_IDS.MATH_MULTIPLY, boundArgs);
}

function mathSubtract(boundArgs = {}) {
  return runMathFunction(FUNCTION_IDS.MATH_SUBTRACT, boundArgs);
}

module.exports = {
  CORE_CONTRACT_CATALOG,
  FUNCTION_IDS,
  PURE_FUNCTION_IDS,
  getSubsystemContract,
  runMathFunction,
  mathAbs,
  mathAdd,
  mathAssign,
  mathChainAssign,
  mathClamp,
  mathDivide,
  mathEqual,
  mathMax,
  mathMin,
  mathMultiply,
  mathSubtract,
  runWrapperFunction: runMathFunction
};
