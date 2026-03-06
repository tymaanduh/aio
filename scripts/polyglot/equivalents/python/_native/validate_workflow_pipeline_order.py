#!/usr/bin/env python3
"""Native Python implementation for scripts/validate-workflow-pipeline-order.js."""

from __future__ import annotations

import json
import pathlib
import sys

from _common import find_repo_root, normalize_path, write_text_file_robust

DEFAULT_PIPELINE_FILE = pathlib.PurePosixPath("data/input/shared/main/workflow_execution_pipeline.json")
DEFAULT_BASELINE_FILE = pathlib.PurePosixPath("data/input/shared/main/executive_engineering_baseline.json")
DEFAULT_RULESET_FILE = pathlib.PurePosixPath("data/input/shared/main/hard_governance_ruleset.json")
DEFAULT_GENERAL_WORKFLOW_FILE = pathlib.PurePosixPath("scripts/general-workflow.js")
DEFAULT_REPORT_FILE = pathlib.PurePosixPath("data/output/databases/polyglot-default/analysis/workflow_pipeline_order_report.json")

EXPECTED_STAGE_ORDER = [
    "preflight",
    "prune",
    "uiux_blueprint",
    "hard_governance",
    "agent_registry_validation",
    "wrapper_contract_gate",
    "efficiency_gate",
    "pipeline",
    "separation_audit",
    "runtime_optimization_backlog",
    "output_format",
]

EXPECTED_GATE_ORDER = [
    "workflow:preflight",
    "workflow:order:gate",
    "contracts:validate",
    "standards:baseline:gate",
    "standards:iso:gate",
    "uiux:blueprint:check",
    "governance:hard:gate",
    "efficiency:gate",
    "refactor:gate",
]

GENERAL_WORKFLOW_ORDER_MARKERS = [
    "const preflightStage = runPreflightStage(args);",
    "const pruneStage = runPruneStage(args);",
    "const uiuxBlueprintStage = runUiuxBlueprintStage(args);",
    "const hardGovernanceStage = runHardGovernanceStage(args);",
    "const agentRegistryValidationStage = runAgentRegistryValidationStage(args);",
    "const wrapperContractStage = runWrapperContractStage(args);",
    "const efficiencyStage = runEfficiencyStage(args);",
    "const pipelineStage = runPipelineStage(args);",
    "const separationStage = runSeparationAuditStage(args);",
    "const runtimeBacklogStage = runRuntimeOptimizationBacklogStage(args);",
    "const outputFormatStage = runOutputFormatStage(args);",
]


def parse_args(argv: list[str]) -> dict:
    args = {
        "strict": "--no-strict" not in argv,
        "enforce": "--enforce" in argv,
        "check": "--check" in argv,
        "pipeline_file": "",
        "baseline_file": "",
        "ruleset_file": "",
        "general_workflow_file": "",
        "report_file": "",
    }
    index = 0
    while index < len(argv):
        token = str(argv[index] or "")
        if token == "--pipeline-file" and index + 1 < len(argv):
            args["pipeline_file"] = str(argv[index + 1] or "").strip()
            index += 2
            continue
        if token == "--baseline-file" and index + 1 < len(argv):
            args["baseline_file"] = str(argv[index + 1] or "").strip()
            index += 2
            continue
        if token == "--ruleset-file" and index + 1 < len(argv):
            args["ruleset_file"] = str(argv[index + 1] or "").strip()
            index += 2
            continue
        if token == "--general-workflow-file" and index + 1 < len(argv):
            args["general_workflow_file"] = str(argv[index + 1] or "").strip()
            index += 2
            continue
        if token == "--report-file" and index + 1 < len(argv):
            args["report_file"] = str(argv[index + 1] or "").strip()
            index += 2
            continue
        index += 1
    return args


def issue(level: str, issue_type: str, detail: str, extra: dict | None = None) -> dict:
    payload = {
        "level": level,
        "type": issue_type,
        "detail": detail,
    }
    if extra:
        payload.update(extra)
    return payload


def normalize_text(value: object) -> str:
    return str(value or "").strip()


def read_json(file_path: pathlib.Path) -> dict:
    return json.loads(file_path.read_text(encoding="utf8"))


def validate_unique_list(values: list[object]) -> dict:
    seen: set[str] = set()
    duplicates: set[str] = set()
    for value in values or []:
        normalized = normalize_text(value)
        if not normalized:
            continue
        if normalized in seen:
            duplicates.add(normalized)
            continue
        seen.add(normalized)
    return {
        "unique_count": len(seen),
        "duplicate_values": sorted(duplicates),
    }


def validate_order(expected: list[str], actual: list[object]) -> dict:
    actual_list = [normalize_text(entry) for entry in actual or []]
    missing = [entry for entry in expected if entry not in actual_list]
    index_map = [{"value": entry, "index": actual_list.index(entry) if entry in actual_list else -1} for entry in expected]
    order_valid = True
    for index in range(1, len(index_map)):
        previous = index_map[index - 1]
        current = index_map[index]
        if previous["index"] < 0 or current["index"] < 0:
            continue
        if current["index"] < previous["index"]:
            order_valid = False
            break
    return {
        "missing": missing,
        "order_valid": order_valid,
        "index_map": index_map,
    }


def validate_general_workflow_source(general_workflow_source: str) -> dict:
    markers = [{"marker": marker, "index": str(general_workflow_source or "").find(marker)} for marker in GENERAL_WORKFLOW_ORDER_MARKERS]
    missing_markers = [entry["marker"] for entry in markers if int(entry["index"]) < 0]
    order_valid = True
    for index in range(1, len(markers)):
        previous = markers[index - 1]
        current = markers[index]
        if previous["index"] < 0 or current["index"] < 0:
            continue
        if current["index"] < previous["index"]:
            order_valid = False
            break
    return {
        "marker_count": len(markers),
        "missing_markers": missing_markers,
        "order_valid": order_valid,
        "markers": markers,
    }


def analyze(root: pathlib.Path, args: dict | None = None) -> dict:
    options = args or {}
    pipeline_path = root / pathlib.PurePosixPath(str(options.get("pipeline_file") or DEFAULT_PIPELINE_FILE))
    baseline_path = root / pathlib.PurePosixPath(str(options.get("baseline_file") or DEFAULT_BASELINE_FILE))
    ruleset_path = root / pathlib.PurePosixPath(str(options.get("ruleset_file") or DEFAULT_RULESET_FILE))
    general_workflow_path = root / pathlib.PurePosixPath(str(options.get("general_workflow_file") or DEFAULT_GENERAL_WORKFLOW_FILE))

    report = {
        "status": "pass",
        "generated_at": __import__("datetime").datetime.utcnow().isoformat() + "Z",
        "root": normalize_path(root),
        "files": {
            "workflow_pipeline": normalize_path(pipeline_path.relative_to(root)),
            "baseline": normalize_path(baseline_path.relative_to(root)),
            "ruleset": normalize_path(ruleset_path.relative_to(root)),
            "general_workflow": normalize_path(general_workflow_path.relative_to(root)),
        },
        "metrics": {
            "stage_order_count": 0,
            "stage_contract_count": 0,
            "gate_order_count": 0,
            "baseline_gate_order_count": 0,
            "ruleset_required_script_count": 0,
            "general_workflow_marker_count": 0,
        },
        "checks": {},
        "issues": [],
    }

    for file_path, issue_type, detail in [
        (pipeline_path, "missing_workflow_pipeline_file", "workflow execution pipeline file is missing"),
        (baseline_path, "missing_baseline_file", "executive engineering baseline file is missing"),
        (ruleset_path, "missing_ruleset_file", "hard governance ruleset file is missing"),
        (general_workflow_path, "missing_general_workflow_file", "general workflow script file is missing"),
    ]:
        if not file_path.exists():
            report["issues"].append(issue("error", issue_type, detail))
    if any(entry.get("level") == "error" for entry in report["issues"]):
        report["status"] = "fail"
        return report

    try:
        pipeline_doc = read_json(pipeline_path)
    except Exception as error:
        report["issues"].append(issue("error", "invalid_workflow_pipeline_json", "workflow execution pipeline is invalid json", {"error": str(error)}))
        pipeline_doc = {}
    try:
        baseline_doc = read_json(baseline_path)
    except Exception as error:
        report["issues"].append(issue("error", "invalid_baseline_json", "baseline file is invalid json", {"error": str(error)}))
        baseline_doc = {}
    try:
        ruleset_doc = read_json(ruleset_path)
    except Exception as error:
        report["issues"].append(issue("error", "invalid_ruleset_json", "ruleset file is invalid json", {"error": str(error)}))
        ruleset_doc = {}
    if any(entry.get("level") == "error" for entry in report["issues"]):
        report["status"] = "fail"
        return report

    stage_order = pipeline_doc.get("general_workflow_stage_order") if isinstance(pipeline_doc.get("general_workflow_stage_order"), list) else []
    stage_contracts = pipeline_doc.get("stage_contracts") if isinstance(pipeline_doc.get("stage_contracts"), list) else []
    gate_order = pipeline_doc.get("gate_pipeline_order") if isinstance(pipeline_doc.get("gate_pipeline_order"), list) else []
    workflow_policy = baseline_doc.get("workflow_policy") if isinstance(baseline_doc.get("workflow_policy"), dict) else {}
    baseline_gate_order = workflow_policy.get("required_gate_order") if isinstance(workflow_policy.get("required_gate_order"), list) else []
    workflow_rules = ruleset_doc.get("workflow") if isinstance(ruleset_doc.get("workflow"), dict) else {}
    ruleset_required_scripts = workflow_rules.get("required_npm_scripts") if isinstance(workflow_rules.get("required_npm_scripts"), list) else []

    report["metrics"]["stage_order_count"] = len(stage_order)
    report["metrics"]["stage_contract_count"] = len(stage_contracts)
    report["metrics"]["gate_order_count"] = len(gate_order)
    report["metrics"]["baseline_gate_order_count"] = len(baseline_gate_order)
    report["metrics"]["ruleset_required_script_count"] = len(ruleset_required_scripts)

    stage_uniqueness = validate_unique_list(stage_order)
    gate_uniqueness = validate_unique_list(gate_order)
    stage_order_validation = validate_order(EXPECTED_STAGE_ORDER, stage_order)
    gate_order_validation = validate_order(EXPECTED_GATE_ORDER, gate_order)
    baseline_gate_validation = validate_order(EXPECTED_GATE_ORDER, baseline_gate_order)

    report["checks"]["stage_uniqueness"] = stage_uniqueness
    report["checks"]["gate_uniqueness"] = gate_uniqueness
    report["checks"]["stage_order"] = stage_order_validation
    report["checks"]["gate_order"] = gate_order_validation
    report["checks"]["baseline_gate_order"] = baseline_gate_validation

    if not isinstance(pipeline_doc.get("schema_version"), (int, float)):
        report["issues"].append(issue("error", "invalid_workflow_pipeline_schema_version", "workflow execution pipeline schema_version must be numeric"))
    if len(stage_contracts) != len(stage_order):
        report["issues"].append(
            issue(
                "error",
                "stage_contract_count_mismatch",
                "stage_contracts count must match general_workflow_stage_order count",
                {
                    "stage_contract_count": len(stage_contracts),
                    "stage_order_count": len(stage_order),
                },
            )
        )
    if stage_uniqueness["duplicate_values"]:
        report["issues"].append(issue("error", "duplicate_workflow_stage_ids", "general_workflow_stage_order contains duplicate stages", {"duplicates": stage_uniqueness["duplicate_values"]}))
    if gate_uniqueness["duplicate_values"]:
        report["issues"].append(issue("error", "duplicate_gate_stage_ids", "gate_pipeline_order contains duplicate scripts", {"duplicates": gate_uniqueness["duplicate_values"]}))
    if stage_order_validation["missing"]:
        report["issues"].append(issue("error", "missing_expected_workflow_stages", "general_workflow_stage_order is missing expected stages", {"missing": stage_order_validation["missing"]}))
    if not stage_order_validation["order_valid"]:
        report["issues"].append(issue("error", "workflow_stage_order_invalid", "general workflow stage order is not in the canonical sequence"))
    if gate_order_validation["missing"]:
        report["issues"].append(issue("error", "missing_expected_gate_stages", "gate_pipeline_order is missing expected scripts", {"missing": gate_order_validation["missing"]}))
    if not gate_order_validation["order_valid"]:
        report["issues"].append(issue("error", "gate_pipeline_order_invalid", "gate pipeline order is not in canonical sequence"))
    if baseline_gate_validation["missing"]:
        report["issues"].append(issue("error", "baseline_missing_gate_stages", "baseline required_gate_order is missing expected scripts", {"missing": baseline_gate_validation["missing"]}))
    if not baseline_gate_validation["order_valid"]:
        report["issues"].append(issue("error", "baseline_gate_order_invalid", "baseline required_gate_order is not in canonical sequence"))

    for script_name in EXPECTED_GATE_ORDER:
        if script_name not in ruleset_required_scripts:
            report["issues"].append(issue("error", "ruleset_missing_required_script", "hard governance ruleset is missing required workflow script", {"script": script_name}))

    general_workflow_source = general_workflow_path.read_text(encoding="utf8")
    source_order_validation = validate_general_workflow_source(general_workflow_source)
    report["metrics"]["general_workflow_marker_count"] = int(source_order_validation["marker_count"])
    report["checks"]["general_workflow_source_order"] = source_order_validation
    if source_order_validation["missing_markers"]:
        report["issues"].append(issue("error", "general_workflow_missing_stage_markers", "general-workflow.js is missing stage invocation markers", {"missing_markers": source_order_validation["missing_markers"]}))
    if not source_order_validation["order_valid"]:
        report["issues"].append(issue("error", "general_workflow_stage_invocation_order_invalid", "general-workflow.js stage invocation order is invalid"))

    report["status"] = "fail" if any(entry.get("level") == "error" for entry in report["issues"]) else "pass"
    return report


def write_report(root: pathlib.Path, args: dict, report: dict) -> None:
    if args.get("check") is True:
        return
    report_path = root / pathlib.PurePosixPath(str(args.get("report_file") or DEFAULT_REPORT_FILE))
    write_text_file_robust(report_path, f"{json.dumps(report, indent=2)}\n", atomic=False)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv or [])
    root = find_repo_root(pathlib.Path(__file__))
    report = analyze(root, args)
    write_report(root, args, report)
    sys.stdout.write(f"{json.dumps(report, indent=2)}\n")
    if args["strict"] and (args["enforce"] or args["check"]) and report["status"] != "pass":
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
