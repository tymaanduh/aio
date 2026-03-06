#!/usr/bin/env python3
"""Native helpers for workflow shard loading and freshness."""

from __future__ import annotations

import hashlib
import json
import pathlib
from datetime import UTC, datetime
from typing import Any

from _common import normalize_path, write_text_file_robust

CANONICAL_RELATIVE_PATH = pathlib.PurePosixPath("to-do/skills/agent_workflows.json")
SHARD_ROOT_RELATIVE_PATH = pathlib.PurePosixPath("to-do/agents/agent_workflow_shards")
SHARD_INDEX_RELATIVE_PATH = SHARD_ROOT_RELATIVE_PATH / "index.json"
SHARD_AGENTS_RELATIVE_PATH = SHARD_ROOT_RELATIVE_PATH / "agents"
DEFAULT_SCOPE_GUARDRAILS_REF = "source://scope_guardrails#default"


def normalize_text(value: Any) -> str:
    return str(value or "").strip()


def read_json(file_path: pathlib.Path, fallback: Any = None) -> Any:
    try:
        return json.loads(file_path.read_text(encoding="utf8"))
    except Exception:
        return fallback


def write_json_if_changed(file_path: pathlib.Path, payload: Any) -> bool:
    next_text = f"{json.dumps(payload, indent=2)}\n"
    if file_path.exists() and file_path.read_text(encoding="utf8") == next_text:
        return False
    write_text_file_robust(file_path, next_text, atomic=False)
    return True


def sha256(text: str) -> str:
    return hashlib.sha256(str(text or "").encode("utf8")).hexdigest()


def get_paths(root: pathlib.Path) -> dict[str, pathlib.Path]:
    canonical_path = (root / CANONICAL_RELATIVE_PATH).resolve()
    shard_root = (root / SHARD_ROOT_RELATIVE_PATH).resolve()
    shard_index_path = (root / SHARD_INDEX_RELATIVE_PATH).resolve()
    shard_agents_path = (root / SHARD_AGENTS_RELATIVE_PATH).resolve()
    return {
        "canonical_path": canonical_path,
        "shard_root": shard_root,
        "shard_index_path": shard_index_path,
        "shard_agents_path": shard_agents_path,
    }


def list_workflow_agents(doc: Any) -> list[dict[str, Any]]:
    if isinstance(doc, dict) and isinstance(doc.get("agents"), list):
        return list(doc.get("agents") or [])
    if isinstance(doc, dict) and isinstance(doc.get("agent_workflows"), list):
        return list(doc.get("agent_workflows") or [])
    return []


def normalize_scope_guardrails_catalog(doc: Any) -> dict[str, list[str]]:
    source = doc.get("scope_guardrails_catalog") if isinstance(doc, dict) else None
    catalog = source if isinstance(source, dict) else {}
    normalized: dict[str, list[str]] = {}
    for key, entry in catalog.items():
        if not isinstance(entry, list):
            continue
        values = [normalize_text(item) for item in entry if normalize_text(item)]
        if values:
            normalized[str(key)] = values
    return normalized


def resolve_scope_guardrails(agent: Any, catalog: dict[str, list[str]]) -> list[str]:
    guardrails = [normalize_text(item) for item in (agent.get("scope_guardrails") or [])] if isinstance(agent, dict) else []
    if any(guardrails):
        return [item for item in guardrails if item]

    ref = normalize_text(agent.get("scope_guardrails_ref")) if isinstance(agent, dict) else ""
    if not ref:
        return []
    prefix, _, key = ref.partition("#")
    if normalize_text(prefix) != "source://scope_guardrails":
        return []
    catalog_key = normalize_text(key) or "default"
    return [normalize_text(item) for item in (catalog.get(catalog_key) or []) if normalize_text(item)]


def to_shard_file_name(agent_id: str, index: int) -> str:
    base = "".join(char.lower() if char.isalnum() else "_" for char in normalize_text(agent_id))
    while "__" in base:
        base = base.replace("__", "_")
    base = base.strip("_")
    return f"{base or f'agent_{index + 1}'}.json"


def read_canonical_doc(root: pathlib.Path) -> dict[str, Any]:
    canonical_path = get_paths(root)["canonical_path"]
    if not canonical_path.exists():
        raise RuntimeError(f"missing canonical workflow file: {normalize_path(canonical_path.relative_to(root))}")
    raw = canonical_path.read_text(encoding="utf8")
    doc = json.loads(raw)
    stat = canonical_path.stat()
    return {
        "path": canonical_path,
        "raw": raw,
        "doc": doc,
        "source": {
            "file": normalize_path(CANONICAL_RELATIVE_PATH),
            "size_bytes": int(stat.st_size),
            "mtime_ms": stat.st_mtime * 1000.0,
            "sha256": sha256(raw),
        },
    }


def read_shard_index(root: pathlib.Path) -> dict[str, Any] | None:
    shard_index_path = get_paths(root)["shard_index_path"]
    if not shard_index_path.exists():
        return None
    return read_json(shard_index_path, None)


SHARD_MTIME_TOLERANCE_MS = 1.0


def is_shards_current(root: pathlib.Path) -> bool:
    index = read_shard_index(root)
    if not isinstance(index, dict) or not isinstance(index.get("source"), dict):
        return False
    canonical_path = get_paths(root)["canonical_path"]
    if not canonical_path.exists():
        return False
    stat = canonical_path.stat()
    expected_size = float((index.get("source") or {}).get("size_bytes") or 0)
    expected_mtime = float((index.get("source") or {}).get("mtime_ms") or 0)
    return float(stat.st_size) == expected_size and abs(float(stat.st_mtime * 1000.0) - expected_mtime) <= SHARD_MTIME_TOLERANCE_MS


def build_shards(root: pathlib.Path) -> dict[str, Any]:
    paths = get_paths(root)
    canonical = read_canonical_doc(root)
    workflow_doc = canonical["doc"] if isinstance(canonical.get("doc"), dict) else {}
    workflow_agents = list_workflow_agents(workflow_doc)
    scope_guardrails_catalog = normalize_scope_guardrails_catalog(workflow_doc)

    paths["shard_root"].mkdir(parents=True, exist_ok=True)
    paths["shard_agents_path"].mkdir(parents=True, exist_ok=True)

    shard_entries = []
    write_set: set[pathlib.Path] = set()
    seen_ids: set[str] = set()
    changed_files = 0

    for index, raw_agent in enumerate(workflow_agents):
        agent = raw_agent if isinstance(raw_agent, dict) else {}
        agent_id = normalize_text(agent.get("id")) or f"agent-{index + 1}"
        if agent_id in seen_ids:
            raise RuntimeError(f"duplicate workflow agent id in canonical file: {agent_id}")
        seen_ids.add(agent_id)
        file_name = to_shard_file_name(agent_id, index)
        relative_file = normalize_path(pathlib.PurePosixPath("agents") / file_name)
        absolute_file = paths["shard_root"] / pathlib.PurePosixPath(relative_file)
        if write_json_if_changed(absolute_file, agent):
            changed_files += 1
        write_set.add(absolute_file.resolve())
        shard_entries.append({"id": agent_id, "file": relative_file, "order": index})

    existing_files = [entry.resolve() for entry in paths["shard_agents_path"].glob("*.json")]
    removed_files: list[str] = []
    for file_path in existing_files:
        if file_path in write_set:
            continue
        file_path.unlink(missing_ok=True)
        removed_files.append(normalize_path(file_path.relative_to(root)))

    index_payload = {
        "schema_version": 1,
        "generated_at": datetime.now(UTC).isoformat().replace("+00:00", "Z"),
        "source": canonical["source"],
        "version": normalize_text(workflow_doc.get("version")),
        "default_agent": normalize_text(workflow_doc.get("default_agent")),
        "project_scope": workflow_doc.get("project_scope") if isinstance(workflow_doc.get("project_scope"), dict) else {},
        "agent_access_control": workflow_doc.get("agent_access_control") if isinstance(workflow_doc.get("agent_access_control"), dict) else {},
        "update_log_system": workflow_doc.get("update_log_system") if isinstance(workflow_doc.get("update_log_system"), dict) else {},
        "runtime_model": workflow_doc.get("runtime_model") if isinstance(workflow_doc.get("runtime_model"), dict) else {},
        "scope_guardrails_catalog": scope_guardrails_catalog,
        "agents": shard_entries,
    }

    if write_json_if_changed(paths["shard_index_path"], index_payload):
        changed_files += 1

    return {
        "status": "pass",
        "root": normalize_path(root),
        "canonical": normalize_path(paths["canonical_path"].relative_to(root)),
        "shard_index": normalize_path(paths["shard_index_path"].relative_to(root)),
        "shard_agents_root": normalize_path(paths["shard_agents_path"].relative_to(root)),
        "total_agents": len(shard_entries),
        "changed_files": changed_files,
        "removed_files": removed_files,
    }


def ensure_shards_current(root: pathlib.Path, *, force: bool = False) -> dict[str, Any]:
    current = (not force) and is_shards_current(root)
    paths = get_paths(root)
    if current:
        index = read_json(paths["shard_index_path"], {}) or {}
        return {
            "status": "pass",
            "root": normalize_path(root),
            "canonical": normalize_path(paths["canonical_path"].relative_to(root)),
            "shard_index": normalize_path(paths["shard_index_path"].relative_to(root)),
            "shard_agents_root": normalize_path(paths["shard_agents_path"].relative_to(root)),
            "total_agents": len(index.get("agents") or []),
            "changed_files": 0,
            "removed_files": [],
            "current": True,
        }
    built = build_shards(root)
    return {**built, "current": False}


def load_workflow_from_shards(root: pathlib.Path, *, agent_ids: list[str] | None = None) -> dict[str, Any] | None:
    index = read_shard_index(root)
    if not isinstance(index, dict) or not isinstance(index.get("agents"), list):
        return None
    paths = get_paths(root)
    requested_ids = {normalize_text(item) for item in (agent_ids or []) if normalize_text(item)} or None
    agents: list[dict[str, Any]] = []
    scope_guardrails_catalog = normalize_scope_guardrails_catalog(index)

    for index_pos, entry in enumerate(index.get("agents") or []):
        row = entry if isinstance(entry, dict) else {}
        agent_id = normalize_text(row.get("id"))
        if not agent_id:
            continue
        if requested_ids and agent_id not in requested_ids:
            continue
        relative_file = normalize_text(row.get("file"))
        fallback_file = normalize_path(pathlib.PurePosixPath("agents") / to_shard_file_name(agent_id, index_pos))
        file_path = (paths["shard_root"] / pathlib.PurePosixPath(relative_file or fallback_file)).resolve()
        agent = read_json(file_path, None)
        if isinstance(agent, dict):
            hydrated = dict(agent)
            if not normalize_text(hydrated.get("scope_guardrails_ref")):
                hydrated["scope_guardrails_ref"] = DEFAULT_SCOPE_GUARDRAILS_REF
            hydrated["scope_guardrails"] = resolve_scope_guardrails(hydrated, scope_guardrails_catalog)
            agents.append(hydrated)

    return {
        "source": "shards",
        "doc": {
            "version": normalize_text(index.get("version")),
            "default_agent": normalize_text(index.get("default_agent")),
            "agents": agents,
            "agent_access_control": index.get("agent_access_control") if isinstance(index.get("agent_access_control"), dict) else {},
            "update_log_system": index.get("update_log_system") if isinstance(index.get("update_log_system"), dict) else {},
            "runtime_model": index.get("runtime_model") if isinstance(index.get("runtime_model"), dict) else {},
            "scope_guardrails_catalog": scope_guardrails_catalog,
            "project_scope": index.get("project_scope") if isinstance(index.get("project_scope"), dict) else {},
        },
        "agent_ids": [normalize_text(entry.get("id")) for entry in (index.get("agents") or []) if normalize_text(entry.get("id"))],
        "paths": {
            "canonical": paths["canonical_path"],
            "index": paths["shard_index_path"],
        },
    }


def load_workflow_from_canonical(root: pathlib.Path, *, agent_ids: list[str] | None = None) -> dict[str, Any]:
    canonical = read_canonical_doc(root)
    doc = canonical["doc"] if isinstance(canonical.get("doc"), dict) else {}
    all_agents = list_workflow_agents(doc)
    scope_guardrails_catalog = normalize_scope_guardrails_catalog(doc)
    requested_ids = {normalize_text(item) for item in (agent_ids or []) if normalize_text(item)} or None
    selected_agents = [agent for agent in all_agents if not requested_ids or normalize_text((agent or {}).get("id")) in requested_ids]
    agents: list[dict[str, Any]] = []
    for agent in selected_agents:
        hydrated = dict(agent) if isinstance(agent, dict) else {}
        if not normalize_text(hydrated.get("scope_guardrails_ref")):
            hydrated["scope_guardrails_ref"] = DEFAULT_SCOPE_GUARDRAILS_REF
        hydrated["scope_guardrails"] = resolve_scope_guardrails(hydrated, scope_guardrails_catalog)
        agents.append(hydrated)
    return {
        "source": "canonical",
        "doc": {
            "version": normalize_text(doc.get("version")),
            "default_agent": normalize_text(doc.get("default_agent")),
            "agents": agents,
            "agent_access_control": doc.get("agent_access_control") if isinstance(doc.get("agent_access_control"), dict) else {},
            "update_log_system": doc.get("update_log_system") if isinstance(doc.get("update_log_system"), dict) else {},
            "runtime_model": doc.get("runtime_model") if isinstance(doc.get("runtime_model"), dict) else {},
            "scope_guardrails_catalog": scope_guardrails_catalog,
            "project_scope": doc.get("project_scope") if isinstance(doc.get("project_scope"), dict) else {},
        },
        "agent_ids": [normalize_text((entry or {}).get("id")) for entry in all_agents if normalize_text((entry or {}).get("id"))],
        "paths": {
            "canonical": canonical["path"],
            "index": get_paths(root)["shard_index_path"],
        },
    }


def read_workflow_doc(
    root: pathlib.Path,
    *,
    prefer_shards: bool = True,
    ensure_current: bool = False,
    agent_ids: list[str] | None = None,
) -> dict[str, Any]:
    if prefer_shards:
        if ensure_current:
            ensure_shards_current(root)
        sharded = load_workflow_from_shards(root, agent_ids=agent_ids)
        if sharded:
            return sharded
    return load_workflow_from_canonical(root, agent_ids=agent_ids)
