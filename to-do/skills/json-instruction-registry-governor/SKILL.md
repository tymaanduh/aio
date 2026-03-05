---
name: json-instruction-registry-governor
description: Enforce JSON source-of-truth data catalogs and deduplicated instruction-template registries, with JS wrapper functions limited to 1:1 action runners.
---

# JSON Instruction Registry Governor

Use this skill whenever operation/data definitions risk being hardcoded in `.js` files.

## Mandatory Trigger

Run when requests include:

- no hardcoded js data
- store data in json
- instruction sets
- wrappers 1:1 actions
- dedupe operation templates
- math operation pipeline

## Required Outcomes

1. Domain data maps (groups, labels, aliases, operation definitions) live in JSON catalogs.
2. JS modules consume catalog JSON and execute generic wrapper action runners.
3. Each operation instruction set is deduplicated via template refs when repeated patterns exist.
4. Wrapper actions stay 1:1 (single action per runner, no multi-domain branching logic).
5. Input identification is explicit before execution (`identify_needed_data` style contract).

## Workflow

1. Inventory target module data currently embedded in JS.
2. Move domain data to JSON catalog under `data/input/shared/*`.
3. Build/normalize instruction template registry in JSON.
4. Refactor operation entries to template refs + minimal operation metadata.
5. Keep JS as:

- catalog loader
- normalizer
- action runner map
- execution orchestrator

6. Add/update tests for:

- template dedupe correctness
- input identification behavior
- wrapper execution outputs

7. Run blocking checks.

## Blocking Rules

- No inline domain data registries in JS targeted by this pass.
- No duplicate instruction sequences when a template can be reused.
- No completion without tests covering instruction-template execution.

## Blocking Checks

- `node -e "JSON.parse(require('fs').readFileSync('data/input/shared/math/io_assembly_line_math.json','utf8'))"`
- `npm run lint --silent`
- `npm test --silent`
- `npm run refactor:gate --silent` (or `npm run refactor:gate`)

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
