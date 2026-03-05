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
