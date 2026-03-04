---
name: agent-skill-decision-editor
description: Consume a reviewer decision packet, choose the final approach, and apply concrete edits to SKILL.md and agent metadata files with blocking validation.
---

# Agent Skill Decision Editor

Use this skill after `agent-skill-review-research` creates a decision packet.

## Purpose

- Act as the decision-maker for agent/skill architecture changes.
- Convert review alternatives into final codebase edits.
- Update `SKILL.md`, agent metadata, workflow registries, and routing files.

## Required Inputs

- Decision packet from reviewer agent.
- Current files:
  - `to-do/skills/*/SKILL.md`
  - `to-do/skills/*/agents/openai.yaml`
  - `to-do/skills/agent_workflows.json`
  - `to-do/skills/repeat_action_routing.json`
  - `to-do/agents/*.yaml`
  - `to-do/agents/agents_registry.yaml`
  - `to-do/agents/agent_access_control.json`
  - `data/input/databases/agent_access_requests.ndjson` (if present)
  - `data/output/logs/change-log/update_events.ndjson` (if present)
  - `data/output/logs/change-log/sessions.ndjson` (if present)

## Edit Targets

- Skills: add/update/remove `SKILL.md`.
- Skill metadata: add/update `to-do/skills/*/agents/openai.yaml`.
- Agent profiles: update `to-do/agents/*.yaml`.
- Agent registry: update `to-do/agents/agents_registry.yaml`.
- Workflow/routing: update `to-do/skills/agent_workflows.json`, `to-do/skills/repeat_action_routing.json`.
- Access control: update `to-do/agents/agent_access_control.json` and related request tooling/scripts.
- Update logging: update `scripts/repo-update-log.js` and logging metadata/contracts as needed.

## Workflow

1. Parse decision packet and validate required fields.
2. Select `recommended.alternative_id` as authoritative plan.
3. Apply required edits exactly once (no deferred fixer pass).
4. Enforce startup-tool-cap and privilege-request contract consistency.
5. Enforce full-file-update logging contract (scan + watch + timestamped event output).
6. Enforce JSON source-of-truth and instruction-template dedupe contracts when in scope.
7. Validate formatting and config integrity.
8. Run blocking checks.

## Blocking Checks

- `node -e "JSON.parse(...)"` for modified JSON files.
- `npm run agents:validate`
- `npm run lint --silent`
- `npm test --silent`
- `npm run refactor:gate --silent` (or `npm run refactor:gate`)

## Policy

- If packet and codebase reality diverge, patch packet intent in-line and continue.
- If naming changes introduce abbreviations, trigger same-pass alias sync:
  - `brain/modules/alias-index.js`
  - `data/input/shared/alias/alias_groups.js`
- If data/instruction governance is in scope, trigger same-pass:
  - `to-do/skills/json-instruction-registry-governor/SKILL.md`
  - `to-do/skills/agent_workflows.json`
  - `to-do/skills/repeat_action_routing.json`
- Keep `allow_implicit_invocation: true` for updated/new skill agents unless explicitly overridden.

## Brain/Data/to-do Runtime Contract

- Brain runtime code only: `brain/*`
- Input data catalogs only: `data/input/*`
- Output artifacts/logs only: `data/output/*`
- Out-of-scope staging assets: `to-do/*`
- Wrapper execution mode: `two_pass_single_wrapper` (`identify_arguments` then `execute_pipeline`)
