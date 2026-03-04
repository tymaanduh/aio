---
name: dictionary-lexicon-orchestrator
description: Orchestrate dictionary create/update/maintain workflows by expanding definitions, enriching synonyms, compiling machine descriptors for every token, and running strict quality gates.
---

# Dictionary Lexicon Orchestrator

Use this skill as the top-level controller for dictionary maintenance and lexicon expansion.

## Required Inputs

- Dictionary scope and domain priorities
- Source dictionary entries (word + definition + labels)
- Desired descriptor style (pseudo-code emphasis, instruction density, synonym breadth)
- Quality constraints (coverage, determinism, runtime checks)

## Run Modes

- `create`: build baseline lexicon descriptors and synonym coverage for a new dictionary corpus.
- `maintain`: reuse prior state and update only changed/new entries.
- Persist outputs in:
- `data/output/databases/dictionary-lexicon/state/language_bridge_state.json`
- `data/output/databases/dictionary-lexicon/reports/machine_descriptor_compile_report.json`

## Workflow

1. Run `$dictionary-definition-maintainer` to normalize and expand definitions.
2. Run `$dictionary-thesaurus-expander` to enrich synonyms/variants per term.
3. Run `$word-machine-descriptor-compiler` to map each token to a pseudo-instruction descriptor.
4. Run `$dictionary-machine-quality-gate` for coverage and quality checks.
5. Publish a dictionary lexicon report with descriptor coverage and unresolved tokens.

## Mandatory Commands

- `npm run dictionary:compile:descriptors -- ...`
- `npm run updates:scan -- --actor dictionary-lexicon-director-agent --scope "<scope>"`

## Blocking Rules

- Every extracted word token must have a machine descriptor record (fallback literal descriptor is allowed).
- No missing definition text for persisted dictionary entries.
- No completion without coverage report and quality gate results.

## Brain/Data/to-do Runtime Contract

- Brain runtime code only: `brain/*`
- Input data catalogs only: `data/input/*`
- Output artifacts/logs only: `data/output/*`
- Out-of-scope staging assets: `to-do/*`
- Wrapper execution mode: `two_pass_single_wrapper` (`identify_arguments` then `execute_pipeline`)
