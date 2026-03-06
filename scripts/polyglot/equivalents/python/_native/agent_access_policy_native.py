#!/usr/bin/env python3
"""Native helpers for agent access policy expansion."""

from __future__ import annotations

import hashlib
import json
from typing import Any


def normalize_text(value: Any) -> str:
    return str(value or "").strip()


def normalize_list(values: Any) -> list[str]:
    items = [normalize_text(item) for item in (values if isinstance(values, list) else [])]
    return sorted({item for item in items if item})


def normalize_profile(profile: Any) -> dict[str, Any]:
    source = profile if isinstance(profile, dict) else {}
    allowed_controls = normalize_list(source.get("allowed_controls"))
    startup_tools = normalize_list(source.get("startup_tools"))
    controls_cap_raw = source.get("controls_cap")
    startup_tool_cap_raw = source.get("startup_tool_cap")
    controls_cap = int(controls_cap_raw) if str(controls_cap_raw or "").strip().isdigit() else len(allowed_controls)
    startup_tool_cap = int(startup_tool_cap_raw) if str(startup_tool_cap_raw or "").strip().isdigit() else len(startup_tools)
    return {
        "controls_cap": controls_cap,
        "allowed_controls": allowed_controls,
        "startup_tools": startup_tools,
        "startup_tool_cap": startup_tool_cap,
    }


def profile_signature(profile: Any) -> str:
    return json.dumps(normalize_profile(profile), sort_keys=True)


def stable_profile_id(signature: str) -> str:
    return f"profile_{hashlib.sha1(str(signature or '').encode('utf8')).hexdigest()[:12]}"


def expand_access_policy(policy: Any) -> dict[str, Any]:
    source = policy if isinstance(policy, dict) else {}
    profiles_source = source.get("profiles") if isinstance(source.get("profiles"), dict) else {}
    profiles = {
        normalize_text(profile_id): normalize_profile(profile)
        for profile_id, profile in profiles_source.items()
        if normalize_text(profile_id)
    }

    agents_source = source.get("agents") if isinstance(source.get("agents"), dict) else {}
    agents: dict[str, dict[str, Any]] = {}
    for agent_id, entry in agents_source.items():
        key = normalize_text(agent_id)
        if not key:
            continue
        row = entry if isinstance(entry, dict) else {}
        profile_ref = normalize_text(row.get("profile_ref"))
        profile = profiles.get(profile_ref, {})
        normalized = normalize_profile(
            {
                "controls_cap": row.get("controls_cap") if row.get("controls_cap") is not None else profile.get("controls_cap"),
                "allowed_controls": row.get("allowed_controls") if isinstance(row.get("allowed_controls"), list) else profile.get("allowed_controls"),
                "startup_tools": row.get("startup_tools") if isinstance(row.get("startup_tools"), list) else profile.get("startup_tools"),
                "startup_tool_cap": row.get("startup_tool_cap") if row.get("startup_tool_cap") is not None else profile.get("startup_tool_cap"),
            }
        )
        merged = {**row, **normalized}
        if profile_ref:
            merged["profile_ref"] = profile_ref
        agents[key] = merged

    return {
        **source,
        "profiles": profiles,
        "agents": agents,
    }


def compact_access_policy(policy: Any) -> dict[str, Any]:
    expanded = expand_access_policy(policy)
    agents = expanded.get("agents") if isinstance(expanded.get("agents"), dict) else {}
    profiles: dict[str, dict[str, Any]] = {}
    signature_to_profile_id: dict[str, str] = {}
    compact_agents: dict[str, dict[str, Any]] = {}

    for agent_id in sorted(agents.keys()):
        entry = agents.get(agent_id) if isinstance(agents.get(agent_id), dict) else {}
        profile_payload = normalize_profile(entry)
        signature = profile_signature(profile_payload)
        profile_id = signature_to_profile_id.get(signature)
        if not profile_id:
            base_profile_id = stable_profile_id(signature)
            profile_id = base_profile_id
            collision_index = 2
            while profile_id in profiles and profile_signature(profiles[profile_id]) != signature:
                profile_id = f"{base_profile_id}_{collision_index}"
                collision_index += 1
            profiles[profile_id] = profile_payload
            signature_to_profile_id[signature] = profile_id

        compact_agents[agent_id] = {
            "role": normalize_text(entry.get("role")),
            "profile_ref": profile_id,
            "project_scope_ref": normalize_text(entry.get("project_scope_ref")),
            "allowed_paths_ref": normalize_text(entry.get("allowed_paths_ref")),
            **(
                {"allowed_paths": normalize_list(entry.get("allowed_paths"))}
                if isinstance(entry.get("allowed_paths"), list) and normalize_list(entry.get("allowed_paths"))
                else {}
            ),
        }

    return {
        **expanded,
        "profiles": profiles,
        "agents": compact_agents,
    }
