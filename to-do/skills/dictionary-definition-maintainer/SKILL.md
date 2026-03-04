---
name: dictionary-definition-maintainer
description: Create, update, and maintain dictionary words and definitions with deterministic normalization and definition-density improvements.
---

# Dictionary Definition Maintainer

Use this skill when the request is focused on dictionary entry quality and definition maintenance.

## Purpose

1. Normalize word and definition fields.
2. Expand sparse definitions into explicit behavior descriptions.
3. Keep entry IDs and links stable during updates.
4. Emit high-signal definition text for downstream descriptor compilation.

## Workflow

1. Load current dictionary entries.
2. Normalize `word`, `definition`, `labels`, `mode`, and `language`.
3. Expand underspecified definitions with concrete action phrasing.
4. Save and hand off to thesaurus and descriptor stages.

## Blocking Checks

- No empty word for persisted entries.
- No empty definition for active entries.
- Definitions must remain deterministic and machine-readable.

## Brain/Data/to-do Runtime Contract

- Brain runtime code only: `brain/*`
- Input data catalogs only: `data/input/*`
- Output artifacts/logs only: `data/output/*`
- Out-of-scope staging assets: `to-do/*`
- Wrapper execution mode: `two_pass_single_wrapper` (`identify_arguments` then `execute_pipeline`)
