#!/usr/bin/env python3
"""Native Python implementation for scripts/run-local-governance.js."""

from __future__ import annotations

import json
import pathlib
import sys

from _common import find_repo_root, normalize_path, run_python_equivalent_script, write_text_file_robust

DEFAULT_LOG_DIR = pathlib.PurePosixPath("data/output/databases/polyglot-default/reports/local-governance/logs")
DEFAULT_REPORT_FILE = pathlib.PurePosixPath("data/output/databases/polyglot-default/reports/local-governance/local_governance_report.json")
DEFAULT_MARKDOWN_FILE = pathlib.PurePosixPath("docs/visuals/local_governance_status.md")

TASKS = [
    {"id": "workflow_preflight", "label": "Workflow Preflight", "script": "scripts/workflow-preflight.js", "args": []},
    {"id": "workflow_order_gate", "label": "Workflow Order Gate", "script": "scripts/validate-workflow-pipeline-order.js", "args": ["--enforce"]},
    {"id": "wrapper_contract_validation", "label": "Wrapper Contract Validation", "script": "scripts/validate-wrapper-contracts.js", "args": []},
    {"id": "neutral_core_generate", "label": "Neutral Core Generate", "script": "scripts/generate-neutral-core-assets.js", "args": []},
    {"id": "standards_baseline_gate", "label": "Standards Baseline Gate", "script": "scripts/standards-baseline-gate.js", "args": ["--enforce"]},
    {"id": "iso_standards_gate", "label": "ISO Standards Gate", "script": "scripts/iso-standards-compliance-gate.js", "args": ["--enforce"]},
    {"id": "uiux_blueprint_check", "label": "UIUX Blueprint Check", "script": "scripts/generate-uiux-blueprint.js", "args": ["--check", "--enforce"]},
    {"id": "hard_governance_gate", "label": "Hard Governance Gate", "script": "scripts/hard-governance-gate.js", "args": ["--enforce"]},
    {"id": "efficiency_gate", "label": "Efficiency Gate", "script": "scripts/codex-efficiency-audit.js", "args": ["--enforce"]},
    {"id": "docs_generate", "label": "Docs Generate", "script": "scripts/generate-documentation-suite.js", "args": []},
    {"id": "docs_freshness_enforce", "label": "Docs Freshness Enforce", "script": "scripts/docs-freshness-check.js", "args": ["--enforce"]},
    {"id": "refactor_gate", "label": "Refactor Gate", "script": "scripts/refactor-blocking-gate.js", "args": []},
    {"id": "wrapper_bindings_check", "label": "Wrapper Bindings Check", "script": "scripts/generate-wrapper-polyglot-bindings.js", "args": ["--check"]},
    {"id": "neutral_core_validate", "label": "Neutral Core Validate", "script": "scripts/validate-neutral-core-contracts.js", "args": []},
    {"id": "script_swap_catalog_check", "label": "Script Swap Catalog Check", "script": "scripts/validate-script-swap-catalog.js", "args": []},
    {"id": "script_equivalents_check", "label": "Script Equivalents Check", "script": "scripts/generate-script-polyglot-equivalents.js", "args": ["--check"]},
]


def parse_args(argv: list[str]) -> dict:
    return {
        "strict": "--strict" in argv,
        "stop_on_failure": "--stop-on-failure" in argv,
    }


def command_text(script: str, args: list[str]) -> str:
    return " ".join([sys.executable, script, *args])


def run_task(root: pathlib.Path, log_dir: pathlib.Path, task: dict) -> dict:
    started_at = __import__("datetime").datetime.utcnow().isoformat() + "Z"
    start_ms = __import__("time").time() * 1000.0
    result = run_python_equivalent_script(task["script"], list(task.get("args", [])), root=root)
    ended_at = __import__("datetime").datetime.utcnow().isoformat() + "Z"
    duration_ms = int(round((__import__("time").time() * 1000.0) - start_ms))
    status_code = int(result.returncode or 0)
    passed = status_code == 0
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
        "status": "pass" if passed else "fail",
        "status_code": status_code,
        "log_file": normalize_path(log_file.relative_to(root)),
    }


def build_markdown(report: dict) -> str:
    rows = "\n".join(
        [
            f'| {task["label"]} | {task["status"].upper()} | {task["status_code"]} | {task["duration_ms"]} | `{task["log_file"]}` |'
            for task in report["tasks"]
        ]
    )
    return "\n".join(
        [
            "# Local Governance Status",
            "",
            "This status is produced by local checks and does not require GitHub Actions billing.",
            "",
            f'- Generated at: {report["generated_at"]}',
            f'- Overall status: **{report["status"].upper()}**',
            f'- Root: `{report["root"]}`',
            "",
            "## Run Command",
            "",
            "```bash",
            "npm run local:governance",
            "```",
            "",
            "## Task Results",
            "",
            "Log paths below are local-only artifacts (gitignored) generated on each run.",
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


def run_local_governance(root: pathlib.Path, strict: bool, stop_on_failure: bool) -> dict:
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
        "generated_at": __import__("datetime").datetime.utcnow().isoformat() + "Z",
        "root": ".",
        "report_file": normalize_path(report_path.relative_to(root)),
        "markdown_file": normalize_path(markdown_path.relative_to(root)),
        "strict": strict,
        "stop_on_failure": stop_on_failure,
        "metrics": {
            "task_count": len(tasks),
            "passed": len(tasks) - failed_count,
            "failed": failed_count,
        },
        "tasks": tasks,
    }
    write_text_file_robust(report_path, f"{json.dumps(report, indent=2)}\n", atomic=False)
    write_text_file_robust(markdown_path, f"{build_markdown(report)}\n", atomic=False)
    return report


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv or [])
    root = find_repo_root(pathlib.Path(__file__))
    report = run_local_governance(root, args["strict"], args["stop_on_failure"])
    sys.stdout.write(f"{json.dumps(report, indent=2)}\n")
    return 1 if args["strict"] and report["status"] != "pass" else 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
