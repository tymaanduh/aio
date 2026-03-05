---
name: pre-assign-naming-gate
description: Mandatory pre-naming workflow before assigning or renaming variables, objects, functions, and namespace keys. Enforces blocking naming checks, dispatch/group alignment, and same-pass alias updates.
---

# Pre-Assign Naming Gate

Use this skill every time code introduces or renames:
- variables
- object keys
- function names
- namespace/group labels

## Blocking Gate (run in order)

1. Determine scope label first:
- `PATTERN_` for reusable literals/maps
- `G_*` for runtime group namespaces
- `UPPER_SNAKE` for top-level registries/config maps
- `camelCase` for local runtime helpers

2. Check if the name is abbreviated.
- If abbreviated or alias-like (`pg`, `cfg`, `idx`, `fx`, etc.), update `brain/modules/alias-index.js` and `data/input/shared/alias/alias_groups.js` in the same pass.
- Required format: `["alias", ["full english word"]]`

3. Check for dedupe opportunity.
- If the same literal/key appears 2+ times, extract to `PATTERN_*` constant.
- If repeated bindings/toggles exist, convert to tuple map + iteration.

4. Validate naming and extraction consistency.
- No mixed style for same layer.
- No chained alias corruption (forbidden example: `G_UNI.G_APP.c...`).
- If you add/rename extracted domains, update:
  - `PATTERN_EXTRACTED_MODULE`
  - `data/input/shared/renderer/group_sets.js`
  - `data/input/shared/renderer/dispatch_specs.js`
  in the same pass.

5. Run validation.
- `npm run lint --silent`
- `npm test --silent`
- `npm run refactor:gate --silent` (or `npm run refactor:gate`)

## No-Fixer Rule

- Post-pass fixer cleanup is not allowed.
- Naming/literals/grouping must be correct in the first implementation pass.
- Any failed check blocks completion.

## Required Outputs Per Naming Change

- Updated code with compliant naming format.
- Updated `brain/modules/alias-index.js` and `data/input/shared/alias/alias_groups.js` when alias abbreviations are introduced/changed.
- Clear grouping preserved (`G_APP`, `G_RT`, `G_PAGE`, `G_DOM`, `G_UNI`, `G_UNI_FX`).
- Updated dispatch/group alignment when extracted-module keys changed.

## Quick Checklist

- [ ] Name format matches scope.
- [ ] Repeated literals moved to `PATTERN_*` if needed.
- [ ] Runtime + documentation alias dictionaries updated (if abbreviation used).
- [ ] `PATTERN_EXTRACTED_MODULE`, `GROUP_SETS`, and `DISPATCH_SPEC_MAP` are aligned.
- [ ] No broken chained alias references.
- [ ] Lint/tests/gate pass.

## Template Function

```js
function preAssignNamingGate({
  candidateName,
  scopeType,
  isAlias,
  repeatedLiteralCount,
  extractedAlignmentOk
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
  if (extractedAlignmentOk === false) throw new Error("Extracted module alignment failed");

  return {
    mustUpdateAliasIndex: Boolean(isAlias),
    shouldExtractPattern: Number(repeatedLiteralCount || 0) >= 2
  };
}
```

## Brain/Data/to-do Runtime Contract

- Brain runtime code only: `brain/*`
- Input data catalogs only: `data/input/*`
- Output artifacts/logs only: `data/output/*`
- Out-of-scope staging assets: `to-do/*`
- Wrapper execution mode: `two_pass_single_wrapper` (`identify_arguments` then `execute_pipeline`)
