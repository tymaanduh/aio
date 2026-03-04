---
name: dictionary-alias-sync
description: Keep alias dictionary/index synchronized with naming changes using blocking same-pass updates across runtime and documentation alias sources, plus extracted-domain alignment checks.
---

# Dictionary Alias Sync

Use this skill whenever naming changes are made (new variable/object names, renamed aliases, or new namespace labels).

## Required Outcomes

1. `brain/modules/alias-index.js` and `data/input/shared/alias/alias_groups.js` are updated in the same pass.
2. Runtime alias entries remain array-first format:
   - `["alias", ["full english word"]]`
3. Documentation alias entries remain grouped by:
   - `ALIAS_GROUPS.SCOPE`
   - `ALIAS_GROUPS.DOMAIN`
   - `ALIAS_GROUPS.DATA`
   - `ALIAS_GROUPS.RUNTIME`
   - `ALIAS_GROUPS.UI`
4. Renderer alias labels remain aligned with alias index keys.
5. Extracted key alignment remains consistent with group and dispatch specs.
6. Tests and gate checks pass.

## Mandatory Trigger

Run this skill if any of the following occurs:

- A new abbreviation is introduced (example: `cfg`, `idx`, `fx`, `pg`).
- A grouped alias object changes (`G_APP`, `G_RT`, etc.).
- Any rename in `renderer.js` touches variables, objects, or namespace labels.
- A new `PATTERN_EXTRACTED_MODULE` key is added.
- A new `GROUP_SETS` domain key is introduced in `data/input/shared/renderer/group_sets.js`.
- A new dispatch domain/function key is added in `data/input/shared/renderer/dispatch_specs.js`.

## Update Steps

1. Open `brain/modules/alias-index.js`.
2. Open `data/input/shared/alias/alias_groups.js`.
3. Add or adjust runtime entries in `ALIAS_WORD_INDEX`.
4. Add or adjust documentation entries in the correct `ALIAS_GROUPS.*` bucket.
5. Ensure aliases are lowercase and normalized.
6. Keep one primary full English word as first item in the runtime words array.
7. If renderer alias metadata depends on these keys, verify alignment.
8. Run required checks:
   - `npm run lint --silent`
   - `npm test --silent`
   - `npm run refactor:gate --silent` (or `npm run refactor:gate`)

## No-Fixer Rule

- Alias/index sync is mandatory in the same pass.
- Deferred “fix alias later” passes are disallowed.
- Any mismatch blocks completion.

## Quick Check Commands

```bash
rg -n "\b[A-Za-z_][A-Za-z0-9_]*\b" app/renderer.js
rg -n "ALIAS_WORD_INDEX|getAliasWords|createAliasMap" brain/modules/alias-index.js app/renderer.js
rg -n "ALIAS_GROUPS" data/input/shared/alias/alias_groups.js
rg -n "PATTERN_EXTRACTED_MODULE|GROUP_SETS|DISPATCH_SPEC_MAP" app/renderer.js data/input/shared/renderer/group_sets.js data/input/shared/renderer/dispatch_specs.js
npm run lint --silent
npm test --silent
npm run refactor:gate --silent
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

No naming refactor is complete until runtime and documentation alias updates are both done in the same pass, and alignment checks are clean.

## Brain/Data/to-do Runtime Contract

- Brain runtime code only: `brain/*`
- Input data catalogs only: `data/input/*`
- Output artifacts/logs only: `data/output/*`
- Out-of-scope staging assets: `to-do/*`
- Wrapper execution mode: `two_pass_single_wrapper` (`identify_arguments` then `execute_pipeline`)
