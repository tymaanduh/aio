# Codex Desktop Agent + Skill Contract

This workspace keeps agent/skill source files under `to-do/`.

## Source of Truth

- Skills: `to-do/skills/*`
- Agent metadata: `to-do/agents/*`
- Agent workflow/routing: `to-do/skills/agent_workflows.json`, `to-do/skills/repeat_action_routing.json`

## Required Update Flow

1. `npm run agents:scope-sync`
2. `npm run codex:desktop:validate`
3. `npm run codex:desktop:sync` (or `npm run codex:desktop:sync:dry-run`)

## Codex Desktop Sync Targets

- Skills are synced to `%USERPROFILE%\\.codex\\skills\\<skill-name>`.
- Agent metadata snapshots are synced to `%USERPROFILE%\\.codex\\agents\\aio`.

Notes:

- Codex Desktop skill UI reads `SKILL.md` and `agents/openai.yaml`.
- Keep `agents/openai.yaml` limited to supported interface/dependencies/policy keys.
- Agent YAML/JSON files remain project governance artifacts and are exported as snapshots for desktop workflows.
