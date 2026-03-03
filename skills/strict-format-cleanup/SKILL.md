---
name: strict-format-cleanup
description: Enforce strict renderer naming format with uppercase snake for top-level registries/config maps, extract repeated literals into PATTERN_* constants, and dedupe repeated action bindings into iterable tuple maps.
---

# Strict Format Cleanup

Use this skill when refactoring renderer files for naming consistency and reusable pattern labeling.

## Required Outcomes

1. Top-level registries/config maps use `UPPER_SNAKE` names.
2. Repeated literal patterns are extracted into `PATTERN_*` constants.
3. Repeated action bindings are deduped into tuple arrays and iterated.
4. Alias/group namespaces remain centralized (`G_APP`, `G_RT`, `G_PAGE`, `G_DOM`, `G_UNI`, `G_UNI_FX`).
5. Validation passes after changes.

## Naming Standard

- Top-level maps/registries: `^[A-Z][A-Z0-9_]*$`
- Pattern constants: `^PATTERN_[A-Z0-9_]+$`
- Runtime group aliases: fixed names listed above

## Workflow

1. Convert top-level registry names to `UPPER_SNAKE`.
2. Find repeated string literals and extract to `PATTERN_*` constants.
3. Replace repeated toggle/bind blocks with tuple arrays like:
   - `[elementKey, modeKey]`
4. Scan for invalid chained alias paths (forbidden example: `G_UNI.G_APP.c...`).
5. Run:
   - `npm run lint --silent`
   - `npm test --silent`

## Function Template

```js
function applyStrictFormatCleanup({
  topLevelRegistryNames,
  patternMapNames,
  dedupedActionMaps
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

  return true;
}
```

## Project Rule Source

This skill is based on repository file: `RULES`.
