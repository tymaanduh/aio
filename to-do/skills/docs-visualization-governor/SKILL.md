---
name: docs-visualization-governor
description: Generate and maintain repository-wide documentation artifacts plus runtime visual dashboards, then enforce freshness gates and GitHub publication readiness.
---

# Docs Visualization Governor

Use this skill when the task requires end-to-end documentation coverage, visual analytics artifacts, and GitHub-ready doc/report synchronization.

## Purpose

- Keep repository documentation complete and current.
- Generate visual runtime analytics (charts/timeline) from benchmark and workflow reports.
- Keep documentation automation aligned with governance gates.

## Required Inputs

- `docs/**/*`
- `scripts/generate-file-catalog-docs.js`
- `scripts/generate-runtime-visuals.js`
- `scripts/generate-documentation-suite.js`
- `data/output/databases/polyglot-default/reports/polyglot_runtime_benchmark_report.json`
- `data/output/databases/polyglot-default/analysis/script_runtime_swap_report.json`
- `data/output/databases/polyglot-default/analysis/codex_efficiency_report.json`
- `.github/workflows/*`

## Workflow

1. Run `npm run docs:generate` to refresh file catalog docs and runtime dashboard visuals.
2. Run `npm run docs:freshness:check -- --enforce` to verify required documentation coverage and staleness gates.
3. Validate GitHub workflow integration for docs/visual artifacts.
4. Publish/update decision notes in `docs/changelog/decisions.md` when docs contracts change.

## Outputs

- `docs/reference/file_catalog.md`
- `docs/reference/file_catalog.json`
- `docs/visuals/runtime_dashboard.md`
- `docs/visuals/runtime_dashboard.json`
- `docs/visuals/assets/*.svg`

## Blocking Rules

- No completion if docs generation scripts fail.
- No completion if freshness gate fails.
- No completion if benchmark/timeline visuals are missing.
- No completion if hard governance gate fails.

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
