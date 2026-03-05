# Operations Runbook

This runbook defines the default reliability gate chain and artifact relationships.

## Gate Chain (Release-Grade Order)

1. `npm run agents:validate`
2. `npm run commit:slices:report -- --strict --strict-no-overlap`
3. `npm run audit:data-separation -- --enforce-no-regression --baseline-file data/output/databases/polyglot-default/analysis/data_separation_baseline.json`
4. `npm run smoke:checklist -- --verify-evidence --require-all-pass --max-evidence-age-hours 168`
5. `npm run lint --silent`
6. `npm test --silent`
7. `npm run refactor:gate --silent`
8. `npm run premerge:checklist`
9. `npm run release:evidence`
10. `npm run release:candidate -- --planned-update "post-gate-release-sync"`

## Smoke Evidence Lifecycle

- Checklist source: `scripts/smoke-checklist.js`
- Evidence logs: `data/output/logs/smoke/*.log`
- Report target: `data/output/databases/polyglot-default/reports/smoke_checklist_report.json`

### Refresh Evidence

- Mark all current smoke IDs pass and write new evidence files:
  - `npm run smoke:checklist -- --mark-all-pass`
- Verify evidence existence and freshness:
  - `npm run smoke:checklist -- --verify-evidence --require-all-pass --max-evidence-age-hours 168`

## Artifact Dependency Chain

1. `smoke_checklist_report.json` drives smoke status in premerge and release checks.
2. `release_evidence_bundle.json` depends on:
   - validation report
   - separation audit
   - update scan
   - smoke report + evidence file existence
3. `release_candidate_bundle.json` depends on:
   - run state
   - validation/update scan
   - separation audit
   - smoke report summary
   - release evidence gate result
   - commit slice report clean status

## Key Report Files

- `data/output/databases/polyglot-default/analysis/validation_report.json`
- `data/output/databases/polyglot-default/analysis/data_separation_audit_report.json`
- `data/output/databases/polyglot-default/analysis/update_scan_report.json`
- `data/output/databases/polyglot-default/context/run_state.json`
- `data/output/databases/polyglot-default/reports/commit_slice_report.json`
- `data/output/databases/polyglot-default/reports/smoke_checklist_report.json`
- `data/output/databases/polyglot-default/reports/release_evidence_bundle.json`
- `data/output/databases/polyglot-default/reports/release_candidate_bundle.json`

## Failure Triage

### Smoke failures

- Missing evidence path/file:
  - rerun `smoke:checklist` with `--mark-all-pass` or specific `--set-pass` ids
- Stale evidence:
  - regenerate evidence and re-verify with age limit

### Commit slice failures

- Update `to-do/commit_slices.json` so new changed files map to a single slice path strategy.

### Release gate failures

- Re-run in order:
  1. `npm run premerge:checklist`
  2. `npm run release:evidence`
  3. `npm run release:candidate -- --planned-update "post-gate-release-sync"`

## Routine Maintenance

- After any large refactor wave:
  - refresh smoke evidence
  - regenerate release bundles
  - ensure `commit_slice_report.json` remains `status: clean`
- Keep docs and inventory current:
  - `npm run docs:inventory`
  - update `docs/*.md` summaries if subsystem/feature ownership changed
