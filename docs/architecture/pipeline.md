# Architecture Pipeline

## Operating Model

- Execution is trigger-based and drift-based, not schedule-wave-based.
- Maintenance runs are event-driven from source updates, gate failures, and manual dispatch.
- Two lanes are maintained:
  - `main`: governed promotion lane
  - `aio/autopush`: autonomous no-review integration lane

## General Workflow Stage Order

1. `preflight`
2. `prune`
3. `uiux_blueprint`
4. `hard_governance`
5. `agent_registry_validation`
6. `wrapper_contract_gate`
7. `efficiency_gate`
8. `pipeline`
9. `separation_audit`
10. `runtime_optimization_backlog`
11. `output_format`

Source of truth: `data/input/shared/main/workflow_execution_pipeline.json`.

## Roadmap Policy Catalogs

- `data/input/shared/main/ui_component_blueprint_catalog.json`
- `data/input/shared/main/rendering_runtime_policy_catalog.json`
- `data/input/shared/main/search_strategy_routing_catalog.json`
- `data/input/shared/main/memory_data_lifecycle_policy_catalog.json`
- `data/input/shared/main/ai_automation_safety_speech_catalog.json`

## Script Runtime Swaps

- Stage scripts are resolved through `data/input/shared/main/polyglot_script_swap_catalog.json`.
- Supported runtime adapters:
  - `javascript`: native `node` execution
  - `python`: Python bridge adapter (`scripts/polyglot/swaps/python/node_script_bridge.py`)
  - `cpp`: C++ bridge adapter (`scripts/polyglot/swaps/cpp/node_script_bridge.cpp` via `cpp_node_bridge.js`)
- Runtime override controls:
  - `AIO_SCRIPT_RUNTIME_LANGUAGE`
  - `AIO_SCRIPT_RUNTIME_ORDER`
  - `AIO_SCRIPT_RUNTIME_DISABLE`
  - `AIO_SCRIPT_RUNTIME_STRICT`
  - `AIO_SCRIPT_RUNTIME_AUTO_BEST`
- Runtime selection contract:
  - `workflow:general` and `workflow:preflight` default to benchmark auto-selection (`script-runtime-auto-best`).
  - `data/output/databases/polyglot-default/reports/polyglot_runtime_benchmark_report.json` must include `languages_run` for JavaScript/Python/C++.
  - `data/output/databases/polyglot-default/reports/polyglot_runtime_winner_map.json` provides winner evidence for stage runtime decisions.
- Runtime telemetry artifact:
  - `data/output/databases/polyglot-default/analysis/script_runtime_swap_report.json`
- Runtime optimization backlog artifacts:
  - `data/output/databases/polyglot-default/plan/runtime_optimization_backlog.json`
  - `data/output/databases/polyglot-default/plan/runtime_optimization_backlog.md`
- `general-workflow` and `workflow-preflight` now use the same swap runner for script stage execution.
- Runtime selection evidence contract:
  - each stage must emit `selection.auto_best_language` and `selection.auto_best_source`
  - `auto_best_source` is `benchmark_winner_map` or `fallback_runtime_order`
  - baseline gate enforces this evidence in `standards:baseline:gate`

## Full Script Equivalents

- Every `scripts/**/*.js` entrypoint now has generated Python and C++ equivalents.
- Generation command:
  - `npm run scripts:polyglot:generate`
- Drift check command:
  - `npm run scripts:polyglot:check`
- Generated roots:
  - `scripts/polyglot/equivalents/python`
  - `scripts/polyglot/equivalents/cpp`
- Index catalog:
  - `data/output/databases/polyglot-default/build/script_polyglot_equivalents_catalog.json`

## Promotion Boundary

- `aio/autopush` can receive direct automated commits when minimal safety gate passes.
- `main` never auto-promotes from `aio/autopush`; promotion is explicit/manual and must pass full gate chain.

## Required Automation Behavior

- Prompt budgets and command-first prompt contracts stay enforced by hard governance.
- Standards/ISO/UIUX evidence reports are regenerated and linked in docs.
- Automation execution remains condition-gated and event-driven; no day/time wave gating is required.
- Runtime adapter drift is monitored by strict smoke automation:
  - `.github/workflows/runtime-strict-smoke.yml`
