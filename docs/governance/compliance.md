# Governance and Compliance

## Baseline Contracts

- Baseline catalog: `data/input/shared/main/executive_engineering_baseline.json`
- Hard ruleset: `data/input/shared/main/hard_governance_ruleset.json`
- Standards catalog: `data/input/shared/main/polyglot_engineering_standards_catalog.json`
- ISO traceability: `data/input/shared/main/iso_standards_traceability_catalog.json`
- Script swap catalog: `data/input/shared/main/polyglot_script_swap_catalog.json`

## Enforced Policies

- Missing `schema_version` in policy/catalog JSON is an error.
- Runtime/test naming uses snake_case enforcement (legacy kebab-case runtime allowance removed).
- Automation prompts are command-first and under token budget.
- Pipeline order is enforced and blocking.
- Workflow stage scripts must resolve through the polyglot script swap catalog with runtime fallback behavior.

## Compliance Evidence

- Baseline report: `data/output/databases/polyglot-default/analysis/standards_baseline_report.json`
- ISO checklist JSON: `data/output/databases/polyglot-default/analysis/iso_standards_compliance_checklist.json`
- ISO checklist Markdown: `data/output/databases/polyglot-default/analysis/iso_standards_compliance_checklist.md`
- Hard governance report: `data/output/databases/polyglot-default/analysis/hard_governance_report.json`

## Required Commands

- `npm run standards:baseline:gate`
- `npm run standards:iso:gate`
- `npm run governance:hard:gate`
- `npm run workflow:order:gate`
- `npm run script-swaps:validate`
