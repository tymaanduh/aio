# Documentation Index

AIO documentation is maintained as a condition-driven system (no day/time waves). This folder is the stable source of truth, and generated artifacts under `data/output/` are treated as evidence snapshots.

## Core Docs

- [Architecture Pipeline](./architecture/pipeline.md)
- [Governance and Compliance](./governance/compliance.md)
- [Wrapper Contracts](./contracts/wrapper_contracts.md)
- [Maintenance Runbook](./runbooks/maintenance.md)
- [Decision Changelog](./changelog/decisions.md)

## Canonical Gate Order

1. `workflow:preflight`
2. `workflow:order:gate`
3. `contracts:validate`
4. `standards:baseline:gate`
5. `standards:iso:gate`
6. `uiux:blueprint:check`
7. `governance:hard:gate`
8. `efficiency:gate`
9. `refactor:gate`

## Evidence Artifacts

- `data/output/databases/polyglot-default/analysis/workflow_pipeline_order_report.json`
- `data/output/databases/polyglot-default/analysis/standards_baseline_report.json`
- `data/output/databases/polyglot-default/analysis/iso_standards_compliance_checklist.json`
- `data/output/databases/polyglot-default/analysis/hard_governance_report.json`
- `data/output/databases/polyglot-default/analysis/codex_efficiency_report.json`
- `data/output/databases/polyglot-default/reports/polyglot_runtime_benchmark_report.json`
