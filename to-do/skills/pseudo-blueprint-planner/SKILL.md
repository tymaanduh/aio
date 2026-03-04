---
name: pseudo-blueprint-planner
description: Create a full application blueprint in plain English plus structured pseudocode before implementation. Use when starting new projects, replacing architecture, or preparing language-neutral design artifacts for downstream code generation.
---

# Pseudo Blueprint Planner

Create a complete implementation-ready blueprint before language-specific coding.

## Required Workflow

1. Capture requirements and constraints.
2. Define domain objects, state transitions, and data boundaries.
3. Define module boundaries and API/event contracts.
4. Define JSON data catalog schema (groups, labels, aliases, operation registry).
5. Define operation instruction-template registry for repeated sequences.
6. Define failure modes, retries, and observability points.
7. Write plain-English behavior specification for every core feature.
8. Write pseudocode for all critical flows:
- init/bootstrap
- input validation
- core compute path
- persistence I/O
- error path and recovery
9. Define acceptance tests in language-neutral terms.

## Output Contract

Produce these sections in order:

1. `Problem Statement`
2. `Scope and Non-Goals`
3. `Functional Requirements`
4. `Non-Functional Requirements`
5. `Domain Model`
6. `System Components`
7. `Data Model and Persistence`
8. `API and Event Contracts`
9. `JSON Data Catalog Schema`
10. `Instruction Template Registry`
11. `Pseudocode by Module`
12. `Test Blueprint`
13. `Risk Register`

## Pseudocode Rules

- Keep pseudocode deterministic and unambiguous.
- Use typed input/output contracts for each function.
- Use explicit preconditions and postconditions.
- Use neutral names that map cleanly to multiple languages.

## Blocking Rules

- Do not leave TODO placeholders.
- Do not include language-specific syntax in pseudocode sections.
- Do not leave data catalogs or instruction templates unspecified.
- Do not proceed to translation without complete module-level pseudocode.

## References

- Use `references/blueprint_template.md` as the canonical section template.

## Brain/Data/to-do Runtime Contract

- Brain runtime code only: `brain/*`
- Input data catalogs only: `data/input/*`
- Output artifacts/logs only: `data/output/*`
- Out-of-scope staging assets: `to-do/*`
- Wrapper execution mode: `two_pass_single_wrapper` (`identify_arguments` then `execute_pipeline`)
