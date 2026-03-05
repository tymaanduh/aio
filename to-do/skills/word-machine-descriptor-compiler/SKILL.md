---
name: word-machine-descriptor-compiler
description: Translate every extracted English token into deterministic pseudo-code and machine-instruction descriptors, with rule-based opcodes and fallback literals.
---

# Word Machine Descriptor Compiler

Use this skill when you need direct word-to-machine descriptor translation.

## Purpose

1. Extract every token from dictionary definitions and source text.
2. Map each token to a machine opcode and pseudo-code descriptor.
3. Expand descriptor definitions with synonyms and variant phrasing.
4. Persist descriptor index for search and linking.

## Descriptor Rules

- Rule-driven mappings for control-flow, inclusion, logic, assignment, execution, validation, and optimization terms.
- Fallback mapping for unknown terms:
- `TOKEN_LITERAL` descriptor with deterministic pseudo-instruction.
- Example mappings:
- `required -> #include -> include if flag_required == true`
- `if -> COND_IF -> if (x == y) then branch_true()`

## Commands

- `npm run dictionary:compile:descriptors -- ...`

## Blocking Checks

- No extracted token may be left unmapped.
- Descriptor records must include opcode, pseudocode descriptor, instruction, and confidence.
- Searchability must work by term, opcode, and synonym.

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
