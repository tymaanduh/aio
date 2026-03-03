# Dictionary Desktop App

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

The app stores data in Electron's `userData` directory under:

- `dictionary-data.json`
- `diagnostics.json`
- `universe-cache.json` (local universe graph/bookmarks cache)
- `ui-preferences.json` (theme + motion preferences)

Typical location on Windows:

- `%APPDATA%/<app-name>/dictionary-data.json`

Data is loaded automatically at startup and remains available after closing/reopening the app.

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
