#!/usr/bin/env python3
"""Native Python implementation for scripts/run-local-token-maintenance.js."""

from __future__ import annotations

import json
import pathlib
import sys
from datetime import UTC, datetime
from typing import Any

from _common import find_repo_root, normalize_path, run_python_equivalent_script, write_text_file_robust

DEFAULT_LOG_DIR = pathlib.PurePosixPath("data/output/databases/polyglot-default/reports/local-token-maintenance/logs")
DEFAULT_REPORT_FILE = pathlib.PurePosixPath("data/output/databases/polyglot-default/reports/local-token-maintenance/local_token_maintenance_report.json")
DEFAULT_MARKDOWN_FILE = pathlib.PurePosixPath("docs/visuals/local_token_maintenance_status.md")
DEFAULT_EFFICIENCY_REPORT = pathlib.PurePosixPath("data/output/databases/polyglot-default/analysis/codex_efficiency_report.json")

TASKS = [
    {"id": "scope_sync", "label": "Scope Sync", "script": "scripts/sync-agent-skill-scope.js", "args": []},
    {"id": "agent_registry_validate", "label": "Agent Registry Validate", "script": "scripts/validate-agent-registry.js", "args": []},
    {"id": "codex_desktop_validate", "label": "Codex Desktop Validate", "script": "scripts/validate-codex-desktop-compat.js", "args": []},
    {"id": "workflow_preflight", "label": "Workflow Preflight", "script": "scripts/workflow-preflight.js", "args": []},
    {"id": "workflow_order_gate", "label": "Workflow Order Gate", "script": "scripts/validate-workflow-pipeline-order.js", "args": ["--enforce"]},
    {"id": "wrapper_contract_validation", "label": "Wrapper Contract Validation", "script": "scripts/validate-wrapper-contracts.js", "args": []},
    {"id": "neutral_core_generate", "label": "Neutral Core Generate", "script": "scripts/generate-neutral-core-assets.js", "args": []},
    {"id": "script_equivalents_generate", "label": "Script Equivalents Generate", "script": "scripts/generate-script-polyglot-equivalents.js", "args": []},
    {"id": "repo_equivalents_generate", "label": "Repo Equivalents Generate", "script": "scripts/generate-repo-polyglot-equivalents.js", "args": []},
    {"id": "benchmark_cases_reset", "label": "Benchmark Cases Reset", "script": "scripts/reset-runtime-benchmark-cases.js", "args": []},
    {"id": "benchmark_reset_and_run", "label": "Benchmark Reset And Run", "script": "scripts/reset-and-benchmark-polyglot-runtime.js", "args": ["--languages", "javascript,python,cpp"]},
    {"id": "automations_optimize", "label": "Automations Optimize", "script": "scripts/optimize-codex-automations.js", "args": ["--apply"]},
    {"id": "efficiency_audit", "label": "Efficiency Audit", "script": "scripts/codex-efficiency-audit.js", "args": ["--enforce-skill-prompt-template"]},
    {"id": "efficiency_gate", "label": "Efficiency Gate", "script": "scripts/codex-efficiency-audit.js", "args": ["--enforce", "--enforce-skill-prompt-template"]},
    {"id": "optimization_backlog", "label": "Optimization Backlog", "script": "scripts/generate-runtime-optimization-backlog.js", "args": []},
    {"id": "standards_baseline_gate", "label": "Standards Baseline Gate", "script": "scripts/standards-baseline-gate.js", "args": ["--enforce"]},
    {"id": "iso_standards_gate", "label": "ISO Standards Gate", "script": "scripts/iso-standards-compliance-gate.js", "args": ["--enforce"]},
    {"id": "uiux_blueprint_check", "label": "UIUX Blueprint Check", "script": "scripts/generate-uiux-blueprint.js", "args": ["--check", "--enforce"]},
    {"id": "hard_governance_gate", "label": "Hard Governance Gate", "script": "scripts/hard-governance-gate.js", "args": ["--enforce"]},
    {"id": "docs_catalog", "label": "Docs Catalog", "script": "scripts/generate-file-catalog-docs.js", "args": []},
    {"id": "visuals_runtime", "label": "Runtime Visuals", "script": "scripts/generate-runtime-visuals.js", "args": []},
    {"id": "docs_generate", "label": "Docs Generate", "script": "scripts/generate-documentation-suite.js", "args": []},
    {"id": "docs_freshness_enforce", "label": "Docs Freshness Enforce", "script": "scripts/docs-freshness-check.js", "args": ["--enforce"]},
    {"id": "refactor_gate", "label": "Refactor Gate", "script": "scripts/refactor-blocking-gate.js", "args": []},
    {"id": "wrapper_bindings_check", "label": "Wrapper Bindings Check", "script": "scripts/generate-wrapper-polyglot-bindings.js", "args": ["--check"]},
    {"id": "neutral_core_validate", "label": "Neutral Core Validate", "script": "scripts/validate-neutral-core-contracts.js", "args": []},
    {"id": "script_swap_catalog_check", "label": "Script Swap Catalog Check", "script": "scripts/validate-script-swap-catalog.js", "args": []},
    {"id": "script_equivalents_check", "label": "Script Equivalents Check", "script": "scripts/generate-script-polyglot-equivalents.js", "args": ["--check"]},
    {"id": "repo_equivalents_check", "label": "Repo Equivalents Check", "script": "scripts/generate-repo-polyglot-equivalents.js", "args": ["--check"]},
]


def parse_args(argv: list[str]) -> dict[str, bool]:
    return {"strict": "--strict" in argv, "stop_on_failure": "--stop-on-failure" in argv}


def command_text(script: str, args: list[str]) -> str:
    return " ".join([sys.executable, script, *args])


def run_task(root: pathlib.Path, log_dir: pathlib.Path, task: dict[str, Any]) -> dict[str, Any]:
    started_at = datetime.now(UTC).isoformat().replace("+00:00", "Z")
    start_ms = __import__("time").time() * 1000.0
    result = run_python_equivalent_script(task["script"], list(task.get("args", [])), root=root)
    ended_at = datetime.now(UTC).isoformat().replace("+00:00", "Z")
    duration_ms = int(round((__import__("time").time() * 1000.0) - start_ms))
    status_code = int(result.returncode or 0)
    log_file = log_dir / f'{task["id"]}.log'
    log_body = "\n".join(
        [
            f'# {task["label"]}',
            f'command: {command_text(task["script"], list(task.get("args", [])))}',
            "mode: python_equivalent",
            f"started_at: {started_at}",
            f"ended_at: {ended_at}",
            f"duration_ms: {duration_ms}",
            f"status_code: {status_code}",
            "",
            "## stdout",
            str(result.stdout or ""),
            "",
            "## stderr",
            str(result.stderr or ""),
        ]
    )
    write_text_file_robust(log_file, log_body, atomic=False)
    return {
        "id": task["id"],
        "label": task["label"],
        "command": command_text(task["script"], list(task.get("args", []))),
        "started_at": started_at,
        "ended_at": ended_at,
        "duration_ms": duration_ms,
        "status": "pass" if status_code == 0 else "fail",
        "status_code": status_code,
        "log_file": normalize_path(log_file.relative_to(root)),
    }


def read_json_if_exists(file_path: pathlib.Path) -> Any:
    try:
        return json.loads(file_path.read_text(encoding="utf8"))
    except Exception:
        return None


def build_efficiency_summary(root: pathlib.Path) -> dict[str, Any] | None:
    report_path = root / DEFAULT_EFFICIENCY_REPORT
    payload = read_json_if_exists(report_path)
    if not isinstance(payload, dict):
        return None
    counts = payload.get("counts") if isinstance(payload.get("counts"), dict) else {}
    regressions = payload.get("regressions") if isinstance(payload.get("regressions"), dict) else {}
    issues = payload.get("issues") if isinstance(payload.get("issues"), list) else []
    return {
        "report_file": normalize_path(report_path.relative_to(root)),
        "total_tokens_estimate": int(counts.get("total_tokens_estimate") or 0),
        "total_tokens_delta": int(regressions.get("total_tokens_delta") or 0),
        "total_tokens_delta_percent": float(regressions.get("total_tokens_delta_percent") or 0),
        "issue_count": len(issues),
    }


def build_markdown(report: dict[str, Any]) -> str:
    rows = "\n".join(
        f'| {task["label"]} | {task["status"].upper()} | {task["status_code"]} | {task["duration_ms"]} | `{task["log_file"]}` |'
        for task in report["tasks"]
    )
    efficiency_summary = report.get("efficiency_summary")
    efficiency_lines = [
        f'- Total token estimate: {efficiency_summary["total_tokens_estimate"]}',
        f'- Token delta: {efficiency_summary["total_tokens_delta"]}',
        f'- Token delta %: {efficiency_summary["total_tokens_delta_percent"]}',
        f'- Issues: {efficiency_summary["issue_count"]}',
    ] if efficiency_summary else ["- No efficiency summary available"]
    return "\n".join(
        [
            "# Local Token Maintenance Status",
            "",
            "This report is generated entirely from local scripts to minimize manual/token-heavy maintenance work.",
            "",
            f'- Generated at: {report["generated_at"]}',
            f'- Overall status: **{report["status"].upper()}**',
            f'- Root: `{report["root"]}`',
            "",
            "## Run Command",
            "",
            "```bash",
            "npm run token:maintain",
            "```",
            "",
            "## Efficiency Summary",
            "",
            *efficiency_lines,
            "",
            "## Task Results",
            "",
            "| Task | Status | Exit | Duration (ms) | Log |",
            "| --- | --- | --- | ---: | --- |",
            rows,
            "",
            "## Report JSON",
            "",
            f'`{report["report_file"]}`',
            "",
        ]
    )


def run_local_token_maintenance(root: pathlib.Path, strict: bool, stop_on_failure: bool) -> dict[str, Any]:
    log_dir = root / DEFAULT_LOG_DIR
    report_path = root / DEFAULT_REPORT_FILE
    markdown_path = root / DEFAULT_MARKDOWN_FILE
    tasks = []
    for task in TASKS:
        result = run_task(root, log_dir, task)
        tasks.append(result)
        if stop_on_failure and result["status"] != "pass":
            break
    failed_count = len([task for task in tasks if task["status"] != "pass"])
    report = {
        "status": "pass" if failed_count == 0 else "fail",
        "generated_at": datetime.now(UTC).isoformat().replace("+00:00", "Z"),
        "root": ".",
        "report_file": normalize_path(report_path.relative_to(root)),
        "markdown_file": normalize_path(markdown_path.relative_to(root)),
        "strict": strict,
        "stop_on_failure": stop_on_failure,
        "metrics": {"task_count": len(tasks), "passed": len(tasks) - failed_count, "failed": failed_count},
        "efficiency_summary": build_efficiency_summary(root),
        "tasks": tasks,
    }
    write_text_file_robust(report_path, f"{json.dumps(report, indent=2)}\n", atomic=False)
    write_text_file_robust(markdown_path, f"{build_markdown(report)}\n", atomic=False)
    return report


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv or [])
    root = find_repo_root(pathlib.Path(__file__))
    report = run_local_token_maintenance(root, args["strict"], args["stop_on_failure"])
    sys.stdout.write(f"{json.dumps(report, indent=2)}\n")
    return 1 if args["strict"] and report["status"] != "pass" else 0


if __name__ == "__main__":
    try:
        raise SystemExit(main(sys.argv[1:]))
    except Exception as error:
        sys.stderr.write(f"run-local-token-maintenance failed: {error}\n")
        raise SystemExit(1)
