# Documentation Index

This directory is the documentation baseline for code reflection and feature inventory.

## Files

- `inventory.schema.json`: JSON schema for feature/file inventory records.
- `inventory.index.json`: generated inventory snapshot for scoped tracked files.
- `feature-catalog.md`: canonical feature list grouped by subsystem.
- `architecture-map.md`: runtime ownership and data/lifecycle flow map.
- `api-surface-reference.md`: `window.app_api` namespace + alias + IPC mapping.
- `operations-runbook.md`: gates, smoke evidence lifecycle, and release artifact flow.
- `test-coverage-matrix.md`: feature-to-test linkage and uncovered risk visibility.
- `reliability-suggestions.md`: prioritized reliability backlog with acceptance criteria.

## Regeneration

- Rebuild inventory snapshot:
  - `npm run docs:inventory`
- After regeneration, review and update dependent markdown files if ownership or feature mapping changed.
