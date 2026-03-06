#!/usr/bin/env python3
"""Native Python implementation for scripts/sync-agent-skill-scope.js."""

from __future__ import annotations

import json
import pathlib
import re
import sys
from typing import Any

import yaml

from agent_access_policy_native import compact_access_policy
from agent_workflow_shards_native import ensure_shards_current
from routing_policy_native import compact_routing_doc, dedupe_case_insensitive, normalize_skills, resolve_routing_doc, skill_signature

ROOT = pathlib.Path(__file__).resolve().parents[5]
ALLOWED_ROOTS = [
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
ALLOWED_ROOTS_REF = "source://project_scope#allowed_roots"
SCOPE_GUARDRAILS = [
    "Stay in aio project scope only.",
    "Keep wrapper flow two-pass: identify_arguments -> execute_pipeline.",
    "Run governance:hard:gate, standards:baseline:gate, and agents:validate after metadata changes.",
]
SCOPE_GUARDRAILS_REF = "source://scope_guardrails#default"
PROJECT_SCOPE_REF = "source://project_scope"
DEFAULT_SCOPE_PROMPT = "Stay in aio project scope only."
HARD_GOVERNANCE_BLOCKING_CHECK = "Hard governance gate passes (npm run governance:hard:gate)."
HARD_GOVERNANCE_WORKFLOW_LINE = "Run npm run governance:hard:gate and stop on failures before completion."
HARD_GOVERNANCE_ROUTING_KEYWORDS = [
    "hard governance",
    "hard governance gate",
    "automation governance",
    "schedule dedupe",
    "automation roadmap blueprint",
    "standards baseline",
    "naming policy baseline",
    "data storage baseline",
    "optimization baseline",
]
HARD_GOVERNANCE_ROUTING_PATHS = [
    "scripts/hard-governance-gate.js",
    "scripts/standards-baseline-gate.js",
    "scripts/optimize-codex-automations.js",
    "data/input/shared/main/hard_governance_ruleset.json",
    "data/input/shared/main/executive_engineering_baseline.json",
    "data/input/shared/main/polyglot_engineering_standards_catalog.json",
    "data/input/shared/main/iso_standards_traceability_catalog.json",
    "data/output/databases/polyglot-default/plan/automation_roadmap.md",
    "data/output/databases/polyglot-default/plan/future_blueprint.md",
]
HARD_GOVERNANCE_ROUTING_SKILLS = [
    "polyglot-default-orchestrator",
    "agent-skill-review-research",
    "agent-skill-decision-editor",
    "refactor-blocking-gate",
]


def read_text(file_path: pathlib.Path) -> str:
    return file_path.read_text(encoding="utf8")


def write_text(file_path: pathlib.Path, text: str) -> None:
    file_path.write_text(f"{str(text).replace('\r\n', '\n').rstrip()}\n", encoding="utf8")


def read_json(file_path: pathlib.Path) -> Any:
    return json.loads(read_text(file_path))


def write_json(file_path: pathlib.Path, value: Any) -> None:
    file_path.write_text(f"{json.dumps(value, indent=2)}\n", encoding="utf8")


def dump_yaml(value: Any) -> str:
    return yaml.safe_dump(value, sort_keys=False, indent=2, width=120, allow_unicode=False).rstrip()


def normalize_string(value: Any) -> str:
    return str(value or "").strip()


def normalize_rule_value(value: Any) -> str:
    return normalize_string(value).lower()


def ensure_hard_governance_agent_contract(agent: Any) -> dict[str, Any]:
    next_agent = dict(agent) if isinstance(agent, dict) else {}
    checks = dedupe_case_insensitive(next_agent.get("blocking_checks"))
    workflow_lines = dedupe_case_insensitive(next_agent.get("workflow"))
    if not any(re.search(r"governance:hard:gate|hard governance gate|automation governance", entry, re.IGNORECASE) for entry in checks):
        checks.append(HARD_GOVERNANCE_BLOCKING_CHECK)
    if not any(re.search(r"governance:hard:gate|hard governance", entry, re.IGNORECASE) for entry in workflow_lines):
        workflow_lines.append(HARD_GOVERNANCE_WORKFLOW_LINE)
    next_agent["blocking_checks"] = checks
    next_agent["workflow"] = workflow_lines
    return next_agent


def ensure_keyword_rule(doc: dict[str, Any], keywords: list[str], skills: list[str]) -> None:
    if not isinstance(doc.get("keyword_rules"), list):
        doc["keyword_rules"] = []
    desired_skills = normalize_skills(skills)
    desired_signature = skill_signature(desired_skills)
    if not desired_signature:
        return

    target_index = -1
    for index, rule in enumerate(doc["keyword_rules"]):
        if skill_signature((rule or {}).get("skills")) == desired_signature:
            target_index = index
            break
    if target_index < 0:
        target_index = len(doc["keyword_rules"])
        doc["keyword_rules"].append({"keywords": [], "skills": desired_skills})

    ownership: dict[str, dict[str, Any]] = {}
    for rule_index, rule in enumerate(doc["keyword_rules"]):
        signature = skill_signature((rule or {}).get("skills"))
        for keyword in (rule.get("keywords") if isinstance(rule, dict) and isinstance(rule.get("keywords"), list) else []):
            key = normalize_rule_value(keyword)
            if key and key not in ownership:
                ownership[key] = {"rule_index": rule_index, "signature": signature}

    target_rule = doc["keyword_rules"][target_index]
    target_rule["skills"] = desired_skills
    merged_keywords = dedupe_case_insensitive(target_rule.get("keywords"))
    for keyword in normalize_skills(keywords):
        key = keyword.lower()
        owner = ownership.get(key)
        if owner and owner.get("signature") != desired_signature:
            continue
        if not any(existing.lower() == key for existing in merged_keywords):
            merged_keywords.append(keyword)
    target_rule["keywords"] = merged_keywords


def ensure_path_rule(doc: dict[str, Any], paths: list[str], skills: list[str]) -> None:
    if not isinstance(doc.get("path_rules"), list):
        doc["path_rules"] = []
    desired_skills = normalize_skills(skills)
    desired_signature = skill_signature(desired_skills)
    if not desired_signature:
        return

    target_index = -1
    for index, rule in enumerate(doc["path_rules"]):
        if skill_signature((rule or {}).get("skills")) == desired_signature:
            target_index = index
            break
    if target_index < 0:
        target_index = len(doc["path_rules"])
        doc["path_rules"].append({"paths": [], "skills": desired_skills})

    target_rule = doc["path_rules"][target_index]
    target_rule["skills"] = desired_skills
    merged_paths = dedupe_case_insensitive(target_rule.get("paths"))
    for entry_path in normalize_skills(paths):
        if not any(existing.lower() == entry_path.lower() for existing in merged_paths):
            merged_paths.append(entry_path)
    target_rule["paths"] = merged_paths


def title_case_skill_name(skill_name: str) -> str:
    return " ".join(part[:1].upper() + part[1:] for part in str(skill_name or "").split("-") if part)


def build_default_prompt(current_prompt: Any, skill_name: str) -> str:
    del current_prompt
    clean_skill_name = str(skill_name or "").strip()
    required_skill_token = f"${clean_skill_name}" if clean_skill_name else ""
    if not required_skill_token or required_skill_token == "$":
        return DEFAULT_SCOPE_PROMPT
    return f"Use {required_skill_token} for this task. {DEFAULT_SCOPE_PROMPT}"


def ensure_agent_yaml_scope(file_path: pathlib.Path) -> None:
    text = read_text(file_path).replace("\r\n", "\n")
    text = text.replace(
        "Dispatch directly to dictionary-thesaurus-expander-agent.",
        "Run dictionary-thesaurus-expander skill stage.",
    ).replace(
        "Dispatch directly to word-machine-descriptor-agent.",
        "Run word-machine-descriptor-compiler skill stage.",
    ).replace(
        "Dispatch directly to dictionary-machine-quality-gate-agent.",
        "Run dictionary-machine-quality-gate skill stage.",
    )

    parsed = yaml.safe_load(text) or {}
    source = dict(parsed) if isinstance(parsed, dict) else {}
    agent = dict(source.get("agent") or {}) if isinstance(source.get("agent"), dict) else {}
    agent["project_scope_ref"] = PROJECT_SCOPE_REF
    agent["scope_guardrails_ref"] = SCOPE_GUARDRAILS_REF
    agent.pop("scope_guardrails", None)
    hardened_agent = ensure_hard_governance_agent_contract(agent)
    runtime_contract = dict(hardened_agent.get("runtime_contract") or {}) if isinstance(hardened_agent.get("runtime_contract"), dict) else {}
    runtime_contract["allowed_runtime_roots"] = ["brain/", "data/input/", "data/output/", "to-do/"]
    runtime_contract["editable_project_roots"] = list(ALLOWED_ROOTS)
    runtime_contract["no_external_targets"] = True
    hardened_agent["runtime_contract"] = runtime_contract
    source["agent"] = hardened_agent
    write_text(file_path, dump_yaml(source))


def ensure_openai_yaml_scope(file_path: pathlib.Path, skill_name: str) -> None:
    parsed = yaml.safe_load(read_text(file_path)) or {}
    source = dict(parsed) if isinstance(parsed, dict) else {}
    source_interface = dict(source.get("interface") or {}) if isinstance(source.get("interface"), dict) else {}
    source_policy = dict(source.get("policy") or {}) if isinstance(source.get("policy"), dict) else {}
    source_dependencies = dict(source.get("dependencies") or {}) if isinstance(source.get("dependencies"), dict) else None

    sanitized_interface = {
        "display_name": str(source_interface.get("display_name") or title_case_skill_name(skill_name) or "Skill"),
        "short_description": str(source_interface.get("short_description") or f"Run {skill_name} workflow."),
        "default_prompt": build_default_prompt(source_interface.get("default_prompt"), skill_name),
    }
    for field_name in ("icon_small", "icon_large", "brand_color"):
        value = source_interface.get(field_name)
        if isinstance(value, str) and value.strip():
            sanitized_interface[field_name] = value.strip()

    next_doc = {"interface": sanitized_interface}
    if source_dependencies:
        next_doc["dependencies"] = source_dependencies
    next_doc["policy"] = {"allow_implicit_invocation": source_policy.get("allow_implicit_invocation") is not False}
    write_text(file_path, dump_yaml(next_doc))


def ensure_skill_markdown_scope(file_path: pathlib.Path) -> None:
    text = read_text(file_path).replace("\r\n", "\n").rstrip()
    if "## Project Scope Guardrails" not in text:
        text = (
            f"{text}\n\n## Project Scope Guardrails\n\n"
            "- Keep changes inside `app/`, `brain/`, `data/input/`, `data/output/`, `main/`, `renderer/`, `scripts/`, `tests/`, and `to-do/`.\n"
            "- Keep runtime logic in `brain/*`; keep catalogs/specs in `data/input/*`; keep generated artifacts/logs in `data/output/*`.\n"
            "- Do not introduce cloud/deployment/provider workflows unless explicitly requested.\n"
            "- Preserve the two-pass wrapper contract (`identify_arguments` before `execute_pipeline`) when touching wrapper flows.\n"
            "- Run `npm run standards:baseline:gate` for naming/storage/optimization policy checks when editing governance or architecture metadata.\n"
            "- Use `data/input/shared/main/executive_engineering_baseline.json` as policy source for engineering decisions.\n"
            "- Re-run `npm run agents:validate` after agent/skill metadata changes.\n"
        )
    write_text(file_path, text)


def update_agent_workflows_json(file_path: pathlib.Path) -> None:
    doc = read_json(file_path)
    doc["project_scope"] = {
        "project_id": "aio",
        "project_name": "AIO",
        "policy_version": "2026-03-05",
        "allowed_roots": list(ALLOWED_ROOTS),
        "runtime_contract": {
            "wrapper_execution_mode": "two_pass_single_wrapper",
            "brain_root": "brain/",
            "data_input_root": "data/input/",
            "data_output_root": "data/output/",
            "todo_root": "to-do/",
        },
    }
    doc["scope_guardrails_catalog"] = {"default": list(SCOPE_GUARDRAILS)}
    if isinstance(doc.get("agents"), list):
        next_agents = []
        for raw_agent in doc["agents"]:
            next_agent = dict(raw_agent) if isinstance(raw_agent, dict) else {}
            next_agent["project_scope_ref"] = PROJECT_SCOPE_REF
            next_agent["scope_guardrails_ref"] = SCOPE_GUARDRAILS_REF
            next_agent.pop("scope_guardrails", None)
            if next_agent.get("id") == "dictionary-lexicon-director-agent" and isinstance(next_agent.get("workflow"), list):
                next_agent["workflow"] = [
                    str(line)
                    .replace("Dispatch directly to dictionary-thesaurus-expander-agent.", "Run dictionary-thesaurus-expander skill stage.")
                    .replace("Dispatch directly to word-machine-descriptor-agent.", "Run word-machine-descriptor-compiler skill stage.")
                    .replace("Dispatch directly to dictionary-machine-quality-gate-agent.", "Run dictionary-machine-quality-gate skill stage.")
                    for line in next_agent["workflow"]
                ]
            hardened = ensure_hard_governance_agent_contract(next_agent)
            hardened["project_scope_ref"] = PROJECT_SCOPE_REF
            hardened["scope_guardrails_ref"] = SCOPE_GUARDRAILS_REF
            hardened.pop("scope_guardrails", None)
            next_agents.append(hardened)
        doc["agents"] = next_agents
    write_json(file_path, doc)


def update_agent_access_control_json(file_path: pathlib.Path) -> None:
    doc = read_json(file_path)
    system = dict(doc.get("system") or {}) if isinstance(doc.get("system"), dict) else {}
    system["project_scope"] = {
        "project_id": "aio",
        "policy_version": "2026-03-05",
        "allowed_roots": list(ALLOWED_ROOTS),
        "runtime_roots": ["brain/", "data/input/", "data/output/", "to-do/"],
        "output_only_root": "data/output/",
    }
    doc["system"] = system
    if isinstance(doc.get("agents"), dict):
        for agent_id, raw_entry in doc["agents"].items():
            entry = dict(raw_entry) if isinstance(raw_entry, dict) else {}
            entry["project_scope_ref"] = PROJECT_SCOPE_REF
            entry["allowed_paths_ref"] = ALLOWED_ROOTS_REF
            entry.pop("allowed_paths", None)
            doc["agents"][agent_id] = entry
    write_json(file_path, compact_access_policy(doc))


def update_agents_registry_yaml(file_path: pathlib.Path, workflow_file_path: pathlib.Path) -> None:
    parsed = yaml.safe_load(read_text(file_path)) if file_path.exists() else {}
    doc = dict(parsed) if isinstance(parsed, dict) else {}
    workflow_doc = read_json(workflow_file_path)
    workflow_agents = workflow_doc.get("agents") if isinstance(workflow_doc.get("agents"), list) else []
    workflow_access_control = workflow_doc.get("agent_access_control") if isinstance(workflow_doc.get("agent_access_control"), dict) else {}
    workflow_update_log = workflow_doc.get("update_log_system") if isinstance(workflow_doc.get("update_log_system"), dict) else {}
    workflow_runtime_model = workflow_doc.get("runtime_model") if isinstance(workflow_doc.get("runtime_model"), dict) else {}
    workflow_project_scope = workflow_doc.get("project_scope") if isinstance(workflow_doc.get("project_scope"), dict) else {}
    agent_ids = [normalize_string((entry or {}).get("id")) for entry in workflow_agents if normalize_string((entry or {}).get("id"))]

    doc["version"] = str(doc.get("version") or workflow_doc.get("version") or "1.5.0")
    doc["default_agent"] = str(doc.get("default_agent") or workflow_doc.get("default_agent") or "polyglot-default-director-agent")
    doc["access_control"] = {
        "policy_file": workflow_access_control.get("policy_file") or "source://agent_access_control",
        "request_log_file": workflow_access_control.get("request_log_file") or "source://request_log_file",
        "request_command": workflow_access_control.get("request_command")
        or 'npm run agent:request-access -- --agent-id <agent-id> --requested-tool <tool-id> --privilege-flag <flag-id> --reason "<why-needed>"',
        "enforcement": "required_for_non_startup_tools" if workflow_access_control.get("request_required_for_non_startup_tools") else str(doc.get("access_control", {}).get("enforcement") or "required_for_non_startup_tools"),
    }
    doc["update_log"] = {
        "events_file": workflow_update_log.get("events_file") or "source://update_events_file",
        "sessions_file": workflow_update_log.get("sessions_file") or "source://update_sessions_file",
        "state_file": workflow_update_log.get("state_file") or "source://update_state_file",
        "scan_command": workflow_update_log.get("scan_command") or 'npm run updates:scan -- --actor <agent-id> --scope "<scope>"',
        "watch_command": workflow_update_log.get("watch_command") or "npm run updates:watch -- --actor <agent-id> --session-id <session-id>",
        "policy": workflow_update_log.get("policy") or "log_all_file_updates_with_timing",
    }
    runtime_contract = workflow_project_scope.get("runtime_contract") if isinstance(workflow_project_scope.get("runtime_contract"), dict) else {}
    doc["agents"] = agent_ids
    doc["runtime_model"] = {
        "brain_root": workflow_runtime_model.get("brain_root") or "brain/",
        "data_input_root": workflow_runtime_model.get("data_input_root") or "data/input/",
        "data_output_root": workflow_runtime_model.get("data_output_root") or "data/output/",
        "todo_root": workflow_runtime_model.get("todo_root") or "to-do/",
        "wrapper_execution_mode": workflow_runtime_model.get("wrapper_execution_mode") or "two_pass_single_wrapper",
        "runtime_contract": {
            "brain_root": runtime_contract.get("brain_root") or workflow_runtime_model.get("brain_root") or "brain/",
            "data_input_root": runtime_contract.get("data_input_root") or workflow_runtime_model.get("data_input_root") or "data/input/",
            "data_output_root": runtime_contract.get("data_output_root") or workflow_runtime_model.get("data_output_root") or "data/output/",
            "todo_root": runtime_contract.get("todo_root") or workflow_runtime_model.get("todo_root") or "to-do/",
            "wrapper_execution_mode": runtime_contract.get("wrapper_execution_mode") or workflow_runtime_model.get("wrapper_execution_mode") or "two_pass_single_wrapper",
        },
    }
    doc["project_scope"] = {
        "project_id": "aio",
        "project_name": "AIO",
        "policy_version": "2026-03-05",
        "allowed_roots": list(ALLOWED_ROOTS),
        "runtime_contract_ref": "source://runtime_model",
        "wrapper_contract": "two_pass_single_wrapper",
    }
    write_text(file_path, dump_yaml(doc))


def update_repeat_action_routing_json(file_path: pathlib.Path) -> None:
    source_doc = read_json(file_path)
    doc = resolve_routing_doc(source_doc)
    doc["project_scope"] = {"project_id": "aio", "policy_version": "2026-03-05", "allowed_roots": list(ALLOWED_ROOTS)}
    ensure_keyword_rule(doc, HARD_GOVERNANCE_ROUTING_KEYWORDS, HARD_GOVERNANCE_ROUTING_SKILLS)
    ensure_path_rule(doc, HARD_GOVERNANCE_ROUTING_PATHS, HARD_GOVERNANCE_ROUTING_SKILLS)
    if isinstance(doc.get("keyword_rules"), list):
        doc["keyword_rules"] = [
            {"keywords": dedupe_case_insensitive((rule or {}).get("keywords")), "skills": normalize_skills((rule or {}).get("skills"))}
            for rule in doc["keyword_rules"]
        ]
    if isinstance(doc.get("path_rules"), list):
        doc["path_rules"] = [
            {"paths": dedupe_case_insensitive((rule or {}).get("paths")), "skills": normalize_skills((rule or {}).get("skills"))}
            for rule in doc["path_rules"]
        ]
    write_json(file_path, compact_routing_doc(doc))


def main(argv: list[str] | None = None) -> int:
    del argv
    agents_dir = ROOT / "to-do" / "agents"
    for file_path in sorted(agents_dir.glob("*.yaml")):
        if file_path.name != "agents_registry.yaml":
            ensure_agent_yaml_scope(file_path)

    skills_dir = ROOT / "to-do" / "skills"
    for entry in sorted((row for row in skills_dir.iterdir() if row.is_dir()), key=lambda row: row.name):
        openai_yaml_path = entry / "agents" / "openai.yaml"
        skill_md_path = entry / "SKILL.md"
        if openai_yaml_path.exists():
            ensure_openai_yaml_scope(openai_yaml_path, entry.name)
        if skill_md_path.exists():
            ensure_skill_markdown_scope(skill_md_path)

    workflow_file = ROOT / "to-do" / "skills" / "agent_workflows.json"
    update_agent_workflows_json(workflow_file)
    update_agent_access_control_json(ROOT / "to-do" / "agents" / "agent_access_control.json")
    update_agents_registry_yaml(ROOT / "to-do" / "agents" / "agents_registry.yaml", workflow_file)
    update_repeat_action_routing_json(ROOT / "to-do" / "skills" / "repeat_action_routing.json")
    ensure_shards_current(ROOT, force=True)
    sys.stdout.write("scope sync complete\n")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main(sys.argv[1:]))
    except Exception as error:
        sys.stderr.write(f"scope sync failed: {error}\n")
        raise SystemExit(1)
