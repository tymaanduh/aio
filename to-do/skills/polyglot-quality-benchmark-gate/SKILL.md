---
name: polyglot-quality-benchmark-gate
description: Enforce strict final-stage validation across generated language implementations, including correctness tests, optimization/fix loops, security checks, and side-by-side runtime/size benchmarking. Use as the final blocking gate before selecting a primary implementation.
---

# Polyglot Quality Benchmark Gate

Run strict end-stage quality, hardening, and benchmark comparisons.

## Required Workflow

1. Validate build and lint/static checks for each language.
2. Run unit and integration tests with shared fixtures.
3. Run security/hardening checks (dependency audit + static security checks where available).
4. Run side-by-side benchmark suite using `scripts/run_sxs_benchmark.js`.
5. Measure size metrics (source, package, and built artifact size when available).
6. Apply optimization/fix pass for failures or regressions.
7. Re-run tests and benchmarks after optimization.
8. Publish final ranked report and winner per metric category.

## Metric Categories

- correctness (tests pass/fail)
- runtime latency/throughput
- memory footprint (if measurable)
- build/package size
- security findings count/severity
- startup time (if applicable)

## Output Contract

Produce:

- `validation_report`
- `security_report`
- `benchmark_raw`
- `benchmark_summary`
- `optimization_delta`
- `final_sxs_rankings`

## Blocking Rules

- Do not pass a language variant with failing correctness tests.
- Do not publish final ranking without runtime and size metrics.
- Do not accept unresolved high-severity security findings.
- Do not skip post-optimization rerun.

## References

- Use `references/benchmark_manifest.example.json` as manifest template.

## Brain/Data/to-do Runtime Contract

- Brain runtime code only: `brain/*`
- Input data catalogs only: `data/input/*`
- Output artifacts/logs only: `data/output/*`
- Out-of-scope staging assets: `to-do/*`
- Wrapper execution mode: `two_pass_single_wrapper` (`identify_arguments` then `execute_pipeline`)
