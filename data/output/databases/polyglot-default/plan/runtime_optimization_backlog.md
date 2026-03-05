# Runtime Optimization Backlog

- Generated At: 2026-03-05T14:03:54.025Z
- Total Tasks: 9
- P0: 0
- P1: 5
- P2: 4

## P0 Tasks

- none

## P1 Tasks

1. [runtime-stage-pipeline-latency] Optimize pipeline runtime latency
   - Category: runtime
   - Impact: Reduces total workflow completion time.
   - Effort: medium
   - Action: Profile and optimize 'pipeline' stage. Current duration: 9584 ms.
   - Command: `npm run workflow:general -- --mode maintain --script-runtime-auto-best --scope "pipeline tuning"`
   - Evidence: data/output/databases/polyglot-default/analysis/script_runtime_swap_report.json
2. [runtime-stage-preflight-latency] Optimize preflight runtime latency
   - Category: runtime
   - Impact: Reduces total workflow completion time.
   - Effort: medium
   - Action: Profile and optimize 'preflight' stage. Current duration: 1353 ms.
   - Command: `npm run workflow:general -- --mode maintain --script-runtime-auto-best --scope "preflight tuning"`
   - Evidence: data/output/databases/polyglot-default/analysis/script_runtime_swap_report.json
3. [runtime-strict-smoke] Add strict runtime smoke run to detect adapter drift early
   - Category: runtime
   - Impact: Detects adapter/toolchain regressions before fallback masks failures.
   - Effort: low
   - Action: Run a strict runtime maintain pass in automation and fail fast on missing adapters.
   - Command: `npm run workflow:general -- --mode maintain --script-runtime-auto-best --script-runtime-strict`
   - Evidence: data/output/databases/polyglot-default/analysis/script_runtime_swap_report.json
4. [token-heavy-to-do-agents-agent-access-control-json] Reduce token weight in to-do/agents/agent_access_control.json
   - Category: token-efficiency
   - Impact: Lowers Codex context cost and speed variance.
   - Effort: medium
   - Action: Split high-token sections into smaller catalogs/modules. Current estimate: 3541 tokens.
   - Command: `npm run efficiency:audit -- --enforce`
   - Evidence: data/output/databases/polyglot-default/analysis/codex_efficiency_report.json, to-do/agents/agent_access_control.json
5. [token-heavy-to-do-skills-repeat-action-routing-json] Reduce token weight in to-do/skills/repeat_action_routing.json
   - Category: token-efficiency
   - Impact: Lowers Codex context cost and speed variance.
   - Effort: medium
   - Action: Split high-token sections into smaller catalogs/modules. Current estimate: 3704 tokens.
   - Command: `npm run efficiency:audit -- --enforce`
   - Evidence: data/output/databases/polyglot-default/analysis/codex_efficiency_report.json, to-do/skills/repeat_action_routing.json

## P2 Tasks

1. [guardrail-deduplication] Deduplicate repeated scope guardrails in agent metadata
   - Category: metadata
   - Impact: Shrinks prompt size and simplifies agent maintenance.
   - Effort: low
   - Action: Centralize repeated guardrails into shared constants; duplicate groups: 3, max count: 17 (budget: 20).
   - Command: `npm run agents:scope-sync && npm run agents:validate`
   - Evidence: data/output/databases/polyglot-default/analysis/codex_efficiency_report.json
2. [token-heavy-to-do-agents-agent-workflow-shards-index-json] Reduce token weight in to-do/agents/agent_workflow_shards/index.json
   - Category: token-efficiency
   - Impact: Lowers Codex context cost and speed variance.
   - Effort: medium
   - Action: Split high-token sections into smaller catalogs/modules. Current estimate: 1293 tokens.
   - Command: `npm run efficiency:audit -- --enforce`
   - Evidence: data/output/databases/polyglot-default/analysis/codex_efficiency_report.json, to-do/agents/agent_workflow_shards/index.json
3. [token-heavy-to-do-skills-linked-naming-governor-skill-md] Reduce token weight in to-do/skills/linked-naming-governor/SKILL.md
   - Category: token-efficiency
   - Impact: Lowers Codex context cost and speed variance.
   - Effort: medium
   - Action: Split high-token sections into smaller catalogs/modules. Current estimate: 1209 tokens.
   - Command: `npm run efficiency:audit -- --enforce`
   - Evidence: data/output/databases/polyglot-default/analysis/codex_efficiency_report.json, to-do/skills/linked-naming-governor/SKILL.md
4. [token-heavy-to-do-skills-polyglot-default-orchestrator-skill-md] Reduce token weight in to-do/skills/polyglot-default-orchestrator/SKILL.md
   - Category: token-efficiency
   - Impact: Lowers Codex context cost and speed variance.
   - Effort: medium
   - Action: Split high-token sections into smaller catalogs/modules. Current estimate: 1688 tokens.
   - Command: `npm run efficiency:audit -- --enforce`
   - Evidence: data/output/databases/polyglot-default/analysis/codex_efficiency_report.json, to-do/skills/polyglot-default-orchestrator/SKILL.md

