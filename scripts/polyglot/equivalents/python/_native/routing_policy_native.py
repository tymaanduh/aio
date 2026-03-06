#!/usr/bin/env python3
"""Native helpers for repeat-action routing policy normalization."""

from __future__ import annotations

import hashlib
from typing import Any


DEFAULT_ROUTING_FILE = "to-do/skills/repeat_action_routing.json"


def normalize_text(value: Any) -> str:
    return str(value or "").strip()


def dedupe_case_insensitive(values: Any) -> list[str]:
    seen: set[str] = set()
    out: list[str] = []
    for entry in values if isinstance(values, list) else []:
        normalized = normalize_text(entry)
        if not normalized:
            continue
        key = normalized.lower()
        if key in seen:
            continue
        seen.add(key)
        out.append(normalized)
    return out


def normalize_skills(skills: Any) -> list[str]:
    return dedupe_case_insensitive(skills)


def skill_signature(skills: Any) -> str:
    return "|".join(sorted(item.lower() for item in normalize_skills(skills)))


def stable_stack_id(signature: str) -> str:
    return f"stack_{hashlib.sha1(str(signature or '').encode('utf8')).hexdigest()[:12]}"


def normalize_skill_stacks(doc: Any) -> dict[str, list[str]]:
    source = doc.get("skill_stacks") if isinstance(doc, dict) else {}
    mapping = source if isinstance(source, dict) else {}
    normalized: dict[str, list[str]] = {}
    for stack_id, skills in mapping.items():
        key = normalize_text(stack_id)
        normalized_skills = normalize_skills(skills)
        if key and normalized_skills:
            normalized[key] = normalized_skills
    return normalized


def resolve_rule_skills(rule: Any, doc_or_stacks: Any) -> list[str]:
    if isinstance(rule, dict) and isinstance(rule.get("skills"), list):
        return normalize_skills(rule.get("skills"))
    ref = normalize_text(rule.get("skills_ref")) if isinstance(rule, dict) else ""
    if not ref:
        return []
    stacks = {}
    if isinstance(doc_or_stacks, dict):
        if isinstance(doc_or_stacks.get("skill_stacks"), dict):
            stacks = doc_or_stacks.get("skill_stacks") or {}
        else:
            stacks = doc_or_stacks
    values = stacks.get(ref) if isinstance(stacks.get(ref), list) else []
    return normalize_skills(values)


def upsert_skill_stack(doc: dict[str, Any], skills: Any) -> str:
    if not isinstance(doc.get("skill_stacks"), dict):
        doc["skill_stacks"] = {}
    normalized_skills = normalize_skills(skills)
    signature = skill_signature(normalized_skills)
    if not signature:
        return ""
    for stack_id, stack_skills in (doc.get("skill_stacks") or {}).items():
        if skill_signature(stack_skills) == signature:
            doc["skill_stacks"][stack_id] = normalize_skills(stack_skills)
            return stack_id
    preferred_id = stable_stack_id(signature)
    final_id = preferred_id
    collision_index = 2
    while final_id in doc["skill_stacks"] and skill_signature(doc["skill_stacks"][final_id]) != signature:
        final_id = f"{preferred_id}_{collision_index}"
        collision_index += 1
    doc["skill_stacks"][final_id] = normalized_skills
    return final_id


def compact_routing_doc(doc: Any) -> dict[str, Any]:
    source = doc if isinstance(doc, dict) else {}
    next_doc = {**source, "skill_stacks": normalize_skill_stacks(source)}
    used_stack_ids: set[str] = set()

    keyword_rules = source.get("keyword_rules") if isinstance(source.get("keyword_rules"), list) else []
    next_doc["keyword_rules"] = []
    for rule in keyword_rules:
        resolved_skills = resolve_rule_skills(rule, next_doc)
        stack_id = upsert_skill_stack(next_doc, resolved_skills)
        if stack_id:
            used_stack_ids.add(stack_id)
        next_doc["keyword_rules"].append(
            {
                "keywords": dedupe_case_insensitive(rule.get("keywords") if isinstance(rule, dict) else []),
                **({"skills_ref": stack_id} if stack_id else {}),
            }
        )

    path_rules = source.get("path_rules") if isinstance(source.get("path_rules"), list) else []
    next_doc["path_rules"] = []
    for rule in path_rules:
        resolved_skills = resolve_rule_skills(rule, next_doc)
        stack_id = upsert_skill_stack(next_doc, resolved_skills)
        if stack_id:
            used_stack_ids.add(stack_id)
        next_doc["path_rules"].append(
            {
                "paths": dedupe_case_insensitive(rule.get("paths") if isinstance(rule, dict) else []),
                **({"skills_ref": stack_id} if stack_id else {}),
            }
        )

    compact_stacks: dict[str, list[str]] = {}
    for stack_id in sorted((next_doc.get("skill_stacks") or {}).keys()):
        if stack_id in used_stack_ids:
            compact_stacks[stack_id] = normalize_skills(next_doc["skill_stacks"][stack_id])
    next_doc["skill_stacks"] = compact_stacks
    return next_doc


def resolve_routing_doc(doc: Any) -> dict[str, Any]:
    source = doc if isinstance(doc, dict) else {}
    skill_stacks = normalize_skill_stacks(source)
    resolved = {**source, "skill_stacks": skill_stacks}
    resolved["keyword_rules"] = [
        {
            **(rule if isinstance(rule, dict) else {}),
            "keywords": dedupe_case_insensitive(rule.get("keywords") if isinstance(rule, dict) else []),
            "skills": resolve_rule_skills(rule, skill_stacks),
        }
        for rule in (source.get("keyword_rules") if isinstance(source.get("keyword_rules"), list) else [])
    ]
    resolved["path_rules"] = [
        {
            **(rule if isinstance(rule, dict) else {}),
            "paths": dedupe_case_insensitive(rule.get("paths") if isinstance(rule, dict) else []),
            "skills": resolve_rule_skills(rule, skill_stacks),
        }
        for rule in (source.get("path_rules") if isinstance(source.get("path_rules"), list) else [])
    ]
    return resolved
