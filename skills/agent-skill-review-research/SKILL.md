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

- `skills/*/SKILL.md`
- `skills/*/agents/openai.yaml`
- `skills/agent_workflows.json`
- `skills/repeat_action_routing.json`
- `agents/*.yaml`
- `agents/agents_registry.yaml`

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
2. Detect overlap, missing specialization, weak triggers, and policy drift.
3. Build at least 2 alternatives (A/B minimum) and score each.
4. Select one recommendation and define explicit file edit intents.
5. Hand off packet to the decision-editor agent (do not perform final edits unless explicitly requested).

## Blocking Rules

- No recommendation without alternatives comparison.
- No recommendation without explicit file-level edit intents.
- No vague output; decision packet fields are required.
- If naming/alias impact exists, flag `pre-assign-naming-gate` + `dictionary-alias-sync` as required in packet.

## Validation

- Ensure packet references existing paths.
- Ensure recommendation has at least one concrete edit target.
