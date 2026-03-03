---
name: dictionary-alias-sync
description: Keep alias dictionary/index synchronized with naming changes by updating app/modules/alias-index.js and data/shared/alias/alias_groups.js whenever variables, objects, or namespaces are introduced or renamed.
---

# Dictionary Alias Sync

Use this skill whenever naming changes are made (new variable/object names, renamed aliases, or new namespace labels).

## Required Outcomes

1. `app/modules/alias-index.js` and `data/shared/alias/alias_groups.js` are updated in the same pass.
2. Runtime alias entries remain array-first format:
   - `["alias", ["full english word"]]`
3. Documentation alias entries remain grouped by:
   - `ALIAS_GROUPS.SCOPE`
   - `ALIAS_GROUPS.DOMAIN`
   - `ALIAS_GROUPS.DATA`
   - `ALIAS_GROUPS.RUNTIME`
   - `ALIAS_GROUPS.UI`
4. Renderer alias labels remain aligned with alias index keys.
5. Tests continue to pass.

## Mandatory Trigger

Run this skill if any of the following occurs:

- A new abbreviation is introduced (example: `cfg`, `idx`, `fx`, `pg`).
- A grouped alias object changes (`G_APP`, `G_RT`, etc.).
- Any rename in `renderer.js` touches variables, objects, or namespace labels.
- A new `PATTERN_EXTRACTED_MODULE` key is added.
- A new `GROUP_SETS` domain key is introduced in `data/shared/renderer/group_sets.js`.

## Update Steps

1. Open `app/modules/alias-index.js`.
2. Open `data/shared/alias/alias_groups.js`.
3. Add or adjust runtime entries in `ALIAS_WORD_INDEX`.
4. Add or adjust documentation entries in the correct `ALIAS_GROUPS.*` bucket.
5. Ensure aliases are lowercase and normalized.
6. Keep one primary full English word as first item in the runtime words array.
7. If renderer alias metadata depends on these keys, verify alignment.

## Quick Check Commands

```bash
rg -n "\b[A-Za-z_][A-Za-z0-9_]*\b" app/renderer.js
rg -n "ALIAS_WORD_INDEX|getAliasWords|createAliasMap" app/modules/alias-index.js app/renderer.js
rg -n "ALIAS_GROUPS" data/shared/alias/alias_groups.js
npm run lint --silent
npm test --silent
```

## Example

- If `pg` is used in renderer naming, ensure alias index includes:
  - `["pg", ["page"]]`
- Ensure alias docs include:
  - `["pg", "page", "scope", "Page-level grouping and routing."]`
- If `app` is used in renderer naming, ensure alias index includes:
  - `["app", ["application"]]`
- Ensure alias docs include:
  - `["app", "application", "scope", "Top-level app scope."]`

## Enforcement Rule

No naming refactor is complete until runtime and documentation alias updates are both done in the same pass.
