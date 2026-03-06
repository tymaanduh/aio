#!/usr/bin/env python3
"""Native helpers for project path and policy resolution."""

from __future__ import annotations

import json
import pathlib
from typing import Any, Callable

from _common import normalize_path
from agent_access_policy_native import expand_access_policy

DEFAULT_IGNORE_DIRS = (
    ".git",
    "node_modules",
    "dist",
    ".vs",
    "native/dx12/build",
    "data/output/logs/change-log",
    "data/output/databases/polyglot-default/build/tmp",
)


def file_exists(file_path: pathlib.Path) -> bool:
    try:
        return file_path.exists()
    except Exception:
        return False


def is_file(file_path: pathlib.Path) -> bool:
    try:
        return file_path.is_file()
    except Exception:
        return False


def find_project_root(start_dir: pathlib.Path | str | None = None) -> pathlib.Path:
    current = pathlib.Path(start_dir or pathlib.Path.cwd()).resolve()
    if current.is_file():
        current = current.parent
    previous = None
    while current and current != previous:
        if file_exists(current / "package.json"):
            return current
        previous = current
        current = current.parent
    return pathlib.Path(start_dir or pathlib.Path.cwd()).resolve()


def should_ignore_directory(relative_path: str) -> bool:
    rel = normalize_path(relative_path)
    return any(rel == entry or rel.startswith(f"{entry}/") for entry in DEFAULT_IGNORE_DIRS)


def list_matching_files(
    root_path: pathlib.Path | str,
    target_file_name: str,
    validator: Callable[[pathlib.Path], bool] | None = None,
) -> list[pathlib.Path]:
    root = pathlib.Path(root_path).resolve()
    results: list[pathlib.Path] = []
    stack = [root]

    while stack:
        current = stack.pop()
        for entry in current.iterdir():
            relative = normalize_path(entry.relative_to(root))
            if entry.is_dir():
                if not should_ignore_directory(relative):
                    stack.append(entry)
                continue
            if not entry.is_file() or entry.name != target_file_name:
                continue
            if validator is not None:
                try:
                    if not validator(entry):
                        continue
                except Exception:
                    continue
            results.append(entry)

    def sort_key(file_path: pathlib.Path) -> tuple[int, int, str]:
        rel = normalize_path(file_path.relative_to(root))
        depth = len(rel.split("/"))
        preferred = -1 if "/to-do/agents/" in f"/{rel}" or rel.startswith("to-do/agents/") or "/agents/" in f"/{rel}" or rel.startswith("agents/") else 0
        return (preferred, depth, rel)

    return sorted(results, key=sort_key)


def is_agent_access_control_file(file_path: pathlib.Path) -> bool:
    if not is_file(file_path):
        return False
    try:
        parsed = json.loads(file_path.read_text(encoding="utf8"))
    except Exception:
        return False
    return bool(isinstance(parsed, dict) and isinstance(parsed.get("system"), dict) and isinstance(parsed.get("agents"), dict))


def resolve_agent_access_control(start_dir: pathlib.Path | str | None = None) -> dict[str, Any]:
    root = find_project_root(start_dir)
    env_value = normalize_path(__import__("os").environ.get("AGENT_ACCESS_CONTROL_FILE", ""))
    env_path = (root / pathlib.PurePosixPath(env_value)).resolve() if env_value else None
    if env_path and is_agent_access_control_file(env_path):
        parsed = json.loads(env_path.read_text(encoding="utf8"))
        return {
            "root": root,
            "policy_path": env_path,
            "policy": expand_access_policy(parsed),
        }

    matches = list_matching_files(root, "agent_access_control.json", is_agent_access_control_file)
    if not matches:
        raise RuntimeError("unable to locate agent_access_control.json in project scope")
    policy_path = matches[0]
    parsed = json.loads(policy_path.read_text(encoding="utf8"))
    return {
        "root": root,
        "policy_path": policy_path,
        "policy": expand_access_policy(parsed),
    }


def resolve_maybe_relocated_path(
    root: pathlib.Path,
    policy_path: pathlib.Path,
    configured_path: Any,
    *,
    allow_basename_search: bool = True,
) -> pathlib.Path:
    value = str(configured_path or "").strip()
    if not value:
        return pathlib.Path("")
    candidate = pathlib.Path(value)
    if candidate.is_absolute():
        return candidate

    near_policy_candidate = (policy_path.parent / value).resolve()
    if file_exists(near_policy_candidate):
        return near_policy_candidate

    from_root_candidate = (root / value).resolve()
    if file_exists(from_root_candidate):
        return from_root_candidate

    if allow_basename_search:
        base_name = candidate.name
        matches = list_matching_files(root, base_name)
        if matches:
            return matches[0]

    return near_policy_candidate


def resolve_request_log_file(root: pathlib.Path, policy_path: pathlib.Path, policy: dict[str, Any]) -> pathlib.Path:
    configured = ((policy.get("system") or {}) if isinstance(policy, dict) else {}).get("request_log_file")
    return resolve_maybe_relocated_path(root, policy_path, configured or "data/input/databases/agent_access_requests.ndjson")


def resolve_update_log_paths(root: pathlib.Path, policy_path: pathlib.Path, policy: dict[str, Any]) -> dict[str, pathlib.Path]:
    update_log = (((policy.get("system") or {}) if isinstance(policy, dict) else {}).get("update_log") or {})
    return {
        "events_file": resolve_maybe_relocated_path(root, policy_path, update_log.get("events_file") or "data/output/logs/change-log/update_events.ndjson"),
        "sessions_file": resolve_maybe_relocated_path(root, policy_path, update_log.get("sessions_file") or "data/output/logs/change-log/sessions.ndjson"),
        "state_file": resolve_maybe_relocated_path(
            root,
            policy_path,
            update_log.get("state_file") or "data/output/logs/change-log/state_snapshot.json",
            allow_basename_search=False,
        ),
    }
