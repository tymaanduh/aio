# Runtime Optimization Backlog

- Generated At: 2026-03-06T22:18:17.637508Z
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
   - Action: Profile and optimize 'agent_registry_validation' stage. Current duration: 11174 ms.
   - Command: `npm run workflow:general -- --mode maintain --script-runtime-auto-best --scope "agent_registry_validation tuning"`
   - Evidence: data/output/databases/polyglot-default/analysis/script_runtime_swap_report.json
2. [runtime-stage-pipeline-latency] Optimize pipeline runtime latency
   - Category: runtime
   - Impact: Reduces total workflow completion time.
   - Effort: medium
   - Action: Profile and optimize 'pipeline' stage. Current duration: 23780 ms.
   - Command: `npm run workflow:general -- --mode maintain --script-runtime-auto-best --scope "pipeline tuning"`
   - Evidence: data/output/databases/polyglot-default/analysis/script_runtime_swap_report.json
3. [runtime-stage-preflight-latency] Optimize preflight runtime latency
   - Category: runtime
   - Impact: Reduces total workflow completion time.
   - Effort: medium
   - Action: Profile and optimize 'preflight' stage. Current duration: 9020 ms.
   - Command: `npm run workflow:general -- --mode maintain --script-runtime-auto-best --scope "preflight tuning"`
   - Evidence: data/output/databases/polyglot-default/analysis/script_runtime_swap_report.json
4. [runtime-stage-prune-latency] Optimize prune runtime latency
   - Category: runtime
   - Impact: Reduces total workflow completion time.
   - Effort: medium
   - Action: Profile and optimize 'prune' stage. Current duration: 6577 ms.
   - Command: `npm run workflow:general -- --mode maintain --script-runtime-auto-best --scope "prune tuning"`
   - Evidence: data/output/databases/polyglot-default/analysis/script_runtime_swap_report.json
5. [runtime-stage-wrapper_contract_gate-latency] Optimize wrapper_contract_gate runtime latency
   - Category: runtime
   - Impact: Reduces total workflow completion time.
   - Effort: medium
   - Action: Profile and optimize 'wrapper_contract_gate' stage. Current duration: 6516 ms.
   - Command: `npm run workflow:general -- --mode maintain --script-runtime-auto-best --scope "wrapper_contract_gate tuning"`
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

