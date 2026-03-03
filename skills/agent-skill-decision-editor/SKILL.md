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
  - `skills/*/SKILL.md`
  - `skills/*/agents/openai.yaml`
  - `skills/agent_workflows.json`
  - `skills/repeat_action_routing.json`
  - `agents/*.yaml`
  - `agents/agents_registry.yaml`

## Edit Targets

- Skills: add/update/remove `SKILL.md`.
- Skill metadata: add/update `agents/openai.yaml`.
- Agent profiles: update `agents/*.yaml`.
- Agent registry: update `agents/agents_registry.yaml`.
- Workflow/routing: update `skills/agent_workflows.json`, `skills/repeat_action_routing.json`.

## Workflow

1. Parse decision packet and validate required fields.
2. Select `recommended.alternative_id` as authoritative plan.
3. Apply required edits exactly once (no deferred fixer pass).
4. Validate formatting and config integrity.
5. Run blocking checks.

## Blocking Checks

- `node -e "JSON.parse(...)"` for modified JSON files.
- `npm run lint --silent`
- `npm test --silent`
- `npm run refactor:gate --silent` (or `npm run refactor:gate`)

## Policy

- If packet and codebase reality diverge, patch packet intent in-line and continue.
- If naming changes introduce abbreviations, trigger same-pass alias sync:
  - `app/modules/alias-index.js`
  - `data/shared/alias/alias_groups.js`
- Keep `allow_implicit_invocation: true` for updated/new skill agents unless explicitly overridden.
