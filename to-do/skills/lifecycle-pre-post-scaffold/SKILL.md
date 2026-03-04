---
name: lifecycle-pre-post-scaffold
description: Scaffold and enforce pre_load/post_load lifecycle contracts across app, window, page, and control modules using blocking deterministic hook metadata, split spec registries, and orchestration-only bootstrap.
---

# Lifecycle Pre/Post Scaffold

Use this skill when creating or refactoring lifecycle hook structure and load ordering.

## Mandatory Trigger

Run this skill when requests include:
- pre_load
- post_load
- lifecycle hooks
- app/window/page/control initialization order

## Required Outcomes

1. Hook specs include `key`, `scope`, and `required`.
2. Hooks follow deterministic order and predictable failure behavior.
3. Scope-specific helpers are isolated in shared files.
4. Naming follows repository convention (`snake_case` files, `UPPER_SNAKE` hook keys where applicable).
5. Bootstrap files stay orchestration-only; hook metadata belongs in grouped spec files.
6. Failing lifecycle/order checks block completion.

## Workflow

1. Define scope constants and hook key constants.
2. Generate helper factories for hook spec and result generation.
3. Split hook specs by scope:
   - app
   - page
   - control
4. Add pre/post modules that delegate to shared helpers.
5. Ensure required-vs-optional semantics are explicit.
6. Validate call chain from bootstrap to leaf scope.
7. Run:
   - `npm run lint --silent`
   - `npm test --silent`
   - `npm run refactor:gate --silent` (or `npm run refactor:gate`)

## No-Fixer Rule

- Do not leave hook specs inline for “later extraction”.
- If scope split is required, complete it in the same pass.

## Quick Check Commands

```bash
rg -n "pre_load|post_load|HOOK|hook_spec|run_.*_load" main app renderer
npm run lint --silent
npm test --silent
npm run refactor:gate --silent
```

## Brain/Data/to-do Runtime Contract

- Brain runtime code only: `brain/*`
- Input data catalogs only: `data/input/*`
- Output artifacts/logs only: `data/output/*`
- Out-of-scope staging assets: `to-do/*`
- Wrapper execution mode: `two_pass_single_wrapper` (`identify_arguments` then `execute_pipeline`)
