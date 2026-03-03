---
name: renderer-wrapper-modularizer
description: Extract large renderer domains into app/modules/*_domain.js files while keeping app/renderer.js as orchestration wrapper that dispatches via PATTERN_EXTRACTED_MODULE and runExtractedByModule.
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

1. `app/renderer.js` keeps orchestration and wrappers only for extracted functions.
2. Extracted implementations move to `app/modules/renderer_*_domain.js` files.
3. `PATTERN_EXTRACTED_MODULE` includes keys for all extracted domains.
4. `data/shared/renderer/group_sets.js` includes matching `module_key` entries.
5. `app/index.html` script load order includes new domain files before `renderer.js`.

## Workflow

1. Identify cohesive function groups by domain and data ownership.
2. Move implementations to new/target module files in UMD style.
3. Replace in-renderer implementations with wrapper dispatch:
   - `runExtractedByModule(PATTERN_EXTRACTED_MODULE.KEY, "functionName", args)`
4. Export direct + `legacy_` + `modular_` variants from extracted module.
5. Wire script tags and verify no missing module key.
6. Run:
   - `npm run lint --silent`
   - `npm test --silent`

## Quick Check Commands

```bash
wc -l app/renderer.js
rg -n "PATTERN_EXTRACTED_MODULE|runExtractedByModule" app/renderer.js
rg -n "module_key" data/shared/renderer/group_sets.js
rg -n "renderer_.*_domain.js" app/index.html
```
