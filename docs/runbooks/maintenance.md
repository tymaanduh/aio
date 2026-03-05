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
