---
name: dictionary-alias-sync
description: Keep alias dictionary/index synchronized with naming changes by updating app/modules/alias-index.js whenever variables, objects, or namespaces are introduced or renamed.
---

# Dictionary Alias Sync

Use this skill whenever naming changes are made (new variable/object names, renamed aliases, or new namespace labels).

## Required Outcomes

1. `app/modules/alias-index.js` is updated for every new or changed alias.
2. Alias entries remain array-first format:
   - `["alias", ["full english word"]]`
3. Renderer alias labels remain aligned with alias index keys.
4. Tests continue to pass.

## Mandatory Trigger

Run this skill if any of the following occurs:

- A new abbreviation is introduced (example: `cfg`, `idx`, `fx`, `pg`).
- A grouped alias object changes (`G_APP`, `G_RT`, etc.).
- Any rename in `renderer.js` touches variables, objects, or namespace labels.

## Update Steps

1. Open `app/modules/alias-index.js`.
2. Add or adjust entries in `ALIAS_WORD_INDEX`.
3. Ensure aliases are lowercase and normalized.
4. Keep one primary full English word as first item in the words array.
5. If renderer alias metadata depends on these keys, verify alignment.

## Quick Check Commands

```bash
rg -n "\b[A-Za-z_][A-Za-z0-9_]*\b" app/renderer.js
rg -n "ALIAS_WORD_INDEX|getAliasWords|createAliasMap" app/modules/alias-index.js app/renderer.js
npm run lint --silent
npm test --silent
```

## Example

- If `pg` is used in renderer naming, ensure alias index includes:
  - `["pg", ["page"]]`
- If `app` is used in renderer naming, ensure alias index includes:
  - `["app", ["application"]]`

## Enforcement Rule

No naming refactor is complete until alias index update is done in the same pass.
