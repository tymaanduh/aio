---
name: lifecycle-pre-post-scaffold
description: Scaffold and enforce pre_load/post_load lifecycle contracts across app, window, page, and control modules with deterministic hook metadata and ordering.
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

## Workflow

1. Define scope constants and hook key constants.
2. Generate helper factories for hook spec and result generation.
3. Add pre/post modules that delegate to shared helpers.
4. Ensure required-vs-optional semantics are explicit.
5. Validate call chain from bootstrap to leaf scope.

## Quick Check Commands

```bash
rg -n "pre_load|post_load|HOOK|hook_spec|run_.*_load" main app renderer
npm run lint --silent
npm test --silent
```
