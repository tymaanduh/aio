#!/usr/bin/env python3
"""Native Python implementation for scripts/codex-efficiency-audit.js."""

from __future__ import annotations

import json
import math
import os
import pathlib
import re
import sys
import tomllib
from datetime import UTC, datetime
from typing import Any

import yaml

from _common import normalize_path, write_text_file_robust
from agent_workflow_shards_native import is_shards_current, read_workflow_doc
from project_source_resolver_native import find_project_root

DEFAULT_REPORT_PATH = pathlib.PurePosixPath(
    "data/output/databases/polyglot-default/analysis/codex_efficiency_report.json"
)
DEFAULT_BASELINE_PATH = pathlib.PurePosixPath(
    "data/input/shared/main/executive_engineering_baseline.json"
)
DEFAULT_TOKEN_POLICY_PATH = pathlib.PurePosixPath(
    "data/input/shared/main/token_usage_optimization_policy_catalog.json"
)
SKILL_PROMPT_TEMPLATE = re.compile(
    r"^Use \$[a-z0-9][a-z0-9-]* for this task\. Stay in aio project scope only\.$",
    re.IGNORECASE,
)


def to_finite_number(value: Any) -> float | None:
    if value is None:
        return None
    if isinstance(value, str) and not value.strip():
        return None
    try:
        numeric = float(value)
    except Exception:
        return None
    return numeric if math.isfinite(numeric) else None


def resolve_number(*candidates: Any) -> float | None:
    for candidate in candidates:
        numeric = to_finite_number(candidate)
        if numeric is not None:
            return numeric
    return None


def read_json_if_exists(file_path: pathlib.Path) -> Any:
    if not file_path.exists():
        return None
    try:
        return json.loads(file_path.read_text(encoding="utf8"))
    except Exception:
        return None


def parse_args(argv: list[str]) -> dict[str, Any]:
    args: dict[str, Any] = {
        "strict": "--no-strict" not in argv,
        "enforce": "--enforce" in argv,
        "skip_automations": "--skip-automations" in argv,
        "report_file": "",
        "previous_report_file": "",
        "baseline_file": "",
        "token_policy_file": "",
        "codex_home": "",
        "max_file_tokens": None,
        "max_skill_prompt_tokens": None,
        "max_automation_prompt_tokens": None,
        "max_total_tokens_estimate": None,
        "max_scope_guardrail_duplicate_count": None,
        "max_total_token_increase": None,
        "max_total_token_increase_percent": None,
        "max_per_file_token_increase": None,
        "enforce_skill_prompt_template": False,
    }

    index = 0
    while index < len(argv):
        token = str(argv[index] or "")
        if token == "--report-file" and index + 1 < len(argv):
            args["report_file"] = str(argv[index + 1] or "").strip()
            index += 2
            continue
        if token == "--previous-report-file" and index + 1 < len(argv):
            args["previous_report_file"] = str(argv[index + 1] or "").strip()
            index += 2
            continue
        if token == "--baseline-file" and index + 1 < len(argv):
            args["baseline_file"] = str(argv[index + 1] or "").strip()
            index += 2
            continue
        if token == "--token-policy-file" and index + 1 < len(argv):
            args["token_policy_file"] = str(argv[index + 1] or "").strip()
            index += 2
            continue
        if token == "--codex-home" and index + 1 < len(argv):
            args["codex_home"] = str(argv[index + 1] or "").strip()
            index += 2
            continue
        if token == "--max-file-tokens" and index + 1 < len(argv):
            args["max_file_tokens"] = to_finite_number(argv[index + 1])
            index += 2
            continue
        if token == "--max-skill-prompt-tokens" and index + 1 < len(argv):
            args["max_skill_prompt_tokens"] = to_finite_number(argv[index + 1])
            index += 2
            continue
        if token == "--max-automation-prompt-tokens" and index + 1 < len(argv):
            args["max_automation_prompt_tokens"] = to_finite_number(argv[index + 1])
            index += 2
            continue
        if token == "--max-total-tokens-estimate" and index + 1 < len(argv):
            args["max_total_tokens_estimate"] = to_finite_number(argv[index + 1])
            index += 2
            continue
        if token == "--max-scope-guardrail-duplicate-count" and index + 1 < len(argv):
            args["max_scope_guardrail_duplicate_count"] = to_finite_number(argv[index + 1])
            index += 2
            continue
        if token == "--max-total-token-increase" and index + 1 < len(argv):
            args["max_total_token_increase"] = to_finite_number(argv[index + 1])
            index += 2
            continue
        if token == "--max-total-token-increase-percent" and index + 1 < len(argv):
            args["max_total_token_increase_percent"] = to_finite_number(argv[index + 1])
            index += 2
            continue
        if token == "--max-per-file-token-increase" and index + 1 < len(argv):
            args["max_per_file_token_increase"] = to_finite_number(argv[index + 1])
            index += 2
            continue
        if token == "--enforce-skill-prompt-template":
            args["enforce_skill_prompt_template"] = True
        index += 1

    return args


def estimate_tokens(text: Any) -> int:
    return max(1, math.ceil(len(str(text or "")) / 4))


def count_words(text: Any) -> int:
    normalized = str(text or "").strip()
    return len(re.split(r"\s+", normalized)) if normalized else 0


def read_text(file_path: pathlib.Path) -> str:
    return file_path.read_text(encoding="utf8")


def collect_files_recursively(start_dir: pathlib.Path, matcher, out: list[pathlib.Path] | None = None) -> list[pathlib.Path]:
    collected = out if out is not None else []
    if not start_dir.exists():
        return collected
    stack = [start_dir]
    while stack:
        current = stack.pop()
        for entry in current.iterdir():
            if entry.is_dir():
                stack.append(entry)
                continue
            if entry.is_file() and matcher(entry):
                collected.append(entry)
    return collected


def normalize_text(value: Any) -> str:
    return str(value or "").strip()


def parse_openai_prompt(file_path: pathlib.Path) -> str:
    try:
        parsed = yaml.safe_load(read_text(file_path))
    except Exception:
        return ""
    if not isinstance(parsed, dict):
        return ""
    iface = parsed.get("interface")
    if not isinstance(iface, dict):
        return ""
    return normalize_text(iface.get("default_prompt"))


def analyze_automation_dir(codex_home: pathlib.Path) -> dict[str, Any]:
    automations_root = codex_home / "automations"
    if not automations_root.exists():
        return {
            "root": str(automations_root),
            "total": 0,
            "active": 0,
            "prompts": [],
            "duplicates": [],
        }

    prompts: list[dict[str, Any]] = []
    dedupe_key_map: dict[str, list[str]] = {}

    for entry in sorted(automations_root.iterdir(), key=lambda row: row.name):
        if not entry.is_dir():
            continue
        toml_path = entry / "automation.toml"
        if not toml_path.exists():
            continue
        try:
            parsed = tomllib.loads(toml_path.read_text(encoding="utf8"))
        except Exception:
            continue
        prompt = str(parsed.get("prompt") or "")
        status = str(parsed.get("status") or "")
        rrule = str(parsed.get("rrule") or "")
        name = str(parsed.get("name") or "")
        prompt_tokens = estimate_tokens(prompt)
        prompts.append(
            {
                "id": entry.name,
                "name": name,
                "status": status,
                "rrule": rrule,
                "prompt": prompt,
                "prompt_tokens_estimate": prompt_tokens,
                "prompt_chars": len(prompt),
            }
        )
        dedupe_key = f"{normalize_text(name).lower()}|{normalize_text(rrule)}|{normalize_text(prompt)}"
        dedupe_key_map.setdefault(dedupe_key, []).append(entry.name)

    duplicates = [ids for ids in dedupe_key_map.values() if len(ids) > 1]
    return {
        "root": str(automations_root),
        "total": len(prompts),
        "active": len([row for row in prompts if row.get("status") == "ACTIVE"]),
        "prompts": sorted(
            prompts,
            key=lambda row: int(row.get("prompt_tokens_estimate") or 0),
            reverse=True,
        ),
        "duplicates": duplicates,
    }


def relative_path(root: pathlib.Path, target: pathlib.Path) -> str:
    return normalize_path(os.path.relpath(target, root))


def resolve_thresholds(root: pathlib.Path, args: dict[str, Any]) -> dict[str, Any]:
    baseline_path = (root / pathlib.PurePosixPath(args.get("baseline_file") or DEFAULT_BASELINE_PATH)).resolve()
    token_policy_path = (
        root / pathlib.PurePosixPath(args.get("token_policy_file") or DEFAULT_TOKEN_POLICY_PATH)
    ).resolve()
    baseline_doc = read_json_if_exists(baseline_path)
    token_policy_doc = read_json_if_exists(token_policy_path)

    baseline_thresholds = (
        ((baseline_doc.get("optimization_policy") or {}).get("thresholds") or {})
        if isinstance(baseline_doc, dict)
        else {}
    )
    token_budgets = (
        (token_policy_doc.get("token_budgets") or {})
        if isinstance(token_policy_doc, dict)
        else {}
    )
    token_regressions = (
        (token_policy_doc.get("regression_limits") or {})
        if isinstance(token_policy_doc, dict)
        else {}
    )
    prompt_template_policy = (
        (token_policy_doc.get("prompt_template_policy") or {})
        if isinstance(token_policy_doc, dict)
        else {}
    )
    automation_policy = (
        (token_policy_doc.get("automation_prompt_policy") or {})
        if isinstance(token_policy_doc, dict)
        else {}
    )

    thresholds = {
        "max_file_tokens": resolve_number(
            args.get("max_file_tokens"),
            token_budgets.get("max_file_tokens"),
            baseline_thresholds.get("max_file_tokens"),
            16000,
        ),
        "max_skill_prompt_tokens": resolve_number(
            args.get("max_skill_prompt_tokens"),
            token_budgets.get("max_skill_prompt_tokens"),
            baseline_thresholds.get("max_skill_prompt_tokens"),
            72,
        ),
        "max_automation_prompt_tokens": resolve_number(
            args.get("max_automation_prompt_tokens"),
            token_budgets.get("max_automation_prompt_tokens"),
            baseline_thresholds.get("max_automation_prompt_tokens"),
            72,
        ),
        "max_total_tokens_estimate": resolve_number(
            args.get("max_total_tokens_estimate"),
            token_budgets.get("max_total_tokens_estimate"),
            baseline_thresholds.get("max_total_tokens_estimate"),
        ),
        "max_scope_guardrail_duplicate_count": resolve_number(
            args.get("max_scope_guardrail_duplicate_count"),
            token_budgets.get("max_scope_guardrail_duplicate_count"),
        ),
        "max_total_token_increase": resolve_number(
            args.get("max_total_token_increase"),
            token_regressions.get("max_total_token_increase"),
        ),
        "max_total_token_increase_percent": resolve_number(
            args.get("max_total_token_increase_percent"),
            token_regressions.get("max_total_token_increase_percent"),
        ),
        "max_per_file_token_increase": resolve_number(
            args.get("max_per_file_token_increase"),
            token_regressions.get("max_per_file_token_increase"),
        ),
        "enforce_skill_prompt_template": args.get("enforce_skill_prompt_template") is True
        or prompt_template_policy.get("enforce_compact_default_prompt") is True,
        "require_command_first_automation_prompt": automation_policy.get("require_command_first_prompt") is True,
        "required_automation_output_cap_marker": str(
            automation_policy.get("required_output_cap_marker") or ""
        ).strip(),
        "max_expected_automation_output_tokens": resolve_number(
            automation_policy.get("max_expected_output_tokens")
        ),
    }

    return {
        "baseline_file": relative_path(root, baseline_path),
        "token_policy_file": relative_path(root, token_policy_path),
        "baseline_loaded": baseline_doc is not None,
        "token_policy_loaded": token_policy_doc is not None,
        "thresholds": thresholds,
    }


def compare_against_previous_report(
    current_report: dict[str, Any],
    previous_report: Any,
    thresholds: dict[str, Any],
) -> dict[str, Any]:
    issues: list[dict[str, Any]] = []
    if not isinstance(previous_report, dict):
        return {
            "previous_generated_at": "",
            "total_tokens_previous": 0,
            "total_tokens_current": int(
                (((current_report.get("counts") or {}).get("total_tokens_estimate")) or 0)
            ),
            "total_tokens_delta": 0,
            "total_tokens_delta_percent": 0,
            "top_heavy_file_deltas": [],
            "issues": issues,
        }

    previous_total = int((((previous_report.get("counts") or {}).get("total_tokens_estimate")) or 0))
    current_total = int((((current_report.get("counts") or {}).get("total_tokens_estimate")) or 0))
    total_delta = current_total - previous_total
    total_delta_percent = ((total_delta / previous_total) * 100.0) if previous_total > 0 else 0.0

    max_total_increase = to_finite_number(thresholds.get("max_total_token_increase"))
    if max_total_increase is not None and total_delta > max_total_increase:
        issues.append(
            {
                "level": "error",
                "type": "total_tokens_regression_exceeded",
                "total_tokens_previous": previous_total,
                "total_tokens_current": current_total,
                "total_tokens_delta": total_delta,
                "max_total_token_increase": max_total_increase,
            }
        )

    max_total_increase_percent = to_finite_number(thresholds.get("max_total_token_increase_percent"))
    if max_total_increase_percent is not None and total_delta_percent > max_total_increase_percent:
        issues.append(
            {
                "level": "error",
                "type": "total_tokens_percent_regression_exceeded",
                "total_tokens_previous": previous_total,
                "total_tokens_current": current_total,
                "total_tokens_delta_percent": round(total_delta_percent, 4),
                "max_total_token_increase_percent": max_total_increase_percent,
            }
        )

    previous_top_map: dict[str, int] = {}
    previous_top = previous_report.get("top_heavy_files") if isinstance(previous_report.get("top_heavy_files"), list) else []
    for row in previous_top:
        if not isinstance(row, dict):
            continue
        file_name = str(row.get("file") or "").strip()
        if file_name:
            previous_top_map[file_name] = int(row.get("tokens_estimate") or 0)

    top_heavy_file_deltas: list[dict[str, Any]] = []
    current_top = current_report.get("top_heavy_files") if isinstance(current_report.get("top_heavy_files"), list) else []
    for row in current_top:
        if not isinstance(row, dict):
            continue
        file_name = str(row.get("file") or "").strip()
        if not file_name or file_name not in previous_top_map:
            continue
        previous_tokens = int(previous_top_map.get(file_name) or 0)
        current_tokens = int(row.get("tokens_estimate") or 0)
        delta = current_tokens - previous_tokens
        if delta == 0:
            continue
        top_heavy_file_deltas.append(
            {
                "file": file_name,
                "previous_tokens_estimate": previous_tokens,
                "current_tokens_estimate": current_tokens,
                "delta_tokens_estimate": delta,
            }
        )

    max_per_file_increase = to_finite_number(thresholds.get("max_per_file_token_increase"))
    for entry in top_heavy_file_deltas:
        if max_per_file_increase is not None and int(entry.get("delta_tokens_estimate") or 0) > max_per_file_increase:
            issues.append(
                {
                    "level": "error",
                    "type": "top_heavy_file_token_regression_exceeded",
                    "file": entry.get("file"),
                    "delta_tokens_estimate": entry.get("delta_tokens_estimate"),
                    "max_per_file_token_increase": max_per_file_increase,
                }
            )

    return {
        "previous_generated_at": str(previous_report.get("generated_at") or ""),
        "total_tokens_previous": previous_total,
        "total_tokens_current": current_total,
        "total_tokens_delta": total_delta,
        "total_tokens_delta_percent": round(total_delta_percent, 4),
        "top_heavy_file_deltas": sorted(
            top_heavy_file_deltas,
            key=lambda entry: int(entry.get("delta_tokens_estimate") or 0),
            reverse=True,
        )[:20],
        "issues": issues,
    }


def analyze(root: pathlib.Path, args: dict[str, Any] | None = None) -> dict[str, Any]:
    options = dict(args or {})
    policy = resolve_thresholds(root, options)
    thresholds = dict(policy.get("thresholds") or {})
    skills_root = root / "to-do" / "skills"
    agents_root = root / "to-do" / "agents"
    canonical_workflow_path = skills_root / "agent_workflows.json"
    shard_workflow_index_path = agents_root / "agent_workflow_shards" / "index.json"
    workflow_metadata_mode = (
        "sharded_lazy" if shard_workflow_index_path.exists() and is_shards_current(root) else "canonical"
    )

    files: list[pathlib.Path] = []
    files.append(shard_workflow_index_path if workflow_metadata_mode == "sharded_lazy" else canonical_workflow_path)
    files.append(skills_root / "repeat_action_routing.json")

    collect_files_recursively(
        skills_root,
        lambda file_path: file_path.name == "SKILL.md"
        or normalize_path(file_path.relative_to(skills_root)).endswith("agents/openai.yaml"),
        files,
    )
    collect_files_recursively(
        agents_root,
        lambda file_path: file_path.suffix == ".yaml"
        or file_path.name in {"agent_access_control.json", "agents_registry.yaml"},
        files,
    )

    unique_files = sorted(
        {file_path.resolve() for file_path in files if file_path.exists()},
        key=lambda file_path: normalize_path(file_path.relative_to(root)),
    )

    file_metrics: list[dict[str, Any]] = []
    for file_path in unique_files:
        text = read_text(file_path)
        file_metrics.append(
            {
                "file": normalize_path(file_path.relative_to(root)),
                "chars": len(text),
                "words": count_words(text),
                "tokens_estimate": estimate_tokens(text),
                "lines": len(text.replace("\r\n", "\n").replace("\r", "\n").split("\n")),
            }
        )

    total_estimated_tokens = sum(int(row.get("tokens_estimate") or 0) for row in file_metrics)
    top_heavy_files = sorted(
        file_metrics,
        key=lambda row: int(row.get("tokens_estimate") or 0),
        reverse=True,
    )[:20]

    prompt_files = [
        file_path
        for file_path in unique_files
        if normalize_path(file_path.relative_to(root)).endswith("agents/openai.yaml")
    ]
    skill_prompt_metrics = sorted(
        [
            {
                "file": normalize_path(file_path.relative_to(root)),
                "prompt_chars": len(prompt := parse_openai_prompt(file_path)),
                "prompt_tokens_estimate": estimate_tokens(prompt),
                "prompt": prompt,
            }
            for file_path in prompt_files
        ],
        key=lambda row: int(row.get("prompt_tokens_estimate") or 0),
        reverse=True,
    )

    guardrail_duplicates: list[dict[str, Any]] = []
    try:
        workflow_load = read_workflow_doc(
            root,
            prefer_shards=True,
            ensure_current=workflow_metadata_mode == "sharded_lazy",
        )
        guardrail_count: dict[str, int] = {}
        workflow_doc = workflow_load.get("doc") if isinstance(workflow_load, dict) else {}
        agents = workflow_doc.get("agents") if isinstance(workflow_doc, dict) else []
        for agent in agents if isinstance(agents, list) else []:
            guardrails = agent.get("scope_guardrails") if isinstance(agent, dict) else []
            for guardrail in guardrails if isinstance(guardrails, list) else []:
                key = normalize_text(guardrail)
                if key:
                    guardrail_count[key] = int(guardrail_count.get(key) or 0) + 1
        guardrail_duplicates = sorted(
            [
                {"text": text, "count": count}
                for text, count in guardrail_count.items()
                if count > 1
            ],
            key=lambda row: int(row.get("count") or 0),
            reverse=True,
        )
    except Exception:
        guardrail_duplicates = []

    codex_home = pathlib.Path(
        options.get("codex_home") or os.environ.get("CODEX_HOME") or (pathlib.Path.home() / ".codex")
    ).resolve()
    automation_analysis = (
        {
            "root": str(codex_home / "automations"),
            "total": 0,
            "active": 0,
            "prompts": [],
            "duplicates": [],
            "skipped": True,
        }
        if options.get("skip_automations")
        else analyze_automation_dir(codex_home)
    )

    report_path = (root / pathlib.PurePosixPath(options.get("report_file") or DEFAULT_REPORT_PATH)).resolve()
    previous_report_path = (
        root
        / pathlib.PurePosixPath(
            options.get("previous_report_file") or options.get("report_file") or DEFAULT_REPORT_PATH
        )
    ).resolve()
    previous_report = read_json_if_exists(previous_report_path)
    issues: list[dict[str, Any]] = []

    max_total_tokens_estimate = to_finite_number(thresholds.get("max_total_tokens_estimate"))
    if max_total_tokens_estimate is not None and total_estimated_tokens > max_total_tokens_estimate:
        issues.append(
            {
                "level": "error",
                "type": "total_token_budget_exceeded",
                "total_tokens_estimate": total_estimated_tokens,
                "max_total_tokens_estimate": max_total_tokens_estimate,
            }
        )

    for row in file_metrics:
        if int(row.get("tokens_estimate") or 0) > float(thresholds.get("max_file_tokens") or 0):
            issues.append(
                {
                    "level": "error",
                    "type": "file_token_budget_exceeded",
                    "file": row.get("file"),
                    "tokens_estimate": row.get("tokens_estimate"),
                    "max_tokens": thresholds.get("max_file_tokens"),
                }
            )

    for row in skill_prompt_metrics:
        if int(row.get("prompt_tokens_estimate") or 0) > float(thresholds.get("max_skill_prompt_tokens") or 0):
            issues.append(
                {
                    "level": "error",
                    "type": "skill_prompt_budget_exceeded",
                    "file": row.get("file"),
                    "prompt_tokens_estimate": row.get("prompt_tokens_estimate"),
                    "max_tokens": thresholds.get("max_skill_prompt_tokens"),
                }
            )
        if thresholds.get("enforce_skill_prompt_template") and not SKILL_PROMPT_TEMPLATE.match(
            str(row.get("prompt") or "").strip()
        ):
            issues.append(
                {
                    "level": "error",
                    "type": "skill_prompt_template_non_compliant",
                    "file": row.get("file"),
                }
            )

    for row in automation_analysis.get("prompts") if isinstance(automation_analysis.get("prompts"), list) else []:
        if row.get("status") != "ACTIVE":
            continue
        if int(row.get("prompt_tokens_estimate") or 0) > float(thresholds.get("max_automation_prompt_tokens") or 0):
            issues.append(
                {
                    "level": "error",
                    "type": "automation_prompt_budget_exceeded",
                    "id": row.get("id"),
                    "prompt_tokens_estimate": row.get("prompt_tokens_estimate"),
                    "max_tokens": thresholds.get("max_automation_prompt_tokens"),
                }
            )
        if thresholds.get("require_command_first_automation_prompt") is True and not re.match(
            r"^Run\s+",
            str(row.get("prompt") or ""),
            re.IGNORECASE,
        ):
            issues.append(
                {
                    "level": "error",
                    "type": "automation_prompt_not_command_first",
                    "id": row.get("id"),
                }
            )
        required_marker = str(thresholds.get("required_automation_output_cap_marker") or "")
        if required_marker and required_marker not in str(row.get("prompt") or ""):
            issues.append(
                {
                    "level": "error",
                    "type": "automation_prompt_output_cap_marker_missing",
                    "id": row.get("id"),
                    "required_marker": required_marker,
                }
            )

    for duplicate_group in automation_analysis.get("duplicates") if isinstance(automation_analysis.get("duplicates"), list) else []:
        issues.append(
            {
                "level": "warn",
                "type": "duplicate_automation_signature",
                "ids": duplicate_group,
            }
        )

    max_scope_guardrail_duplicates = to_finite_number(thresholds.get("max_scope_guardrail_duplicate_count"))
    if max_scope_guardrail_duplicates is not None:
        for entry in guardrail_duplicates:
            if int(entry.get("count") or 0) > max_scope_guardrail_duplicates:
                issues.append(
                    {
                        "level": "error",
                        "type": "scope_guardrail_duplicate_budget_exceeded",
                        "text": entry.get("text"),
                        "count": entry.get("count"),
                        "max_scope_guardrail_duplicate_count": max_scope_guardrail_duplicates,
                    }
                )

    trend = compare_against_previous_report(
        {
            "counts": {"total_tokens_estimate": total_estimated_tokens},
            "top_heavy_files": top_heavy_files,
        },
        previous_report,
        thresholds,
    )
    issues.extend(trend.get("issues") if isinstance(trend.get("issues"), list) else [])

    recommendations = [
        "Keep skill defaults on one canonical line: 'Use $skill for this task. Stay in aio project scope only.'",
        "Keep active automation prompts command-first, include 'Inbox<=120t:', and stay under policy token caps.",
        "Track token deltas against the previous report and fail on positive drift above budget.",
        "Use Responses API prompt caching for shared prefixes and stable prompt_cache_key values.",
        "Use Responses API max_output_tokens and low verbosity defaults for routine automation runs.",
        "Use conversation compaction checkpoints; previous_response_id still bills prior tokens.",
        "Use workflow fast mode for iterative runs: --fast --skip-preflight --skip-output-format.",
    ]

    return {
        "status": "fail" if any(entry.get("level") == "error" for entry in issues) else "pass",
        "generated_at": datetime.now(UTC).isoformat().replace("+00:00", "Z"),
        "root": str(root),
        "policy_inputs": {
            "baseline_file": policy.get("baseline_file"),
            "token_policy_file": policy.get("token_policy_file"),
            "baseline_loaded": policy.get("baseline_loaded"),
            "token_policy_loaded": policy.get("token_policy_loaded"),
        },
        "thresholds": {
            "max_file_tokens": thresholds.get("max_file_tokens"),
            "max_skill_prompt_tokens": thresholds.get("max_skill_prompt_tokens"),
            "max_automation_prompt_tokens": thresholds.get("max_automation_prompt_tokens"),
            "max_total_tokens_estimate": thresholds.get("max_total_tokens_estimate"),
            "max_scope_guardrail_duplicate_count": thresholds.get("max_scope_guardrail_duplicate_count"),
            "max_total_token_increase": thresholds.get("max_total_token_increase"),
            "max_total_token_increase_percent": thresholds.get("max_total_token_increase_percent"),
            "max_per_file_token_increase": thresholds.get("max_per_file_token_increase"),
            "enforce_skill_prompt_template": thresholds.get("enforce_skill_prompt_template"),
            "require_command_first_automation_prompt": thresholds.get(
                "require_command_first_automation_prompt"
            ),
            "required_automation_output_cap_marker": thresholds.get(
                "required_automation_output_cap_marker"
            ),
            "max_expected_automation_output_tokens": thresholds.get(
                "max_expected_automation_output_tokens"
            ),
        },
        "counts": {
            "files_scanned": len(file_metrics),
            "total_tokens_estimate": total_estimated_tokens,
            "skill_prompts_scanned": len(skill_prompt_metrics),
            "automation_prompts_scanned": len(automation_analysis.get("prompts") or []),
            "automation_active": automation_analysis.get("active"),
            "workflow_metadata_mode": workflow_metadata_mode,
        },
        "trend": {
            "previous_report_file": relative_path(root, previous_report_path),
            "previous_report_found": bool(previous_report),
            "previous_generated_at": trend.get("previous_generated_at"),
            "total_tokens_previous": trend.get("total_tokens_previous"),
            "total_tokens_current": trend.get("total_tokens_current"),
            "total_tokens_delta": trend.get("total_tokens_delta"),
            "total_tokens_delta_percent": trend.get("total_tokens_delta_percent"),
            "top_heavy_file_deltas": trend.get("top_heavy_file_deltas"),
        },
        "outputs": {
            "report_file": relative_path(root, report_path),
        },
        "top_heavy_files": top_heavy_files,
        "skill_prompt_metrics": skill_prompt_metrics,
        "duplicated_scope_guardrails": guardrail_duplicates,
        "automation": automation_analysis,
        "issues": issues,
        "recommendations": recommendations,
    }


def main(argv: list[str] | None = None) -> int:
    args = parse_args(list(argv or []))
    root = find_project_root(pathlib.Path.cwd())
    report = analyze(root, args)
    report_file = (root / pathlib.PurePosixPath(args.get("report_file") or DEFAULT_REPORT_PATH)).resolve()
    write_text_file_robust(report_file, f"{json.dumps(report, indent=2)}\n", atomic=False)
    sys.stdout.write(f"{json.dumps(report, indent=2)}\n")
    if args.get("strict") and args.get("enforce") and report.get("status") != "pass":
        return 1
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main(sys.argv[1:]))
    except SystemExit:
        raise
    except Exception as error:
        sys.stderr.write(f"codex-efficiency-audit failed: {error}\n")
        raise SystemExit(1)
