---
name: dictionary-thesaurus-expander
description: Expand dictionary terminology with thesaurus-style synonym clusters and lexical variants for richer descriptor generation.
---

# Dictionary Thesaurus Expander

Use this skill when you need synonym expansion and lexical variety in dictionary outputs.

## Purpose

1. Build synonym clusters for words and key definition terms.
2. Enrich dictionary entries with variants used in natural language requests.
3. Support broader token-to-descriptor coverage for machine translation.

## Workflow

1. Extract candidate terms from words and definitions.
2. Expand with thesaurus seeds and alias mappings.
3. Deduplicate variants and retain deterministic ordering.
4. Persist synonym-enriched artifacts for descriptor compilation.

## Blocking Checks

- No duplicate synonyms within a term cluster.
- Synonym lists must remain stable and reproducible across reruns.
- Expanded terms must map to real dictionary entries or descriptor terms.

## Brain/Data/to-do Runtime Contract

- Brain runtime code only: `brain/*`
- Input data catalogs only: `data/input/*`
- Output artifacts/logs only: `data/output/*`
- Out-of-scope staging assets: `to-do/*`
- Wrapper execution mode: `two_pass_single_wrapper` (`identify_arguments` then `execute_pipeline`)
