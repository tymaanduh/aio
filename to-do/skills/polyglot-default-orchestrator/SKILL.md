---
name: polyglot-default-orchestrator
description: "Orchestrate the default end-to-end coding flow: build a full English plus pseudocode blueprint, choose best-fit languages, translate pseudocode into each selected language, run optimization and fix loops, and finish with strict side-by-side test/benchmark/security gates. Use for new project builds, full rewrites, or any request that needs mandatory cross-language comparison."
---

# Polyglot Default Orchestrator

Use this skill as the default controller for implementation work.

## Trigger

- `continue` or broad workflow requests: `npm run workflow:general -- --planned-update "<summary>"`
- explicit maintain continuation: `npm run workflow:continue -- --planned-update "<summary>"`

## Required Inputs

- project goal and scope
- runtime constraints
- target platforms
- delivery priorities

## Required Workflow

1. Use `create` for first-time setup and `maintain` for continuation. In maintain mode, reuse:
   `data/output/databases/polyglot-default/context/run_state.json` and
   `data/output/databases/polyglot-default/plan/hierarchy_order.md`.
2. Enforce update logging:
   `npm run updates:scan -- --actor polyglot-default-director-agent --scope "pipeline-start"`
   `npm run updates:watch -- --actor polyglot-default-director-agent --session-id <session-id>` for long passes
   `npm run updates:scan -- --actor polyglot-default-director-agent --scope "pipeline-complete"`
3. Enforce access policy from `source://agent_access_control`. Request non-startup tools with
   `npm run agent:request-access -- --agent-id <agent-id> --requested-tool <tool-id> --privilege-flag <flag-id> --reason "<why-needed>"`.
4. Run stages in order:
   `$pseudo-blueprint-planner`
   `$json-instruction-registry-governor`
   `$unified-two-pass-wrapper-orchestrator`
   `$language-fit-selector`
   `$pseudocode-polyglot-translator`
   repair/optimization loops
   `npm run audit:data-separation --`
   `npm run governance:hard:gate`
   `npm run automations:audit`
   `npm run benchmark:runtime -- --languages javascript,python,cpp`
   `$polyglot-quality-benchmark-gate`
5. Treat the JavaScript, Python, and C++ runtime lanes as first-class deliverables:
   benchmark evidence must be runnable, not just generated
   repair native launcher/runtime faults before accepting benchmark output
   keep repo-local native scratch space under `data/output/databases/polyglot-default/build/tmp` prune-safe and governance-safe
6. Publish:
   `blueprint_english`
   `blueprint_pseudocode`
   `wrapper_preflight_report`
   `data_separation_audit_report`
   `language_scorecard`
   `polyglot_implementation_map`
   `sxs_benchmark_report`
   `polyglot_runtime_benchmark_report`
   `final_recommendation`

## Blocking Rules

- Do not skip blueprint, language scoring, translation, benchmark, or benchmark-gate stages.
- Do not skip wrapper preflight unless explicitly forced.
- Do not skip JSON source-of-truth extraction before translation.
- Keep wrapper execution two-pass: `identify_arguments` before `execute_pipeline`.
- Do not accept a C++ lane that only compiles; generated native entrypoints must execute cleanly.
- Do not finalize without measurable runtime/size data and a passing `npm run governance:hard:gate`.

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
- Use `references/default_pipeline.md` for canonical stage order and artifact naming.
- Re-run `npm run agents:validate` after agent/skill metadata changes.
