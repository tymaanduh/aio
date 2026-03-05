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

## Promotion to Main

- Promotion is manual only.
- Promotion PR must pass full gate chain.
- No automatic merge from `aio/autopush` to `main`.

## Docs Freshness Rule

- Subsystem/policy/workflow/wrapper changes must include required `docs/` updates.
- Enforcement command: `npm run docs:freshness:check`.

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
