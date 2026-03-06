"""Generated neutral core bindings for Python."""

from __future__ import annotations

import importlib.util
import json
import pathlib


def _load_wrapper_symbols():
    module_path = pathlib.Path(__file__).resolve().with_name("wrapper_symbols.py")
    spec = importlib.util.spec_from_file_location("aio_wrapper_symbols", module_path)
    if spec is None or spec.loader is None:
        raise RuntimeError("unable to load wrapper_symbols.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


_WRAPPER_SYMBOLS = _load_wrapper_symbols()
CORE_CONTRACT_CATALOG = json.loads(r'''{
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
}''')
FUNCTION_IDS = dict(getattr(_WRAPPER_SYMBOLS, "FUNCTION_IDS", {}))
PURE_FUNCTION_IDS = tuple(["math.abs", "math.add", "math.assign", "math.chain_assign", "math.clamp", "math.divide", "math.equal", "math.max", "math.min", "math.multiply", "math.subtract"])


def get_subsystem_contract(subsystem_id: str):
    return CORE_CONTRACT_CATALOG.get("subsystems", {}).get(str(subsystem_id or ""))


def run_math_function(function_id: str, bound_args=None):
    return _WRAPPER_SYMBOLS.run_wrapper_function(function_id, bound_args or {})


def math_abs(bound_args=None):
    return run_math_function(FUNCTION_IDS["MATH_ABS"], bound_args or {})

def math_add(bound_args=None):
    return run_math_function(FUNCTION_IDS["MATH_ADD"], bound_args or {})

def math_assign(bound_args=None):
    return run_math_function(FUNCTION_IDS["MATH_ASSIGN"], bound_args or {})

def math_chain_assign(bound_args=None):
    return run_math_function(FUNCTION_IDS["MATH_CHAIN_ASSIGN"], bound_args or {})

def math_clamp(bound_args=None):
    return run_math_function(FUNCTION_IDS["MATH_CLAMP"], bound_args or {})

def math_divide(bound_args=None):
    return run_math_function(FUNCTION_IDS["MATH_DIVIDE"], bound_args or {})

def math_equal(bound_args=None):
    return run_math_function(FUNCTION_IDS["MATH_EQUAL"], bound_args or {})

def math_max(bound_args=None):
    return run_math_function(FUNCTION_IDS["MATH_MAX"], bound_args or {})

def math_min(bound_args=None):
    return run_math_function(FUNCTION_IDS["MATH_MIN"], bound_args or {})

def math_multiply(bound_args=None):
    return run_math_function(FUNCTION_IDS["MATH_MULTIPLY"], bound_args or {})

def math_subtract(bound_args=None):
    return run_math_function(FUNCTION_IDS["MATH_SUBTRACT"], bound_args or {})

run_wrapper_function = run_math_function
