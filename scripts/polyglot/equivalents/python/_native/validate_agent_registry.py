#!/usr/bin/env python3
"""Native Python implementation for scripts/validate-agent-registry.js."""

from __future__ import annotations

import json
import pathlib
import sys
from typing import Any

import yaml

from agent_workflow_shards_native import read_workflow_doc
from project_source_resolver_native import find_project_root, list_matching_files, resolve_agent_access_control

EXPECTED_PROJECT_SCOPE_REF = "source://project_scope"
EXPECTED_ALLOWED_ROOTS = [
    "app/",
    "brain/",
    "data/input/",
    "data/output/",
    "main/",
    "renderer/",
    "scripts/",
    "tests/",
    "to-do/",
]
EXPECTED_ALLOWED_ROOTS_REF = "source://project_scope#allowed_roots"
EXPECTED_SCOPE_GUARDRAILS_REF = "source://scope_guardrails#default"


def parse_args(argv: list[str]) -> dict[str, bool]:
    return {
        "strict": "--no-strict" not in argv,
        "json": "--json" in argv,
    }


def find_single_path(root: pathlib.Path, filename: str) -> pathlib.Path:
    matches = list_matching_files(root, filename)
    if not matches:
        raise RuntimeError(f"unable to locate {filename} in project scope")
    return matches[0]


def read_yaml(file_path: pathlib.Path) -> Any:
    return yaml.safe_load(file_path.read_text(encoding="utf8"))


def normalize_list(values: Any) -> list[str]:
    return sorted(str(value) for value in (values if isinstance(values, list) else []))


def compare_array(left: Any, right: Any) -> bool:
    return normalize_list(left) == normalize_list(right)


def resolve_access_allowed_paths(access_entry: dict[str, Any], access_scope_roots: list[str]) -> list[str]:
    if isinstance(access_entry.get("allowed_paths"), list):
        return list(access_entry.get("allowed_paths") or [])
    if str(access_entry.get("allowed_paths_ref") or "") == EXPECTED_ALLOWED_ROOTS_REF:
        return list(access_scope_roots or [])
    return []


def normalize_scope_guardrails_catalog(value: Any) -> dict[str, list[str]]:
    source = value if isinstance(value, dict) else {}
    catalog: dict[str, list[str]] = {}
    for key, entry in source.items():
        if not isinstance(entry, list):
            continue
        rows = [str(item).strip() for item in entry if str(item).strip()]
        if rows:
            catalog[str(key)] = rows
    return catalog


def resolve_scope_guardrails(entry: dict[str, Any], catalog: dict[str, list[str]]) -> list[str]:
    if isinstance(entry.get("scope_guardrails"), list):
        return list(entry.get("scope_guardrails") or [])
    ref = str(entry.get("scope_guardrails_ref") or "")
    if not ref:
        return []
    prefix, _, key = ref.partition("#")
    if prefix.strip() != "source://scope_guardrails":
        return []
    return list(catalog.get((key.strip() or "default"), []))


def build_report() -> dict[str, Any]:
    root = find_project_root(pathlib.Path.cwd())
    registry_path = find_single_path(root, "agents_registry.yaml")
    access_load = resolve_agent_access_control(root)
    access_path = access_load["policy_path"]
    access_control = access_load["policy"]
    workflow_load = read_workflow_doc(root, prefer_shards=True, ensure_current=True)
    workflows_json = workflow_load["doc"] if isinstance(workflow_load.get("doc"), dict) else {}
    workflows_path = workflow_load.get("paths", {}).get("canonical") or find_single_path(root, "agent_workflows.json")
    registry = read_yaml(registry_path)

    workflow_list = (
        workflows_json.get("agents")
        if isinstance(workflows_json.get("agents"), list)
        else workflows_json.get("agent_workflows")
        if isinstance(workflows_json.get("agent_workflows"), list)
        else []
    )
    workflow_map = {str(entry.get("id") or ""): entry for entry in workflow_list if isinstance(entry, dict)}

    agents_dir = registry_path.parent
    agent_files = sorted([entry for entry in agents_dir.iterdir() if entry.is_file() and entry.suffix == ".yaml" and entry.name != registry_path.name], key=lambda entry: entry.name)
    yaml_agents: list[dict[str, Any]] = []
    for file_path in agent_files:
        loaded = read_yaml(file_path)
        if isinstance(loaded, dict) and isinstance(loaded.get("agent"), dict):
            yaml_agents.append(dict(loaded.get("agent") or {}))

    registry_agents = [str(agent_id) for agent_id in ((registry.get("agents") if isinstance(registry, dict) else []) or [])]
    registry_set = set(registry_agents)
    access_map = access_control.get("agents") if isinstance(access_control.get("agents"), dict) else {}
    issues: list[dict[str, Any]] = []
    counts = {
        "yaml_agent_files": len(yaml_agents),
        "registry_agents": len(registry_agents),
        "workflow_agents": len(workflow_list),
        "access_control_agents": len(access_map),
        "workflow_source": workflow_load.get("source") or "canonical",
    }
    registry_scope_roots = ((registry.get("project_scope") or {}) if isinstance(registry, dict) else {}).get("allowed_roots") or []
    workflow_scope_roots = ((workflows_json.get("project_scope") or {}) if isinstance(workflows_json, dict) else {}).get("allowed_roots") or []
    access_scope_roots = (((access_control.get("system") or {}) if isinstance(access_control, dict) else {}).get("project_scope") or {}).get("allowed_roots") or []
    workflow_scope_guardrails_catalog = normalize_scope_guardrails_catalog(workflows_json.get("scope_guardrails_catalog") if isinstance(workflows_json, dict) else {})

    if not (isinstance(registry, dict) and isinstance(registry.get("project_scope"), dict)):
        issues.append({"level": "error", "type": "registry_missing_project_scope", "detail": "agents_registry.yaml is missing project_scope"})
    if not (isinstance(workflows_json, dict) and isinstance(workflows_json.get("project_scope"), dict)):
        issues.append({"level": "error", "type": "workflow_missing_project_scope", "detail": "agent_workflows.json is missing project_scope"})
    if not (isinstance(access_control, dict) and isinstance((access_control.get("system") or {}).get("project_scope"), dict)):
        issues.append({"level": "error", "type": "access_control_missing_project_scope", "detail": "agent_access_control.json is missing system.project_scope"})

    if isinstance(registry, dict) and isinstance(registry.get("project_scope"), dict) and not compare_array(registry_scope_roots, EXPECTED_ALLOWED_ROOTS):
        issues.append({"level": "error", "type": "registry_project_scope_roots_mismatch", "expected_allowed_roots": EXPECTED_ALLOWED_ROOTS, "actual_allowed_roots": normalize_list(registry_scope_roots)})
    if isinstance(workflows_json, dict) and isinstance(workflows_json.get("project_scope"), dict) and not compare_array(workflow_scope_roots, EXPECTED_ALLOWED_ROOTS):
        issues.append({"level": "error", "type": "workflow_project_scope_roots_mismatch", "expected_allowed_roots": EXPECTED_ALLOWED_ROOTS, "actual_allowed_roots": normalize_list(workflow_scope_roots)})
    if isinstance(access_control, dict) and isinstance((access_control.get("system") or {}).get("project_scope"), dict) and not compare_array(access_scope_roots, EXPECTED_ALLOWED_ROOTS):
        issues.append({"level": "error", "type": "access_control_project_scope_roots_mismatch", "expected_allowed_roots": EXPECTED_ALLOWED_ROOTS, "actual_allowed_roots": normalize_list(access_scope_roots)})

    for agent_entry in yaml_agents:
        agent_entry = agent_entry if isinstance(agent_entry, dict) else {}
        agent_id = str(agent_entry.get("id") or "")
        if not agent_id:
            issues.append({"level": "error", "type": "missing_agent_id", "detail": "agent yaml file missing agent.id"})
            continue

        if agent_id not in registry_set:
            issues.append({"level": "error", "type": "registry_missing_agent", "agent_id": agent_id, "detail": "agent id is missing in agents_registry.yaml"})

        workflow_entry = workflow_map.get(agent_id)
        if not workflow_entry:
            issues.append({"level": "error", "type": "workflow_missing_agent", "agent_id": agent_id, "detail": "agent id is missing in agent_workflows.json"})

        access_entry = access_map.get(agent_id)
        if not access_entry:
            issues.append({"level": "error", "type": "access_control_missing_agent", "agent_id": agent_id, "detail": "agent id is missing in agent_access_control.json"})

        if not workflow_entry or not access_entry:
            continue

        yaml_scope_ref = str(agent_entry.get("project_scope_ref") or "")
        workflow_scope_ref = str(workflow_entry.get("project_scope_ref") or "")
        access_scope_ref = str(access_entry.get("project_scope_ref") or "")
        if not (yaml_scope_ref == EXPECTED_PROJECT_SCOPE_REF and workflow_scope_ref == EXPECTED_PROJECT_SCOPE_REF):
            issues.append({"level": "error", "type": "project_scope_ref_mismatch", "agent_id": agent_id, "expected": EXPECTED_PROJECT_SCOPE_REF, "yaml": yaml_scope_ref, "workflow": workflow_scope_ref})
        if access_scope_ref != EXPECTED_PROJECT_SCOPE_REF:
            issues.append({"level": "error", "type": "project_scope_ref_mismatch", "agent_id": agent_id, "expected": EXPECTED_PROJECT_SCOPE_REF, "access_control": access_scope_ref})

        resolved_allowed_paths = resolve_access_allowed_paths(access_entry, access_scope_roots)
        if not compare_array(resolved_allowed_paths, EXPECTED_ALLOWED_ROOTS):
            issues.append(
                {
                    "level": "error",
                    "type": "access_control_allowed_paths_mismatch",
                    "agent_id": agent_id,
                    "expected_allowed_paths": EXPECTED_ALLOWED_ROOTS,
                    "actual_allowed_paths": normalize_list(resolved_allowed_paths),
                    "allowed_paths_ref": str(access_entry.get("allowed_paths_ref") or ""),
                }
            )

        yaml_scope_guardrails = resolve_scope_guardrails(agent_entry, workflow_scope_guardrails_catalog)
        workflow_scope_guardrails = resolve_scope_guardrails(workflow_entry, workflow_scope_guardrails_catalog)
        if not compare_array(yaml_scope_guardrails, workflow_scope_guardrails):
            issues.append({"level": "error", "type": "scope_guardrails_mismatch", "agent_id": agent_id, "detail": "scope_guardrails differ between agent yaml and workflow entry"})
        yaml_scope_guardrails_ref = str(agent_entry.get("scope_guardrails_ref") or "")
        workflow_scope_guardrails_ref = str(workflow_entry.get("scope_guardrails_ref") or "")
        if yaml_scope_guardrails_ref and yaml_scope_guardrails_ref != EXPECTED_SCOPE_GUARDRAILS_REF:
            issues.append({"level": "error", "type": "scope_guardrails_ref_mismatch", "agent_id": agent_id, "expected": EXPECTED_SCOPE_GUARDRAILS_REF, "yaml": yaml_scope_guardrails_ref})
        if workflow_scope_guardrails_ref and workflow_scope_guardrails_ref != EXPECTED_SCOPE_GUARDRAILS_REF:
            issues.append({"level": "error", "type": "scope_guardrails_ref_mismatch", "agent_id": agent_id, "expected": EXPECTED_SCOPE_GUARDRAILS_REF, "workflow": workflow_scope_guardrails_ref})

        for field_name, field_type in (("role", "string"), ("controls_cap", "number"), ("startup_tool_cap", "number")):
            yaml_value = agent_entry.get(field_name)
            workflow_value = workflow_entry.get(field_name)
            access_value = access_entry.get(field_name)
            left = int(yaml_value or 0) if field_type == "number" else str(yaml_value or "")
            mid = int(workflow_value or 0) if field_type == "number" else str(workflow_value or "")
            right = int(access_value or 0) if field_type == "number" else str(access_value or "")
            if not (left == mid == right):
                issues.append({"level": "error", "type": "field_mismatch", "agent_id": agent_id, "field": field_name, "yaml": left, "workflow": mid, "access_control": right})

        if not compare_array(agent_entry.get("allowed_controls"), workflow_entry.get("allowed_controls")):
            issues.append({"level": "error", "type": "allowed_controls_mismatch", "agent_id": agent_id, "detail": "allowed_controls differ between agent yaml and workflow entry"})
        if not compare_array(agent_entry.get("allowed_controls"), access_entry.get("allowed_controls")):
            issues.append({"level": "error", "type": "allowed_controls_mismatch", "agent_id": agent_id, "detail": "allowed_controls differ between agent yaml and access control entry"})
        if not compare_array(agent_entry.get("startup_tools"), workflow_entry.get("startup_tools")):
            issues.append({"level": "error", "type": "startup_tools_mismatch", "agent_id": agent_id, "detail": "startup_tools differ between agent yaml and workflow entry"})
        if not compare_array(agent_entry.get("startup_tools"), access_entry.get("startup_tools")):
            issues.append({"level": "error", "type": "startup_tools_mismatch", "agent_id": agent_id, "detail": "startup_tools differ between agent yaml and access control entry"})

    yaml_ids = {str((agent_entry or {}).get("id") or "") for agent_entry in yaml_agents}
    for agent_id in registry_agents:
        if agent_id not in yaml_ids:
            issues.append({"level": "warn", "type": "registry_orphan_agent", "agent_id": agent_id, "detail": "agent id exists in registry but no matching yaml file was found"})

    for entry in workflow_list:
        agent_id = str((entry or {}).get("id") or "")
        if agent_id and agent_id not in yaml_ids:
            issues.append({"level": "warn", "type": "workflow_orphan_agent", "agent_id": agent_id, "detail": "agent id exists in workflow but no matching yaml file was found"})

    for agent_id in access_map.keys():
        if str(agent_id) not in yaml_ids:
            issues.append({"level": "warn", "type": "access_control_orphan_agent", "agent_id": agent_id, "detail": "agent id exists in access control but no matching yaml file was found"})

    workflow_index_path = workflow_load.get("paths", {}).get("index")
    workflow_index_relative = ""
    if workflow_index_path:
        workflow_index_relative = str(pathlib.Path(workflow_index_path).resolve().relative_to(root)).replace("\\", "/")

    return {
        "status": "fail" if any(item.get("level") == "error" for item in issues) else "pass",
        "root": str(root),
        "files": {
            "workflows": str(workflows_path.relative_to(root)).replace("\\", "/"),
            "workflow_index": workflow_index_relative,
            "registry": str(registry_path.relative_to(root)).replace("\\", "/"),
            "access_control": str(access_path.relative_to(root)).replace("\\", "/"),
        },
        "counts": counts,
        "issues": issues,
    }


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv or [])
    report = build_report()
    sys.stdout.write(f"{json.dumps(report, indent=2)}\n")
    return 1 if args["strict"] and report["status"] != "pass" else 0


if __name__ == "__main__":
    try:
        raise SystemExit(main(sys.argv[1:]))
    except Exception as error:
        sys.stderr.write(f"validate-agent-registry failed: {error}\n")
        raise SystemExit(1)
