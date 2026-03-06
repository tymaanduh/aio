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

## Neutral Core Contracts

- Canonical neutral-core sources:
  - `data/input/shared/core/core_contract_catalog.json`
  - `data/input/shared/core/runtime_implementation_sources.json`
  - `data/input/shared/core/storage_provider_contract.json`
  - `data/input/shared/core/shell_adapter_contract.json`
- Generated conformance outputs:
  - `data/output/databases/polyglot-default/build/runtime_implementation_manifest.json`
  - `data/output/databases/polyglot-default/build/storage_backend_manifest.json`
  - `data/output/databases/polyglot-default/build/shell_adapter_manifest.json`
- Generated direct runtime bindings:
  - `data/output/databases/polyglot-default/build/generated/javascript/neutral_core.js`
  - `data/output/databases/polyglot-default/build/generated/python/neutral_core.py`
  - `data/output/databases/polyglot-default/build/generated/cpp/neutral_core.hpp`
  - `data/output/databases/polyglot-default/build/generated/cpp/neutral_core.cpp`
  - `data/output/databases/polyglot-default/build/generated/ruby/neutral_core.rb`
- Commands:
  - `npm run core:generate`
  - `npm run core:check`
  - `npm run core:validate`
- Startup runtime selection for neutral-core subsystems is benchmark-driven through the runtime implementation manifest.
- Per-call hotswap is limited to pure functions declared by the neutral-core contract.

## Script Runtime Swaps

- Stage scripts are resolved through `data/input/shared/main/polyglot_script_swap_catalog.json`.
- Local maintenance orchestration is consolidated in `scripts/run-local-token-maintenance.js` so the default low-token upkeep path executes through repository-local scripts.
- Supported runtime adapters:
  - `javascript`: native `node` execution
  - `python`: native-equivalent dispatch through `scripts/polyglot/equivalents/python/**/*.py`
  - `cpp`: compiled native-equivalent dispatch through `scripts/polyglot/equivalents/cpp/**/*.cpp` and `scripts/polyglot/swaps/cpp/native_cpp_entrypoint_runner.py`
- Runtime adapter contract:
  - Python wrappers load `_shared/native_script_runtime.py`, prefer a manual `_native/**/*.py` implementation, and only fall back to the JS entrypoint when `AIO_SCRIPT_NATIVE_ALLOW_JS_FALLBACK` permits it.
  - C++ wrappers load `_shared/native_script_runtime.hpp` and currently delegate to the matching Python equivalent after compiling the C++ entrypoint.
  - The retired `node_script_proxy` shared files are now fail-fast compatibility shims and are not the production runtime path.
- Runtime override controls:
  - `AIO_SCRIPT_RUNTIME_LANGUAGE`
  - `AIO_SCRIPT_RUNTIME_ORDER`
  - `AIO_SCRIPT_RUNTIME_DISABLE`
  - `AIO_SCRIPT_RUNTIME_STRICT`
  - `AIO_SCRIPT_RUNTIME_AUTO_BEST`
  - `AIO_SCRIPT_NATIVE_ALLOW_JS_FALLBACK`
- Runtime selection contract:
  - `workflow:general` and `workflow:preflight` default to benchmark auto-selection (`script-runtime-auto-best`).
  - `data/output/databases/polyglot-default/reports/polyglot_runtime_benchmark_report.json` must include `languages_run` for JavaScript/Python/C++.
  - `data/output/databases/polyglot-default/reports/polyglot_runtime_winner_map.json` provides winner evidence for stage runtime decisions.
- User-facing runtime-dispatched entrypoints:
  - `scripts/run-script-with-swaps.js`
  - `npm run workflow:order`
  - `npm run workflow:order:gate`
  - `npm run script-swaps:validate`
  - `npm run docs:catalog`
  - `npm run visuals:runtime`
  - `npm run docs:runtime:migration`
  - `npm run docs:generate`
  - `npm run docs:freshness:check`
  - `npm run core:generate`
  - `npm run core:check`
  - `npm run core:validate`
  - `npm run local:governance`
  - `npm run local:governance:soft`
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
- Canonical benchmark floor:
  - `data/input/shared/wrapper/runtime_benchmark_cases.json` currently maintains `11` canonical cases aligned to the `11` wrapper function IDs in the registry
  - `optimization_policy.thresholds.benchmark_min_case_count` is `11` until wrapper function coverage expands

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
- Migration coverage report:
  - `data/output/databases/polyglot-default/analysis/script_runtime_migration_report.json`
  - `docs/reference/script_runtime_migration.md`
- Native implementation coverage:
  - `script_polyglot_equivalents_catalog.json#entries[].python_native_implemented`
  - `script_polyglot_equivalents_catalog.json#metrics.python_native_implementation_count`
  - `script_polyglot_equivalents_catalog.json#entries[].cpp_dispatch_strategy`
- Current model:
  - Python is the first real non-JS script runtime lane.
  - C++ currently provides compiled entrypoint parity and delegates to Python-native implementations.
  - JS fallback remains governed and explicit instead of being the hidden implementation behind every equivalent wrapper.

## Repo Polyglot Equivalents

- Every tracked repository `.js` file also has generated runnable proxy equivalents for cross-language execution coverage.
- These artifacts are experimental compatibility coverage only and are not the canonical production runtime.
- Generator:
  - `scripts/generate-repo-polyglot-equivalents.js`
- Shared bridge:
  - `scripts/repo-polyglot-module-bridge.js`
- Catalog:
  - `data/output/databases/polyglot-default/build/repo_polyglot_equivalents_catalog.json`

## Promotion Boundary

- `aio/autopush` can receive direct automated commits when minimal safety gate passes.
- `main` never auto-promotes from `aio/autopush`; promotion is explicit/manual and must pass full gate chain.

## Required Automation Behavior

- Prompt budgets and command-first prompt contracts stay enforced by hard governance.
- Standards/ISO/UIUX evidence reports are regenerated and linked in docs.
- Automation execution remains condition-gated and event-driven; no day/time wave gating is required.
- Runtime adapter drift is monitored by strict smoke automation:
  - `.github/workflows/runtime-strict-smoke.yml`
