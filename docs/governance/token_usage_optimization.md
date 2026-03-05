# Token Usage Optimization Blueprint

## Objective

Minimize token spend, reduce completion latency, and prevent token drift regressions across skills, agent metadata, and automations.

## Implemented Controls

- Canonical compact skill prompt template is enforced:
  - `Use $<skill-name> for this task. Stay in aio project scope only.`
- Active automation prompts are command-first and capped at <= 36 estimated tokens.
- Efficiency gate enforces:
  - per-file token cap
  - skill prompt token cap
  - automation prompt token cap
  - total token estimate cap
  - scope guardrail duplicate cap
- Efficiency gate compares to previous report and fails on configured total/per-file regression increases.
- Runtime optimization backlog now creates explicit token-regression tasks when total token count grows.

## Policy Sources

- Primary policy catalog:
  - `data/input/shared/main/token_usage_optimization_policy_catalog.json`
- Baseline thresholds:
  - `data/input/shared/main/executive_engineering_baseline.json`
- Hard governance catalog requirements:
  - `data/input/shared/main/hard_governance_ruleset.json`

## Required Evidence

- `data/output/databases/polyglot-default/analysis/codex_efficiency_report.json`
- `data/output/databases/polyglot-default/analysis/standards_baseline_report.json`
- `data/output/databases/polyglot-default/plan/runtime_optimization_backlog.json`

## Research Notes (OpenAI)

- Use prompt caching for stable prompt prefixes/tool definitions.
- Use token usage counting endpoints for exact budget accounting.
- Use conversation compaction for long threads.
- Keep `max_output_tokens` bounded and default verbosity low for routine automation tasks.
- Track conversation-state behavior carefully: prior context in response chains is still billed.

References:

- [Prompting guide (Responses)](https://platform.openai.com/docs/guides/text?api-mode=responses)
- [Prompt caching](https://platform.openai.com/docs/guides/prompt-caching)
- [Token usage](https://platform.openai.com/docs/guides/token-usage)
- [Conversation state + context management](https://platform.openai.com/docs/guides/conversation-state)
