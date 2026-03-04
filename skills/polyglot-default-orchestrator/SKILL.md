---
name: polyglot-default-orchestrator
description: "Orchestrate the default end-to-end coding flow: build a full English plus pseudocode blueprint, choose best-fit languages, translate pseudocode into each selected language, run optimization and fix loops, and finish with strict side-by-side test/benchmark/security gates. Use for new project builds, full rewrites, or any request that needs mandatory cross-language comparison."
---

# Polyglot Default Orchestrator

Use this skill as the default controller for implementation work.

## Required Inputs

- Project goal and scope
- Runtime constraints (latency, memory, package size)
- Target platforms (desktop/web/mobile/server/embedded)
- Delivery priorities (speed, maintainability, portability, security)

## Direct Dispatch Workflow

1. Run `$pseudo-blueprint-planner` and produce complete English plus pseudocode blueprint artifacts.
2. Run `$language-fit-selector` and score candidate languages against project constraints.
3. Select implementation set:
- If the request is broad, include every feasible installed language from detection output.
- If constraints are strict, include only languages that satisfy hard requirements.
4. Run `$pseudocode-polyglot-translator` and generate equivalent functions/modules for each selected language.
5. Run optimization and repair loop per language until baseline quality checks pass.
6. Run `$polyglot-quality-benchmark-gate` as final blocking stage.
7. Publish recommendation: best primary language, fallback language, and metric-backed rationale.

## Dispatch Policy

- Dispatch directly from director to stage agents.
- Skip intermediate managers by default.
- Create one temporary matrix manager only when both conditions are true:
- Selected languages > 6
- Target platforms > 3

## Output Contract

Produce all artifacts below in one pass:

- `blueprint_english`: complete architecture and behavior spec
- `blueprint_pseudocode`: executable-style pseudocode covering critical paths
- `language_scorecard`: weighted score table + rationale
- `polyglot_implementation_map`: per-language function/module mapping
- `sxs_benchmark_report`: runtime/size/test/security comparison table
- `final_recommendation`: primary language + fallback + tradeoff notes

## Blocking Rules

- Do not skip blueprint, language scoring, translation, or benchmark/security stages.
- Do not accept incomplete comparisons without explicit missing-toolchain evidence.
- Do not finalize recommendation without measurable runtime and size data.
- Require strict checks from the benchmark gate before completion.

## References

- See `references/default_pipeline.md` for canonical stage order and artifact naming.
