# to-do Staging Contract

`to-do/` is the staging area for assets that are not in active runtime scope yet.

## What Belongs Here

- `to-do/agents/`: agent metadata and access-policy contracts.
- `to-do/skills/`: skill docs, routing maps, and skill agent metadata.
- `to-do/staging/`: temporary migration work.
- `to-do/unclassified/`: files pending classification into `brain/`, `data/input/`, or `data/output/`.

## Promotion Rules

- Promote a file out of `to-do/` only when it has a stable runtime home.
- Runtime code must move to `brain/*`.
- Input catalogs/groups/labels/aliases must move to `data/input/*`.
- Generated artifacts/logs/reports must move to `data/output/*`.
- After promotion, update references in rules/workflows/registries in the same pass.

## Required Governance Checks

- `npm run agents:validate`
- `npm run codex:desktop:validate`
- `npm run contracts:validate`
- `npm run updates:scan -- --actor <agent-id> --scope "<scope>"`
- `npm run lint --silent`
- `npm test --silent`
- `npm run refactor:gate --silent`
