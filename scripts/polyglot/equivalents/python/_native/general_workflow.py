#!/usr/bin/env python3
"""Native Python implementation for scripts/general-workflow.js."""

from __future__ import annotations

import json
import os
import pathlib
import subprocess
import sys
from datetime import UTC, datetime
from typing import Any

from _common import find_repo_root, normalize_path, write_text_file_robust
from lib.polyglot_script_swap_runner import parse_language_order_csv, run_script_with_swaps, to_language_id

ROOT = find_repo_root(pathlib.Path(__file__))
CONTEXT_FILE = ROOT / "data" / "output" / "databases" / "polyglot-default" / "context" / "run_state.json"
DEFAULT_SCRIPT_RUNTIME_REPORT_FILE = (
    ROOT / "data" / "output" / "databases" / "polyglot-default" / "analysis" / "script_runtime_swap_report.json"
)
DEFAULT_SCRIPT_RUNTIME_REPORT_RELATIVE = normalize_path(os.path.relpath(DEFAULT_SCRIPT_RUNTIME_REPORT_FILE, ROOT))
DEFAULT_RUNTIME_BACKLOG_JSON_FILE = (
    ROOT / "data" / "output" / "databases" / "polyglot-default" / "plan" / "runtime_optimization_backlog.json"
)
DEFAULT_RUNTIME_BACKLOG_MD_FILE = (
    ROOT / "data" / "output" / "databases" / "polyglot-default" / "plan" / "runtime_optimization_backlog.md"
)


def print_help_and_exit(code: int) -> None:
    help_text = "\n".join(
        [
            "general-workflow",
            "",
            "Usage:",
            "  npm run workflow:general -- [options]",
            "  npm run workflow:continue -- [options]",
            "",
            "Options:",
            "  --mode <auto|create|maintain>   Run mode (default: auto)",
            '  --brief "text"                  Project brief',
            "  --brief-file <path>             Project brief file path",
            "  --project <name>                Project name",
            "  --scope <summary>               Scope summary",
            '  --planned-update "text"        Planned update item (repeatable)',
            "  --enforce-data-separation       Fail when separation audit reports remaining candidates",
            "  --skip-prune                    Skip workflow artifact prune step",
            "  --skip-hard-governance          Skip hard governance gate stage",
            "  --skip-preflight                Skip workflow preflight checks",
            "  --skip-output-format            Skip prettier formatting for generated output artifacts",
            "  --script-runtime <language>     Preferred script runtime language (javascript|python|cpp)",
            "  --script-runtime-order <csv>    Runtime fallback order for script stages (for example: cpp,python,javascript)",
            "  --script-runtime-auto-best      Auto-select stage runtime from benchmark winner evidence (default on)",
            "  --script-runtime-strict         Enforce selected runtime with no fallback retries",
            "  --disable-script-swaps          Force javascript runtime only for script stages",
            "  --script-runtime-report-file    Custom output path for script runtime telemetry report",
            "  --runtime-backlog-json-file     Custom output path for runtime optimization backlog JSON",
            "  --runtime-backlog-md-file       Custom output path for runtime optimization backlog markdown",
            "  --skip-runtime-backlog          Skip runtime optimization backlog generation stage",
            "  --fast                          Skip checks and benchmarks for quick iteration",
            "  --help                          Show help",
        ]
    )
    sys.stdout.write(f"{help_text}\n")
    raise SystemExit(code)


def resolve_path(value: Any) -> pathlib.Path:
    candidate = pathlib.Path(str(value or ""))
    return candidate if candidate.is_absolute() else (pathlib.Path.cwd() / candidate).resolve()


def parse_args(argv: list[str]) -> dict[str, Any]:
    args: dict[str, Any] = {
        "mode": "auto",
        "brief": "",
        "brief_file": None,
        "project": "",
        "scope": "",
        "planned_updates": [],
        "enforce_data_separation": False,
        "skip_prune": False,
        "skip_hard_governance": False,
        "skip_preflight": False,
        "skip_output_format": False,
        "script_runtime": "",
        "script_runtime_order": [],
        "script_runtime_auto_best": True,
        "script_runtime_strict": False,
        "disable_script_swaps": False,
        "script_runtime_report_file": DEFAULT_SCRIPT_RUNTIME_REPORT_FILE,
        "runtime_backlog_json_file": DEFAULT_RUNTIME_BACKLOG_JSON_FILE,
        "runtime_backlog_md_file": DEFAULT_RUNTIME_BACKLOG_MD_FILE,
        "skip_runtime_backlog": False,
        "fast": False,
    }
    index = 0
    while index < len(argv):
        token = str(argv[index] or "")
        if token == "--mode" and index + 1 < len(argv):
            args["mode"] = str(argv[index + 1] or "").strip().lower()
            index += 2
            continue
        if token == "--brief" and index + 1 < len(argv):
            args["brief"] = str(argv[index + 1] or "")
            index += 2
            continue
        if token == "--brief-file" and index + 1 < len(argv):
            args["brief_file"] = resolve_path(argv[index + 1])
            index += 2
            continue
        if token == "--project" and index + 1 < len(argv):
            args["project"] = str(argv[index + 1] or "")
            index += 2
            continue
        if token == "--scope" and index + 1 < len(argv):
            args["scope"] = str(argv[index + 1] or "")
            index += 2
            continue
        if token == "--planned-update" and index + 1 < len(argv):
            value = str(argv[index + 1] or "").strip()
            if value:
                args["planned_updates"].append(value)
            index += 2
            continue
        if token == "--enforce-data-separation":
            args["enforce_data_separation"] = True
            index += 1
            continue
        if token == "--skip-prune":
            args["skip_prune"] = True
            index += 1
            continue
        if token == "--skip-hard-governance":
            args["skip_hard_governance"] = True
            index += 1
            continue
        if token == "--skip-preflight":
            args["skip_preflight"] = True
            index += 1
            continue
        if token == "--skip-output-format":
            args["skip_output_format"] = True
            index += 1
            continue
        if token == "--script-runtime" and index + 1 < len(argv):
            args["script_runtime"] = to_language_id(argv[index + 1] or "")
            index += 2
            continue
        if token == "--script-runtime-order" and index + 1 < len(argv):
            args["script_runtime_order"] = parse_language_order_csv(argv[index + 1] or "")
            index += 2
            continue
        if token == "--script-runtime-auto-best":
            args["script_runtime_auto_best"] = True
            index += 1
            continue
        if token == "--disable-script-swaps":
            args["disable_script_swaps"] = True
            index += 1
            continue
        if token == "--script-runtime-strict":
            args["script_runtime_strict"] = True
            index += 1
            continue
        if token == "--script-runtime-report-file" and index + 1 < len(argv):
            args["script_runtime_report_file"] = resolve_path(argv[index + 1])
            index += 2
            continue
        if token == "--runtime-backlog-json-file" and index + 1 < len(argv):
            args["runtime_backlog_json_file"] = resolve_path(argv[index + 1])
            index += 2
            continue
        if token == "--runtime-backlog-md-file" and index + 1 < len(argv):
            args["runtime_backlog_md_file"] = resolve_path(argv[index + 1])
            index += 2
            continue
        if token == "--skip-runtime-backlog":
            args["skip_runtime_backlog"] = True
            index += 1
            continue
        if token == "--fast":
            args["fast"] = True
            index += 1
            continue
        if token in {"--help", "-h"}:
            print_help_and_exit(0)
        raise RuntimeError(f"unknown argument: {token}")
    if args["mode"] not in {"auto", "create", "maintain"}:
        raise RuntimeError("--mode must be one of: auto, create, maintain")
    if args["script_runtime"] and args["script_runtime"] not in {"javascript", "python", "cpp"}:
        raise RuntimeError("--script-runtime must be one of: javascript, python, cpp")
    return args


def parse_json_from_command_output(raw_text: Any, fallback: Any = None) -> Any:
    text = str(raw_text or "").strip()
    if not text:
        return fallback
    candidates = [text]
    newline_object_start = text.rfind("\n{")
    if newline_object_start >= 0:
        candidates.append(text[newline_object_start + 1 :].strip())
    brace_start = text.find("{")
    brace_end = text.rfind("}")
    if brace_start >= 0 and brace_end >= brace_start:
        candidates.append(text[brace_start : brace_end + 1])
    for candidate in candidates:
        try:
            return json.loads(candidate)
        except Exception:
            continue
    return fallback


def run_command(command: str, command_args: list[str]) -> dict[str, Any]:
    try:
        completed = subprocess.run(
            [command, *command_args],
            cwd=str(ROOT),
            capture_output=True,
            text=True,
            shell=False,
        )
        status_code = int(completed.returncode or 0)
        stdout = str(completed.stdout or "")
        stderr = str(completed.stderr or "")
    except Exception as error:
        status_code = 1
        stdout = ""
        stderr = f"{error}\n"
    return {
        "command": " ".join([command, *command_args]),
        "statusCode": status_code,
        "stdout": stdout,
        "stderr": stderr,
    }


def parse_command_summary(stdout: Any) -> dict[str, Any]:
    return parse_json_from_command_output(stdout, {"parse_error": True, "output_tail": str(stdout or "")[-2000:]})


def run_swappable_script_stage(stage_id: str, script_args: list[str], args: dict[str, Any]) -> dict[str, Any]:
    result = run_script_with_swaps(
        {
            "stageId": stage_id,
            "scriptArgs": script_args,
            "preferredLanguage": args["script_runtime"],
            "runtimeOrder": args["script_runtime_order"],
            "autoSelectBest": args["script_runtime_auto_best"],
            "strictRuntime": args["script_runtime_strict"],
            "allowSwaps": not args["disable_script_swaps"],
        }
    )
    return {"result": result, "summary": parse_command_summary(result.get("stdout"))}


def run_preflight_stage(args: dict[str, Any]) -> dict[str, Any]:
    preflight_script_args = ["--scope", "general-workflow"]
    if args["script_runtime"]:
        preflight_script_args.extend(["--script-runtime", args["script_runtime"]])
    if args["script_runtime_order"]:
        preflight_script_args.extend(["--script-runtime-order", ",".join(args["script_runtime_order"])])
    if args["script_runtime_auto_best"]:
        preflight_script_args.append("--script-runtime-auto-best")
    if args["script_runtime_strict"]:
        preflight_script_args.append("--script-runtime-strict")
    if args["disable_script_swaps"]:
        preflight_script_args.append("--disable-script-swaps")
    if args["skip_preflight"]:
        summary = {"ok": True, "skipped": True, "reason": "--skip-preflight enabled"}
        return {
            "result": {
                "command": "node scripts/workflow-preflight.js --scope general-workflow",
                "statusCode": 0,
                "stdout": json.dumps(summary, indent=2),
                "stderr": "",
            },
            "summary": summary,
        }
    return run_swappable_script_stage("workflow_preflight", preflight_script_args, args)


def run_agent_registry_validation_stage(args: dict[str, Any]) -> dict[str, Any]:
    return run_swappable_script_stage("validate_agent_registry", [], args)


def skipped_stage(command: str, reason: str) -> dict[str, Any]:
    return {"result": {"command": command, "statusCode": 0, "stdout": "", "stderr": ""}, "summary": {"skipped": True, "reason": reason}}


def run_prune_stage(args: dict[str, Any]) -> dict[str, Any]:
    if args["skip_prune"]:
        return skipped_stage("node scripts/prune-workflow-artifacts.js", "--skip-prune enabled")
    return run_swappable_script_stage("prune_workflow_artifacts", [], args)


def run_hard_governance_stage(args: dict[str, Any]) -> dict[str, Any]:
    if args["skip_hard_governance"]:
        return skipped_stage("node scripts/hard-governance-gate.js --enforce", "--skip-hard-governance enabled")
    return run_swappable_script_stage("hard_governance_gate", ["--enforce"], args)


def run_uiux_blueprint_stage(args: dict[str, Any]) -> dict[str, Any]:
    return run_swappable_script_stage("generate_uiux_blueprint", [], args)


def run_wrapper_contract_stage(args: dict[str, Any]) -> dict[str, Any]:
    return run_swappable_script_stage("validate_wrapper_contracts", [], args)


def run_efficiency_stage(args: dict[str, Any]) -> dict[str, Any]:
    return run_swappable_script_stage("codex_efficiency_audit", ["--enforce"], args)


def resolve_mode(mode: str) -> str:
    if mode in {"create", "maintain"}:
        return mode
    return "maintain" if CONTEXT_FILE.exists() else "create"


def build_pipeline_args(args: dict[str, Any]) -> dict[str, Any]:
    resolved_mode = resolve_mode(args["mode"])
    script_args = ["--mode", resolved_mode, "--sync-translation", "--rerun-gates"]
    if args["brief"]:
        script_args.extend(["--brief", args["brief"]])
    if args["brief_file"] is not None:
        script_args.extend(["--brief-file", str(args["brief_file"])])
    if args["project"]:
        script_args.extend(["--project", args["project"]])
    if args["scope"]:
        script_args.extend(["--scope", args["scope"]])
    for update in args["planned_updates"]:
        script_args.extend(["--planned-update", update])
    if args["fast"]:
        script_args.extend(["--skip-checks", "--no-benchmark"])
    return {"resolvedMode": resolved_mode, "scriptArgs": script_args, "commandArgs": ["scripts/polyglot-default-pipeline.js", *script_args]}


def run_pipeline_stage(args: dict[str, Any]) -> dict[str, Any]:
    pipeline_run = build_pipeline_args(args)
    stage = run_swappable_script_stage("polyglot_default_pipeline", pipeline_run["scriptArgs"], args)
    return {"pipelineRun": pipeline_run, "result": stage["result"], "summary": stage["summary"]}


def run_separation_audit_stage(args: dict[str, Any]) -> dict[str, Any]:
    script_args: list[str] = []
    if args["enforce_data_separation"]:
        script_args.append("--enforce")
    return run_swappable_script_stage("data_separation_audit", script_args, args)


def run_runtime_optimization_backlog_stage(args: dict[str, Any]) -> dict[str, Any]:
    if args["skip_runtime_backlog"]:
        return skipped_stage("node scripts/generate-runtime-optimization-backlog.js", "--skip-runtime-backlog enabled")
    script_args = [
        "--runtime-report-file",
        str(args["script_runtime_report_file"]),
        "--json-out",
        str(args["runtime_backlog_json_file"]),
        "--md-out",
        str(args["runtime_backlog_md_file"]),
    ]
    return run_swappable_script_stage("generate_runtime_optimization_backlog", script_args, args)


def resolve_npx_command() -> str:
    return "npx.cmd" if os.name == "nt" else "npx"


def resolve_prettier_command() -> dict[str, Any]:
    local_cli = ROOT / "node_modules" / "prettier" / "bin" / "prettier.cjs"
    if local_cli.exists():
        return {"command": os.environ.get("AIO_NODE_EXEC", "node"), "command_args_prefix": [str(local_cli)]}
    return {"command": resolve_npx_command(), "command_args_prefix": ["prettier"]}


def build_output_format_targets(args: dict[str, Any]) -> list[str]:
    report_file = pathlib.Path(args["script_runtime_report_file"]).resolve()
    runtime_backlog_json_file = pathlib.Path(args["runtime_backlog_json_file"]).resolve()
    runtime_backlog_md_file = pathlib.Path(args["runtime_backlog_md_file"]).resolve()
    targets = [
        "data/output/databases/polyglot-default/analysis/workflow_preflight_report.json",
        "data/output/databases/polyglot-default/analysis/data_separation_audit_report.json",
        "data/output/databases/polyglot-default/build/polyglot_manifest.json",
        "data/output/databases/polyglot-default/context/run_state.json",
        "data/output/databases/polyglot-default/plan/hierarchy_order.md",
        "data/output/databases/polyglot-default/reports/final_recommendation.md",
    ]
    if report_file.exists():
        targets.append(normalize_path(os.path.relpath(report_file, ROOT)))
    if runtime_backlog_json_file.exists():
        targets.append(normalize_path(os.path.relpath(runtime_backlog_json_file, ROOT)))
    if runtime_backlog_md_file.exists():
        targets.append(normalize_path(os.path.relpath(runtime_backlog_md_file, ROOT)))
    return targets


def build_output_format_summary(stdout: Any, stderr: Any, targets: list[str], skipped: bool = False) -> dict[str, Any]:
    if skipped:
        return {"skipped": True, "reason": "--skip-output-format enabled"}
    lines = [line.strip() for line in f"{str(stdout or '')}\n{str(stderr or '')}".splitlines() if line.strip()]
    return {"skipped": False, "targets": targets, "output_line_count": len(lines), "output_tail": lines[-50:]}


def run_output_format_stage(args: dict[str, Any]) -> dict[str, Any]:
    targets = build_output_format_targets(args)
    if args["skip_output_format"]:
        summary = build_output_format_summary("", "", targets, True)
        return {
            "result": {
                "command": f"prettier --write {' '.join(targets)}",
                "statusCode": 0,
                "stdout": json.dumps(summary, indent=2),
                "stderr": "",
            },
            "summary": summary,
        }
    prettier_command = resolve_prettier_command()
    result = run_command(str(prettier_command["command"]), [*list(prettier_command["command_args_prefix"]), "--write", *targets])
    return {"result": result, "summary": build_output_format_summary(result["stdout"], result["stderr"], targets, False)}


def write_json_summary(payload: dict[str, Any]) -> None:
    sys.stdout.write(f"{json.dumps(payload, indent=2)}\n")


def to_runtime_stage_entry(stage_name: str, stage_result: dict[str, Any] | None) -> dict[str, Any]:
    payload = stage_result if isinstance(stage_result, dict) else {}
    runtime = payload.get("runtime") if isinstance(payload.get("runtime"), dict) else {}
    attempts = runtime.get("attempts") if isinstance(runtime.get("attempts"), list) else []
    selection = runtime.get("selection") if isinstance(runtime.get("selection"), dict) else {}
    fallback_used = bool(
        runtime.get("fallback_used")
        or len([attempt for attempt in attempts if isinstance(attempt, dict) and attempt.get("skipped") is not True]) > 1
        or len(attempts) > 1
    )
    status_code = payload.get("statusCode")
    return {
        "stage": stage_name,
        "script_file": str(runtime.get("script_file") or ""),
        "selected_language": str(runtime.get("selected_language") or ""),
        "swapped": bool(runtime.get("swapped")),
        "strict_runtime": bool(runtime.get("strict_runtime")),
        "auto_best_language": str(selection.get("auto_best_language") or ""),
        "auto_best_source": str(selection.get("auto_best_source") or ""),
        "auto_select_enabled": bool(selection.get("auto_select_enabled")),
        "status_code": int(status_code if isinstance(status_code, int) else 0),
        "duration_ms": int(runtime.get("duration_ms") or 0),
        "attempt_count": int(runtime.get("attempt_count") or len(attempts) or 0),
        "fallback_used": fallback_used,
        "attempts": attempts,
        "selection": selection,
    }


def build_script_runtime_report(args: dict[str, Any], stage_results: dict[str, Any]) -> dict[str, Any]:
    stage_entries = [
        to_runtime_stage_entry("preflight", stage_results.get("preflightResult")),
        to_runtime_stage_entry("prune", stage_results.get("pruneResult")),
        to_runtime_stage_entry("uiux_blueprint", stage_results.get("uiuxBlueprintResult")),
        to_runtime_stage_entry("hard_governance", stage_results.get("hardGovernanceResult")),
        to_runtime_stage_entry("agent_registry_validation", stage_results.get("agentRegistryValidationResult")),
        to_runtime_stage_entry("wrapper_contract_gate", stage_results.get("wrapperContractResult")),
        to_runtime_stage_entry("efficiency_gate", stage_results.get("efficiencyResult")),
        to_runtime_stage_entry("pipeline", stage_results.get("pipelineCommandResult")),
        to_runtime_stage_entry("separation_audit", stage_results.get("separationCommandResult")),
        to_runtime_stage_entry("runtime_optimization_backlog", stage_results.get("runtimeBacklogResult")),
    ]
    selected_language_coverage: dict[str, int] = {}
    for entry in stage_entries:
        language = str(entry.get("selected_language") or "").strip()
        if not language:
            continue
        selected_language_coverage[language] = int(selected_language_coverage.get(language, 0)) + 1
    return {
        "schema_version": 1,
        "report_id": "aio_script_runtime_swap_report",
        "generated_at": datetime.now(UTC).isoformat().replace("+00:00", "Z"),
        "root": str(ROOT),
        "report_file": normalize_path(os.path.relpath(args["script_runtime_report_file"], ROOT)),
        "controls": {
            "preferred_language": args["script_runtime"],
            "runtime_order": args["script_runtime_order"],
            "auto_select_best": args["script_runtime_auto_best"],
            "strict_runtime": args["script_runtime_strict"],
            "disable_swaps": args["disable_script_swaps"],
        },
        "metrics": {
            "stage_count": len(stage_entries),
            "swapped_stage_count": len([entry for entry in stage_entries if entry.get("swapped")]),
            "fallback_used_stage_count": len([entry for entry in stage_entries if entry.get("fallback_used")]),
            "strict_stage_count": len([entry for entry in stage_entries if entry.get("strict_runtime")]),
            "failed_stage_count": len([entry for entry in stage_entries if int(entry.get("status_code") or 0) != 0]),
            "total_duration_ms": sum(int(entry.get("duration_ms") or 0) for entry in stage_entries),
            "selected_language_coverage": selected_language_coverage,
        },
        "stages": stage_entries,
    }


def write_script_runtime_report(report: dict[str, Any], report_file_path: pathlib.Path) -> None:
    content = f"{json.dumps(report, indent=2)}\n"
    try:
        write_text_file_robust(report_file_path, content)
    except Exception:
        write_text_file_robust(report_file_path, content, atomic=False)


def build_workflow_summary(
    *,
    args: dict[str, Any],
    resolved_mode: str,
    preflight_result: dict[str, Any],
    preflight_summary: dict[str, Any],
    prune_result: dict[str, Any],
    prune_summary: dict[str, Any],
    uiux_blueprint_result: dict[str, Any],
    uiux_blueprint_summary: dict[str, Any],
    hard_governance_result: dict[str, Any],
    hard_governance_summary: dict[str, Any],
    agent_registry_validation_result: dict[str, Any],
    agent_registry_validation_summary: dict[str, Any],
    wrapper_contract_result: dict[str, Any],
    wrapper_contract_summary: dict[str, Any],
    efficiency_result: dict[str, Any],
    efficiency_summary: dict[str, Any],
    pipeline_command_result: dict[str, Any],
    pipeline_summary: dict[str, Any],
    separation_command_result: dict[str, Any],
    separation_summary: dict[str, Any],
    runtime_backlog_result: dict[str, Any] | None = None,
    runtime_backlog_summary: dict[str, Any] | None = None,
    script_runtime_report: dict[str, Any] | None = None,
    output_format_result: dict[str, Any] | None = None,
    output_format_summary: dict[str, Any] | None = None,
) -> dict[str, Any]:
    resolved_runtime_backlog_result = runtime_backlog_result or {
        "command": "node scripts/generate-runtime-optimization-backlog.js",
        "statusCode": 0,
        "runtime": None,
    }
    resolved_runtime_backlog_summary = runtime_backlog_summary or {"skipped": True, "reason": "stage not reached"}
    resolved_output_format_result = output_format_result or {
        "command": f"prettier --write {' '.join(build_output_format_targets(args))}",
        "statusCode": 0,
    }
    resolved_output_format_summary = output_format_summary or {"skipped": True, "reason": "stage not reached"}
    default_metrics = {
        "stage_count": 0,
        "swapped_stage_count": 0,
        "fallback_used_stage_count": 0,
        "strict_stage_count": 0,
        "failed_stage_count": 0,
        "total_duration_ms": 0,
        "selected_language_coverage": {},
    }
    runtime_metrics = (
        script_runtime_report.get("metrics")
        if isinstance(script_runtime_report, dict) and isinstance(script_runtime_report.get("metrics"), dict)
        else default_metrics
    )
    runtime_report_file = (
        script_runtime_report.get("report_file")
        if isinstance(script_runtime_report, dict) and script_runtime_report.get("report_file")
        else DEFAULT_SCRIPT_RUNTIME_REPORT_RELATIVE
    )
    return {
        "mode_requested": args["mode"],
        "mode_resolved": resolved_mode,
        "preflight": {
            "command": preflight_result["command"],
            "statusCode": preflight_result["statusCode"],
            "runtime": preflight_result.get("runtime"),
            "summary": preflight_summary,
        },
        "prune": {
            "command": prune_result["command"],
            "statusCode": prune_result["statusCode"],
            "runtime": prune_result.get("runtime"),
            "summary": prune_summary,
        },
        "uiux_blueprint": {
            "command": uiux_blueprint_result["command"],
            "statusCode": uiux_blueprint_result["statusCode"],
            "runtime": uiux_blueprint_result.get("runtime"),
            "summary": uiux_blueprint_summary,
        },
        "hard_governance": {
            "command": hard_governance_result["command"],
            "statusCode": hard_governance_result["statusCode"],
            "runtime": hard_governance_result.get("runtime"),
            "summary": hard_governance_summary,
        },
        "agent_registry_validation": {
            "command": agent_registry_validation_result["command"],
            "statusCode": agent_registry_validation_result["statusCode"],
            "runtime": agent_registry_validation_result.get("runtime"),
            "summary": agent_registry_validation_summary,
        },
        "wrapper_contract_gate": {
            "command": wrapper_contract_result["command"],
            "statusCode": wrapper_contract_result["statusCode"],
            "runtime": wrapper_contract_result.get("runtime"),
            "summary": wrapper_contract_summary,
        },
        "efficiency_gate": {
            "command": efficiency_result["command"],
            "statusCode": efficiency_result["statusCode"],
            "runtime": efficiency_result.get("runtime"),
            "summary": efficiency_summary,
        },
        "pipeline": {
            "command": pipeline_command_result["command"],
            "statusCode": pipeline_command_result["statusCode"],
            "runtime": pipeline_command_result.get("runtime"),
            "summary": pipeline_summary,
        },
        "separation_audit": {
            "command": separation_command_result["command"],
            "statusCode": separation_command_result["statusCode"],
            "runtime": separation_command_result.get("runtime"),
            "summary": separation_summary,
        },
        "runtime_optimization_backlog": {
            "command": resolved_runtime_backlog_result["command"],
            "statusCode": resolved_runtime_backlog_result["statusCode"],
            "runtime": resolved_runtime_backlog_result.get("runtime"),
            "summary": resolved_runtime_backlog_summary,
        },
        "output_format": {
            "command": resolved_output_format_result["command"],
            "statusCode": resolved_output_format_result["statusCode"],
            "summary": resolved_output_format_summary,
        },
        "script_runtime_optimization": {
            "report_file": runtime_report_file,
            "controls": {
                "preferred_language": args["script_runtime"],
                "runtime_order": args["script_runtime_order"],
                "auto_select_best": args["script_runtime_auto_best"],
                "strict_runtime": args["script_runtime_strict"],
                "disable_swaps": args["disable_script_swaps"],
            },
            "metrics": runtime_metrics,
        },
        "stage_agents": [
            "pseudo-blueprint-planner-agent",
            "instruction-registry-governor-agent",
            "unified-wrapper-orchestrator-agent",
            "language-fit-selector-agent",
            "pseudocode-polyglot-translator-agent",
            "polyglot-quality-benchmark-agent",
        ],
    }


def emit_failure(stage_result: dict[str, Any], summary: dict[str, Any]) -> int:
    if stage_result.get("stderr"):
        sys.stderr.write(str(stage_result["stderr"]))
    write_json_summary(summary)
    return int(stage_result.get("statusCode") or 1)


def make_skipped_block(reason: str, args: dict[str, Any], pipeline_run: dict[str, Any] | None = None) -> dict[str, Any]:
    effective_pipeline_run = pipeline_run or build_pipeline_args(args)
    return {
        "uiux_blueprint": skipped_stage("node scripts/generate-uiux-blueprint.js", reason),
        "hard_governance": skipped_stage("node scripts/hard-governance-gate.js --enforce", reason),
        "validation": skipped_stage("node scripts/validate-agent-registry.js", reason),
        "wrapper": skipped_stage("node scripts/validate-wrapper-contracts.js", reason),
        "efficiency": skipped_stage("node scripts/codex-efficiency-audit.js --enforce", reason),
        "pipeline": skipped_stage(f"node {' '.join(effective_pipeline_run['commandArgs'])}", reason),
        "separation": skipped_stage(
            f"node scripts/data-separation-audit.js{' --enforce' if args['enforce_data_separation'] else ''}",
            reason,
        ),
        "output_format": skipped_stage(f"prettier --write {' '.join(build_output_format_targets(args))}", reason),
    }


def main(argv: list[str] | None = None) -> int:
    try:
        args = parse_args(list(argv or []))
    except SystemExit as exit_signal:
        return int(exit_signal.code or 0)
    except Exception as error:
        sys.stderr.write(f"general-workflow failed: {error}\n")
        return 1

    try:
        preflight_stage = run_preflight_stage(args)
        preflight_result = preflight_stage["result"]
        preflight_summary = preflight_stage["summary"]
        if int(preflight_result["statusCode"]) != 0:
            return emit_failure(
                preflight_result,
                {
                    "mode_requested": args["mode"],
                    "mode_resolved": resolve_mode(args["mode"]),
                    "preflight": {
                        "command": preflight_result["command"],
                        "statusCode": preflight_result["statusCode"],
                        "summary": preflight_summary,
                    },
                    "skipped_after_preflight_failure": True,
                },
            )

        prune_stage = run_prune_stage(args)
        prune_result = prune_stage["result"]
        prune_summary = prune_stage["summary"]
        if int(prune_result["statusCode"]) != 0:
            pipeline_run = build_pipeline_args(args)
            skipped = make_skipped_block("blocked by prune failure", args, pipeline_run)
            empty_runtime_report = build_script_runtime_report(
                args,
                {
                    "preflightResult": preflight_result,
                    "pruneResult": prune_result,
                    "uiuxBlueprintResult": skipped["uiux_blueprint"]["result"],
                    "hardGovernanceResult": skipped["hard_governance"]["result"],
                    "agentRegistryValidationResult": skipped["validation"]["result"],
                    "wrapperContractResult": skipped["wrapper"]["result"],
                    "efficiencyResult": skipped["efficiency"]["result"],
                    "pipelineCommandResult": skipped["pipeline"]["result"],
                    "separationCommandResult": skipped["separation"]["result"],
                },
            )
            write_script_runtime_report(empty_runtime_report, pathlib.Path(args["script_runtime_report_file"]))
            return emit_failure(
                prune_result,
                build_workflow_summary(
                    args=args,
                    resolved_mode=pipeline_run["resolvedMode"],
                    preflight_result=preflight_result,
                    preflight_summary=preflight_summary,
                    prune_result=prune_result,
                    prune_summary=prune_summary,
                    uiux_blueprint_result=skipped["uiux_blueprint"]["result"],
                    uiux_blueprint_summary=skipped["uiux_blueprint"]["summary"],
                    hard_governance_result=skipped["hard_governance"]["result"],
                    hard_governance_summary=skipped["hard_governance"]["summary"],
                    agent_registry_validation_result=skipped["validation"]["result"],
                    agent_registry_validation_summary=skipped["validation"]["summary"],
                    wrapper_contract_result=skipped["wrapper"]["result"],
                    wrapper_contract_summary=skipped["wrapper"]["summary"],
                    efficiency_result=skipped["efficiency"]["result"],
                    efficiency_summary=skipped["efficiency"]["summary"],
                    pipeline_command_result=skipped["pipeline"]["result"],
                    pipeline_summary=skipped["pipeline"]["summary"],
                    separation_command_result=skipped["separation"]["result"],
                    separation_summary=skipped["separation"]["summary"],
                    script_runtime_report=empty_runtime_report,
                    output_format_result=skipped["output_format"]["result"],
                    output_format_summary=skipped["output_format"]["summary"],
                ),
            )

        uiux_blueprint_stage = run_uiux_blueprint_stage(args)
        uiux_blueprint_result = uiux_blueprint_stage["result"]
        uiux_blueprint_summary = uiux_blueprint_stage["summary"]
        if int(uiux_blueprint_result["statusCode"]) != 0:
            pipeline_run = build_pipeline_args(args)
            skipped = make_skipped_block("blocked by uiux blueprint failure", args, pipeline_run)
            empty_runtime_report = build_script_runtime_report(
                args,
                {
                    "preflightResult": preflight_result,
                    "pruneResult": prune_result,
                    "uiuxBlueprintResult": uiux_blueprint_result,
                    "hardGovernanceResult": skipped["hard_governance"]["result"],
                    "agentRegistryValidationResult": skipped["validation"]["result"],
                    "wrapperContractResult": skipped["wrapper"]["result"],
                    "efficiencyResult": skipped["efficiency"]["result"],
                    "pipelineCommandResult": skipped["pipeline"]["result"],
                    "separationCommandResult": skipped["separation"]["result"],
                },
            )
            write_script_runtime_report(empty_runtime_report, pathlib.Path(args["script_runtime_report_file"]))
            return emit_failure(
                uiux_blueprint_result,
                build_workflow_summary(
                    args=args,
                    resolved_mode=pipeline_run["resolvedMode"],
                    preflight_result=preflight_result,
                    preflight_summary=preflight_summary,
                    prune_result=prune_result,
                    prune_summary=prune_summary,
                    uiux_blueprint_result=uiux_blueprint_result,
                    uiux_blueprint_summary=uiux_blueprint_summary,
                    hard_governance_result=skipped["hard_governance"]["result"],
                    hard_governance_summary=skipped["hard_governance"]["summary"],
                    agent_registry_validation_result=skipped["validation"]["result"],
                    agent_registry_validation_summary=skipped["validation"]["summary"],
                    wrapper_contract_result=skipped["wrapper"]["result"],
                    wrapper_contract_summary=skipped["wrapper"]["summary"],
                    efficiency_result=skipped["efficiency"]["result"],
                    efficiency_summary=skipped["efficiency"]["summary"],
                    pipeline_command_result=skipped["pipeline"]["result"],
                    pipeline_summary=skipped["pipeline"]["summary"],
                    separation_command_result=skipped["separation"]["result"],
                    separation_summary=skipped["separation"]["summary"],
                    script_runtime_report=empty_runtime_report,
                    output_format_result=skipped["output_format"]["result"],
                    output_format_summary=skipped["output_format"]["summary"],
                ),
            )

        hard_governance_stage = run_hard_governance_stage(args)
        hard_governance_result = hard_governance_stage["result"]
        hard_governance_summary = hard_governance_stage["summary"]
        if int(hard_governance_result["statusCode"]) != 0:
            pipeline_run = build_pipeline_args(args)
            skipped_validation = skipped_stage("node scripts/validate-agent-registry.js", "blocked by hard governance failure")
            skipped_wrapper = skipped_stage("node scripts/validate-wrapper-contracts.js", "blocked by hard governance failure")
            skipped_efficiency = skipped_stage("node scripts/codex-efficiency-audit.js --enforce", "blocked by hard governance failure")
            skipped_pipeline = skipped_stage(f"node {' '.join(pipeline_run['commandArgs'])}", "blocked by hard governance failure")
            skipped_separation = skipped_stage(
                f"node scripts/data-separation-audit.js{' --enforce' if args['enforce_data_separation'] else ''}",
                "blocked by hard governance failure",
            )
            skipped_output_format = skipped_stage(
                f"prettier --write {' '.join(build_output_format_targets(args))}",
                "blocked by hard governance failure",
            )
            empty_runtime_report = build_script_runtime_report(
                args,
                {
                    "preflightResult": preflight_result,
                    "pruneResult": prune_result,
                    "uiuxBlueprintResult": uiux_blueprint_result,
                    "hardGovernanceResult": hard_governance_result,
                    "agentRegistryValidationResult": skipped_validation["result"],
                    "wrapperContractResult": skipped_wrapper["result"],
                    "efficiencyResult": skipped_efficiency["result"],
                    "pipelineCommandResult": skipped_pipeline["result"],
                    "separationCommandResult": skipped_separation["result"],
                },
            )
            write_script_runtime_report(empty_runtime_report, pathlib.Path(args["script_runtime_report_file"]))
            return emit_failure(
                hard_governance_result,
                build_workflow_summary(
                    args=args,
                    resolved_mode=pipeline_run["resolvedMode"],
                    preflight_result=preflight_result,
                    preflight_summary=preflight_summary,
                    prune_result=prune_result,
                    prune_summary=prune_summary,
                    uiux_blueprint_result=uiux_blueprint_result,
                    uiux_blueprint_summary=uiux_blueprint_summary,
                    hard_governance_result=hard_governance_result,
                    hard_governance_summary=hard_governance_summary,
                    agent_registry_validation_result=skipped_validation["result"],
                    agent_registry_validation_summary=skipped_validation["summary"],
                    wrapper_contract_result=skipped_wrapper["result"],
                    wrapper_contract_summary=skipped_wrapper["summary"],
                    efficiency_result=skipped_efficiency["result"],
                    efficiency_summary=skipped_efficiency["summary"],
                    pipeline_command_result=skipped_pipeline["result"],
                    pipeline_summary=skipped_pipeline["summary"],
                    separation_command_result=skipped_separation["result"],
                    separation_summary=skipped_separation["summary"],
                    script_runtime_report=empty_runtime_report,
                    output_format_result=skipped_output_format["result"],
                    output_format_summary=skipped_output_format["summary"],
                ),
            )

        agent_registry_validation_stage = run_agent_registry_validation_stage(args)
        agent_registry_validation_result = agent_registry_validation_stage["result"]
        agent_registry_validation_summary = agent_registry_validation_stage["summary"]
        wrapper_contract_stage = run_wrapper_contract_stage(args)
        wrapper_contract_result = wrapper_contract_stage["result"]
        wrapper_contract_summary = wrapper_contract_stage["summary"]
        efficiency_stage = run_efficiency_stage(args)
        efficiency_result = efficiency_stage["result"]
        efficiency_summary = efficiency_stage["summary"]
        if (
            int(agent_registry_validation_result["statusCode"]) != 0
            or int(wrapper_contract_result["statusCode"]) != 0
            or int(efficiency_result["statusCode"]) != 0
        ):
            pipeline_run = build_pipeline_args(args)
            skipped_pipeline = skipped_stage(f"node {' '.join(pipeline_run['commandArgs'])}", "blocked by validation gate failure")
            skipped_separation = skipped_stage(
                f"node scripts/data-separation-audit.js{' --enforce' if args['enforce_data_separation'] else ''}",
                "blocked by validation gate failure",
            )
            skipped_output_format = skipped_stage(
                f"prettier --write {' '.join(build_output_format_targets(args))}",
                "blocked by validation gate failure",
            )
            empty_runtime_report = build_script_runtime_report(
                args,
                {
                    "preflightResult": preflight_result,
                    "pruneResult": prune_result,
                    "uiuxBlueprintResult": uiux_blueprint_result,
                    "hardGovernanceResult": hard_governance_result,
                    "agentRegistryValidationResult": agent_registry_validation_result,
                    "wrapperContractResult": wrapper_contract_result,
                    "efficiencyResult": efficiency_result,
                    "pipelineCommandResult": skipped_pipeline["result"],
                    "separationCommandResult": skipped_separation["result"],
                },
            )
            write_script_runtime_report(empty_runtime_report, pathlib.Path(args["script_runtime_report_file"]))
            summary = build_workflow_summary(
                args=args,
                resolved_mode=pipeline_run["resolvedMode"],
                preflight_result=preflight_result,
                preflight_summary=preflight_summary,
                prune_result=prune_result,
                prune_summary=prune_summary,
                uiux_blueprint_result=uiux_blueprint_result,
                uiux_blueprint_summary=uiux_blueprint_summary,
                hard_governance_result=hard_governance_result,
                hard_governance_summary=hard_governance_summary,
                agent_registry_validation_result=agent_registry_validation_result,
                agent_registry_validation_summary=agent_registry_validation_summary,
                wrapper_contract_result=wrapper_contract_result,
                wrapper_contract_summary=wrapper_contract_summary,
                efficiency_result=efficiency_result,
                efficiency_summary=efficiency_summary,
                pipeline_command_result=skipped_pipeline["result"],
                pipeline_summary=skipped_pipeline["summary"],
                separation_command_result=skipped_separation["result"],
                separation_summary=skipped_separation["summary"],
                script_runtime_report=empty_runtime_report,
                output_format_result=skipped_output_format["result"],
                output_format_summary=skipped_output_format["summary"],
            )
            if int(agent_registry_validation_result["statusCode"]) != 0:
                return emit_failure(agent_registry_validation_result, summary)
            if int(wrapper_contract_result["statusCode"]) != 0:
                return emit_failure(wrapper_contract_result, summary)
            return emit_failure(efficiency_result, summary)

        pipeline_stage = run_pipeline_stage(args)
        pipeline_run = pipeline_stage["pipelineRun"]
        pipeline_command_result = pipeline_stage["result"]
        pipeline_summary = pipeline_stage["summary"]
        separation_stage = run_separation_audit_stage(args)
        separation_command_result = separation_stage["result"]
        separation_summary = separation_stage["summary"]
        runtime_backlog_stage = run_runtime_optimization_backlog_stage(args)
        runtime_backlog_result = runtime_backlog_stage["result"]
        runtime_backlog_summary = runtime_backlog_stage["summary"]
        script_runtime_report = build_script_runtime_report(
            args,
            {
                "preflightResult": preflight_result,
                "pruneResult": prune_result,
                "uiuxBlueprintResult": uiux_blueprint_result,
                "hardGovernanceResult": hard_governance_result,
                "agentRegistryValidationResult": agent_registry_validation_result,
                "wrapperContractResult": wrapper_contract_result,
                "efficiencyResult": efficiency_result,
                "pipelineCommandResult": pipeline_command_result,
                "separationCommandResult": separation_command_result,
                "runtimeBacklogResult": runtime_backlog_result,
            },
        )
        write_script_runtime_report(script_runtime_report, pathlib.Path(args["script_runtime_report_file"]))
        output_format_stage = run_output_format_stage(args)
        output_format_result = output_format_stage["result"]
        output_format_summary = output_format_stage["summary"]
        summary = build_workflow_summary(
            args=args,
            resolved_mode=pipeline_run["resolvedMode"],
            preflight_result=preflight_result,
            preflight_summary=preflight_summary,
            prune_result=prune_result,
            prune_summary=prune_summary,
            uiux_blueprint_result=uiux_blueprint_result,
            uiux_blueprint_summary=uiux_blueprint_summary,
            hard_governance_result=hard_governance_result,
            hard_governance_summary=hard_governance_summary,
            agent_registry_validation_result=agent_registry_validation_result,
            agent_registry_validation_summary=agent_registry_validation_summary,
            wrapper_contract_result=wrapper_contract_result,
            wrapper_contract_summary=wrapper_contract_summary,
            efficiency_result=efficiency_result,
            efficiency_summary=efficiency_summary,
            pipeline_command_result=pipeline_command_result,
            pipeline_summary=pipeline_summary,
            separation_command_result=separation_command_result,
            separation_summary=separation_summary,
            runtime_backlog_result=runtime_backlog_result,
            runtime_backlog_summary=runtime_backlog_summary,
            script_runtime_report=script_runtime_report,
            output_format_result=output_format_result,
            output_format_summary=output_format_summary,
        )
        write_json_summary(summary)
        for stage_result in [
            agent_registry_validation_result,
            wrapper_contract_result,
            efficiency_result,
            pipeline_command_result,
            separation_command_result,
            runtime_backlog_result,
            output_format_result,
        ]:
            if int(stage_result["statusCode"]) != 0:
                if stage_result.get("stderr"):
                    sys.stderr.write(str(stage_result["stderr"]))
                return int(stage_result["statusCode"])
        return 0
    except Exception as error:
        sys.stderr.write(f"general-workflow failed: {error}\n")
        return 1


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
