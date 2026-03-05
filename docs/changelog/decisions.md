# Decision Changelog

## 2026-03-05

- Switched from day-based wave planning to condition-based maintenance triggers.
- Adopted dual-lane branch model:
  - `main` governed promotion lane
  - `aio/autopush` autonomous no-review lane
- Enforced schema policy hardening: missing `schema_version` is now an error.
- Completed runtime/test naming hardening migration (kebab-case to snake_case where flagged).
- Enabled C++ benchmark lane with LLVM clang++ support and robust Windows compiler detection fallback.
- Added docs freshness gate and made `docs/` the stable documentation source of truth.
- Ran full scope-alignment audit across skills, agents, rulesets, automations, and workflow pipeline gates; all enforcement gates passed.
- Applied automation prompt compaction for token efficiency on active maintenance automations with no schedule duplication.
- Reconfirmed cross-language runtime benchmark execution for JavaScript, Python, and C++; latest run ranked C++ fastest for current wrapper benchmark cases.
- Wired `polyglot-default-pipeline` benchmark stage to run wrapper runtime benchmark by default (JS/Python/C++) instead of probe-only ranking.
- Added automatic benchmark winner mapping artifacts for per-case and per-function language selection:
  - `data/output/databases/polyglot-default/reports/polyglot_runtime_benchmark_report.json#winner_mapping`
  - `data/output/databases/polyglot-default/reports/polyglot_runtime_winner_map.json`
