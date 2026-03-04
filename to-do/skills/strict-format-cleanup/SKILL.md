---
name: strict-format-cleanup
description: Enforce strict renderer naming format with blocking checks: uppercase snake registries, PATTERN_* extraction, dispatch-first dedupe, and extracted domain alignment across group and dispatch specs.
---

# Strict Format Cleanup

Use this skill when refactoring renderer files for naming consistency and reusable pattern labeling.

## Required Outcomes

1. Top-level registries/config maps use `UPPER_SNAKE` names.
2. Repeated literal patterns are extracted into `PATTERN_*` constants.
3. Repeated action bindings are deduped into tuple arrays and iterated.
4. Alias/group namespaces remain centralized (`G_APP`, `G_RT`, `G_PAGE`, `G_DOM`, `G_UNI`, `G_UNI_FX`).
5. Extracted module mappings remain aligned with grouped data contracts.
6. Wrapper-wall forwarding patterns are removed in favor of dispatch-first mappings.
7. Validation passes after changes.

## Naming Standard

- Top-level maps/registries: `^[A-Z][A-Z0-9_]*$`
- Pattern constants: `^PATTERN_[A-Z0-9_]+$`
- Runtime group aliases: fixed names listed above
- Dispatch maps: `PATTERN_DISPATCH_*` for reusable dispatch registries.

## Workflow

1. Convert top-level registry names to `UPPER_SNAKE`.
2. Find repeated string literals and extract to `PATTERN_*` constants.
3. Replace repeated toggle/bind blocks with tuple arrays like:
   - `[elementKey, modeKey]`
4. Scan for invalid chained alias paths (forbidden example: `G_UNI.G_APP.c...`).
5. Convert repeated extracted wrappers into grouped dispatch maps and object-path dispatch usage.
6. If extraction domains are added/renamed, update:
   - `PATTERN_EXTRACTED_MODULE` in `app/renderer.js`
   - `GROUP_SETS` in `data/input/shared/renderer/group_sets.js`
   - `DISPATCH_SPEC_MAP` in `data/input/shared/renderer/dispatch_specs.js`
7. Run:
   - `npm run lint --silent`
   - `npm test --silent`
   - `npm run refactor:gate --silent` (or `npm run refactor:gate`)

## No-Fixer Rule

- Refactor must be correct in one pass.
- If any required check fails, the pass is incomplete and blocked.

## Function Template

```js
function applyStrictFormatCleanup({
  topLevelRegistryNames,
  patternMapNames,
  dedupedActionMaps,
  dispatchMapNames = [],
  wrapperWallCount = 0
}) {
  topLevelRegistryNames.forEach((name) => {
    if (!/^[A-Z][A-Z0-9_]*$/.test(name)) throw new Error(`Invalid top-level registry format: ${name}`);
  });

  patternMapNames.forEach((name) => {
    if (!/^PATTERN_[A-Z0-9_]+$/.test(name)) throw new Error(`Invalid pattern constant name: ${name}`);
  });

  dedupedActionMaps.forEach((map) => {
    map.forEach((row) => {
      if (!Array.isArray(row) || row.length !== 2) throw new Error("Action map rows must be [elementKey, modeKey]");
      const [elementKey, modeKey] = row;
      if (typeof elementKey !== "string" || typeof modeKey !== "string") throw new Error("Action map keys must be strings");
    });
  });
  dispatchMapNames.forEach((name) => {
    if (!/^PATTERN_DISPATCH_[A-Z0-9_]+$/.test(name)) throw new Error(`Invalid dispatch map name: ${name}`);
  });
  if (wrapperWallCount > 0) throw new Error(`Wrapper-wall not removed: ${wrapperWallCount}`);

  return true;
}
```

## Project Rule Source

This skill is based on repository file: `RULES`.

## Brain/Data/to-do Runtime Contract

- Brain runtime code only: `brain/*`
- Input data catalogs only: `data/input/*`
- Output artifacts/logs only: `data/output/*`
- Out-of-scope staging assets: `to-do/*`
- Wrapper execution mode: `two_pass_single_wrapper` (`identify_arguments` then `execute_pipeline`)
