---
name: pseudocode-polyglot-translator
description: Translate module pseudocode into behaviorally equivalent implementations across multiple programming languages. Use after blueprint completion when generating per-language function sets for side-by-side benchmarking and portability evaluation.
---

# Pseudocode Polyglot Translator

Convert pseudocode contracts into language-specific modules while preserving behavior parity.

## Required Workflow

1. Parse pseudocode blocks into function contracts.
2. Build language-neutral contract map:
- function name
- inputs/outputs
- invariants
- error contracts
- complexity target
3. Generate per-language implementations for each selected language.
4. Generate per-language tests from shared fixtures.
5. Map each generated function back to pseudocode source ID.
6. Emit parity matrix showing equivalent coverage by language.

## Translation Rules

- Preserve behavior before language-specific optimization.
- Use idiomatic syntax per language while keeping contract parity.
- Separate platform adapters from core logic.
- Keep pure logic deterministic to support cross-language SxS testing.

## Output Contract

Produce:

- `contract_map`
- `language_function_map`
- `shared_test_vectors`
- `parity_matrix`
- `known_deviations`

## Blocking Rules

- Do not mark translation complete without tests for every generated function.
- Do not accept undocumented behavior deviations.
- Do not skip contract map generation.

## References

- Use `references/function_contract_schema.json` for contract object structure.
