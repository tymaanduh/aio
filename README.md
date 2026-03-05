# AIO

Desktop application for building your own dictionary with:

- Local persistent storage on your PC
- Automatic saving while you edit
- Labels to organize entries (for subjects, jargon, categories)
- Search and filter tools
- Activity filtering (favorites, linked words, recently updated)
- Quick capture lane: single-word Enter capture + batch word capture (`Ctrl/Cmd+Enter`)
- Entry Workbench with related-content insights (near duplicates, backlinks, related terms)
- Archive-first safety flow with restore and explicit permanent delete
- Archive restore panel with filtered restore/purge actions
- Entry modes for `definition`, `slang`, `code snippet`, and `bytes` content
- Sentence graph mini-map, graph QA hints (islands/cycles/orphaned nodes), and node-entry linking tools
- Command palette (`Ctrl/Cmd+P`) with fuzzy command search
- Local-only diagnostics (errors + performance samples), with export support and in-app read-only panel
- Real-time runtime console window (modular, can be disabled with env toggle)
- Dedicated statistics view (most used, least used, recency, label/mode breakdown)
- Word Universe view (All-of-English style) with GPU WebGL rendering by default and a minimal filter-first UI
- Built-in 3D benchmark tools in Universe (live FPS/render HUD + benchmark run + GPU status report)
- Full 3-style theme system (Enterprise, Futuristic, Monochrome) with reduce-motion support
- Appearance settings popover in app chrome with persistent local preferences across restarts

## Default Agent Workflow

The default agent stack is now directed by `polyglot-default-director-agent` with a strict end-to-end flow:

1. Build full English + pseudocode blueprint.
2. Run two-pass wrapper preflight (`identify_arguments` then `execute_pipeline`).
3. Score and select language set by runtime/size/security/portability fit.
4. Translate pseudocode into equivalent functions per selected language.
5. Run optimization + bug-fix loops.
6. Run strict side-by-side benchmark/security gate and publish recommendation.

Agent/skill registry files:

- `to-do/agents/agents_registry.yaml`
- `to-do/skills/agent_workflows.json`
- `to-do/agents/agent_workflow_shards/index.json`
- `to-do/skills/repeat_action_routing.json`

Run the default pipeline from a project brief:

```bash
npm run polyglot:default -- --brief "Build a cross-platform app for X"
```

Run the generalized `continue` workflow (planning + stage agents + separation scan):

```bash
npm run workflow:general -- --planned-update "Continue refactor wave"
npm run workflow:continue -- --planned-update "Maintain existing project state"
npm run workflow:fast -- --planned-update "Fast maintain pass"
```

Agent/skill registry consistency check:

```bash
npm run agents:validate
```

Wrapper 1:1 function contract gate:

```bash
npm run contracts:validate
```

Generate/check polyglot wrapper symbol bindings from the canonical wrapper contracts/specs:

```bash
npm run wrappers:generate
npm run wrappers:check
```

Codex Desktop (`codex.exe`) skill/agent compatibility checks and sync:

```bash
npm run codex:desktop:validate
npm run codex:desktop:sync:dry-run
npm run codex:desktop:sync
```

Codex token/runtime efficiency checks:

```bash
npm run efficiency:audit
npm run efficiency:gate
npm run standards:baseline
npm run standards:baseline:gate
npm run standards:iso
npm run standards:iso:gate
npm run uiux:blueprint
npm run uiux:blueprint:check
npm run governance:hard
npm run governance:hard:gate
npm run automations:audit
npm run automations:optimize
npm run workflow:shards
npm run workflow:prune
npm run workflow:order
npm run workflow:order:gate
npm run docs:freshness:check
```

This sync publishes workspace skills to `%USERPROFILE%\.codex\skills` and exports
agent governance snapshots to `%USERPROFILE%\.codex\agents\aio`.

Use explicit create vs maintain modes:

```bash
npm run polyglot:create -- --project "My App" --scope "Initial MVP scope" --brief "Build a cross-platform app for X"
npm run polyglot:maintain -- --planned-update "Add export batch mode" --brief "Extend existing workflow with batch export"
npm run polyglot:maintain -- --wrapper-pipeline-id pipeline_default_math --wrapper-input-json '{"x":5,"y":8}'
```

Runtime optimization behavior:

- `maintain` mode reuses existing blueprint/pseudocode by default.
- Pseudocode is incrementally grown (not fully regenerated) unless `--force-pseudocode` is passed.
- Stages are skipped automatically when not stale (unless `--rerun-gates` is passed).
- Agent registry alignment is validated before workflow stages run.
- Wrapper preflight runs by default unless `--skip-wrapper-preflight` is passed.
- Update scans run at pipeline start/end unless `--skip-update-scans` is passed.
- Generated workflow artifacts under `data/output/databases/polyglot-default` are auto-formatted unless `--skip-output-format` is passed.
- Workflow runs auto-prune cache/temp artifacts and trim oversized update logs unless `--skip-prune` is passed.
- Agent workflow metadata is sharded under `to-do/agents/agent_workflow_shards/` for faster lazy validation reads.
- Run context is persisted in `data/output/databases/polyglot-default/context/run_state.json`.
- Run-first hierarchy instructions and stage state are persisted in `data/output/databases/polyglot-default/plan/hierarchy_order.md`.
- Wrapper preflight stage report is persisted in `data/output/databases/polyglot-default/analysis/wrapper_preflight_report.json`.
- Data separation audit is persisted in `data/output/databases/polyglot-default/analysis/data_separation_audit_report.json`.
- Standards baseline gate report is persisted in `data/output/databases/polyglot-default/analysis/standards_baseline_report.json`.
- ISO standards compliance checklist is persisted in `data/output/databases/polyglot-default/analysis/iso_standards_compliance_checklist.json`.
- ISO standards compliance markdown checklist is persisted in `data/output/databases/polyglot-default/analysis/iso_standards_compliance_checklist.md`.
- Workflow pipeline order report is persisted in `data/output/databases/polyglot-default/analysis/workflow_pipeline_order_report.json`.
- UI/UX blueprint gate report is persisted in `data/output/databases/polyglot-default/analysis/uiux_blueprint_report.json`.
- Hard governance report is persisted in `data/output/databases/polyglot-default/analysis/hard_governance_report.json`.
- UI/UX blueprint artifact is persisted in `data/output/databases/polyglot-default/plan/ui_ux_blueprint.md`.

## Branch Lanes

- `main` is the governed promotion lane (full gates, explicit promotion).
- `aio/autopush` is the autonomous no-review integration lane (minimal safety gate + direct push).
- Promotion from `aio/autopush` to `main` is manual only.

## Documentation

- Stable source-of-truth docs live in [`docs/`](docs/README.md).
- Generated evidence remains in `data/output/databases/polyglot-default/*` and is linked from docs.

## Brain/Data/to-do Layout

- `brain/` contains runtime functions and wrappers.
- `data/input/` contains input catalogs and datastream banks (text/audio/visual placeholders included).
- `data/output/` contains generated outputs, reports, and update logs.
- `to-do/` contains out-of-scope staging assets (including current `agents` and `skills` stores).

Single-wrapper runtime:

- Wrapper entrypoint: `brain/wrappers/unified_io_wrapper.js`
- Wrapper catalog: `data/input/shared/wrapper/unified_wrapper_specs.json`
- Canonical symbol registry (cross-language constants + function/object names): `data/input/shared/wrapper/wrapper_symbol_registry.json`
- Execution model:
  1. pass 1 identifies required arguments
  2. pass 2 executes function pipeline stages

CLI wrapper run examples:

```bash
npm run wrapper:run -- --pipeline-id pipeline_default_math --input-json '{"x":3,"y":4}'
npm run wrapper:run -- --operations op_add,op_multiply --input-json '{"x":3,"y":4}'
npm run wrapper:run -- --functions math.add,math.equal --input-json '{"x":3,"y":3}'
npm run wrapper:run -- --pipeline-id pipeline_clamp_x --input-json '{"x":14,"min":0,"max":10}'
npm run wrapper:run -- --pipeline-id pipeline_compare_bounds --input-json '{"x":14,"y":3}' --output-file data/output/wrapper/result.json
```

## Run

```bash
npm install
npm start
```

## Test

```bash
npm test
```

## Data Location

The app stores data in Electron's `userData/data/v1` directory under:

- `manifest.json`
- `app_state.json`
- `auth_state.json`
- `diagnostics_state.json`
- `universe_cache.json` (local universe graph/bookmarks cache)
- `ui_preferences.json` (theme + motion preferences)
- `language_bridge_state.json` (code/pseudocode/english keyword + triad + glossary index)

Legacy root JSON files are migrated automatically at startup and moved to `userData/data/legacy_backup`.

Typical location on Windows:

- `%APPDATA%/<app-name>/dictionary-data.json`

Data is loaded automatically into memory through `pre_load`/`post_load` lifecycle hooks and remains available after closing/reopening the app.

## Frontend and API

- Frontend entrypoints now live under `renderer/` with native ES module bootstraps for main/log windows.
- `preload.js` exposes `window.app_api` (legacy `window.dictionaryAPI` is removed).
- IPC channel constants are centralized in `main/ipc/ipc_channels.js`.
- Bridge APIs are available under `window.app_api.bridge.*`:
  - `load_state`
  - `capture_sources`
  - `search_keyword`
  - `search_triad`
  - `search_glossary`
  - `link_entry_artifacts`

## Keyboard Shortcuts

- `Ctrl/Cmd+P`: Command palette
- `Ctrl/Cmd+,`: Open appearance settings popover
- `Ctrl/Cmd+N`: New entry
- `Ctrl/Cmd+1`: Workbench view
- `Ctrl/Cmd+2`: Sentence Graph view
- `Ctrl/Cmd+3`: Statistics view
- `Ctrl/Cmd+4`: Universe view
- `Ctrl/Cmd+Shift+L`: Open runtime console
- `Alt+1..6`: Fast filter top labels (`Who/What/Where/When/Why/How`)
- `Enter` in entry fields: Save and advance
- `Ctrl/Cmd+Enter` in entry fields: Save and advance
- `Ctrl/Cmd+Z`: Undo
- `Ctrl/Cmd+Y` or `Ctrl/Cmd+Shift+Z`: Redo
- `Ctrl/Cmd+Shift+G`: Jump between selected entry/node when linked
- `Delete`: Archive selected entry/entries
- `Shift+Delete`: Permanent delete selected entry/entries

## Appearance and Motion

- Open `Appearance` in the top app chrome (or press `Ctrl/Cmd+,`).
- Themes:
  - `Windows 11 Dark` (default, fixed dark, cinematic depth/motion)
  - `Enterprise` (fixed light)
  - `Monochrome` (fixed neutral grayscale focus mode)
- `Reduce motion` can be toggled live and persists locally.
- Preferences are stored in `ui-preferences.json` under Electron `userData`.

## Diagnostics

Diagnostics are local-only (no remote telemetry):

- Stored under Electron `userData` in `diagnostics.json`
- Exportable from command palette via `Export Diagnostics`

## Runtime Console

The app can stream live status/error logs to a separate window:

- Open from command palette: `Open Runtime Console`
- Or click `Runtime Console` in the left tools panel
- Disable at startup with: `DICTIONARY_ENABLE_REALTIME_LOGS=0`

Quick login (`admin/admin`, `demo/demo`, etc.) is disabled by default.
Enable quick login only for local/dev workflows with: `DICTIONARY_ENABLE_QUICK_LOGIN=1`

## Language Bridge Index

The app now supports a bridge index that maps:

- code tokens
- pseudocode phrases
- plain English terms

Stored in `language_bridge_state.json` under Electron `userData/data/v1`.

Auto-index behavior:

- Dictionary save automatically indexes entry definitions/content.
- Chat/source capture can be sent via `window.app_api.bridge.capture_sources(...)`.

## Performance and GPU Modes

- `DICTIONARY_GPU_MODE=auto` (default): Enable safe GPU acceleration switches.
- `DICTIONARY_GPU_MODE=on`: Force GPU path (also ignores GPU blocklist).
- `DICTIONARY_GPU_MODE=off`: Disable hardware acceleration for stability fallback.
- `DICTIONARY_FPS_BOOST=1`: Disables frame cap + GPU vsync to push higher FPS on capable hardware (off by default for stability).
- On Windows, GPU mode now prefers ANGLE `D3D11` for better compositor stability.
- Optional backend override on Windows:
  - `DICTIONARY_ANGLE_BACKEND=d3d11` (default)
  - `DICTIONARY_ANGLE_BACKEND=d3d11on12` (DX12 path via ANGLE translation layer)
  - `DICTIONARY_ANGLE_BACKEND=vulkan` (if driver support is stable on your system)
- Optional GL implementation override:
  - `DICTIONARY_GL_BACKEND=angle|desktop|egl|swiftshader`
- Aggressive GPU flags (opt-in): `DICTIONARY_AGGRESSIVE_GPU=1`
- Auto-recover on repeated GPU process crashes (default on): `DICTIONARY_GPU_AUTO_RECOVER=1`
  - Relaunches once with `DICTIONARY_GPU_MODE=off` if repeated GPU process exits are detected.
- Non-Windows stability default: in `DICTIONARY_GPU_MODE=auto`, GPU is disabled unless explicitly enabled.
  - Override on Linux/macOS with: `DICTIONARY_NON_WINDOWS_GPU=on`

Universe benchmark controls:

- Use `Benchmark` / `Stop` in the Universe toolbar.
- Use command palette:
  - `Use Canvas Renderer`
  - `Try WebGL Renderer`
  - `Start 3D Benchmark`
  - `Stop 3D Benchmark`
  - `Show GPU Status`

Related toggles:

- `DICTIONARY_DISABLE_GPU=1`: Explicitly disable GPU acceleration.
- `DICTIONARY_FORCE_GPU=1`: Force-enable GPU path and ignore blocklist.

## Native DX12 Backend Scaffold

A Windows-only native renderer scaffold is available at:

- `native/dx12`

It includes:

- Multi-threaded command recording with fewer, larger worker command lists
- Persistent descriptor strategy:
  - One large shader-visible CBV/SRV/UAV heap with static free-list + per-frame dynamic ring
  - Separate non-shader-visible RTV and DSV heaps
- Global GPU heap allocator (large heaps + sub-allocation for placed resources)
- Fence-based resource lifetime retirement queues for safe deferred frees
- Frame graph with centralized barrier batching + per-subresource state tracking
- PSO/root-signature cache with async PSO build queue and optional runtime hot-swap mode
- Shader reflection/binding metadata cache for automatic resource-slot lookup
- Async compute path with graphics-queue fallback
- Copy queue task path for background streaming uploads
- Poll-based shader/texture/mesh hot-reload hooks

Build locally on Windows:

```powershell
cd native/dx12
cmake -S . -B build -G "Visual Studio 17 2022" -A x64
cmake --build build --config Release
```

DX12 toolchain doctor + fallback:

```bash
npm run dx12:doctor
```

If Visual Studio is unavailable but Linux MinGW cross-toolchain is installed:

```bash
npm run dx12:configure:mingw
npm run dx12:build:mingw
```

WSL helper installer (auto-installs fallback prerequisites):

```bash
npm run dx12:install:wsl-prereqs
```
