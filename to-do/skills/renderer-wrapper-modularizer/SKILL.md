---
name: renderer-wrapper-modularizer
description: Extract large renderer domains into brain/modules/*_domain.js files while keeping app/renderer.js as orchestration-only shell with dispatch-first object-path routing (no wrapper wall).
---

# Renderer Wrapper Modularizer

Use this skill when renderer refactors should reduce file size and isolate domain logic into reusable module files.

## Mandatory Trigger

Run this skill when requests include terms like:

- extract again
- renderer should be wrapper
- split into modules
- separate functions
- reduce renderer size

## Required Outcomes

1. `app/renderer.js` keeps orchestration-only routing (no forwarding wrapper wall).
2. Extracted implementations move to `brain/wrappers/renderer_*_domain.js` files.
3. `PATTERN_EXTRACTED_MODULE` includes keys for all extracted domains.
4. `data/input/shared/renderer/group_sets.js` includes matching `module_key` entries.
5. `app/index.html` script load order includes new domain files before `renderer.js`.
6. Wrapper-wall one-line forwarding functions are replaced with grouped dispatch object paths.
7. `data/input/shared/renderer/dispatch_specs.js` aligns with extracted modules/group sets.

## Workflow

1. Identify cohesive function groups by domain and data ownership.
2. Move implementations to new/target module files in UMD style.
3. Define/update dispatch spec map in `data/input/shared/renderer/dispatch_specs.js`.
4. Replace in-renderer implementations with grouped dispatch object calls:
   - `DISPATCH.DOMAIN.functionName(...)`
5. Remove repeated forwarding wrapper declarations.
6. Export modular/direct variants from extracted module and keep global key stable.
7. Wire script tags and verify no missing module key.
8. Run:
   - `npm run lint --silent`
   - `npm test --silent`
   - `npm run refactor:gate --silent` (or `npm run refactor:gate`)

## No-Fixer Rule

- Domain extraction, dispatch mapping, and naming cleanup must complete in the same pass.
- Failing alignment or shape checks blocks completion.

## Quick Check Commands

```bash
wc -l app/renderer.js
rg -n "PATTERN_EXTRACTED_MODULE|runExtractedByModule" app/renderer.js
rg -n "module_key" data/input/shared/renderer/group_sets.js
rg -n "DISPATCH_SPEC_MAP|PATTERN_DISPATCH_" data/input/shared/renderer/dispatch_specs.js app/renderer.js
rg -n "renderer_.*_domain.js" app/index.html
npm run refactor:gate --silent
```

## Brain/Data/to-do Runtime Contract

- Brain runtime code only: `brain/*`
- Input data catalogs only: `data/input/*`
- Output artifacts/logs only: `data/output/*`
- Out-of-scope staging assets: `to-do/*`
- Wrapper execution mode: `two_pass_single_wrapper` (`identify_arguments` then `execute_pipeline`)

## Project Scope Guardrails

- Keep changes inside `app/`, `brain/`, `data/input/`, `data/output/`, `main/`, `renderer/`, `scripts/`, `tests/`, and `to-do/`.
- Keep runtime logic in `brain/*`; keep catalogs/specs in `data/input/*`; keep generated artifacts/logs in `data/output/*`.
- Do not introduce cloud/deployment/provider workflows unless explicitly requested.
- Preserve the two-pass wrapper contract (`identify_arguments` before `execute_pipeline`) when touching wrapper flows.
- Re-run `npm run agents:validate` after agent/skill metadata changes.
