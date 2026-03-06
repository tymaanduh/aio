# Script Runtime Migration

- Generated at: 2026-03-06T22:18:48.490500Z
- Script equivalents catalog: `data/output/databases/polyglot-default/build/script_polyglot_equivalents_catalog.json`
- Package manifest: `package.json`
- Generated script entries: 58
- Python equivalents: 59
- C++ equivalents: 59
- Native Python implementations: 34
- C++ native dispatch entrypoints: 58
- C++ entrypoints dispatching straight to Python-native implementations: 34
- C++ entrypoints still delegating to generated Python wrappers: 24
- Package scripts using Python equivalents: 67
- Package scripts still invoking `node scripts/...`: 0

## Current Runtime Model

- Python entrypoints are the default CLI lane for generated script equivalents.
- C++ entrypoints compile to a native launcher and dispatch straight to the Python-native implementation when one exists.
- Remaining C++ entrypoints delegate to the generated Python equivalent, which can still use governed JS fallback when no native Python implementation exists.
- JS fallback remains explicit and governed through `AIO_SCRIPT_NATIVE_ALLOW_JS_FALLBACK`.

## Native Python Implementations

- `agent_access_request`
- `agent_workflow_shards`
- `build_agent_workflow_shards`
- `codex_desktop_sync`
- `codex_efficiency_audit`
- `docs_freshness_check`
- `general_workflow`
- `generate_documentation_suite`
- `generate_file_catalog_docs`
- `generate_neutral_core_assets`
- `generate_runtime_optimization_backlog`
- `generate_runtime_visuals`
- `generate_script_polyglot_equivalents`
- `hard_governance_gate`
- `lib_agent_access_policy`
- `lib_polyglot_script_swap_runner`
- `lib_robust_file_write`
- `lib_routing_policy`
- `optimize_codex_automations`
- `polyglot_runtime_benchmark`
- `project_source_resolver`
- `prune_workflow_artifacts`
- `refactor_blocking_gate`
- `repo_update_log`
- `run_local_governance`
- `run_local_token_maintenance`
- `run_script_with_swaps`
- `sync_agent_skill_scope`
- `validate_agent_registry`
- `validate_codex_desktop_compat`
- `validate_neutral_core_contracts`
- `validate_script_swap_catalog`
- `validate_workflow_pipeline_order`
- `workflow_preflight`

## Remaining Python Native Gaps

- `data_separation_audit`
- `dx12_build_mingw`
- `dx12_configure_mingw`
- `dx12_doctor`
- `dx12_install_wsl_prereqs`
- `dx12_tools`
- `generate_repo_polyglot_equivalents`
- `generate_uiux_blueprint`
- `generate_wrapper_polyglot_bindings`
- `iso_standards_compliance_gate`
- `lib_documentation_decision_changelog`
- `lib_in_process_script_runner`
- `polyglot_default_pipeline`
- `polyglot_swaps_cpp_cpp_node_bridge`
- `quick_check`
- `repo_polyglot_module_bridge`
- `reset_and_benchmark_polyglot_runtime`
- `reset_runtime_benchmark_cases`
- `run_electron`
- `run_unified_wrapper`
- `standards_baseline_gate`
- `test_app`
- `validate_wrapper_contracts`
- `word_machine_descriptor_compile`

## C++ Direct Native Dispatch

- `agent_access_request`
- `agent_workflow_shards`
- `build_agent_workflow_shards`
- `codex_desktop_sync`
- `codex_efficiency_audit`
- `docs_freshness_check`
- `general_workflow`
- `generate_documentation_suite`
- `generate_file_catalog_docs`
- `generate_neutral_core_assets`
- `generate_runtime_optimization_backlog`
- `generate_runtime_visuals`
- `generate_script_polyglot_equivalents`
- `hard_governance_gate`
- `lib_agent_access_policy`
- `lib_polyglot_script_swap_runner`
- `lib_robust_file_write`
- `lib_routing_policy`
- `optimize_codex_automations`
- `polyglot_runtime_benchmark`
- `project_source_resolver`
- `prune_workflow_artifacts`
- `refactor_blocking_gate`
- `repo_update_log`
- `run_local_governance`
- `run_local_token_maintenance`
- `run_script_with_swaps`
- `sync_agent_skill_scope`
- `validate_agent_registry`
- `validate_codex_desktop_compat`
- `validate_neutral_core_contracts`
- `validate_script_swap_catalog`
- `validate_workflow_pipeline_order`
- `workflow_preflight`

## Package Entry Points Using Python Equivalents

- `agent:request-access` -> `python scripts/polyglot/equivalents/python/agent_access_request.py`
- `agents:scope-sync` -> `python scripts/polyglot/equivalents/python/sync_agent_skill_scope.py`
- `agents:validate` -> `python scripts/polyglot/equivalents/python/validate_agent_registry.py`
- `audit:data-separation` -> `python scripts/polyglot/equivalents/python/data_separation_audit.py`
- `automations:audit` -> `python scripts/polyglot/equivalents/python/optimize_codex_automations.py`
- `automations:optimize` -> `python scripts/polyglot/equivalents/python/optimize_codex_automations.py --apply`
- `benchmark:cases:reset` -> `python scripts/polyglot/equivalents/python/reset_runtime_benchmark_cases.py`
- `benchmark:reset-and-run` -> `python scripts/polyglot/equivalents/python/reset_and_benchmark_polyglot_runtime.py`
- `benchmark:runtime` -> `python scripts/polyglot/equivalents/python/polyglot_runtime_benchmark.py`
- `codex:desktop:sync` -> `python scripts/polyglot/equivalents/python/sync_agent_skill_scope.py && python scripts/polyglot/equivalents/python/validate_codex_desktop_compat.py && python scripts/polyglot/equivalents/python/validate_agent_registry.py && python scripts/polyglot/equivalents/python/codex_desktop_sync.py`
- `codex:desktop:sync:dry-run` -> `python scripts/polyglot/equivalents/python/sync_agent_skill_scope.py && python scripts/polyglot/equivalents/python/validate_codex_desktop_compat.py && python scripts/polyglot/equivalents/python/validate_agent_registry.py && python scripts/polyglot/equivalents/python/codex_desktop_sync.py --dry-run`
- `codex:desktop:validate` -> `python scripts/polyglot/equivalents/python/validate_codex_desktop_compat.py && python scripts/polyglot/equivalents/python/validate_agent_registry.py`
- `contracts:validate` -> `python scripts/polyglot/equivalents/python/validate_wrapper_contracts.py`
- `core:check` -> `python scripts/polyglot/equivalents/python/generate_neutral_core_assets.py --check`
- `core:generate` -> `python scripts/polyglot/equivalents/python/generate_neutral_core_assets.py`
- `core:validate` -> `python scripts/polyglot/equivalents/python/validate_neutral_core_contracts.py`
- `dev` -> `python scripts/polyglot/equivalents/python/run_electron.py`
- `dictionary:compile:descriptors` -> `python scripts/polyglot/equivalents/python/word_machine_descriptor_compile.py`
- `docs:catalog` -> `python scripts/polyglot/equivalents/python/generate_file_catalog_docs.py`
- `docs:freshness:check` -> `python scripts/polyglot/equivalents/python/docs_freshness_check.py --enforce`
- `docs:generate` -> `python scripts/polyglot/equivalents/python/generate_documentation_suite.py`
- `docs:runtime:migration` -> `python scripts/polyglot/equivalents/python/_native/generate_script_runtime_migration_report.py`
- `dx12:build:mingw` -> `python scripts/polyglot/equivalents/python/dx12_build_mingw.py`
- `dx12:configure:mingw` -> `python scripts/polyglot/equivalents/python/dx12_configure_mingw.py`
- `dx12:doctor` -> `python scripts/polyglot/equivalents/python/dx12_doctor.py`
- `dx12:install:wsl-prereqs` -> `python scripts/polyglot/equivalents/python/dx12_install_wsl_prereqs.py`
- `efficiency:audit` -> `python scripts/polyglot/equivalents/python/codex_efficiency_audit.py`
- `efficiency:gate` -> `python scripts/polyglot/equivalents/python/codex_efficiency_audit.py --enforce`
- `governance:hard` -> `python scripts/polyglot/equivalents/python/hard_governance_gate.py`
- `governance:hard:gate` -> `python scripts/polyglot/equivalents/python/hard_governance_gate.py --enforce`
- `local:governance` -> `python scripts/polyglot/equivalents/python/run_local_governance.py --strict`
- `local:governance:soft` -> `python scripts/polyglot/equivalents/python/run_local_governance.py`
- `optimization:backlog` -> `python scripts/polyglot/equivalents/python/generate_runtime_optimization_backlog.py`
- `polyglot:create` -> `python scripts/polyglot/equivalents/python/polyglot_default_pipeline.py --mode create`
- `polyglot:default` -> `python scripts/polyglot/equivalents/python/polyglot_default_pipeline.py`
- `polyglot:maintain` -> `python scripts/polyglot/equivalents/python/polyglot_default_pipeline.py --mode maintain`
- `refactor:gate` -> `python scripts/polyglot/equivalents/python/refactor_blocking_gate.py`
- `repo:polyglot:check` -> `python scripts/polyglot/equivalents/python/generate_repo_polyglot_equivalents.py --check`
- `repo:polyglot:generate` -> `python scripts/polyglot/equivalents/python/generate_repo_polyglot_equivalents.py`
- `script-swaps:validate` -> `python scripts/polyglot/equivalents/python/validate_script_swap_catalog.py`
- `scripts:polyglot:check` -> `python scripts/polyglot/equivalents/python/generate_script_polyglot_equivalents.py --check`
- `scripts:polyglot:generate` -> `python scripts/polyglot/equivalents/python/generate_script_polyglot_equivalents.py`
- `standards:baseline` -> `python scripts/polyglot/equivalents/python/standards_baseline_gate.py`
- `standards:baseline:gate` -> `python scripts/polyglot/equivalents/python/standards_baseline_gate.py --enforce`
- `standards:iso` -> `python scripts/polyglot/equivalents/python/iso_standards_compliance_gate.py`
- `standards:iso:gate` -> `python scripts/polyglot/equivalents/python/iso_standards_compliance_gate.py --enforce`
- `start` -> `python scripts/polyglot/equivalents/python/run_electron.py`
- `token:maintain` -> `python scripts/polyglot/equivalents/python/run_local_token_maintenance.py --strict`
- `token:maintain:soft` -> `python scripts/polyglot/equivalents/python/run_local_token_maintenance.py`
- `uiux:blueprint` -> `python scripts/polyglot/equivalents/python/generate_uiux_blueprint.py`
- `uiux:blueprint:check` -> `python scripts/polyglot/equivalents/python/generate_uiux_blueprint.py --check --enforce`
- `updates:scan` -> `python scripts/polyglot/equivalents/python/repo_update_log.py scan`
- `updates:watch` -> `python scripts/polyglot/equivalents/python/repo_update_log.py watch`
- `visuals:runtime` -> `python scripts/polyglot/equivalents/python/generate_runtime_visuals.py`
- `workflow:continue` -> `python scripts/polyglot/equivalents/python/general_workflow.py --mode maintain`
- `workflow:cpp` -> `python scripts/polyglot/equivalents/python/general_workflow.py --mode maintain --script-runtime cpp --script-runtime-order cpp,python,javascript`
- `workflow:fast` -> `python scripts/polyglot/equivalents/python/general_workflow.py --mode maintain --fast --skip-preflight --skip-output-format`
- `workflow:general` -> `python scripts/polyglot/equivalents/python/general_workflow.py --mode auto`
- `workflow:order` -> `python scripts/polyglot/equivalents/python/validate_workflow_pipeline_order.py`
- `workflow:order:gate` -> `python scripts/polyglot/equivalents/python/validate_workflow_pipeline_order.py --enforce`
- `workflow:preflight` -> `python scripts/polyglot/equivalents/python/workflow_preflight.py`
- `workflow:prune` -> `python scripts/polyglot/equivalents/python/prune_workflow_artifacts.py`
- `workflow:python` -> `python scripts/polyglot/equivalents/python/general_workflow.py --mode maintain --script-runtime python --script-runtime-order python,cpp,javascript`
- `workflow:shards` -> `python scripts/polyglot/equivalents/python/build_agent_workflow_shards.py`
- `wrapper:run` -> `python scripts/polyglot/equivalents/python/run_unified_wrapper.py`
- `wrappers:check` -> `python scripts/polyglot/equivalents/python/generate_wrapper_polyglot_bindings.py --check`
- `wrappers:generate` -> `python scripts/polyglot/equivalents/python/generate_wrapper_polyglot_bindings.py`

## Package Entry Points Still Direct Node


_This file is generated by the Python-native documentation suite._
