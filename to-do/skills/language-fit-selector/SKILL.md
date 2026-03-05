---
name: language-fit-selector
description: Select and rank implementation languages for a project using weighted scoring across runtime, size, portability, security, tooling, and maintainability. Use when deciding primary language, building side-by-side benchmark sets, or validating cross-platform feasibility.
---

# Language Fit Selector

Score candidate languages and choose the implementation set for polyglot generation.

## Required Workflow

1. Detect available toolchains using `scripts/detect_toolchains.sh`.
2. Build candidate language set from:

- user-requested languages
- detected installed languages
- platform compatibility constraints

3. Apply weighted scoring model (0-10 each criterion):

- runtime throughput/latency
- binary/package size footprint
- startup cost
- memory efficiency
- portability and deployment surface
- ecosystem/tooling maturity
- security hardening ecosystem
- developer velocity and maintainability

4. Apply project-specific weights.
5. Produce ranked list + eliminations with reasons.
6. Select:

- `primary_language`
- `fallback_language`
- `benchmark_languages` (all feasible candidates by default)

## Selection Rules

- Include every feasible installed language when the request asks for broad comparison.
- Exclude languages with missing required toolchains and report them explicitly.
- Keep at least one compiled and one interpreted language in benchmark set when feasible.

## Output Contract

Produce:

- `toolchain_inventory`
- `language_score_table`
- `elimination_log`
- `primary_language`
- `fallback_language`
- `benchmark_languages`

## Blocking Rules

- Do not emit final ranking without explicit weights.
- Do not emit recommendation without tradeoff notes.
- Do not claim support for unavailable toolchains.

## References

- Use `references/scoring_profile.md` for default criteria weights.

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
