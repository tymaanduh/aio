# Test Coverage Matrix

Feature-to-test linkage derived from `docs/inventory.index.json`.

| Feature ID | Subsystem | Tests Linked | Coverage State | Risk Note |
|---|---|---|---|---|
| `feature_app_legacy_shell` | App shell/UI | - | uncovered | No direct tests mapped; documented as uncovered risk. |
| `feature_renderer_boot_lifecycle` | App shell/UI | - | uncovered | No direct tests mapped; documented as uncovered risk. |
| `feature_renderer_window_shells` | App shell/UI | - | uncovered | No direct tests mapped; documented as uncovered risk. |
| `feature_renderer_core_runtime` | App shell/UI | - | uncovered | No direct tests mapped; documented as uncovered risk. |
| `feature_renderer_control_plane` | App shell/UI | - | uncovered | No direct tests mapped; documented as uncovered risk. |
| `feature_renderer_page_plane` | App shell/UI | - | uncovered | No direct tests mapped; documented as uncovered risk. |
| `feature_renderer_workers` | App shell/UI | - | uncovered | No direct tests mapped; documented as uncovered risk. |
| `feature_main_boot_lifecycle` | Main process/IPC/services | - | uncovered | No direct tests mapped; documented as uncovered risk. |
| `feature_main_data_repositories` | Main process/IPC/services | tests/repository-raw-storage.test.js<br>tests/migration-utils.test.js<br>tests/ui-preferences-utils.test.js | covered | Migration/default regressions can corrupt persisted local state if not covered by tests. |
| `feature_main_ipc_routing` | Main process/IPC/services | tests/ipc-route-bridge.test.js<br>tests/ipc-route-data.test.js<br>tests/ipc-route-shared.test.js<br>tests/preload-api-catalog-storage.test.js | covered | Channel drift between preload catalog and route registration can break runtime invocation. |
| `feature_main_domain_services` | Main process/IPC/services | - | uncovered | No direct tests mapped; documented as uncovered risk. |
| `feature_main_window_management` | Main process/IPC/services | - | uncovered | No direct tests mapped; documented as uncovered risk. |
| `feature_brain_math_engine` | Brain modules/wrappers/math | - | uncovered | No direct tests mapped; documented as uncovered risk. |
| `feature_brain_modules` | Brain modules/wrappers/math | - | uncovered | No direct tests mapped; documented as uncovered risk. |
| `feature_brain_renderer_wrappers` | Brain modules/wrappers/math | - | uncovered | No direct tests mapped; documented as uncovered risk. |
| `feature_brain_unified_wrapper` | Brain modules/wrappers/math | tests/unified-io-wrapper.test.js<br>tests/io-assembly-line-math.test.js | covered | Argument identification and stage resolution must stay deterministic across overrides and aliases. |
| `feature_data_shared_catalogs` | Data catalogs/contracts | tests/window-specs-data-source.test.js<br>tests/preload-api-catalog-storage.test.js | covered | Catalog/runtime divergence can break contract-based loading paths. |
| `feature_pipeline_orchestration` | Pipeline/gates/release scripts | - | uncovered | No direct tests mapped; documented as uncovered risk. |
| `feature_quality_gates_and_release` | Pipeline/gates/release scripts | tests/smoke-checklist.test.js<br>tests/release-candidate-bundle.test.js | covered | Stale smoke evidence can cause false confidence unless freshness policy is enforced. |
| `feature_pipeline_support_tools` | Pipeline/gates/release scripts | - | uncovered | No direct tests mapped; documented as uncovered risk. |
| `feature_dx12_toolchain` | Pipeline/gates/release scripts | - | uncovered | No direct tests mapped; documented as uncovered risk. |
| `feature_pipeline_misc_scripts` | Pipeline/gates/release scripts | - | uncovered | No direct tests mapped; documented as uncovered risk. |
| `feature_governance_agent_registry` | Governance/agents/skills | - | uncovered | No dedicated automated tests; drift is guarded by validation script output only. |
| `feature_governance_skill_registry` | Governance/agents/skills | - | uncovered | Skill docs/metadata are staging assets and can drift without runtime failures. |
| `feature_test_suite` | Test suite | tests/alias-index.test.js<br>tests/auth-quick-login.test.js<br>tests/command-palette-utils.test.js<br>tests/diagnostics-utils.test.js<br>+30 more | covered | Coverage is broad but not complete for every governance staging artifact. |

## Subsystem Coverage Totals

| Subsystem | Features | Covered Features | Uncovered Features |
|---|---:|---:|---:|
| App shell/UI | 7 | 0 | 7 |
| Main process/IPC/services | 5 | 2 | 3 |
| Brain modules/wrappers/math | 4 | 1 | 3 |
| Data catalogs/contracts | 1 | 1 | 0 |
| Pipeline/gates/release scripts | 5 | 1 | 4 |
| Governance/agents/skills | 2 | 0 | 2 |
| Test suite | 1 | 1 | 0 |

## Gap Policy

- Uncovered features are acceptable only when risk notes are explicit and gate scripts still validate contract integrity.
- Add direct tests when a feature moves from `internal/staging` to `active` runtime-critical status.
