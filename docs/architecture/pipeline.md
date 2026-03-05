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
10. `output_format`

Source of truth: `data/input/shared/main/workflow_execution_pipeline.json`.

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
- `general-workflow` and `workflow-preflight` now use the same swap runner for script stage execution.

## Promotion Boundary

- `aio/autopush` can receive direct automated commits when minimal safety gate passes.
- `main` never auto-promotes from `aio/autopush`; promotion is explicit/manual and must pass full gate chain.

## Required Automation Behavior

- Prompt budgets and command-first prompt contracts stay enforced by hard governance.
- Standards/ISO/UIUX evidence reports are regenerated and linked in docs.
