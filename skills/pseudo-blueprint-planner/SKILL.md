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
4. Define failure modes, retries, and observability points.
5. Write plain-English behavior specification for every core feature.
6. Write pseudocode for all critical flows:
- init/bootstrap
- input validation
- core compute path
- persistence I/O
- error path and recovery
7. Define acceptance tests in language-neutral terms.

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
9. `Pseudocode by Module`
10. `Test Blueprint`
11. `Risk Register`

## Pseudocode Rules

- Keep pseudocode deterministic and unambiguous.
- Use typed input/output contracts for each function.
- Use explicit preconditions and postconditions.
- Use neutral names that map cleanly to multiple languages.

## Blocking Rules

- Do not leave TODO placeholders.
- Do not include language-specific syntax in pseudocode sections.
- Do not proceed to translation without complete module-level pseudocode.

## References

- Use `references/blueprint_template.md` as the canonical section template.
