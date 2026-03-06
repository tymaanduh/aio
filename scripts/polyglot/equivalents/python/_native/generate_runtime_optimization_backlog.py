#!/usr/bin/env python3
"""Native Python implementation for scripts/generate-runtime-optimization-backlog.js."""

from __future__ import annotations

import json
import pathlib
import sys
from datetime import UTC, datetime
from typing import Any

from _common import find_repo_root, normalize_path, write_text_file_robust

ROOT = find_repo_root(pathlib.Path(__file__))
DEFAULT_RUNTIME_REPORT = ROOT / "data" / "output" / "databases" / "polyglot-default" / "analysis" / "script_runtime_swap_report.json"
DEFAULT_EFFICIENCY_REPORT = ROOT / "data" / "output" / "databases" / "polyglot-default" / "analysis" / "codex_efficiency_report.json"
DEFAULT_SEPARATION_REPORT = ROOT / "data" / "output" / "databases" / "polyglot-default" / "analysis" / "data_separation_audit_report.json"
DEFAULT_BENCHMARK_REPORT = ROOT / "data" / "output" / "databases" / "polyglot-default" / "reports" / "polyglot_runtime_benchmark_report.json"
DEFAULT_JSON_OUT = ROOT / "data" / "output" / "databases" / "polyglot-default" / "plan" / "runtime_optimization_backlog.json"
DEFAULT_MD_OUT = ROOT / "data" / "output" / "databases" / "polyglot-default" / "plan" / "runtime_optimization_backlog.md"

PRIORITY_SCORE = {"P0": 0, "P1": 1, "P2": 2}


def parse_args(argv: list[str]) -> dict[str, Any]:
    args: dict[str, Any] = {
        "strict": "--no-strict" not in argv,
        "enforce": "--enforce" in argv,
        "runtimeReport": DEFAULT_RUNTIME_REPORT,
        "efficiencyReport": DEFAULT_EFFICIENCY_REPORT,
        "separationReport": DEFAULT_SEPARATION_REPORT,
        "benchmarkReport": DEFAULT_BENCHMARK_REPORT,
        "jsonOut": DEFAULT_JSON_OUT,
        "mdOut": DEFAULT_MD_OUT,
    }
    index = 0
    while index < len(argv):
        token = str(argv[index] or "")
        if token == "--runtime-report-file" and index + 1 < len(argv):
            args["runtimeReport"] = (pathlib.Path.cwd() / str(argv[index + 1] or "")).resolve()
            index += 2
            continue
        if token == "--efficiency-report-file" and index + 1 < len(argv):
            args["efficiencyReport"] = (pathlib.Path.cwd() / str(argv[index + 1] or "")).resolve()
            index += 2
            continue
        if token == "--separation-report-file" and index + 1 < len(argv):
            args["separationReport"] = (pathlib.Path.cwd() / str(argv[index + 1] or "")).resolve()
            index += 2
            continue
        if token == "--benchmark-report-file" and index + 1 < len(argv):
            args["benchmarkReport"] = (pathlib.Path.cwd() / str(argv[index + 1] or "")).resolve()
            index += 2
            continue
        if token == "--json-out" and index + 1 < len(argv):
            args["jsonOut"] = (pathlib.Path.cwd() / str(argv[index + 1] or "")).resolve()
            index += 2
            continue
        if token == "--md-out" and index + 1 < len(argv):
            args["mdOut"] = (pathlib.Path.cwd() / str(argv[index + 1] or "")).resolve()
            index += 2
            continue
        index += 1
    return args


def normalize_output_path(file_path: pathlib.Path) -> str:
    return normalize_path(file_path.relative_to(ROOT))


def read_json_if_exists(file_path: pathlib.Path, issues: list[dict[str, Any]], key: str) -> dict[str, Any]:
    if not file_path.exists():
        issues.append(
            {
                "level": "warn",
                "code": "missing_input_report",
                "report_key": key,
                "file": normalize_output_path(file_path),
            }
        )
        return {}
    try:
        return json.loads(file_path.read_text(encoding="utf8"))
    except Exception as error:
        issues.append(
            {
                "level": "warn",
                "code": "invalid_input_report_json",
                "report_key": key,
                "file": normalize_output_path(file_path),
                "error": str(error),
            }
        )
        return {}


def add_task(tasks: list[dict[str, Any]], task: dict[str, Any]) -> None:
    tasks.append(
        {
            "id": str(task.get("id") or "").strip(),
            "title": str(task.get("title") or "").strip(),
            "priority": str(task.get("priority") or "P2"),
            "category": str(task.get("category") or "general"),
            "impact": str(task.get("impact") or ""),
            "effort": str(task.get("effort") or "medium"),
            "action": str(task.get("action") or ""),
            "command": str(task.get("command") or ""),
            "evidence": list(task.get("evidence") or []),
        }
    )


def build_tasks(inputs: dict[str, Any]) -> list[dict[str, Any]]:
    tasks: list[dict[str, Any]] = []
    runtime_report = inputs.get("runtimeReport") if isinstance(inputs.get("runtimeReport"), dict) else {}
    efficiency_report = inputs.get("efficiencyReport") if isinstance(inputs.get("efficiencyReport"), dict) else {}
    separation_report = inputs.get("separationReport") if isinstance(inputs.get("separationReport"), dict) else {}
    benchmark_report = inputs.get("benchmarkReport") if isinstance(inputs.get("benchmarkReport"), dict) else {}

    runtime_metrics = runtime_report.get("metrics") if isinstance(runtime_report.get("metrics"), dict) else {}
    runtime_stages = runtime_report.get("stages") if isinstance(runtime_report.get("stages"), list) else []
    runtime_controls = runtime_report.get("controls") if isinstance(runtime_report.get("controls"), dict) else {}
    separation_required_total = int(separation_report.get("separation_required_total") or 0)
    benchmark_languages_run = benchmark_report.get("languages_run") if isinstance(benchmark_report.get("languages_run"), list) else []
    benchmark_languages_skipped = (
        benchmark_report.get("languages_skipped") if isinstance(benchmark_report.get("languages_skipped"), list) else []
    )
    benchmark_case_count = int(benchmark_report.get("benchmark_case_count") or 0)
    efficiency_top_heavy = efficiency_report.get("top_heavy_files") if isinstance(efficiency_report.get("top_heavy_files"), list) else []
    efficiency_thresholds = efficiency_report.get("thresholds") if isinstance(efficiency_report.get("thresholds"), dict) else {}
    efficiency_trend = efficiency_report.get("trend") if isinstance(efficiency_report.get("trend"), dict) else {}
    efficiency_automation = (
        efficiency_report.get("automation", {}).get("prompts")
        if isinstance(efficiency_report.get("automation"), dict)
        and isinstance(efficiency_report.get("automation", {}).get("prompts"), list)
        else []
    )
    duplicated_guardrails = (
        efficiency_report.get("duplicated_scope_guardrails")
        if isinstance(efficiency_report.get("duplicated_scope_guardrails"), list)
        else []
    )
    automation_prompt_budget = int(efficiency_thresholds.get("max_automation_prompt_tokens") or 72)
    scope_guardrail_budget = int(efficiency_thresholds.get("max_scope_guardrail_duplicate_count") or 0)

    if separation_required_total > 0:
        add_task(
            tasks,
            {
                "id": "separation-hardcoded-remaining",
                "title": "Extract remaining hardcoded values into JSON catalogs",
                "priority": "P0",
                "category": "data-separation",
                "impact": "Enforces 1:1 wrapper contract and removes duplicated inline data.",
                "effort": "high",
                "action": f"Resolve {separation_required_total} separation-required findings from the latest audit and move constants, aliases, and labels to data catalogs.",
                "command": "npm run audit:data-separation -- --enforce",
                "evidence": [normalize_output_path(DEFAULT_SEPARATION_REPORT)],
            },
        )

    if int(runtime_metrics.get("fallback_used_stage_count") or 0) > 0:
        add_task(
            tasks,
            {
                "id": "runtime-fallback-reduction",
                "title": "Reduce runtime fallback retries across workflow stages",
                "priority": "P0",
                "category": "runtime",
                "impact": "Cuts stage latency spikes and improves deterministic execution.",
                "effort": "medium",
                "action": "Tune stage runtime order and adapter health so first attempt succeeds for every stage.",
                "command": "npm run workflow:general -- --mode maintain --script-runtime-auto-best --script-runtime-strict",
                "evidence": [normalize_output_path(DEFAULT_RUNTIME_REPORT)],
            },
        )

    if int(runtime_metrics.get("failed_stage_count") or 0) > 0:
        add_task(
            tasks,
            {
                "id": "runtime-stage-failures",
                "title": "Clear failed script runtime stages",
                "priority": "P0",
                "category": "runtime",
                "impact": "Restores full pipeline reliability.",
                "effort": "medium",
                "action": f"Fix {int(runtime_metrics.get('failed_stage_count') or 0)} failing stage runtime execution paths, then rerun maintain workflow.",
                "command": "npm run workflow:general -- --mode maintain",
                "evidence": [normalize_output_path(DEFAULT_RUNTIME_REPORT)],
            },
        )

    if int(runtime_metrics.get("strict_stage_count") or 0) == 0 and runtime_controls.get("disable_swaps") is not True:
        add_task(
            tasks,
            {
                "id": "runtime-strict-smoke",
                "title": "Add strict runtime smoke run to detect adapter drift early",
                "priority": "P1",
                "category": "runtime",
                "impact": "Detects adapter/toolchain regressions before fallback masks failures.",
                "effort": "low",
                "action": "Run a strict runtime maintain pass in automation and fail fast on missing adapters.",
                "command": "npm run workflow:general -- --mode maintain --script-runtime-auto-best --script-runtime-strict",
                "evidence": [normalize_output_path(DEFAULT_RUNTIME_REPORT)],
            },
        )

    slow_stages = [
        stage for stage in runtime_stages if float((stage or {}).get("duration_ms") or 0) >= 800
    ]
    for stage in sorted(slow_stages, key=lambda item: float((item or {}).get("duration_ms") or 0), reverse=True)[:5]:
        stage_name = str((stage or {}).get("stage") or "unknown")
        duration_ms = float((stage or {}).get("duration_ms") or 0)
        add_task(
            tasks,
            {
                "id": f"runtime-stage-{stage_name}-latency",
                "title": f"Optimize {stage_name} runtime latency",
                "priority": "P1",
                "category": "runtime",
                "impact": "Reduces total workflow completion time.",
                "effort": "medium",
                "action": f"Profile and optimize '{stage_name}' stage. Current duration: {duration_ms:g} ms.",
                "command": f"npm run workflow:general -- --mode maintain --script-runtime-auto-best --scope \"{stage_name} tuning\"",
                "evidence": [normalize_output_path(DEFAULT_RUNTIME_REPORT)],
            },
        )

    required_languages = ["javascript", "python", "cpp"]
    missing_benchmark_languages = [language for language in required_languages if language not in benchmark_languages_run]
    if missing_benchmark_languages or benchmark_languages_skipped:
        missing = []
        for language in [*missing_benchmark_languages, *benchmark_languages_skipped]:
            if language not in missing:
                missing.append(language)
        add_task(
            tasks,
            {
                "id": "benchmark-language-coverage",
                "title": "Restore full JS/Python/C++ benchmark coverage",
                "priority": "P0",
                "category": "benchmark",
                "impact": "Keeps runtime winner selection evidence valid for modular swaps.",
                "effort": "medium",
                "action": f"Install/fix toolchains for: {', '.join(missing)} and rerun runtime benchmark gate.",
                "command": "npm run benchmark:runtime -- --languages javascript,python,cpp",
                "evidence": [normalize_output_path(DEFAULT_BENCHMARK_REPORT)],
            },
        )

    if benchmark_case_count < 20:
        add_task(
            tasks,
            {
                "id": "benchmark-case-expansion",
                "title": "Expand runtime benchmark case catalog coverage",
                "priority": "P2",
                "category": "benchmark",
                "impact": "Improves confidence in per-function language winner decisions.",
                "effort": "medium",
                "action": f"Increase benchmark cases from {benchmark_case_count} to at least 20 with representative IO-heavy and string-heavy wrappers.",
                "command": "npm run benchmark:runtime -- --languages javascript,python,cpp",
                "evidence": [normalize_output_path(DEFAULT_BENCHMARK_REPORT), "data/input/shared/wrapper/runtime_benchmark_cases.json"],
            },
        )

    for row in [
        item for item in efficiency_top_heavy if int((item or {}).get("tokens_estimate") or 0) > 1200
    ][:8]:
        file_name = str((row or {}).get("file") or "")
        tokens_estimate = int((row or {}).get("tokens_estimate") or 0)
        add_task(
            tasks,
            {
                "id": f"token-heavy-{''.join('-' if not ch.isalnum() else ch.lower() for ch in file_name).strip('-')}",
                "title": f"Reduce token weight in {file_name or 'large_file'}",
                "priority": "P1" if tokens_estimate > 2500 else "P2",
                "category": "token-efficiency",
                "impact": "Lowers Codex context cost and speed variance.",
                "effort": "medium",
                "action": f"Split high-token sections into smaller catalogs/modules. Current estimate: {tokens_estimate} tokens.",
                "command": "npm run efficiency:audit -- --enforce",
                "evidence": [normalize_output_path(DEFAULT_EFFICIENCY_REPORT), file_name],
            },
        )

    active_automation_rows = [
        row
        for row in efficiency_automation
        if str((row or {}).get("status") or "").upper() == "ACTIVE"
        and int((row or {}).get("prompt_tokens_estimate") or 0) >= automation_prompt_budget
    ]
    for row in active_automation_rows[:8]:
        automation_id = str((row or {}).get("id") or "")
        automation_name = str((row or {}).get("name") or automation_id or "automation")
        prompt_tokens_estimate = int((row or {}).get("prompt_tokens_estimate") or 0)
        add_task(
            tasks,
            {
                "id": f"automation-prompt-{''.join('-' if not ch.isalnum() else ch.lower() for ch in automation_id).strip('-')}",
                "title": f"Trim automation prompt tokens for {automation_name}",
                "priority": "P1",
                "category": "automation",
                "impact": "Reduces autonomous run token usage and prompt drift.",
                "effort": "low",
                "action": f"Compress automation prompt to <= {automation_prompt_budget} estimated tokens. Current estimate: {prompt_tokens_estimate}.",
                "command": "npm run automations:optimize",
                "evidence": [normalize_output_path(DEFAULT_EFFICIENCY_REPORT)],
            },
        )

    if duplicated_guardrails:
        max_duplicate_count = max(int((entry or {}).get("count") or 0) for entry in duplicated_guardrails)
        budget_suffix = f" (budget: {scope_guardrail_budget})" if scope_guardrail_budget > 0 else ""
        add_task(
            tasks,
            {
                "id": "guardrail-deduplication",
                "title": "Deduplicate repeated scope guardrails in agent metadata",
                "priority": "P2",
                "category": "metadata",
                "impact": "Shrinks prompt size and simplifies agent maintenance.",
                "effort": "low",
                "action": f"Centralize repeated guardrails into shared constants; duplicate groups: {len(duplicated_guardrails)}, max count: {max_duplicate_count}{budget_suffix}.",
                "command": "npm run agents:scope-sync && npm run agents:validate",
                "evidence": [normalize_output_path(DEFAULT_EFFICIENCY_REPORT)],
            },
        )

    if int(efficiency_trend.get("total_tokens_delta") or 0) > 0:
        add_task(
            tasks,
            {
                "id": "token-regression-reduction",
                "title": "Reverse total token regression",
                "priority": "P0",
                "category": "token-efficiency",
                "impact": "Restores lower context cost and faster Codex completion time.",
                "effort": "medium",
                "action": f"Reduce total estimated tokens by at least {int(efficiency_trend.get('total_tokens_delta') or 0)} to beat previous baseline.",
                "command": "npm run efficiency:gate && npm run agents:scope-sync",
                "evidence": [normalize_output_path(DEFAULT_EFFICIENCY_REPORT)],
            },
        )

    return tasks


def to_markdown(report: dict[str, Any]) -> str:
    tasks = list(report.get("tasks") or [])
    by_priority = {
        "P0": [entry for entry in tasks if entry.get("priority") == "P0"],
        "P1": [entry for entry in tasks if entry.get("priority") == "P1"],
        "P2": [entry for entry in tasks if entry.get("priority") == "P2"],
    }
    lines = [
        "# Runtime Optimization Backlog",
        "",
        f"- Generated At: {report.get('generated_at')}",
        f"- Total Tasks: {(report.get('metrics') or {}).get('total_tasks', 0)}",
        f"- P0: {((report.get('metrics') or {}).get('priority_counts') or {}).get('P0', 0)}",
        f"- P1: {((report.get('metrics') or {}).get('priority_counts') or {}).get('P1', 0)}",
        f"- P2: {((report.get('metrics') or {}).get('priority_counts') or {}).get('P2', 0)}",
        "",
    ]
    for priority in ("P0", "P1", "P2"):
        lines.extend([f"## {priority} Tasks", ""])
        if not by_priority[priority]:
            lines.extend(["- none", ""])
            continue
        for index, task in enumerate(by_priority[priority], start=1):
            lines.append(f"{index}. [{task['id']}] {task['title']}")
            lines.append(f"   - Category: {task['category']}")
            lines.append(f"   - Impact: {task['impact']}")
            lines.append(f"   - Effort: {task['effort']}")
            lines.append(f"   - Action: {task['action']}")
            if task.get("command"):
                lines.append(f"   - Command: `{task['command']}`")
            if task.get("evidence"):
                lines.append(f"   - Evidence: {', '.join(task['evidence'])}")
        lines.append("")
    return "\n".join(lines) + "\n"


def main(argv: list[str] | None = None) -> int:
    args = parse_args(list(argv or []))
    issues: list[dict[str, Any]] = []
    runtime_report = read_json_if_exists(args["runtimeReport"], issues, "runtime_report")
    efficiency_report = read_json_if_exists(args["efficiencyReport"], issues, "efficiency_report")
    separation_report = read_json_if_exists(args["separationReport"], issues, "separation_report")
    benchmark_report = read_json_if_exists(args["benchmarkReport"], issues, "benchmark_report")

    tasks = build_tasks(
        {
            "runtimeReport": runtime_report,
            "efficiencyReport": efficiency_report,
            "separationReport": separation_report,
            "benchmarkReport": benchmark_report,
        }
    )
    sorted_tasks = sorted(
        tasks,
        key=lambda entry: (
            PRIORITY_SCORE.get(str(entry.get("priority") or "P2"), PRIORITY_SCORE["P2"]),
            str(entry.get("id") or ""),
        ),
    )
    priority_counts = {
        "P0": sum(1 for entry in sorted_tasks if entry.get("priority") == "P0"),
        "P1": sum(1 for entry in sorted_tasks if entry.get("priority") == "P1"),
        "P2": sum(1 for entry in sorted_tasks if entry.get("priority") == "P2"),
    }
    report = {
        "schema_version": 1,
        "report_id": "aio_runtime_optimization_backlog",
        "generated_at": datetime.now(UTC).isoformat().replace("+00:00", "Z"),
        "root": str(ROOT),
        "inputs": {
            "runtime_report_file": normalize_output_path(args["runtimeReport"]),
            "efficiency_report_file": normalize_output_path(args["efficiencyReport"]),
            "separation_report_file": normalize_output_path(args["separationReport"]),
            "benchmark_report_file": normalize_output_path(args["benchmarkReport"]),
        },
        "outputs": {
            "json_file": normalize_output_path(args["jsonOut"]),
            "markdown_file": normalize_output_path(args["mdOut"]),
        },
        "metrics": {
            "total_tasks": len(sorted_tasks),
            "priority_counts": priority_counts,
        },
        "issues": issues,
        "tasks": sorted_tasks,
    }

    write_text_file_robust(args["jsonOut"], f"{json.dumps(report, indent=2)}\n", atomic=False)
    write_text_file_robust(args["mdOut"], to_markdown(report), atomic=False)
    sys.stdout.write(f"{json.dumps(report, indent=2)}\n")

    if args.get("enforce") and priority_counts["P0"] > 0:
        return 1
    if args.get("strict") and any(str((entry or {}).get("level") or "") == "warn" for entry in issues):
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
