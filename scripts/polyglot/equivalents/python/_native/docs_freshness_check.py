#!/usr/bin/env python3
"""Native Python implementation for scripts/docs-freshness-check.js."""

from __future__ import annotations

import json
import pathlib
import subprocess
import sys

from _common import find_repo_root, normalize_path, write_text_file_robust

DEFAULT_REPORT_FILE = pathlib.PurePosixPath("data/output/databases/polyglot-default/analysis/docs_freshness_report.json")
REQUIRED_DOCS = [
    "docs/README.md",
    "docs/architecture/pipeline.md",
    "docs/governance/compliance.md",
    "docs/contracts/wrapper_contracts.md",
    "docs/runbooks/maintenance.md",
    "docs/changelog/decisions.md",
    "docs/reference/file_catalog.md",
    "docs/visuals/runtime_dashboard.md",
]
MONITORED_ROOTS = [
    ".github/",
    "app/",
    "brain/",
    "main/",
    "renderer/",
    "tests/",
    "scripts/",
    "to-do/",
    "data/input/",
    "data/output/",
]
SUBSYSTEM_RULES = [
    {
        "id": "workflow_governance",
        "description": "Workflow/governance contract changes require architecture + governance + decision docs updates.",
        "matchers": [
            r"^scripts/(general-workflow|workflow-preflight|hard-governance-gate|standards-baseline-gate|iso-standards-compliance-gate|validate-workflow-pipeline-order|refactor-blocking-gate|prune-workflow-artifacts)\.js$",
            r"^data/input/shared/main/(executive_engineering_baseline|hard_governance_ruleset|workflow_execution_pipeline|polyglot_engineering_standards_catalog|iso_standards_traceability_catalog|ui_ux_blueprint_catalog|ui_component_blueprint_catalog|rendering_runtime_policy_catalog|search_strategy_routing_catalog|memory_data_lifecycle_policy_catalog|ai_automation_safety_speech_catalog)\.json$",
        ],
        "required_docs": ["docs/architecture/pipeline.md", "docs/governance/compliance.md", "docs/changelog/decisions.md"],
    },
    {
        "id": "wrapper_contracts",
        "description": "Wrapper/runtime benchmark changes require contract docs updates.",
        "matchers": [
            r"^data/input/shared/wrapper/",
            r"^scripts/(polyglot-runtime-benchmark|validate-wrapper-contracts|generate-wrapper-polyglot-bindings)\.js$",
            r"^data/input/shared/wrapper/function_contracts\.json$",
        ],
        "required_docs": ["docs/contracts/wrapper_contracts.md", "docs/changelog/decisions.md"],
    },
    {
        "id": "automation_ops",
        "description": "Automation/workflow-ci changes require runbook updates.",
        "matchers": [
            r"^\.github/workflows/",
            r"^scripts/(optimize-codex-automations|sync-agent-skill-scope|codex-desktop-sync)\.js$",
            r"^to-do/skills/(agent_workflows|repeat_action_routing)\.json$",
        ],
        "required_docs": ["docs/runbooks/maintenance.md", "docs/changelog/decisions.md"],
    },
    {
        "id": "runtime_visuals",
        "description": "Benchmark/runtime report changes require visual dashboard refresh.",
        "matchers": [
            r"^scripts/(polyglot-runtime-benchmark|generate-runtime-visuals|generate-documentation-suite)\.js$",
            r"^data/output/databases/polyglot-default/(analysis/script_runtime_swap_report|reports/polyglot_runtime_benchmark_report)\.json$",
            r"^docs/visuals/assets/.*\.svg$",
        ],
        "required_docs": ["docs/visuals/runtime_dashboard.md", "docs/changelog/decisions.md"],
    },
    {
        "id": "repository_file_catalog",
        "description": "Project file changes require repository file catalog refresh.",
        "matchers": [
            r"^\.github/",
            r"^app/",
            r"^brain/",
            r"^data/input/",
            r"^data/output/",
            r"^main/",
            r"^renderer/",
            r"^scripts/",
            r"^tests/",
            r"^to-do/",
        ],
        "required_docs": ["docs/reference/file_catalog.md"],
    },
]


def parse_args(argv: list[str]) -> dict:
    args = {
        "base_ref": "",
        "head_ref": "HEAD",
        "report_file": str(DEFAULT_REPORT_FILE),
        "enforce": "--enforce" in argv or "--check" in argv,
    }
    index = 0
    while index < len(argv):
        token = str(argv[index] or "")
        if token == "--base-ref" and index + 1 < len(argv):
            args["base_ref"] = str(argv[index + 1] or "").strip()
            index += 2
            continue
        if token == "--head-ref" and index + 1 < len(argv):
            args["head_ref"] = str(argv[index + 1] or "").strip()
            index += 2
            continue
        if token == "--report-file" and index + 1 < len(argv):
            args["report_file"] = str(argv[index + 1] or "").strip()
            index += 2
            continue
        index += 1
    return args


def git(root: pathlib.Path, args: list[str]) -> subprocess.CompletedProcess[str]:
    return subprocess.run(["git", *args], cwd=str(root), capture_output=True, text=True)


def read_changed_files(root: pathlib.Path, base_ref: str, head_ref: str) -> dict:
    args = ["diff", "--name-only", f"{base_ref}...{head_ref or 'HEAD'}"] if base_ref else ["diff", "--name-only", "HEAD"]
    result = git(root, args)
    if result.returncode != 0:
        return {"ok": False, "error": str(result.stderr or result.stdout or "git diff failed").strip(), "files": []}
    files = [normalize_path(line).strip() for line in str(result.stdout or "").splitlines() if normalize_path(line).strip()]
    untracked = git(root, ["ls-files", "--others", "--exclude-standard"])
    if untracked.returncode == 0:
        files.extend(normalize_path(line).strip() for line in str(untracked.stdout or "").splitlines() if normalize_path(line).strip())
    return {"ok": True, "files": sorted(set(files))}


def rule_matched(rule: dict, file_path: str) -> bool:
    import re
    return any(re.search(pattern, file_path) for pattern in rule.get("matchers", []))


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv or [])
    root = find_repo_root(pathlib.Path(__file__))
    base_ref = args["base_ref"] or (f"origin/{str(__import__('os').environ.get('GITHUB_BASE_REF', '')).strip()}" if str(__import__('os').environ.get("GITHUB_BASE_REF", "")).strip() else "")
    changed = read_changed_files(root, base_ref, args["head_ref"] or "HEAD")
    report = {
        "status": "pass",
        "generated_at": __import__("datetime").datetime.utcnow().isoformat() + "Z",
        "root": normalize_path(root),
        "base_ref": base_ref or "HEAD",
        "head_ref": args["head_ref"] or "HEAD",
        "report_file": normalize_path((root / pathlib.PurePosixPath(args["report_file"])).resolve()),
        "required_docs": list(REQUIRED_DOCS),
        "changed_files": changed.get("files", []),
        "issues": [],
    }

    if not changed.get("ok"):
        report["status"] = "fail"
        report["issues"].append({"level": "error", "type": "git_diff_failed", "detail": changed.get("error", "")})

    for doc_path in REQUIRED_DOCS:
        absolute = root / pathlib.PurePosixPath(doc_path)
        if not absolute.exists():
            report["status"] = "fail"
            report["issues"].append({"level": "error", "type": "missing_required_doc", "detail": "required documentation file is missing", "file": doc_path})

    if changed.get("ok"):
        docs_changed = {file_path for file_path in changed.get("files", []) if file_path.startswith("docs/")}
        monitored_changes = [file_path for file_path in changed.get("files", []) if any(file_path.startswith(prefix) for prefix in MONITORED_ROOTS)]
        if monitored_changes and not docs_changed:
            report["status"] = "fail"
            report["issues"].append({"level": "error", "type": "docs_not_updated", "detail": "subsystem changes detected without documentation updates", "changed_roots": sorted({file_path.split("/")[0] for file_path in monitored_changes})})

        for rule in SUBSYSTEM_RULES:
            touched = [file_path for file_path in changed.get("files", []) if rule_matched(rule, file_path)]
            if not touched:
                continue
            missing_docs = [doc_path for doc_path in rule.get("required_docs", []) if doc_path not in docs_changed]
            if missing_docs:
                report["status"] = "fail"
                report["issues"].append(
                    {
                        "level": "error",
                        "type": "subsystem_docs_stale",
                        "detail": rule.get("description", ""),
                        "rule_id": rule.get("id", ""),
                        "missing_docs": missing_docs,
                        "touched_files": touched[:40],
                    }
                )

    report_path = root / pathlib.PurePosixPath(args["report_file"])
    write_text_file_robust(report_path, f"{json.dumps(report, indent=2)}\n", atomic=False)
    sys.stdout.write(f"{json.dumps(report, indent=2)}\n")
    return 1 if args["enforce"] and report["status"] != "pass" else 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
