#!/usr/bin/env python3
"""Native Python implementation for scripts/validate-codex-desktop-compat.js."""

from __future__ import annotations

import json
import pathlib
import sys
from typing import Any

import yaml

from project_source_resolver_native import find_project_root

TOP_LEVEL_ALLOWED = {"interface", "dependencies", "policy"}
INTERFACE_ALLOWED = {
    "display_name",
    "short_description",
    "icon_small",
    "icon_large",
    "brand_color",
    "default_prompt",
}
INTERFACE_REQUIRED = ("display_name", "short_description", "default_prompt")


def parse_args(argv: list[str]) -> dict[str, Any]:
    return {"strict": "--no-strict" not in argv, "json": True}


def read_text(file_path: pathlib.Path) -> str:
    return file_path.read_text(encoding="utf8")


def parse_yaml_file(file_path: pathlib.Path) -> Any:
    return yaml.safe_load(read_text(file_path))


def parse_frontmatter(file_path: pathlib.Path) -> dict[str, Any]:
    text = read_text(file_path).replace("\r\n", "\n")
    if not text.startswith("---\n"):
        raise RuntimeError("missing YAML frontmatter start delimiter")
    lines = text.split("\n")
    end_index = -1
    for idx, line in enumerate(lines[1:], start=1):
        if line.strip() == "---":
            end_index = idx
            break
    if end_index < 0:
        raise RuntimeError("missing YAML frontmatter end delimiter")
    parsed = yaml.safe_load("\n".join(lines[1:end_index]))
    if not isinstance(parsed, dict):
        raise RuntimeError("frontmatter must be a YAML object")
    return parsed


def issue(level: str, issue_type: str, detail: str, extra: dict[str, Any] | None = None) -> dict[str, Any]:
    return {"level": level, "type": issue_type, "detail": detail, **(extra or {})}


def validate_skill(skill_root: pathlib.Path, skill_name: str) -> list[dict[str, Any]]:
    issues: list[dict[str, Any]] = []
    skill_md_path = skill_root / "SKILL.md"
    openai_yaml_path = skill_root / "agents" / "openai.yaml"

    if not skill_md_path.exists():
        issues.append(issue("error", "missing_skill_md", "SKILL.md is missing", {"skill": skill_name}))
        return issues
    if not openai_yaml_path.exists():
        issues.append(issue("error", "missing_openai_yaml", "agents/openai.yaml is missing", {"skill": skill_name}))
        return issues

    try:
        frontmatter = parse_frontmatter(skill_md_path)
        frontmatter_name = str(frontmatter.get("name") or "").strip()
        frontmatter_description = str(frontmatter.get("description") or "").strip()
        if not frontmatter_name:
            issues.append(issue("error", "missing_frontmatter_name", "frontmatter.name is empty", {"skill": skill_name}))
        elif frontmatter_name != skill_name:
            issues.append(issue("error", "frontmatter_name_mismatch", "frontmatter.name must match folder name", {"skill": skill_name, "expected": skill_name, "actual": frontmatter_name}))
        if not frontmatter_description:
            issues.append(issue("error", "missing_frontmatter_description", "frontmatter.description is empty", {"skill": skill_name}))
    except Exception as error:
        issues.append(issue("error", "invalid_frontmatter", "Unable to parse SKILL.md frontmatter", {"skill": skill_name, "error": str(error)}))

    try:
        openai_doc = parse_yaml_file(openai_yaml_path)
    except Exception as error:
        issues.append(issue("error", "invalid_openai_yaml", "Unable to parse agents/openai.yaml", {"skill": skill_name, "error": str(error)}))
        return issues

    if not isinstance(openai_doc, dict):
        issues.append(issue("error", "openai_yaml_not_object", "openai.yaml must be a YAML object", {"skill": skill_name}))
        return issues

    for key in openai_doc.keys():
        if key not in TOP_LEVEL_ALLOWED:
            issues.append(issue("error", "unsupported_openai_top_level_key", "Unsupported top-level key in openai.yaml", {"skill": skill_name, "key": key}))

    interface_doc = openai_doc.get("interface") if isinstance(openai_doc.get("interface"), dict) else None
    if interface_doc is None:
        issues.append(issue("error", "missing_interface_block", "openai.yaml must include interface object", {"skill": skill_name}))
        return issues

    for key in interface_doc.keys():
        if key not in INTERFACE_ALLOWED:
            issues.append(issue("error", "unsupported_interface_key", "Unsupported interface key in openai.yaml", {"skill": skill_name, "key": key}))

    for field_name in INTERFACE_REQUIRED:
        value = interface_doc.get(field_name)
        if not isinstance(value, str) or not value.strip():
            issues.append(issue("error", "missing_interface_field", "Required interface field is missing or empty", {"skill": skill_name, "field": field_name}))

    prompt = str(interface_doc.get("default_prompt") or "")
    skill_token = f"${skill_name}"
    if skill_token not in prompt:
        issues.append(issue("error", "default_prompt_missing_skill_token", "default_prompt must reference the skill token", {"skill": skill_name, "expected_token": skill_token}))

    for field_name in ("icon_small", "icon_large"):
        value = interface_doc.get(field_name)
        if not isinstance(value, str) or not value.strip():
            continue
        resolved = (skill_root / value).resolve()
        if not resolved.exists():
            issues.append(issue("error", "missing_icon_asset", "Configured icon path does not exist", {"skill": skill_name, "field": field_name, "configured_path": value}))

    if "policy" in openai_doc:
        if not isinstance(openai_doc.get("policy"), dict):
            issues.append(issue("error", "invalid_policy_block", "policy must be an object when present", {"skill": skill_name}))
        elif "allow_implicit_invocation" in (openai_doc.get("policy") or {}) and not isinstance((openai_doc.get("policy") or {}).get("allow_implicit_invocation"), bool):
            issues.append(issue("error", "invalid_allow_implicit_invocation", "policy.allow_implicit_invocation must be boolean", {"skill": skill_name}))

    if "dependencies" in openai_doc and not isinstance(openai_doc.get("dependencies"), dict):
        issues.append(issue("error", "invalid_dependencies_block", "dependencies must be an object when present", {"skill": skill_name}))

    return issues


def build_report() -> dict[str, Any]:
    root = find_project_root(pathlib.Path.cwd())
    skills_root = root / "to-do" / "skills"
    report = {
        "status": "pass",
        "root": str(root),
        "skills_root": str(skills_root.relative_to(root)).replace("\\", "/"),
        "counts": {"skills": 0, "errors": 0, "warnings": 0},
        "issues": [],
    }

    if not skills_root.exists():
        report["status"] = "fail"
        report["issues"].append(issue("error", "missing_skills_directory", "to-do/skills directory does not exist"))
        report["counts"]["errors"] = 1
        return report

    skill_dirs = sorted([entry.name for entry in skills_root.iterdir() if entry.is_dir()])
    report["counts"]["skills"] = len(skill_dirs)
    for skill_name in skill_dirs:
        report["issues"].extend(validate_skill(skills_root / skill_name, skill_name))

    report["counts"]["errors"] = sum(1 for entry in report["issues"] if entry.get("level") == "error")
    report["counts"]["warnings"] = sum(1 for entry in report["issues"] if entry.get("level") == "warn")
    report["status"] = "fail" if report["counts"]["errors"] > 0 else "pass"
    return report


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv or [])
    report = build_report()
    sys.stdout.write(f"{json.dumps(report, indent=2)}\n")
    return 1 if args["strict"] and report["status"] != "pass" else 0


if __name__ == "__main__":
    try:
        raise SystemExit(main(sys.argv[1:]))
    except Exception as error:
        sys.stderr.write(f"validate-codex-desktop-compat failed: {error}\n")
        raise SystemExit(1)
