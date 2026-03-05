# Reliability Suggestions

Priority ordering is based on operational risk reduction for release confidence and reproducibility.

## P0

### 1) Add dedicated smoke evidence refresh script with metadata envelope

- Goal: deterministic evidence provenance per refresh run.
- Problem: `smoke:checklist --mark-all-pass` writes evidence logs, but run context metadata (actor/intent/gate id) is not standardized.
- Suggestion:
  - Add `scripts/smoke-refresh.js` wrapper around `smoke-checklist`.
  - Include metadata fields in note/log body: actor, purpose, command, run_id, source_commit.
- Effort: Medium
- Impact: High
- Acceptance:
  - Evidence logs include mandatory run metadata fields.
  - Report can be traced to exact commit and gate run.

### 2) Enforce smoke report freshness policy in release-candidate path

- Goal: prevent stale smoke evidence from passing candidate generation.
- Problem: release candidate currently relies on smoke report content but does not hard-fail on policy freshness windows directly.
- Suggestion:
  - Add freshness assertion in `scripts/release-candidate-bundle.js` using report `updated_at` and/or evidence mtime delta.
- Effort: Small
- Impact: High
- Acceptance:
  - Candidate gate fails with explicit issue when smoke evidence exceeds policy age.

## P1

### 3) Add API-to-test invariant check for preload catalog methods

- Goal: ensure every `window.app_api` method has at least one test reference or explicit waiver.
- Problem: namespace/alias drift can occur silently if method coverage is implicit.
- Suggestion:
  - Add script to parse `data/input/shared/ipc/preload_api_catalog.json` and cross-check `tests/*.test.js` references.
  - Emit uncovered methods with optional allowlist file.
- Effort: Medium
- Impact: High
- Acceptance:
  - CI/local gate reports uncovered methods and fails on unwaived gaps.

### 4) Add docs drift gate for inventory index vs tracked files

- Goal: keep docs baseline synchronized with code changes.
- Problem: `docs/inventory.index.json` can become stale after refactors.
- Suggestion:
  - Add a check script comparing scoped `git ls-files` against `inventory.index.json.file_entries`.
  - Fail when added/removed files are not reflected.
- Effort: Medium
- Impact: Medium-High
- Acceptance:
  - Gate fails on inventory drift and reports exact missing/extra paths.

## P2

### 5) Extend release evidence with smoke file age fields

- Goal: make smoke freshness visible in one artifact.
- Problem: age diagnostics currently require manual stat inspection.
- Suggestion:
  - Extend `scripts/release-evidence-bundle.js` smoke item payload with age hours and policy status.
- Effort: Small
- Impact: Medium
- Acceptance:
  - Bundle includes `evidence_age_hours` and `within_policy` per smoke item.

### 6) Add owner subsystem metadata to all inventories and reports

- Goal: reduce reviewer ambiguity during multi-wave refactors.
- Problem: large change sets are harder to triage without explicit ownership metadata.
- Suggestion:
  - Standardize `primary_subsystem` and optional `owner_group` in inventory/report artifacts.
  - Surface this in commit slice and release candidate summaries.
- Effort: Medium
- Impact: Medium
- Acceptance:
  - Reports show subsystem ownership for changed artifacts/features.

## Suggested Implementation Order

1. P0 suggestion 1
2. P0 suggestion 2
3. P1 suggestion 3
4. P1 suggestion 4
5. P2 suggestion 5
6. P2 suggestion 6
