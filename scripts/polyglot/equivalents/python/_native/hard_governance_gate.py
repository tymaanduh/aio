#!/usr/bin/env python3
"""Native Python implementation for scripts/hard-governance-gate.js."""

from __future__ import annotations

import json
import os
import pathlib
import sys
import tomllib
from datetime import UTC, datetime

import yaml

from _common import find_repo_root, normalize_path, run_python_equivalent_script, write_text_file_robust
from lib.routing_policy import read_routing_policy

DEFAULT_RULESET_FILE = pathlib.PurePosixPath("data/input/shared/main/hard_governance_ruleset.json")
DEFAULT_REPORT_FILE = pathlib.PurePosixPath("data/output/databases/polyglot-default/analysis/hard_governance_report.json")
DEFAULT_ROADMAP_FILE = pathlib.PurePosixPath("data/output/databases/polyglot-default/plan/automation_roadmap.md")
DEFAULT_BLUEPRINT_FILE = pathlib.PurePosixPath("data/output/databases/polyglot-default/plan/future_blueprint.md")


def parse_args(argv: list[str]) -> dict:
    args = {"strict": "--no-strict" not in argv, "enforce": "--enforce" in argv, "check": "--check" in argv, "codex_home": "", "ruleset_file": "", "report_file": "", "roadmap_file": "", "blueprint_file": ""}
    index = 0
    while index < len(argv):
        token = str(argv[index] or "")
        if token in {"--codex-home", "--ruleset-file", "--report-file", "--roadmap-file", "--blueprint-file"} and index + 1 < len(argv):
            key = token[2:].replace("-", "_")
            args[key] = str(argv[index + 1] or "").strip()
            index += 2
            continue
        index += 1
    return args


def text(value: object) -> str:
    return str(value or "").strip()


def issue(level: str, type_id: str, detail: str, **extra: object) -> dict:
    payload = {"level": level, "type": type_id, "detail": detail}
    payload.update(extra)
    return payload


def rel(root: pathlib.Path, file_path: pathlib.Path) -> str:
    return normalize_path(file_path.resolve().relative_to(root))


def read_json(file_path: pathlib.Path) -> dict:
    return json.loads(file_path.read_text(encoding="utf8"))


def read_yaml(file_path: pathlib.Path) -> dict:
    return yaml.safe_load(file_path.read_text(encoding="utf8")) or {}


def estimate_tokens(value: object) -> int:
    return max(1, (len(str(value or "")) + 3) // 4)


def parse_rrule(rrule: object) -> dict:
    parts = {}
    for item in str(rrule or "").split(";"):
        key, _, value = str(item or "").partition("=")
        key = text(key).upper()
        value = text(value)
        if key and value:
            parts[key] = value
    days = [text(day).upper() for day in parts.get("BYDAY", "").split(",") if text(day)] or ["MO", "TU", "WE", "TH", "FR", "SA", "SU"]
    hours = []
    for item in parts.get("BYHOUR", "").split(","):
        try:
            hours.append(int(text(item)))
        except Exception:
            continue
    return {"freq": text(parts.get("FREQ")).upper(), "days": days, "hours": hours}


def read_automations(codex_home: pathlib.Path) -> dict:
    root = codex_home / "automations"
    rows = []
    if not root.exists():
        return {"root": normalize_path(root), "rows": rows, "exists": False}
    for entry in sorted(root.iterdir(), key=lambda item: item.name.lower()):
        toml_path = entry / "automation.toml"
        if not entry.is_dir() or not toml_path.exists():
            continue
        try:
            parsed = tomllib.loads(toml_path.read_text(encoding="utf8"))
        except Exception:
            parsed = {}
        prompt = text(parsed.get("prompt"))
        rrule = text(parsed.get("rrule"))
        rows.append({"id": entry.name, "name": text(parsed.get("name")), "status": text(parsed.get("status")), "prompt": prompt, "rrule": rrule, "prompt_tokens_estimate": estimate_tokens(prompt), "parsed_rrule": parse_rrule(rrule)})
    return {"root": normalize_path(root), "rows": rows, "exists": True}


def split_issues(payload: dict) -> tuple[list[dict], list[dict]]:
    issues = payload.get("issues") if isinstance(payload.get("issues"), list) else []
    return ([item for item in issues if isinstance(item, dict) and item.get("level") == "error"], [item for item in issues if isinstance(item, dict) and item.get("level") == "warn"])


def run_json_subcheck(root: pathlib.Path, script_relative: str, script_args: list[str]) -> dict:
    completed = run_python_equivalent_script(script_relative, script_args, root=root)
    try:
        payload = json.loads(str(completed.stdout or "").strip() or "{}")
    except Exception:
        payload = {"status": "fail", "issues": [issue("error", "subcheck_invalid_json", "subcheck did not emit json")]}
    payload["_status_code"] = int(completed.returncode or 0)
    return payload


def analyze_routing(routing_doc: dict, ruleset: dict, report: dict) -> None:
    keyword_rules = routing_doc.get("keyword_rules") if isinstance(routing_doc.get("keyword_rules"), list) else []
    keyword_map, signatures, duplicate_keywords = {}, {}, 0
    routing_rules = ruleset.get("routing") if isinstance(ruleset.get("routing"), dict) else {}
    for rule_index, rule in enumerate(keyword_rules):
        skills = sorted([text(item) for item in (rule.get("skills") if isinstance(rule, dict) else []) or [] if text(item)])
        signature = "|".join(skills)
        signatures.setdefault(signature, []).append(rule_index)
        keywords = [text(item).lower() for item in (rule.get("keywords") if isinstance(rule, dict) else []) or [] if text(item)]
        for keyword in keywords:
            existing = keyword_map.get(keyword)
            if existing is None:
                keyword_map[keyword] = {"signature": signature, "rule_index": rule_index}
                continue
            duplicate_keywords += 1
            if routing_rules.get("forbid_keyword_collisions") is True and existing["signature"] != signature:
                report["issues"].append(issue("error", "routing_keyword_collision", "keyword maps to different skill stacks", keyword=keyword, first_rule_index=existing["rule_index"], second_rule_index=rule_index))
            elif routing_rules.get("warn_on_redundant_keyword_rules") is True:
                report["issues"].append(issue("warn", "routing_redundant_keyword", "keyword repeats with equivalent skill stack", keyword=keyword, first_rule_index=existing["rule_index"], second_rule_index=rule_index))
    if routing_rules.get("warn_on_duplicate_skill_stacks") is True:
        for signature, rule_indexes in signatures.items():
            if signature and len(rule_indexes) > 1:
                report["issues"].append(issue("warn", "routing_duplicate_skill_stack", "multiple keyword rules share identical skill stack", rule_indexes=rule_indexes, skill_stack_signature=signature))
    report["metrics"]["routing"] = {"keyword_rules": len(keyword_rules), "duplicate_keywords": duplicate_keywords}


def analyze_agents(workflow_doc: dict, registry_doc: dict, ruleset: dict, report: dict) -> None:
    agents = workflow_doc.get("agents") if isinstance(workflow_doc.get("agents"), list) else []
    agent_rules = ruleset.get("agents") if isinstance(ruleset.get("agents"), dict) else {}
    seen_ids, missing_hard_gate = set(), 0
    for index, agent in enumerate(agents):
        agent_id = text(agent.get("id") if isinstance(agent, dict) else "")
        if not agent_id:
            report["issues"].append(issue("error", "missing_agent_id", "agent_workflows entry is missing id", index=index))
            continue
        if agent_id in seen_ids:
            report["issues"].append(issue("error", "duplicate_agent_id", "duplicate agent id in workflow metadata", agent_id=agent_id))
        seen_ids.add(agent_id)
        blocking_checks = [text(item) for item in (agent.get("blocking_checks") if isinstance(agent, dict) else []) or [] if text(item)]
        if agent_rules.get("require_blocking_checks") is True and not blocking_checks:
            report["issues"].append(issue("error", "missing_blocking_checks", "agent is missing blocking checks", agent_id=agent_id))
        if agent_rules.get("require_hard_governance_gate") is True and not any(__import__("re").search(r"hard governance gate|governance:hard:gate|automation governance", entry, __import__("re").I) for entry in blocking_checks):
            missing_hard_gate += 1
            report["issues"].append(issue("error", "missing_hard_governance_gate_check", "agent blocking checks missing hard governance gate", agent_id=agent_id))
        workflow_lines = [text(item) for item in (agent.get("workflow") if isinstance(agent, dict) else []) or [] if text(item)]
        if len(workflow_lines) != len({entry.lower() for entry in workflow_lines}):
            report["issues"].append(issue("warn", "duplicate_agent_workflow_lines", "agent workflow contains repeated lines", agent_id=agent_id))
    project_scope = registry_doc.get("project_scope") if isinstance(registry_doc.get("project_scope"), dict) else {}
    ruleset_scope = ruleset.get("project_scope") if isinstance(ruleset.get("project_scope"), dict) else {}
    if text(ruleset_scope.get("project_id")) and text(project_scope.get("project_id")) != text(ruleset_scope.get("project_id")):
        report["issues"].append(issue("error", "registry_project_id_mismatch", "agents registry project_scope.project_id mismatch", expected=text(ruleset_scope.get("project_id")), actual=text(project_scope.get("project_id"))))
    if text(ruleset_scope.get("project_name")) and text(project_scope.get("project_name")) != text(ruleset_scope.get("project_name")):
        report["issues"].append(issue("error", "registry_project_name_mismatch", "agents registry project_scope.project_name mismatch", expected=text(ruleset_scope.get("project_name")), actual=text(project_scope.get("project_name"))))
    report["metrics"]["agents"] = {"total": len(agents), "missing_hard_gate_checks": missing_hard_gate}


def analyze_automations(automation_data: dict, ruleset: dict, report: dict) -> None:
    if not automation_data.get("exists"):
        report["issues"].append(issue("warn", "automation_root_missing", "codex automations root is missing; automation checks skipped", root=automation_data.get("root")))
        report["metrics"]["automations"] = {"total": 0, "active": 0, "duplicate_signatures": 0}
        return
    rows = automation_data.get("rows") if isinstance(automation_data.get("rows"), list) else []
    active = [row for row in rows if text(row.get("status")).upper() == "ACTIVE"]
    automation_rules = ruleset.get("automation") if isinstance(ruleset.get("automation"), dict) else {}
    required_days = [text(item).upper() for item in automation_rules.get("required_days", []) or [] if text(item)]
    required_hours = []
    for item in automation_rules.get("required_hours", []) or []:
        try:
            required_hours.append(int(item))
        except Exception:
            continue
    duplicate_map, day_coverage, duplicate_signatures = {}, {day: set() for day in required_days}, 0
    for row in active:
        signature = "|".join([text(row.get("name")).lower(), text(row.get("rrule")), text(row.get("prompt"))])
        duplicate_map.setdefault(signature, []).append(str(row.get("id") or ""))
        if automation_rules.get("require_command_first_prompt") is True and not text(row.get("prompt")).startswith("Run "):
            report["issues"].append(issue("error", "automation_prompt_not_command_first", "active automation prompt must start with 'Run'", id=row.get("id")))
        max_prompt_tokens = automation_rules.get("max_prompt_tokens")
        if isinstance(max_prompt_tokens, (int, float)) and int(row.get("prompt_tokens_estimate") or 0) > int(max_prompt_tokens):
            report["issues"].append(issue("error", "automation_prompt_budget_exceeded", "active automation prompt exceeds token budget", id=row.get("id"), prompt_tokens_estimate=row.get("prompt_tokens_estimate"), max_prompt_tokens=int(max_prompt_tokens)))
        parsed_rrule = row.get("parsed_rrule") if isinstance(row.get("parsed_rrule"), dict) else {}
        parsed_days = parsed_rrule.get("days") if isinstance(parsed_rrule.get("days"), list) and parsed_rrule.get("days") else required_days
        parsed_hours = parsed_rrule.get("hours") if isinstance(parsed_rrule.get("hours"), list) else []
        for day in parsed_days:
            day_coverage.setdefault(str(day), set())
            for hour in parsed_hours:
                try:
                    day_coverage[str(day)].add(int(hour))
                except Exception:
                    continue
    for ids in duplicate_map.values():
        if len(ids) > 1:
            duplicate_signatures += 1
            report["issues"].append(issue("error", "duplicate_automation_signature", "automation has duplicate name/rrule/prompt signature", ids=ids))
    min_active = automation_rules.get("min_active_automations")
    if isinstance(min_active, (int, float)) and len(active) < int(min_active):
        report["issues"].append(issue("error", "insufficient_active_automations", "active automation count is below minimum", active_count=len(active), min_active_automations=int(min_active)))
    for day in required_days:
        for hour in required_hours:
            if hour not in day_coverage.get(day, set()):
                report["issues"].append(issue("error", "automation_schedule_gap", "required schedule slot is not covered", day=day, hour=hour))
    report["metrics"]["automations"] = {"total": len(rows), "active": len(active), "duplicate_signatures": duplicate_signatures}


def check_required_workflow_scripts(package_json: dict, ruleset: dict, report: dict) -> None:
    scripts = package_json.get("scripts") if isinstance(package_json.get("scripts"), dict) else {}
    workflow_rules = ruleset.get("workflow") if isinstance(ruleset.get("workflow"), dict) else {}
    for script_name in workflow_rules.get("required_npm_scripts", []) or []:
        if text(script_name) and text(script_name) not in scripts:
            report["issues"].append(issue("error", "missing_required_npm_script", "required npm script is missing", script=script_name))


def check_required_standards_catalogs(root: pathlib.Path, ruleset: dict, report: dict) -> None:
    standards_rules = ruleset.get("standards") if isinstance(ruleset.get("standards"), dict) else {}
    for catalog_path in [text(item) for item in standards_rules.get("required_catalogs", []) or [] if text(item)]:
        absolute = (root / pathlib.PurePosixPath(catalog_path.replace("\\", "/"))).resolve()
        if not absolute.exists():
            report["issues"].append(issue("error", "missing_required_standards_catalog", "required standards catalog is missing", catalog=catalog_path))
            continue
        try:
            json.loads(absolute.read_text(encoding="utf8"))
        except Exception as error:
            report["issues"].append(issue("error", "invalid_required_standards_catalog", "required standards catalog is not valid json", catalog=catalog_path, error=str(error)))


def add_subcheck_metric(report: dict, key: str, payload: dict, report_file: str, **extra: object) -> tuple[list[dict], list[dict]]:
    errors, warnings = split_issues(payload)
    metric = {"status": payload.get("status"), "errors": len(errors), "warnings": len(warnings), "report_file": report_file}
    metric.update(extra)
    report["metrics"][key] = metric
    return errors, warnings


def run_stage_subchecks(root: pathlib.Path, report: dict) -> None:
    payload = run_json_subcheck(root, "scripts/validate-workflow-pipeline-order.js", ["--check"])
    errors, warnings = add_subcheck_metric(report, "workflow_pipeline_order", payload, "data/output/databases/polyglot-default/analysis/workflow_pipeline_order_report.json")
    if payload.get("status") != "pass":
        report["issues"].append(issue("error", "workflow_pipeline_order_gate_failed", "workflow pipeline order gate did not pass", error_count=len(errors), warning_count=len(warnings)))
    elif warnings:
        report["issues"].append(issue("warn", "workflow_pipeline_order_gate_warnings", "workflow pipeline order gate passed with warnings", warning_count=len(warnings)))

    payload = run_json_subcheck(root, "scripts/standards-baseline-gate.js", ["--check"])
    errors, warnings = add_subcheck_metric(report, "standards_baseline", payload, "data/output/databases/polyglot-default/analysis/standards_baseline_report.json")
    if payload.get("status") != "pass":
        report["issues"].append(issue("error", "standards_baseline_gate_failed", "standards baseline gate did not pass; resolve naming/storage/optimization issues", error_count=len(errors), warning_count=len(warnings)))
    elif warnings:
        report["issues"].append(issue("warn", "standards_baseline_gate_warnings", "standards baseline gate passed with warnings", warning_count=len(warnings)))

    payload = run_json_subcheck(root, "scripts/iso-standards-compliance-gate.js", ["--check"])
    metrics = payload.get("metrics") if isinstance(payload.get("metrics"), dict) else {}
    errors, warnings = add_subcheck_metric(report, "iso_standards_compliance", payload, "data/output/databases/polyglot-default/analysis/iso_standards_compliance_checklist.json", checklist_markdown_file="data/output/databases/polyglot-default/analysis/iso_standards_compliance_checklist.md", total_standards=int(metrics.get("total_standards") or 0), passed_standards=int(metrics.get("passed_standards") or 0), failed_standards=int(metrics.get("failed_standards") or 0))
    if payload.get("status") != "pass":
        report["issues"].append(issue("error", "iso_standards_compliance_gate_failed", "iso standards compliance gate did not pass", error_count=len(errors), warning_count=len(warnings)))
    elif warnings:
        report["issues"].append(issue("warn", "iso_standards_compliance_gate_warnings", "iso standards compliance gate passed with warnings", warning_count=len(warnings)))

    payload = run_json_subcheck(root, "scripts/generate-uiux-blueprint.js", ["--check"])
    errors, warnings = add_subcheck_metric(report, "ui_ux_blueprint", payload, "data/output/databases/polyglot-default/analysis/uiux_blueprint_report.json", blueprint_file="data/output/databases/polyglot-default/plan/ui_ux_blueprint.md")
    if payload.get("status") != "pass":
        report["issues"].append(issue("error", "uiux_blueprint_gate_failed", "ui ux blueprint gate did not pass", error_count=len(errors), warning_count=len(warnings)))
    elif warnings:
        report["issues"].append(issue("warn", "uiux_blueprint_gate_warnings", "ui ux blueprint gate passed with warnings", warning_count=len(warnings)))


def build_suggestions(report: dict) -> list[str]:
    errors = [item for item in report["issues"] if item.get("level") == "error"]
    warnings = [item for item in report["issues"] if item.get("level") == "warn"]
    suggestions = []
    if any(item.get("type") == "missing_hard_governance_gate_check" for item in errors):
        suggestions.append("Run npm run agents:scope-sync to propagate hard governance gate checks across agent metadata.")
    if any(item.get("type") == "routing_keyword_collision" for item in errors):
        suggestions.append("Consolidate conflicting keyword rules in to-do/skills/repeat_action_routing.json to one skill stack per keyword.")
    if any(item.get("type") == "automation_schedule_gap" for item in errors):
        suggestions.append("Update automation contracts to close required condition-gated coverage gaps.")
    if any(item.get("type") == "registry_project_id_mismatch" for item in errors):
        suggestions.append("Normalize to-do/agents/agents_registry.yaml project_scope to AIO naming.")
    if any(item.get("type") == "standards_baseline_gate_failed" for item in errors):
        suggestions.append("Run npm run standards:baseline:gate and resolve all naming/storage/optimization failures.")
    if any(item.get("type") == "workflow_pipeline_order_gate_failed" for item in errors):
        suggestions.append("Run npm run workflow:order:gate and restore canonical stage/gate order before continuing.")
    if any(item.get("type") == "iso_standards_compliance_gate_failed" for item in errors):
        suggestions.append("Run npm run standards:iso:gate and restore missing compliance evidence links for failing standards.")
    if any(item.get("type") == "uiux_blueprint_gate_failed" for item in errors):
        suggestions.append("Run npm run uiux:blueprint:check and resolve UI UX catalog coverage gaps.")
    if warnings:
        suggestions.append("Merge redundant routing rules and duplicate workflow lines to reduce token and maintenance cost.")
    return suggestions or ["Keep governance gate active in workflow and refactor gates to maintain first-time-right execution."]


def build_roadmap_markdown(report: dict) -> str:
    errors = [item for item in report["issues"] if item.get("level") == "error"]
    warnings = [item for item in report["issues"] if item.get("level") == "warn"]
    lines = ["# Automation Roadmap", "", f"- Status: {str(report.get('status') or '').upper()}", f"- Errors: {len(errors)}", f"- Warnings: {len(warnings)}", "", "## Trigger: Gate Failures (Immediate)"]
    if errors:
        for item in errors[:10]:
            lines.append(f"- Resolve {item.get('type')}: {item.get('detail')}")
    else:
        lines.append("- Keep current governance gate configuration locked and monitored.")
    lines.extend(["", "## Trigger: Warning Drift (Continuous)"])
    if warnings:
        for item in warnings[:10]:
            lines.append(f"- Reduce {item.get('type')}: {item.get('detail')}")
    else:
        lines.append("- Expand automated checks only when new repetition patterns appear.")
    lines.extend(["", "## Trigger: Capability Expansion (On Demand)", "- Add new automation slots only through hard ruleset updates.", "- Keep skill/agent metadata aligned with governance policies in the same change pass.", "- Track token and completion-time deltas in each gate-triggered run.", "", "## Suggested Actions"])
    for item in report.get("suggestions", []):
        lines.append(f"- {item}")
    lines.append("")
    return "\n".join(lines)


def build_future_blueprint_markdown(report: dict, ruleset: dict) -> str:
    automation_rules = ruleset.get("automation") if isinstance(ruleset.get("automation"), dict) else {}
    lines = [
        "# Future Blueprint",
        "",
        "## Architecture Direction",
        "- Keep automation policy machine-readable in one ruleset file.",
        "- Keep automations condition-gated and event-driven (no day/time wave dependency).",
        "- Keep workflow stages fail-fast; never defer governance failures.",
        "- Keep prompts command-first, token-bounded, and deduplicated.",
        "- Keep neutral-core contracts machine-readable and make direct-generated runtimes the canonical cross-language surface.",
        "- Keep storage and shell behavior behind versioned contracts, not repo-wide JS proxy equivalents.",
        "",
        "## Non-Negotiable Contracts",
        f"- Active automations minimum: {int(automation_rules.get('min_active_automations') or 0)}",
        f"- Prompt token cap: {int(automation_rules.get('max_prompt_tokens') or 0)}",
        f"- Command-first prompts: {'required' if automation_rules.get('require_command_first_prompt') is True else 'optional'}",
        f"- Condition-gated automation mode: {'required' if automation_rules.get('condition_gated_mode') is True else 'optional'}",
        "- Agent workflows must include hard governance gate checks.",
        "- Routing keywords must map deterministically to one skill stack.",
        "- Workflow pipeline order must match data/input/shared/main/workflow_execution_pipeline.json.",
        "- ISO standards compliance checklist must pass with evidence links for every standard row.",
        "- UI UX blueprint catalog must pass semantic color, ergonomics, preference, and measurement checks.",
        "- UI component taxonomy, rendering policy, search policy, memory lifecycle policy, and AI safety policy catalogs must remain present and schema-valid.",
        "- Stage runtime selection must remain benchmark-evidence-driven (no default-runtime bias).",
        "- Neutral core catalogs and runtime implementation manifests must remain present and schema-valid.",
        "- Math core production runtimes must stay direct-generated across JavaScript, Python, C++, and Ruby.",
        "",
        "## Expansion Plan",
        "- Add new capabilities only when they can be enforced by deterministic validators.",
        "- Gate every new skill/agent/routing change through governance + efficiency + refactor checks.",
        "- Keep roadmap and blueprint artifacts updated from each governance run.",
        "- Expand shell implementations from the shared ABI without changing domain or storage contracts.",
        "- Add new runtime backends only when benchmark evidence and conformance coverage are published.",
        "",
        "## Current Governance Suggestions",
    ]
    for item in report.get("suggestions", []):
        lines.append(f"- {item}")
    lines.append("")
    return "\n".join(lines)


def analyze(root: pathlib.Path, args: dict) -> dict:
    ruleset_path = (root / pathlib.PurePosixPath(str(args.get("ruleset_file") or DEFAULT_RULESET_FILE))).resolve()
    report_path = (root / pathlib.PurePosixPath(str(args.get("report_file") or DEFAULT_REPORT_FILE))).resolve()
    roadmap_path = (root / pathlib.PurePosixPath(str(args.get("roadmap_file") or DEFAULT_ROADMAP_FILE))).resolve()
    blueprint_path = (root / pathlib.PurePosixPath(str(args.get("blueprint_file") or DEFAULT_BLUEPRINT_FILE))).resolve()
    codex_home = pathlib.Path(str(args.get("codex_home") or os.environ.get("CODEX_HOME") or (pathlib.Path.home() / ".codex"))).resolve()
    report = {"status": "pass", "generated_at": datetime.now(UTC).isoformat().replace("+00:00", "Z"), "root": normalize_path(root), "inputs": {"ruleset_file": rel(root, ruleset_path), "codex_home": normalize_path(codex_home)}, "outputs": {"report_file": rel(root, report_path), "roadmap_file": rel(root, roadmap_path), "blueprint_file": rel(root, blueprint_path)}, "metrics": {}, "issues": [], "suggestions": []}
    if not ruleset_path.exists():
        report["issues"].append(issue("error", "missing_ruleset_file", "hard governance ruleset file is missing", path=str(ruleset_path)))
        report["status"] = "fail"
        return report
    try:
        ruleset = read_json(ruleset_path)
        package_json = read_json(root / "package.json")
        routing_doc = read_routing_policy(root).get("doc") or {}
        workflow_doc = read_json(root / "to-do" / "skills" / "agent_workflows.json")
        registry_doc = read_yaml(root / "to-do" / "agents" / "agents_registry.yaml")
    except Exception as error:
        report["issues"].append(issue("error", "governance_input_read_failed", "unable to parse governance source inputs", error=str(error)))
        report["status"] = "fail"
        return report
    check_required_workflow_scripts(package_json, ruleset, report)
    check_required_standards_catalogs(root, ruleset, report)
    run_stage_subchecks(root, report)
    analyze_routing(routing_doc, ruleset, report)
    analyze_agents(workflow_doc, registry_doc, ruleset, report)
    analyze_automations(read_automations(codex_home), ruleset, report)
    report["suggestions"] = build_suggestions(report)
    report["status"] = "fail" if any(item.get("level") == "error" for item in report["issues"]) else "pass"
    return report


def write_outputs(root: pathlib.Path, report: dict, args: dict) -> None:
    if args.get("check"):
        return
    report_path = (root / pathlib.PurePosixPath(str(args.get("report_file") or DEFAULT_REPORT_FILE))).resolve()
    roadmap_path = (root / pathlib.PurePosixPath(str(args.get("roadmap_file") or DEFAULT_ROADMAP_FILE))).resolve()
    blueprint_path = (root / pathlib.PurePosixPath(str(args.get("blueprint_file") or DEFAULT_BLUEPRINT_FILE))).resolve()
    ruleset_path = (root / pathlib.PurePosixPath(str(args.get("ruleset_file") or DEFAULT_RULESET_FILE))).resolve()
    try:
        ruleset = read_json(ruleset_path)
    except Exception:
        ruleset = {}
    write_text_file_robust(report_path, f"{json.dumps(report, indent=2)}\n", atomic=False)
    write_text_file_robust(roadmap_path, build_roadmap_markdown(report) + "\n", atomic=False)
    write_text_file_robust(blueprint_path, build_future_blueprint_markdown(report, ruleset) + "\n", atomic=False)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(list(argv or []))
    root = find_repo_root(pathlib.Path(__file__))
    report = analyze(root, args)
    write_outputs(root, report, args)
    sys.stdout.write(f"{json.dumps(report, indent=2)}\n")
    return 1 if args.get("strict") and (args.get("enforce") or args.get("check")) and report.get("status") != "pass" else 0


if __name__ == "__main__":
    try:
        raise SystemExit(main(sys.argv[1:]))
    except SystemExit:
        raise
    except Exception as error:
        sys.stderr.write(f"hard-governance-gate failed: {error}\n")
        raise SystemExit(1)
