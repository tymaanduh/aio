# Naming, Data Storage, and Optimal Coding Research (2026-03-05)

## Scope

This research focuses on standards-backed guidance for:

1. naming conventions and semantic consistency,
2. data storage structure and durability strategy,
3. optimization methodology and runtime efficiency controls.

All recommendations are designed for the `aio` polyglot wrapper architecture with shared contracts in `data/input/shared/*`.

## Research Basis

### Naming: Primary Standards and References

- PEP 8 and PEP 257 for Python naming and docstring conventions.
- C++ Core Guidelines for function granularity and naming consistency (F.1/F.2/F.3, NL.7/NL.8).
- Google JavaScript Style Guide for `lowerCamelCase` and constant conventions.
- Ruby Style Guide for `snake_case` and predicate naming.
- Microsoft .NET naming guidelines for framework-level API naming consistency.
- Method naming study (arXiv:2102.13555) showing broad professional agreement on naming conventions.

### Data Storage: Primary Standards and References

- ISO/IEC 11179-5 for naming and identification principles of data elements.
- ISO/IEC 25012 for data quality model dimensions.
- ISO/IEC 8000-63 for data quality management process measurement.
- ISO/IEC 9075-2 (SQL foundation) for relational query/storage foundation.
- RFC 8259 (JSON), RFC 6901 (JSON Pointer), RFC 6902 (JSON Patch), RFC 8785 (JCS) for interoperable JSON data exchange and deterministic processing.
- SQLite documentation on WAL and B-tree/index structure.
- PostgreSQL docs for JSON/JSONB, indexing, and query planner behavior.

### Optimal Coding: Primary Standards and References

- ISO/IEC 25010 quality model (including performance efficiency and maintainability).
- ISO/IEC/IEEE 15939 measurement process.
- ISO/IEC 5055 for automated source quality metrics.
- Node.js documentation on avoiding event-loop blocking.
- GCC optimization manual (`-O*`, profile-guided optimization).
- Python profiling docs (`profile`, `cProfile`).

## Executive Decisions for AIO

### Decision 1: Semantic Naming Layer is Language-Neutral

- Canonical IDs live in shared data catalogs (`function_id`, `symbol`, `const_name`).
- Language wrappers map these IDs into language-native surface naming.
- Result: one semantic contract, multiple syntax surfaces.

Why:
- Prevents cross-language drift while preserving idiomatic APIs.

### Decision 2: Storage is Tiered by Responsibility

Use four explicit storage tiers:

1. `contracts` (authoritative, versioned, human-reviewed): `data/input/shared/*`
2. `operational state` (mutable runtime persistence): local DB/state files
3. `generated artifacts` (rebuildable): `data/output/databases/polyglot-default/build/generated/*`
4. `reports/evidence` (auditable output): `data/output/databases/polyglot-default/reports/*`, `analysis/*`, `research/*`

Why:
- Reduces accidental mutation and clarifies lifecycle ownership for each data type.

### Decision 3: JSON Interop Must Be Deterministic

- Keep canonical contract data in strict JSON.
- Prefer deterministic object key ordering when generating artifacts.
- Use JSON Patch/Pointer semantics for future structured change tooling.
- Use canonicalization-compatible output where diff stability matters.

Why:
- Deterministic serialization reduces noise and improves reproducibility.

### Decision 4: Performance Policy is Profile-First

- No optimization-by-assumption changes in core pipelines.
- Every optimization proposal must reference benchmark or profiler output.
- Runtime benchmark report is a required quality artifact.

Why:
- Aligns with evidence-driven optimization and prevents cargo-cult tuning.

### Decision 5: Runtime Separation Rules Are Hard Gates

- Runtime modules (`app/`, `brain/`, `main/`, `renderer/`) must not read generated-report/output paths as source of truth.
- Runtime must consume `data/input/shared/*` catalogs for policy/spec decisions.

Why:
- Prevents feedback loops and stale-output dependencies.

## Naming Guidance (Operational)

### Universal semantic rules

1. Name by observable behavior.
2. One function = one logical operation.
3. Keep identifier taxonomy stable across languages via shared IDs.
4. Keep module-local style consistent.
5. Prefer explicit action names over abstract helpers.

### Language projections

- JavaScript/TypeScript: `lowerCamelCase` functions, `CONSTANT_CASE` constants.
- Python/Ruby: `lower_snake_case` functions.
- C++: use one repo-level convention, enforce consistently; do not mix styles in the same namespace.

### File naming policy for this repo

- Runtime and core code: underscore-first (`snake_case`) to match existing majority.
- Scripts/tools: allow underscore and kebab while migrating toward one stable policy.

## Data Storage Guidance (Operational)

### Source-of-truth rules

1. Contracts and name registries are authoritative only in `data/input/shared/*`.
2. Generated wrappers are derivative and cannot be manually edited.
3. Reports are evidence, never source-of-truth.

### Structural quality rules

1. All policy/catalog JSON must include numeric `schema_version`.
2. IDs must be stable and case-consistent.
3. Storage changes require migration notes in release artifacts.

### Durability and integrity rules

1. Prefer append-only logs for change evidence.
2. Keep rebuildability for generated artifacts.
3. Keep environment-specific mutable state separate from contracts.

## Optimal Coding Guidance (Operational)

### Optimization lifecycle

1. Define measurable target (latency, throughput, memory, token budget).
2. Profile baseline.
3. Apply scoped change.
4. Re-measure and record deltas.
5. Keep only changes with measured wins and no contract regressions.

### Polyglot benchmark policy

1. Benchmark cases are shared and versioned.
2. Benchmark orchestration produces normalized report JSON.
3. Cross-language comparisons are valid only when input contracts are equivalent.

### CI gate policy

Required order:

1. format/lint/type checks,
2. tests and contract validation,
3. standards baseline gate,
4. hard governance gate,
5. runtime benchmark gate.

## Traceability

This research is operationalized via:

- `data/input/shared/main/polyglot_engineering_standards_catalog.json`
- `data/input/shared/main/iso_standards_traceability_catalog.json`
- `data/input/shared/main/executive_engineering_baseline.json`
- `scripts/standards-baseline-gate.js`

## References

- https://peps.python.org/pep-0008/
- https://peps.python.org/pep-0257/
- https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines
- https://google.github.io/styleguide/jsguide.html
- https://rubystyle.guide/
- https://learn.microsoft.com/en-us/dotnet/standard/design-guidelines/naming-guidelines
- https://arxiv.org/abs/2102.13555
- https://www.iso.org/standard/76583.html (ISO/IEC 11179-5)
- https://www.iso.org/standard/35736.html (ISO/IEC 25012)
- https://www.iso.org/standard/74049.html (ISO 8000-63)
- https://www.iso.org/standard/63556.html (ISO/IEC 9075-2)
- https://www.rfc-editor.org/rfc/rfc8259
- https://www.rfc-editor.org/rfc/rfc6901
- https://www.rfc-editor.org/rfc/rfc6902
- https://www.rfc-editor.org/rfc/rfc8785
- https://www.sqlite.org/wal.html
- https://www.sqlite.org/queryplanner.html
- https://www.postgresql.org/docs/current/datatype-json.html
- https://www.postgresql.org/docs/current/indexes.html
- https://www.iso.org/standard/78175.html (ISO/IEC 25010)
- https://www.iso.org/standard/73580.html (ISO/IEC/IEEE 15939)
- https://www.iso.org/standard/83844.html (ISO/IEC 5055)
- https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop
- https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html
- https://docs.python.org/3/library/profile.html
