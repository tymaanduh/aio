---
name: unified-two-pass-wrapper-orchestrator
description: Build and enforce a single wrapper runtime that auto-builds pipelines from data catalogs, identifies required arguments in pass 1, and executes function chains in pass 2.
---

# Unified Two-Pass Wrapper Orchestrator

Use this skill when requests ask for one wrapper to bridge input data streams to output banks.

## Contract

- Keep function logic and wrappers in `brain/*` only.
- Keep groups/labels/aliases/operation definitions in `data/input/shared/*` only.
- Keep generated outputs and logs in `data/output/*` only.
- Do not duplicate data catalogs in JS runtime files.

## Required Files

- `brain/wrappers/unified_io_wrapper.js`
- `data/input/shared/wrapper/unified_wrapper_specs.json`
- `brain/math/io_assembly_line_math.js`
- `data/input/shared/math/io_assembly_line_math.json`

## Two-Pass Rule

1. Pass 1: identify and validate required function arguments (`identify_arguments`).
2. Pass 2: execute pipeline stages in order (`execute_pipeline`).

If pass 1 reports missing args, pass 2 must not run.

## Auto-Build Rule

- Build pipelines from catalog operation IDs.
- Each operation defines `function_id`, `input_args`, `output_symbol`, and `output_group` in JSON.
- Wrapper runtime resolves aliases and loads values from input/work/output banks.

## Validation

- `npm run lint --silent`
- `npm test --silent`
- `npm run refactor:gate --silent`

## Brain/Data/to-do Runtime Contract

- Brain runtime code only: `brain/*`
- Input data catalogs only: `data/input/*`
- Output artifacts/logs only: `data/output/*`
- Out-of-scope staging assets: `to-do/*`
- Wrapper execution mode: `two_pass_single_wrapper` (`identify_arguments` then `execute_pipeline`)
