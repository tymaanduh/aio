# TODO

## Scope

- Architecture roots:
  - `brain/` = runtime functions + wrappers only
  - `data/input/` = catalogs, labels/groups/aliases, inbound datastream definitions
  - `data/output/` = generated artifacts, reports, logs
  - `to-do/` = staging and out-of-scope assets
- Runtime contract:
  - single entry wrapper: `brain/wrappers/unified_io_wrapper.js`
  - two-pass execution: `identify_arguments` -> `execute_pipeline`

## Active Backlog

- [ ] Move remaining repeated constant/object walls from JS into `data/input/shared/*`.
- [ ] Expand `data/input/shared/math/*` operation catalogs to cover all currently duplicated math/action patterns.
- [ ] Keep wrappers 1:1 action-only and remove non-essential branch logic where deterministic action maps can replace it.
- [ ] Continue renderer/domain extraction into `brain/modules/*` and enforce dispatch-first orchestration.
- [x] Add/maintain tests for wrapper argument-identification pass and pipeline execution pass.
- [x] Keep all logs under `data/output/logs/*` and all generated reports under `data/output/databases/*`.
- [x] Enforce commit-slice classification report with strict unsliced-file failure.

## Agent And Skill Governance

- [x] Keep all agent ids synchronized across:
  - `to-do/agents/*.yaml`
  - `to-do/agents/agents_registry.yaml`
  - `to-do/agents/agent_access_control.json`
  - `to-do/skills/agent_workflows.json`
- [x] Enforce startup tool caps and non-startup tool access request logging.
- [x] Enforce full update logging (scan at start/end, watch during long edit sessions).
- [x] Keep all skill agent metadata on the `interface` + `policy` schema with `allow_implicit_invocation: true` unless explicitly overridden.
- [x] Run `npm run agents:validate` before workflow completion.
- [x] Keep governance versions aligned across registry/workflows/access-control files.

## Default Run Commands

- `npm run workflow:general -- --planned-update "<summary>"`
- `npm run workflow:continue -- --planned-update "<summary>"`
- `npm run wrapper:run -- --pipeline-id pipeline_default_math --input-json '{"x":3,"y":4}'`
- `npm run audit:data-separation --`
- `npm run agents:validate`
- `npm run commit:slices:report -- --strict`
- `npm run lint --silent`
- `npm test --silent`
- `npm run refactor:gate --silent`
