# Dictionary Builder — Refactor & UI/UX TODO

## Phase 1 — Critical Fixes & UI Exposure ✅ DONE
- [x] Expose hidden `legacyControls` elements into visible UI
  - [x] Move `treeSearchInput` → sidebar search row
  - [x] Move `treeLabelFilter` + `treeActivityFilter` → sidebar filter row
  - [x] Move `importFileInput` + `exportFormatSelect` + `exportDataAction` → sidebar bottom toolbar
  - [x] Move `deleteSelectedAction` → sidebar bottom toolbar (Archive Sel.)
- [x] Add logout button (`logoutAction`) to app header
- [x] Add "New Entry" button (`newEntryAction`) to sidebar
- [x] Add explicit Save button (`entrySaveAction`) + Archive button (`entryArchiveAction`) to entry form
- [x] Add all missing Universe view controls (25+ elements now in HTML + elements object)
  - universeJumpAction, universeColorModeSelect, universeRenderModeSelect
  - universeMinWordLengthInput, universeMaxNodesInput, universeMaxEdgesInput
  - universeFavoritesOnlyInput, universeLabelFilterInput, universeApplyFiltersAction
  - universeEdgeContains/Prefix/Suffix/Stem/SameLabel actions
  - universePathFromInput, universePathToInput, universeFindPathAction, universePathStatus
  - universeResetCameraAction, universeFitCameraAction, universeSaveViewAction
  - universeBookmarkSelect, universeLoadViewAction
  - universeExportPngAction, universeExportJsonAction
  - universeClusterSummary, universeClusterList
- [x] Add CSS styles for all new visible controls (appended to styles.css)
- [x] Add logout, new-entry, archive event handlers in renderer.js `bindEvents()`
- [x] App verified running (electron processes active)

## Phase 2 — Modular Architecture (Next Sprint)
renderer.js is 11 220 lines of shared-scope spaghetti. Target split:

| New file | Responsibility | Est. lines |
|---|---|---|
| `app/modules/renderer-context.js` | Shared state, elements, store, timers | ~300 |
| `app/modules/renderer-utils.js` | cleanText, unique, clamp, normalizers | ~150 |
| `app/modules/renderer-auth.js` | Auth gate, login, logout | ~120 |
| `app/modules/renderer-ui.js` | Themes, layout, popover, motion | ~300 |
| `app/modules/renderer-entry.js` | Entry CRUD, form, lookup, undo | ~600 |
| `app/modules/renderer-tree.js` | Tree model, render, archive, labels | ~700 |
| `app/modules/renderer-graph.js` | Sentence graph, suggestions | ~600 |
| `app/modules/renderer-universe.js` | Universe view, WebGL, benchmark | ~900 |
| `app/modules/renderer-stats.js` | Statistics, worker bridge | ~200 |
| `app/modules/renderer-diagnostics.js` | Diagnostics, perf logging | ~120 |
| `app/modules/renderer-commands.js` | Command palette | ~250 |
| `app/modules/renderer-context-menu.js` | Context menu | ~150 |
| `app/modules/renderer-import-export.js` | CSV/JSON import & export | ~300 |
| `app/modules/renderer-events.js` | All event binding | ~400 |
| `renderer.js` | Bootstrap only (initialize) | ~80 |

**Strategy:** Convert all files to native ES modules (`type="module"`).
Existing utility modules (store, tree-utils, etc.) need `export` statements added.

## Phase 3 — Performance
- [ ] Virtualise tree rendering for >500 entries (already partially done)
- [ ] Debounce universe filter input (already done via `universeViewState.filter`)
- [ ] Lazy-load statistics worker only when Statistics view is opened
- [ ] Lazy-load universe worker only when Universe view is opened
- [ ] Remove `backdrop-filter` from `.editorHeader` when app is active (already done)
- [ ] Profile and reduce `requestAnimationFrame` chains in universe render loop

## Phase 4 — Code Quality
- [ ] Replace all `span[role=button]` with real `<button>` elements
- [ ] Add proper ARIA labels to all interactive elements
- [ ] Remove `legacyControls` div entirely once all elements are migrated
- [ ] Add JSDoc to all public functions
- [ ] Enable stricter ESLint rules (no-unused-vars, prefer-const, etc.)
- [ ] Add integration tests for auth flow, entry CRUD, import/export
