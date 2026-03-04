---
name: literal-factory-dehardcode
description: Remove hard-coded UI text and labels with blocking first-pass PATTERN_* extraction and factory helpers that generate labels/runners/items from args.
---

# Literal Factory Dehardcode

Use this skill when hard-coded strings should be replaced with reusable factories and grouped literal maps.

## Mandatory Trigger

Run this skill when requests include:
- remove hard coded string
- dehardcode labels
- command palette label cleanup
- generate text from args

## Required Outcomes

1. Repeated literals move into `PATTERN_*` maps.
2. Label formatting becomes factory-driven (`create*Label`, `create*Item`, `create*Runner`).
3. UI-visible text remains unchanged unless explicitly requested.
4. No raw repeated bracket-label literals remain in targeted blocks.
5. No deferred fixer pass for missed literals.

## Workflow

1. Add or update `PATTERN_*` literal map for sections/tokens.
2. Add reusable helper factories near related domain logic.
3. Replace inline object literals with factory calls.
4. Preserve object contract shape expected by downstream consumers.
5. Verify search/ranking logic still works.
6. Run:
   - `npm run lint --silent`
   - `npm test --silent`
   - `npm run refactor:gate --silent` (or `npm run refactor:gate`)

## No-Fixer Rule

- Literal extraction is blocking in the same pass.
- If repeated literals remain in targeted block, pass is incomplete.

## Quick Check Commands

```bash
rg -n "label:\\s*\"\\[" app/renderer.js brain/modules
rg -n "PATTERN_.*SECTION|create.*Label|create.*Item|create.*Runner" app/renderer.js brain/modules
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
