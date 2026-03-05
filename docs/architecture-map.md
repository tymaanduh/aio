# Architecture Map

This map describes ownership and data flow for all runtime domains covered by `docs/inventory.index.json`.

## Subsystem Ownership

- **App shell/UI**: `app/*`, `renderer/*`
- **Main process/IPC/services**: `main/*`
- **Brain modules/wrappers/math**: `brain/*`
- **Data catalogs/contracts**: `data/input/shared/*`
- **Pipeline/gates/release scripts**: `scripts/*`
- **Governance/agents/skills**: `to-do/agents/*`, `to-do/skills/*`
- **Test suite**: `tests/*`

## Runtime Topology

1. Electron main process boots through `main.js` and `main/boot/*`.
2. `preload.js` exposes `window.app_api.*` methods from catalog contracts.
3. Renderer windows (`renderer/windows/*`) initialize boot specs (`renderer/boot/specs/*`).
4. Renderer domains call modular wrappers in `brain/wrappers/*`.
5. Wrapper/runtime logic pulls constants and catalogs from `data/input/shared/*`.
6. Main IPC routes (`main/ipc/ipc_route_*.js`) delegate to domain repositories/services in `main/data/*` and `main/services/*`.
7. Persistent state resolves through repository manifests (`data/input/shared/main/repository_manifest_catalog.json`) and domain repositories.

## Lifecycle And Boot Chains

### Main Process

- `main/boot/app_pre_load.js`
- `main/boot/app_boot_specs.js`
- `main/boot/app_boot_runtime.js`
- `main/boot/app_post_load.js`
- Window hooks:
  - `main/windows/window_pre_load.js`
  - `main/windows/window_post_load.js`

### Renderer Process

- `renderer/boot/app_pre_load.js`
- `renderer/boot/specs/app_hook_specs.js`
- `renderer/boot/specs/page_hook_specs.js`
- `renderer/boot/specs/control_hook_specs.js`
- `renderer/boot/app_post_load.js`

## IPC And Bridge Layer

- IPC channel constants: `main/ipc/ipc_channels.js`
- Namespace/alias catalog: `data/input/shared/ipc/preload_api_catalog.json`
- Route implementations:
  - auth: `main/ipc/ipc_route_auth.js`
  - data/storage: `main/ipc/ipc_route_data.js`
  - diagnostics: `main/ipc/ipc_route_diagnostics.js`
  - universe: `main/ipc/ipc_route_universe.js`
  - ui: `main/ipc/ipc_route_ui.js`
  - runtime log: `main/ipc/ipc_route_runtime_log.js`
  - gpu: `main/ipc/ipc_route_gpu.js`
  - bridge: `main/ipc/ipc_route_bridge.js`

## Data And Contract Sources

- Main repository manifest: `data/input/shared/main/repository_manifest_catalog.json`
- Wrapper contract: `data/input/shared/wrapper/unified_wrapper_specs.json`
- Math operation contract: `data/input/shared/math/io_assembly_line_math.json`
- Renderer governance catalogs:
  - `data/input/shared/renderer/dispatch_specs.js`
  - `data/input/shared/renderer/group_sets.js`
  - `data/input/shared/renderer/group_specs.js`

## Two-Pass Wrapper Runtime

- Wrapper runtime: `brain/wrappers/unified_io_wrapper.js`
- Pass order:
  1. `identify_arguments`
  2. `execute_pipeline`
- Math execution dependency:
  - `brain/math/io_assembly_line_math.js`
  - `data/input/shared/math/io_assembly_line_math.json`

## Operational Artifacts

- Analysis/build/context outputs:
  - `data/output/databases/polyglot-default/analysis/*`
  - `data/output/databases/polyglot-default/build/*`
  - `data/output/databases/polyglot-default/context/*`
- Release and smoke reports:
  - `data/output/databases/polyglot-default/reports/*`
  - `data/output/logs/smoke/*`
  - `data/output/logs/change-log/*`
