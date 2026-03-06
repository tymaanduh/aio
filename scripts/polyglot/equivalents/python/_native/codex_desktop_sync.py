#!/usr/bin/env python3
"""Native Python implementation for scripts/codex-desktop-sync.js."""

from __future__ import annotations

import json
import os
import pathlib
import shutil
import sys
from datetime import UTC, datetime
from typing import Any

from project_source_resolver_native import find_project_root

SKILL_MARKER_FILENAME = ".aio-skill.json"
MANIFEST_FILENAME = ".aio-managed.json"
MANAGED_BY_VALUES = {"aio-codex-sync"}


def parse_args(argv: list[str]) -> dict[str, Any]:
    args = {
        "dry_run": "--dry-run" in argv,
        "codex_home": "",
        "strict": "--no-strict" not in argv,
    }
    index = 0
    while index < len(argv):
        token = str(argv[index] or "")
        if token == "--codex-home" and index + 1 < len(argv):
            args["codex_home"] = str(argv[index + 1] or "").strip()
            index += 2
            continue
        index += 1
    return args


def normalize_path(value: Any) -> str:
    return str(pathlib.Path(str(value or "")).resolve()).replace("\\", "/").lower()


def normalize_relative_path(value: Any) -> str:
    return str(value or "").replace("\\", "/")


def read_json_if_exists(file_path: pathlib.Path) -> Any:
    if not file_path.exists():
        return None
    try:
        return json.loads(file_path.read_text(encoding="utf8"))
    except Exception:
        return None


def read_management_marker(skill_dir: pathlib.Path) -> dict[str, Any] | None:
    marker = read_json_if_exists(skill_dir / SKILL_MARKER_FILENAME)
    return marker if isinstance(marker, dict) else None


def ensure_directory(dir_path: pathlib.Path) -> None:
    dir_path.mkdir(parents=True, exist_ok=True)


def copy_directory(source_dir: pathlib.Path, destination_dir: pathlib.Path) -> None:
    shutil.copytree(source_dir, destination_dir, dirs_exist_ok=True)


def ensure_managed_destination(destination_skill_dir: pathlib.Path, source_root: pathlib.Path) -> bool:
    if not destination_skill_dir.exists():
        return True
    marker = read_management_marker(destination_skill_dir)
    if not isinstance(marker, dict) or str(marker.get("managed_by") or "") not in MANAGED_BY_VALUES:
        return False
    source_root_value = str(marker.get("source_root") or "").strip()
    if not source_root_value:
        return True
    marker_source_root = normalize_path(source_root_value)
    active_source_root = normalize_path(source_root)
    renamed_workspace_path_match = (
        marker_source_root.endswith("/dicccc")
        and active_source_root.endswith("/aio")
    ) or (
        marker_source_root.endswith("/aio")
        and active_source_root.endswith("/dicccc")
    )
    return marker_source_root == active_source_root or renamed_workspace_path_match


def list_skill_directories(skills_root: pathlib.Path) -> list[str]:
    if not skills_root.exists():
        return []
    return sorted(entry.name for entry in skills_root.iterdir() if entry.is_dir())


def list_files_recursively(start_dir: pathlib.Path) -> list[pathlib.Path]:
    if not start_dir.exists():
        return []
    results: list[pathlib.Path] = []
    stack = [start_dir]
    while stack:
        current = stack.pop()
        for entry in current.iterdir():
            if entry.is_dir():
                stack.append(entry)
            elif entry.is_file():
                results.append(entry)
    return results


def sync_skills(root: pathlib.Path, codex_home: pathlib.Path, dry_run: bool) -> dict[str, Any]:
    source_skills_root = root / "to-do" / "skills"
    destination_skills_root = codex_home / "skills"
    timestamp = datetime.now(UTC).isoformat().replace("+00:00", "Z")
    report = {
        "source": str(source_skills_root),
        "destination": str(destination_skills_root),
        "synced": [],
        "collisions": [],
        "total": 0,
    }

    skill_names = [
        skill_name
        for skill_name in list_skill_directories(source_skills_root)
        if (source_skills_root / skill_name / "SKILL.md").exists()
        and (source_skills_root / skill_name / "agents" / "openai.yaml").exists()
    ]
    report["total"] = len(skill_names)
    if not dry_run:
        ensure_directory(destination_skills_root)

    for skill_name in skill_names:
        source_skill_dir = source_skills_root / skill_name
        destination_skill_dir = destination_skills_root / skill_name
        if not ensure_managed_destination(destination_skill_dir, root):
            report["collisions"].append(
                {
                    "skill": skill_name,
                    "destination": str(destination_skill_dir),
                    "reason": "destination exists and is not managed by this repository",
                }
            )
            continue
        if not dry_run:
            shutil.rmtree(destination_skill_dir, ignore_errors=True)
            copy_directory(source_skill_dir, destination_skill_dir)
            (destination_skill_dir / SKILL_MARKER_FILENAME).write_text(
                f"{json.dumps({'managed_by': 'aio-codex-sync', 'source_root': str(root), 'skill': skill_name, 'synced_at': timestamp}, indent=2)}\n",
                encoding="utf8",
            )
        report["synced"].append(skill_name)

    if not dry_run and not report["collisions"]:
        (destination_skills_root / MANIFEST_FILENAME).write_text(
            f"{json.dumps({'managed_by': 'aio-codex-sync', 'source_root': str(root), 'synced_at': timestamp, 'skills': report['synced']}, indent=2)}\n",
            encoding="utf8",
        )

    return report


def sync_agents_snapshot(root: pathlib.Path, codex_home: pathlib.Path, dry_run: bool) -> dict[str, Any]:
    source_agents_root = root / "to-do" / "agents"
    source_skills_root = root / "to-do" / "skills"
    destination_agents_root = codex_home / "agents" / "aio"
    timestamp = datetime.now(UTC).isoformat().replace("+00:00", "Z")

    copied_files: list[str] = []
    if not dry_run:
        ensure_directory(destination_agents_root)

    if source_agents_root.exists():
        for entry in sorted((row for row in source_agents_root.iterdir() if row.is_file()), key=lambda row: row.name):
            destination_file = destination_agents_root / entry.name
            if not dry_run:
                shutil.copy2(entry, destination_file)
            copied_files.append(f"to-do/agents/{entry.name}")

    for file_name in ("agent_workflows.json", "repeat_action_routing.json"):
        source_file = source_skills_root / file_name
        if not source_file.exists():
            continue
        destination_file = destination_agents_root / file_name
        if not dry_run:
            shutil.copy2(source_file, destination_file)
        copied_files.append(f"to-do/skills/{file_name}")

    source_shard_dir = source_agents_root / "agent_workflow_shards"
    if source_shard_dir.exists():
        destination_shard_dir = destination_agents_root / "agent_workflow_shards"
        if not dry_run:
            shutil.rmtree(destination_shard_dir, ignore_errors=True)
            copy_directory(source_shard_dir, destination_shard_dir)
        for absolute_file in list_files_recursively(source_shard_dir):
            relative = normalize_relative_path(absolute_file.relative_to(source_shard_dir))
            copied_files.append(f"to-do/agents/agent_workflow_shards/{relative}")

    if not dry_run:
        (destination_agents_root / "manifest.json").write_text(
            f"{json.dumps({'managed_by': 'aio-codex-sync', 'source_root': str(root), 'synced_at': timestamp, 'files': copied_files}, indent=2)}\n",
            encoding="utf8",
        )

    return {
        "source_agents": str(source_agents_root),
        "source_skills": str(source_skills_root),
        "destination": str(destination_agents_root),
        "files": copied_files,
    }


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv or [])
    root = find_project_root(pathlib.Path.cwd())
    codex_home = pathlib.Path(args["codex_home"] or os.environ.get("CODEX_HOME") or (pathlib.Path.home() / ".codex")).resolve()
    skills_report = sync_skills(root, codex_home, bool(args["dry_run"]))
    agents_report = sync_agents_snapshot(root, codex_home, bool(args["dry_run"]))
    report = {
        "status": "fail" if skills_report["collisions"] else "pass",
        "mode": "dry-run" if args["dry_run"] else "apply",
        "root": str(root),
        "codex_home": str(codex_home),
        "skills": skills_report,
        "agents": agents_report,
    }
    sys.stdout.write(f"{json.dumps(report, indent=2)}\n")
    return 1 if args["strict"] and report["status"] != "pass" else 0


if __name__ == "__main__":
    try:
        raise SystemExit(main(sys.argv[1:]))
    except Exception as error:
        sys.stderr.write(f"codex-desktop-sync failed: {error}\n")
        raise SystemExit(1)
