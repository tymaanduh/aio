---
name: polyglot-default-orchestrator
description: "Orchestrate the default end-to-end coding flow: build a full English plus pseudocode blueprint, choose best-fit languages, translate pseudocode into each selected language, run optimization and fix loops, and finish with strict side-by-side test/benchmark/security gates. Use for new project builds, full rewrites, or any request that needs mandatory cross-language comparison."
---

# Polyglot Default Orchestrator

Use this skill as the default controller for implementation work.

## Intent Trigger

- If user intent is `continue` or `general workflow`, run:
- `npm run workflow:general -- --planned-update "<summary>"`
- If user intent is explicit maintain continuation, run:
- `npm run workflow:continue -- --planned-update "<summary>"`

## Required Inputs

- Project goal and scope
- Runtime constraints (latency, memory, package size)
- Target platforms (desktop/web/mobile/server/embedded)
- Delivery priorities (speed, maintainability, portability, security)

## Run Modes

- `create`: generate full baseline artifacts for first-time project setup.
- `maintain`: load prior run context and update only stale stages.
- Persist and reuse context at:
- `data/output/databases/polyglot-default/context/run_state.json`
- `data/output/databases/polyglot-default/plan/hierarchy_order.md`
- In `maintain` mode, reuse existing pseudocode unless forced with `--force-pseudocode`.

## Agent Access Escalation (Mandatory)

- Access policy source ID: `source://agent_access_control` (resolved by `scripts/project-source-resolver.js`)
- Each stage agent must stay within its `startup_tools` and `startup_tool_cap`.
- If a stage needs a non-startup tool, submit a request before execution:
- `npm run agent:request-access -- --agent-id <agent-id> --requested-tool <tool-id> --privilege-flag <flag-id> --reason "<why-needed>"`
- Required request fields:
- `agent_id`
- `requested_tool`
- `privilege_flag`
- `reason`
- Request log target:
- `source://request_log_file`

## Global Update Logging (Mandatory)

- Before edit/generation stages, run:
- `npm run updates:scan -- --actor polyglot-default-director-agent --scope "pipeline-start"`
- During long edit passes, run:
- `npm run updates:watch -- --actor polyglot-default-director-agent --session-id <session-id>`
- After stages complete, run:
- `npm run updates:scan -- --actor polyglot-default-director-agent --scope "pipeline-complete"`
- Required log artifacts:
- `source://update_events_file`
- `source://update_sessions_file`

## Direct Dispatch Workflow

1. Run `$pseudo-blueprint-planner` and produce complete English plus pseudocode blueprint artifacts.
2. Run `$json-instruction-registry-governor` and require JSON data catalogs plus deduplicated instruction templates for operation definitions.
3. Run `$unified-two-pass-wrapper-orchestrator` preflight and enforce:
- single wrapper entrypoint
- pass 1 argument identification
- pass 2 pipeline execution
- Brain/Data separation contracts
4. Run `$language-fit-selector` and score candidate languages against project constraints.
5. Select implementation set:
- If the request is broad, include every feasible installed language from detection output.
- If constraints are strict, include only languages that satisfy hard requirements.
6. Run `$pseudocode-polyglot-translator` and generate equivalent functions/modules for each selected language.
7. Run optimization and repair loop per language until baseline quality checks pass.
8. Run `npm run audit:data-separation --` and publish remaining JS extraction candidates.
9. Run `$polyglot-quality-benchmark-gate` as final blocking stage.
10. Publish recommendation: best primary language, fallback language, and metric-backed rationale.

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
- `wrapper_preflight_report`: two-pass wrapper stage report (args check + execution result)
- `data_separation_audit_report`: scan report for remaining object/name/group constants still in JS
- `language_scorecard`: weighted score table + rationale
- `polyglot_implementation_map`: per-language function/module mapping
- `sxs_benchmark_report`: runtime/size/test/security comparison table
- `final_recommendation`: primary language + fallback + tradeoff notes

## Blocking Rules

- Do not skip blueprint, language scoring, translation, or benchmark/security stages.
- Do not skip wrapper preflight stage unless explicitly forced with run args.
- Do not skip JSON source-of-truth extraction or instruction-template dedupe before translation.
- Do not store groups/labels/aliases in wrapper/function JS files.
- Do not run pass 2 when pass 1 reports missing arguments.
- Do not accept incomplete comparisons without explicit missing-toolchain evidence.
- Do not finalize recommendation without measurable runtime and size data.
- Require strict checks from the benchmark gate before completion.

## References

- See `references/default_pipeline.md` for canonical stage order and artifact naming.

## Brain/Data/to-do Runtime Contract

- Brain runtime code only: `brain/*`
- Input data catalogs only: `data/input/*`
- Output artifacts/logs only: `data/output/*`
- Out-of-scope staging assets: `to-do/*`
- Wrapper execution mode: `two_pass_single_wrapper` (`identify_arguments` then `execute_pipeline`)
