# Governance and Compliance

## Baseline Contracts

- Baseline catalog: `data/input/shared/main/executive_engineering_baseline.json`
- Hard ruleset: `data/input/shared/main/hard_governance_ruleset.json`
- Standards catalog: `data/input/shared/main/polyglot_engineering_standards_catalog.json`
- ISO traceability: `data/input/shared/main/iso_standards_traceability_catalog.json`
- Script swap catalog: `data/input/shared/main/polyglot_script_swap_catalog.json`
- UI component taxonomy catalog: `data/input/shared/main/ui_component_blueprint_catalog.json`
- Rendering runtime policy catalog: `data/input/shared/main/rendering_runtime_policy_catalog.json`
- Search strategy routing catalog: `data/input/shared/main/search_strategy_routing_catalog.json`
- Memory/data lifecycle policy catalog: `data/input/shared/main/memory_data_lifecycle_policy_catalog.json`
- AI automation safety/speech policy catalog: `data/input/shared/main/ai_automation_safety_speech_catalog.json`
- Token usage optimization policy catalog: `data/input/shared/main/token_usage_optimization_policy_catalog.json`

## Enforced Policies

- Missing `schema_version` in policy/catalog JSON is an error.
- Runtime/test naming uses snake_case enforcement (legacy kebab-case runtime allowance removed).
- Automation prompts are command-first and under token budget.
- Skill default prompts must use compact canonical template: `Use $skill for this task. Stay in aio project scope only.`
- Token regression vs previous efficiency report is budgeted and blocking when exceeded.
- Pipeline order is enforced and blocking.
- Workflow stage scripts must resolve through the polyglot script swap catalog with runtime fallback behavior.
- Benchmark-driven runtime auto-selection is supported and must remain catalog/schema-valid when enabled.
- Script swap telemetry report is generated each run and must remain schema-valid for governance traceability.
- Runtime optimization backlog artifacts are generated as part of workflow and used for continuous improvement planning.
- Full Python/C++ equivalents for `scripts/**/*.js` are generated and checked for drift.
- Stage runtime execution must be benchmark-evidence-selected (no default-runtime bias).
- Automation governance is condition-gated and event-driven (no day/time wave dependency).

## Compliance Evidence

- Baseline report: `data/output/databases/polyglot-default/analysis/standards_baseline_report.json`
- ISO checklist JSON: `data/output/databases/polyglot-default/analysis/iso_standards_compliance_checklist.json`
- ISO checklist Markdown: `data/output/databases/polyglot-default/analysis/iso_standards_compliance_checklist.md`
- Hard governance report: `data/output/databases/polyglot-default/analysis/hard_governance_report.json`
- Efficiency report: `data/output/databases/polyglot-default/analysis/codex_efficiency_report.json`

## Required Commands

- `npm run standards:baseline:gate`
- `npm run standards:iso:gate`
- `npm run governance:hard:gate`
- `npm run efficiency:gate`
- `npm run workflow:order:gate`
- `npm run script-swaps:validate`
- `npm run benchmark:runtime`
- `npm run scripts:polyglot:check`
- `npm run optimization:backlog`
- `npm run workflow:general -- --mode maintain`
