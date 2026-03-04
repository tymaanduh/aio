---
name: dictionary-machine-quality-gate
description: Run strict quality gates for dictionary machine-descriptor coverage, determinism, and descriptor/search integrity.
---

# Dictionary Machine Quality Gate

Use this skill as the final validation stage for dictionary descriptor workflows.

## Gate Scope

- Definition completeness and normalization quality
- Thesaurus expansion consistency
- Machine descriptor coverage for extracted tokens
- Descriptor search integrity (term/opcode/synonym)

## Workflow

1. Load compiled dictionary descriptor artifacts.
2. Verify coverage metrics and unresolved token count.
3. Validate descriptor shape and confidence ranges.
4. Run project gates (`lint`, `test`, `refactor:gate`) when code changed.

## Blocking Conditions

- Missing descriptor records for extracted tokens.
- Descriptor records missing required fields.
- Failed quality/test gates on updated code.

## Brain/Data/to-do Runtime Contract

- Brain runtime code only: `brain/*`
- Input data catalogs only: `data/input/*`
- Output artifacts/logs only: `data/output/*`
- Out-of-scope staging assets: `to-do/*`
- Wrapper execution mode: `two_pass_single_wrapper` (`identify_arguments` then `execute_pipeline`)
