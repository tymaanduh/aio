# frozen_string_literal: true

require "json"
require_relative "wrapper_symbols"

module Aio
  module NeutralCore
    CORE_CONTRACT_CATALOG = JSON.parse(<<~'JSON')
{
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
}
    JSON

    FUNCTION_IDS = Aio::WrapperSymbols::FUNCTION_IDS.dup.freeze
    PURE_FUNCTION_IDS = ["math.abs", "math.add", "math.assign", "math.chain_assign", "math.clamp", "math.divide", "math.equal", "math.max", "math.min", "math.multiply", "math.subtract"].freeze

    def self.get_subsystem_contract(subsystem_id)
      CORE_CONTRACT_CATALOG.fetch("subsystems", {})[String(subsystem_id || "")]
    end

    def self.run_math_function(function_id, bound_args = {})
      Aio::WrapperSymbols.run_wrapper_function(function_id, bound_args || {})
    end

    def self.math_abs(bound_args = {})
      run_math_function(FUNCTION_IDS["MATH_ABS"], bound_args || {})
    end

    def self.math_add(bound_args = {})
      run_math_function(FUNCTION_IDS["MATH_ADD"], bound_args || {})
    end

    def self.math_assign(bound_args = {})
      run_math_function(FUNCTION_IDS["MATH_ASSIGN"], bound_args || {})
    end

    def self.math_chain_assign(bound_args = {})
      run_math_function(FUNCTION_IDS["MATH_CHAIN_ASSIGN"], bound_args || {})
    end

    def self.math_clamp(bound_args = {})
      run_math_function(FUNCTION_IDS["MATH_CLAMP"], bound_args || {})
    end

    def self.math_divide(bound_args = {})
      run_math_function(FUNCTION_IDS["MATH_DIVIDE"], bound_args || {})
    end

    def self.math_equal(bound_args = {})
      run_math_function(FUNCTION_IDS["MATH_EQUAL"], bound_args || {})
    end

    def self.math_max(bound_args = {})
      run_math_function(FUNCTION_IDS["MATH_MAX"], bound_args || {})
    end

    def self.math_min(bound_args = {})
      run_math_function(FUNCTION_IDS["MATH_MIN"], bound_args || {})
    end

    def self.math_multiply(bound_args = {})
      run_math_function(FUNCTION_IDS["MATH_MULTIPLY"], bound_args || {})
    end

    def self.math_subtract(bound_args = {})
      run_math_function(FUNCTION_IDS["MATH_SUBTRACT"], bound_args || {})
    end

    class << self
      alias run_wrapper_function run_math_function
    end
  end
end
