---
name: linked-naming-governor
description: Enforce semantic, linked naming across objects, functions, groups, folders, and modules using a Window_Page_Control_Module chain and language-aware casing rules.
---

# Linked Naming Governor

Use this skill whenever names are created or renamed for files, object keys, functions, registries, or ownership labels.

## Linked Chain

- Every name must map to `window -> page -> control -> module`.
- Surface that ownership in at least one of:
  - path segment
  - registry key
  - object path
  - function ownership

## Format Rules

- folders/files: `snake_case`; add `_window`, `_page`, `_control`, `_module` when applicable
- registries/config maps: `UPPER_SNAKE`; include linked chain labels for cross-layer names
- runtime namespaces: `G_*`
- reusable literals/maps: `PATTERN_*`
- functions and local object keys: `camelCase`; functions should start with a verb

## Blocking Rules

- Avoid ambiguous generic names like `data`, `utils`, `helper`, or `manager` without a domain prefix.
- Keep word order consistent across path, registry, namespace, and function forms.
- Any `*_control` or `*_module` name must have an explicit owner.
- If abbreviations are introduced, update `brain/modules/alias_index.js` and `data/input/shared/alias/alias_groups.js` in the same pass.

## Workflow

1. Define canonical `window`, `page`, `control`, and `module` words first.
2. Derive file path, registry key, object path, and function name from the same chain.
3. Apply the rename in one pass across code, paths, and constants.
4. Run:
   `npm run lint --silent`
   `npm test --silent`
   `npm run refactor:gate --silent`

## Brain/Data/to-do Runtime Contract

- Brain runtime code only: `brain/*`
- Input data catalogs only: `data/input/*`
- Output artifacts/logs only: `data/output/*`
- Out-of-scope staging assets: `to-do/*`
- Wrapper execution mode: `two_pass_single_wrapper` (`identify_arguments` then `execute_pipeline`)

## Project Scope Guardrails

- Keep changes inside `app/`, `brain/`, `data/input/`, `data/output/`, `main/`, `renderer/`, `scripts/`, `tests/`, and `to-do/`.
- Keep runtime logic in `brain/*`; keep catalogs/specs in `data/input/*`; keep generated artifacts/logs in `data/output/*`.
- Do not introduce cloud/deployment/provider workflows unless explicitly requested.
- Preserve the two-pass wrapper contract (`identify_arguments` before `execute_pipeline`) when touching wrapper flows.
- Re-run `npm run agents:validate` after agent/skill metadata changes.
