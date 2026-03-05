# Wrapper Contracts

## Contract Sources

- Function contracts: `data/input/shared/wrapper/function_contracts.json`
- Wrapper spec: `data/input/shared/wrapper/unified_wrapper_specs.json`
- Symbol registry: `data/input/shared/wrapper/wrapper_symbol_registry.json`
- Runtime benchmark cases: `data/input/shared/wrapper/runtime_benchmark_cases.json`
- Script swap catalog: `data/input/shared/main/polyglot_script_swap_catalog.json`
- Script swap telemetry report: `data/output/databases/polyglot-default/analysis/script_runtime_swap_report.json`
- Runtime optimization backlog: `data/output/databases/polyglot-default/plan/runtime_optimization_backlog.json`
- Script equivalent catalog: `data/output/databases/polyglot-default/build/script_polyglot_equivalents_catalog.json`

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
- Function language plan is under `data/output/databases/polyglot-default/reports/polyglot_function_language_plan.json`.
- Runtime dispatch catalog is under `data/output/databases/polyglot-default/build/polyglot_runtime_dispatch_catalog.json`.
- Default benchmark language set must run `javascript`, `python`, and `cpp`.
- Winner mapping contract:
  - `winner_mapping.per_case`: fastest language per benchmark case (`case_id`).
  - `winner_mapping.per_function`: fastest language per function ID aggregated across matching cases.
  - `winner_mapping.overall_winner_language`: fastest language by total benchmark runtime.
- Function language plan contract:
  - `function_language_plan.assignments`: per-function selected runtime language.
  - `function_language_plan.assignments[].selected_language`: language to route the function to.
  - `function_language_plan.assignments[].selection_reason`: `benchmark_winner`, `default_primary`, or `default_fallback`.
- Runtime dispatch catalog contract:
  - `dispatch_index.<function_id>.resolved_language`: final language used at runtime after fallback resolution.
  - `dispatch_index.<function_id>.resolved_symbol`: callable symbol to invoke in that language.
  - `name_index`: centralized function/object/symbol/const naming for plug-and-play runtime integration.
- Script stage runtime telemetry contract:
  - `stages[].selection.auto_select_enabled`: whether benchmark-driven auto-best selection was enabled.
  - `stages[].selection.auto_best_language`: selected benchmark winner language candidate for the stage.
  - `stages[].selection.resolved_order`: final runtime attempt order used by the stage.
- Full script equivalent contract:
  - `scripts/polyglot/equivalents/python/**/*.py` and `scripts/polyglot/equivalents/cpp/**/*.cpp` are generated 1:1 proxies for `scripts/**/*.js`.
  - File naming is snake_case for Python/C++ wrappers and is mapped in `script_polyglot_equivalents_catalog.json`.
  - Equivalents must pass `npm run scripts:polyglot:check`.

## Validation Commands

- `npm run contracts:validate`
- `npm run wrappers:check`
- `npm run benchmark:runtime`
- `npm run workflow:preflight`
