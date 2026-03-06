#!/usr/bin/env python3
"""Native Python implementation for scripts/workflow-preflight.js."""

from __future__ import annotations

import json
import os
import pathlib
import subprocess
import sys
import time
from datetime import UTC, datetime
from typing import Any

from _common import find_repo_root, normalize_path, run_python_equivalent_script, write_text_file_robust
from lib.routing_policy import read_routing_policy

DEFAULT_REPORT_FILE = pathlib.PurePosixPath(
    "data/output/databases/polyglot-default/analysis/workflow_preflight_report.json"
)
DEFAULT_SCOPE = "workflow-preflight"

REQUIRED_FILES = [
    "RULES",
    "package.json",
    "scripts/general-workflow.js",
    "scripts/polyglot-default-pipeline.js",
    "scripts/validate-agent-registry.js",
    "scripts/build-agent-workflow-shards.js",
    "scripts/prune-workflow-artifacts.js",
    "scripts/hard-governance-gate.js",
    "scripts/standards-baseline-gate.js",
    "scripts/iso-standards-compliance-gate.js",
    "scripts/generate-uiux-blueprint.js",
    "scripts/validate-workflow-pipeline-order.js",
    "scripts/polyglot-runtime-benchmark.js",
    "scripts/generate-wrapper-polyglot-bindings.js",
    "scripts/generate-script-polyglot-equivalents.js",
    "scripts/lib/polyglot-script-swap-runner.js",
    "scripts/polyglot/swaps/python/node_script_bridge.py",
    "scripts/polyglot/swaps/cpp/cpp_node_bridge.js",
    "scripts/polyglot/swaps/cpp/node_script_bridge.cpp",
    "scripts/validate-script-swap-catalog.js",
    "scripts/codex-efficiency-audit.js",
    "scripts/generate-runtime-optimization-backlog.js",
    "scripts/optimize-codex-automations.js",
    "to-do/skills/agent_workflows.json",
    "to-do/agents/agent_workflow_shards/index.json",
    "to-do/agents/agent_access_control.json",
    "data/input/shared/main/polyglot_default_catalog.json",
    "data/input/shared/main/polyglot_contract_catalog.json",
    "data/input/shared/main/polyglot_script_swap_catalog.json",
    "data/input/shared/main/hard_governance_ruleset.json",
    "data/input/shared/main/executive_engineering_baseline.json",
    "data/input/shared/main/polyglot_engineering_standards_catalog.json",
    "data/input/shared/main/iso_standards_traceability_catalog.json",
    "data/input/shared/main/ui_ux_blueprint_catalog.json",
    "data/input/shared/main/ui_component_blueprint_catalog.json",
    "data/input/shared/main/rendering_runtime_policy_catalog.json",
    "data/input/shared/main/search_strategy_routing_catalog.json",
    "data/input/shared/main/memory_data_lifecycle_policy_catalog.json",
    "data/input/shared/main/ai_automation_safety_speech_catalog.json",
    "data/input/shared/main/workflow_execution_pipeline.json",
    "data/input/shared/wrapper/function_contracts.json",
    "data/input/shared/wrapper/unified_wrapper_specs.json",
    "data/input/shared/wrapper/wrapper_symbol_registry.json",
    "data/input/shared/wrapper/runtime_benchmark_cases.json",
]

REQUIRED_JSON_FILES = [
    "package.json",
    "to-do/skills/agent_workflows.json",
    "to-do/agents/agent_workflow_shards/index.json",
    "to-do/agents/agent_access_control.json",
    "data/input/shared/main/polyglot_default_catalog.json",
    "data/input/shared/main/polyglot_contract_catalog.json",
    "data/input/shared/main/polyglot_script_swap_catalog.json",
    "data/input/shared/main/hard_governance_ruleset.json",
    "data/input/shared/main/executive_engineering_baseline.json",
    "data/input/shared/main/polyglot_engineering_standards_catalog.json",
    "data/input/shared/main/iso_standards_traceability_catalog.json",
    "data/input/shared/main/ui_ux_blueprint_catalog.json",
    "data/input/shared/main/ui_component_blueprint_catalog.json",
    "data/input/shared/main/rendering_runtime_policy_catalog.json",
    "data/input/shared/main/search_strategy_routing_catalog.json",
    "data/input/shared/main/memory_data_lifecycle_policy_catalog.json",
    "data/input/shared/main/ai_automation_safety_speech_catalog.json",
    "data/input/shared/main/workflow_execution_pipeline.json",
    "data/input/shared/wrapper/function_contracts.json",
    "data/input/shared/wrapper/unified_wrapper_specs.json",
    "data/input/shared/wrapper/wrapper_symbol_registry.json",
    "data/input/shared/wrapper/runtime_benchmark_cases.json",
]

SCAN_ROOTS = [
    "scripts",
    "to-do/skills",
    "to-do/agents",
    "data/input/shared/main",
    "data/input/shared/wrapper",
    "RULES",
    "README.md",
]

TEXT_FILE_EXTENSIONS = {".js", ".json", ".md", ".yaml", ".yml", ".sh", ".ts"}
MERGE_STATUS_CODES = {"UU", "AA", "DD", "AU", "UA", "DU", "UD"}


def parse_args(argv: list[str]) -> dict[str, Any]:
    args = {
        "strict": "--no-strict" not in argv,
        "scope": DEFAULT_SCOPE,
        "report_file": DEFAULT_REPORT_FILE,
        "write_report": "--no-report" not in argv,
        "script_runtime": "",
        "script_runtime_order": [],
        "script_runtime_strict": False,
        "script_runtime_auto_best": True,
        "disable_script_swaps": False,
    }

    index = 0
    while index < len(argv):
        token = str(argv[index] or "")
        if token == "--scope" and index + 1 < len(argv):
            args["scope"] = str(argv[index + 1] or "").strip() or DEFAULT_SCOPE
            index += 2
            continue
        if token == "--report-file" and index + 1 < len(argv):
            args["report_file"] = pathlib.Path(str(argv[index + 1] or "").strip()).resolve()
            index += 2
            continue
        if token == "--script-runtime" and index + 1 < len(argv):
            args["script_runtime"] = str(argv[index + 1] or "").strip().lower()
            index += 2
            continue
        if token == "--script-runtime-order" and index + 1 < len(argv):
            args["script_runtime_order"] = [
                str(entry or "").strip().lower()
                for entry in str(argv[index + 1] or "").split(",")
                if str(entry or "").strip()
            ]
            index += 2
            continue
        if token == "--disable-script-swaps":
            args["disable_script_swaps"] = True
            index += 1
            continue
        if token == "--script-runtime-auto-best":
            args["script_runtime_auto_best"] = True
            index += 1
            continue
        if token == "--script-runtime-strict":
            args["script_runtime_strict"] = True
            index += 1
            continue
        index += 1

    if args["script_runtime"] and args["script_runtime"] not in {"javascript", "python", "cpp"}:
        raise RuntimeError("--script-runtime must be one of: javascript, python, cpp")
    return args


def list_text_files(root: pathlib.Path, scan_roots: list[str]) -> list[pathlib.Path]:
    queue = [(root / pathlib.PurePosixPath(entry.replace("\\", "/"))).resolve() for entry in scan_roots]
    queue = [entry for entry in queue if entry.exists()]
    files: list[pathlib.Path] = []

    while queue:
        current = queue.pop(0)
        if current.is_dir():
            for child in current.iterdir():
                if child.is_dir():
                    queue.append(child)
                    continue
                if child.suffix.lower() in TEXT_FILE_EXTENSIONS:
                    files.append(child)
                    continue
                if child.name == "RULES":
                    files.append(child)
            continue
        if current.suffix.lower() in TEXT_FILE_EXTENSIONS or current.name == "RULES":
            files.append(current)
    return files


def scan_conflict_markers(root: pathlib.Path, files: list[pathlib.Path]) -> list[dict[str, Any]]:
    hits: list[dict[str, Any]] = []
    for file_path in files:
        lines = file_path.read_text(encoding="utf8").splitlines()
        for index, line in enumerate(lines, start=1):
            if not (
                line.startswith("<<<<<<< ")
                or line.startswith("=======")
                or line.startswith(">>>>>>> ")
            ):
                continue
            hits.append(
                {
                    "file": normalize_path(file_path.relative_to(root)),
                    "line": index,
                    "marker": line[:16],
                }
            )
            if len(hits) >= 500:
                return hits
    return hits


def collect_unmerged_files(root: pathlib.Path) -> dict[str, Any]:
    try:
        result = subprocess.run(
            ["git", "status", "--porcelain=v1"],
            cwd=str(root),
            capture_output=True,
            text=True,
            shell=False,
        )
    except Exception as error:
        return {
            "command_status": -1,
            "skipped": True,
            "parse_error": str(error),
            "files": [],
        }

    if int(result.returncode or 0) != 0:
        return {
            "command_status": int(result.returncode or 1),
            "parse_error": str(result.stderr or result.stdout or "git status failed").strip(),
            "files": [],
        }

    files = []
    for line in str(result.stdout or "").splitlines():
        candidate = line.rstrip()
        if not candidate:
            continue
        if candidate[:2] not in MERGE_STATUS_CODES:
            continue
        rel = candidate[3:].strip()
        if rel:
            files.append(rel)
    return {"command_status": 0, "files": files}


def check_required_files(root: pathlib.Path) -> dict[str, Any]:
    missing = [
        entry
        for entry in REQUIRED_FILES
        if not (root / pathlib.PurePosixPath(entry.replace("\\", "/"))).exists()
    ]
    return {"ok": len(missing) == 0, "missing": missing}


def check_required_json(root: pathlib.Path) -> dict[str, Any]:
    invalid: list[dict[str, Any]] = []
    for entry in REQUIRED_JSON_FILES:
        file_path = (root / pathlib.PurePosixPath(entry.replace("\\", "/"))).resolve()
        if not file_path.exists():
            invalid.append({"file": entry, "error": "missing file"})
            continue
        try:
            json.loads(file_path.read_text(encoding="utf8"))
        except Exception as error:
            invalid.append({"file": entry, "error": str(error)})
    return {"ok": len(invalid) == 0, "invalid": invalid}


def check_shell_shebang_line_endings(root: pathlib.Path, files: list[pathlib.Path]) -> dict[str, Any]:
    invalid: list[str] = []
    for file_path in files:
        if file_path.suffix.lower() != ".sh":
            continue
        first_line = (file_path.read_text(encoding="utf8").split("\n")[0] if file_path.exists() else "")
        if first_line.startswith("#!") and "\r" in first_line:
            invalid.append(normalize_path(file_path.relative_to(root)))
    return {"ok": len(invalid) == 0, "invalid": invalid}


def check_routing_keyword_conflicts(root: pathlib.Path) -> dict[str, Any]:
    routing_path = root / "to-do" / "skills" / "repeat_action_routing.json"
    if not routing_path.exists():
        return {
            "ok": False,
            "error": "missing to-do/skills/repeat_action_routing.json",
            "conflicts": [],
        }

    routing = read_routing_policy(root).get("doc") or {}
    keyword_rules = routing.get("keyword_rules") if isinstance(routing, dict) else []
    keyword_map: dict[str, dict[str, Any]] = {}
    conflicts: list[dict[str, Any]] = []

    for rule_index, rule in enumerate(keyword_rules if isinstance(keyword_rules, list) else []):
        skills = sorted(rule.get("skills") if isinstance(rule, dict) and isinstance(rule.get("skills"), list) else [])
        skills_signature = "|".join(str(entry) for entry in skills)
        keywords = rule.get("keywords") if isinstance(rule, dict) and isinstance(rule.get("keywords"), list) else []
        for keyword in keywords:
            normalized = str(keyword or "").strip().lower()
            if not normalized:
                continue
            existing = keyword_map.get(normalized)
            if existing is None:
                keyword_map[normalized] = {
                    "skills_signature": skills_signature,
                    "rule_index": rule_index,
                }
                continue
            if existing["skills_signature"] != skills_signature:
                conflicts.append(
                    {
                        "keyword": normalized,
                        "first_rule_index": existing["rule_index"],
                        "second_rule_index": rule_index,
                    }
                )
    return {"ok": len(conflicts) == 0, "conflicts": conflicts}


def run_stage_check(
    root: pathlib.Path,
    args: dict[str, Any],
    stage_id: str,
    script_relative: str,
    script_args: list[str],
) -> dict[str, Any]:
    actual_language = "javascript" if args.get("disable_script_swaps") or args.get("script_runtime") == "javascript" else "python"
    start_ms = time.time() * 1000.0

    if actual_language == "javascript":
        node_exec = os.environ.get("AIO_NODE_EXEC", "node")
        script_path = (root / pathlib.PurePosixPath(script_relative.replace("\\", "/"))).resolve()
        env = dict(os.environ)
        env["AIO_PYTHON_EXEC"] = env.get("AIO_PYTHON_EXEC", sys.executable)
        completed = subprocess.run(
            [node_exec, str(script_path), *script_args],
            cwd=str(root),
            env=env,
            capture_output=True,
            text=True,
            shell=False,
        )
        command = " ".join([node_exec, str(script_path), *script_args])
    else:
        completed = run_python_equivalent_script(script_relative, script_args, root=root)
        equivalent_file = root / "scripts" / "polyglot" / "equivalents" / "python" / pathlib.PurePosixPath(
            script_relative.replace("\\", "/").replace("scripts/", "").replace(".js", "").replace("-", "_") + ".py"
        )
        command = " ".join([sys.executable, str(equivalent_file), *script_args])

    duration_ms = int(round((time.time() * 1000.0) - start_ms))
    status_code = int(completed.returncode or 0)
    stdout = str(completed.stdout or "")
    payload: dict[str, Any]
    try:
        payload = json.loads(stdout.strip() or "{}")
    except Exception:
        payload = {
            "output_tail": stdout[-1000:],
        }

    runtime_order = list(args.get("script_runtime_order") or [])
    if not runtime_order:
        runtime_order = [actual_language] if actual_language == "javascript" else ["python", "javascript", "cpp"]

    return {
        "ok": status_code == 0,
        "status_code": status_code,
        "report": payload,
        "runtime": {
            "stage_id": stage_id,
            "script_file": script_relative,
            "selected_language": actual_language,
            "swapped": actual_language != "javascript",
            "strict_runtime": bool(args.get("script_runtime_strict")),
            "selection": {
                "resolved_order": runtime_order,
                "preferred_language_input": str(args.get("script_runtime") or ""),
                "preferred_language_env": str(os.environ.get("AIO_SCRIPT_RUNTIME_LANGUAGE") or ""),
                "preferred_language_stage": actual_language,
                "auto_select_enabled": bool(args.get("script_runtime_auto_best")),
                "auto_best_language": actual_language if args.get("script_runtime_auto_best") else "",
                "auto_best_source": "native_workflow_preflight",
            },
            "duration_ms": duration_ms,
            "attempt_count": 1,
            "fallback_used": False,
            "attempts": [
                {
                    "language": actual_language,
                    "command": command,
                    "statusCode": status_code,
                    "duration_ms": duration_ms,
                    "skipped": False,
                }
            ],
        },
    }


def build_report(root: pathlib.Path, args: dict[str, Any]) -> dict[str, Any]:
    text_files = list_text_files(root, SCAN_ROOTS)
    conflict_marker_hits = scan_conflict_markers(root, text_files)
    unmerged_files = collect_unmerged_files(root)
    required_files = check_required_files(root)
    required_json = check_required_json(root)
    shell_line_endings = check_shell_shebang_line_endings(root, text_files)
    routing_keyword_conflicts = check_routing_keyword_conflicts(root)
    workflow_shards = run_stage_check(root, args, "build_agent_workflow_shards", "scripts/build-agent-workflow-shards.js", ["--check"])
    workflow_order_gate = run_stage_check(root, args, "validate_workflow_pipeline_order", "scripts/validate-workflow-pipeline-order.js", ["--check", "--enforce"])
    hard_governance = run_stage_check(root, args, "hard_governance_gate", "scripts/hard-governance-gate.js", ["--check", "--enforce"])
    script_swap_catalog = run_stage_check(root, args, "validate_script_swap_catalog", "scripts/validate-script-swap-catalog.js", [])

    checks = {
        "unmerged_files": {
            "ok": len(unmerged_files.get("files") or []) == 0,
            "files": unmerged_files.get("files") or [],
            "command_status": unmerged_files.get("command_status"),
        },
        "merge_markers": {
            "ok": len(conflict_marker_hits) == 0,
            "hit_count": len(conflict_marker_hits),
            "hits": conflict_marker_hits[:80],
        },
        "required_files": required_files,
        "required_json": required_json,
        "shell_shebang_line_endings": shell_line_endings,
        "routing_keyword_conflicts": routing_keyword_conflicts,
        "workflow_shards": workflow_shards,
        "workflow_order_gate": workflow_order_gate,
        "hard_governance_gate": hard_governance,
        "script_swap_catalog": script_swap_catalog,
    }

    ok = (
        checks["unmerged_files"]["ok"]
        and checks["merge_markers"]["ok"]
        and checks["required_files"]["ok"]
        and checks["required_json"]["ok"]
        and checks["shell_shebang_line_endings"]["ok"]
        and checks["routing_keyword_conflicts"]["ok"]
        and checks["workflow_shards"]["ok"]
        and checks["workflow_order_gate"]["ok"]
        and checks["hard_governance_gate"]["ok"]
        and checks["script_swap_catalog"]["ok"]
    )

    report_file = pathlib.Path(args.get("report_file") or DEFAULT_REPORT_FILE)
    return {
        "ok": ok,
        "scope": args.get("scope"),
        "generated_at": datetime.now(UTC).isoformat().replace("+00:00", "Z"),
        "root": str(root),
        "runtime_controls": {
            "preferred_language": args.get("script_runtime"),
            "runtime_order": args.get("script_runtime_order"),
            "auto_select_best": args.get("script_runtime_auto_best"),
            "strict_runtime": args.get("script_runtime_strict"),
            "disable_swaps": args.get("disable_script_swaps"),
        },
        "checks": checks,
        "report_file": normalize_path(os.path.relpath(report_file, root)),
    }


def main(argv: list[str] | None = None) -> int:
    args = parse_args(list(argv or []))
    root = find_repo_root(pathlib.Path(__file__))
    report = build_report(root, args)
    report_file = pathlib.Path(args.get("report_file") or (root / DEFAULT_REPORT_FILE))
    if not report_file.is_absolute():
        report_file = (root / report_file).resolve()
    if args.get("write_report"):
        write_text_file_robust(report_file, f"{json.dumps(report, indent=2)}\n", atomic=False)
    sys.stdout.write(f"{json.dumps(report, indent=2)}\n")
    return 1 if args.get("strict") and not report.get("ok") else 0


if __name__ == "__main__":
    try:
        raise SystemExit(main(sys.argv[1:]))
    except SystemExit:
        raise
    except Exception as error:
        sys.stderr.write(f"workflow-preflight failed: {error}\n")
        raise SystemExit(1)
