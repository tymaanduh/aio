---
name: bootstrap-hook-spec-splitter
description: Split inline renderer bootstrap hook metadata into app/page/control spec registries and keep app_bootstrap.js orchestration-only with manifest-driven legacy loading.
---

# Bootstrap Hook Spec Splitter

Use this skill when `renderer/boot/app_bootstrap.js` has inline hook-spec blocks that should be extracted into grouped data files.

## Mandatory Trigger

Run when requests include:
- split bootstrap
- hook spec extraction
- pre/post metadata refactor
- orchestration-only bootstrap
- boot spec split

## Blocking Outcomes

1. `renderer/boot/app_bootstrap.js` is orchestration-only.
2. Hook specs are split into scope files:
   - app
   - page
   - control
3. Binding arrays come from registries, not inline object walls.
4. Legacy loader path uses manifest-driven module lists.
5. Hook order remains deterministic and testable.

## Workflow

1. Extract app/page/control hook-spec constants into `renderer/boot/specs/*`.
2. Extract binding lists into a shared registry file.
3. Keep bootstrap runner logic small and generic.
4. Replace ad-hoc legacy imports with manifest-driven loader.
5. Run:
   - `npm run lint --silent`
   - `npm test --silent`
   - `npm run refactor:gate --silent` (or `npm run refactor:gate`)

## No-Fixer Rule

- Inline hook-spec walls are blocking violations.
- Required scope split must be completed in the same pass.

## Quick Check Commands

```bash
rg -n "hook_spec:\\s*Object\\.freeze\\(" renderer/boot/app_bootstrap.js
wc -l renderer/boot/app_bootstrap.js
rg -n "legacy_module_manifest|load_legacy_shell_scope" renderer/boot
npm run refactor:gate --silent
```
