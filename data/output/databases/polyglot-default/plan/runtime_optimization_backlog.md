# Runtime Optimization Backlog

- Generated At: 2026-03-05T10:04:44.233Z
- Total Tasks: 10
- P0: 0
- P1: 6
- P2: 4

## P0 Tasks

- none

## P1 Tasks

1. [automation-prompt-aio-continuous-backlog-executor] Trim automation prompt tokens for AIO Continuous Backlog Executor
   - Category: automation
   - Impact: Reduces autonomous run token usage and prompt drift.
   - Effort: low
   - Action: Compress automation prompt to <= 52 estimated tokens. Current estimate: 68.
   - Command: `npm run automations:optimize`
   - Evidence: data/output/databases/polyglot-default/analysis/codex_efficiency_report.json
2. [automation-prompt-iso-standards-watch] Trim automation prompt tokens for ISO Standards Watch
   - Category: automation
   - Impact: Reduces autonomous run token usage and prompt drift.
   - Effort: low
   - Action: Compress automation prompt to <= 52 estimated tokens. Current estimate: 63.
   - Command: `npm run automations:optimize`
   - Evidence: data/output/databases/polyglot-default/analysis/codex_efficiency_report.json
3. [runtime-stage-pipeline-latency] Optimize pipeline runtime latency
   - Category: runtime
   - Impact: Reduces total workflow completion time.
   - Effort: medium
   - Action: Profile and optimize 'pipeline' stage. Current duration: 3780 ms.
   - Command: `npm run workflow:general -- --mode maintain --script-runtime-auto-best --scope "pipeline tuning"`
   - Evidence: data/output/databases/polyglot-default/analysis/script_runtime_swap_report.json
4. [runtime-strict-smoke] Add strict runtime smoke run to detect adapter drift early
   - Category: runtime
   - Impact: Detects adapter/toolchain regressions before fallback masks failures.
   - Effort: low
   - Action: Run a strict runtime maintain pass in automation and fail fast on missing adapters.
   - Command: `npm run workflow:general -- --mode maintain --script-runtime-auto-best --script-runtime-strict`
   - Evidence: data/output/databases/polyglot-default/analysis/script_runtime_swap_report.json
5. [token-heavy-to-do-agents-agent-access-control-json] Reduce token weight in to-do/agents/agent_access_control.json
   - Category: token-efficiency
   - Impact: Lowers Codex context cost and speed variance.
   - Effort: medium
   - Action: Split high-token sections into smaller catalogs/modules. Current estimate: 3596 tokens.
   - Command: `npm run efficiency:audit -- --enforce`
   - Evidence: data/output/databases/polyglot-default/analysis/codex_efficiency_report.json, to-do/agents/agent_access_control.json
6. [token-heavy-to-do-skills-repeat-action-routing-json] Reduce token weight in to-do/skills/repeat_action_routing.json
   - Category: token-efficiency
   - Impact: Lowers Codex context cost and speed variance.
   - Effort: medium
   - Action: Split high-token sections into smaller catalogs/modules. Current estimate: 3379 tokens.
   - Command: `npm run efficiency:audit -- --enforce`
   - Evidence: data/output/databases/polyglot-default/analysis/codex_efficiency_report.json, to-do/skills/repeat_action_routing.json

## P2 Tasks

1. [benchmark-case-expansion] Expand runtime benchmark case catalog coverage
   - Category: benchmark
   - Impact: Improves confidence in per-function language winner decisions.
   - Effort: medium
   - Action: Increase benchmark cases from 11 to at least 20 with representative IO-heavy and string-heavy wrappers.
   - Command: `npm run benchmark:runtime -- --languages javascript,python,cpp`
   - Evidence: data/output/databases/polyglot-default/reports/polyglot_runtime_benchmark_report.json, data/input/shared/wrapper/runtime_benchmark_cases.json
2. [guardrail-deduplication] Deduplicate repeated scope guardrails in agent metadata
   - Category: metadata
   - Impact: Shrinks prompt size and simplifies agent maintenance.
   - Effort: low
   - Action: Centralize repeated guardrails into shared constants; currently duplicated entries: 7.
   - Command: `npm run agents:scope-sync && npm run agents:validate`
   - Evidence: data/output/databases/polyglot-default/analysis/codex_efficiency_report.json
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

