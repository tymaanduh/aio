---
name: agent-skill-review-research
description: Audit existing agents and skills, compare old vs proposed designs, and produce alternative workflow options with a structured decision packet for a separate editor/decider agent.
---

# Agent Skill Review Research

Use this skill when the task is to analyze agent/skill quality before editing.

## Purpose

- Evaluate current agent + skill architecture.
- Compare old/new patterns and identify gaps.
- Propose alternative methods with deeper scope coverage.
- Produce a decision packet for a separate decision-editor agent.

## Input Scope

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

## Output Contract (Decision Packet)

Produce a packet with this shape:

```json
{
  "scope": "string",
  "baseline": {
    "agents": [],
    "skills": [],
    "workflow_gaps": [],
    "naming_or_policy_issues": []
  },
  "alternatives": [
    {
      "id": "alt_a|alt_b|alt_c",
      "summary": "string",
      "benefits": [],
      "risks": [],
      "fit_score": 0,
      "complexity_score": 0
    }
  ],
  "recommended": {
    "alternative_id": "alt_*",
    "reason": "string",
    "required_edits": [
      {
        "path": "path/to/file",
        "change_type": "add|update|delete",
        "intent": "string"
      }
    ]
  }
}
```

## Workflow

1. Inventory current skills/agents and routing.
2. Run `npm run governance:hard -- --check --enforce` and capture failing policy items.
3. Detect overlap, missing specialization, weak triggers, and policy drift.
4. Detect hardcoded JS data registries and redundant instruction sets that should be template-ref based.
5. Build at least 2 alternatives (A/B minimum) and score each.
6. Select one recommendation and define explicit file edit intents.
7. Hand off packet to the decision-editor agent (do not perform final edits unless explicitly requested).
8. Require full-file-update logging contract in recommended edits when missing.

## Blocking Rules

- No recommendation without alternatives comparison.
- No recommendation without explicit file-level edit intents.
- No vague output; decision packet fields are required.
- No pass if hard-governance check is failing without explicit remediation plan.
- If naming/alias impact exists, flag `pre-assign-naming-gate` + `dictionary-alias-sync` as required in packet.
- If data/instruction governance impact exists, flag `json-instruction-registry-governor` as required in packet.
- If tool-permission architecture is in scope, include startup-tool-cap + privilege-request logging implications in each alternative.

## Validation

- Ensure packet references existing paths.
- Ensure recommendation has at least one concrete edit target.
- Ensure recommended edits keep agent ids aligned across YAML, registry, workflow, and access-control stores.

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
