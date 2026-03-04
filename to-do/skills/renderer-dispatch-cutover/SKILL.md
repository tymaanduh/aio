---
name: renderer-dispatch-cutover
description: Convert repeated extracted wrapper functions in app/renderer.js into grouped dispatch specs and object-path dispatch calls with modular-only runtime behavior.
---

# Renderer Dispatch Cutover

Use this skill when renderer refactors need wrapper-wall removal and strict dispatch-first modular routing.

## Mandatory Trigger

Run when requests include:
- dispatch
- modular only
- remove wrappers
- object-path calls
- big-bang renderer cutover

## Blocking Outcomes

1. Repeated `runExtractedByModule` forwarding wrappers are removed.
2. `data/input/shared/renderer/dispatch_specs.js` exists and is the source of truth for dispatch mapping.
3. `app/renderer.js` calls extracted module APIs via grouped object paths.
4. `PATTERN_EXTRACTED_MODULE`, `GROUP_SETS`, and `DISPATCH_SPEC_MAP` are aligned in the same pass.
5. Legacy/dual branch behavior is removed from renderer dispatch path.

## Workflow

1. Build/refresh `DISPATCH_SPEC_MAP` by domain.
2. Build dispatch factory helpers in `brain/wrappers/renderer_dispatch_domain.js`.
3. Replace wrapper-wall usage with object-path dispatch calls.
4. Remove forwarding wrappers and stale mode/fallback code.
5. Run:
   - `npm run lint --silent`
   - `npm test --silent`
   - `npm run refactor:gate --silent` (or `npm run refactor:gate`)

## No-Fixer Rule

- Do not leave wrapper-wall leftovers for a later pass.
- Any missing alignment or shape mismatch blocks completion.

## Quick Check Commands

```bash
rg -n "return runExtractedByModule\\(" app/renderer.js
rg -n "DISPATCH_SPEC_MAP|PATTERN_DISPATCH_" data/input/shared/renderer/dispatch_specs.js app/renderer.js
rg -n "PATTERN_EXTRACTED_MODULE|group_set_|DISPATCH_SPEC_MAP" app/renderer.js data/input/shared/renderer/group_sets.js data/input/shared/renderer/dispatch_specs.js
npm run refactor:gate --silent
```

## Brain/Data/to-do Runtime Contract

- Brain runtime code only: `brain/*`
- Input data catalogs only: `data/input/*`
- Output artifacts/logs only: `data/output/*`
- Out-of-scope staging assets: `to-do/*`
- Wrapper execution mode: `two_pass_single_wrapper` (`identify_arguments` then `execute_pipeline`)
