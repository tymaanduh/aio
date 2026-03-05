---
name: refactor-blocking-gate
description: Enforce mandatory pre-merge blocking checks for refactor waves, including shape checks, extracted-key alignment, lint/test gates, and smoke checklist output.
---

# Refactor Blocking Gate

Use this skill whenever a refactor wave changes naming, extraction boundaries, lifecycle specs, or dispatch routing.

## Mandatory Trigger

Run when requests include:

- blocking gate
- no fixer
- quality gate
- refactor guardrail
- pre-merge checks

## Blocking Outcomes

1. Shape checks pass (no forbidden patterns).
2. Extracted-module/group-set/dispatch alignment passes.
3. `npm run governance:hard:gate` passes.
4. `npm run lint --silent` passes.
5. `npm test --silent` passes.
6. Smoke checklist is printed with explicit status markers.

## Workflow

1. Run `npm run refactor:gate`.
2. If any check fails, treat pass as incomplete.
3. Fix failures in same refactor pass.
4. Re-run gate until clean.

## No-Fixer Rule

- No deferred follow-up pass for failing gates.
- A refactor wave is complete only when the gate is green.

## Quick Commands

```bash
npm run refactor:gate
npm run governance:hard:gate
npm run lint --silent
npm test --silent
```

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
