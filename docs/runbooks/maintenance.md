# Maintenance Runbook

## Branch Lanes

- `main`: protected governance lane.
- `aio/autopush`: autonomous no-review lane for continuous integration updates.

## Autonomous Branch Safety Gate

Before any automatic push to `aio/autopush`, run:

1. `npm run contracts:validate`
2. `npm run lint --silent`
3. `npm test --silent`

If all pass:

- commit and push directly to `aio/autopush`.

If any fail:

- do not push.
- open/update a maintenance issue containing failed command, exit code, and artifact links.

Condition model:

- use event/drift triggers (push/PR/manual/workflow-run), not fixed day/time waves.

## Promotion to Main

- Promotion is manual only.
- Promotion PR must pass full gate chain.
- No automatic merge from `aio/autopush` to `main`.

## Docs Freshness Rule

- Subsystem/policy/workflow/wrapper changes must include required `docs/` updates.
- Enforcement command: `npm run docs:freshness:check`.

## Token Maintenance Loop

- Token policy catalog: `data/input/shared/main/token_usage_optimization_policy_catalog.json`
- One-shot maintenance command:
  - `npm run token:maintain`
- The loop runs:
  1. `npm run agents:scope-sync`
  2. `npm run automations:optimize -- --apply`
  3. `npm run efficiency:gate`

## Polyglot Script Swap Controls

- Catalog: `data/input/shared/main/polyglot_script_swap_catalog.json`
- Validation command: `npm run script-swaps:validate`
- Default order: `javascript,python,cpp`
- Env overrides:
  - `AIO_SCRIPT_RUNTIME_LANGUAGE` to force preferred runtime
  - `AIO_SCRIPT_RUNTIME_ORDER` for runtime fallback order
  - `AIO_SCRIPT_RUNTIME_DISABLE=1` to force javascript-only stage execution
  - `AIO_SCRIPT_RUNTIME_STRICT=1` to disable runtime fallback retries
  - `AIO_SCRIPT_RUNTIME_AUTO_BEST=1` to auto-select stage runtime from benchmark winners
- CLI overrides (`general-workflow`/`workflow-preflight`):
  - `--script-runtime <javascript|python|cpp>`
  - `--script-runtime-order <csv>`
  - `--script-runtime-auto-best`
  - `--script-runtime-strict`
  - `--disable-script-swaps`
- Runtime telemetry report:
  - `data/output/databases/polyglot-default/analysis/script_runtime_swap_report.json`
- Runtime optimization backlog artifacts:
  - `data/output/databases/polyglot-default/plan/runtime_optimization_backlog.json`
  - `data/output/databases/polyglot-default/plan/runtime_optimization_backlog.md`
- Runtime backlog command:
  - `npm run optimization:backlog`

## Full Script Equivalent Sync

- Generate Python/C++ equivalents for every JS script:
  - `npm run scripts:polyglot:generate`
- Verify equivalents are in sync (no drift/missing/stale files):
  - `npm run scripts:polyglot:check`
- Equivalent index catalog:
  - `data/output/databases/polyglot-default/build/script_polyglot_equivalents_catalog.json`

## Standards Drift Monitoring

- Workflow: `.github/workflows/standards-drift-monitor.yml`
- Triggered by push/PR/manual and governance workflow completion.
- Runs:
  1. `npm run standards:baseline:gate`
  2. `npm run standards:iso:gate`
  3. `npm run uiux:blueprint:check`
- On gate failure or ISO catalog drift:
  - open/update a maintenance issue with command exit codes and artifact links.

## Strict Runtime Smoke

- Workflow: `.github/workflows/runtime-strict-smoke.yml`
- Triggered by push/PR/manual.
- Runs strict maintain mode with benchmark-selected runtime:
  - `npm run workflow:general -- --mode maintain --script-runtime-auto-best --script-runtime-strict`
- Uploads strict runtime logs + swap/benchmark artifacts.
- On failure:
  - open/update maintenance issue `Runtime strict smoke failure` with run URL and remediation checklist.
