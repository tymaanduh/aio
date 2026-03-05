# Wrapper Contracts

## Contract Sources

- Function contracts: `data/input/shared/wrapper/function_contracts.json`
- Wrapper spec: `data/input/shared/wrapper/unified_wrapper_specs.json`
- Symbol registry: `data/input/shared/wrapper/wrapper_symbol_registry.json`
- Runtime benchmark cases: `data/input/shared/wrapper/runtime_benchmark_cases.json`

## Runtime Contract

- One logical operation per wrapper function ID.
- Wrappers are adapters; data catalogs are the source of truth.
- Two-pass order is mandatory:
  1. `identify_arguments`
  2. `execute_pipeline`

## Polyglot Bindings and Benchmark

- Generated bindings are under `data/output/databases/polyglot-default/build/generated/`.
- Benchmark report is under `data/output/databases/polyglot-default/reports/polyglot_runtime_benchmark_report.json`.
- Benchmark winner map is under `data/output/databases/polyglot-default/reports/polyglot_runtime_winner_map.json`.
- Default benchmark language set must run `javascript`, `python`, and `cpp`.
- Winner mapping contract:
  - `winner_mapping.per_case`: fastest language per benchmark case (`case_id`).
  - `winner_mapping.per_function`: fastest language per function ID aggregated across matching cases.
  - `winner_mapping.overall_winner_language`: fastest language by total benchmark runtime.

## Validation Commands

- `npm run contracts:validate`
- `npm run wrappers:check`
- `npm run benchmark:runtime`
