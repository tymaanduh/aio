---
name: code-pseudocode-english-bridge
description: Extract and link code tokens, pseudocode phrases, and plain English terms into a manifest-backed bridge index tied to dictionary entry definitions and document references.
---

# Code/Pseudocode/English Bridge

Use this skill when the request includes:

- code/pseudocode/english bridge
- translate code to plain english
- keyword mapping
- glossary triad
- link terms to dictionary/data center

## Purpose

1. Capture text sources from user/assistant and dictionary entry definitions/content.
2. Extract artifacts:

- code keywords
- pseudocode phrases
- plain English terms

3. Build bridge structures:

- `keyword_index`
- `triad_map`
- `glossary`
- `entry_links`

4. Persist artifacts to the language bridge repository in `userData/data/v1/language_bridge_state.json`.

## Required Workflow

1. Load bridge state first.
2. Capture/ingest sources.
3. Build or update keyword/triad/glossary artifacts.
4. Link artifacts to entry/document IDs.
5. Expose searchable results through bridge APIs.

## Extraction Rules

1. Code token candidates:

- backtick tokens
- identifier regex (`camelCase`, `snake_case`, `UPPER_SNAKE`)

2. Pseudocode candidates:

- lines/phrases containing markers (`if`, `when`, `for each`, `then`, `return`, `call`, `set`)

3. English candidates:

- normalized terms and phrase windows
- stopword filtering

4. Triad rule:

- build triads when code + pseudocode + english co-occur in a source window.
- dedupe by deterministic triad hash.

5. Glossary rule:

- promote frequent keywords and high-confidence triads.
- attach alias words from `brain/modules/alias_index.js` when alias keys match.

## Data and API Targets

1. Repository state file:

- `userData/data/v1/language_bridge_state.json`

2. Main process API:

- `load_bridge_state()`
- `capture_sources(payload)`
- `index_dictionary_entries(entries, source_meta)`
- `search_keyword(query, options)`
- `search_triad(query, options)`
- `search_glossary(query, options)`
- `link_entry_artifacts(entry_id, artifact_refs)`

3. Preload API namespace:

- `window.app_api.bridge.*`

## Quality Gates (Blocking)

1. Naming/group format:

- top registries: `UPPER_SNAKE`
- reusable literals/maps: `PATTERN_*`
- runtime groups: `G_*`

2. If new abbreviations are introduced, update in the same pass:

- `brain/modules/alias_index.js`
- `data/input/shared/alias/alias_groups.js`

3. Required checks:

- `npm run lint --silent`
- `npm test --silent`
- `npm run refactor:gate --silent` (or `npm run refactor:gate`)

## No-Fixer Rule

- Do not defer bridge schema, naming, alias sync, or linkage cleanup to later passes.
- The same pass must finish extraction + linkage + persistence wiring.

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
