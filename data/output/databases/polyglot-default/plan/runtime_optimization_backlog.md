# Runtime Optimization Backlog

- Generated At: 2026-03-06T21:59:28.537904Z
- Total Tasks: 11
- P0: 0
- P1: 8
- P2: 3

## P0 Tasks

- none

## P1 Tasks

1. [runtime-stage-agent_registry_validation-latency] Optimize agent_registry_validation runtime latency
   - Category: runtime
   - Impact: Reduces total workflow completion time.
   - Effort: medium
   - Action: Profile and optimize 'agent_registry_validation' stage. Current duration: 7266 ms.
   - Command: `npm run workflow:general -- --mode maintain --script-runtime-auto-best --scope "agent_registry_validation tuning"`
   - Evidence: data/output/databases/polyglot-default/analysis/script_runtime_swap_report.json
2. [runtime-stage-hard_governance-latency] Optimize hard_governance runtime latency
   - Category: runtime
   - Impact: Reduces total workflow completion time.
   - Effort: medium
   - Action: Profile and optimize 'hard_governance' stage. Current duration: 13445 ms.
   - Command: `npm run workflow:general -- --mode maintain --script-runtime-auto-best --scope "hard_governance tuning"`
   - Evidence: data/output/databases/polyglot-default/analysis/script_runtime_swap_report.json
3. [runtime-stage-pipeline-latency] Optimize pipeline runtime latency
   - Category: runtime
   - Impact: Reduces total workflow completion time.
   - Effort: medium
   - Action: Profile and optimize 'pipeline' stage. Current duration: 6460 ms.
   - Command: `npm run workflow:general -- --mode maintain --script-runtime-auto-best --scope "pipeline tuning"`
   - Evidence: data/output/databases/polyglot-default/analysis/script_runtime_swap_report.json
4. [runtime-stage-runtime_optimization_backlog-latency] Optimize runtime_optimization_backlog runtime latency
   - Category: runtime
   - Impact: Reduces total workflow completion time.
   - Effort: medium
   - Action: Profile and optimize 'runtime_optimization_backlog' stage. Current duration: 6666 ms.
   - Command: `npm run workflow:general -- --mode maintain --script-runtime-auto-best --scope "runtime_optimization_backlog tuning"`
   - Evidence: data/output/databases/polyglot-default/analysis/script_runtime_swap_report.json
5. [runtime-stage-uiux_blueprint-latency] Optimize uiux_blueprint runtime latency
   - Category: runtime
   - Impact: Reduces total workflow completion time.
   - Effort: medium
   - Action: Profile and optimize 'uiux_blueprint' stage. Current duration: 23012 ms.
   - Command: `npm run workflow:general -- --mode maintain --script-runtime-auto-best --scope "uiux_blueprint tuning"`
   - Evidence: data/output/databases/polyglot-default/analysis/script_runtime_swap_report.json
6. [runtime-strict-smoke] Add strict runtime smoke run to detect adapter drift early
   - Category: runtime
   - Impact: Detects adapter/toolchain regressions before fallback masks failures.
   - Effort: low
   - Action: Run a strict runtime maintain pass in automation and fail fast on missing adapters.
   - Command: `npm run workflow:general -- --mode maintain --script-runtime-auto-best --script-runtime-strict`
   - Evidence: data/output/databases/polyglot-default/analysis/script_runtime_swap_report.json
7. [token-heavy-to-do-agents-agent-access-control-json] Reduce token weight in to-do/agents/agent_access_control.json
   - Category: token-efficiency
   - Impact: Lowers Codex context cost and speed variance.
   - Effort: medium
   - Action: Split high-token sections into smaller catalogs/modules. Current estimate: 3541 tokens.
   - Command: `npm run efficiency:audit -- --enforce`
   - Evidence: data/output/databases/polyglot-default/analysis/codex_efficiency_report.json, to-do/agents/agent_access_control.json
8. [token-heavy-to-do-skills-repeat-action-routing-json] Reduce token weight in to-do/skills/repeat_action_routing.json
   - Category: token-efficiency
   - Impact: Lowers Codex context cost and speed variance.
   - Effort: medium
   - Action: Split high-token sections into smaller catalogs/modules. Current estimate: 3742 tokens.
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
   - Action: Centralize repeated guardrails into shared constants; duplicate groups: 3, max count: 17 (budget: 20).
   - Command: `npm run agents:scope-sync && npm run agents:validate`
   - Evidence: data/output/databases/polyglot-default/analysis/codex_efficiency_report.json
3. [token-heavy-to-do-agents-agent-workflow-shards-index-json] Reduce token weight in to-do/agents/agent_workflow_shards/index.json
   - Category: token-efficiency
   - Impact: Lowers Codex context cost and speed variance.
   - Effort: medium
   - Action: Split high-token sections into smaller catalogs/modules. Current estimate: 1294 tokens.
   - Command: `npm run efficiency:audit -- --enforce`
   - Evidence: data/output/databases/polyglot-default/analysis/codex_efficiency_report.json, to-do/agents/agent_workflow_shards/index.json

