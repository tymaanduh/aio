# Future Blueprint

## Architecture Direction
- Keep automation policy machine-readable in one ruleset file.
- Keep automations condition-gated and event-driven (no day/time wave dependency).
- Keep workflow stages fail-fast; never defer governance failures.
- Keep prompts command-first, token-bounded, and deduplicated.
- Keep neutral-core contracts machine-readable and make direct-generated runtimes the canonical cross-language surface.
- Keep storage and shell behavior behind versioned contracts, not repo-wide JS proxy equivalents.

## Non-Negotiable Contracts
- Active automations minimum: 8
- Prompt token cap: 36
- Command-first prompts: required
- Condition-gated automation mode: required
- Agent workflows must include hard governance gate checks.
- Routing keywords must map deterministically to one skill stack.
- Workflow pipeline order must match data/input/shared/main/workflow_execution_pipeline.json.
- ISO standards compliance checklist must pass with evidence links for every standard row.
- UI UX blueprint catalog must pass semantic color, ergonomics, preference, and measurement checks.
- UI component taxonomy, rendering policy, search policy, memory lifecycle policy, and AI safety policy catalogs must remain present and schema-valid.
- Stage runtime selection must remain benchmark-evidence-driven (no default-runtime bias).
- Neutral core catalogs and runtime implementation manifests must remain present and schema-valid.
- Math core production runtimes must stay direct-generated across JavaScript, Python, C++, and Ruby.

## Expansion Plan
- Add new capabilities only when they can be enforced by deterministic validators.
- Gate every new skill/agent/routing change through governance + efficiency + refactor checks.
- Keep roadmap and blueprint artifacts updated from each governance run.
- Expand shell implementations from the shared ABI without changing domain or storage contracts.
- Add new runtime backends only when benchmark evidence and conformance coverage are published.

## Current Governance Suggestions
- Keep governance gate active in workflow and refactor gates to maintain first-time-right execution.

