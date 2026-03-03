---
name: pre-assign-naming-gate
description: Mandatory pre-naming workflow to run before assigning or renaming variables, objects, functions, and namespace keys. Enforces naming format, group labels, PATTERN_EXTRACTED_MODULE alignment, and same-pass alias dictionary updates.
---

# Pre-Assign Naming Gate

Use this skill every time code introduces or renames:
- variables
- object keys
- function names
- namespace/group labels

## Mandatory Gate (run in order)

1. Determine scope label first:
- `PATTERN_` for reusable literals/maps
- `G_*` for runtime group namespaces
- `UPPER_SNAKE` for top-level registries/config maps
- `camelCase` for local runtime helpers

2. Check if the name is abbreviated.
- If abbreviated or alias-like (`pg`, `cfg`, `idx`, `fx`, etc.), update `app/modules/alias-index.js` and `data/shared/alias/alias_groups.js` in the same pass.
- Required format: `["alias", ["full english word"]]`

3. Check for dedupe opportunity.
- If the same literal/key appears 2+ times, extract to `PATTERN_*` constant.
- If repeated bindings/toggles exist, convert to tuple map + iteration.

4. Validate naming consistency.
- No mixed style for same layer.
- No chained alias corruption (forbidden example: `G_UNI.G_APP.c...`).
- If you add extracted domains, update `PATTERN_EXTRACTED_MODULE` and `data/shared/renderer/group_sets.js` together.

5. Run validation.
- `npm run lint --silent`
- `npm test --silent`

## Required Outputs Per Naming Change

- Updated code with compliant naming format.
- Updated `app/modules/alias-index.js` and `data/shared/alias/alias_groups.js` when alias abbreviations are introduced/changed.
- Clear grouping preserved (`G_APP`, `G_RT`, `G_PAGE`, `G_DOM`, `G_UNI`, `G_UNI_FX`).

## Quick Checklist

- [ ] Name format matches scope.
- [ ] Repeated literals moved to `PATTERN_*` if needed.
- [ ] Runtime + documentation alias dictionaries updated (if abbreviation used).
- [ ] `PATTERN_EXTRACTED_MODULE` and `GROUP_SETS` are aligned for new extracted domains.
- [ ] No broken chained alias references.
- [ ] Lint/tests pass.

## Template Function

```js
function preAssignNamingGate({
  candidateName,
  scopeType,
  isAlias,
  repeatedLiteralCount
}) {
  if (!candidateName || typeof candidateName !== "string") throw new Error("candidateName required");

  const scopeRules = {
    PATTERN: /^PATTERN_[A-Z0-9_]+$/,
    GROUP: /^G_[A-Z0-9_]+$/,
    TOP: /^[A-Z][A-Z0-9_]*$/,
    LOCAL: /^[a-z][a-zA-Z0-9]*$/
  };

  const rule = scopeRules[scopeType];
  if (!rule || !rule.test(candidateName)) throw new Error(`Invalid naming for scope ${scopeType}: ${candidateName}`);

  return {
    mustUpdateAliasIndex: Boolean(isAlias),
    shouldExtractPattern: Number(repeatedLiteralCount || 0) >= 2
  };
}
```
