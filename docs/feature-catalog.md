# Feature Catalog

Canonical feature inventory generated from `docs/inventory.index.json` using tracked source files in scoped paths.

- Generated at: 2026-03-05T01:58:20.720Z
- Scoped files: 336
- Features: 25

## App shell/UI

| Feature | Status | User Value | Owner Files | API/Storage Touchpoints | Tests |
|---|---|---|---|---|---|
| `feature_app_legacy_shell`<br>Legacy app shell UI | active | Maintains legacy shell compatibility and app chrome behavior. | app/index.html<br>app/logs.html<br>app/logs.js<br>app/renderer.js<br>+1 more | - | (uncovered: see risk notes) |
| `feature_renderer_boot_lifecycle`<br>Renderer lifecycle bootstrap | active | Deterministic app/page/control load order across renderer windows. | renderer/boot/app_bootstrap.js<br>renderer/boot/app_post_load.js<br>renderer/boot/app_pre_load.js<br>renderer/boot/legacy_module_loader.js<br>+5 more | - | (uncovered: see risk notes) |
| `feature_renderer_window_shells`<br>Renderer window shells | active | Main/log window host shells and view wiring. | renderer/views/logs_window.html<br>renderer/views/main_window.html<br>renderer/windows/logs_window/legacy_logs_bridge.js<br>renderer/windows/logs_window/window_post_load.js<br>+6 more | - | (uncovered: see risk notes) |
| `feature_renderer_core_runtime`<br>Renderer core runtime registries | active | Centralized constants, registries, and DOM dictionaries for renderer behavior. | renderer/core/alias_index.js<br>renderer/core/constants.js<br>renderer/core/dom_registry.js<br>renderer/core/load_hook_registry.js<br>+5 more | - | (uncovered: see risk notes) |
| `feature_renderer_control_plane`<br>Renderer control modules | active | Command palette, graph, tree, and universe controls. | renderer/controls/command_palette_control/control_controller.js<br>renderer/controls/command_palette_control/control_post_load.js<br>renderer/controls/command_palette_control/control_pre_load.js<br>renderer/controls/graph_control/control_controller.js<br>+8 more | - | (uncovered: see risk notes) |
| `feature_renderer_page_plane`<br>Renderer page modules | active | Workbench, sentence graph, statistics, and universe page lifecycle logic. | renderer/pages/sentence_graph_page/page_controller.js<br>renderer/pages/sentence_graph_page/page_post_load.js<br>renderer/pages/sentence_graph_page/page_pre_load.js<br>renderer/pages/statistics_page/page_controller.js<br>+8 more | - | (uncovered: see risk notes) |
| `feature_renderer_workers`<br>Renderer workers | active | Background worker execution for heavy renderer computations. | renderer/workers/stats_worker.js<br>renderer/workers/word_universe_worker.js | - | (uncovered: see risk notes) |

## Main process/IPC/services

| Feature | Status | User Value | Owner Files | API/Storage Touchpoints | Tests |
|---|---|---|---|---|---|
| `feature_main_boot_lifecycle`<br>Main process boot lifecycle | active | Ensures pre-load/post-load and app boot orchestration is deterministic. | main/boot/app_boot_runtime.js<br>main/boot/app_boot_specs.js<br>main/boot/app_bootstrap.js<br>main/boot/app_hook_shared.js<br>+2 more | - | (uncovered: see risk notes) |
| `feature_main_data_repositories`<br>Main data repository layer | active | Persistent state, migration, and domain repository management. | main/data-io.js<br>main/data/data_hook_shared.js<br>main/data/data_migrate_specs.js<br>main/data/data_migrate_v0_to_v1.js<br>+13 more | IPC: DICTIONARY_LOAD, DICTIONARY_SAVE, STORAGE_*<br>Storage: app_state.json, auth_state.json, diagnostics_state.json, universe_cache.json, ui_preferences.json, language_bridge_state.json<br>Cmd: npm run raw-storage:harness | tests/repository-raw-storage.test.js<br>tests/migration-utils.test.js<br>tests/ui-preferences-utils.test.js |
| `feature_main_ipc_routing`<br>Main IPC contract and routing | active | Stable channel contract across auth/data/diagnostics/universe/storage/UI/bridge/gpu/runtime log. | main/ipc-contract.js<br>main/ipc/ipc_channels.js<br>main/ipc/ipc_events.js<br>main/ipc/ipc_register.js<br>+9 more | IPC: AUTH_*, DICTIONARY_*, DIAGNOSTICS_*, UNIVERSE_*, STORAGE_*, BRIDGE_*, GPU_* | tests/ipc-route-bridge.test.js<br>tests/ipc-route-data.test.js<br>tests/ipc-route-shared.test.js<br>+1 more |
| `feature_main_domain_services`<br>Main domain services and normalization | active | Service adapters and normalization pipelines for safe state handling. | main/auth.js<br>main/gpu-config.js<br>main/normalize.js<br>main/normalize_auth_domain.js<br>+13 more | - | (uncovered: see risk notes) |
| `feature_main_window_management`<br>Main window management | active | Main/log window creation, hooks, and registry control. | main/windows/logs_window_create.js<br>main/windows/main_window_create.js<br>main/windows/window_create_wrapper.js<br>main/windows/window_creator_registry.js<br>+6 more | - | (uncovered: see risk notes) |

## Brain modules/wrappers/math

| Feature | Status | User Value | Owner Files | API/Storage Touchpoints | Tests |
|---|---|---|---|---|---|
| `feature_brain_math_engine`<br>Brain math engine | active | Math primitives and assembly-line operation execution. | brain/math/camera_math.js<br>brain/math/graph_math.js<br>brain/math/io_assembly_line_math.js<br>brain/math/projection_math.js<br>+1 more | - | (uncovered: see risk notes) |
| `feature_brain_modules`<br>Brain module utility layer | active | Shared renderer/data utility modules and domain helpers. | brain/README.md<br>brain/modules/alias-index.js<br>brain/modules/auth-utils.js<br>brain/modules/autosave-utils.js<br>+25 more | - | (uncovered: see risk notes) |
| `feature_brain_renderer_wrappers`<br>Brain renderer domain wrappers | active | Domain wrapper orchestration for renderer actions and dispatch. | brain/wrappers/renderer_command_domain.js<br>brain/wrappers/renderer_diagnostics_domain.js<br>brain/wrappers/renderer_dispatch_domain.js<br>brain/wrappers/renderer_events_domain.js<br>+15 more | - | (uncovered: see risk notes) |
| `feature_brain_unified_wrapper`<br>Unified two-pass wrapper runtime | active | Single wrapper entrypoint for identify-then-execute pipelines. | brain/wrappers/unified_io_wrapper.js | Cmd: npm run wrapper:run | tests/unified-io-wrapper.test.js<br>tests/io-assembly-line-math.test.js |

## Data catalogs/contracts

| Feature | Status | User Value | Owner Files | API/Storage Touchpoints | Tests |
|---|---|---|---|---|---|
| `feature_data_shared_catalogs`<br>Shared input catalog system | active | Source-of-truth catalogs for IPC, renderer, wrapper, math, and main contracts. | data/input/shared/alias/alias_groups.js<br>data/input/shared/ipc/bridge_route_catalog.json<br>data/input/shared/ipc/ipc_channels_catalog.json<br>data/input/shared/ipc/preload_api_catalog.json<br>+20 more | Storage: repository_manifest_catalog.json, preload_api_catalog.json, unified_wrapper_specs.json<br>Cmd: npm run audit:data-separation | tests/window-specs-data-source.test.js<br>tests/preload-api-catalog-storage.test.js |

## Pipeline/gates/release scripts

| Feature | Status | User Value | Owner Files | API/Storage Touchpoints | Tests |
|---|---|---|---|---|---|
| `feature_pipeline_orchestration`<br>Pipeline orchestration scripts | active | Default workflow orchestration, planning, and maintain pipeline control. | scripts/general-workflow.js<br>scripts/polyglot-default-pipeline.js<br>scripts/project-source-resolver.js | - | (uncovered: see risk notes) |
| `feature_quality_gates_and_release`<br>Quality gates and release evidence | active | Premerge, refactor, smoke, release evidence, and candidate gating. | scripts/commit-slice-report.js<br>scripts/data-separation-audit.js<br>scripts/premerge-checklist.js<br>scripts/refactor-blocking-gate.js<br>+3 more | Storage: smoke_checklist_report.json, release_evidence_bundle.json, release_candidate_bundle.json, commit_slice_report.json<br>Cmd: npm run premerge:checklist, npm run release:evidence, npm run release:candidate | tests/smoke-checklist.test.js<br>tests/release-candidate-bundle.test.js |
| `feature_pipeline_support_tools`<br>Pipeline support tooling | internal | Auxiliary tooling for wrapper runs, update scans, and quick checks. | scripts/agent-access-request.js<br>scripts/quick-check.js<br>scripts/raw-storage-harness.js<br>scripts/repo-update-log.js<br>+3 more | - | (uncovered: see risk notes) |
| `feature_dx12_toolchain`<br>DX12 and GPU setup tooling | experimental | Local DX12 environment setup and diagnostic helper scripts. | scripts/dx12-build-mingw.js<br>scripts/dx12-configure-mingw.js<br>scripts/dx12-doctor.js<br>scripts/dx12-install-wsl-prereqs.js<br>+1 more | - | (uncovered: see risk notes) |
| `feature_pipeline_misc_scripts`<br>Miscellaneous pipeline scripts | internal | Supporting automation scripts that do not fall into core orchestration or gate bundles. | scripts/generate-doc-inventory.js<br>scripts/test-app.js<br>scripts/word-machine-descriptor-compile.js | - | (uncovered: see risk notes) |

## Governance/agents/skills

| Feature | Status | User Value | Owner Files | API/Storage Touchpoints | Tests |
|---|---|---|---|---|---|
| `feature_governance_agent_registry`<br>Agent governance registry | staging | Defines agent contracts, permissions, and registry linkage. | to-do/agents/agent_access_control.json<br>to-do/agents/agent_skill_decider_agent.yaml<br>to-do/agents/agent_skill_reviewer_agent.yaml<br>to-do/agents/agents_registry.yaml<br>+14 more | Storage: agent_access_control.json, agents_registry.yaml<br>Cmd: npm run agents:validate | (uncovered: see risk notes) |
| `feature_governance_skill_registry`<br>Skill governance registry | staging | Maintains skill definitions, workflow routing, and policy metadata. | to-do/skills/agent-skill-decision-editor/SKILL.md<br>to-do/skills/agent-skill-decision-editor/agents/openai.yaml<br>to-do/skills/agent-skill-review-research/SKILL.md<br>to-do/skills/agent-skill-review-research/agents/openai.yaml<br>+55 more | Storage: agent_workflows.json<br>Cmd: npm run agents:validate | (uncovered: see risk notes) |

## Test suite

| Feature | Status | User Value | Owner Files | API/Storage Touchpoints | Tests |
|---|---|---|---|---|---|
| `feature_test_suite`<br>Automated test suite | active | Regression coverage for runtime modules, wrappers, IPC routes, and gate scripts. | tests/alias-index.test.js<br>tests/auth-quick-login.test.js<br>tests/command-palette-utils.test.js<br>tests/diagnostics-utils.test.js<br>+30 more | Cmd: npm test --silent | tests/alias-index.test.js<br>tests/auth-quick-login.test.js<br>tests/command-palette-utils.test.js<br>+31 more |

## Risk Note Index

- `feature_app_legacy_shell`: No direct tests mapped; documented as uncovered risk.
- `feature_renderer_boot_lifecycle`: No direct tests mapped; documented as uncovered risk.
- `feature_renderer_window_shells`: No direct tests mapped; documented as uncovered risk.
- `feature_renderer_core_runtime`: No direct tests mapped; documented as uncovered risk.
- `feature_renderer_control_plane`: No direct tests mapped; documented as uncovered risk.
- `feature_renderer_page_plane`: No direct tests mapped; documented as uncovered risk.
- `feature_renderer_workers`: No direct tests mapped; documented as uncovered risk.
- `feature_main_boot_lifecycle`: No direct tests mapped; documented as uncovered risk.
- `feature_main_data_repositories`: Migration/default regressions can corrupt persisted local state if not covered by tests.
- `feature_main_ipc_routing`: Channel drift between preload catalog and route registration can break runtime invocation.
- `feature_main_domain_services`: No direct tests mapped; documented as uncovered risk.
- `feature_main_window_management`: No direct tests mapped; documented as uncovered risk.
- `feature_brain_math_engine`: No direct tests mapped; documented as uncovered risk.
- `feature_brain_modules`: No direct tests mapped; documented as uncovered risk.
- `feature_brain_renderer_wrappers`: No direct tests mapped; documented as uncovered risk.
- `feature_brain_unified_wrapper`: Argument identification and stage resolution must stay deterministic across overrides and aliases.
- `feature_data_shared_catalogs`: Catalog/runtime divergence can break contract-based loading paths.
- `feature_pipeline_orchestration`: No direct tests mapped; documented as uncovered risk.
- `feature_quality_gates_and_release`: Stale smoke evidence can cause false confidence unless freshness policy is enforced.
- `feature_pipeline_support_tools`: No direct tests mapped; documented as uncovered risk.
- `feature_dx12_toolchain`: No direct tests mapped; documented as uncovered risk.
- `feature_pipeline_misc_scripts`: No direct tests mapped; documented as uncovered risk.
- `feature_governance_agent_registry`: No dedicated automated tests; drift is guarded by validation script output only. No direct tests mapped; documented as uncovered risk.
- `feature_governance_skill_registry`: Skill docs/metadata are staging assets and can drift without runtime failures. No direct tests mapped; documented as uncovered risk.
- `feature_test_suite`: Coverage is broad but not complete for every governance staging artifact.
